# flows states (explorer; DeepSeek draft: Claude verifies against screenshots)

# Explorer user-flow audit

## Evidence boundary and notation
- Flows are reconstructed **only** from the supplied crawl notes, controls inventory, data model, and chart inventory.
- `[observed STATE n]` means the step/result is directly present in the notes for that state.
- `[inferred]` means the action or transition is inferred from observed links/controls/state adjacency, not directly captured as a click result.
- “No result captured” means the UI state after that action was not documented; it does **not** prove the product does nothing.
- No mobile-viewport state notes were supplied. Chart inventory marks market charts as `[desktop]`; controls inventory contains a `091m` token without corresponding state notes, so mobile behavior cannot be characterized.

---

## 1. Global shell and home flows

### F01 — Markets home load
1. Page: `/` [observed STATE 001] → no control → result: beta notice, top nav, wallet `0x0000...dEaD` / `24.69 xDAI`, `Filters`, `Create New Market`, `My collections`, and market-card feed [observed STATE 001].
2. Control: market title/card link with observed href to `/markets/100/...` [observed STATE 001 controls] → result: market-detail state [observed STATE 037]; click action [inferred].
3. Control: `Leaderboard` nav link with href `/leaderboard` [observed STATE 001 controls] → result: leaderboard page [observed STATE 009]; click action [inferred].
4. Control: `Create Market` nav link / `Create New Market` [observed STATE 001 controls] → result: create-market type-selection page [observed STATE 027]; click action [inferred].
5. Control: `My collections` link to `/collections/default` [observed STATE 001 controls] → result: collections page [observed STATE 032]; click action [inferred].

### F02 — Policies menu from shell
1. Page: shell [observed STATE 001] → control: `Policies` → result: menu with headings `Verified Market Policy` and `Market Rules Policy`; market feed remains visible [observed STATE 002].
2. Same control on leaderboard → same two policy menu headings; no policy content page captured [observed STATE 010].
3. Same control on create-market → policy menu; page content unchanged [observed STATE 028].
4. Same control on collections → policy menu; page content unchanged [observed STATE 033].
5. Same control on market detail → policy menu; page content unchanged [observed STATE 038].
6. Same control on conditional-market page → policy menu exposes `Verified Market Policy`, `Market Rules Policy`; no body text captured [observed STATE 056].
7. No policy body page or policy selection result was captured [not observed].

### F03 — App menu from shell
1. Page: shell [observed STATE 001] → control: `App` → result: menu items `Futarchy`, `Deepfunding`, `Foresight`, `Opportunity Markets`; market feed unchanged [observed STATE 003].
2. Same control on leaderboard → same App menu; no app-selection result [observed STATE 011].
3. Same control on create-market → same App menu; page unchanged [observed STATE 029].
4. Same control on collections → same App menu; page unchanged [observed STATE 034].
5. Same control on market detail → same App menu; page unchanged [observed STATE 040].
6. Same control on conditional-market page → same App menu; page unchanged [observed STATE 058].
7. No `Futarchy` / `Deepfunding` / `Foresight` / `Opportunity Markets` selection result was captured [not observed].

### F04 — Wallet menu from connected header
1. Page: shell [observed STATE 001] → control: `24.69 xDAI` → result: menu `Account`, `Deposit`, `Portfolio`, `Market Collections`, `Trade Collateral`, `Use smart account`; feed remains unchanged [observed STATE 004].
2. Same control on leaderboard → same menu items; no item-selection result [observed STATE 012].
3. Same control on create-market → same menu items; page unchanged [observed STATE 030].
4. Same control on collections → same menu items; page unchanged [observed STATE 035].
5. No `Account`, `Deposit`, `Portfolio`, `Market Collections`, `Trade Collateral`, or `Use smart account` destination/result was captured [not observed].

