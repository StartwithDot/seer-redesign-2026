# screens (futarchy; DeepSeek draft: Claude verifies against screenshots)

# Futarchy — Screen-by-Screen Audit

**Citation convention:** I preserve the source `STATE` labels, including inconsistent spacing/zero-padding (e.g. `STATE001` vs `STATE 020`). All observations below are limited to the crawl notes, controls inventory, chart metadata, and data model provided. Uncertainty is called out in the final section.

---

## 1. Global shell and recurring regions

Seen across landing and market pages: `STATE001–STATE009`, `STATE010–STATE019`, `STATE 020–STATE035`, `STATE036–STATE049`, `STATE051`, `STATE052`.

### Header
- Brand/link: `Futarchy` → `/` (`STATE001–STATE008`; market states also show `Futarchy`).
- `Refresh RPC Connection` button (`STATE001d–STATE008d`).
- Theme control: `Switch to dark mode` / `Switch to light mode` (`STATE001–STATE013`, `STATE025–STATE027`, `STATE035`, `STATE045`).
- `Chain Selector` button; header chain indicator shows `Gnosis` on landing (`STATE001–STATE009`). Market pages show `Gnosis` (`STATE052`).
- Wallet button `👾 0x00…dEaD` (`STATE001–STATE019`, `STATE036–STATE052`; wallet variants cited below).
- `Close` button appears on overlays (`STATE003`, `STATE004`, `STATE007`, `STATE008`, `STATE011`, `STATE012`, `STATE026`, `STATE027`).

### Footer
- Tagline: “Futarchy — Market-based evaluation of governance decisions and milestones” (`STATE001–STATE019`; also `STATE036–STATE049`, `STATE051`; `STATE052` shows “Market-based evaluation of governance decisions and milestones”).
- `Social` links: X `https://x.com/seer_pm` and GitHub `https://github.com/seer-pm/futarchy` (`STATE001d–STATE008d`).

### Charts / graphics
- Landing pages report `charts=0`; no charts visible (`STATE001–STATE009`).
- Market pages report `charts=2`, but captures show blank canvases with no readable axes, series labels, or tooltip values. Canvas sizes: GIP-152 `760x420` at `y=420` (`STATE010–STATE023`); KIP-90 `754x420` at `y=458` (`STATE024–STATE033`, with `STATE029` at `y=659`); GIP-151 `760x420` at `y=438` (`STATE034–STATE043`). Hovering produced no readable chart tooltip/data (`STATE016`, `STATE018`, `STATE052`).
- Visible graphics: `👾` identicon, resolved checkmarks, `ⓘ` info icons next to Volume/TVL (`STATE001–STATE052`).
- `Charting by TradingView` link present on market pages (`STATE010–STATE017`).

---

## 2. Route `/` — Dashboard / landing

Purpose: aggregate active milestones, recently closed markets, and organizations; entry point to markets and liquidity management.

Layout regions:
- **Header** as above.
- **Active Milestones** region.
- **Recently Closed** list of market cards.
- **Organizations** table.
- `Create market` control.
- Footer.

