"use client";

import Link from "next/link";
import { useState } from "react";
import { CARDS } from "@/data/cards";
import { GUIDES } from "@/data/guides";
import { ArrowRight, TopNav } from "./ui";

const EXAMPLES = [
  "My agent reads customer emails in Gmail and creates GitHub issues for the bugs it finds.",
  "My agent posts weekly reports to Slack and Notion.",
  "My agent syncs Shopify orders into Salesforce.",
  "My agent schedules LinkedIn and X posts for our brand.",
];

type Result = {
  apps: { slug: string; useCaseId: string; why: string }[];
  otherApps: { name: string; why: string }[];
  fastestPath: string;
  usage?: { input: number; output: number };
};

export default function Describe() {
  const [text, setText] = useState(EXAMPLES[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  async function find(description: string) {
    if (!description.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/describe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: description }) });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Something went wrong.");
      else setResult(data as Result);
    } catch {
      setError("Lost the connection to the server.");
    } finally {
      setLoading(false);
    }
  }

  const recs = (result?.apps ?? []).map((a) => {
    const guide = GUIDES[a.slug];
    const card = CARDS.find((c) => c.slug === a.slug)!;
    const uc = guide.useCases.find((u) => u.id === a.useCaseId) ?? guide.useCases[0];
    return { a, guide, card, uc, ttl: uc.wait ? `${uc.wait.num} ${uc.wait.unit}` : `${uc.effort.num} ${uc.effort.unit}` };
  });
  const cols = Math.min(Math.max(recs.length + (result?.otherApps.length ?? 0), 1), 3);

  return (
    <>
      <TopNav title="Describe what you're building" />

      <form onSubmit={(e) => { e.preventDefault(); find(text); }} className="frame" style={{ gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)" }}>
        <div className="tile tile--lg">
          <span className="label">plain words in, a plan out</span>
          <h1 className="h1">Describe what you&apos;re building.</h1>
          <p className="lead">Say what your agent does. You&apos;ll get the apps it needs, the permission level for each, how hard that is for your use case, and the fastest way to launch.</p>
        </div>
        <div className="tile tile--lg">
          <label htmlFor="desc" className="label">what does your agent do?</label>
          <textarea id="desc" rows={3} value={text} onChange={(e) => setText(e.target.value)}
            style={{ width: "100%", resize: "vertical", border: "1px solid var(--line-strong)", borderRadius: 4, background: "var(--bg)", padding: 16, fontSize: 20, lineHeight: 1.4 }} />
          <span className="label">or start from an example</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {EXAMPLES.slice(1).map((ex) => (
              <button key={ex} type="button" className="btn btn--sm" onClick={() => { setText(ex); find(ex); }}>{ex.replace("My agent ", "")}</button>
            ))}
          </div>
          <button type="submit" className="btn btn--primary" style={{ alignSelf: "flex-end" }} disabled={loading}>
            {loading ? <><span className="spin" aria-hidden="true" /> Working it out…</> : <>Find what I need <ArrowRight /></>}
          </button>
        </div>
      </form>

      {error && (
        <div className="frame"><div className="tile"><span className="h-sm" style={{ color: "var(--accent)" }}>Couldn&apos;t work that out</span><p className="small">{error}</p></div></div>
      )}

      {result && (
        <section aria-labelledby="res-h" style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 24 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <h2 id="res-h" style={{ margin: 0, fontSize: 40, fontWeight: 500, letterSpacing: "-0.035em" }}>For what you described, you need:</h2>
            {result.usage && <span className="tag">AI · {((result.usage.input + result.usage.output) / 1000).toFixed(1)}k tokens</span>}
          </div>

          {recs.length + result.otherApps.length === 0 ? (
            <div className="frame"><div className="tile tile--lg">
              <p className="body">We couldn&apos;t match that to any apps. Name the apps your agent connects to, or generate a guide for one that isn&apos;t in the library.</p>
              <Link href="/generate" className="btn" style={{ alignSelf: "flex-start" }}>Generate a guide <ArrowRight /></Link>
            </div></div>
          ) : (
            <div className="frame" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
              {recs.map(({ a, card, uc, ttl }) => {
                const hot = uc.difficulty === "hard" || uc.difficulty === "gated";
                return (
                  <Link key={a.slug} href={`/guides/${a.slug}?uc=${uc.id}`} className="card sub" style={{ gridRow: "span 6" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span className="mono-badge" aria-hidden="true">{card.mono}</span>
                      <span className="h3" style={{ flex: 1 }}>{card.name}</span>
                    </div>
                    <p className="small" style={{ margin: 0 }}>{a.why}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <span className="label">time to launch, for this use case</span>
                      <span className="huge" style={{ fontSize: 44 }}>{ttl}</span>
                    </div>
                    <dl className="specs">
                      <div><dt>permission</dt><dd>{uc.scope} ({uc.scopeClass})</dd></div>
                      <div><dt>difficulty here</dt><dd className={hot ? "hot" : undefined}>{hot ? "■ " : ""}{uc.difficulty}</dd></div>
                    </dl>
                    <dl className="specs specs--cont">
                      <div><dt>Composio-managed</dt><dd>{card.managed}</dd></div>
                      <div><dt>use case</dt><dd>{uc.label.toLowerCase()}</dd></div>
                    </dl>
                    <span className="divider-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      Open guide <span className="circle card__arrow" aria-hidden="true"><ArrowRight /></span>
                    </span>
                  </Link>
                );
              })}
              {result.otherApps.map((o) => (
                <Link key={o.name} href={`/generate?app=${encodeURIComponent(o.name)}`} className="card sub" style={{ gridRow: "span 6" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="mono-badge" aria-hidden="true" style={{ background: "transparent", color: "var(--text)", border: "1px dashed var(--line-dim)" }}>?</span>
                    <span className="h3" style={{ flex: 1 }}>{o.name}</span>
                  </div>
                  <p className="small" style={{ margin: 0 }}>{o.why}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <span className="label">not in the library yet</span>
                    <span className="h2">Generate a guide</span>
                  </div>
                  <span className="small">An agent researches it live and writes a guide in the same format.</span>
                  <span />
                  <span className="divider-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    Research it now <span className="circle card__arrow" aria-hidden="true"><ArrowRight /></span>
                  </span>
                </Link>
              ))}
            </div>
          )}

          {result.fastestPath && (
            <div className="frame">
              <div className="tile tile--lg tile--accent">
                <span className="label">fastest path</span>
                <p style={{ margin: 0, fontSize: 20, lineHeight: 1.5, fontWeight: 500 }}>{result.fastestPath}</p>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
}
