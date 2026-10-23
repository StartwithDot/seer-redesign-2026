I wasn't given permission to write to `products/opportunity/rewamp-2026.md`, so the full spec is below. Allow the write and I'll save it there.

Two things to know before reading. `audit/AUDIT_SUMMARY.md` doesn't exist, so I used the audit drafts in `audit/01–06` and `data-model.md` instead. And the live data has moved since the audit: SAI was the leader at 6% and is now rank 25 at 1.1%, so the spec never hard-codes a leader.

---

# Opportunity Markets: 2026 rewamp spec

## A. Product understanding

**What the user is buying into:** a shortlist. The crowd prices 235 names. The sponsor reviews the top of the price list and picks one. The winning token pays 1 sDAI.

| # | Actor | Step | Where it happens | Evidence |
|---|---|---|---|---|
| 1 | Operator (Seer One) | Creates the market: question, outcome list, opening date | **On-chain**: Seer factory `0x8318…`, Conditional Tokens condition, Reality.eth question (bond 10 xDAI, timeout 302400 s = 3.5 days) | data-model get-market |
| 2 | Submitter | Replies to the call with a name; if two people suggest the same name, the earliest wins; $1,000 if Seer can use it | **Off-chain** (a reply); the operator adds it as an outcome | 02-screens §3.1 |
| 3 | LP / operator | Seeds a pool pairing the outcome with sDAI | **On-chain** Algebra/Swapr pool (fee field `9374`) | data-model algebra |
| 4 | Trader | Pays sDAI, xDAI, wxDAI or OPPORTUNITY_CREDITS and receives the outcome token (ERC20) | **On-chain** swap; the UI shows quote, average price, slippage 0.5%, minimum received | STATE 020–024, docs §4 |
| 5 | Everyone | Price = pool price = "odds" (0.059 sDAI = 5.9%) | The UI reads the pool's `sqrtPrice` | market-chart endpoint |
| 6 | Sponsor | Reviews the top-priced entries and decides | **Off-chain** judgement | home page process chips (STATE 001) |
| 7 | Sponsor or anyone | Reports the answer; optional Kleros dispute; finalizes | **On-chain** Reality.eth + Kleros | docs §6 |
| 8 | Holder | Redeems the winning token 1:1 for sDAI; losing tokens pay 0; the Invalid outcome redeems collateral | **On-chain** redeem | docs §7, ux T6 (1.00 sDAI/share) |
| 9 | Submitter | Receives the prize | **Off-chain** payment | 02-screens §3.1 |

**Data tiers today** (`live_outcomes.json`): 235 outcomes in total.
- 59 priced above the floor.
- 46 tied at the 0.4% floor (ranks 60–105, including "None of the listed names").
- 130 unpriced (no pool).

Coverage: the top 3 hold 13.6% of the odds, the top 8 hold 29.7%, the top 27 hold 60.4%. Prices sum to 99.0%, so they are not normalised.

**Unknown, so the UI must not fake it:**
1. **Decision deadline.** `finalizeTs` is a placeholder value (33260976000).
2. **80 vs 235 outcomes.** get-market returns 80 outcomes but the UI shows 235. Is it one market or several, and how are new submissions added?
3. **Pool fee.** `fee 9374` probably means 0.9374%; not verified.
4. **OPPORTUNITY_CREDITS.** What it is and who can hold it.
5. **Price history.** Where it comes from and at what granularity (pool snapshots?).
6. **Archive odds.** What the trailing `+` means, and whether "None of the listed names" behaves like Invalid.
7. **Comment signing.** Only the rejected state was observed.

## B. Information architecture

**Routes and states**

| Route / state | Purpose |
|---|---|
| `#/` | Landing: Wall hero, story beats, Enter |
| `#/m/live?tier=&sort=&q=&k=&view=&o=` | Market: browse 235 lots, with a docked trade ticket (`o` = the selected lot) |
| `#/m/live/o/<slug>` | Lot detail: charts, ticket, takes |
| `#/m/final` and `#/m/final/o/<slug>` | Finalized rebrand market: winner, redeem |
| `#/archive` | Catalogue of past markets |
| `#/portfolio` | Positions, P&L, what can be redeemed (needs a wallet; has a designed empty state) |
| `#/how` | The story beats on their own page, no long text |
| Overlays | Wallet sheet, confirm sheet, command palette (`/`, ⌘K), peek card, tooltips |
| Wallet states | Disconnected · connecting · rejected · wrong network (needs Gnosis, chain 100) · connected with 0 balance · connected and funded (sample data) |
| Ticket states | No selection · idle · quoting · quote ready · confirm · pending · done · failed · capped (price ≥ 1) · unpriced (no pool) · finalized (sell/redeem only) |