### Data shown
- Active milestone chain label `ETH` (`STATE002–STATE009`).
- Active milestone question: “What will the impact on ETH price be if EIP-8363 is Scheduled for Inclusion in Hegotá?” (`STATE002–STATE009`).
- Countdown format: `Open until: 6d 6h 43m`; also `6d 6h 42m`, `6d 6h 41m` (`STATE002`, `STATE005`, `STATE006`, `STATE008`).
- Active milestone prices: `YES Price 2401.44 USDS`; `NO Price 2401.44 USDS`; 2-decimal USDS (`STATE002–STATE009`).
- Active milestone impact: `-0.00%` (`STATE002–STATE009`).
- `STATE001` has an empty Active Milestones area, while Organizations already shows `Ethereum` with `ACTIVE MARKET` and `ACTIVE 1`.
- Recently Closed cards show chain `Gnosis`, question, status/outcome, and signed 2-decimal impact:
  - GIP-152: `Awaiting Resolution`, `Status Awaiting`, `Impact +0.00%` (`STATE001–STATE009`).
  - KIP-90: `✓ Resolved`, `Outcome YES`, `+0.68%` (`STATE001–STATE009`).
  - GIP-151: `✓ Resolved`, `YES`, `+0.00%` (`STATE001–STATE009`).
  - KIP-88: `✓ Resolved`, `YES`, `+0.91%` (`STATE001–STATE009`).
  - KIP-86: `✓ Resolved`, `YES`, `+0.94%` (`STATE001–STATE009`).
  - GIP-149: `✓ Resolved`, `NO`, `-2.36%` (`STATE001–STATE009`).
  - GIP-145: `✓ Resolved`, `YES`, `+1.96%` (`STATE001–STATE009`).
  - KIP-81: `✓ Resolved`, `NO`, `+99.98%` (`STATE001–STATE009`).
  - GIP-153: `✓ Resolved`, `YES`, `+3.37%` (`STATE001–STATE009`).
- Organizations table columns: `NAME`, `ACTIVE`, `PROPOSALS ↓`, `CHAIN`, `LIQUIDITY` (`STATE001–STATE009`).
- Organizations rows (`STATE001`, `STATE006`):
  - `Gnosis DAO` — ACTIVE `0`, PROPOSALS `6`, CHAIN `Gnosis`, LIQUIDITY `Liquidity`.
  - `Kleros DAO` — ACTIVE `0`, PROPOSALS `4`, CHAIN `Gnosis`, LIQUIDITY `Liquidity`.
  - `Ethereum` + badge `ACTIVE MARKET` — ACTIVE `1`, PROPOSALS `1`, CHAIN `Gnosis`, LIQUIDITY `-`.
  - `VeloraDAO` — ACTIVE `0`, PROPOSALS `0`, CHAIN `ETH`, LIQUIDITY `-`.
  - `Aave DAO` — ACTIVE `0`, PROPOSALS `0`, CHAIN `ETH`, LIQUIDITY `-`.
- Count: `5 organizations`; after search `4 organizations` (`STATE001`, `STATE005`).
- Search input label: `Filter by name...` (`STATE001d–STATE008d`).
- Typing `e` into search reduces Organizations from `5 organizations` to `4 organizations`, removing `Gnosis DAO` but leaving `Kleros DAO`, `Ethereum`, `VeloraDAO`, `Aave DAO` (`STATE005`, `STATE009`).

### State-by-state — landing
| State | Screen/state purpose | Layout/data shown | Controls/overlays |
|---|---|---|---|
| `STATE001` | Dashboard baseline | Empty Active Milestones area; Recently Closed cards as above; Organizations table 5 rows including `Ethereum ACTIVE MARKET`; `5 organizations`. | Header controls; `Create market` → `/markets/new`; Liquidity links; search input; footer Social links. |
| `STATE002` | Dashboard after theme click / active ETH milestone visible | Active ETH milestone appears with question, countdown, `YES/NO 2401.44 USDS`, `-0.00%`; controls count changes `21 → 22`; no text-level dark-mode visual difference captured. | `Switch to dark mode` clicked; later `Switch to light mode` available. |
| `STATE003` | Dashboard + network selector | `Switch Networks` menu lists `Ethereum`, `Gnosis`, and `Connected`. | `Chain Selector`; `Close`. Inventory marks `Gnosis Connected` disabled. |
| `STATE004` | Dashboard + wallet popover | Wallet popover: `👾`, `0x00…dEaD`, `24.68 XDAI`; `Futarchy transactions will appear here...`. | `Copy Address`; `Disconnect`; `View more on explorer` → `https://gnosisscan.io/address/0x0000000000000000000000000000`; `Close`. |
| `STATE005` | Dashboard + search filtered | Search text `e`; `4 organizations`; Gnosis DAO removed; Kleros DAO, Ethereum, VeloraDAO, Aave DAO remain. Countdown values include `6d 6h 42m`/`43m` per grouped notes. | Search input; no result screen captured for row actions. |
| `STATE006` | Dashboard baseline variant | Organizations rows shown (`STATE001`, `STATE006`); countdown includes `6d 6h 41m`; same card data. | Header controls; no unique overlay noted. |
| `STATE007` | Dashboard + network selector | `Switch Networks` menu with `Ethereum`, `Gnosis`, `Connected`. | `Chain Selector`; `Close`. |
| `STATE008` | Dashboard + wallet popover | Wallet popover with `24.68 XDAI`, placeholder transactions. | `Copy Address`, `Disconnect`, `View more on explorer`, `Close`. |
| `STATE009` | Dashboard + search filtered | Search `e`; `4 organizations`; Gnosis DAO absent. | Search input. |

