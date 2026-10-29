// Shared shapes for library guides and AI-generated guides.

export type Confidence = "tested" | "sourced" | "uncertain";
export type Who = "agent" | "you";
export type Difficulty = "easy" | "medium" | "hard" | "gated";

export type SourceType = "official docs" | "composio docs" | "third party" | "community" | "tested by our agent";

export interface Source {
  id: string;
  title: string;
  url: string;
  type: SourceType;
}

/** A measured or estimated value plus how sure we are about it. */
export interface Fact {
  num: string;
  unit: string;
  note: string;
  conf: Confidence;
  sources?: string[];
}

export interface TimelinePhase {
  label: string;
  dur: string;
  wait: boolean; // true = waiting on the provider (drawn hatched)
  flex: number; // relative width
}

export interface UseCase {
  id: string;
  label: string;
  scope: string;
  scopeClass: string;
  difficulty: Difficulty;
  diffReason: string;
  diffConf: Confidence;
  diffSources?: string[];
  effort: Fact;
  wait: Fact | null;
  cost: { value: string; note: string; conf: Confidence; sources?: string[] };
  timeline: TimelinePhase[];
  callout: string;
}

export interface Step {
  id: string;
  title: string;
  desc: string;
  who: Who;
  why?: string; // why a human is needed, when who = "you"
  time?: string;
  conf: Confidence;
  sources: string[];
  details?: string;
  uses?: string[]; // use-case ids this step applies to; omitted = all
  via?: "composio"; // only when connecting through Composio; dropped from the direct-integration prompt
}

export type IntegrationPath = "composio" | "direct";

export interface Requirement {
  id: string;
  label: string;
  note: string;
  who: Who;
  conf: Confidence;
  sources: string[];
  uses?: string[];
}

export interface Blocker {
  title: string;
  why: string;
  next: string;
  adds?: string;
  freq?: "common" | "occasional" | "rare";
  conf: Confidence;
  sources: string[];
  uses?: string[];
}

export interface TestRun {
  date: string;
  tried: string;
  result: string;
  ok: boolean;
  url?: string;
}

export interface Guide {
  slug: string;
  name: string;
  provider: string;
  mono: string;
  title: string;
  summary: string;
  checked: string;
  origin: "library" | "generated";
  managed: "yes" | "no" | "partly";
  needOwnApp: { answer: string; text: string; when: string[]; sources: string[] };
  agent: { verdict: string; tagline: string };
  defaultUc: string;
  useCases: UseCase[];
  requirements: Requirement[];
  steps: Step[];
  blockers: Blocker[];
  adminAsk?: { title: string; text: string; sources: string[] };
  tradeoffs: { k: string; managed: string; own: string }[];
  sources: Source[];
  uncertain: { text: string; why: string }[];
  tested: TestRun[];
  next: { label: string; sub: string; href: string };
}

/** What a card on the landing grid shows, plus the values the filters match on. */
export interface AppCard {
  slug: string;
  name: string;
  mono: string;
  category: string;
  ttlNum: string;
  ttlUnit: string;
  ttlNote: string;
  effort: string;
  wait: string;
  difficultyLabel: string;
  approvalLabel: string;
  managed: "yes" | "no" | "partly";
  agentLabel: string;
  gotcha: string;
  bar: { total: number; solid: number }; // total = bar length %, solid = share of it that's your own work
  rank: number; // lower = faster to live
  filters: {
    difficulty: Difficulty[];
    ttl: string[];
    approval: string[];
    cost: string[];
    managed: string[];
    agent: string[];
  };
  hasGuide: boolean;
}
