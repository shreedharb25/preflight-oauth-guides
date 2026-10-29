import { composioManaged } from "@/data/composio-managed";
import type { Confidence, Guide } from "@/lib/types";
import type { GeneratedInput } from "./schema";

const COMPOSIO_CUSTOM = {
  id: "composio-custom",
  title: "Managed vs custom auth",
  url: "https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app",
  type: "composio docs" as const,
};
const COMPOSIO_MANAGED = {
  id: "composio-managed",
  title: "Managed OAuth apps (directory)",
  url: "https://docs.composio.dev/toolkits/managed-auth",
  type: "composio docs" as const,
};

const urlKey = (u: string) => u.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/[#?].*$/, "").replace(/\/+$/, "");

export function slugify(input: string) {
  const host = input.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split(/[/?#]/)[0];
  const base = host.includes(".") && !host.includes(" ") ? host.split(".")[0] : host;
  return base.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
}

/**
 * Turns the agent's submission into a Guide, enforcing our labelling rules:
 * a source must have appeared in the agent's own search results, and a claim marked
 * "sourced" with no surviving source is downgraded to "uncertain".
 */
export function toGuide(input: GeneratedInput, slug: string, searchedUrls: Set<string>): { guide: Guide; dropped: number } {
  const seen = new Set([...searchedUrls].map(urlKey));
  const kept = input.sources.filter((s) => seen.size === 0 || seen.has(urlKey(s.url)));
  const dropped = input.sources.length - kept.length;
  const ids = new Set(kept.map((s) => s.id));
  const ucIds = new Set(input.useCases.map((u) => u.id));

  const refs = (r: string[]) => r.filter((id) => ids.has(id));
  const label = (c: Confidence, r: string[]): Confidence => (c === "sourced" && refs(r).length === 0 ? "uncertain" : c);
  const uses = (u: string[]) => {
    const valid = u.filter((id) => ucIds.has(id));
    return valid.length ? valid : undefined;
  };

  const managed = composioManaged(input.name, slug);
  const name = input.name.trim();
  const mono = name.split(/[\s().-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || name.slice(0, 2).toUpperCase();

  const guide: Guide = {
    slug,
    name,
    provider: input.provider.trim() || name,
    mono,
    title: `Your own ${name} app`,
    summary: input.summary,
    checked: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    origin: "generated",
    managed: managed === "unknown" ? "no" : managed,
    needOwnApp:
      managed === "yes"
        ? {
            answer: "Not yet, if you're prototyping.",
            text: `Composio already provides a managed ${name} OAuth app, so you can connect users today and register your own when you go to production.`,
            when: ["Your brand must appear on the consent screen", "You need permissions beyond Composio's defaults", "You hit shared rate limits", "Enterprise customers require your own app"],
            sources: ["composio-managed", "composio-custom"],
          }
        : {
            answer: managed === "no" ? "Yes. There's no managed option." : "Probably yes.",
            text:
              managed === "no"
                ? `Composio's directory lists ${name} as bring-your-own, so you register your own OAuth app.`
                : `${name} isn't in Composio's managed directory, so plan to register your own OAuth app.`,
            when: ["Always, unless a managed app becomes available"],
            sources: ["composio-managed"],
          },
    agent: { verdict: input.agentVerdict, tagline: input.agentTagline },
    defaultUc: input.useCases[Math.min(1, input.useCases.length - 1)]?.id ?? "",
    useCases: input.useCases.map((u) => ({
      id: u.id,
      label: u.label,
      scope: u.scope,
      scopeClass: u.scopeClass,
      difficulty: u.difficulty,
      diffReason: u.diffReason,
      diffConf: label(u.diffConf, u.diffSources),
      diffSources: refs(u.diffSources),
      effort: { ...u.effort, conf: u.effort.conf === "sourced" ? "uncertain" : u.effort.conf },
      wait: u.wait ? { ...u.wait, conf: label(u.wait.conf, u.wait.sources), sources: refs(u.wait.sources) } : null,
      cost: { ...u.cost, conf: label(u.cost.conf, u.cost.sources), sources: refs(u.cost.sources) },
      timeline: u.timeline.map((p) => ({ ...p, flex: p.wait ? 6 : 2 })),
      callout: u.callout,
    })),
    requirements: input.requirements.map((r, i) => ({ id: `r${i + 1}`, ...r, conf: label(r.conf, r.sources), sources: refs(r.sources) })),
    steps: input.steps.map((s, i) => ({
      id: `s${i + 1}`,
      title: s.title,
      desc: s.desc,
      who: s.who,
      why: s.who === "you" ? s.why || "Needs your account or a decision from you." : undefined,
      time: s.time || undefined,
      conf: label(s.conf, s.sources),
      sources: refs(s.sources),
      uses: uses(s.uses),
    })),
    blockers: input.blockers.map((b) => ({
      title: b.title, why: b.why, next: b.next, adds: b.adds || undefined, freq: b.freq,
      conf: label(b.conf, b.sources), sources: refs(b.sources), uses: uses(b.uses),
    })),
    adminAsk: input.adminAsk ? { ...input.adminAsk, sources: [] } : undefined,
    tradeoffs: [
      { k: "Composio-managed app", managed: managed === "yes" ? "Available today" : "Not available", own: "Required for production" },
      { k: "consent screen shows", managed: "Composio", own: "Your name" },
      { k: "rate limits", managed: "Shared", own: "Your own" },
    ],
    sources: [...kept.map((s) => ({ ...s })), COMPOSIO_MANAGED, COMPOSIO_CUSTOM],
    uncertain: input.uncertain,
    tested: [],
    next: { label: input.next.label, sub: input.next.sub, href: input.next.url.startsWith("https://") ? input.next.url : kept[0]?.url ?? COMPOSIO_MANAGED.url },
  };
  return { guide, dropped };
}
