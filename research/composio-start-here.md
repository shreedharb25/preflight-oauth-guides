# Start here: Composio managed OAuth (the prototype path)

Checked: 2026-10-29

## At a glance
- **Difficulty:** Easy · **Effort:** ~5 min · **Approval wait:** none · **Coverage:** 124 OAuth toolkits managed, 258 need your own app. (sourced [1])

## What it is
Composio has already registered OAuth apps with many providers. Your users connect through Composio's app; Composio stores and refreshes tokens. (sourced [1])

## When it's enough
- Building and iterating; default scopes cover your needs; branding on the consent screen doesn't matter yet (users see "Composio wants to access your account"). (sourced [2])

## When you'll outgrow it (sourced [2] unless noted)
- You want **your app name** on the consent screen (the most common reason).
- You need **scopes beyond Composio's defaults**.
- You hit **shared rate limits**: managed apps share quota across all Composio users.
- You need **faster polling triggers**: managed auth enforces a 15-minute minimum.
- You connect to a **custom instance** (e.g. a private Salesforce subdomain).
- **Enterprise customers** require your branding end to end.
- Some features are blocked on managed apps, e.g. Instagram comment replies (Meta hasn't approved the permission for Composio's app yet) [3], Slack Marketplace warnings until Composio's listing is approved [4].

## Going to production doesn't mean leaving Composio
You create your own OAuth app, add its client ID/secret as a custom auth config in Composio, and pass that config to your session. Toolkits you leave out keep using managed auth. (sourced [2])

**Inference (uncertain):** users who connected through Composio's app will likely need to reconnect once you switch to your own app, because their permission was granted to a different OAuth client. Gmail docs confirm users must reconnect after a scope change [5]; the client-switch case isn't stated explicitly.

## Agent-friendly
Yes. An agent can set up a Composio session and generate a Connect Link. Creating the Composio account is a human step.

## Sources
1. https://docs.composio.dev/toolkits/managed-auth
2. https://docs.composio.dev/docs/authentication/custom-app-vs-managed-app
3. https://docs.composio.dev/toolkits/instagram
4. https://docs.composio.dev/toolkits/slack
5. https://docs.composio.dev/toolkits/gmail
