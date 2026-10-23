## NOTES CHUNK 1
**Scope**
- All captures are the `app.seer.pm` root feed plus overlays/nav states; every state reports `charts=0 tables=0`. No rendered chart, graphic, or table is visible in the captures (STATE 001–008).
- Recurring beta notice: “Note that this is a Beta version and can still be unstable” (STATE 001–008).

**Screens / purpose**
- `STATE 001` `/`: Markets home. Shows beta notice, top nav, wallet address/balance, `Filters`, `Create New Market`, `My collections`, and a market-card feed.
- `STATE 002` `Policies`: Clicking `Policies` shows headings `Verified Market Policy` and `Market Rules Policy`; the market feed remains visible. No policy body text is captured.
- `STATE 003` `App`: Clicking `App` opens items `Futarchy`, `Deepfunding`, `Foresight`, `Opportunity Markets`; market feed remains unchanged.
- `STATE 004` wallet menu: Clicking `24.69 xDAI` opens `Account`, `Deposit`, `Portfolio`, `Market Collections`, `Trade Collateral`, `Use smart account`; feed remains unchanged.
- `STATE 005` dark mode: Clicking `Switch to dark mode` changes no captured text content; no visual styling is captured.
- `STATE 006` `Filters`: Opens filter panel over/with the market feed.
- `STATE 007`: Clicking `Open interest and liquidity breakdown` produces no visible breakdown data in the capture; no chart/table.
- `STATE 008` search `e`: URL becomes `/?marketName=e`; header shows `Connect` instead of address/balance; feed remains unchanged and unfiltered in captured text.

**Data fields / formats**
- Wallet header: truncated hex address `0x0000...dEaD`; balance `24.69 xDAI` (currency unit `xDAI`, 2 decimals) (STATE 001–007).
- Disconnected/connect header: `Connect`; no address or balance shown (STATE 008).
- Market question: free-text question, often with dates, placeholders, or units, e.g. `[party bloc]`, `[Note]`, `[gwei]` (STATE 001–008).
- Outcome rows: outcome label plus percentage, e.g. `Yashar 60.9%`, `No 67.9%`, `Yes 50%`, `YES 80.5%` (STATE 001–008).
- Market volume/value: dollar-formatted amount, with `k` suffix for thousands, e.g. `$27.74k`, `$918.38`, `$1.10k` (STATE 001–008).
- Numeric-market value: numeric value plus unit, e.g. `21.23 NOTE` and `9.092 GWEI`; also shows two numeric bounds: `10`/`50` for NOTE and `0.1`/`120` for GWEI (STATE 001–008).
- Filter fields: `Market States`, `Verification Status`, `Chain`, `Sort By`, `Conditional Market`, `Rewards`, `Minimum Liquidity`, `Futarchy` (STATE 006).
- No leaderboard or create-market form fields are captured; those nav items are visible but not opened.

**Market cards captured (same list across STATE 001–008; last card truncated)**
1. Israeli Knesset 2026: `Yashar 60.9%`, `Likud 38.2%`, `Others 0.9%`; `$27.74k`.
2. National Rally candidate win next French presidential: `No 67.9%`, `Yes 32.1%`; `$7.54k`.
3. Marine Le Pen National Rally candidate next French presidential: `Yes 85.1%`, `No 14.9%`; `$7.16k`.
4. France National Assembly seats `[party bloc]`: `Left (...) 36.9%`, `Centre (...) 34%`, `Far Right (...) 29.1%`; `$6.45k`.
5. National Rally candidate win next French presidential (duplicate title): `No 74%`, `Yes 26%`; `$1.24k`.
6. Polymarket negative-risk fix before Jan 1 2027: `No 51.6%`, `Yes 48.4%`; `$1.18k`.
7. Polymarket API fees paid per individual positions by Jan 1 2027: `Yes 50%`, `No 50%`; `$1.17k`.
8. Polymarket oracle other than UMA before Jan 1 2027: `No 65.8%`, `Yes 34.2%`; `$1.15k`.
9. Polymarket public API documented fees-paid endpoint by Jan 1 2027: `No 69.7%`, `Yes 30.3%`; `$1.12k`.
10. Kurdish militant armed attack inside Iran 2026: `No 90.9%`, `Yes 9.1%`; `$1.12k`.
11. Polymarket clarification notes causing ≥25pp

