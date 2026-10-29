# Shopify

Checked: 2026-10-29 · Composio-managed: **No**. You must bring your own app. [1]

## At a glance (depends on distribution)
| Use case | Difficulty | Your effort | Approval wait | Cost |
|---|---|---|---|---|
| One store / one Plus org (**custom distribution**) | Easy | ~1 hr (uncertain) | **No review** | Free |
| Many stores (**public / App Store**) | Hard | 2–3 hrs + app polish | Commonly cited 5–10 business days; developers report ~30 days at busy times | **$19 one-time** registration |

Distribution: sourced [2]. Timelines: sourced 3rd party / community [4]. Fee: sourced [5].

## Do you need your own app?
**Yes**: Composio has no managed Shopify app. Its docs also note the default app may show "App not found" if under review or expired. (sourced [1])

## The hidden blocker: protected customer data (sourced [3])
- Any customer-related data (orders, customers…) is "protected customer data".
- **Level 2** = includes **name, address, email or phone**. Each field must be requested separately.
- **Public apps need Shopify's approval** to access it, granted only for "the minimum amount required".
- Level 2 apps must meet 7 more security requirements (encrypted backups, access logs, incident response policy…) and may face data protection reviews.
- Custom-distribution apps get Level 1 and 2 **without review**; development stores need no review request.

## Requirements before you start
- A Shopify **Partner account** (free) and a **development store** for testing. (sourced [6])
- Choose your distribution method first; you need it before requesting data access. (sourced [3])
- Public apps: App Store registration ($19, per Partner account) and a listing page. (sourced [5], [6])

## Steps
1. Create the app in the Partner Dashboard / Shopify CLI and set the redirect URL. **you** (login) · uncertain
2. Pick distribution: custom (single store) or public. **agent** (recommends based on use case) · sourced [2]
3. Request scopes and, if needed, protected customer data fields. **you** · sourced [3]
4. Test on a development store. **agent** (can run test flows) · sourced [6]
5. Public only: register ($19), build the listing, submit for review. **you** · sourced [5], [6]
6. Add credentials to Composio. **agent** · sourced [1]

## Blockers & what to do
- **Review "Paused".** The app doesn't meet core requirements. → Fix the issues in the email and resubmit. (sourced [6])
- **Review takes weeks.** → Community advice: contact support after ~30 days. (3rd party [4])
- **Orders older than ~60 days are missing.** → Request `read_all_orders`. (sourced [1])
- **403 on order updates.** Missing order scopes. → Reconnect with the right scopes. (sourced [1])

## Sources
1. https://docs.composio.dev/toolkits/shopify
2. https://shopify.dev/docs/apps/launch/distribution
3. https://shopify.dev/docs/apps/launch/protected-customer-data
4. https://community.shopify.dev/t/longer-app-store-review-times-what-you-need-to-know/31728 and https://community.shopify.com/t/how-long-does-it-take-for-an-app-review-to-be-completed/264027
5. https://help.shopify.com/en/partners/partner-program/glossary
6. https://shopify.dev/docs/apps/launch/app-store-review/review-process
