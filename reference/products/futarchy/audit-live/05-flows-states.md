# flows states (futarchy; DeepSeek draft: Claude verifies against screenshots)

# Futarchy — User Flows Audit

## Legend
- **[observed STATE n]** = directly evidenced in the named capture(s).
- **[inferred]** = navigation/action outcome inferred from a link, control presence, or page transition; successful result is not asserted unless separately observed.
- **[not observed]** = no captured state exists; flow cannot be completed from supplied evidence.

---

## 1. Landing dashboard load and dashboard sections

1. Open `/` → dashboard renders with brand “Futarchy,” chain selector showing `Gnosis`, wallet `👾 0x00…dEaD`, **Active Milestones**, **Recently Closed**, **Organizations**, and **Create market**. **[observed STATE001–009]**
2. Initial **Active Milestones** area is empty in STATE001, while Organizations already shows `Ethereum` with `ACTIVE MARKET` and `ACTIVE 1`. **[observed STATE001]**
3. After the dark-mode control sequence, the active ETH milestone card appears from STATE002 onward: question “What will the impact on ETH price be if EIP-8363 is Scheduled for Inclusion in Hegotá?”, `Open until: 6d 6h 43m` / `42m` / `41m`, YES `2401.44 USDS`, NO `2401.44 USDS`, impact `-0.00%`. **[observed STATE002–009]**
4. Cause of the STATE001 empty Active Milestones vs STATE002 onward populated active milestone is not established. **[inferred / uncertainty]**
5. **Recently Closed** shows GIP-152 as `Awaiting Resolution`, `Status Awaiting`, `Impact +0.00%`, plus resolved cards KIP-90, GIP-151, KIP-88, KIP-86, GIP-149, GIP-145, KIP-81, GIP-153 with outcome/impact labels. **[observed STATE001–009]**
6. Organizations table shows columns `NAME`, `ACTIVE`, `PROPOSALS ↓`, `CHAIN`, `LIQUIDITY`; count `5 organizations`; rows include Gnosis DAO, Kleros DAO, Ethereum, VeloraDAO, Aave DAO. **[observed STATE001, STATE006]**

---

## 2. Landing → search filter → filtered Organizations

1. Dashboard Organizations section loaded with `5 organizations`. **[observed STATE005, STATE009]**
2. Enter `e` into the search input; capture does not visibly label the control, but controls inventory identifies `Filter by name...`. **[observed STATE005, STATE009; label per controls inventory]**
3. Result: Organizations count changes `5 organizations` → `4 organizations`; Gnosis DAO row disappears; Kleros DAO, Ethereum, VeloraDAO, Aave DAO remain. **[observed STATE005, STATE009]**
4. Clearing search, other query terms, and filter logic are not captured; why `e` removes Gnosis DAO but leaves Kleros DAO is unexplained. **[inferred / uncertainty]**

---

## 3. Chain selector → Switch Networks overlay

1. From dashboard or market page, control **Chain Selector** is present. **[observed STATE003, STATE007, STATE011, STATE026, STATE036, STATE046]**
2. Activate **Chain Selector** → overlay “Switch Networks” opens. **[observed STATE003, STATE007, STATE011, STATE026, STATE036, STATE046]**
3. Overlay lists `Ethereum`, `Gnosis`, and `Connected`; controls inventory marks `Gnosis Connected` as `DISABLED`. **[observed STATE003, STATE007, STATE011, STATE026, STATE036, STATE046; disabled state per controls inventory]**
4. Selecting `Ethereum` or `Gnosis` and observing the resulting chain state is not captured. **[inferred / not observed]**
5. Mobile-specific chain selector behavior is not described; controls inventory contains m-suffixed chain-selector entries `059m`, `068m`, but no mobile screen narrative. **[not observed]**

---

## 4. Wallet popover / account menu

