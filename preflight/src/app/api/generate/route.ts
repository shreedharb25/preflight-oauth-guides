import Anthropic from "@anthropic-ai/sdk";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { librarySlug } from "@/data/aliases";
import { GUIDES } from "@/data/guides";
import { anthropicClient, anthropicKey } from "@/lib/ai";
import { slugify, toGuide } from "@/lib/generate/normalize";
import { SUBMIT_DETAILS_TOOL, SUBMIT_OVERVIEW_TOOL, sanitize, type GeneratedInput } from "@/lib/generate/schema";
import { DAILY_LIMITS, readGenerated, readJob, saveGenerated, saveJob, takeDailyQuota } from "@/lib/generate/store";

// Generation runs as three short requests so each stays well inside the host's ~30s function limit:
//   1. research: web search, then short research notes saved server-side (returns a job id)
//   2. overview: no web search; outcome, summary, use cases, requirements, sources, next step
//   3. details: no web search; steps, blockers, admin message, open questions; then the guide is saved
// Token levers: low effort, at most 2 searches, no full-page fetches, cached system prompt.
const MODEL = "claude-opus-5-5";
const EFFORT = "low";
const MAX_SEARCHES = 2;

let skill: string | undefined;
async function loadSkill() {
  skill ??= await fs.readFile(path.join(process.cwd(), "agent", "guide-writer", "SKILL.md"), "utf8");
  return skill;
}

type Usage = { input: number; output: number; cacheRead: number; cacheWrite: number; searches: number };
type Event =
  | { type: "start"; slug: string }
  | { type: "search"; query: string }
  | { type: "results"; count: number; domains: string[] }
  | { type: "researched"; job: string; usage: Usage }
  | { type: "overviewed"; job: string; usage: Usage }
  | { type: "writing"; part: "overview" | "details" }
  | { type: "done"; slug: string; cached: boolean; library?: boolean; usage?: Usage; dropped?: number }
  | { type: "no_oauth"; name: string; found: { label: string; url: string }[]; missing: string[]; nextStep: string; usage?: Usage }
  | { type: "error"; message: string };

const addUsage = (u: Usage, m: Anthropic.Beta.BetaMessage) => {
  u.input += m.usage.input_tokens;
  u.output += m.usage.output_tokens;
  u.cacheRead += m.usage.cache_read_input_tokens ?? 0;
  u.cacheWrite += m.usage.cache_creation_input_tokens ?? 0;
  u.searches += m.usage.server_tool_use?.web_search_requests ?? 0;
};
const emptyUsage = (): Usage => ({ input: 0, output: 0, cacheRead: 0, cacheWrite: 0, searches: 0 });

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { app?: string; job?: string; phase?: "overview" | "details"; usage?: Usage };
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (e: Event) => controller.enqueue(encoder.encode(JSON.stringify(e) + "\n"));
      try {
        if (body.job) await write(body.job, body.phase === "details" ? "details" : "overview", body.usage, send);
        else await research((body.app ?? "").trim().slice(0, 80), send);
      } catch (err) {
        const message =
          err instanceof Anthropic.AuthenticationError ? "The API key was rejected."
          : err instanceof Anthropic.RateLimitError ? "Rate limited. Wait a minute and try again."
          : err instanceof Anthropic.APIError ? `API error ${err.status}.`
          : "Something went wrong while researching.";
        console.error("[generate]", err);
        send({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}

async function research(name: string, send: (e: Event) => void) {
  const slug = librarySlug(name) ?? slugify(name);
  if (!slug) return send({ type: "error", message: "Enter an app name or website." });
  send({ type: "start", slug });

  // Free paths first: the library, then a guide generated earlier.
  if (GUIDES[slug]) return send({ type: "done", slug, cached: true, library: true });
  if (await readGenerated(slug)) return send({ type: "done", slug, cached: true });

  if (!anthropicKey()) return send({ type: "error", message: "Live research isn't switched on for this site yet." });
  if (!(await takeDailyQuota("generate")))
    return send({ type: "error", message: `Today's limit of ${DAILY_LIMITS.generate} new guides is reached. Guides already in the library still open instantly; try again tomorrow.` });

  const client = anthropicClient();
  const system = await loadSkill();
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    { role: "user", content: `Research step. Provider: ${name}\nSearch, then reply with research notes only, as the skill describes.` },
  ];
  const searchedUrls = new Set<string>();
  const shown = new Set<string>(); // the stream can surface the same block twice; show each once
  const usage = emptyUsage();
  let notes = "";

  for (let turn = 0; turn < 3; turn++) {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 8000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default", // a safety decline is retried on a fallback model instead of failing
      output_config: { effort: EFFORT },
      system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
      // Basic web search: the newer dynamic-filtering variant adds a hidden code-execution pass per search,
      // which pushed this step close to the host time limit.
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: MAX_SEARCHES }],
      messages,
    });
    stream.on("contentBlock", (block) => {
      const id = "id" in block ? block.id : "tool_use_id" in block ? `r-${block.tool_use_id}` : undefined;
      if (id) {
        if (shown.has(id)) return;
        shown.add(id);
      }
      if (block.type === "server_tool_use" && block.name === "web_search") {
        const query = (block.input as { query?: string }).query;
        if (query) send({ type: "search", query });
      } else if (block.type === "web_search_tool_result" && Array.isArray(block.content)) {
        block.content.forEach((r) => searchedUrls.add(r.url));
        const domains = [...new Set(block.content.map((r) => new URL(r.url).hostname.replace(/^www\./, "")))].slice(0, 4);
        send({ type: "results", count: block.content.length, domains });
      }
    });
    const msg = await stream.finalMessage();
    addUsage(usage, msg);
    if (msg.stop_reason === "refusal") return send({ type: "error", message: "The model declined to research this app." });
    if (msg.stop_reason === "pause_turn") {
      messages.push({ role: "assistant", content: msg.content });
      continue;
    }
    notes = msg.content.filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text").map((b) => b.text).join("\n").trim();
    break;
  }
  if (!notes) return send({ type: "error", message: "The agent didn't finish its research. Try again." });

  const job = randomUUID();
  await saveJob(job, { slug, name, notes, searchedUrls: [...searchedUrls], createdAt: Date.now() });
  console.log(`[generate] researched ${slug}`, usage);
  send({ type: "researched", job, usage });
}