### Landing controls / uncaptured routes
- `Create market` → `/markets/new`; no resulting screen captured (`STATE001–STATE009`).
- `Liquidity` links on `Gnosis DAO` and `Kleros DAO` rows → `/flm/gnosis`, `/flm/kleros`; no resulting screen captured (`STATE001–STATE009`).
- Active ETH milestone link → `/markets/0x0d78b95fca9f3e1b588271a330b0d6f731ec38aa` (`STATE002–STATE009`); no dedicated market capture in notes.
- Recently Closed market links: GIP-152 `/markets/0xee8878d0a7136c5cd109554f06bb780e225badef`; KIP-90 `/markets/0x84412fe9d088c1d8dd676a7be9a3d5d0291ab1cf`; GIP-151 `/markets/0xece80208cb8376be311ce0f5ea4ef73850a0dcf0`; KIP-88 `/markets/0x0cae5e6f520e52e3d6a93c856bb6dbf7781f2e31`; KIP-86 `/markets/0xb607bd7c7201e966e6a150cd6ef1d08db55cad5d`; GIP-149 `/markets/0x47c80f5f701ebc5f25cab64e660f0577890729c2`; GIP-145 `/markets/0x45e1064348fD8A407D6D1F59Fc64B05F633b28FC`; KIP-81 `/markets/0x2C1e08674f3F78f8a1426a41C41B8BF546fA481a`; GIP-153 `/markets/0x4120de9931fd29c8a6effea4df57a7c8760c1677` (`STATE001–STATE009`).

---

## 3. Route `/markets/0xee8878d0a7136c5cd109554f06bb780e225badef` — GIP-152 / GNO market

Purpose: market detail, resolution context, trading, activity/position, collateral, and liquidity entry.

Layout regions:
- Header + wallet/chain/theme controls.
- Hero/market question: “What will the impact on GNO price be if GIP-152 is passed?” (`STATE010–STATE023`).
- Summary/metrics strip: `Impact (spot)`, `Status`, `Volume (Total; sDAI)`, `TVL`, date/ended, `Final Result`.
- Resolution panel with text and links.
- Chart region (`charts=2`, blank in text capture).
- Activity panel: `Recent Activity`, `My Trades`, `Position`; trade-count filter.
- Trading panel: outcome toggle, Buy/Sell, amount, max, quote/receive, balances, collateral controls.
- Add Liquidity panel.
- Footer.

