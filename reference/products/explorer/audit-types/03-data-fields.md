# data fields (explorer; DeepSeek draft: Claude verifies against screenshots)

Scope: visible fields only, from the crawl notes/controls/charts/data model. Crawl truncations are preserved; API mappings marked `[inferred]` are guesses. I do not reconstruct omitted values.

## 1. Global shell, navigation, menus, common UI

| Field / string | State IDs | Unit / format / rounding | API field if identifiable | Meaning / formula |
|---|---|---|---|---|
| `Note that this is a Beta version and can still be unstable` | 001–046 | text banner | — | global beta warning |
| Top-nav labels: `Markets`; `Leaderboard`; `Create Market`; `Policies`; `App` | 001–046 | text labels | — | global navigation |
| Wallet address `0x0000...dEaD` | 001–015; 016, 022, 026; 030–039, 041–046 | truncated hex address | likely `account` from `get-portfolio-pl` / WalletConnect identity `[inferred]` | connected account display |
| Wallet balance `24.69 xDAI` | 001–015; 016, 022, 026; 030–039, 041–046 | 2 dp number + `xDAI` | `get-portfolio-pl` balance `[inferred]` | wallet collateral balance |
| `Connect` | 040 | text | — | disconnected-wallet state |
| Wallet menu labels: `Account`; `Deposit`; `Portfolio`; `Market Collections`; `Trade Collateral`; `Use smart account` | 005, 015, 026, 037 | text labels | — | account menu |
| App menu labels: `Futarchy`; `Deepfunding`; `Foresight`; `Opportunity Markets` | 004, 014, 025, 036 | text labels | — | app menu |
| Policies menu labels: `Verified Market Policy`; `Market Rules Policy` | 002, 003, 012, 013, 023, 024, 034, 035 | text labels | — | policy menu/overlay headings |
| Theme controls: `Switch to dark mode`; `Switch to light mode` | dark: 001–008, 016–018; light: 006–015, 027, 038 | text buttons | — | theme toggle |
| Comments gated strings: `Connect your wallet to share your take`; `Connect to comment`; `No takes yet. Share the first one.` | 001–021 | text | `market-comments` `data[]` `[inferred]` | wallet-gated empty comments |
| Error toast: `User rejected the request.` | 017 | text | — | wallet/request rejection |
| Common outcome actions: `Add Liquidity`; `View pool details`; `New conditional market` | 016–046 | text controls | — | outcome-row actions |
| `Verified` badge/link | 001–008; 016–021; 030–046 | text badge | external Curate/Kleros link; no direct `get-market` field in excerpt | market verification |
| `Charting by TradingView` | 001–008 | text attribution link | — | chart attribution |
| `Open interest and liquidity breakdown` | 001–008; expanded in 007 | text control | — | expandable breakdown |
| `Hide questions` | 016–021 | text control | — | question-list toggle |
| `Reopen question` | 016–021 | text button | — | question action |
| `Answer: Answered too soon` | 016–021 | text status | likely `encodedQuestions`/question state `[inferred]` | question answer status |
| Tabs: `Comments`; `Related Conditional Markets`; `Top Holders`; `Activity` | 016–021 | text tabs | — | market-detail tabs |

## 2. Market status, type, title, header metrics, events

