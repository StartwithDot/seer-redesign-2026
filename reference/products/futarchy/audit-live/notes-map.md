## NOTES CHUNK 1
## Screens / purpose
- `/` dashboard (STATE001–009): brand “Futarchy”; chain selector; wallet; **Active Milestones**; **Recently Closed**; **Organizations** table; **Create market**.
- Chain selector overlay “Switch Networks” lists **Ethereum**, **Gnosis**, and **Connected** (STATE003, STATE007, STATE011).
- Wallet popover (STATE004, STATE008, STATE012): identicon `👾`, truncated address `0x00…dEaD`, balance, **Copy Address**, **Disconnect**, empty transaction area.
- Search-filtered landing view: typing `e` into search reduces Organizations from `5 organizations` to `4 organizations`, removing Gnosis DAO but leaving Kleros DAO, Ethereum, VeloraDAO, Aave DAO (STATE005, STATE009).
- Market detail page `/markets/0xee8878d0a7136c5cd109554f06bb780e225badef` (STATE010–019): GIP-152 market summary, resolution text, prices, activity/position tabs, trade form, balances, liquidity panel.
- Add Liquidity panel (STATE013): pool-list overlay for adding liquidity.
- Recent Activity / Position views (STATE014, STATE015): activity/trading-focused view; top market summary/description is absent in those captures.

## Data fields, units, formats
### Landing / dashboard
- Header chain indicator: `Gnosis` (STATE001–009).
- Wallet address format: `0x00…dEaD` truncated; full address not shown (STATE001–019).
- Wallet popover balance: `24.68 XDAI` (STATE004, STATE008, STATE012).
- Active milestone chain label: `ETH` (STATE002–009).
- Active milestone question: “What will the impact on ETH price be if EIP-8363 is Scheduled for Inclusion in Hegotá?” (STATE002–009).
- Countdown format: `Open until: 6d 6h 43m`; also `6d 6h 42m`, `6d 6h 41m` (STATE002, STATE005, STATE006, STATE008).
- Active milestone prices: `YES Price 2401.44 USDS`; `NO Price 2401.44 USDS` — 2-decimal USDS (STATE002–009).
- Active milestone impact: `-0.00%` (STATE002–009).
- Recently Closed cards show chain `Gnosis`, question, status/outcome, and signed 2-decimal impact:
  - GIP-152: `Awaiting Resolution`, `Status Awaiting`, `Impact +0.00%` (STATE001–009).
  - KIP-90: `✓ Resolved`, `Outcome YES`, `+0.68%` (STATE001–009).
  - GIP-151: `✓ Resolved`, `YES`, `+0.00%` (STATE001–009).
  - KIP-88: `✓ Resolved`, `YES`, `+0.91%` (STATE001–009).
  - KIP-86: `✓ Resolved`, `YES`, `+0.94%` (STATE001–009).
  - GIP-149: `✓ Resolved`, `NO`, `-2.36%` (STATE001–009).
  - GIP-145: `✓ Resolved`, `YES`, `+1.96%` (STATE001–009).
  - KIP-81: `✓ Resolved`, `NO`, `+99.98%` (STATE001–009).
  - GIP-153: `✓ Resolved`, `YES`, `+3.37%` (STATE001–009).
- Organizations table columns: `NAME`, `ACTIVE`, `PROPOSALS ↓`, `CHAIN`, `LIQUIDITY` (STATE001–009).
- Organization rows (STATE001, STATE006):
  - `Gnosis DAO` — ACTIVE `0`, PROPOSALS `6`, CHAIN `Gnosis`, LIQUIDITY `Liquidity`.
  - `Kleros DAO` — ACTIVE `0`, PROPOSALS `4`, CHAIN `Gnosis`, LIQUIDITY `Liquidity`.
  - `Ethereum` + badge `ACTIVE MARKET` — ACTIVE `1`, PROPOSALS `1`, CHAIN `Gnosis`, LIQUIDITY `-`.
  - `VeloraDAO` — ACTIVE `0`, PROPOSALS `0`, CHAIN `ETH`, LIQUIDITY `-`.
  - `Aave DAO` — ACTIVE `0`, PROPOSALS `0`, CHAIN `ETH`, LIQUIDITY `-`.