1. Page loaded with connected wallet button `👾 0x00…dEaD`. **[observed STATE004, STATE008, STATE012, STATE027, STATE037, STATE047]**
2. Click wallet button → wallet popover/account popover opens. **[observed STATE004, STATE008, STATE012, STATE027, STATE037, STATE047]**
3. Popover shows identicon `👾`, truncated address `0x00…dEaD`, balance `24.68 XDAI`, **Copy Address**, **Disconnect**, `Futarchy transactions will appear here...`, and `View more on explorer`. **[observed STATE004, STATE008, STATE012, STATE027, STATE037, STATE047]**
4. **Copy Address** result is not captured. **[inferred / not observed]**
5. **Disconnect** result is not captured; no disconnected-wallet screen is observed. **[inferred / not observed]**
6. `View more on explorer` points to Gnosis explorer address URL; external result is not captured. **[observed control; inferred external result]**
7. No explicit wallet-gated blocking screen is captured while connected. **[observed STATE004, STATE008, STATE012, STATE027, STATE037, STATE047]**
8. Connected-wallet truncation differs between top-right `0x00…dEaD` and collateral panels `0x0000...dEaD`; this is an observed display inconsistency. **[observed STATE020, STATE022, STATE030, STATE032, STATE052]**

---

## 5. Theme toggle

1. Dashboard initially shows **Switch to dark mode**. **[observed STATE001]**
2. Click **Switch to dark mode** → controls count changes from `21` to `22`; no text-level visual difference is captured; active ETH milestone appears from STATE002 onward. **[observed STATE002]**
3. Control label becomes **Switch to light mode** in subsequent captures. **[observed STATE002–006, STATE011–013, STATE025, STATE035, STATE045]**
4. Light-mode toggle captured as a screen/state. **[observed STATE045]**
5. Detailed visual/layout differences attributable to theme are not captured. **[inferred / uncertainty]**

---

## 6. Landing / card → market detail navigation

1. Landing cards are links: GIP-152 to `/markets/0xee8878d0a7136c5cd109554f06bb780e225badef`; KIP-90 to `/markets/0x84412fe9d088c1d8dd676a7be9a3d5d0291ab1cf`; GIP-151 to `/markets/0xece80208cb8376be311ce0f5ea4ef73850a0dcf0`; KIP-88 to `/markets/0x0cae5e6f520e52e3d6a93c856bb6dbf7781f2e31`. **[observed STATE001–009; hrefs per controls inventory]**
2. Click-through to GIP-152 market is not separately step-captured, but GIP-152 market page is observed. **[inferred click-through; observed STATE010–019, STATE020–023]**
3. Click-through to KIP-90 market is not separately step-captured, but KIP-90 market page is observed. **[inferred click-through; observed STATE024–033]**
4. Click-through to GIP-151 market is not separately step-captured, but GIP-151 market page is observed. **[inferred click-through; observed STATE034–035, STATE036–043]**
5. Click-through to KIP-88 market is not separately step-captured, but KIP-88 market page is observed. **[inferred click-through; observed STATE044–049, STATE051, STATE052]**
6. Active ETH milestone card links to `/markets/0x0d78b95fca9f3e1b588271a330b0d6f731ec38aa`; no resulting market-detail state is captured for that link. **[observed href; inferred / not observed]**

---

## 7. Market detail baseline / tabs

1. Open GIP-152 market page → header shows impact `0.00%`, status `Awaiting`, volume `0`, TVL `0`, date `8/12/2026` with `Ended`, final result `APPROVED`, prices `GNO/sDAI`, Yes `84.77 sDAI`, No `84.77 sDAI`. **[observed STATE010–013, STATE016–019]**
2. Activity area shows tabs **Recent Activity**, **My Trades**, **Position** and timeframe select **Last 30 trades / Last 60 trades / Last 90 trades**. **[observed STATE010–013, STATE016–019]**
3. Default activity/empty tables show `No trades found for this proposal`. **[observed STATE010–013, STATE017–019, STATE020–035]**
4. Click **Recent Activity** → view captured with question and trading panel, but top market summary/description is absent in that capture. **[observed STATE014]**
5. Click **Position** → `No active positions`. **[observed STATE015, STATE016]**
6. **My Trades** tab is present, but no separate post-click My Trades state is captured. **[observed control; inferred / not observed]**
7. Changing **Last 30 / 60 / 90 trades** filters is present; captured activity states still show `No trades found for this proposal`; filter-specific changes are not captured. **[observed controls and empty copy; inferred filter effect]**