### F05 — Theme toggle
1. Page: shell [observed STATE 001] → control: `Switch to dark mode` → result: captured text content unchanged; no visual styling captured [observed STATE 005].
2. Leaderboard `Switch to light mode` → captured table/content unchanged in text capture [observed STATE 013].
3. Create-market `Switch to dark mode` [observed STATE 031], collections `Switch to light mode` [observed STATE 036], conditional-market `Switch to dark mode` [observed STATE 059] → no captured textual/style result.
4. Final visual appearance, persistence, or system-theme behavior cannot be observed [not observed].

### F06 — Home Filters
1. Page: `/` [observed STATE 001] → control: `Filters` → result: filter panel over/with market feed [observed STATE 006].
2. Observed filter fields: `Market States`, `Verification Status`, `Chain`, `Sort By`, `Conditional Market`, `Rewards`, `Minimum Liquidity`, `Futarchy` [observed STATE 006].
3. Apply/reset/close result and filtered-feed result were not captured [not observed].

### F07 — Home open-interest breakdown
1. Page: `/` [observed STATE 001] → control: `Open interest and liquidity breakdown` → result: no visible breakdown data in capture; no chart/table visible [observed STATE 007].
2. The market-detail version of this control later reveals breakdown data [observed STATE 044, 061], but the home-feed result is not captured.

### F08 — Home search
1. Page: `/` [observed STATE 001] → control: search input `Search by market, outcome or collection`; enter `e` → result: URL becomes `/?marketName=e`; header shows `Connect` instead of address/balance; feed remains unchanged and unfiltered in captured text [observed STATE 008].
2. No visible search-result count, empty-result state, or filtered feed is captured [not observed].

---

## 2. Leaderboard flows

### F09 — Leaderboard load
1. Page: `/leaderboard` [observed STATE 009] → no control → result: `Profit & Loss Leaderboard`, beta notice, wallet header, table sorted by `Profit/Loss, high to low` [observed STATE 009].
2. Observed columns: `#`, `Account`, `Score`, `Profit/Loss`, `Volume`, `ROI`, `Traded Markets` [observed STATE 009].
3. Observed controls: `1D`, `1W`, `1M`, `ALL`, `Filters`, `Your Rank`, `Search`, `Prev`, `Next` [observed STATE 009].
4. Footer observed: `Page 1 of 166`, `Updated 10/18/2026, 8:39:31 PM` [observed STATE 009, 017].

### F10 — Leaderboard `1D`
1. Page: leaderboard [observed STATE 009] → control: `1D` → result: `Updating…`; table still displays same rows/page count/timestamp as the `ALL` capture [observed STATE 014].
2. No distinct 1D dataset or final loaded state was captured [not observed].

### F11 — Leaderboard `1W`
1. Page: leaderboard [observed STATE 009] → control: `1W` → result: different table loads; `Page 1 of 91`; updated `10/18/2026, 8:51:04 PM`; header shows `Connect`; `Your Rank` absent [observed STATE 015].
2. Reason for disconnected header after `1W` is not explained [uncertain].

### F12 — Leaderboard `1M`
1. Page: leaderboard [observed STATE 009] → control: `1M` → result: `Updating…`; table still matches `ALL` rows/page count/timestamp; header shows `Connect`; `Your Rank` absent [observed STATE 016].
2. No distinct 1M dataset or final loaded state was captured [not observed].

### F13 — Leaderboard `ALL`
1. Page: leaderboard [observed STATE 009] → control: `ALL` → result: returns to ALL-time table; connected wallet/balance; `Your Rank` present; `Page 1 of 166`; updated `10/18/2026, 8:39:31 PM` [observed STATE 017].

### F14 — Leaderboard Filters
1. Page: leaderboard [observed STATE 009] → control: `Filters` → result: filter panel expands with `App` options `All`, `Foresight`, `Opportunity Markets`, `Deepfunding`; `Chain` options `All`, `Ethereum`, `OP Mainnet`, `Gnosis`, `Base` [observed STATE 018].
2. No apply/reset/filtered-table result was captured [not observed].
3. Note: `Futarchy` appears in the global App menu [observed STATE 011] but is omitted from this App filter list [observed STATE 018].

