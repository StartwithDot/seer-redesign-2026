# flows states (explorer; DeepSeek draft: Claude verifies against screenshots)

# Explorer user-flow audit

## 0. Evidence conventions and limits

- **Observed** = state, control, copy, href, or result explicitly listed in the crawl notes/controls inventory. Cited as `[observed STATE n]` or `[observed control inventory, STATE nd]`.
- **Inferred** = transition or destination not directly captured, but implied by a control/href. Cited as `[inferred]`.
- The notes do **not** include screenshots or full DOM for every state. Several states are only named, not described.
- The notes conflict on the Polymarket clarification-notes market: Chunk 2 assigns it to `STATE 022–029`; Chunk 3 assigns the same title to `STATE 030–032`. I do not assume they are the same capture set.
- The notes do not define the `m` suffix in `STATE 050m/062m/069m/081m`; I treat those as mobile-suffixed captures only by naming convention, not confirmed behavior.

---

## 1. Global shell / navigation flows

### F1. Top-nav `Markets` / `Leaderboard` / `Create Market`

1. Market detail page `[observed STATE 001]` -> click `Markets` `[observed control inventory, STATE 001d]` -> href `/` `[observed href]`; destination page not captured `[inferred]`.
2. Market detail page `[observed STATE 001]` -> click `Leaderboard` `[observed control inventory, STATE 001d]` -> href `/leaderboard` `[observed href]`; destination page not captured `[inferred]`.
3. Market detail page `[observed STATE 001]` -> click `Create Market` `[observed control inventory, STATE 001d]` -> href `/create-market` `[observed href]`; destination page not captured `[inferred]`.

### F2. `Policies` menu / overlay

1. Market detail page `[observed STATE 001]` -> click `Policies` `[observed control inventory, STATE 001d]` -> overlay with headings `Verified Market Policy`, `Market Rules Policy` `[observed STATE 002]`.
2. Same flow over France market: `[observed STATE 011]` -> `Policies` -> overlay `[observed STATE 012]`.
3. Policy menu items are also recorded in `STATE 023`, `STATE 034`, `STATE 045` `[observed]`.
4. From policy menu `[observed STATE 002]` -> click `Verified Market Policy` `[observed control inventory, STATE 002d]` -> href `/policy/verified` `[observed href]`; policy page content not captured `[inferred]`.
5. From policy menu `[observed STATE 002]` -> click `Market Rules Policy` `[observed control inventory, STATE 002d]` -> href `/policy/rules` `[observed href]`; policy page content not captured `[inferred]`.

### F3. `App` menu

1. Market detail page `[observed STATE 001]` -> click `App` `[observed control inventory, STATE 001d]` -> expanded menu: `Futarchy`, `Deepfunding`, `Foresight`, `Opportunity Markets` `[observed STATE 004]`.
2. Same menu observed over France `[observed STATE 014]`, and in `STATE 025`, `STATE 036` `[observed]`.
3. From App menu `[observed STATE 004]` -> click each item `[observed control inventory, STATE 004d]` -> external hrefs: `https://futarchy.seer.pm/`, `https://deep.seer.pm/`, `https://foresight.kleros.io/`, `https://opportunity.seer.pm` `[observed hrefs]`; external destination content not captured `[inferred]`.

### F4. Wallet/account menu

1. Market detail page with wallet chip `24.69 xDAI` `[observed STATE 001]` -> click balance chip `[observed control inventory, STATE 001d]` -> account menu: `Account`, `Deposit`, `Portfolio`, `Market Collections`, `Trade Collateral`, `Use smart account` `[observed STATE 005]`.
2. Same menu observed over France `[observed STATE 015]`, and in `STATE 026`, `STATE 037` `[observed]`.
3. From account menu `[observed STATE 005]` -> click `Account` `[observed control inventory, STATE 005d]` -> href `/profile` `[observed href]`; profile page not captured `[inferred]`.
4. `Portfolio` -> href `/portfolio` `[observed href]`; destination not captured `[inferred]`.
5. `Market Collections` -> href `/collections/default` `[observed href]`; destination not captured `[inferred]`.
6. `Trade Collateral` -> href `/trade-collateral` `[observed href]`; destination not captured `[inferred]`.
7. `Deposit` `[observed control inventory, STATE 005d]` and `Use smart account` `[observed control inventory, STATE 005d]` have no captured destination/result `[inferred/not observed]`.