---

## 8. Trade form → quote / loading / error / max flows

### 8.1 GIP-152 default quote and balance-gated state
1. Open market page → trade form shows `If Yes` / `If No`, `Buy` / `Sell`, `Amount (sDAI)`, `Max`, `Available -`. **[observed STATE010–019]**
2. Default `If Yes` area shows `Quote returned no output for this amount`. **[observed STATE010–013, STATE018]**
3. Default `If No` area shows `1.00 sDAI`. **[observed STATE010–013, STATE016]**
4. Recover control shows disabled `Insufficient balance`. **[observed STATE010–015, STATE017, STATE018]**
5. Balances show `sDAI 0 sDAI`; GNO `0 GNO`; wallet `0 sDAI`; wallet `0.0004 GNO`; mergeable YES/NO `0`. **[observed STATE010–019]**
6. Successful Buy/Sell trade is not captured. **[inferred / not observed]**

### 8.2 Click `If No` → loading
1. Click **If No**. **[observed STATE017]**
2. Outcome section changes to `If No` with `Loading...` and `Receive If Yes 1.00 sDAI (estimate)`. **[observed STATE017]**
3. Final settled quote is not clearly captured; another captured state shows `Quote returned no output for this amount`. **[observed STATE018; inferred / uncertainty]**

### 8.3 Click `Max` → zero quote / unavailable
1. Click **Max**. **[observed STATE019]**
2. Outcome display changes to `If Yes 0.00 GNO`; `Receive If No 0.00 sDAI`; Recover label `Quote Unavailable`; button disabled. **[observed STATE019]**
3. Amount input reads `0.0` per controls inventory for STATE019. **[observed per controls inventory; capture notes otherwise say no entered value visible in STATE010–019 — conflict noted]**
4. Successful recovery/quote after `Max` is not captured. **[inferred / not observed]**

### 8.4 Resolved market trade previews
1. KIP-90 resolved market → `If Yes` `151.47 PNK`; `Receive If No` `1.00 sDAI`; `Recover`; `Insufficient balance`. **[observed STATE024–033]**
2. GIP-151 resolved market → `If Yes` `0.00000111 GNO`; `Receive If No` `1.00 sDAI`; `Price impact 1082765.91%`; warning `Price impact too high — pool depth insufficient for this size. Trade anyway.`; `Insufficient balance`. **[observed STATE034–035, STATE036]**
3. KIP-88 resolved market → `If Yes` `138.17 PNK`; `If No` `1.00 sDAI`; `Price impact 9.78%`; `Insufficient balance.`. **[observed STATE052]**
4. “Trade anyway” warning is visible, but clicking it and observing a result is not captured. **[observed text; inferred / not observed]**

---

## 9. Market error and guard states

1. Quote error: `Quote returned no output for this amount`. **[observed STATE010–013, STATE018, STATE020–023]**
2. Quote unavailable after Max: `Quote Unavailable` disabled. **[observed STATE019]**
3. Insufficient balance guard: disabled `Insufficient balance`; wallet `0 sDAI`; available shown as `-`. **[observed STATE010–019, STATE020–035, STATE052]**
4. Price-impact guard: warning `Price impact too high — pool depth insufficient for this size. Trade anyway.`; observed price impact `1082765.91%` on GIP-151. **[observed STATE034–035, STATE036]**
5. Loading state: `Loading...` after `If No` click. **[observed STATE017]**
6. Empty activity error/empty state: `No trades found for this proposal`. **[observed STATE010–035, STATE052]**
7. Empty position state: `No active positions`. **[observed STATE015, STATE016]**
8. No successful trade, no successful quote recovery, and no successful redeem are captured. **[inferred / not observed]**

---

## 10. Split Collateral flow