| Field / string | State IDs | Unit / format / rounding | API field if identifiable | Meaning / formula |
|---|---|---|---|---|
| Status `Trading Open` | 001–010 | text | — | Ethereum BASEFEE market status |
| Ethereum BASEFEE market title/purpose; exact visible title truncated | 001–010 | text | `get-market.marketName` sample: `What will be the average Ethereum BASEFE...` `[inferred visible]` | market question |
| `Resolution opening at February 1 2027, 08:50 UTC` | 001–008 | date/time UTC | `get-market-events.event_at` `[inferred; sample for BASEFEE is 2027-02-01T00:00:00+00:00, time differs]` | resolution-event link |
| France title: `How many seats in France’s National Assembly will [party bloc] win in the next French legislative election?` | 011–021 | text | `get-market.marketName` `[inferred]` | market question |
| Status `Pending execution` | 011–021 | text | — | France market status |
| Type label `Multi Scalar` | 011–021 | text | `get-market.type`/template `[inferred]` | market type |
| France header `Liquidity: 6.45k` | 016–021 | `k` abbreviation; no unit shown | pool liquidity/TVL aggregate `[inferred]` | header liquidity |
| France header `Volume: 1.32k` | 016–021 | `k` abbreviation; no unit shown | subgraph volume fields `[inferred]` | header volume |
| France header `P&L: 0.00` | 016–021 | 2 dp; no unit shown | `get-portfolio-pl` `[inferred]` | profit/loss |
| France header `Verified` | 016–021 | text badge | external Curate/Kleros link; no direct API field in excerpt | verification |
| `Deadline:` label with no value visible | 016–021 | label only | `finalizeTs`/`openingTs` `[inferred]` | deadline display |
| France question headings: `Far Right (RN, UXD, REC, DSV, EXD, ...)`; `Right (LR, DVD, …)`; `Centre (ENS, REN, MDM, HOR, UDI, DVC, …)`; `Left (UG, LFI, SOC, COM, VEC, RDG, DVG, EXG, …)`; `Other (REG, ECO, DIV, …)` | 016–021 | text | `encodedQuestions`/outcomes `[inferred]` | sub-questions |
| France Major Events: `1 UPCOMING` | 016–021 | integer/event count | `get-market-events.data.length` `[inferred]` | upcoming event count |
| France Major Events: `OCT 1, 2029 · 00:00 UTC` | 016–021 | date/time UTC | `get-market-events.event_at` `[inferred; sample event in excerpt is different market/date]` | event time |
| France Major Events: `Reality.eth Resolution` | 016–021 | text | `get-market-events.title` `[inferred]` | event title |
| France Major Events: `Expected resolution date` | 016–021 | text | `get-market-events.description` `[inferred]` | event description |
| Polymarket clarification scalar title: `How many Polymarket clarification notes published before January 1, 2027 will cause a market price move of at least 25 percentage points within 24 hours? [Note]` | 022–032 | text | `get-market.marketName` `[inferred]` | market question |
| Status `Reports open` | 022–046 | text | — | market status for 022–046 |
| Scalar type label `Scalar` | 030–032 | text | `get-market.type`/template `[inferred]` | market type |
| Scalar header `Market Estimate: 21.23 Note` | 030–032 | 2 dp + `Note` | lower/upper bounds/current scalar estimate `[inferred]` | scalar market estimate |
| Scalar header `Liquidity: 1.11k` | 030–032 | `k` abbreviation | pool liquidity/TVL `[inferred]` | header liquidity |
| Scalar header `Volume: 88.65` | 030–032 | 2 dp; no unit shown | subgraph volume `[inferred]` | header volume |
| Scalar header `P&L: 0.00` | 030–032 | 2 dp; no unit shown | `get-portfolio-pl` `[inferred]` | profit/loss |
| Categorical title: `Will Polymarket publicly release a fix for the negative-risk mint/merge share cost basis accounting issue before January 1, 2027?` | 033–043 | text | `get-market.marketName` `[inferred]` | market question |
| Categorical type label `Categorical` | 033–046 | text | `get-market.type`/template `[inferred]` | market type |
| Categorical header `Liquidity: 1.18k` | 033–043 | `k` abbreviation | pool liquidity/TVL `[inferred]` | header liquidity |
| Categorical header `Volume: 61.89` | 033–043 | 2 dp | subgraph volume `[inferred]` | header volume |
| Categorical header `P&L: 0.00` | 033–039, 041–043 | 2 dp | `get-portfolio-pl` `[inferred]` | profit/loss; absent in 040 |
| Categorical header omits `P&L` | 040 | absent | — | header variant |
| South Sudan title: `Who will win the 2026 South Sudanese presidential election?` | 044–046 | text | `get-market.marketName` `[inferred]` | market question |
| South Sudan header `Liquidity: 781.17` | 044–046 | 2 dp; no unit shown | pool liquidity/TVL `[inferred]` | header liquidity |
| South Sudan header `Volume: 107.76` | 044–046 | 2 dp | subgraph volume `[inferred]` | header volume |
| South Sudan header `P&L: 0.00` | 044–046 | 2 dp | `get-portfolio-pl` `[inferred]` | profit/loss |

