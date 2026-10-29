# X (Twitter)

Checked: 2026-10-29 · Composio-managed: **No**. Composio's managed credentials were removed in **February 2026**. [1]

## At a glance
| Difficulty | Your effort | Approval wait | Cost | Agent can do |
|---|---|---|---|---|
| Easy setup, **paid** | ~30 min (uncertain) | None | **Pay per use, credits bought upfront** | Most setup steps; billing is yours |

## Do you need your own app?
**Yes.** Composio says to "bring your own Twitter API credentials". Rate limits are per app. (sourced [1])

## The blocker is cost (sourced [2], X's official pricing page)
- "No contracts, subscriptions, or minimum spend." **Pay per use.**
- **Reading posts:** $0.005 per post returned. **Your own data** (your posts, followers…): $0.001 per item.
- **Creating posts:** $0.015 each; **$0.20 if the post contains a URL**.
- Cap: **3 million post reads per month**. Above that you need Enterprise (interest form).
- Credits are **bought upfront** in the Developer Console. Requests are **blocked** when the balance runs out or a spending limit is hit.
- No free tier is described for new developers. Promotional credits: $20 after a first purchase. (sourced [2])
- Legacy Basic/Pro plans: closed to new sign-ups, per third-party reports. (uncertain)
- Some analytics need an **Enterprise** plan; Free/Basic/Pro/Pay-per-use get 403. (sourced [1])

## Requirements before you start
- An X developer account and a **project with an app linked to it**. (sourced [1])
- A **payment card** and prepaid credits. (sourced [2])

## Steps
1. Create a developer account, then a project and an app in the Developer Console. **you** · sourced [1]
2. Set up OAuth 2.0 (callback URL, scopes like `tweet.read`, `users.read`). **agent** (can prepare values) · sourced [1]
3. Add a payment method, buy credits, **set a spending limit**. **you** · sourced [2]
4. Add credentials to Composio. **agent** · sourced [1]
5. Estimate monthly cost from expected reads/posts. **agent** · sourced [2]

## Blockers & what to do
- **`client-not-enrolled` / "App not linked to project".** → Link the app to a project, or refresh the configuration. (sourced [1])
- **403 Forbidden.** Your access level or plan lacks the endpoint. → Check your tier; some endpoints need Enterprise. (sourced [1])
- **Requests suddenly blocked.** Credits ran out or the spending limit was hit. → Top up or enable auto-recharge. (sourced [2])
- **Connection shows EXPIRED.** → Fix the app configuration and recreate the connection. (sourced [1])

## Sources
1. https://docs.composio.dev/toolkits/twitter
2. https://docs.x.com/x-api/getting-started/pricing
