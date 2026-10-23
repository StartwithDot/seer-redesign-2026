# data fields (opportunity; DeepSeek draft: Claude verifies against screenshots)

# Opportunity Field Audit — Seer live pilot

## Conventions and uncertainty

- STATE ids are cited as shown in the crawl notes/controls inventory. `STATE 072m`, `073m`, `077m`, `089m`, `090m` appear only in the controls inventory and are cited as such.
- `—` in the API column means no matching field is identifiable from the supplied data model.
- `[inferred]` marks any interpretation or formula that is not directly stated in the notes/data.
- Major unresolved discrepancies:
  - Active market UI says `235` outcomes and `SHOW ALL 235 OUTCOMES`, but the captured `get-market` response shows `outcomes: len=80`. Mapping/truncation is not resolvable from provided data.
  - Active UI title `Seer AI Job Board Name` does not equal captured `get-market.marketName` `What name will be adopted for the futarc` (truncated in data model). Likely display alias vs API market name, but not confirmed.
  - Rebrand UI title `Seer Rebrand Contest` does not equal captured `markets-search.marketName` `Which of the following submissions will ` (truncated).
  - Chart axes, plotted values, and hover tooltips are not legible in any capture. Chart metadata (`charts=3` active, `charts=2` rebrand, `tables=1`) is capture metadata, not a user-visible field.
  - Volume/liquidity are not directly exposed in the captured `get-market` JSON. They may be derived from subgraph/market-chart pool data, but that mapping is `[inferred]` and not confirmed.
  - No API endpoint for trade quote, balances, positions, or order simulation is present in the supplied data model.

---

## 1. Global chrome, wallet, and navigation

| Field / displayed value | Where shown (STATE ids) | Unit / format / rounding | API field if identifiable | Meaning / formula |
|---|---|---|---|---|
| `Seer` | STATE 001–008, 015–025, 026–035, 043–071 | string; home/brand link | — | Brand/home link. Controls inventory shows href `/` or `https://seer.pm`. |
| `BETA` | STATE 001–008, 015–025, 026–035, 043–071 | uppercase string badge | — | Beta-status badge. |
| `The pilot` | STATE 001–008, 015–032, 043–071 | string nav link; href `#pilot` or `/#pilot` | — | Anchor/nav to pilot section. |
| `The protocol` | STATE 001–008, 015–032, 043–071 | string nav link; href `#protocol` or `/#protocol` | — | Anchor/nav to protocol section. |
| `0x0000...dEaD` | STATE 001–004, 015–025, 026–035, 043–071 | truncated hex address; `0x` + 4 chars + `...` + 4 chars | — | Account/wallet button. Looks placeholder-like; role not fully captured. |
| `Connected` | STATE 030 | string | — | Wallet panel connected state. |
| `0x0000••••dEaD` | STATE 002, 004, 030 | truncated hex with bullet mask | — | Connected-wallet address display. |
| `0 XDAI` | STATE 004, 030, 031 | integer + `XDAI`; no decimals | — | Native xDAI balance `[inferred]`. Mismatches `BAL: 0.00 SDAI` elsewhere. |
| `Disconnect` | STATE 002, 004, 005, 027, 030, 031, 034, 035 | string button | — | Wallet disconnect control; effect not captured. |
| `Close` | STATE 002, 004, 005, 027, 030, 031, 034, 035 | string button | — | Dismiss wallet panel. |
| `Switch Networks` | STATE 002, 004, 005, 027, 030, 031, 034, 035 (controls inventory) | string button | — | Network-switch control; effect not captured. |
| `Opportunity Markets on Seer.` | STATE 015–025, 029 | string footer/closing line | — | Footer/closing copy. |

---

## 2. Home, pilot, protocol, and archive entry fields

