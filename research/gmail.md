# Gmail / Google Workspace

Checked: 2026-10-29 · Composio-managed: **Yes** [1]

## At a glance (depends on use case)
| Use case | Scope class | Difficulty | Your effort | Approval wait | Cost |
|---|---|---|---|---|---|
| Sign-in only (name, email) | Non-sensitive | Easy | ~1 hr | Brand verification: "typically 2-3 business days" | Free |
| **Send** email (`gmail.send`) | Sensitive | Medium | 2–3 hrs | Sensitive scope review: "typically 3-5 business days" | Free |
| **Read / modify** email (`gmail.readonly`, `gmail.modify`, `mail.google.com`, even `gmail.metadata`) | **Restricted** | **Hard** | 3–5 hrs + security work | "Can potentially take several weeks" | **Annual security assessment** (third-party lab, from ~$540) |

Scope classes: sourced [2]. Timelines: sourced [3], [4], [5].

## Do you need your own app?
Composio manages Gmail, but: the shared app has **shared quota**; extra scopes trigger "App is blocked" unless verified; `gmail.settings.basic` needs a verified app; **after a scope change, users must reconnect**. (sourced [1])

## Ways to avoid verification (sourced [6])
- **Internal use:** only users in your own Workspace org, with the consent screen set to *Internal*.
- **Personal use:** fewer than 100 users who click through the warning.
- **Development/testing:** still capped, and limited (see below).

## Hard limits while unverified (sourced [7])
- **100 new users, ever**, after the unverified screen shows. This "cannot be reset".
- Testing mode: up to **100 test users**; their access **expires after 7 days**.

## Requirements before you start (sourced [8], [4])
- Homepage on a **domain you own** (not only a login page), linking to the privacy policy.
- **Privacy policy** on the same domain, same link on the homepage and consent screen, including the Limited Use statement (3rd party [9]).
- **Domain ownership verified** in Google Search Console.
- **Demo video** (unlisted YouTube, English): the full OAuth flow, the consent screen, the client ID in the address bar, and each scope in use.
- A **written justification per scope**, explaining why a narrower scope won't work.
- For restricted scopes: an **annual security assessment (CASA)** by a Google-approved assessor, **renewed every 12 months**. (sourced [5], [10])

## Steps
1. Create a Google Cloud project, enable the Gmail API, and configure the consent screen. **agent** (partly; needs your login) · sourced [11]
2. Create OAuth client credentials (web app, redirect URI). **you** · sourced [11]
3. Verify your domain in Search Console. **you** · sourced [8]
4. Publish your homepage + privacy policy. **agent** (can draft the policy) · sourced [8]
5. Publish the app, then "Prepare for verification"; write scope justifications. **agent** (drafts) · sourced [11]
6. Record the demo video. **you** (agent can write the script) · sourced [4]
7. Submit. Google emails you; reply within 24–48h. **you** · sourced 3rd party [9]
8. Restricted scopes only: hire a CASA assessor, run the scans, fix findings, get the Letter of Validation. **you** · sourced [10], 3rd party [9]
9. Add credentials to Composio. **agent** · sourced [1]

## Blockers & what to do (mostly sourced 3rd party [9])
- **Scopes on the consent screen don't match the Data Access page.** → "Guaranteed rejection". Make them identical.
- **Asking for scopes no feature uses.** → Remove them; reviewers test this.
- **Homepage behind a login or on a third-party domain.** → Host a public page on your own domain.
- **Review stalls for weeks.** The contact email belonged to someone who left. → Use a monitored shared alias.
- **Too many restricted scopes or domain-wide delegation.** → May push you to CASA Tier 3 (~$4,500, much more work). (uncertain: anecdotal)
- **"App is blocked" / Error 400 invalid_scope.** → Remove extra scopes or verify your own app. (sourced [1])

## Sources
1. https://docs.composio.dev/toolkits/gmail
2. https://developers.google.com/workspace/gmail/api/auth/scopes
3. https://developers.google.com/identity/protocols/oauth2/production-readiness/brand-verification
4. https://developers.google.com/identity/protocols/oauth2/production-readiness/sensitive-scope-verification
5. https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification
6. https://support.google.com/cloud/answer/13464323
7. https://support.google.com/cloud/answer/15549945
8. https://support.google.com/cloud/answer/13464321
9. https://nango.dev/docs/api-integrations/google-shared/google-security-review (3rd party, prices as of Aug 2025)
10. https://support.google.com/cloud/answer/13465431
11. https://support.google.com/cloud/answer/13461325
