# Preflight.

**Know what it takes to get your OAuth app approved, before you start building.**

Live: **https://preflight-oauth-guides.netlify.app**

Preflight is a library of guides for setting up and getting approval for your **own OAuth app** with a provider (Gmail, Slack, Salesforce…), plus an agent that researches **any other app** live and writes a shareable guide in the same format. Every claim is labelled **tested**, **sourced** or **uncertain**.

---

## The problem

A developer building an AI agent wants their users to connect an app. Before launch, they often need their own OAuth app with that provider, either because no managed app exists or because production needs their own branding, permissions or rate limits.

What hurts isn't the setup itself, it's the **uncertainty**: GitHub takes 15 minutes, Gmail can take weeks plus a paid security assessment, and LinkedIn can reject you outright. Developers find this out late, after they've built the product, and launches slip.

Composio already publishes ~47 credential-setup guides. They explain *how to create credentials*, but not **how hard approval is, how long it takes, what you need first, or what blocks you**. Preflight fills that gap.

**Who it's for:** a busy, technical developer who usually arrives with a specific app in mind, and needs a plan they can trust and share with their team.

## The idea

> **Search like a store, think like a visa checker, read like a recipe.**

- **Store:** one search box, a grid of app cards, filters (difficulty, time to launch, approval type, cost, Composio-managed).
- **Visa checker:** *Do you even need one? What documents do you need? How long is processing? Common rejection reasons? Apply early.* The same app can be a 10-minute job or a six-week one depending on what you ask for, just as visa rules depend on why you travel.
- **Recipe:** an at-a-glance strip (difficulty, your effort, waiting on the provider, cost, steps your agent can do), "ingredients" (requirements), then numbered steps.

## What's in it

