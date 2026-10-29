# Research: OAuth app setup for 10 providers + the Composio shortcut

Checked: 2026-10-29. Each app has its own file, structured like the guide page.

## How to read the labels

- **sourced**: stated in official docs (or Composio's docs). Source numbers refer to the list at the bottom of each file.
- **sourced (3rd party)**: from a reputable vendor or community report, not the provider itself.
- **uncertain**: from general knowledge or conflicting sources. Must be checked or shown as uncertain.
- **tested**: we actually tried it with an agent. **Nothing is tested yet.** That's the next phase.

## Summary

| # | App | Difficulty (depends on use case) | Your effort | Approval wait | Cost | Composio-managed? | Biggest lesson |
|---|---|---|---|---|---|---|---|
| 0 | **Composio (Start here)** | Easy | ~5 min | None | Composio plan | n/a | You may not need your own app yet |
| 1 | [GitHub](github.md) | Easy | ~15 min | None (org owner approval may be needed) | Free | Yes | New orgs block OAuth apps by default; GitHub recommends GitHub Apps |
| 2 | [Notion](notion.md) | Easy | ~20 min | Short review to go public (length unknown) | Free | Yes | Access is per page, picked by the user, not by scopes |
| 3 | [Slack](slack.md) | Medium (post) → Hard (read history) | ~1 hr | None to start; Marketplace: up to ~10 weeks | Free | Yes | Unlisted apps can read only 15 messages/min of history |
| 4 | [Microsoft 365](microsoft-365.md) | Medium | 1–2 hrs | Minutes (if partner account verified) + customer admin consent | Free | Yes | Enterprise IT admins often must approve you |
| 5 | [Salesforce](salesforce.md) | Medium | 1–2 hrs | None to start; each customer org admin must install/approve | Free (AppExchange paid apps: $999 review) | Yes | Each customer's admin must approve your app |
| 6 | [Gmail](gmail.md) | Easy (sign-in) → Medium (send) → Hard (read) | 3–5 hrs | 2–3 days → 3–5 days → several weeks | Read: security assessment from ~$540/yr | Yes | Reading email triggers an annual paid security assessment |
| 7 | [Shopify](shopify.md) | Easy (one store) → Hard (App Store) | 2–3 hrs | None → ~5–10 business days (reports up to ~30 days) | $19 one-time for App Store | **No** | Customer names/emails need a separate data-protection approval |
| 8 | [Meta / Instagram](meta-instagram.md) | Hard | ~4 hrs | App Review "within a week" + Business Verification (length unknown) | Free | Yes (Instagram) | Must screen-record every permission; business accounts only |
| 9 | [LinkedIn](linkedin.md) | Easy (sign-in/share) → Gated (company pages, ads) | 1 hr + application | None → partner vetting (length unknown) | Free | Yes | Rejection means starting again with a new app |
| 10 | [X (Twitter)](x-twitter.md) | Easy setup, **paid** | ~30 min | None | Pay per use: $0.005/read, $0.015/post | **No** (removed Feb 2026) | No free tier; you buy credits upfront |

## Biggest surprises from the research (worth highlighting in the product)

1. **The same app can be easy or hard depending on the use case.** This came up in 5 of the 10 apps (Gmail, Slack, Shopify, LinkedIn, X), which supports the "What do you need from <app>?" selector in the design.
2. **Slack is harder than expected.** Apps not listed in its Marketplace can read only 15 messages per minute of history (since May 2025). Getting listed requires 10 active workspace installs *before* you can apply, then up to ~10 weeks of review.
3. **Salesforce changed the rules in 2025–26.** New "Connected Apps" are disabled by default (Spring '26), and since Sept 2025 each customer org's admin must install or approve your app.
4. **Composio no longer manages X.** Its managed app was removed in Feb 2026, and X has no free API tier for new developers.
5. **Many blockers sit with the customer, not the developer.** Customer admins have to approve or install the app on GitHub orgs, Microsoft tenants, Salesforce orgs and Slack workspaces. Guides need a "send this to your customer's admin" step.
