import type { Guide } from "@/lib/types";

// Source: research/x-twitter.md (checked 2026-10-29). Nothing here has been agent-tested yet.
export const xTwitter: Guide = {
  slug: "x-twitter",
  name: "X (Twitter)",
  provider: "X",
  mono: "X",
  title: "Your own X app",
  summary:
    "For agents that read posts, post for users or track engagement. There's no review, so setup is quick. The real question is cost: X charges per call, with no free tier for new developers.",
  checked: "29 Oct 2026",
  origin: "library",
  managed: "no",
  needOwnApp: {
    answer: "Yes. There's no managed option.",
    text: "Composio removed its managed X credentials in February 2026, so you must bring your own. Rate limits are per app, so production workloads need their own app anyway.",
    when: ["Always: there is no managed app for X"],
    sources: ["composio-x"],
  },
  agent: {
    verdict: "Yes, mostly",
    tagline:
      "Can prepare the OAuth settings and scopes, add credentials to Composio and estimate your monthly bill. You create the developer account, add a payment card and set a spending limit.",
  },
  defaultUc: "post",
  useCases: [
    {
      id: "read", label: "Read posts", scope: "tweet.read, users.read", scopeClass: "pay per post read",
      difficulty: "easy", diffReason: "No review. You pay for every post your app reads.", diffConf: "sourced", diffSources: ["x-pricing"],
      effort: { num: "30", unit: "min", note: "Estimate. Account, project, app and billing.", conf: "uncertain" },
      wait: null,
      cost: { value: "$0.005", note: "Per post read. $0.001 per item for your own account's data. Capped at 3M reads a month.", conf: "sourced", sources: ["x-pricing"] },
      timeline: [
        { label: "Account and app", dur: "~20 min", wait: false, flex: 3 },
        { label: "Billing and limits", dur: "~10 min", wait: false, flex: 2 },
      ],
      callout: "",
    },
    {
      id: "post", label: "Post for users", scope: "tweet.write, tweet.read, users.read", scopeClass: "pay per post created",
      difficulty: "easy", diffReason: "No review. You pay for every post your app creates.", diffConf: "sourced", diffSources: ["x-pricing"],
      effort: { num: "30", unit: "min", note: "Estimate. Account, project, app and billing.", conf: "uncertain" },
      wait: null,
      cost: { value: "$0.015", note: "Per post created, and $0.20 if the post contains a URL.", conf: "sourced", sources: ["x-pricing"] },
      timeline: [
        { label: "Account and app", dur: "~20 min", wait: false, flex: 3 },
        { label: "Billing and limits", dur: "~10 min", wait: false, flex: 2 },
      ],
      callout: "",
    },
    {
      id: "analytics", label: "Post analytics", scope: "tweet.read, users.read + Enterprise plan", scopeClass: "Enterprise only",
      difficulty: "gated", diffReason: "Post analytics need an Enterprise plan. Every other tier gets 403 Forbidden.", diffConf: "sourced", diffSources: ["composio-x", "x-pricing"],
      effort: { num: "30", unit: "min", note: "Estimate for setup, plus the Enterprise conversation.", conf: "uncertain" },
      wait: { num: "Unknown", unit: "", note: "Enterprise access starts with an interest form. No timeline is published.", conf: "uncertain", sources: ["x-pricing"] },
      cost: { value: "Enterprise", note: "Not published. You request a quote.", conf: "sourced", sources: ["x-pricing"] },
      timeline: [
        { label: "Account and app", dur: "~30 min", wait: false, flex: 2 },
        { label: "Enterprise interest form", dur: "unknown", wait: true, flex: 8 },
      ],
      callout: "Send the Enterprise interest form early, and build everything else on pay-per-use while you wait.",
    },
  ],
  requirements: [
    { id: "r1", label: "An X developer account", note: "Created in the X Developer Console.", who: "you", conf: "sourced", sources: ["composio-x"] },
    { id: "r2", label: "A project with your app linked to it", note: "Apps not linked to a project fail with \"client-not-enrolled\".", who: "you", conf: "sourced", sources: ["composio-x"] },
    { id: "r3", label: "A payment card and prepaid credits", note: "Credits are bought upfront and used as you make requests.", who: "you", conf: "sourced", sources: ["x-pricing"] },
    { id: "r4", label: "A monthly spending limit", note: "Requests are blocked once you reach it, so set it deliberately.", who: "you", conf: "sourced", sources: ["x-pricing"] },
  ],
  steps: [
    { id: "x1", title: "Create a developer account, project and app", desc: "In the X Developer Console. Link the app to the project.", who: "you", why: "Needs your X login.", time: "10 min", conf: "sourced", sources: ["composio-x"] },
    { id: "x2", title: "Set up OAuth 2.0", desc: "Callback URL and the scopes for your use case, such as tweet.read and users.read.", who: "agent", time: "10 min", conf: "sourced", sources: ["composio-x"] },
    { id: "x3", title: "Add a card, buy credits and set a spending limit", desc: "Requests stop when credits run out or you hit the limit.", who: "you", why: "Involves your payment details.", time: "10 min", conf: "sourced", sources: ["x-pricing"] },
    { id: "x4", title: "Estimate your monthly cost", desc: "Multiply expected reads and posts by the per-call prices, including $0.20 posts with links.", who: "agent", time: "10 min", conf: "sourced", sources: ["x-pricing"] },
    { id: "x5", title: "Add the credentials to Composio", desc: "Create a custom auth config with your client ID and secret.", who: "agent", time: "5 min", conf: "sourced", sources: ["composio-x", "composio-custom"], via: "composio" },
    { id: "x6", title: "Request Enterprise access", desc: "Fill in X's Enterprise interest form.", who: "you", why: "A commercial conversation with X.", time: "15 min", conf: "sourced", sources: ["x-pricing"], uses: ["analytics"] },
  ],
  blockers: [
    { title: "\"client-not-enrolled\" or \"App not linked to project\"", why: "The app isn't linked to a developer project, or its configuration is outdated.", next: "Link the app to a project, or refresh the configuration.", freq: "common", conf: "sourced", sources: ["composio-x"] },
    { title: "403 Forbidden", why: "Your plan or access level doesn't include that endpoint.", next: "Check your tier in the Developer Console. Some endpoints need Enterprise.", freq: "common", conf: "sourced", sources: ["composio-x"] },
    { title: "Requests suddenly blocked", why: "Credits ran out, the balance went negative, or you hit your spending limit.", next: "Top up, turn on auto-recharge, or raise the limit.", freq: "occasional", conf: "sourced", sources: ["x-pricing"] },
    { title: "Connection shows EXPIRED", why: "The app configuration changed or broke.", next: "Fix the app configuration, then recreate the connection.", freq: "occasional", conf: "sourced", sources: ["composio-x"] },
  ],
  tradeoffs: [
    { k: "availability", managed: "Not offered since Feb 2026", own: "Required" },
    { k: "rate limits", managed: "n/a", own: "Per app, your own" },
    { k: "cost", managed: "n/a", own: "You pay X per call" },
  ],
  sources: [
    { id: "x-pricing", title: "X API pricing", url: "https://docs.x.com/x-api/getting-started/pricing", type: "official docs" },
    { id: "composio-x", title: "Twitter toolkit", url: "https://docs.composio.dev/toolkits/twitter", type: "composio docs" },
    { id: "composio-custom", title: "Managed vs custom auth", url: "https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app", type: "composio docs" },
  ],
  uncertain: [
    { text: "How long setup takes", why: "Our estimate. Not yet timed by an agent run." },
    { text: "Whether legacy Basic and Pro plans still exist", why: "Third-party reports say they're closed to new sign-ups; X's pricing page doesn't mention them." },
    { text: "How long Enterprise access takes", why: "X publishes no timeline." },
  ],
  tested: [
    {date: "29 Oct 2026", tried: "Opened the X Developer Platform (the next step)", result: "Loads.", ok: true, url: "https://developer.x.com"},
    {date: "29 Oct 2026", tried: "Checked every source link in this guide", result: "All 3 load.", ok: true},
  ],
  next: { label: "Open the X Developer Console", sub: "About 10 minutes. You'll need your X login and a payment card.", href: "https://developer.x.com" },
};
