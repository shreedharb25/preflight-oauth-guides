import type { Guide } from "@/lib/types";

// Source: research/notion.md (checked 2026-10-29). Nothing here has been agent-tested yet.
export const notion: Guide = {
  slug: "notion",
  name: "Notion",
  provider: "Notion",
  mono: "N",
  title: "Your own Notion connection",
  summary:
    "For agents that read and write pages and databases. Notion has no OAuth scopes: each user picks which pages to share. Setup is quick; making the connection public goes through a review whose length isn't documented.",
  checked: "29 Oct 2026",
  origin: "library",
  managed: "yes",
  needOwnApp: {
    answer: "Not yet, if you're prototyping.",
    text: "Composio manages a Notion connection, but Notion shows Composio as the actor on every action your agent takes. Your own connection shows your name and logo, keeps your users' tokens separate, and is what Composio recommends for production.",
    when: [
      "Your name should appear on the pages your agent edits",
      "You want your users' tokens isolated to your product",
      "You're going to production",
    ],
    sources: ["composio-notion"],
  },
  agent: {
    verdict: "Yes, mostly",
    tagline:
      "Can prepare the connection settings, add credentials to Composio and write the \"which pages to share\" instructions for your users. You create the connection and submit it for review.",
  },
  defaultUc: "pages",
  useCases: [
    {
      id: "pages", label: "Read and write shared pages", scope: "pages the user shares (no OAuth scopes)", scopeClass: "per-page access",
      difficulty: "easy", diffReason: "No scopes to justify. Users choose pages in a picker. Going public needs a review.", diffConf: "sourced", diffSources: ["notion-auth", "composio-notion"],
      effort: { num: "20", unit: "min", note: "Estimate. One form, then credentials.", conf: "uncertain" },
      wait: { num: "Unknown", unit: "", note: "The authorization URL appears after you submit for review. No timeline is documented.", conf: "uncertain", sources: ["notion-auth"] },
      cost: { value: "Free", note: "No fee mentioned in the docs we read.", conf: "uncertain" },
      timeline: [
        { label: "Create the connection", dur: "~20 min", wait: false, flex: 3 },
        { label: "Notion review", dur: "not documented", wait: true, flex: 5 },
      ],
      callout: "Submit the connection as soon as it's set up, so the review runs while you build.",
    },
  ],
  requirements: [
    { id: "r1", label: "A Notion account with developer portal access", note: "Where you create the public connection.", who: "you", conf: "sourced", sources: ["notion-auth"] },
    { id: "r2", label: "Your redirect URI(s)", note: "Set in the OAuth configuration section.", who: "agent", conf: "sourced", sources: ["notion-auth"] },
    { id: "r3", label: "A decision on install scope", note: "\"Any workspace\" or \"Selected workspaces only\". This can't be changed after creation.", who: "you", conf: "sourced", sources: ["notion-auth"] },
    { id: "r4", label: "Company details and privacy policy", note: "Likely needed to go public; not confirmed in the current docs.", who: "you", conf: "uncertain", sources: [] },
  ],
  steps: [
    { id: "n1", title: "Create a public connection", desc: "In Notion's developer portal, with your redirect URI(s).", who: "you", why: "Needs your Notion login.", time: "10 min", conf: "sourced", sources: ["notion-auth"] },
    { id: "n2", title: "Choose the install scope", desc: "Any workspace, or selected workspaces only. It's permanent, so decide before you save.", who: "you", why: "A product decision; your agent can advise.", time: "2 min", conf: "sourced", sources: ["notion-auth"] },
    { id: "n3", title: "Submit for review and make it public", desc: "The authorization URL only appears after submission.", who: "you", why: "Submitted from your account.", time: "5 min", conf: "sourced", sources: ["notion-auth"] },
    { id: "n6", title: "Optional: list in Notion's Marketplace", desc: "Only connections installable in \"Any workspace\" can be listed. Notion replies within 5–10 business days.", who: "you", why: "A listing submitted from your account.", time: "30 min", conf: "sourced", sources: ["notion-listing"] },
    { id: "n4", title: "Add the credentials to Composio", desc: "Client ID and secret only; Notion doesn't use scopes.", who: "agent", time: "5 min", conf: "sourced", sources: ["composio-notion", "composio-custom"], via: "composio" },
    { id: "n5", title: "Tell users which pages to share", desc: "Sharing a parent page shares its children. Users can change access later in Settings → Connections.", who: "agent", time: "10 min", conf: "sourced", sources: ["notion-auth", "composio-notion"] },
  ],
  blockers: [
    { title: "404 when creating a database", why: "The parent page isn't shared with the connection.", next: "Ask the user to share the parent page (Settings → Connections), then retry.", freq: "common", conf: "sourced", sources: ["composio-notion"] },
    { title: "Can't read or write rows", why: "The database hasn't been shared with the connection.", next: "Share the database itself with the connection.", freq: "common", conf: "sourced", sources: ["composio-notion"] },
    { title: "An older connection stopped working", why: "Reconnecting the same user can invalidate the older refresh token.", next: "Keep one active connection per user per app.", freq: "occasional", conf: "sourced", sources: ["composio-notion"] },
    { title: "Review criteria and timing are unclear", why: "Notion's docs mention the review but don't describe it.", next: "Submit early and treat the timing as unknown in your plan.", freq: "occasional", conf: "uncertain", sources: ["notion-auth"] },
  ],
  tradeoffs: [
    { k: "time to launch", managed: "Today", own: "Minutes, plus Notion's review" },
    { k: "shown as the actor", managed: "Composio", own: "Your name and logo" },
    { k: "tokens", managed: "Under Composio's connection", own: "Isolated to your product" },
    { k: "best for", managed: "Prototypes", own: "Production" },
  ],
  sources: [
    { id: "notion-auth", title: "Authorization (public connections)", url: "https://developers.notion.com/guides/get-started/authorization", type: "official docs" },
    { id: "notion-listing", title: "Marketplace listing", url: "https://developers.notion.com/guides/get-started/marketplace-listing", type: "official docs" },
    { id: "composio-notion", title: "Notion toolkit", url: "https://docs.composio.dev/toolkits/notion", type: "composio docs" },
    { id: "composio-custom", title: "Managed vs custom auth", url: "https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app", type: "composio docs" },
  ],
  uncertain: [
    { text: "How long Notion's review takes, and what it checks", why: "The docs mention a review but give no criteria or timeline." },
    { text: "Which company details are needed to go public", why: "Not confirmed in the current docs." },
    { text: "How long setup takes", why: "Our estimate. Not yet timed by an agent run." },
  ],
  tested: [
    {date: "29 Oct 2026", tried: "Opened Notion's authorization docs", result: "Redirected to a new address (developers.notion.com/guides/get-started/authorization). We updated our links.", ok: true, url: "https://developers.notion.com/guides/get-started/authorization"},
    {date: "29 Oct 2026", tried: "Checked every source link in this guide", result: "All 4 load.", ok: true},
  ],
  next: { label: "Create a public connection", sub: "About 10 minutes. You'll need your Notion login.", href: "https://developers.notion.com/guides/get-started/authorization" },
};
