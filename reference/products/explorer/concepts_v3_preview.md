# Seer Explorer: three live home and market concepts

The spec is below in full (about 430 lines), with no files written, as asked. Two caveats for the coder:
- **Data file shape:** I couldn't run a script over `markets-search.full.json` (permission prompt), so I don't know its top-level shape. I took the field names from `get-market.json`. Section 0.4 tells the coder to accept an array, `{markets:[]}` or `{data:[]}`.
- **Simulated liveness:** all live movement is simulated around the real odds and labelled "SIM" in the prototypes. The real sources to switch to later are named in section 0.5.

---

# SEER EXPLORER: three live concepts (Home + Market + Trade). Build spec for Codex

## 0. Shared foundation (all three concepts)

### 0.1 Build contract
- One folder per concept: `apps/explorer-concepts/{seam,trace,assembly}/index.html` + `app.js` + `style.css`. Vanilla JS, no build step, no CDN. Use canvas, SVG and WAAPI only.
- Data: `fetch('../../../products/explorer/data/markets-search.full.json')`. Accept a top-level array, `{markets:[]}` or `{data:[]}`. Also load `get-market.json`, `markets-charts.json` and `get-token-transactions.json` if present (history and last trade).
- Routes are hash routes: `#/` and `#/markets/<chainId>/<url>`. The whole card or row is a link. Buy, star, tick and drawer links call `stopPropagation`.
- The mock wallet is disconnected by default. The CTA says `Connect`. After a mock connect: `0x0000...dEaD`, `24.69 xDAI`, 0 sDAI, so the CTA says `Not enough balance.` Signing is always rejected with the toast "Prototype: signing disabled".
- Fonts: `font-family: "Inter Tight", system-ui`. Use `"JetBrains Mono", ui-monospace` for addresses and agent snippets only. Turn on `font-variant-numeric: tabular-nums` for every number.
- Grid is 8px. 4px half-steps are allowed only inside controls. Line-heights: 16/24/32/40/48/64.

### 0.2 Tokens (fixed EF skeleton; concept tokens add only semantic roles)
| token | dark | light | role |
|---|---|---|---|
| --bg | #101013 | #F7F7F9 | page |
| --card | #1A1A1E | #FFFFFF | cards, panels |
| --nested | #1F1F24 | #F0F0F3 | wells, inputs |
| --text / --text-2 / --text-3 | #EDEDF2 / #A8A8B3 / #67676F | #16161A / #5C5C66 / #8A8A94 | type |
| --yes (violet) | #7B3AFF | #7B3AFF fill, #6C2BD9 text | YES, UP, leader, primary CTA |
| --no (ink) | #A8A8B3 | #5C5C66 | NO, DOWN, "rest" |
| --up / --down | #3DDC97 / #FF5C72 | #12915F / #D1334A | price deltas only |
| --warn | #F5B84A | #B9770E | unverified, <7 days left, reports open |
| --agent | #5B9DFF | #2F6FD6 | agent layer only |

- Status dots: open = green, reporting or waiting = amber, dispute = red, pending execution = lavender #9C6FFF, closed = ink.
- Never encode meaning with hue alone. YES is always on the left/top with a filled shape; NO is always on the right/bottom with a hollow or hatched shape. The label is always present.
- Radii: 16 (panel), 12 (card), 8 (control). No borders; surfaces are separated by tone. No glow, gradients, blur or glass.
- Type roles:

| role | size/line | weight |
|---|---|---|
| display % | 40/48 | 500 |
| page question | 32/40 | 600 |
| section | 16/24 | 600 |
| body | 14/24 | 400 |
| meta | 12/16 | 500, --text-2 |
| micro caps label | 11/16 | 600, +0.04em |

### 0.3 Shell (identical in all three)
- **Header (64px, one row).** Left to right:
  - logo 24px → `#/`
  - nav: Markets · Leaderboard · Create Market · Policies▾ · App▾
  - search pill 360×40, placeholder `Search by market, outcome or collection`, writes `?marketName=`
  - help (?) 40
  - theme toggle (`Switch to light mode` / `Switch to dark mode`)
  - `Connect` (violet, 40h). When connected it becomes the address pill + `24.69 xDAI` with the account menu (Account, Deposit, Portfolio, Market Collections, Trade Collateral, Use smart account toggle).
- **Beta strip (32px, --nested):** "Note that this is a Beta version and can still be unstable", with a dismiss ×.
- **Container:** 1440 wide, 32px side padding. Every element snaps to the shared baseline (header contents are centred on y=32).
- **Index CTAs:** `Create New Market` and `My collections` sit right-aligned on the filter row in every concept.

