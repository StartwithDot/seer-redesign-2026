# Explorer: concepts v2 (Direction B, "Feed with a trending rail")

Sources used: the 13 contact sheets I viewed (Manifold rows, Metaculus ranked bars, CoinGecko/Uniswap in-row sparklines, Dexscreener density, the app.seer.pm 4-column grid as the thing to avoid), the kit (`dark-mode-board.webp`, `color-palette.png`, `trade-ticket.png`), the audit (AUDIT_SUMMARY, CHART_AUTOPSY, PARITY_MAP plus DRAFT, flows, UNOBSERVED, SCENARIO_REPORT), and `data/*.json`.

**What the real data says and what it means for the design** (all of this binds every concept below):

| Fact in `markets-search.full.json` (100 markets) | Design consequence |
|---|---|
| `categories`: 99 × `misc`, 1 × `sports` | The topic rail can't come from the API. Explorer assigns topics from the question text with a deterministic keyword map (§S6). A tooltip on the rail says so. Unmatched markets show under **All** only. |
| `odds` hold the leading probabilities; `Invalid` is always `null`; the odds don't add to 100 (35.3 + 74.5 = 109.8) | The big numeral is `odds[i]` as given. The Σ disagreement goes in a tooltip, never a headline. |
| `templateId` 2 = 74 categorical (binary or multi). `templateId` 1 = 25: 14 scalar (`DOWN/UP/Invalid`) and 11 multi-scalar. `templateId` 3 = 1 multi-categorical | Row variants: **Yes/No**, **Up/Down** and **Buy-per-outcome** (top 3 + "N more"). |
| 17 have a non-zero `parentMarket.id`; `parentOutcome` 0 = Yes, 1 = No | Conditional badge in the row. A banner on the market page names the parent outcome and the collateral token. |
| 88 have `verification.status: verified`; 12 have no verification | Unverified badge in the row and an amber banner on the market page. |
| Odds history exists only for a few ids (`market-chart.json`, `markets-charts.json`, both truncated) | No fake sparklines. If a series exists, draw it. If not, draw an **odds strip** (a 0–100 track with the current mark), labelled in a tooltip. Live mode (`?live=1`) batch-fetches `markets-charts?ids=` for the visible rows, as the live app does. |
| `get-pnl-leaderboard` rows carry `score`, `tier` and `scoreBreakdown.components` (returns, profitFactor, hitRate, lossBurn, breadth) | The leaderboard can show the score's anatomy with real numbers. |
| `incentive` > 0 for 1 market; no futarchy field in the sample | The Rewards filter works on real data. The Futarchy filter shows the empty state in sample mode and passes the API parameter in live mode. |

---

## Concept 1 — "Open Floor": rich-row feed with a docked quick-trade

**(a) Thesis.** Every market is one confident line you can read, compare and trade without leaving the feed. The price is the probability, and the quick-trade shows what a dollar buys.

**Math:**
- Price p = odds/100 sDAI per outcome share.
- Shares = A / p̄, where p̄ is the average fill price.
  - Live mode: the router quote.
  - Sample mode: the recorded scenario-01 quote for that market, or a spot estimate labelled "≈ at current price".
- Payout if the outcome wins = shares × 1 sDAI. Profit = A(1 − p̄)/p̄.
- Scalar estimate = L + (U − L)·p_UP/(p_UP + p_DOWN). Bounds ≥ 1e15 are scaled by 1e−18.

**(b) Composition — desktop, 1440:**
```
┌ header 64 ─────────────────────────────────────────────────────────────────────────────┐
│ ⚡seer  Markets Leaderboard Create Market Policies▾ App▾ [⌕ Search markets, outcomes… /] ◐ ? [⛓][0x00…dEaD|24.69 xDAI▾]│
└────────────────────────────────────────────────────────────────────────────────────────┘
 Beta · can still be unstable (12px strip, dismissible per session)
┌ rail 232 ─────┐┌ feed (fluid) ─────────────────────────────────────────┐┌ rail 320 ──────────┐
│ TOPICS        ││ All markets · 100     Sort: Liquidity ▾ ↓  [+ Create New Market] [My collections]│
│ ● All     100 ││┌row 96────────────────────────────────────────────────┐││ TRENDING  by volume │
│   Politics 51 │││(44)  Will Marine Le Pen be the National Rally's…    │││ 1 Knesset…   $5.1K ▲2.1│
│   Crypto   27 │││      $7.2K vol · Reports open Apr 7 2025 · ●Open ✓ │││ 2 Le Pen…    $11.7K —  │
│   Sports    3 │││      ╱╲_╱‾‾ 120×32     84%  [Yes 84¢][No 15¢]       │││ …5 rows             │
│   Tech      8 ││└──────────────────────────────────────────────────────┘││ ENDING SOON          │
│ SHOW          ││┌row 96 multi──────────────────────────────────────────┐││ Jan 1  BASEFEE…  9.09│
│ ◉ Open ◯Verif │││(44)  Which party…Knesset 2026?   COND ⚠UNVERIFIED  │││ …5 rows             │
│ FILTERS  ▾    │││      Yashar ███████ 60.8% [Buy]                     │││┌ DOCK (sticky) 320 ─┐│
│ State   All ▾ │││      Likud  █████   38.1% [Buy]    +2 more          │││ Le Pen · Yes 84¢    ││
│ Verif.  All ▾ ││└──────────────────────────────────────────────────────┘││ $5.00  (+$1+$5+$20+$100)│
│ Chain   All ▾ ││ … infinite scroll (100/page), skeleton rows 96         ││ ≈5.9372 sh · pays $5.94│
│ Cond. ◯ Rew ◯ ││                                                        ││ [  Confirm  ] [×]   ││
│ Futarchy ◯    ││                                                        │└─────────────────────┘│
│ Min liq [   ] ││                                                        │                      │
│ [Cancel][Apply]│                                                        │                      │
└───────────────┘└────────────────────────────────────────────────────────┘└──────────────────────┘
```

**Mobile (390):**
```
[⚡seer      ⌕  ◐  ≡ ]
[All·Politics·Crypto·Sports·Tech·Filters⚙ ]  ← horizontal tab bar, edge-fade
▸ Trending (5)   ▸ Ending soon (5)        ← collapsible, closed by default
┌ row 112 ─────────────────────────────┐
│(32) Will Marine Le Pen be the…  84%  │
│ $7.2K vol · Apr 7 2025 · ●Open       │
│ ╱╲_╱‾‾ 96×24     [Yes 84¢][No 15¢]   │
└──────────────────────────────────────┘
Tap Yes → bottom sheet: ticket (amount, chips, payout bar, Confirm)
```