## 3. Outcomes, percentages, seat estimates, liquidity breakdowns

| Field / string | State IDs | Unit / format / rounding | API field if identifiable | Meaning / formula |
|---|---|---|---|---|
| France outcome `#1 Left` — `31.6%`, `~ 182 seats` | 016–021 | percentage 1 dp; seats approximate integer | outcome price from pool `[inferred]`; seats = percentage × chamber size `[inferred]` | outcome probability and implied seats |
| France outcome `#2 Centre` — `29.1%`, `~ 168 seats` | 016–021 | percentage 1 dp; seats approximate integer | pool price `[inferred]` | outcome probability and implied seats |
| France outcome `#3 Far Right` — `24.9%`, `~ 144 seats` | 016–021 | percentage 1 dp; seats approximate integer | pool price `[inferred]` | outcome probability and implied seats |
| France outcome `#4 Right` — `7.6%`, `~ 44 seats` | 016–021 | percentage 1 dp; seats approximate integer | pool price `[inferred]` | outcome probability and implied seats |
| France outcome `#5 Other` — `6.6%`, `~ 38 seats` | 016–021 | percentage 1 dp; seats approximate integer | pool price `[inferred]` | outcome probability and implied seats |
| France outcome `#6 Invalid` — `0%` | 016–021 | integer percentage | invalid outcome token/state `[inferred]` | invalid outcome |
| France `Open interest: 3.13k sDAI (0 $)` | 018 | `k` abbreviation; `sDAI`; parenthetical `$` value | `outcomesSupply`/collateral aggregate `[inferred]` | open interest |
| France `Volume: 1.32k $ traded, notional 4.80k $` | 018 | `k` abbreviation; `$` | subgraph volume/`volumeUSD` `[inferred]` | traded volume and notional |
| France liquidity `Left: 3.10k FRNALEFT / 642.63 sDAI` | 018 | `k` / 2 dp; token symbols | `totalValueLockedToken0`/`totalValueLockedToken1` `[inferred]` | outcome pool balances |
| France liquidity `Centre: 3.13k FRNACENTRE / 645.08 sDAI` | 018 | `k` / 2 dp; token symbols | `totalValueLockedToken0/1` `[inferred]` | outcome pool balances |
| France liquidity `Far Right: 3.12k FRNAFARRIGH / 509.05 sDAI` | 018 | `k` / 2 dp; token symbols | `totalValueLockedToken0/1` `[inferred]` | outcome pool balances |
| France liquidity `Right: 3.04k FRNARIGHT / 337.77 sDAI` | 018 | `k` / 2 dp; token symbols | `totalValueLockedToken0/1` `[inferred]` | outcome pool balances |
| France liquidity `Other: 3.03k FRNAOTHER / 134.65 sDAI` | 018 | `k` / 2 dp; token symbols | `totalValueLockedToken0/1` `[inferred]` | outcome pool balances |
| Scalar outcome `#1 DOWN [10,50]` — `0.648` | 030–032 | decimal 3 dp | pool price/`token0Price`/`token1Price` `[inferred]` | outcome price/probability |
| Scalar outcome `#2 UP [10,50]` — `0.295` | 030–032 | decimal 3 dp | pool price `[inferred]` | outcome price/probability |
| Scalar outcome `#3 Invalid` — `10.00 SER-INVALID` — `0` | 030–032 | 2 dp token amount; integer final value | `wrappedTokens`/`outcomesSupply` `[inferred]` | invalid outcome stake/token |
| Categorical outcome `#1 No` — `51.6%` | 033–043 | percentage 1 dp | pool price `[inferred]` | outcome probability |
| Categorical outcome `#2 Yes` — `48.4%` | 033–043 | percentage 1 dp | pool price `[inferred]` | outcome probability |
| Categorical outcome `#3 Invalid` — `10.00 SER-INVALID` — `0%` | 033–043 | 2 dp token amount; percentage | `wrappedTokens`/`outcomesSupply` `[inferred]` | invalid outcome stake/token |
| South Sudan outcome `#1 Salva Kiir Mayardit` — `89.8%` | 044–046 | percentage 1 dp | pool price `[inferred]` | outcome probability |
| South Sudan outcome `#2 Others` — `9.9%` | 044–046 | percentage 1 dp | pool price `[inferred]` | outcome probability |
| South Sudan outcome `#3 Invalid` — `5.00 SER-INVALID` — `0%` | 044–046 | 2 dp token amount; percentage | `wrappedTokens`/`outcomesSupply` `[inferred]` | invalid outcome stake/token |

