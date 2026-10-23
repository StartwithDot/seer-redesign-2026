# explorer: FLOWS DRAFT (DeepSeek)

# FLOWS DRAFT — `explorer` (`app.seer.pm`)

## Evidence / precondition legend

- **[observed STATE n]** — directly present in crawl notes/controls/charts for that state.
- **[inferred]** — transition inferred from an observed href/control and an observed destination state, but the click itself was not recorded.
- **[unobservable: reason]** — no captured resulting state or no readable data in capture.
- **Wallet default:** connected header captured as `0x0000...dEaD` + `24.69 xDAI` for most states. Disconnected `Connect` captured in STATE 008, 015–016, 067, 089.
- **Chain default:** Gnosis is implied by `xDAI` and `gnosisscan.io` links, but explicit chain selection is not captured except `Switch to Gnosis` in STATE 067.
- **Funds default:** no funds needed for read-only browsing/menus. Trade/report/liquidity flows require collateral/bond; captured trade balance is `0 sDAI` / `0 LEPEN_NRYES`, so actual fund sufficiency is unobservable.
- **Role default:** inferred from controls, not from explicit persona data.

---

## F01 — Home load

**Preconditions:** Wallet: either; captured connected `0x0000...dEaD` + `24.69 xDAI`; Chain: Gnosis implied; Funds: none; Role: visitor/analyst.

1. Load `/` — **[observed STATE 001]**.
2. See beta notice “Note that this is a Beta version and can still be unstable” — **[observed STATE 001]**.
3. See nav `Markets`, `Leaderboard`, `Create Market`, `Policies`, `App` — **[observed STATE 001]**.
4. See wallet/balance `24.69 xDAI`, search placeholder `Search by market, outcome or collection`, `Filters`, `Create New Market`, `My collections`, market-card feed — **[observed STATE 001]**.

**Result:** Markets home feed is visible. **No chart/table rendered** (`charts=0 tables=0`) — **[observed STATE 001–008]**.

---

## F02 — Home to Leaderboard

**Preconditions:** Default read-only shell; Role: analyst.

1. Load `/` — **[observed STATE 001]**.
2. Click `Leaderboard` — **[inferred]** from observed href `/leaderboard` in controls.
3. Land on `/leaderboard` with `Profit & Loss Leaderboard` — **[observed STATE 009]**.

**Result:** Leaderboard table page appears. **[observed STATE 009]**

---

## F03 — Home to Create Market

**Preconditions:** Wallet: not captured as gated; Role: creator; Funds: unknown.

1. Load `/` — **[observed STATE 001]**.
2. Click `Create Market` nav link or `Create New Market` — **[inferred]** from observed href `/create-market`.
3. Land on `/create-market` type-selection start with `Categorical`, `Scalar`, `Multi Categorical`, `Multi Scalar`, `Next` — **[observed STATE 027]**.

**Result:** Create-market type selection is visible. Form beyond type selection is **[unobservable: no captured state after selecting type/Next]**.

---

## F04 — Home to My collections

**Preconditions:** Wallet/sign-in required to manage collections per copy; Role: collection user.

1. Load `/` — **[observed STATE 001]**.
2. Click `My collections` — **[inferred]** from observed href `/collections/default`.
3. Land on `/collections/default` — **[observed STATE 032]**.
4. See `Default`, `Sign in to view and manage your market collections`, `No markets in this collection.` — **[observed STATE 032–036]**.

**Result:** Collections page is sign-in-gated/empty. Post-sign-in collection management is **[unobservable: no captured result]**.

---

## F05 — Home to market detail

**Preconditions:** Default read-only shell; Role: visitor/analyst/trader.

1. Load `/` — **[observed STATE 001]**.
2. Click a market title such as `Will Marine Le Pen be the National Rally’s candidate in the next French presidential election?` — **[inferred]** from observed market hrefs.
3. Land on market-detail page with status, outcomes, trade panel, tabs — **[observed STATE 037–044, 056–069, 087–090]**.

**Result:** Market detail page is visible. Exact click transition from home was not individually recorded for each market; destination states are observed.

---

## F06 — Global `Policies` menu

**Preconditions:** Default read-only shell; Role: any visitor.