### F15 — Leaderboard `Your Rank`
1. Page: leaderboard [observed STATE 009] → control: `Your Rank` → result: progress text `Finding your rank…`; table remains visible [observed STATE 019].
2. Final rank/IUD/empty/error result was not captured [not observed].

### F16 — Leaderboard sort: `Score`
1. Page: leaderboard [observed STATE 020] → control: `Score` column → result: sort-status text says `Sorted by Score, high to low`, but rows remain P/L-descending and Score values are not ordered; e.g. `87.5` appears at rank 4 after `78.6` at rank 1 [observed STATE 021].
2. Intended sort behavior cannot be determined from this captured contradiction [uncertain].

### F17 — Leaderboard sort: `Profit/Loss`
1. Page: leaderboard [observed STATE 020] → control: `Profit/Loss` column → result: sort-status text says `Sorted by Profit/Loss, low to high`, but rows remain high-to-low [observed STATE 022].
2. Intended sort direction cannot be determined [uncertain].

### F18 — Leaderboard sort: `Volume`
1. Page: leaderboard [observed STATE 020] → control: `Volume` column → result: sort-status says high-to-low, but rows remain identical to P/L order [observed STATE 023].
2. Intended sort result not captured [uncertain].

### F19 — Leaderboard sort: `ROI`
1. Page: leaderboard [observed STATE 020] → control: `ROI` column → result: sort-status says high-to-low, but rows remain identical to P/L order [observed STATE 024].
2. Intended sort result not captured [uncertain].

### F20 — Leaderboard pagination `Next`
1. Page: leaderboard [observed STATE 020] → control: `Next` → result: pagination changes to `Page 2 of 166` but displayed rows/ranks 1–25 are identical to page 1 [observed STATE 025].
2. `Prev` behavior, later pages, end-of-list, and empty-page behavior were not captured [not observed].

### F21 — Leaderboard search
1. Page: leaderboard [observed STATE 020] → control: `Search`; type `e` → result: no visible query value and no visible table change [observed STATE 026].
2. No search-result, empty-result, or error state captured [not observed].

---

## 3. Create Market and Collections flows

### F22 — Create Market type selection
1. Page: `/create-market` [observed STATE 027] → result: `Create New Market` type-selection start [observed STATE 027].
2. Observed controls: `Categorical`, `Scalar`, `Multi Categorical`, `Multi Scalar`, `Next` [observed STATE 027].
3. Selecting a type or clicking `Next` was not captured; no form fields or submission result [not observed].

### F23 — Collections page: sign-in gate and empty collection
1. Page: `/collections/default` [observed STATE 032] → result: collection name `Default`; sign-in gate `Sign in to view and manage your market collections`; empty message `No markets in this collection.` [observed STATE 032].
2. Overlays: Policies [observed STATE 033], App [observed STATE 034], wallet [observed STATE 035], theme [observed STATE 036] leave page content unchanged.
3. Sign-in success, collection management, add-market, or populated-collection result was not captured [not observed].

---

## 4. Market-detail and trading-page flows

### F24 — Israeli Knesset categorical market load
1. Page: market detail for “Which party or joint electoral list will win the most seats in Israeli Knesset election in 2026?” [observed STATE 037] → result: status `Reports open`; type `Categorical`; `Liquidity: 27.74k`; `Volume: 5.10k`; `P&L: 0.00`; badge `Verified`; link `Answer on Reality.eth!` [observed STATE 037].
2. Outcome rows: `#1 Yashar 60.8%`, `#2 Likud 38.1%`, `#3 Others 0.9%`, `#4 Together Alliance 0.5%`, `#5 Invalid` with `9.00 SER-INVALID` and `0%` [observed STATE 037].
3. Trade panel zero state: `You pay sDAI` / `0 sDAI`; `Max`; `You will get Yashar`; `Avg price 0 sDAI`; `Potential return 0.00 sDAI (0.00%)`; `Max slippage 1%`; `Enter an amount`; `Amount`; `Balance: 0 sDAI`; collateral choices `sDAI`/`xDAI`; action `Mint` [observed STATE 037].
4. Comments gate: `Connect your wallet to share your take`; `Connect to comment`; empty `No takes yet. Share the first one.` [observed STATE 037].
5. Tabs/controls observed: `Comments`, `Related Conditional Markets`, `Top Holders`, `Activity`; period buttons `1D`/`1W`/`1M`/`All`/`Custom`; per-outcome `Add Liquidity`, `View pool details`, `New conditional market`; trade actions `Mint`, `Merge`, `Redeem` [observed STATE 037].
6. No amount entry, Mint/Merge/Redeem execution, approval, transaction success, or transaction error was captured [not observed].