### 0.4 Data mapping (real fields)
| UI | field / derivation |
|---|---|
| question, avatar | `marketName`, `images.market` |
| outcomes, % | `outcomes[]`, `odds[]`. Hide `null` odds and outcomes named "Invalid" from price visuals; list them in Info as "Invalid: pays if the question is ruled invalid". |
| type | `type` + bounds (`lowerBound`/`upperBound` ≠ 0 → scalar: Down/Up labels and an estimate `lb + p·(ub−lb)`) |
| liquidity, volume, OI | `liquidityUSD`, `volumeUSD`, `openInterestUSD`, `volumeNotionalUSD`. Always `$` with k/M, 2 significant decimals. |
| chain | `chainId` (1 Ethereum, 10 OP Mainnet, 100 Gnosis, 8453 Base) → explorer base URL |
| asker | `creator` (short `0xaa36…ae20` + explorer link), created at `blockTimestamp` |
| oracle | Reality.eth question `questions[i].id` link; `timeout` (s→h); `bond`, `min_bond` (wei/1e18, xDAI) |
| arbitrator | `questions[i].arbitrator`. Known map: `0x6815…91dc` → "Kleros". Otherwise the short address. |
| dates | `openingTs` = answers open; `finalizeTs` = earliest final answer; drives the countdown |
| verification | `verification.status` (verified / verifying / challenged / not_verified) + Kleros item link `verification.itemID` |
| conditional | `parentMarket.id ≠ 0x0` → parent link + `parentOutcome` (0 Yes, 1 No) |
| rewards | `incentive > 0` |
| futarchy | `type` containing futarchy, or a `collateralToken1 ≠ 0x0` pair |
| state | `payoutReported` → Closed; any `is_pending_arbitration` → In Dispute; `now < opening_ts` → Reports not open yet; `best_answer` unset → Reports open; `now ≥ finalize_ts && !payoutReported` → Pending execution; else Waiting for answer |

### 0.5 Shared math (one module, `signal.js`)
- **Price impact model** (honest, labelled "estimate"):
  - Depth `L = max(liquidityUSD, 50)` and `k = 0.25`.
  - Spending `a` on outcome i moves `logit(p_i)` by `Δ = a / (k·L)`.
  - `pAfter = σ(logit p + Δ)`, `avg ≈ (p + pAfter)/2`, `shares = a/avg`.
  - Payout if it wins = `shares × 1`. Return = `shares/a − 1`.
- **Inverse** (drag-to-price in SEAM): `a(target) = k·L·(logit target − logit p)`.
- **Cost to move 5 points:** `c5 = k·L·|logit(min(p+.05,.99)) − logit p|`. This is the plain-words confidence measure.
- **Confidence tier from c5:**

| tier | c5 | plain words |
|---|---|---|
| Thin | <$100 | "a small trade could swing this" |
| Fair | <$1k | |
| Solid | <$10k | |
| Deep | ≥$10k | "it takes serious money to move this" |

  Then adjust: drop one tier if `volumeUSD < liquidityUSD` (price barely tested). Drop one tier if `|Σodds − 100| > 3` and add "outcome prices disagree by N points".
- **Staleness:**
  - Production: the last trade from `get-token-transactions`.
  - Prototype: a simulated last-trade time, labelled SIM.
  - Bands: Fresh (<1h), Cooling (<24h), Stale (≥24h). Stale shows the sentence "Price may be outdated; last trade 3 days ago".
- **"What 70% means" sentence:** `p` → nearest of {1 in 10, 1 in 5, 1 in 4, 1 in 3, 2 in 5, 1 in 2, 3 in 5, 2 in 3, 3 in 4, 4 in 5, 9 in 10}. Output: "Traders price Yes at 70%, roughly 2 in 3. A Yes share costs $0.70 and pays $1.00 if Yes."
- **Live simulation** (seeded by market id with mulberry32, so it is deterministic across reloads):
  - Ticks follow a Poisson process with rate `λ = clamp(volumeUSD/2e5, 0.03, 0.4)` per second (cap 25 concurrent animating markets: only those on screen, via IntersectionObserver).
  - Each tick is an OU move on the logit: `x += θ(x₀−x)·dt + σ·√dt·N(0,1)`, with `θ = 0.002`, `σ = 0.35/√(L/1000+1)`, `x₀ = logit(real odds)`. The price wanders and is always pulled back to real data.
  - Tick side = sign of Δx. Tick size `$ = exp(N(ln(L/40), 0.8))`.
  - Velocity `v` = EMA of Δp per minute (τ = 60s).
  - Multi-outcome: tick the leader's logit, then renormalise the rest proportionally.
- **Agent signal object**, shown in every concept's agent layer:

  ```json
  {"market":"0xe179…","chain":100,"question":"…","p_yes":0.842,"confidence":"solid","cost_to_move_5pt_usd":412,"stale":"fresh","resolves_after":"2026-09-07T…Z","oracle":"reality.eth","arbitrator":"kleros","min_bond_xdai":10,"conditional_on":null}
  ```

  Snippet: `curl https://app.seer.pm/api/signal/100/0xe179…`. Label it "Illustrative endpoint (prototype)".

### 0.6 Global motion tokens and reduced motion
- Easing: `--ease-out: cubic-bezier(.2,.8,.2,1)`; `--ease-io: cubic-bezier(.65,0,.35,1)`.
- Durations: micro 120, hover 180, swap 300, panel 240, page 360ms.
- Springs: critically damped, ω = 12 rad/s, integrated in rAF, settling in ~400ms.
- Number tick: digit roll 240ms. A green or red underline flash of 600ms appears only when |Δ| ≥ 0.1pt.
- `prefers-reduced-motion`:
  - no particles, scrolling or rolls
  - values swap instantly; springs snap
  - the live chip reads `Live · motion reduced`
  - sim ticks still update numbers, at most once per 5s
- Every view is paused when `document.hidden`.

### 0.7 Filter content (all concepts hold it all)
- **Market States:** All, Reports not open yet, Reports open, Waiting for answer, In Dispute, Pending execution, Closed.
- **Verification:** All, Verified, Verifying, Challenged, Not Verified.
- **Chain:** All, Ethereum, OP Mainnet, Gnosis, Base.
- **Sort By:** Default, Liquidity, Volume, Open Interest, Opening Date, Creation Date, plus a Desc/Asc switch.
- **Toggles:** Show only conditional markets · Show only markets with rewards · Show only futarchy markets.
- **Minimum Liquidity:** numeric input.
- **Buttons:** Cancel / Apply.
- Each option shows a live count. Active filters become removable tags.