async function write(jobId: string, part: "overview" | "details", prior: Usage | undefined, send: (e: Event) => void) {
  const job = await readJob(jobId);
  if (!job) return send({ type: "error", message: "That research session expired. Start again." });
  if (await readGenerated(job.slug)) return send({ type: "done", slug: job.slug, cached: true });
  if (!anthropicKey()) return send({ type: "error", message: "Live research isn't switched on for this site yet." });
  if (part === "details" && !job.overview) return send({ type: "error", message: "That research session is incomplete. Start again." });
  send({ type: "writing", part });

  const tool = part === "overview" ? SUBMIT_OVERVIEW_TOOL : SUBMIT_DETAILS_TOOL;
  const context =
    part === "overview"
      ? ""
      : `\n\nThe overview you already wrote (keep the same use-case ids and source ids):\n${JSON.stringify({ useCases: (job.overview!.useCases as { id: string; label: string }[] | undefined)?.map((u) => ({ id: u.id, label: u.label })), sources: job.overview!.sources, summary: job.overview!.summary })}`;
  const client = anthropicClient();
  const system = await loadSkill();
  const usage = { ...emptyUsage(), ...(prior ?? {}) };
  const msg = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 8000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: { effort: EFFORT },
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    tools: [tool],
    messages: [
      {
        role: "user",
        content: `${part === "overview" ? "Overview" : "Details"} step. Provider: ${job.name}\nURLs you may cite (from your searches):\n${job.searchedUrls.join("\n")}\n\nResearch notes:\n${job.notes}${context}\n\nCall ${tool.name} once now.`,
      },
    ],
  });
  addUsage(usage, msg);
  if (msg.stop_reason === "refusal") return send({ type: "error", message: "The model declined to write this guide." });
  const call = msg.content.find((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use" && b.name === tool.name);
  if (!call) return send({ type: "error", message: "The agent didn't finish the guide. Try again." });

  if (part === "overview") {
    const overview = call.input as Record<string, unknown>;
    const quick = sanitize(overview); // decides the no-docs outcome before spending a second call
    if (quick.outcome === "no_oauth_docs" || quick.useCases.length === 0) {
      const searched = new Set(job.searchedUrls);
      const nf = quick.notFound;
      return send({
        type: "no_oauth",
        name: quick.name || job.name,
        found: (nf?.found ?? []).filter((f) => searched.has(f.url)),
        missing: nf?.missing ?? ["OAuth authorization docs"],
        nextStep: nf?.nextStep ?? "Ask the provider's developer support whether they offer OAuth for third-party apps.",
        usage,
      });
    }
    await saveJob(jobId, { ...job, overview });
    return send({ type: "overviewed", job: jobId, usage });
  }

  const submitted: GeneratedInput = sanitize({ ...job.overview, ...(call.input as Record<string, unknown>) });
  console.log(`[generate] wrote ${job.slug}`, usage);
  const { guide, dropped } = toGuide(submitted, job.slug, new Set(job.searchedUrls));
  await saveGenerated(guide);
  send({ type: "done", slug: job.slug, cached: false, usage, dropped });
}