## NOTES CHUNK 2
## Scope and shared layout
- All captures are the same `/leaderboard` page; page purpose: rank wallets by trading P/L in USD. (STATE 009–019)
- Persistent Beta notice: “Note that this is a Beta version and can still be unstable.” (STATE 009–019)
- All states show `charts=0`, `tables=1`; no charts/graphics are present. The only data graphic is the leaderboard table. (STATE 009–019)
- Crawler control counts: 009=75, 010=78, 011=80, 012=82, 013=75, 014=75, 015=61, 016=74, 017=75, 018=84, 019=75. (STATE 009–019)
- Top nav controls: `Markets`, `Leaderboard`, `Create Market`, `Policies`, `App`. (STATE 009–019)
- Wallet/header area: connected state shows truncated address `0x0000...dEaD` and balance `24.69 xDAI`; disconnected state shows `Connect`. (STATE 009–014, 017–019 vs. STATE 015–016)
- Breadcrumb: `/ Leaderboard`. (STATE 009–019)

## State-by-state screens and observed controls
- **STATE 009 — page load:** baseline leaderboard. Controls present: nav items, wallet/balance button, `1D`, `1W`, `1M`, `ALL`, `Filters`, `Your Rank`, `Search`, `Prev`, `Next`; table sorted by `Profit/Loss, high to low`.
- **STATE 010 — click `Policies`:** opens a Policies menu containing `Verified Market Policy` and `Market Rules Policy`; no policy content page is captured. (STATE 010)
- **STATE 011 — click `App`:** opens an App menu containing `Futarchy`, `Deepfunding`, `Foresight`, `Opportunity Markets`; no app-selection result is captured. (STATE 011)
- **STATE 012 — click `24.69 xDAI`:** opens an account/wallet menu containing `Account`, `Deposit`, `Portfolio`, `Market Collections`, `Trade Collateral`, `Use smart account`; no menu-item result is captured. (STATE 012)
- **STATE 013 — click `Switch to light mode`:** theme-toggle control; captured table/content is unchanged in the text capture. (STATE 013)
- **STATE 014 — click `1D`:** shows `Updating…`; table still displays the same rows/page count/timestamp as the ALL capture, so no distinct 1D result is captured. (STATE 014)
- **STATE 015 — click `1W`:** loads a different table: `Page 1 of 91`, updated `10/18/2026, 8:51:04 PM`; header shows `Connect` and `Your Rank` is absent. (STATE 015)
- **STATE 016 — click `1M`:** shows `Updating…`; table still matches the ALL capture rows/page count/timestamp; header shows `Connect` and `Your Rank` is absent. (STATE 016)
- **STATE 017 — click `ALL`:** returns to the ALL-time table, connected wallet/balance, `Your Rank` present, `Page 1 of 166`, updated `10/18/2026, 8:39:31 PM`. (STATE 017)
- **STATE 018 — click `Filters`:** expands a filter panel with `App` options `All`, `Foresight`, `Opportunity Markets`, `Deepfunding`; and `Chain` options `All`, `Ethereum`, `OP Mainnet`, `Gnosis`, `Base`. (STATE 018)
- **STATE 019 — click `Your Rank`:** shows progress text `Finding your rank…`; table remains visible. (STATE 019)

## Table fields and formats
- Columns, in order: `#`, `Account`, `Score`, `Profit/Loss`, `Volume`, `ROI`, `Traded Markets`. (STATE 009–019)
- `#`: integer rank from 1–25 visible per page. (STATE 009–019)
- `Account`: pseudonymous hyphenated names, ENS names, or `@handle · ENS`; duplicates appear in the same table. (STATE 009–019)
- `Score`: numeric roughly 0–100 with one decimal, plus text band `ELITE`, `GREAT`, `GOOD`, `AVERAGE`; or `N/A`. Examples: `87.5 ELITE`, `78.6 GREAT`, `46.5 AVERAGE`, `N/A`. (STATE 009–019)
- `Profit/Loss`: signed USD with `+$`, thousands separators, two decimals, e.g. `+$241,172.15`; all visible P/L values are positive. (STATE 009–019)
- `Volume`: USD with `$`, thousands separators, two decimals, e.g. `$1,428,994.85`; can be `$0.00`. (STATE 009–019)
- `ROI`: signed percent, one decimal, e.g. `+30.3%`, `+1,368,132.0%`; or `N/A`. (STATE 009–019)
- `Traded Markets`: integer count, e.g. `55`, `327`, `0`. (STATE 009–019)
- Footer: `Page 1 of 166` or `Page 1 of 91`, plus `Updated 10/18/2026, 8:39:31 PM` or `8:51:04 PM`; `Prev`, `Next`. (STATE 009–019)
- Sort descriptor: `Sorted by Profit/Loss, high to low`. (STATE 009–019)

