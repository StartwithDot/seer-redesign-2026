# Seer Explorer, Round 5: three directions (Home + Market + Header)

What I read and looked at: VISION.md section 'USER FEEDBACK ROUND 4' (binding); refs 6 to 12; the EF kit (palette, dark board, light board, trade ticket); product-identity-guide; the real data (100 markets, for example Knesset Yashar 60.8 / Likud 38.1 / Others 0.9, Le Pen 84.2 / 14.8, the ETH BASEFEE scalar bounded 0.1 to 120 gwei, liquidity $27.7k); dense explorer sheets 04/09/11/12 (DefiLlama, Dexscreener, TradingView screener, Manifold, Metaculus); and the v3 Seam/Trace/Assembly concepts. I don't reuse their layouts: no hero bar, no 48px table rows, no seat bench. I do reuse their information layer (WHO / WHAT / HOW) and the `signal.js` maths (c5, confidence tier, OU sim).

---

## 0. Shared foundation (true in A, B and C)

### 0.1 Fixed EF skeleton
- **Surfaces:**
  - dark: `--bg #101013`, `--card #1A1A1E`, `--nested #1F1F24`, `--btn2 #241E33`
  - light: `#F7F7F9`, `#FFFFFF`, `#F0F0F3`, `#EFE9FC`
- **Text:** dark `#EDEDF2 / #A8A8B3 / #67676F`; light `#17171C / #5C5C66 / #8E8E99`.
- **Primary:** EF violet `#7B3AFF` (fill, white text, 5.4:1). Light-mode text variant `#6C2BD9`. It is used only for Connect, Confirm, Create, the selected tab and the focus ring. Primary is never YES and never NO.
- **Shape and type:** radii 16 (cards), 12 (inner), 8 (controls). Inter Tight with tabular numerals; JetBrains Mono for addresses only. No borders: tonal separation only.
- **Grid:** 8px. Container 1392 at 1440 (24px side gutters). All heights are multiples of 8.

### 0.2 Colour method (applies to every table below)
- **60-30-10:**
  - 60% EF neutrals (`--bg`, `--card`)
  - 30% secondary neutrals (`--nested`, secondary text)
  - 10% chroma: YES hue, NO hue and violet primary. No other chroma at rest.
- **YES vs NO:** each design uses a complementary pair (about 150 to 180 degrees apart on the wheel) drawn from EF's approved palette. Supporting series use hues next to the YES hue.
- **Second channel (colour-blind safety):** colour is never the only cue.
  - YES is always on the LEFT, filled, with a ▲-tipped coin cap and the label "Yes".
  - NO is always on the RIGHT, outlined or soft-filled, with a ▽ cap and the label "No".
  - Deltas are always arrow + sign + "pts" (▲ +4 pts), in green `#3DDC97` / red `#FF5C72`.
- **Status colours** carry a glyph as well: ● Open, ◔ Resolving, ⚑ In dispute, ■ Closed.
- **Contrast (WCAG, computed on `--card #1A1A1E`):**

| Colour | On dark card | Light-mode variant on white |
|---|---|---|
| teal #2FD4C0 | 9.4:1 | #0B7F73, 4.9:1 |
| orange #FF8A4C | 7.5:1 | #C2551A, 4.6:1 |
| blue #5B9DFF | 6.4:1 | #2F6FD6, 4.8:1 |
| amber #F5B84A | 9.8:1 | #8A5A00 text, 5.9:1 |
| lavender #9C6FFF | 5.1:1 | #6C2BD9, 7.0:1 |
| green #3DDC97 | n/a | #0E7A50, 5.4:1 |
| red #FF5C72 | n/a | #D1334A, 4.9:1 |

  - Ink text `#101013` on teal, orange, blue or amber fills: 6.9 to 10.7:1.
  - White on violet: 5.4:1.

### 0.3 Data honesty (fixes ref6 and ref12)
- Never print "N/A", "unavailable" or "Not in sample". A metric we don't have is simply not drawn.
- The stats line shows only real totals: `100 markets · $94.6k traded · $412k liquidity · 0 disputes`.
- Simulated history carries one 10px `SIM` tag at the chart corner. It is never repeated per row.

### 0.4 Tile graph maths (shared module `marks.js`)
- **Coin stack (one per outcome):**
  - Stack height `h = p/100 · Hmax`. Coin pitch `Hmax/10`, so 1 coin = 10 pts.
  - Coin count = `ceil(p/10)`, minimum 1 when `p > 0`. The top cap is drawn at the exact height `h`, so a 61% stack stands visibly higher than a 58% one.
  - Coin geometry: face ellipse `rx = w/2`, `ry = w·0.28`; edge band 3px.
  - Shading: the side band uses a vertical gradient (hue at 100% to hue darkened 35% in OKLCH). The cap is the hue lightened 12% plus a 1px highlight arc at 40% white.
  - Ghost ring: a dashed ellipse at the 7-days-ago height, so the change reads before any number.
  - Outcomes named Invalid and outcomes with `null` odds are never stacked. They are listed in Info only.