**Market page:**
```
Home / Politics / Market                        [☆][✓ Verified]
┌ conditional banner (amber-soft) — if parentMarket ────────────────────────────┐
│ Conditional on "Will the National Rally's candidate win…" being "Yes". If the  │
│ parent resolves otherwise, these tokens are worthless. Collateral: LEPEN_NRYES │
└────────────────────────────────────────────────────────────────────────────────┘
(44) Will Marine Le Pen be the National Rally's candidate…   [H1 40]
Categorical · Liquidity $7.2K ⓘ · Volume $11.7K · P&L 0.00 · ●Reports open
┌ chart 8 col, 520 ────────────────────────────────┬gutter 72┐┌ ticket 4 col sticky ┐
│100 ┤                                              │ Yes 84.2││ Buy  Yes 84¢|No 15¢ │
│ 50 ┤  ‾‾‾‾╲___/‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                 │ No 14.8 ││ You pay [1.00] sDAI▾│
│  0 ┤____________________________________________ │         ││ Bal 0 sDAI   [Max]  │
│    May 2025   Jul   Sep   Nov   Jan 2026   Mar   │         ││ You will get 1.1868 │
│ [1D 1W 1M All Custom] ⓘ  ⤓  ‹ ›   Pool price, not trades ⓘ  ││ Avg/After/Return    │
└────────────────────────────────────────────────────────────┘│ Max slippage 1% ⚙   │
OUTCOMES (same row grammar, 64 high)                           │ [Not enough balance.]│
 #1 (24) Yes  ████████ 84.2%   [Yes]  ⋯ ← Add Liquidity /     │ More ▸ Mint Merge Redeem│
 #2 (24) No   ██ 14.8%         [Buy]  ⋯   View pool details / └─────────────────────┘
 #3 Invalid   210.85 SER-INVALID  0%  ⓘ   New conditional market
MAJOR EVENTS  1 UPCOMING · JAN 1, 2027 00:00 UTC Reality.eth Resolution [Answer on Reality.eth!]
[Comments][Related Conditional Markets (2)][Top Holders][Activity]
```

**Ticket (kit vocabulary).** Two tonal tiles, Yes 84¢ (solid violet) and No 15¢ (violet-soft). Amount numeral 40/600 tabular, with chips +$1 +$5 +$20 +$100. Payout bar. Confirm (violet) and a square × button.

**Leaderboard.** Same row grammar at 64px: rank numeral 28, avatar 32, account, Score numeral, tier word, then P/L, Volume, ROI, Markets. A 5-tick anatomy micro-bar from `scoreBreakdown` sits under Score.

**Create.** Four type rows, each previewing a real feed row of that type.

**Menus.** One HoverMenu family, 280px wide, 40px items.

**(c) Type and colour.**
- Inter Tight throughout. Sizes: 15/500 question, 12 meta, 28/600 numeral; market H1 clamp(26, 2.4vw, 40).
- Violet = Yes, Up, the selected state and the primary action. Ink-grey = No/Down.
- Status: green Open, amber resolving, grey closed. Amber-soft for warning banners.
- Series: violet, teal, blue, then grey.
- Departures: see §S2.

**(d) Signature: the Payout Bar.**
- What you see: in the dock or sheet, a 288×12 track split at p. The left part is the cost and the right part is the profit if right. Pressing a chip springs the bar and ticks the numeral (two digits per tick at most).
- What it explains: why 84¢ pays $1.19 and why 15¢ pays $6.67. Price, probability and payoff become one picture.
- Micro-interactions:
  - Hovering Yes/No for 90ms opens a 320×196 preview popover.
  - Clicking pins the selection to the Dock.
  - Sparklines draw in on first entry (420ms, 30ms stagger, max 8 rows).

**(e) Parity.** The full table is in the Build spec; this concept is the chosen one.

**(f) Flow 01 redesigned.**
- Live: home → search → market → select Yes → type amount → read the quote (6 steps).
- New: type in the search pill → click Yes in the row → press a chip and read the quote in the Dock (3 steps).
- The market page stays one click away for research.

**(g) Why it isn't slop or a reskin.**
- No tile grid: one 96px horizontal row per market with real imagery, a direct-labelled numeral and inline actions.
- The left rail is a query instrument, not app navigation.
- The right rail is two ranked ledgers plus a live ticket, not widgets.
- Live layout = 4-column donut tiles; this layout = ranked rows with a price and its payoff.

**(h) Risks.**
- 96px rows give about 7 per 900px viewport, which is less dense than the 28px ledger. Mitigation: a compact density toggle (72px) on desktop.
- Popover-on-hover can flicker. Mitigation: 90ms intent delay and 220ms leave delay; one popover open at a time.

---

## Concept 2 — "Front Page": a lead market per topic, ranked rows beneath

**(a) Thesis.** Read the market like a newspaper: each topic opens with its most-traded question, shown with an honest chart, and the rest follow as a ranked list.

**Math:**
- Lead = argmax `volumeUSD` within the topic.
- Ranked rows are ordered by `liquidityUSD`.
- The lead chart uses the pool-price series on a fixed 0–100 axis.

**(b) Composition — desktop:**
```
[header]            [⌕ search]                         [Create New Market][My collections]
┌ rail 232 ┐┌ POLITICS ─────────────────────────────────────────────┐┌ Trending / Ending ┐
│ All      ││┌ LEAD 8col×320 ────────────────────────────────────┐ ││ 1 …  ▲2.1        │
│ Politics ●│││(64) Knesset 2026?          chart 0–100, end labels│ ││ 2 …              │
│ Crypto   ││││ Yashar 60.8 [Buy] Likud 38.1 [Buy]   gutter 72    │ ││ ENDING SOON      │
│ Sports   │││└───────────────────────────────────────────────────┘ ││                  │
│ Tech     │││ 2  (32) Le Pen candidate?   ▁▂▅  84% [Yes][No]  (72) ││                  │
│ Filters▾ │││ 3  (32) …                         68% [Yes][No]     ││                  │
│          ││ [Show 48 more in Politics →]                           ││                  │
│          ││ CRYPTO ─ lead + 5 rows … (scroll-spy moves the rail ●) ││                  │
└──────────┘└───────────────────────────────────────────────────────┘└──────────────────┘
```

**Mobile:** the tab bar jumps to a section; each section is a lead block (chart 212px) plus 5 rows; Trending is collapsible on top.

**Other screens:**
- Market page: the lead block at full size (chart 520px), with ticket and outcomes as in Concept 1.
- Leaderboard: lead = rank 1 with a score-anatomy figure, then ranked rows.
- Create: a "front-page preview" of the new market.
- Menus: the same HoverMenu.

**(c) Type and colour.** Same as Concept 1, plus a section kicker (12/600 caps, tracking +4%) and lead numerals at 40/300.

**(d) Signature.** The lead chart's line draws in as the section enters (600ms), and scroll-spy moves the rail marker. Hovering a ranked row swaps its sparkline into the lead (a crossfade, 140ms).

**(e) Parity.** The same targets as Concept 1. The filter panel lives in the rail. Every row has a Yes/No that opens the sheet ticket.

**(f) Flow 01.** Search → filtered sections → click Yes → sheet (3 steps).

**(g) Not slop.** Editorial sectioning (FT/Pudding) with real charts, not a tile grid.

**(h) Risks.**
- 99% of markets are `misc`, so sections rest entirely on inferred topics. Politics is about 51 markets and Sports only 3, so the sections are badly unbalanced.
- Lead blocks repeat a hero four times and push the page past 4600px on mobile.
- Only a handful of markets have history, so most leads would show the odds strip instead of a chart and the "front page" falls flat on sample data.

---

## Concept 3 — "Split Desk": feed on the left, live preview and ticket on the right

**(a) Thesis.** Browsing and deciding happen side by side: one click puts any market's chart, outcomes and ticket next to the list without losing your place.