## Copy explaining concepts
- “Profit & Loss Leaderboard.” (STATE 009–019)
- “Rankings of wallets by trading P/L in USD. All covers every Seer market on a chain (including markets not assigned to an app). App filters scope to that app’s configured markets; Deepfunding and Foresight also offer per-market boards.” (STATE 009–019)
- “Trader Score rates each wallet 0–100 on returns, profit factor, hit rate edge, loss burn and breadth across the markets it traded, shrunk toward the middle when it traded few of them. How it works.” (STATE 009–019)
- Time-period labels: `1D`, `1W`, `1M`, `ALL`. (STATE 009–019)
- Loading/progress copy: `Updating…`; `Finding your rank…`. (STATE 014, 016, 019)

## Wallet-gated / loading / empty / error states
- Wallet-gated/header change: STATE 015 and STATE 016 show `Connect` instead of the address/balance; leaderboard rows are still visible. (STATE 015–016)
- Connected wallet state: short address `0x0000...dEaD` and `24.69 xDAI`. (STATE 009–014, 017–019)
- Loading states: `Updating…` after `1D`/`1M`; `Finding your rank…` after `Your Rank`. (STATE 014, 016, 019)
- No empty-results, ended-market, or error states are visible in these captures. (STATE 009–019)

## Odd / confusing observations
- Time filters behave inconsistently in captures: `1W` produces a distinct table and `Page 1 of 91`, while `1D` and `1M` show `Updating…` but retain the same ALL rows, page count, and update timestamp. (STATE 014–016)
- STATE 015 and STATE 016 show `Connect` after time-filter clicks, while other states show a connected wallet. (STATE 015–016)
- Rows can rank highly with `Score N/A`; e.g. STATE 015 rank 1 has `N/A` score. (STATE 015)
- Rows can show positive P/L and ROI with `Volume $0.00` and/or `Traded Markets 0`; e.g. STATE 015 rank 1 has `+$274.29`, `$0.00`, `+1.0%`, `0` markets. (STATE 015)
- Extreme ROI appears alongside `$0.00` volume and 0 traded markets: ALL table row 24 shows `+1,368,132.0%`, `$0.00`, `0`. (STATE 009–019)
- Duplicate account names appear with different stats/ranks in the same table: `stormy-dull-puffin` at ranks 12 and 15; `indirect-mere-gibbon` at ranks 16 and 19. (STATE 009–019)
- Many ranked rows have `Score N/A` and no score band. (STATE 009–019)
- The `App` menu includes `Futarchy`, but the `Filters` App options list omits Futarchy and shows `All`, `Foresight`, `Opportunity Markets

## NOTES CHUNK 3
## Scope / state map
- **STATE 020–026** — `/leaderboard`: “Profit & Loss Leaderboard” table; search/sort/pagination variations. Controls=75, charts=0, table=1. [STATE 020–026]
- **STATE 027–031** — `/create-market`: “Create New Market” type-selection start, plus Policies/App/wallet/theme overlays. Controls=17–24, charts=0, tables=0. [STATE 027–031]
- **STATE 032–036** — `/collections/default`: “Default” market collection, sign-in-gated/empty, plus overlay/theme states. Controls=16–23, charts=0, tables=0. [STATE 032–036]
- **STATE 037–040** — market detail for “Which party or joint electoral list will win the most seats in Israeli Knesset election in 2026?”; outcomes, trade panel, comments, chart hover, App overlay. Controls=67–72, charts=3, table=1. [STATE 037–040]

## Data fields and formats
- **Global wallet/address**: `0x0000...dEaD`; balance `24.69 xDAI`. [STATE 020–040]
- **Leaderboard columns**: `#` integer rank; Account name / ENS / handle; Score `0–100` one-decimal plus label `ELITE`/`GREAT`/`GOOD`/`AVERAGE` or `N/A`; Profit/Loss signed USD e.g. `+$241,172.15`; Volume USD e.g. `$1,428,994.85`; ROI signed percent e.g. `+30.3%` or `N/A`; Traded Markets integer. [STATE 020–025]
- **Leaderboard pagination/status**: `Page 1 of 166`, `Page 2 of 166`; `Updated 10/18/2026, 8:39:31 PM`; sort-status text such as `Sorted by Profit/Loss, high to low` and transient `Updating…`. [STATE 020–025]
- **Market header fields**: status `Reports open`; type `Categorical`; `Liquidity: 27.74k`; `Volume: 5.10k`; `P&L: 0.00`; badge `Verified`; link `Answer on Reality.eth!`. [STATE 037–040]
- **Outcome rows**: `#1 Yashar` `60.8%`; `#2 Likud` `38.1%`; `#3 Others` `0.9%`; `#4 Together Alliance` `0.5%`; `#5 Invalid` shows `9.00 SER-INVALID` and `0%`. [STATE 037–040]
- **Trade panel fields**: `You pay sDAI` / `0 sDAI`; `Max`; `You will get Yashar`; `Avg price 0 sDAI`; `Potential return 0.00 sDAI (0.00%)`; `Max slippage 1%`; `Enter an amount`; `Amount`; `Balance: 0 sDAI`; collateral choices `sDAI`/`xDAI`; action `Mint`. [STATE 037–040]
- **Chart hover tooltip fields**: timestamp `Sep 22, 2026 02:30`; `Yashar: 59.60%`; `Likud: 39.10%`; `Others: 1.00%`; `Together Alliance: 0.50%`. [STATE 039]
- **Collection fields**: collection name `Default`; empty message `No markets in this collection.` [STATE 032–036]