- **Hover stack animation (the same in every design that uses coins):**
  - Coins rebuild bottom-up: each drops 12px with `cubic-bezier(.3,1.35,.5,1)` (slight landing overshoot), 140ms each, 22ms stagger.
  - The top coin lands with a squash `scaleY .86 → 1` over 80ms.
  - The % label rolls its digits over 200ms.
  - Total for 10 coins is about 360ms. Leaving the tile does not un-stack.
  - Reduced motion: no drop, labels swap instantly.
- **Tube sparkline (scalar markets):**
  - Catmull-Rom spline through the estimate series. Estimate = `lb + p_up·(ub − lb)` (gwei: `0.1 + p·119.9`).
  - Three strokes give the glossy pipe:
    1. shadow: width 8, `rgba(0,0,0,.35)`, y+3
    2. body: width 6, gradient along x from hue −20% L to hue
    3. sheen: width 1.5, white 45%, offset `−1.5 + 0.8·sin(s/28)` px along arc length s, which gives the twisted-pipe glint of ref11
  - A range band (lb to ub) is drawn as a 2px faint rail with end ticks labelled "0.1" and "120 gwei".
  - The estimate end-cap is a 6px sphere labelled "14.2 gwei".
- **Ridge (market page, categorical):**
  - One filled area per outcome. The leader is in front; each further rank sits back by dx +20px, dy −16px (the oblique depth of ref10).
  - Fill: the hue at 85% alpha on the front face. The ridge top edge gets 2px of hue +15% L. A side wall (the area extruded 6px down-right) gets hue −30% L.
  - Vertices at annotated events are 5px rings joined across ridges by a 1px neutral line.
  - Only the front plane has axes.

### 0.5 Dropdown motion (every menu and filter, all designs)
- **Open:** opacity 0→1, `translateY(-4px)→0`, `scale(.98)→1`, origin top, 180ms `cubic-bezier(.2,.8,.2,1)`. Items fade in with a 12ms stagger (max 6).
- **Close:** 120ms ease-in.
- **Hover intent:** opens after 80ms; a 160ms grace period lets the pointer cross to the panel. Click also toggles.
- **Dismiss:** outside click and Escape close the menu; focus returns to the trigger. Arrow keys move through items.
- **Placement:** the panel top is the bar bottom + 8px, so it never overlaps the bar. It flips horizontally to stay inside the viewport. One menu open at a time.
- **Chevron:** rotates 180° in 180ms.