### F5. Connect-wallet / disconnected state

1. Market page can show `Connect` instead of address/balance `[observed STATE 040]`.
2. From `Connect` chip `[observed STATE 040]` -> click `Connect` -> wallet selection/authentication modal `[inferred; not captured]`.
3. Wallet/Web3Modal/Magic Link API traffic exists in the data model `[observed API/data model]`, but no connect modal, wallet list, auth success, or post-connect state is captured.

### F6. Theme toggle

1. Market page with `Switch to dark mode` `[observed control inventory, STATE 001d]` -> click -> dark-mode toggle captured; visible content unchanged `[observed STATE 006]`.
2. State with `Switch to light mode` `[observed STATE 038]` -> click -> no visible theme change captured `[observed STATE 038]`; detailed light/dark visual behavior not observed.

---

## 2. Market-detail flows

### F7. Ethereum BASEFEE scalar market — `Trading Open`

1. Land on market detail `[observed STATE 001]` -> status `Trading Open`; beta banner, top nav, wallet chip present `[observed STATE 001]`.
2. Chart -> hover -> tooltip `[observed STATE 003]`.
3. `Policies` -> overlay headings `[observed STATE 002]`.
4. `App` -> menu `[observed STATE 004]`.
5. Wallet chip -> account menu `[observed STATE 005]`.
6. `Switch to dark mode` -> content unchanged `[observed STATE 006]`.
7. `Open interest and liquidity breakdown` -> expanded panel `[observed STATE 007]`; detailed contents not described for this market.
8. `Custom` chart-date control -> date picker opened `[observed STATE 008]`.
9. `Add Liquidity` -> `Add Liquidity` / `Farming Rewards` panel opened `[observed STATE 009]`.
10. `View pool details` for DOWN outcome -> expanded pool details `[observed STATE 010]`.
11. Comments area shows wallet-gated empty state `[observed STATE 001–015]`.
12. Trade controls present: `You pay`, `sDAI`, `Max`, `Calculate your potential return`, `Mint`, `More`, `Merge`, `Redeem`, `Enter an amount` disabled, `Mint` disabled `[observed control inventory, STATE 001d]`; no execution result captured `[not observed]`.

### F8. France National Assembly multi-scalar market — `Pending execution`

1. Land on France market detail `[observed STATE 011; detailed in STATE 016–021]` -> status `Pending execution`, type `Multi Scalar` `[observed STATE 016–021]`.
2. `Reopen question` -> error copy `User rejected the request.`; page otherwise unchanged `[observed STATE 017]`.
3. `Open interest and liquidity breakdown` -> expanded panel with open interest `3.13k sDAI (0 $)`, volume `1.32k $ traded, notional 4.80k $`, per-outcome liquidity `[observed STATE 018]`.
4. `Custom` chart-date control -> date-range modal with presets `Today`, `Last Week`, `Last Month`, `All`, month navigation, calendar grid, `Cancel`/`Save` `[observed STATE 019]`.
5. `Add Liquidity` -> drawer titled `Add Liquidity`, section `Farming Rewards`, copy about SEER rewards, available pools, `Rewards ended on: January 5 2026, 13:21`, `Add liquidity`, `Learn more about the farming program`, `Return` `[observed STATE 020]`.
6. `View pool details` for `#1 Left` -> expanded pool details: `Liquidity Chart`, Pool Id `0x56c3...d7d9`, balances `3.12k FRNALEFT / 636.89 sDAI`, table headers `SHARES` and `TOTAL`, `Last: 0.3159`; capture truncates at `#2 Ce` `[observed STATE 021]`.
7. Chart -> hover -> tooltip `[observed STATE 013]`.
8. `Policies` -> overlay `[observed STATE 012]`.
9. `App` -> menu `[observed STATE 014]`.
10. Wallet chip -> account menu `[observed STATE 015]`.
11. `Hide questions` control is present `[observed STATE 016–021]`; click behavior not observed.
12. Outcome actions `Add Liquidity`, `View pool details`, `New conditional market` present `[observed STATE 016–021]`; `New conditional market` href is `/create-market?parentMarket=...` `[observed control inventory, STATE 001d]`; destination not captured `[inferred]`.
13. Trade panel selected outcome `#1 Left`; tabs/labels `Mint`, `More`, `Merge`, `Redeem`, amount input `Max`, balance `0 sDAI`, asset buttons `sDAI`, `xDAI`, `Mint` disabled `[observed STATE 016–021 / control inventory]`; execution not captured `[not observed]`.
14. Comments area wallet-gated empty state `[observed STATE 016–021]`.