## Charts / graphics
- Leaderboard, create-market, and collections captures show **0 charts**. [STATE 020–036]
- Market page shows **3 chart instances**; only one hover state is captured. The hover tooltip links a timestamp to outcome percentages, e.g. `Sep 22, 2026 02:30` with Yashar/Likud/Others/Together Alliance percentages. The chart’s explicit title/axis labels are not present in the capture. [STATE 037–039]

## Controls and actions
- **Global nav**: `Markets`, `Leaderboard`, `Create Market`, `Policies`, `App`. [STATE 020–040]
- **Policies menu**: reveals `Verified Market Policy`, `Market Rules Policy`; page content remains unchanged. [STATE 028, 033, 038]
- **App menu**: reveals `Futarchy`, `Deepfunding`, `Foresight`, `Opportunity Markets`; page content remains unchanged. [STATE 029, 034, 040]
- **Wallet menu** from `24.69 xDAI`: `Account`, `Deposit`, `Portfolio`, `Market Collections`, `Trade Collateral`, `Use smart account`. [STATE 030, 035]
- **Theme toggle**: labels seen: `Switch to dark mode` [STATE 031], `Switch to light mode` [STATE 036].
- **Leaderboard controls**: time period `1D`/`1W`/`1M`/`ALL`; `Filters`; `Your Rank`; `Search`; sortable column headers `#`, `Account`, `Score`, `Profit/Loss`, `Volume`, `ROI`, `Traded Markets`; pagination `Prev`/`Next`. [STATE 020–026]
- **Create Market controls**: type choices `Categorical`, `Scalar`, `Multi Categorical`, `Multi Scalar`; `Next`. [STATE 027–031]
- **Market controls**: period buttons `1D`/`1W`/`1M`/`All`/`Custom`; per-outcome `Add Liquidity`, `View pool details`, `New conditional market`; trade actions `Mint`, `Merge`, `Redeem`; tabs `Comments`, `Related Conditional Markets`, `Top Holders`, `Activity`; `Connect to comment`. [STATE 037–040]

## Wallet-gated / empty / status states
- **Collections**: `Sign in to view and manage your market collections`; `Default` shows `No markets in this collection.` [STATE 032–036]
- **Comments**: `Connect your wallet to share your take`; `Connect to comment`; `No takes yet. Share the first one.` [STATE 037–040]
- **Trade panel**: no amount entered; `0 sDAI` pay amount, `0 sDAI` balance, `Potential return 0.00 sDAI (0.00%)`. [STATE 037–040]
- **Market status**: `Reports open`; no ended-market state shown. No explicit error state shown; only Beta warning and `Updating…` loading text on leaderboard sort clicks. [STATE 020–040]

## Copy explaining concepts
- Beta warning: `Note that this is a Beta version and can still be unstable`. [STATE 020–040]
- Leaderboard explanation: rankings by trading P/L in USD; `All` covers every Seer market on a chain, including markets not assigned to an app; `App` scopes to that app’s configured markets; Deepfunding/Foresight offer per-market boards. [STATE 020–025]
- Trader Score explanation: rates wallets `0–100` on returns, profit factor, hit rate edge, loss burn, and breadth across traded markets; shrunk toward the middle when few markets traded; `How it works.` [STATE 020–025]
- `N/A` explanations: too little history to score [STATE 021]; ROI `N/A` means under `$0.01` of capital [STATE 024].