- Organization count: `5 organizations`; after search `4 organizations` (STATE001, STATE005).

### Market detail
- Market question: “What will the impact on GNO price be if GIP-152 is passed?” (STATE010–019).
- Header metrics:
  - `0.00%` `Impact (spot)` (STATE010–013, STATE016–019).
  - `Awaiting` `Status` (STATE010–013, STATE016–019).
  - `0` with `ⓘ` `Volume (Total; sDAI)` (STATE010–013, STATE016–019).
  - `0` with `ⓘ` `TVL` (STATE010–013, STATE016–019).
  - Date `8/12/2026` followed by `Ended` (STATE010–013, STATE016–019).
- Status text also appears as `Awaiting Resolution` in the trading panel (STATE010–019).
- Final result: `Final Result APPROVED` (STATE010–013, STATE016–019).
- Trading pair: `GNO/sDAI`; Yes Price `84.77 sDAI`; No Price `84.77 sDAI` (STATE010–019).
- Impact (spot): `0.00%` (STATE010–019).
- Resolution copy: “Will GIP-152 (spin out the Gnosis App into an independent company) be passed by GnosisDAO? Resolves Yes if GIP-152 is passed by GnosisDAO; otherwise resolves No.” plus Snapshot URL (STATE010–013, STATE016–019).
- Activity tabs: `Recent Activity`, `My Trades`, `Position`; filters `Last 30 trades`, `Last 60 trades`, `Last 90 trades` (STATE010–013, STATE016–019).
- Empty activity copy: `No trades found for this proposal` (STATE010–013, STATE017–019).
- Empty position copy: `No active positions` (STATE015, STATE016).
- Trade form fields: `If Yes` / `If No`; `Buy` / `Sell`; `Amount (sDAI)`; `Max`; `Available -` (STATE010–019).
- Outcome/receive fields:
  - `If Yes` → `Quote returned no output for this amount` (STATE010–013, STATE018).
  - `If No` → `1.00 sDAI` (STATE010–013, STATE016); after `If No` click, `If No` outcome shows `Loading...` and `Receive If Yes 1.00 sDAI (estimate)` (STATE017).
  - After `Max`: `If Yes 0.00 GNO`; `Receive If No 0.00 sDAI`; `Recover Quote Unavailable` (STATE019).
- Balance fields:
  - `sDAI 0 sDAI`; `mergeable YES 0 · NO 0`; `Wallet: 0 sDAI` (STATE010–019).
  - `GNO 0 GNO`; `mergeable YES 0 · NO 0`; `Wallet: 0.0004 GNO` (STATE010–019).
- View table copy: `Your view on GIP-152` with `If YES` / `If NO` columns:
  - `Bullish` → `BUY` / `SELL`
  - `Bearish` → `SELL` / `BUY` (STATE010–019).
- Add Liquidity panel pools (STATE013):
  - Conditional Pools: `YES GNO / YES sDAI`, `NO GNO / NO sDAI`.
  - Prediction Pools: `YES sDAI / sDAI`, `NO sDAI / sDAI`.
  - Company Token Pools: `YES GNO / sDAI`, `NO GNO / sDAI`.

## Charts / graphics
- Landing pages report `charts=0`; no charts visible (STATE001–009).
- Market pages report `charts=2`, but no axes, series labels, or tooltip values are readable in the captures (STATE010–019).
- Hovering the chart in Position and If No states produced no readable chart tooltip/data in the text capture (STATE016, STATE018).
- Visible graphics only: `👾` avatar/identicon, checkmarks for resolved markets, `ⓘ` info icons next to Volume/TVL (STATE001–019).

