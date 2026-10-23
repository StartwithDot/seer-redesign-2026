# design.md: Seer Explorer, "Trading Board"

> Binding order: `products/explorer/DIRECTION.md` > this file > `docs/ui-quality-rules.md` > `docs/NEXT_GEN_DESIGN_RULES.md` > `docs/product-identity-guide.md` > `docs/coding-rules.md` > `concepts.md` (Open Floor v2). The user chose a card grid, which overrides the "card grid as main composition" ban. Every other NEXT_GEN rule still applies: parity, the dead-control test, real data and no slop. Open Floor v2 is reused for its adapters, fixes S7, parity S11, states S5 and allowed strings S9. Its feed, rows, topic rail, Dock, PayoutBar and chips are **dropped**.
>
> App: `apps/explorer` (scaffold exists: Vite + React 19 + TS, fixtures in `src/data/*.json`). Sample clock: `NOW = 1792367760` (2026-10-18 23:56 UTC, the capture time of `markets-search.full.json`).

---

## 0. TRACE table (design element → evidence)

| # | Design element | Audit state id / artifact | What the evidence dictates |
|---|---|---|---|
| T1 | Card grid, 5 col @1440 / 6 @1920 / 2 @390 | DIRECTION §1; live 001 (4-col tiles); kit `dark-mode-board.webp` | The user chose a denser trader's card. The kit gives the micro-button and Vol-footer vocabulary. |
| T2 | Outcome tiles (Yes/No with exact %) | kit `trade-ticket.png` (Yes 69¢ / No 37¢ tiles), `color-palette.png` (Up/Down, Answer & Buttons rows) | Tile = caption + big value. Violet fill = Yes/Up, violet-soft = No/Down. |
| T3 | No donut | CHART_AUTOPSY §2; DIRECTION §4 | A fixed-diameter ring hides liquidity and can't show 80 outcomes. |
| T4 | Exact % from `odds[]`, Invalid shown as — | markets-search.full.json (`odds` null for Invalid; Σ≠100, e.g. 35.3+74.5) | Show the value as given, never normalized. Σ goes in a tooltip only. |
| T5 | Volume at rest, liquidity in the drawer | DIRECTION §1; PARITY correction 1 (card `$27.74k` = liquidity) | H-10 moves to the drawer. The test proves it is reachable. |
| T6 | Verification marks (tick / amber ⚠ / verifying / challenged) | 001 (tiny footer icons); audit-gap 023 (unverified banner, "Verify it"); 006 (Verification Status vocabulary) | Four marks, each with its own shape and a tooltip. |
| T7 | Hover drawer with links | 007 (Open interest and liquidity breakdown); H-16/H-17 (GnosisScan, Kleros links); audit-gap 001 (Reality.eth link) | Every link uses a real URL template observed in the captures (§9.3). |
| T8 | Per-pool breakdown on click | 007 (`Yashar 4.94k YASHAR / 12.15k sDAI`); `poolBalance[]` | Drawer sub-panel lists one row per pool. |
| T9 | Quick-buy window (single amount input) | DIRECTION §1; scenario 01 `06-*` (1 sDAI → 1.1868081659397476 Yes) | Live quote fixture; CTA strings from T-15/T-16. |
| T10 | Wallet-gated CTA (Connect / Not enough balance. / reject) | scenario 01 (mock 0 sDAI); audit-gap 037/049 (`Signing in...`, `User rejected the request.`) | Every CTA string is observed, none invented. |
| T11 | Conditional second line on cards | audit-gap 034/046 (`Conditional on "…" being "Yes"`); data (17 conditionals, identical sibling titles) | Siblings differ only by parent outcome, so the card must show it. |
| T12 | Conditional banner + parent-token collateral | audit-gap 001/007/012 (banner copy, `LEPEN_NRYES` in You pay) | Copy is verbatim; the pay unit comes from the parent token. |
| T13 | Slim rotating hero | DIRECTION §1 | 72 px, one market at a time, pauses on hover. |
| T14 | Collapsed filter rail with all groups | 006 (Filters panel groups); DIRECTION §1 | Groups and option strings are verbatim; Cancel/Apply staging kept. |
| T15 | Active-filter tags | DIRECTION §1; ux.md §5 (filters two clicks deep) | Applied state is visible and removable in one click. |
| T16 | Search writes `?marketName=` | 008; H-19 | URL parity. |
| T17 | Market route `#/markets/<chainId>/<slug>` | 037; DIRECTION §2; `url` field | The slug comes from data. |
| T18 | Honest chart axis 0–100, gutter labels | CHART_AUTOPSY §1 (48–52 auto-scale, pill over "80.00", origin square) | Fixes CH-10/12/14/15. |
| T19 | "Pool price, not trades" caption | 051 tooltip; CHART_AUTOPSY §1 | The caveat is shown under the chart, not hidden behind help. |
| T20 | 80-outcome handling | audit-gap 023 (80 outcomes, spaghetti chart) | Top 2 on the card, top 8 then "Show all" on the page, top-3 colored series. |
| T21 | Outcome row select + action strip | ux.md heuristic "row hosts radio + 3 links"; scenario 01 | The row selects; the selected row reveals Add Liquidity / View pool details / New conditional market. |
| T22 | Pool details ladder (SHARES/TOTAL, Last:) | audit-gap 011 (`Pool Id: 0x2e5b...8626`, ladder, `Last: 0.7454`) | Inline expansion, same strings. |
| T23 | Add Liquidity dialog | audit-gap 010 (Farming Rewards, `Rewards ended on: January 4 2026, 22:31`) | Same strings; external Swapr link. |
| T24 | Report Answer dialog | audit-gap 007 (exact copy, bond 10 XDAI) | Verbatim copy. |
| T25 | Ticket fields + More (Mint/Merge/Redeem) | scenario 01; audit-gap 007 txt lines 61–96 | All fields kept; "You will get" rounded to 4 dp with the exact value on demand. |
| T26 | Mobile ticket FAB → sheet with Trade/Mint/Merge/Redeem tabs | m1; audit-gap 034 txt lines 75–79 (`×`, `Trade`, `Mint`, `Merge`, `Redeem`) | Mobile live grammar kept. |
| T27 | Tabs Comments / Related (n) / Top Holders / Activity | audit-gap 033–037; 036 (activity rows `slimy-correct-hedgehog Bought <0.001 Yes Oct 7, 2026 · 02:04`) | Row formats verbatim. |
| T28 | Leaderboard score anatomy | get-pnl-leaderboard.json `scoreBreakdown.components`, `scoreUnavailable` | Real component values; N/A reason from data. |
| T29 | Menus' external hrefs | audit/raw 003 (futarchy.seer.pm, deep.seer.pm, foresight.kleros.io, opportunity.seer.pm); 009 (docs.seer.pm/app/leaderboard) | Observed URLs only. |
| T30 | Status vocabulary + answered-too-soon rule | 006; get-market.json (`best_answer 0x…fffe` on a "Reports open" market, 037) | Adapter rule §9.2. |
| T31 | Header tonal (not purple) | product-identity-guide §1 (EF skeleton) | EF departure from the live purple bar. |
| T32 | Leaderboard sorting, pagination, Updating… | 008/009/018, scenario 02/08; ux.md task 5 (live sort/Next bugs) | Must really sort and page (fixtures §9.6). |

---

## 1. Visual Theme and Atmosphere

**Thesis.** A trader's board: the most markets per screen, each one priced and buyable in place, with everything else one hover away.

**World.** A quote board. Each card is a quote: a question, the pool-implied price of its leading outcomes, and the button that buys it. The bound math is **price = probability = payoff**:
- p = odds/100 collateral per share.
- shares ≈ A/p̄.
- A winning share pays 1 collateral.

The quick-buy window computes this live. The card grid is the board; the drawer is the quote's fine print.

**Mood words.** Quick, exact, quiet. It must NOT feel like:
- a SaaS dashboard (no KPI tiles, no widgets);
- the live 4-column donut grid (no rings, no tiny footer icons);
- a casino (no glow, no neon, no ticker marquee).

**How it differs from the other products.**

| | Futarchy | Risk | Opportunity | Explorer (this) |
|---|---|---|---|---|
| Hero | signal list + fork chart | instrument | kinetic board | **72 px single-market rotator** |
| Density | calm | dense tabular | kinetic | **highest: 15 markets above the fold @1440×900** |
| Rhythm | 64 px sections | tables | lanes | **one grid, 16 px gaps, no sections on home** |
| Motion | slow 600–900 ms | 160–300 ms | springy FLIP | **crisp: 120–300 ms, number ticks, drawer 180 ms** |
| Signature | fork | survival tide | sieve | **price → payout recompute + odds tick (rolling digits)** |

---

## 2. Color Palette and Roles

Surfaces and text are EF tokens (unchanged): `--bg #101013/#F7F7F9`, `--card #1A1A1E/#FFFFFF`, `--nested #1F1F24/#F0F0F3`, `--text #EDEDF2/#17171C`, `--text-2 #A8A8B3/#5C5C66`, `--muted #67676F/#8E8E99`.

