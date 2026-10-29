# Design brief: OAuth app setup guides

## What you're designing

A web product that helps developers get their own OAuth app set up and approved with a provider (Google, Slack, Shopify, etc.).

- **Users:** developers building AI agents who need their own OAuth app for a specific provider, either because no managed app exists for it or because they're going to production and need their own branding, permissions or rate limits.
- **Problem:** they can't predict the effort, timeline or blockers. Some providers take 15 minutes, others take 6+ weeks of review, and some can reject you outright. Much of this isn't documented anywhere.
- **Solution:** look up any app and get a trustworthy, shareable guide. It says whether you need your own app at all, how hard it is for your use case, how long it takes including approval, what you need first, what an AI agent can do versus what you must do, and what to do when blocked. Every claim is marked tested, sourced or uncertain. Apps that aren't in the library get a guide generated live by an agent.

**Product metaphor:** *search like a store, think like a visa checker, read like a recipe.*
- Store: one search bar, a grid of app cards, filters.
- Visa checker: "Do you need one? What documents? How long is processing? Common rejection reasons. Apply early."
- Recipe: at-a-glance strip at the top (difficulty, your effort, waiting time), ingredients (requirements), numbered steps.

**Working name:** "Preflight." (a preflight checklist before takeoff), with an orange full stop. Treat it as a placeholder that's easy to swap.

**Scope:** this is a showcase prototype for a take-home assignment, not a public launch. Design **desktop web only** (1440px wide), with no mobile or tablet layouts. Leave out anything a real launch would need but a demo doesn't: sign-up, login, accounts, settings, pricing, legal pages, marketing sections. Every screen should earn its place in a 3–5 minute walkthrough. Use the sample data below and label it as sample data. The content doesn't need to be accurate, but the **structure** must hold real content later.

---

## Who this is for, and how every screen should serve them

**The developer.** They're building an AI agent. A customer has asked for an integration (say, "connect to our Gmail"), or they're moving from prototype to production and need their own OAuth app. They're technical, busy and sceptical of marketing. **They usually arrive with a specific app already in mind.**

**What they come with:** uncertainty. *"Is this an hour or six weeks? What will they ask me for? Could I get rejected? Can I hand this to my agent? What do I tell my manager about the launch date?"*

**What they leave with:** a predictable plan they trust and can share.

Design every screen around the moments of their visit:

| Moment | Their question | What the design must do |
|---|---|---|
| Arrives | "Is my app here?" | Search is the first thing they see. No hero image or marketing copy in the way. |
| Scans the grid | "How bad is it?" | Time to live and difficulty readable in **under 5 seconds** per card. |
| Opens a guide | "Do I even need to do this?" | Answer "Do you need your own app?" near the top, honestly. |
| Plans | "When can we launch?" | Separate *their effort* from *waiting on the provider* (hatched), and say "start the approval now". |
| Prepares | "What do I need first?" | A requirements checklist before the steps, so there are no surprises halfway through. |
| Works | "What can my agent do?" | Every step labelled `agent` or `you`, plus a ready-to-copy agent prompt. |
| Gets stuck | "Now what?" | Each blocker shows what to do next, not just what went wrong. |
| Shares | "Can I send this to my team?" | One-click share, with a link that makes sense to someone who never saw the landing page. |
| Doubts | "Can I trust this?" | Tested / sourced / uncertain labels and visible sources. Uncertainty is shown, never hidden. |

**What we solve:** we turn *"I can't predict this"* into *"I know the effort, the wait, the requirements, the blockers and my next step"*, for any app, including ones not yet in the library.

---

## Design language (follow closely)

Based on a reference image: a modular "bento" card in a Swiss / neo-brutalist style.