### 0.8 Market page parity (all concepts must place these)
- Breadcrumb `Home / Market`.
- Status strip.
- Star.
- `Answer on Reality.eth!` opens a dialog: Not answered yet, Choose an answer, Mark this question invalid, bond `10 xDAI`, Return / Answer.
- Meta: type, liquidity + help copy, volume, P&L, Verified / `Verify it`.
- Scalar estimate headline.
- Multi-scalar question list with Hide questions.
- Chart:
  - ranges `1D 1W 1M All Custom` (popover: Today / Last Week / Last Month / All, Cancel / Save)
  - export, legend with %, prev/next
  - honest 0–100 axis; end labels sit in a 64px gutter and never touch ticks
  - crosshair tooltip
  - note "Plots pool-implied price, may differ from odds"
- Outcome rows: each row selects the ticket outcome. `Add Liquidity`, `View pool details` (pool id, liquidity chart, balance ladder) and `New conditional market` live in a row "⋯" menu, not inline.
- Ticket:
  - order type `Market`, You pay + `sDAI` + balance + Max, direction arrow, You will get (rounded to 2 decimals; full value on hover)
  - avg price, price after buy, potential return, `Max slippage 1%` ⚙
  - `More`: Mint / Merge / Redeem
  - `Low balance? Bridge tokens from other networks`
  - CTA states: Connect / Enter an amount / Not enough balance.
- Major Events.
- Tabs: Comments / Related Conditional Markets / Top Holders / Activity.
- Conditional banner and unverified banner.
- IDs (conditionId, questionId, pool) with copy + explorer links.
- Mobile: a floating Trade button opens a bottom-sheet ticket.

### 0.9 Information layer: the same three answers, three different stagings
Every market renders WHO IS ASKING / WHAT IS PRICED / HOW TO USE THE SIGNAL as plain sentences, built only from 0.4 and 0.5:
- **WHO:** "Asked by 0xaa36…ae20 on 5 Apr 2025. Answered through Reality.eth; disputes go to Kleros. A wrong answer risks a bond of at least 10 xDAI (now 80). Kleros curators verified this market." Conditional markets add: "Only pays if *<parent>* resolves Yes."
- **WHAT:** the question, then "Resolves Yes if Reality.eth's final answer is Yes. Answers opened 7 Apr 2025; the earliest final answer is 7 Sep 2026, which becomes final 3.5 days after the last unchallenged answer." Scalar: "Pays along a scale from 0 to 100 (gwei); today's estimate is 9.09."
- **HOW:** the "what 70% means" sentence + confidence tier + c5 + staleness. Example: "Use it as a strong lean, not a certainty: about $412 would move it 5 points."

---

## CONCEPT A: SEAM ("every market is a line under tension")

**Thesis.** A price is the point where two groups of money balance. SEAM draws that point as a seam on a bar: buyers on each side push it, and the bar shows how hard each push is. Of the three concepts this one sticks closest to the binding DIRECTION (5-column trader cards, slim hero, icon rail).

### A.1 Home, 1440
```
┌ header 64 ─────────────────────────────────────────────────────────────────────┐
│ seer  Markets Leaderboard Create Market Policies▾ App▾ [⌕ Search by market… ] ? ◐ [Connect] │
├ beta 32 ───────────────────────────────────────────────────────────────────────┤
│ ▌ TRENDING 1/5  Will Le Pen be RN's candidate…   84.2%  YES ███████████▌░░ NO  [Yes][No] ● ○ ○ │ 72
├──┬──────────────────────────────────────────────────────────────────────────────┤
│▤ │ [Reports open ×][Verified ×][Gnosis ×]  2,947 → 412 markets    Create New Market · My collections │ 40
│◉ ├──────────┬──────────┬──────────┬──────────┬──────────┐
│✓ │ (av) Will Le…│ (av) BTC …│ …        │ …        │ …        │  5 cols × 248, gap 16
│⛓ │ YES 84.2 ▲0.6│          │          │          │          │  card 248×200
│⇅ │ ██████▌░░░░ │ seam bar   │          │          │          │
│⚑ │ [Yes 84¢][No 15¢]       │          │          │          │
│  │ $49.7k vol · 4d 3h ✓ ☆  │          │          │          │
│56│  (hover: drawer floats over the row below, grid never moves)
└──┴──────────────────────────────────────────────────────────────────────────────┘
```

**Components (sizes)**
- **Filter rail.** 56px icon strip with icons for State, Verification, Chain, Sort, Toggles, Liquidity. On hover or click it opens a 320px overlay panel (it never pushes the grid): accordion groups with counts, sticky Cancel/Apply on a 64px footer. The Esc key closes it.
- **Hero.** 1376×72 on --card, radius 12. Layout:
  - left 16px: `TRENDING n/5` micro label, then question 16/24 (1 line, ellipsis)
  - right: display % 32/40, then a 320×8 seam bar, then Yes/No buttons 64×40
  - dots 8px on the far right