**Every control and what it does**

| Control | Where | Effect |
|---|---|---|
| Brand | All pages | Goes to `#/` and scrolls to the top |
| Markets / Archive / Portfolio / How | Header | Opens that route; shows an active state |
| Search pill, `/`, ⌘K | Header | Palette covering all 235 lots, the markets and the routes. Enter on a lot → `#/m/live?o=slug`; ⇧Enter → its lot page |
| Theme | Header | View-transition reveal; choice is remembered |
| Connect wallet | Header, ticket | Opens the wallet sheet. Once connected, an address menu: Copy, Gnosisscan ↗, Switch to Gnosis, Disconnect |
| Hero tile hover / focus | `#/` | Peek card (name, price, rank, 7-day sparkline) after 90 ms |
| Hero tile click | `#/` | **Enter flow:** the tile morphs into the market page at `#/m/live?o=slug`, with the ticket open on that lot |
| "Enter the market" | `#/` hero and beat 7 | `#/m/live` with nothing selected; the ticket says "Pick a name" |
| Beat 4 handle (drag or ←→) | `#/` | Changes k; the caption updates live; k carries into `?k=` |
| Replay finalized | `#/` beat 6 | Replays the rebrand result; the button then becomes "Open rebrand" → `#/m/final` |
| Field strip brush | Market | Filters cards to the brushed rank range (`?r=a-b`); Esc clears it |
| Tier control (All 235 / Priced 59 / Floor 46 / Unpriced 130) | Market | Filters via `?tier=`, cards reorder with a FLIP animation |
| Sort (Odds, 24h move, A–Z) | Market | `?sort=`, FLIP reorder |
| View (Wall / Grid / List) | Market | `?view=`; tiles animate between views |
| Review-k slider | Market toolbar | Draws the amber cut after card k; readout "Top 27 · 60.4% of odds" |
| Card click / Space | Market | Selects the card; the ticket docks on it; `?o=` |
| Card double-click / Enter / "Open" | Market | Opens `#/m/live/o/slug` |
| Card "Buy" chip | Market | Selects the card and puts focus in the amount field |
| Unpriced chip | Market | Selects it; the ticket shows the no-pool state with "Add liquidity on Swapr ↗" (marked external) |
| Buy / Sell tabs | Ticket | Switches mode. Sell is disabled, with a reason tooltip, when you hold 0 |
| Outcome field | Ticket | Dropdown with search, all 235 names with avatars, type-ahead |
| Pay with | Ticket | sDAI / xDAI / wxDAI / OPPORTUNITY_CREDITS, each with a tooltip |
| +1 / +5 / +10 / +100 sDAI | Ticket | Adds to the amount, then fetches a quote |
| Max | Ticket | Sets the amount to your balance |
| Main button | Ticket | Label follows the state: Connect wallet → Switch to Gnosis → Enter an amount (disabled, with reason) → Review buy → confirm sheet |
| Continue | Confirm sheet | Pending → done (toast with tx link ↗) or failed (retry) |
| Range 24h / 7d / All, hover on a series | Lot charts | Redraws; crosshair readout |
| Neighbouring rank lines | Lot page | Click opens that lot's page |
| Contract ↗, View on Seer ↗ | Market, lot | New tab to gnosisscan / app.seer.pm, marked external |
| Back (icon + breadcrumb), Esc | Detail pages | History back, scroll position restored |
| Archive card | Archive | Opens `#/m/final`. The card says "Finalized", not "Open opportunity" |
| Winner "Redeem" | Finalized ticket | Connect → redeem confirm → done. Non-holders see 0 shares and why |
| Gallery ‹ › | Finalized page | Pages through the 144 images |
| Share your take | Lot page | Connected: opens the composer. Disconnected: wallet sheet. Rejected: one clear error |
| Portfolio row | Portfolio | Opens the lot page; shows "Redeem" when the market is finalized |

**Rule: if a control can do nothing, it is not shown.** If it is shown but disabled, it carries a tooltip saying why.

## C. Three landing and hero concepts

### C1. "The Wall": the field as a live trading floor (Blur × treemap)

**Thesis.** The 235 names are goods on one wall. Price decides how much space each one gets. The sponsor's lane sits outside the wall.