## Odd / confusing observations
- **Sort labels vs table order conflict**: clicking Score says `Sorted by Score, high to low`, but rows remain P/L-descending and Score values are not ordered (`87.5` appears at rank 4 after `78.6` at rank 1). [STATE 021]
- Clicking Profit/Loss descending says `Sorted by Profit/Loss, low to high`, but rows remain high-to-low. [STATE 022]
- Clicking Volume/ROI says sorted high-to-low, but rows remain identical to the P/L order. [STATE 023–024]
- `Next` changes pagination to `Page 2 of 166` but the displayed rows/ranks 1–25 are identical to page 1. [STATE 025]
- Typing `e` into search shows no visible query value and no visible table change. [STATE 026]
- Duplicate accounts appear with different stats: `stormy-dull-puffin` at ranks 12 and 15; `indirect-m

## NOTES CHUNK 4
**Screens / purpose**
- STATE 041: Market detail/trading page for a categorical Seer market; trigger was clicking header balance `24.69 xDAI`. Shows market status, outcome probabilities, trade panel, liquidity/reporting controls, comments/tabs.
- STATE 042: “Switch to light mode” trigger; captured page body is effectively the same market view. Header account dropdown items seen in 041 (`Account`, `Deposit`, `Portfolio`, `Market Collections`, `Trade Collateral`, `Use smart account`) are absent in the captured 042 header.
- STATE 043: Clicking `Answer on Reality.eth!` opens `Report Answer` modal for unresolved Reality.eth reporting.
- STATE 044: `Open interest and liquidity breakdown` reveals open interest, volume/notional, and per-outcome pool balances.
-

## NOTES CHUNK 5
**Shared market page shell (STATE 056–069)**
- Purpose: market detail page for a conditional categorical market; same page is reused with menus, modals, tabs, and overlays (STATE 056–069).
- Beta copy: “Note that this is a Beta version and can still be unstable” (STATE 056–069).
- Header/nav: Markets, Leaderboard, Create Market, Policies, App; wallet shown as `0x0000...dEaD` with `24.69 xDAI` in most states (STATE 056–066, 068–069). State 067 instead shows `Connect` and no wallet balance (STATE 067).
- Market title: “Will the National Rally’s candidate win the next French presidential election?”; tags/status: `Conditional Market`, `Categorical`, `Verified`, `Reports open`; link/button “Answer on Reality.eth!” (STATE 056–069).
- Liquidity field: `7.54k` with no currency/unit shown; Volume field: `11.75k` with no unit shown (STATE 056–069).
- Outcome rows: `#1 No` `74.5%`, `#2 Yes` `35.3%`, `#3 Invalid` `0%`; each row has `Add Liquidity`, `View pool details`, and `New conditional market` (STATE 056–069).
- Chart time controls: `1D`, `1W`, `1M`, `All`, `Custom` (STATE 056–069). Main visible chart is an outcome-price/probability chart; hover tooltip in STATE 057 shows `May 6, 2026 01:00`, `No: 84.70%`, `Yes: 14.60%`.
- Trade widget fields: `No Market`; `You pay` `LEPEN_NRYES`; amount `0 LEPEN_NRYES`; `Max`; `You will get` `No`; `Avg price` `0 LEPEN_NRYES`; `Potential return` `0.00 LEPEN_NRYES (0.00%)`; `Parameters:` `Max slippage 1%`; `Enter an amount`; `More`; `Mint` / `Merge` / `Redeem` tabs; `Amount`; `Max`; `Balance: 0 LEPEN_NRYES`; `Mint` button (STATE 056–069).
- Major Events: `1 UPCOMING`; `MAY 31, 2027 · 00:00 UTC`; `Reality.eth Resolution`; `Expected resolution date` (STATE 056–069).
- Tabs: `Comments`, `Related Conditional Markets`, `Top Holders`, `Activity` (STATE 056–069).
- Empty/wallet-gated comments: “Connect your wallet to share your take”, “Connect to comment”, “No takes yet. Share the first one.” (STATE 056–066, 068–069); STATE 067 shows `Connect` and `Switch to Gnosis` (STATE 067).
- No explicit error message seen in these captures.