- **Card (248×200, padding 16):**
  - avatar 32 + question 14/24 (2 lines, 48h)
  - leader row: `YES 84.2` 24/32 + delta chip 12/16 (green or red, ▲▼)
  - seam bar 216×8
  - buttons: two of 104×32 (`Yes 84¢` violet fill; `No 15¢` --nested with --no text). Multi-outcome: the top two get `Buy`, then `+N more`. Scalar: `Up` / `Down`.
  - footer 12/16: volume · countdown · tick mark (✓ verified; ▲ amber unverified; ◌ verifying; ! challenged, each with a tooltip) · star
- **Hover drawer.** 248 × auto (max 160), absolutely positioned under the card at z 10, radius 0 0 12 12. Rows of label : value at 12/16:
  - Status
  - Liquidity (+ OI; click → per-pool)
  - Type
  - Chain ↗
  - Kleros ↗
  - Reality.eth ↗
  - Rewards
  - Parent ↗
  - Resolves
  - then the HOW sentence, 2 lines max

  It never covers the Yes/No buttons.
- **Quick-buy popover.** 280×232, anchored to the clicked button, described in A.4.

### A.2 Market + trade, 1440
```
┌ header / beta ─────────────────────────────────────────────────────────────────┐
│ Home / Market   ● Reports open · Trading open      [Answer on Reality.eth!] ☆ ✓ │ 48
│ (av48) Will Marine Le Pen be the National Rally's candidate…?          32/40   │
│ Categorical · Liquidity $7.16k ⓘ · Volume $49.7k · P&L — · Verified · Gnosis  │ 24
├─────────────────────────────── THE ROPE 1376×160 ──────────────────────────────┤
│ YES 84.2%                                                          NO 14.8%    │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓|░░░░░░░░░░ (depth profile)   │
│ 0      25       50       75   ·ghost trail·  ↑seam (drag in ticket mode)   100 │
├──────────────── left 864 ────────────────────┬──────── ticket 496 ─────────────┤
│ BRIEF  WHO │ WHAT │ HOW   (3 columns × 272)   │  PULL TICKET (A.4)              │
│ Chart 864×320 (1D 1W 1M All Custom)           │                                 │
│ Outcomes (rows 56h, ⋯ menu) · Major Events    │                                 │
│ Tabs: Comments | Related Conditional | Holders | Activity                       │
│ IDs block (mono, copy)                        │  (sticky top 80)                │
└───────────────────────────────────────────────┴─────────────────────────────────┘
```

### A.3 Signature visual math (the Seam and the Rope)
- **Card seam bar (216×8).**
  - YES fill spans `[0, x]` with `x = p·W`; NO spans `[x, W]` as a hatch (45°, 2px pitch, --no).
  - The seam is a 2px gap with a 2×16 marker extending 4px above and below.
  - The seam position follows the sim price through the spring (ω = 12).
- **Flow particles (card).** Each sim tick spawns one 6×2 dash entering from the buyer's end (YES from the left, NO from the right). It travels to the seam at 160px/s with `--ease-out`, opacity 0.9→0, and is absorbed when it hits.
  - Dash length = `4 + 2·log10($)` px, clamped 4–12.
  - Up to 6 dashes per card.
- **Strain marks.** When |v| > 0.3pt/min, 1–3 hairline ticks (1×4) appear on the losing side next to the seam. They fade after 2s. This is the price velocity, shown without a chart.
- **The Rope (1376×160).** A mirrored depth profile around the centre line. For each price u in [0.01, 0.99]:
  - half-height `h(u) = clamp(H₀ · (k·L)/(u(1−u)) / (k·L/0.25), 8, 64)`
  - so the band is thin around 50% and thick near the extremes. It shows how much harder each point is to push, scaled by real liquidity.
  - Left of the seam fills --yes at 100%; right of the seam is the --no hatch.
  - Axis ticks every 10, labelled at 0/25/50/75/100.
- **Ghost trail.** The last 24h of seam positions, from `markets-charts.json` (or SIM history marked "illustrative"): 1×12 marks above the rope, opacity `0.6·e^(−age/8h)`.
- **Multi-outcome.** Leader (violet) vs rest (hatched), with 2px gaps between each other outcome's segment. The top 3 are labelled directly above their segments. 70+ outcomes collapse into "rest" with the count.
- **Scalar.** The axis runs lowerBound..upperBound with the unit. DOWN is left, UP is right. The seam sits at the estimate.

### A.4 Trade: "Pull ticket" (496 wide, panel, radius 16)
```
 Buy  [YES 84¢ | NO 15¢]   segmented 464×40, the selected side fills
 ┌ mini-rope 464×56: current seam │ target seam (draggable, 24×56 grip) ┐
 You pay  [  $ 120.00  ] sDAI · bal 0 · Max      ← typed input 464×56, 24/32 type
 Moves price 84.2 → 86.1  ·  avg 85.1¢  ·  you get 141.0 shares
 ┌ PAYOFF SPLIT 464×96 ─────────────────────────────────────────────┐
 │ If YES  ██████████████████  $141.00  (+17.5%)                      │
 │ If NO   ▏ $0.00                                                     │
 └──────────────────────────────────────────────────────────────────┘
 Market ▾ · Max slippage 1% ⚙ · More (Mint/Merge/Redeem) · Bridge link
 [ ███ Hold to buy YES ███ ]  464×56, hold 600ms   /  Connect / Not enough balance.
```
- Dragging the target seam sets the amount through the inverse `a(target)`. Typing an amount moves the seam through `pAfter`. Each drives the other live, every frame.
- The payoff bars animate their width over 180ms `--ease-out`. The return % uses the number roll.
- **Hold to confirm:** a fill wipes left to right over 600ms linear. Releasing early reverses it over 180ms. The keyboard path is Enter, which opens a confirm step (accessible equivalent). Success triggers the mock rejection toast.
- The card quick-buy is the same instrument shrunk: segmented outcome, typed input, a one-line "pays $X if YES", Confirm. No preset chips.

