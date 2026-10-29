"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, CopyIcon, TopNav } from "./ui";

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

type Step = { label: string; detail?: string; state: "done" | "active" };

// Rough cost from token counts (Claude Opus 5.5 per million tokens: $4 input, $5 cache write, $0.20 cache read,
// $20 output; web search $10 per thousand searches).
const cost = (u: Usage) => (u.input * 4 + (u.cacheWrite ?? 0) * 5 + u.cacheRead * 0.2 + u.output * 20) / 1e6 + u.searches * 0.01;

export default function Generate({ initialApp }: { initialApp: string }) {
  const router = useRouter();
  const [app, setApp] = useState(initialApp);
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);
  const [result, setResult] = useState<Event | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [copied, setCopied] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  function push(label: string, detail?: string) {
    setSteps((prev) => [...prev.map((s) => ({ ...s, state: "done" as const })), { label, detail, state: "active" }]);
  }

  async function generate(name: string) {
    if (!name.trim() || running) return;
    setRunning(true);
    setResult(null);
    setSeconds(0);
    setSteps([{ label: "Starting research", state: "active" }]);
    try {
      // Step 1 researches and returns a job id; step 2 writes the guide from the saved notes.
      const researched = await run({ app: name });
      const overviewed = researched && (await run({ job: researched.job, phase: "overview", usage: researched.usage }));
      if (overviewed) await run({ job: overviewed.job, phase: "details", usage: overviewed.usage });
    } catch {
      handle({ type: "error", message: "Lost the connection to the server." });
    } finally {
      setRunning(false);
      setSteps((prev) => prev.map((s) => ({ ...s, state: "done" })));
    }
  }

  type Handoff = Extract<Event, { type: "researched" | "overviewed" }>;
  async function run(payload: object): Promise<Handoff | undefined> {
    const res = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let next: Handoff | undefined;
    let ended = false;
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines.filter(Boolean)) {
        const e = JSON.parse(line) as Event;
        if (e.type === "researched" || e.type === "overviewed") next = e;
        if (e.type === "done" || e.type === "no_oauth" || e.type === "error" || e.type === "researched" || e.type === "overviewed") ended = true;
        handle(e);
      }
    }
    if (!ended) handle({ type: "error", message: "The server stopped before finishing. Try again." });
    return next;
  }

  function handle(e: Event) {
    if (e.type === "search") push("Searching", e.query);
    else if (e.type === "results") push(`Read ${e.count} results`, e.domains.join(" · "));
    else if (e.type === "researched") push("Research notes saved", `${e.usage.searches} searches done`);
    else if (e.type === "writing") push(e.part === "overview" ? "Writing the overview" : "Writing steps and blockers", e.part === "overview" ? "Use cases, effort, wait, cost and sources" : "Same format as the library, every claim labelled");
    else if (e.type === "overviewed") push("Overview done", "Now the step-by-step detail");
    else if (e.type === "done" || e.type === "no_oauth" || e.type === "error") {
      setResult(e);
      if (e.type === "done" && e.cached) router.push(`/guides/${e.slug}`);
    }
  }

  // Arriving from "Not in the library" with an app name starts the research straight away.
  useEffect(() => {
    if (initialApp && !started.current) {
      started.current = true;
      generate(initialApp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialApp]);

  const done = result?.type === "done" ? result : null;
  const noOauth = result?.type === "no_oauth" ? result : null;
  const error = result?.type === "error" ? result : null;
  const usage = done?.usage ?? noOauth?.usage;
  const email = noOauth
    ? `To: [${noOauth.name.toUpperCase()} DEVELOPER SUPPORT]\nSubject: OAuth support for third-party apps\n\nHi ${noOauth.name} team,\n\nWe're building an AI agent that would connect to our customers' ${noOauth.name} accounts, and couldn't find public OAuth documentation.\n\n1. Do you support OAuth 2.0 for third-party apps?\n2. If so, where are the docs, and which scopes are available?\n3. Is there a review or partner program before other companies can install our app?\n\nThanks,\n[YOUR NAME]`
    : "";

  return (
    <>
      <TopNav title="Generate a guide" />

      <form onSubmit={(e) => { e.preventDefault(); generate(app); }} className="frame frame--col">
        <div className="tile tile--lg" style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "flex-end", gap: 16 }}>
          <div style={{ flex: "1 1 480px", display: "flex", flexDirection: "column", gap: 12 }}>
            <h1 className="h1" style={{ marginBottom: 16 }}>Generate a guide for any app.</h1>
            <label htmlFor="gen-app" className="label">app name or website</label>
            <input id="gen-app" className="input" value={app} onChange={(e) => setApp(e.target.value)} placeholder="e.g. pipedrive.com"
              style={{ height: 72, fontSize: 32, fontFamily: "var(--sans)", letterSpacing: "-0.03em" }} />
          </div>
          <button type="submit" className="btn btn--primary" style={{ height: 72 }} disabled={!app.trim() || running}>
            {running ? "Researching…" : "Generate a guide"} <ArrowRight />
          </button>
        </div>
        {(running || steps.length > 0) && (
          <div className="tile" style={{ padding: "16px 32px", flexDirection: "row", justifyContent: "space-between" }}>
            <span className="label" style={{ color: "var(--muted)" }}>
              {running ? "researching live on the web" : result?.type === "error" ? "stopped" : "finished"}
            </span>
            <span className="label" style={{ color: "var(--muted)" }}>{seconds}s{running ? " · usually under a minute" : ""}</span>
          </div>
        )}
      </form>

      {steps.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 24, alignItems: "start" }}>
          <section aria-labelledby="steps-h" className="frame frame--col">
            <div className="tile tile--lg">
              <h2 id="steps-h" className="h2">What the agent is doing</h2>
              <ol aria-live="polite" className="rows">
                {steps.map((s, i) => {
                  const active = s.state === "active" && running;
                  return (
                    <li key={i} style={{ display: "grid", gridTemplateColumns: "24px minmax(0,1fr) auto", gap: 16, alignItems: "start" }}>
                      <span style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: active ? "transparent" : "var(--text)", border: active ? "1px solid var(--accent)" : 0, color: "var(--accent)" }}>
                        {active ? <span className="spin" aria-hidden="true" /> : <Check color="var(--bg)" />}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                        <span style={{ fontWeight: active ? 500 : 400 }}>{s.label}</span>
                        {s.detail && <span className="label" style={{ color: "var(--muted)", overflowWrap: "anywhere" }}>{s.detail}</span>}
                      </span>
                      <span className="label" style={{ color: active ? "var(--accent)" : "var(--dim)" }}>{active ? "working" : "done"}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

          <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {done && (
              <Link href={`/guides/${done.slug}`} className="card" style={{ background: "var(--accent)", color: "var(--bg)", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 20, fontWeight: 500 }}>{done.library ? "Already in the library" : done.cached ? "Generated earlier" : "Open your guide"}</span>
                  <span style={{ fontSize: 14, color: "var(--accent-ink)" }}>It has its own link, so you can share it now.</span>
                </span>
                <span className="circle" aria-hidden="true" style={{ background: "var(--accent-ink)", borderColor: "var(--accent-ink)" }}><ArrowRight color="var(--accent)" /></span>
              </Link>
            )}
            {error && (
              <div className="frame frame--col">
                <div className="tile" style={{ borderLeft: 0 }}>
                  <span className="h-sm" style={{ color: "var(--accent)" }}>Couldn&apos;t finish</span>
                  <p className="small">{error.message}</p>
                </div>
              </div>
            )}
            {usage && (
              <div className="frame frame--col">
                <div className="tile">
                  <span className="label">what this research used</span>
                  <span className="small">
                    {usage.searches} searches · {((usage.input + usage.cacheRead + (usage.cacheWrite ?? 0)) / 1000).toFixed(1)}k input + {(usage.output / 1000).toFixed(1)}k output tokens · about ${cost(usage).toFixed(2)}
                  </span>
                  {done && done.dropped ? <span className="small">{done.dropped} cited source{done.dropped > 1 ? "s" : ""} removed: not found in the agent&apos;s own search results.</span> : null}
                </div>
              </div>
            )}
            <div className="frame frame--col">
              <div className="tile">
                <span className="h-sm">What you&apos;ll get</span>
                <p className="small">A guide in the same format as the library: difficulty, effort, approval wait, steps, blockers and sources. Where evidence is thin, claims are marked uncertain rather than left out.</p>
              </div>
            </div>
          </aside>
        </div>
      )}

      {noOauth && (
        <section aria-labelledby="err-h" className="frame" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          <div className="tile tile--lg" style={{ gridColumn: "1 / -1" }}>
            <h2 id="err-h" className="h1">Couldn&apos;t find public OAuth docs for {noOauth.name}.</h2>
            <p className="lead" style={{ maxWidth: 820 }}>The agent stopped rather than guess. Without OAuth docs it can&apos;t write a guide you could plan around.</p>
          </div>
          <div className="tile">
            <h3 className="h-sm">What we found</h3>
            <ul className="rows">
              {noOauth.found.length ? noOauth.found.map((f) => (
                <li key={f.url}><a href={f.url} target="_blank" rel="noreferrer">{f.label}</a><br /><span className="label">{new URL(f.url).hostname}</span></li>
              )) : <li className="small">Nothing relevant.</li>}
            </ul>
          </div>
          <div className="tile">
            <h3 className="h-sm">What&apos;s missing</h3>
            <ul className="rows">{noOauth.missing.map((m) => <li key={m} className="small">{m}</li>)}</ul>
          </div>
          <div className="tile tile--accent">
            <span className="label">your next step</span>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5 }}>{noOauth.nextStep}</p>
          </div>
          <div className="tile tile--ink" style={{ gridColumn: "1 / -1" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="label">draft email to their developer support</span>
              <button type="button" className="btn btn--md" onClick={() => { navigator.clipboard.writeText(email).then(() => setCopied(true)).catch(() => {}); }}><CopyIcon /> {copied ? "Copied" : "Copy"}</button>
            </div>
            <pre className="code">{email}</pre>
          </div>
        </section>
      )}
    </>
  );
}
