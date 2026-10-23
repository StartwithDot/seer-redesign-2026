# purpose users tasks (futarchy; DeepSeek draft: Claude verifies against screenshots)

# Futarchy — Audit Extract

## 1. Purpose of the product

Observed copy states: **“Futarchy — Market-based evaluation of governance decisions and milestones”** [STATE001–019]. The product presents itself as a futarchy frontend/aggregator for governance and milestone markets: a dashboard with **Active Milestones**, **Recently Closed**, and **Organizations**, plus market-detail pages showing resolution rules, YES/NO prices, TWAP recommendation data, trading, redemption, collateral, and liquidity controls [STATE001–035, STATE044–052]. It links outward to Snapshot for votes/results, Reality.eth for resolution questions, and Swapr for liquidity provision [STATE010–013, STATE024–035, STATE044–052; controls inventory].

**Uncertainty:** The exact business/operating model is not stated in the captures beyond the tagline and UI. Whether Futarchy itself custodies funds or is purely a frontend/aggregator is not established by the notes.

## 2. Who uses it

Inferred from controls and copy — user roles are not explicitly labeled in the UI:

- **Governance participants / DAO voters** evaluating proposals and milestones through market-implied prices and TWAP summaries [STATE001–035, STATE044–052].
- **Traders** taking YES/NO views through `Buy` / `Sell` and outcome selection [STATE010–035, STATE052].
- **Liquidity providers** using `Add Liquidity` and pool links that open Swapr [STATE013, STATE028; controls inventory].
- **Collateral managers / outcome-token holders** using `Split Collateral`, `Merge Collateral`, and `Redeem Tokens` [STATE020–023, STATE030–033, STATE036–052].
- **Market creators/operators** — implied by `Create market` and `Resolve Question`, but no creation or resolution flow is captured [STATE001–009, STATE010–013; controls inventory].
- **Analysts/observers** reading market status, resolution text, activity tables, and TWAP data [STATE010–035, STATE044–052].

## 3. Jobs-to-be-done

- **Evaluate governance decisions and milestones via market signals** — read YES/NO prices, impact, volume/TVL, resolution rules, and TWAP recommendations [STATE001–035, STATE044–052].
- **Express a view on a proposal outcome** — buy/sell YES or NO exposure with `sDAI` [STATE010–035, STATE052].
- **Monitor market lifecycle** — track `Active Milestones`, `Recently Closed`, `Awaiting Resolution`, `Resolved`, `Final Result`, and resolution dates [STATE001–035, STATE044–052].
- **Provide liquidity and earn fees** through pool categories and Swapr links [STATE013, STATE028].
- **Manage collateral and outcome-token positions** via split/merge/redeem controls [STATE020–033, STATE036–052].
- **Verify or participate in off-chain governance/resolution** via `Snapshot Vote`, `View final results on Snapshot`, and `Resolve Question` [STATE010–013, STATE024–035].
- **Create and list new markets** — control exists, but the flow is not captured [STATE001–009; controls inventory].

## 4. Primary tasks — max 8

### Task 1 — Discover and filter organizations/markets

1. Open the landing dashboard `/` and review **Active Milestones**, **Recently Closed**, and **Organizations** [STATE001–009].
2. Optionally open `Chain Selector` → `Switch Networks`; observed options are `Ethereum`, `Gnosis`, and `Connected` [STATE003, STATE007, STATE011, STATE026, STATE036, STATE046].
3. Use `Filter by name...` to narrow Organizations; typing `e` changed `5 organizations` to `4 organizations`, removing Gnosis DAO while leaving Kleros DAO, Ethereum, VeloraDAO, and Aave DAO [STATE005, STATE009].
4. Review organization columns `NAME`, `ACTIVE`, `PROPOSALS ↓`, `CHAIN`, `LIQUIDITY` [STATE001–009].
5. Open a market card or use `Liquidity` links to `/flm/gnosis` or `/flm/kleros`; resulting liquidity screens are not captured [STATE001–009; controls inventory].

**Needs — Wallet:** Not verified for read-only browsing; captures show `👾 0x00…dEaD` connected, but no explicit wallet gate was captured [STATE001–009]. **Funds:** None observed for browsing. **Role:** Visitor, analyst, or DAO governance participant.

