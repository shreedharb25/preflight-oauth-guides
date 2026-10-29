import type { Guide } from "@/lib/types";

// Source: research/microsoft-365.md (checked 2026-10-29). Nothing here has been agent-tested yet.
export const microsoft365: Guide = {
  slug: "microsoft-365",
  name: "Microsoft 365",
  provider: "Microsoft",
  mono: "MS",
  title: "Your own Microsoft 365 app",
  summary:
    "For agents that sign users in with Microsoft, or read and send Outlook mail and Teams messages. Registering the app is quick. The real hurdles are publisher verification and each customer's IT admin.",
  checked: "29 Oct 2026",
  origin: "library",
  managed: "yes",
  needOwnApp: {
    answer: "Not yet, if you're prototyping.",
    text: "Composio manages Outlook, Teams, Excel, OneDrive and SharePoint. But admin consent and publisher verification are set per customer tenant: switching Composio connections alone won't fix \"Needs admin approval\".",
    when: [
      "Your brand and verified badge should appear on the consent screen",
      "Enterprise customers only allow apps from verified publishers",
      "You need permissions beyond Composio's defaults",
    ],
    sources: ["composio-outlook"],
  },
  agent: {
    verdict: "Yes, partly",
    tagline:
      "Can prepare the app registration, add credentials to Composio and draft the consent request for your customers' IT admins. You register the app, enrol in the partner program and verify as a publisher.",
  },
  defaultUc: "mail",
  useCases: [
    {
      id: "signin", label: "Sign-in only", scope: "openid, profile, email", scopeClass: "basic sign-in",
      difficulty: "easy", diffReason: "Basic sign-in and profile aren't blocked for unverified publishers.", diffConf: "sourced", diffSources: ["ms-publisher"],
      effort: { num: "30", unit: "min", note: "Estimate. Register the app and test.", conf: "uncertain" },
      wait: null,
      cost: { value: "Free", note: "Microsoft doesn't charge for app registration or verification.", conf: "sourced", sources: ["ms-publisher"] },
      timeline: [
        { label: "Register the app", dur: "~20 min", wait: false, flex: 3 },
        { label: "Test sign-in", dur: "~10 min", wait: false, flex: 2 },
      ],
      callout: "",
    },
    {
      id: "mail", label: "Read or send mail", scope: "Mail.Read, Mail.Send (delegated)", scopeClass: "user or admin consent",
      difficulty: "medium", diffReason: "Users can consent to their own mailbox by default, but many tenants only allow verified publishers, or need an admin.", diffConf: "sourced", diffSources: ["ms-consent", "ms-publisher"],
      effort: { num: "1–2", unit: "hrs", note: "Estimate, if your partner account is already verified.", conf: "uncertain" },
      wait: { num: "3–5", unit: "days", note: "Partner account verification (Microsoft's typical figure); publisher verification then takes minutes. Each customer's admin may still need to consent.", conf: "sourced", sources: ["ms-partner-verify", "ms-publisher", "composio-outlook"] },
      cost: { value: "Free", note: "No charge for publisher verification and no licence needed.", conf: "sourced", sources: ["ms-publisher"] },
      timeline: [
        { label: "Register the app", dur: "~30 min", wait: false, flex: 2 },
        { label: "Partner account verification", dur: "3–5 business days", wait: true, flex: 5 },
        { label: "Publisher verification", dur: "minutes", wait: false, flex: 1 },
        { label: "Customer admin consent", dur: "up to them", wait: true, flex: 4 },
      ],
      callout: "Enrol in the AI Cloud Partner Program first: it's the slowest part (3–5 business days, sometimes weeks). Then verifying the app takes minutes.",
    },
    {
      id: "org", label: "All mailboxes (app-only)", scope: "Mail.Read (application)", scopeClass: "admin consent always",
      difficulty: "medium", diffReason: "Org-wide access can't be granted by a regular user. Every customer's admin must consent.", diffConf: "sourced", diffSources: ["ms-consent"],
      effort: { num: "1–2", unit: "hrs", note: "Estimate, plus the admin conversation per customer.", conf: "uncertain" },
      wait: { num: "per", unit: "customer", note: "Each tenant's admin must grant consent before anything works.", conf: "sourced", sources: ["ms-consent", "composio-outlook"] },
      cost: { value: "Free", note: "No charge for registration or verification.", conf: "sourced", sources: ["ms-publisher"] },
      timeline: [
        { label: "Register the app", dur: "~30 min", wait: false, flex: 2 },
        { label: "Publisher verification", dur: "minutes, once eligible", wait: false, flex: 1 },
        { label: "Customer admin consent", dur: "up to them", wait: true, flex: 6 },
      ],
      callout: "Admin consent is the critical path for every customer. Send the admin note the day a customer signs.",
    },
  ],
  requirements: [
    { id: "r1", label: "A Microsoft Entra work or school account", note: "Apps registered with a personal Microsoft account can't be publisher verified.", who: "you", conf: "sourced", sources: ["ms-publisher"] },
    { id: "r2", label: "A verified custom domain", note: "The publisher domain can't be *.onmicrosoft.com.", who: "you", conf: "sourced", sources: ["ms-publisher"], uses: ["mail", "org"] },
    { id: "r3", label: "An AI Cloud Partner Program account, verified", note: "Its email domain must match your publisher domain.", who: "you", conf: "sourced", sources: ["ms-publisher"], uses: ["mail", "org"] },
    { id: "r4", label: "The right admin roles", note: "Application Administrator in Entra and Partner Admin in Partner Center, signed in with MFA.", who: "you", conf: "sourced", sources: ["ms-publisher"], uses: ["mail", "org"] },
    { id: "r5", label: "A decision on account types", note: "Work accounts only, or personal accounts too. Some features fail for personal Outlook.com accounts.", who: "agent", conf: "sourced", sources: ["composio-outlook"] },
  ],
  steps: [
    { id: "m1", title: "Register a multitenant app in Entra ID", desc: "Set the redirect URI and the delegated or application permissions you need.", who: "you", why: "Needs your Entra admin login.", time: "15 min", conf: "uncertain", sources: [] },
    { id: "m2", title: "Create a client secret", desc: "Store it in your secret manager, never in the repo.", who: "you", why: "Shown once, in your logged-in portal.", time: "5 min", conf: "uncertain", sources: [] },
    { id: "m3", title: "Enrol in the AI Cloud Partner Program", desc: "And pass its business verification: legal registration, business email, identity and domain documents. Microsoft says most take 3–5 business days.", who: "you", why: "A business enrolment in your company's name, with government ID.", time: "3–5 days", conf: "sourced", sources: ["ms-publisher", "ms-partner-verify"], details: "Some developers report much longer waits, such as 40 days stuck without a response. Make sure your business name and address match official records exactly.", uses: ["mail", "org"] },
    { id: "m4", title: "Set the publisher domain and verify", desc: "Associate your Partner ID with the app registration.", who: "you", why: "Needs both Entra and Partner Center admin roles, with MFA.", time: "minutes", conf: "sourced", sources: ["ms-publisher"], uses: ["mail", "org"] },
    { id: "m5", title: "Add the credentials to Composio", desc: "Create a custom auth config with your client ID and secret.", who: "agent", time: "5 min", conf: "sourced", sources: ["composio-outlook", "composio-custom"], via: "composio" },
    { id: "m6", title: "Send customers' admins a consent request", desc: "With an admin consent link and what each permission is for.", who: "agent", time: "10 min", conf: "sourced", sources: ["composio-outlook"], uses: ["mail", "org"] },
  ],
  blockers: [
    { title: "\"Needs admin approval\"", why: "The tenant's consent policy doesn't let users approve these permissions.", next: "A tenant admin grants consent (App registrations → API permissions, or Enterprise applications). Then users reconnect with their own accounts.", freq: "common", conf: "sourced", sources: ["composio-outlook"], uses: ["mail", "org"] },
    { title: "The admin's mailbox got connected instead", why: "The admin signed in on the OAuth screen while granting consent.", next: "Admins should grant consent in Entra, not by connecting. Users then connect themselves.", freq: "occasional", conf: "sourced", sources: ["composio-outlook"], uses: ["mail", "org"] },
    { title: "\"Unverified publisher\" warning", why: "Since November 2020, users can't consent to most new multitenant apps from unverified publishers when risk-based step-up consent is on.", next: "Complete publisher verification.", freq: "common", conf: "sourced", sources: ["ms-publisher"], uses: ["mail", "org"] },
    { title: "Partner verification is slow or stuck", why: "Usually 3–5 business days, but mismatched business details trigger extra review. One developer reported 40 days stuck.", next: "Match your legal name and address to official records exactly, use a business email, and answer information requests quickly.", adds: "days to weeks", freq: "occasional", conf: "sourced", sources: ["ms-partner-verify", "ms-forum-40d"], uses: ["mail", "org"] },
    { title: "404 for calendar actions", why: "The account is a personal Outlook.com account, not a work or school one.", next: "Use a work or school account in the organisation's verified domain.", freq: "occasional", conf: "sourced", sources: ["composio-outlook"] },
  ],
  adminAsk: {
    title: "Send this to your customer's Microsoft 365 admin",
    text: "We've built an integration for [YOUR PRODUCT] that needs your approval in Microsoft Entra. Your tenant requires admin consent for these permissions: [PERMISSIONS], used to [WHAT IT DOES]. Please grant consent here: [ADMIN CONSENT LINK], or in Entra under Enterprise applications. Please don't connect your own mailbox while doing this; your team members will connect their own accounts afterwards.",
    sources: ["composio-outlook", "ms-consent"],
  },
  tradeoffs: [
    { k: "time to launch", managed: "Today", own: "Hours, plus partner verification" },
    { k: "consent screen shows", managed: "Composio", own: "Your name and verified badge" },
    { k: "admin consent", managed: "Still needed per tenant", own: "Still needed per tenant" },
    { k: "best for", managed: "Prototypes and pilots", own: "Enterprise customers" },
  ],
  sources: [
    { id: "ms-publisher", title: "Publisher verification overview", url: "https://learn.microsoft.com/en-us/entra/identity-platform/publisher-verification-overview", type: "official docs" },
    { id: "ms-consent", title: "Configure how users consent to applications", url: "https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/configure-user-consent", type: "official docs" },
    { id: "ms-partner-verify", title: "Understand the verification process in Partner Center", url: "https://learn.microsoft.com/en-us/partner-center/verification-responses", type: "official docs" },
    { id: "ms-forum-40d", title: "Developer report: Partner Center verification stuck 40 days", url: "https://techcommunity.microsoft.com/discussions/partnercomplianceforum/partner-center-business-verification-stuck-for-40-days-no-way-to-contact-support/4540835", type: "community" },
    { id: "composio-outlook", title: "Outlook toolkit", url: "https://docs.composio.dev/toolkits/outlook", type: "composio docs" },
    { id: "composio-custom", title: "Managed vs custom auth", url: "https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app", type: "composio docs" },
  ],
  uncertain: [
    { text: "How long partner verification takes for you", why: "Microsoft says 3–5 business days in most cases; developers report waits of several weeks." },
    { text: "The exact portal steps for registering the app", why: "From general knowledge; not in the pages we read." },
    { text: "How long setup takes", why: "Our estimates. Not yet timed by an agent run." },
  ],
  tested: [
    {date: "29 Oct 2026", tried: "Opened the Microsoft Entra admin center", result: "Loads. Registering an app needs an Entra work or school sign-in, which we don't use for tests.", ok: true, url: "https://entra.microsoft.com"},
    {date: "29 Oct 2026", tried: "Checked every source link in this guide", result: "All 6 load.", ok: true},
  ],
  next: { label: "Register your app in Microsoft Entra", sub: "About 15 minutes. You'll need an Entra work or school admin account.", href: "https://entra.microsoft.com" },
};
