# Microsoft 365 (Outlook, Teams)

Checked: 2026-10-29 · Composio-managed: **Yes** (Outlook, Teams, Excel, OneDrive, SharePoint) [1]

## At a glance
| Difficulty | Your effort | Approval wait | Cost | Agent can do |
|---|---|---|---|---|
| Medium | 1–2 hrs (uncertain) | Publisher verification: "minutes" if your partner account is already verified. Partner account verification itself: length unknown (uncertain). Plus each customer's admin consent. | Free | Some steps |

## Do you need your own app?
Composio manages it [1]. But **publisher verification and admin consent are tenant-level issues**. Changing only the Composio connection won't fix "Needs Admin Approval". (sourced [1])

## The two hurdles
1. **Publisher verification** (the blue "verified" badge). (sourced [2])
   - Needs a **Microsoft AI Cloud Partner Program** account that has completed verification, with the app registered under a **work/school** Entra account (not a personal Microsoft account).
   - Publisher domain can't be `*.onmicrosoft.com`; the verification email domain must match it.
   - "Developers who have already met these requirements can be verified in minutes. No charges."
   - Without it: since November 2020, when risk-based step-up consent is on, **users can't consent to most new multitenant apps from unverified publishers** that ask for more than basic sign-in.
2. **Admin consent in customer tenants.** (sourced [3])
   - By default, users can consent to permissions that don't need an admin (e.g. their own mailbox).
   - But Microsoft **recommends** allowing user consent only for verified publishers, so many companies block unverified apps entirely.

## Requirements before you start
- An Entra work/school tenant; a custom verified domain; a CPP partner account (for verification). (sourced [2])
- Decide on account types: work/school only, or personal accounts too. Some Outlook features (e.g. calendar creation for other users) fail for personal accounts. (sourced [1])

## Steps
1. Register the app in Entra ID (multitenant), set the redirect URI and delegated permissions. **you** (login) · uncertain
2. Create a client secret. **you** · uncertain
3. Set the publisher domain and complete publisher verification with your CPP ID. **you** (needs Partner Center roles + MFA) · sourced [2]
4. Add credentials to Composio. **agent** · sourced [1]
5. Give customers' IT admins an **admin consent link** and instructions. **agent** (can draft the email) · sourced [1]

## Blockers & what to do
- **"Needs admin approval".** → A tenant admin grants consent (App registrations → API permissions, or Enterprise applications). Then users reconnect with their own accounts. Warning: if the admin signs in on the OAuth screen, it may connect **the admin's mailbox**. (sourced [1])
- **"Unverified publisher" warning.** → Complete publisher verification. (sourced [2])
- **Can't verify: no partner account.** → Enrol in the AI Cloud Partner Program first (time unknown, uncertain).

## Sources
1. https://docs.composio.dev/toolkits/outlook
2. https://learn.microsoft.com/en-us/entra/identity-platform/publisher-verification-overview
3. https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/configure-user-consent
