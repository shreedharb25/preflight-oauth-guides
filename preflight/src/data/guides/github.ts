import type { Guide } from "@/lib/types";

// Source: research/github.md (checked 2026-10-29). Nothing here has been agent-tested yet.
export const github: Guide = {
  slug: "github",
  name: "GitHub",
  provider: "GitHub",
  mono: "GH",
  title: "Your own GitHub app",
  summary:
    "For agents that sign users in with GitHub, read repositories, or open issues and pull requests. GitHub doesn't review apps, so the work is mostly setup, plus approval from your customer's organisation owner.",
  checked: "29 Oct 2026",
  origin: "library",
  managed: "yes",
  needOwnApp: {
    answer: "Not yet, if you're prototyping.",
    text: "Composio already provides a managed GitHub OAuth app, so you can connect users today. Some actions, like creating check runs, only work with a GitHub App, which you register yourself.",
    when: [
      "Your brand must appear when users authorise",
      "You need GitHub App features such as check runs",
      "You want your own rate limits",
      "Customer organisations require a vetted, installable app",
    ],
    sources: ["composio-github"],
  },
  agent: {
    verdict: "Yes, mostly",
    tagline:
      "Can recommend GitHub App vs OAuth app, prepare the settings, add the credentials to Composio and draft the note for org owners. You sign in, register the app and send users the install link.",
  },
  defaultUc: "read",
  useCases: [
    {
      id: "signin", label: "Sign-in only", scope: "read:user, user:email", scopeClass: "no review",
      difficulty: "easy", diffReason: "GitHub doesn't review apps. Register it and go.", diffConf: "sourced", diffSources: ["gh-apps-vs-oauth"],
      effort: { num: "10", unit: "min", note: "Estimate. Mostly filling in one form.", conf: "uncertain" },
      wait: null,
      cost: { value: "Free", note: "No fee to register an app.", conf: "uncertain" },
      timeline: [
        { label: "Register the app", dur: "~10 min", wait: false, flex: 3 },
        { label: "Test sign-in", dur: "~5 min", wait: false, flex: 2 },
      ],
      callout: "",
    },
    {
      id: "read", label: "Read repositories", scope: "GitHub App: Contents (read)", scopeClass: "no review",
      difficulty: "easy", diffReason: "No review from GitHub, but organisations can require owner approval.", diffConf: "sourced", diffSources: ["gh-apps-vs-oauth", "gh-oauth-restrictions"],
      effort: { num: "15", unit: "min", note: "Estimate. Plus sending users the install link.", conf: "uncertain" },
      wait: null, // GitHub doesn't review apps; org owner approval is shown in the timeline and the admin block
      cost: { value: "Free", note: "No fee to register an app.", conf: "uncertain" },
      timeline: [
        { label: "Register the GitHub App", dur: "~15 min", wait: false, flex: 3 },
        { label: "User installs it", dur: "minutes", wait: false, flex: 2 },
        { label: "Org owner approves (if required)", dur: "depends on them", wait: true, flex: 4 },
      ],
      callout: "Send customers the install link early. If their organisation restricts apps, an owner has to approve it and you can't speed that up.",
    },
    {
      id: "write", label: "Open issues and PRs", scope: "GitHub App: Issues, Pull requests (write)", scopeClass: "no review",
      difficulty: "easy", diffReason: "Same as reading: no GitHub review, possible org owner approval.", diffConf: "sourced", diffSources: ["gh-apps-vs-oauth", "gh-oauth-restrictions"],
      effort: { num: "15", unit: "min", note: "Estimate.", conf: "uncertain" },
      wait: null, // GitHub doesn't review apps; org owner approval is shown in the timeline and the admin block
      cost: { value: "Free", note: "No fee to register an app.", conf: "uncertain" },
      timeline: [
        { label: "Register the GitHub App", dur: "~15 min", wait: false, flex: 3 },
        { label: "User installs it", dur: "minutes", wait: false, flex: 2 },
        { label: "Org owner approves (if required)", dur: "depends on them", wait: true, flex: 4 },
      ],
      callout: "Ask for write permissions only on the repositories you need. Owners approve narrow requests faster.",
    },
  ],
  requirements: [
    { id: "r1", label: "A GitHub account or organisation to own the app", note: "Use an organisation so the app outlives any one person.", who: "you", conf: "sourced", sources: ["gh-apps-vs-oauth"] },
    { id: "r2", label: "Your callback (redirect) URL", note: "Where GitHub sends users after they authorise.", who: "agent", conf: "uncertain", sources: [] },
    { id: "r3", label: "A decision: GitHub App or OAuth app", note: "GitHub prefers GitHub Apps; use an OAuth app only for enterprise-level resources.", who: "agent", conf: "sourced", sources: ["gh-apps-vs-oauth"] },
  ],
  steps: [
    { id: "h1", title: "Choose GitHub App or OAuth app", desc: "GitHub says GitHub Apps are generally preferred: fine-grained permissions, access only to the repos chosen at install, short-lived tokens.", who: "agent", time: "2 min", conf: "sourced", sources: ["gh-apps-vs-oauth"], details: "Pick an OAuth app only if you need enterprise-level resources, which GitHub Apps can't be given permission to yet." },
    { id: "h2", title: "Register the app in Developer settings", desc: "Four required fields: app name, homepage URL, permissions, and where it can be installed. GitHub doesn't review it.", who: "you", why: "Needs your GitHub login: the registration page redirects to sign-in.", time: "~10 min", conf: "tested", sources: ["agent-gh", "gh-register"], details: "Your agent can prepare every value for you to paste in. Each account can own up to 100 GitHub Apps." },
    { id: "h3", title: "Generate the client secret (and private key for GitHub Apps)", desc: "Store them in your secret manager, never in the repo.", who: "you", why: "Secrets are shown once, in your logged-in session.", time: "2 min", conf: "uncertain", sources: [] },
    { id: "h4", title: "Add the credentials to Composio", desc: "Create a custom auth config with your client ID and secret, then pass it to your session.", who: "agent", time: "5 min", conf: "sourced", sources: ["composio-github", "composio-custom"], via: "composio" },
    { id: "h5", title: "Send users the installation link", desc: "For GitHub Apps, installing is a separate step from signing in. Composio doesn't generate this link for you.", who: "you", why: "You decide where the link appears in your product.", time: "5 min", conf: "sourced", sources: ["composio-github"], uses: ["read", "write"] },
  ],
  blockers: [
    { title: "A customer's organisation blocks your OAuth app", why: "OAuth app access restrictions are on by default for new organisations. Unapproved OAuth apps can't reach private org resources.", next: "The user requests approval and an org owner approves it. Or switch to a GitHub App, which isn't subject to these OAuth app policies.", freq: "common", conf: "sourced", sources: ["gh-oauth-restrictions", "gh-apps-vs-oauth"] },
    { title: "Tool calls fail after the user signed in", why: "For GitHub Apps, signing in and installing are separate steps.", next: "Ask the user to install the app and grant repository access, then retry.", freq: "occasional", conf: "sourced", sources: ["composio-github"] },
    { title: "Some actions don't work with OAuth tokens", why: "Actions such as creating check runs require GitHub App authentication.", next: "Register a GitHub App instead of an OAuth app.", freq: "occasional", conf: "sourced", sources: ["composio-github"] },
  ],
  adminAsk: {
    title: "Send this to your customer's GitHub org owner",
    text: "We've built an integration that needs access to selected repositories in your GitHub organisation. Your organisation restricts third-party apps, so an owner needs to approve it: Organisation settings → Third-party access (for OAuth apps) or approve the GitHub App installation request. We only request [PERMISSIONS] on [REPOSITORIES].",
    sources: ["gh-oauth-restrictions"],
  },
  tradeoffs: [
    { k: "time to launch", managed: "Today", own: "About 15 minutes" },
    { k: "users see", managed: "Composio's app", own: "Your app name" },
    { k: "permissions", managed: "OAuth scopes only", own: "GitHub App fine-grained permissions" },
    { k: "rate limits", managed: "Shared", own: "Your own" },
    { k: "best for", managed: "Prototypes and pilots", own: "Production and customer orgs" },
  ],
  sources: [
    { id: "gh-apps-vs-oauth", title: "Differences between GitHub Apps and OAuth apps", url: "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/differences-between-github-apps-and-oauth-apps", type: "official docs" },
    { id: "gh-oauth-restrictions", title: "About OAuth app access restrictions", url: "https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/about-oauth-app-access-restrictions", type: "official docs" },
    { id: "gh-register", title: "Registering a GitHub App", url: "https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app", type: "official docs" },
    { id: "agent-gh", title: "Our agent opened the registration pages while signed out (29 Oct 2026)", url: "https://github.com/settings/apps/new", type: "tested by our agent" },
    { id: "composio-github", title: "GitHub toolkit", url: "https://docs.composio.dev/toolkits/github", type: "composio docs" },
    { id: "composio-custom", title: "Managed vs custom auth", url: "https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app", type: "composio docs" },
  ],
  uncertain: [
    { text: "How long setup takes", why: "Our estimate. Our agent could reach the form but not fill it in without a GitHub login." },
    { text: "That registering an app is free", why: "No fee is mentioned in the docs we read, but we didn't find an explicit statement." },
  ],
  tested: [
    {date: "29 Oct 2026", tried: "Opened the GitHub App registration page while signed out", result: "Redirected to GitHub sign-in. Registering needs a person signed in.", ok: true, url: "https://github.com/settings/apps/new"},
    {date: "29 Oct 2026", tried: "Opened the OAuth app registration page while signed out", result: "Redirected to GitHub sign-in, same as above.", ok: true, url: "https://github.com/settings/applications/new"},
    {date: "29 Oct 2026", tried: "Stopped before filling in the form", result: "We don't use real accounts or credentials for tests, so registration itself wasn't attempted.", ok: false},
    {date: "29 Oct 2026", tried: "Checked every source link in this guide", result: "All 6 load.", ok: true},
  ],
  next: { label: "Register a GitHub App", sub: "About 10 minutes. You'll need to be signed in to GitHub.", href: "https://github.com/settings/apps/new" },
};