### Data shown
- `Impact (spot)` `0.00%` (`STATE010–STATE013`, `STATE016–STATE019`; also `STATE020–STATE023` per Chunk 2).
- `Status` `Awaiting` in summary strip; trading panel says `Awaiting Resolution` (`STATE010–STATE023`).
- `Volume (Total; sDAI)` `0` with `ⓘ` (`STATE010–STATE013`, `STATE016–STATE023`).
- `TVL` `0` with `ⓘ` (`STATE010–STATE013`, `STATE016–STATE023`).
- Date `8/12/2026` followed by `Ended` (`STATE010–STATE013`, `STATE016–STATE023`).
- `Final Result APPROVED` while status remains `Awaiting Resolution` (`STATE010–STATE013`, `STATE016–STATE023`).
- Trading pair `GNO/sDAI`; Yes Price `84.77 sDAI`; No Price `84.77 sDAI` (`STATE010–STATE023`).
- Resolution copy: “Will GIP-152 (spin out the Gnosis App into an independent company) be passed by GnosisDAO? Resolves Yes if GIP-152 is passed by GnosisDAO; otherwise resolves No.” plus Snapshot URL (`STATE010–STATE013`, `STATE016–STATE023`).
- Links: `Resolve Question` → Reality.eth URL; `Snapshot Vote` / `View final results on Snapshot`; `Charting by TradingView`.
- Activity tabs: `Recent Activity`, `My Trades`, `Position`; filter select `Last 30 trades`, `Last 60 trades`, `Last 90 trades` (`STATE010–STATE023`).
- Empty activity: `No trades found for this proposal` (`STATE010–STATE013`, `STATE017–STATE023`).
- Empty position: `No active positions` (`STATE015`, `STATE016`).
- Trade form: `If Yes` / `If No`; `Buy` / `Sell`; `Amount (sDAI)`; `Max`; `Available -`; `Recover`; `Outcomes`; `More info` on resolved markets (`STATE010–STATE035` as applicable).
- Outcome/receive:
  - `If Yes` → `Quote returned no output for this amount` (`STATE010–STATE013`, `STATE018`, `STATE020–STATE023`).
  - `If No` → `1.00 sDAI` (`STATE010–STATE013`, `STATE016`, `STATE020–STATE023`).
  - After `If No` click: `If No` shows `Loading...`; `Receive If Yes 1.00 sDAI (estimate)` (`STATE017`).
  - After `Max`: `If Yes 0.00 GNO`; `Receive If No 0.00 sDAI`; `Recover Quote Unavailable` (`STATE019`).
- Balances: `sDAI 0 sDAI`; `mergeable YES 0 · NO 0`; `Wallet: 0 sDAI`; `GNO 0 GNO`; `mergeable YES 0 · NO 0`; `Wallet: 0.0004 GNO` (`STATE010–STATE023`).
- View guidance: `Your view on GIP-152`; `If YES` / `If NO`; `Bullish` → `BUY` / `SELL`; `Bearish` → `SELL` / `BUY` (`STATE010–STATE023`).
- Add Liquidity pool list (`STATE013`):
  - Conditional Pools: `YES GNO / YES sDAI`, `NO GNO / NO sDAI`.
  - Prediction Pools: `YES sDAI / sDAI`, `NO sDAI / sDAI`.
  - Company Token Pools: `YES GNO / sDAI`, `NO GNO / sDAI`.
- No TWAP block shown in GIP-152 captures (`STATE020–STATE023`).