1. Market page shows **Split Collateral** control. **[observed STATE020, STATE030, STATE040–041, STATE052]**
2. Click **Split Collateral** → split panel opens. **[observed STATE020, STATE030, STATE040–041]**
3. Panel shows collateral tabs `sDAI` / `GNO` for GIP markets or `sDAI` / `PNK` for KIP-90; connected wallet `0x0000...dEaD`; `Max`; `sDAI Available 0 sDAI`; `BUY sDAI`; `xDAI Balance`; `Max Approval`; action button `Split Collateral`; collateral explanation; `Add Collateral`. **[observed STATE020, STATE030, STATE040–041]**
4. `Max Approval` copy: `Will request exact allowance for this transaction.`. **[observed STATE020, STATE022, STATE030, STATE032, STATE052]**
5. Submit `Split Collateral` and resulting transaction/state are not captured. **[inferred / not observed]**
6. `xDAI Balance` is observed as `0 xDAI` in GIP-152 split STATE020, but `24.689107 xDAI` in later GIP-152 and KIP-90 collateral panels STATE021–023, STATE030–033. **[observed discrepancy]**
7. `Add Collateral` is present alongside Split/Merge but no separate interaction state is captured. **[observed control; inferred / not observed]**

---

## 11. Merge Collateral flow

1. Market page shows **Merge Collateral** control. **[observed STATE022, STATE032, STATE042–043, STATE051, STATE052]**
2. Click **Merge Collateral** → merge panel opens. **[observed STATE022, STATE032, STATE042–043, STATE051]**
3. Panel shows collateral tabs `sDAI` / `GNO` or `sDAI` / `PNK`; connected wallet; `Max`; `sDAI Available 0 sDAI`; `BUY sDAI`; `xDAI Balance`; `Max Approval`; action button `Merge Collateral`; collateral explanation. **[observed STATE022, STATE032, STATE042–043, STATE051, STATE052]**
4. Sidebar in KIP-88 STATE052 exposes `sDAI` / `PNK` choices, `Max`, `sDAI Available`, `BUY sDAI`, `Max Approval`. **[observed STATE052]**
5. Submit `Merge Collateral` and resulting transaction/state are not captured. **[inferred / not observed]**
6. “Merge Collateral” appears repeatedly in STATE052 as capture label, main control, and sidebar heading; exact triggering element is unclear. **[observed odd / uncertainty]**

---

## 12. Add Liquidity flow

1. Market page shows **Add Liquidity** control. **[observed STATE010–013, STATE028, STATE038, STATE048, STATE052]**
2. Click **Add Liquidity** → Add Liquidity panel/modal opens. **[observed STATE013, STATE028, STATE038, STATE048]**
3. Panel copy: `Add liquidity to earn fees from trades. Click on any pool to open Swapr and add liquidity.` **[observed STATE013, STATE028]**
4. GIP-152 GNO market panel lists Conditional Pools `YES GNO / YES sDAI`, `NO GNO / NO sDAI`; Prediction Pools `YES sDAI / sDAI`, `NO sDAI / sDAI`; Company Token Pools `YES GNO / sDAI`, `NO GNO / sDAI`. **[observed STATE013]**
5. KIP-90 PNK market panel lists Conditional Pools `YES PNK / YES sDAI`, `NO PNK / NO sDAI`; Prediction Pools `YES sDAI / sDAI`, `NO sDAI / sDAI`; Company Token Pools `YES PNK / sDAI`, `NO PNK / sDAI`. **[observed STATE028]**
6. Pool rows link to `https://v3.swapr.eth.limo/#/add/...`; clicking a pool is not captured. **[observed hrefs; inferred external flow / not observed]**
7. Resulting Swapr page / liquidity-add flow is not captured. **[inferred / not observed]**

---

## 13. TWAP Complete flow

