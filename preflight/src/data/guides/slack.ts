import type { Guide } from "@/lib/types";

// Source: research/slack.md (checked 2026-10-29). Nothing here has been agent-tested yet.
export const slack: Guide = {
  slug: "slack",
  name: "Slack",
  provider: "Slack",
  mono: "SL",
  title: "Your own Slack app",
  summary:
    "For agents that post in channels, reply to people or read conversation history. Posting is quick. Reading history in other companies' workspaces is where it gets hard, because apps outside Slack's Marketplace are heavily rate-limited.",
  checked: "29 Oct 2026",
  origin: "library",
  managed: "yes",
  needOwnApp: {
    answer: "Probably yes, even for a pilot.",
    text: "Composio manages a Slack app, but its own docs call your own app the safest option. Workspaces that only allow approved or Marketplace apps will block or prompt for Composio's app, and it may show a Marketplace warning until Composio's listing review completes.",
    when: [
      "Your customers' workspaces require approved or Marketplace apps",
      "Your brand must appear when users install",
      "You need to read message history at scale",
      "You need webhooks for real-time events",
    ],
    sources: ["composio-slack"],
  },
  agent: {
    verdict: "Yes, partly",
    tagline:
      "Can pick the narrowest scopes, prepare the redirect URL and manifest, add credentials to Composio and draft your Marketplace submission. You create the app, install it, and handle the listing and reviewers.",
  },
  defaultUc: "post",
  useCases: [
    {
      id: "internal", label: "Your own workspace only", scope: "any scopes, internal app", scopeClass: "internal app",
      difficulty: "easy", diffReason: "Internal apps built for your own workspace aren't affected by the new rate limits and need no review.", diffConf: "sourced", diffSources: ["slack-ratelimit"],
      effort: { num: "30", unit: "min", note: "Estimate. Create the app and install it to your workspace.", conf: "uncertain" },
      wait: null,
      cost: { value: "Free", note: "No fee mentioned for creating or installing apps.", conf: "uncertain" },
      timeline: [
        { label: "Create the app", dur: "~15 min", wait: false, flex: 2 },
        { label: "Install and test", dur: "~15 min", wait: false, flex: 2 },
      ],
      callout: "",
    },
    {
      id: "post", label: "Post in customers' workspaces", scope: "chat:write", scopeClass: "no Slack review",
      difficulty: "medium", diffReason: "No review from Slack, but workspaces can require admin approval or Marketplace-only apps.", diffConf: "sourced", diffSources: ["composio-slack"],
      effort: { num: "1", unit: "hr", note: "Estimate. Create, distribute and test the app.", conf: "uncertain" },
      wait: { num: "None", unit: "from Slack", note: "None from Slack. If a workspace requires approved apps, its admin decides when.", conf: "sourced", sources: ["composio-slack"] },
      cost: { value: "Free", note: "No fee mentioned for creating or distributing apps.", conf: "uncertain" },
      timeline: [
        { label: "Create and distribute", dur: "~1 hr", wait: false, flex: 3 },
        { label: "Workspace admin approves (if required)", dur: "up to them", wait: true, flex: 4 },
      ],
      callout: "Ask each new customer whether their workspace requires approved apps, and send the admin note below on day one.",
    },
    {
      id: "read", label: "Read channel history", scope: "channels:history", scopeClass: "rate-limited unless listed",
      difficulty: "hard", diffReason: "Outside the Marketplace, history reads are capped at 1 request a minute. Listing needs 10 active installs first, then review.", diffConf: "sourced", diffSources: ["slack-ratelimit", "slack-marketplace"],
      effort: { num: "1", unit: "hr + listing", note: "Estimate for setup, plus testing and the Marketplace submission.", conf: "uncertain" },
      wait: { num: "~10+", unit: "wks", note: "After 10 active installs: preliminary review \"up to 10 business days\", then \"up to 10 weeks\".", conf: "sourced", sources: ["slack-marketplace"] },
      cost: { value: "Free", note: "No Marketplace fee mentioned in the review guide.", conf: "uncertain" },
      timeline: [
        { label: "Create and distribute", dur: "~1 hr", wait: false, flex: 2 },
        { label: "Reach 10 active installs", dur: "depends on sales", wait: true, flex: 5 },
        { label: "Preliminary review", dur: "up to 10 business days", wait: true, flex: 3 },
        { label: "Functional review", dur: "up to 10 weeks", wait: true, flex: 10 },
      ],
      callout: "Until you're listed, each history request returns at most 15 messages, once a minute. Design your pilot around that, and start the listing as early as you can.",
    },
  ],
  requirements: [
    { id: "r1", label: "A Slack workspace to develop in", note: "Plus a second workspace for testing; Marketplace review needs testing outside your dev workspace.", who: "you", conf: "sourced", sources: ["slack-marketplace"] },
    { id: "r2", label: "Your redirect URL", note: "Added under OAuth & Permissions → Redirect URLs.", who: "agent", conf: "sourced", sources: ["composio-slack"], uses: ["post", "read"] },
    { id: "r3", label: "The narrowest scopes for your features", note: "Scopes for features that don't exist yet get Marketplace submissions returned.", who: "agent", conf: "sourced", sources: ["slack-marketplace"] },
    { id: "r4", label: "10 active workspace installs", note: "Active = used in the last 28 days. Required before you can submit to the Marketplace.", who: "you", conf: "sourced", sources: ["slack-marketplace"], uses: ["read"] },
    { id: "r5", label: "A test account and install instructions for reviewers", note: "Reviewers can't access your workspaces; ideally include dummy data.", who: "you", conf: "sourced", sources: ["slack-marketplace"], uses: ["read"] },
    { id: "r6", label: "A demo video", note: "Recommended: install, OAuth, setup, use and uninstall.", who: "you", conf: "sourced", sources: ["slack-marketplace"], uses: ["read"] },
  ],
  steps: [
    { id: "s1", title: "Create a Slack app", desc: "From Slack's app dashboard, in your development workspace.", who: "you", why: "Needs your Slack login: the dashboard says you must sign in to create an app.", time: "5 min", conf: "tested", sources: ["agent-slack"] },
    { id: "s2", title: "Add only the scopes you use", desc: "Pick bot or user scopes for each feature you've actually built.", who: "agent", time: "10 min", conf: "sourced", sources: ["slack-marketplace", "composio-slack"] },
    { id: "s3", title: "Set the redirect URL", desc: "OAuth & Permissions → Redirect URLs. It must match exactly.", who: "agent", time: "2 min", conf: "sourced", sources: ["composio-slack"], uses: ["post", "read"] },
    { id: "s4", title: "Turn on public distribution", desc: "So workspaces other than yours can install the app.", who: "you", why: "A setting in your logged-in app dashboard.", time: "5 min", conf: "uncertain", sources: [], uses: ["post", "read"] },
    { id: "s5", title: "Install it and test", desc: "Install to your workspace, then a second test workspace, including uninstall.", who: "you", why: "Installing needs a workspace login.", time: "15 min", conf: "sourced", sources: ["slack-marketplace"] },
    { id: "s6", title: "Add the credentials to Composio", desc: "Create a custom auth config with your client ID and secret. Set up webhooks separately for your own app.", who: "agent", time: "10 min", conf: "sourced", sources: ["composio-slack", "composio-custom"], via: "composio" },
    { id: "s7", title: "Get to 10 active installs", desc: "Workspaces that used the app in the last 28 days.", who: "you", why: "Needs real customers.", time: "weeks", conf: "sourced", sources: ["slack-marketplace"], uses: ["read"] },
    { id: "s8", title: "Prepare the Marketplace submission", desc: "Test account, install instructions, demo video, and no leftover test slash commands.", who: "agent", time: "2–3 hrs", conf: "sourced", sources: ["slack-marketplace"], details: "Your agent can write the instructions and video script and check for leftover test commands. You record and submit.", uses: ["read"] },
    { id: "s9", title: "Submit and answer reviewers", desc: "Preliminary feedback comes within about 10 business days; the functional review can take up to 10 weeks.", who: "you", why: "Reviewers contact you directly.", time: "weeks", conf: "sourced", sources: ["slack-marketplace"], uses: ["read"] },
  ],
  blockers: [
    { title: "\"Requires approval\" or the install is blocked", why: "The workspace has \"Require approved apps\" or \"Require apps from Slack Marketplace\" turned on.", next: "Ask the workspace admin or owner to approve the app, or get listed in the Marketplace.", freq: "common", conf: "sourced", sources: ["composio-slack"], uses: ["post", "read"] },
    { title: "History returns only 15 messages", why: "The rate limit for apps outside the Marketplace: 1 request a minute, 15 objects per request.", next: "Get listed in the Marketplace, or use an internal app for your own workspace.", freq: "common", conf: "sourced", sources: ["slack-ratelimit"], uses: ["read"] },
    { title: "Redirect mismatch or scope errors", why: "The redirect URL or scopes in your auth config don't match the Slack app.", next: "Make the redirect URL and scopes identical in both places.", freq: "occasional", conf: "sourced", sources: ["composio-slack"] },
    { title: "Marketplace submission returned", why: "Not production-ready, scopes for unbuilt features, leftover test slash commands, or no test access.", next: "Fix the listed issues and resubmit. Resubmissions of published apps take up to 6 weeks.", adds: "weeks", freq: "occasional", conf: "sourced", sources: ["slack-marketplace"], uses: ["read"] },
    { title: "Channel names don't resolve on Enterprise Grid", why: "Org-wide tokens can't resolve channel names.", next: "Use channel IDs instead of names.", freq: "rare", conf: "sourced", sources: ["composio-slack"] },
  ],
  adminAsk: {
    title: "Send this to your customer's Slack admin",
    text: "We've built a Slack app for [YOUR PRODUCT] that needs to be installed in your workspace. Your workspace requires approved apps, so an admin or owner needs to approve it. It requests only these scopes: [SCOPES], to [WHAT IT DOES]. Once approved, your team can connect it from [LINK].",
    sources: ["composio-slack"],
  },
  tradeoffs: [
    { k: "time to launch", managed: "Today", own: "About an hour; weeks more to be listed" },
    { k: "workspace policies", managed: "May be blocked or need approval", own: "Same rules, but under your name" },
    { k: "Marketplace warning", managed: "May show until Composio is listed", own: "Shows until you are listed" },
    { k: "webhooks", managed: "Handled by Composio", own: "You set them up" },
    { k: "best for", managed: "Quick internal trials", own: "Anything customers install" },
  ],
  sources: [
    { id: "slack-ratelimit", title: "Rate limit changes for non-Marketplace apps (May 2025)", url: "https://docs.slack.dev/changelog/2025/05/29/rate-limit-changes-for-non-marketplace-apps", type: "official docs" },
    { id: "agent-slack", title: "Our agent opened the app dashboard while signed out (29 Oct 2026)", url: "https://api.slack.com/apps", type: "tested by our agent" },
    { id: "slack-marketplace", title: "Slack Marketplace review guide", url: "https://docs.slack.dev/slack-marketplace/slack-marketplace-review-guide", type: "official docs" },
    { id: "composio-slack", title: "Slack toolkit", url: "https://docs.composio.dev/toolkits/slack", type: "composio docs" },
    { id: "composio-custom", title: "Managed vs custom auth", url: "https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app", type: "composio docs" },
  ],
  uncertain: [
    { text: "Whether existing installs are also rate-limited", why: "Slack's page says existing installs aren't affected; some third-party sources claim they are from March 3, 2026." },
    { text: "How long setup takes", why: "Our estimates. Not yet timed by an agent run." },
    { text: "Where exactly \"public distribution\" lives in the dashboard", why: "From general knowledge; not in the pages we read." },
  ],
  tested: [
    {date: "29 Oct 2026", tried: "Opened Slack's app dashboard while signed out", result: "\"You'll need to sign in to your Slack account to create an application.\"", ok: true, url: "https://api.slack.com/apps"},
    {date: "29 Oct 2026", tried: "Stopped before creating an app", result: "We don't use real accounts or credentials for tests.", ok: false},
    {date: "29 Oct 2026", tried: "Checked every source link in this guide", result: "All 5 load. Slack's FAQ link now redirects to its changelog, so we cite that.", ok: true},
  ],
  next: { label: "Create a Slack app", sub: "About 5 minutes. You'll need to be signed in to your Slack workspace.", href: "https://api.slack.com/apps" },
};