**Uncertainty:** Search behavior is not explained; typing `e` removed Gnosis DAO but not Kleros DAO [STATE005, STATE009].

---

### Task 2 — Inspect a market, resolution rules, and TWAP recommendation

1. Open a market-detail route such as `/markets/0xee8878d0a7136c5cd109554f06bb780e225badef` [STATE010–019].
2. Read the market question, trading pair, `Yes Price`, `No Price`, `Impact (spot)`, `Status`, `Volume (Total; sDAI)`, `TVL`, and resolution date [STATE010–035, STATE044–052].
3. Open `Snapshot Vote` or `View final results on Snapshot`, and `Resolve Question`, where present [STATE010–013, STATE024–035; controls inventory].
4. Read resolution copy and final-result fields such as `Resolved: YES`, `Resolution Question`, `Final Result`, and `APPROVED` [STATE024–035, STATE044–052].
5. Read TWAP content where available: `TWAP Complete`, `FINAL TWAP WINDOW`, `UPDATED`, `YES TWAP`, `NO TWAP`, and messages such as `YES outcome is ahead on TWAP.` [STATE024–036, STATE044–052].
6. Review activity tabs `Recent Activity`, `My Trades`, `Position`, and filters `Last 30 trades`, `Last 60 trades`, `Last 90 trades` [STATE010–035].

**Needs — Wallet:** Not explicitly required for viewing; captures show a connected wallet and no blocking gate [STATE010–035]. **Funds:** None observed for viewing. **Role:** Analyst, governance participant, or trader evaluating a market.

**Uncertainty:** Chart data is not readable; captures report `charts=2` but no axes, series labels, or tooltips were captured [STATE010–035; charts inventory]. GIP-152 shows conflicting lifecycle signals: `Ended`, `Awaiting Resolution`, and `Final Result APPROVED` together [STATE010–013, STATE016–019].

---

### Task 3 — Manage wallet, network, and display controls

1. Open `Chain Selector` → `Switch Networks` and select `Ethereum`, `Gnosis`, or `Connected` as available [STATE003, STATE007, STATE011, STATE026, STATE036, STATE046].
2. Click `👾 0x00…dEaD` to open the wallet popover [STATE004, STATE008, STATE012, STATE027, STATE037, STATE047].
3. Use `Copy Address`, `Disconnect`, or `View more on explorer` [STATE004, STATE008, STATE012, STATE027, STATE037, STATE047].
4. Use `Refresh RPC Connection` if needed; toggle `Switch to dark mode` / `Switch to light mode` [controls inventory; STATE002, STATE025, STATE035].

**Needs — Wallet:** A connected wallet is observed for the account popover and address display [STATE004, STATE008, STATE012, STATE027, STATE037, STATE047]. **Funds:** None required for these controls. **Role:** Any connected user.

**Uncertainty:** No wallet-connection onboarding screen is captured; only an already-connected `0x00…dEaD` account is shown.

---

### Task 4 — Trade a YES/NO outcome

1. Open a market page and confirm the chain/network via `Chain Selector` if needed [STATE010–035].
2. Select `If Yes` or `If No` [STATE010–019].
3. Select `Buy` or `Sell` [STATE010–019].
4. Enter `Amount (sDAI)` or press `Max`; the field also shows `Available -` [STATE010–019, STATE052].
5. Review the quote/estimate area using `Receive If Yes`, `Receive If No`, `Recover`, `Outcomes`, and `More info` where present [STATE010–035, STATE052].
6. Submit through the trade action button. In captured empty-wallet states the button is disabled and labeled `Insufficient balance` or `Quote Unavailable` [STATE010–019, STATE034–036, STATE052].

**Needs — Wallet:** Connected wallet observed [STATE010–035]. **Funds:** `sDAI` is the displayed trade input; captured wallets show `0 sDAI`, and the UI reports `Insufficient balance` [STATE010–019]. Selling may require outcome tokens, but that requirement is not explicitly evidenced. **Role:** Trader.

**Uncertainty:** No successful funded trade is captured. Quote states are inconsistent: `Quote returned no output for this amount`, `Loading...`, `Quote Unavailable`, and a GIP-151 warning `Price impact too high — pool depth insufficient for this size. Trade anyway.` [STATE017–019, STATE034–036].