### A.5 Motion list
| element | trigger | spec |
|---|---|---|
| hero swap | every 6s; pauses on hover/focus | crossfade + 8px rise, 300ms ease-out |
| seam | sim tick | spring ω=12 |
| flow dash | sim tick | 160px/s, fades out |
| % digits | tick | 240ms roll + flash |
| hover drawer | hover | 180ms height 0→auto clip + opacity, 120ms delay to avoid flicker |
| rail panel | open | 240ms translateX(−16)→0 + opacity |
| rope | first load | draws from centre outward, 360ms |
| ghost trail | first load | fades in, staggered 4ms per mark |
| countdown | under 24h | dot pulses (scale 1→1.5, opacity, 1.6s loop) |

Reduced motion: no dashes, trail or pulse; the seam snaps.

### A.6 Agent touch
Pressing `A` or the header toggle `Human | Agent` switches every card footer to a mono line: `p .842 · solid · c5 $412 · fresh · T−322d`. The market page gets a "For agents" tab with the JSON signal, curl and Copy. The toggle state persists in localStorage.

### A.7 Mobile 390
```
header 56: logo · ⌕ · ☰        hero 72: question 1 line + %, swipe
filter chip "Filters (3)" → full-screen sheet        grid 2 cols × 171 (gutter 16, gap 16)
market: rope 358×96 · Brief as 3 swipe tabs · chart 358×200 · FAB "Trade" → bottom sheet Pull ticket
```

### A.8 Departures
- Hatched NO fill: needed for colour-blind separation.
- Hold-to-confirm replaces a click, with Enter as the fallback: the deliberate act signals risk.
- The rail overlays content instead of pushing it: the grid stays put, per DIRECTION.

---

## CONCEPT B: TRACE ("a seismograph for beliefs")

**Thesis.** A market is a signal recorded over time. TRACE treats every market as a live telemetry channel (Bloomberg crossed with an oscilloscope). The two sides are the space above and below the 50% line. Urgency is a wall the trace is running toward: the resolution date.

### B.1 Home, 1440 (live rows, 48px each, ~14 per screen)
```
┌ header 64 / beta 32 ───────────────────────────────────────────────────────────┐
│ ▌LIVE  BTC above $150k by Dec?  ~~~~~~~^~~~~~●▏   61.3%  ▲2.1/1h   [Yes][No] │ 72 hero
├─ QUERY BAR 48 ─────────────────────────────────────────────────────────────────┤
│ ⌥ [state:reports-open ×][verified ×][chain:gnosis ×][liq≥1k ×] + add filter   sort: Liquidity ↓ │
├────────────────────────────────────────────────────────────────────────────────┤
│ MARKET                         TRACE 7d ▸ live    ODDS     Δ1h   DEPTH  RUNWAY      │ 32 head
│ (av) Will Le Pen be RN cand… ✓  ▁▂▃▅▆▆▇▇▇▇●▏||  84.2 YES  ▲0.6  Solid  ███░░ 322d [Yes][No] │ 48
│ (av) Fed cuts in Dec? ▲unv      ▆▅▄▄▃▃▂▃▃▃●▏|   38.0 YES  ▼1.2  Thin   █████▏ 3d  [Yes][No] │
│ (av) Who wins F1 2026? 12 out.  ═Norris 41 ─ rest ●  41.0 NOR  ▲0.3  Fair  ███░ 41d [Buy][+11] │
└────────────────────────────────────────────────────────────────────────────────┘
```
**Column grid** (1376 total, 8px units): Market 448 · Trace 240 · Odds 112 · Δ1h 80 · Depth 80 · Runway 128 · Actions 184 · Star/tick 104.
- Header cells are click-to-sort (Liquidity, Volume, OI, Opening, Creation), which reflects into the query bar.
- **Row hover (48→48, no layout change):** a 120px panel slides out under the row, overlaying the next rows with a shadow-free --nested surface. It shows the drawer facts (A.1 list) on the left and the WHO/WHAT/HOW sentences on the right. Keyboard: ↑↓ move focus, Enter opens the market, Space pins the panel.
- **Query bar:** tokens are 24h, radius 8, --nested. `+ add filter` (or `/`) opens a 560px popover: groups in 2 columns with counts, Min liquidity input, Cancel/Apply. Typing `ver` autocompletes `verified`. Free text still goes to the header search.

### B.2 Market + trade, 1440
```
│ Home / Market  ● Reports open                         [Answer on Reality.eth!] ☆ ✓ │
│ Will Marine Le Pen be the National Rally's candidate…?                             │
│ 84.2% YES  ▲0.6 1h ▲3.1 24h   · Solid · last trade 4m (Fresh)                      │
├──────────────── SCOPE 1376×360 ─────────────────────────────────────┬ gutter 64 ──┤
│100 ┤                                    ┆now        ╳╳╳╳╳ WALL ╳╳╳ │ YES 84.2   │
│ 50 ┼───────────────────── midline ──────┆─────────── future band ── │            │
│  0 ┤ fill above midline=YES tint, below=NO hatch      ┆              │ NO 14.8    │
│    FLOW BARCODE 1376×32: ▮▯▮▮▯ (up=YES buys, down=NO buys, length=log $) │
│ 1D 1W 1M All Custom · export · ◀ ▶                                                │
├──────────── left 864 ────────────────────────┬──── WRITE-AHEAD TICKET 496 ───────┤
│ READOUT (WHO / WHAT / HOW as 3 stacked rows)  │ (B.4)                              │
│ Outcomes · Major Events · Tabs · IDs          │                                    │
```