### F25 — Market chart hover
1. Page: market detail [observed STATE 037] → control: chart hover → result: tooltip shows `Sep 22, 2026 02:30`; `Yashar: 59.60%`; `Likud: 39.10%`; `Others: 1.00%`; `Together Alliance: 0.50%` [observed STATE 039].
2. Chart title/axis labels are not present in capture; chart visuals/axes not exposed [uncertain].

### F26 — Reality.eth report-answer modal
1. Page: market detail [observed STATE 041 / 037] → control: `Answer on Reality.eth!` → result: `Report Answer` modal opens for unresolved Reality.eth reporting [observed STATE 043].
2. Conditional-market page version: modal copy `This market is not resolved yet. You can provide an answer to the Reality question by depositing a bond of 10 XDAI.`; `Current answer: Not answered yet`; controls `Choose an answer`, `Mark this question invalid`, `Return`, `Answer` [observed STATE 060].
3. Choosing an answer, marking invalid, or clicking `Answer` result was not captured [not observed].

### F27 — Market open-interest / liquidity breakdown
1. Page: market detail [observed STATE 041] → control: `Open interest and liquidity breakdown` → result: reveals open interest, volume/notional, and per-outcome pool balances [observed STATE 044].
2. Conditional-market version: `Open interest: 7.22k LEPEN_NRYES (7.68k $)`; `Volume: 11.75k $ traded, notional 17.31k $`; `Liquidity: No: 7.18k LPY_NR_NO / 0.38 LEPEN_NRYES`; `Yes: 1.49k LPY_NR_YES / 1.21k LEPEN_NRYES` [observed STATE 061].
3. Close/hide behavior and refresh behavior not captured [not observed].

### F28 — Custom chart date range
1. Page: conditional market detail [observed STATE 062] → control: `Custom` → result: date-range picker opens with `Today`, `Last Week`, `Last Month`, `All`, `Previous Month`, `Next Month`, month label `October 2026`, calendar grid `Su Mo Tu We Th Fr Sa`, dates, `Cancel`, `Save` [observed STATE 062].
2. `Cancel`/`Save` result, applied range, or empty-data range was not captured [not observed].

### F29 — Add Liquidity / Farming Rewards modal
1. Page: conditional market detail [observed STATE 063] → control: `Add Liquidity` → result: modal `Add Liquidity` / `Farming Rewards`; copy `Earn farming rewards (SEER) by providing liquidity to existing markets.`; `Available Pools:`; `Rewards ended on: January 4 2026, 22:31`; controls `Add liquidity`, `Learn more about the farming program`, `Return` [observed STATE 063].
2. Clicking `Add liquidity` or `Learn more` result was not captured [not observed].
3. “Rewards ended” is an ended-rewards state, not an ended/resolved market state [observed STATE 063].

### F30 — View pool details
1. Page: conditional market detail [observed STATE 064] → control: `View pool details` → result: button changes to `Hide pool details`; expands `Liquidity Chart`; `Pool Id: 0x2e5b...8626`; `Pool Balances: 0.38 LEPEN_NRYES / 7.18k LPY_NR_NO`; series labeled `SHARES` and `TOTAL`; many numeric rows; `Last: 0.7454`; additional values `0.7453`, `2.73`, `2.73` [observed STATE 064].
2. `Hide pool details` result after expansion was not captured [not observed].
3. Numeric series labeling is hard to interpret; only `SHARES`/`TOTAL` labels and anomalous sequence are captured [uncertain].