**Math:** the same as Concept 1. The preview carries the full outcome vector and the Σ-of-odds tooltip.

**(b) Composition — desktop:**
```
[header]
┌ rail 200 ┐┌ feed 6col (rows 80) ───────────────┐┌ preview 6col sticky ─────────────────┐
│ topics   ││ ▸(32) Le Pen candidate?  84% [Y][N]││ (44) Will Marine Le Pen…  ●Open ✓    │
│ show     ││  (32) Knesset…        60.8% [Buy]  ││ chart 360, 0–100, end labels gutter  │
│ filters  ││  …  selected row = violet-soft bar ││ outcomes ranked bars                 │
│          ││                                    ││ ticket (kit) + payout bar            │
│          ││ Trending/Ending → tabs above feed  ││ [Open market page →] (Enter)         │
└──────────┘└────────────────────────────────────┘└──────────────────────────────────────┘
```

**Mobile:** there is no split. A tap opens the preview as a full-height sheet, which ends up the same as Concept 1.

**Other screens:**
- Market page = the preview at full width.
- Leaderboard = rows on the left, account preview on the right (score anatomy, P/L).
- Create = form on the left, live row preview on the right.

**(d) Signature.** Selecting a row runs a shared-element morph: the avatar and numeral fly into the preview (view transition, 280ms). Arrow keys walk the list and the preview follows. Click selects; Enter or double-click opens the full page.

**(f) Flow 01.** Search → click the row → click Yes in the preview → chip (3 steps), with the chart visible throughout.

**(g) Not slop.** A master-detail instrument (a mail-client or Linear pattern) applied to markets.

**(h) Risks.**
- At 1440 the feed column is about 560px, so median questions (~90 characters) wrap to two lines.
- It displaces the Trending/Ending rail the user explicitly chose into tabs.
- Two click semantics (select vs open) on the feed are a learning cost on a consumer surface.
- The preview needs per-market history, which the sample mostly lacks.

---

## Decision

**I chose Concept 1, "Open Floor"** (the user to confirm).
- It is the direction the user wrote down: left topic rail, one roomy row per market, right rail of Trending and Ending soon, hover quick-trade with amount chips, and a bottom sheet on mobile.
- It is the only one that works fully on the real sample data: every row is complete with or without history, and topics only filter rather than structure the page.
- It cuts the core trade flow from 6 steps to 3.
- Its signature (the Payout Bar) explains the one thing a newcomer gets wrong about a prediction market: price = probability = payoff.

**Why the others lost:**
- **Concept 2, rejected.**
  - Its structure depends on topic data that doesn't exist (99 % `misc`), so balance and "lead" choice would be artefacts of a keyword map.
  - Repeated lead blocks drift toward the forbidden hero pattern and break the 4600px mobile height guard.
  - With history for only a few ids, most lead charts would degrade to strips.
- **Concept 3, rejected.**
  - Halving the feed width makes long Seer questions wrap.
  - It removes the user's chosen Trending/Ending rail.
  - Select-vs-open semantics slow casual browsing.
  - On mobile it collapses into Concept 1 anyway.
  - Its best idea (keyboard walk with ↑/↓ and the preview following) is adopted into Concept 1 as row focus: ↑/↓ moves focus, Y/N opens the quick-trade, Enter opens the market.

---

## Build spec

App: `apps/explorer` (Vite + React 19 + TS strict, plain CSS + tokens, `motion`, d3-scale/shape/array, `@tanstack/react-virtual` for the feed, leaderboard and activity). Hash router. Real JSON through adapters. Footer carries one "Sample data" chip.

### S1. Screens and routes
| Route | Screen | Notes |
|---|---|---|
| `#/?topic=&q=&state=&verif=&chain=&sort=&dir=&cond=&rewards=&futarchy=&minLiq=&show=` | Feed | Every control is mirrored in the URL. `q` is also written as `marketName` for parity H-19. |
| `#/m/:id/:slug` | Market page | Deep-linkable. Esc and the Back icon return to the feed with scroll restored. |
| `#/m/:id/:slug?trade=yes` | Market page with the ticket preselected | Target of the mobile sheet's "Open market". |
| `#/leaderboard?period=&app=&chain=&sort=&dir=&page=&q=` | Leaderboard | |
| `#/create` (+ `?step=1`) | Create step 1 | Wallet-gated (C-04). |
| `#/collections/default` | Collections | Sign-in gate, then the empty state. |
| `#/account`, `#/deposit`, `#/portfolio`, `#/trade-collateral` | Unobserved plate | One line, "Not in this build", plus a link to `https://app.seer.pm`. |
| `#/policies/verified`, `#/policies/rules` | Unobserved plate | Same. |

### S2. Tokens (`apps/explorer/src/product.css`; surfaces and text come from `packages/ef/tokens.css`)
| Token | Dark | Light | Role |
|---|---|---|---|
| `--bg / --card / --nested` | #101013 / #1A1A1E / #1F1F24 | #F7F7F9 / #FFFFFF / #F0F0F3 | Page / row / nested (chips, tracks) |
| `--text / --text-2 / --muted` | #EDEDF2 / #A8A8B3 / #67676F (muted not used for <14px labels) | #17171C / #5C5C66 / #8E8E99 | Text |
| `--violet` | #7B3AFF | fill #7B3AFF, text #6C2BD9 | Yes/Up button, selected, primary, series 1 |
| `--violet-soft / --violet-soft-text` | #241E33 / #9C6FF2 | #EFE9FC / #6C2BD9 | No/Down button, secondary |
| `--ink` | #A8A8B3 | #5C5C66 | No series line, "others" |
| `--series-2` (teal) | #2FD4C0 | #0E9A8B | Outcome 2 line, direct label |
| `--series-3` (blue) | #5B9DFF | #2F6FD6 | Outcome 3 line |
| `--st-open` | #3DDC97 | #12915F | Trading open dot |
| `--st-resolving` | #F5B84A | #B9770E | Reports open / Waiting / In dispute / Pending execution dot, unverified and conditional badge |
| `--st-closed` | #67676F | #8E8E99 | Closed |
| `--delta-up / --delta-down` | #3DDC97 / #FF5C72 | #12915F / #D1334A | Trending Δ only, always with ▲/▼ |
| `--live` | #FF5C72 | #D1334A | LIVE dot (kit) on markets with a series tick < 60 s (live mode only) |

Radii 16/12/8. Spacing on the 4px scale. Durations: `--t-fast` 90, `--t-base` 140, `--t-slow` 420; signature 280–420.