### B.3 Signature visual math
- **Row trace (240×32):**
  - 7d history (real from `markets-charts`, otherwise an illustrative OU bridge ending at the real odds) is compressed into the first 208px.
  - The last 32px is a live window of 5 min of SIM ticks that scrolls left continuously at 32px per 5 min. On 60fps canvas it moves sub-pixel, so it reads as a slow, steady crawl.
  - The pen head is a 4px dot.
  - y = 32·(1−p). The 50% midline is a 1px --text-3 line at 30% opacity.
  - Area between line and midline: above = --yes at 24% alpha; below = --no hatch.
- **Flow barcode:** each tick is a 1px bar at its time-x. YES buys go upward and NO buys downward from the barcode centre. Length = `clamp(2·log10($), 2, 14)`.
- **Runway (128×8):** elapsed = `(now − openingTs)/(finalizeTs − openingTs)`, filled in --text-3; remaining is empty. Under 7 days the remaining part turns --warn. Text shows `322d`, `3d 4h` or `41m`.
- **Scope:**
  - an honest 0–100 y axis (scalar uses its real bounds)
  - a step-line at 2px
  - x runs from the range start to `finalizeTs`, so the future is visible
  - the wall is a hatched block from `finalizeTs` to `finalizeTs + timeout`, with the caption "Answer can become final here"
  - now = a 1px vertical line; the pen head pulses on each tick
  - end labels go in the 64px gutter, nudged apart (8px minimum separation, label engine)
  - crosshair tooltip: time + all outcomes
- **Velocity readout:** Δ1h and Δ24h from SIM + history, with ▲/▼ and green or red text.
- **Multi-outcome:** one line per top-3 outcome (leader violet 2px, others lavender and teal 1.5px, labelled in the gutter); the rest are summed into a single grey "others" line.

### B.4 Trade: "Write-ahead ticket" (496)
```
 Buy [YES 84¢ | NO 15¢]
 You pay [ $ 120.00 ] sDAI · bal 0 · Max            (typed input, 56h)
 ┌ PAYOFF CURVE 464×160 ─────────────────────────────────────┐
 │ payout $ ↑                         ____..----''  diminishing (impact)  │
 │           ___..--''●  you: $120 → $141 if YES                          │
 │ x: amount $0…max(5·c5, 2×bal)       drag ● along the curve             │
 └───────────────────────────────────────────────────────────┘
 Price after 86.1 · avg 85.1¢ · shares 141.0 · return +17.5%
 The scope above previews your trade: a dashed ghost segment rises from the pen head to 86.1
 Market ▾ · Max slippage 1% ⚙ · More · Bridge
 [ ⟶ slide to buy YES ................................ ] 464×56 track, 48 knob
```
- Payoff curve: `y(a) = a / avg(a)` with `avg` from 0.5. A 45° dotted "break-even" line shows where payout = stake. The curve's flattening visualises price impact.
- The input, the curve dot and the scope ghost segment stay in sync (rAF).
- **Slide to confirm:** the knob must travel past 90% of the track. Under 90% it springs back (ω = 14). Enter is the keyboard fallback with a confirm dialog.
- Quick-buy from a row is a compact 280×200 popover: input, one line of payout, a mini curve at 248×48, Confirm.

### B.5 Motion list
| element | trigger | spec |
|---|---|---|
| live window | continuous | scrolls; canvas redraws only visible rows, 30fps cap |
| pen head pulse | tick | scale 1→1.75→1, 240ms ease-out |
| barcode bar | tick | grows 0→len, 120ms |
| hero | every 6s | wipe-in from the right (clip-path), 300ms ease-io; pause on hover |
| row hover panel | hover | 180ms translateY(−8)→0 + opacity |
| query tokens | add / remove | FLIP 180ms; removed token collapses width 120ms |
| scope range change | click | morphs between ranges by path interpolation, 360ms ease-io |
| wall | page load | hatch fades in once, 300ms |
| <24h to wall | continuous | runway remaining blinks once per 2s at 40% opacity (no glow) |

Reduced motion: windows are static at the last value, no pulses, and range changes cut instantly.

### B.6 Agent touch
The `Human | Agent` header toggle turns the list into a machine table: the same rows, monospace, plus a `stream` column showing the latest JSON line `{"t":…,"p":0.842,"side":"yes","usd":38}`. The market page gets a "Tap this channel" panel with the JSON signal, a `wss://…/ticks` snippet labelled illustrative, and "Alert me when p ≥ [0.90]". That saves to localStorage and shows the toast "Saved on this device (prototype)". Agent elements use --agent blue only.

### B.7 Mobile 390
```
rows become 2-line items 72h: question (1 line) / trace 120×24 · 84.2 · runway 48
query bar collapses into a "Filters 3" chip + horizontal token scroll
market: scope 358×200 with the wall · readout as an accordion · FAB → sheet with payoff curve 326×120 and slide-to-buy
```

### B.8 Departures
- Rows instead of cards: DIRECTION permits this, and it gives about 3× the density.
- Blue is used for agents only.
- Slide-to-confirm.
- The x axis extends into the future: urgency becomes literal distance.