| The brief asks | Where it is |
|---|---|
| Look up an app and get a guide you can use and share | Home search → guide page; **Share** (link keeps your use case) or **Copy as Markdown** |
| A library of guides for varied apps | 10 guides: GitHub, X, Notion, Salesforce, Microsoft 365, Shopify, Meta (Instagram), Gmail, Slack, LinkedIn, from easy to gated, plus a pay-per-call case (X) |
| Submit any app name or website; an agent generates a shareable guide live | **Generate a guide**: live activity feed, then the guide at `/guides/<app>` |
| How easy or difficult | Difficulty **per use case** (e.g. Gmail sign-in = easy, send = medium, read = hard) + a [rubric page](https://preflight-oauth-guides.netlify.app/difficulty) |
| Time and effort, including the approval wait | "Your effort" and "Waiting on the provider" shown separately; a timeline where waiting is hatched |
| Requirements and nuances | "Before you start" checklist; nuances such as Slack's rate limits for unlisted apps or Shopify's customer-data approval |
| What an agent can do vs where you take over | Every step is labelled `agent` or `you` (with why); **Generate a prompt for my agent** (through Composio or directly in your code) |
| How to proceed when blocked | "Common blockers and fixes" (what happens / what to do / how often), plus a ready-to-send message for your **customer's admin** where approval sits with them |
| What to do next | A single "your next step" link on every guide |
| Clear about tested / sourced / uncertain | A label on every claim, numbered sources, "What we're not sure about", "What our agent tried". See [VERIFICATION.md](VERIFICATION.md) |

Also included: a pinned **Start here** card for the prototype path ("Composio already has approved apps for 124 providers"), a **Describe what you're building** page that maps a plain-English description to the right apps and permission levels, and a **How we rate difficulty** page.

## Try it (about 5 minutes)

1. **Home:** search "Twitter". It opens the X (Twitter) library guide, with no research needed.
2. **Gmail guide:** switch *Sign-in only → Send email → Read email* and watch difficulty, wait and cost change.
3. **Generate a prompt for my agent:** toggle *Through Composio / Directly in your code*.
4. **Slack or Microsoft 365 guide:** see the message for your customer's admin.
5. **Generate a guide:** enter an app that isn't in the library (e.g. Xero, Strava, Calendly) and watch the agent research it.
6. **Describe what you're building:** try the pre-filled example.

## How the live agent works

```
research  →  overview  →  details  →  saved guide at /guides/<app>
(≈13s)       (≈13s)        (≈12s)
```

- **Research:** Claude (`claude-opus-5-5`, low effort) runs at most **2 web searches**: registration and scopes, then review and reported problems. It writes short research notes with a source URL after each fact. The notes are saved server-side.
- **Overview, then details:** no web search. The agent fills in the same structure as the library guides through two tools (`submit_overview`, `submit_details`). Its instructions are a skill file, [`preflight/agent/guide-writer/SKILL.md`](preflight/agent/guide-writer/SKILL.md): the same labels, difficulty rubric, sections and style as the hand-written guides.
- **Honesty guard:** any source the agent cites that **didn't appear in its own search results is removed**, and claims relying on it are downgraded to *uncertain*. Generated guides never claim *tested*.
- **Why three steps:** Netlify stops server functions at ~30 seconds and a single call took ~38s, so each step is kept well under the limit.
- **Cost control:** library apps, aliases ("Twitter", "Outlook"…) and anything generated before cost **$0**. A new app costs about **$0.10–0.15**. Composio-managed status comes from a saved copy of Composio's directory instead of a search. There's a daily cap (30 new guides, 150 Describe requests), and the Anthropic console spend limit is the hard stop.

## Key decisions

1. **Difficulty is per use case, not per app.** In 5 of 10 apps the same provider ranges from easy to hard depending on the permissions requested.
2. **Waiting is shown separately from effort.** Provider review time is what breaks launch dates and can't be sped up, hence "start the approval now, while you build".
3. **"Do you even need your own app?" comes first.** Composio's managed apps are the honest answer for prototypes; every guide shows when you'll outgrow them.
4. **Composio is a "Start here" path, not an app in the grid.** It sits on top of providers, not beside them.
5. **Blockers often sit with the customer** (Microsoft, Salesforce, Slack, GitHub orgs), so guides include a message for the customer's admin.
6. **Honesty over polish.** "Uncertain" beats an invented timeline. "Tested" is used only for what an agent actually observed; forum reports are labelled "developer report", not "tested".
7. **Agent-friendliness is per step**, and the agent prompt hands control back before logins, payment, DNS and submissions.
8. **"Time to launch", not "time to live",** because developers read TTL as a cache setting.
9. **A focused showcase:** desktop web, no accounts, no pricing. Effort went into content quality and the generator.

## Limitations

- **No logged-in setup attempts.** We didn't use real provider accounts or credentials, so "tested" covers only what an agent observed while signed out (sign-in walls, page availability, broken links). Four library guides carry tested claims; the rest are sourced or uncertain.
- **Effort estimates are mostly ours** and marked uncertain. Some timelines aren't published anywhere (Meta Business Verification, LinkedIn partner vetting, Notion's review), so they're labelled uncertain or rely on developer reports.
- **Some sources are third parties** (e.g. Google security-assessment prices from Nango; Salesforce's 2025 install restrictions from vendor notices). They're labelled as such.
- **Point-in-time research** (checked 29 Oct 2026). Providers change rules, as Slack and Salesforce did in 2025–26; there's no automatic freshness check yet. The Composio-managed list is a snapshot.
- **Generated guides are not human-reviewed.** They're marked "AI-generated, not yet verified" and are not added to the library automatically.
- **Describe** maps only to library apps; others link to Generate.
- **Showcase scope:** desktop only; the daily cap is site-wide and not strictly atomic; if one generation step fails, the user retries.

## Run it locally

Requirements: Node.js 22+ and an Anthropic API key (only needed for Generate and Describe; the library works without one).

```bash
cd preflight
npm install
echo "ANTHROPIC_API_KEY=your-key-here" > .env.local   # never commit this file (it's git-ignored)
npm run dev                                          # http://localhost:3000
```

Checks:

```bash
npm run check:data   # every cited source exists, every source is cited, no false "tested" labels, link counts match
npm run lint
```

Generated guides are saved to `preflight/.data/` locally (git-ignored).

### Deploying (Netlify)

- On the deployed site, set the key as **`PREFLIGHT_ANTHROPIC_API_KEY`** (a secret). The app deliberately ignores `ANTHROPIC_API_KEY` on Netlify because Netlify's AI Gateway can inject its own.
- Generated guides and the daily counters are stored in Netlify Blobs.
- **Keep `.env.local` out of the build:** Netlify's Next.js build copies it into the server bundle, so move it aside before `netlify deploy --build`.

## Repository layout

```
README.md                 this file
VERIFICATION.md           what we checked, corrected and couldn't verify
research/                 sourced research notes for the 10 library apps
design-agent-prompt.md    the design brief used for the UI exploration
preflight/                the Next.js app
  agent/guide-writer/     the agent's skill (system prompt for live generation)
  src/data/guides/        the 10 library guides (typed data, every claim labelled)
  src/app/api/generate/   live generation (research → overview → details)
  src/app/api/describe/   "Describe what you're building"
  scripts/check-data.mts  data consistency checks
```

## From 10 to 100 apps

1. Prioritise by **demand × pain**: the most-requested apps with the hardest approvals first.
2. Use the generator for first drafts; a human reviews the "hard" and "gated" ones before they join the library.
3. Re-check sources on a schedule and flag guides whose sources changed.
4. Add logged-in agent runs on test accounts so more claims become "tested".
5. Feed in real data from Composio users: how long approvals actually took and which blockers they hit.
