# Notion

Checked: 2026-10-29 · Composio-managed: **Yes** [1]

## At a glance
| Difficulty | Your effort | Approval wait | Cost | Agent can do |
|---|---|---|---|---|
| Easy | ~20 min (uncertain) | A review before going public; length not documented (uncertain) | Free | Most steps |

## Do you need your own app?
With Composio's app, **Composio appears as the actor** on actions in Notion. Your own integration shows your name and logo and isolates your users' tokens; Composio recommends your own for production. (sourced [1])

## How Notion is different
- **No OAuth scopes.** Access is granted **per page/database**, chosen by the user in a page picker. (sourced [1], [2])
- Sharing a parent page gives access to all its child pages. (sourced [2])
- Each workspace member authorizes individually. (sourced [2])

## Requirements before you start
- A Notion account and access to the developer portal. (sourced [2])
- Redirect URI(s). (sourced [2])
- Installation scope: "Any workspace" or "Selected workspaces only". **This can't be changed after creation.** (sourced [2])
- Company details, privacy policy, terms: likely needed to go public (uncertain: not confirmed in the current docs).

## Steps
1. Create a public connection in the developer portal and set the redirect URI. **you** (needs login) · sourced [2]
2. Choose the installation scope carefully because it's permanent. **you** (agent can advise) · sourced [2]
3. Submit for review / make it public. The authorization URL "populates after a public connection is submitted for review". **you** · sourced [2]
4. Add client ID/secret to Composio (no scopes needed). **agent** · sourced [1]
5. Tell users to share the right pages during connection. **agent** (can draft the instructions) · sourced [2]

## Blockers & what to do
- **404 when creating a database.** The parent page isn't shared with the integration. → The user shares it via Settings → Connections. (sourced [1])
- **Old connection stops working after reconnecting.** A reconnect can invalidate the older refresh token. → Keep one active connection per user. (sourced [1])
- **Review criteria and timing unknown.** → Mark as uncertain; test it in the agent phase. (uncertain)

## Sources
1. https://docs.composio.dev/toolkits/notion
2. https://developers.notion.com/docs/authorization