**Hero visual.** A wall filling the page container (1760px wide, height clamp(440px, 64vh, 680px)).
- **Priced names:** the 105 priced names are tiles laid out as a treemap, with area proportional to odds (squarified, aspect 1.3).
- **Tile content:** the name sized to fit the tile (12–40px), the price in monospace, and a 24-hour up/down chevron.
- **Floor:** the 46 floor names form a visibly even plateau.
- **Unpriced:** the 130 unpriced names are a hatched "dust band" of 8×8 cells under the wall.
- **Headline:** **"235 names. Price picks shortlist."**

**Technique.**
- **Tiles:** DOM elements, animated with `transform` and `opacity` only. That is 235 nodes, and they get keyboard focus, ARIA and View Transitions for free.
- **Layout:** `d3-hierarchy` treemap (about 3 KB gzipped).
- **Colour:** `@property --heat` drives a single violet ramp by log-odds.
- **Ticks:** one canvas overlay draws tick sparks.
- **Beats:** CSS `animation-timeline: view()` inside a sticky stage.
- **No WebGL:** 235 rectangles need no shader; the earlier spike measured 1.3 ms per frame on plain canvas.

**Scroll beats.**
1. **Equal.** 235 identical cells. Caption: "235 submissions."
2. **Priced.** Cells animate into the treemap (700 ms spring); the 130 unpriced drain into the dust band. Caption: "130 unpriced."
3. **Floor.** The 46 floor tiles flash together. Caption: "46 tied at 0.4%."
4. **Cut.** An amber line sweeps across and the top k tiles lift. k is draggable. Caption: "27 cover 60.4%."
5. **Gate.** The shortlist slides into an amber lane with a lock: "Seer One decides." A price tick aimed at the lane bounces off.
6. **Payoff.** A replay of the real rebrand result: Electric Foundation pays 1.00 sDAI per share, every other entry drops to 0.
7. **Enter.** The wall goes live again: "Pick a name."

**Shared element into a market.** The clicked tile carries `view-transition-name: lot-<slug>`. Its rectangle morphs into the selected market card and the ticket header, while the other tiles fade and scale to 0.98. Duration 380 ms, easing `cubic-bezier(.2,.8,.2,1)`.

**How it explains "odds are a triage queue, the sponsor decides" without paragraphs.**
- Area = price.
- The amber line = the review cut.
- A separate amber lane = the sponsor's authority, which prices cannot enter.
- Beat 6 = who gets paid.

**Data-bound vs decoration.** Every tile, count, k value and coverage figure is real. 24h moves and price history are sample data, flagged by one "Sample data" chip in the footer. The only decoration is a cursor spotlight on the wall.

**Performance budget.**
- Route JS ≤ 120 KB gzipped.
- Largest Contentful Paint ≤ 1.8 s.
- Scrolling ≥ 55 fps at 1440px with 4× CPU throttling.
- Interaction to Next Paint ≤ 100 ms.

**Reduced motion.** The beats become a static four-panel strip (Equal / Priced / Cut / Gate), and morphs become 120 ms crossfades.

### C2. "The Tape": order flow first (Hyperliquid × Manifold)

**Thesis.** The market is people moving prices: watch the money reorder the field.

**Hero.** A rank ladder of the top 15 (64px rows). A horizontal tape of trades streams into the rows, each trade a pill sized by its sDAI amount. Rows reorder with a FLIP animation when ranks swap. A ghost rail on the right summarises the other 220.

**Technique.** Canvas 2D for the tape (pooled, at most 80 pills), motion layout for the rows, rolling digits for prices.

**Beats.** One trade → the price moves → two ranks swap → the cut line → the sponsor gate → payout → Enter.

**Shared element.** The ladder row morphs into the market row.

**Risk.** The audit found **no trade feed**, so the tape would be simulated and the hero would show invented data. It is also the closest of the three to the list + panel build you rejected.

### C3. "The Catalogue": names as lots (Pudding × auction house)

**Thesis.** Each submission is a lot in a sale; the catalogue is the market.

**Hero.** The leader's name set as a type specimen (Inter Tight variable, 160px). Scrolling flips through lots 001 to 027, with font weight tied to odds (300→700). A strip of 235 numbered lot cards sits below.

**Technique.** A scroll timeline drives the variable-font weight axis. A View Transition carries the specimen word into its lot card.

**Beats.** Lot 001 → its price tag → the tie plateau → the cut → the sponsor stamp → Enter.

**Risk.** It comes close to the "poster headline" hero the UI rules forbid. It says little about the 130 unpriced names, and it only really shines for an image market like the rebrand.

