# Verification: what we checked, corrected and couldn't verify

Checked: 28–29 Oct 2026. This covers the brief's ask to *"check a sample of the guidance against real sources or setup attempts, and show what you learned, corrected, or could not verify."*

## How we checked

1. **Sources first.** Every library claim was researched from the provider's official docs and Composio's toolkit pages; third-party and community sources are labelled as such. Each claim carries a label and numbered source links ([research notes](research/)).
2. **Agent checks without credentials.** An agent opened each provider's registration or "next step" page while signed out and recorded what it saw. Only these observations carry the **tested** label.
3. **Link audit.** Every external link on the site (59) was opened, first by script and then in a real browser for sites that block automated checks.
4. **Automated consistency checks** (`npm run check:data`): every cited source exists, every listed source is cited, "sourced" claims have a source, nothing is marked "tested" without a recorded run, and link counts in test notes match.
5. **Generated-guide checks:** we generated real guides (Pipedrive, Xero, Strava, Calendly locally; Zoom on the live site) and verified their citations and structure.

## What we learned and corrected

| App | Before | After | Evidence |
|---|---|---|---|
| **Slack** | Rated *medium*: the Marketplace review looked optional | **Hard for reading message history.** Since 29 May 2025, apps outside the Marketplace get 1 request per minute and 15 messages per request on `conversations.history`. Listing requires 10 active workspace installs before you can apply, then up to ~10 business days + up to 10 weeks of review | Slack changelog; Slack Marketplace review guide |
| **Gmail (send)** | Design placeholder: 1–3 weeks | **"Typically 3-5 business days"** (sensitive-scope review) | Google sensitive-scope verification docs |
| **Gmail (read)** | Assessment cost marked uncertain | **From ~$540/yr** with the cheapest listed assessor, **renewed every 12 months**; labelled as a third-party figure | Google restricted-scope docs (annual renewal); Nango guide (prices, Aug 2025) |
| **Gmail** | – | Added a step: *check whether you can skip verification* (internal-only apps, personal use under 100 users). Found because our consistency check flagged a source we'd listed but never cited | Google "When verification is not needed" |
| **Salesforce** | Generic "connected app" setup | **New Connected Apps are disabled by default from Spring '26** (use External Client Apps), and **since Sept 2025 each customer org's admin must install or approve your app** | Salesforce docs; vendor notices (labelled third party) |
| **X (Twitter)** | Assumed a managed option might exist | **Composio removed its managed X credentials in Feb 2026**; X is now **pay-per-use** ($0.005 per post read, $0.015 per post created, $0.20 with a URL) and no free tier is listed for new developers | Composio Twitter toolkit; X pricing docs |
| **Meta (Instagram)** | Design placeholder: "not Composio-managed" | **Instagram is managed** (Meta Ads isn't), but some permissions (comment replies) aren't approved on Composio's app, so production needs your own | Composio managed-auth directory; Composio Instagram toolkit |
| **Microsoft 365** | Partner verification time "unknown" | **"Three to five business days" in most cases** (official); one developer reported 40 days stuck | Microsoft Partner Center docs; Microsoft Tech Community post |
| **Notion** | Review "short" | Public-connection review timing is still **not documented** (kept uncertain); Marketplace *listing* review is **5–10 business days** (official) and only for "Any workspace" connections | Notion authorization and Marketplace listing docs |
| **Slack (FAQ)** | Cited a separate FAQ page | The FAQ URL now redirects to the changelog; we re-checked the claims there. Slack says **existing installs aren't affected**; third-party claims of a March 2026 change are kept **uncertain** | Slack changelog |

## What our agent found by trying things (signed out)

| Check | Result | Label |
|---|---|---|
| GitHub: new GitHub App and new OAuth App pages | Both redirect to sign-in, so registration needs a person signed in. The docs show 4 required fields and no GitHub review | **tested** |
| Google Cloud: create-project page | Redirects to Google sign-in | **tested** |
| Slack: app dashboard | "You'll need to sign in to your Slack account to create an application." | **tested** |
| LinkedIn: new-app page | Redirects to the LinkedIn developer login | **tested** |
| Meta: apps dashboard (our "next step" link) | **"Page Not Found"** when signed out → **fixed** the link to Meta's *Create an App* guide | recorded as a failed check |
| Notion: authorization docs | **Moved** to a new address → links updated | recorded |
| Salesforce docs | Block automated checkers (HTTP 403) but load in a browser | recorded |
| All 59 external links | All load in a real browser | recorded |

## What we could not verify (shown as "uncertain" in the guides)

- **Setup effort times.** Our estimates; no logged-in runs were done.
- **Meta Business Verification duration.** Meta publishes no figure; developer reports range from 2 weeks to over a month.
- **LinkedIn Community Management vetting time.** Not published, and no reliable reports found.
- **Notion public-connection review** criteria and timing.
- **Salesforce:** which editions include API access; current AppExchange fees (older docs conflict).
- **X Enterprise access timing.** There's only an interest form.
- **Switching from Composio's managed app to your own** probably requires users to reconnect. Inferred from Composio's docs on scope changes, not stated directly.

## Generated-guide checks

- **Pipedrive** (local): all **7 cited sources load (HTTP 200)**; 17 claims sourced, 4 uncertain; 0 sources removed by the honesty guard.
- **Zoom** (live site, typed into Generate): finished in **47 seconds**; 27 claims: **20 sourced, 7 uncertain, 0 tested**; sources mostly `developers.zoom.us`; correctly marked "Composio-managed: yes".
- **A made-up app** (`tallyfoxapp.io`): the agent **stopped instead of guessing**, noted that search results were about *different* products, and drafted an email to the provider's support.
- **Calendly** (local): every step's use case and every claim's source resolved correctly after the three-step write.

## What we'd verify next

1. Logged-in runs on test accounts (GitHub, Slack, Google, Shopify) to turn effort estimates into tested times.
2. A scheduled re-check of every source, flagging guides whose sources changed.
3. Human review of generated "hard" and "gated" guides before they join the library.