### State-by-state — GIP-152
| State | Screen/state purpose | Layout/data shown | Controls/overlays |
|---|---|---|---|
| `STATE010` | GIP-152 market detail baseline | Question, `0.00%` impact, `Awaiting`, volume `0`, TVL `0`, `8/12/2026 Ended`, `Final Result APPROVED`, resolution copy, trading pair/prices, activity tabs, empty activity, trade form, balances. | `Resolve Question`, `Snapshot Vote`, `Add Liquidity`, `View final results on Snapshot`, `Charting by TradingView`, tabs, filter, `If Yes`/`If No`, `Buy`/`Sell`, amount, `Max`, `Insufficient balance` disabled, wallet links, `Split Collateral`, `Merge Collateral`. |
| `STATE011` | GIP-152 + network selector | Same market page; `Switch Networks` overlay lists `Ethereum`, `Gnosis`, `Connected`. | `Chain Selector`; `Close`. |
| `STATE012` | GIP-152 + wallet popover | Wallet popover: `👾 0x00…dEaD`, `24.68 XDAI`, empty transaction placeholder. | `Copy Address`, `Disconnect`, `View more on explorer`, `Close`. |
| `STATE013` | GIP-152 + Add Liquidity panel | Copy: “Add liquidity to earn fees from trades. Click on any pool to open Swapr and add liquidity.” GNO pool categories/pairs as listed above. | Pool links open Swapr; no pool click captured. |
| `STATE014` | `Recent Activity` tab clicked | Activity/trading-focused view; question and trading panel shown; top market summary/description absent in capture. | Tabs, trade filter, trade controls. |
| `STATE015` | `Position` tab clicked | `No active positions`; top summary/description absent in capture. | Position tab. |
| `STATE016` | Position/outcome variant | `No active positions`; `If No` → `1.00 sDAI`; chart hover produced no readable tooltip/data. | Tabs, `If No`/`If Yes`, trade controls. |
| `STATE017` | `If No` click / activity variant | `If No` shows `Loading...`; `Receive If Yes 1.00 sDAI (estimate)`; empty activity `No trades found for this proposal`. | Outcome toggle; tabs/filter. |
| `STATE018` | Quote-error variant | `Quote returned no output for this amount`; `Recover`/`Insufficient balance`; chart hover no readable tooltip/data. | Trade controls; no action captured beyond hover/click noted. |
| `STATE019` | `Max` clicked | `If Yes 0.00 GNO`; `Receive If No 0.00 sDAI`; `Recover Quote Unavailable`; empty activity. | `Max`; `Quote Unavailable` disabled button; amount input `0.0` present. |
| `STATE020` | GIP-152 + `Split Collateral` panel | Tabs `sDAI`/`GNO`; `Connected Wallet 0x0000...dEaD`; `Max`; `sDAI Available 0 sDAI`; `BUY sDAI`; `xDAI Balance 0 xDAI`; `Max Approval`; action `Split Collateral`; `Add Collateral` options. | `Max Approval` copy: “Will request exact allowance for this transaction.” Collateral info copy. |
| `STATE021` | GIP-152 market/summary hover; collateral context | Volume/TVL/date/final result fields; summary hover shows `Status Awaiting`; notes place later GIP-152 collateral panels with `xDAI Balance 24.689107 xDAI` in `STATE021–STATE023`. | Split/Merge/Add Collateral context; no exact trigger fully described. |
| `STATE022` | GIP-152 + `Merge Collateral` panel | Tabs `sDAI`/`GNO`; common collateral fields; action `Merge Collateral`; `Add Collateral` options. | `Max`, `Max Approval`, `BUY sDAI`. |
| `STATE023` | GIP-152 summary hover variant | Volume/TVL/date/final result fields; hover summary `Status Awaiting`; later collateral panel context includes `24.689107 xDAI` per grouped notes. | Collateral controls; exact overlay state uncertain. |

---

## 4. Route `/markets/0x84412fe9d088c1d8dd676a7be9a3d5d0291ab1cf` — KIP-90 / PNK market

Purpose: resolved PNK market detail with TWAP recommendation, trading preview, redeem state, activity, collateral, and liquidity entry.

Layout regions: same market-detail shell: header, question hero, metrics strip, resolution panel, TWAP panel, chart, activity, trading panel, collateral controls, footer.

### Data shown (`STATE 024–STATE033`)
- Question: “What will the impact on PNK price be if KIP-90 is approved?”
- Trading pair: `PNK/sDAI`.
- Yes Price `0.0067 sDAI`; No Price `0.0068 sDAI`.
- `Impact (spot)` `—`.
- Status `Resolved`; `Resolved: YES`; `Resolution Question`; `Final Result APPROVED`.
- Volume `3.95K` labeled `Volume (Total; sDAI)` with `ⓘ`.
- TVL `121.46K` with `ⓘ`.
- Date `7/20/2026` labeled `Resolution Date`.
- Resolution copy: “Cooperative Spending Disclosure”; approved “For” or rejected “Against” by Kleros Governance; if not approved by end of Snapshot vote, resolves “Against”; Snapshot URL displayed.
- TWAP: `TWAP Complete (TWAP impact -0.98%)`; `FINAL TWAP WINDOW`; `UPDATED` times in 12-hour format; `YES TWAP 0.006730`; `NO TWAP 0.006796`; “NO outcome is ahead on TWAP.”
- TWAP explanation: recommendation based on TWAP of the “pass” (yes) outcome over a 24-hour period; positive difference = approve, otherwise reject.
- Trading panel: `If Yes` → `151.47 PNK`; `Receive If No` → `1.00 sDAI`; `Recover`; `Insufficient balance`.
- Balances: `sDAI 0 sDAI`; `mergeable YES 0 · NO 0`; `Wallet: 0 sDAI`; `PNK 0 PNK`; `mergeable YES 0 · NO 0`; `Wallet: 0 PNK`.
- Redeem state: `Resolved: YES`; `Redeem Tokens`; `WINNING OUTCOME: YES`; `No redeemable tokens found`; “You don't have any YES outcome tokens to redeem.”
- Activity tabs/filter and empty message `No trades found for this proposal`.
- View matrix: `Your view on KIP-90`; Bullish/Bearish mapped to BUY/SELL for YES/NO.