**State-specific screens/controls**
- STATE 056 `Policies`: Policies nav exposes `Verified Market Policy`, `Market Rules Policy`, and `App` (STATE 056).
- STATE 057 chart hover: tooltip data as above; no other chart change visible (STATE 057).
- STATE 058 `App`: App menu expands to `Futarchy`, `Deepfunding`, `Foresight`, `Opportunity Markets` (STATE 058).
- STATE 059 `Switch to dark mode`: theme-toggle control clicked; captured text content unchanged (STATE 059).
- STATE 060 `Answer on Reality.eth!`: opens `Report Answer` modal: “This market is not resolved yet. You can provide an answer to the Reality question by depositing a bond of 10 XDAI.”; `Current answer: Not answered yet`; controls `Choose an answer`, `Mark this question invalid`, `Return`, `Answer` (STATE 060).
- STATE 061 `Open interest and liquidity breakdown`: shows `Open interest: 7.22k LEPEN_NRYES (7.68k $)`; `Volume: 11.75k $ traded, notional 17.31k $`; `Liquidity: No: 7.18k LPY_NR_NO / 0.38 LEPEN_NRYES`; `Yes: 1.49k LPY_NR_YES / 1.21k LEPEN_NRYES` (STATE 061).
- STATE 062 `Custom`: opens date-range picker with `Today`, `Last Week`, `Last Month`, `All`, `Previous Month`, `Next Month`, month label `October 2026`, calendar grid `Su Mo Tu We Th Fr Sa`, dates, and `Cancel` / `Save` (STATE 062).
- STATE 063 `Add Liquidity`: opens `Add Liquidity` / `Farming Rewards` modal: “Earn farming rewards (SEER) by providing liquidity to existing markets.”; `Available Pools:`; `Rewards ended on: January 4 2026, 22:31`; controls `Add liquidity`, `Learn more about the farming program`, `Return` (STATE 063).
- STATE 064 `View pool details`: button changes to `Hide pool details`; expands `Liquidity Chart`; `Pool Id: 0x2e5b...8626`; `Pool Balances: 0.38 LEPEN_NRYES / 7.18k LPY_NR_NO`; table-like series labeled `SHARES` and `TOTAL`; many numeric rows; `Last: 0.7454`; additional values `0.7453`, `2.73`, `2.73` (STATE 064).
- STATE 065 `Max`: clicked; captured text unchanged, no visible result in capture (STATE 065).
- STATE 066 `More`: clicked; captured text unchanged, no visible result in capture (STATE 066).
- STATE 067 `Comments`: wallet/connect state changes to `Connect`; shows `Switch to Gnosis`; comments remain empty: “No takes yet. Share the first one.” (STATE 067).
- STATE 068 `Related Conditional Markets`: tab shows `Related Conditional Markets (2)`; `Search by outcome:`; two cards with same title, both `Reports open` and `Answer on Reality.eth!`; differentiated by conditional text: one conditional on main question being `"Yes"`, the other on `"No"` (STATE 068).
- STATE 069 `Top Holders`: visible outcome tables for `Yes`, `No`, `Invalid`, each with `Balance` column:
  - Yes: `total-electronic-snake 5.73k`; `voluminous-worldwide-boar 1.49k`; `slimy-correct-hedgehog 0.14`; `@mr-froggert <0.001` (STATE 069).
  - No: `voluminous-worldwide-boar 7.17k`; `ripotche.eth 33.77`; `@mr-froggert 11.67`; `adequate-bitter-lemur 1.06`; `respectable-scientific-otter 0.40`; `slimy-correct-hedgehog 0.40`; `tense-individual-impala <0.001` (STATE 069).
  - Invalid: `voluminous-worldwide-boar 3.70k`; `total-electronic-snake 3.37k`; `stormy-dull-puffin 100.00`; `tense-individual-impala 36.53`; `@mr-froggert 10.00` (STATE 069).

**Concept-explaining copy**
- Conditional-market explanation: “This market is conditional on the resolution of ‘Will Marine Le Pen be the National Rally’s candidate in the next French presidential election?’ being ‘Yes’.” and “If the main market resolves to a different outcome, the tokens of this market will be worthless.” (STATE 056–069).
- Related-market condition copy: “Conditional on ‘Will Marine Le Pen be the National Rally’s candidate in the next French presidential election?’ being ‘Yes’” / `"No"` (STATE 068).
- Farming copy: “Earn farming rewards (SEER) by providing liquidity to existing markets.” (STATE 063).
- Reality report copy: not resolved yet; deposit `10 XDAI` bond; current answer `Not answered yet`; option to `Mark this question invalid` (STATE 060).
- Breakdown labels: `Open interest`, `Volume`, `Liquidity`, with some `$` and token-denominated values (STATE 061).

