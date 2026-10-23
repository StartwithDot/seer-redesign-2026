# Explorer (Seer app): three concepts, decision, build spec
Author: Claude (Opus 5.5) in the design-director role, 2026-10-19. Inputs read: inspiration sheets 01/04/11/12 viewed together with inspiration-notes.md (all 13 summarised there), kit boards (dark board, palette, ticket), AUDIT_SUMMARY, CHART_AUTOPSY, PARITY_MAP (+ PARITY_MAP_DRAFT for rows after T-18, see note), flows.md, SCENARIO_REPORT, UNOBSERVED, ux.md, innovation.md, data-model.md, `data/markets-search.full.json`, audit-gap 001 (conditional page), docs-site digests.

**Facts from the real data that drive every concept** (`markets-search.full.json`, 100 of `count: 2947`):
- `odds[]` is served per outcome and **does not sum to 100**. Knesset: `[60.8, 38.1, 0.5, 0.9, null]` (Σ 100.3, Invalid `null`). Le Pen child (audit-gap 001): No 74.5 / Yes 35.3 (Σ 109.8). The outcomes are priced by separate pools, and 1 sDAI mints one of each outcome token [docs: mint-merge-redeem], so Σ ≠ 100 shows that the pools disagree. The live UI hides this. We show it and never normalise silently.
- Type comes from `templateId` (1 = Scalar, or Multi Scalar when `questions.length > 1`; 2 = Categorical; 3 = Multi Categorical; sample counts 25 / 74 / 1). Conditional means `parentMarket.id ≠ 0x0` (17 of 100), with `parentOutcome` (0 = Yes, 1 = No). Unverified means `verification` is missing (12 of 100). Chains: 99 Gnosis (100), 1 Ethereum (1). OP and Base have 0 in the sample, and that 0 is shown.
- Units are `liquidityUSD`, `volumeUSD`, `volumeNotionalUSD`, `openInterestUSD` ($), `poolBalance[i].token0/1 {symbol, balance}` (per-outcome pool) and `questions[].min_bond` (wei, so `10000000000000000000` = 10 xDAI). `incentive` > 0 is assumed to mean "has rewards" (**A-1, confirm with PT**). No futarchy flag exists in the sample (**A-2**).
- PARITY_MAP.md is truncated at T-18. Rows T-18…T-22 (More / Mint / Merge / Redeem), TAB-01…19 (Comments / Related / Holders / Activity), SC (scalar DOWN/UP) and MOB (mobile) come from PARITY_MAP_DRAFT / AUDIT_SUMMARY and are re-listed in the Build spec.

---

## Concept 1 — "The Ledger of Odds" (ledger as instrument)

**(a) Thesis.** Every Seer market is one line of a public ledger. On that line the prices *are* the figure: a 0–100% odds strip with every outcome marked, plus a Σ notch showing whether the outcome pools agree.
**Model / math.** Mark position `x_i = odds_i/100 · W` (linear, fixed 0–100). Coherence `Σ = Σ_i odds_i` over non-null outcomes; the notch length is `|Σ − 100| · W/100`, drawn past the 100 tick when Σ > 100 and as a gap before it when Σ < 100. A tooltip explains it: "Prices come from separate pools; 1 sDAI mints one of each." Drift column: `Δlogit = ln(p_t/(1−p_t)) − ln(p_{t−7d}/(1−p_{t−7d}))` for the leading outcome (from `markets-charts`), so 2→4% reads as strongly as 40→60%. Scalar estimate is `lower + p_up·(upper−lower)` (live "Market Estimate"). Conditional mosaic: parent outcome share × child shares = derived joint (labelled "derived").