- **Layout:** modular tiles in a strict grid, separated by thin gaps and held inside a dark outer frame with rounded corners (~16px). Each tile does one job.
- **Background:** light warm grey (~#EDEDED). Tiles are off-white (~#F4F4F4) with subtle depth. Outer frame and borders are near-black (~#1E1E1E). Use a soft, wide drop shadow under the main frames.
- **Accent:** one strong orange (~#F25100), used sparingly: the full stop in the wordmark, the primary CTA, the single most important number on a card, and active filters. A dark brown-black circle (~#2B1308) can hold small symbols on orange.
- **Typography:**
  - Big, tight geometric grotesk for headings and large numbers (Inter Tight, Neue Haas Grotesk or Helvetica Now Display style), heavy weight, tight tracking.
  - **Huge numerals** for the key metric on a tile (like the "72%" in the reference).
  - Monospace for metadata and tags, written as `key: value` (e.g. `difficulty: hard`, `wait: 2–6 wks`), in the style of JetBrains Mono or IBM Plex Mono.
  - Grey (~#6B6B6B) regular text for descriptions.
- **Textures with meaning (important):**
  - **Diagonal hatching** (orange/black stripes) = **time outside your control**, i.e. waiting for the provider's approval. Use it in timeline bars and the waiting-time tile.
  - **Brushed-metal gradient tile** = decorative only (e.g. behind the app logo on the guide page). Use at most once per screen.
- **Small details:** circular arrow buttons (← →) for navigation, generous whitespace, no stock illustrations, no emoji in the final design (icons only).
- **Tone:** calm, technical, trustworthy, like Stripe or Linear docs with more character. No gimmicks: no shopping carts, star ratings or cartoon passports.

---

## Screens to design

### 1. Landing page

Top to bottom:

1. **Header (compact, so search stays above the fold):** wordmark "Preflight." plus a one-line description, e.g. *"Know what it takes to get your OAuth app approved — before you start building."* Below it, a short subline: *"Difficulty, timeline, requirements and blockers for each provider. Every claim marked tested, sourced or uncertain."*
2. **Search bar (the primary action, since most developers arrive with an app in mind):** large and prominent, with an orange search button, e.g. "Search an app — Gmail, Shopify, Zoom…"
3. **Two secondary CTAs side by side, below the search,** styled as equal outlined tiles so they don't compete with search:
   - **CTA A: "Describe what you're building."** The developer types in plain words (e.g. *"my agent reads customer emails and creates tickets"*). The AI returns which apps and **which permission level** they need, the difficulty *for that use case*, and the fastest path. See screen 4.
   - **CTA B: "Can't find your app? Generate a guide."** Enter an app name or website and an agent researches it live. See screen 5.
4. **Filters:** a row of monospace pill toggles. These are chosen from first principles about what developers worry about most, which is time to launch and the risk of being blocked. They're reasoning, not research data:
   - `difficulty:` Easy / Medium / Hard / Gated (*Gated = partner approval needed, can be rejected*)
   - `time to live:` < 1 day / < 1 week / 1–4 weeks / 4+ weeks
   - `approval:` None / Review / Partner program
   - `cost:` Free / Paid audit / Paid API tier
   - `managed app available:` Yes / No (whether Composio already provides an OAuth app, so you may not need your own yet)
   - `agent can do:` Most / Some / Little
   - Sort: **Fastest to live** (default) / Hardest first / A–Z
5. **App grid:** a pinned "Start here" card followed by 10 app cards (see card specs below). A small `sample data` label sits in the corner of the grid section.
6. **Empty state** (no search results): a large tile saying *"Not in the library yet."* with the CTA B button inside it, pre-filled with the search text.
7. **Footer:** legend for the confidence labels (tested / sourced / uncertain) and the hatching (= waiting on provider). Add a "How we rate difficulty" link.

### 2. App card (on the landing grid)

Each card is a mini bento tile, like the reference image. Show only what helps someone **decide whether to click**:

- App logo and name
- **Huge numeral:** total *time to live* (e.g. "3–6 wks"), with a small split bar beneath it: solid = your effort, hatched = waiting on the provider
- `difficulty:` tag (Gated and Hard use orange)
- `approval:` tag (None / Review / Partner program)
- `managed:` yes/no tag
- `agent can do:` short tag (e.g. "~70% of steps")
- One-line "biggest gotcha" (e.g. *"Reading emails triggers a paid security audit"*)

Keep these **inside the guide only:** advantages and disadvantages, full how-to steps, common issues, requirements and sources.

Hover: the card lifts slightly and the arrow → turns orange. The whole card is clickable.

### 2b. Pinned "Start here" card (first in the grid, styled differently)

This is the prototype path. Composio is **not** an app in the grid: it sits on top of the providers. It already holds approved OAuth apps for many of them, so a developer who is prototyping can skip registering their own.

- Different treatment from app cards: a solid orange tile (or a hatched border), so it reads as "a shortcut", not "another provider".
- Copy: **"Prototyping? Skip all of this."** / *"Composio already has approved OAuth apps for 124 providers. Connect your users in minutes and register your own app when you go to production."*
- Huge numeral: **"~5 min"**. Tags: `approval: none` · `managed: 124 apps`.
- Small line: *"Going to production? You can keep Composio and plug in your own OAuth app — pick an app below."*
- Click: opens a short panel explaining when the managed path is enough and when you'll outgrow it (branding on the consent screen, extra permissions, shared rate limits, enterprise requirements), with a link to the Composio docs.

### 3. Guide page (the core screen: shareable, one per app)

Every guide has its own URL, e.g. `/guides/gmail`. It must be understandable **without anyone explaining it** and be easy to share with a teammate.

**Top bar:** ← back · app name · **Share** button (copy link, plus "Copy as Markdown") · `last verified: <date>` · `source: library` or `source: AI-generated live`

Sections in order, each as a bento tile or row of tiles:

1. **At-a-glance strip** (recipe-card style, 4–5 tiles in a row):
   - Difficulty (big word plus a one-line reason)
   - Your effort (huge numeral, e.g. "3 hrs")
   - Approval wait (huge numeral on a **hatched** tile, e.g. "2–6 wks")
   - Cost (e.g. "Free" / "Paid security audit possible")
   - Agent can do (e.g. "7 of 10 steps")
2. **"What do you need from <app>?" use-case selector.** Segmented options such as *Sign-in only / Read data / Send or write data*. Choosing one **updates the at-a-glance numbers**. This matters because the same provider can be easy or hard depending on the permissions you ask for.
3. **"Do you even need your own app?"** An honest tile: *"A managed OAuth app (e.g. Composio's) already exists for <app>. Good for prototypes and internal tools. You'll need your own when: your brand must appear on the consent screen / you need extra permissions / you hit shared rate limits / enterprise customers require it."* For providers with no managed app, it says so plainly.
4. **Timeline:** a horizontal bar from "Start" to "Live", with segments per phase (setup → submit → provider review → live). Your work is solid, provider waiting is hatched. Callout: **"Start the approval now, while you build."**
5. **Before you start: requirements** (visa-style document checklist), e.g. privacy policy URL, verified domain, demo video, business verification, test account for reviewers. Each item has a checkbox, an `agent` or `you` chip and a confidence label.
6. **Steps:** a numbered list. Each step shows:
   - Title and short description
   - **Who does it:** `agent` or `you` chip, plus a one-line reason when it's "you" (e.g. *"needs your Google login and a payment method"*)
   - Estimated time
   - Confidence label (tested / sourced / uncertain) with source link(s)
   - Expandable details
7. **Agent panel:** a sticky side panel to the right of the steps.
   - Heading: **"Agent-friendly: Yes, partly"** (or No), plus a tagline of what the agent can do, e.g. *"Can fill in the consent screen, set redirect URLs and draft your privacy policy. You'll handle login, billing and submitting for review."*
   - Button: **"Generate a prompt for my agent".** This opens a modal with a ready-to-copy prompt tailored to this app and the chosen use case, with a **Copy** button. Show the prompt in monospace inside a dark tile.
8. **Blockers & what to do:** a list of common issues. Each item has *what happens*, *why*, *what to do next*, and *how often* (common / occasional / rare). Example: *"Verification rejected: demo video doesn't show the permission screen → re-record showing the full flow and resubmit (adds ~1 week)."*
9. **Trade-offs:** a short two-column view comparing *managed app vs your own app* for this provider.
10. **Sources & confidence:** every source listed with its type (official docs / forum / tested by our agent), plus a summary such as "12 claims: 5 tested · 6 sourced · 1 uncertain". **Uncertain** items are listed openly, never hidden. Items marked **tested** show evidence of what our agent actually attempted: date, what it tried, what happened (e.g. *"Created OAuth client in a test project — succeeded"* or *"Stopped at billing — needs a human"*), with a small screenshot thumbnail.
11. **Your next step:** a final orange tile with a single clear action, e.g. *"Create your Google Cloud project →"*.

### 4. CTA A flow: "Describe what you're building"

- A modal or panel with one big text box, example prompts as chips underneath, and a submit button.
- **Result view:** *"For what you described, you need:"*, followed by 1–3 recommended apps as compact cards. Each shows the **permission level needed**, the difficulty *for that use case*, time to live, and whether a managed app covers it. End with a one-paragraph **fastest path** (e.g. *"Start with the managed app today; apply for Google verification in parallel"*). Each card links to its guide page with the use case pre-selected.

### 5. CTA B flow: "Generate a guide for any app"

- Input: app name or website.
- **Live research state**, like watching an agent work (similar to Perplexity): a vertical list of steps appearing one by one, e.g. "Finding developer portal… / Reading OAuth docs… / Checking review requirements… / Looking for reported blockers…", each with the sources it found as small monospace link chips. Show a progress indicator and an approximate time ("~60s").
- **Output:** a full guide page in **exactly the same template** as library guides, with:
  - a clear `AI-generated · not yet verified` banner
  - more items marked "uncertain" where evidence is thin
  - Share button available immediately (so the guide gets its own link)
- Error state: *"Couldn't find public OAuth docs for <app>."* Show what was found, what's missing, and a suggested next step (e.g. contact the provider's developer support, with a drafted email).

### 6. States

- Only the states the demo walks through: the empty search result (screen 1), the live research state and its error state (screen 5).
- Readability: orange is never the only signal (always pair it with text), hatching always has a text label, and text contrast is high.

---

## Sample data (illustrative only, label as sample)

| App | Difficulty | Your effort | Approval wait | Approval | Cost | Managed app | Agent can do | Biggest gotcha |
|---|---|---|---|---|---|---|---|---|
| GitHub | Easy | 15 min | None | None | Free | Yes | ~80% | None for most use cases |
| Notion | Easy | 20 min | None | None (public listing reviewed) | Free | Yes | ~75% | Public integrations need a listing review |
| Slack | Medium | 1 hr | 0–3 wks | Optional directory review | Free | Yes | ~70% | Directory listing review is optional but slow |
| Zoom | Medium | 2 hrs | 1–2 wks | Marketplace review | Free | Yes | ~60% | Must publish to the marketplace for external users |
| Microsoft Outlook | Medium | 2 hrs | Days | Publisher verification | Free | Yes | ~60% | Unverified publisher warning scares users |
| Salesforce | Medium | 2 hrs | None / weeks | Security review for AppExchange | Paid review | Yes | ~50% | Each customer org may need admin approval |
| Gmail | Hard | 3–5 hrs | 2–6+ wks | Verification + security audit | Paid audit possible | Yes | ~60% | Reading emails triggers a security assessment |
| Shopify | Hard | 3 hrs | 1–3 wks | App review | Free | No | ~50% | Public apps must pass review before install |
| Meta (Instagram/Ads) | Gated | 4 hrs | 2–8 wks | Business verification + app review | Free | No | ~40% | Business verification documents often rejected |
| LinkedIn Ads | Gated | 1 hr + application | Weeks, may be rejected | Partner program | Free | No | ~20% | Access is by application, not self-serve |

Use **Gmail** as the fully designed example guide page because it shows every feature: use-case selector, hatched wait, audit cost, blockers and uncertainty. Also show **GitHub** as a contrast, to show the template still looks good when a guide is short and simple.

---

## Final checklist (confirm each one is visible somewhere in the design)

- [ ] Look up an app (search + grid)
- [ ] Submit any app name or website → agent generates a guide live
- [ ] Generated guide is shareable (own URL, Share button, Copy as Markdown)
- [ ] Difficulty (and why)
- [ ] Time and effort, with **approval wait shown separately** from your own work
- [ ] Requirements and nuances that could affect setup
- [ ] What the agent can do vs. where the developer takes over, **per step**
- [ ] What to do when blocked
- [ ] What to do next (single clear next step)
- [ ] Tested / sourced / uncertain on every claim, plus a sources list and evidence of what the agent tried
- [ ] "Do you even need your own app?" (managed app option, honest trade-offs), plus the pinned "Start here" card on the landing page
- [ ] Use case changes difficulty (permission selector)
- [ ] "Generate a prompt for my agent"
- [ ] Filters and sort on the landing page
- [ ] Empty search state and the live-research error state
- [ ] Every screen answers a question from "Who this is for" above

## Deliverables

Desktop web frames only (1440px wide), for: landing page, landing with filters applied, empty search state, the Gmail guide (full), the GitHub guide (short), the agent-prompt modal, the CTA A result view, the CTA B live research state, and a CTA B generated guide. Include a small component sheet: card, tags, confidence labels, hatched bar, buttons, step row.