1. From shell, click `Policies` — **[observed STATE 002, 010, 028, 033, 038, 056]**.
2. Menu shows `Verified Market Policy` and `Market Rules Policy` — **[observed STATE 002, 010, 028, 033, 038, 056]**.
3. Page content remains visible/unchanged behind menu — **[observed STATE 002, 010, 028, 033, 038, 056]**.
4. Select `Verified Market Policy` or `Market Rules Policy` — **[unobservable: no policy body page/content captured]**.

**Result:** Policy menu opens; policy body text is not captured.

---

## F07 — Global `App` menu

**Preconditions:** Default read-only shell; Role: app-ecosystem user.

1. Click `App` — **[observed STATE 003, 011, 029, 034, 040, 058]**.
2. Menu shows `Futarchy`, `Deepfunding`, `Foresight`, `Opportunity Markets` — **[observed STATE 003, 011, 029, 034, 040, 058]**.
3. Page remains visible/unchanged behind menu — **[observed STATE 003, 011, 029, 034, 040, 058]**.
4. Select any app item — **[unobservable: no app-selection result captured]**.

**Result:** App menu opens; destination is not captured.

---

## F08 — Global wallet menu from `24.69 xDAI`

**Preconditions:** Wallet connected; captured address `0x0000...dEaD`; balance `24.69 xDAI`; Chain: Gnosis implied; Funds: none for menu access; Role: wallet holder.

1. Click `24.69 xDAI` — **[observed STATE 004, 012, 030, 035, 041]**.
2. Menu shows `Account`, `Deposit`, `Portfolio`, `Market Collections`, `Trade Collateral`, `Use smart account` — **[observed STATE 004, 012, 030, 035, 041]**.
3. Page remains unchanged behind menu — **[observed STATE 004, 012, 030, 035, 041]**.
4. Select any menu item — **[unobservable: no destination/result captured]**.

**Result:** Wallet/account menu opens; item destinations are unobservable.

---

## F09 — Global theme toggle

**Preconditions:** Default read-only shell; Role: any visitor.

1. Click `Switch to dark mode` — **[observed STATE 005, 031, 059]**.
2. Captured text content unchanged — **[observed STATE 005, 031, 059]**.
3. Click `Switch to light mode` — **[observed STATE 013, 036]**.
4. Captured table/content unchanged in text capture — **[observed STATE 013, 036]**.

**Result:** Theme toggle is clickable. Visual styling/persistence is **[unobservable: text capture does not expose styling]**.

---

## F10 — Home search

**Preconditions:** Default read-only shell; Role: visitor/analyst.

1. Load `/` — **[observed STATE 001]**.
2. Use search input `Search by market, outcome or collection`; type `e` — **[observed STATE 008]**.
3. URL becomes `/?marketName=e` — **[observed STATE 008]**.
4. Header shows `Connect` instead of address/balance — **[observed STATE 008]**.
5. Captured feed remains unchanged/unfiltered — **[observed STATE 008]**.

**Result:** Query is reflected in URL; visible filtered results are not captured. Search result count/empty state is **[unobservable: no captured filtered feed]**.

---

## F11 — Home `Filters`

**Preconditions:** Default read-only shell; Role: visitor/analyst.

1. Load `/` — **[observed STATE 001]**.
2. Click `Filters` — **[observed STATE 006]**.
3. Filter panel opens over/with market feed — **[observed STATE 006]**.
4. Observed fields: `Market States`, `Verification Status`, `Chain`, `Sort By`, `Conditional Market`, `Rewards`, `Minimum Liquidity`, `Futarchy` — **[observed STATE 006]**.
5. Apply/reset/close filters — **[unobservable: no applied-filtered feed result captured]**.

**Result:** Filter panel opens; applied result is not captured.

---

## F12 — Home `Open interest and liquidity breakdown`

**Preconditions:** Default read-only shell; Role: analyst.

1. Load `/` — **[observed STATE 001]**.
2. Click `Open interest and liquidity breakdown` — **[observed STATE 007]**.
3. No visible breakdown data/chart/table appears in capture — **[observed STATE 007]**.

**Result:** No home-feed breakdown is captured. Market-detail version does reveal data in STATE 044/061.

---

## F13 — Leaderboard load

**Preconditions:** Wallet: either; captured connected in STATE 009; Chain: options include All/Ethereum/OP Mainnet/Gnosis/Base but selected chain not captured; Funds: none; Role: performance analyst/trader.