**(b) Figure and composition.** The figure is the odds strip (160×12 px per row) beside a 48-point sparkline. The page is a three-part desk: a query column (live Filters, always open), the ledger, and an inspector built from kit card parts. View tabs on one dataset: **Ledger / Map / Cards**.
```
DESKTOP 1680+  ┌ beta strip 28 ───────────────────────────────────────────────────────────────┐
┌ seer  Markets Leaderboard Create Market  Policies▾ App▾ [⌘K Search by market, outcome…] ●Gnosis 0x0000…dEaD 24.69 xDAI ? ☾ ┐
│ QUERY 216        │ Ledger  Map  Cards    2,947 markets · sorted Liquidity ↓   [Filters] [Create New Market] [My collections] │ INSPECTOR 360        │
│ Market States    │ ★ STATUS        QUESTION                          ODDS 0────50────100 Σ    7D    LIQ     VOL    OPENS  ⛓│ ▣ Which party…Knesset│
│ ○All      2947   │ ☆ ●Reports open Which party … Knesset 2026?      |Yashar▮··▮Likud  |   100.3 ╱╲_ $27.74k $5.10k Jul 17 G│ Yashar 60.8% [Yes][No]│
│ ○Reports open 61 │ ☆ ●Reports open Will the National Rally's…  ↳2  |──────▮No 74.5 ▮Yes|━ 109.8 _╱ $7.54k $11.75k …   G│ Likud  38.1% [Yes][No]│
│ ✓ Verified   88  │ ☆ ▲Unverified   Will a court rule against…       |▮No ·········▮Yes|   99.6 ── $918.38 …          G│ Σ 100.3 · Invalid —  │
│ Chain  G 99 E 1  │ ☆ ◆Scalar       Average BASEFEE Jan 2027 [gwei] |DOWN──9.09──UP   | gwei  ─╲ …                    E│ id ledger: market ⧉ │
│ Sort Liquidity ↓ │   … 28 px rows, ~26 visible at 900 px height                                                  │ conditionId ⧉ pool ⧉ │
│ □ Conditional 17 │                                                                                                │ OI 5.75k sDAI (7.26k $)│
│ □ Rewards  …     │                                                                                                │ [Open market]        │
│ Min liquidity [ ]│                                                                                                │                      │
│ [Cancel][Apply·41]│                                                                                               │                      │
MOBILE 390 ┌ seer        ⌘  ☰ ┐
           │ Ledger Map Cards  [Query ▾ 3] │
           │ ●Reports open  Which party … Knesset 2026?        │ 56 px two-line row
           │ |Yashar▮···▮Likud|  Σ100.3  $27.74k  ╱╲_         │
           │ … tap = inspector sheet; Enter/Open = market     │
```
**Market page** (key/value ledger, docked chart and ticket, ranked outcomes):
```
│ Home / Market                                                     ☆ ✓Verified │
│ [Conditional band: parent question · if "Yes" · mosaic][Unverified band if any] │
│ ●Reports open · Categorical · Gnosis   Will the National Rally's candidate …?   │
│ Liquidity $7.54k ⓘ  Volume $11.75k  P&L —  Opens Jan 1 2027 00:00 UTC  [Answer on Reality.eth!] │
├ CHART 0–100 % fixed (520) ───────────────────────────────┬ TICKET 360 ──────────┤
│ 1D 1W 1M All Custom ⓘ  ‹ ›  ⤓               No 74.5 ─┤   │ ● No   Market▾        │
│ ┊ step lines, labels in a 56 px right gutter ┊   Yes 35.3┤ │ You pay [ 1 ] LEPEN_NRYES│
├ OUTCOMES (ranked named bars) ────────────────────────────┤ You will get 1.1868 No│
│ #1 No  ▮▮▮▮▮▮▮▮ 74.5%   Pool ▸  Add Liquidity  New conditional market │ Avg · After · Return  │
│ #2 Yes ▮▮▮▮ 35.3%       …                                 │ Max slippage 1% ⚙     │
│ #3 Invalid 0% · 210.85 SER-INVALID ⓘ                     │ [Not enough balance.] │
├ ID LEDGER (Etherscan) ─────┬ EVENTS ───────────────────────┤ More ▸ Mint Merge Redeem│
│ Market 0xbbf8…⧉ ↗ Gnosisscan│ 1 UPCOMING Jan 1 2027 Reality.eth Resolution │
├ Comments · Related conditional (2) · Top Holders · Activity ───────────────────┤
```
**(c) Type and color.** Inter Tight 12/16 rows, 13/18 titles, 15/500 page title, H1 clamp(26, 2.4vw, 40). Numerals are tabular. JetBrains Mono 12 for ids only. Roles: violet = selected row, primary action, Yes/rank-1 mark; ink-grey = No/neutral marks; blue = rank-2 mark; teal = rank-3 mark; ranks 4+ = grey ticks; Invalid = hatched grey; status Open green / Resolving amber / Resolved grey; amber also for the Unverified band (with a ▲ glyph); deltas green/red with ±. Departures: see Build spec §2.
**(d) Signature interaction and motion.** *Scrub-to-rank.* Dragging across the market chart sets time *t*. The outcome bars re-rank with FLIP (140 ms) to their values at *t*, and the strip marks slide. This shows rank change and how fast it happened, which a table of numbers cannot. On the index, hovering a row crossfades the inspector (90 ms), sparklines draw in once (420 ms), and on a data refresh the strip marks slide (140 ms) and the Σ notch grows or shrinks. There are no ambient loops.
**(e) Parity.** The full table is in Build spec §9 (this is the chosen concept).
**(f) Flows.** Build spec §8.
**(g) Not SaaS, not a reskin.** There are no tiles, KPI strip or chip rows. The primary object is a sorted ledger whose cells *are* a figure (strip, Σ, drift). The live product is a 4-column donut grid with no table; this is a table-first instrument, and the grid survives only as an opt-in tab.
**(h) Risks / performance.** Density can read as "spreadsheet", so the strip, Σ and drift must carry the identity. A 28 px row is below the general dense-row rule (listed departure). Virtualized DOM rows (react-virtual) need ≥55 fps with 500 rows: the spike shows 60 fps on canvas, and DOM must be re-measured (Gate E perf test). Sparklines come from one shared offscreen canvas per row.

---

## Concept 2 — "The Field" (map-first)

**(a) Thesis.** All of Seer is one field: each market sits where its crowd is certain or torn and where its resolution is near or far, and conditional children hang from their parents on visible tethers.
**Math.** x = leading-outcome odds on a logit scale (`ln(p/(1−p))`, ticks at 50/70/90/97/99%) so that near-certain markets spread out. y = time to `openingTs` (log days). Dot area ∝ √`liquidityUSD`. Placement uses a static d3-force beeswarm precomputed in a worker. Tethers run from parent to child (`parentMarket.id`, `parentOutcome`), and the child dot shows its derived joint (parent outcome × child).
**(b) Composition.**
```
DESKTOP  [query line ⌘K]  Field | Ledger | Cards                         [legend: area = liquidity]
  resolves in ↑ 7d ┊ ○  ◯   ●──╮                                   ┊ hover card (kit) ──────┐
            30d    ┊   ◯ ○ ●   ╰─● (if Yes)                         ┊ Le Pen child  No 74.5   │
            1y     ┊ ◯   ○○●● ◯ ●                                   ┊ [Yes][No] $7.54k        │
                   50%      70%      90%     97%  99%  ← leading odds (logit)  └──────────────┘
                   ledger drawer (selected cluster) 28 px rows ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
MOBILE   field rotated (x vertical) 340 px tall + list of the 20 nearest markets below
```
**(c)** Same tokens. Dot fill by status family (green/amber/grey), violet ring for selection, amber dashed ring for unverified. Departures: logit axis (non-linear, labelled); 20% dim of non-selected dots.
**(d) Signature.** Lasso-select a region to filter the ledger drawer to it. Tethers light up on hover. When filters change, dots relax into their new positions (420 ms, a single settle). This shows where the uncertain, liquid, soon-resolving markets are and which ones are hostage to a parent.
**(e) Parity (grouped).** G/M shell and menus are identical to C1. H-01 is the Cards tab and H-03 the Ledger drawer. H-04..17: hover card plus drawer row. H-18..34: query line plus Filters popover. L, C, CL, P, RA, CH, O, I, T, TAB are the same pages as C1 (market page, ticket, leaderboard reused). The field only replaces the index hero.
**(f) Flow (scenario 01).** ⌘K → market (2), or lasso a cluster → drawer row → Open (3) → ticket.
**(g)** A bespoke field rather than tiles, so it is neither SaaS nor a reskin.
**(h) Risks.** Seer's Etherscan job is *find, sort, compare*, and a field cannot be sorted. 2,947 labels collide (only the top 12 can be labelled). Odds without history make y and x snapshots only. It is weak for keyboard users and screen readers, the mobile rotation is unfamiliar, and the 5-second test fails ("what is a dot?").