### F9. Polymarket clarification-notes market — `STATE 022–029` and `STATE 030–032`

**Uncertainty:** Chunk 2 names `STATE 022–029` for the Polymarket clarification-notes market; Chunk 3 names `STATE 030–032` for the same market title. Relationship between the two capture sets is not stated.

1. Land on market detail `[observed STATE 022; repeated title at STATE 030–032]` -> status `Reports open` `[observed STATE 022–029; 030–032]`.
2. Scalar market fields at `STATE 030–032`: `Market Estimate: 21.23 Note`, `Scalar`, `Liquidity: 1.11k`, `Volume: 88.65`, `P&L: 0.00`, `Verified` `[observed STATE 030–032]`.
3. `Policies` menu items observed `[observed STATE 023]`.
4. `App` menu items observed `[observed STATE 025]`; notes say no submenu content captured in some states, but item names are recorded `[observed STATE 025 / control inventory]`.
5. Wallet chip -> account menu `[observed STATE 026]`.
6. Theme control present; no visual theme change captured `[observed STATE 027]`.
7. `Custom` chart-date controls present in `STATE 030d` `[observed control inventory, STATE 030d]`; opened modal content not described `[inferred/not observed]`.
8. Detailed action/result for this market is truncated in the notes; trade/comment/pool flows cannot be reconstructed `[not observed]`.

### F10. Polymarket negative-risk fix categorical market — `Reports open`

1. Land on categorical market detail `[observed STATE 033–043]` -> status `Reports open`, type `Categorical`, outcomes `#1 No 51.6%`, `#2 Yes 48.4%`, `#3 Invalid 0%` `[observed STATE 033–043]`.
2. Chart -> hover -> tooltip `Sep 15, 2026 21:00`; `No: 51.90%`; `Yes: 48.20%` `[observed STATE 035]`.
3. `Policies` menu items observed `[observed STATE 034]`.
4. `App` menu items observed `[observed STATE 036]`.
5. Wallet chip -> account menu `[observed STATE 037]`.
6. `Switch to light mode` -> no visible theme change captured `[observed STATE 038]`.
7. `Connect` chip appears in `STATE 040` with no address/balance `[observed STATE 040]`; click-connect result not captured `[inferred/not observed]`.
8. `Custom` chart-date controls present in `STATE 041d` `[observed control inventory, STATE 041d]`; modal content not described `[not observed]`.
9. Outcome actions `Add Liquidity`, `View pool details`, `New conditional market` present `[observed STATE 033–043]`; destinations/expansions not captured for this market `[not observed]`.

### F11. South Sudanese presidential election categorical market — `Reports open`

1. Land on market detail `[observed STATE 044–046]` -> status `Reports open`, type `Categorical`, outcomes `#1 Salva Kiir Mayardit 89.8%`, `#2 Others 9.9%`, `#3 Invalid 0%` `[observed STATE 044–046]`.
2. Chart -> hover -> tooltip `Sep 21, 2026 13:00`; `Salva Kiir Mayardit: 89.80...` (capture truncated) `[observed STATE 046]`.
3. `Policies` menu items observed `[observed STATE 045]`.
4. No other interaction state captured for this market `[not observed]`.

---

## 3. Wallet-gated, empty, error, loading, ended/resolved, mobile

### F12. Wallet-gated comments + empty state

1. Market detail page `[observed STATE 001 / STATE 016]` -> comments area -> wallet-gated copy: `Connect your wallet to share your take`, `Connect to comment`; empty copy: `No takes yet. Share the first one.` `[observed STATE 001–015; STATE 016–021]`.
2. Click `Connect to comment` `[observed control inventory, STATE 001d]` -> wallet-connect modal `[inferred; not captured]`.
3. `GET /market-comments?market_id=...` returns `{"data":[]}` for the observed market `[observed data model]`, consistent with the empty comments state.
4. **Uncertainty:** comments remain wallet-gated even where wallet chip shows `0x0000...dEaD` and `24.69 xDAI` `[observed STATE 001–015; 016–021]`. The notes do not explain whether this is an auth/session mismatch or stale copy. Do not infer that a displayed wallet authorizes commenting.
5. Comment submission, post-submit success, and post-connect comment composer were not captured `[not observed]`.