### State-by-state — KIP-90
| State | Screen/state purpose | Layout/data shown | Controls/overlays |
|---|---|---|---|
| `STATE 024` | KIP-90 market detail baseline | Full KIP-90 fields: PNK/sDAI, `0.0067/0.0068 sDAI`, `Resolved`, `3.95K` volume, `121.46K` TVL, `7/20/2026` resolution date, TWAP `-0.98%` / NO ahead, resolution copy, redeem copy, trading preview, balances. | Tabs/filter; `If Yes`/`If No`; `Buy`/`Sell`; `Amount (sDAI)`; `Max`; `Available -`; `Outcomes`; `More info`; `Recover`; `Insufficient balance`; `Split Collateral`; `Merge Collateral`; `Add Liquidity`. |
| `STATE 025` | Theme toggle variant | Same KIP-90 page; theme control present. | `Switch to light mode` / theme toggle. |
| `STATE 026` | KIP-90 + `Switch Networks` | Network overlay lists `Ethereum`, `Gnosis`, `Connected`. | `Chain Selector`; `Close`. |
| `STATE 027` | KIP-90 + account menu | Wallet popover with identicon, truncated address, `24.68 XDAI`, transaction placeholder. | `Copy Address`, `Disconnect`, `View more on explorer`, `Close`. |
| `STATE 028` | KIP-90 + Add Liquidity panel | Copy: “Add liquidity to earn fees from trades. Click on any pool to open Swapr and add liquidity.” PNK pools: Conditional `YES PNK / YES sDAI`, `NO PNK / NO sDAI`; Prediction `YES sDAI / sDAI`, `NO sDAI / sDAI`; Company `YES PNK / sDAI`, `NO PNK / sDAI`. | Pool links open Swapr; no pool click captured. |
| `STATE 029` | KIP-90 market variant | KIP-90 fields shown; chart canvas at `y=659`; no unique overlay named in notes. | Market controls as above. |
| `STATE 030` | KIP-90 + `Split Collateral` panel | Tabs `sDAI`/`PNK`; `Connected Wallet 0x0000...dEaD`; `Max`; `sDAI Available 0 sDAI`; `BUY sDAI`; `xDAI Balance 24.689107 xDAI`; `Max Approval`; action `Split Collateral`; `Add Collateral` sDAI/PNK. | `Max Approval` copy; collateral info copy. |
| `STATE 031` | KIP-90 market variant | KIP-90 volume/TVL/date/resolution fields; no unique overlay named. | Market controls. |
| `STATE 032` | KIP-90 + `Merge Collateral` panel | Tabs `sDAI`/`PNK`; common collateral fields; action `Merge Collateral`; `Add Collateral` sDAI/PNK. | `Max`, `Max Approval`, `BUY sDAI`; `xDAI Balance 24.689107 xDAI` per grouped notes. |
| `STATE 033` | KIP-90 market variant | KIP-90 fields; no unique overlay named. | Market controls. |

---

## 5. Route `/markets/0xece80208cb8376be311ce0f5ea4ef73850a0dcf0` — GIP-151 / GNO market

Purpose: resolved GNO market detail with TWAP recommendation, trading/redeem UI, collateral split/merge, and Add Liquidity.

