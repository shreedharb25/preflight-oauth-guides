"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { aliasesFor, librarySlug } from "@/data/aliases";
import { CARDS, FILTER_GROUPS } from "@/data/cards";
import type { AppCard } from "@/lib/types";
import { ArrowRight, Check } from "./ui";

type Filters = Partial<Record<keyof AppCard["filters"], string[]>>;
type Sort = "fastest" | "hardest" | "az";

const HARD_RANK: Record<string, number> = { easy: 1, medium: 2, hard: 3, gated: 4 };

function hardest(card: AppCard) {
  return Math.max(...card.filters.difficulty.map((d) => HARD_RANK[d]));
}

export default function Landing() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [sort, setSort] = useState<Sort>("fastest");
  const [genName, setGenName] = useState("");

  const q = query.trim().toLowerCase();
  const hasFilters = Object.values(filters).some((v) => v && v.length > 0);

  const apps = useMemo(() => {
    const list = CARDS.filter((c) => {
      if (q && librarySlug(q) !== c.slug && !c.name.toLowerCase().includes(q) && !c.category.toLowerCase().includes(q) && !aliasesFor(c.slug).some((a) => a.length > 2 && a.includes(q))) return false;
      for (const [k, v] of Object.entries(filters)) {
        if (v && v.length && !v.some((opt) => (c.filters[k as keyof AppCard["filters"]] as string[]).includes(opt))) return false;
      }
      return true;
    });
    if (sort === "fastest") list.sort((a, b) => a.rank - b.rank);
    if (sort === "hardest") list.sort((a, b) => hardest(b) - hardest(a) || b.rank - a.rank);
    if (sort === "az") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [q, filters, sort]);

  function toggle(key: keyof AppCard["filters"], opt: string) {
    setFilters((f) => {
      const cur = f[key] ?? [];
      return { ...f, [key]: cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt] };
    });
  }

  function generate(name: string) {
    const n = name.trim();
    router.push(n ? `/generate?app=${encodeURIComponent(n)}` : "/generate");
  }

  const showStartHere = !q && !hasFilters;
  const gridTitle = q ? `Results for “${query.trim()}”` : hasFilters ? "Filtered apps" : "All apps";

  return (
    <>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "24px 48px", paddingTop: 16, paddingBottom: 8 }}>
        <Link href="/" className="wordmark wordmark--xl">
          Preflight<span>.</span>
        </Link>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 560, flex: "1 1 400px" }}>
          <p style={{ margin: 0, fontSize: 20, letterSpacing: "-0.01em", lineHeight: 1.35 }}>
            Know what it takes to get your OAuth app approved, before you start building.
          </p>
          <p className="small">Difficulty, timeline, requirements and blockers for each provider. Every claim marked tested, sourced or uncertain.</p>
        </div>
      </header>

      <div className="frame">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            document.getElementById("grid")?.scrollIntoView({ behavior: "smooth" });
          }}
          style={{ display: "flex", alignItems: "center", gap: 16, background: "var(--surface)", padding: "8px 8px 8px 24px" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A3A3A3" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4.2-4.2" />
          </svg>
          <label htmlFor="app-search" className="sr-only">Search an app</label>
          <input
            id="app-search"
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search an app: Gmail, Shopify, Slack…"
            style={{ flex: 1, minWidth: 0, height: 64, border: 0, background: "transparent", fontSize: 28, letterSpacing: "-0.02em", outline: "none", padding: 0 }}
          />
          <button type="submit" className="btn btn--primary" style={{ height: 56, padding: "0 24px" }}>
            Search <ArrowRight />
          </button>
        </form>
      </div>

      <div className="frame" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(520px, 100%), 1fr))" }}>
        <Link href="/describe" className="card" style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <span aria-hidden="true" className="circle" style={{ width: 48, height: 48, borderRadius: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M4 6h16M4 11h16M4 16h9" /></svg>
          </span>
          <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="h3">Describe what you&apos;re building</span>
            <span className="small">Get the apps, permission levels and fastest path for your use case.</span>
          </span>
          <span className="circle card__arrow" aria-hidden="true"><ArrowRight /></span>
        </Link>
        <Link href="/generate" className="card" style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          <span aria-hidden="true" className="circle" style={{ width: 48, height: 48, borderRadius: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4.2-4.2M8 11h6M11 8v6" /></svg>
          </span>
          <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
            <span className="h3">Can&apos;t find your app? Generate a guide</span>
            <span className="small">Enter an app name or website. An agent researches it live, in about a minute.</span>
          </span>
          <span className="circle card__arrow" aria-hidden="true"><ArrowRight /></span>
        </Link>
      </div>

      <section aria-label="Filters and sort" className="frame frame--col">
        <div className="tile" style={{ gap: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(400px, 100%), 1fr))", gap: "24px 32px" }}>
            {FILTER_GROUPS.map((g) => (
              <div key={g.key} role="group" aria-label={g.label.replace(":", "")} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span className="label">{g.label}</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {g.opts.map((o) => {
                    const active = (filters[g.key] ?? []).includes(o);
                    return (
                      <button key={o} type="button" className="pill" aria-pressed={active} onClick={() => toggle(g.key, o)}>
                        {active && <Check color="var(--accent)" />}
                        {o}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="label divider-top" style={{ display: "flex", flexWrap: "wrap", gap: "8px 32px" }}>
            <span>gated: you apply to a partner program, and can be rejected</span>
            <span>Composio-managed: an approved OAuth app already exists, so you can start without your own</span>
          </div>
        </div>
        <div className="tile" style={{ padding: "16px 24px", flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: "8px 16px" }}>
          <span id="sort-label" className="label">sort:</span>
          <div role="group" aria-labelledby="sort-label" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {([["fastest", "fastest to launch"], ["hardest", "hardest first"], ["az", "A–Z"]] as [Sort, string][]).map(([id, label]) => (
              <button key={id} type="button" className="pill" aria-pressed={sort === id} onClick={() => setSort(id)}>
                {sort === id && <Check color="var(--accent)" />}
                {label}
              </button>
            ))}
          </div>
          <span className="spacer" />
          <span aria-live="polite" className="label" style={{ color: "var(--muted)" }}>
            {hasFilters || q ? `${apps.length} of ${CARDS.length} apps` : `${CARDS.length} apps`}
          </span>
          {hasFilters && (
            <button type="button" className="btn btn--sm" onClick={() => setFilters({})}>
              Clear filters
            </button>
          )}
        </div>
      </section>

      <section id="grid" aria-label="Apps" style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 24 }}>
        <h2 className="h2">{gridTitle}</h2>

        {apps.length > 0 && (
          <div className="frame" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))" }}>
            {showStartHere && <StartHereCard />}
            {apps.map((a) => (
              <AppCardView key={a.slug} card={a} />
            ))}
            <GenerateCard />
          </div>
        )}

        {apps.length === 0 && q && (
          <div className="frame" style={{ gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)" }}>
            <div className="tile" style={{ padding: 48, gap: 24 }}>
              <span className="label">results: 0 for “{query.trim()}”</span>
              <h3 style={{ margin: 0, fontSize: 64, fontWeight: 500, letterSpacing: "-0.045em", lineHeight: 1 }}>
                Not in the library yet<span style={{ color: "var(--accent)" }}>.</span>
              </h3>
              <p className="lead" style={{ maxWidth: 600 }}>
                We don&apos;t have a guide for {query.trim()} yet. An agent can research it now and write one in the same format. You&apos;ll get a link you can share straight away.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  generate(genName || query);
                }}
                style={{ display: "flex", gap: 8, marginTop: 24, maxWidth: 640 }}
              >
                <label htmlFor="gen-input" className="sr-only">App name or website</label>
                <input id="gen-input" className="input" style={{ flex: 1, height: 56, fontSize: 16 }} defaultValue={query.trim()} onChange={(e) => setGenName(e.target.value)} />
                <button type="submit" className="btn btn--primary" style={{ height: 56 }}>
                  Generate a guide <ArrowRight />
                </button>
              </form>
            </div>
            <div className="tile tile--lg">
              <span className="label">what the agent will check</span>
              <ol className="rows">
                {["Where the developer portal is", "How OAuth works and which scopes exist", "Whether the provider reviews apps, and for how long", "Blockers other developers have reported"].map((t, i) => (
                  <li key={t} style={{ display: "flex", gap: 16 }}>
                    <span className="label" style={{ lineHeight: "24px" }}>0{i + 1}</span>
                    {t}
                  </li>
                ))}
              </ol>
              <button type="button" className="btn" style={{ alignSelf: "flex-start", marginTop: "auto" }} onClick={() => setQuery("")}>
                Clear search and browse all apps
              </button>
            </div>
          </div>
        )}

        {apps.length === 0 && !q && (
          <div className="frame">
            <div className="tile" style={{ padding: 48, flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 40, fontWeight: 500, letterSpacing: "-0.035em" }}>No apps match these filters.</h3>
                <p className="body">Remove a filter, or generate a guide for the app you have in mind.</p>
              </div>
              <button type="button" className="btn btn--primary" onClick={() => setFilters({})}>
                Clear filters
              </button>
            </div>
          </div>
        )}
      </section>

      <footer className="frame" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", marginTop: 24 }}>
        <div className="tile sub" style={{ gridRow: "span 2" }}>
          <span className="conf conf--tested" style={{ alignSelf: "flex-start" }}><span className="dot" />tested</span>
          <span className="small">Our agent ran this step itself and recorded what happened.</span>
        </div>
        <div className="tile sub" style={{ gridRow: "span 2" }}>
          <span className="conf conf--sourced" style={{ alignSelf: "flex-start" }}><span className="dot" />sourced</span>
          <span className="small">Taken from official docs or a named third party, linked in each guide.</span>
        </div>
        <div className="tile sub" style={{ gridRow: "span 2" }}>
          <span className="conf conf--uncertain" style={{ alignSelf: "flex-start" }}><span className="dot" />uncertain</span>
          <span className="small">Our estimate, or evidence that is thin or conflicting. Shown anyway, so you can check.</span>
        </div>
        <div className="tile sub" style={{ gridRow: "span 2" }}>
          <span aria-hidden="true" style={{ width: 64, height: 26, borderRadius: 2, background: "var(--hatch)" }} />
          <span className="small">Hatched means waiting on the provider: time outside your control.</span>
        </div>
        <Link href="/difficulty" className="card sub" style={{ gridRow: "span 2", rowGap: 16 }}>
          <span className="h-sm" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            How we rate difficulty <ArrowRight />
          </span>
          <span className="small">Easy, medium, hard and gated, and what moves an app between them.</span>
        </Link>
      </footer>
    </>
  );
}

function StartHereCard() {
  const ink = { color: "var(--accent-ink)" };
  return (
    <Link href="/start-here" className="card sub" style={{ gridRow: "span 6", background: "var(--accent)", color: "var(--bg)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span aria-hidden="true" className="mono-badge" style={{ background: "var(--accent-ink)", color: "var(--accent)" }}>C</span>
        <span className="h3" style={{ flex: 1, minWidth: 0 }}>Composio <span className="label" style={ink}>· start here</span></span>
        <span className="circle circle--sm" aria-hidden="true" style={{ borderColor: "var(--accent-ink)", background: "var(--accent-ink)" }}>
          <ArrowRight size={14} color="var(--accent)" />
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="label" style={ink}>time to launch</span>
        <div className="num-row">
          <span className="huge">~5</span>
          <span style={{ fontSize: 16, ...ink }}>min</span>
        </div>
        <span style={{ fontSize: 13, lineHeight: 1.5, ...ink }}>No registration, no review</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div aria-hidden="true" className="bar" style={{ background: "rgba(43, 19, 8, 0.25)" }}>
          <div style={{ width: "3%", minWidth: 8, background: "var(--bg)" }} />
        </div>
        <div className="label" style={{ display: "flex", justifyContent: "space-between", gap: 8, ...ink }}>
          <span>effort: ~5 min</span>
          <span>wait: none</span>
        </div>
      </div>
      <dl className="specs" style={{ borderTopColor: "var(--accent-ink)" }}>
        <div><dt style={ink}>difficulty</dt><dd style={{ color: "var(--bg)" }}>easy</dd></div>
        <div><dt style={ink}>approval</dt><dd style={{ color: "var(--bg)" }}>none</dd></div>
      </dl>
      <dl className="specs specs--cont">
        <div><dt style={ink}>Composio-managed</dt><dd style={{ color: "var(--bg)" }}>124 providers</dd></div>
        <div><dt style={ink}>your agent can do</dt><dd style={{ color: "var(--bg)" }}>most steps</dd></div>
      </dl>
      <p style={{ margin: 0, paddingTop: 16, borderTop: "1px solid var(--accent-ink)", fontSize: 14, lineHeight: 1.5, ...ink }}>
        <strong style={{ color: "var(--bg)", fontWeight: 600 }}>Prototyping? Skip all of this.</strong> Connect users today through Composio&apos;s approved apps, and register your own when you go to production.
      </p>
    </Link>
  );
}

function GenerateCard() {
  return (
    <Link href="/generate" className="card" style={{ gridRow: "span 6", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="label" style={{ flex: 1 }}>not in the library?</span>
          <span className="circle circle--sm card__arrow" aria-hidden="true"><ArrowRight size={14} /></span>
        </div>
        <span style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.025em", lineHeight: 1.1 }}>Generate a guide for any app.</span>
        <span className="small">An agent reads the provider&apos;s docs and developer forums, then writes a guide in this same format. Thin evidence is marked uncertain.</span>
      </div>
      <span className="input" style={{ display: "flex", alignItems: "center", color: "var(--placeholder)" }}>app name or website</span>
    </Link>
  );
}

function AppCardView({ card }: { card: AppCard }) {
  const hot = card.filters.difficulty.some((d) => d === "hard" || d === "gated");
  const href = `/guides/${card.slug}`;
  const spec = (k: string, v: string, isHot = false) => (
    <div style={{ minWidth: 0 }}>
      <dt>{k}</dt>
      <dd className={isHot ? "hot" : undefined}>{isHot ? "■ " : ""}{v}</dd>
    </div>
  );
  return (
    <Link href={href} className="card sub" style={{ gridRow: "span 6" }} aria-label={`${card.name}, time to launch ${card.ttlNum} ${card.ttlUnit}, difficulty ${card.difficultyLabel}`}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span aria-hidden="true" className="mono-badge">{card.mono}</span>
        <span className="h3" style={{ flex: 1, minWidth: 0 }}>{card.name}</span>
        <span className="circle circle--sm card__arrow" aria-hidden="true"><ArrowRight size={14} /></span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="label">time to launch</span>
        <div className="num-row">
          <span className="huge">{card.ttlNum}</span>
          <span className="huge-unit">{card.ttlUnit}</span>
        </div>
        <span className="small" style={{ fontSize: 13 }}>{card.ttlNote}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div aria-hidden="true" className="bar">
          <div style={{ display: "flex", height: "100%", minWidth: 8, width: `${card.bar.total}%` }}>
            <div className="bar__solid" style={{ width: `${card.bar.solid}%` }} />
            <div className="bar__wait" style={{ flex: 1 }} />
          </div>
        </div>
        <div className="label" style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <span>effort: {card.effort}</span>
          <span>wait: {card.wait}</span>
        </div>
      </div>
      <dl className="specs">
        {spec("difficulty", card.difficultyLabel, hot)}
        {spec("approval", card.approvalLabel)}
      </dl>
      <dl className="specs specs--cont">
        {spec("Composio-managed", card.managed)}
        {spec("your agent can do", card.agentLabel)}
      </dl>
      <p className="small divider-top" style={{ margin: 0 }}>{card.gotcha}</p>
    </Link>
  );
}
