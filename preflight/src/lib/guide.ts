import type { Guide, IntegrationPath, UseCase } from "./types";

const applies = (uses: string[] | undefined, uc: string) => !uses || uses.includes(uc);

/** The parts of a guide that apply to one use case. */
export function forUseCase(guide: Guide, ucId: string) {
  const uc: UseCase = guide.useCases.find((u) => u.id === ucId) ?? guide.useCases.find((u) => u.id === guide.defaultUc)!;
  const steps = guide.steps.filter((s) => applies(s.uses, uc.id));
  const requirements = guide.requirements.filter((r) => applies(r.uses, uc.id));
  const blockers = guide.blockers.filter((b) => applies(b.uses, uc.id));
  const agentSteps = steps.filter((s) => s.who === "agent").length;
  return { uc, steps, requirements, blockers, agentSteps };
}

/** Every claim on the page, counted by confidence. */
export function claimCounts(guide: Guide) {
  const all = [
    ...guide.useCases.flatMap((u) => [u.diffConf, u.effort.conf, u.cost.conf, ...(u.wait ? [u.wait.conf] : [])]),
    ...guide.steps.map((s) => s.conf),
    ...guide.requirements.map((r) => r.conf),
    ...guide.blockers.map((b) => b.conf),
  ];
  return {
    total: all.length,
    tested: all.filter((c) => c === "tested").length,
    sourced: all.filter((c) => c === "sourced").length,
    uncertain: all.filter((c) => c === "uncertain").length,
  };
}

/**
 * A ready-to-paste prompt for the developer's coding agent, built from the agent and human steps.
 * "composio" plugs the app into Composio as a custom auth config; "direct" has the agent build the OAuth flow itself.
 */
export function agentPrompt(guide: Guide, ucId: string, via: IntegrationPath) {
  const { uc, steps } = forUseCase(guide, ucId);
  const relevant = steps.filter((s) => via === "composio" || s.via !== "composio");
  const agent = relevant.filter((s) => s.who === "agent").map((s) => `${s.title}. ${s.desc}`);
  const human = relevant.filter((s) => s.who === "you");

  if (via === "direct") {
    agent.push(
      `Implement the OAuth 2.0 authorization code flow in our backend: build the ${guide.provider} authorization URL with the scope above and a random state value, handle the callback at our redirect URI, verify state, and exchange the code for tokens.`,
      "Store tokens encrypted per user, refresh them before they expire, and handle revoked or expired access by asking the user to reconnect.",
      "Write a test that runs the whole flow against a test account.",
    );
  }

  const lines = [
    `You are helping me set up our own ${guide.provider} OAuth app so our product can connect to ${guide.name} on behalf of our users.`,
    via === "composio"
      ? "We connect through Composio: we register our own OAuth app with the provider, then add its client ID and secret to Composio as a custom auth config. Composio runs the OAuth flow and stores and refreshes tokens."
      : "We integrate directly, without a third-party auth layer: we register our own OAuth app and run the OAuth flow in our own backend.",
    "",
    `Use case: ${uc.label}`,
    `Scope: ${uc.scope} (${uc.scopeClass})`,
    "App name: [YOUR APP NAME]",
    "Domain: [YOUR DOMAIN]",
    via === "composio"
      ? "Redirect URI: use the one the Composio dashboard shows when you create the auth config."
      : "Redirect URIs: [YOUR REDIRECT URIS, including local and staging]",
    "",
    "Do these, in order:",
    ...agent.map((t, i) => `${i + 1}. ${t}`),
    "",
    "Stop and hand over to me before:",
    ...human.map((s) => `- ${s.title.charAt(0).toLowerCase() + s.title.slice(1)}${s.why ? ` (${s.why.replace(/\.$/, "")})` : ""}`),
    "",
    "Never put client secrets in the repo. When you finish, report what you set up and a checklist of what is left for me.",
  ];
  return lines.join("\n");
}

/** The guide as Markdown, for pasting into a doc or ticket. */
export function guideMarkdown(guide: Guide, ucId: string, url: string) {
  const { uc, steps, requirements, blockers } = forUseCase(guide, ucId);
  const src = (ids: string[] | undefined) =>
    ids && ids.length ? ` [${ids.map((id) => guide.sources.findIndex((s) => s.id === id) + 1).join(", ")}]` : "";
  const out = [
    `# ${guide.title} (${uc.label})`,
    "",
    `${guide.summary}`,
    "",
    `Checked ${guide.checked} · ${url}`,
    "",
    "## At a glance",
    `- Difficulty: ${uc.difficulty} (${uc.diffConf}). ${uc.diffReason}`,
    `- Your effort: ${uc.effort.num} ${uc.effort.unit} (${uc.effort.conf})`,
    `- Approval wait: ${uc.wait ? `${uc.wait.num} ${uc.wait.unit}. ${uc.wait.note} (${uc.wait.conf})` : "none"}`,
    `- Cost: ${uc.cost.value}. ${uc.cost.note} (${uc.cost.conf})`,
    "",
    "## Do you even need your own app?",
    `${guide.needOwnApp.answer} ${guide.needOwnApp.text}`,
    "",
    "## Before you start",
    ...requirements.map((r) => `- [ ] ${r.label}: ${r.note} (${r.who}, ${r.conf})${src(r.sources)}`),
    "",
    "## Steps",
    ...steps.map((s, i) => `${i + 1}. **${s.title}** (${s.who}${s.time ? `, ${s.time}` : ""}, ${s.conf})${src(s.sources)}: ${s.desc}`),
    "",
    "## Blockers and what to do",
    ...blockers.map((b) => `- **${b.title}.** ${b.why} → ${b.next} (${b.conf})${src(b.sources)}`),
    "",
    "## Sources",
    ...guide.sources.map((s, i) => `${i + 1}. ${s.title} (${s.type}): ${s.url}`),
  ];
  return out.join("\n");
}