## 4. Trade panel fields

| Field / string | State IDs | Unit / format / rounding | API field if identifiable | Meaning / formula |
|---|---|---|---|---|
| `You pay` | 016–021 | label | — | trade input label |
| `sDAI` | 016–021 | token symbol | `collateralToken` sample `0xaf204776...` `[inferred]` | pay token |
| Input value `0 sDAI` | 016–021 | integer 0 + token | — | default amount |
| `Max` | 016–021 | text button | — | use maximum balance |
| `You will get` | 016–021 | label | — | expected outcome label |
| `Left (...)` | 016–021 | outcome label | outcome/wrapped token `[inferred]` | selected outcome |
| `Avg price` `0 sDAI` | 016–021 | 0 + token | pool price `[inferred]` | average execution price |
| `Calculate your potential return` | 016–021 | text button | — | return calculator |
| `Parameters: Max slippage 1%` | 016–021 | integer percent | — | slippage setting |
| `Enter an amount` | 016–021 | disabled button | — | amount prompt |
| Tabs `Mint`; `More`; `Merge`; `Redeem` | 016–021 | text tabs | — | trade modes |
| Amount input with `Max` | 016–021 | input control | — | amount entry |
| `Balance: 0 sDAI` | 016–021 | 0 + token | `get-portfolio-pl` balance `[inferred]` | user balance |
| Asset buttons `sDAI`; `xDAI` | 016–021 | token symbols | collateral/native tokens `[inferred]` | selectable assets |
| `Mint` appears twice | 016–021 | text/button | — | duplicate action observed |

## 5. Charts, hover tooltips, date pickers

| Field / string | State IDs | Unit / format / rounding | API field if identifiable | Meaning / formula |
|---|---|---|---|---|
| Time-range controls `1D`; `1W`; `1M`; `All`; `Custom` | 016–021 | text controls | `market-chart.periodStartUnix`/range `[inferred]` | chart time range |
| France chart legend: `Left 31.6%`; `Centre 29.1%`; `Far Right 24.9%`; `Right 7.6%`; `Other 6.6%` | 016–021 | percentage 1 dp | pool prices `[inferred]` | chart legend |
| Ethereum chart hover tooltip | 003 | tooltip present; values not captured | `market-chart` `[inferred]` | hover detail |
| France chart hover tooltip | 013 | tooltip present; values not captured | `market-chart` `[inferred]` | hover detail |
| Scalar chart label `Market Estimate` with visible `21.2%` | 030–032 | label + percentage 1 dp | `market-chart`/scalar estimate `[inferred]` | scalar chart |
| Categorical hover `Sep 15, 2026 21:00`; `No: 51.90%`; `Yes: 48.20%` | 035 | date/time; percentages 2 dp | `market-chart.periodStartUnix` + prices `[inferred]` | chart hover |
| South Sudan hover `Sep 21, 2026 13:00`; `Salva Kiir Mayardit: 89.80…` | 046 | date/time; percentage 2 dp, truncated | `market-chart` `[inferred]` | chart hover |
| Date-picker presets `Today`; `Last Week`; `Last Month`; `All` | 008, 019 | text | — | custom range presets |
| `Previous Month`; `Next Month` | 008, 019 | text controls | — | calendar navigation |
| Calendar header `October 2026` | 019 | month/year | — | calendar month |
| Weekday header `SuMoTuWeThFrSa` | 019 | text | — | calendar weekdays |
| Date-grid options: `Choose Sunday, September 27th, 2026` through `Choose Thursday, October 8th, 2026`; controls inventory enumerates those 12 labels | 008, 019; controls inventory also lists 030, 041, 050m, 062m, 069m, 081m | date labels | — | selectable dates; capture truncated after Oct 8 |
| `Cancel`; `Save` | 019 | text buttons | — | date modal actions |