1. Load `/leaderboard` — **[observed STATE 009]**.
2. See `Profit & Loss Leaderboard`, beta notice, wallet header `0x0000...dEaD` / `24.69 xDAI` — **[observed STATE 009]**.
3. See columns `#`, `Account`, `Score`, `Profit/Loss`, `Volume`, `ROI`, `Traded Markets` — **[observed STATE 009]**.
4. See controls `1D`, `1W`, `1M`, `ALL`, `Filters`, `Your Rank`, `Search`, `Prev`, `Next` — **[observed STATE 009]**.
5. See `Page 1 of 166`, `Updated 10/18/2026, 8:39:31 PM`, `Sorted by Profit/Loss, high to low` — **[observed STATE 009, 017]**.

**Result:** Leaderboard table is visible. No charts (`charts=0`), `tables=1` — **[observed STATE 009]**.

---

## F14 — Leaderboard time periods `1D` / `1W` / `1M` / `ALL`

**Preconditions:** Wallet: connected for `ALL`; `1W`/`1M` captured with `Connect`; `Your Rank` absent when disconnected; Role: analyst.

1. Click `1D` — **[observed STATE 014]**.
2. Shows `Updating…`; table still shows same rows/page count/timestamp as `ALL` — **[observed STATE 014]**.
3. Final 1D dataset — **[unobservable: no distinct loaded 1D table captured]**.
4. Click `1W` — **[observed STATE 015]**.
5. Loads different table: `Page 1 of 91`, updated `10/18/2026, 8:51:04 PM`; header `Connect`; `Your Rank` absent — **[observed STATE 015]**.
6. Click `1M` — **[observed STATE 016]**.
7. Shows `Updating…`; table still matches `ALL` rows/page count/timestamp; header `Connect`; `Your Rank` absent — **[observed STATE 016]**.
8. Final 1M dataset — **[unobservable: no distinct loaded 1M table captured]**.
9. Click `ALL` — **[observed STATE 017]**.
10. Returns to ALL-time table; connected wallet/balance; `Your Rank` present; `Page 1 of 166`; updated `10/18/2026, 8:39:31 PM` — **[observed STATE 017]**.

**Result:** Time filters behave inconsistently in captures; only `1W` and `ALL` produce distinct captured tables.

---

## F15 — Leaderboard `Filters`

**Preconditions:** Wallet: either; Role: analyst; Chain options observed.

1. On `/leaderboard`, click `Filters` — **[observed STATE 018]**.
2. Filter panel expands with `App` options `All`, `Foresight`, `Opportunity Markets`, `Deepfunding` — **[observed STATE 018]**.
3. `Chain` options: `All`, `Ethereum`, `OP Mainnet`, `Gnosis`, `Base` — **[observed STATE 018]**.
4. Apply/reset filters — **[unobservable: no filtered table result captured]**.
5. Note: `Futarchy` appears in global `App` menu but not in this `Filters` App list — **[observed STATE 011 vs STATE 018]**.

**Result:** Filter panel opens; applied result is not captured.

---

## F16 — Leaderboard `Your Rank`

**Preconditions:** Wallet connected; `Your Rank` present only in connected captures; Role: trader/analyst.

1. On `/leaderboard` connected, click `Your Rank` — **[observed STATE 019]**.
2. Shows `Finding your rank…`; table remains visible — **[observed STATE 019]**.
3. Final rank/empty/error — **[unobservable: no final result captured]**.

**Result:** Progress text appears; final rank is not captured.

---

## F17 — Leaderboard column sorting

**Preconditions:** Wallet: either; Role: analyst.

1. Click `Score` — **[observed STATE 021]**.
2. Status says `Sorted by Score, high to low`, but rows remain P/L-descending and Score values are not ordered — **[observed STATE 021]**.
3. Click `Profit/Loss` — **[observed STATE 022]**.
4. Status says `Sorted by Profit/Loss, low to high`, but rows remain high-to-low — **[observed STATE 022]**.
5. Click `Volume` — **[observed STATE 023]**.
6. Status says high-to-low, but rows remain identical to P/L order — **[observed STATE 023]**.
7. Click `ROI` — **[observed STATE 024]**.
8. Status says high-to-low, but rows remain identical to P/L order — **[observed STATE 024]**.
9. Sort `#`, `Account`, `Traded Markets` — **[unobservable: not captured]**.