---

## CONCEPT C: ASSEMBLY ("every market is a chamber that votes with money")

**Thesis.** A market is a standing assembly: each seat is 1% of belief, and seats change sides as money moves. A non-trader understands a chamber at a glance (who convened it, what the motion is, whether there is quorum). The information layer is "the Minutes".

### C.1 Home, 1440
```
┌ header 64 / beta 32 ───────────────────────────────────────────────────────────┐
│ ON THE FLOOR ▸ Will BTC close above $150k?  ●●●●●●●●●●○○○○○○  61 seats YES ▲2 · [Yes][No] │ 72
├ DOCKET 48: All 2947 · Not open 112 · Reports open 1,804 · Waiting 210 · Dispute 9 · Pending 61 · Closed 751 │ [Rules ⚙ 3] │
├─ tags row 40 + Create New Market · My collections ─────────────────────────────┤
│ ┌ card 336×232 ┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   4 cols × 336, gap 16       │
│ │(av) Will Le Pen… ✓ ☆      │                                                    │
│ │ BENCH 2×25 dots 304×32    │ ●●●●●●●●●●●●●●●●●●●●●○○○○ (swing seat half-filled)  │
│ │ 84 YES seats · 15 NO      │                                                    │
│ │ [Yes 84¢]   [No 15¢]      │                                                    │
│ │ Quorum: Solid · $49.7k · closes 322d │                                         │
│ └───────────────────────────┘                                                    │
```
- **Docket:** state tabs are 32h text tabs with counts, and the active one gets a 2px violet underline. `Rules` opens a right drawer (400px, overlay, radius 16 left) with Verification, Chain, Sort + direction, the three toggles, Min liquidity, and sticky Cancel/Apply. The `Rules` badge shows the count of active non-state filters.
- **Card (336×232, padding 16, 4 columns):**
  - avatar + question 14/24, 2 lines
  - bench 304×32: 2 rows × 25 seats, seat 10px, pitch 12.16 → snapped to 12 + 4px end padding
  - seat-count line 12/16
  - buttons 2 × 144×40
  - quorum footer 12/16
- **Hover:** a "Minutes" drawer (336 wide, max 168) floats below with WHO / WHAT / HOW sentences plus links (chain, Kleros, Reality.eth, parent). Same rules as SEAM.
- 4 columns instead of 5 is a deliberate trade-off (see C.8).

### C.2 Market + trade, 1440
```
│ Home / Market  ● Reports open · Trading open      [Answer on Reality.eth!] ☆ ✓ │
│ Will Marine Le Pen be the National Rally's candidate…?                          │
├──────── CHAMBER 864×400 ───────────────────────┬──── SEAT TICKET 496 ───────────┤
│              . · • ● ● ● ● ● ○ ○ • · .          │ (C.4)                          │
│         ● ● ● ● ● ● ● ● ● ● ● ○ ○ ○ ○ ○         │                                │
│      ● ● ● ● ●  84 YES   15 NO  ○ ○ ○ ○ ○      │                                │
│    YES side (left)   swing seat ◐   NO (right) │                                │
│  Quorum ████████░░ Solid · c5 $412 · Fresh 4m   │                                │
├──────── THE MINUTES 864 ───────────────────────┤                                │
│ CONVENED BY  0xaa36…ae20 · 5 Apr 2025 · verified by Kleros curators            │
│ THE MOTION   question · resolves Yes if… · answers open… · earliest final…     │
│ THE CLERK    Reality.eth · bond ≥10 xDAI (now 80) · 3.5-day challenge window   │
│ THE COURT    Kleros (0x6815…91dc) · disputes: 0 pending                         │
│ READING      "About 5 in 6. A strong lean; ~$412 moves it 5 points."           │
├ Chart · Outcomes · Major Events · Tabs · IDs ────────────────────────────────────┤
```

### C.3 Signature visual math
- **Chamber.** 100 seats in 5 concentric arcs with seat counts [15, 18, 20, 22, 25] (sum 100):
  - radii 120 to 312 in 48px steps, centred at the bottom of an 864×400 box
  - seat diameter 14
  - seats sorted by angle from 180° to 0° across all rows (a parliament layout: interleave rows by angle)
- **Allocation:** seats per outcome by the largest-remainder method on odds (excluding null/Invalid). YES takes the leftmost seats, NO the rightmost.
- **Swing seat:** the seat at the boundary is filled clockwise as a pie of the fractional remainder (`p·100 − floor`). This is the only partial seat. A 1px ring marks it.
- **Seat flips:** on a sim tick, when floor(p·100) changes, the boundary seat flips colour. Crossfade 240ms ease-io + scale 1→1.25→1 at 240ms. Hollow (NO) ⇄ filled (YES).
- **Multi-outcome:** seats are coloured leader violet, second lavender #9C6FFF, third teal #2FD4C0, rest ink. Labels sit directly outside the arc at each bloc's angular midpoint with 8px leader lines. With more than 12 outcomes, blocs under 2 seats merge into "others (n)".
- **Scalar:** "seats" = position on the range. Left bloc = DOWN, right = UP, plus the estimate label above the swing seat.
- **Quorum meter (240×8):** fill = tier index / 4 (Thin, Fair, Solid, Deep). Stale state hatches the meter.
- **Home bench:** 50 seats (each = 2%), a straight 2×25 layout with the same allocation and swing-seat rules.