## D. Market page redesign

**Layout at 1280px and wider, top to bottom:**
1. Header.
2. Market bar: title, ACTIVE, liquidity and volume as inline text, Contract ↗.
3. Field strip (64px).
4. Toolbar: tier, sort, view, Review-k, search.
5. Content grid in columns 1–9, with the ticket docked and sticky in columns 10–12.

Below 1280px the ticket becomes a bottom sheet (72px peek, 85vh open). **No KPI tiles, no Cut/Field card.**

**Each tier gets its own form:**
- **Priced (59): lot cards**, full column width × 168px, three per row. Each shows rank (12px mono), name (22px/600), price (28px mono, rolling digits), odds %, a 7-day sparkline (72px), a rank-change chevron and a "Buy" chip. The leader gets a violet halo.
- **Floor (46): dense 64px rows**, four per row, under one sticky label: "Tied at 0.4%: order is alphabetical." This stops the page from implying a ranking that doesn't exist.
- **Unpriced (130): 32px hatched chips**, six per row, labelled "No pool." Selecting one shows the no-pool ticket.
- **Wall view** reuses the landing treemap. **List view** uses 56px table rows, virtualised with `content-visibility: auto`.

**Charts, rebuilt:**

| Old | New | Spec |
|---|---|---|
| TradingView multi-line chart, y-axis crushed to 0–24, 10-item legend | **Lot price line** on the lot page | Log scale from 0.1% to 10%; dashed, labelled line at the 0.4% floor; 60% history / 40% "now" split; crosshair snaps to data points; readout "$0.041 · 4.1% · rank 2"; 320px tall |
| 10-item legend | **Rank bump chart** on the lot page | The 3 ranks above and below over time. Selected lot in violet at 2px, others in grey at 1px and 35% opacity; hover isolates a line; click opens that lot |
| Coverage curve card + 4 KPI tiles | **Review-k slider + field strip** | The curve shrinks to a 120×32 glyph inside the slider; the amber cut is drawn in the grid itself; the readout is one line |
| (none) | **Field strip** | 235 bars with 1px gaps. Height = odds (square-root scale); the floor as a grey-violet plateau; unpriced as hatched stubs. Brushable, and doubles as a minimap |
| Finalized outcome list | **Result bar** | The winner fills violet with an amber "Selected" stamp; the others show 1.00 / 0.00 |

**Trade ticket.** It stays empty until you select a lot, which removes the confusing default to rank-27 Symbiont (audit C01/C02). Top to bottom:
1. Lot header (the target of the morph).
2. Buy / Sell.
3. Amount, with the sDAI unit visible, and the presets.
4. Live lines: *You receive · Avg price · If selected, pays* (shares × 1 sDAI, in green) · *Fee · Min received · Slippage 0.5%*.

The quote refreshes every 10 s, shown as a conic ring on the button. The confirm sheet follows Seer's docs: price, fee, Continue. Prices of 1 or more are blocked, with the docs' reason.

## E. Micro-interaction and graph techniques

| # | Technique | API / library | Cost (gz) | Fallback | Used in |
|---|---|---|---|---|---|
| 1 | Shared-element morph | View Transitions (same document) + `view-transition-name` | 0 | motion `layoutId` FLIP | Tile → card → ticket; card → lot page |
| 2 | FLIP reorder on price tick or sort | motion layout, spring stiffness 520 / damping 38 | Already in stack | Instant | Grid, ladder, bump chart |
| 3 | Rolling price digits | Existing RollingNumber | 0 | 120 ms crossfade | Cards, ticket |
| 4 | Tick flash | `@property --flash` 0→1→0 over 600 ms, green/red at 18% | 0 | Border tint | Tiles, cards |
| 5 | Scroll-driven beats | `animation-timeline: view()` | 0 | IntersectionObserver class toggles | Landing |
| 6 | Treemap layout | d3-hierarchy | ~3 KB | none | Wall |
| 7 | Brushable field strip | Canvas + pointer events | 0 | Tier control | Market |
| 8 | Anchored peek cards and tooltips | CSS anchor positioning + Popover API | 0 | Existing Tooltip with viewport clamping | Tiles, ticket fields |
| 9 | Quote refresh ring | `@property --p` conic progress | 0 | Text "Updating…" | Ticket button |
| 10 | Press and hover springs | CSS `linear()` spring, press scale .96 | 0 | ease-out | All buttons |
| 11 | Crosshair snap + readout | SVG/canvas with the shared label engine | 0 | Static readout | Lot charts |
| 12 | Cursor spotlight | radial-gradient driven by CSS variables, updated per frame | 0 | none | Wall only |