**Result:** Sort status text changes but captured row order contradicts it. Actual sort behavior is uncertain.

---

## F18 — Leaderboard pagination

**Preconditions:** Wallet: either; Role: analyst.

1. On `/leaderboard`, click `Next` — **[observed STATE 025]**.
2. Pagination changes to `Page 2 of 166` — **[observed STATE 025]**.
3. Displayed rows/ranks 1–25 remain identical to page 1 — **[observed STATE 025]**.
4. Click `Prev` — **[unobservable: not captured]**.

**Result:** Page number changes; row content did not visibly change in capture.

---

## F19 — Leaderboard search

**Preconditions:** Wallet: either; Role: analyst.

1. On `/leaderboard`, use `Search`; type `e` — **[observed STATE 026]**.
2. No visible query value and no visible table change — **[observed STATE 026]**.

**Result:** Search behavior is not captured beyond no visible change.

---

## F20 — Leaderboard `How it works` / docs

**Preconditions:** Wallet: either; Role: analyst.

1. Click `How it works` — **[observed edge]** to `https://docs.seer.pm/app/leaderboard`.
2. External docs content — **[unobservable: outside captured app states]**.

**Result:** External docs link exists; content not captured.

---

## F21 — Create Market type selection

**Preconditions:** Wallet: not captured as gated; Role: creator; Funds: unknown.

1. Load `/create-market` — **[observed STATE 027]**.
2. See type choices `Categorical`, `Scalar`, `Multi Categorical`, `Multi Scalar` — **[observed STATE 027–031]**.
3. See `Next` — **[observed STATE 027–031]**.
4. Select a type — **[unobservable: no selected-type state captured]**.
5. Click `Next` — **[unobservable: no form after Next captured]**.

**Result:** Type-selection start is visible; creation form beyond it is not captured.

---

## F22 — Collections page

**Preconditions:** Sign-in required per copy; Role: collection user; Funds: none for viewing gate.

1. Load `/collections/default` — **[observed STATE 032]**.
2. See collection name `Default` — **[observed STATE 032–036]**.
3. See `Sign in to view and manage your market collections` — **[observed STATE 032–036]**.
4. See `No markets in this collection.` — **[observed STATE 032–036]**.
5. Sign in / manage collection — **[unobservable: no post-sign-in result captured]**.

**Result:** Empty/sign-in-gated collection page is visible.

---

## F23 — Market detail load

**Preconditions:** Wallet: either; captured connected in most market states; Chain: Gnosis implied; Funds: none for viewing; Role: visitor/trader.

1. Open a market detail page, e.g. `Will Marine Le Pen be the National Rally’s candidate in the next French presidential election?` — **[inferred click; observed STATE 037–044, 056–069, 087–090]**.
2. See status `Reports open` or `Pending execution` — **[observed STATE 037–040, 056–069, 087–090]**.
3. See type labels `Categorical`, `Multi Scalar`, badge `Verified` — **[observed STATE 037–040, 056–069, 087–090]**.
4. See metrics `Liquidity`, `Volume`, `P&L` — **[observed STATE 037–040, 056–069, 087–090]**.
5. See outcome rows with percentages, e.g. `#1 Yashar 60.8%`, `#2 Likud 38.1%`, `#3 Others 0.9%` — **[observed STATE 037–040]**.
6. See trade panel, time controls `1D`, `1W`, `1M`, `All`, `Custom`, and tabs `Comments`, `Related Conditional Markets`, `Top Holders`, `Activity` — **[observed STATE 037–040, 056–069, 087–090]**.

**Result:** Market detail page is visible. Chart axes/series mostly **[unobservable: only chart counts and one hover tooltip captured]**.

---

## F24 — Market time range and `Custom` date picker

**Preconditions:** Wallet: either; Role: analyst/trader.

1. Click `Custom` on market chart controls — **[observed STATE 062]**.
2. Date-range picker opens with `Today`, `Last Week`, `Last Month`, `All`, `Previous Month`, `Next Month`, month label `October 2026`, calendar grid `Su Mo Tu We Th Fr Sa`, `Cancel`, `Save` — **[observed STATE 062]**.
3. Choose dates and click `Save` — **[unobservable: no resulting chart range captured]**.
4. Click `1D` / `1W` / `1M` / `All` — **[unobservable: controls observed, individual results not captured]**.