Product tokens live in `apps/explorer/src/styles/product.css`. Contrast is measured on `--card` (dark #1A1A1E, light #FFFFFF).

| Token | Role | Dark | Light | Where used | Contrast dark / light |
|---|---|---|---|---|---|
| `--sem-yes` | Yes/Up tile fill, primary CTA, selected | #7B3AFF | #7B3AFF | Yes/Up tile, Confirm, Apply, Connect, active tab underline | white text on fill 5.4:1 / 5.4:1 |
| `--sem-yes-text` | violet text/links | #9C6FFF | #6C2BD9 | links, the "+N more" link, active option | 5.1 / 7.0 |
| `--sem-no` | No/Down tile fill, secondary button | #241E33 | #EFE9FC | No/Down tile, Buy (multi), My collections | — (surface) |
| `--sem-no-text` | text on `--sem-no` | #9C6FF2 | #6C2BD9 | No/Down labels, Buy label | 4.56 on #241E33 / 6.6 on #EFE9FC |
| `--sem-open` | status: Trading Open | #3DDC97 | #12915F | status dot, 4 px strip, verified tick | 9.8 / 4.0 (graphic ≥ 3 ✓; never text in light) |
| `--sem-resolving` | status: Reports open / Waiting for answer / In Dispute / Pending execution | #F5B84A | #B9770E | status dot, strip | 9.8 / 3.7 (graphic) |
| `--sem-closed` | status: Closed | #67676F | #8E8E99 | dot, strip | 3.1 / 3.3 (graphic) |
| `--sem-warn` | unverified mark, warning icon | #F5B84A | #B9770E | ⚠ triangle, banner icon | 9.8 / 3.7 (graphic) |
| `--sem-warn-soft` | warning banner surface | #2A2216 | #FDF3E1 | unverified banner | text --text on it 13.9 / 15.6 |
| `--sem-info-soft` | conditional banner surface | #241E33 | #EFE9FC | conditional banner | --text 14.0 / 15.1 |
| `--sem-danger` | Challenged mark, error text | #FF5C72 | #D1334A | challenged ring, "User rejected the request." | 5.8 / 5.0 |
| `--sem-delta-up` / `--sem-delta-down` | odds tick direction (live mode only) | #3DDC97 / #FF5C72 | #12915F / #D1334A | ▲/▼ glyph beside a ticking % | graphic ✓ |
| `--series-1` | chart outcome 1 (leading) | #7B3AFF | #6C2BD9 | step line + gutter label | 3.2 / 7.0 (line ≥ 3 ✓) |
| `--series-2` | chart outcome 2 | #2FD4C0 | #0E9A8B | line + label | 9.3 / 3.5 |
| `--series-3` | chart outcome 3 | #5B9DFF | #2F6FD6 | line + label | 6.4 / 4.9 |
| `--series-rest` | outcomes 4..80 | #A8A8B3 at α .35 | #5C5C66 at α .35 | thin lines; full α when isolated | — |

**Colorblind rule:** hue never carries meaning alone.
- Status = dot + word.
- Verification = four distinct shapes (check-in-circle, triangle, dashed ring, ring with "!") + tooltip.
- Yes vs No = position (left/right) + label + fill vs soft.
- Series = direct gutter labels.
- Deltas = ▲/▼ glyph.
- Light-mode status colours are used for graphics only; status words always use `--text-2`.

---

## 3. Typography

Inter Tight (variable) everywhere; JetBrains Mono 12/16 only for addresses, ids and the exact share string.

| Role | Size / line / weight | Tracking | Notes |
|---|---|---|---|
| Page H1 (market question, leaderboard title) | clamp(26px, 2.4vw, 40px) / 1.2 / 600 | −0.01em | max 3 lines, then ellipsis + tooltip |
| Section title (Outcomes, Major Events, Filters) | 15 / 20 / 600 | 0 | |
| Card question | 15 / 20 / 500 | 0 | 2-line clamp (1 line + conditional line for conditionals) |
| Card tile value / hero % / ticket amount | 28 / 32 / 600 | −0.02em | tabular-nums |
| Multi-row name / value | 15 / 20 / 500 · 600 | 0 | |
| Label / caption / meta | 12 / 16 / 500 | +0.01em | ≥ 4.5:1 (`--text-2`) |
| Group heading in rail | 12 / 16 / 600, uppercase | +0.04em | |
| Mono ids | 12 / 16 / 400 JetBrains Mono | 0 | truncated `0x2e5b…8626` |
| Mobile compact card value | 20 / 24 / 600 | −0.01em | EF departure D3 |

- **Per-card size budget:** desktop card uses only 12, 15 and 28; compact card uses 12, 15 and 20.
- **Numerals:** `font-variant-numeric: tabular-nums` on every number.
- **Units:** U+2009 thin space between value and unit (`5.00 sDAI`, `9.092 gwei`); no gap before `%`; U+2212 minus (`−12.4%`).
- **Formats:** money `<1000 → $918.38`, `≥1000 → 3 significant + K/M` (`$27.7K`, `$7.26K`, `$1.43M`). Token amounts follow the same rule with the unit. Holders/activity `<0.001`. Dates `Jan 1, 2027 00:00 UTC`; activity `Oct 7, 2026 · 02:04`. Em dash `—` for none.
- **Rolling numbers** (`RollingNumber`, copied from futarchy):
  - Reel window = line box = item height (CSS var `--reel-h`), `overflow: clip`.
  - Only changed digits roll, max 2 digits per tick; the least-significant digit crossfades 120 ms.
  - Used on: card tile %, hero %, quick-buy You will get / Pays, ticket outputs.
  - Reduced motion: instant.

---

## 4. Component Stylings (FIXED sizes)

Global: radii 16 (card) / 12 (nested) / 8 (chips, buttons ≤ 32 high); spacing from 4/8/12/16/20/24/32/48/64. Focus ring 2 px `--sem-yes` offset 2. Press scale .97 (buttons .96, whole card .99). Hover = tonal step 140 ms. Touch (≤700 px or `hover:none`): every hit area ≥ 40×40 (visual may be smaller; an `::after` hit pad marked `data-overlay`).

### 4.1 Beta strip
- 28 high, full `.page` width, `--nested`, 12/16 centered: `Note that this is a Beta version and can still be unstable`.
- Dismiss × 28×28 (touch 40). Dismissal is stored in sessionStorage `explorer.beta`.
- Sits above the header and does not stick.

### 4.2 Header (two tiers; EF departure D6)

**Tier 1, 56 high, sticky top 0, `--card` with a 1 px `--nested` bottom tonal edge.**
- Left: wordmark `seer` 88×24 (link `#/`, `aria-label="Seer home"`).
- Nav (gap 4): items 36 high, padding 0 12, 15/500, `aria-current` underline 2 px violet:
  - Markets 72, Leaderboard 104, Create Market 116;
  - Policies▾ 92 and App▾ 64 (HoverMenu triggers).
- Right (gap 8):
  - Help 40×40 (? icon, `aria-label="Help"`, starts the tour);
  - Theme 40×40 (`aria-label` = `Switch to light mode` / `Switch to dark mode`);
  - Disconnected: **Connect** 112×40 violet `.btn-bubbles`.
  - Connected: **Account button** 248×40 = chain icon 20 + `0x0000…dEaD` (12 mono) + 1 px divider + `24.69 xDAI` (15/500 tabular) + ▾ 12. Opens the Account menu.

**Tier 2, 48 high (not sticky), `--bg`, all routes ≥768.**
- Search pill: flex, min 320, max 640, height 40, radius 20, `--nested`, ⌕ 16. Placeholder `Search by market, outcome or collection`; `/` and ⌘K open the palette.
- Right: **My collections** 148×40 (`--sem-no`, star 16 + text, → `#/collections/default`) and **Create New Market** 184×40 (violet, `.btn-bubbles`, → `#/create-market`). Gap 8.

**Mobile <768: one tier, 56.**
- Wordmark · spacer · ⌕ 40 (opens full-screen search sheet) · theme 40 · ≡ 40.
- The ≡ menu sheet holds: Markets, Leaderboard, Create Market, Policies (2 items), App (4 items), My collections, Create New Market, Help, Connect/Account.

### 4.3 Hero: slim rotating trending (`Hero.tsx`)

**Desktop ≥768:** 72 high, `--card`, radius 16, padding 0 16, full grid width (to the right of the rail; left edge = grid left). Columns (gap 16, vertically centered):

| Slot | Width | Content |
|---|---|---|
| Label | 72 | `Trending` 12/600 uppercase `--text-2` |
| Avatar | 40 | `images.market`, radius 8 |
| Question | flex, min 0 | 15/500 one line, ellipsis + tooltip |
| Numeral | 120 | leading % 28/600 (RollingNumber) + outcome name 12 `--text-2` under it (or `Market Estimate` + `9.09 gwei` for scalar) |
| Actions | 200 | binary: `Yes` / `No` 96×36 (tile colours); scalar: `Up` / `Down`; multi: `Buy` 96×36 for the leading outcome + spacer |
| Dots | 112 | 5 dot buttons, 8×8 visual in 24×24 hit, gap 0; active dot 20×8 pill violet; `role=tab`, `aria-label="Trending 1 of 5"` |

- Data: top 5 by `volumeUSD` among markets whose status ≠ Closed (sample: deterministic).
- Rotation: dwell 6000 ms. Swap 300 ms: outgoing opacity 1→0 + translateY 0→−6 px; incoming 0→1 + 6→0, `--ease-out`. Content changes inside a fixed box, so there is no layout shift.
- Pauses on hover, on focus-within and while a quick-buy from the hero is open. Resumes 600 ms after leave.
- Under reduced motion: no auto-rotate (dots only) and an instant swap.
- Clicking the hero body → market page. Clicking Yes/No/Buy → quick-buy anchored to that button. Clicking a dot → jump.
- `role=region aria-roledescription="carousel" aria-label="Trending"`, `aria-live="off"` while rotating, `polite` after a manual dot click.

**Mobile <768:** 88 high, padding 12.
- Row 1 (32): avatar 32 + question 15/500 one line + dots (5×24 hit 40 high via padding; visual dots 6).
- Row 2 (40): `84.2%` 28 + caption, right: two 72×40 buttons.

### 4.4 Filter rail: collapsed / expanded (`FilterRail.tsx`, `FilterPanel.tsx`)

**Collapsed strip (≥1024):**
- 56 wide, `--card`, radius 16, padding 8, sticky top 72 (56 header + 16); left of the grid with a 16 px gap.
- 9 icon buttons 40×40, gap 8, top to bottom: Market States (dot-in-circle), Verification Status (check-shield), Chain (link), Sort By (up-down arrows), Conditional Market (branch), Rewards (gift), Minimum Liquidity (droplet), Futarchy (fork), then a spacer and Expand (chevron-right).
- Each icon has a tooltip `<Group>: <current value>` (e.g. `Chain: Gnosis`).
- An active group shows a 6×6 violet dot at top-right (second channel: the tag row also lists it).
- Inline SVG icons, 20 px, stroke 1.5.

**Expanded panel (overlay; never pushes the grid):**
- 320 wide, max-height `calc(100vh − 88px)`, `--card`, radius 16, elevation 2.
- Anchored to the strip's left edge and overlaying it and the grid (`data-overlay`).
- Opens on: strip hover with 120 ms intent; click on any icon (also pins and scrolls to that group); `F` key; focus into the strip.
- Closes: 220 ms after pointer-leave if not pinned; Esc; × 36×36; Cancel; Apply; outside click.
- Motion: width clip from 56→320 + opacity, 180 ms `--ease-out`.

**Panel layout (scrolls inside):**
- Header 48: `Filters` 15/600 · `Clear filters` text button 32 · × 36.
- Groups, each with a heading 12/600 uppercase (24) followed by its controls:

| Group (verbatim) | Control | Size |
|---|---|---|
| Market States | single-select option rows: All, Reports not open yet, Reports open, Waiting for answer, In Dispute, Pending execution, Closed | rows 36, custom radio 16 (animated dot), 15/400 |
| Verification Status | All, Verified, Verifying, Challenged, Not Verified | rows 36 |
| Chain | All, Ethereum, OP Mainnet, Gnosis, Base | rows 36, chain icon 16 |
| Sort By | Default, Liquidity, Volume, Open Interest, Opening Date, Creation Date + segmented Desc/Asc 2×72×32 | rows 36 + 40 |
| Conditional Market | switch row `Show only conditional markets` | 40; switch 36×20 animated thumb |
| Rewards | switch row `Show only markets with rewards` | 40 |
| Minimum Liquidity | numeric input `$` prefix | 288×40, `inputmode=decimal`, min 0 |
| Futarchy | switch row `Show only futarchy markets` | 40 |

- Sticky footer 64: **Cancel** 136×40 (`--nested`) and **Apply** 136×40 (violet). Edits are staged until Apply (live parity H-31/H-32).
- Apply writes the URL query: `?state=&verif=&chain=&sort=&dir=&cond=1&rewards=1&minLiq=&futarchy=1` (plus `marketName=`).
- **Mobile/tablet <1024:** the strip is hidden. A `Filters` button 104×40 (with count badge `(2)`) at the start of the toolbar opens the same panel as a bottom sheet (full width, max 88vh, handle 4×36, sticky footer).

### 4.5 Toolbar + active-filter tags (`ActiveTags.tsx`)
- 40 high, always rendered, so the grid never jumps.
- Left: result count `100 markets` (15/600 tabular).
- Then tags (gap 8), each 28 high, radius 8, `--nested`, padding 0 4 0 10: value 12/500 (e.g. `Reports open`, `Gnosis`, `Liquidity ↓`, `Min $1K`, `Conditional`) + × button 20×20 (touch hit 40).
  - Tooltip = `<Group>: <value>`.
  - Removing a tag applies immediately (URL updates, grid FLIP 280 ms, ≤40 cards animate).
  - Overflow: tags that don't fit collapse into `+N` 40×28, which opens the panel.
- `Clear filters` text button 28 high, after the last tag; only when ≥1 tag.
- Search query shows as a tag `"marine le pen"` that clears `marketName`.
- Sort is shown as a tag only when ≠ Default.
- Mobile: `Filters` button + count, then tags in a horizontal scroller with 16 px edge-fade masks inside `.page`.

### 4.6 Market card (`MarketCard.tsx` + `CardOutcomes.tsx` + `CardMarks.tsx`)

**Two variants.**
- Desktop (container width ≥ 228): **fixed height 184**, width = grid column.
- Compact (<600 viewport, columns 154–169): **fixed height 218**.
- `--card`, radius 12, padding 12 (EF departure D2). `<article>`, accessible name = question.

**Desktop anatomy (242×184 at 1440):**
```
┌ pad 12 ────────────────────────────────┐
│[av 32] Will Marine Le Pen be the       │  head 40: avatar 32 r8 + question 15/20 ×2
│        National Rally's candidate…     │
│ gap 12                                  │
│┌ Yes ────────┐ ┌ No ─────────┐          │  block 72 (type-specific, below)
││ 84.2%       │ │ 14.8%       │          │
│└─────────────┘ └─────────────┘          │
│ gap 12                                  │
│$49.7K Vol.                     ✓   ☆   │  footer 24
└────────────────────────────────────────┘
```

**Outcome block (72 high), by type:**

| Type (adapter §9.2) | Block layout |
|---|---|
| **Binary** (exactly 2 non-Invalid outcomes; Yes/No or two names) | Two tiles, each (w−8)/2 × 72, radius 8, padding 10. Caption 12 (outcome name, ellipsis) over value 28/600 `84.2%`. Left = higher-index-0 outcome per data order (Yes), `--sem-yes` fill + white. Right = `--sem-no` + `--sem-no-text`. Hover: tonal step + 1 px inner highlight. Whole tile = buy button (`aria-label="Buy Yes at 84.2%"`). |
| **Scalar** (DOWN/UP) | Left half: caption `Market Estimate` 12, value `9.092` 28 + unit 12 (`gwei`; unit ellipsis at 40 px + tooltip). Right half: two stacked buttons (w−8)/2 × 32, gap 8: `Up 47.5%` (violet fill) and `Down 52.5%` (soft); label 12, value 15/600. |
| **Multi** (Categorical >2, Multi Categorical, Multi Scalar) | Two rows × 32, gap 8: name 15/500 (flex, ellipsis + tooltip) · value cell right-aligned 15/600 (56 wide `60.8%`; multi-scalar 72 wide `~182` + `seats` 12) · `Buy` 52×28 (`--sem-no` → violet on hover; `aria-label="Buy Yashar at 60.8%"`). Rows show the top 2 by odds desc; the Invalid outcome is never shown on cards. |

**Head row:**
- Question clamps to 2 lines with the full text in the tooltip.
- **Conditional cards:** the question clamps to 1 line. Line 2 is 12/16 `--text-2`: `Conditional on "Will Marine Le Pen be…" being "Yes"` (parent question truncated in the middle to fit; tooltip shows it in full).
- Placeholders such as `[party bloc]` stay literal.

**Footer (24):**
- Left: `$49.7K Vol.` 12/500 `--text-2`. Multi with >2 outcomes appends ` · ` and the link `+78 more` (12/500 `--sem-yes-text`, → market page `#outcomes`).
- Right (gap 4): verification mark button 24×24, then star button 24×24 (16 icon; `aria-pressed`; `aria-label="Add to collection"` / `"Remove from collection"`; filled violet when on).
- On `hover:none` devices a third button, Details ⌄ 24×24 (`aria-label="Market details"`, `aria-expanded`), opens or pins the drawer.

**Verification marks (16 px glyph in a 24 hit, tooltip 300 ms):**

| Status | Glyph | Colour | Tooltip |
|---|---|---|---|
| Verified | check inside a 16 circle (stroke 1.5) | `--sem-open` | `Verified market` |
| Not Verified | triangle with `!` | `--sem-warn` | `This market is unverified (it didn't go through the curation process)` |
| Verifying | dashed ring (4/3 dash) with a centre dot | `--text-2` | `Verifying` |
| Challenged | solid ring with `!` | `--sem-danger` | `Challenged` |

Clicking a mark pins its tooltip (touch) and never navigates.

**Whole-card click:**
- The question `<a href="#/markets/100/<slug>">` carries `::after { inset: 0 }` so the entire card is the link (middle-click and new tab work).
- Tiles, Buy, `+N more`, mark, star, Details and drawer links sit at `z-index: 1` and call `stopPropagation()`.

**States:**

| State | Treatment |
|---|---|
| Rest | `--card` |
| Hover | `--nested` 140 ms + drawer (4.7) |
| Focus-visible | ring on the card; drawer opens |
| Press | scale .99 |
| Loading | skeleton 184 (avatar block, 2 text bars, 2 tile blocks, footer bar), shimmer 400 ms |
| Closed | tiles replaced by a 72-high `--nested` plate showing the winning outcome name 15/600 + the word `Closed`; Buy disabled with tooltip `Market closed` |
| Error (image fails) | avatar falls back to a monogram on `--nested` |

### 4.7 Hover drawer (`CardDrawer.tsx`)
- Attaches under the card: width = card width; **fixed height 256**; `--nested`; radius 0 0 12 12. While open the card's bottom radius animates to 0.
- Elevation 2. `position: absolute`, overlaying the cards below (`data-overlay="drawer"`). The grid never reflows.
- Flips upward, overlaying the cards above (radius 12 12 0 0), when the space below in the viewport is < 264.
- Open: pointer-enter + 120 ms intent, focus-within, or Details ⌄ (touch, pins). Close: 220 ms after the pointer leaves card + drawer, Esc, blur out, opening a quick-buy, or another drawer opening (one at a time).
- Motion 180 ms: clip-path inset(0 0 100% 0) → inset(0) + opacity, `--ease-out`. Reduced motion: opacity only, 90 ms.

**Body (padding 8 12):** 10 rows × 24 = 240. Label column 96, 12/500 `--text-2`; value 12/500 `--text`, right-aligned, ellipsis + tooltip. Links: `--sem-yes-text`, ↗ 10 for external (`target=_blank rel="noopener"`), › for internal.

| # | Label | Value (source) |
|---|---|---|
| 1 | Status | status dot 8 + word (`Reports open`) |
| 2 | Liquidity | `$7.16K ›`. The row is a button `aria-label="Open interest and liquidity breakdown"` that opens the per-pool sub-panel. |
| 3 | Open interest | `$31.1K` (`openInterestUSD`) |
| 4 | Type | `Categorical` / `Scalar` / `Multi Categorical` / `Multi Scalar` |
| 5 | Chain | `Gnosis ↗` → `https://gnosisscan.io/address/<id>` |
| 6 | Kleros | `Verified ↗` → curate item URL / `Verify it ↗` → curate registry / `Verifying ↗` / `Challenged ↗` |
| 7 | Reality.eth | `Answer on Reality.eth! ↗` → Reality question URL (§9.3) |
| 8 | Rewards | `Active` (incentive > 0) or `—` |
| 9 | Parent | conditional: `"Will Marine Le Pen…" › Yes` (internal → parent market page); else `—` |
| 10 | Resolution | `Apr 7, 2025` (`openingTs`, label tooltip `Resolution opening at`) |

**Per-pool sub-panel** (replaces the body; same 256 height):
- Header row 32: `‹ Liquidity` back button + `Volume $5.10K traded, notional $15.5K`.
- Then one row per pool (28 each, scrollable, `content-visibility: auto`): outcome name 12 · `4.94K YASHAR / 12.1K sDAI` 12 tabular.
- 80-outcome markets scroll within 196 px; the scroll is contained (`overscroll-behavior: contain`).

**Compact (<600):** the drawer is a bottom sheet (full width, auto height ≤ 70vh), with the same rows at 40 high (touch).

### 4.8 Quick-buy window (`QuickBuy.tsx`)
- **Desktop:** popover **296×268**, `--card`, radius 16, padding 16, elevation 3. 8 px below the trigger (tile/Buy/hero button), left-aligned to the card's left edge, clamped to the viewport, flips above. `role=dialog aria-modal=false`, labelled `Buy <outcome>`.
- **<600:** bottom sheet (same content, full width, plus `Open market page` link 40).
- One open at a time. It closes the drawer, pauses the hero, and Esc / outside-click / × closes it. Focus returns to the trigger.

```
┌ 296 ──────────────────────────────────┐
│ [Yes] 84.2%            0.842 sDAI      │ head 40: outcome chip 24 high (tile colour) + % 15/600 + price 12
│┌ Amount ─────────────────────────────┐│ field 64: --nested r12; label 12; input 28/600 right-aligned
││                        1.00  sDAI   ││   + unit 12 (sDAI | parent token, e.g. LEPEN_NRYES)
│└─────────────────────────────────────┘│
│ You pay                    1.00 sDAI   │ quote 3 × 20 = 60, 12/16, values tabular, RollingNumber
│ You will get          ≈ 1.1876 Yes     │
│ Pays 1.19 sDAI if Yes wins             │   (row 3 → bridge link when balance is short)
│ [        Confirm         ] [ × ]       │ CTA row 40: CTA 232×40 + close 40×40 (kit)
└────────────────────────────────────────┘
```

- **Input:** one custom amount field, no preset chips. It autofocuses; `inputmode=decimal`; accepts `[0-9.,]`, max 6 decimals, max value 1e9; Enter = CTA.
- **Math (§9.4):**
  - You will get = `quote(market, outcome, A)`, shown with 4 dp; `≈` appears when the quote is a spot estimate.
  - Pays = shares × 1 collateral (scalar: `Pays up to …`).
  - Values tick with RollingNumber, debounced 120 ms.
- **CTA states (priority order):**

| Condition | CTA label | Enabled | Effect |
|---|---|---|---|
| Market closed | `Market closed` | disabled + tooltip | — |
| Wallet disconnected | `Connect` | ✓ | opens Connect dialog; after the mock connects, returns here |
| Wrong chain (market chainId ≠ wallet chainId) | `Switch to Ethereum` / `Switch to Gnosis` | ✓ | mock switches chain |
| A empty or 0 | `Enter an amount` | disabled | — |
| A > balance | `Not enough balance.` | disabled; row 3 becomes the link `Low balance? Bridge tokens from other networks` | — |
| otherwise | `Confirm` | ✓ | label shows a spinner 16 for 600 ms, then the mock wallet rejects: 12 `--sem-danger` text `User rejected the request.` replaces row 3 for 4 s; CTA returns to `Confirm` |

### 4.9 Many-outcome handling (≤ 80 outcomes)
- **Card:** top 2 by odds desc (ties keep data order); `+N more` (N = non-Invalid count − 2) in the footer.
- **Drawer:** the pool sub-panel scrolls.
- **Market page outcomes:** first 8 rows. A `Show all 80` button (40 high) reveals a scroll region of max-height 448 (8×56) with `content-visibility: auto` rows. A `Search by outcome:` input 240×36 appears above the list when n > 8 (filters by name, case-insensitive).
- **Chart:** series 1–3 coloured; the rest are `--series-rest` 1 px. Gutter labels for the top 3 plus a `+77 more` label (12, `--text-2`). Hovering or selecting an outcome row isolates its series (others dim to 20%) and adds its gutter label.
- **Ticket outcome select:** HoverMenu listbox with typeahead, max-height 320, items 40.

### 4.10 Market page components
- **Breadcrumb row 40:** Back icon button 36×36 (`aria-label="Back"`) + `Home` / `Market` (12/500; Home links `#/`).
- **Banners** (stack, gap 8, before the header card; min-height 72; padding 16; radius 12; icon 20; title 15/600; body 12/16):
  - **Conditional** (`--sem-info-soft`, ⓘ icon), verbatim: title `Conditional Market`; body `This market is conditional on the resolution of "<parent question>" being "<Yes|No>". If the main market resolves to a different outcome, the tokens of this market will be worthless.` The parent question is a link → parent market page.
  - **Unverified** (`--sem-warn-soft`, ⚠): title `This market is unverified (it didn't go through the curation process)`; body `It may be invalid, tricky and have misleading token names. Exercise caution while interacting with it.` + link `Verify it ↗`.
- **Header card:** `--card`, radius 16, padding 20, **4 px top border in the status colour** (P-03).
  - Row 1 (32): status pill **132×24** (dot 8 + word 12/500, `--nested`); right: verification mark 24 + star 36×36.
  - Row 2: avatar 56 r12 + H1 + under it `Answer on Reality.eth!` link button 36 high (15/500 violet text + → 16), which opens the Report Answer dialog.
  - Row 3, meta 40 (gap 24): SEER mark 56×16 · type 15/500 · `Liquidity $7.16K` + ⓘ 20 (P-14 copy) · `Volume $49.7K` · `Open interest $31.1K` + ⓘ (breakdown tooltip MD-37..40, 280 wide) · `P&L 0.00` · right: `Verified` link or `Verify it ↗`.
  - **Scalar extra row 48:** `Market Estimate` 12 + `9.092 gwei` 28/600 · `Resolution opening at February 1 2027, 08:50 UTC` 12.
  - **Multi-scalar extra block:** question rows 48 each: question 12/500 · `Answer: Answered too soon` · `Deadline:` value · `Reopen question ↗` (Reality URL). Toggle `Hide questions` 36 high.
- **Chart card** (8 cols, **height 520**: padding 20 · controls 40 · gap 12 · plot 360 · x-axis 28 · gap 8 · caption 24 · padding 20):
  - Controls, left: range segmented `1D 1W 1M All Custom` (5 × 52×32 in a 40 track, `--nested`, selected `--card` + 1 px inner highlight) + help ⓘ 32 + `Zoom to data` toggle 32×32 (`aria-pressed`).
  - Controls, right: ‹ 32, › 32, export 32 (downloads CSV of the visible series: `timestamp,<outcome…>`).
  - Plot: canvas sized by a ResizeObserver on its parent, DPR ≤ 2, clip to the plot rect with a 6 px top inset. Y axis 40 left (ticks 0/25/50/75/100 %, 12 `--text-2`); **72 px right gutter** for end labels (label engine: min 18 px separation, merge, halo, never over ticks). X ticks from `d3.scaleTime().ticks(6)` with a year label only at year boundaries.
  - Step lines 2 px (series 1–3) / 1 px (rest).
  - Crosshair: 1 px `--text-2` vertical line + tooltip 220 wide (timestamp `Jan 1, 2027 00:00 UTC` + each top-3 outcome %), keyboard ←/→.
  - Caption 24: `Pool price, not trades` 12 `--text-2` + ⓘ (tooltip = P-14 copy).
  - Scalar: y = [lowerBound, upperBound] in the unit.
  - No history: plot shows a `--nested` plate `No price history loaded` 12 + the current odds as gutter labels; `canvas.__labels = []`.
- **Custom range popover:** 320×372, 8 px below `Custom`.
  - Presets column: `Today`, `Last Week`, `Last Month`, `All` (rows 36).
  - Month header 36 with `Previous Month` / `Next Month` 32×32 icon buttons (aria-labels verbatim) + `October 2026`; grid `Su Mo Tu We Th Fr Sa` with 7 × 40×36 cells; range fill `--sem-no`.
  - Footer `Cancel` 96×36 · `Save` 96×36 violet. A preset selects the range but only Save applies it (parity).
- **Outcomes card:** title row 40 `Outcomes`. **OutcomeRow 56:**
  - `#n` 32 (12 tabular) · avatar 24 · name 15/500 flex · bar 120×6 (`--nested` track, violet fill = p) · value 64 right 15/600 (`84.2%`; multi-scalar `~182 seats`; Invalid `—` + token value cell when present).
  - Row = `role=radio` within a `radiogroup`; selected: `--sem-no` background + 2 px violet inset-left.
  - **Action strip 40** under the selected row (height animates 140 ms): text buttons 32 high `Add Liquidity` · `View pool details` / `Hide pool details` · `New conditional market` (→ `#/create-market?parent=<id>&outcome=<i>`).
  - Invalid row ⓘ tooltip: the live help sentence if captured, else none (A-12).
- **Pool details** (inline under the action strip, height 320):
  - `Pool Id:` mono `0x2e5b…8626` + copy 32 + ↗ explorer 32.
  - `Liquidity Chart` canvas 160 (honest axis: price 0–1 on x, cumulative shares on y; labels in a gutter).
  - `Pool Balances:` `0.38 LEPEN_NRYES / 7.18K LPY_NR_NO`.
  - Ladder table header `SHARES` / `TOTAL`, rows 28, 12 tabular, max 6 visible + scroll; `Last: 0.7454`.
- **Major Events card:** title row 40 `Major Events` + count pill `1 UPCOMING` (88×24). Event rows 56: date 12/600 uppercase `MAY 31, 2027 · 00:00 UTC` · `Reality.eth Resolution` 15/500 · `Expected resolution date` 12. Empty fixture: `0 UPCOMING`, no rows.
- **Ids block** (`--card` r16 p20; rows 36): `Market`, `Condition Id`, `Question Id`, `Collateral`, `Creator`. Value is 12 mono truncated 6…4 + copy 32 (tooltip `Copied` 1.2 s) + ↗ 32.
- **Tabs:** tablist 40 high, tabs padding 0 16, 15/500, active underline 2 px violet (motion `layoutId` 140 ms): `Comments` · `Related Conditional Markets (2)` · `Top Holders` · `Activity`. Panel min-height 320; arrows/Home/End keyboard.
  - **Comments:** gate copy `Connect your wallet to share your take` + `Connect to comment` 168×40. Connected: textarea 96 + Post? **Not observed**, so after connect the button reads `Connect to comment`… → `Signing in...` → `User rejected the request.` Empty state `No takes yet. Share the first one.`
  - **Related Conditional Markets:** `Search by outcome:` 240×36. Child rows 72: status pill · question 15/500 · `Conditional on "<parent>" being "Yes"` 12 · `Answer on Reality.eth!` link. A row click opens the child.
  - **Top Holders:** one table per outcome (`Yes`, `No`, `Invalid`) with columns address/name, `Balance`. Rows 40; balances `6.58K`, `454.03`, `<0.001`.
  - **Activity:** `My activity` switch 36×20 + rows 56: account (pseudonym) · `Bought`/`Sold`/`Split` · amount (4 dp or `<0.001`) · outcome · `Oct 7, 2026 · 02:04`.
- **Ticket** (4 cols, sticky top 72, width 100% of its column ≈ 438 @1440, padding 20, radius 16):
  - Header 48: outcome avatar 32 + name 15/600 + `84.2%` 12 · order-type HoverMenu `Market` 96×32.
  - `You pay` box 104 (`--nested` r12): label 12; input 28/600 (default empty, placeholder `0`); token select 128×36 (`sDAI`/`xDAI`, or the parent token for conditionals); `Balance: 0 sDAI` 12 + `Max` 48×24.
  - Direction arrow: circle 32 overlapping both boxes (`data-overlay`).
  - `You will get` box 104: `1.1868` 28/600 + outcome select 144×36. Clicking the value opens a popover with the mono exact value `1.1868081659397476` + copy.
  - Link row 24: `Low balance? Bridge tokens from other networks ↗`.
  - Quote rows 4 × 28 (12 label left, value right): `Avg price`, `Price after buy`, `Potential return` (skeleton 120×12 shimmering while quoting), `Max slippage 1%` + ⚙ 28 (popover 200×96 with a numeric input 72×32, `%`).
  - Multi-scalar shows `Calculate your potential return` instead of Potential return until an amount is entered.
  - CTA 48 full width: same state machine as 4.8, plus `Trade` / `Approve` when funded (unobserved, so Trade → mock reject).
  - `More` disclosure 40 → segmented `Mint | Merge | Redeem` (3 × 1/3 × 36) + `Amount` input 48 + `Balance:` + collateral select `sDAI`/`xDAI` + action button 48 (`Mint`/`Merge`/`Redeem`, follows the tab; disabled without balance, with tooltip `Not enough balance.`).
- **Dialogs** (modal, scrim, focus trap, Esc, return focus):
  - **Report Answer:** 480 wide, padding 24, radius 16.
    - Title `Report Answer` 15/600.
    - Copy verbatim: `This market is not resolved yet. You can provide an answer to the Reality question by depositing a bond of 10 XDAI.`
    - `Current answer: Not answered yet` row 40.
    - Radio group: `Choose an answer` (reveals an outcome select 100%×40) / `Mark this question invalid`.
    - Footer: `Return` 120×40 · `Answer` 120×40 violet. Answer → wallet gate → mock reject → `User rejected the request.`
  - **Add Liquidity:** 480 wide.
    - Title `Add Liquidity`, subtitle `Farming Rewards`.
    - `Earn farming rewards (SEER) by providing liquidity to existing markets.`
    - `Available Pools:` rows 48: `Swapr` + `~ 3.00K SEER / day` (when present) + `Rewards end: <date>` or `Rewards ended on: January 4 2026, 22:31`.
    - `Add liquidity ↗` (Swapr URL §9.3) 160×40 violet · `Learn more about the farming program ↗` · `Return` 120×40.
  - **Connect:** 400 wide. Wallet list rows 56 (mock: one row `Mock wallet` with address `0x0000…dEaD`). Selecting it connects (24.69 xDAI, 0 sDAI).

### 4.11 Leaderboard (`#/leaderboard`)
- **H1** `Profit & Loss Leaderboard` + ⓘ 24, which opens the popover (360 wide) holding the live L-02 Trader Score text verbatim + `How it works ↗` (`https://docs.seer.pm/app/leaderboard`).
- **Control row 44** (gap 8):
  - Period segmented `1D 1W 1M ALL` (4 × 56×36).
  - `App` HoverMenu 168×36 (All, Foresight, Opportunity Markets, Deepfunding) and `Chain` HoverMenu 168×36 (All, Ethereum, OP Mainnet, Gnosis, Base). These apply immediately and write the URL. A combined `Filters` button 104×36 opens both groups on mobile (L-08).
  - `Your Rank` 120×36 (connected only): click → `Finding your rank…` → pins the user row on top. The mock address isn't ranked, so the result is `—` + tooltip `No accounts found`.
  - Search input 280×36 (placeholder `Search by username or address`) + `Search` 96×36.
- **Table:** header 40 (sortable: aria-sort, 12/600, ↑↓ 12); rows **56**.

| Col | Width | Content |
|---|---|---|
| `#` | 56 | rank 15/600 tabular |
| `Account` | flex ≥ 220 | avatar 24 (address-seeded, same everywhere) + ENS or pseudonym 15/500 (mono address tooltip) |
| `Score` | 140 | `78.6` 15/600 + tier pill **76×24** (`ELITE`/`GREAT`/`GOOD`/`N/A`), header ⓘ. Hover/focus → anatomy popover 280×208: 5 bars 0–100 (`Returns`, `Profit factor`, `Hit rate`, `Loss burn`, `Breadth`) + `sampleShrink.factor`. N/A tooltip comes from `scoreUnavailable` (`3 scored markets needed` from `minScoredMarkets`) |
| `Profit/Loss` | 136 | `$241,172.15` (USD 2 dp, U+2212 for negatives) |
| `Volume` | 136 | USD 2 dp |
| `ROI` | 96 | `+30.26%` signed; `N/A` + tooltip `under $0.01 of capital` |
| `Traded Markets` | 120 | integer |

- **Footer 48:** sort descriptor `Sorted by Profit/Loss, high to low` · `Page 1 of 166` · `Previous` 96×36 · `Next` 96×36 · `Updated 10/18/2026, 3:09 PM`.
- Period/filter changes show `Updating…` 12 beside the descriptor while loading (≥ 300 ms skeleton rows).

### 4.12 Create Market (`#/create-market`)
- Disconnected: plate (`--card` r16, 480 wide, centered) with copy `Connect` button 112×40 (C-04).
- Connected:
  - Step dots `1 of 2` (2 × 8 dots + text 12).
  - `Type` as 4 radio rows 72 (`Categorical`, `Scalar`, `Multi Categorical`, `Multi Scalar`), none selected. Each row: radio 16 + type 15/600 + one real example question 12 `--text-2` from the sample (Knesset / BASEFEE gwei / the templateId-3 market / Hungarian seats).
  - `Next` 120×40, disabled with tooltip `Choose a market type` until a type is chosen; then → step-2 plate (`Not in this build` + `Open in Seer app ↗` → `https://app.seer.pm/create-market`).
- Footer 48: `SECURED BY KLEROS` 12/600 + `kleros.io ↗` icon 32.
- `?parent=&outcome=` (from New conditional market) preselects `Categorical` and shows the parent question 12 above the rows.

### 4.13 Collections (`#/collections/default`)
- Title `Default` H1.
- Not signed in: gate plate `Sign in to view and manage your market collections` + `Sign in` 112×40 (→ `Signing in...` → `User rejected the request.`).
- Below the gate: starred markets (local, A-15) as the same card grid, else `No markets in this collection.`

### 4.14 Menus (shared `HoverMenu`, copied from futarchy)
- **Behaviour:** 280 wide (Account 300), items 40, padding 6, radius 12, elevation 3. Opens on hover (90 ms intent) / focus / click / ArrowDown. Closes 220 ms after leave / Esc / outside / selection. One open at a time; 8 px offset; clamps to the viewport. The page underneath is unchanged (G-15).
- **Policies:** `Verified Market Policy`, `Market Rules Policy` → plates `#/policies/verified-market`, `#/policies/market-rules` (`Not in this build` + `Open in Seer app ↗`).
- **App:** `Futarchy` (futarchy.seer.pm), `Deepfunding` (deep.seer.pm), `Foresight` (foresight.kleros.io), `Opportunity Markets` (opportunity.seer.pm). Each item shows an 8 px accent dot and ↗; links open in a new tab.
- **Account:**
  - Header row 48: chain icon 20 + mono `0x0000…dEaD` + copy 32.
  - Items: `Account`, `Deposit`, `Portfolio`, `Market Collections` (→ `#/collections/default`), `Trade Collateral` (others → plates).
  - Switch row `Use smart account` (36×20, `aria-checked`, persisted in localStorage `explorer.smart`).

### 4.15 Tooltip, Command palette, Tour (copied from futarchy)
- **Tooltip:** 300 ms delay, `role=tooltip`, also shown on focus, max 240, clamped, never covers its trigger.
- **Palette:** 640 × max 480; groups `Markets`, `Outcomes`, `Collections`; rows 48 with avatar 24; Enter opens the row. Enter on free text → `#/?marketName=<q>`.
- **Tour** (first visit; Help restarts it), 5 steps, ≤12 words each:
  1. Hero: `Trending markets rotate here. Hover to pause.`
  2. Card: `Click a price to buy. Click the card to open.`
  3. Drawer: `Hover a card for status, liquidity and links.`
  4. Rail: `Every filter lives in this strip.`
  5. Search: `Search markets, outcomes or collections. Press /.`

---

## 5. Layout Principles

- **Container:** `.page` max-width 1760, `padding-inline: clamp(20px, 3.2vw, 56px)`. Header inner, every block and footer use it. Every section root has `data-align`.
- **Home vertical rhythm (1440×900):** beta 28 · header 56 · tier-2 48 · 16 · hero 72 · 16 · toolbar 40 · 12 · grid. The grid starts at y=288, so 3 full rows × 5 = **15 markets above the fold** (target ≥ 12).
- **Home horizontal:** `[rail 56] 16 [grid]`. The expanded rail overlays and never reflows.
- **Grid:** `display:grid; gap:16px` (12 at <600); `grid-template-columns: repeat(N, minmax(0,1fr))`; items `min-width:0`. All cards in a row share the fixed height, so heights are equal by construction.

| Width | Padding | Rail | Grid width | Cols | Card w × h | Header | Hero |
|---|---|---|---|---|---|---|---|
| 320 | 20 | sheet | 280 | 1 | 280 × 218 (compact) | mobile 56 | 88 |
| 360 | 20 | sheet | 320 | 2 (gap 12) | 154 × 218 | mobile | 88 |
| 390 | 20 | sheet | 350 | 2 (gap 12) | 169 × 218 | mobile | 88 |
| 768 | 24.6 | sheet | 719 | 3 | 229 × 184 | tier1 (nav → ≡ menu) + tier2 | 72 |
| 1024 | 32.8 | strip | 886 | 3 | 285 × 184 | full | 72 |
| 1280 | 41 | strip | 1126 | 4 | 270 × 184 | full | 72 |
| 1440 | 46 | strip | 1276 | **5** | 242 × 184 | full | 72 |
| 1920 | 56 (content 1760) | strip | 1688 | **6** | 268 × 184 | full | 72 |
| 2560 | content capped 1760 | strip | 1688 | 6 | 268 × 184 | full | 72 |

Column counts are explicit media queries (`<340:1`, `<600:2`, `<1280:3`, `<1440:4`, `<1920:5`, `≥1920:6`).

**Market page (≥1024).** Breadcrumb · banners · header card (full width) · 24 · 12-col grid (gap 16):
- Left 8 cols: chart 520 · 24 · outcomes · 24 · Major Events · 24 · ids · 24 · tabs.
- Right 4 cols: ticket, sticky top 72, `align-self:start`.
- 768–1023: single column; ticket = FAB.

**Market page mobile (<768).** Breadcrumb 40 · banners · header card (H1 26) · chart (plot 240, gutter 56, range segmented scrolls inside with fades) · outcomes · events · ids · tabs (scrollable tablist).
- **FAB** `Trade` 160×48, fixed bottom 16 + safe-area, right 16, violet, `aria-haspopup=dialog`. It opens the sheet (max 92vh) with a top segmented control `Trade | Mint | Merge | Redeem` (4 × 1/4 × 40) + `×` 40 and the same ticket body.
- `scroll-padding-bottom: 80px` so the FAB never hides focused content.

**Leaderboard.** H1 row · 24 · control row 44 (wraps at <1100 into two 44 rows) · 16 · table · footer 48.
- <600: rows become labelled 2-line rows of 72. Line 1: `#` + avatar + account + tier pill. Line 2: `P/L`, `Volume`, `ROI`, `Markets` as 12 label + 15 value in a 4-col grid.

**Mobile height guard:** home at 390 with 20 cards = 28+56+16+88+16+40+12 + 10 rows × (218+12) = 2556 < 4600 ✓. Infinite scroll continues beyond.

**No void >32 inside a block. No horizontal overflow at any width.**

---

## 6. Depth and Elevation

| Level | Dark | Light | Used by |
|---|---|---|---|
| 0 page | `--bg` | `--bg` | page |
| 1 surface | `--card` + `inset 0 1px 0 rgba(255,255,255,.04)` | `--card` + `0 1px 0 rgba(23,23,28,.06)` | cards, hero, rail strip, header |
| 1h hover | `--nested` | `#F7F7F9` | card hover, rows |
| 2 attached overlay | `--nested` + `0 16px 32px rgba(0,0,0,.48)` | `--card` + `0 12px 28px rgba(23,23,28,.12), 0 1px 0 rgba(23,23,28,.06)` | drawer, expanded rail |
| 3 floating | `--card` + `0 20px 48px rgba(0,0,0,.56)` | `--card` + `0 16px 40px rgba(23,23,28,.16)` | quick-buy, menus, popovers |
| 4 modal | `--card` over scrim `rgba(0,0,0,.56)` | `--card` over scrim `rgba(23,23,28,.32)` | dialogs, sheets |

No blur, no glass, no glow, no borders for separation (tonal only). The only rules are 1 px tonal dividers inside tables and the drawer header.

---

## 7. Motion and Signature Animation

**Tokens:** `--t-fast 90ms`, `--t-base 140ms`, `--t-drawer 180ms` (D5), `--t-hero 300ms` (D5), `--t-slow 420ms`; `--ease-out cubic-bezier(.2,.8,.2,1)`; `--ease-spring` (motion: stiffness 420, damping 34).

| Motion | Spec | Reduced motion |
|---|---|---|
| Card hover | bg tonal step 140 ms | same |
| Drawer | clip-path + opacity 180 ms, intent 120 ms, leave 220 ms | opacity 90 ms |
| Quick-buy | scale .98→1 + opacity 140 ms from the trigger edge | opacity 90 ms |
| Hero swap | 300 ms crossfade + 6 px slide, dwell 6000 ms | no auto-rotate, instant swap |
| Rail expand | width clip 56→320 180 ms | instant |
| Filter apply / tag remove | FLIP 280 ms spring, ≤ 40 cards, rest snap | snap |
| Number tick | RollingNumber 280 ms spring, ≤ 2 digits, LSD crossfade 120 ms | instant |
| Entrance (first load) | fade + rise 8 px, 30 ms stagger, max 8 cards, once per session | none |
| Route change | view transition 200 ms crossfade; skipped when a navigation is in flight | none |
| Theme toggle | view-transition circular reveal from the toggle 420 ms | instant |
| Sheet | translateY 280 ms `--ease-out`; drag follows the finger; >30% or velocity >0.5 px/ms dismisses | instant |
| Chart | no draw-in; crosshair follows the pointer (rAF) | same |

**Signature: "Price → Payout tick."**
- **Inputs:** odds p_i, amount A, quote q(A).
- **Math:**
  - shares = A / p̄ (fixture: exact router value).
  - payout = shares × 1.
  - Scalar payout bound = shares × 1 (`Pays up to`).
- **Behaviour:** on each keystroke (debounce 120 ms) `You will get` and `Pays` roll digit-wise. Only changed digits roll, at most 2 per tick. Larger jumps crossfade the whole number in 120 ms.
- **Odds tick (live mode `?live=1` only):** when a polled `odds[i]` changes on a visible card, the tile % rolls and a ▲/▼ 12 glyph in `--sem-delta-*` shows for 1200 ms. Polling: every 30 s for visible cards via IntersectionObserver; offscreen cards don't poll.
- **What it explains:** that a price is a probability and a payoff. Typing 1 into Yes at 84.2% visibly yields 1.19.
- **Test hooks** (non-production, `import.meta.env.DEV || ?test=1`):
  - `window.__explorerTest = { setNow(ts), setBalance(n), connect(), disconnect(), tickOdds(id, i, v), hero: {index, paused}, reel(id) }`.
  - Chart canvas exposes `canvas.__labels` (array of `{text,x,y,w,h}`; `[]` when empty).
- **Offscreen pause:** hero rotation stops when the hero is out of view or the tab is hidden.

---

## 8. Do's and Don'ts

**Do**
1. Show `odds[i]` exactly as given (one decimal), never normalized. Σ≠100 is explained only in a tooltip when |Σ−100| > 2.
2. Keep every card exactly 184 (desktop) / 218 (compact), whatever the content.
3. Make the whole card a link. Every inner control calls stopPropagation and has its own accessible name.
4. Use real URLs from §9.3 for every external link. Open them in a new tab with ↗.
5. Show the parent outcome on conditional cards and the parent token as the pay unit.
6. Treat the drawer and quick-buy as overlays: the grid never jumps (CLS 0).
7. Mirror search, filters and sort in the URL; Back/forward restores them along with the scroll position.
8. Keep the chart's y-axis at 0–100% unless `Zoom to data` is on, and declare the zoom.
9. Round shares to 4 dp everywhere, with the exact value one click away.
10. Show `Sample data` once, as a footer chip only.

**Don't**
1. No donut, ring or pie charts anywhere.
2. No big hero, headline + two buttons, marquee, ticker loop or auto-scrolling list.
3. No glow, gradients, glass or neon.
4. No icon cluster without labels/tooltips; at most 3 icon buttons per card footer.
5. No preset amount chips in quick-buy (until the user asks).
6. Never invent product terms. Strings outside the allowed list are rejected; a data label or unit is fine.
7. No fake history, fake balances, fake holders or fake events. Missing data → the designed empty state.
8. No paragraph >14 words outside tooltips, popovers, dialogs or the tour. Headlines ≤ 6 words.
9. Don't put status, liquidity, type or chain on the card at rest (they live in the drawer).
10. No silent controls. Unobservable actions end in the real gated state (Connect / Not enough balance. / User rejected the request.).

**Allowed strings.** Open Floor S9, minus the feed-only strings (`All markets`, `Politics`, `Crypto`, `Sports`, `Tech`, `Show`, `Pin to dock`, `Cost`, `COND`, `UNVERIFIED`, `Topics are assigned…`, `vol`), plus:
- `Trending`, `markets`, `Vol.`, `more`, `+`, `Verified market`, `Market details`, `Add to collection`, `Remove from collection`, `Market Estimate`, `wins`, `up to`, `You will get`, `You pay`, `Pays`, `if`, `Show all`, `Search by outcome:`, `Open market page`, `Open interest`, `Resolution`, `Parent`, `Kleros`, `Reality.eth`, `Status`, `Type`, `Chain`, `Rewards`, `Active`, `Copied`, `Market`, `Condition Id`, `Question Id`, `Collateral`, `Creator`, `Sign in`, `Switch to Ethereum`, `Not in sample data`, `Back`, `Help`, `Mock wallet`.
- The exact banner, dialog and gate copies quoted in §4.10–4.13.
- The tour steps in §4.15.

---

## 9. Screens, Data, Tests and Agent Prompt Guide

### 9.1 Routes (hash router; DIRECTION route shape)

| Route | Screen |
|---|---|
| `#/?marketName=&state=&verif=&chain=&sort=&dir=&cond=&rewards=&minLiq=&futarchy=` | Home |
| `#/markets/:chainId/:slug` (+ `?outcome=<i>&range=1D\|1W\|1M\|All\|<from>-<to>&tab=comments\|related\|holders\|activity`) | Market page |
| `#/leaderboard?period=1d\|1w\|1m\|all&app=&chain=&sort=pnl\|score\|volume\|roi&dir=&page=&q=` | Leaderboard |
| `#/create-market` (+ `?parent=&outcome=&step=2`) | Create |
| `#/collections/default` | Collections |
| `#/account`, `#/deposit`, `#/portfolio`, `#/trade-collateral`, `#/policies/verified-market`, `#/policies/market-rules` | Unobserved plates |
| anything else | 404 plate with a `Markets` link |

### 9.2 Per-market data adapter (`src/data/markets.ts`; source `src/data/markets-search.full.json` → `.markets[]`, 100 records)

| `Market` field | Source field(s) | Rule | Sample check |
|---|---|---|---|
| `id` | `id` | lowercase hex | `0x31cb54c4…` |
| `chainId`, `chainName` | `chainId` | {1: Ethereum, 10: OP Mainnet, 100: Gnosis, 8453: Base} | 99 × 100, 1 × 1 |
| `slug` | `url` | route key; adapter asserts uniqueness, otherwise appends `-<id.slice(2,6)>` | |
| `question` | `marketName` | `.trim()`; keep `[party bloc]` literally | |
| `image`, `outcomeImages` | `images.market`, `images.outcomes[]` | monogram fallback | |
| `outcomes[]` | `outcomes` | `.trim()`; Invalid = last item named `Invalid` | Knesset 5 |
| `odds[]` | `odds` | number or null; null → `—` | `[60.8,38.1,0.5,0.9,null]` |
| **`type`** | `templateId`, `outcomes` | `"2"` → Categorical (`binary` layout when exactly 2 non-Invalid outcomes); `"3"` → Multi Categorical; `"1"` + non-Invalid outcomes == {DOWN, UP} → Scalar; `"1"` otherwise → Multi Scalar | 74 / 1 / 25 (14 + 11) |
| `isFutarchy` | `type` | `type === 'Futarchy'` | 0 in sample → empty state |
| `bounds` | `lowerBound`, `upperBound` | BigInt string; if ≥ 1e15, × 1e−18 | |
| `unit` | `marketName` | text of the last `[...]` at the end of the question, before the first comma (`[millions of units, 1 decimal]` → `millions of units`) | `gwei`, `seats`, `Note` |
| `estimate` (scalar) | odds, bounds | L + (U−L)·p_UP/(p_UP+p_DOWN) | |
| `outcomeValue` (multi scalar) | odds, bounds | ~ round(p_i/100 × U) (A-05) | `~182 seats` |
| **`status`** | `questions[]`, `openingTs`, `finalizeTs`, `hasAnswers`, `questionsInArbitration`, `payoutReported`, NOW | Per question q: `notOpen = NOW < q.opening_ts`; `unanswered = q.best_answer ∈ {0x0…0, 0x…fffe (answered too soon)}`; `final = q.finalize_ts > 0 && q.finalize_ts ≤ NOW`. Market: **In Dispute** if `questionsInArbitration > 0` or any `q.is_pending_arbitration`; else **Reports not open yet** if all notOpen (pill label `Trading Open`); else **Reports open** if any unanswered; else **Waiting for answer** if any !final; else **Pending execution** if !`payoutReported`; else **Closed** | Le Pen (`best_answer …fffe`) → Reports open ✓ (037) |
| `answeredTooSoon[]` | `questions[].best_answer` | `== 0x…fffe` → `Answer: Answered too soon` + `Reopen question` | |
| `resolutionTs` | `openingTs` | `Resolution opening at` | |
| **`verification`** | `verification?.status`, `.itemID` | `verified` → Verified; `verifying` → Verifying; `challenged` → Challenged (raw strings A-03); absent → Not Verified | 88 / 0 / 0 / 12 |
| **`conditional`** | `parentMarket.id`, `parentOutcome` | conditional iff `parentMarket.id ≠ 0x000…0`; `parentId`; `parentOutcomeIndex = +parentOutcome`; `parentOutcomeName` = parent's `outcomes[idx]` if loaded, else `get-market` (live) / `Yes` for 0 and `No` for 1 when the parent is binary (A-06) | 17 |
| `collateralSymbol` | `poolBalance[]` | the token symbol common to every non-null pool (`sDAI`, or the parent token e.g. `LEPEN_NRYES`) | bbf8 → `LEPEN_NRYES` |
| `collateralToken` | `collateralToken` | for links | |
| **`rewards`** | `incentive` | `incentive > 0` → Rewards Active (A-07 unit) | 1 (Knesset 300000) |
| `liquidityUSD` | `liquidityUSD` | money format | `$27.7K` |
| `volumeUSD`, `volumeNotionalUSD` | same | card footer / drawer pool header | `$5.10K`, `$15.5K` |
| `openInterestUSD` | same | drawer + meta; sDAI value = USD / `SDAI_USD` (A-09) | `$7.26K` |
| `pools[]` | `poolBalance[i]` | `{outcomeSymbol, outcomeBalance, collateralSymbol, collateralBalance}` or null (Invalid) | `4.94K YASHAR / 12.1K sDAI` |
| `wrappedTokens[]` | same | Swapr / explorer links | |
| `conditionId`, `questionId`, `creator`, `factory`, `transactionHash` | same | ids block | |
| `createdTs` | `blockTimestamp` | Sort `Creation Date` | |
| `leading` | odds | argmax over non-null; tie → lower index | |

**Sort keys:** Default = fixture order; Liquidity → `liquidityUSD`; Volume → `volumeUSD`; Open Interest → `openInterestUSD`; Opening Date → `openingTs`; Creation Date → `blockTimestamp`; Desc/Asc.

**Search** (`marketName`): case-insensitive substring over `question` + `outcomes[]`; collections match the name `Default`.

**Min liquidity:** `liquidityUSD ≥ value`. **Trending:** top 5 `volumeUSD` with status ≠ Closed.

**Single source of truth.** One `Market` object feeds card, hero, drawer, quick-buy, market page and ticket. Test 19b asserts that card % = hero % = outcome row % = ticket header %.

### 9.3 Link templates (`src/data/links.ts`; all observed in captures)

| Link | Template | Evidence |
|---|---|---|
| Explorer address | `https://gnosisscan.io/address/<id>` (1 → etherscan.io, 10 → optimistic.etherscan.io, 8453 → basescan.org: A-10) | audit-gap raw (46 hits) |
| Explorer token | `https://gnosisscan.io/token/<addr>` | audit-gap raw |
| Kleros item | `https://curate.kleros.io/tcr/100/0x5aAF9E23A11440F8C1Ad6D2E2e5109C7e52CC672/<verification.itemID>`; registry root for `Verify it` | audit-gap raw (23 hits) |
| Reality.eth | `https://reality.eth.limo/app/#!/network/<chainId>/question/0xE78996A233895bE74a66F451f1019cA9734205cc-<questions[0].id>` (chain 100; other chains A-11) | audit-gap raw (6 hits) |
| Swapr add liquidity | `https://v3.swapr.eth.limo/#/add/<a>/<b>/enter-amounts`, where a, b = {outcome wrapped token, collateral token} sorted ascending | audit-gap raw (23 hits) |
| App menu | futarchy.seer.pm · deep.seer.pm · foresight.kleros.io · opportunity.seer.pm | audit/raw 003 |
| How it works | `https://docs.seer.pm/app/leaderboard` | audit/raw 009 |
| Kleros footer | `https://kleros.io/` | 50 hits |
| Bridge / farming "Learn more" / policies | unknown → A-13; link to `https://app.seer.pm/` until confirmed | — |

### 9.4 Other adapters

| Module | Source | Contract |
|---|---|---|
| `quote.ts` | scenario 01 fixture; live router | Fixture: market `0xe1793927…`, outcome Yes, A=1 → `1.1868081659397476`. Otherwise spot: shares = A/p, flagged `≈`, `avgPrice = p`, `priceAfter = —` (sample), `potentialReturn = shares − A` (and %). Display 4 dp; exact string kept. |
| `history.ts` | `market-chart.json`, `markets-charts.json` (+ pass-1 captures) | Salvage complete `{periodStartUnix, token0Price, token1Price, pool.token0.name}` objects from the truncated raw strings. Outcome price = price of the outcome token in collateral; % = price×100. Ranges: 1D/1W/1M/All/custom clip the series. |
| `holders.ts` / `activity.ts` | `get-token-transactions.json` (+ captures) | `topHolders[wrappedToken][]` balance /1e18; formats `6.58K`, `<0.001`. Activity rows from the same file when present. |
| `events.ts` | `get-market-events.json` (+ captures) | `[] → 0 UPCOMING` |
| `comments.ts` | `market-comments.json` | `[] → No takes yet. Share the first one.` |
| `leaderboard.ts` | `get-pnl-leaderboard.json` + pass-1 fixtures `lb-<period>-<app>-<chain>-<sort>-<dir>-<offset>.json` | Rows: `roi×100` signed; tier ← `tier` (`Great` → `GREAT`), null → `N/A` + `scoreUnavailable`. Pages = ceil(total/25). Missing fixture combo → error plate `Not in sample data` + `Retry`. |
| `wallet.ts` | mock | address `0x000000000000000000000000000000000000dEaD`, chainId 100, xDAI 24.69, sDAI 0, every other token 0. Reverse lookup 404 → truncated address. Signing → reject after 600 ms with `User rejected the request.` |
| `pnl.ts` | `get-portfolio-pl.json` | `P&L 0.00` |
| `clock.ts` | — | `NOW = 1792367760` (sample); `Date.now()/1000` with `?live=1` |

### 9.5 Open assumptions (each must be confirmed or the UI shows its honest fallback)

| ID | Assumption | Fallback until confirmed |
|---|---|---|
| A-01 | Status rule (§9.2) matches live `getMarketStatus`, incl. answered-too-soon = Reports open | Verified for Le Pen (037); spot-check 5 more in pass 6 against live pills |
| A-02 | Market States filter is single-select | Single-select radios |
| A-03 | Raw verification strings `verifying` / `challenged` | Marks render via `#/__test/marks` harness only; no sample market carries them |
| A-04 | Multi-question aggregate = "worst" question state | as specified |
| A-05 | Multi-scalar value = round(p_i/100 × U) | Pass 1 compares with audit-types 011 (`~182`, `~168 seats`); on mismatch show % only |
| A-06 | Parent outcome name when the parent isn't loaded | index 0 → `Yes`, 1 → `No` for binary parents; else `#<n>` |
| A-07 | `incentive` unit (SEER total vs per day) | Show `Active` only, never the number |
| A-08 | Markets page 2 request body (pagination) | Pass 1 captures offset 100; if impossible, end-of-list caption `100 markets` and H-02 runs in live mode |
| A-09 | sDAI↔USD rate for OI dual unit | `SDAI_USD = 7257.34/5750` derived from capture 007; live mode reads the rate |
| A-10 | Explorer hosts for chains 1/10/8453 | standard hosts; only chain 100 observed |
| A-11 | Reality contract on non-Gnosis chains | link hidden (row shows `—`) for chainId ≠ 100 |
| A-12 | Invalid token value `210.85 SER-INVALID` source field | Cell shows `—` in sample; live reads the balance |
| A-13 | Bridge, farming "Learn more" and policy hrefs | `https://app.seer.pm/` |
| A-14 | Leaderboard fixtures for other periods/filters/sorts/pages | captured in pass 1; missing combo → `Not in sample data` |
| A-15 | Star = local Default collection without sign-in | localStorage `explorer.collection.default` |
| A-16 | Futarchy markets have `type === 'Futarchy'` | Filter yields the empty state in sample |

### 9.6 Fixture capture (pass 1; run by Claude outside the sandbox: `node apps/explorer/scripts/capture-fixtures.mjs`)
- `market-chart`, `get-token-transactions` and `get-market-events` (untruncated) for:
  - `0xe1793927…` (Le Pen), `0xbbf8f7e4…` (conditional Yes), `0xfe41…` (conditional No), `0x31cb54c4…` (Knesset);
  - the BASEFEE scalar, the 80-outcome "futarchy-run AI job board" market, and one multi-scalar seats market.
- `get-pnl-leaderboard`: period {1d,1w,1m,all} × chainId {all,100} × sort {pnl,score,volume,roi} desc; plus all/all/pnl offset 25; plus app {foresight, opportunity, deepfunding} all/all/pnl.
- `markets-search` page 2.
- Subgraph pool ticks for the Le Pen child pools (ladder).
- Saved to `apps/explorer/src/data/fixtures/*.json` unmodified.

### 9.7 Screens (ASCII)

**Home 1440 (content 1348):**
```
[Note that this is a Beta version and can still be unstable                    ×]  28
[seer  Markets Leaderboard Create Market Policies▾ App▾     ?  ◐  [⛓ 0x0000…dEaD | 24.69 xDAI ▾]] 56 sticky
[⌕ Search by market, outcome or collection ……………………]        [☆ My collections][+ Create New Market]  48
┌56┐ ┌ TRENDING (av40) Will Marine Le Pen be the National Rally's… 84.2% Yes [Yes][No]  ● ━ ● ● ● ┐ 72
│◎ │ └────────────────────────────────────────────────────────────────────────────────────────────┘
│✓ │ 100 markets  [Reports open ×] [Gnosis ×] [Liquidity ↓ ×]  Clear filters                       40
│⛓ │ ┌card┐ ┌card┐ ┌card┐ ┌card┐ ┌card┐   5 × 242, gap 16, h 184
│⇅ │ ┌card┐ ┌card┐ ┌card┐ ┌card┐ ┌card┐
│⑂ │ ┌card┐ ┌card┐ ┌card┐ ┌card┐ ┌card┐   (15 visible @900)
│🎁│ … infinite: sentinel 600 px before end loads the next page (skeleton row of 5)
│💧│
│⑃ │
│ ›│
└──┘
```

**Card hover + drawer:**
```
┌ card 242×184 ───────────────┐
│ …                           │
├ drawer 242×256 (overlay) ───┤  ← covers the card below; grid unchanged
│ Status        ● Reports open│
│ Liquidity           $7.16K ›│
│ Open interest        $31.1K │
│ Type            Categorical │
│ Chain              Gnosis ↗ │
│ Kleros           Verified ↗ │
│ Reality.eth  Answer on Re…↗ │
│ Rewards                   — │
│ Parent                    — │
│ Resolution      Apr 7, 2025 │
└─────────────────────────────┘
```

**Market page 1440:**
```
[‹] Home / Market
┌ Conditional Market — This market is conditional on … being "Yes". … worthless. ┐  (if conditional)
┌▀▀▀▀▀▀▀▀▀▀ 4px status ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀┐
│ [● Reports open]                                                    ✓  ☆    │
│ (av56) Will the National Rally's candidate win the next French…   (H1 40)   │
│        Answer on Reality.eth! →                                             │
│ SEER  Categorical  Liquidity $7.54K ⓘ  Volume $11.7K  Open interest $… ⓘ  P&L 0.00   Verified │
└──────────────────────────────────────────────────────────────────────────────┘
┌ chart 8 col × 520 ─────────────────────────────┬72┐ ┌ ticket 4 col sticky ─────┐
│[1D|1W|1M|All|Custom] ⓘ ⌕zoom        ‹ › ⤓      │  │ │(x) No 74.5%   [Market ▾] │
│100┤                                            │No│ │ You pay     [LEPEN_NRYES▾]│
│ 75┤‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾╲___________            │74.5│ 0          Balance: 0 Max│
│ 50┤                                            │  │ │          (↓)             │
│ 25┤____________________╱‾‾‾‾‾‾‾‾‾‾‾            │Yes│ You will get      [No ▾]  │
│  0┤                                            │35.3│ Low balance? Bridge … ↗  │
│   May 2025      Sep        2026      May       │  │ │ Avg price / Price after… │
│ Pool price, not trades ⓘ                       │  │ │ Max slippage 1% ⚙        │
└────────────────────────────────────────────────┴──┘ │ [ Enter an amount ]      │
┌ Outcomes ──────────────────────────────────────────┐ │ More ▸ Mint|Merge|Redeem │
│ #1 (av) No   ████████░░  74.5%  (selected)         │ └──────────────────────────┘
│   [Add Liquidity] [View pool details] [New conditional market]
│ #2 (av) Yes  ███░░░░░░░  35.3%                     │
│ #3 Invalid                 —     0%                │
└────────────────────────────────────────────────────┘
Major Events [1 UPCOMING]  MAY 31, 2027 · 00:00 UTC  Reality.eth Resolution  Expected resolution date
Ids: Market · Condition Id · Question Id · Collateral · Creator  (mono, copy, ↗)
[Comments][Related Conditional Markets (2)][Top Holders][Activity]
```

**Mobile 390 home:**
```
[seer            ⌕  ◐  ≡]                 56
[Note that this is a Beta…            ×]  28
┌ hero 88: (av32) Will Marine Le Pen…  ●●●●● ┐
│ 84.2% Yes                 [Yes][No]        │
└────────────────────────────────────────────┘
[Filters (2)] 100 markets [Reports open ×][Gn…   (scroller, edge fade)
┌ 169×218 ────────┐┌ 169×218 ────────┐
│(av24)    ✓ ☆ ⌄  ││(av24)    ⚠ ☆ ⌄  │
│Will Marine Le   ││Which party or   │
│Pen be the Nat…  ││joint electoral… │
│[ Yes     84.2%] ││[ Yashar  60.8%] │  rows 40 = buy buttons (compact type 12/15/20)
│[ No      14.8%] ││[ Likud   38.1%] │
│$49.7K Vol.      ││$5.10K Vol. +2 more
└─────────────────┘└─────────────────┘
```

**Compact card (218):** pad 10 · top row 24 (avatar 24 · mark 24 · star 24 · Details 24, each 40 hit) · 6 · question 40 (conditional: 1 line + conditional line) · 8 · block 88 (binary/multi: 2 full-width rows × 40, gap 8, each row = buy button `name … %`; scalar: row 1 `Market Estimate 9.09 gwei` 15/600, row 2 `[Up][Down]` 2 × 40) · 8 · footer 24 (`$Vol.` + `+N more`) · pad 10.

**Mobile 390 market page:** single column as in §5. Ticket FAB `Trade` 160×48. Sheet tabs `Trade | Mint | Merge | Redeem` + `×`. Chart plot 240, gutter 56. Outcomes rows 56 with the action strip as 3 stacked 40-high buttons.

**Mobile leaderboard:** control rows (period segmented full width; `Filters` 104×40 opening a sheet with App + Chain; search 100%×40 + Search 96×40); labelled rows 72; footer wraps into 2 rows.

**Mobile menus:** ≡ opens a full-height sheet: nav list rows 48, `Policies` and `App` as expandable groups (rows 48), Account group, `Connect`.

### 9.8 Redesigned flows (mock wallet; one flow test each)

| # | Flow | Live steps | New steps | New path |
|---|---|---|---|---|
| 01 | Search → trade preview (desktop) | 6 | **3** | Type `Marine Le Pen` in the search (URL `marketName=Marine+Le+Pen`) → click `Yes` tile on the Le Pen card (quick-buy) → type `1`: `You will get 1.1868 Yes`, `Pays 1.19 sDAI if Yes wins`; CTA `Not enough balance.` (connected, 0 sDAI) |
| 02 | Leaderboard comparison | 9 | **7** | Leaderboard → `1W` → `ALL` → Chain menu: `Gnosis` → sort `Score` → `Next` → `Previous` (each step URL-mirrored; `Updating…` shown) |
| 03 | Market research | 8 | **7** | Click card → `Custom` → `Last Month` → `Save` → `Top Holders` → `Activity` → `Related Conditional Markets (2)` |
| 04 | Liquidity investigation | 7 | **5** | Market → click outcome row (selects, action strip) → `View pool details` (Pool Id, Liquidity Chart, ladder, `Last:`) → `Add Liquidity` → `Return`. Shortcut: card drawer → `Liquidity ›` per-pool (2) |
| 05 | Report answer | 5 | **4** | Market → `Answer on Reality.eth!` → `Mark this question invalid` (bond `10 XDAI` visible) → `Return` |
| 06 | Collections gate | 4 | **2** | `My collections` → gate + `No markets in this collection.` (Sign in → `User rejected the request.`) |
| 07 | Mobile search → trade sheet | 6 | **4** | ⌕ → type → tap `Yes 84.2%` row on the card (quick-buy sheet) → type amount → quote + CTA |
| 08 | Mobile leaderboard | 9 | **8** | Same as 02, with `Filters` sheet (+1 step) and labelled rows |
| 09 | Conditional (new) | 5+ (filter, scan, open, find parent manually) | **5** | Rail `Conditional Market` switch + `Apply` (tag `Conditional`) → card line `Conditional on "Will Marine Le Pen…" being "Yes"` → click card (banner, pay unit `LEPEN_NRYES`) → banner parent link → parent page tab `Related Conditional Markets (2)` lists the Yes and No children |

### 9.9 Tests (`apps/explorer/e2e/`; base `apps/futarchy/e2e/run.mjs`; run at 1440 and 390, plus the widths listed)

**Files:** `run.mjs` (orchestrator, `--suite=`), `quality.mjs` (ui-quality §12 01–24), `parity.mjs` (driven by `parity.json` generated from §9.10), `deadControls.mjs`, `navigation.mjs`, `flows.mjs`, `card.mjs`, `chart.mjs`, `data.mjs`.

**Dead-control** (`dead-controls-<route>-<width>`):
- Routes: `#/`, market pages {binary Le Pen, conditional bbf8, 80-outcome, scalar BASEFEE, multi-scalar, unverified}, `#/leaderboard`, `#/create-market` (disconnected + connected), `#/collections/default`, every plate.
- Widths: 1440 and 390.
- Enumerate `button, a[href], input, select, textarea, [role=tab|switch|menuitem|radio|option|slider]`. Operate each one (blur first; poll ≤ 2 s). Assert a change in URL, DOM hash (main subtree), an opened dialog/popover/menu/tooltip, focus, `aria-*` state, or a download/new-tab request. Otherwise the control must be `disabled` with `aria-describedby` tooltip text.
- External links are asserted by href pattern (§9.3) without navigating.
- Zero silent controls allowed.

**Navigation** (`nav-*`):
- `nav-every-route-reachable-from-ui`, `nav-back-forward-restores-filters-and-scroll`, `nav-deep-link-market-loads`, `nav-brand-home-header-scoped`, `nav-breadcrumb-home`, `nav-esc-closes-overlay-then-back`, `nav-keyboard-tab-order-card-controls`, `nav-palette-slash-and-cmdk`, `nav-unknown-route-404-plate`.

**Card / drawer / quick-buy** (`card.mjs`):
- `card-fixed-height-184-desktop-218-compact`: every card, at 360/390/768/1024/1280/1440/1920.
- `card-grid-columns` = 1@320, 2@360/390, 3@768/1024, 4@1280, 5@1440, 6@1920/2560.
- `card-whole-click-navigates`: click at card padding (x+6, y+h−6) and on the avatar; URL = `#/markets/100/<slug>`.
- `card-inner-controls-do-not-navigate`: tile, Buy, star, mark, `+N more` (goes to `#outcomes`, not just the card), drawer links.
- `card-question-two-line-clamp-with-tooltip`.
- `card-binary-tiles-exact-percent` (Le Pen `84.2%` / `14.8%`).
- `card-multi-top2-and-more-count` (Knesset `Yashar 60.8%`, `Likud 38.1%`, `+2 more`; 80-outcome card `+78 more`).
- `card-scalar-estimate-and-up-down`.
- `card-multiscalar-value-unit`.
- `card-conditional-second-line-yes-no`: the two National Rally siblings show `"Yes"` / `"No"`.
- `card-verification-marks-shapes-tooltips`: verified tooltip `Verified market`; unverified amber triangle + tooltip; verifying/challenged via `#/__test/marks`.
- `card-star-toggles-aria-pressed-persists`.
- `drawer-opens-on-hover-120ms-closes-220ms`.
- `drawer-opens-on-keyboard-focus`.
- `drawer-touch-details-pin` (hover:none emulation).
- `drawer-overlays-no-grid-reflow`: every card's boundingBox is unchanged ±0.5 px and documentHeight is unchanged.
- `drawer-flips-up-near-viewport-bottom`.
- `drawer-fixed-height-256`.
- `drawer-links-real-hrefs`: GnosisScan / Kleros / Reality templates.
- `drawer-liquidity-opens-per-pool-panel`: rows = non-null pools, format `x / y`.
- `drawer-parent-link-navigates-to-parent`.
- `drawer-one-at-a-time`.
- `quickbuy-opens-anchored-8px-clamped`.
- `quickbuy-single-amount-input-no-chips`.
- `quickbuy-live-you-pay-you-get-pays`: fixture A=1 on Le Pen Yes → `1.1868`.
- `quickbuy-disconnected-cta-connect-then-returns`.
- `quickbuy-not-enough-balance-and-bridge-link`.
- `quickbuy-confirm-rejects` (`setBalance(25)`): `User rejected the request.`
- `quickbuy-conditional-pay-unit-parent-token` (`LEPEN_NRYES`).
- `quickbuy-esc-and-outside-close-return-focus`.
- `quickbuy-compact-is-bottom-sheet-390`.
- `quickbuy-closes-drawer-and-pauses-hero`.

**Hero, rail, tags:**
- `hero-height-72-desktop-88-mobile`.
- `hero-rotates-6s-swap-300ms` (`__explorerTest.hero.index` advances).
- `hero-pauses-on-hover-and-focus`.
- `hero-dots-jump`.
- `hero-reduced-motion-no-autorotate`.
- `hero-no-layout-shift`.
- `hero-buttons-open-quickbuy`.
- `rail-collapsed-56-expands-on-hover-overlay`.
- `rail-click-pins-and-scrolls-group`.
- `rail-all-groups-and-options-verbatim`.
- `rail-staged-cancel-reverts-apply-commits-url`.
- `rail-min-liquidity-filters`.
- `rail-sheet-under-1024`.
- `tags-reflect-applied-filters`.
- `tags-remove-applies-immediately-url`.
- `tags-overflow-plus-n-opens-rail`.
- `tags-clear-filters`.
- `toolbar-fixed-40-no-jump`.

**Chart** (`chart.mjs`):
- `chart-default-domain-0-100`.
- `chart-zoom-toggle-declared`.
- `chart-gutter-labels-no-tick-overlap` (`canvas.__labels` vs tick boxes).
- `chart-no-origin-artifact` (8×8 px origin has no pixel darker than the card ±6).
- `chart-year-at-boundaries`.
- `chart-crosshair-tooltip-all-top-outcomes`.
- `chart-80-outcomes-top3-colored-plus-more-label`.
- `chart-row-hover-isolates-series`.
- `chart-no-history-plate-labels-empty`.
- `chart-custom-popover-presets-save-cancel`.
- `chart-export-csv-download`.
- `chart-prev-next-shift-window`.

**Data honesty** (`data.mjs`):
- `data-type-counts-74-1-14-11`.
- `data-verified-88-unverified-12`.
- `data-conditional-17`.
- `data-rewards-1`.
- `data-futarchy-empty-state`.
- `data-status-lepen-reports-open-answered-too-soon`.
- `data-odds-as-given-sigma-tooltip-only`.
- `data-single-source-card-hero-row-ticket`.
- `data-leaderboard-tiers-and-na-reason`.
- `data-slugs-unique`.
- `data-no-fake-history`.

**Flows:** `flow-01-search-trade-preview-desktop` … `flow-08-mobile-leaderboard`, `flow-09-conditional`. Each asserts the step count from §9.8 and the final state strings.

**Quality suite:** ui-quality §12 01–24, including:
- overflow 320–2560;
- container alignment;
- touch ≥ 40 at 390;
- themes + contrast script (§2 values);
- reduced motion;
- reel windows;
- label overlaps (scroll to 0, skip header pairs);
- HoverMenu timings;
- avatar consistency (market avatar in card = hero = page);
- fixed pill widths (status 132, tier 76);
- `.btn-bubbles` no overflow;
- mobile height <4600;
- perf `perf-scroll-600-cards-55fps` (live fixture ×6 pages).

### 9.10 PARITY table (every ID → new location → e2e test)

PARITY_MAP.md is truncated after T-18. The rows after it come from PARITY_MAP_DRAFT.md namespaces that don't collide (CM, COL, MD, TAB, MOD, DATA). Draft leaderboard IDs that collide with verified L-ids are listed as `D-L-nn`. Draft-only rows are marked ‡ and must be re-confirmed on a screenshot before gating.

**Global**

| ID | New location | e2e test |
|---|---|---|
| G-01 | Beta strip 28, above header | parity-beta-banner-visible-on-home |
| G-02 | Header tier 1 (tonal, D6) holds all nav | parity-header-bar-visible |
| G-03 | Wordmark → `#/` | parity-logo-links-home |
| G-04 | Nav `Markets` | parity-nav-markets-links-home |
| G-05 | Nav `Leaderboard` | parity-nav-leaderboard-links-leaderboard |
| G-06 | Nav `Create Market` | parity-nav-create-market-links-create |
| G-07 | Chain icon 20 in Account button | parity-chain-icon-visible |
| G-08 | `0x0000…dEaD` in Account button | parity-wallet-pill-shows-truncated-address |
| G-09 | `24.69 xDAI` in Account button | parity-account-button-shows-balance |
| G-10 | Help 40×40 (starts tour) | parity-header-help-icon-visible |
| G-11 | Theme toggle, labels switch | parity-theme-toggle-switches-label |
| G-12 | Dark default (tonal surfaces) | parity-dark-theme-applies-globally |
| G-13 | View-transition theme swap; DOM text unchanged | parity-theme-toggle-preserves-content |
| G-14 | `Connect` 112×40 when disconnected | parity-disconnected-header-shows-connect |
| G-15 | HoverMenus overlay; main subtree hash unchanged | parity-menu-overlay-keeps-page-visible |
| G-16 | Not a UI surface; console allowlist `rpc.walletconnect.org/v1/profile/reverse/` | parity-console-walletconnect-reverse-profile-404-not-seer-resource |

**Menus**

| ID | New location | e2e test |
|---|---|---|
| M-01 | Policies HoverMenu | parity-policies-menu-opens |
| M-02 | `Verified Market Policy` → plate | parity-policies-verified-market-policy-item-visible |
| M-03 | `Market Rules Policy` → plate | parity-policies-market-rules-policy-item-visible |
| M-04 | App HoverMenu | parity-app-menu-opens |
| M-05 | `Futarchy` ↗ futarchy.seer.pm | parity-app-menu-futarchy-item-visible |
| M-06 | `Deepfunding` ↗ deep.seer.pm | parity-app-menu-deepfunding-item-visible |
| M-07 | `Foresight` ↗ foresight.kleros.io | parity-app-menu-foresight-item-visible |
| M-08 | `Opportunity Markets` ↗ opportunity.seer.pm | parity-app-menu-opportunity-markets-item-visible |
| M-09 | Account button opens Account menu | parity-account-menu-opens |
| M-10 | `Account` → plate | parity-account-menu-account-item |
| M-11 | `Deposit` → plate | parity-account-menu-deposit-item |
| M-12 | `Portfolio` → plate | parity-account-menu-portfolio-item |
| M-13 | `Market Collections` → `#/collections/default` | parity-account-menu-market-collections-item |
| M-14 | `Trade Collateral` → plate | parity-account-menu-trade-collateral-item |
| M-15 | `Use smart account` switch | parity-account-menu-use-smart-account-toggle |
| M-16 | 5 items + switch together | parity-account-menu-item-count |

**Home**

| ID | New location | e2e test |
|---|---|---|
| H-01 | Card grid 5@1440/6@1920/2@390 (user decision; replaces 4-col) | parity-index-card-grid-four-columns → asserts the new counts (renamed `parity-index-card-grid-columns`) |
| H-02 | Infinite scroll sentinel → next page (A-08) | parity-index-infinite-scroll-loads-more |
| H-03 | Superseded: sort in rail + tags (no table, by user choice) | parity-index-has-no-table-view → asserts sort reachable in ≤ 2 actions |
| H-04 | Whole card (incl. title) → market page | parity-index-card-title-opens-market-page |
| H-05 | Question 2-line clamp + tooltip | parity-index-card-question-text-renders |
| H-06 | Avatar 32 | parity-index-card-avatar-renders |
| H-07 | Donut removed → outcome tiles/rows (DIRECTION §4) | parity-index-card-donut-chart-renders → asserts outcome block present and no ring |
| H-08 | Exact % per top outcome | parity-index-card-legend-outcome-percentages |
| H-09 | SEER logo moves to the market-page meta row | parity-index-card-seer-logo → asserts on the page meta |
| H-10 | Liquidity `$` + K → drawer row 2 | parity-index-card-liquidity-figure-format |
| H-11 | Verification mark at rest; status in drawer row 1 | parity-index-card-status-and-verification-icons |
| H-12 | Drawer `Liquidity ›` (`aria-label` "Open interest and liquidity breakdown") | parity-index-card-hover-breakdown-tooltip-opens |
| H-13 | Drawer Open interest `$7.26K` + `5.75K sDAI` in tooltip (A-09) | parity-index-card-tooltip-open-interest-dual-unit |
| H-14 | Pool sub-panel header `Volume … traded, notional …` | parity-index-card-tooltip-volume-and-notional |
| H-15 | Pool sub-panel rows `4.94K YASHAR / 12.1K sDAI` | parity-index-card-tooltip-per-outcome-pool-liquidity |
| H-16 | Drawer Chain `Gnosis ↗` | parity-index-card-gnosisscan-link-href |
| H-17 | Drawer Kleros row ↗ | parity-index-card-kleros-curation-link-href |
| H-18 | Search pill placeholder | parity-index-search-input-placeholder |
| H-19 | `?marketName=` | parity-index-search-writes-marketname-query |
| H-20 | Disconnected header + grid | parity-index-search-state-shows-connect-with-feed |
| H-21 | Rail strip / Filters button (sheet) | parity-index-filters-button-opens-panel |
| H-22 | Rail Market States | parity-index-filter-group-market-states |
| H-23 | Rail Verification Status | parity-index-filter-group-verification-status |
| H-24 | Rail Chain | parity-index-filter-group-chain |
| H-25 | Rail Sort By | parity-index-filter-group-sort-by |
| H-26 | Desc/Asc segmented | parity-index-filter-sort-direction-switch |
| H-27 | `Show only conditional markets` switch | parity-index-filter-conditional-market-toggle |
| H-28 | Minimum Liquidity input | parity-index-filter-minimum-liquidity-input |
| H-29 | `Show only markets with rewards` | parity-index-filter-rewards-toggle |
| H-30 | `Show only futarchy markets` | parity-index-filter-futarchy-toggle |
| H-31 | `Cancel` | parity-index-filters-cancel-button |
| H-32 | `Apply` | parity-index-filters-apply-button |
| H-33 | Header tier 2 `Create New Market` | parity-index-create-new-market-links-create |
| H-34 | Header tier 2 `My collections` | parity-index-my-collections-links-collections |

**Leaderboard**

| ID | New location | e2e test |
|---|---|---|
| L-01 | H1 | parity-leaderboard-heading-visible |
| L-02 | ⓘ popover with full prose | parity-leaderboard-trader-score-explanation-copy |
| L-03 | `How it works ↗` | parity-leaderboard-how-it-works-link |
| L-04 | Period `1D` | parity-leaderboard-period-1d |
| L-05 | `1W` | parity-leaderboard-period-1w |
| L-06 | `1M` | parity-leaderboard-period-1m |
| L-07 | `ALL` | parity-leaderboard-period-all |
| L-08 | App/Chain menus (mobile `Filters` sheet) | parity-leaderboard-filters-button-opens-panel |
| L-09 | App menu items | parity-leaderboard-filter-group-app |
| L-10 | Chain menu items | parity-leaderboard-filter-group-chain |
| L-11 | `Your Rank` | parity-leaderboard-your-rank-control |
| L-12 | Search input | parity-leaderboard-search-input-placeholder |
| L-13 | `Search` button | parity-leaderboard-search-button-visible |
| L-14 | `#` | parity-leaderboard-column-rank |
| L-15 | `Account` ENS / pseudonym | parity-leaderboard-column-account-name-formats |
| L-16 | Score + tier pill 76 | parity-leaderboard-column-score-value-and-band |
| L-17 | `N/A` + header ⓘ | parity-leaderboard-column-score-na-and-help-icon |
| L-18 | Profit/Loss USD 2 dp | parity-leaderboard-column-profit-loss-usd |
| L-19 | Volume USD 2 dp | parity-leaderboard-column-volume-usd |
| L-20 | ROI signed | parity-leaderboard-column-roi-signed-percent |
| L-21 | Traded Markets | parity-leaderboard-column-traded-markets |
| L-22 | Sort Score | parity-leaderboard-sort-by-score |
| L-23 | Sort Profit/Loss | parity-leaderboard-sort-by-profit-loss |
| L-24 | Sort Volume | parity-leaderboard-sort-by-volume |
| L-25 | Sort ROI | parity-leaderboard-sort-by-roi |
| L-26 | `Previous` | parity-leaderboard-pagination-previous |
| L-27 | `Next` | parity-leaderboard-pagination-next |
| L-28 ‡ | Sort descriptor | parity-leaderboard-sort-descriptor-visible |
| L-29 ‡ | `Updating…` | parity-leaderboard-updating-text-on-period-change |
| L-30 ‡ | `Finding your rank…` | parity-leaderboard-finding-your-rank-progress |
| L-31 ‡ | `Page 1 of N` | parity-leaderboard-page-counter |
| L-32 ‡ | `Updated <date>` (`updatedAt`) | parity-leaderboard-updated-timestamp |
| L-33 ‡ | 25 rows | parity-leaderboard-rows-per-page |
| L-34 ‡ | `#`/Account/Traded Markets also sortable (optional) | parity-leaderboard-optional-sortable-rank-account-traded |
| L-35 | Rows when disconnected | parity-leaderboard-disconnected-still-shows-rows |
| L-36 ‡ | `Your Rank` hidden when disconnected | parity-leaderboard-your-rank-hidden-when-disconnected |
| D-L-36 ‡ | Score N/A tooltip from `scoreUnavailable` | parity-leaderboard-score-na-explanation-available |
| D-L-37 ‡ | ROI N/A tooltip `under $0.01 of capital` | parity-leaderboard-roi-na-explanation-available |
| D-L-40 ‡ | Search with no match → `No accounts found` + `Clear search` | parity-leaderboard-search-preserves-table-in-capture |
| D-L-41 ‡ | `leaderboard.ts` request params | parity-leaderboard-api-request-params |
| D-L-42 ‡ | response meta | parity-leaderboard-api-response-meta |
| D-L-43 ‡ | row fields | parity-leaderboard-api-row-fields |

**Create / Collections**

| ID | New location | e2e test |
|---|---|---|
| C-01 | Step dots `1 of 2` | parity-create-step-indicator-shows-step-one-of-two |
| C-02 | Type radio rows, none selected | parity-create-type-select-empty-default |
| C-03 | `Next` disabled + tooltip | parity-create-next-disabled-until-type-chosen |
| C-04 | Connect plate | parity-create-requires-connected-wallet |
| C-05 | `SECURED BY KLEROS` footer | parity-create-kleros-footer-visible |
| C-06 | Step-2 plate + `Open in Seer app ↗` | parity-create-steps-two-plus-not-yet-testable |
| CM-01 ‡ | Create page start | parity-create-market-start-screen-visible |
| CM-02 ‡ | `Categorical` row | parity-create-market-type-categorical-selectable |
| CM-03 ‡ | `Scalar` row | parity-create-market-type-scalar-selectable |
| CM-04 ‡ | `Multi Categorical` row | parity-create-market-type-multi-categorical-selectable |
| CM-05 ‡ | `Multi Scalar` row | parity-create-market-type-multi-scalar-selectable |
| CM-06 ‡ | `Next` | parity-create-market-next-control-visible |
| CM-07 ‡ | Policies overlay on create | parity-create-market-policies-overlay-preserves-page |
| CM-08 ‡ | App overlay on create | parity-create-market-app-overlay-preserves-page |
| CM-09 ‡ | Account overlay on create | parity-create-market-wallet-overlay-preserves-page |
| CM-10 ‡ | Theme toggle on create | parity-create-market-theme-toggle-visible |
| CL-01 | Gate copy + `Sign in` | parity-collections-requires-sign-in |
| CL-02 | `No markets in this collection.` | parity-collections-empty-state |
| CL-03 | Starred grid (local, A-15) | parity-collections-signed-in-not-yet-testable |
| COL-01 ‡ | Title `Default` | parity-collections-default-route-visible |
| COL-02 ‡ | Gate copy | parity-collections-sign-in-gate-copy |
| COL-03 ‡ | Empty message | parity-collections-empty-state-visible |
| COL-04 ‡ | `My collections` reaches route | parity-collections-my-collections-route |
| COL-05 ‡ | Policies overlay | parity-collections-policies-overlay-preserves-page |
| COL-06 ‡ | App overlay | parity-collections-app-overlay-preserves-page |
| COL-07 ‡ | Account overlay | parity-collections-wallet-overlay-preserves-page |
| COL-08 ‡ | Theme toggle | parity-collections-theme-toggle-visible |

**Market page: shell / meta**

| ID | New location | e2e test |
|---|---|---|
| P-01 | `#/markets/:chainId/:slug` | parity-market-page-route-loads |
| P-02 | Back + `Home / Market` | parity-market-page-breadcrumb |
| P-03 | 4 px status top border + pill 132 | parity-market-page-status-strip-renders |
| P-04 | `Reports open` (amber dot) | parity-market-page-status-reports-open |
| P-05 | `Trading Open` (green) | parity-market-page-status-trading-open |
| P-06 | `Pending execution` | parity-market-page-status-pending-execution |
| P-07 | Verification mark top-right | parity-market-page-verification-icon |
| P-08 | Star 36 | parity-market-page-favourite-star-toggle |
| P-09 | Avatar 56 + H1 | parity-market-page-question-headline |
| P-10 | Placeholders literal | parity-market-page-title-placeholder-preserved |
| P-11 | SEER mark in meta | parity-market-meta-seer-logo |
| P-12 | Type label | parity-market-meta-type-label |
| P-13 | Liquidity value | parity-market-meta-liquidity-value |
| P-14 | Liquidity ⓘ copy + chart caption | parity-market-meta-liquidity-help-tooltip-copy |
| P-15 | Volume | parity-market-meta-volume-value |
| P-16 | P&L | parity-market-meta-pnl-value |
| P-17 | `Verified` / `Verify it` | parity-market-meta-verified-badge |
| P-18 | Scalar `Market Estimate` | parity-market-scalar-estimate-headline |
| P-19 | `Resolution opening at …` | parity-market-resolution-datetime-copy |
| P-20 | Multi-scalar question rows | parity-market-multiscalar-question-list |
| P-21 | `Hide questions` | parity-market-multiscalar-hide-questions-toggle |
| P-22 | `Answer on Reality.eth!` | parity-market-answer-on-reality-eth-link |
| P-23 | Major Events card | parity-market-major-events-panel |
| P-24 ‡ | Conditional banner title | parity-market-conditional-badge |
| P-25 ‡ | Conditional banner copy (verbatim) | parity-market-conditional-explanation-copy |
| P-26 ‡ | `Switch to Gnosis` / `Switch to Ethereum` CTA | parity-market-switch-to-gnosis-control |

**Report Answer**

| ID | New location | e2e test |
|---|---|---|
| RA-01 | Dialog opens | parity-report-answer-dialog-opens |
| RA-02 | `Current answer: Not answered yet` | parity-report-answer-current-answer-row |
| RA-03 | `Choose an answer` radio + select | parity-report-answer-choose-answer-radio |
| RA-04 | `Mark this question invalid` | parity-report-answer-mark-invalid-option |
| RA-05 | Bond `10 XDAI` in copy | parity-report-answer-bond-display |
| RA-06 | `Return` | parity-report-answer-return-button |
| RA-07 | `Answer` (gate → reject) | parity-report-answer-submit-button |

**Chart**

| ID | New location | e2e test |
|---|---|---|
| CH-01 | Range segmented | parity-chart-range-buttons-present |
| CH-02 | Help ⓘ | parity-chart-help-icon |
| CH-03 | Custom popover | parity-chart-custom-opens-calendar-popover |
| CH-04 | Presets | parity-chart-custom-presets |
| CH-05 | Cancel/Save | parity-chart-custom-cancel-save |
| CH-06 | Export CSV | parity-chart-export-icon |
| CH-07 | Gutter end labels carry the latest % | parity-chart-legend-latest-percentages |
| CH-08 | ‹ › | parity-chart-prev-next-arrows |
| CH-09 | Step-line canvas | parity-chart-step-line-renders |
| CH-10 | **Fixed:** 0–100 default; zoom opt-in | parity-chart-y-axis-range-behaviour (asserts the fix) |
| CH-11 | Gutter labels `Yes 84.2` | parity-chart-end-label-pills |
| CH-12 | **Fixed:** no label/tick overlap | parity-chart-end-label-pill-tick-collision (inverted) |
| CH-13 | Crosshair tooltip | parity-chart-crosshair-hover-tooltip |
| CH-14 | **Fixed:** d3 time ticks, year at boundary | parity-chart-x-axis-irregular-labels (inverted) |
| CH-15 | **Fixed:** no origin glyph | parity-chart-origin-black-square-artifact (inverted) |
| CH-16 | Caption `Pool price, not trades` | parity-chart-plots-pool-price-not-trades |

**Outcomes / pools / liquidity**

| ID | New location | e2e test |
|---|---|---|
| O-01 | OutcomeRow radio `#1 Yes 84.2%` | parity-outcome-row-label-percent-radio |
| O-02 | Invalid row `0%` + token cell (A-12) | parity-outcome-invalid-token-value-and-zero-percent |
| O-03 | Select → ticket outcome | parity-outcome-select-updates-ticket |
| O-04 | Action strip `Add Liquidity` | parity-outcome-add-liquidity-link |
| O-05 | `View pool details` | parity-outcome-view-pool-details-link |
| O-06 | `New conditional market` → create `?parent=` | parity-outcome-new-conditional-market-link |
| I-01 | Inline pool details | parity-pool-details-panel-opens |
| I-02 | `Pool Id:` mono + copy + ↗ | parity-pool-details-pool-id-truncated-address |
| I-03 | Liquidity Chart canvas 160 | parity-pool-details-liquidity-chart |
| I-04 | Ladder SHARES/TOTAL | parity-pool-details-balances-table-ladder |
| I-05 | Add Liquidity dialog | parity-add-liquidity-dialog-opens |
| I-06 | Farming copy | parity-add-liquidity-farming-rewards-copy |
| I-07 | `Swapr ~ 3.00K SEER / day` (when present) | parity-add-liquidity-available-pools-swapr-rate |
| I-08 | `Rewards end:` / `Rewards ended on:` | parity-add-liquidity-rewards-end-date |
| I-09 | `Add liquidity ↗` Swapr | parity-add-liquidity-external-link |
| I-10 | `Learn more about the farming program ↗` | parity-add-liquidity-learn-more-link |
| I-11 | `Return` | parity-add-liquidity-return-button |
| I-12 | Variants active/ended | parity-add-liquidity-dialog-variants-render |
| I-13 | Tx UI unobserved → external link is the action | parity-add-liquidity-transaction-not-yet-testable |

**Ticket**

| ID | New location | e2e test |
|---|---|---|
| T-01 | Ticket header outcome | parity-ticket-header-selected-outcome |
| T-02 | `Market` order-type menu | parity-ticket-order-type-dropdown-market |
| T-03 | `You pay` input | parity-ticket-you-pay-input |
| T-04 | Token select `sDAI` | parity-ticket-pay-token-select-sdai |
| T-05 | `Balance: 0 sDAI` | parity-ticket-pay-balance-display |
| T-06 | `Max` | parity-ticket-max-button |
| T-07 | Direction arrow | parity-ticket-direction-arrow |
| T-08 | `1.1868` + exact `1.1868081659397476` on demand | parity-ticket-you-will-get-unrounded-value (asserts both) |
| T-09 | Receive outcome select | parity-ticket-receive-outcome-selector |
| T-10 | Bridge link | parity-ticket-bridge-tokens-link |
| T-11 | `Avg price` | parity-ticket-avg-price-field |
| T-12 | `Price after buy` | parity-ticket-price-after-buy-field |
| T-13 | `Potential return` + skeleton | parity-ticket-potential-return-skeleton |
| T-14 | `Max slippage 1%` + ⚙ popover | parity-ticket-max-slippage-control |
| T-15 | `Enter an amount` | parity-ticket-cta-enter-an-amount |
| T-16 | `Not enough balance.` disabled | parity-ticket-cta-not-enough-balance-disabled |
| T-17 | `Trade`/`Approve` → mock reject | parity-ticket-cta-trade-approve-not-yet-testable |
| T-18 | `More` disclosure | parity-ticket-more-accordion-toggle |

**Draft MD (market detail)** ‡

| ID | New location | e2e test |
|---|---|---|
| MD-01 | = P-01 | parity-market-detail-route-loads |
| MD-02 | = P-02 | parity-market-detail-breadcrumb-visible |
| MD-03 | = P-09/P-10 | parity-market-title-placeholders-preserved |
| MD-04 | = P-04 | parity-market-status-reports-open-visible |
| MD-05 | = P-06 | parity-market-status-pending-execution-visible |
| MD-06 | = P-12 | parity-market-type-categorical-visible |
| MD-07 | = P-12 (Multi Scalar) | parity-market-type-multi-scalar-visible |
| MD-08 | = P-24 | parity-market-conditional-badge-visible |
| MD-09 | = P-17 | parity-market-verified-badge-visible |
| MD-10 | = P-13 | parity-market-liquidity-metric-renders |
| MD-11 | = P-15 | parity-market-volume-metric-renders |
| MD-12 | = P-16 | parity-market-pnl-metric-renders |
| MD-13 | = RA-01 | parity-market-reality-answer-control-opens-report-modal |
| MD-14 | Multi-scalar `Deadline:` | parity-market-deadline-label-visible |
| MD-15 | = P-21 | parity-market-hide-questions-control-visible |
| MD-16 | `Answer: Answered too soon` | parity-market-question-rows-show-answered-too-soon |
| MD-17 | `Reopen question ↗` | parity-market-reopen-question-control-visible |
| MD-18 | = P-25 | parity-market-conditional-explanation-copy-visible |
| MD-19 | Connected/disconnected ticket + comments | parity-market-wallet-state-renders |
| MD-20 | = P-26 | parity-market-switch-to-gnosis-control |
| MD-21 | Policies overlay on page | parity-market-policies-overlay-preserves-page |
| MD-22 | App overlay | parity-market-app-overlay-preserves-page |
| MD-23 | Account overlay | parity-market-wallet-overlay-preserves-page |
| MD-24 | Theme toggle | parity-market-theme-toggle-visible |
| MD-25 | = O-01 | parity-market-outcome-row-label-percent |
| MD-26 | = O-02 | parity-market-outcome-token-display |
| MD-27 | Multi-scalar `~182 seats` | parity-market-multi-scalar-renders-approx-seats |
| MD-28 | = O-04/I-05 | parity-market-outcome-add-liquidity-opens-modal |
| MD-29 | = I-01 | parity-market-outcome-view-pool-details-expands |
| MD-30 | `Hide pool details` | parity-market-outcome-hide-pool-details-collapses |
| MD-31 | = O-06 | parity-market-outcome-new-conditional-market-control |
| MD-32 | = CH-01 | parity-market-chart-time-controls-visible |
| MD-33 | = CH-13 | parity-market-chart-hover-shows-timestamp |
| MD-34 | Presets + `Previous Month`/`Next Month` | parity-market-custom-range-picker-presets |
| MD-35 | Month label + `Su…Sa` grid | parity-market-custom-range-picker-calendar-grid |
| MD-36 | Cancel/Save | parity-market-custom-range-picker-cancel-save-visible |
| MD-37 | Meta `Open interest` ⓘ breakdown | parity-market-open-interest-breakdown-control |
| MD-38 | OI `7.22K LEPEN_NRYES ($7.68K)` | parity-market-breakdown-open-interest-value |
| MD-39 | `… traded, notional …` | parity-market-breakdown-volume-traded-notional |
| MD-40 | Per-outcome pool liquidity | parity-market-breakdown-per-outcome-liquidity |
| MD-41 | = CH-09 | parity-market-outcome-chart-canvas-renders |
| MD-42 | = T-01 | parity-market-trade-selected-outcome-label |
| MD-43 | Pay token label (`sDAI`/`LEPEN_NRYES`) | parity-market-trade-you-pay-token-label-renders |
| MD-44 | Default `0` | parity-market-trade-default-pay-amount-zero |
| MD-45 | = T-06 | parity-market-trade-max-button-visible |
| MD-46 | `You will get` outcome | parity-market-trade-you-will-get-outcome-renders |
| MD-47 | = T-11 | parity-market-trade-avg-price-renders |
| MD-48 | `0.00 sDAI (0.00%)` | parity-market-trade-potential-return-renders |
| MD-49 | `Calculate your potential return` | parity-market-trade-calculate-potential-return |
| MD-50 | = T-14 | parity-market-trade-max-slippage-visible |
| MD-51 | `Enter an amount` + `Amount` | parity-market-trade-amount-input-and-prompt-visible |
| MD-52 | = T-18 | parity-market-trade-more-control-visible |
| MD-53 | `Mint` tab | parity-market-trade-mint-tab-visible |
| MD-54 | `Merge` tab | parity-market-trade-merge-tab-visible |
| MD-55 | `Redeem` tab | parity-market-trade-redeem-tab-visible |
| MD-56 | `Balance:` | parity-market-trade-balance-renders |
| MD-57 | `sDAI`/`xDAI` select | parity-market-trade-collateral-choices-visible |
| MD-58 | Action button | parity-market-trade-mint-action-button-visible |
| MD-59 | `1 UPCOMING` | parity-market-major-events-upcoming-count-visible |
| MD-60 | Event row strings | parity-market-reality-resolution-event-visible |

**Tabs** ‡

| ID | New location | e2e test |
|---|---|---|
| TAB-01 | `Comments` | parity-market-comments-tab-visible |
| TAB-02 | Gate copy | parity-market-comments-gate-copy |
| TAB-03 | `Connect to comment` | parity-market-connect-to-comment-button-visible |
| TAB-04 | Empty state | parity-market-comments-empty-state |
| TAB-05 | `Signing in...` → `User rejected the request.` | parity-market-comment-signing-error |
| TAB-06 | `Related Conditional Markets` | parity-market-related-conditional-markets-tab-visible |
| TAB-07 | Count `(2)` | parity-market-related-markets-count-renders |
| TAB-08 | `Search by outcome:` | parity-market-related-markets-search-control-visible |
| TAB-09 | `Conditional on … being "Yes"/"No"` | parity-market-related-markets-conditional-copy |
| TAB-10 | Child status + Answer link | parity-market-related-markets-status-and-answer |
| TAB-11 | `Top Holders` | parity-market-top-holders-tab-visible |
| TAB-12 | Yes table | parity-market-top-holders-yes-table-renders |
| TAB-13 | No table | parity-market-top-holders-no-table-renders |
| TAB-14 | Invalid table | parity-market-top-holders-invalid-table-renders |
| TAB-15 | `K`, decimals, `<0.001` | parity-market-holder-balance-formatting |
| TAB-16 | `Activity` + `My activity` | parity-market-activity-tab-and-my-activity-visible |
| TAB-17 | Row format | parity-market-activity-row-format |
| TAB-18 | `Bought`/`Sold`/`Split` | parity-market-activity-actions-bought-sold-split-visible |
| TAB-19 | Amount formats | parity-market-activity-amount-formats |

**Modals** ‡

| ID | New location | e2e test |
|---|---|---|
| MOD-01 | = RA-01 | parity-report-answer-modal-opens |
| MOD-02 | Verbatim copy | parity-report-answer-copy-bond |
| MOD-03 | = RA-02 | parity-report-answer-current-answer-visible |
| MOD-04 | = RA-03 | parity-report-answer-choose-answer-control-visible |
| MOD-05 | = RA-04 | parity-report-answer-mark-invalid-control-visible |
| MOD-06 | = RA-06 | parity-report-answer-return-control-visible |
| MOD-07 | = RA-07 | parity-report-answer-action-control-visible |
| MOD-08 | = I-05 | parity-add-liquidity-modal-opens |
| MOD-09 | = I-06 | parity-add-liquidity-farming-copy |
| MOD-10 | `Available Pools:` | parity-add-liquidity-available-pools-visible |
| MOD-11 | `Rewards ended on: …` | parity-add-liquidity-rewards-ended-text |
| MOD-12 | = I-09 | parity-add-liquidity-action-control-visible |
| MOD-13 | = I-10 | parity-add-liquidity-learn-more-link-visible |
| MOD-14 | = I-11 | parity-add-liquidity-return-control-visible |
| MOD-15 | = I-01 | parity-pool-details-expansion-visible |
| MOD-16 | `Liquidity Chart` | parity-pool-details-liquidity-chart-label-visible |
| MOD-17 | = I-02 | parity-pool-details-pool-id-visible |
| MOD-18 | `Pool Balances:` | parity-pool-details-pool-balances-visible |
| MOD-19 | `SHARES`/`TOTAL` | parity-pool-details-shares-total-series-visible |
| MOD-20 | `Last: 0.7454` | parity-pool-details-last-value-visible |

**Data contracts** ‡

| ID | New location | e2e test |
|---|---|---|
| DATA-01 | `leaderboard.ts` params | parity-data-get-pnl-leaderboard-params |
| DATA-02 | response meta | parity-data-leaderboard-response-metadata-contract |
| DATA-03 | row fields | parity-data-leaderboard-row-contract |
| DATA-04 | `get-market` fields (`markets.ts`) | parity-data-get-market-fields-contract |
| DATA-05 | `markets-search` fields | parity-data-markets-search-fields-contract |
| DATA-06 | `history.ts` chart/pool fields | parity-data-markets-charts-pool-fields |
| DATA-07 | Subgraph pool fields (ladder) | parity-data-subgraph-pools-fields |
| DATA-08 | Reverse lookup → truncated address | parity-data-wallet-reverse-lookup-fallback |
| DATA-09 | Connect dialog wallet list (mock) | parity-data-wallet-list-contract |

**New design rows (DIRECTION; no live counterpart)**

| ID | Location | Test |
|---|---|---|
| N-01 | Slim hero | hero-rotates-6s-swap-300ms |
| N-02 | Collapsed rail | rail-collapsed-56-expands-on-hover-overlay |
| N-03 | Active tags | tags-remove-applies-immediately-url |
| N-04 | Hover drawer | drawer-overlays-no-grid-reflow |
| N-05 | Quick-buy | quickbuy-live-you-pay-you-get-pays |
| N-06 | Whole-card click | card-whole-click-navigates |
| N-07 | Verification marks (4) | card-verification-marks-shapes-tooltips |
| N-08 | Mobile FAB + sheet tabs | flow-07-mobile-search-trade-sheet |
| N-09 | Tour | quality-05-tour-lifecycle |

### 9.11 Library justification

| Library | Decision | License / size | Why / evidence | Fallback |
|---|---|---|---|---|
| React 19 + Vite + TS strict | default | MIT | already scaffolded | — |
| `motion` | default | MIT ~18 KB gz used | FLIP on filter apply, sheet drag, tab underline `layoutId` | CSS transitions |
| d3-scale / d3-shape / d3-array / d3-time | default | ISC, tree-shaken ~12 KB | linear/time scales, `curveStepAfter`, ticks, bisect for the crosshair | — |
| Hand-written canvas chart | **adopt** | 0 KB | ≤80 series × ≤2k points; needs the shared label engine + gutter + `__labels`; spike: 2,000 rows at 60 fps (innovation §5) | SVG step path |
| uPlot | **reject** | MIT ~50 KB | its own legend/axes fight the gutter label engine and honest-axis rules; our series counts are small | — |
| Windowing | **`content-visibility: auto` + `contain-intrinsic-size: auto 184px` per card; pages of 100 via IntersectionObserver** | 0 KB | keeps real DOM for dead-control enumeration, Ctrl+F and a11y; 100 cards in sample | If `perf-scroll-600-cards-55fps` fails (live, 600 cards), adopt `@tanstack/react-virtual` row windowing (MIT ~3 KB gz; rows = N cards; drawer overlays across rows with z-index) |
| Leaderboard / activity / holders | no virtualization | — | 25 rows/page; ≤ 50 holder rows | — |
| Icons | inline SVG components (`Icons.tsx`) | 0 | no icon packs | — |
| Fonts | `@fontsource-variable/inter-tight`, `@fontsource/jetbrains-mono` | OFL | already in deps | system-ui |

Extra JS beyond the default stack: 0 KB (≤150 KB budget).

### 9.12 EF DEPARTURES

| # | Departure | EF / rule baseline | Reason |
|---|---|---|---|
| D1 | Card grid as the main composition | NEXT_GEN §2 forbids equal-tile grids | Explicit user decision (DIRECTION §1) with trader-dense content per card |
| D2 | Card padding 12, radius 12 (compact padding 10) | cards padding 20, radius 16 | 5 columns @1440 (242 px) need the width for a 2-line question and two 105 px tiles |
| D3 | Compact-card numeral 20/600 (per-card sizes 12/15/20) | 12/15/28 | 154–169 px columns can't fit `84.2%` at 28 |
| D4 | Status colours green/amber/grey (live: purple/cyan/teal) | — | Status must read open / resolving / done; assigned by product-identity-guide §2 for Explorer |
| D5 | Durations 120 (intent), 180 (drawer), 300 (hero), 280 (FLIP/reel) | 90/140/420 | DIRECTION §4 sets drawer 180 and hero 300; 120 ms intent avoids drawer flicker in a dense grid |
| D6 | Two-tier header (56 + 48); tonal, not purple | EF single header row | DIRECTION keeps nav + search + Create New Market + My collections + wallet in the header; one row would squeeze search to ~160 px at 1440 |
| D7 | Amber-soft and violet-soft banner surfaces | tonal only | Warnings must not use violet (action); conditional info is not a warning |
| D8 | Series teal + blue (+ grey rest) | violet + 2 families | Top-3 outcomes must be distinguishable on 80-outcome charts |
| D9 | JetBrains Mono 12 for ids and the exact share string | allowed by identity guide | Hash and decimal legibility |
| D10 | Drawer and quick-buy overlap neighbouring cards (`data-overlay`) | overlap law | Required so the grid never jumps (DIRECTION §1) |

### 9.13 Acceptance checklist
- [ ] All §9.10 IDs green at 1440 and 390 (‡ rows confirmed on screenshots first).
- [ ] Dead-control: 0 silent controls on all routes at both widths.
- [ ] Flows 01–09 green with the §9.8 step counts.
- [ ] Fixed sizes verified: card 184/218, drawer 256, quick-buy 296×268, hero 72/88, rail 56/320, toolbar 40, status pill 132, tier pill 76.
- [ ] Columns 5@1440, 6@1920, 2@390; ≥ 12 markets above the fold @1440×900.
- [ ] No overflow 320–2560; container alignment; mobile height < 4600.
- [ ] Light and dark contrast as in §2 (script); reduced motion verified.
- [ ] Real viewport captures (1440, 1920, 390): grid, hover drawer, quick-buy, conditional page, 80-outcome page, unverified page, leaderboard, create, collections, menus.
- [ ] Opus review: slop ≤ 4, distinct from live ≥ 6, distinct from SaaS ≥ 6.5.
- [ ] `npm run build -w apps/explorer` and `npx tsc --noEmit -p apps/explorer` pass.
- [ ] Nothing committed.

### 9.14 Codex pass plan (ready to paste; 6 passes, each ≤ 25 min)

**Common preamble (paste at the top of every pass):**
```
You are building apps/explorer (Seer Explorer redesign). Read, in order:
products/explorer/DIRECTION.md, products/explorer/design.md (this spec; follow it literally),
docs/ui-quality-rules.md, docs/coding-rules.md. Copy proven pieces from apps/futarchy/src/components
(HoverMenu, Tooltip, RollingNumber, Segmented, CommandPalette, GuidedTour, ThemeToggle, Avatar) and adapt
styling; do not import across apps. Stack: React 19 + TS strict + plain CSS + tokens (@seer/ef) + motion +
d3-scale/shape/array/time. No new deps. Components < 150 lines; pure math in src/math with formula comments.
Use ONLY strings from design.md §8 allowed list or data labels/units. Real data only (src/data/*.json and
src/data/fixtures/*.json). Do not edit other apps or packages/ef/tokens.css. Do not commit.
You cannot run e2e (no ports). End with the tail of: npm run build -w apps/explorer && npx tsc --noEmit -p apps/explorer
If e2e_last.txt exists at repo root, read it first and fix only the failures listed.
```

**Pass 1: scaffold, tokens, data adapters (≤25 min)**
```
Files: src/main.tsx, src/App.tsx, src/router.ts (hash routes §9.1), src/styles/{product.css,base.css,layout.css},
src/data/{types.ts,clock.ts,format.ts,links.ts,markets.ts,status.ts,quote.ts,history.ts,leaderboard.ts,
holders.ts,activity.ts,events.ts,comments.ts,pnl.ts,wallet.ts,filters.ts,trending.ts,fixtures.ts},
src/math/{scalar.ts,payout.ts}, src/test/hooks.ts (window.__explorerTest per §7, guarded),
scripts/capture-fixtures.mjs (list in §9.6; Claude runs it, you only write it),
src/components/{Header.tsx,BetaStrip.tsx,Footer.tsx (Sample data chip),Plate.tsx}, route stubs for every route.
Do: tokens table §2 as CSS vars (dark default + [data-theme=light]); .page container; header tiers §4.2 (menus as
placeholders wired in pass 5); every adapter field/rule in §9.2/§9.3/§9.4 with formula comments; URL<->filter state.
Acceptance: build+tsc pass; window.__explorerTest.data exposes counts:
templateId types 74/1/14/11, verified 88, conditional 17, rewards 1, Le Pen status 'Reports open',
bbf8 collateralSymbol 'LEPEN_NRYES', format(27743.57)='$27.7K', quote(LePen,Yes,1).exact='1.1868081659397476'.
```

**Pass 2: home grid, card, drawer, quick-buy (≤25 min)**
```
Files: src/home/{HomePage.tsx,MarketGrid.tsx,MarketCard.tsx,CardOutcomes.tsx,CardMarks.tsx,CardDrawer.tsx,
DrawerPools.tsx,QuickBuy.tsx,useDrawer.ts,useQuickBuy.ts}, src/components/{Popover.tsx,Sheet.tsx,RollingNumber.tsx,
Tooltip.tsx,Icons.tsx}, src/home/home.css.
Do exactly §4.6–4.9 and §5 grid: fixed heights 184/218, explicit column media queries, whole-card stretched link with
stopPropagation on inner controls, 4 verification marks, conditional second line, multi top-2 + "+N more",
scalar/multi-scalar layouts, drawer 256 overlay with flip + per-pool sub-panel + real links (links.ts),
quick-buy 296x268 with single amount input and the CTA state machine (mock wallet reject), compact variant + sheets,
content-visibility on cards, infinite pages via IntersectionObserver, #/__test/marks harness (test only).
Acceptance: build+tsc; Claude runs `npm run e2e -w apps/explorer -- --suite=card` → all card-*, drawer-*, quickbuy-* green.
```

**Pass 3: filter rail, search, hero, tags (≤25 min)**
```
Files: src/home/{FilterRail.tsx,FilterPanel.tsx,FilterGroup.tsx,Switch.tsx,ActiveTags.tsx,Toolbar.tsx,Hero.tsx},
src/components/{CommandPalette.tsx,SearchPill.tsx,Segmented.tsx}, src/home/rail.css, src/home/hero.css.
Do §4.3–4.5 + §4.15 palette: collapsed 56 strip + 320 overlay panel (hover intent 120, leave 220, click pins, F key),
all groups/options verbatim, staged Cancel/Apply writing URL, mobile Filters sheet, tags (remove = immediate, +N, Clear
filters), search pill writing ?marketName= (debounce 250), palette on / and Cmd/Ctrl+K, hero 72/88 rotating top-5
volume (6000 dwell, 300 swap, pause hover/focus/quick-buy, dots, reduced motion = no autorotate), FLIP on apply.
Acceptance: build+tsc; e2e suites hero-*, rail-*, tags-*, parity H-18..H-32, flow-09 steps 1–2 green.
```

**Pass 4: market page, chart, ticket, dialogs, tabs (≤25 min; split 4a/4b if the build tail shows timeouts)**
```
Files: src/market/{MarketPage.tsx,Breadcrumb.tsx,Banners.tsx,HeaderCard.tsx,MetaRow.tsx,MultiScalarQuestions.tsx,
Chart.tsx,chartRender.ts,labelEngine.ts,RangeControl.tsx,CustomRange.tsx,Outcomes.tsx,OutcomeRow.tsx,ActionStrip.tsx,
PoolDetails.tsx,Ticket.tsx,TicketQuote.tsx,TicketMore.tsx,TradeFab.tsx,MajorEvents.tsx,IdsBlock.tsx,Tabs.tsx,
CommentsTab.tsx,RelatedTab.tsx,HoldersTab.tsx,ActivityTab.tsx,ReportAnswerDialog.tsx,AddLiquidityDialog.tsx},
src/components/Dialog.tsx, src/market/market.css.
Do §4.10 + §5 market layout: honest 0–100 axis, 72px gutter labels via label engine (canvas.__labels), d3 time ticks,
crosshair (pointer + ←/→), Zoom to data, Custom popover (Save applies), export CSV, no-history plate; outcomes radio +
action strip, 80-outcome Show all + Search by outcome:, series isolation; pool details ladder; ticket with all fields,
4-dp + exact reveal, CTA machine, More Mint/Merge/Redeem; dialogs verbatim copy; tabs with real fixture data; mobile
FAB + sheet tabs Trade|Mint|Merge|Redeem; conditional banner with parent link, parent-token pay unit.
Acceptance: build+tsc; e2e chart-*, parity P-*, RA-*, CH-*, O-*, I-*, T-*, MD-*, TAB-*, MOD-*, flows 03/04/05 green.
```

**Pass 5: leaderboard, create, collections, menus, mobile (≤25 min)**
```
Files: src/leaderboard/{LeaderboardPage.tsx,LeaderControls.tsx,LeaderTable.tsx,LeaderRow.tsx,ScoreAnatomy.tsx,
TierPill.tsx}, src/create/CreatePage.tsx, src/collections/CollectionsPage.tsx, src/components/{HoverMenu.tsx,
PoliciesMenu.tsx,AppMenu.tsx,AccountMenu.tsx,ConnectDialog.tsx,MobileNavSheet.tsx,ThemeToggle.tsx,GuidedTour.tsx},
src/leaderboard/leaderboard.css.
Do §4.11–4.15 and §9.7 mobile layouts: fixtures keyed by params (missing → Not in sample data + Retry), real sorting
and paging, Updating…, Your Rank flow, score anatomy from scoreBreakdown, labelled rows <600; create step 1 with real
example questions, Next gating + tooltip, ?parent prefill, step-2 plate; collections gate + local star grid; all menus
with observed hrefs; Account menu with smart-account switch; mobile ≡ sheet; tour 5 steps.
Acceptance: build+tsc; e2e parity L-*, C-*, CM-*, CL-*, COL-*, M-*, G-*, flows 02/06/08 green.
```

**Pass 6: e2e suite + polish (≤25 min)**
```
Files: e2e/{run.mjs,quality.mjs,parity.mjs,parity.json,deadControls.mjs,navigation.mjs,flows.mjs,card.mjs,chart.mjs,
data.mjs,shots.mjs}; fix-only edits in src/** for failures listed in e2e_last.txt.
Do: generate parity.json from design.md §9.10 (ID, test name, route, assertion); implement every test name in §9.9 at
1440 and 390 (+ widths listed); dead-control enumerator with disabled+aria-describedby rule; console allowlist G-16;
perf test (600 cards, live fixture pages); never weaken a test. Polish only what failing tests point at.
Acceptance: Claude runs `npm run e2e -w apps/explorer > e2e_last.txt 2>&1` → 0 failures; shots.mjs captures at
1440/1920/390 viewed by Claude; build+tsc pass.
```

**Verification commands (Claude, outside the sandbox):**
```
node apps/explorer/scripts/capture-fixtures.mjs            # after pass 1
npm run build -w apps/explorer && npx tsc --noEmit -p apps/explorer
npm run e2e -w apps/explorer -- --suite=<card|hero|rail|chart|parity|dead|nav|flows|data|quality> > e2e_last.txt 2>&1
node apps/explorer/e2e/shots.mjs "http://localhost:5173/#/" 1440 900 home
node apps/explorer/e2e/shots.mjs "http://localhost:5173/#/markets/100/will-the-national-rallys-candidate-win-the-next-french-presidential-election" 1440 900 cond
node apps/explorer/e2e/shots.mjs "http://localhost:5173/#/" 390 844 home-m
```
