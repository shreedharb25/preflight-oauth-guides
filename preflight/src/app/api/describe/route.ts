import Anthropic from "@anthropic-ai/sdk";
import { GUIDES } from "@/data/guides";
import { anthropicClient, anthropicKey } from "@/lib/ai";
import { DAILY_LIMITS, takeDailyQuota } from "@/lib/generate/store";

// One small call, no web search: the model maps a plain-English description onto our library.
// The catalog is built from the guides themselves and kept stable so it can be cached.
const CATALOG = Object.values(GUIDES)
  .map((g) => `${g.slug} (${g.name}): ` + g.useCases.map((u) => `${u.id}="${u.label}" ${u.difficulty}, scope ${u.scope}`).join("; "))
  .join("\n");

const SYSTEM = `You help a developer work out which OAuth apps their AI agent needs.
Read their description and pick from this library, choosing the use case that matches what the agent does (read vs send/write vs sign-in):
${CATALOG}

Rules:
- Only use slugs and use-case ids from the library above. Apps they need that aren't in the library go in otherApps.
- "why" is one short sentence in plain words.
- fastestPath is 2 to 3 sentences: launch on Composio's managed apps where possible, start the slowest approval first, and name it.
- If the description names no apps or tasks you can map, return empty lists and say so in fastestPath.`;

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["apps", "otherApps", "fastestPath"],
  properties: {
    apps: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["slug", "useCaseId", "why"],
        properties: { slug: { type: "string" }, useCaseId: { type: "string" }, why: { type: "string" } },
      },
    },
    otherApps: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "why"],
        properties: { name: { type: "string" }, why: { type: "string" } },
      },
    },
    fastestPath: { type: "string" },
  },
};

export type DescribeResult = {
  apps: { slug: string; useCaseId: string; why: string }[];
  otherApps: { name: string; why: string }[];
  fastestPath: string;
};

export async function POST(req: Request) {
  const { text } = (await req.json().catch(() => ({}))) as { text?: string };
  const description = (text ?? "").trim().slice(0, 1000);
  if (!description) return Response.json({ error: "Describe what your agent does." }, { status: 400 });
  if (!anthropicKey()) return Response.json({ error: "AI matching isn't switched on for this site yet." }, { status: 503 });
  if (!(await takeDailyQuota("describe")))
    return Response.json({ error: `Today's limit of ${DAILY_LIMITS.describe} requests is reached. Try again tomorrow, or browse the guides directly.` }, { status: 429 });

  try {
    const client = anthropicClient();
    const msg = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 4000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: description }],
    });
    if (msg.stop_reason === "refusal") return Response.json({ error: "The model declined this description." }, { status: 422 });
    const textBlock = msg.content.find((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text");
    const parsed = JSON.parse(textBlock?.text ?? "{}") as DescribeResult;

    // Keep only picks that exist in the library, so every card links to a real guide and use case.
    const apps = (parsed.apps ?? []).filter((a) => GUIDES[a.slug]).map((a) => ({
      ...a,
      useCaseId: GUIDES[a.slug].useCases.some((u) => u.id === a.useCaseId) ? a.useCaseId : GUIDES[a.slug].defaultUc,
    }));
    const usage = { input: msg.usage.input_tokens + (msg.usage.cache_read_input_tokens ?? 0) + (msg.usage.cache_creation_input_tokens ?? 0), output: msg.usage.output_tokens };
    console.log("[describe]", usage);
    return Response.json({ apps, otherApps: parsed.otherApps ?? [], fastestPath: parsed.fastestPath ?? "", usage });
  } catch (err) {
    console.error("[describe]", err);
    const message = err instanceof Anthropic.APIError ? `API error ${err.status}.` : "Something went wrong.";
    return Response.json({ error: message }, { status: 502 });
  }
}
