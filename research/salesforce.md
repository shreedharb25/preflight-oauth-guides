# Salesforce

Checked: 2026-10-29 · Composio-managed: **Yes** [1]

## At a glance
| Difficulty | Your effort | Approval wait | Cost | Agent can do |
|---|---|---|---|---|
| Medium | 1–2 hrs (uncertain) | None from Salesforce to start. **Each customer org's admin must install/approve your app.** Optional AppExchange review: report in ~3–4 weeks. | Free. AppExchange security review: $999 for paid apps, free for free apps. | Some steps |

## Do you need your own app?
Composio manages it [1], but org-level approval applies either way: customer admins must still approve whichever app connects. (sourced [1], 3rd party [3])

## What changed recently (important)
- **Spring '26: creation of new Connected Apps is disabled by default** in all orgs. Salesforce recommends **External Client Apps (ECAs)** instead. Re-enabling Connected App creation needs Salesforce Support. (sourced 3rd party [2]; to confirm in Salesforce release notes)
- **Since Sept 2025: uninstalled connected apps are restricted.** Users can't authorize an app the org hasn't installed unless they have "Approve Uninstalled Connected Apps" (or "Use Any API Client" when API Access Control is on). Apps that are installed aren't affected. (sourced 3rd party [3]; vendor notices, dates vary slightly)

## Requirements before you start
- A Salesforce org to create the app in (a free Developer Edition works; uncertain).
- The customer org's **My Domain subdomain** (e.g. `your-company.my`), not the generic `login`. (sourced [1])
- API access depends on the customer's Salesforce edition. (uncertain: typically Enterprise and above)

## Steps
1. Create an **External Client App** in Setup with OAuth enabled, a callback URL and scopes. **you** (login) · sourced 3rd party [2]
2. Copy the consumer key/secret. **you** · uncertain
3. Add credentials + the customer's subdomain to Composio. **agent** · sourced [1]
4. Send the customer's admin instructions to **install/approve** the app (External Client App Settings or OAuth Connected App Usage). **agent** (can draft) · sourced [1]
5. Optional: list on AppExchange and pass the security review. **you** · sourced 3rd party [4]

## Blockers & what to do
- **`OAUTH_APPROVAL_ERROR_GENERIC` / "app must be installed into org".** → The org admin approves/installs the app, then the user retries. (sourced [1])
- **`URL_NOT_RESET`.** The connection used the generic `login` subdomain. → Use the org's My Domain subdomain. (sourced [1])
- **Older connections break.** Salesforce allows **only 5 active refresh tokens per user per app**; a sixth revokes the oldest. → Avoid reconnecting repeatedly. (sourced [1])
- **Can't create a Connected App.** → Use an External Client App, or ask Salesforce Support to enable the permission. (sourced 3rd party [2])

## Sources
1. https://docs.composio.dev/toolkits/salesforce
2. https://developer.salesforce.com/docs/platform/sfdx-dev/guide/sfdx-dev-auth-connected-app.html (plus vendor summaries, e.g. https://striim.com/docs/en/salesforce-connected-apps-and-external-client-apps.html)
3. https://support.airtable.com/articles/5478596596-salesforce-connected-apps-security-update and https://docs.movedata.io/troubleshooting/connection-and-authentication/salesforce-connected-app-usage-restrictions/
4. https://developer.salesforce.com/docs/atlas.en-us.packagingGuide.meta/packageGuide/security_review_how_it_works.htm