**Odd/confusing**
- Outcome percentages `No 74.5%` and `Yes 35.3%` do not sum to 100; `Invalid 0%` also shown (STATE 056–069).
- `Liquidity: 7.54k` and `Volume: 11.75k` lack units, while breakdown uses `$` and token units (STATE 056–069 vs STATE 061).
- Trade widget shows `No Market` and `You will get No`; outcome/action semantics are not self-evident (STATE 056–069).
- `Mint` appears multiple times in the trade widget (STATE 056–069).
- Top-holder balances have no unit label and mix `k`, decimals, and `<0.001` formats (STATE 069).
- Farming says rewards `ended on: January 4 2026, 22:31` despite expected resolution `MAY 31, 2027` (STATE 063 vs STATE 056–069).
- Related conditional markets have identical titles and are distinguished only by the conditional `"Yes"` / `"No"` text (STATE 068).
- Pool-details numeric series is hard to interpret; labels only `SHARES` / `TOTAL`, with anomalies such as `158.69` inserted in a descending series and final values `0.7453`, `2.73`, `2.73` (STATE 064).
- `Reports open` is shown while the report modal says the market is “not resolved yet” (STATE 056–069 vs STATE 060).
- Capitalization inconsistent: `xDAI` in wallet vs `XDAI` in bond copy (STATE 056–069 vs STATE 060).

## NOTES CHUNK 6
## Shared shell / nav
- Beta banner: “Note that this is a Beta version and can still be unstable” (STATE 070–086).
- Top nav: Markets, Leaderboard, Create Market, Policies, App (STATE 070–086).
- Wallet display: `0x0000...dEaD`; balance `24.69 xDAI` (STATE 070–086).
- Breadcrumb: `/ Market` (STATE 070–086).

## Main market screen — “Will Marine Le Pen be the National Rally’s candidate…?”
- Purpose: view/trade a verified categorical market; status `Reports open`; link/button `Answer on Reality.eth!` (STATE 072–086).
- Data fields: `Liquidity: 7.16k`; `Volume: 49.69k`; `P&L: 0.00`; `Verified` badge; type `Categorical` (STATE 072–086).
- Time filters: `1D`, `1W`, `1M`, `All`, `Custom` (STATE 072–086).
- Outcomes: `#1 Yes` at `84.2%`; `#2 No` at `14.8%`; `#3 Invalid` with `210.85 SER-INVALID` and `0%` (STATE 072–086).
- Outcome cards each have `Add Liqu

## NOTES CHUNK 7
Capture-only notes. Chart visuals/axes are not exposed in the text captures; only chart counts and visible controls/data are noted.

### STATE 087 — Top Holders tab
- Purpose: market detail page for a categorical market; “Top Holders” tab selected, showing holder balances by outcome [087].
- Metadata: controls=119, charts=2, tables=4 [087].
- Shell: Beta warning “Note that this is a Beta version and can still be unstable”; nav: Markets, Leaderboard, Create Market, Policies, App; wallet shown as `0x0000...dEaD`; balance `24.69 xDAI` [087].
- Market header: “Reports open”; title “Will Marine Le Pen be the National Rally’s candidate in the next French presidential election?”; “Answer on Reality.eth!”; type “Categorical”; `Liquidity: 7.16k`; `Volume: 49.69k`; `P&L: 0.00`; “Verified” [087].
- Outcome percentages: Yes `84.2%`; No `14.8%`; Invalid `0%` [087].
- Outcome cards: `#1 Yes` `84.2%`; `#2 No` `14.8%`; `#3 Invalid` with `210.85 SER-INVALID` and `0%`; each card has “Add Liquidity”, “View pool details”, “New conditional market” [087].
- Holder tables: visible Yes/No/Invalid tables. Values use `k` suffix and decimals, e.g. `6.58k`, `4.54k`, `454.03`, `10.37`, `6.81`, `2.65`; no unit shown [087].
  - Yes examples: `fiscal-vague-giraffe 6.58k`; `total-electronic-snake 4.54k`; `voluminous-worldwide-boar 3.60k`; `@seerious 6.81`; `@mr-froggert 2.65` [087].
  - No examples: `voluminous-worldwide-boar 15.55k`; `married-crude-limpet 1.97k`; `confident-faint-lamprey 26.28` [087].
  - Invalid examples: `voluminous-worldwide-boar 10.00k`; `total-electronic-snake 5.61k`; `squealing-violent-haddock 210.85` [087].
- Trade panel fields: “You pay” token `sDAI`, amount `0 sDAI`, “Max”; “You will get” `Yes`; “Avg price” `0 sDAI`; “Potential return” `0.00 sDAI (0.00%)`; “Parameters: Max slippage 1%”; “Enter an amount”; “More”; tabs/buttons “Mint”, “Merge”, “Redeem”; amount field with “Max”; `Balance: 0 sDAI`; token choices `sDAI` / `xDAI`; “Mint” [087].
- Event: `1 UPCOMING`; `JAN 1, 2027 · 00:00 UTC`; `Reality.eth Resolution`; `Expected resolution date` [087].
- Chart/graphic: metadata reports 2 charts, but text only exposes time-range controls `1D 1W 1M All Custom` and outcome percentages; no chart series/labels visible [087].

