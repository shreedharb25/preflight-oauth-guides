# GitHub

Checked: 2026-10-29 · Composio-managed: **Yes** [1]

## At a glance
| Difficulty | Your effort | Approval wait | Cost | Agent can do |
|---|---|---|---|---|
| Easy | ~15 min (uncertain) | None from GitHub. Customer org owner may need to approve. | Free | Most steps |

## Do you need your own app?
Composio manages GitHub OAuth [1]. You'd need your own for branding, dedicated rate limits, or GitHub App features (some tools, like creating check runs, *require* GitHub App auth and won't work with OAuth tokens) [1].

## Key decision: GitHub App vs OAuth app
- GitHub says: **"In general, GitHub Apps are preferred over OAuth apps."** (sourced [2])
- GitHub Apps: fine-grained permissions, only the repos chosen at install, short-lived tokens (~1 hr), stay installed if the installer leaves the org. (sourced [2])
- OAuth apps: broad scopes (e.g. `repo`), access to everything the user can access, 5,000 requests/hour per user. (sourced [2])
- Exception: use an OAuth app if you need enterprise-level resources. (sourced [2])

## Requirements before you start
- A GitHub account (personal or org). (sourced)
- Your callback / redirect URL. (sourced)
- No privacy policy, review or verification needed to create an app. (uncertain: general knowledge)

## Steps
1. Choose GitHub App vs OAuth app. **agent** (recommends) · sourced [2]
2. Register the app in Developer settings (name, homepage, callback URL, permissions). **you** (needs your GitHub login) · uncertain
3. Generate the client secret (and private key for GitHub Apps). **you** · uncertain
4. Add credentials to Composio as a custom auth config. **agent** (if given the credentials) · sourced [1]
5. For GitHub Apps: send users the **installation link**. Composio doesn't generate it automatically. **you** · sourced [1]

## Blockers & what to do
- **Customer's org blocks your OAuth app.** "OAuth app access restrictions are enabled by default" for new orgs. Unapproved OAuth apps can't reach private org resources. → The user requests approval and an org owner approves. Or build a GitHub App instead, which isn't subject to OAuth app policies. (sourced [3], [2])
- **GitHub App tool calls fail after OAuth.** Installation is a separate step from OAuth. → The user must install the app and grant repo access. (sourced [1])

## Sources
1. https://docs.composio.dev/toolkits/github
2. https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/differences-between-github-apps-and-oauth-apps
3. https://docs.github.com/en/organizations/managing-oauth-access-to-your-organizations-data/about-oauth-app-access-restrictions