## 6. Overlays, farming, pool details

| Field / string | State IDs | Unit / format / rounding | API field if identifiable | Meaning / formula |
|---|---|---|---|---|
| Policies overlay headings `Verified Market Policy`; `Market Rules Policy` | 002, 012 | text | — | policy overlay |
| `Add Liquidity` drawer title | 009, 020 | text | — | liquidity drawer |
| `Farming Rewards` | 009, 020 | text | — | farming section |
| `Earn farming rewards (SEER) by providing liquidity to existing markets.` | 020 | text | — | farming description |
| `Available Pools:` | 020 | text | — | pools section |
| `Rewards ended on: January 5 2026, 13:21` | 020 | date/time | — | reward end time |
| `Add liquidity` | 020 | text action | — | farm/liquidity action |
| `Learn more about the farming program` | 020 | text link | — | farming info |
| `Return` | 020 | text button | — | back action |
| `Liquidity Chart` | 021 | text label | — | pool chart label |
| `Pool Id` `0x56c3...d7d9` | 021 | truncated hex | `pools.id` `[inferred]` | pool identifier |
| `Pool Balances` `3.12k FRNALEFT / 636.89 sDAI` | 021 | `k` / 2 dp; token symbols | `totalValueLockedToken0/1` `[inferred]` | pool reserves |
| Column headers `SHARES`; `TOTAL` | 021 | text | — | pool table headers |
| Pool row sample `0.4584`; `1.02`; `3120.46`; repeated three-value rows | 021 | decimals/integers as shown | liquidity/sqrtPrice-derived `[inferred]` | pool ladder/table |
| `Last: 0.3159` | 021 | 4 dp | `token0Price`/`token1Price` `[inferred]` | last pool price |
| Pool capture truncates at `#2 Ce` | 021 | truncation note | — | incomplete capture |
| `Open interest and liquidity breakdown` expanded; no values captured for Ethereum | 007 | control expanded | — | breakdown |
| `Add Liquidity` / `Farming Rewards` panel opened; no additional values captured for Ethereum | 009 | control expanded | — | panel |
| `View pool details` expanded for DOWN outcome; no values captured for Ethereum | 010 | control expanded | — | pool details |

## 7. API endpoints and what each returns