1. Resolved markets show **TWAP Complete** panel/control: KIP-90, GIP-151, KIP-88. **[observed STATE024–033, STATE034–035, STATE036–049, STATE051, STATE052]**
2. Click **TWAP Complete** → captured overlay/screen for TWAP Complete click. **[observed STATE039, STATE049]**
3. TWAP details show `FINAL TWAP WINDOW UPDATED`, YES/NO TWAP values, and ahead message, e.g. KIP-90 `YES TWAP 0.006730`, `NO TWAP 0.006796`, `NO outcome is ahead on TWAP.`; GIP-151 `YES TWAP 84.4795`, `NO TWAP 84.4721`, `YES outcome is ahead on TWAP.`; KIP-88 `YES TWAP 0.008888`, `NO TWAP 0.008690`, `YES outcome is ahead on TWAP.`. **[observed STATE024–033, STATE034–035, STATE036–043, STATE044–049, STATE051, STATE052]**
4. GIP-152 awaiting-resolution market does not show a TWAP block. **[observed STATE020–023]**
5. No chart axes, series labels, or tooltip values beyond TWAP numbers are readable. **[observed STATE010–035, STATE052]**

---

## 14. Resolved market → Redeem Tokens → empty redeem state

1. Open resolved KIP-90 / GIP-151 / KIP-88 market. **[observed STATE024–035, STATE036–049, STATE051, STATE052]**
2. Status is `Resolved`; Resolution Question shows `Resolved: YES`; Final Result `APPROVED`. **[observed STATE024–035, STATE036, STATE044, STATE052]**
3. Redeem area shows `Resolved: YES`, `Redeem Tokens`, `WINNING OUTCOME: YES`, `No redeemable tokens found`, and `You don't have any YES outcome tokens to redeem.`. **[observed STATE024–033, STATE034–035, STATE036, STATE052]**
4. Clicking **Redeem Tokens** and observing a success state is not captured. **[observed control; inferred / not observed]**
5. Trade UI remains visible on resolved markets with `Insufficient balance` and quote previews, despite redeem empty state. **[observed STATE024–035, STATE036, STATE052]**

---

## 15. GIP-152 ended/awaiting/resolution-conflict flow

1. Open GIP-152 market. **[observed STATE010–013, STATE016–019, STATE020–023]**
2. Header shows `0.00%` Impact (spot), `Awaiting` Status, Volume `0`, TVL `0`, date `8/12/2026` followed by `Ended`, and `Final Result APPROVED`. **[observed STATE010–013, STATE016–019, STATE021, STATE023]**
3. Trading panel also shows `Awaiting Resolution`; `If Yes` shows `Quote returned no output for this amount`; `Receive If No` shows `1.00 sDAI`; `Recover` shows `Insufficient balance`. **[observed STATE010–013, STATE016–019, STATE020–023]**
4. `Resolve Question`, `Snapshot Vote`, and `View final results on Snapshot` links are present; click results/external states are not captured. **[observed controls; inferred external result / not observed]**
5. No TWAP block is shown. **[observed STATE020–023]**
6. Observed conflict: market says `Ended`, `Awaiting Resolution`, and `Final Result APPROVED` simultaneously; GIP-152 landing card says `Awaiting Resolution` / `Status Awaiting` / `Impact +0.00%`. **[observed STATE001–019, STATE020–023; conflict noted]**

---

## 16. Chart / TradingView flow

1. Market pages report `charts=2`; visible canvases are e.g. `760x420`, `754x420`, with no svg paths or text in chart capture. **[observed STATE010–035]**
2. No axes, series labels, or tooltip values are readable in captures. **[observed STATE010–035, STATE052]**
3. Hovering chart in **Position** and `If No` states produces no readable chart tooltip/data. **[observed STATE016, STATE018]**
4. `Charting by TradingView` external link is present; external result is not captured. **[observed control; inferred external result / not observed]**

---

## 17. Landing controls whose results were not observed

1. **Create market** link `/markets/new` present on landing. **[observed STATE001–009]**
2. Click/result screen for Create market is not captured. **[inferred / not observed]**
3. **Liquidity** links on Gnosis DAO and Kleros DAO rows point to `/flm/gnosis` and `/flm/kleros`; other rows show `-`. **[observed STATE001–009; hrefs per controls inventory]**
4. Resulting `/flm/gnosis` or `/flm/kleros` screens are not captured. **[inferred / not observed]**
5. **Refresh RPC Connection** control is present on landing. **[observed STATE001–008]**
6. Action/result of Refresh RPC Connection is not captured. **[inferred / not observed]**
7. Search clearing/other terms are not captured. **[inferred / not observed]**
8. Mobile versions of these controls are not described. **[not observed]**