## Controls and observed behavior
- **Switch to dark mode** button: clicked in STATE002; controls count changes from 21 to 22; no text-level visual difference captured. Active ETH milestone appears in STATE002 onward.
- **Chain Selector** button: opens “Switch Networks” menu with `Ethereum`, `Gnosis`, `Connected` (STATE003, STATE007, STATE011).
- **👾 0x00…dEaD** wallet button: opens wallet popover with `24.68 XDAI`, `Copy Address`, `Disconnect`, `Futarchy transactions will appear here...`, `View more on explorer` (STATE004, STATE008, STATE012).
- Search input: typing `e` filters Organizations table from 5 to 4 rows; Gnosis DAO disappears (STATE005, STATE009). Search control label is not visible in capture.
- **Create market**: present on landing; no resulting screen captured (STATE001–009).
- **Liquidity** links on Gnosis DAO and Kleros DAO rows: present; no resulting screen captured (STATE001–009).
- **Resolve Question**: present on market page; no action captured (STATE010–013, STATE016–019).
- **Snapshot Vote**: present; no action captured (STATE010–013, STATE016–019).
- **Add Liquidity**: opens Add Liquidity panel (STATE013).
- **Recent Activity** tab: clicked in STATE014; view shows question and trading panel without top summary/description in capture.
- **Position** tab: clicked in STATE015; shows `No active positions`.
- **My Trades** tab: present; no separate state captured beyond label.
- **Last 30 / 60 / 90 trades** filters: present; all captured activity states show `No trades found for this proposal`.
- **If Yes / If No** outcome toggle: clicking `If No` changes outcome section to `If No` with `Loading...` and `Receive If Yes 1.00 sDAI (estimate)` (STATE017).
- **Buy / Sell**: present; no separate action captured.
- **Amount (sDAI)** input: present with unit sDAI; no entered value visible (STATE010–019).
- **Max** button: clicked in STATE019; outcome display changes to `If Yes 0.00 GNO`, `Receive If No 0.00 sDAI`, `Recover Quote Unavailable`.
- **Recover** button: label changes to `Insufficient balance` (STATE010–015, STATE017, STATE018) and `Quote Unavailable` (STATE019).
- **Split Collateral** / **Merge Collateral**: present; no action captured (STATE010–019).
- Pool rows in Add Liquidity panel: copy says clicking any pool opens Swapr; no actual pool click captured (STATE013).

## Wallet-gated / empty / ended / error states
- Wallet connected as `0x00…dEaD` with `24.68 XDAI`; no explicit wallet-gated blocking screen captured (STATE004, STATE008, STATE012).
- No wallet transactions: `Futarchy transactions will appear here...` (STATE004, STATE008, STATE012).
- Market trade area shows insufficient funds: `Insufficient balance`; wallet `0 sDAI`; wallet `0.0004 GNO` (STATE010–015, STATE017, STATE018).
- Quote errors: `Quote returned no output for this amount` (STATE010–013, STATE018); `Quote Unavailable` after `Max` (STATE019); `Loading...` after `If No` (STATE017).
- Empty activity: `No trades found for this proposal` (STATE010–013, STATE017–019).
- Empty position: `No active positions` (STATE015, STATE016).
- Ended state: market shows `Ended` with date `8/12/2026` while status remains `Awaiting Resolution` (STATE010–013, STATE016–019).
- Final-result state: `Final Result APPROVED` shown while status also says `Awaiting Resolution` (STATE010–013, STATE016–019).

## Copy explaining concepts
- Footer/tagline: “Futarchy — Market-based evaluation of governance decisions and milestones” (STATE001–019).
- Resolution rules: “Resolves Yes if GIP-152 is passed by GnosisDAO; otherwise resolves No.” (STATE010–013, STATE016–019).
- Liquidity explanation: “Add liquidity to earn fees from trades. Click on any pool to open Swapr and add liquidity.” (STATE013).
- Wallet transaction placeholder: “Futarchy transactions will appear here...” (STATE004, STATE008, STATE012).
- View mapping: `Your view on GIP-152` with Bullish/Bearish mapped to BUY/SELL for YES/NO (STATE010–019).