| Field / displayed value | Where shown (STATE ids) | Unit / format / rounding | API field if identifiable | Meaning / formula |
|---|---|---|---|---|
| `ACTIVE` | STATE 001, 029 | uppercase status | `get-market.finalizeTs`, `payoutReported`, `hasAnswers` possible `[inferred]` | Active market status. Exact API derivation not confirmed. |
| `LIQUIDITY $2.38K` | STATE 001, 029 | USD-style compact; `$` + number + `K`; 2 decimals | —; possibly derived from subgraph/market-chart liquidity `[inferred]` | Aggregate market liquidity; detail page shows `$2,382`. `2.38K` ≈ `2,382/1000` rounded/truncated to 2 decimals `[inferred]`. |
| `Seer AI Job Board Name` | STATE 001, 003, 015–025, 029 | string title | `get-market.marketName` possible but mismatched `[inferred]` | Market display title/alias. Captured API `marketName` is different/truncated. |
| `SAI 6%` | STATE 001, 003, 015–025, 029 | outcome name + percent; integer percent here | `get-market.outcomes[]`, derived probability `[inferred]` | Top-ranked outcome probability. |
| `delegateyourjob.ai 5.9%` | STATE 001, 003, 015–025, 029 | outcome name + percent; 1 decimal | `get-market.outcomes[]`, derived probability `[inferred]` | Second-ranked outcome probability. |
| `Zetsu.AI 4.1%` | STATE 001, 003, 015–025, 029 | outcome name + percent; 1 decimal | `get-market.outcomes[]`, derived probability `[inferred]` | Third-ranked outcome probability. |
| `+232 MORE` | STATE 001, 029 | integer count | `get-market.outcomes[]` length possible; but API `len=80` conflicts | Additional outcomes beyond displayed top 3. `235 - 3 = 232` `[inferred]`. |
| `LEADING · SAI 6%` | STATE 001, 029 | string + percent | —; leading outcome derived from rank/probability `[inferred]` | Leading outcome and its probability. |
| `VIEW ARCHIVED MARKETS (2) →` | STATE 001, 029 | integer in parentheses; link | — | Archived-market count `2`. |
| `Name Seer's AI Job Board` | STATE 001, 002, 029, 030, 031, 032, 072m, 073m | string link; href active market URL | — | Marketing link to active market. |
| `Where this goes` | STATE 001, 002, 029, 030, 031, 032, 072m, 073m | string link; href `#pilot` | — | Anchor link to pilot explanation. |
| `Open opportunity: Seer AI Job Board Name` | STATE 001, 002, 029, 030, 031, 032, 072m, 073m | string link; href active market URL | — | Accessible/link text to open active market. |
| `LEADING · SAI 6% OPEN OPPORTUNITY →` | STATE 001, 002, 029, 030, 031, 032, 072m, 073m | string link | — | Combined leading-outcome + open-market control. |
| `OPEN OPPORTUNITY →` | STATE 001, 026, 029 | string link | — | Open market/opportunity control. Archive card shows it even with `CLOSED`. |

---

## 3. Active market header and aggregate fields

| Field / displayed value | Where shown (STATE ids) | Unit / format / rounding | API field if identifiable | Meaning / formula |
|---|---|---|---|---|
| `ACTIVE` | STATE 003–006, 015–025 | uppercase status | `get-market.finalizeTs`/`payoutReported`/`hasAnswers` possible `[inferred]` | Market status. |
| `Seer AI Job Board Name` | STATE 003–006, 015–025 | string title | `get-market.marketName` possible but mismatched `[inferred]` | Market display title/alias. |
| `0x8b3c...a5e8` | STATE 003–006, 015–025 | truncated hex contract; `0x` + 4 + `...` + 4 | `get-market.id`, contract href | Truncated contract address. Controls inventory full href: `0x8b3c7f3f09f6a85353926d8ee0f12decc1c9a5e8`. |
| `View on Seer ↗` | STATE 003–006, 015–025 | string external link | — | External contract/market link; href observed to `app.seer.pm/markets/100/...`. |
| `VOLUME $7,877` | STATE 003–006, 015–025 | USD-style; `$` + comma thousands; no decimals | —; not directly in captured `get-market` | Aggregate volume. Derivation not confirmed. |
| `LIQUIDITY $2,382` | STATE 003–006, 015–025 | USD-style; `$` + comma thousands; no decimals | —; possibly subgraph/market-chart pool liquidity `[inferred]` | Aggregate liquidity. Home shows `$2.38K`. |
| `SHOW ALL 235 OUTCOMES` | STATE 003–006, 015–025 | button; integer `235` | `get-market.outcomes[]` count possible, but captured `len=80` conflicts | Expands outcome list. UI claims 235; capture shows ranks 01–64 only. |
| `SHOW TOP OUTCOMES` | STATE 006, 077m | button | — | Collapses expanded list. |
| `Search outcomes` | STATE 003–025 | input placeholder | — | Filters outcomes. Typing `e` filtered names containing `e`; ranks became non-contiguous (`02,03,04,05,07,08,09,11,12,13,14,17,…`) in STATE 025. |
| `PRICE HISTORY` | STATE 003–006, 015–025 | chart section title | `market-chart` likely `[inferred]` | Price-history chart title. Axes/values not legible. |
| `Charting by TradingView` | STATE 003–025 | string external link | — | Chart attribution link. |
| `Scroll legend left` | STATE 003–025 | button; disabled in captures | — | Legend scroll control. |
| `Scroll legend right` | STATE 003–017 | button | — | Legend scroll control; no visible text change in STATE 017. |
| `BACK TO OPPORTUNITIES` / `← BACK TO OPPORTUNITIES` | STATE 003–006, 015–025 | string link; href `/` | — | Return to opportunity list. |