---

## 18. External action controls not observed

- **Copy Address** present; clipboard result not captured. **[observed control; inferred / not observed]**
- **Disconnect** present; disconnected wallet state not captured. **[observed control; inferred / not observed]**
- **View more on explorer** present; external explorer result not captured. **[observed control; inferred / not observed]**
- **Snapshot Vote** present; external Snapshot result not captured. **[observed control; inferred / not observed]**
- **View final results on Snapshot** present; external result not captured. **[observed control; inferred / not observed]**
- **Resolve Question** present; external Reality.eth result not captured. **[observed control; inferred / not observed]**
- **Redeem Tokens** present; successful redeem not captured. **[observed control; inferred / not observed]**
- **Split Collateral** / **Merge Collateral** submit actions not captured. **[observed modals; inferred / not observed]**
- **Add Collateral** present; separate interaction not captured. **[observed control; inferred / not observed]**
- **Add Liquidity pool click** not captured; only hrefs/copy indicate Swapr. **[observed panel/hrefs; inferred / not observed]**
- **Buy / Sell** toggles present; separate action and success state not captured. **[observed controls; inferred / not observed]**
- **My Trades** tab present; separate state not captured. **[observed control; inferred / not observed]**
- **Last 60 / 90 trades** filter changes not separately captured. **[observed controls; inferred / not observed]**
- **Trade anyway** warning action not captured. **[observed text; inferred / not observed]**

---

## 19. Wallet-gated behavior

1. Captures show a connected wallet `👾 0x00…dEaD` with `24.68 XDAI` in the popover. **[observed STATE004, STATE008, STATE012, STATE027, STATE037, STATE047]**
2. No explicit wallet-required blocking screen, connect-wallet gate, or disconnected market page is captured. **[not observed]**
3. Market trade panel instead shows balance-gated errors: `sDAI 0 sDAI`, `Wallet: 0 sDAI`, disabled `Insufficient balance`, and quote errors. **[observed STATE010–019, STATE020–035, STATE052]**
4. Full disconnected-wallet flow and wallet-gated market/trade/redeem flows cannot be audited from supplied captures. **[inferred / not observed]**

---

## 20. Mobile-specific behavior

1. Detailed state metadata in the supplied charts inventory marks market states `STATE010–035` as `[desktop]`. **[observed chart inventory]**
2. Controls inventory contains m-suffixed markers `059m`, `060m`, `068m` for chain-selector/pool controls, but no mobile screen narrative, layout description, or mobile flow outcome is provided. **[observed inventory markers only]**
3. Therefore mobile dashboard, search, chain selector, wallet popover, market detail, trade form, loading/error states, tabs, Split/Merge, Add Liquidity, TWAP, redeem, and chart interactions cannot be audited. **[not observed]**
4. Any claim of mobile-specific behavior beyond the presence of m-suffixed inventory markers would be inference without evidence. **[inferred / uncertainty]**

---

## 21. Flows that could not be observed and why