The only new dependency is d3-hierarchy. ogl, GSAP, Lenis and Rive are skipped (reasons in C1 and innovation.md §4).

## F. Recommendation

**Build C1 "The Wall", using C3's lot cards for the browse grid.** It is the only concept that:
- puts 100% real data in the hero,
- shows all 235 entries at once (the marketplace part),
- carries you from the hero straight into a trade through the shared element.

**Departures from the EF kit (need your OK):**
1. JetBrains Mono for **all numbers** (a price board), not only addresses.
2. A landing headline at 72–112px, beyond the 40px H1 rule.
3. A full-width wall instead of a card.

The EF surfaces stay. Colour roles:
- **Violet:** the market and the tile heat ramp.
- **Amber:** the review cut and the sponsor only.
- **Green/red:** 24h changes only.
- **Hatched grey:** unpriced.

**Delete:**
- Files: `CutChart.tsx`, `chart/cutRenderer.ts`, `chart/field.ts`, `Board.tsx`, `PriceHistory.tsx`, `Landing.tsx`, `Market.tsx`, and `Chips.tsx` (to be rebuilt).
- Layouts: the KPI tiles, the Cut/Field switch, the list + side-panel layout, the "Price decides who gets reviewed" page.
- Behaviour: the "Open opportunity ↗" link that leaves the app, and the auto-starting GuidedTour (`#/how` replaces it).

**Keep:** HoverMenu, Tooltip, RollingNumber, CommandPalette, Avatar, WalletDialog (restyled), ThemeToggle, `viewTransition.ts`, `router.ts` (extended), `math/coverage.ts`, `rng.ts`, `trade.ts`, `data/*.json`, the e2e harness.

**Build passes** (each ends with tsc + build + e2e):

0. **Data and spec.** Pull fresh data. Write AUDIT_SUMMARY.md and design.md (with a trace table to the audit). Build one data module, `lots.ts`: slug, tier, odds, price, delta, seeded history.
   - ✔ Counts are 235 / 59 / 46 / 130, and every surface shows identical numbers.
1. **Router and wiring.** Build the IA skeleton with every control wired and no styling. Add a **click-all test**: on every route and state, click each `a`, `button` and `[role=button|tab|option]` and assert a change in URL, DOM, dialog or focus, or else `aria-disabled` with a tooltip.
   - ✔ 0 dead controls (today there are 34).
   - ✔ No in-app call to action leaves the app.
2. **Wall hero.** Build the Wall, the 7 beats and the reduced-motion strip.
   - ✔ ≥ 55 fps in a trace.
   - ✔ Beat captions come from the data.
   - ✔ Mobile page height < 4600px at 390px wide (beats at 60vh on mobile).
3. **Enter flow.** Build the shared-element morphs and the ticket state machine (all 11 states, mock wallet).
   - ✔ One tile click lands on the market with `?o=` set and the ticket on that lot.
   - ✔ Back restores scroll position.
4. **Market browse.** Build the field strip, tiers, sort/view/k in the URL, and the virtualised list.
   - ✔ The 235-row list scrolls at ≥ 55 fps.
   - ✔ Brush filters; Esc clears.
5. **Lot page charts.** Price line, bump chart, takes.
   - ✔ The label-overlap test (test 16) passes.
   - ✔ The crosshair readout matches the card's value.
6. **Remaining pages.** Archive, finalized market, redeem, portfolio, wallet states.
   - ✔ No "Open" action on closed markets.
   - ✔ Redeem is reachable in 2 clicks.
7. **Polish and review.** Motion polish, both themes, widths 320–2560, touch targets, then up to 3 Opus review rounds on real viewport captures.
   - ✔ Full e2e is green.
   - ✔ The click-all test passes again.

**Risks:**
- Floor tiles in the treemap are small, so below 56×28px names only show on hover.
- A long scroll story conflicts with the mobile page-height rule.
- Trades, price history and 24h changes are sample data until the pool feed is wired up.
- Unknown #2 (80 vs 235 outcomes) could change the whole market model.

## G. Questions

1. Do you accept the three EF departures in F (monospace numbers, oversized landing headline, full-width wall), or must the rewamp stay strictly inside the EF tokens?
2. Should a judge be able to complete a **simulated** buy end to end (sample funded wallet, fake transaction), or should trading stop at a real, read-only wallet connect?
