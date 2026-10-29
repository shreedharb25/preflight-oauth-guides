import type Anthropic from "@anthropic-ai/sdk";

// What the agent submits through the strict `submit_guide` tool. Kept to the fields the model must
// research; slug, title, Composio status, trade-offs and test history are filled in by our code.

const str = { type: "string" } as const;
const strArr = { type: "array", items: str } as const;
const nullable = <T extends object>(schema: T) => ({ anyOf: [schema, { type: "null" }] });
const obj = (properties: Record<string, unknown>) => ({
  type: "object",
  additionalProperties: false,
  required: Object.keys(properties),
  properties,
});
const conf = { type: "string", enum: ["sourced", "uncertain"] } as const;
const who = { type: "string", enum: ["agent", "you"] } as const;

const fact = obj({ num: str, unit: str, note: str, conf });

const useCase = obj({
  id: str,
  label: str,
  scope: str,
  scopeClass: str,
  difficulty: { type: "string", enum: ["easy", "medium", "hard", "gated"] },
  diffReason: str,
  diffConf: conf,
  diffSources: strArr,
  effort: fact,
  wait: nullable(obj({ num: str, unit: str, note: str, conf, sources: strArr })),
  cost: obj({ value: str, note: str, conf, sources: strArr }),
  timeline: { type: "array", items: obj({ label: str, dur: str, wait: { type: "boolean" } }) },
  callout: str,
});

export const GUIDE_INPUT_SCHEMA = obj({
  outcome: { type: "string", enum: ["guide", "no_oauth_docs"], description: "no_oauth_docs when no public OAuth documentation exists" },
  name: { type: "string", description: "Provider or product name as developers know it" },
  provider: { type: "string", description: "Company that runs the developer platform" },
  summary: str,
  agentVerdict: { type: "string", description: "Yes, mostly / Yes, partly / Partly / No" },
  agentTagline: str,
  useCases: { type: "array", items: useCase },
  requirements: { type: "array", items: obj({ label: str, note: str, who, conf, sources: strArr }) },
  steps: { type: "array", items: obj({ title: str, desc: str, who, why: str, time: str, conf, sources: strArr, uses: strArr }) },
  blockers: {
    type: "array",
    items: obj({
      title: str, why: str, next: str, adds: str,
      freq: { type: "string", enum: ["common", "occasional", "rare"] },
      conf, sources: strArr, uses: strArr,
    }),
  },
  adminAsk: nullable(obj({ title: str, text: str })),
  sources: {
    type: "array",
    items: obj({ id: str, title: str, url: str, type: { type: "string", enum: ["official docs", "third party", "community"] } }),
  },
  uncertain: { type: "array", items: obj({ text: str, why: str }) },
  next: obj({ label: str, sub: str, url: str }),
  notFound: nullable(obj({
    found: { type: "array", items: obj({ label: str, url: str }) },
    missing: strArr,
    nextStep: str,
  })),
});

// The write step runs as two calls (overview, then details) so each fits the host's function time limit.
const pick = (keys: string[]) => ({
  type: "object",
  additionalProperties: false,
  required: keys,
  properties: Object.fromEntries(keys.map((k) => [k, (GUIDE_INPUT_SCHEMA.properties as Record<string, unknown>)[k]])),
});
export const OVERVIEW_KEYS = ["outcome", "name", "provider", "summary", "agentVerdict", "agentTagline", "useCases", "requirements", "sources", "next", "notFound"];
export const DETAILS_KEYS = ["steps", "blockers", "adminAsk", "uncertain"];
export const SUBMIT_OVERVIEW_TOOL: Anthropic.Beta.BetaTool = {
  name: "submit_overview",
  description: "Submit the first half of the guide: outcome, summary, use cases, requirements, sources and next step. Call once. Fill every field.",
  input_schema: pick(OVERVIEW_KEYS) as Anthropic.Beta.BetaTool.InputSchema,
};
export const SUBMIT_DETAILS_TOOL: Anthropic.Beta.BetaTool = {
  name: "submit_details",
  description: "Submit the second half of the guide: steps, blockers, admin message and open questions. Call once. Fill every field.",
  input_schema: pick(DETAILS_KEYS) as Anthropic.Beta.BetaTool.InputSchema,
};

// Not `strict`: the API rejects this schema as too large to compile into a grammar. The schema still
// steers the model, and sanitize() below repairs anything missing or mistyped before it is used.
export const SUBMIT_GUIDE_TOOL: Anthropic.Beta.BetaTool = {
  name: "submit_guide",
  description: "Submit the finished guide. Call this exactly once, after researching, as your final action. Fill every field.",
  input_schema: GUIDE_INPUT_SCHEMA as Anthropic.Beta.BetaTool.InputSchema,
};

type Conf = "sourced" | "uncertain";
type WhoT = "agent" | "you";
export interface GeneratedInput {
  outcome: "guide" | "no_oauth_docs";
  name: string;
  provider: string;
  summary: string;
  agentVerdict: string;
  agentTagline: string;
  useCases: {
    id: string; label: string; scope: string; scopeClass: string;
    difficulty: "easy" | "medium" | "hard" | "gated"; diffReason: string; diffConf: Conf; diffSources: string[];
    effort: { num: string; unit: string; note: string; conf: Conf };
    wait: { num: string; unit: string; note: string; conf: Conf; sources: string[] } | null;
    cost: { value: string; note: string; conf: Conf; sources: string[] };
    timeline: { label: string; dur: string; wait: boolean }[];
    callout: string;
  }[];
  requirements: { label: string; note: string; who: WhoT; conf: Conf; sources: string[] }[];
  steps: { title: string; desc: string; who: WhoT; why: string; time: string; conf: Conf; sources: string[]; uses: string[] }[];
  blockers: { title: string; why: string; next: string; adds: string; freq: "common" | "occasional" | "rare"; conf: Conf; sources: string[]; uses: string[] }[];
  adminAsk: { title: string; text: string } | null;
  sources: { id: string; title: string; url: string; type: "official docs" | "third party" | "community" }[];
  uncertain: { text: string; why: string }[];
  next: { label: string; sub: string; url: string };
  notFound: { found: { label: string; url: string }[]; missing: string[]; nextStep: string } | null;
}