### F31 — `Max` control in trade widget
1. Page: conditional market detail [observed STATE 065] → control: `Max` → result: captured text unchanged; no visible result [observed STATE 065].
2. Intended effect cannot be inferred beyond “no visible result captured” [uncertain].

### F32 — `More` control in trade widget
1. Page: conditional market detail [observed STATE 066] → control: `More` → result: captured text unchanged; no visible result [observed STATE 066].
2. Intended effect cannot be inferred [uncertain].

### F33 — Comments tab and wallet/connect change
1. Page: conditional market detail [observed STATE 067] → control: `Comments` → result: wallet/connect state changes to `Connect`; shows `Switch to Gnosis`; comments remain empty: `No takes yet. Share the first one.` [observed STATE 067].
2. Reason for the change to `Connect` after clicking Comments is not explained [uncertain].

### F34 — Related Conditional Markets tab
1. Page: conditional market detail [observed STATE 068] → control: `Related Conditional Markets` → result: `Related Conditional Markets (2)`; `Search by outcome:`; two cards with same title, both `Reports open` and `Answer on Reality.eth!`; differentiated by conditional text: one conditional on main question being `"Yes"`, the other on `"No"` [observed STATE 068].
2. Card click, search-by-outcome result, or empty-related state not captured [not observed].

### F35 — Top Holders tab
1. Page: conditional market detail [observed STATE 069] → control: `Top Holders` → result: outcome tables for `Yes`, `No`, `Invalid`, each with `Balance` column [observed STATE 069].
2. Observed examples: Yes `total-electronic-snake 5.73k`, `voluminous-worldwide-boar 1.49k`, `slimy-correct-hedgehog 0.14`, `@mr-froggert <0.001`; No `voluminous-worldwide-boar 7.17k`, `ripotche.eth 33.77`, `@mr-froggert 11.67`; Invalid `voluminous-worldwide-boar 3.70k`, `total-electronic-snake 3.37k`, `stormy-dull-puffin 100.00` [observed STATE 069].
3. Marine Le Pen market Top Holders state also shows Yes/No/Invalid tables with `k`, decimals, and no unit label; examples `fiscal-vague-giraffe 6.58k`, `voluminous-worldwide-boar 15.55k`, `squealing-violent-haddock 210.85` [observed STATE 087].
4. Row click, sort, pagination, or holder-detail result not captured [not observed].

### F36 — Activity tab
1. Page: Marine Le Pen market detail [observed STATE 088] → control: `Activity` → result: `My activity` transaction list [observed STATE 088].
2. Row format observed: username / action / amount / outcome-or-token / timestamp, e.g. `alive-rational-snipe Bought 0.89 Yes Oct 9, 2026 · 04:17`; actions include `Bought`, `Sold`, `Split`; `Split` amount shown with `sDAI` (`0.79 sDAI`); amounts use decimals and `<0.001` [observed STATE 088].
3. Capture truncates mid-row at `<0` after many entries; no pagination/filter/detail result captured [not observed].

### F37 — Connect-to-comment error flow
1. Page: Marine Le Pen market detail [observed STATE 089] → control: `Connect to comment` → result: `Signing in...`; then `User rejected the request.` [observed STATE 089].
2. Comments remain gated: `Connect your wallet to share your take`; button `Connect to comment`; empty `No takes yet. Share the first one.` [observed STATE 089].
3. No successful sign-in, comment composer, comment submission, or retry result captured [not observed].