## Odd / confusing observations
- STATE001 has an empty Active Milestones area but the Organizations table already shows `Ethereum ACTIVE MARKET 1`; the active ETH milestone card appears starting STATE002.
- GIP-152 is listed under `Recently Closed` as `Awaiting Resolution` with `Status Awaiting` and `Impact +0.00%` (STATE001–009), while its market page shows `Ended`, `Awaiting Resolution`, and `Final Result APPROVED` together (STATE010–013, STATE016–019).
- Active ETH market shows identical YES and NO prices: `2401.44 USDS` each; impact `-0.00%` (STATE002–009).
- GIP-152 market shows identical YES and NO prices: `84.77 sDAI` each; volume `0`; TVL `0`; impact `0.00%` (STATE010–019).
- Wallet popover shows `24.68 XDAI`, but market trading balances show `0 sDAI` and `0.0004 GNO` (STATE004/STATE012 vs STATE010–019).
- `Max` produces zero amounts and `Quote Unavailable`; units switch between GNO and sDAI in the outcome display (STATE019).
- `If No` click shows `Loading...`, then an estimate, while another hover state says `Quote returned no output for this amount` (STATE017, STATE018).
- `Available -` appears as a dash rather than a numeric limit (STATE010–019).
- Search typing `e` leaves Kleros DAO but removes Gnosis DAO; filter behavior is not explained in the capture (STATE005, STATE009).
- Organizations table includes a row named `Ethereum` with `ACTIVE MARKET` badge and chain `Gnosis`, mixed with DAO rows; count says `5 organizations` (STATE001–009).
- `Liquidity` appears as text/action for Gnosis DAO and Kleros DAO, but `-` for the other rows (STATE001–009).
- Resolved GIP-151 shows `YES` with `+0.00%`, while resolved KIP-81 shows `NO` with a large positive `+99.98%` (STATE001–009).

## NOTES CHUNK 2
## Screens / purpose
- Market-detail pages for three futarchy proposals: GIP-152 on Gnosis with GNO/sDAI (`STATE 020–023`), KIP-90 on Gnosis with PNK/sDAI (`STATE 024–033`), GIP-151 on Gnosis with GNO/sDAI (`STATE 034–035`).
- Overlays/panels captured: Split Collateral (`STATE 020`, `STATE 030`), Merge Collateral (`STATE 022`, `STATE 032`), Add Liquidity (`STATE 028`), network selector (`STATE 026`), account menu (`STATE 027`), theme toggle (`STATE 025`, `STATE 035`).
- Capture metadata consistently reports `charts=2`, `tables=2`; controls range 26–35 (`STATE 020–035`). Text captures do not identify chart type, axes, or plotted series.

## Market fields
| Field | GIP-152 | KIP-90 | GIP-151 |
|---|---|---|---|
| Question | “What will the impact on GNO price be if GIP-152 is passed?” (`STATE 020–023`) | “What will the impact on PNK price be if KIP-90 is approved?” (`STATE 024–033`) | “What will the impact on GNO price be if GIP-151 is passed?” (`STATE 034–035`) |
| Trading Pair | `GNO/sDAI` (`STATE 020–023`) | `PNK/sDAI` (`STATE 024–033`) | `GNO/sDAI` (`STATE 034–035`) |
| Yes Price | `84.77 sDAI` (`STATE 020–023`) | `0.0067 sDAI` (`STATE 024–033`) | `84.20 sDAI` (`STATE 034–035`) |
| No Price | `84.77 sDAI` (`STATE 020–023`) | `0.0068 sDAI` (`STATE 024–033`) | `84.20 sDAI` (`STATE 034–035`) |
| Impact (spot) | `0.00%` (`STATE 020–023`) | `—` (`STATE 024–033`) | `—` (`STATE 034–035`) |
| Status | `Awaiting Resolution` (`STATE 020–023`) | `Resolved` (`STATE 024–033`) | `Resolved` (`STATE 034–035`) |
| Volume | `0` with label `Volume (Total; sDAI)` and ⓘ (`STATE 021`, `STATE 023`) | `3.95K`, same label/ⓘ (`STATE 024–029`, `STATE 031`, `STATE 033`) | `89.13K`, same label/ⓘ (`STATE 034–035`) |
| TVL | `0`, label `TVL` + ⓘ (`STATE 021`, `STATE 023`) | `121.46K`, label `TVL` + ⓘ (`STATE 024–029`, `STATE 031`, `STATE 033`) | `101.20K`, label `TVL` + ⓘ (`STATE 034–035`) |
| Date | `8/12/2026` labeled `Ended` (`STATE 021`, `STATE 023`) | `7/20/2026` labeled `Resolution Date` (`STATE 024–029`, `STATE 031`, `STATE 033`) | `7/3/2026` labeled `Resolution Date` (`STATE 034–035`) |
| Resolution/result | `Awaiting Resolution`; `Final Result` = `APPROVED`; `Resolve Question` (`STATE 021`, `STATE 023`) | `Resolved: YES`; `Resolution Question`; `Final Result` = `APPROVED` (`STATE 024–029`, `STATE 031`, `STATE 033`) | `Resolved: YES`; `Resolution Question`; `Final Result` = `APPROVED` (`STATE 034–035`) |