---

## 4. Active market outcome rows

Generic row format: zero-padded rank; outcome name; `POSITION: 0.00`; probability percent; USD-style price with 3 decimals. `POSITION` has no visible unit. Ranks are UI ordering, not necessarily API array order `[inferred]`.

| Field / displayed value | Where shown (STATE ids) | Unit / format / rounding | API field if identifiable | Meaning / formula |
|---|---|---|---|---|
| Outcome row generic format | STATE 003–006, 015–025 | rank `01`; name; `POSITION: 0.00`; percent; `$0.060`-style price | `get-market.outcomes[]` for names; probability/price formula unknown | Ranked outcome list. Percent appears approximately price × 100 in active rows `[inferred]`; not confirmed for rebrand. |
| `01 SAI` | STATE 003–006, 015–025 | `POSITION: 0.00`; `6%`; `$0.060` | `get-market.outcomes[]` | Rank 1 outcome. |
| `02 delegateyourjob.ai` | STATE 003–006, 015–025 | `POSITION: 0.00`; `5.9%`; `$0.059` | `get-market.outcomes[]` | Rank 2 outcome. |
| `03 Zetsu.AI` | STATE 003–006, 015–025 | `POSITION: 0.00`; `4.1%`; `$0.041` | `get-market.outcomes[]` | Rank 3 outcome. |
| `04 Wageware` | STATE 003–006, 015–025 | `POSITION: 0.00`; `3.6%`; `$0.036` | `get-market.outcomes[]` | Rank 4 outcome. |
| `05 Workmesh` | STATE 003–006, 015–025 | `POSITION: 0.00`; `3.5%`; `$0.035` | `get-market.outcomes[]` | Rank 5 outcome. |
| `06 CW` | STATE 003–006, 015–025 | `POSITION: 0.00`; `3.3%`; `$0.033` | `get-market.outcomes[]` | Rank 6 outcome. |
| `07 Foreguild` | STATE 003–006, 015–025 | `POSITION: 0.00`; `3.1%`; `$0.031` | `get-market.outcomes[]` | Rank 7 outcome. |
| `08 Synergent` | STATE 003–006, 015–025 | `POSITION: 0.00`; `3.1%`; `$0.031` | `get-market.outcomes[]` | Rank 8 outcome. Legend shows `Synergent 3.2%`; discrepancy. |
| `09 Auspex` | STATE 003–006, 015–025 | `POSITION: 0.00`; `3.1%`; `$0.031` | `get-market.outcomes[]` | Rank 9 outcome. |
| `10 WorkX` | STATE 003–006, 015–025 | `POSITION: 0.00`; `2.8%`; `$0.028` | `get-market.outcomes[]` | Rank 10 outcome. |
| `11 Agentarchy` | STATE 003–006, 015–025 | `POSITION: 0.00`; `2.5%`; `$0.025` | `get-market.outcomes[]` | Rank 11 outcome. |
| `12 AgenticGigs` | STATE 003–006, 015–025 | `POSITION: 0.00`; `2.3%`; `$0.023` | `get-market.outcomes[]` | Rank 12 outcome. |
| `13 Vantage` | STATE 003–006, 015–025 | `POSITION: 0.00`; `2.2%`; `$0.022` | `get-market.outcomes[]` | Rank 13 outcome. |
| `14 Seek` | STATE 003–006, 015–025 | `POSITION: 0.00`; `2.2%`; `$0.022` | `get-market.outcomes[]` | Rank 14 outcome. |
| `15 Agora` | STATE 003–006, 015–025 | `POSITION: 0.00`; `1.9%`; `$0.019` | `get-market.outcomes[]` | Rank 15 outcome. |
| Ranks `16–26` | Not shown in collapsed STATE 003; expanded STATE 006 shows 01–64 | — | — | Hidden until expansion in collapsed view; exact 16–26 values not captured. |
| `27 Symbiont` | STATE 003–006, 015–025 | `TRADING` tag; `POSITION: 0.00`; `0.9%`; `$0.009` | `get-market.outcomes[0]` is `Symbiont` in captured response | Rank 27 outcome; also default trade outcome. `TRADING` tag likely selected/tradeable indicator `[inferred]`. |
| `64 Taskora` | STATE 006 | `POSITION: 0.00`; `0.4%`; `$0.004` | `get-market.outcomes[]` | Last visible expanded outcome in capture. |
| Ranks `65–235` | Not captured in STATE 006 | — | — | UI claims 235; only 01–64 captured. No 65–235 values auditable. |