| Method / endpoint | What it returns |
|---|---|
| `POST https://app.seer.pm/subgraph?_subgraph=algebra&_chainId=100` | GraphQL response with `data.pools[]`: pool `id`, `fee`, `liquidity`, `tickSpacing`, `sqrtPrice`, `tick`, `token0`/`token1` (`id`, `symbol`, `name`, `decimals`), `token0Price`, `token1Price`, `volumeToken0`, `volumeToken1`, `volumeUSD`, `txCount`, `totalValueLockedToken0/1/USD`, `untrackedVolumeUSD`, `feesUSD`, `__typename`. |
| `POST https://lb.drpc.org/gnosis/As_mVw7_50IPk85yNYubcezE_O23TT8R8JDnrqRhf0fE` | JSON-RPC response array; sample element has `id`, `jsonrpc`, `result` (`0x000...`). Full payload truncated in excerpt. |
| `GET https://api.web3modal.org/getWallets?page=1&entries=4` | Wallet-list pagination: `count`, `nextPage`, `previousPage`, `data[]` with wallet metadata such as `id`, `name`, `homepage`, `image_id`, `order`, mobile/desktop/web links, `app_store`, `play_store`, `chains`, `categories`, `description`, `badge_type`, `supports_wc`, `is_top_wallet`, `supports_wcpay`. |
| `GET https://li.quest/v1/chains?chainTypes=EVM%2CSVM%2CUTXO%2CMVM` | Chain list JSON: `chains[]` with fields such as `key`, `chainType`, `name`, `coin`, `id`, `mainnet`, `logoURI`, `tokenlistUrl`, `multicallAddress`, `relayerSupported`, and `metamask` data. Capture notes “not parseable JSON” but raw JSON shown. |
| `GET https://app.seer.pm/.netlify/functions/market-comments?market_id=0x2324...&chain_id=100` | Comment response `{ "data": [] }`; empty comment list in capture. |
| `GET https://app.seer.pm/.netlify/functions/get-market-events?chainId=100&marketId=0x2324...` | `{ data: [ { id, market_id, chain_id, title, description, event_at } ] }`; sample title `Reality.eth Resolution`, description `Expected resolution date`, `event_at` ISO timestamp. |
| `POST https://app.seer.pm/.netlify/functions/get-market` | Market object: `id`, `marketName`, `outcomes[]`, `parentOutcome`, `templateId`, `hasAnswers`, `questionsInArbitration`, `openingTs`, `finalizeTs`, `encodedQuestions[]`, `lowerBound`, `upperBound`, `payoutReported`, `payoutNumerators[]`, `outcomesSupply`, `blockTimestamp`, `type`, `wrappedTokens[]`, `collateralToken`, `collateralToken1`, `collateralToken2`, `parentCollectionId`, `conditionId`, `questionId`, `factory`. |
| `GET https://app.seer.pm/.netlify/functions/market-chart?marketId=0x2324...&chainId=100` | Array of chart series; each point includes `pool` (`id`, `token0`, `token1`, `liquidity`), `liquidity`, `sqrtPrice`, `token0Price`, `token1Price`, `periodStartUnix`. |
| `GET https://auth.magic.link/api/magic-client/cGtfbGl2ZV9CMDgwRTlEQzMxRTU4NzVF/config` | Magic/Reown client config: `clientId`, `productType`, `cspSources`, `authProviders`, `accessAllowlist`, `features`, `theme` (`appName`, colors, `themeColor`, etc.). |
| `POST https://lb.drpc.org/ethereum/As_mVw7_50IPk85yNYubcezE_O23TT8R8JDnrqRhf0fE` | JSON-RPC response array; sample element has `id`, `jsonrpc`, `result` (`0x000...`). Full payload truncated in excerpt. |
| `GET https://rpc.walletconnect.org/v1/identity/0x000000000000000000000000000000000000dEaD?projectId=...` | Identity response: `name: null`, `avatar: null`, `resolvedAt` ISO timestamp. |
| `GET https://rpc.walletconnect.org/v1/profile/reverse/0x000000000000000000000000000000000000dEaD?projectId=...` | 404 response: `status: "FAILED"`, `reasons[]` with `field: "address"`, `description: "No name for address is found"`. |
| `GET https://app.seer.pm/.netlify/functions/get-portfolio-pl?account=0x000...dEaD&chainId=100&period=all&collateralProfile=default&marketId=0x2324...` | Portfolio P&L response beginning `{ account, chainId, ... }`; rest truncated in excerpt, so full field list cannot be enumerated. |

## Uncertainty and capture limits

- Several notes are explicitly truncated: STATE 021 pool table truncates at `#2 Ce`; STATE 046 hover truncates at `Salva Kiir Mayardit: 89.80`; the `get-portfolio-pl` response and STATE 022–029 action details are truncated.
- Header `Liquidity`, `Volume`, and `P&L` have no unit/currency shown in the market header; mappings to pool/subgraph/portfolio endpoints are `[inferred]`.
- Outcome percentages, seat estimates, pool balances, pool-table values, and “Last” price are UI displays; exact formulas are not documented in the notes. Seat totals are marked `[inferred]`.
- Conflicts/ambiguities preserved rather than resolved: scalar header `21.23 Note` vs chart `21.2%`; France event `OCT 1, 2029 · 00:00 UTC` vs API sample event `2027-02-01T00:00:00+00:00` for a different market; Ethereum resolution link `08:50 UTC` vs API sample `00:00:00+00:00`. These may be different markets/formatting.
- Crawl metadata like `charts=3`, `tables=1` is not user-visible and is not included as a UI field.