- Summary strip in GIP-152 hover shows `Status Awaiting`, while market field lower shows `Status Awaiting Resolution` (`STATE 021`, `STATE 023`).
- Resolution text shown for GIP-152: spin out Gnosis App into independent company; resolves Yes if passed by GnosisDAO; Snapshot URL displayed (`STATE 021`, `STATE 023`).
- Resolution text shown for KIP-90: Cooperative Spending Disclosure; approved “For” or rejected “Against” by Kleros Governance; if not approved by end of Snapshot vote, resolves “Against”; Snapshot URL displayed (`STATE 024–029`, `STATE 031`, `STATE 033`).
- Resolution text shown for GIP-151: one-time pro-rata treasury redemption; resolves Yes if passed by GnosisDAO; Snapshot URL displayed (`STATE 034–035`).

## TWAP / recommendation block
- KIP-90: `TWAP Complete (TWAP impact -0.98%)`; `FINAL TWAP WINDOW`; `UPDATED` times shown in 12-hour format; `YES TWAP 0.006730`; `NO TWAP 0.006796`; `NO outcome is ahead on TWAP.` (`STATE 024–033`).
- GIP-151: `TWAP Complete (TWAP impact +0.01%)`; `FINAL TWAP WINDOW`; `UPDATED` times shown; `YES TWAP 84.4795`; `NO TWAP 84.4721`; `YES outcome is ahead on TWAP.` (`STATE 034–035`).
- GIP-152 captures do not show a TWAP block (`STATE 020–023`).
- KIP-90 explanatory copy: recommendation based on TWAP of the “pass” (yes) outcome over a 24 hour period; positive difference = approve, otherwise reject (`STATE 024–033`).
- GIP-151 explanatory copy: TWAP over 24-hour observation window ending one day before Snapshot vote ends; > +1% = approve, < -1% = reject, otherwise neutral (`STATE 034–035`).

## Trading panel
- Controls: `Buy` / `Sell`; `Amount (sDAI)`; `Max`; `Available -`; `Outcomes`; `More info` on resolved markets (`STATE 020–035`).
- GIP-152: `If Yes` shows `Quote returned no output for this amount`; `Receive If No` = `1.00 sDAI`; `Recover`; `Insufficient balance` (`STATE 020–023`).
- KIP-90: `If Yes` = `151.47 PNK`; `Receive If No` = `1.00 sDAI`; `Recover`; `Insufficient balance` (`STATE 024–033`).
- GIP-151: `If Yes` = `0.00000111 GNO`; `Receive If No` = `1.00 sDAI`; `Recover`; `Price impact 1082765.91%`; warning `Price impact too high — pool depth insufficient for this size. Trade anyway.`; `Insufficient balance` (`STATE 034–035`).
- “Your view” guidance table: `If YES` / `If NO`; `Bullish` → `BUY` / `SELL`; `Bearish` → `SELL` / `BUY` (`STATE 020–035`).
- Balance fields: `sDAI 0 sDAI`; `mergeable YES 0 · NO 0`; `Wallet: 0 sDAI`. GNO markets show `GNO 0 GNO`; `mergeable YES 0 · NO 0`; `Wallet: 0.0004 GNO`. KIP-90 shows `PNK 0 PNK`; `mergeable YES 0 · NO 0`; `Wallet: 0 PNK` (`STATE 020–035`).
- Resolved markets show `Resolved: YES`, `Redeem Tokens`, `WINNING OUTCOME: YES`, `No redeemable tokens found`, and `You don't have any YES outcome tokens to redeem.` (`STATE 024–033`, `STATE 034–035`).