---

## Concept 3 — "The Query Desk" (notebook-first)

**(a) Thesis.** Explorer is a question you type: `state:reports-open chain:gnosis liq>1k conditional sort:volume`. The answer comes back as a stack of cells: the matching ledger, the distribution of their odds, and the lineage of any conditionals.
**Math.** A tokenised predicate over the adapter model. Result cell 2 is a histogram of leading odds (20 bins, 0–100) plus a liquidity CDF (log x), so you can see whether the matching set is contested or settled. Σ coherence is shown per row as in C1.
**(b) Composition.**
```
DESKTOP  ┌ › state:reports-open chain:gnosis liq>1k sort:volume▾        41 markets ┐
         ├ cell 1  LEDGER (28 px rows, 12 shown, "show all")                     ┤
         ├ cell 2  ODDS HISTOGRAM 0–100 │ LIQUIDITY CDF (log)                    ┤
         ├ cell 3  LINEAGE (parents → children, if any)                          ┤
         └ + add cell: compare · export · saved query (= collection)            ┘
MOBILE   query line → token chips keyboard → cells stacked full width
```
**(c)** Same tokens, plus JetBrains Mono for the query line (departure: mono outside addresses).
**(d) Signature.** Each token resolves as you type: the count rolls and the histogram bars FLIP to the new set (140 ms). This shows how each constraint reshapes the market universe.
**(e) Parity (grouped).** Filters H-21..32 become tokens, with a "Filters" button that opens a form writing those tokens (Cancel/Apply). Search H-18/19 is the free text in the query. The other groups are as in C1.
**(f) Flow (scenario 01).** Type `le pen` → Enter on row → market → amount: 3.
**(g)** A notebook/query desk rather than a dashboard.
**(h) Risks.** Persona (a), the newcomer arriving by link, never types queries. The copy budget and the "controls need no explanation" target (ux.md) fail. It reinvents filters as syntax, it duplicates the leaderboard's mental model badly, and the hero is a text field, so there is nothing to see in 5 seconds.

---

## Decision

**Chosen: Concept 1, "The Ledger of Odds".** It is the only concept that answers all five jobs in ux.md at a glance:
- find, sort and compare: sortable columns and the query column;
- trust: the Σ notch, units per column, the unverified band and the fixed axis;
- lifecycle: the status column and the events block;
- the link-landing newcomer: the market page reads as question → odds → act;
- the agent builder: the id ledger with copyable conditionId/parent.

It resolves the kit tension without cheating: kit patterns live *inside* rows (Yes/No micro-buttons on hover), in the inspector (outcome rows with %, Up/Down for scalar, head-to-head for 2-outcome), in the ticket ($1/$5/$20/$100 chips + Confirm), and in a real Cards tab.

**Why the others lost.**
- **C2 Field:** beautiful, but it optimises discovery over lookup. An index of 2,947 markets must be sortable, keyboard-traversable and screen-reader-readable, and a beeswarm is none of these. Its best idea, conditional tethers, survives in C1 as the lineage glyph `↳2` and the mosaic band, and the field survives as C1's **Map** tab (treemap: area = liquidity, colour = 7-day drift sign).
- **C3 Query Desk:** it moves the burden onto the user and fails the 5-second and newcomer tests. Its best idea, the URL-encoded query, survives in C1 because every query-column state is mirrored in the URL and shown as a one-line readable summary above the ledger ("2,947 markets · sorted Liquidity ↓").

---

## Build spec (Concept 1)

### 1. Screens and routes (hash router; Back/forward; Esc = back on detail)
| Route | Screen |
|---|---|
| `#/?view=ledger\|map\|cards&marketName=&state=&verification=&chain=&sort=&dir=&conditional=1&rewards=1&futarchy=1&minLiquidity=` | Index |
| `#/markets/:chainId/:slug` | Market page (`?range=1D\|1W\|1M\|All&from=&to=&tab=comments\|related\|holders\|activity&pool=i`) |
| `#/leaderboard?period=1D\|1W\|1M\|ALL&app=&chain=&sort=score\|pnl\|volume\|roi&dir=&q=&page=` | Leaderboard |
| `#/create-market?step=1\|2` | Create (step 2 = docs-only preview, gated) |
| `#/collections/default` | Collections |
Overlays: Policies / App / Account menus (HoverMenu), ⌘K palette, Report Answer dialog, Add Liquidity dialog, Custom range popover, TxGate sheet, mobile nav sheet, mobile ticket sheet, mobile query sheet.