**Result:** `Custom` picker opens; applied range result is not captured.

---

## F25 — Market chart hover

**Preconditions:** Wallet: either; Role: analyst.

1. Hover over market chart — **[inferred action]**.
2. Tooltip shows timestamp + outcome percentages, e.g. `Sep 22, 2026 02:30`, `Yashar: 59.60%`, `Likud: 39.10%`, `Others: 1.00%`, `Together Alliance: 0.50%` — **[observed STATE 039]**.
3. Another tooltip: `May 6, 2026 01:00`, `No: 84.70%`, `Yes: 14.60%` — **[observed STATE 057]**.

**Result:** Hover tooltip data is captured. Chart title/axes are **[unobservable: not in text capture]**.

---

## F26 — Market `Open interest and liquidity breakdown`

**Preconditions:** Wallet: either; Role: analyst.

1. Click `Open interest and liquidity breakdown` — **[observed STATE 044, 061]**.
2. See `Open interest: 7.22k LEPEN_NRYES (7.68k $)` — **[observed STATE 061]**.
3. See `Volume: 11.75k $ traded, notional 17.31k $` — **[observed STATE 061]**.
4. See `Liquidity: No: 7.18k LPY_NR_NO / 0.38 LEPEN_NRYES`; `Yes: 1.49k LPY_NR_YES / 1.21k LEPEN_NRYES` — **[observed STATE 061]**.

**Result:** Breakdown data is visible on market detail.

---

## F27 — Outcome `Add Liquidity` / `Farming Rewards`

**Preconditions:** Wallet connected; Chain: Gnosis implied; Funds: LP/collateral required; Role: liquidity provider/farmer.

1. Click `Add Liquidity` on an outcome row — **[observed STATE 063]**.
2. Modal shows `Add Liquidity` / `Farming Rewards` — **[observed STATE 063]**.
3. See copy “Earn farming rewards (SEER) by providing liquidity to existing markets.” — **[observed STATE 063]**.
4. See `Available Pools:`, `Rewards ended on: January 4 2026, 22:31`, `Add liquidity`, `Learn more about the farming program`, `Return` — **[observed STATE 063]**.
5. Click `Add liquidity` / complete LP transaction — **[unobservable: no submitted LP result captured]**.

**Result:** Liquidity/farming modal opens; actual add-liquidity result is not captured.

---

## F28 — Outcome `View pool details`

**Preconditions:** Wallet: either; Role: analyst/LP.

1. Click `View pool details` — **[observed STATE 064]**.
2. Button changes to `Hide pool details` — **[observed STATE 064]**.
3. Expands `Liquidity Chart`, `Pool Id: 0x2e5b...8626`, `Pool Balances: 0.38 LEPEN_NRYES / 7.18k LPY_NR_NO`, series labeled `SHARES` and `TOTAL`, `Last: 0.7454` — **[observed STATE 064]**.
4. Click `Hide pool details` — **[unobservable: collapse result not captured]**.

**Result:** Pool details expand; collapse is not captured.

---

## F29 — Outcome `New conditional market`

**Preconditions:** Wallet: unknown; Role: market creator; Funds: unknown.

1. Click `New conditional market` on an outcome row — **[observed control STATE 056–069, 087–090]**.
2. Resulting creation flow — **[unobservable: no resulting state captured]**.

**Result:** Control exists; result is not captured.

---

## F30 — Trade panel amount / `Max` / `More` / `Mint` / `Merge` / `Redeem`

**Preconditions:** Wallet connected; Chain: Gnosis implied; Funds: collateral such as `sDAI`/`xDAI`; captured balance `0 sDAI` / `0 LEPEN_NRYES`; Role: trader.

1. Select an outcome row, e.g. `Yashar`, `Yes`, `No`, `Left (...)` — **[inferred click; selected outcome visible in STATE 090]**.
2. See `You pay` collateral choices `sDAI` / `xDAI` or token-denominated label such as `LEPEN_NRYES` — **[observed STATE 037–040, 056–069, 087–090]**.
3. Enter amount in `Enter an amount` or `Amount` — **[observed controls; actual entry unobservable]**.
4. Click `Max` — **[observed STATE 065; no visible result captured]**.
5. Review `You will get`, `Avg price`, `Potential return`, `Max slippage 1%`, `Balance: 0 sDAI` — **[observed STATE 037–040, 056–069, 087–090]**.
6. In seats/party bloc market, see `Calculate your potential return` instead of numeric return — **[observed STATE 090]**.
7. Click `More` — **[observed STATE 066; no visible result captured]**.
8. Choose `Mint` / `Merge` / `Redeem` — **[observed controls; action result unobservable]**.
9. Confirm/sign transaction — **[unobservable: no completed trade/success/error state captured]**.

