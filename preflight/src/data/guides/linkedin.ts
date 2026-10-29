import type { Guide } from "@/lib/types";

// Source: research/linkedin.md (checked 2026-10-29). Nothing here has been agent-tested yet.
export const linkedin: Guide = {
  slug: "linkedin",
  name: "LinkedIn",
  provider: "LinkedIn",
  mono: "LI",
  title: "Your own LinkedIn app",
  summary:
    "For agents that sign users in, post for them or manage company pages. Sign-in and posting as a person are self-serve. Company pages, ads and sales tools need an application to a partner program, and you can be rejected.",
  checked: "29 Oct 2026",
  origin: "library",
  managed: "yes",
  needOwnApp: {
    answer: "Depends on what you post.",
    text: "Composio manages basic LinkedIn, but its app is shared with strict rate limits, and LinkedIn blocks posting as a person and reading organisation roles in the same app. If you need both, you need your own.",
    when: [
      "You hit 429 errors on the shared app",
      "You need to post as a person and manage organisations",
      "You need company pages, ads or analytics",
    ],
    sources: ["composio-linkedin"],
  },
  agent: {
    verdict: "Partly",
    tagline:
      "Can prepare the app settings, draft the request to your Page's super admin and the partner application, and script the screencast. You create the app, get it verified by the Page and apply.",
  },
  defaultUc: "share",
  useCases: [
    {
      id: "signin", label: "Sign in", scope: "openid, profile, email", scopeClass: "open, self-serve",
      difficulty: "easy", diffReason: "Sign In with LinkedIn using OpenID Connect is an open product: add it yourself.", diffConf: "sourced", diffSources: ["li-access"],
      effort: { num: "30", unit: "min", note: "Estimate. Create the app and add the product.", conf: "uncertain" },
      wait: null,
      cost: { value: "Free", note: "No fee mentioned for open products.", conf: "uncertain" },
      timeline: [
        { label: "Create the app", dur: "~20 min", wait: false, flex: 3 },
        { label: "Test", dur: "~10 min", wait: false, flex: 1 },
      ],
      callout: "",
    },
    {
      id: "share", label: "Post as a person", scope: "w_member_social", scopeClass: "open, self-serve",
      difficulty: "easy", diffReason: "Share on LinkedIn is an open product: post, comment and like for the signed-in member.", diffConf: "sourced", diffSources: ["li-access"],
      effort: { num: "30", unit: "min", note: "Estimate. Create the app and add the product.", conf: "uncertain" },
      wait: null,
      cost: { value: "Free", note: "No fee mentioned for open products.", conf: "uncertain" },
      timeline: [
        { label: "Create the app", dur: "~20 min", wait: false, flex: 3 },
        { label: "Test", dur: "~10 min", wait: false, flex: 1 },
      ],
      callout: "",
    },
    {
      id: "pages", label: "Manage company pages", scope: "w_organization_social, r_organization_social, rw_organization_admin", scopeClass: "partner vetting",
      difficulty: "gated", diffReason: "The Community Management API is only for registered organisations, after LinkedIn vets your application. Rejection means starting over.", diffConf: "sourced", diffSources: ["li-cm"],
      effort: { num: "days", unit: "", note: "Estimate: build within the development tier, then record a screencast for the upgrade.", conf: "uncertain" },
      wait: { num: "Unknown", unit: "", note: "Two reviews: development tier, then standard tier. LinkedIn publishes no timeline.", conf: "uncertain", sources: ["li-cm"] },
      cost: { value: "Free", note: "No fee mentioned for the partner program.", conf: "uncertain" },
      timeline: [
        { label: "Verify the app with your Page", dur: "depends on your admin", wait: true, flex: 2 },
        { label: "Development tier review", dur: "not published", wait: true, flex: 4 },
        { label: "Build within dev limits", dur: "days", wait: false, flex: 3 },
        { label: "Standard tier review", dur: "not published", wait: true, flex: 4 },
      ],
      callout: "Apply on a brand-new app with no other products, from a business email. If you're rejected, you can't reapply with the same app.",
    },
  ],
  requirements: [
    { id: "r1", label: "A LinkedIn Company Page", note: "Your app is associated with it.", who: "you", conf: "sourced", sources: ["li-cm"] },
    { id: "r2", label: "An app name without LinkedIn's names or logos", note: "No \"Linked\" or \"In\".", who: "agent", conf: "sourced", sources: ["li-cm"] },
    { id: "r3", label: "A Page super admin who will verify your app", note: "Needed before applying for partner products.", who: "you", conf: "sourced", sources: ["li-cm"], uses: ["pages"] },
    { id: "r4", label: "A registered legal organisation and business email", note: "Personal email addresses won't pass the vetting.", who: "you", conf: "sourced", sources: ["li-cm"], uses: ["pages"] },
    { id: "r5", label: "Website, address and privacy policy", note: "Asked for in the access request.", who: "agent", conf: "sourced", sources: ["li-cm"], uses: ["pages"] },
    { id: "r6", label: "A screencast under 5 minutes", note: "Full OAuth flow and every feature that uses member data. For the standard tier.", who: "you", conf: "sourced", sources: ["li-cm"], uses: ["pages"] },
  ],
  steps: [
    { id: "l1", title: "Create an app in the LinkedIn Developer Portal", desc: "Link it to your Company Page.", who: "you", why: "Needs your LinkedIn login: the new-app page redirects to the developer login.", time: "10 min", conf: "tested", sources: ["agent-li", "li-access", "li-cm"] },
    { id: "l2", title: "Add the open products you need", desc: "Sign In with LinkedIn using OpenID Connect, and Share on LinkedIn.", who: "you", why: "Added in your logged-in portal.", time: "5 min", conf: "sourced", sources: ["li-access"], uses: ["signin", "share"] },
    { id: "l3", title: "Draft the verification request for your Page's super admin", desc: "Your Page must verify the app before you can request partner products.", who: "agent", time: "5 min", conf: "sourced", sources: ["li-cm"], details: "Your agent drafts the request; the super admin approves it on LinkedIn.", uses: ["pages"] },
    { id: "l4", title: "Request the Community Management API", desc: "On a new app with no other API products, using a verified business email.", who: "you", why: "A business application in your company's name.", time: "30 min", conf: "sourced", sources: ["li-cm"], uses: ["pages"] },
    { id: "l5", title: "Build within the development tier", desc: "500 calls a day per app, 100 per member, no batch calls or webhooks, for up to 12 months.", who: "agent", time: "days", conf: "sourced", sources: ["li-cm"], uses: ["pages"] },
    { id: "l6", title: "Apply for the standard tier", desc: "Submit the screencast and test credentials if asked.", who: "you", why: "Recorded and submitted by you.", time: "1 hr", conf: "sourced", sources: ["li-cm"], uses: ["pages"] },
    { id: "l7", title: "Add the credentials to Composio", desc: "Create a custom auth config with your client ID and secret.", who: "agent", time: "5 min", conf: "sourced", sources: ["composio-linkedin", "composio-custom"], via: "composio" },
  ],
  blockers: [
    { title: "\"Request access\" is greyed out", why: "The app already has another API product.", next: "Request the Community Management API on a fresh app.", freq: "common", conf: "sourced", sources: ["li-cm"], uses: ["pages"] },
    { title: "Rejected for using a personal email", why: "Personal email addresses won't pass the vetting process.", next: "Reapply from a verified business email, on a new app.", freq: "common", conf: "sourced", sources: ["li-cm"], uses: ["pages"] },
    { title: "Rejected, and can't reapply", why: "LinkedIn doesn't allow reapplying with the same app.", next: "Review the requirements, create a new app and apply again.", freq: "occasional", conf: "sourced", sources: ["li-cm"], uses: ["pages"] },
    { title: "429 errors on the managed app", why: "Composio's default app is shared, with strict limits.", next: "Use your own app.", freq: "common", conf: "sourced", sources: ["composio-linkedin"] },
    { title: "Can't post as a person and as an org together", why: "LinkedIn doesn't allow w_member_social with r_organization_admin.", next: "Use your own app with the permissions you've been approved for.", freq: "occasional", conf: "sourced", sources: ["composio-linkedin"] },
  ],
  tradeoffs: [
    { k: "time to launch", managed: "Today", own: "30 min (open products) to unknown (partner)" },
    { k: "rate limits", managed: "Shared, strict", own: "Your own" },
    { k: "company pages", managed: "Limited by scope conflicts", own: "After partner vetting" },
    { k: "best for", managed: "Sign-in and light posting", own: "Production and company pages" },
  ],
  sources: [
    { id: "li-access", title: "Getting access to LinkedIn APIs", url: "https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access", type: "official docs" },
    { id: "li-cm", title: "Community Management API: access and vetting", url: "https://learn.microsoft.com/en-us/linkedin/marketing/community-management/community-management-api-migration-guide", type: "official docs" },
    { id: "agent-li", title: "Our agent opened the new-app page while signed out (29 Oct 2026)", url: "https://www.linkedin.com/developers/apps/new", type: "tested by our agent" },
    { id: "composio-linkedin", title: "LinkedIn toolkit", url: "https://docs.composio.dev/toolkits/linkedin", type: "composio docs" },
    { id: "composio-custom", title: "Managed vs custom auth", url: "https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app", type: "composio docs" },
  ],
  uncertain: [
    { text: "How long LinkedIn's vetting takes", why: "LinkedIn publishes no timeline for either tier." },
    { text: "Ads, Sales Navigator and Talent access", why: "Each is a separate partner application; not covered in detail here." },
    { text: "How long setup takes", why: "Our estimates. Not yet timed by an agent run." },
  ],
  tested: [
    {date: "29 Oct 2026", tried: "Opened LinkedIn's new-app page while signed out", result: "Redirected to the LinkedIn developer login.", ok: true, url: "https://www.linkedin.com/developers/apps/new"},
    {date: "29 Oct 2026", tried: "Searched for developers' reported vetting times", result: "Found none we could cite. LinkedIn's timing stays unknown.", ok: false},
    {date: "29 Oct 2026", tried: "Checked every source link in this guide", result: "All 5 load.", ok: true},
  ],
  next: { label: "Create a LinkedIn app", sub: "About 10 minutes. You'll need your LinkedIn login and a Company Page.", href: "https://www.linkedin.com/developers/apps/new" },
};