// ---- Validation: coerce the tool input into GeneratedInput, never trusting its shape ----
type Raw = Record<string, unknown>;
const asObj = (v: unknown): Raw => (v && typeof v === "object" && !Array.isArray(v) ? (v as Raw) : {});
const asStr = (v: unknown, d = "") => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : d);
const asArr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const asStrArr = (v: unknown) => asArr(v).map((x) => asStr(x)).filter(Boolean);
const oneOf = <T extends string>(v: unknown, opts: readonly T[], d: T): T => (opts.includes(v as T) ? (v as T) : d);
const CONF = ["sourced", "uncertain"] as const;
const WHO = ["agent", "you"] as const;

export function sanitize(raw: unknown): GeneratedInput {
  const r = asObj(raw);
  const conf = (v: unknown) => oneOf(v, CONF, "uncertain");
  const useCases = asArr(r.useCases).slice(0, 3).map((x, i) => {
    const u = asObj(x);
    const e = asObj(u.effort);
    const c = asObj(u.cost);
    const w = u.wait && typeof u.wait === "object" ? asObj(u.wait) : null;
    return {
      id: asStr(u.id) || `uc${i + 1}`,
      label: asStr(u.label, `Use case ${i + 1}`),
      scope: asStr(u.scope, "not confirmed"),
      scopeClass: asStr(u.scopeClass, "unknown"),
      difficulty: oneOf(u.difficulty, ["easy", "medium", "hard", "gated"] as const, "medium"),
      diffReason: asStr(u.diffReason),
      diffConf: conf(u.diffConf),
      diffSources: asStrArr(u.diffSources),
      effort: { num: asStr(e.num, "?"), unit: asStr(e.unit), note: asStr(e.note, "Estimate."), conf: conf(e.conf) },
      wait: w ? { num: asStr(w.num, "Unknown"), unit: asStr(w.unit), note: asStr(w.note), conf: conf(w.conf), sources: asStrArr(w.sources) } : null,
      cost: { value: asStr(c.value, "Unknown"), note: asStr(c.note), conf: conf(c.conf), sources: asStrArr(c.sources) },
      timeline: asArr(u.timeline).slice(0, 5).map((p) => {
        const t = asObj(p);
        return { label: asStr(t.label, "Phase"), dur: asStr(t.dur, "?"), wait: t.wait === true };
      }),
      callout: asStr(u.callout),
    };
  });
  const nf = r.notFound && typeof r.notFound === "object" ? asObj(r.notFound) : null;
  const next = asObj(r.next);
  return {
    outcome: oneOf(r.outcome, ["guide", "no_oauth_docs"] as const, useCases.length ? "guide" : "no_oauth_docs"),
    name: asStr(r.name),
    provider: asStr(r.provider),
    summary: asStr(r.summary),
    agentVerdict: asStr(r.agentVerdict, "Partly"),
    agentTagline: asStr(r.agentTagline),
    useCases,
    requirements: asArr(r.requirements).slice(0, 8).map((x) => {
      const q = asObj(x);
      return { label: asStr(q.label), note: asStr(q.note), who: oneOf(q.who, WHO, "you"), conf: conf(q.conf), sources: asStrArr(q.sources) };
    }).filter((q) => q.label),
    steps: asArr(r.steps).slice(0, 10).map((x) => {
      const s = asObj(x);
      return { title: asStr(s.title), desc: asStr(s.desc), who: oneOf(s.who, WHO, "you"), why: asStr(s.why), time: asStr(s.time), conf: conf(s.conf), sources: asStrArr(s.sources), uses: asStrArr(s.uses) };
    }).filter((s) => s.title),
    blockers: asArr(r.blockers).slice(0, 6).map((x) => {
      const b = asObj(x);
      return { title: asStr(b.title), why: asStr(b.why), next: asStr(b.next), adds: asStr(b.adds), freq: oneOf(b.freq, ["common", "occasional", "rare"] as const, "occasional"), conf: conf(b.conf), sources: asStrArr(b.sources), uses: asStrArr(b.uses) };
    }).filter((b) => b.title),
    adminAsk: r.adminAsk && typeof r.adminAsk === "object" && asStr(asObj(r.adminAsk).text)
      ? { title: asStr(asObj(r.adminAsk).title, "Send this to your customer's admin"), text: asStr(asObj(r.adminAsk).text) } : null,
    sources: asArr(r.sources).map((x) => {
      const s = asObj(x);
      return { id: asStr(s.id), title: asStr(s.title), url: asStr(s.url), type: oneOf(s.type, ["official docs", "third party", "community"] as const, "third party") };
    }).filter((s) => s.id && s.url.startsWith("https://")),
    uncertain: asArr(r.uncertain).slice(0, 5).map((x) => ({ text: asStr(asObj(x).text), why: asStr(asObj(x).why) })).filter((u) => u.text),
    next: { label: asStr(next.label, "Open the developer docs"), sub: asStr(next.sub), url: asStr(next.url) },
    notFound: nf ? {
      found: asArr(nf.found).map((x) => ({ label: asStr(asObj(x).label), url: asStr(asObj(x).url) })).filter((f) => f.url.startsWith("https://")),
      missing: asStrArr(nf.missing),
      nextStep: asStr(nf.nextStep),
    } : null,
  };
}