## Activity / tables
- Tabs/labels: `Recent Activity`, `My Trades`, `Position`; timeframe controls `Last 30 trades`, `Last 60 trades`, `Last 90 trades` (`STATE 020–035`).
- Empty table message: `No trades found for this proposal` (`STATE 020–035`).

## Collateral panels
- `Split Collateral` opens a split panel (`STATE 020`, `STATE 030`); `Merge Collateral` opens a merge panel (`STATE 022`, `STATE 032`). Both show collateral tabs: `sDAI`/`GNO` for GIP markets; `sDAI`/`PNK` for KIP-90 (`STATE 020`, `STATE 022`, `STATE 030`, `STATE 032`).
- Common fields: `Connected Wallet 0x0000...dEaD`; `Max`; `sDAI Available 0 sDAI`; `BUY sDAI`; `xDAI Balance`; `Max Approval`; action button `Split Collateral` or `Merge Collateral` (`STATE 020`, `STATE 022`, `STATE 030`, `STATE 032`).
- `xDAI Balance` shown as `0 xDAI` in GIP-152 split (`STATE 020`), but `24.689107 xDAI` in later GIP-152 and KIP-90 collateral panels (`STATE 021–023`, `STATE 030–033`).
- `Max Approval` copy: `Will request exact allowance for this transaction.` (`STATE 020`, `STATE 022`, `STATE 030`, `STATE 032`).
- Collateral Information copy: `Only deposit funds you intend to use for interactions within this proposal. Your collateral remains yours and can be retrieved at any time when not actively used in ongoing trades.` (`STATE 020`, `STATE 022`, `STATE 030`, `STATE 032`).
- `Add Collateral` appears alongside Split/Merge with `sDAI` / `GNO` or `sDAI` / `PNK` options; no separate Add Collateral interaction state captured (`STATE 020`, `STATE 022`, `STATE 030`, `STATE 032`).

## Add Liquidity
- `Add Liquidity` opens a panel with copy: `Add liquidity to earn fees from trades. Click on any pool to open Swapr and add liquidity.` (`STATE 028`).
- Pool categories/pairs shown:
  - Conditional Pools: `YES PNK / YES sDAI`; `NO PNK / NO sDAI`
  - Prediction Pools: `YES sDAI / sDAI`; `NO sDAI / sDAI`
  - Company Token Pools: `YES PNK / sDAI`; `NO PNK / sDAI` (`STATE 028`).

## Network / wallet / theme controls
- `Chain Selector` opens `Switch Networks` with `Ethereum`, `Gnosis`, and `Connected` under Gnosis (`STATE 026`).
- Wallet/

## NOTES CHUNK 3
## Scope / screens
- All captures are Futarchy market pages on **Gnosis**, account button **👾 0x00…dEaD**; footer: “Futarchy — Market-based evaluation of governance decisions and milestones — Social” (STATE 036-049,051).
- **GNO market**: “What will the impact on GNO price be if GIP-151 is passed?” (STATE 036-043).
- **PNK market**: “What will the impact on PNK price be if KIP-88 is approved?” (STATE 044-049,051).
- Overlays/screens: Chain Selector → “Switch Networks” (036,046); account popover (037,047); Add Liquidity modal (038,048); TWAP Complete click (039,049); Split Collateral modal (040-041); Merge Collateral modal (042-043,051); light-mode toggle (045).