---

### Task 5 — Redeem winning outcome tokens

1. Open a resolved market showing `Resolved: YES` and `WINNING OUTCOME: YES` [STATE024–036, STATE044–052].
2. Review the `Redeem Tokens` area [STATE024–035, STATE044–052].
3. Observe empty-state messages: `No redeemable tokens found` and `You don't have any YES outcome tokens to redeem.` [STATE024–035, STATE044–052].
4. Click `Redeem Tokens` where redeemable; no successful redemption is captured [STATE024–035; controls inventory].

**Needs — Wallet:** Connected wallet observed. **Funds:** Winning YES/NO outcome tokens are implied by the redeem copy; captured wallets show none [STATE024–035, STATE044–052]. **Role:** Holder of winning outcome tokens.

**Uncertainty:** No redemption transaction is captured; no `Redeem Tokens` success or error beyond “no redeemable tokens” is shown.

---

### Task 6 — Add liquidity to futarchy pools

1. From the landing page, `Liquidity` links to `/flm/gnosis` and `/flm/kleros` are present; resulting screens are not captured [STATE001–009; controls inventory].
2. From a market page, click `Add Liquidity` [STATE013, STATE028, STATE052].
3. Read the copy: “Add liquidity to earn fees from trades. Click on any pool to open Swapr and add liquidity.” [STATE013, STATE028].
4. Choose a pool category and pool label:
   - Conditional Pools: `YES GNO / YES sDAI`, `NO GNO / NO sDAI`; for PNK markets: `YES PNK / YES sDAI`, `NO PNK / NO sDAI` [STATE013, STATE028].
   - Prediction Pools: `YES sDAI / sDAI`, `NO sDAI / sDAI` [STATE013, STATE028].
   - Company Token Pools: `YES GNO / sDAI`, `NO GNO / sDAI`; for PNK markets: `YES PNK / sDAI`, `NO PNK / sDAI` [STATE013, STATE028].
5. Click a pool to open Swapr and add liquidity; no actual pool click is captured [STATE013, STATE028].

**Needs — Wallet:** Connected wallet presumed for Swapr interaction; not directly captured. **Funds:** Pool tokens on Swapr; exact amounts unpictured. **Role:** Liquidity provider.

**Uncertainty:** The handoff to Swapr is stated in copy but no Swapr screen or transaction is captured [STATE013, STATE028].

---

### Task 7 — Split or merge collateral

1. On a market page, click `Split Collateral` or `Merge Collateral` [STATE020–023, STATE030–033, STATE040–043, STATE051–052].
2. Select a collateral tab: `sDAI`, `GNO` for GIP markets, or `PNK` for KIP-90 [STATE020–023, STATE030–033, STATE040–043, STATE051–052].
3. Enter an amount or press `Max`; review fields `sDAI Available`, `BUY sDAI`, `xDAI Balance`, and `Max Approval` [STATE020–023, STATE030–033, STATE040–043, STATE051–052].
4. Review `Max Approval` copy: “Will request exact allowance for this transaction.” [STATE020, STATE022, STATE030, STATE032, STATE052].
5. Click `Split Collateral` or `Merge Collateral`; no successful split/merge transaction is captured [STATE020–023, STATE030–033, STATE040–043, STATE051–052].

**Needs — Wallet:** Connected wallet is shown as `Connected Wallet 0x0000...dEaD` [STATE020–023, STATE030–033, STATE052]. **Funds:** `sDAI` available balance is shown; `xDAI Balance` is shown as `0 xDAI` in one split capture and `24.689107 xDAI` in later captures [STATE020–023, STATE030–033]. **Role:** Collateral manager, trader, or outcome-token holder.

**Uncertainty:** `Add Collateral` appears alongside split/merge, but no separate interaction state is captured [STATE020, STATE022, STATE030, STATE032].

---

### Task 8 — Create a market

1. From the landing dashboard, click `Create market` [STATE001–009; controls inventory].
2. Complete the market-creation form; **no resulting screen or form fields are captured** [STATE001–009; controls inventory].

**Needs — Wallet:** Unverified. **Funds:** Unverified. **Role:** Market creator/operator inferred from the label, but permissions and requirements are not established.

**Uncertainty:** This