### 0.6 Header menus (content shared, styling per design)
- **Policies▾:**
  - `Verified Market Policy`
  - `Market Rules Policy`
  - divider, then `Documentation ↗` (https://docs.seer.pm)
- **App▾:** four product cards, each with its glyph and an accent chip. All open in a new tab.

| Product | Link | Glyph | Accent |
|---|---|---|---|
| Futarchy | futarchy.seer.pm | fork | violet |
| Deepfunding | deep.seer.pm | up/down pair bars | blue |
| Foresight (Risk) | foresight.kleros.io | band gauge | teal |
| Opportunity Markets | opportunity.seer.pm | three lanes | amber |

  Each card also shows a one-line description. The footer row reads `Seer app · app.seer.pm` (current).

### 0.7 Sticky trade window (CSS strategy, shared contract)
```css
.market { display:grid; grid-template-columns:minmax(0,1fr) var(--tradeW); gap:24px; align-items:start; }
.trade  { position:sticky; top:72px; /* header 56 + 16 */ height:calc(100dvh - 88px);
          display:flex; flex-direction:column; }
.trade__wallet { flex:0 0 auto; }               /* always visible */
.trade__body   { flex:1 1 auto; overflow-y:auto; overscroll-behavior:contain; }
.trade__cta    { flex:0 0 auto; }               /* always visible */
```
- No ancestor of `.trade` may set `overflow:hidden|auto`. Use `overflow:clip` on the page if needed, because hidden/auto breaks sticky.
- The page scrolls the chart and content; `.trade` stays in view.
- **E2E check:** scroll the window 2400px. `.trade.getBoundingClientRect().top` must stay 72 ±1 and the CTA must stay inside the viewport.
- Below 1024px wide, `.trade` becomes a bottom sheet (see Mobile in each design).

### 0.8 Information layer (compact in every design)
Three sentences built from `creator`, `questions[0]`, `verification`, c5 and staleness. One per line, 13/20 type:
- WHO: "Asked by 0xb5a6…801c · answered on Reality.eth · disputes to Kleros · verified"
- WHAT: "Pays the party with most Knesset seats · earliest final answer 18 Jul 2026"
- HOW: "Treat 61% as a strong lean, about 3 in 5; ~$1.2k moves it 5 pts (Solid)"

---

## DESIGN A: COINBOARD
**Thesis:** the market list is a counting table: every outcome is a small coin stack whose height is its chance, so a board of 15 markets reads like piles of money at a glance.

### A.1 Colour roles
| Role | Dark | Light | Where |
|---|---|---|---|
| YES | teal #2FD4C0 | #0B7F73 | Yes stack, Buy Yes button, Yes line/ridge, ticket Yes side |
| NO | orange #FF8A4C | #C2551A | No stack, Buy No button, No series, ticket No side |
| Neutral | #1A1A1E / #A8A8B3 | #FFFFFF / #5C5C66 | 60/30 surfaces and text |
| Accent (primary) | violet #7B3AFF | #7B3AFF fill, #6C2BD9 text | Connect, Confirm, active tab underline, focus |
| Categorical series 1..4 | teal #2FD4C0, blue #5B9DFF, lavender #9C6FFF, ink #A8A8B3 | #0B7F73, #2F6FD6, #6C2BD9, #5C5C66 | multi-outcome stacks (hues next to teal; "Others" is grey) |
| Status Open / Resolving / Dispute / Closed | #3DDC97 ● / #F5B84A ◔ / #FF5C72 ⚑ / #67676F ■ | #0E7A50 / #8A5A00 / #D1334A / #8E8E99 | status dot + word |
| Delta up / down | #3DDC97 ▲ / #FF5C72 ▼ | #0E7A50 / #D1334A | Δ7d text only |

- Teal (173°) and orange (21°) are 152° apart: a near-complementary, warm-cool pair.
- Orange is chosen over red for NO so that NO never reads as a loss; red stays reserved for negative deltas and disputes.

| EF departure | Reason |
|---|---|
| YES moves from violet to teal | The user demands distinct YES/NO; violet is reserved for primary actions, so a Buy never looks like Connect |
| NO moves from violet-soft to orange | EF's grey-violet "No" is too close to "Yes"; orange is EF's High-risk hue and adds weight to the contra side |
| Coin stacks use soft 3D gradients | EF is flat, but the user asked for a refined 3D coin (ref9); limited to 2 gradient stops, no rainbow |

### A.2 Home, 1440×900 (15 tiles in the first screen)
```
┌ HEADER 56 ── seer │ Markets Leaderboard Create Policies▾ App▾ │ [⌕ Search markets, outcomes  /] │ Human|Agent ? ◐ [Connect] ┐
├ MOVING NOW 72 ─ 1 Le Pen candidacy 84% ▲2 ⌇ │ 2 Knesset Yashar 61% ▲4 ⌇ │ 3 BASEFEE 14.2 gwei ⌇ │ 4 Senate … │ ‹ › │
│                 100 markets · $94.6k traded · $412k liquidity · 0 disputes (12px, right-aligned under arrows)        │
├ FILTER BAR 48 ─ ◎All ⚖Politics ₿Crypto ⚽Sports ✦Culture ⌘Tech ⚗Science $Finance │ ●State▾ ✓Verified▾ ⛓Chain▾ ◫Type▾ ⇅Liquidity▾ │ + Create │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ [tile 264×200] [tile] [tile] [tile] [tile]      5 cols × 264, gap 16 (1384 wide)                          │
│ [tile] [tile] [tile] [tile] [tile]              rows at y = 192, 408, 624; the 4th row peeks at 840         │
│ [tile] [tile] [tile] [tile] [tile]                                                                         │
```
- Vertical budget: 56 + 72 + 48 + 16 = 192 above the grid. Three rows of 200 + two gaps of 16 = 632, ending at y=824 of 900. 15 tiles are fully visible; the 4th row peeks, which invites scrolling.

### A.3 Tile, 264×200, padding 16, radius 16, `--card`
```
┌────────────────────────────────────────┐
│ (●24) Will Le Pen be the RN's     ☆    │ 16/20, 2 lines max, 40h block
│       candidate in the next election? │
│ 84%  Yes ▲2 pts 7d          ╭─╮        │ leader 28/32 bold in YES teal; Δ 12px
│                             │█│  ╭─╮   │ coin field 232×56: Yes stack x=136, No stack x=192
│ ● Open · ✓ · Gnosis         │█│  │▒│   │ meta 12/16, #67676F
│                            84    15    │ stack labels 12px under each stack
│ [ Buy Yes 84¢ ][  Buy No 15¢ ]         │ buttons 112×36 each, gap 8, radius 8
└────────────────────────────────────────┘
```
- **Layout rule:** text on the left (leader % on top, meta below), stacks on the right (`Hmax` 56, coin width 28, gap 28), buttons across the bottom.
- **Buy buttons:**
  - Yes: solid teal fill, ink text `Buy Yes 84¢`.
  - No: `#2A1E18` fill (orange at 14% over card) with orange text `Buy No 15¢`.
  - Light mode: Yes is a teal fill with white text; No is an `#FBE6DA` fill with `#C2551A` text.
  - The buttons look like buttons: 36h, label + price, a pressed state (`translateY(1px)` + 8% darker), and focus rings.
- **Categorical tile:** up to 3 stacks plus "Others". Leader line reads `Yashar 61%`. Buttons: `Buy Yashar 61¢` (teal) / `Buy Likud 38¢` (blue soft) / `+2`.
- **Scalar tile:** the coin field becomes the tube sparkline (232×56, 30 points). Leader line: `14.2 gwei est.` with range ticks `0.1` and `120`. Buttons: `Buy Up 12¢` (teal) / `Buy Down 88¢` (orange).
- **Hover:**
  - Tile lifts: `--card → #202026`, y −2, 160ms.
  - Coins re-stack (0.4).
  - A 96px info shelf slides DOWN from under the tile. It is absolutely positioned and overlays the next row. The Yes/No buttons stay visible because the shelf is below the tile, never over it.
  - Shelf (264×96, `--nested`, radius 0 0 16 16, opens with 0.5 motion):
    - row 1: `Liquidity $27.7k · Traded $5.1k · Moves 5pts: ~$1.2k (Solid)`
    - row 2: WHO line truncated
    - row 3: `Resolves 18 Jul 2026 · 271d` + `Open market →`
  - Only one shelf is open at a time. Row neighbours under the shelf dim to 60%.

### A.4 Moving now strip (72px)
- Four cells of 320×56 plus pager arrows: rank number (#67676F), question on 1 line with ellipsis, leader % in its colour, Δ7d, and a micro tube 64×24.
- Ranked by |Δ7d| × log(liquidity). Paging slides by 336px in 220ms.
- Totals sit right-aligned under the arrows.

### A.5 Header + filter bar
- **Header:**
  - Nav items are 14/20 text. The active item gets a 2px violet underline that slides between items (transform, 200ms).
  - Search pill 400×40.
  - Policies menu: 280 wide, rows 40.
  - App menu: 2×2 grid of product cards (each 176×72: glyph 32, name 14 semibold, line 12), 384 wide.
- **Filter bar:**
  - Categories are icon (16) + text tabs, 32h, no chip boxes. The active one shows the violet underline and full-contrast text; inactive ones are #A8A8B3.
  - Right group: ghost dropdown buttons (icon + word + ▾, 32h, hover `--nested`). Panels are 280 wide with options showing live counts, checkmarks and a Min liquidity input.
  - Applied filters appear as inline text tokens `Gnosis ×` after the divider, on the same 48px bar. They never add a row.

### A.6 Market page, 1440
```
┌ header 56 ───────────────────────────────────────────────────────────────────────────────┐
│ Markets / Politics   ● Open · ✓ Verified · Gnosis · Categorical               ☆  ⋯       │ 40
│ Which party will win the most seats in the 2026 Knesset?          [Answer on Reality.eth] │ 24/32
├ main 1fr (968) ──────────────────────────────────────────────┬ TRADE 400, sticky ────────┤
│ RIDGE CHART 968×400                                          │ wallet 0xb5a6… 24.69 sDAI │
│  front: Yashar ridge (teal), behind: Likud (blue), Others    │ [Buy Yashar 61¢|Likud 38¢]│
│  "Yashar 61%  ▲4 pts in 7d" direct label at ridge end        │  $ 100.00  (32/40)        │
│  pin ◆ "12 Sep: poll lead +9 pts" on the biggest move        │ [+1][+5][+20][+100]       │
│  y: "Chance of winning" 0 25 50 75 100 · x: Jul Aug Sep Oct  │ coin preview stack        │
│  ranges 1D 1W 1M All · export                                │ Avg 0.62 · After 0.64     │
├──────────────────────────────────────────────────────────────┤ 161 shares · pays $161   │
│ INFO 3 cells 312×96: WHO │ WHAT │ HOW                        │ if Yashar wins (+61%)     │
│ OUTCOMES table: stack 24 · name · % · Δ7d · [Buy] ⋯          │ Max slippage 1% ⚙  More▾ │
│ Tabs: Activity · Top holders · Comments · Related conditional│ [ Confirm  Buy Yashar ]   │
└──────────────────────────────────────────────────────────────┴───────────────────────────┘
```
- **Hero ridge (968×400):**
  - Plot area 840×320; a right gutter of 112 holds the direct labels, which never touch the ticks.
  - Hovering anywhere snaps a vertical crosshair through all ridges and shows per-ridge values on their ridge tops.
  - Note: "Plots pool price; may differ slightly from odds".
- **Binary market:** two ridges, Yes teal in front and No orange behind, with the label "Yes 84%, up 2 pts in 7d".
- **Scalar market:** a full-width tube (0.4) with the band 0.1 to 120 gwei and the label "Estimate 14.2 gwei, range 0.1 to 120".
- **Trade instrument, "Coin counter" (400 wide; the wallet strip and CTA stay fixed, the body scrolls):**
  - The side switch is two 176×48 tabs: Yes teal / No orange (categorical: outcome tabs).
  - Amount: 32/40 numerals with kit quick-adds.
  - A 120×72 coin preview drops 1 coin per $10 (cap 20), 22ms stagger, with the label "161 shares".
  - Result rows: 13/20, label left, value right, tabular.
  - CTA states: `Connect wallet` / `Enter an amount` / `Not enough sDAI` / `Buy Yes · $100`. Confirm is violet (primary).

### A.7 Human / Agent
- Agent mode replaces each tile's meta line with mono `p=0.842 · c5=$412 · fresh`, and adds a `{ }` icon that copies the signal JSON.
- On the market page, the HOW cell shows `curl …/api/signal/100/0x…` (labelled illustrative).

### A.8 Mobile 390
- Header 56: logo, search icon, ≡.
- Moving now becomes a horizontal snap scroller (cells 280×56).
- The filter bar scrolls horizontally, with a `Filters` sheet button.
- Tiles are 1 column, 358×184; the stack field moves to the right; buttons are 167×40.
- The hover shelf becomes a tap on ⓘ, which expands inline.
- Market page: ridge 358×240. A sticky bottom bar (`Buy Yes 84¢ | Buy No 15¢`, 64h) opens the ticket bottom sheet (90dvh, own scroll, CTA pinned).

---

## DESIGN B: INSPECTOR
**Thesis:** the explorer is a split board: a compact grid on the left and a live inspector column on the right that explains whatever you point at, so hovering is reading and the same column becomes the trade window.

### B.1 Colour roles
| Role | Dark | Light | Where |
|---|---|---|---|
| YES | lavender-violet #9C6FFF (text), #7B3AFF (fill) | #6C2BD9 / #7B3AFF | Yes coins, Buy Yes, Yes tube |
| NO | amber #F5B84A | #8A5A00 text / #F5B84A fill + ink text | No coins, Buy No, No tube |
| Neutral | EF set | EF set | 60/30 |
| Accent (primary) | white-on-ink "Confirm" + violet focus ring | ink #17171C fill | primary actions turn neutral-solid so they never look like Yes |
| Categorical series | violet #9C6FFF, blue #5B9DFF, teal #2FD4C0, grey | #6C2BD9, #2F6FD6, #0B7F73, #5C5C66 | violet, blue and teal sit next to each other on the cool side of the wheel |
| Status | Open #3DDC97 ● · Resolving #5B9DFF ◔ · Dispute #FF5C72 ⚑ · Closed #67676F ■ | #0E7A50 · #2F6FD6 · #D1334A · #8E8E99 | Resolving moves to blue because amber is NO |
| Delta | ▲ #3DDC97 / ▼ #FF5C72 | #0E7A50 / #D1334A | |

- Violet (262°) and amber (39°) are exact complements, and B is the most EF-native pair: YES keeps EF's own violet.

| EF departure | Reason |
|---|---|
| NO becomes amber, not violet-soft | It has to differ from YES at a glance; amber is in EF's palette |
| Primary CTA becomes neutral ink/white (violet still on Connect and focus) | Because violet means YES here, Confirm can't share it; the Confirm label repeats the side ("Confirm Buy No") |
| Resolving status moves from amber to blue | Avoids clashing with NO |

### B.2 Home, 1440×900 (12 tiles + inspector)
```
┌ HEADER 56 ────────────────────────────────────────────────────────────────────────────────────────────┐
├ FILTER SENTENCE 48: Showing [Open ▾] markets in [All topics ▾] on [all chains ▾], verified [any ▾], by [liquidity ▾]   ⌕ │
├ BOARD 968 (3 × 312, gap 16) ──────────────────────────────────────────┬ INSPECTOR 408, sticky top 72 ─┤
│ [tile 312×168] [tile] [tile]                                          │ MOVING NOW (rest state)       │
│ [tile] [tile] [tile]                                                  │ 1 Le Pen  84% ▲2   ⌇ 64×24    │
│ [tile] [tile] [tile]                                                  │ 2 Yashar  61% ▲4   ⌇          │
│ [tile] [tile] [tile]          4 rows: 4×168 + 3×16 = 720              │ 3 BASEFEE 14.2 gwei ⌇         │
│                                                                       │ 4 … 5 …  (5 rows of 40)       │
│                                                                       │ ── on hover: LIVE INSPECTOR ──│
│                                                                       │ big coin stacks 360×160       │
│                                                                       │ mini tube 7d 360×72 + label   │
│                                                                       │ WHO / WHAT / HOW (3 lines)    │
│                                                                       │ Liquidity · Traded · c5 · ends│
│                                                                       │ [Buy Yes 84¢] [Buy No 15¢]    │
└───────────────────────────────────────────────────────────────────────┴───────────────────────────────┘
```
- Vertical budget: 56 + 48 + 16 = 120; 120 + 720 = 840 of 900. 12 tiles are fully visible.
- The inspector is `position:sticky; top:72px; height:calc(100dvh − 88px)`.

### B.3 Tile, 312×168, padding 16 (horizontal composition)
```
┌──────────────────────────────────────────────────┐
│ (●24) Will Le Pen be the RN's candidate…    ☆    │ 14/20, 2 lines, 40h
│ 84% Yes                 ▲2 pts 7d                │ 24/28 violet + 12px delta
│ ◖████████████████████████████████████▌░░░░░░◗    │ COIN ROLL 280×20: Yes from left, No from right
│ 84 Yes                                    15 No  │ 12px labels at roll ends
│ [ Buy Yes 84¢ ][ Buy No 15¢ ]   ● Open · $27.7k  │ buttons 96×32 + meta 12px
└──────────────────────────────────────────────────┘
```
- **Coin roll (alternative mark):**
  - Coins stand on edge in a horizontal roll, so a long tile can show the coin idea.
  - 20 coins of 14px pitch: each disc is an ellipse of rx 3 / ry 9 with a lit face, giving a ribbed 3D roll.
  - Yes coins = `round(p_yes/5)` from the left; No coins from the right. The meeting seam is placed at the exact `p`, and the boundary coin is split by both colours.
  - Multi-outcome: ordered segments with labels at the segment centre (when ≥14%) and a leader callout above.
- **Hover:**
  - The roll re-deals: coins slide in from both ends toward the seam, 10ms stagger, 160ms ease-out.
  - The inspector swaps to this market: crossfade 180ms; the stacks re-stack with the 0.4 timings.
  - Nothing overlays the board, so the hover panel can never cover Yes/No.
  - Keyboard focus does the same. Click pins the inspector (a pin icon appears); Escape unpins.
- **Buttons:**
  - Yes: violet fill, white text.
  - No: `#2E2614` fill with amber text (light: `#FCEFD4` fill with `#8A5A00` text).
  - 32h, radius 8. The labels always include the price.

### B.4 Header + filter sentence
- **Header:** the logo and nav are left-aligned on the board column. Search (360) is right-aligned over the inspector column, so header and columns line up.
  - A Human|Agent segmented control (64×32 each) sits next to Connect.
  - Menus open as panels attached under the trigger. The App menu is a vertical list of 4 product rows 360×56 (glyph 24 in its accent, name, description, ↗) with a hover row tint.
- **Filter sentence:**
  - Each bracketed word is a dropdown trigger: underlined 1px dotted, ▾ 12.
  - The panel (240 wide) opens under the word and lists options with counts.
  - Changing a value rolls the word in place (old word up and out, new word up and in, 180ms).
  - `Reset` appears at the end when anything is non-default.
  - The plain-words sentence doubles as an explanation of the list.

### B.5 Market page, 1440
- **Layout:** board area → content 968; the inspector column (408) becomes the trade window in the same place. Transition: the column stays fixed while the left side crossfades (360ms), which creates spatial continuity from home.
- **Hero graph, the tube (968×360):**
  - Binary: Yes violet tube and No amber tube, mirror images (No = 100 − Yes), crossing at 50 with a "flips here" marker when they cross.
  - Categorical: tubes per outcome. The leader is thick (6px); the others are 3px at 70% alpha.
  - Direct labels at the tube ends in a 112 gutter: "Yes 84% · ▲2 pts in 7d".
  - Annotation: the biggest Δ in range gets a callout leader line, "Biggest move: +6 pts on 3 Oct".
  - Axis: "Chance (%)" 0 / 50 / 100 and month names. Scalar markets use the estimate tube with the band.
- **Below the graph:** info strip (3 sentences, 1 line each, 120h total), outcome rows (coin roll 240×16 each), tabs.
- **Trade instrument, "Balance" (408):**
  - Header: the wallet pill + balance + Max (fixed).
  - Side switch: Yes/No as two 180×44 buttons showing their prices.
  - Amount: a log slider ($1 to $10k, snaps at 5/20/100/500/1k) + numeric field + kit quick-adds.
  - A balance beam 360×96: left pan = coins you pay, right pan = coins you receive if you win. The beam tilts by `atan(return)`, clamped to 12° and spring-animated, so the payoff ratio is visible.
  - Rows: Avg price, Price after, Shares, Potential return.
  - CTA (fixed): ink "Confirm Buy Yes · $100".

### B.6 Human / Agent
- In Agent mode the inspector shows the signal JSON (mono 12), a `Copy` button and `curl`.
- Tiles show `p` and `c5` in place of meta.
- The filter sentence gains `[as JSON ▾]`.

### B.7 Mobile 390
- The inspector becomes a peek sheet (88px collapsed: market name + stacks). Tapping a tile fills it; dragging it up expands it to 80dvh.
- Tiles: 1 column, 358×152.
- The filter sentence wraps to 2 lines, and each word opens a bottom sheet.
- Market page: the trade window is a bottom sheet with the CTA pinned.

---

## DESIGN C: COMMAND DECK
**Thesis:** a ranked rail of what is moving sits permanently on the left, and every market is read as terrain: one tower of chips per tile and a big mountain ridge on the market page, so you scan by rank and read by shape.

### C.1 Colour roles
| Role | Dark | Light | Where |
|---|---|---|---|
| YES | blue #5B9DFF | #2F6FD6 | Yes chips, Buy Yes, Yes ridge |
| NO | orange #FF8A4C | #C2551A | No chips, Buy No, No ridge |
| Neutral | EF set | EF set | 60/30 |
| Accent (primary) | violet #7B3AFF | #7B3AFF / #6C2BD9 | Connect, Confirm, active rank, focus |
| Agent | teal #2FD4C0 | #0B7F73 | Agent mode chrome only |
| Categorical series | blue #5B9DFF, lavender #9C6FFF, teal #2FD4C0, grey | #2F6FD6, #6C2BD9, #0B7F73, #5C5C66 | cool hues next to YES blue |
| Status | Open ● #3DDC97 · Resolving ◔ #F5B84A · Dispute ⚑ #FF5C72 · Closed ■ #67676F | #0E7A50 · #8A5A00 · #D1334A · #8E8E99 | |
| Delta | ▲ #3DDC97 / ▼ #FF5C72 | | |

- Blue (216°) and orange (21°) are a true complementary pair and the most robust pair for all common colour-blind types (deuteranopia and protanopia keep the blue/yellow axis).

| EF departure | Reason |
|---|---|
| YES becomes blue | Best colour-blind separation; blue is EF's "informational/up" hue |
| NO becomes orange | Complement of blue; red stays for losses |
| Agent mode uses teal | Blue is taken by YES, so Deep's agent blue moves to teal for this product |
| Chip tower and ridges use oblique 3D | User request (refs 9 and 10); 2-stop shading, no glare |

### C.2 Home, 1440×900 (rail + 12 tiles)
```
┌ HEADER 56: [seer | rail-aligned 304] │ Markets Leaderboard Create Policies▾ App▾ │ ⌕ │ Human|Agent ? ◐ Connect │
├ RAIL 304, sticky ────────┬ TOOLBAR 48: ◎Topic▾ ●State▾ ✓Verified▾ ⛓Chain▾ ◫Type▾ ⇅Sort▾ │ 100 markets · $94.6k │
│ [Moving|Volume|Closing]  ├──────────────────────────────────────────────────────────────────────────────┤
│ 01 Le Pen cand.   84 ▲2  │ [tile 256×200] [tile] [tile] [tile]    4 cols × 256, gap 16 = 1072           │
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │ [tile] [tile] [tile] [tile]                                                   │
│ 02 Yashar         61 ▲4  │ [tile] [tile] [tile] [tile]            3 rows: 3×200 + 2×16 = 632             │
│ 03 BASEFEE    14.2g ▲0.8 │                                                                              │
│ … 16 rows of 40          │                                                                              │
│ ridge preview 272×96     │                                                                              │
└──────────────────────────┴──────────────────────────────────────────────────────────────────────────────┘
```
- Vertical budget: 56 + 48 + 16 = 120; 120 + 632 = 752. There are 12 tiles plus a 4th-row peek, and the rail adds 16 ranked markets.
- **Rail (the trending module as a side column, own scroll):**
  - Rows 40: rank (mono 12), question on 1 line, leader % in the YES/outcome colour, Δ7d, and a 2px rank bar under each row whose length = |Δ7d| relative to the max.
  - Tabs Moving / Volume / Closing soon: 32h text tabs with a sliding violet underline.
  - Hovering a row draws its ridge preview at the rail bottom (272×96, draw-in 220ms) and highlights the tile if it is on screen.

### C.3 Tile, 256×200, padding 16
```
┌──────────────────────────────────┐
│ (●24) Which party wins the  ☆   │ 14/20, 2 lines
│       most Knesset seats?       │
│  ╭───╮   61%                     │ chip tower 56×88 left; leader 32/36 in its colour
│  │▓▓▓│   Yashar                  │ 13px name; ▲4 pts 7d 12px
│  │▓▓▓│   ▲4 pts 7d               │
│  │▒▒▒│   Likud 38 · Others 1     │ runners-up 12px #A8A8B3
│  ╰───╯                           │
│ [Buy Yashar 61¢][Buy Likud 38¢]  │ 108×36 each, gap 8
│ ● Open · $27.7k · 271d     ⋯     │ 12/16
└──────────────────────────────────┘
```
- **Chip tower (a 3D donut equivalent):**
  - One tower of 20 chips, each chip = 5 pts; chip pitch 4px, so the tower is 80px plus the cap.
  - Chip counts per outcome are allocated with the largest-remainder method, so they sum to 20. The leader sits at the bottom, the others above in rank order.
  - Binary: blue Yes chips at the bottom, orange No on top, and a 1px white gap at the boundary.
  - The leader's chip band carries a 2px edge highlight. Its exact % is the big number beside it.
  - This beats the donut: the big % and the name sit next to the mark, with the runners-up on one line.
- **Scalar tile:** the tower is replaced by a vertical tube gauge 24×88 filled to the estimate within the bounds, plus a horizontal tube sparkline 120×32. Big label `14.2 gwei`, small `range 0.1 to 120`.
- **Hover:**
  - The chips deal: the tower empties and chips drop in by outcome, 16ms stagger, 120ms each, 80ms pause between outcome groups, total about 480ms.
  - A 72px "brief" band expands INSIDE the tile from the runners-up line downward. The tile grows from 200 to 272 and its row neighbours stay 200 (CSS grid `align-items:start`, overlay via `z-index`).
  - The buttons move down with the band, so Yes/No are never covered.
  - Brief content: WHO line, `c5 ~$1.2k · Solid`, `Resolves 18 Jul 2026`.

### C.4 Header + toolbar
- **Header:** the logo block is exactly 304 wide over the rail, so the vertical alignment line runs from the header to the bottom of the rail.
  - Menus are rich panels: Policies 300 wide. App is a 2×2 grid of 168×88 cards with the product glyph drawn as a 32px line icon in its accent, and the panel has an animated 1px accent top edge that grows from the trigger outward (180ms).
- **Toolbar:**
  - Icon + label ghost buttons, 32h, gap 8.
  - Each opens a 280 panel with options showing counts, checkmarks and arrow-key navigation.
  - Topic uses a 2-column icon grid (8 topics). Sort includes an Asc/Desc switch.
  - Active filters show as a count badge on the trigger plus a `Clear` link at the bar end. No chips.

### C.5 Market page, 1440 (command-centre)
```
┌ header 56 ───────────────────────────────────────────────────────────────────────────────────┐
├ RAIL 64 ┬ MAIN 912 ─────────────────────────────────────────────────┬ TRADE 384 sticky ───────┤
│ 01 84   │ Markets / Politics · ● Open · ✓ · Gnosis          ☆ ⋯     │ wallet strip 56         │
│ 02 61 ◀ │ Which party wins the most Knesset seats?   [Answer ↗]     │ ORDER CONSOLE           │
│ 03 14g  │ MOUNTAIN RIDGE 912×440                                    │ impact curve 352×96     │
│ …       │   back: Others grey, mid: Likud blue-lav, front: Yashar   │ [Buy Yashar 61¢|Likud]  │
│ rank #s │   "Yashar 61% · ▲4 pts in 7d"   pins on events            │ $ 100.00 + quick adds   │
│ + mini  │   y "Chance of winning" · x months · 1D 1W 1M All         │ result rows             │
│ leader% ├───────────────────────────────────────────────────────────┤ [Confirm Buy Yashar]    │
│         │ INFO row 3×296 · OUTCOMES · Tabs                          │                         │
└─────────┴───────────────────────────────────────────────────────────┴─────────────────────────┘
```
- **Rail on the market page:** it collapses from 304 to 64 (width transition 240ms) and shows rank + leader % only. Hover expands it as an overlay; ↑↓ jumps between markets without leaving the page.
- **Mountain ridge:**
  - Ridges as in 0.4, with depth layers stepped 24/18px.
  - A floor grid on the front plane only: 4 lines labelled 0 / 25 / 50 / 75 / 100 in plain words, "Chance of winning (%)".
  - Ridge vertices at Major Events get rings joined across layers (the ref10 constellation). Each pin is labelled in 12px, for example "Poll published, +9 pts".
  - Hovering a ridge isolates it: the others drop to 25% alpha and its front edge brightens, 160ms.
  - Draw-in on load: ridges rise from the floor with scaleY 0→1, staggered 80ms, 360ms each.
- **Trade instrument, "Order console" (384):**
  - An impact curve shows price-after against amount (from `signal.js`: `pAfter = σ(logit p + a/(kL))`).
  - Your amount is a draggable dot on the curve. Labels: "Now 61¢" at the left and "After 64¢" at the dot.
  - Dragging the dot sets the amount; typing moves the dot.
  - Then the side switch (blue/orange), amount, rows (Avg, Shares, Pays if wins, Return) and Max slippage.
  - `More`: Mint / Merge / Redeem.
  - The wallet strip and CTA are fixed; the body scrolls.

### C.6 Human / Agent
- Agent mode tints the rail header teal and renames the rail tabs Feed / Webhook / JSON.
- Rail rows show `p`, `c5` and `stale` in mono.
- The trade console adds "Agent order (JSON)" preview text.

### C.7 Mobile 390
- The rail becomes a top horizontal ranked scroller (64h, rank + %).
- Tiles: 2 columns of 171×200 (tower 40×64, leader % 24px). Stacked buttons `Yes 61¢` / `No 38¢`.
- Market page: ridge 358×260 with labels inside the plot, and the order console as a bottom sheet with the CTA pinned.

---

## 1. Shared build checklist (each line becomes an e2e test)
1. At 1440×900 at least 12 tiles are fully in the viewport with no scroll; no module above the grid is taller than 150px (A: 72, B: 48 + side column, C: 48 + rail).
2. In every theme, the computed Yes and No colours differ on the tile, buttons, graph and ticket; the ΔE between them is ≥ 40.
3. No visible text matches /N\/A|unavailable|Not in sample/.
4. Every dropdown opens in 150 to 200ms, its top edge is ≥ bar bottom + 8, and Escape and outside click close it.
5. Hovering a tile animates the stacks (or chips or roll) and never covers the Buy buttons (checked by bounding-box intersection).
6. The trade window stays at top 72 ±1 while the page scrolls 2400px; the CTA stays in the viewport.
7. Every chart has a direct end label with % and Δ7d plus at least one annotation; axis titles are words.
8. The App menu lists 4 products with glyphs and the exact hrefs from 0.6.
9. Contrast script: text ≥ 4.5:1 and marks ≥ 3:1 on the card, in both themes.

## 2. Ranked recommendation
1. **A Coinboard (build first).** It answers every round-4 complaint most directly: 15 tiles on the first screen, coin stacks with exact heights and ghost rings that beat the donut, unmistakable teal/orange Buy buttons, a 72px trending strip, and a classic sticky ticket. It is the lowest risk and the most "futuristic yet usable".
2. **C Command Deck.** It is the most impressive market page (mountain ridge plus the drag-on-curve order console) and the ranked rail fixes "what is moving" without hero waste. The blue/orange pair is the most colour-blind-safe. The extra cost is the rail collapse logic and the tower allocation maths.
3. **B Inspector.** It is the strongest on the information-finance story (hover means reading WHO / WHAT / HOW in a fixed column) and has the most EF-native colours (violet YES). It has only 3 columns and moves Confirm off violet, which is the biggest EF departure. Build it if judges reward the "explain the signal" vision over density.

Suggested path: build A as the base, and take C's ridge chart and order console onto A's market page if time allows.