### 2. Tokens, color roles, EF departures
| Role | Token | Dark | Light | Used for |
|---|---|---|---|---|
| primary / rank-1 / Yes / selection | `--sem-primary` | #7B3AFF | #6C2BD9 | CTA, selected row bar (2 px left), rank-1 mark |
| No / neutral mark | `--series-no` | #A8A8B3 | #5C5C66 | No marks, ranks 4+ ticks |
| rank-2 mark | `--series-2` | #5B9DFF | #2F6FD6 | 2nd outcome |
| rank-3 mark | `--series-3` | #2FD4C0 | #0E9A8B | 3rd outcome |
| Open | `--sem-open` | #3DDC97 | #12915F | status dot "Reports not open yet"/"Trading Open" |
| Resolving | `--sem-resolving` | #F5B84A | #B9770E | Reports open, Waiting for answer, In Dispute (▲ glyph), Pending execution; Unverified band |
| Resolved | `--sem-resolved` | #67676F | #8E8E99 | Closed |
| delta ± | `--sem-up/down` | #3DDC97 / #FF5C72 | #12915F / #D1334A | drift column, P/L, ROI (always with sign) |
| Σ notch | `--sem-coherence` | #9C6FFF | #6C2BD9 | notch past/before 100 |
Surfaces/text as EF (#101013/#1A1A1E/#1F1F24; #EDEDF2/#A8A8B3/#67676F; light #F7F7F9/#FFF/#F0F0F3, #17171C/#5C5C66/#8E8E99); button-secondary #241E33 / #EFE9FC with text #9C6FF2 / #6C2BD9 (kit palette). Colour is never the only code: status has a glyph (● open, ◐ resolving, ▲ dispute/unverified, ○ closed), and marks carry names or ranks.

**EF departures**
| Departure | Reason |
|---|---|
| Ledger rows 28 px desktop (ui-quality §3 says 56 px dense) | Etherscan/Dexscreener density; ≥26 markets per screen (ux.md target ≥12); 56 px at touch widths |
| 1 px hairline row separators (EF: tonal, no borders) | At 28 px, tonal zebra flickers when scrolling fast; hairline `--line` = text-muted at 12% alpha |
| Purple header bar → EF tonal header + 2 px violet top rule | The live purple bar is the live identity (reskin risk); G-02 is satisfied by the header itself |
| Blue + teal as rank-2/3 series | Many-outcome markets need 3 separable marks; the approved palette has 2 extra families |
| Non-linear drift column (Δlogit) | 2→4% must read as strongly as 40→60% |
| JetBrains Mono for conditionId/questionId/pool id | Copyable hex ids (EF allows mono for addresses; extended to ids) |
| Cards view = equal tiles | Alternate tab only; kit fidelity; never the default |

### 3. Components (fixed sizes)
| Component | Size / rule |
|---|---|
| Beta strip | 28 px, 12 px text, dismiss ✕ (session) |
| Header | 56 px; nav 36 px targets; search pill 320×36 (⌘K/"/"); chain icon 24; wallet pill 140×36; account button 120×36; help, theme 36×36 |
| Query column | 216 px; group title 12/16 caption; option row 28 px with right-aligned count (tabular); Cancel 88×36, Apply 120×36 ("Apply · N") |
| View tabs | Segmented 3×88 px, 36 high |
| Ledger header | 32 px sticky; sortable headers carry aria-sort; click toggles ↓/↑ |
| Ledger row | 28 px (56 px ≤700 px or hover:none: 2 lines). Columns: ★ 24 · status 120 (dot + label, never wraps; label ellipsis + tooltip) · question flex min 280 (lineage glyph `↳N` 28 px slot, unverified ▲ 16 px slot) · odds strip 168 · Σ 52 · 7D spark 72 · Liquidity 80 · Volume 80 · Opens 72 · chain 24 |
| Odds strip | 160×12 plot + 8 px label inset; marks 2×12; names for the top 2 only when ≥24 px apart (label engine), otherwise rank numerals; the Σ notch extends up to 16 px past the 100 tick (clamped, "≥" label if clamped) |
| Row hover actions | Kit Yes/No micro-buttons 40×20 replace the Opens/chain cells on hover/focus (binary only); multi-outcome rows show "Trade ▸" |
| Inspector | 360 px, docked ≥1680, overlay drawer 1280–1679 (`data-overlay`), sheet <1280; blocks: kit outcome rows 40 px (name, %, Yes/No), id ledger rows 28 px, breakdown table, Open market button |
| Status pill | 112×24 one family everywhere |
| Market chart | 520 px desktop / 280 px mobile; right label gutter 64 px outside the tick column |
| Outcome bar row | 40 px; rank 32 · name flex · bar 240 · % 56 · actions (Pool ▸, Add Liquidity, New conditional market) as a 32 px overflow menu on ≤1280 |
| Ticket | 360 px; inputs 48 px; quick-add chips +$1 +$5 +$20 +$100 (4×72×32, kit); CTA 48 px full width |
| Dialogs | 480 px max; focus trap; Esc closes |
| Leaderboard row | 36 px; score mark 72 px slot (value 15/500 + band word 12 caps) |
| Avatars | 20 (row) / 32 (inspector) / 44 (market title); market image from `images.market`, otherwise initials on violet-soft |

### 4. States
| Surface | Empty | Loading | Error | Wallet-gated | Ended/other |
|---|---|---|---|---|---|
| Ledger | "No markets match" + Reset query (button) | 12 skeleton rows, 400 ms shimmer | "Couldn't load markets" + Retry | — | Closed rows grey; sortable to bottom |
| Page beyond sample (row 101+ of 2,947) | One 28 px row "Live fetch off — sample has 100 of 2,947" | — | — | — | — |
| Market page | 404 slug → "Market not found" + Back to Markets | skeleton header + chart frame | Retry | Ticket CTA "Connect" when disconnected | Closed: ticket swaps to Redeem (docs) + gated TxGate |
| Ticket | "Enter an amount" | Potential return skeleton (T-13) | "Not enough balance." disabled + tooltip | "Connect" | Trade/Approve → TxGate sheet "Confirm in wallet — not observed; nothing is sent" |
| Conditional | — | — | — | Pay token = parent outcome token; balance 0 → "Get LEPEN_NRYES" link to parent ticket | Parent resolved differently → strip greyed, band "Parent resolved No — tokens worthless" (driven by `parentMarket.payoutReported` + `payoutNumerators`) |
| Leaderboard | "No traders for this filter" | "Updating…" overlay (old rows dimmed 40%) | Retry | Your Rank hidden when disconnected; "Finding your rank…" while searching | — |
| Create | — | — | — | Disconnected: "Connect" gate (C-04) | Step 2 fields from docs, all disabled, "[from docs] not observed" caption; Create Market → TxGate |
| Collections | "No markets in this collection" (CL-02) | — | — | "Sign in" gate (CL-01) | Signed-in content = starred markets in ledger form (**A-3**, confirm) |
| Comments | "No takes yet. Share the first one." | — | "User rejected the request." | "Connect your wallet to share your take" + Connect to comment; "Signing in..." | Posting UI: gated (unobserved) |
Every unobserved step (approve, sign, tx pending/success, dispute/Kleros, Portfolio/Account/Deposit/Trade Collateral pages, Policies bodies, add/remove-liquidity tx) is shown by the TxGate or the ExternalGate sheet ("Opens <host> — page not observed in audit" + real external href when one is known). Nothing is invented.

### 5. Data adapters (real JSON, `src/data/adapters.ts`; one source of truth)
```ts
type Market = { id; chainId: 100|1|10|8453; slug: url; name: marketName; type: 'Categorical'|'Multi Categorical'|'Scalar'|'Multi Scalar'
  /* templateId 2|3|1; Multi Scalar when questions.length>1 */; outcomes: {label: string.trim(); odds: number|null; token: wrappedTokens[i];
  pool: poolBalance[i] /* null for Invalid */; image?: images.outcomes[i]}[]; sigma: Σ non-null odds; liquidityUSD; volumeUSD;
  volumeNotionalUSD; openInterestUSD; openingTs; createdTs: blockTimestamp; verified: verification?.status==='verified';
  verifyDeadline?; parent?: {id, outcome: +parentOutcome, payoutReported, payoutNumerators} /* only if id≠0x0 */;
  status: deriveStatus(questions, openingTs, payoutReported, NOW); bondXDAI: min_bond/1e18; rewards: incentive>0 /*A-1*/;
  bounds: {lower: +lowerBound, upper: +upperBound, unit: /\[(.+?)\]\s*$/ from marketName}; ids: {conditionId, questionId, creator, factory, collateralToken, transactionHash} }
```
- `deriveStatus` (labels verbatim from live Filters): now < openingTs → "Reports not open yet"; finalize_ts = 0 and no answer → "Reports open"; `is_pending_arbitration` → "In Dispute"; answered and finalize_ts > now → "Waiting for answer"; finalized and !payoutReported → "Pending execution"; payoutReported → "Closed". `NOW` is fixed to the fixture capture time (2026-10-18T00:00Z) so the data is deterministic. Mapping to be confirmed against the live labels (**A-4**).
- Chart: `market-chart.json` / `markets-charts.json` → `{t, values[]}` step series; missing series → "No price history in sample".
- Leaderboard: `get-pnl-leaderboard.json` → rows `{rank, address, name?, pnl, volume, roi, marketCount, score, band}`, plus `updatedAt`, `total`; sort and page are applied client-side over the fixture, and pages beyond it get the "Live fetch off" row.
- Events, comments, holders/activity: `get-market-events`, `market-comments`, `get-token-transactions`; portfolio: `get-portfolio-pl` (Account menu → Portfolio = ExternalGate).
- Formats: money `$27.74k` / `$918.38` (live parity); tokens `5.75k sDAI (7.26k $)` with one unit per column; shares and prices 4 dp; `<0.001`; minus U+2212; em dash for null. **Rounding disclosure**: "You will get 1.1868 Yes" + caption "4 dp · exact" (button) → reveals `1.1868081659397476` (T-08 kept, fixed).
- Live fetch behind `?live=1` (same adapter), off by default.

### 6. The fixes, as rules
1. Chart y: categorical is fixed at 0–100%. Scalar is fixed to [lower, upper] in the unit. A "Zoom to data" toggle shows a persistent badge "Axis zoomed 8.5–9.2 gwei". Ticks every 20% (categorical) or 5 nice ticks.
2. End labels sit in the 64 px gutter, use the label engine (18 px separation, merge into "+3"), and never sit over the tick column. The origin artifact is not reproduced. The x axis has monthly ticks with a year boundary label at January.
3. Chart caption under the range row: "Pool prices, not trades ⓘ" (CH-16 surfaced, not buried).
4. Many outcomes (up to ~80): the strip shows the top 3 named, the rest as 1 px ticks. The chart draws the top 6 lines plus a "+74 others" grey band (min–max envelope), and selecting a bar isolates its line. Outcome bars show the top 12 plus "Show all 80" (virtualized).
5. Conditional: a band above the title with the live sentence verbatim, a parent link, the parent's live status and odds, and the **mosaic** (parent outcome share containing the child split, labelled "derived: parent × child"). The ticket pay token is the parent outcome token, with the caption "Paid in parent 'Yes' tokens" and an ⓘ that holds the worthless rule. The ledger row shows `↳N` on parents (N children) and `↰` on children.
6. Unverified: amber band "This market is unverified (it didn't go through the curation process). Exercise caution." + "Verify it" (Kleros curate link); ▲ in the ledger row; ticket header ▲ "Unverified".
7. Σ ≠ 100: a Σ column plus a tooltip. Odds are never normalised.
8. Invalid: shown as outcome #N with `0%` + token value, ⓘ "Pays out if the question is invalid".

### 7. Motion budget (all off under prefers-reduced-motion)
| Animation | Duration | Bound to |
|---|---|---|
| Inspector crossfade on row hover/select | 90 ms | selection |
| Strip marks slide + Σ notch resize | 140 ms ease-out | odds change (refresh/live) |
| Outcome bars FLIP on scrub/time change | 140 ms | rank at *t* |
| Sparkline draw-in | 420 ms, once per row mount, max 8 staggered 30 ms | entry |
| Number roll (liquidity, ticket output) | ≤2 digits, 140 ms | data tick |
| Theme toggle view-transition | 420 ms | theme |
| Route view-transition ledger → market (row title morphs to H1) | 240 ms | navigation |
No particles, no ambient loops. Budget: ≤3 concurrent animations per viewport; ≥55 fps with 500 virtualized rows during scroll.

### 8. Flows redesigned (live steps → new steps)
| Flow | Live | New steps |
|---|---|---|
| S01 search → trade preview (desktop) | 6 | 1 ⌘K "Marine Le Pen" (markets + outcomes grouped) → 2 Enter (opens market; ticket focused, Yes preselected as live) → 3 type `1` → preview "1.1868 Yes · 4 dp". **Shortcut:** hover row → Yes micro-button → inspector ticket (2 steps, never leaves index) |
| S02 leaderboard comparison | 9 | 1 Leaderboard → 2 period 1W → 3 ALL (URL) → 4 Chain ▾ Gnosis (menu applies directly; Filters panel still exists) → 5 Score header → 6 Next / Previous (sort works; page counter visible) |
| S03 market research | 8 | 1 open market → 2 range 1M (presets also in the Custom popover; Save commits) → 3 tabs Top Holders / Activity / Related conditional (2) in the docked lower panel, same scroll position. 5 steps |
| S04 liquidity investigation | 4 | 1 open market → 2 outcome row "Pool ▸" (inspector: Pool Id ⧉, Liquidity Chart, Pool Balances ladder SHARES/TOTAL, Last:) → 3 Add Liquidity dialog |
| S05 report answer preview | 5 | 1 open market → 2 "Answer on Reality.eth!" (status strip) → 3 "Mark this question invalid" → 4 review: bond 10 xDAI, Current answer, Answer → TxGate |
| S06 collections gate | 4 | 1 "My collections" → 2 Sign-in gate (Connect) → empty state |
| S07 mobile search → trade | 4 | 1 ⌘ search sheet → 2 result → 3 Trade FAB (sheet, Yes preselected) → type amount |
| S08 mobile leaderboard | 9 | same as S02 at 390; table becomes labelled 2-line rows |
| Conditional | 2–3 (find via Filters/Related tab) | 1 Index row `↳2` expands children inline (two 28 px child rows, "if Yes"/"if No") → 2 open child: band + mosaic + parent-token ticket; "Get LEPEN_NRYES" jumps to parent ticket with Yes selected |
| Find by topic | 1 + typing (search broken) / 3+ with Filters | type in pill → ledger filters live, `?marketName=` written; query column counts update |

### 9. Parity map → Concept 1 (every ID; test name = PARITY_MAP column unless noted)
| IDs | Where / how |
|---|---|
| G-01 | Beta strip, verbatim copy |
| G-02, G-12 | Header (EF tonal + violet rule; departure) / dark default applied to every surface |
| G-03..06 | Wordmark → `#/`; nav Markets, Leaderboard, Create Market |
| G-07..10 | Chain icon (menu: Gnosis/Ethereum; wrong chain → "Switch to Gnosis", P-26), wallet pill `0x0000…dEaD`, account `24.69 xDAI`, help (starts tour) |
| G-11, G-13 | Theme toggle with live aria-labels; content and scroll preserved (test asserts same rows) |
| G-14, H-20 | Disconnected: "Connect" replaces pill and account; ledger still present |
| G-15 | Menus are popovers; the page underneath stays visible |
| G-16 | Not a UI requirement; test asserts no Seer-resource 404 |
| M-01..03 | Policies menu: Verified Market Policy, Market Rules Policy → ExternalGate (body unobserved) |
| M-04..08 | App menu: Futarchy, Deepfunding, Foresight, Opportunity Markets (external hrefs) |
| M-09..16 | Account menu: Account, Deposit, Portfolio, Market Collections (→ `#/collections/default`), Trade Collateral, Use smart account (switch, aria-checked); 6 items + toggle |
| H-01, H-07..09 | **Cards** tab: 4 columns ≥1280, kit cards with 40 px donut + 2–3 legend rows + SEER mark; test renamed `…card-grid-four-columns-in-cards-view` |
| H-02 | Ledger virtual scroll, next page appended at end (sample: "Live fetch off" row) |
| H-03 | Inverted on purpose: `parity-index-has-table-view` (documented improvement) |
| H-04..06 | Row question link / title text full in inspector / 20 px avatar |
| H-10, H-11 | Liquidity column `$27.74k`; status column + ✓/▲ verification slot |
| H-12..15 | Inspector "Open interest and liquidity breakdown" block (also an ⓘ button on the Liquidity cell): OI dual unit, Volume + notional, per-outcome pool liquidity rows |
| H-16, H-17 | Inspector id ledger: market address → gnosisscan.io/address, Verified → curate.kleros.io/tcr/100/… |
| H-18, H-19 | Search pill placeholder verbatim; writes `?marketName=`; ⌘K palette |
| H-21 | "Filters" button collapses/expands the query column (desktop) / opens the query sheet (mobile) |
| H-22..30 | Query groups verbatim: Market States (7), Verification Status (5), Chain (5), Sort By (6) + Desc/Asc switch, Conditional Market, Minimum Liquidity, Rewards, Futarchy (A-2: sample shows "not determinable"); column headers mirror Sort By |
| H-31, H-32 | Cancel (revert staged) / Apply ("Apply · N" preview count) |
| H-33, H-34 | Toolbar "Create New Market" → `#/create-market`; "My collections" → `#/collections/default` |
| L-01..03 | Heading; Trader Score prose in the "How it works" ⓘ popover (prose ≤14 words on page: "Score 0–100 · returns, profit factor, hit rate, loss burn, breadth"); "How it works" → docs.seer.pm/app/leaderboard |
| L-04..07 | Period segmented 1D 1W 1M ALL |
| L-08..10 | Filters button → panel: App (4) and Chain (5) |
| L-11, L-30, L-36 | Your Rank (connected only) → "Finding your rank…" → scroll + highlight |
| L-12, L-13 | Search "by username or address" + Search button (works over fixture) |
| L-14..21 | Columns #, Account (pseudonym or ENS → app.ens.domains), Score (value + band, N/A + header ⓘ), Profit/Loss, Volume (USD 2 dp), ROI signed, Traded Markets |
| L-22..25, L-34 | Sort Score, Profit/Loss, Volume, ROI (rows actually reorder); #, Account, Traded Markets also sortable (optional row satisfied) |
| L-26, L-27, L-31, L-33 | Previous / Next, "Page 1 of N", 25 rows |
| L-28, L-29, L-32 | "Sorted by Profit/Loss, high to low"; "Updating…"; "Updated <date, time>" from `updatedAt` |
| L-35 | Disconnected still renders rows |
| C-01..05 | Step "1 of 2", Type select empty (4 type rows with a one-line definition each [from docs]), Next disabled + tooltip "Choose a type", Connect gate, footer SECURED BY KLEROS + socials |
| C-06 | Step 2 docs-only preview, disabled, `[from docs]` |
| CL-01..03 | Sign-in gate; empty state; signed-in = A-3 |
| P-01..03, P-07..11 | Route; breadcrumb Home / Market; status strip (2 px top rule in status colour + dot); verification ✓; star (aria-pressed); 44 px avatar + H1; `[party bloc]` literal |
| P-04..06 | Status labels Reports open, Trading Open, Pending execution (colour family per §2) |
| P-12, P-13, P-15..17 | Meta line: Categorical/Scalar/Multi Scalar; Liquidity; Volume; P&L (— when disconnected); Verified link |
| P-14 | Liquidity ⓘ tooltip verbatim |
| P-18, P-19 | Scalar "Market Estimate: 9.092 gwei" + "Resolution opening at …" |
| P-20, P-21 | Multi-scalar question list ("Answer: Answered too soon", Reopen question → Report dialog) + Hide questions |
| P-22, RA-01..07 | "Answer on Reality.eth!" → Report Answer dialog: Current answer, Choose an answer, Mark this question invalid, bond 10 xDAI, Return, Answer → TxGate |
| P-23 | Events block "1 UPCOMING · JAN 1, 2027 00:00 UTC · Reality.eth Resolution · Expected resolution date" |
| P-24, P-25 | Conditional band (verbatim) + mosaic |
| P-26 | Wrong chain → "Switch to Gnosis" button in ticket and header (mock chain toggle in test hook) |
| CH-01..05 | Range 1D 1W 1M All Custom + ⓘ; Custom popover presets Today / Last Week / Last Month / All, Cancel / Save |
| CH-06, CH-08 | Export ⤓ (downloads CSV of the visible series) ; ‹ › pan by one range |
| CH-07, CH-09, CH-11, CH-13 | Direct end labels with latest % (legend dots retained in the range row for parity), step lines, crosshair tooltip with timestamp + all values |
| CH-10, CH-12, CH-14, CH-15 | Defects **fixed**; tests inverted: `…y-axis-fixed-0-100`, `…end-labels-no-tick-collision`, `…x-axis-regular-monthly`, `…no-origin-artifact` |
| CH-16 | Caption "Pool prices, not trades ⓘ" |
| O-01..03 | Ranked outcome bars, `#1 Yes 84.2%`, radio semantics (role=radio); selecting updates ticket |
| O-02 | Invalid row `210.85 SER-INVALID · 0%` + ⓘ |
| O-04..06 | Per-row Add Liquidity (dialog), Pool ▸ (View pool details ⇄ Hide pool details), New conditional market (→ `#/create-market?parent=…&outcome=i`, step 1 gated) |
| I-01..04 | Pool panel: Pool Id `0xb328…30b1` ⧉, Liquidity Chart (SHARES / TOTAL, Last:), Pool Balances ladder |
| I-05..12 | Add Liquidity dialog: Farming Rewards copy, Available Pools Swapr `~ 3.00k SEER / day`, Rewards end / "Rewards ended on:", Add liquidity → (external), Learn more…, Return; variants by pool |
| I-13 | Add/remove tx → ExternalGate (Swapr) |
| T-01..07 | Ticket header outcome + icon; order type "Market" ▾ (Market only; Limit not observed → disabled with reason); You pay; token sDAI ▾ (conditional: parent token); balance; Max; direction arrow (swaps buy/sell) |
| T-08 | 4 dp + "exact" reveal (unrounded string present) |
| T-09..16 | Receive selector; Bridge link; Avg price; Price after buy; Potential return skeleton; Max slippage 1% ⚙ (popover 0.5/1/2/custom); CTA states |
| T-17 | Trade / Approve → TxGate (not observed) |
| T-18..22 (draft MD-52..58) | "More" accordion → Mint / Merge / Redeem tabs + final action → TxGate; Redeem disabled until Closed with tooltip |
| TAB-01..05 | Comments tab, gate copy, Connect to comment, empty state, Signing in... / rejection error |
| TAB-06..10 | Related Conditional Markets (2), "Search by outcome:", rows differentiated "being 'Yes'/'No'", status + report link per row (ledger rows, not cards) |
| TAB-11..15 | Top Holders: Yes / No / Invalid tables, Balance column, `k` / `<0.001` formats |
| TAB-16..19 | Activity: My activity, rows (user, Bought/Sold/Split, amount, token, time) |
| SC (scalar DOWN/UP) | Inspector and ticket use the kit Up/Down pair labelled DOWN/UP |
| MOB (m1, scenario 07) | Hamburger nav sheet; full-width chart 280; Trade FAB 56 px → bottom-sheet ticket |
| DATA-01..08 | Adapter contract tests over the fixtures (field presence, units, null Invalid odds, reverse-name fallback to truncated address) |

### 10. Allowed strings (plus data labels and units)
Nav and shell: Markets, Leaderboard, Create Market, Policies, App, Connect, Switch to dark mode, Switch to light mode, Note that this is a Beta version and can still be unstable, Search by market, outcome or collection, Ledger, Map, Cards, Filters, Create New Market, My collections, Cancel, Apply, Reset query, No markets match, Live fetch off — sample has 100 of 2,947, Sample data. Menus: Verified Market Policy, Market Rules Policy, Futarchy, Deepfunding, Foresight, Opportunity Markets, Account, Deposit, Portfolio, Market Collections, Trade Collateral, Use smart account. Query column: all live Filters labels (H-22..30), Desc, Asc. Columns: Status, Question, Odds, Σ, 7D, Liquidity, Volume, Open interest, Opens, Chain. Market: Home, Market, Reports not open yet, Reports open, Trading Open, Waiting for answer, In Dispute, Pending execution, Closed, Verified, Verify it, Unverified, Categorical, Multi Categorical, Scalar, Multi Scalar, Liquidity, Volume, P&L, Market Estimate, Answer on Reality.eth!, Major Events, UPCOMING, Conditional Market, Pool prices, not trades, Axis zoomed, Zoom to data, Show all, Pool, View pool details, Hide pool details, Add Liquidity, New conditional market, Pool Id, Liquidity Chart, Pool Balances, SHARES, TOTAL, Last, derived: parent × child. Ticket: Market, You pay, You will get, Max, Avg price, Price after buy, Potential return, Max slippage, Enter an amount, Not enough balance., Trade, Approve, More, Mint, Merge, Redeem, Low balance? Bridge tokens from other networks, 4 dp, exact, Paid in parent '<Outcome>' tokens, Switch to Gnosis, Confirm in wallet — not observed; nothing is sent. Dialogs: Report Answer, Current answer, Not answered yet, Choose an answer, Mark this question invalid, Return, Answer, Farming Rewards, Available Pools, Rewards end, Rewards ended on, Learn more about the farming program. Tabs: Comments, Related Conditional Markets, Top Holders, Activity, My activity, Balance, Bought, Sold, Split, Search by outcome:, Connect to comment, Connect your wallet to share your take, No takes yet. Share the first one., Signing in..., User rejected the request. Leaderboard: Profit & Loss Leaderboard, How it works, 1D, 1W, 1M, ALL, Your Rank, Finding your rank…, Search, #, Account, Score, Profit/Loss, ROI, Traded Markets, ELITE, GREAT, GOOD, N/A, Previous, Next, Page, of, Sorted by, high to low, low to high, Updating…, Updated. Create: Type, Next, Back, 1 of 2, SECURED BY KLEROS, Choose a type, [from docs], not observed. Tooltips (≤1 sentence each) as quoted in §6.

### 11. Tests (e2e from `apps/futarchy/e2e/run.mjs` harness + these suites)
- **Parity**: one test per row of §9, using the names from PARITY_MAP.md; inverted or renamed tests listed in §9. Draft-only rows (L-28..34, P-24..26) run, and each is tagged `draft` until it is checked against a screenshot.
- **Dead control**: enumerate every `button, a, input, [role=tab|switch|radio|menuitem|option]` on each route × {1440, 390} × {connected, disconnected}; operate each; assert a change in URL, DOM, dialog, tooltip, aria-pressed/checked/selected or focus, OR `disabled` + `aria-describedby` tooltip text. Zero silent controls.
- **Navigation**: every route reachable from UI; Back/forward restores query and scroll; deep links for all 5 routes plus `?tab`, `?pool`, `?range`; breadcrumb and wordmark go home; Esc on detail goes back; keyboard: Tab order, ↑↓ rows, Space selects, Enter opens, ⌘K / "/" palette.
- **Flows**: S01–S08 and Conditional exactly as in §8 with the mock wallet `0x…dEaD` (balance 24.69 xDAI, 0 sDAI); each ends on its real observed end state (preview, TxGate, gate, empty state).
- **Data truth**: list = inspector = market page = Cards for every number (single source); Σ equals the sum of served odds; Invalid null → "—" odds; rounding 4 dp with exact reveal; 12 unverified rows show ▲ and the band; 17 conditional rows show the lineage glyph; OP/Base show 0.
- **Figure**: odds-strip mark x within ±1 px of `odds/100·W`; Σ notch length; `canvas.__labels` with no overlap ≥18 px; chart y-domain is [0,100] for categorical and [lower,upper] for scalar unless zoomed (badge present); end labels do not intersect tick text.
- Standard suites 01–24 from ui-quality §12 (overflow at all widths, alignment, themes + contrast script, touch targets, reduced motion, HoverMenu, tour, label overlaps), plus a perf test: ≥55 fps scrolling 500 virtualized rows at 1440.

### 12. Accessibility
The ledger is `role=grid` with `aria-rowcount=2947` (real count) and `aria-sort` on headers. The strip has `aria-label` "Yashar 60.8%, Likud 38.1%, Others 0.9%, Together Alliance 0.5%, Invalid no price; sum 100.3%". The chart has a hidden data table (also used by export). The status glyph plus label means colour is never the only signal. Contrast is verified by script for every token in both themes (text ≥4.5, marks ≥3). The focus ring is 2 px violet offset 2. Dialogs trap focus and Esc closes them. The shared Tooltip appears on focus too. Touch targets are ≥40 px at touch widths (the 28 px rows become 56 px). Reduced motion turns every §7 animation into an instant state change.

### 13. Responsive rules
| Width | Layout |
|---|---|
| ≥1680 | query 216 · ledger · inspector 360 docked |
| 1280–1679 | query 216 · ledger; inspector = overlay drawer on select |
| 1024–1279 | query collapses to "Filters" popover; ledger hides Volume and Opens (available in inspector) |
| 701–1023 | ledger 28 px rows hide 7D and Σ (Σ moves into the strip tooltip); market page stacks chart over ticket |
| ≤700 / touch | 2-line 56 px rows (status + title / strip + Σ + Liquidity + spark); Query sheet with Cancel/Apply; inspector = bottom sheet; market page: chart 280, outcome bars, Trade FAB → ticket sheet; leaderboard rows → labelled 2-line rows; no horizontal overflow at 320 |
Container per ui-quality §2 (max 1760, clamp padding); mobile page height < 4600 px at 390 (ledger is virtualized inside the page scroll).

### 14. Open assumptions (confirm with PT before Gate E)
A-1 `incentive > 0` ⇔ rewards. A-2 no futarchy flag in `markets-search`: the Futarchy filter passes through to the live API, and the sample shows "not determinable". A-3 star → default collection content after sign-in. A-4 status derivation vs live labels. A-5 OI/volume dual-unit (sDAI vs $) conversion rate source.
