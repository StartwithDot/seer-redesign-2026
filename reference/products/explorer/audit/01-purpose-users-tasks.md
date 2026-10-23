# purpose users tasks (explorer; DeepSeek draft: Claude verifies against screenshots)

# Explorer audit — purpose, users, JTBD, primary tasks

## 1. Product purpose

`explorer` is the captured Seer prediction-market front end at `app.seer.pm`: a market-discovery, market-detail/trading, liquidity, reporting, market-creation, and trader-leaderboard interface. Captured surfaces include the `/` markets feed, `/leaderboard`, `/create-market`, `/collections/default`, and market-detail/trading pages with conditional markets, liquidity, comments, holders, and activity tabs. [STATE 001–008, 009–026, 027–031, 032–036, 037–090]

The product is explicitly beta: “Note that this is a Beta version and can still be unstable.” [STATE 001–008, 009–019, 020–040, 056–069, 070–090]

Core purpose, as evidenced by UI copy and controls:
- Discover and inspect prediction markets by topic, state, verification, chain, liquidity, rewards, and futarchy/conditional attributes. [STATE 001–008, 006, 018]
- View outcome probabilities, volume, liquidity, open interest, charts/tooltips, holders, activity, and related conditional markets. [STATE 037–044, 056–069, 087–090]
- Trade outcome tokens with `Mint` / `Merge` / `Redeem`, using `sDAI` / `xDAI` collateral. [STATE 037–040, 056–069, 087–090]
- Provide liquidity and see farming rewards (`SEER`) for existing markets. [STATE 063–064]
- Report or dispute answers through Reality.eth, including a `10 XDAI` bond. [STATE 043, 060]
- Create markets by selecting a market type. [STATE 027–031]
- Rank wallets by trading P/L and Trader Score on a leaderboard. [STATE 009–026]

## 2. Who uses it

Roles are inferred from visible controls and copy; the captures do not provide explicit persona definitions.

| User / role | Evidence | Notes |
|---|---|---|
| Market visitor / analyst | Markets feed, search, `Filters`, market cards, market-detail tabs, `Open interest and liquidity breakdown` | Can browse and inspect without evidence of wallet gating. [STATE 001–008, 037–044, 056–069] |
| Trader / speculator | Trade panel with `You pay`, `You will get`, `Avg price`, `Potential return`, `Mint`, `Merge`, `Redeem`; `Balance: 0 sDAI` | Needs a wallet and collateral to execute; completed trades were not captured. [STATE 037–040, 056–069, 087–090] |
| Liquidity provider / farmer | `Add Liquidity`, `Farming Rewards`, “Earn farming rewards (SEER)…”, `Available Pools:` | Needs wallet and LP/collateral funds; execution not captured. [STATE 063–064] |
| Reporter / resolver | `Answer on Reality.eth!`, `Report Answer`, `Choose an answer`, `Mark this question invalid`, `10 XDAI` bond | Needs wallet and bond funds. [STATE 043, 060] |
| Market creator | `Create Market`, `Create New Market`, type choices `Categorical`, `Scalar`, `Multi Categorical`, `Multi Scalar`, `Next` | Creation form beyond type selection was not captured. [STATE 027–031] |
| Leaderboard trader / performance analyst | `/leaderboard`, `1D`/`1W`/`1M`/`ALL`, `Filters`, `Your Rank`, `Score`, `Profit/Loss`, `ROI`, `Traded Markets` | `Your Rank` appears associated with connected-wallet states. [STATE 009–026] |
| Wallet/account and collection user | `24.69 xDAI` menu: `Account`, `Deposit`, `Portfolio`, `Market Collections`, `Trade Collateral`, `Use smart account`; `My collections` | Account/deposit/portfolio result pages were not captured. [STATE 004, 012, 030, 035, 032–036] |
| App-ecosystem user | `App` menu: `Futarchy`, `Deepfunding`, `Foresight`, `Opportunity Markets` | App menu items are visible; selection results were not captured. [STATE 003, 011, 029, 034, 040, 058] |

## 3. Jobs-to-be-done

Inferred from captured controls and copy:

1. Find relevant markets and narrow the feed by state, verification, chain, sort order, conditional status, rewards, liquidity, and futarchy. [STATE 001–008, 006, 018]
2. Understand a market before acting: outcome probabilities, volume, liquidity, open interest, chart history, holders, activity, and conditional relationships. [STATE 037–044, 056–069, 087–090]
3. Take a position in an outcome using collateral and review price/slippage/potential return before using `Mint`, `Merge`, or `Redeem`. [STATE 037–040, 056–069, 087–090]
4. Earn farming rewards by providing liquidity to existing markets. [STATE 063–064]
5. Report or challenge unresolved market answers through Reality.eth, including posting a bond. [STATE 043, 060]
6. Launch a new market by choosing a market type. [STATE 027–031]
7. Benchmark wallet trading performance against others by P/L, score, volume, ROI, and traded-market count. [STATE 009–026]
8. Manage wallet/account context and market collections. [STATE 004, 012, 030, 035, 032–036]

## 4. Primary tasks (8), with exact control labels and requirements

### Task 1 — Discover and filter markets

