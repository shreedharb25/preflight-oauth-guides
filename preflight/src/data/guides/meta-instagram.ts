import type { Guide } from "@/lib/types";

// Source: research/meta-instagram.md (checked 2026-10-29). Nothing here has been agent-tested yet.
export const metaInstagram: Guide = {
  slug: "meta-instagram",
  name: "Meta (Instagram)",
  provider: "Meta",
  mono: "IG",
  title: "Your own Instagram app",
  summary:
    "For agents that publish posts, reply to comments or handle messages on Instagram. Managing your own accounts is quick. Serving anyone else's accounts needs Meta's App Review and Business Verification.",
  checked: "29 Oct 2026",
  origin: "library",
  managed: "partly",
  needOwnApp: {
    answer: "Probably yes, for production.",
    text: "Composio manages Instagram, Facebook and WhatsApp (not Meta Ads). But some permissions aren't approved on Composio's app yet: comment replies fail, and Composio's own fix is your own Meta app. Webhooks also need your app to be Live with Advanced Access and business verification.",
    when: [
      "You need comment replies or other permissions Composio's app lacks",
      "You need webhooks",
      "You serve customers' business accounts at scale",
      "You need Meta Ads (not managed)",
    ],
    sources: ["composio-instagram", "composio-managed"],
  },
  agent: {
    verdict: "Partly",
    tagline:
      "Can make the test API calls, write the reviewer instructions and script your screen recordings. You create the Meta app, complete Business Verification, record the videos and submit.",
  },
  defaultUc: "others",
  useCases: [
    {
      id: "own", label: "Only accounts you manage", scope: "instagram_business_* (Standard Access)", scopeClass: "no review",
      difficulty: "easy", diffReason: "Standard Access is the default and covers accounts with a role on your app. No review.", diffConf: "sourced", diffSources: ["meta-ig-overview"],
      effort: { num: "1–2", unit: "hrs", note: "Estimate. Create the app and test with your own account.", conf: "uncertain" },
      wait: null,
      cost: { value: "Free", note: "No fee mentioned for App Review or Standard Access.", conf: "uncertain" },
      timeline: [
        { label: "Create the app", dur: "~1 hr", wait: false, flex: 3 },
        { label: "Test", dur: "~30 min", wait: false, flex: 2 },
      ],
      callout: "",
    },
    {
      id: "others", label: "Customers' business accounts", scope: "instagram_business_* (Advanced Access)", scopeClass: "App Review + Business Verification",
      difficulty: "hard", diffReason: "Advanced Access needs Meta App Review and Business Verification.", diffConf: "sourced", diffSources: ["meta-ig-overview"],
      effort: { num: "~4", unit: "hrs", note: "Estimate, including a screen recording for each permission.", conf: "uncertain" },
      wait: { num: "1–6+", unit: "wks", note: "App Review: \"receive a decision within a week\". Business Verification: developers report 2 weeks to over a month stuck in review.", conf: "sourced", sources: ["meta-review-guide", "meta-bv-forum-3wk", "meta-bv-forum-32d"] },
      cost: { value: "Free", note: "No fee mentioned for App Review.", conf: "uncertain" },
      timeline: [
        { label: "Build and test", dur: "~3 hrs", wait: false, flex: 2 },
        { label: "Business Verification", dur: "days to 6+ wks (reported)", wait: true, flex: 6 },
        { label: "Record and submit", dur: "~1 hr", wait: false, flex: 1 },
        { label: "App Review", dur: "~1 wk", wait: true, flex: 5 },
      ],
      callout: "Start Business Verification first: it's the undocumented part. Make one successful API call per permission early, because Advanced Access stays greyed out without it.",
    },
  ],
  requirements: [
    { id: "r1", label: "An Instagram Business or Creator account", note: "Personal accounts can't connect at all.", who: "you", conf: "sourced", sources: ["meta-ig-overview", "composio-instagram"] },
    { id: "r2", label: "A Meta developer account and app", note: "Choose Instagram Login (no Facebook Page needed) or Facebook Login.", who: "you", conf: "sourced", sources: ["meta-ig-overview"] },
    { id: "r3", label: "A privacy policy URL", note: "Shown to users when they grant permissions.", who: "agent", conf: "sourced", sources: ["meta-review-guide"], uses: ["others"] },
    { id: "r4", label: "Admin of a Meta Business", note: "Only a Business admin can complete Business Verification.", who: "you", conf: "sourced", sources: ["meta-bv"], uses: ["others"] },
    { id: "r5", label: "Business verification documents", note: "The list is in Meta's Business Help Center (not checked).", who: "you", conf: "uncertain", sources: [], uses: ["others"] },
    { id: "r6", label: "One successful API call per permission", note: "Within 30 days before you request Advanced Access.", who: "agent", conf: "sourced", sources: ["meta-review-guide"], uses: ["others"] },
  ],
  steps: [
    { id: "i1", title: "Create a Meta app and add Instagram", desc: "Pick Instagram Login (instagram_business_* permissions) or Facebook Login (needs a linked Page).", who: "you", why: "Needs your Meta login.", time: "20 min", conf: "sourced", sources: ["meta-ig-overview"] },
    { id: "i2", title: "Build and test with Standard Access", desc: "Use your own professional account, which has a role on the app.", who: "agent", time: "1 hr", conf: "sourced", sources: ["meta-ig-overview"] },
    { id: "i3", title: "Make one successful call per permission", desc: "Advanced Access requests stay greyed out until you do; calls can take up to 2 days to be logged.", who: "agent", time: "15 min", conf: "sourced", sources: ["meta-review-guide"], uses: ["others"] },
    { id: "i4", title: "Complete Business Verification", desc: "Connect the app to your Business under Settings → Basic → Verification.", who: "you", why: "Only a Business admin can, with company documents.", time: "unknown", conf: "sourced", sources: ["meta-bv"], uses: ["others"] },
    { id: "i5", title: "Record a screencast for each permission", desc: "1080p or higher, English UI, no audio, captions where needed, showing the user granting and using the permission.", who: "you", why: "A real recording of your product. Your agent can write the script.", time: "1 hr", conf: "sourced", sources: ["meta-review-guide"], uses: ["others"] },
    { id: "i6", title: "Write reviewer access instructions and submit", desc: "Reviewers use their own test accounts; never share personal credentials.", who: "you", why: "Submitted from your account.", time: "20 min", conf: "sourced", sources: ["meta-review-guide"], uses: ["others"] },
    { id: "i7", title: "Add the credentials to Composio", desc: "Create a custom auth config with your app ID and secret.", who: "agent", time: "5 min", conf: "sourced", sources: ["composio-instagram", "composio-custom"], via: "composio" },
  ],
  blockers: [
    { title: "Permission rejected: no screencast", why: "\"Any requested permission or feature missing a screen recording will not be approved.\"", next: "Record one screencast per permission and resubmit.", freq: "common", conf: "sourced", sources: ["meta-review-guide"], uses: ["others"] },
    { title: "Whole submission rejected", why: "Reviewers couldn't access the app to test it.", next: "Give clear access instructions in Platform Settings, without personal credentials.", freq: "common", conf: "sourced", sources: ["meta-review", "meta-review-guide"], uses: ["others"] },
    { title: "Advanced Access button is greyed out", why: "No successful API call for that permission in the last 30 days.", next: "Make a test call, then wait up to 2 days for it to be logged.", freq: "occasional", conf: "sourced", sources: ["meta-review-guide"], uses: ["others"] },
    { title: "Comment replies fail on the managed app", why: "Composio's app doesn't have the comment permission approved yet.", next: "Use your own Meta app with the permission approved.", freq: "common", conf: "sourced", sources: ["composio-instagram"] },
    { title: "Insights come back empty", why: "Insights need at least 1,000 followers.", next: "Check the account's follower count first.", freq: "occasional", conf: "sourced", sources: ["composio-instagram"] },
  ],
  tradeoffs: [
    { k: "time to launch", managed: "Today", own: "Hours (own accounts) to weeks (customers)" },
    { k: "permissions", managed: "Some not approved yet", own: "Whatever you get approved" },
    { k: "webhooks", managed: "Not available", own: "After Advanced Access" },
    { k: "best for", managed: "Publishing pilots", own: "Production" },
  ],
  sources: [
    { id: "meta-ig-overview", title: "Instagram Platform overview", url: "https://developers.facebook.com/docs/instagram-platform/overview", type: "official docs" },
    { id: "meta-review-guide", title: "App Review submission guide", url: "https://developers.facebook.com/docs/resp-plat-initiatives/individual-processes/app-review/submission-guide", type: "official docs" },
    { id: "meta-review", title: "App Review overview", url: "https://developers.facebook.com/docs/resp-plat-initiatives/individual-processes/app-review", type: "official docs" },
    { id: "meta-bv", title: "Business Verification", url: "https://developers.facebook.com/docs/development/release/business-verification", type: "official docs" },
    { id: "meta-bv-forum-3wk", title: "Developer report: Business Verification in review 3+ weeks (Oct 2026)", url: "https://communityforums.atmeta.com/questions-and-discussions-26/business-verification-stuck-in-review-for-3-weeks-180599", type: "community" },
    { id: "meta-bv-forum-32d", title: "Developer report: Business Verification in review for 32 business days", url: "https://communityforums.atmeta.com/questions-and-discussions-26/business-verification-in-review-for-32-business-days-the-bug-tool-sent-me-here-180620", type: "community" },
    { id: "composio-instagram", title: "Instagram toolkit", url: "https://docs.composio.dev/toolkits/instagram", type: "composio docs" },
    { id: "composio-managed", title: "Managed OAuth apps", url: "https://docs.composio.dev/toolkits/managed-auth", type: "composio docs" },
    { id: "composio-custom", title: "Managed vs custom auth", url: "https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app", type: "composio docs" },
  ],
  uncertain: [
    { text: "How long Business Verification takes", why: "Meta publishes no figure. We only have developer reports (2 weeks to over a month)." },
    { text: "Which documents Business Verification accepts", why: "Listed in Meta's Business Help Center, which we didn't check." },
    { text: "How long setup takes", why: "Our estimates. Not yet timed by an agent run." },
  ],
  tested: [
    {date: "29 Oct 2026", tried: "Opened Meta's apps dashboard while signed out", result: "\"Page Not Found\". Our next-step link pointed there, so we changed it to Meta's Create an App guide.", ok: false},
    {date: "29 Oct 2026", tried: "Opened Meta's Create an App guide", result: "Loads.", ok: true, url: "https://developers.facebook.com/docs/development/create-an-app"},
    {date: "29 Oct 2026", tried: "Checked every source link in this guide", result: "All 9 load.", ok: true},
  ],
  next: { label: "Create a Meta app", sub: "About 20 minutes. You'll need your Meta developer login.", href: "https://developers.facebook.com/docs/development/create-an-app" },
};