### F38 — Conditional National Rally market load
1. Page: conditional categorical market “Will the National Rally’s candidate win the next French presidential election?” [observed STATE 056–069] → result: tags `Conditional Market`, `Categorical`, `Verified`, `Reports open`; `Answer on Reality.eth!` [observed STATE 056–069].
2. Fields: `Liquidity: 7.54k` no unit; `Volume: 11.75k` no unit [observed STATE 056–069].
3. Outcomes: `#1 No 74.5%`, `#2 Yes 35.3%`, `#3 Invalid 0%`; each row has `Add Liquidity`, `View pool details`, `New conditional market` [observed STATE 056–069].
4. Chart controls `1D`, `1W`, `1M`, `All`, `Custom`; chart hover tooltip for `May 6, 2026 01:00` shows `No: 84.70%`, `Yes: 14.60%` [observed STATE 057].
5. Trade widget: `No Market`; `You pay` `LEPEN_NRYES`; amount `0 LEPEN_NRYES`; `Max`; `You will get` `No`; `Avg price` `0 LEPEN_NRYES`; `Potential return` `0.00 LEPEN_NRYES (0.00%)`; `Max slippage 1%`; `Enter an amount`; `More`; `Mint`/`Merge`/`Redeem`; `Amount`; `Max`; `Balance: 0 LEPEN_NRYES`; `Mint` [observed STATE 056–069].
6. Major Events: `1 UPCOMING`; `MAY 31, 2027 · 00:00 UTC`; `Reality.eth Resolution`; `Expected resolution date` [observed STATE 056–069].
7. Comments gate/empty state present [observed STATE 056–066, 068–069].
8. Observed oddity: outcome percentages `No 74.5%` and `Yes 35.3%` do not sum to 100, with `Invalid 0%` also shown [observed STATE 056–069]; cannot correct from capture [uncertain].

### F39 — Marine Le Pen market load
1. Page: market “Will Marine Le Pen be the National Rally’s candidate in the next French presidential election?” [observed STATE 072–086] → result: `Reports open`; `Answer on Reality.eth!`; `Categorical`; `Liquidity: 7.16k`; `Volume: 49.69k`; `P&L: 0.00`; `Verified` [observed STATE 072–086].
2. Outcomes: `#1 Yes 84.2%`; `#2 No 14.8%`; `#3 Invalid` with `210.85 SER-INVALID` and `0%` [observed STATE 072–086, 087].
3. Outcome cards each have `Add Liquidity`, `View pool details`, `New conditional market` [observed STATE 087].
4. Trade panel: `You pay sDAI`; amount `0 sDAI`; `Max`; `You will get Yes`; `Avg price 0 sDAI`; `Potential return 0.00 sDAI (0.00%)`; `Max slippage 1%`; `Enter an amount`; `More`; `Mint`/`Merge`/`Redeem`; `Balance: 0 sDAI`; token choices `sDAI`/`xDAI`; `Mint` [observed STATE 087].
5. Event: `1 UPCOMING`; `JAN 1, 2027 · 00:00 UTC`; `Reality.eth Resolution`; `Expected resolution date` [observed STATE 087].
6. Comments gate/empty state present [observed STATE 089]; `Connect to comment` triggers `Signing in...` then `User rejected the request.` [observed STATE 089].

### F40 — Seats / party-bloc Multi Scalar market load
1. Page: “How many seats in France’s National Assembly will [party bloc] win in the next French legislative election?” [observed STATE 090] → result: status `Pending execution`; type `Multi Scalar`; literal placeholder `[party bloc]` remains in title; `Deadline:` shown with no visible value; control `Hide questions` [observed STATE 090].
2. Question rows: Far Right, Right, Centre, Left, Other; each shows `Answer: Answered too soon` and `Reopen question` [observed STATE 090].
3. Metrics: `Liquidity: 6.45k`; `Volume: 1.32k`; `P&L: 0.00`; `Verified` [observed STATE 090].
4. Outcome percentages / approximate seats: Left `31.6%` `~ 182 seats`; Centre `29.1%` `~ 168 seats`; Far Right `24.9%` `~ 144 seats`; Right `7.6%` `~ 44 seats`; Other `6.6%` `~ 38 seats`; Invalid `0%` [observed STATE 090].
5. Trade panel selected outcome `Left (UG, LFI, SOC, COM, VEC, RDG, DVG, EXG, …)`; `You pay sDAI` `0 sDAI`; `You will get` selected Left outcome; `Avg price 0 sDAI`; `Calculate your potential return` instead of numeric potential return; `Max slippage 1%`; `Mint`/`Merge`/`Redeem`; `Balance: 0 sDAI`; token choices `sDAI`/`xDAI` [observed STATE 090].
6. Event: `1 UPCOMING`; `OCT 1, 2029 · 00:00 UTC`; `Reality.eth Resolution`; `Expected resolution date` [observed STATE 090].
7. Comments gate/empty state also present [observed STATE 090].
8. Clicking `Reopen question`, `Hide questions`, or submitting a trade was not captured [not observed].