### STATE 088 — Activity tab
- Purpose: same market page with “Activity” tab selected; shows “My activity” transaction list [088].
- Metadata: controls=819, charts=2, tables=2 [088].
- Activity row format: username / action / amount / outcome-or-token / timestamp, e.g. `alive-rational-snipe Bought 0.89 Yes Oct 9, 2026 · 04:17` [088].
- Actions seen: `Bought`, `Sold`, `Split`; outcome labels `Yes`, `No`; `Split` amount shown with `sDAI` (`0.79 sDAI`) [088].
- Amount formats: decimals like `0.89`, `0.01`, `0.79`, `150.00`; below-threshold values shown as `<0.001` [088].
- Capture truncates mid-row at `<0` after many entries [088].
- Same market header, outcome percentages, outcome cards, trade panel, and Jan 1, 2027 event as STATE 087 [088].
- Chart/graphic: metadata reports 2 charts; visible text only shows outcome percentages/time-range controls, no chart axes/series [088].

### STATE 089 — Connect to comment
- Purpose: Comments interaction after clicking “Connect to comment” [089].
- Metadata: controls=59, charts=3, tables=1 [089].
- Error/wallet-gated state: `Signing in...`; `User rejected the request.` [089].
- Comment gate copy: `Connect your wallet to share your take`; button `Connect to comment`; empty state `No takes yet. Share the first one.` [089].
- Same market header, outcome percentages, outcome cards, trade panel, and Jan 1, 2027 event as STATE 087 [089].
- Chart/graphic: metadata reports 3 charts; no chart axes/series visible in text [089].

### STATE 090 — Seats / party bloc market page
- Purpose: separate market page for “How many seats in France’s National Assembly will [party bloc] win in the next French legislative election?”; status `Pending execution`; type `Multi Scalar` [090].
- Metadata: controls=77, charts=3, tables=1 [090].
- Header/title contains literal placeholder `[party bloc]`; `Deadline:` shown with no visible value; control `Hide questions` [090].
- Question rows: Far Right, Right, Centre, Left, Other; each shows `Answer: Answered too soon` and `Reopen question` [090].
- Market metrics: `Liquidity: 6.45k`; `Volume: 1.32k`; `P&L: 0.00`; `Verified` [090].
- Outcome percentages and approximate seats:
  - Left `31.6%`, `~ 182 seats`
  - Centre `29.1%`, `~ 168 seats`
  - Far Right `24.9%`, `~ 144 seats`
  - Right `7.6%`, `~ 44 seats`
  - Other `6.6%`, `~ 38 seats`
  - Invalid `0%` [090]
- Outcome cards each include “Add Liquidity”, “View pool details”, “New conditional market” [090].
- Trade panel selected outcome: `Left (UG, LFI, SOC, COM, VEC, RDG, DVG, EXG, …)`; “You pay” `sDAI` `0 sDAI`; “You will get” selected Left outcome; “Avg price” `0 sDAI`; `Calculate your potential return` instead of a numeric potential return; `Max slippage 1%`; Mint/Merge/Redeem; `Balance: 0 sDAI`; token choices `sDAI`/`xDAI` [090].
- Event: `1 UPCOMING`; `OCT 1, 2029 · 00:00 UTC`; `Reality.eth Resolution`; `Expected resolution date` [090].
- Comments gate/empty state also present: `Connect your wallet to share your take`; `Connect to comment`; `No takes yet. Share the first one.` [090].
- Chart/graphic: metadata reports 3 charts; visible text only shows outcome percentages/seat approximations, no chart axes/series [090].

### Concept/explanation copy seen
- Beta instability warning [087][088][089][090].
- “Answer on Reality.eth!” and `Reality.eth Resolution` event tie market resolution to Reality.eth [087][088][089][090].
- Status labels: `Reports open` [087][088][089]; `Pending execution` [090]; `Verified` [087][088][089][090].
- Trade parameter copy: `Max slippage 1%`; `Avg price`; `Potential return`; `Calculate your potential return` [087][088][089][090].
- Comment gate copy: “Connect your wallet to share your take”; “No takes yet. Share the first one.” [089][090].
- Resolution-state copy: `Answered too soon`; action `Reopen question` [090].

### Odd/confusing
- Invalid outcome card