### Data shown (`STATE034–STATE043`)
- Question: “What will the impact on GNO price be if GIP-151 is passed?”
- Trading pair `GNO/sDAI`; Yes Price `84.20 sDAI`; No Price `84.20 sDAI`.
- `Impact (spot)` `—`; Status `Resolved`.
- Volume `89.13K` labeled `Volume (Total; sDAI)` with `ⓘ`; TVL `101.20K` with `ⓘ`.
- Date `7/3/2026` labeled `Resolution Date`.
- `Resolution Question` `Resolved: YES`; `Final Result APPROVED`.
- Resolution copy: “Will GIP-151 (one-time pro-rata treasury redemption) be passed by GnosisDAO? Resolves Yes if GIP-151 is passed by GnosisDAO; otherwise resolves No.” Snapshot URL displayed.
- TWAP: `TWAP Complete (TWAP impact +0.01%)`; `FINAL TWAP WINDOW`; `UPDATED` timestamps; `YES TWAP 84.4795`; `NO TWAP 84.4721`; “YES outcome is ahead on TWAP.” `STATE036` shows YES `84.4796→84.4795`, NO `84.4721→84.4720`.
- TWAP explanation: TWAP over 24-hour observation window ending one day before Snapshot vote ends; `> +1%` approve, `< -1%` reject, otherwise neutral.
- Redeem: `Resolved: YES`; `Redeem Tokens`; `WINNING OUTCOME: YES`; `No redeemable tokens found`; “You don't have any YES outcome tokens to redeem.”
- Trade preview: `If Yes` `0.00000111 GNO`; `If No` `1.00 sDAI`; `Price impact 1082765.91%`; warning “Price impact too high — pool depth insufficient for this size. Trade anyway.”; `Insufficient balance`.
- Balances: `sDAI 0 sDAI`; `mergeable YES 0 · NO 0`; `Wallet: 0 sDAI`; `GNO 0 GNO`; `mergeable YES 0 · NO 0`; `Wallet: 0.0004 GNO`.
- View matrix: `Your view on GIP-151`; `If YES`: Bullish `BUY`, Bearish `SELL`; `If NO`: Bullish `SELL`, Bearish `BUY`.

### State-by-state — GIP-151
| State | Screen/state purpose | Layout/data shown | Controls/overlays |
|---|---|---|---|
| `STATE 034` | GIP-151 market detail baseline | GIP-151 fields: `84.20 sDAI` yes/no, `Resolved`, `89.13K` volume, `101.20K` TVL, `7/3/2026`, TWAP `+0.01%` / YES ahead, resolution copy, redeem copy, trade preview, balances. | Trading/redeem/collateral controls; `More info`; `Add Liquidity`. |
| `STATE 035` | GIP-151 + theme toggle | Same GIP-151 page; theme control present. | `Switch to light mode` / theme toggle. |
| `STATE036` | GIP-151 page + `Switch Networks` overlay per overlay list | GIP-151 fields; TWAP values; resolution copy; trade preview with high price-impact warning; redeem empty; view matrix; balances. Network overlay lists `Ethereum`, `Gnosis`, `Connected`. | `Chain Selector`; `Close`; trade/redeem controls. |
| `STATE037` | GIP-151 + account popover | Wallet popover with identicon, truncated address, `24.68 XDAI`, transaction placeholder. | `Copy Address`, `Disconnect`, `View more on explorer`, `Close`. |
| `STATE038` | GIP-151 + Add Liquidity modal | Add Liquidity modal captured; notes do not itemize the GIP-151 pool rows beyond the modal label. | Pool links (if any) not itemized; Swapr behavior from Add Liquidity copy. |
| `STATE039` | `TWAP Complete` click | TWAP panel visible with GIP-151 TWAP fields; no additional expanded content described in notes. | `TWAP Complete` control clicked. |
| `STATE040–STATE041` | GIP-151 + `Split Collateral` modal | GIP markets use `sDAI`/`GNO` collateral tabs; common fields: `Connected Wallet 0x0000...dEa