---

## 5. Wallet-gated states

### F41 — Disconnected header states
1. Home search state: header shows `Connect`; no address or balance shown [observed STATE 008].
2. Leaderboard `1W` state: header shows `Connect`; `Your Rank` absent; leaderboard rows still visible [observed STATE 015].
3. Leaderboard `1M` state: header shows `Connect`; `Your Rank` absent; leaderboard rows still visible [observed STATE 016].
4. Conditional-market `Comments` tab: wallet/connect state changes to `Connect`; `Switch to Gnosis` shown; comments remain empty [observed STATE 067].
5. These disconnected states are observed, but the trigger/cause is not consistently explained; do not infer a reliable wallet-gating rule from them alone [uncertain].

### F42 — Collections sign-in gate
1. Page: `/collections/default` [observed STATE 032] → result: `Sign in to view and manage your market collections`; collection `Default`; empty `No markets in this collection.` [observed STATE 032–036].
2. No sign-in modal, successful sign-in, or collection-management state captured [not observed].

### F43 — Comment gate and failed sign-in
1. Market pages show `Connect your wallet to share your take`, `Connect to comment`, and empty `No takes yet. Share the first one.` [observed STATE 037–040, 056–066, 068–069, 089, 090].
2. Clicking `Connect to comment` on Marine Le Pen market → `Signing in...` → `User rejected the request.` [observed STATE 089].
3. No successful wallet connection, comment composer, comment posting, or retry-after-error state captured [not observed].

### F44 — Trade panel with zero balance / no amount
1. Market pages show trade widgets with `Enter an amount`, zero pay amount, zero average price, zero potential return, and `Balance: 0 sDAI` or `Balance: 0 LEPEN_NRYES` [observed STATE 037, 056–069, 087, 090].
2. This is an observed empty/zero-value trade state, not a documented wallet-gated prompt.
3. No click on `Mint`/`Merge`/`Redeem` with a nonzero amount, approval flow, insufficient-balance error, or success state captured [not observed].

---

## 6. Loading states

### F45 — Leaderboard period loading
1. Click `1D` → `Updating…`; table still shows prior rows/page count/timestamp [observed STATE 014].
2. Click `1M` → `Updating…`; table still shows prior rows/page count/timestamp [observed STATE 016].
3. No spinner/skeleton, timeout, final loaded state, or error state captured [not observed].

### F46 — `Your Rank` loading
1. Click `Your Rank` → `Finding your rank…`; table remains visible [observed STATE 019].
2. Final rank, “not ranked,” empty, or error result not captured [not observed].

### F47 — Comment sign-in loading/error
1. Click `Connect to comment` → `Signing in...` [observed STATE 089].
2. Result: `User rejected the request.` [observed STATE 089].
3. No success state or retry flow captured [not observed].

---

## 7. Empty states

### F48 — Empty collection
1. `/collections/default` → `Default` collection shows `No markets in this collection.` [observed STATE 032–036].
2. Add-market/populated-collection flow not captured [not observed].

### F49 — Empty comments
1. Market pages show `No takes yet. Share the first one.` alongside the wallet/comment gate [observed STATE 037–040, 