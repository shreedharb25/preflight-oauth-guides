"use client";

import { useState } from "react";
import { agentPrompt, claimCounts, forUseCase, guideMarkdown } from "@/lib/guide";
import type { Confidence, Guide, IntegrationPath, Source } from "@/lib/types";
import { ArrowRight, Check, ConfBadge, CopyIcon, TopNav, WhoChip } from "./ui";

// Fixed right-hand column so chips and confidence labels line up across every row.
const META_COL = "180px";

export default function GuideView({ guide, initialUc }: { guide: Guide; initialUc: string }) {
  const [ucId, setUcId] = useState(guide.useCases.some((u) => u.id === initialUc) ? initialUc : guide.defaultUc);
  const [shareOpen, setShareOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [via, setVia] = useState<IntegrationPath>("composio");
  const [copyMsg, setCopyMsg] = useState("");
  const [done, setDone] = useState<Record<string, boolean>>({});

  const { uc, steps, requirements, blockers, agentSteps } = forUseCase(guide, ucId);
  const counts = claimCounts(guide);
  const path = `/guides/${guide.slug}?uc=${uc.id}`;
  // Only read inside the share popover and click handlers, which run in the browser.
  const shareUrl = () => `${window.location.origin}${path}`;
  const hot = uc.difficulty === "hard" || uc.difficulty === "gated";
  const prompt = agentPrompt(guide, uc.id, via);
  const promptSteps = steps.filter((s) => via === "composio" || s.via !== "composio");
  const promptHuman = promptSteps.filter((s) => s.who === "you").length;

  function pickUc(id: string) {
    setUcId(id);
    window.history.replaceState(null, "", `/guides/${guide.slug}?uc=${id}`);
  }

  async function copy(text: string, msg: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMsg(msg);
    } catch {
      setCopyMsg("Couldn't copy. Select the text and copy it manually.");
    }
  }

  return (
    <>
      <TopNav title={guide.name}>
        <span className="label">{path}</span>
        <span className="spacer" />
        <span className="tag">last checked {guide.checked}</span>
        <span className={guide.origin === "generated" ? "tag tag--dashed" : "tag"}>
          {guide.origin === "generated" ? "AI-generated" : "library guide"}
        </span>
        <div style={{ position: "relative" }}>
          <button type="button" className="btn btn--md btn--light" aria-expanded={shareOpen} onClick={() => { setShareOpen((o) => !o); setCopyMsg(""); }}>
            Share
          </button>
          {shareOpen && (
            <div className="frame" style={{ position: "absolute", right: 0, top: 48, width: 400, zIndex: 5, boxShadow: "0 24px 48px -16px rgba(0,0,0,0.8)" }}>
              <div className="tile">
                <span className="h-sm">Share this guide</span>
                <label htmlFor="share-url" className="label">link (keeps your use case)</label>
                <input id="share-url" className="input" readOnly value={shareUrl()} style={{ height: 40, fontSize: 12 }} onFocus={(e) => e.target.select()} />
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" className="btn btn--md btn--primary" style={{ flex: 1 }} onClick={() => copy(shareUrl(), "Link copied.")}>Copy link</button>
                  <button type="button" className="btn btn--md" style={{ flex: 1 }} onClick={() => copy(guideMarkdown(guide, uc.id, shareUrl()), "Markdown copied.")}>Copy as Markdown</button>
                </div>
                <span aria-live="polite" className="small">{copyMsg}</span>
              </div>
            </div>
          )}
        </div>
      </TopNav>

      {guide.origin === "generated" && (
        <div role="note" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px 24px", background: "var(--text)", color: "var(--bg)", padding: "16px 24px" }}>
          <p style={{ flex: "1 1 560px", margin: 0, fontSize: 14, lineHeight: 1.5 }}>
            <strong>AI-generated, not yet verified.</strong> An agent wrote this from public docs. Claims with thin evidence are marked uncertain: check those before you commit to a date.
          </p>
          <span className="tag" style={{ borderColor: "var(--bg)", color: "var(--bg)", borderStyle: "dashed" }}>AI-generated · not yet verified</span>
        </div>
      )}

      {/* Title */}
      <section className="frame" style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 4fr)" }}>
        <div aria-hidden="true" style={{ background: "linear-gradient(115deg, #262626 0%, #4E4E4E 24%, #1A1A1A 40%, #444444 58%, #171717 76%, #353535 100%)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
          <span className="mono-badge" style={{ width: 64, height: 64, fontSize: 20 }}>{guide.mono}</span>
        </div>
        <div className="tile tile--lg" style={{ justifyContent: "flex-end" }}>
          <span className="label">{guide.provider} · OAuth app guide</span>
          <h1 className="h1">{guide.title}</h1>
          <p className="lead" style={{ maxWidth: 820 }}>{guide.summary}</p>
        </div>
      </section>

      {/* Use case selector */}
      <section aria-labelledby="uc-h" className="frame frame--col">
        <div className="tile" style={{ display: "grid", gridTemplateColumns: "minmax(200px, auto) minmax(0, 1fr)", alignItems: "center", gap: "12px 16px" }}>
          <h2 id="uc-h" className="h-sm">{guide.useCases.length > 1 ? `What do you need from ${guide.name}?` : "Use case"}</h2>
          <div role="radiogroup" aria-labelledby="uc-h" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {guide.useCases.map((u) => (
              <button key={u.id} type="button" role="radio" aria-checked={u.id === uc.id} className="pill" onClick={() => pickUc(u.id)} style={{ height: 40, fontSize: 13 }}>
                {u.id === uc.id && <Check color="var(--accent)" />}
                {u.label}
              </button>
            ))}
          </div>
          <span className="label">permission</span>
          <span className="label" style={{ color: "var(--text)" }}>
            {uc.scope} <span className={uc.scopeClass === "restricted" ? "hot" : undefined} style={{ color: uc.scopeClass === "restricted" ? undefined : "var(--muted)" }}>· {uc.scopeClass}</span>
          </span>
        </div>
      </section>

      {/* At a glance */}
      <section aria-label="At a glance" className="frame" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
        <GlanceTile label="difficulty" note={uc.diffReason} claim={<Claim sources={guide.sources} conf={uc.diffConf} ids={uc.diffSources} />}>
          <span className={hot ? "hot" : undefined} style={{ fontSize: 40, fontWeight: 500, letterSpacing: "-0.035em", lineHeight: 1, textTransform: "capitalize" }}>{uc.difficulty}</span>
        </GlanceTile>
        <GlanceTile label="your effort" note={uc.effort.note} claim={<Claim sources={guide.sources} conf={uc.effort.conf} ids={uc.effort.sources} />}>
          <div className="num-row"><span className="huge" style={fit(uc.effort.num)}>{uc.effort.num}</span><span className="huge-unit">{uc.effort.unit}</span></div>
        </GlanceTile>
        {uc.wait ? (
          <GlanceTile label={`waiting on ${guide.provider}`} note={uc.wait.note} claim={<Claim sources={guide.sources} conf={uc.wait.conf} ids={uc.wait.sources} />}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="num-row"><span className="huge" style={fit(uc.wait.num)}>{uc.wait.num}</span><span className="huge-unit">{uc.wait.unit}</span></div>
              <div aria-hidden="true" className="wait-band" />
            </div>
          </GlanceTile>
        ) : (
          <GlanceTile label={`waiting on ${guide.provider}`} note={`${guide.provider} doesn't review apps for this use case.`}>
            <span className="huge">None</span>
          </GlanceTile>
        )}
        <GlanceTile label="cost" note={uc.cost.note} claim={<Claim sources={guide.sources} conf={uc.cost.conf} ids={uc.cost.sources} />}>
          <span style={{ fontSize: 32, fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1 }}>{uc.cost.value}</span>
        </GlanceTile>
        <GlanceTile label="your agent can do" note="Counted from the steps below for this use case.">
          <div className="num-row"><span className="huge">{agentSteps}</span><span className="huge-unit">of {steps.length} steps</span></div>
        </GlanceTile>
      </section>

      {/* Do you need your own app */}
      <section aria-labelledby="need-h" className="frame" style={{ gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)" }}>
        <div className="tile tile--lg">
          <h2 id="need-h" className="h2">Do you even need your own app?</h2>
          <span className="tag" style={{ alignSelf: "flex-start" }}>Composio-managed: {guide.managed}</span>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 500, letterSpacing: "-0.015em" }}>{guide.needOwnApp.answer}</p>
          <p className="body">{guide.needOwnApp.text}</p>
          <span style={{ marginTop: "auto" }}><Claim sources={guide.sources} conf="sourced" ids={guide.needOwnApp.sources} /></span>
        </div>
        <div className="tile tile--lg">
          <span className="label">switch to your own app when</span>
          <ul className="rows">
            {guide.needOwnApp.when.map((w) => (
              <li key={w} style={{ display: "grid", gridTemplateColumns: "24px minmax(0,1fr)", gap: 12, alignItems: "baseline" }}>
                <span className="label">→</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Timeline */}
      <section aria-labelledby="tl-h" className="frame frame--col">
        <div className="tile tile--lg" style={{ gap: 24 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            <h2 id="tl-h" className="h2">Timeline</h2>
            <div className="label" style={{ display: "flex", gap: 24, color: "var(--muted)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="solid-swatch" aria-hidden="true" />you and your agent</span>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="hatch-swatch" aria-hidden="true" />waiting on someone else</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "48px minmax(0,1fr) 48px", gap: 12, alignItems: "start" }}>
            <span className="label" style={{ lineHeight: "24px" }}>start</span>
            <div style={{ display: "flex", gap: 4 }}>
              {uc.timeline.map((p) => (
                <div key={p.label} style={{ flex: `${p.flex} 1 120px`, display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
                  <div aria-hidden="true" style={{ height: 24, background: p.wait ? "var(--hatch)" : "var(--text)" }} />
                  <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3 }}>{p.label}</span>
                  <span className="label">{p.dur}</span>
                </div>
              ))}
            </div>
            <span className="label" style={{ lineHeight: "24px", textAlign: "right" }}>live</span>
          </div>
          {uc.callout && (
            <p style={{ margin: 0, padding: "16px 20px", border: "1px solid var(--accent)", fontSize: 16, lineHeight: 1.5 }}>
              <strong style={{ color: "var(--accent)" }}>Start the approval now, while you build.</strong> {uc.callout}
            </p>
          )}
        </div>
      </section>

      {/* Requirements */}
      <section aria-labelledby="req-h" className="frame frame--col">
        <div className="tile tile--lg">
          <h2 id="req-h" className="h2">Before you start</h2>
          <p className="body">Have these ready so nothing surprises you halfway through.</p>
          <RowHeader cols={`28px minmax(0,1fr) 72px ${META_COL}`} labels={["", "what you need", "who", "confidence"]} />
          <ul className="rows">
            {requirements.map((r) => (
              <li key={r.id} style={{ display: "grid", gridTemplateColumns: `28px minmax(0,1fr) 72px ${META_COL}`, gap: 16, alignItems: "start" }}>
                <input type="checkbox" aria-label={r.label} checked={!!done[r.id]} onChange={() => setDone((d) => ({ ...d, [r.id]: !d[r.id] }))} style={{ width: 18, height: 18, accentColor: "var(--accent)", marginTop: 2 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontWeight: 500, textDecoration: done[r.id] ? "line-through" : "none" }}>{r.label}</span>
                  <span className="small">{r.note}</span>
                </div>
                <span><WhoChip who={r.who} /></span>
                <Claim sources={guide.sources} conf={r.conf} ids={r.sources} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Steps + agent panel */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 24, alignItems: "start" }}>
        <section aria-labelledby="steps-h" className="frame frame--col">
          <div className="tile tile--lg">
            <h2 id="steps-h" className="h2">Steps</h2>
            <RowHeader cols={`48px minmax(0,1fr) ${META_COL}`} labels={["", "step", "who · time · confidence"]} />
            <ol className="rows">
              {steps.map((s, i) => (
                <li key={s.id} style={{ display: "grid", gridTemplateColumns: `48px minmax(0,1fr) ${META_COL}`, gap: 16, alignItems: "start" }}>
                  <span className="label" style={{ fontSize: 14, lineHeight: "24px" }}>{String(i + 1).padStart(2, "0")} /</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
                    <h3 className="h3" style={{ lineHeight: "24px" }}>{s.title}</h3>
                    <p className="small" style={{ fontSize: 15 }}>{s.desc}</p>
                    {s.who === "you" && s.why && <span className="label" style={{ color: "var(--muted)" }}>why you: {s.why}</span>}
                    {s.details && (
                      <details>
                        <summary className="label" style={{ cursor: "pointer" }}>more detail</summary>
                        <p className="small" style={{ marginTop: 8 }}>{s.details}</p>
                      </details>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <WhoChip who={s.who} />
                      {s.time && <span className="tag">{s.time}</span>}
                    </div>
                    <Claim sources={guide.sources} conf={s.conf} ids={s.sources} />
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <aside aria-labelledby="agent-h" className="frame frame--col" style={{ position: "sticky", top: 24 }}>
          <div className="tile tile--lg">
            <span className="label">agent-friendly?</span>
            <h2 id="agent-h" className="h2">{guide.agent.verdict}</h2>
            <p className="body">{guide.agent.tagline}</p>
            <div className="num-row"><span className="huge">{agentSteps}</span><span className="huge-unit">of {steps.length} steps</span></div>
            <button type="button" className="btn btn--primary" onClick={() => { setPromptOpen(true); setCopyMsg(""); }}>
              Generate a prompt for my agent <ArrowRight />
            </button>
            <span className="small">Our agent checked what it could reach without logging in. See &ldquo;What our agent tried&rdquo; below.</span>
          </div>
        </aside>
      </div>

      {/* Blockers */}
      <section aria-labelledby="bl-h" className="frame frame--col">
        <div className="tile tile--lg">
          <h2 id="bl-h" className="h2">Common blockers and fixes</h2>
          <RowHeader cols={`minmax(0,5fr) minmax(0,6fr) ${META_COL}`} labels={["what happens", "what to do", "how often · confidence"]} gap={24} />
          <ul className="rows">
            {blockers.map((b) => (
              <li key={b.title} style={{ display: "grid", gridTemplateColumns: `minmax(0,5fr) minmax(0,6fr) ${META_COL}`, gap: 24, alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <h3 className="h3">{b.title}</h3>
                  <span className="small">{b.why}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{ lineHeight: 1.5 }}>{b.next}</span>
                  {b.adds && <span className="label">adds {b.adds}</span>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
                  {b.freq && <span className={b.freq === "common" ? "tag tag--hot" : "tag"}>{b.freq}</span>}
                  <Claim sources={guide.sources} conf={b.conf} ids={b.sources} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Ask your customer's admin */}
      {guide.adminAsk && (
        <section className="frame" style={{ gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)" }}>
          <div className="tile tile--lg">
            <span className="label">outside your control</span>
            <h2 className="h2">{guide.adminAsk.title}</h2>
            <p className="body">Some approvals sit with your customer, not you. Send this as soon as a customer signs up.</p>
            <span style={{ marginTop: "auto" }}><Claim sources={guide.sources} conf={guide.adminAsk.sources.length ? "sourced" : "uncertain"} ids={guide.adminAsk.sources} /></span>
          </div>
          <div className="tile tile--ink">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="label">draft message</span>
              <button type="button" className="btn btn--md" onClick={() => copy(guide.adminAsk!.text, "Message copied.")}><CopyIcon /> Copy</button>
            </div>
            <pre className="code">{guide.adminAsk.text}</pre>
            <span aria-live="polite" className="small">{copyMsg === "Message copied." ? copyMsg : ""}</span>
          </div>
        </section>
      )}

      {/* Trade-offs */}
      <section aria-labelledby="tr-h" className="frame frame--col">
        <div className="tile tile--lg">
          <h2 id="tr-h" className="h2">Composio-managed app vs your own</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15, tableLayout: "fixed" }}>
            <colgroup><col style={{ width: "22%" }} /><col style={{ width: "39%" }} /><col style={{ width: "39%" }} /></colgroup>
            <thead>
              <tr className="label" style={{ textAlign: "left" }}>
                <th style={{ padding: "8px 0", fontWeight: 400 }} />
                <th style={{ padding: "8px 16px 8px 0", fontWeight: 400 }}>Composio-managed</th>
                <th style={{ padding: "8px 0", fontWeight: 400 }}>your own app</th>
              </tr>
            </thead>
            <tbody>
              {guide.tradeoffs.map((t) => (
                <tr key={t.k} style={{ borderTop: "1px solid var(--line)", verticalAlign: "top" }}>
                  <td className="label" style={{ padding: "16px 16px 16px 0" }}>{t.k}</td>
                  <td style={{ padding: "16px 16px 16px 0" }}>{t.managed}</td>
                  <td style={{ padding: "16px 0" }}>{t.own}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sources and confidence */}
      <section id="sources" aria-labelledby="src-h" className="frame" style={{ gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)" }}>
        <div className="tile tile--lg" style={{ gridColumn: "1 / -1", flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
          <h2 id="src-h" className="h2" style={{ flex: "1 1 300px" }}>Sources and confidence</h2>
          <span className="label" style={{ color: "var(--muted)" }}>
            {counts.total} claims: {counts.tested} tested · {counts.sourced} sourced · {counts.uncertain} uncertain
          </span>
        </div>
        <div className="tile tile--lg">
          <h3 className="h3">Sources</h3>
          <ol className="rows">
            {guide.sources.map((s, i) => (
              <li key={s.id} id={`src-${i + 1}`} style={{ display: "grid", gridTemplateColumns: "40px minmax(0,1fr) 140px", gap: 12, alignItems: "start", scrollMarginTop: 24 }}>
                <span className="label" style={{ lineHeight: "24px" }}>[{i + 1}]</span>
                <a href={s.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none", minWidth: 0 }}>
                  <span style={{ display: "block", lineHeight: "24px" }}>{s.title}</span>
                  <span className="label" style={{ wordBreak: "break-all" }}>{new URL(s.url).hostname}</span>
                </a>
                <span className={s.type === "official docs" || s.type === "tested by our agent" ? "tag" : "tag tag--dashed"} style={{ justifySelf: "end" }}>{s.type === "community" ? "developer report" : s.type}</span>
              </li>
            ))}
          </ol>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <div className="tile tile--lg">
            <h3 className="h3">What we&apos;re not sure about</h3>
            <ul className="rows">
              {guide.uncertain.map((u) => (
                <li key={u.text} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontWeight: 500 }}>{u.text}</span>
                  <span className="small">{u.why}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="tile tile--lg" style={{ flex: 1 }}>
            <h3 className="h3">What our agent tried</h3>
            {guide.tested.length === 0 ? (
              <p className="small">Nothing yet. No step in this guide has been run by our agent, so nothing is marked tested.</p>
            ) : (
              <ul className="rows">
                {guide.tested.map((t) => (
                  <li key={t.tried} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span className="label">{t.date}</span>
                    <span>{t.url ? <a href={t.url} target="_blank" rel="noreferrer">{t.tried}</a> : t.tried}</span>
                    <span className="small" style={{ color: t.ok ? "var(--text)" : "var(--accent)" }}>{t.ok ? "✓ " : "■ "}{t.result}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Next step */}
      <a href={guide.next.href} target="_blank" rel="noreferrer" className="card" style={{ background: "var(--accent)", color: "var(--bg)", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 32 }}>
        <span style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="label" style={{ color: "var(--accent-ink)" }}>your next step</span>
          <span style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.025em" }}>{guide.next.label}</span>
          <span style={{ fontSize: 14, color: "var(--accent-ink)" }}>{guide.next.sub}</span>
        </span>
        <span className="circle" aria-hidden="true" style={{ width: 56, height: 56, background: "var(--accent-ink)", borderColor: "var(--accent-ink)" }}>
          <ArrowRight color="var(--accent)" />
        </span>
      </a>

      {promptOpen && (
        <div role="presentation" onClick={() => setPromptOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(10,10,10,0.78)", zIndex: 20, display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: 48, overflowY: "auto" }}>
          <div role="dialog" aria-modal="true" aria-labelledby="pm-title" className="frame frame--col" onClick={(e) => e.stopPropagation()} style={{ width: "min(880px, calc(100% - 64px))", boxShadow: "0 48px 96px -24px rgba(0,0,0,0.9)", marginBottom: 48 }}>
            <div className="tile tile--lg" style={{ flexDirection: "row", alignItems: "flex-start", gap: 24 }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                <h2 id="pm-title" className="h2">A prompt for your agent</h2>
                <p className="body">
                  Paste this into your coding agent (Claude Code, Cursor, Codex…). It does what an agent can, then stops and hands over at the {promptHuman} steps that need you.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span className="tag">app: {guide.slug}</span>
                  <span className="tag">use case: {uc.label.toLowerCase()}</span>
                  <span className={uc.scopeClass === "restricted" ? "tag tag--hot" : "tag"}>scope: {uc.scopeClass}</span>
                </div>
              </div>
              <button type="button" aria-label="Close" className="circle" onClick={() => setPromptOpen(false)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <div className="tile" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 8 }}>
              <span id="via-label" className="label" style={{ gridColumn: "1 / -1" }}>how will you connect to {guide.name}?</span>
              {([
                ["composio", "Through Composio", "Composio runs the OAuth flow and stores tokens. You add your app's credentials as a custom auth config."],
                ["direct", "Directly in your code", "Your backend runs the OAuth flow and stores and refreshes tokens itself."],
              ] as [IntegrationPath, string, string][]).map(([id, title, desc]) => (
                <button key={id} type="button" role="radio" aria-checked={via === id} onClick={() => setVia(id)}
                  style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 6, padding: 16, borderRadius: 4, cursor: "pointer", background: via === id ? "rgba(244, 87, 44, 0.08)" : "transparent", border: `1px solid ${via === id ? "var(--accent)" : "var(--line-strong)"}` }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 500, color: via === id ? "var(--accent)" : "var(--text)" }}>
                    {via === id && <Check color="var(--accent)" />}{title}
                  </span>
                  <span className="small">{desc}</span>
                </button>
              ))}
            </div>
            <div className="tile tile--ink" style={{ maxHeight: 400, overflow: "auto" }}>
              <pre className="code">{prompt}</pre>
            </div>
            <div className="tile" style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: "12px 16px" }}>
              <span className="small" style={{ flex: "1 1 260px" }}>Built from this guide&apos;s steps. Fill in the [BRACKETED] values first.</span>
              <span aria-live="polite" className="small">{copyMsg === "Prompt copied." ? copyMsg : ""}</span>
              <button type="button" className="btn" onClick={() => setPromptOpen(false)}>Back to guide</button>
              <button type="button" className="btn btn--primary" onClick={() => copy(prompt, "Prompt copied.")}><CopyIcon size={16} /> Copy prompt</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function srcIndex(sources: Source[], id: string) {
  return sources.findIndex((s) => s.id === id) + 1;
}

function Claim({ conf, ids, sources }: { conf: Confidence; ids?: string[]; sources: Source[] }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
      <ConfBadge conf={conf} />
      {ids && ids.length > 0 && (
        <span className="label" style={{ display: "inline-flex", gap: 4 }}>
          {[...ids].sort((a, b) => srcIndex(sources, a) - srcIndex(sources, b)).map((id) => (
            <a key={id} href={`#src-${srcIndex(sources, id)}`} title={sources.find((s) => s.id === id)?.title} style={{ color: "var(--muted)" }}>[{srcIndex(sources, id)}]</a>
          ))}
        </span>
      )}
    </span>
  );
}

function GlanceTile({ label, note, claim, children }: { label: string; note: string; claim?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="tile sub" style={{ gridRow: "span 4" }}>
      <span className="label">{label}</span>
      {children}
      <span className="small">{note}</span>
      <span>{claim}</span>
    </div>
  );
}

function RowHeader({ cols, labels, gap = 16 }: { cols: string; labels: string[]; gap?: number }) {
  return (
    <div aria-hidden="true" className="label" style={{ display: "grid", gridTemplateColumns: cols, gap, paddingTop: 8 }}>
      {labels.map((l, i) => <span key={i}>{l}</span>)}
    </div>
  );
}

// Keep long words ("Unknown", "Minutes") inside the narrow at-a-glance tiles.
function fit(text: string): React.CSSProperties | undefined {
  return text.length > 5 ? { fontSize: 40 } : undefined;
}
