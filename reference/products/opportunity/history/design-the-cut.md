Superseded: spec of the discarded 'The Cut' build. The current build follows ../stage-spec.md.

# design.md: Opportunity Markets, "The Cut"
Binding: docs/ui-quality-rules.md > docs/product-identity-guide.md > docs/coding-rules.md. Evidence: products/opportunity/{audit/AUDIT_SUMMARY.md, ux.md, innovation.md, concepts.md}. Real data in products/opportunity/data/*.json (parsed from live audit states 003 and 009). Nothing in this file is invented product behavior; anything not observed is tagged [copy-only] (exists in live copy, no UI) or [new UI] (a design device that adds no new product feature).

## 1. Visual Theme and Atmosphere
- **Thesis:** Odds are a triage queue: review the top few, cover most of the crowd's money, and the sponsor still decides.
- **World: "The Cut".** A coverage curve ranks all submissions by odds; a draggable cut line splits "review" from "the rest"; at the end of the curve a separate amber lane is the sponsor decision, locked until decided. Math: C(k) = sum of the k highest odds; saved(k) = 1 - k/N (innovation.md s2; real values C(8)=29.7%, C(27)=60.4%, C(61)=81.4% of 99.0% total).
- **Mood:** kinetic, decisive, honest about uncertainty. Not: a casino/leaderboard, a hype poster, a trading terminal.
- **Differs from Futarchy:** hero is a curve + cut handle + ranked board (not signal list + fork chart); rhythm is board-like (72px rows, rank numerals dominant); motion is fast springs on rank change (Futarchy is calm 600-900ms); two authorities (violet market vs amber sponsor) instead of YES/NO.

## 2. Color Palette and Roles (EF surfaces/text unchanged; product tokens in apps/opportunity/src/product.css)
| Token | Role | Dark | Light | Where | Second channel |
|---|---|---|---|---|---|
| --sem-market | market odds, review set, selected | #7B3AFF (fills), #9C6FFF (text) | #7B3AFF fill, #6C2BD9 text | curve line, review dots, leader halo, bars | filled dot + rank numeral |
| --sem-rest | non-review priced entries | #A8A8B3 | #5C5C66 | dots right of the cut | hollow ring |
| --sem-floor | floor-tied (0.4%) cluster | #67676F | #8A8A93 | "tied" cluster dots | cluster count chip |
| --sem-unpriced | unpriced entries (no odds) | #67676F @ 50% | #8A8A93 @ 60% | dust band, "—" rows | dotted outline, "—" text |
| --sem-sponsor | sponsor decision authority | #F5B84A | #B9770E | sponsor lane, lock, "Sponsor" label | padlock / check glyph |
| --sem-up / --sem-down | odds delta | #3DDC97 / #FF5C72 | #12915F / #D1334A | delta text | arrow glyph ▲▼ |
Contrast: text >= 4.5:1 on --card, lines >= 3:1, both themes, verified by script (test 11). Amber is used ONLY for sponsor meaning.

## 3. Typography
Inter Tight. H1 clamp(26px,2.4vw,40px)/500 (<= 6 words). Card title 15/500. Label 12/16 uppercase tracking .04em, muted. Value 28/300 tabular (big readouts), rank numerals 20/500 tabular in a 32px column. JetBrains Mono only for contract addresses. Numbers: tabular-nums, thin space before units ("2.36K sDAI" -> "$2.36K" keep real formats), minus U+2212, percentages without space ("5.9%"). RollingNumber for readouts: only changed significant digits roll, max 2 digits/tick.

## 4. Components (fixed sizes)
| Component | Spec |
|---|---|
| Header | EF pattern: brand + BETA chip, nav (The pilot, The protocol, Archive), search pill (command palette), help, theme, Connect wallet (btn-bubbles). Connected: address pill 40px |
| Buttons / inputs / segmented | 40px high (touch), widths fixed per variant, label never wraps |
| Status tag | ACTIVE / CLOSED / FINALIZED: one family, 96x24px, 12px, same slot on every card |
| Outcome row | 72px high: rank (32px col) · name (flex, ellipsis + tooltip) · mini odds bar (96px) · delta (56px) · odds % (64px, right) · $ price (64px, right). Selected row: tonal step + violet 2px left edge; leader row: violet halo ring (1px, alpha .6, no glow blur) |
| Row tiers | priced rows full; floor cluster = ONE 56px row "44 tied at 0.4%" expandable; unpriced = ONE 56px row "130 without odds" expandable (list virtualized, 56px dense rows inside) |
| Cut line | 2px violet vertical, 24px circular handle (40px hit area), keyboard: arrows = +-1, Shift = +-5, Home/End; aria-valuenow/min/max; value readout "27 of 235" |
| Readout strip | 3 stat tiles fixed 160x72: "Review" (k of N), "Odds covered" (c%), "Not reviewed" (N-k) + amber tile "Sponsor decision" with lock |
| Chart canvases | The Cut hero 320px (mobile 240px); odds history card 280px (mobile 212px); label engine only |
| Trade panel | Buy/Sell segmented, Outcome HoverMenu (preselected = selected row, never rank 27 by default; default = leader), Pay with sDAI menu, amount, chips +1 +5 +10 +100, receive/avg price/slippage, primary button. Sticky on desktop, bottom sheet at <=700px |
| Wallet dialog | restyled to tokens (dark and light), focus trapped |
| Tooltip | shared Tooltip (300ms, 240px max, keyboard focus) |
Empty/loading/error states: skeleton shimmer 400ms; empty comments "No takes yet"; unpriced row hints through tooltip only.

## 5. Layout Principles
`.page` 1760px max, padding-inline clamp(20px,3.2vw,56px), 12-col grid 16px gap, 64px section gaps, cards radius 16/padding 20, nested 12, chips 8. Every section root has `data-align`.
- Landing `#/`: H1 row (<= 6 words + 2 CTAs) -> **The Cut hero** (pilot market, live) + ranked board of top 8 (equal-height row: hero card and board card +-2px) -> archive strip (2 cards) -> protocol strip (3 fixed tiles TODAY / NEXT / ANY DECISION).
- Market `#/m/<id>`: left 8 cols: header card (status tag, title, rules in a collapsible "Rules" drawer, contract), The Cut hero, board (virtualized 235), odds history, discussion; right 4 cols: sticky trade panel. Mobile: single column, trade as bottom sheet, hero height 240.
- Archive `#/archive`: 2 market cards (winner, top 3, designs carousel as 5 fixed 160x120 tiles with edge fade).
- Finalized market: Cut hero in settled state: cut fixed at the winner, sponsor lane amber with check and "Winner", payout panel (Winner, 1.00 sDAI / share, Redeem). List sorted by odds like live (fixes audit #5).
- Breakpoints: 320/360/390 single column, 2-col stat grid; 768 two columns for stats; 1024 trade panel under board; >=1280 side panel; 1920/2560 width formula from rules s2.

## 6. Depth and Elevation
Tonal steps only (--bg, --card, --nested), 1px inner highlight on cards, no shadows in dark, soft 0 1px 2px in light for popovers, overlays dim .55, no blur.

## 7. Motion and Signature Animation
- **The Cut** (canvas 2D, own code): N dots placed along the curve at (k, C(k)); on odds update recompute ranks; each dot moves by spring (stiffness 260, damping 28 via motion/`spring`) from old to new position; dots crossing the cut change color with a 140ms crossfade; the board reorders with FLIP (`motion` layout, no jump). Handle drag changes k live; readouts RollingNumber; cut position persists in URL `?cut=27`. Floor cluster merges dots into one ring with count; unpriced shown as a dust band below the baseline (static, <= 130 points, no animation).
- **Alternate view "Field"** (toggle Cut | Field, Segmented): beeswarm, x = log10(odds), area ∝ odds, Verlet relaxation with spatial hash (spike: 1.3 ms/frame at 235, 3 ms at 705), tiers as bands, sponsor lane at right. Settles once per odds update (<= 60 steps), no ambient loop.
- Live odds tick (simulated): every 4-6 s change 3-8 entries by +-(0.1..0.6)% preserving sum 99.0 + real tail; deltas show ▲▼ for 2 s.
- Particle/pool budgets: no per-frame allocation; dots are a typed array; pause offscreen (IntersectionObserver); reduced motion = no springs (instant), static frame, no FLIP.
- Test hooks: `canvas.__labels`, `canvas.__cut = {k, covered, dots}`, `window.__oppTest`.

## 8. Do's and Don'ts
Do: lead with the live curve; show uncertainty (flat odds) honestly; keep % and $ labelled via column captions "ODDS" / "PRICE"; make row click SELECT and set the trade outcome (double-click/Enter opens detail? Outcome rows have no detail page: click selects only); keep sponsor lane visually separate; sort finalized lists by odds; show three tiers explicitly; keep copy to the allowed list; every number from one source.
Don't: no falling-ball spectacle (spike showed it explains nothing); no amber for anything but sponsor; no "illustrative" text; no marketing paragraphs; no invented features (submission form, launch flow); no gradient text, glass, glow, emoji; no third-party chart lib; no hue-only meaning; no truncated values without tooltip.
**Allowed strings** (real vocabulary from copy-inventory + audit; data labels/units free): Seer, BETA, The pilot, The protocol, Archive, Connect wallet, Opportunity Markets, Open opportunity, Back to opportunities, Back to archive, Active, Closed, Finalized, Liquidity, Volume, Outcomes, Search 235 outcomes (count from data), Show all N outcomes, Show top outcomes, Price history, Discussion, Connect to comment, No takes yet. Share the first one., Buy, Sell, Outcome, Pay with, Amount, Bal, You receive, Avg price, Slippage, Connect wallet to trade, Enter an amount, Position, Trading, View proposal, View portfolio, View images, Designs, Winner, Your winnings, Connect wallet to redeem, Market finalized, Contract, View on Seer, Past markets, Next designs, Today / Next / Any decision, Seer One operates it, Anyone launches, One shared layer. Derived labels (new UI, no new claims): "Review", "Odds covered", "Not reviewed", "Sponsor decision", "Odds", "Price", "tied at 0.4%", "without odds", "Cut", "Field". Headline on `/`: "Price decides who gets reviewed" (6 words) [derived from live chain: "Price becomes a triage tool" + "Sponsor makes final decision"].

## 9. Screens, Data, Tests, Agent Prompt
### Data spec
- `data/live_outcomes.json` (235 rows: rank, name, odds|null) and `data/finalized_outcomes.json` (17 rows incl. "Invalid"). Odds sum 99.0 (live), floor 0.4 for ranks 62-105 (46 rows), 130 null. Price = odds/100 shown as `$0.059` (3 decimals). Delta: seeded random walk (src/math/rng.ts). Volume $7,856, liquidity $2,355 (live), $7,197 / $1,111 (finalized). Pilot header liquidity $2.36K. Outcome "Symbiont" exists (rank 27, 0.9%).
- Rank ties broken by original index. Finalized winner Electric Foundation 80.1% display, payout 1.00 sDAI/share.
- Odds history: deterministic series per outcome (seeded GBM on log-odds, y domain fitted to 2nd-98th percentile + 8% pad, fixes audit #2); x = last 14 days; end labels via label engine.
- Single source: one `useMarket()` store feeds hero, board, trade panel, landing cards (no duplicate numbers).
### Tests (on top of ui-quality-rules s12; copy apps/futarchy/e2e/run.mjs)
T-a odds sum = 99.0 +-0.1 after 20 ticks · T-b cut coverage matches sum of top k (C(8)=29.7) · T-c cut keyboard + URL `?cut=` · T-d sponsor lane never colored violet and market never amber (computed styles) · T-e row click selects and sets trade outcome, FLIP: no row jumps > 4px at settle · T-f tiers: 46 floor rows collapsed to one 56px row, 130 unpriced to one · T-g 235-row list scroll >= 55fps (rAF sample) · T-h finalized list sorted by odds · T-i header words <= 6, no paragraph > 14 words · T-j wallet dialog tokens-styled · T-k Field view settles <= 60 steps, canvas non-blank.
### Trace table (design element -> audit evidence)
| Design element | Audit artifact |
|---|---|
| Hero = live Cut instead of text chips | AUDIT_SUMMARY #1; 001 s0 (chips), 002 s0 |
| Readable odds history | #2; 002 s2-s4; 018 s3; 009 s3; charts-inventory C1-C3 |
| ODDS / PRICE captions | #3; 002 s1 |
| Default outcome = leader | #4; 002 s2 (Symbiont rank 27) |
| Sorted finalized list, winner shown | #5; 009 s0-s1 |
| Status tags one family | #6; 005 (CLOSED) vs 009 (FINALIZED) |
| 3 tiers + collapsed rows, virtualization | #7, #11; 003 text (ranks 62-105 at 0.4%, 106-235 "—") |
| Trade panel/wallet dialog restyle | #8; W002 (light modal, ENTER AN AMOUNT, POSITION row) |
| Designs carousel as fixed tiles | #9; 005, 009 s0 |
| Mobile bottom-sheet trade, short header | #10; 018 s0-s3 |
| Sponsor lane (locked, amber) | ux.md T6; 001 chain step 4 [copy-only]; 009 winner panel |
| Odds tick + delta arrows | W002 vs 001 (leader changed live) |
| Archive page | 005, 021; flows.md |
### Library justification table
Default stack only (React 19, TS, Vite, motion, d3-scale/shape/array/random, own canvas). Rejections with evidence: matter-js (same fps, +25.9 KB gz), ogl/three/pixi, GSAP/Lenis, lightweight-charts (innovation.md s4). No additions, nothing needs the user's OK.
### Acceptance
Matches this file literally; all s12 tests + T-a..T-k green at 320-2560; no overlaps; Opus slop <= 4 on real viewport captures; light + dark; reduced motion; nothing committed.
### Builder prompt (ready to paste)
Read AGENTS.md, docs/ui-quality-rules.md, docs/coding-rules.md, products/opportunity/design.md, products/opportunity/data/*.json, apps/futarchy (router, HoverMenu, Tooltip, Avatar, RollingNumber, Segmented, CommandPalette, GuidedTour, label engine, e2e). Passes: (a) scaffold apps/opportunity from apps/futarchy, tokens + product.css, data store, router, Header/Footer, Landing/Market/Archive layouts with fixed sizes; (b) The Cut hero + board + FLIP + tiers + Field view; (c) trade panel, wallet dialog, finalized state, odds history, archive; (d) tour + e2e tests. Each pass ends with `npm run build -w apps/opportunity` and `npx tsc --noEmit` output. Do not commit.