## GNO market fields (STATE 036-043)
- **Question/title**: “What will the impact on GNO price be if GIP-151 is passed?”; **Impact (spot)** shown as `—`; **Status** `Resolved` (036).
- **Volume (Total; sDAI)**: `89.13K`; **TVL**: `101.20K`; **Resolution Date**: `7/3/2026`; **Resolution Question**: `Resolved: YES`; **Final Result**: `APPROVED` (036).
- Resolution copy: “Will GIP-151 (one-time pro-rata treasury redemption) be passed by GnosisDAO? Resolves Yes if GIP-151 is passed by GnosisDAO; otherwise resolves No.” plus Snapshot URL `https://snapshot.box/#/s:gnosis.eth/proposal/0x657...` (036).
- **TWAP Complete (TWAP impact +0.01%)**; **FINAL TWAP WINDOW UPDATED** timestamps range `10:58:14 PM` to `11:00:11 PM`; **YES TWAP** `84.4796`→`84.4795`; **NO TWAP** `84.4721`→`84.4720`; message: “YES outcome is ahead on TWAP.” (036-043).
- TWAP explanation: recommendation uses TWAP of pass/yes outcome over 24-hour window ending one day before Snapshot vote ends; `> +1%` approve, `< -1%` reject, otherwise neutral (036).
- **Trading Pair**: `GNO/sDAI`; **Yes Price**: `84.20 sDAI`; **No Price**: `84.20 sDAI`; **Status**: `Resolved`; **Impact (spot)**: `—` (036).
- **Redeem Tokens**: `WINNING OUTCOME: YES`; `No redeemable tokens found`; “You don't have any YES outcome tokens to redeem.”; **Resolved: YES** (036).
- Trade preview: **If Yes** `0.00000111 GNO` Receive; **If No** `1.00 sDAI` Recover; **Price impact** `1082765.91%`; warning “Price impact too high — pool depth insufficient for this size. Trade anyway.”; also `Insufficient balance` (036).
- View matrix: label “Your view on GIP-151”; **If YES**: Bullish `BUY`, Bearish `SELL`; **If NO**: Bullish `SELL`, Bearish `BUY` (036).
- Balances: sDAI `0 sDAI`; mergeable `YES 0 · NO 0`; Wallet `0 sDAI`; GNO row `0 GNO`; mergeable `YES 0 · NO 0`; Wallet `0.0004 GNO` (036).

