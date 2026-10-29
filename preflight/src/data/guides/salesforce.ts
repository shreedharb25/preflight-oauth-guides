import type { Guide } from "@/lib/types";

// Source: research/salesforce.md (checked 2026-10-29). Nothing here has been agent-tested yet.
export const salesforce: Guide = {
  slug: "salesforce",
  name: "Salesforce",
  provider: "Salesforce",
  mono: "SF",
  title: "Your own Salesforce app",
  summary:
    "For agents that read and update CRM records. Creating the app takes about an hour, but Salesforce changed the rules in 2025–26: new apps are External Client Apps, and each customer org's admin must install or approve yours.",
  checked: "29 Oct 2026",
  origin: "library",
  managed: "yes",
  needOwnApp: {
    answer: "Not yet, if you're prototyping.",
    text: "Composio manages a Salesforce app. Either way, a customer's org can block any app its admin hasn't installed or approved, so plan for the admin step even on the managed app.",
    when: [
      "Your brand should appear when users connect",
      "A customer uses a private or regional Salesforce domain",
      "You want your own rate limits and refresh-token budget",
      "You plan to list on AppExchange",
    ],
    sources: ["composio-salesforce", "composio-custom"],
  },
  agent: {
    verdict: "Yes, partly",
    tagline:
      "Can prepare the External Client App settings, add credentials and the customer's domain to Composio, and draft the admin install request. You create the app in Salesforce Setup and handle AppExchange.",
  },
  defaultUc: "customers",
  useCases: [
    {
      id: "own", label: "Your own org", scope: "api, refresh_token", scopeClass: "your admin approves",
      difficulty: "easy", diffReason: "You create and approve the app in your own org. No Salesforce review.", diffConf: "sourced", diffSources: ["sf-ecas", "composio-salesforce"],
      effort: { num: "1", unit: "hr", note: "Estimate. Create the External Client App and test.", conf: "uncertain" },
      wait: null,
      cost: { value: "Free", note: "No fee mentioned for External Client Apps.", conf: "uncertain" },
      timeline: [
        { label: "Create the app", dur: "~45 min", wait: false, flex: 3 },
        { label: "Test", dur: "~15 min", wait: false, flex: 1 },
      ],
      callout: "",
    },
    {
      id: "customers", label: "Customers' orgs", scope: "api, refresh_token", scopeClass: "customer admin approves",
      difficulty: "medium", diffReason: "Since Sept 2025, users can't authorise an app their org hasn't installed, unless they hold a special permission.", diffConf: "sourced", diffSources: ["sf-restrictions", "composio-salesforce"],
      effort: { num: "1–2", unit: "hrs", note: "Estimate, plus an install request to each customer's admin.", conf: "uncertain" },
      wait: { num: "per", unit: "customer", note: "Each org's admin installs or approves the app. That timing is theirs.", conf: "sourced", sources: ["sf-restrictions", "composio-salesforce"] },
      cost: { value: "Free", note: "No fee mentioned for External Client Apps.", conf: "uncertain" },
      timeline: [
        { label: "Create the app", dur: "~1 hr", wait: false, flex: 2 },
        { label: "Customer admin installs it", dur: "up to them", wait: true, flex: 5 },
      ],
      callout: "Send the admin note the day a customer signs. Nobody in their org can connect until it's handled.",
    },
    {
      id: "appexchange", label: "List on AppExchange", scope: "api, refresh_token + security review", scopeClass: "security review",
      difficulty: "hard", diffReason: "An AppExchange listing needs Salesforce's security review.", diffConf: "sourced", diffSources: ["sf-review"],
      effort: { num: "days", unit: "", note: "Estimate. Preparing for a security review is substantial work.", conf: "uncertain" },
      wait: { num: "3–4", unit: "wks", note: "Completeness check 1–2 weeks; the review report arrives about 3–4 weeks after submission.", conf: "sourced", sources: ["sf-review"] },
      cost: { value: "$999", note: "Per review attempt for paid apps. Free for free apps (one docs version; confirm before budgeting).", conf: "sourced", sources: ["sf-review"] },
      timeline: [
        { label: "Prepare", dur: "days", wait: false, flex: 3 },
        { label: "Completeness check", dur: "1–2 wks", wait: true, flex: 4 },
        { label: "Security review report", dur: "~3–4 wks after submitting", wait: true, flex: 6 },
      ],
      callout: "You don't need AppExchange to connect to customers' orgs. List only if you want the distribution.",
    },
  ],
  requirements: [
    { id: "r1", label: "A Salesforce org to create the app in", note: "A Developer Edition org is the usual choice.", who: "you", conf: "uncertain", sources: [] },
    { id: "r2", label: "Each customer's My Domain subdomain", note: "For example your-company.my, not the generic login domain.", who: "agent", conf: "sourced", sources: ["composio-salesforce"], uses: ["customers", "appexchange"] },
    { id: "r3", label: "A customer admin who will install your app", note: "Name them at signup.", who: "you", conf: "sourced", sources: ["sf-restrictions"], uses: ["customers", "appexchange"] },
    { id: "r4", label: "Customers on an edition with API access", note: "API access depends on the Salesforce edition.", who: "you", conf: "uncertain", sources: [] },
  ],
  steps: [
    { id: "f1", title: "Create an External Client App", desc: "In Setup, with OAuth enabled, your callback URL and scopes. New Connected Apps are disabled by default since Spring '26.", who: "you", why: "Needs your Salesforce admin login.", time: "20 min", conf: "sourced", sources: ["sf-ecas"] },
    { id: "f2", title: "Copy the consumer key and secret", desc: "Store them in your secret manager.", who: "you", why: "Shown in your logged-in Setup.", time: "5 min", conf: "uncertain", sources: [] },
    { id: "f3", title: "Add credentials and the org's subdomain to Composio", desc: "Create a custom auth config, using the customer's My Domain subdomain.", who: "agent", time: "10 min", conf: "sourced", sources: ["composio-salesforce", "composio-custom"], via: "composio" },
    { id: "f4", title: "Ask the customer's admin to install or approve the app", desc: "Under External Client App Settings, or OAuth Connected App Usage, in their Setup.", who: "agent", time: "10 min", conf: "sourced", sources: ["composio-salesforce", "sf-restrictions"], uses: ["customers", "appexchange"] },
    { id: "f5", title: "Pass the AppExchange security review", desc: "Submit, answer the completeness check, then wait for the report.", who: "you", why: "A business submission, with a fee for paid apps.", time: "weeks", conf: "sourced", sources: ["sf-review"], uses: ["appexchange"] },
  ],
  blockers: [
    { title: "OAUTH_APPROVAL_ERROR_GENERIC or \"app must be installed into org\"", why: "The org hasn't installed or approved your app.", next: "The org admin approves or installs it in Setup, then the user retries.", freq: "common", conf: "sourced", sources: ["composio-salesforce"], uses: ["customers", "appexchange"] },
    { title: "URL_NOT_RESET", why: "The connection used the generic login subdomain.", next: "Use the org's My Domain subdomain and retry.", freq: "common", conf: "sourced", sources: ["composio-salesforce"] },
    { title: "Older connections suddenly break", why: "Salesforce allows only 5 active refresh tokens per user per app; a sixth revokes the oldest.", next: "Avoid reconnecting the same user repeatedly.", freq: "occasional", conf: "sourced", sources: ["composio-salesforce"] },
    { title: "Can't create a Connected App", why: "New Connected App creation is disabled by default since Spring '26.", next: "Create an External Client App instead, or ask Salesforce Support to enable the permission.", freq: "common", conf: "sourced", sources: ["sf-ecas"] },
  ],
  adminAsk: {
    title: "Send this to your customer's Salesforce admin",
    text: "We've built an integration for [YOUR PRODUCT] that connects to your Salesforce org. Salesforce now blocks apps an org hasn't installed, so an admin needs to approve ours: Setup → External Client App Settings (or OAuth Connected App Usage) → find [APP NAME] → install or approve. It requests: [SCOPES]. Your My Domain is also needed: [YOUR-COMPANY].my.salesforce.com.",
    sources: ["composio-salesforce", "sf-restrictions"],
  },
  tradeoffs: [
    { k: "time to launch", managed: "Today", own: "About an hour" },
    { k: "org admin approval", managed: "Still needed", own: "Still needed" },
    { k: "custom domains", managed: "Limited", own: "Supported" },
    { k: "best for", managed: "Pilots", own: "Production and AppExchange" },
  ],
  sources: [
    { id: "sf-ecas", title: "Create a Connected App in your org (Spring '26 change)", url: "https://developer.salesforce.com/docs/platform/sfdx-dev/guide/sfdx-dev-auth-connected-app.html", type: "official docs" },
    { id: "sf-restrictions", title: "Connected app usage restrictions (vendor summary)", url: "https://support.airtable.com/articles/5478596596-salesforce-connected-apps-security-update", type: "third party" },
    { id: "sf-review", title: "How the AppExchange security review works", url: "https://developer.salesforce.com/docs/atlas.en-us.packagingGuide.meta/packageGuide/security_review_how_it_works.htm", type: "official docs" },
    { id: "composio-salesforce", title: "Salesforce toolkit", url: "https://docs.composio.dev/toolkits/salesforce", type: "composio docs" },
    { id: "composio-custom", title: "Managed vs custom auth", url: "https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app", type: "composio docs" },
  ],
  uncertain: [
    { text: "Exact rollout dates of the Sept 2025 restrictions", why: "From vendor notices; dates vary slightly between them." },
    { text: "Which Salesforce editions include API access", why: "General knowledge; not checked against Salesforce's pages." },
    { text: "Current AppExchange fees", why: "Older docs list different fees; confirm before budgeting." },
  ],
  tested: [
    {date: "29 Oct 2026", tried: "Checked every source link in this guide", result: "All 5 load in a browser. Salesforce's docs block automated checks (HTTP 403), so we opened them by hand.", ok: true},
  ],
  next: { label: "Create an External Client App", sub: "About 20 minutes in Salesforce Setup. You'll need admin access.", href: "https://developer.salesforce.com/docs/platform/sfdx-dev/guide/sfdx-dev-auth-connected-app.html" },
};