### C.4 Trade: "Seat ticket" (496)
```
 Take seats on  [YES 84¢ | NO 15¢]
 You pay [ $ 120.00 ] sDAI · bal 0 · Max                        typed input 56h
 Your effect: YES 84 → 86 seats      the chamber previews it: 2 ghost seats (dashed ring) flip
 ┌ RECEIPT 464×120 ───────────────────────────┐
 │ shares        141.0        avg 85.1¢       │
 │ if YES   →   $141.00   (+17.5%)  ████████  │
 │ if NO    →   $0.00                ▏        │
 │ price after 86.1 · slippage 1% ⚙           │
 └────────────────────────────────────────────┘
 Market ▾ · More (Mint/Merge/Redeem) · Bridge
 ( ◯ Hold to take seats )  464×56, 800ms ring fills around the label
```
- While the amount is non-zero, the seats that would flip are drawn as dashed rings in the chamber, blinking at 50% opacity on a 1.2s loop. This makes price impact physically visible.
- Hold-to-confirm: an 800ms ring stroke-dashoffset animation, with Enter as the fallback dialog.
- Card quick-buy (280×216): outcome, typed input, "+2 seats · pays $141 if YES", and the hold button at 248×40.

### C.5 Motion list
| element | trigger | spec |
|---|---|---|
| chamber assembly | load | seats drop in by row, 12ms stagger, 360ms ease-out (total ≤ 900ms) |
| seat flip | tick | 240ms crossfade + scale; a 2px tick mark on the YES/NO count numbers |
| swing seat | tick | pie angle tweens 300ms ease-io |
| hero "On the floor" | every 7s | cross-dissolve 300ms; bench re-allocates with a 120ms stagger |
| docket counts | filter | number roll 240ms |
| Rules drawer | open | 240ms translateX(16)→0 |
| Minutes drawer | hover | 180ms |
| ghost seats | amount typed | dashed ring 1.2s opacity loop |
| quorum | stale | hatch drifts 1px/s (stops under reduced motion) |

Reduced motion: no drops, flips or drift; seats re-render instantly.

### C.6 Agent touch
"Machine minutes" is a toggle on the Minutes section that renders the same content as the JSON signal plus curl. Each Minutes line maps to a JSON key highlighted in --agent. The home `Human | Agent` toggle swaps each card's quorum line for `p · tier · c5 · staleness · resolves_after`.

### C.7 Mobile 390
```
docket = horizontal scroll tabs + Rules icon; cards 1 col 358×216 (bench 326×32)
market: chamber 358×200 (radii scaled 0.45, seats 8) · Minutes as accordion · FAB → sheet with receipt + hold
```

### C.8 Departures
- 4 cards per row instead of DIRECTION's 5: the bench needs 304px.
- Teal and lavender are added for multi-outcome blocs only.
- The hemicycle is a dot-matrix chart, not a donut: discrete seats, no arc-angle reading. Flag this to the user since donuts are banned.

---

## 1. Interaction checklist (all concepts; Codex writes one e2e per line)
- [ ] A click anywhere on a card or row opens the market. Buy, star, tick and drawer links don't.
- [ ] The hover drawer also opens on keyboard focus and on tap-pin. It never covers the Yes/No buttons and never moves the grid.
- [ ] Quick-buy has a typed amount and live payout, and closes on Esc or click-away. The CTA cycles Connect → Enter an amount → Not enough balance.
- [ ] Every filter in 0.7 is reachable and works on the real data. Apply/Cancel are respected, tags are removable, and URL params are kept in sync.
- [ ] The hero rotates one market at a time, pauses on hover, and has dots. No marquee.
- [ ] WHO, WHAT and HOW sentences render for 100% of markets, with fallbacks for missing fields ("Unknown arbitrator 0x…").
- [ ] Ticket: typed input ↔ signature visual in both directions; hold/slide confirm with an Enter fallback.
- [ ] Theme toggle labels flip. The light theme passes contrast (text 4.5:1, marks 3:1).
- [ ] The Agent toggle works and Copy writes to the clipboard.
- [ ] Every element marked SIM (live ticks, last trade, illustrative history) carries a visible `SIM` micro-chip in the prototype.
- [ ] Reduced motion is honoured, and nothing animates while the tab is hidden.

## 2. Ranked recommendation
1. **SEAM: build first.**
   - Most visceral YES-vs-NO: the seam and the dashes pushing it are read in under a second.
   - Its "drag the price to where you believe it should be" ticket is the most original trade instrument, and it teaches price impact without jargon.
   - It fits DIRECTION almost exactly (5-column trader cards, slim hero, icon rail, hover drawer), so it carries the least risk with the user.
2. **TRACE: the strongest information-finance story.**
   - Time, velocity, staleness and the resolution wall make the market feel urgent and alive.
   - The dense rows deliver the "Etherscan for Seer" density, and agents read it naturally.
   - Risk: rows depart from the card grid the user chose. Offer it as a `Rows` view inside SEAM if the user likes it.
3. **ASSEMBLY: the best for question-askers and non-traders.**
   - The Minutes metaphor (convened by, motion, clerk, court, quorum) answers Seer's three questions most memorably.
   - Risks: the hemicycle reads close to a donut for 2-outcome markets, and 4 columns is less dense.
   - Recommended salvage: lift the Minutes into SEAM's Brief section and the quorum meter into SEAM's footer.

**Suggested final:** SEAM as the product, with TRACE's scope + wall as its market chart, and ASSEMBLY's Minutes as its information layer.
