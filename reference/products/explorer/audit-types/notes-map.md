## NOTES CHUNK 1
**Screens / purposes**
- STATE 001: Ethereum BASEFEE scalar market detail; status “Trading Open.”
- STATE 002: “Policies” overlay over same market; headings “Verified Market Policy,” “Market Rules Policy.”
- STATE 003: same market with chart hover tooltip.
- STATE 004: “App” menu expanded: Futarchy, Deepfunding, Foresight, Opportunity Markets.
- STATE 005: wallet/account menu expanded: Account, Deposit, Portfolio, Market Collections, Trade Collateral, Use smart account.
- STATE 006: dark-mode toggle clicked; visible content unchanged.
- STATE 007: “Open interest and liquidity breakdown” expanded.
- STATE 008: “Custom” chart-date picker opened.
- STATE 009: “Add Liquidity” / “Farming Rewards” panel opened.
- STATE 010: “View pool details” expanded for DOWN outcome.
- STATE 011: France National Assembly seats multi-scalar market detail; status “Pending execution.”
- STATE 012: Policies overlay over France market.
- STATE 013: France market chart hover tooltip.
- STATE 014: App menu expanded over France market.
- STATE 015: wallet/account menu expanded over France market.

**Repeated shell**
- Beta warning on all states: “Note that this is a Beta version and can still be unstable” (001–015).
- Top nav: Markets, Leaderboard, Create Market, Policies, App (001–015).
- Wallet shown as `0x0000...dEaD` with `24.69 xDAI` (001–015).
- Comments area is wallet-gated: “Connect your wallet to share your take” / “Connect to comment”; empty state: “No takes yet. Share the first one.” (001–015).
- Capture metadata reports `charts=3`, `

## NOTES CHUNK 2
### Shared shell / global state
- Beta banner on every state: “Note that this is a Beta version and can still be unstable” (STATE 016–029).
- Top nav: Markets, Leaderboard, Create Market, Policies, App (STATE 016, 022). Policies opens submenu “Verified Market Policy / Market Rules Policy” (STATE 023). App opens submenu “Futarchy / Deepfunding / Foresight / Opportunity Markets” (STATE 025).
- Wallet chip: short address `0x0000...dEaD`, balance `24.69 xDAI` (STATE 016, 022, 026). Clicking balance opens account menu: Account, Deposit, Portfolio, Market Collections, Trade Collateral, Use smart account (STATE 026).
- Theme controls: “Switch to light mode” and “Switch to dark mode” buttons exist; no visual theme details captured (STATE 016, 027).
- Crawl metadata reports 3 charts and 1 table on every state; visible chart/graphic evidence is described below. Control counts vary from 58–120 across states (STATE 016–029).

### France National Assembly market — STATE 016–021
- Purpose: market detail/trading page for “How many seats in France’s National Assembly will [party bloc] win in the next French legislative election?” (STATE 016–021).
- Status: “Pending execution” (STATE 016–021).
- Market type label: “Multi Scalar” (STATE 016–021).
- Header metrics: Liquidity `6.45k`; Volume `1.32k`; P&L `0.00`; badge “Verified” (STATE 016–021). Units/currency are not shown on these three metrics.
- “Deadline:” label is present with no value visible (STATE 016–021).
- Questions list, each with “Answer: Answered too soon” and a “Reopen question” button:
  - Far Right (RN, UXD, REC, DSV, EXD, ...) (STATE 016–021)
  - Right (LR, DVD, …) (STATE 016–021)
  - Centre (ENS, REN, MDM, HOR, UDI, DVC, …) (STATE 016–021)
  - Left (UG, LFI, SOC, COM, VEC, RDG, DVG, EXG, …) (STATE 016–021)
  - Other (REG, ECO, DIV, …) (STATE 016–021)
- Control “Hide questions” present; behavior not observed (STATE 016–021).
- Chart/graphic: outcome estimate area with time-range controls `1D`, `1W`, `1M`, `All`, `Custom`; legend values: Left `31.6%`, Centre `29.1%`, Far Right `24.9%`, Right `7.6%`, Other `6.6%` (STATE 016–021).
- Outcomes list:
  - #1 Left: `31.6%`, `~ 182 seats` (STATE 016–021)
  - #2 Centre: `29.1%`, `~ 168 seats` (STATE 016–021)
  - #3 Far Right: `24.9%`, `~ 144 seats` (STATE 016–021)
  - #4 Right: `7.6%`, `~ 44 seats` (STATE 016–021)
  - #5 Other: `6.6%`, `~ 38 seats` (STATE 016–021)
  - #6 Invalid: `0%` (STATE 016–021)
- Each outcome has actions: “Add Liquidity”, “View pool details”, “New conditional market” (STATE 016–021).
- Trade panel for selected outcome (#1 Left):
  - “You pay” `sDAI`, input value `0 sDAI`, “Max” (STATE 016–021)
  - “You will get” `Left (...)`; “Avg price” `0 sDAI` (STATE 016–021)
  - “Calculate your potential return”; “Parameters: Max slippage 1%”; “Enter an amount” (STATE 016–021)
  - Tabs/labels: `Mint`, `More`, `Merge`, `Redeem`; amount input `Max`; “Balance: 0 sDAI” (STATE 016–021)
  - Asset buttons: `sDAI`, `xDAI`; `Mint` button appears twice (STATE 016–021)
- Major Events: “1 UPCOMING”; `OCT 1, 2029 · 00:00 UTC`; “Reality.eth Resolution”; “Expected resolution date” (STATE 016–021).
- Tabs: Comments, Related Conditional Markets, Top Holders, Activity (STATE 016–021).
- Comments empty/wallet-gated: “Connect your wallet to share your take”; “Connect to comment”; “No takes yet. Share the first one.” (STATE 016–021).

### France — interaction states
- STATE 017: Clicking “Reopen question” returned error copy “User rejected the request.” Page otherwise unchanged.
- STATE 019: Clicking `Custom` opens date-range modal:
  - Presets: Today, Last Week, Last Month, All; Previous Month / Next Month; calendar header `October 2026`; weekday header `SuMoTuWeThFrSa`; date grid; Cancel / Save (STATE 019).
- STATE 020: Clicking “Add Liquidity” opens drawer:
  - Title “Add Liquidity”; section “Farming Rewards”; copy: “Earn farming rewards (SEER) by providing liquidity to existing markets.” (STATE 020)
  - “Available Pools:”; “Rewards ended on: January 5 2026, 13:21”; “Add liquidity”; “Learn more about the farming program”; “Return” (STATE 020).
- STATE 021: Clicking “View pool details” expands #1 Left:
  - “Liquidity Chart” label; Pool Id `0x56c3...d7d9`; Pool Balances `3.12k FRNALEFT / 636.89 sDAI` (STATE 021)
  - Numeric ladder/table with visible headers `SHARES` and `TOTAL`; repeated three-value rows (e.g. `0.4584`, `1.02`, `3120.46`); label `Last: 0.3159` (STATE 021)
  - Capture truncates at “#2 Ce” (STATE 021).

### France — interest/liquidity breakdown — STATE 018
- “Open interest:” `3.13k sDAI (0 $)` (STATE 018).
- “Volume:” `1.32k $ traded, notional 4.80k $` (STATE 018).
- “Liquidity:” per outcome:
  - Left: `3.10k FRNALEFT / 642.63 sDAI` (STATE 018)
  - Centre: `3.13k FRNACENTRE / 645.08 sDAI` (STATE 018)
  - Far Right: `3.12k FRNAFARRIGH / 509.05 sDAI` (STATE 018)
  - Right: `3.04k FRNARIGHT / 337.77 sDAI` (STATE 018)
  - Other: `3.03k FRNAOTHER / 134.65 sDAI` (STATE 018).

### Polymarket clarification-notes market — STATE 022–029
- Purpose: market detail/trading page for “How many Polymarket clarification notes published before January 1, 2027 will cause a market price move of at least 25 percentage points within 24 hours? [Note]” (STATE 022–029).
- Status: “Reports open” (STATE 022–029).
- Action

## NOTES CHUNK 3
**Global shell / navigation**
- Beta warning on every capture: “Note that this is a Beta version and can still be unstable” (030–046).
- Top nav: Markets, Leaderboard, Create Market, Policies, App (030–046).
- Wallet chip shows truncated address `0x0000...dEaD` and balance `24.69 xDAI` (030–039, 041–046). State 040 instead shows `Connect` and no wallet address/balance.
- Wallet menu actions: Account, Deposit, Portfolio, Market Collections, Trade Collateral, Use smart account (037).
- App menu items: Futarchy, Deepfunding, Foresight, Opportunity Markets; no submenu content captured (036).
- Policies menu items: Verified Market Policy, Market Rules Policy; no policy content captured (034, 045).
- Theme control “Switch to light mode”; no visible theme change in capture (038).
- Crawl metadata for each state: `charts=3`, `tables=1`; captures expose one main market chart and, in pool-detail states, one long pool table (030–046).

**Market screens and purpose**
- STATE 030–032: Scalar market page and overlays for “How many Polymarket clarification notes published before January 1, 2027 will cause a market price move of at least 25 percentage points within 24 hours? [Note]”.
- STATE 033–043: Categorical market page and overlays for “Will Polymarket publicly release a fix for the negative-risk mint/merge share cost basis accounting issue before January 1, 2027?”.
- STATE 044–046: Categorical election market “Who will win the 2026 South Sudanese presidential election?”.
- All visible markets show status “Reports open” and “Verified” (030–046).

**Market header fields**
- Scalar market: `Market Estimate: 21.23 Note`; `Scalar`; `Liquidity: 1.11k`; `Volume: 88.65`; `P&L: 0.00`; `Verified` (030–032).
- Categorical market: `Categorical`; `Liquidity: 1.18k`; `Volume: 61.89`; `P&L: 0.00`; `Verified` (033–039, 041–043).
- South Sudan market: `Categorical`; `Liquidity: 781.17`; `Volume: 107.76`; `P&L: 0.00`; `Verified` (044–046).
- State 040 drops `P&L` from the header and shows `Liquidity: 1.18k`, `Volume: 61.89`, `Verified`.
- Header liquidity/volume/P&L values show no unit in the market header; `1.11k`/`1.18k` use `k` abbreviation (030–046).

**Outcomes / prices**
- Scalar outcomes:
  - `#1 DOWN [10,50]` — `0.648` (030–032).
  - `#2 UP [10,50]` — `0.295` (030–032).
  - `#3 Invalid` — `10.00 SER-INVALID` — `0` (030–032).
- Categorical outcomes:
  - `#1 No` — `51.6%` (033–043).
  - `#2 Yes` — `48.4%` (033–043).
  - `#3 Invalid` — `10.00 SER-INVALID` — `0%` (033–043).
- South Sudan outcomes:
  - `#1 Salva Kiir Mayardit` — `89.8%` (044–046).
  - `#2 Others` — `9.9%` (044–046).
  - `#3 Invalid` — `5.00 SER-INVALID` — `0%` (044–046).
- Each outcome row includes `Add Liquidity`, `View pool details`, and `New conditional market` controls; destination for “New conditional market” not captured (030–046).
- “Invalid” outcome stake differs by market: `10.00 SER-INVALID` vs `5.00 SER-INVALID`; no explanation of token/stake semantics in capture (030–046).

**Charts / graphics**
- Scalar main chart labelled `Market Estimate` with visible `21.2%` (030–032).
- Categorical main chart shows outcome percentages; hover tooltip in state 035: `Sep 15, 2026 21:00`; `No: 51.90%`; `Yes: 48.20%` (033–035).
- South Sudan chart hover tooltip in state 046: `Sep 21, 2026 13:00`; `Salva Kiir Mayardit: 89.80