# AGENT BRIEF: understand the Seer rebrand contest and the whole Seer product family (read fully before doing anything)

You are joining a design competition entry. This brief gives you ONLY the competition, the products, the strategy and where all collected research lives. It deliberately says nothing about visual style. The person who briefs you will give the design direction separately. Do not invent a style, do not look at or reuse any previous design attempt of this team (their built apps, `apps/`, `site/`, `deliver/`, `judge/`, `spikes/` are NOT inputs; do not open them). Work only inside the folder `/Users/leo/Documents/POIDH/poidh2/` for your outputs; you may READ the research folders listed in SOURCES_INDEX.md.

Today is 2026-10-22. The contest deadline is 23:59 on 2026-10-23, Anywhere on Earth (the on-chain timestamp of the claim counts). Plan accordingly.

## 1. The competition
- Platform: POIDH bounty #38, https://poidh.xyz/mainnet/bounty/38/data (open it and read the full text and every comment; entries and rules may have changed since this brief).
- Organiser: Seer (https://seer.pm, X https://x.com/seer_pm). Prize: 0.5 ETH + 4,000 USDC for a winning non-internal entry. The Seer team also enters; the winner is chosen by Seer (team vote, likely informed by a market among traders).
- Task: redesign ALL SIX Seer interfaces using the Electric Foundation (EF) brand kit as the STARTING POINT, explain every deliberate departure. Seer wants fresh ideas, not Polymarket reskins, not generic crypto dashboards.
- One claim, containing: a preview image; the entrant's X handle; a short design rationale; an explanation of every EF departure; six labelled links to PUBLIC hosted demos of the six surfaces (the preview image does not replace the links). Judges open the links and compare first impression, design quality, comprehension, fit to the brief, EF use plus justified departures, and whether it works. The entrant submits the claim personally; you never submit, deploy or commit anything.
- Known competitors seen: Moneygoblin and Ones Laboratory (both self-described drafts). Expect strong designers and the Seer team itself.
- Full competition notes (already saved): CONTEST.md in this folder. Re-check the bounty page for new comments.

## 2. The strategic frame (Seer's own words, 17 Oct 2026)
Read `assets/x_post/post.md` and look at `assets/x_post/a.png`, `b.png`, `c.png`. Source: https://x.com/seer_pm/status/2111351009801089244 ("Redesigning Seer for Information Finance, Part II of the Rebrand Contest").
Key points:
- Seer moves from the "prediction markets" label to **Information Finance**: markets as a way to DISCOVER information, not just a place to trade. Profile line: "Information Finance infrastructure for the agentic economy."
- Design for the person ASKING the question as much as for the trader. A visitor must be able to tell: who is asking the question, what the market is actually pricing, how to use that signal. Someone must understand why a market exists and what they can learn without becoming a trader.
- The direction of travel is the agentic economy (agents ask, forecast and trade); think about useful features that follow.
- Electric Foundation was Seer's favourite theme from round one; its identity is the recognisable starting point, flexible. EF's line motif must be REVERSED: the preferred direction (image c.png) is ONE line entering from the left that fans out into MANY parallel lines to the right.
- Evidence the article uses: The Block 2026: less than 2% of prediction markets produce information; 77% of September volume is sports and parlays; $331B traded Jan to Sep 2026.
- Required reading the article links: Vitalik, "Info Finance" https://vitalik.eth.limo/general/2024/11/09/infofinance.html ; Clement's EthTaipei talk https://x.com/seer_pm/status/2102636856647283020 .

### Do fresh internet research (the world moves; this brief is a snapshot)
Use your browser or fetch tools (X may require the browser; try nitter-like mirrors or the page text via the browser pane). Gather and summarise into `poidh2/research/latest_findings.md` with links and dates:
1. All recent posts from https://x.com/seer_pm (last 60 days), including replies and quote posts, rebrand contest Part I and Part II announcements, product launches, token or airdrop news, partnerships, anything about Information Finance, agents, Futarchy, Deep, Opportunity Markets, Risk Pricing, the Seer app.
2. Seer docs: https://seer-3.gitbook.io/seer-documentation and https://docs.seer.pm (what Seer is, market types, Conditional Tokens, Kleros/Reality.eth resolution, Seer Credits, Seer Points, leaderboard, policies), the Deep docs https://deep-pm.gitbook.io/seer-docs , Seer blog https://seer-pm.medium.com/ , GitHub https://github.com/seer-pm , Telegram https://t.me/Seerpredictionmarket , Discord https://discord.com/invite/rBEB4MYQwV .
3. Related context: Kleros (https://kleros.io), Reality.eth, Gnosis Chain and Optimism (where Seer markets and Deep live), the Futarchy research by Kleros and Seer, Credora and risk-rating context for Risk Pricing, Optimism and Deep Funding for Deep, Vitalik's writing on info finance, futarchy and prediction markets. Competitors for context only (not features of Seer): Polymarket, Kalshi, Manifold, Metaculus, Etherscan (the explorer analogy).
4. The POIDH bounty page, its comments, and any public competing submissions (look at their demos, note strengths and weaknesses).
Mark every claim [verified: URL] or [unverified]. Never invent product behaviour; if you cannot find a fact write UNKNOWN.

## 3. The six surfaces and their roles (as the organiser defines them)
| # | Surface | Role | Live site today |
|---|---|---|---|
| 1 | Seer homepage | Introduces Seer as the protocol beneath the applications and shows how they fit in one ecosystem | https://seer.pm |
| 2 | Seer app (Explorer) | The general explorer for all Seer markets: find and trade across market types, without specialising in any one; "Seer's Etherscan" | https://app.seer.pm |
| 3 | Deep | Questions with many possible outcomes, including markets designed for AI agents to trade. Example: agents forecast how human evaluators will judge a large field of grant proposals, giving a funding team a signal on which deserve closer review | https://deep.seer.pm (Optimism; docs https://deep-pm.gitbook.io/seer-docs) |
| 4 | Futarchy | Conditional markets forecast what a chosen measure of success looks like if a proposal passes versus if it does not; informs a DAO's decision, does not make it | https://futarchy.seer.pm |
| 5 | Opportunity Markets | Traders forecast which submissions are likely to be selected, giving reviewers another signal; reviewers keep the final selection | https://opportunity.seer.pm |
| 6 | Risk Pricing | Market estimates of risk across protocols so someone assessing DeFi exposure can compare estimates instead of reading one yes/no price | https://risk.seer.pm |

What each live product actually does today (crawled and verified earlier; read the per-product audits before assuming anything):
- Homepage: purple hero with raven mascot, "Seer, a next generation prediction marketplace"; sections Create Unique Markets, Trade with Ease (Conditional Tokens, ERC1155 wrapped as ERC20), Kleros dispute resolution, categories ("A world of opportunities"), four market types (Categorical, Multi Categorical, Scalar, Multi Scalar), CTA, contact info@seer.pm, footer Docs/Blog/Community/Images & Branding.
- Explorer (app.seer.pm): markets grid with search, filters, categories, market detail with chart, trade ticket, leaderboard, create market, policies, collections, Reality.eth answer flow.
- Deep: Optimism only. One live contest market (Round 3, Originality) plus Archive. Each repository is an outcome priced as an UP/DOWN pair (UP = share of original work, DOWN = share carried by dependencies); 98 repositories; onboarding (connect wallet, trade wallet, sUSDS); leaderboard; upload predictions; export market weights.
- Futarchy: milestones and organisations with conditional YES/NO markets; proposals; resolution via Reality.eth/Kleros.
- Opportunity Markets: submissions ranked by market signal for a review round; wallet-gated trading; rounds/archive.
- Risk Pricing: market estimates of default probability for DeFi assets over a horizon (built with Kleros; Credora ratings involved), compare protocols.
Do not trust these summaries blindly: verify against the audits and the live sites.

## 4. Brand and colour facts (the starting kit; no style decisions here)
- EF Figma kit (public view): https://www.figma.com/design/cB6ZFMUkBwMBhHadLdiSmh/Seer-Branding . Exports saved in `assets/ef_kit/` (dark-mode-board.webp, light-mode-board.webp, color-palette.png, trade-ticket.png). Look at all four. Exact values in `EF_KIT_VALUES.md`.
- Core EF palette (from the kit): dark page #101013, card #1A1A1E, nested #1F1F24, text #EDEDF2 / #A8A8B3 / muted #67676F; light page #F7F7F9, card #FFFFFF, text #17171C / #5C5C66 / #8E8E99; primary action vivid violet about #7A3CFF to #7B3AFF; secondary button dark #241E33 with text #9C6FF2, light #EFE9FC with text #6C2BD9. Type: a clean geometric grotesk (Inter Tight is used by the team); tabular numerals for money and percentages. EF logo: lightning-S plus "seer" wordmark on near-black.
- Current Seer identity (before the rebrand): purple palette, a raven inside a circle with a four-point star (assets/brand/logo-alt.png, logo.svg, star.svg), plus raven illustrations (bird-1.png, bird-2.png). The raven-in-circle mark is the brand mascot.
- The article's own image c.png shows a white raven logo with an italic SEER wordmark on black and the violet fan-out lines; image b.png shows the dark-purple chart style Seer itself uses in its posts (look at them for colour cues).
- Colour theory guidance to follow when you are told the design direction: respect the EF neutrals and violet as the base, justify every departure in writing (the claim needs a departures list).

## 5. Where all collected research lives (full map in SOURCES_INDEX.md)
Everything below is READ-ONLY reference under `/Users/leo/Documents/POIDH/`:
- `docs/` project rules and facts (handoff-project.md, product-truth.md, live-products.md, ef-kit-real.md, ef-system.md, competitor-patterns.md, claim.md draft, departures.md).
- `products/<name>/` for name in home, explorer, deep, futarchy, opportunity, risk: `audit*/` (crawl of the live product: sitemap, flows, controls, copy, data model, screenshots in `audit*/raw/`), `docs-site/` and `docs.md` (docs digests), `data/` (real API JSON), `RESEARCH_READY.md` (reading order), `REQUIREMENTS.md`, `HANDOFF.md`.
- `research/inspiration/` captured human-made reference sites (screenshots and contact sheets) for several categories; `research/*_digest.md` library and technique digests.
- `facts/` verified fact records and design org data (`facts/*.json`).
- `kit/` the four EF kit exports (also copied into poidh2/assets/ef_kit).
Skip: `snow/`, `archive/`, `books/`, `.env`, `.git`, `facts/_cache`, and all built apps/screens from earlier design attempts.

## 6. Your first deliverables (in poidh2/)
1. `research/latest_findings.md` from section 2 (with dates and links).
2. `knowledge/product_<name>.md` for each of the six surfaces: purpose in the Information Finance frame, who asks, what is priced, how a user uses the signal, the real data and flows (from the audits, with file references), the real content and copy, current weaknesses a redesign should fix, unknowns.
3. `knowledge/ecosystem_map.md`: how the six surfaces and the protocol (Conditional Tokens, Reality.eth, Kleros, chains) fit together, in plain words, with who asks / who trades / who decides at each step.
4. `knowledge/open_questions.md`: everything you could not verify.
Keep reports short, factual, no style suggestions yet. No em dashes in any text. Report back with a 10 line summary and then wait for the design direction.

## 7. Working rules
- Evidence first: cite file paths or URLs for every claim. Mark uncertainty.
- Never place secrets, keys or wallet data anywhere. The products are demoed read-only; no live trading, no real wallet actions in demos.
- Never commit, push, deploy or submit the claim; the entrant does that.
- Be economical: summarise, do not paste large files.
