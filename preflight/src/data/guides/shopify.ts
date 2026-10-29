import type { Guide } from "@/lib/types";

// Source: research/shopify.md (checked 2026-10-29). Nothing here has been agent-tested yet.
export const shopify: Guide = {
  slug: "shopify",
  name: "Shopify",
  provider: "Shopify",
  mono: "SH",
  title: "Your own Shopify app",
  summary:
    "For agents that manage products, orders or customers in a store. One store is quick and review-free. Many stores means Shopify's App Store review, and customer names or emails need a separate data-protection approval.",
  checked: "29 Oct 2026",
  origin: "library",
  managed: "no",
  needOwnApp: {
    answer: "Yes. There's no managed option.",
    text: "Composio doesn't provide a managed Shopify app, so you register your own. Composio's docs also warn that its default app can show \"App not found\" while under review.",
    when: ["Always: there is no managed app for Shopify"],
    sources: ["composio-shopify"],
  },
  agent: {
    verdict: "Yes, partly",
    tagline:
      "Can recommend the distribution method, pick the minimum data, run test flows on a development store and add credentials to Composio. You create the app, register for the App Store and handle review.",
  },
  defaultUc: "public",
  useCases: [
    {
      id: "single", label: "One store", scope: "custom distribution", scopeClass: "no review",
      difficulty: "easy", diffReason: "Custom distribution to one store (or one Plus organisation) needs no Shopify review, including for customer data.", diffConf: "sourced", diffSources: ["shopify-distribution", "shopify-pcd"],
      effort: { num: "1", unit: "hr", note: "Estimate. Create, install and test.", conf: "uncertain" },
      wait: null,
      cost: { value: "Free", note: "The App Store fee doesn't apply to custom apps.", conf: "sourced", sources: ["shopify-fee"] },
      timeline: [
        { label: "Create the app", dur: "~30 min", wait: false, flex: 2 },
        { label: "Install and test", dur: "~30 min", wait: false, flex: 2 },
      ],
      callout: "",
    },
    {
      id: "public", label: "Many stores (App Store)", scope: "public distribution", scopeClass: "App Store review",
      difficulty: "hard", diffReason: "Public distribution requires Shopify's app review before stores can install.", diffConf: "sourced", diffSources: ["shopify-distribution", "shopify-review"],
      effort: { num: "2–3", unit: "hrs", note: "Estimate, plus polishing the app and listing.", conf: "uncertain" },
      wait: { num: "1–4", unit: "wks", note: "Commonly cited as 5–10 business days; developers report ~30 days at busy times.", conf: "sourced", sources: ["shopify-review-times"] },
      cost: { value: "$19", note: "One-time App Store registration per Partner account.", conf: "sourced", sources: ["shopify-fee"] },
      timeline: [
        { label: "Build and list", dur: "2–3 hrs", wait: false, flex: 2 },
        { label: "Register", dur: "5 min", wait: false, flex: 1 },
        { label: "App review", dur: "1–4 wks", wait: true, flex: 8 },
      ],
      callout: "Submit as soon as the app passes your own tests on a development store. Review volume, not your app, sets most of the wait.",
    },
    {
      id: "public-pii", label: "Many stores + customer names/emails", scope: "public distribution + protected customer data (Level 2)", scopeClass: "review + data approval",
      difficulty: "hard", diffReason: "Names, emails, phones or addresses need separate approval for public apps, plus seven extra security requirements.", diffConf: "sourced", diffSources: ["shopify-pcd"],
      effort: { num: "days", unit: "", note: "Estimate. Meeting the Level 2 data requirements is real engineering work.", conf: "uncertain" },
      wait: { num: "1–4+", unit: "wks", note: "App review, plus the data access request. The data review has no published timeline.", conf: "uncertain", sources: ["shopify-review-times", "shopify-pcd"] },
      cost: { value: "$19", note: "One-time registration; the security work is your own cost.", conf: "sourced", sources: ["shopify-fee"] },
      timeline: [
        { label: "Meet data requirements", dur: "days", wait: false, flex: 3 },
        { label: "Register and submit", dur: "15 min", wait: false, flex: 1 },
        { label: "App review + data request", dur: "1–4+ wks", wait: true, flex: 8 },
      ],
      callout: "Request only the customer fields you truly use. Shopify approves \"the minimum amount required\".",
    },
  ],
  requirements: [
    { id: "r1", label: "A Shopify Partner account", note: "Free. Where you create and manage apps.", who: "you", conf: "uncertain", sources: [] },
    { id: "r2", label: "A development store for testing", note: "Test on it before submitting.", who: "you", conf: "sourced", sources: ["shopify-review"] },
    { id: "r3", label: "A chosen distribution method", note: "Needed before you can request customer data access.", who: "agent", conf: "sourced", sources: ["shopify-pcd"] },
    { id: "r4", label: "App Store registration ($19)", note: "Once per Partner account; waived for custom-only developers.", who: "you", conf: "sourced", sources: ["shopify-fee"], uses: ["public", "public-pii"] },
    { id: "r5", label: "Level 2 data protections", note: "Encrypted backups, separate test data, access logs, incident response policy and more.", who: "agent", conf: "sourced", sources: ["shopify-pcd"], uses: ["public-pii"] },
  ],
  steps: [
    { id: "p1", title: "Create the app", desc: "In the Partner Dashboard or with the Shopify CLI, with your redirect URL.", who: "you", why: "Needs your Partner login.", time: "15 min", conf: "uncertain", sources: [] },
    { id: "p2", title: "Choose the distribution method", desc: "Custom for one store or one Plus organisation; public for many stores.", who: "agent", time: "5 min", conf: "sourced", sources: ["shopify-distribution"] },
    { id: "p3", title: "Request scopes and customer data fields", desc: "Request each protected field (name, email, phone, address) separately.", who: "you", why: "Requested in your Partner Dashboard.", time: "15 min", conf: "sourced", sources: ["shopify-pcd"], uses: ["public-pii"] },
    { id: "p4", title: "Test on a development store", desc: "Run every flow, including install and uninstall.", who: "agent", time: "30 min", conf: "sourced", sources: ["shopify-review"] },
    { id: "p5", title: "Meet the Level 2 data requirements", desc: "Encrypted backups, separated test data, data-loss prevention, limited staff access, strong passwords, access logs, incident response.", who: "agent", time: "days", conf: "sourced", sources: ["shopify-pcd"], details: "Your agent can implement and document most of these; you own the policies.", uses: ["public-pii"] },
    { id: "p6", title: "Register for the App Store and submit", desc: "Pay the $19 fee, build the listing, fix any issues on the review page, then submit.", who: "you", why: "Involves payment and your listing.", time: "1 hr", conf: "sourced", sources: ["shopify-fee", "shopify-review"], uses: ["public", "public-pii"] },
    { id: "p7", title: "Add the credentials to Composio", desc: "Create a custom auth config with your client ID and secret.", who: "agent", time: "5 min", conf: "sourced", sources: ["composio-shopify", "composio-custom"], via: "composio" },
  ],
  blockers: [
    { title: "Review status: Paused", why: "The app misses core requirements, so reviewers can't review it.", next: "Fix the issues listed in the email, then resubmit from the status banner.", freq: "occasional", conf: "sourced", sources: ["shopify-review"], uses: ["public", "public-pii"] },
    { title: "Review has taken weeks", why: "High submission volume.", next: "Community advice: contact Shopify support after about 30 days without a response.", freq: "occasional", conf: "sourced", sources: ["shopify-review-times"], uses: ["public", "public-pii"] },
    { title: "Orders older than ~60 days are missing", why: "Without read_all_orders, only recent orders are returned.", next: "Request read_all_orders and reconnect.", freq: "common", conf: "sourced", sources: ["composio-shopify"] },
    { title: "403 when updating orders", why: "The connection lacks order scopes.", next: "Reconnect with the right order scopes and retry.", freq: "occasional", conf: "sourced", sources: ["composio-shopify"] },
  ],
  tradeoffs: [
    { k: "availability", managed: "Not offered", own: "Required" },
    { k: "one store", managed: "n/a", own: "No review" },
    { k: "many stores", managed: "n/a", own: "App review + $19" },
  ],
  sources: [
    { id: "shopify-distribution", title: "Distribution methods", url: "https://shopify.dev/docs/apps/launch/distribution", type: "official docs" },
    { id: "shopify-pcd", title: "Protected customer data", url: "https://shopify.dev/docs/apps/launch/protected-customer-data", type: "official docs" },
    { id: "shopify-review", title: "App Store review process", url: "https://shopify.dev/docs/apps/launch/app-store-review/review-process", type: "official docs" },
    { id: "shopify-fee", title: "Shopify Partners glossary (registration fee)", url: "https://help.shopify.com/en/partners/partner-program/glossary", type: "official docs" },
    { id: "shopify-review-times", title: "Longer App Store review times (developer forum)", url: "https://community.shopify.dev/t/longer-app-store-review-times-what-you-need-to-know/31728", type: "community" },
    { id: "composio-shopify", title: "Shopify toolkit", url: "https://docs.composio.dev/toolkits/shopify", type: "composio docs" },
    { id: "composio-custom", title: "Managed vs custom auth", url: "https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app", type: "composio docs" },
  ],
  uncertain: [
    { text: "How long App Store review takes right now", why: "Shopify's page gives no durations; the figures come from its developer forums." },
    { text: "How long the customer data review takes", why: "No published timeline." },
    { text: "How long setup takes", why: "Our estimates. Not yet timed by an agent run." },
  ],
  tested: [
    {date: "29 Oct 2026", tried: "Opened Shopify's distribution docs (the next step)", result: "Loads.", ok: true, url: "https://shopify.dev/docs/apps/launch/distribution"},
    {date: "29 Oct 2026", tried: "Checked every source link in this guide", result: "All 7 load.", ok: true},
  ],
  next: { label: "Read Shopify's distribution options", sub: "5 minutes. Decide one store vs App Store before you build.", href: "https://shopify.dev/docs/apps/launch/distribution" },
};