---

## 5. Active market trade panel, dropdowns, quote states, and discussion

| Field / displayed value | Where shown (STATE ids) | Unit / format / rounding | API field if identifiable | Meaning / formula |
|---|---|---|---|---|
| `BUY` | STATE 003–025 | tab/button | — | Buy-side tab. Selected state not clear. |
| `SELL` | STATE 003–025 | tab/button | — | Sell-side tab. Selected state not clear. |
| `OUTCOME SYMBIONT` | STATE 003–025 | dropdown/button; uppercase string | `get-market.outcomes[0]` = `Symbiont` | Trade outcome selector. Defaults to `SYMBIONT`; clicking other outcomes did not visibly change it in STATES 007–016. |
| `Search options` | STATE 019, 090m | input placeholder | — | Search inside outcome dropdown. |
| Outcome dropdown options | STATE 019, 090m | uppercase strings; captured list may be truncated | `get-market.outcomes[]` possible | Large outcome list. Captured options include: `SYMBIONT`, `AGENTARCHY`, `AGENTICJOBS`, `AGENTICGIGS`, `DELEGATEYOURJOB.AI`, `DELEGATOBS.AI`, `TASKPAYAI`, `WORKHERE AGENT`, `JOBHERE AGENT`, `VANTAGE`, `PIECEWORK`, `SYNERGET`, `QUEST-BOARD`, `FOREGUILD`, `BOUNTYMESH`, `SYNERGENT`, `TASKMESH`, `CO-EXIST`, `SWARMBOUNTY`, `TASKARCHY`, `AUSPEX`, `0XWORK`, `TASKASKAI`, `TASKORA`, `AGENTRA`, `WORKMESH`, `CRYPTOAGENTS`, `SEER KNOWS`, `BORGCORP`, `PREDFUPAY`, `HORIZANCE`, `WORKLUME`, `TASKWEAVE`, `TASK-GPT`, `AGENTLIER`, `GIGARCHY`, `SEERVANT`, `AIGENSEER`, `TASKORAMA`, `ZETSU.AI`, `PRAXIS`, `FORESEER`, `AGENTBOUNTY`, `TASKSEER`, `FUTASK`, `SEEK`, `LABORACLE`, `TASKNET`, `AETHERWORK`, `TASKIT`, `KORRA`, `MINTELLECT`, `AGENTVERSEER`, `HIVE`, `ERRAND`, `FLEET`, `DREXSEER`, `AGENTGEMINI`, `SEERAAI`, `SEERA`, `AGENTSEERX`, `AETHER`. |
| `PAY WITH SDAI` | STATE 003–025 | dropdown/button; uppercase asset | `get-market.collateralToken` / subgraph token symbol `sDAI` `[inferred]` | Payment asset selector. |
| PAY WITH options | STATE 020 | strings | — | `SDAI`, `XDAI`, `WXDAI`, `OPPORTUNITY_CREDITS`. Only `SDAI` visibly selected. |
| `AMOUNT` | STATE 003–025 | input label | — | Trade amount input label. |
| `0.00` | STATE 003–025 | input value; 2 decimals | — | Empty/default amount. |
| `BAL: 0.00 SDAI` | STATE 003–025 | balance; 2 decimals + `SDAI` | `get-market.collateralToken` possible; no balance endpoint captured | User SDAI balance. Mismatches `0 XDAI` in wallet menu. |
| `+1` | STATE 003–025 | quick-amount button; integer | — | Add 1 unit. |
| `+5` | STATE 003–025 | quick-amount button; integer | — | Add 5 units. |
| `+10` | STATE 003–025 | quick-amount button; integer | — | Add 10 units. |
| `+100` | STATE 003–025 | quick-amount button; integer | — | Add 100 units. |
| `YOU RECEIVE 0.0 Shares` | STATE 003–025 | output estimate; 1 decimal + `Shares` | —; no quote endpoint captured | Estimated shares received. |
| `YOU RECEIVE … Shares` | STATE 021–024 | output estimate; ellipsis + `Shares` | — | Loading quote state after quick-amount click. |
| `AVG PRICE —` | STATE 003–025 | em dash placeholder | — | Average execution price; no quote captured. |
| `SLIPPAGE 0.5%` | STATE 003–025 | percent; 1 decimal | — | Slippage setting/tolerance. |
| `ENTER AN AMOUNT` | STATE 003–025 | disabled button/status | — | Empty trade prompt/disabled action. |
| `GETTING QUOTE…` | STATE 021–024 | loading status string | — | Quote loading state; never resolved in captures. |
| `User rejected the request.` | STATE 018 | error alert string | — | Wallet/signing rejection alert. |
| `Signing in...` | STATE 018 | alert string; ellipsis | — | Contradictory alert after rejection. |
| `close` | STATE 018 | string button | — | Dismiss alert. |
| `CONNECT TO COMMENT` | STATE 003–018 | button | — | Wallet-gated comment action. |
| `Connect your wallet to share your take` | STATE 003–018 | prompt string | — | Discussion wallet gate. Still shown in STATE 004 despite connected wallet. |
| `No takes yet. Share the first one.` | STATE 003–025 | empty-state string | `market-comments.data: []` | Empty discussion state. |