1. Open `Markets` / the root feed. [STATE 001–008]
2. Use `Search by market, outcome or collection`; captured search typed `e` and URL became `/?marketName=e`, but the captured feed did not visibly filter. [STATE 008; controls inventory]
3. Click `Filters` and set captured filter fields: `Market States`, `Verification Status`, `Chain`, `Sort By`, `Conditional Market`, `Rewards`, `Minimum Liquidity`, `Futarchy`. [STATE 006]
4. Review market cards for question text, outcome label + percentage, and dollar-formatted volume, e.g. `Yashar 60.9%`, `$27.74k`. [STATE 001–008]
5. Open a market title to enter the market-detail page. [STATE 001–008, 037–040]

**Needs:** Wallet — no, browsing is visible without a connected wallet; Funds — no; Role — visitor / trader / analyst.  
**Uncertainty:** Search filtering is not proven in the capture; typing `e` did not visibly change the feed. [STATE 008]

### Task 2 — Inspect a market, outcomes, liquidity, holders, and activity

1. Open a market title from the feed. [STATE 001–008, 037–040]
2. Review market header/status fields: `Reports open`, `Categorical`, `Verified`, `Liquidity`, `Volume`, `P&L`, and `Answer on Reality.eth!`. [STATE 037–040, 056–069, 087–090]
3. Read outcome rows and probabilities, e.g. `#1 Yashar 60.8%`, `#2 Likud 38.1%`, `#3 Others 0.9%`; numeric markets also show bounds such as `10`/`50` for NOTE and `0.1`/`120` for GWEI. [STATE 001–008, 037–040]
4. Use time-range controls `1D`, `1W`, `1M`, `All`, `Custom`; hover the chart to see tooltip values such as `Sep 22, 2026 02:30`, `Yashar: 59.60%`. [STATE 037–040, 056–069]
5. Click `Open interest and liquidity breakdown` to see open interest, volume/notional, and per-outcome pool balances. [STATE 007, 044, 061]
6. Open tabs `Comments`, `Related Conditional Markets`, `Top Holders`, and `Activity`. [STATE 037–040, 056–069, 087–088]

**Needs:** Wallet — no for read-only inspection; Funds — no; Role — visitor / analyst / trader.  
**Uncertainty:** Chart axes, titles, and full series are not exposed in text captures; only chart counts, time controls, and one tooltip are captured. [STATE 037–040, 056–069, 087–090]

### Task 3 — Connect and manage wallet/account context

1. If disconnected, click `Connect`. [STATE 008, 015–016, 067]
2. If connected, click the balance control `24.69 xDAI` to open the wallet menu. [STATE 004, 012, 030, 035]
3. Choose from `Account`, `Deposit`, `Portfolio`, `Market Collections`, `Trade Collateral`, `Use smart account`. [STATE 004, 012, 030, 035]
4. For collections, use `My collections` / `Market Collections`; sign-in-gated copy includes `Sign in to view and manage your market collections`. [STATE 032–036]
5. When a chain switch is offered, the captured control includes `Switch to Gnosis`. [STATE 067]

**Needs:** Wallet — yes, for connected/account actions; Funds — no for simply connecting/menu access; Role — wallet holder / trader / collection user.  
**Uncertainty:** `Deposit`, `Portfolio`, `Account`, and `Trade Collateral` result pages/flows were not captured. [STATE 004, 012, 030, 035]

### Task 4 — Trade a market outcome

1. Open a market and select an outcome row, e.g. `Yashar`, `Yes`, `No`, or `Left (...)`. [STATE 037–040, 056–069, 087–090]
2. In the trade panel, set `You pay` collateral/token and enter an amount using `Enter an amount` or `Amount`; use `Max` where available. Captured collateral choices include `sDAI` / `xDAI`; some markets show token-denominated labels such as `LEPEN_NRYES`. [STATE 037–040, 056–069, 087–090]
3. Review `You will get`, `Avg price`, `Potential return`, `Max slippage 1%`, and `Balance: 0 sDAI`. [STATE 037–040, 056–069, 087–090]
4. Choose the action tab/button `Mint`, `Merge`, or `Redeem`. [STATE 037–040, 056–069, 087–090]
5. Confirm/sign in the wallet. This final signing step is inferred; no completed trade is captured. [uncertain; STATE 037–040, 056–069, 087–090]

**Needs:** Wallet — yes; Funds — yes, collateral such as `sDAI`/`xDAI` (captured balance was `0 sDAI` / `0 LEPEN_NRYES`); Role — trader.  
**Uncertainty:** No executed transaction, confirmation, success state, or post-trade balance is captured. [STATE 037–040, 056–069, 087–090]

### Task 5 — Provide liquidity / farm rewards

1. On an outcome row, click `Add Liquidity`. [STATE 056–069, 087–090]
2. In the modal, review `Add Liquidity` / `Farming Rewards`, `Available Pools:`, and copy “Earn farming rewards (SEER) by providing liquidity to existing markets.” [STATE 063]
3. Click `Add liquidity` to proceed, or `Learn more about the farming program`; use `Return` to close. [STATE 063]
4. To inspect pool data, click `View pool details`;