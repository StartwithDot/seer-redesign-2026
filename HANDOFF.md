# HANDOFF: Seer Rebrand Contest (POIDH bounty #38), project "poidh2"

Read this whole file first. It tells a new agent the ultimate goal, what Seer's team requires (the key part), what exists, what is rejected, and what to do next.

## 0. Ultimate goal
**Win first place** in the Seer rebrand design contest (POIDH bounty #38). Prize: 0.5 ETH + 4,000 USDC for the winning non-internal entry. The Seer team also enters and picks the winner (team vote, likely informed by an Opportunity Market among traders). Judges open six public links and compare first impression, design quality, comprehension, fit to the brief, Electric Foundation (EF) use plus justified departures, and whether things work.

**DEADLINE (extended): 25 October 2026, 23:59 Anywhere on Earth (UTC-12).** Both the Seer Rebrand contest and the Risk Pricing naming contest were extended by 48 hours. (That is about 17:29 IST on 26 Oct. Confirm on the bounty page.)

The owner's quality bar: world class, premium product design, like Stripe, Linear, Adobe MAX level craft. NOT "AI slop". The owner has been badly burned by generic output. Be honest, verify with real screenshots, and never claim something works without looking.

## 1. What Seer's team requires (verbatim posts from the owner, binding)

### 1a. First brief (X post)
> For the six interface redesigns, keep both sides of Seer's marketplace in mind: users who need information to make decisions, and traders who put capital behind the forecasts that help provide it. The interfaces need to be optimised for both.
>
> Also, remember that the seer app (app-seer-pm) should be Seer's equivalent of Etherscan: a general explorer for all Seer markets, where people can find and trade across market types rather than being limited to one.
> Get creative here; we want fresh ideas, not Polymarket reskins.
>
> Use Electric Foundation's brand kit as your starting point, and if you do make any deliberate departures from this branding, please explain the reasoning.

### 1b. Extension post (latest)
> We're EXTENDING both the Seer Rebrand contest and the Risk Pricing naming contest by 48 hours. Submissions now close on 25 October at 23:59 Anywhere on Earth.
>
> For the redesigns, use the extra time to consider the direction we're going in as an Information Finance protocol; it's important to understand that:
> - Seer is a two-sided marketplace for information seekers who need answers to help them make decisions and traders who put capital behind forecasts for a potential profit.
> - The Seer app (app-seer-pm) should be Seer's equivalent of Etherscan: a general explorer for all Seer markets (across the different interfaces), where people can discover, understand, and trade across different market types.
>
> As we explain in the article, a visitor should be able to understand who is asking a question, what the market is pricing, and how to use that signal. We want to see this reflected in the structure and user experience of the designs.
>
> Also remember that the Electric Foundation's identity is the starting point, but there is room to rethink the experience. We're leaving those design decisions to you and want to see how far you can take them; just do your best to explain the rationale behind them in your submission.

### 1c. Distilled requirements (use as a checklist)
1. **Information Finance**, not "prediction markets": start from something a person needs to know, then design a market that draws the answer out. Fewer than 2% of markets produce real information; most protocols serve traders only.
2. **Two sides, equally**: the asker/information user (person, DAO, treasury, AI agent) and the trader. Traders make the price; askers use it.
3. **The article's test on EVERY interface**: a visitor can tell (1) who is asking, (2) what the market is pricing, (3) how to use the signal, and can get value without becoming a trader.
4. **Seer App = Etherscan of Seer**: find, understand and trade across ALL market types (binary, categorical, scalar, multi-outcome, conditional/futarchy, Deep, Opportunity, Risk). Show asker, resolver/oracle, chain, contract, activity. Not a card wall.
5. **Fresh, not Polymarket reskins, not generic crypto dashboards.**
6. **EF kit is the starting point**: near-black tonal surfaces, violet primary, Inter Tight, line motif. **Departures allowed but must be explained** (write the rationale in the claim and in DEPARTURES.md files).
7. **EF line direction is reversed**: ONE line enters on the left and FANS OUT into many on the right.
8. **Agentic economy** is the direction: agents ask, forecast, trade. Invent useful agent features.
9. **The claim must contain**: preview image, X handle, short design rationale, explanation of EF departures, and **six labelled links to PUBLIC hosted demos** (homepage, Seer app, Deep, Futarchy, Opportunity, Risk). Hosting the six demos publicly is still TODO.
10. Competing entries seen early: Moneygoblin (basic), Ones Laboratory (basic); expect strong designers and the Seer team.

### 1d. The six surfaces and their roles
| # | Surface | Role | What a judge looks for |
|---|---|---|---|
| 1 | Homepage | Seer is the protocol beneath the apps; show how they fit in one ecosystem | One clear story protocol -> apps; who asks in each; Information Finance framing |
| 2 | Seer App (Explorer) | Etherscan of Seer: find and trade across all market types | Index/search across types; market detail with asker, resolver, activity |
| 3 | Deep | Many-outcome questions incl. markets where AI agents forecast how human evaluators judge a field (grants) | Many outcomes readable at once; agent angle; funder visible |
| 4 | Futarchy | Conditional markets: success measure IF pass vs IF fail; informs the DAO, never decides | Pass/fail comparison; "DAO still votes" |
| 5 | Opportunity Markets | Traders forecast which submissions get selected; reviewers keep the final say | Odds as a shortlist; sponsor decision visible |
| 6 | Risk Pricing | Market risk estimates across protocols compared side by side | Comparison across assets; plain-language risk |

Deeper analysis and the strict audit of the first build: `docs/SEER_INTENT_AND_AUDIT.md` (copy in `reference/docs/`; the original lives in the parent repo). Ecosystem map, chains, lifecycle (who asks / trades / decides): `knowledge/ecosystem_map.md`. Contest summary: `CONTEST.md`.

## 2. Product facts (so you can build without re-researching)
- Seer: decentralized Information Finance protocol on **Gnosis Chain** and **Optimism**. Layers: Outcome tokens (Gnosis Conditional Tokens Framework, ERC1155 wrapped to ERC20 for AMM liquidity), Oracle (Reality.eth), Arbitration (Kleros).
- Collateral: sDAI/USDS on Gnosis; **Deep runs on Optimism with sUSDS**.
- Seer Explorer, Futarchy, Opportunity Markets, Risk Pricing on Gnosis; Deep on OP. Seer App supports Gnosis, OP, Base, Ethereum markets.
- Futarchy: DAO launches a conditional market paired with a Snapshot proposal; traders trade YES-branch / NO-branch tokens; TWAP price impact informs the vote; humans keep authority.
- Opportunity Markets: sponsor opens a call; submissions become outcomes; sponsor selects the winner (market prices inform).
- Risk Pricing: PD (probability of default) estimates compared across assets; quarterly baskets (e.g. Kleros Foresight).
- Deep: batch CSV forecasts by agents, trade wallets, contests of dozens of repositories/grants (Optimism, Octant, Deep Funding).
- Honest-claim wording (from the audit): the Connect button is in the same place everywhere; each product keeps its own wallet steps; demo flows (trade confirm, create market) are SIMULATED; data comes from public Seer sources. Do NOT claim shared wallet dialog, live trading, or an official Seer agent API.

## 3. Links
- This repo: https://github.com/StartwithDot/seer-redesign-2026 (private, account StartwithDot)
- POIDH bounty: https://poidh.xyz/mainnet/bounty/38 and data https://poidh.xyz/mainnet/bounty/38/data
- Seer: https://seer.pm , app https://app.seer.pm , docs https://docs.seer.pm , opportunity https://opportunity.seer.pm
- Kleros: https://kleros.io
- Design inspiration (crawled): navbar.gallery, supahero.io, cta.gallery, footer.design, 3dicons.co, scrolltide.co, styles.refero.design; production sites crawled for typography/spacing/motion data: stripe.com, linear.app, vercel.com, raycast.com, framer.com, arc.net, resend.com, mercury.com, ramp.com, polymarket.com, kalshi.com, uniswap.org, notion.com, cursor.com, openai.com, anthropic.com, phantom.com, rainbow.me, ledger.com (data in `reference/design-crawl/*.json`).
- Local dev (when `npm run dev` runs): http://localhost:5188/seer-2026 (landing), /explorer, /deep, /futarchy, /opportunity, /risk.
- Owner's earlier homepage builds (the animation look the owner LOVED; not in this repo): `/Users/leo/Documents/UI DESIGN ASSETS /home4/` (folders `master`, `neon`, `wheel`, `glass`, `lib` with gsap plugins + three; `MASTER_BRIEF.md`, `BRIEF.md`, `DIRECTIONS.md`). Key animation source: `home4/neon/src/scenes.js` (protocolScene, seerScene, deepScene, futarchyScene, oppScene, riskScene, closeScene). Screenshots of the loved look: hero = one question line fanning into priced outcome bars; futarchy = line splits into IF PASS / IF FAIL token prices feeding a DAO. Ideas to reuse, designs not to copy verbatim.

## 4. What is in this repo
- `src/seer-2026/`: landing (`Seer2026Landing.tsx`, `hero/SignalFan.tsx`, `sections/*`, `sections/apps/visuals/*`, `lib/` with Lenis + GSAP helpers).
- `src/products/{explorer,deep,futarchy,opportunity,risk}/`: product prototypes, each with `FEATURES.md` (feature checklist) and `DEPARTURES.md`. `src/products/shared/` is the common shell. Routes wired in `src/App.tsx` (lazy-loaded).
- `overnight/ART_DIRECTION.md`, `overnight/DESIGN_BOOK.md`, `overnight/BENCHMARKS.md`, `overnight/INSPIRATION.md`, `overnight/v4/*.md` (task specs): the design rules and prompts used so far. `overnight/driver*.sh`, `overnight/lib3.sh`: the unattended multi-agent runner (keys are read from git-ignored `overnight/proxy1.key`, `proxy2.key`, `mimo.key`; create them yourself).
- `reference/products/<name>/`: ALL product knowledge from the earlier first-design work (requirements, direction, design notes, audits, crawled live-product data and docs-site text, handoffs, prior concept prompts). **Start here for each product's full feature list.** `reference/docs/`: project rules and product truth. `reference/facts/`: crawled facts. `reference/design-crawl/`: design benchmarks data. Original screenshots of the live products: `assets/original_live_screenshots/`. Brand: `assets/brand/` (logo.svg raven mark, star.svg), `assets/ef_kit/`, `EF_KIT_VALUES.md`.
- `render/`: Blender scene scripts from an abandoned approach (kept for reference only; renders are git-ignored).
- `scripts/`: Playwright helpers (`shot.mjs`, `shotpage.mjs`, `crawl.mjs`). Screenshots need `playwright-core` + Chrome.

## 5. What we have built so far (honest status)
**Owner's ratings of the current output: Landing page 2/10. Every product design 0/10.** These ratings were given when the owner last reviewed. Treat the whole thing as a starting point to beat, not as something close to done.

History:
1. Argon (another agent) produced a first /seer-2026 hero with a flat disc. Rejected.
2. Procedural React Three Fiber sculpture: looked like a tyre / prop. Rejected.
3. Blender renders (lens, then a crystal prism with violet rays, plus rendered objects for each product and Kleros): the owner hated them (prism did not resemble the reference, product renders were meaningless, Kleros used a weighing scale). **Blender and all rendered 3D are dropped. Do not use them.**
4. Overnight multi-agent pipeline produced shallow product pages (about 1,400 lines total). Owner reviewed: "0/10, none working". Then a v4 rebuild (code-drawn visuals, redesigned Explorer and Deep) was produced.

Current state (as of the last real screenshots, 24 Oct):
- **Landing**: hero is a live canvas "signal fan": one line enters a small ring and fans into 8 outcome rows (chain TVL question) that re-price live. Concept is right but visually pale and understated. Below: scroll-scrubbed statement, Applications section (pinned menu + code-drawn visual per app; the Futarchy pass/fail to DAO one works), How It Works (diagram looks unfinished, sparse), Kleros (charcoal, jury-to-verdict animation, no scales), final CTA/footer. Smooth scrolling (Lenis) and text reveals are liked by the owner. Seer App/Deep/Opportunity/Risk visuals on the landing were not reviewed. The owner's overall verdict: not good enough; richer, bolder animation like the home4 neon builds is wanted.
- **Explorer (/explorer)**: redesigned to the owner's brief: no left panel, split stage (animated "what is Seer App" + trending-market photo marquee), one filter row, Etherscan-style market table, Create Market and Connect Wallet in nav, Asked by / Priced / How to use strip. Looks credible in screenshots but market page, mobile and many interactions are unverified.
- **Deep (/deep)**: redesigned to the brief: top nav + horizontal filters, context strip with agent line, many-outcome fan chart, outcomes list, sticky right trade column. Looks credible; unverified in depth.
- **Futarchy, Opportunity, Risk**: still the old shallow pass. Need full redesign.
- Known process failures to avoid: (a) QA screenshots were blank for hours because the Vite dev server cache was stale ("Outdated Optimize Dep") so agents critiqued nothing; always confirm a page really renders (check console, root children) before trusting screenshots, or QA against `vite build` + `vite preview`. (b) Unattended agents burn credits fast (MiMo 4.1B credits gone in about 8 hours; Codex daily quota drained); cap parallelism and passes. (c) Do not approve agent output without reading real screenshots.

## 6. Owner's design instructions (accumulated)
- Landing is the design book; products must feel like the same company. White-first landing with charcoal sections where designed; violet #6C47FF accent; Inter Tight; tight tracking.
- Landing: every section needs a code-drawn animation that explains the idea (Information Finance, each product), not random geometry. No numbered labels, no fake stats, no card rows, no glow blobs, no particle fields, no rendered 3D, no weighing scales. Text and spacing excellent, smooth scrolling kept.
- Products: minimal, easy to navigate, little scrolling, light AND dark theme (dark default like the owner's reference screenshots), real market photos (assets exist in other project folders), NO feature loss from the existing live products (every existing feature must be present, e.g. CSV download inside a market), no left sidebar for Explorer and Deep.
- Explorer: split top stage with a creative (not two plain rectangles) divider: pane 1 minimal animation showing what the product is; pane 2 trending markets with photos moving in modern fading/shadowed marquee; properly arranged filters; Create Market and Connect Wallet clearly placed; opening a market must show all information from the original product.
- Deep: all filters horizontal in a top-class navbar; graph below; list below; connect wallet and trade info in a sticky right panel that never changes direction while scrolling.
- Reference screenshots (dark Seer app layouts) are for ARRANGEMENT only: do not copy (plagiarism risk).
- Never fake wallet connection or live trading.

## 7. Recommended next steps (priority order, remaining time is short)
1. Re-verify everything renders (clear `node_modules/.vite`, restart `npm run dev -- --force`), take real screenshots of all six routes at 1440 and 390, dark and light.
2. Landing: make the hero and each app visual richer and bolder (port the techniques from `home4/neon/src/scenes.js`: glowing tube lines with light packets, many-line fans, funnel, survival curves, 3D-ish bar field), fix How It Works, keep scroll choreography. Add an ecosystem strip (protocol -> six apps -> who asks).
3. Redo Futarchy, Opportunity, Risk to the same standard as Explorer/Deep using `reference/products/<name>` for full features; every control must work.
4. Explorer: finish the market page (all original data, Asked by / Priced / How to use, resolver/oracle/contract/chain, activity, CSV export), mobile, quick-buy.
5. Cross-product consistency: shared shell, theme persistence (`localStorage['seer-theme']`), same motion language.
6. Deploy six PUBLIC demo links (Vercel/Netlify/surge), capture preview image, write the claim: rationale, EF departures with reasons, honest wording from section 2, six labelled links, X handle.
7. Before submitting, open each of the six links in a private window and test on mobile.

## 8. Operating notes
- Stack: Vite 6, React 19, TypeScript, GSAP + ScrollTrigger, Lenis. `npm install`, `npm run dev`, `npm run build` (must pass).
- Model access used so far: Codex CLI (native login), a local sanitizing proxy at http://127.0.0.1:8318 (OpenAI-compatible, keys in git-ignored files; models gpt-6.1-sol, gpt-5.6-sol, gpt-6-astra), MiMo token plan (https://token-plan-sgp.xiaomimimo.com/v1, models mimo-v2.6-pro / flash; exhausted). Run Codex with `-c web_search="disabled"` for MiMo.
- The parent repo's CLAUDE.md rules apply when working in the larger POIDH tree (never read/edit snow/, archive/, .env, books/, facts/_cache; do not commit/push without explicit OK).