---

## 6. Active market price-history legend

| Field / displayed value | Where shown (STATE ids) | Unit / format / rounding | API field if identifiable | Meaning / formula |
|---|---|---|---|---|
| `SAI 6%` | STATE 003–025 | legend button; integer percent | `get-market.outcomes[]`, derived probability `[inferred]` | Legend series for SAI. |
| `delegateyourjob.ai 5.9%` | STATE 003–025 | legend button; 1 decimal | same | Legend series. |
| `Zetsu.AI 4.1%` | STATE 003–025 | legend button; 1 decimal | same | Legend series. |
| `Wageware 3.6%` | STATE 003–025 | legend button; 1 decimal | same | Legend series. |
| `Workmesh 3.5%` | STATE 003–025 | legend button; 1 decimal | same | Legend series. |
| `CW 3.3%` | STATE 003–025 | legend button; 1 decimal | same | Legend series. |
| `Synergent 3.2%` | STATE 003–025 | legend button; 1 decimal | same | Legend series. Outcome table shows `3.1%`; discrepancy. |
| `Foreguild 3.1%` | STATE 003–025 | legend button; 1 decimal | same | Legend series. |
| `Auspex 3.1%` | STATE 003–025 | legend button; 1 decimal | same | Legend series. |
| `WorkX 2.8%` | STATE 003–025 | legend button; 1 decimal | same | Legend series. |

Chart notes: capture reports multiple canvases/SVG for the active market, but only `PRICE HISTORY` is text-labelled; no axes, plotted values, time range, or hover tooltip text were captured. STATE 005 hover produced no visible tooltip. `Scroll legend right` is present; `Scroll legend left` is disabled in captures.

---

## 7. Archive page and archive market cards

| Field / displayed value | Where shown (STATE ids) | Unit / format / rounding | API field if identifiable | Meaning / formula |
|---|---|---|---|---|
| `ARCHIVE` | STATE 026–028 | uppercase page label | — | Archive page label. |
| `Past markets` | STATE 026–028 | string heading | — | Archive page heading. |
| `Finalized opportunity markets. Holders of winning shares can still redeem them from each market's page.` | STATE 026–028 | explanatory string | — | Archive copy. |
| `← BACK TO OPPORTUNITIES` | STATE 026 | link | — | Return to opportunity list