| Flow | Why not observed |
|---|---|
| Create market → `/markets/new` result | Link present on landing; no resulting screen captured. **[observed STATE001–009; inferred / not observed]** |
| Organization Liquidity → `/flm/gnosis` or `/flm/kleros` | Links present for Gnosis DAO/Kleros DAO; no resulting screen captured. **[observed STATE001–009; inferred / not observed]** |
| Chain switch to Ethereum/Gnosis | Menu observed; selection and post-switch state not captured. **[observed STATE003, STATE007, STATE011, STATE026, STATE036, STATE046; inferred / not observed]** |
| Wallet disconnect / disconnected market state | Disconnect control observed; no disconnected state captured. **[observed STATE004, STATE008, STATE012, STATE027, STATE037, STATE047; inferred / not observed]** |
| Copy address result | Control observed; clipboard/result not captured. **[observed controls; inferred / not observed]** |
| Refresh RPC Connection | Control observed; action/result not captured. **[observed STATE001–008; inferred / not observed]** |
| Successful Buy/Sell trade | Buy/Sell controls present; no successful trade state captured. **[observed controls; inferred / not observed]** |
| Successful quote after `If No` loading | `Loading...` observed; final settled quote not clearly captured; conflicting quote-no-output state exists. **[observed STATE017, STATE018; uncertainty]** |
| Successful `Recover` | Recover label changes to `Insufficient balance` / `Quote Unavailable`; no recovery success captured. **[observed STATE010–019; inferred / not observed]** |
| Successful Split Collateral / Merge Collateral | Modals observed; submit results not captured. **[observed STATE020, STATE022, STATE030, STATE032, STATE040–043, STATE051, STATE052; inferred / not observed]** |
| Add Collateral | Control present; no interaction state captured. **[observed controls; inferred / not observed]** |
| Add Liquidity pool click → Swapr | Panel/copy/hrefs observed; actual pool click and Swapr result not captured. **[observed STATE013, STATE028, STATE038, STATE048, STATE052; inferred / not observed]** |
| Resolve Question / Snapshot Vote / final results external actions | Controls present; external result not captured. **[observed controls; inferred / not observed]** |
| Redeem Tokens success | Redeem control and empty redeem state observed; click/success not captured. **[observed STATE024–035, STATE036, STATE052; inferred / not observed]** |
| My Trades tab state | Tab present; no separate captured state. **[observed control; inferred / not observed]** |
| Last 60 / Last 90 trades filter-specific results | Controls present; all captured activity states show empty `No trades found`; filter effect not captured. **[observed controls; inferred / not observed]** |
| Trade anyway action | Warning text observed; click/result not captured. **[observed STATE034–035, STATE036; inferred / not observed]** |
| Chart tooltip/series exploration | Charts rendered but no axes, series labels, or readable tooltip data; hover produced no readable tooltip. **[observed STATE010–035, STATE016/018/052; not observed]** |
| Mobile-specific flows | No mobile screen narrative or layout capture; only m-suffixed control inventory markers. **[not observed]** |
| Wallet-required gate | No disconnected/blocking screen captured. **[not observed]** |

---

## 22. Explicit state uncertainties / contradictions

1. GIP-152 simultaneously shows `Ended`, `Awaiting Resolution`, and `Final Result APPROVED`. **[observed STATE010–013, STATE016–019, STATE020–023]**
2. STATE001 shows empty **Active Milestones** while Organizations already shows `Ethereum ACTIVE MARKET 1`; active ETH card appears from STATE002. **[observed STATE001–009]**
3. Wallet popover shows `24.68 XDAI`, but market balances show `0 sDAI` and `0.0004 GNO`; Split panel in STATE020 shows `0 xDAI`, later panels show `24.689107 xDAI`. **[observed STATE004/008/012, STATE020–023, STATE030–033, STATE052]**
4. `If No` click shows `Loading...` with an estimate, while another captured state shows `Quote returned no output for this amount`. **[observed STATE017, STATE018]**
5. `Max` produces zero amounts and `Quote Unavailable`; units switch between GNO and sDAI in outcome display. **[observed STATE019]**
6. Amount input metadata conflicts: notes say no entered value visible in STATE010–019; controls inventory lists input value `1` for several states and `0.0` for STATE019. **[observed notes vs inventory; uncertainty]**
7. Search typing `e` removes Gnosis DAO but keeps Kleros DAO; filter behavior is unexplained. **[observed STATE005, STATE009]**
8. `Available -` appears as a dash rather than a numeric limit. **[observed STATE010–019, STATE020–035, STATE052]**
9. Resolved KIP-88/KIP-90/GIP-151 markets still show trade UI and `Insufficient balance` while redeem says no redeemable tokens. **[observed STATE024–035, STATE036, STATE052]**
10. `Impact (spot)` shows `—` on resolved KIP-90/GIP-151/KIP-88 while other market data is present. **[observed STATE024–035, STATE036, STATE044, STATE052]**
11. TVL unit is missing on KIP-88 (`40.89` with no displayed unit). **[observed STATE044, STATE052]**
12. Chart canvases are present but no chart content is readable; chart type/series cannot be audited. **[observed STATE010–035, STATE052]**