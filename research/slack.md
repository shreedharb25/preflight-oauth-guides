# Slack

Checked: 2026-10-29 · Composio-managed: **Yes** (Marketplace review for Composio's app is still in progress) [1]

## At a glance (depends on use case)
| Use case | Difficulty | Your effort | Approval wait | Cost |
|---|---|---|---|---|
| Post messages / basic bot | Medium | ~1 hr (uncertain) | None to start | Free |
| **Read channel history** at scale | **Hard** | ~1 hr + listing work | Must reach 10 installs, then up to ~10 weeks of review | Free |

## Do you need your own app?
Composio itself says using **your own Slack app is the safest option**. It avoids approval prompts in workspaces that only allow approved or Marketplace apps, and Composio's app may show a Marketplace warning until its review completes. (sourced [1])

## The hidden blocker: rate limits for unlisted apps
- Since **May 29, 2025**, apps **not in the Slack Marketplace** are limited to **1 request per minute and 15 messages per request** on `conversations.history` and `conversations.replies`. (sourced [2])
- This applies to commercially distributed apps created after that date, and to new installs of existing apps. **Internal apps** (built for your own workspace) are not affected. (sourced [3])
- Some third-party sources say existing installs were also affected from March 3, 2026. (uncertain)
- **What this means:** an agent that summarises channels or searches history is impractical without a Marketplace listing.

## Getting into the Marketplace (sourced [4])
- Requirement: installed on **10 or more active workspaces** (active = used in the last 28 days) before you can submit.
- Fully tested, including uninstall, on a workspace that isn't your dev workspace.
- Test account access for reviewers; a demo video is recommended (install, OAuth, use, uninstall).
- Timeline: preliminary review **"up to 10 business days"**, then functional review **"up to 10 weeks for new submissions"**. It "can't be skipped or accelerated".

## Steps
1. Create a Slack app and add scopes for your use case (request only what you use). **you** (login) · uncertain
2. Add the redirect URL under OAuth & Permissions → Redirect URLs. **agent** (can prepare the values) · sourced [1]
3. Enable public distribution so other workspaces can install it. **you** · uncertain
4. Add credentials to Composio; set up webhooks separately for custom apps. **agent** · sourced [1]
5. If you need history at scale: plan for the Marketplace (10 installs → submit → review). **you** · sourced [4]

## Blockers & what to do
- **"Requires approval" / can't install.** The workspace has "Require approved apps" or "Require apps from Slack Marketplace" turned on. → Ask the workspace admin/owner to approve, or get listed. (sourced [1])
- **History returns only 15 messages.** Non-Marketplace rate limit. → Marketplace listing, or an internal app for your own workspace. (sourced [2], [3])
- **Marketplace submission rejected.** Common reasons: not production-ready, scopes for features that don't exist yet, leftover test slash commands, missing test access. → Fix and resubmit (up to 6 weeks for resubmissions of published apps). (sourced [4])

## Sources
1. https://docs.composio.dev/toolkits/slack
2. https://docs.slack.dev/changelog/2025/05/29/rate-limit-changes-for-non-marketplace-apps
3. https://api.slack.com/changelog/2025-05-terms-rate-limit-update-and-faq
4. https://docs.slack.dev/slack-marketplace/slack-marketplace-review-guide
