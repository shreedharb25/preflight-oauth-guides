# LinkedIn

Checked: 2026-10-29 · Composio-managed: **Yes** for basic LinkedIn; **No** for LinkedIn Ads [1], [2]

## At a glance (depends on use case)
| Use case | Access | Difficulty | Approval wait | Cost |
|---|---|---|---|---|
| Sign in (name, photo, email) | Open: `profile`, `email` | Easy | None | Free |
| Post as a **person** | Open: `w_member_social` | Easy | None | Free |
| Manage **company pages** (post as org, analytics, comments) | **Community Management API**: application + vetting | **Gated** | Dev tier review, then standard tier review (lengths not documented) | Free |
| Ads, Sales Navigator, Talent | Partner programs | **Gated** | Partner application | Free |

Sourced [3], [4].

## Do you need your own app?
Composio's default app is **shared across users with strict rate limits**, and LinkedIn blocks some scope combinations (`w_member_social` with `r_organization_admin`). If you need both, you need **your own app**. (sourced [2])

## Community Management API: the gated path (sourced [4])
- **Only for registered legal organisations, commercial use cases.**
- Needs: a **business email** (personal emails "won't pass"), legal name, address, website, privacy policy, and the app **verified by a super admin of your LinkedIn Company Page**.
- Must be requested on a **new app with no other API products**.
- **Development tier** first: 500 calls/day per app, 100 per member, no batch calls, no webhooks; you must build within 12 months.
- **Standard tier**: a screencast under 5 minutes showing the OAuth flow and every feature using member data, plus test credentials.
- **If rejected, you can't re-apply with the same app.** You create a new app and start again.

## Requirements before you start
- A LinkedIn Company Page and a super admin who will verify your app. (sourced [4])
- An app name that doesn't use "Linked", "In" or LinkedIn/Microsoft logos. (sourced [4])

## Steps
1. Create an app in the LinkedIn Developer Portal and link it to your Company Page. **you** · sourced [3], [4]
2. Ask the Page super admin to verify the app. **you** (agent can draft the request) · sourced [4]
3. Add open products (Sign In with OpenID Connect, Share on LinkedIn). **you** · sourced [3]
4. Company pages: request Community Management API (dev tier), build, then apply for standard tier with a screencast. **you** · sourced [4]
5. Add credentials to Composio. **agent** · sourced [2]

## Blockers & what to do
- **"Request access" greyed out.** The app already has another product. → Use a fresh app. (sourced [4])
- **Rejected for using a personal email.** → Use a verified business email. (sourced [4])
- **429 errors on Composio's app.** Shared limits. → Use your own app. (sourced [2])
- **Can't combine posting as a person and as an org.** Scope conflict. → Your own app with both permissions. (sourced [2])

## Sources
1. https://docs.composio.dev/toolkits/managed-auth
2. https://docs.composio.dev/toolkits/linkedin
3. https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access
4. https://learn.microsoft.com/en-us/linkedin/marketing/community-management/community-management-api-migration-guide
