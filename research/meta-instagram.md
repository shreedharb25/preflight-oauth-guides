# Meta: Instagram (and Facebook/WhatsApp)

Checked: 2026-10-29 · Composio-managed: **Yes** for Instagram, Facebook, WhatsApp; **No** for Meta Ads [1], [2]

## At a glance
| Difficulty | Your effort | Approval wait | Cost | Agent can do |
|---|---|---|---|---|
| Hard | ~4 hrs (uncertain) | App Review: "receive a decision within a week". Business Verification: length not documented (uncertain). | Free | Few steps |

## Do you need your own app?
Composio manages Instagram, but **some permissions aren't approved on Composio's app yet**. Comment replies fail; Composio says the production fix is **your own Meta app** with that permission approved. Webhooks also need your app to be Live with Advanced Access and business verification. (sourced [2])

## Who can connect at all
- Only Instagram **professional accounts (Business or Creator)**. Personal accounts can't. (sourced [2], [3])
- Two setups (sourced [3]):
  - **Instagram Login:** no Facebook Page needed; `instagram_business_*` permissions.
  - **Facebook Login:** the account must be linked to a Facebook Page the user manages.

## Access levels (sourced [3])
- **Standard Access** (default): only accounts that have a role on your app. Fine for testing or managing your own accounts.
- **Advanced Access**: needed to serve **anyone else's** accounts. "Your app must complete Meta App Review" **and** "You must complete Business Verification".

## Requirements before you start
- A Meta developer account and app; a **Meta Business** you're an admin of (for verification). (sourced [5])
- A **privacy policy URL** (shown to users at login). (sourced [4])
- Business verification documents (the list is in Meta's Business Help Center; not checked). (uncertain)
- **At least one successful API call per permission** within 30 days before you can request Advanced Access. (sourced [4])

## Steps
1. Create a Meta app and add the Instagram product (choose Instagram Login or Facebook Login). **you** · sourced [3]
2. Build and test with Standard Access using your own professional account. **agent** (can run the test calls) · sourced [3]
3. Make one successful call for each permission you'll request. **agent** · sourced [4]
4. Complete Business Verification (business admin, documents). **you** · sourced [5]
5. Record a **screencast per permission** (1080p+, English UI, no audio, captions) and write reviewer access instructions. **you** (agent can script it) · sourced [4]
6. Submit for App Review and wait for a decision. **you** · sourced [4]
7. Add credentials to Composio. **agent** · sourced [1]

## Blockers & what to do
- **Permission rejected: no screencast.** "Any requested permission or feature missing a screen recording will not be approved." → Record one per permission. (sourced [4])
- **Whole submission rejected.** Reviewers couldn't access the app. → Give clear access instructions; don't share personal credentials. (sourced [4], [6])
- **Advanced Access button greyed out.** No successful API call in the last 30 days. → Make a test call and wait up to 2 days for it to be logged. (sourced [4])
- **Insights empty.** Needs at least 1,000 followers. (sourced [2])

## Sources
1. https://docs.composio.dev/toolkits/managed-auth
2. https://docs.composio.dev/toolkits/instagram
3. https://developers.facebook.com/docs/instagram-platform/overview
4. https://developers.facebook.com/docs/resp-plat-initiatives/individual-processes/app-review/submission-guide
5. https://developers.facebook.com/docs/development/release/business-verification
6. https://developers.facebook.com/docs/resp-plat-initiatives/individual-processes/app-review