**Result:** Trade panel is visible; no executed trade or confirmation is captured.

---

## F31 — `Answer on Reality.eth!` → `Report Answer`

**Preconditions:** Wallet connected; Chain: Gnosis/XDAI context; Funds: `10 XDAI` bond stated; Role: reporter/resolver.

1. Click `Answer on Reality.eth!` — **[observed STATE 043, 060]**.
2. Modal `Report Answer` opens — **[observed STATE 060]**.
3. See “This market is not resolved yet. You can provide an answer to the Reality question by depositing a bond of 10 XDAI.” — **[observed STATE 060]**.
4. See `Current answer: Not answered yet` — **[observed STATE 060]**.
5. See controls `Choose an answer`, `Mark this question invalid`, `Return`, `Answer` — **[observed STATE 060]**.
6. Choose answer / mark invalid / click `Answer` — **[unobservable: no submitted report result captured]**.

**Result:** Report modal opens; submission is not captured.

---

## F32 — Comments / `Connect to comment`

**Preconditions:** Wallet connected or disconnected; to post, wallet/sign-in required; Role: commenter.

1. Open `Comments` tab — **[observed STATE 067, 089]**.
2. See `Connect your wallet to share your take` — **[observed STATE 067, 089]**.
3. See `Connect to comment` — **[observed STATE 067, 089]**.
4. See empty state `No takes yet. Share the first one.` — **[observed STATE 067, 089]**.
5. In STATE 067, header shows `Connect` and `Switch to Gnosis` — **[observed STATE 067]**.
6. Click `Connect to comment` — **[observed STATE 089]**.
7. See `Signing in...` — **[observed STATE 089]**.
8. See `User rejected the request.` — **[observed STATE 089]**.
9. Submit a comment after successful sign-in — **[unobservable: only rejection captured]**.

**Result:** Comment gate and rejected-sign-in error are captured; successful comment posting is not.

---

## F33 — `Related Conditional Markets`

**Preconditions:** Wallet: either; Role: analyst/trader.

1. Click `Related Conditional Markets` — **[observed STATE 068]**.
2. See `Related Conditional Markets (2)` — **[observed STATE 068]**.
3. See `Search by outcome:` — **[observed STATE 068]**.
4. See two cards with same title, both `Reports open` and `Answer on Reality.eth!` — **[observed STATE 068]**.
5. Cards are distinguished by conditional text: one on main question `"Yes"`, one on `"No"` — **[observed STATE 068]**.
6. Use `Search by outcome:` — **[unobservable: no search result captured]**.
7. Click card or `Answer on Reality.eth!` from card — **[unobservable: no resulting state captured from this tab]**.

**Result:** Related conditional market cards are visible; search and card actions are not captured.

---

## F34 — `Top Holders`

**Preconditions:** Wallet: either; Role: analyst/trader.

1. Click `Top Holders` — **[observed STATE 069, 087]**.
2. See outcome tables for `Yes`, `No`, `Invalid`, each with `Balance` column — **[observed STATE 069]**.
3. Example Yes rows: `total-electronic-snake 5.73k`, `voluminous-worldwide-boar 1.49k`, `slimy-correct-hedgehog 0.14`, `@mr-froggert <0.001` — **[observed STATE 069]**.
4. Example No rows: `voluminous-worldwide-boar 7.17k`, `ripotche.eth 33.77`, `@mr-froggert 11.67` — **[observed STATE 069]**.
5. Example Invalid rows: `voluminous-worldwide-boar 3.70k`, `total-electronic-snake 3.37k`, `stormy-dull-puffin 100.00` — **[observed STATE 069]**.

**Result:** Holder tables are visible. Balance units are not shown — **[observed STATE 069]**.

---

## F35 — `Activity`

**Preconditions:** Wallet: either; Role: analyst/trader.

1. Click `Activity` — **[observed STATE 088]**.
2. See `My activity` transaction list — **[observed STATE 