**EF departures:**
| Departure | Reason |
|---|---|
| Status colours: green/amber/grey instead of the live purple/cyan/teal | Status must read as open vs resolving vs done, not as three brand-ish hues. The product guide already assigns these for Explorer. |
| Two series families (teal, blue) for multi-outcome lines | The 3 most likely outcomes must be distinguishable. Outcomes past the top 3 render in ink-grey with direct labels on hover. |
| Big tabular numeral 28/600 in rows (above the 15/500 title weight) | Probability is the primary object of a prediction-market row. |
| JetBrains Mono 12 for addresses, pool ids and the exact shares string | Hash legibility. Already allowed by the identity guide. |
| Amber-soft banner surface (#2A2216 / #FDF3E1) | Conditional and unverified warnings must not be violet, which means action. |

### S3. Components (fixed sizes)
| Component | Size | Content rules |
|---|---|---|
| Header | 64 desktop / 56 mobile; search pill 360×40 | ⌘K or `/` opens the palette (groups: Markets, Outcomes, Collections, Accounts) |
| Beta strip | 28 high, 12px | Copy G-01. Dismiss is stored in sessionStorage. |
| TopicRail | 232 wide, sticky; items 36 high | Label + count (tabular, right). "Show" toggles are 2 switch rows. Filters is a collapsible group. |
| FilterGroup select | 200×36 HoverMenu | Single-select. Staged; Apply/Cancel 96×36 each. |
| MinLiquidity input | 200×36, numeric, `$` prefix | |
| FeedHeader | 48 high | Title "All markets · N", Sort HoverMenu 168×36, Dir toggle 36×36, Create New Market 184×40 (`.btn-bubbles`), My collections 148×40 |
| **MarketRow** | **96 high** desktop (72 compact), **112** mobile; padding 16/20; radius 16 | Grid: avatar 44 · body (fluid, min 0) · spark 120×32 · numeral 88 · actions 152. The question clamps to 2 lines (ellipsis + tooltip). Meta line 12px: `$X vol · Reports open MMM D YYYY · ●Status · ✓` |
| RowBadges | Fixed slot 96 wide, 20 high, 12px | `COND` (amber-soft) and `UNVERIFIED` (amber-soft, ⚠). Max 2, stacked horizontally. Left edges are aligned on every row. |
| Spark / OddsStrip | 120×32 (mobile 96×24) | Series: step-line, y fixed 0–100, a 1px baseline at 50. No series: a 0–100 track 4px high with a mark at p and the tooltip "No price history loaded". |
| Numeral | 88×32, right-aligned, 28/600 | Leading outcome % (no decimals ≥ 10, 1 decimal < 10). Scalar: the estimate plus unit 12px (e.g. `9.09 gwei`). |
| Yes/No pair | 2 × 72×32, gap 8 (kit micro-buttons) | Yes = violet fill, white; No = violet-soft, lavender text. Label `Yes 84¢` / `No 15¢`. Scalar: `Up`/`Down`. |
| MultiOutcomeStack | Inside a row body: 3 lines × 20 | Name (ellipsis) · ranked bar 96×6 · % 48 · `Buy` 56×20. Then "+N more" as a link to the market page. |
| QuickTradePopover | 320×196, 8px offset, flip/clamp | Outcome tile, amount numeral, 4 chips (+$1 +$5 +$20 +$100, 64×32), quote line, "Pin to dock". |
| **Dock** | 320 wide, sticky bottom of the right rail; 340 high | Kit ticket: tiles 144×56 · Amount 40/600 · chips · **PayoutBar** 288×12 · Confirm 232×44 · × 44×44 |
| PayoutBar | 288×12 + labels 12px above | Left = cost A (violet), right = profit A(1−p̄)/p̄ (violet 40%). Labels: `Cost $5.00` / `Pays $5.94 if Yes`. |
| TrendingList / EndingList | 320 wide, 5 rows × 44 | Rank 24 · title (1 line) · value right · Δ 48 (▲/▼ + pts, or "—") |
| BottomSheet (mobile) | Full width, max 88vh, handle 4×36 | The same ticket content. Focus trapped; Esc and drag-down close it. |
| Market chart | 8 col × 520 (mobile 300); gutter 72 right | Range segmented 5×40, help, export, prev/next 36×36 |
| OutcomeRow (market page) | 64 high | `#n` 32 · avatar 24 · name · ranked bar 160×8 · % 64 · action 72×32 · `⋯` 36×36 menu |
| Banner | Min 56, padding 16, radius 12 | Conditional / Unverified copy (allowed strings) |
| LeaderRow | 64 high | # 48 · avatar 32 · account (ENS link or pseudonym) · Score 72 + tier pill 76×24 · P/L 120 · Volume 120 · ROI 88 · Markets 72 |
| Pills (status, tier) | One family each: status 112×24, tier 76×24 | 12px, centred |
| HoverMenu | 280 wide, items 40 | Avatars/icons 20; one menu open at a time |

### S4. Screen compositions
- **Feed.** Rail · feed · right rail. Grid at 1440: 232 / fluid / 320, gap 24, inside `.page`.
  - At 1024–1279 the right rail folds: Trending and Ending become a collapsible block above the feed, and the Dock becomes the bottom sheet.
  - Below 1024 the topic rail becomes the horizontal tab bar (44 high, edge-fade); Filters opens a sheet.
- **Market page.** As in the Concept 1 wireframe.
  - The conditional banner sits above the H1 when `parentMarket.id ≠ 0x0`. The unverified banner sits there when `verification` is absent.
  - Status strip (P-03) = a 4px top border in the status colour across the header block + a status pill.
  - Tabs (40 high) under Major Events.
  - Mobile: chart full width, then outcomes, then events, then tabs. The ticket is a FAB, "Trade" 160×48 bottom-right, opening the sheet.
- **Leaderboard.**
  - H1 "Profit & Loss Leaderboard" with a one-line score caption. The full Trader Score explanation sits behind ⓘ and "How it works".
  - Control row (44): Period segmented 1D/1W/1M/ALL · Filters (App, Chain) HoverMenus · Your Rank 120×40 · search 280×40 + Search 96×40.
  - Then the rows, the sort descriptor, "Page 1 of N", Previous/Next and the Updated timestamp.
  - Hovering Score expands a 5-component anatomy popover (the real `components` values on 0–100 bars).
  - Mobile: rows become labelled 2-line rows.
- **Create.**
  - Wallet gate first (connect plate) if disconnected.
  - Step dots "1 of 2". Type = 4 selectable rows of 72px (Categorical, Scalar, Multi Categorical, Multi Scalar). Each shows a live MarketRow preview built from a real example: Knesset, BASEFEE gwei, the templateId-3 market, France seats.
  - Next 120×40 is disabled with the tooltip "Choose a market type" until a type is picked; then it routes to the unobserved Step 2 plate with a link to app.seer.pm/create-market.
  - Footer "SECURED BY KLEROS" + social icons.
- **Menus.**
  - Policies (2 items) and App (Futarchy, Deepfunding, Foresight, Opportunity Markets, each with its 8px accent dot).
  - Account (Account, Deposit, Portfolio, Market Collections, Trade Collateral + "Use smart account" switch).
  - All are HoverMenus; the page underneath stays visible and unchanged.

### S5. States
| State | Feed | Market page | Ticket/Dock | Leaderboard | Create/Collections |
|---|---|---|---|---|---|
| Loading | 6 skeleton rows of 96 (400ms shimmer) | Header skeleton + chart frame with axes drawn | Quote field skeleton (T-13) | 10 skeleton rows of 64 | Skeleton plate |
| Empty | "No markets match these filters" + [Clear filters] | — | — | "No accounts found" + [Clear search] | COL-03 "No markets in this collection." |
| Error | "Markets didn't load" + [Retry] | Same, plus Back | "Quote unavailable" (CTA disabled) | Same + Retry | — |
| Disconnected | Feed intact; header shows Connect (G-14/H-20) | Comments gate (TAB-02/03) | CTA `Connect` | Rows visible; Your Rank hidden (L-36) | C-04 / COL-02 gate |
| Wrong chain | — | `Switch to Gnosis` 160×40 (P-26) | CTA `Switch to Gnosis` | — | — |
| Wallet-gated / unobserved | — | — | After a valid amount + balance the CTA reads `Trade` (`Approve` if allowance is 0). It is **disabled** with the tooltip "Signing isn't available in this build" (T-17, UNOBSERVED) | — | Step 2 plate |
| Ended (Closed/payoutReported) | Row: numeral greys out; Yes/No are replaced by a "Resolved: <outcome>" pill | Redeem tab is primary in More | Buy disabled, tooltip "Market closed" | — | — |
| Reports open / dispute | Status pill amber; trading still allowed (as live) | `Answer on Reality.eth!` prominent | Normal | — | — |
| Low balance | — | — | `Not enough balance.` disabled + bridge link (T-10/T-16) | — | — |

### S6. Data adapters (`src/data/`, pure, with unit tests)
- **`markets.ts`**: reads `markets-search.full.json.markets` and maps each record to a `Market`:
  - `id, chainId, slug=url, question=marketName` (placeholders like `[party bloc]` are kept literally).
  - `image=images.market`, `outcomeImages`.
  - `outcomes` (trim trailing spaces), `odds` (`null` → Invalid).
  - `type`: `templateId 2` → Categorical; `3` → Multi Categorical; `1` with outcomes `DOWN/UP` → Scalar, otherwise → Multi Scalar.
  - `bounds` (scaled by 1e−18 if ≥ 1e15). `unit` = last `[...]` token in the question for scalar.
  - `liq=liquidityUSD, vol=volumeUSD, notional=volumeNotionalUSD, oi=openInterestUSD, incentive`.
  - `pools=poolBalance`.
  - `verified = verification?.status==='verified'`.
  - `conditional = parentMarket.id !== ZERO`, with `parentId` and `parentOutcome` (0 = Yes, 1 = No).
  - `collateral`: sDAI, or the parent outcome token symbol for conditionals (taken from the parent's `poolBalance` symbols).
  - `opensAt = openingTs*1000`, `answered = hasAnswers`, `inArbitration = questionsInArbitration>0`, `payoutReported`.
- **Status derivation** (matches the live filter vocabulary):
  - now < opensAt → "Reports not open yet" (pill: `Trading open`).
  - Else if !answered → `Reports open`.
  - Else if inArbitration → `In dispute`.
  - Else if !finalized → `Waiting for answer`.
  - Else if !payoutReported → `Pending execution`.
  - Else → `Closed`.
- **Leading outcome** = argmax over non-null odds. Σ = sum of non-null odds; the tooltip shows it when |Σ − 100| > 2: "Outcome prices add to 109.8% — prices come from separate pools."
- **`topics.ts`**: keyword map, deterministic, case-insensitive, first match wins.
  - Sports: `categories` includes sports, or `World Cup|NBA|NFL|F1|league|match`.
  - Crypto: `Ethereum|blockchain|Polymarket|token|stablecoin|Bitcoin|BASEFEE|EIP|wallet|DeFi|Devcon|crypto|Justin Sun|Bankman`.
  - Tech: `AI|API|GTA|software|launch|model`.
  - Politics: `election|president|senate|party|parliament|Knesset|referendum|pardon|regime|treaty|Greenland|NATO|troops|government|legislative|Act`.
  - Counts are computed at load. Rail tooltip: "Topics are assigned by Explorer from the question text."
- **`history.ts`**:
  - Salvages complete `{periodStartUnix, token0Price, token1Price, pool.token0.name}` objects from the truncated raw strings in `market-chart.json` and `markets-charts.json`.
  - Price of an outcome = the price of the outcome token in sDAI, taken from whichever side is the collateral.
  - Live mode: `markets-charts?ids=` batches of 10 for the visible rows.
  - 24h Δ = p(now) − p(now − 24h) in points; it exists only if the series covers it.
- **`quote.ts`**:
  - Live: router quote.
  - Fixture: the scenario-01 quote (1 sDAI → `1.1868081659397476` Yes shares, market `will-marine-le-pen…`).
  - Fallback: `A/p` labelled "≈ at current price".
  - Display: 4 decimals (`1.1868`). Click or hover reveals the exact string in mono, with copy.
- **`leaderboard.ts`**: `get-pnl-leaderboard.json` → rows. `roi` ×100 (signed, U+2212). ROI shows `N/A` when capital < $0.01 (L-37). Tier: Elite/Great/Good, or N/A when score is null. Request params are built per DATA-01.
- **`wallet.ts`** (mock): `0x000000000000000000000000000000000000dEaD`, 24.69 xDAI, 0 sDAI. Reverse lookup 404 → fall back to the truncated address (DATA-08).
- **Formats:**
  - Money `$27.7K`, `$918.38`.
  - Token values `5.75K sDAI` with a thin space before units.
  - Holder `<0.001`.
  - Dates `Jan 1, 2027 00:00 UTC`.
  - Em dash for none.

### S7. The fixes (each one has a test)
1. **Honest axis.** Categorical y is always 0–100% with ticks 0/25/50/75/100. A "Zoom to data" toggle (36×36, off by default) fits the domain to the data with 8% pad, and the axis gets a ⚡ "zoomed" label so exaggeration is opt-in and declared. Scalar y uses the market bounds [L, U] with unit ticks. X ticks come from d3 `scaleTime().ticks()` with a year boundary label. No origin artefact: the plot rect is clipped, with a 6px top inset.
2. **End labels in a gutter.** A 72px right gutter outside the plot holds `Yes 84.2` labels from the shared label engine (min 18px separation, merge when closer, never over ticks). With more than 3 outcomes: top 3 are labelled, the rest are ink-grey with "+N" and hover isolation (others dim to 20%).
3. **Shares to 4 decimals** everywhere (ticket, activity, holders), with the exact value on demand.
4. **Conditional banner** (copy in S9) + the collateral token named in the ticket's "You pay" + a parent link + "Open parent".
5. **Unverified warning.** A row badge plus an amber banner with a "Verify it" link to Kleros curate.
6. **Pool-price disclosure** as a caption under the chart ("Pool price, not trades ⓘ"), no longer hidden.
7. **Outcome row conflict.** The row selects (radio role). The three links move into the `⋯` menu.
8. **Invalid explained.** ⓘ on the Invalid row: "Pays out only if the question is ruled invalid."

### S8. Motion budget
| Motion | Duration / easing | Budget | Reduced motion |
|---|---|---|---|
| Row entrance | Fade + rise 8px, 30ms stagger, max 8 rows, once per session | ≤ 420ms total | None |
| Sparkline draw-in | `stroke-dashoffset` 420ms ease-out on first intersect | ≤ 8 concurrent | Static |
| Number tick (numeral, amount, Δ) | Reel; changed digits only, ≤ 2 digits per tick, 280ms spring | 1 per value per second | Instant |
| Quick-trade popover | 90ms intent, 140ms scale .98→1 + fade; leave 220ms | One open | Fade 0 |
| Dock pin | Shared-element tile move (view transition), 280ms | — | Instant |
| **PayoutBar** | Width spring (stiffness 380, damping 32), labels tick | Per chip press | Instant |
| Bottom sheet | Translate-y 280ms ease-out; drag follows the finger | — | Instant |
| Theme toggle | View-transition reveal 420ms | — | Instant |
| Filter apply | FLIP reorder of rows, 280ms | ≤ 40 rows animate; the rest snap | Snap |

Perf gate: ≥ 55 fps while scrolling 500 virtualized rows with 30 ticks/s in live mode. CLS 0 when sparklines load: fixed slots.

### S9. Allowed strings (anything else must be a data label or a unit)
- **Header and menus:** Markets, Leaderboard, Create Market, Policies, App, Connect, Search by market, outcome or collection, Switch to dark mode, Switch to light mode, Note that this is a Beta version and can still be unstable, Verified Market Policy, Market Rules Policy, Futarchy, Deepfunding, Foresight, Opportunity Markets, Account, Deposit, Portfolio, Market Collections, Trade Collateral, Use smart account.
- **Feed:** All, Politics, Crypto, Sports, Tech, Show, Open, Verified, Filters, Market States, Reports not open yet, Reports open, Waiting for answer, In Dispute, Pending execution, Closed, Verification Status, Verifying, Challenged, Not Verified, Chain, Ethereum, OP Mainnet, Gnosis, Base, Sort By, Default, Liquidity, Volume, Open Interest, Opening Date, Creation Date, Desc, Asc, Conditional Market, Show only conditional markets, Minimum Liquidity, Rewards, Show only markets with rewards, Show only futarchy markets, Cancel, Apply, Create New Market, My collections, All markets, Trending, Ending soon, Trading open, Yes, No, Up, Down, Buy, more, COND, UNVERIFIED, No markets match these filters, Clear filters, Markets didn't load, Retry, vol, Pin to dock, Confirm, Amount, Pays, if, Cost, ≈ at current price, Open interest and liquidity breakdown, traded, notional, Open interest.
- **Market page:** Home, Market, Categorical, Scalar, Multi Categorical, Multi Scalar, Liquidity, P&L, Verify it, Market Estimate, Resolution opening at, Answer, Answered too soon, Reopen question, Hide questions, Deadline:, Answer on Reality.eth!, Major Events, UPCOMING, Reality.eth Resolution, Expected resolution date, 1D, 1W, 1M, All, Custom, Today, Last Week, Last Month, Previous Month, Next Month, Save, Zoom to data, Pool price, not trades, Add Liquidity, View pool details, Hide pool details, New conditional market, Pool Id:, Liquidity Chart, Pool Balances:, SHARES, TOTAL, Last:, Farming Rewards, Earn farming rewards (SEER) by providing liquidity to existing markets., Available Pools:, Rewards end:, Rewards ended on:, Add liquidity ->, Learn more about the farming program, Return, Report Answer, Current answer:, Not answered yet, Choose an answer, Mark this question invalid, Comments, Connect your wallet to share your take, Connect to comment, No takes yet. Share the first one., Signing in..., User rejected the request., Related Conditional Markets, Search by outcome:, Top Holders, Balance, Activity, My activity, Bought, Sold, Split, Switch to Gnosis.
- **Banners:**
  - Conditional: "Conditional Market – This market is conditional on the resolution of "<parent>" being "<Yes|No>". If the main market resolves to a different outcome, the tokens of this market will be worthless."
  - Unverified: "This market is unverified (it didn't go through the curation process). Exercise caution."
- **Ticket:** Market, You pay, You will get, Max, Balance:, Low balance? Bridge tokens from other networks, Avg price, Price after buy, Potential return, Calculate your potential return, Max slippage 1%, Enter an amount, Not enough balance., Trade, Approve, More, Mint, Merge, Redeem, sDAI, xDAI, shares, Market closed, Signing isn't available in this build, Quote unavailable.
- **Leaderboard:** Profit & Loss Leaderboard, How it works, Your Rank, Finding your rank…, Search, by username or address, Score, Profit/Loss, ROI, Traded Markets, Account, #, ELITE, GREAT, GOOD, N/A, Sorted by, high to low, low to high, Updating…, Page, of, Previous, Next, Updated, App, No accounts found, Clear search, Returns, Profit factor, Hit rate, Loss burn, Breadth.
- **Create/Collections:** Type, Next, Choose a market type, SECURED BY KLEROS, Default, Sign in to view and manage your market collections, No markets in this collection., Not in this build, Open in Seer app, Topics are assigned by Explorer from the question text., No price history loaded, Sample data.

### S10. Redesigned flows (each has a flow test with the mock wallet)
| # | Flow | Live steps | New steps |
|---|---|---|---|
| 01 | Search → trade preview (desktop) | 6 | ⌘K "Marine Le Pen" → Enter filters the feed (URL `marketName=`) → click `Yes 84¢` (popover) → Pin → chip +$1 → Dock shows `1.1868` shares, the PayoutBar and `Not enough balance.` |
| 02 | Leaderboard comparison | 9 | Leaderboard → 1W → ALL → Filters: Chain Gnosis → Apply → sort Score → Next → Previous (each step URL-mirrored) |
| 03 | Market research | 8 | Row title → market → Custom → Last Month → Save → Top Holders → Activity → Related Conditional Markets (2) |
| 04 | Liquidity investigation | 7 | Market → outcome `⋯` → View pool details (inline expansion: Pool Id, Liquidity Chart with honest axis, ladder) → `⋯` Add Liquidity → dialog → Return |
| 05 | Report answer | 5 | Market → Answer on Reality.eth! → Mark this question invalid → review bond 10 xDAI → Return |
| 06 | Collections gate | 4 | My collections → sign-in gate → (mock sign-in) → `No markets in this collection.` |
| 07 | Mobile search → trade sheet | 6 | ⌕ → query → tap `Yes` in the row → sheet with chips and quote |
| 08 | Mobile leaderboard | 9 | Same as 02 with sheets and labelled rows |
| 09 | Conditional | new | Feed → toggle Conditional (rail) → row with `COND` → market → banner names parent + "Yes" → ticket "You pay … LEPEN_NRYES" → banner link → parent market → Related Conditional Markets shows both children (Yes / No) |

### S11. Parity map (every ID → new location → test)
Test names are the ones in PARITY_MAP.md / PARITY_MAP_DRAFT.md unless noted. "Feed" = `#/`, "MP" = market page.

**Global and menus**
| IDs | New location |
|---|---|
| G-01 | Beta strip under the header |
| G-02 | Header 64 (tonal `--card`, no purple bar; the test asserts the header contains all nav) |
| G-03, G-04, G-05, G-06 | Wordmark → `#/`; nav links Markets, Leaderboard, Create Market |
| G-07 | Chain icon 20 in the wallet pill |
| G-08, G-09 | Wallet pill `0x0000…dEaD` + balance `24.69 xDAI` (Account menu trigger) |
| G-10 | Header help `?` → tour/palette |
| G-11, G-12, G-13 | Theme toggle; labels switch; content preserved (view transition) |
| G-14 | Disconnected header shows `Connect` |
| G-15 | HoverMenus overlay; the page DOM is unchanged (snapshot compare) |
| G-16 | Not a UI surface; the console test ignores `rpc.walletconnect.org/v1/profile/reverse/` |
| M-01, M-02, M-03 | Policies HoverMenu, 2 items → policy plates |
| M-04, M-05, M-06, M-07, M-08 | App HoverMenu, 4 sister apps |
| M-09 … M-16 | Account HoverMenu: 5 items + "Use smart account" switch, rendered together |

**Feed (index)**
| IDs | New location |
|---|---|
| H-01 | Replaced by the row feed. Test renamed `parity-index-feed-one-row-per-market` (asserts 1 market per row, no 4-column grid) |
| H-02 | Infinite scroll (virtualized, 100/page) |
| H-03 | Superseded: Sort HoverMenu + Dir toggle in the feed header. Test `parity-index-sort-header-present` |
| H-04, H-05, H-06 | Row question link → MP; full question (2-line clamp + tooltip); 44px avatar `images.market` |
| H-07, H-08 | Donut replaced by the numeral + MultiOutcomeStack (labels + %). Test asserts top 2–3 outcome labels + % per row |
| H-09 | SEER mark lives in the MP meta row (rows drop the repeated logo). Test moved to P-11 |
| H-10 | Row meta shows **volume** (user decision); liquidity is in the breakdown tooltip on the numeral ⓘ and in MP meta. Test asserts `$27.7K` liquidity is reachable from the row tooltip |
| H-11 | Status pill/dot + ✓ verified in the row meta |
| H-12, H-13, H-14, H-15 | Row ⓘ "Open interest and liquidity breakdown" tooltip: OI `5.75K sDAI (7.26K $)`, volume + notional, per-outcome pools |
| H-16, H-17 | Row `⋯` (on hover/focus): "View on GnosisScan", "Kleros curation" external links |
| H-18, H-19, H-20 | Search pill placeholder; writes `?marketName=`; disconnected feed still renders |
| H-21 | Rail "Filters" group expand (mobile: Filters sheet) |
| H-22, H-23, H-24, H-25, H-26 | Rail HoverMenus: Market States, Verification Status, Chain, Sort By + Desc/Asc |
| H-27, H-28, H-29, H-30 | Rail switches: Conditional, Rewards, Futarchy; Minimum Liquidity input |
| H-31, H-32 | Rail Cancel / Apply (staged) |
| H-33, H-34 | Feed header buttons → `#/create`, `#/collections/default` |

**Leaderboard**
| IDs | New location |
|---|---|
| L-01, L-02, L-03 | H1 + ⓘ explanation (full text in the tooltip/tour) + How it works → docs.seer.pm/app/leaderboard |
| L-04, L-05, L-06, L-07 | Period segmented |
| L-08, L-09, L-10 | Filters HoverMenus App / Chain |
| L-11, L-30, L-36, L-39 | Your Rank button (pins the user row, "Finding your rank…"); hidden when disconnected |
| L-12, L-13, L-40 | Search input + Search button |
| L-14 … L-21 | LeaderRow columns (#, Account ENS/pseudonym, Score + tier pill, P/L, Volume, ROI, Traded Markets) |
| L-17 | Score `N/A` + header ⓘ |
| L-22 … L-25 | Sortable headers Score, Profit/Loss, Volume, ROI |
| L-34 | Optional: # / Account / Traded Markets sortable (enabled, tested as optional) |
| L-26, L-27, L-31, L-33 | Previous / Next, "Page 1 of N", 25 rows |
| L-28, L-29, L-32 | Sort descriptor; "Updating…" on period change; "Updated <date>" from `updatedAt` |
| L-35, L-38 | Rows render when disconnected |
| L-37 | ROI N/A tooltip "under $0.01 of capital" |
| L-41, L-42, L-43 | `leaderboard.ts` request/response/row contract |

**Create and Collections**
| IDs | New location |
|---|---|
| C-01, C-02, C-03, CM-01, CM-06 | Step dots 1 of 2; Type rows (none selected); Next disabled + tooltip |
| CM-02 … CM-05 | Four type rows with real-example row previews |
| C-04 | Connect gate plate |
| C-05 | Kleros footer |
| C-06 | Step-2 unobserved plate (test asserts the plate + external link) |
| CM-07 … CM-10, COL-05 … COL-08, MD-21 … MD-24 | Menus/theme on these routes keep the content (shared G-15/G-13 test per route) |
| CL-01, CL-02, CL-03, COL-01 … COL-04 | `#/collections/default` "Default", sign-in gate copy, empty state; the signed-in state is the empty state with the mock sign-in |

**Market page: header and meta**
| IDs | New location |
|---|---|
| P-01, MD-01 | `#/m/:id/:slug` |
| P-02, MD-02 | Breadcrumb Home / <Topic> / Market |
| P-03 … P-06, MD-04, MD-05 | 4px status border + status pill (Reports open / Trading open / Pending execution) |
| P-07, P-08, P-17, MD-09 | ✓ Verified (link to curate) + ☆ favourite toggle (adds to Default collection) |
| P-09, P-10, MD-03 | Avatar 44 + H1, placeholders preserved |
| P-11 … P-16, MD-06, MD-07, MD-10 … MD-12 | Meta row: SEER mark, type, Liquidity ⓘ (P-14 copy), Volume, P&L |
| P-18, P-19 | Scalar: "Market Estimate: 9.092 gwei" numeral + "Resolution opening at …" |
| P-20, P-21, MD-14 … MD-17 | Multi-scalar question list (Deadline:, Answer: Answered too soon, Reopen question) + Hide questions |
| P-22, P-23, MD-13, MD-59, MD-60 | Major Events block + Answer on Reality.eth! |
| P-24, P-25, MD-08, MD-18 | Conditional badge + banner (S9) |
| P-26, MD-19, MD-20 | Wallet state + Switch to Gnosis CTA |

**Market page: report answer and chart**
| IDs | New location |
|---|---|
| RA-01 … RA-07, MOD-01 … MOD-07 | Report Answer dialog 480 wide: copy "not resolved… bond 10 xDAI", Current answer, Choose an answer (radio list of outcomes), Mark this question invalid, Return, Answer (disabled + tooltip in the mock) |
| CH-01, CH-02, MD-32 | Range segmented + ⓘ |
| CH-03, CH-04, CH-05, MD-34, MD-35, MD-36 | Custom popover: presets, month grid Su–Sa, Previous/Next Month, Cancel/Save |
| CH-06 | Export → CSV of the visible series |
| CH-07, CH-11 | Gutter end labels carry the latest % (legend replaced by direct labels) |
| CH-08 | ‹ › step the window by its own length |
| CH-09, MD-41 | Step-line canvas (`__labels` exported) |
| CH-10 | **Fixed:** 0–100 default; "Zoom to data" opt-in, declared |
| CH-12 | **Fixed:** test inverted (`no end-label/tick overlap`) |
| CH-13, MD-33 | Crosshair tooltip: timestamp + all outcomes |
| CH-14 | **Fixed:** d3 time ticks; year at boundaries |
| CH-15 | **Fixed:** no origin glyph (pixel test) |
| CH-16 | Caption "Pool price, not trades ⓘ" |

**Market page: outcomes and pools**
| IDs | New location |
|---|---|
| O-01, MD-25 | OutcomeRow `#1 Yes 84.2%` with radio role |
| O-02, MD-26 | Invalid row `210.85 SER-INVALID 0%` + ⓘ |
| O-03, MD-42 | Selecting a row updates the ticket outcome |
| O-04, O-05, O-06, MD-28 … MD-31 | `⋯` menu: Add Liquidity, View/Hide pool details, New conditional market (→ `#/create?parent=<id>&outcome=<i>`) |
| MD-27 | Multi-scalar "~ 182 seats" as the row value |
| MD-37 … MD-40 | Breakdown ⓘ next to Liquidity (OI dual unit, volume/notional, per-outcome pools) |
| I-01 … I-04, MOD-15 … MOD-20 | Inline pool details: Pool Id (mono + copy), Liquidity Chart (honest axis), Pool Balances ladder (SHARES/TOTAL, Last:) |
| I-05 … I-12, MOD-08 … MOD-14 | Add Liquidity dialog: Farming Rewards copy, Available Pools Swapr `~ 3.00K SEER / day`, Rewards end/ended, Add liquidity -> (Swapr external), Learn more, Return; variants 046/047 = rewards active/ended |
| I-13 | Unobserved: the external Swapr link is the action (test asserts the href) |

**Ticket**
| IDs | New location |
|---|---|
| T-01, MD-42 | Ticket header outcome tile (icon + name + ¢) |
| T-02 | Order type HoverMenu `Market` |
| T-03, T-04, T-05, T-06, MD-43 … MD-45, MD-51, MD-56, MD-57 | You pay input (`0` default), token select sDAI/xDAI (or parent token for conditionals), Balance:, Max, Enter an amount |
| T-07 | ↓ direction glyph between pay and get |
| T-08, T-09, MD-46 | You will get `1.1868` (exact on demand: `1.1868081659397476`) + receive outcome select. Test asserts the 4-dp display AND the exact value in the reveal |
| T-10 | Bridge link |
| T-11, T-12, T-13, MD-47, MD-48 | Avg price, Price after buy, Potential return (skeleton while quoting) |
| MD-49 | Multi-scalar "Calculate your potential return" |
| T-14, MD-50 | Max slippage 1% + ⚙ popover (0.5/1/2%) |
| T-15, T-16, T-17 | CTA states; Trade/Approve disabled with reason (unobserved) |
| T-18, MD-52 … MD-55, MD-58 | `More` disclosure → Mint / Merge / Redeem tabs, final Mint button follows the amount |
| (new) | Dock/Sheet quick-trade = the same Ticket component (single source of truth test) |

**Market page: tabs**
| IDs | New location |
|---|---|
| TAB-01 … TAB-05 | Comments tab: gate copy, Connect to comment, empty state, Signing in… → User rejected the request. |
| TAB-06 … TAB-10 | Related Conditional Markets (2): Search by outcome:, child rows in the MarketRow grammar with "Conditional on … being "Yes"/"No"", status pill, Answer link |
| TAB-11 … TAB-15 | Top Holders: Yes / No / Invalid tables with Balance (`6.58K`, `454.03`, `<0.001`) |
| TAB-16 … TAB-19 | Activity: My activity toggle; rows user · Bought/Sold/Split · amount (4 dp) · outcome · time |

**Data contracts**
| IDs | New location |
|---|---|
| DATA-01 … DATA-03 | `leaderboard.ts` contract tests |
| DATA-04, DATA-05 | `markets.ts` / `get-market` contract tests |
| DATA-06, DATA-07 | `history.ts` / pool adapter tests |
| DATA-08 | Reverse-lookup fallback |
| DATA-09 | Connect dialog wallet list (mock `getWallets`) |
| MD-01 … MD-41 | Remaining draft rows duplicate the P-/CH-/O-/I- rows above and are mapped there |

### S12. Tests (Playwright, `apps/explorer/e2e/run.mjs`, based on futarchy)
- **Parity:** one test per ID group above (generated from S11). They run at 1440 and 390, against `?sample=1`.
- **Dead-control:**
  - Enumerate every `button, a, input, [role=tab|switch|menuitem|radio]` on `#/`, MP (binary, multi, scalar, multi-scalar, conditional, unverified), `#/leaderboard`, `#/create` and `#/collections/default` at 1440 and 390.
  - Operate each one and assert a DOM, URL, dialog, tooltip or focus change, or `disabled` + `aria-describedby` tooltip text. Zero silent controls.
- **Navigation:**
  - Every route reachable from the UI.
  - Back/forward restore filters and scroll; deep links load.
  - Brand → home; breadcrumb works; Esc closes the sheet, then goes back.
  - ↑/↓ row focus, Y/N quick-trade, Enter opens.
  - Palette with `/` and ⌘K.
- **Flows:** 01–09 from S10.
- **Data honesty:**
  - Rows without a series render OddsStrip (no fake path; `canvas.__labels` is empty).
  - Σ tooltip appears only when |Σ−100| > 2.
  - The topic of every market is in the keyword map or All-only; All count = 100.
  - Conditional count with the filter on = 17; verified count = 88; Rewards count = 1; Futarchy in sample → empty state.
- **Chart:**
  - Default domain [0,100].
  - Gutter labels don't intersect ticks (bounding boxes).
  - No dark pixels at the origin 8×8.
  - Zoom toggle declares itself.
- **Quality suite:** the full ui-quality-rules §12 suite (overflow at 320–2560, alignment, fixed sizes for MarketRow 96/112, pills 112/76, buttons 72×32, overlaps, themes + contrast, touch ≥ 40, reduced motion, reel windows, HoverMenu timings, single-source numbers: row numeral = MP outcome % = ticket ¢).
- **Perf:** ≥ 55 fps, 500 virtualized rows, 30 ticks/s.

### S13. Accessibility
- The feed is a `role=feed` of `article` rows. Each row's accessible name is the question.
  - Numeral: `aria-label="84 percent Yes"`.
  - Yes/No buttons: "Buy Yes at 84 cents".
- Popover = `role=dialog` (non-modal) and opens on focus too. Sheet and dialogs are modal: focus trap, Esc, focus returns to the trigger.
- Colour never carries meaning alone:
  - Status = dot + word.
  - Δ = ▲/▼ + sign.
  - Series = direct labels.
  - Badges carry text.
- Contrast ≥ 4.5:1 for text and ≥ 3:1 for lines in both themes, checked by script.
- Visible focus ring: 2px violet, offset 2.
- `scroll-padding-top: 80px`.
- The chart has a visually hidden data table (latest + range summary) and keyboard crosshair (←/→).

### S14. Responsive rules
| Width | Layout |
|---|---|
| ≥ 1280 | Rail 232 · feed · right rail 320 with Dock |
| 1024–1279 | Rail 232 · feed. Trending/Ending fold into a collapsible above the feed. Ticket opens as a sheet; the market page keeps the sticky ticket at 4 columns. |
| 700–1023 | Topic tab bar (44) + Filters sheet. Rows stay 96. MP is a single column with ticket FAB. |
| < 700 | Rows 112 (numeral moves top-right, sparkline + buttons on the bottom line), avatar 32. Trending and Ending soon are collapsible sections (closed). Tables become labelled rows. All touch targets ≥ 40. Page height for 20 rows < 4600px (infinite scroll beyond). |

There is never horizontal overflow (`min-width: 0` on grid children); the tab bar scrolls inside `.page` with edge-fade masks.