### F13. Error flow

1. France market `[observed STATE 016]` -> `Reopen question` -> error copy `User rejected the request.` `[observed STATE 017]`.
2. Page otherwise unchanged `[observed STATE 017]`.
3. No retry, loading, or success flow after `Reopen question` was captured `[not observed]`.

### F14. Loading states

- No explicit loading/skeleton/spinner state is described in any captured state.
- API/chart/table calls and metadata `charts=3`, `tables=1` exist `[observed data model/metadata]`, but the UI loading behavior is **not observed**.
- Therefore no loading flow can be sequenced beyond inference.

### F15. Ended / resolved flow

- No ended or resolved market state was captured.
- Observed statuses: `Trading Open` `[STATE 001]`, `Pending execution` `[STATE 011; 016–021]`, `Reports open` `[STATE 022–046]`.
- `Redeem` tab/control is present `[observed control inventory, STATE 001d]`, but no resolved market, redeem click, payout, claim, or settlement result was captured `[not observed]`.
- A true ended/resolved user flow cannot be reconstructed from these notes.

### F16. Mobile-specific behavior

- Mobile-suffixed states appear only in the controls inventory for date-picker controls: `STATE 050m`, `STATE 062m`, `STATE 069m`, `STATE 081m` `[observed control inventory]`.
- The controls listed are `Today`, `Last Week`, `Last Month`, `All`, `Previous Month`, `Next Month`, and calendar day options `[observed control inventory, STATE 050m/062m/069m/081m]`.
- No mobile-specific layout, navigation, wallet, chart, comment, trade, or modal behavior is described in the notes.
- Mobile flows are therefore **not observable** beyond “date-picker controls exist on mobile-suffixed captures.” The `m` suffix is not defined in the notes `[uncertainty]`.

---

## 4. Flows that could not be observed, and why

1. **Wallet connect / auth / post-connect flow** — only `STATE 040` shows a `Connect` chip; no wallet modal, wallet list, auth success, or post-connect account state was captured. Web3Modal/Magic Link API traffic exists, but not the UI flow.
2. **Trade execution** — amount entry, `Max`, `Calculate your potential return`, `More`, `Mint`, `Merge`, `Redeem`, approvals/signing, success/error states were not captured. Only controls and disabled states are recorded.
3. **Outcome selection / trade-panel switching** — France shows selected `#1 Left`; clicking other outcomes is not captured.
4. **`New conditional market` flow** — href `/create-market?parentMarket=...` is present, but destination and form behavior are not captured.
5. **`Hide questions` behavior** — control is present on France; click result not captured.
6. **Policy detail pages** — `/policy/verified` and `/policy/rules` hrefs exist; page content not captured.
7. **App external destinations** — menu items and external hrefs exist; external apps not captured.
8. **Account / Deposit / Portfolio / Market Collections / Trade Collateral / Use smart account** — menu items and some hrefs exist; destinations/results not captured. `Deposit` and `Use smart account` have no captured destination.
9. **Markets / Leaderboard / Create Market destinations** — hrefs exist; pages not captured.
10. **Comments tab, Related Conditional Markets, Top Holders, Activity tabs** — controls are present; click results/empty states for these tabs are not captured.
11. **Comment posting after wallet connection** — comments are gated/empty; no post-connect composer or submit result captured.
12. **Loading states** — no loading UI captured despite API/chart/table calls.
13. **Ended/resolved/redeem flow** — no resolved market state; `Redeem` control is present but unexecuted.
14. **Mobile-specific flows** — only date-picker controls in mobile-suffixed captures; no mobile layout/nav/trade/comment behavior described.
15. **Theme visual behavior** — `STATE 006` says visible content unchanged after dark-mode toggle; `STATE 038` says no visible theme change; full theme behavior not captured.
16. **Full pool-details table** — `STATE 021` truncates at `#2 Ce`; pagination/scroll/full table behavior is not captured.
17. **Polymarket clarification-notes market interactions** — notes are truncated for `STATE 022–029` and `STATE 030–032`; trade/comment/pool flows cannot be reconstructed.
18. **South Sudan market interactions beyond hover/policy menu** — no trade, pool, comment, or outcome-selection state captured.