## PNK market fields (STATE 044-049,051)
- **Question/title**: “What will the impact on PNK price be if KIP-88 is approved?”; **Impact (spot)** `—`; **Status** `Resolved` (044).
- **Volume (Total; sDAI)**: `11.89K`; **TVL**: `40.89` (no unit shown in capture); **Resolution Date**: `6/9/2026`; **Resolution Question**: `Resolved: YES`; **Final Result**: `APPROVED` (044).
- Resolution copy: “Will KIP-88 (DAO Guidance to the Cooperative) be approved ('Yes') or rejected ('No') by Kleros Governance? If the proposal is not approved by the end of the Snapshot vote, results as ('No').” (044).
- **TWAP Complete (TWAP impact +2.23%)**; **FINAL TWAP WINDOW UPDATED** timestamps range `11:00:36 PM` to `11:04:00 PM`; **YES TWAP** `0.008888`; **NO TWAP** `0.008690`; “YES outcome is ahead on TWAP.” (044-049,051).
- TWAP explanation: recommendation uses TWAP of “pass”/yes outcome over a 24-hour period; positive difference → approve, otherwise reject (044).
- **Trading Pair**: `PNK

## NOTES CHUNK 4
## Screen / purpose
- STATE 052 is a market detail page at `/markets/0x0cae5e6f520e52e3d6a93c856bb6dbf7781f2e31`, labeled in the capture as “Merge Collateral hover chart”; header shows “Futarchy” and “Gnosis.” [STATE 052]
- Market question: “What will the impact on PNK price be if KIP-88 is approved?” Market status is Resolved; resolution is “Resolved: YES”; winning outcome is “YES”; final result is “APPROVED.” [STATE 052]
- Page appears to combine futarchy TWAP recommendation, market prices, trade/redeem UI, and collateral split/merge UI. Footer tagline: “Market-based evaluation of governance decisions and milestones.” [STATE 052]

## Data fields / formats
- Volume: `11.89K` labeled “Volume (Total; sDAI)” with info icon. [STATE 052]
- TVL: `40.89` with info icon; no unit displayed. [STATE 052]
- Resolution Date: `6/9/2026`. [STATE 052]
- Resolution Question text: “Will KIP-88 (DAO Guidance to the Cooperative) be approved ('Yes') or rejected ('No') by Kleros Governance? If the proposal is not approved by the end of the Snapshot vote, results as ('No').” [STATE 052]
- Trading Pair: `PNK/sDAI`; Yes Price: `0.0085 sDAI`; No Price: `0.0083 sDAI`; “Impact (spot)” shows `—`. [STATE 052]
- TWAP panel: “TWAP Complete”; “TWAP impact +2.23%”; “FINAL TWAP WINDOW UPDATED 11:04:00 PM”; “YES TWAP 0.008888”; “NO TWAP 0.008690”; copy says “YES outcome is ahead on TWAP.” [STATE 052]
- Redeem area: “WINNING OUTCOME: YES”; “No redeemable tokens found”; “You don't have any YES outcome tokens to redeem.” [STATE 052]
- Trade preview: Amount `(sDAI)`; Available `-`; “If Yes” shows `138.17 PNK` with “Receive”; “If No” shows `1.00 sDAI` with “Recover”; Price impact `9.78%`; error text “Insufficient balance.” [STATE 052]
- Balances: sDAI `0 sDAI`; PNK `0 PNK`; for both, “mergeable” `YES 0 · NO 0`; wallet label `0x0000...dEaD`; xDAI Balance `24.689107 xDAI`; sDAI Available `0 sDAI`. [STATE 052]
- Top-right wallet is shown as `0x00…dEaD`; connected-wallet area shows `0x0000...dEaD`. [STATE 052]

## Charts / graphics
- State metadata reports `charts=2`, `tables=2`; visible chart-related content is the “TWAP Complete” panel comparing YES TWAP `0.008888` vs NO TWAP `0.008690` and stating YES is ahead. [STATE 052]
- No axis labels, plotted series labels, or time-series values beyond the TWAP numbers are visible in the capture. “Impact (spot)” is present as a field but shows only `—`. [STATE 052]

## Controls
- “Add Liquidity” control/link. [STATE 052]
- Buy / Sell controls; “If Yes” / “If No” outcome selectors; Amount `(sDAI)` input; `Max`; `Available`; “More info.” [STATE 052]
- “Redeem Tokens” control, shown with no redeemable tokens found. [STATE 052]
- “Split Collateral” and “Merge Collateral” controls. [STATE 052]
- Sidebar “Merge Collateral” exposes `sDAI` and `PNK` choices, plus `Max`, `sDAI Available`, `BUY sDAI`, and `Max Approval`. [STATE 052]
- “Max Approval” copy: “Will request exact allowance for this transaction.” [STATE 052]

## Wallet-gated / empty / ended / error states
- Market is ended/resolved: status “Resolved,” resolution “Resolved: YES,” winning outcome “YES,” final result “APPROVED.” [STATE 052]
- Empty redeem state: “No redeemable tokens found”; “You don't have any YES outcome tokens to redeem.” [STATE 052]
- Zero balances for sDAI and PNK; mergeable YES/NO both `0`; sDAI Available `0 sDAI`. [STATE 052]
- Error state visible: “Insufficient balance.” [STATE 052]
- Connected wallet display shows nonzero xDAI `24.689107 xDAI` alongside `0 sDAI` and `0 PNK`. [STATE 052]

## Concept copy
- TWAP explanation: recommendation is based on the time-weighted average price (TWAP) of the “pass” (yes) outcome over a 24 hour period; positive difference recommends approve, otherwise reject. [STATE 052]
- Collateral explanation: “Only deposit funds you intend to use for interactions within this proposal. Your collateral remains yours and can be retrieved at any time when not actively used in ongoing trades.” [STATE 052]
- “Your view on KIP-88” table maps Bullish → BUY if YES / SELL if NO; Bearish → SELL if YES / BUY if NO. [STATE 052]

## Odd / confusing
- “Impact (spot)” shows `—` even though the market is resolved and other outcome data is present. [STATE 052]
- Volume has unit `sDAI`; TVL `40.89` has no displayed unit. [STATE 052]
- Same wallet appears with two different truncations: `0x00…dEaD` top-right vs `0x0000...dEaD` in connected-wallet area. [STATE 052]
- “Merge Collateral” appears repeatedly: capture label, main control, and sidebar heading; unclear which exact element triggered the hover/chart state. [STATE 052]
- Buy/Sell UI and “Insufficient balance” remain visible on a resolved market while redeem says no redeemable tokens exist. [STATE 052]
- Trade preview is asymmetric: “If Yes 138.17 PNK Receive” vs “If No 1.00 sDAI Recover.” [STATE 052]
- `Available -` appears near the amount input, while sidebar shows `sDAI Available 0 sDAI`. [STATE 052]