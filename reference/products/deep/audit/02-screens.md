# screens (deep; DeepSeek draft: Claude verifies against screenshots)

# Screen-by-screen audit — `deep` (`deep.seer.pm`)

## Scope and conventions
- This description is based only on the supplied crawl notes, controls inventory, chart inventory, and truncated data model.
- `STATE` ids are cited throughout. All captures are **desktop**.
- “Same main screen” means the captured screen remains the `AI Prediction Markets` / `ROUND 3 · ORIGINALITY` market view; no separate detail panel was captured unless stated.
- No modals, drawers, or tooltips were captured. The only hover attempt was `STATE 003`, which produced no tooltip content.
- No error state was captured in any state.

---

## 1. Route / state map

| STATE | Route / trigger | Captured outcome | Metadata / notes |
|---|---|---|---|
| `STATE 001` | `/` initial load | Main “AI Prediction Markets” market screen: Round 3 Originality, volume/liquidity, repository chart/table, wallet/onboarding prompts | `controls=124`, `charts=2`, `tables=2` |
| `STATE 002` | Click `AI Prediction Markets` | Remains on same main market screen | Metadata unchanged |
| `STATE 003` | Hover chart | Remains on same main market screen; no tooltip content captured | Metadata unchanged |
| `STATE 004` | Click `Leaderboard` → `/leaderboard` | Leaderboard screen; ranks wallets across “All deep markets” by profit/loss; empty state `0 wallets` | `controls=17`, `charts=0`, `tables=0` |
| `STATE 005` | Click `Profile` | Captured same main market screen at `/`; no profile content visible | `controls=132`, `charts=2`, `tables=2` |
| `STATE 006` | Click `0x0000…dEaD` | Same main market screen | `controls=125`, `charts=2`, `tables=2` |
| `STATE 007` | Click `Round 3 · Originality LIVE` | Same main market screen | Metadata unchanged |
| `STATE 008` | Click `Archive` | Same live Round 3 market screen; no archive content visible | `controls=131`, `charts=2`, `tables=2` |
| `STATE 009` | Click `Refresh volume` | Same main market screen; no visible change | Metadata unchanged |
| `STATE 010–017` | Click repository row buttons | Same main screen with capture trigger/title for selected repository; no detail panel captured | Shared capture; exact control metadata for `010–017` not restated in notes |
| `STATE 018–025` | Click repository row buttons | Same main screen; visible page content identical across captures | `controls=124`, `charts=2`, `tables=2` |
| `STATE 026–033` | Click repository row buttons | Same main screen; captured DOM text byte-identical across all eight | `controls=124`, `charts=2`, `tables=2` |
| `STATE 034–041` | Click repository row buttons | Same main screen; layout, totals, list, copy, states identical; only selected row differs | `controls=124`, `charts=2`, `tables=2` |
| `STATE 042` | `erigontech/erigon 0.7652` | Note begins with `STATE 042 — erigontech/erigon 0.7652`; remainder truncated | **Partial only** — screen body not supplied; likely follows the same main-screen pattern but unverified |

---

## 2. Main market screen — `STATE 001–003`, `STATE 005–042` except `STATE 004`

### 2.1 Purpose
The main screen is an `AI Prediction Markets` contest screen for `Round 3 · Originality`, marked `LIVE`, on the `OPTIMISM` network. It presents market-implied “share of original work” for a ranked list of repositories, aggregate volume/liquidity, two chart/canvas regions, wallet/onboarding prompts, and prediction-upload empty-state messaging. `STATE 001–003`, `STATE 005–042`

---

### 2.2 Layout regions

#### Header / global navigation
- Product title: `AI Prediction Markets` — button. `STATE 001–003`, `STATE 005–009`
- Nav controls: `Leaderboard`, `Profile` — buttons. `STATE 001–003`, `STATE 005–009`
- `Guide` — anchor link; href `https://deep-pm.gitbook.io/seer-docs`. No resulting state captured. `STATE 001–003`, `STATE 005–009`
- Wallet area:
  - Truncated address `0x0000…dEaD` — button. `STATE 001–003`, `STATE 005–009`
  - `Connect your wallet` — present. No resulting state captured. `STATE 001–003`, `STATE 005–042`
- Network label: `OPTIMISM`. `STATE 001–003`, `STATE 005–042`

#### Round / market header
- Round label: `Round 3 · Originality`; status `LIVE`. `STATE 001–003`, `STATE 005–042`
- Section heading: `ROUND 3 · ORIGINALITY`. `STATE 001–003`, `STATE 005–042`
- `Archive` control/tab — present, but clicking it in `STATE 008` did not show archive content; screen remained the live Round 3 market. `STATE 008`
- `Refresh volume` control — present; clicking it in `STATE 009` produced no visible change. `STATE 009`

#### Wallet / onboarding region
- Copy: `Optimism is the only network these contests run on.` `STATE 001–003`, `STATE 005–042`
- Onboarding step `2`: `Create a trade wallet`.
  - Copy: `A contract you own that batches hundreds of trades into one run.`
  - Control: `Create trade wallet` — button. No resulting state captured. `STATE 001–003`, `STATE 005–042`
- Onboarding step `3`: `Add sUSDS`.
  - Copy: `Every market settles in it, and it earns Sky savings yield meanwhile.`
  - No separate `Add` button label visible in the capture. `STATE 001–003`, `STATE 005–042`
- Oddity: onboarding numbering starts at `2`; no step `1` is visible. `STATE 001–003`, `STATE 005–042`
- Ambiguity: `Connect your wallet` is shown while the truncated address `0x0000…dEaD` is also displayed. Connection status is not determinable from the capture. `STATE 001–003`, `STATE 005–042`

#### Aggregate metrics
- `Total volume ~$293.82` — approximate USD, `$`, tilde prefix, 2 decimal places. `STATE 001–003`, `STATE 005–042`
- `Total liquidity ~$929.08` — same format. `STATE 001–003`, `STATE 005–042`
- No timeframe, source, or update timestamp is visible for these totals. `STATE 001–003`, `STATE 005–042`

#### Chart region
- Chart 1 title: `Share of original work over time`.
  - Copy: `Each line is a repository's UP price — the market's estimate of how much of it is original.`
  - Described as a line chart; axes, time range, legend, and line detail are not exposed in the captured text. `STATE 001–003`, `STATE 005–042`
- Chart 2 / section title: `ORIGINALITY` / `Original work per repository`.
  - Copy begins: `Each repository trades as a pair: UP is the share of original work, DOWN …`
  - Captured copy is truncated after `DOWN`; remaining meaning cannot be verified. `STATE 001–003`, `STATE 005–042`
- Chart/canvas inventory:
  - Each main-screen capture has two canvases sized `942x364` at `y=489`.
  - Canvas metadata shows `svg-paths=0` and `texts=[]`, so no canvas-embedded axis labels or tooltip values were captured.
  - Metadata reports `charts=2` on main-market states. `STATE 001–003`, `STATE 005–042`
- `Charting by TradingView` — anchor link. Href begins `https://www.tradingview.com/?utm_medium=lwc-link&utm_campaig…`; truncated in inventory. `STATE 001–003`, `STATE 005–009`
- Hover on chart in `STATE 003` produced no captured tooltip content. `STATE 003`

#### Repository list / table
- Ranked repository list with `98 repository rows` reported. `STATE 001–003`, `STATE 010–041`
- Each row is a clickable button/selector labelled `<owner>/<repo> <decimal>`.
  - Example row label: `ethereum/consensus-specs 0.8481`.
  - Values are decimal, 4 decimal places; no `%` or `$` shown on row values. `STATE 001–003`, `STATE 010–041`
- Sort order: descending by displayed value, from `0.8481` (`ethereum/consensus-specs`) down to `0.5446` (`ethpandaops/checkpointz`). `STATE 001–003`, `STATE 010–041`
- Clicking repository rows in `STATE 010–041` changes the capture trigger/title to the selected repository/value, but no selected-row detail panel, order book, or trade ticket was captured. `STATE 010–041`
- Duplicate values / ties observed:
  - `ethers-io/ethers.js 0.8275` and `sigp/lighthouse 0.8275`. `STATE 011–012`
  - `argotorg/solidity 0.7954` and `arkworks-rs/algebra 0.7954`. `STATE 020–021`
  - `herumi/mcl 0.7903` and `nethereum/nethereum 0.7903`. `STATE 023–024`
- Near-duplicate repository families noted:
  - `hyperledger-web3j/web3j 0.7447` and `LFDT-web3j/web3j 0.7294`. `STATE 026`
  - `flashbots/mev-boost-relay 0.7479` and `aestus-relay/mev-boost-relay 0.6998`. `STATE 026`
- Inconsistent organization capitalization observed, e.g. `Consensys/…` vs `consensys/teku`; `ChainSafe/bls` vs `chainsafe/lodestar`; `NethermindEth/juno` vs `nethermindeth/nethermind`; `OffchainLabs/…`. `STATE 026`
- Search/filter control:
  - `Search outcomes` — input. No filtering action captured. `STATE 001–003`, `STATE 005–009`
- Bulk control:
  - `Hide all` — present below the repository list. No resulting state captured; exact effect ambiguous. `STATE 001–003`, `STATE 005–042`

#### Prediction upload / empty state
- Empty-state label: `No predictions loaded`. `STATE 001–003`, `STATE 005–042`
- Control: `Upload predictions`. No dialog/result captured. `STATE 001–003`, `STATE 005–042`
- Oddity: `No predictions loaded` appears simultaneously with populated repository prices, charts, and nonzero volume/liquidity. The relationship is unclear; it may refer to the user’s own predictions, but this is not verified. `STATE 001–003`, `STATE 005–042`

---

### 2.3 Controls on the main screen
Controls observed across main-screen captures:

| Control | Type | Observed effect / state |
|---|---|---|
| `AI Prediction Markets` | button | Same main screen. `STATE 002` |
| `Leaderboard` | button | Navigates to `/leaderboard`. `STATE 004` |
| `Profile` | button | Captured same main screen at `/`; no profile content. `STATE 005` |
| `Guide` | anchor | No resulting state captured. `STATE 001–003`, `STATE 005–009` |
| `0x0000…dEaD` | button | Same main screen. `STATE 006` |
| `Connect your wallet` | control | Present; no resulting state captured. `STATE 001–003`, `STATE 005–042` |
| `Create trade wallet` | button | Present; no resulting state captured. `STATE 001–003`, `STATE 005–042` |
| `Round 3 · Originality LIVE` | button | Same main screen. `STATE 007` |
| `Archive` | button/tab | Same live market screen; no archive content. `STATE 008` |
| `Refresh volume` | button | Same screen; no visible change. `STATE 009` |
| `Charting by TradingView` | anchor | External TradingView link; href truncated in inventory. `STATE 001–003`, `STATE 005–009` |
| `Search outcomes` | input | No filtering effect captured. `STATE 001–003`, `STATE 005–009` |
| Repository row buttons | buttons | 98 rows; click changes selected trigger/title but no detail panel captured. `STATE 010–041` |
| `Hide all` | control | Present; effect not captured. `STATE 001–003`, `STATE 005–042` |
| `Upload predictions` | control | Present near empty state; result not captured. `STATE 001–003`, `STATE 005–042` |

Metadata control-count variance is noted for visually identical market content: `STATE 001=124`, `STATE 005=132`, `STATE 006=125`, `STATE 008=131`. `STATE 001`, `STATE 005`, `STATE 006`, `STATE 008`

---

## 3. Leaderboard screen — `STATE 004`

### 3.1 Route and purpose
- Route: `/leaderboard`. `STATE 004`
- Purpose: ranks wallets across `All deep markets` by profit/loss. `STATE 004`
- Copy: `Every wallet across all deep markets, ranked by profit/loss. Profit is realised and marked-to-market, in USD.` `STATE 004`

### 3.2 Layout / data shown
- Time filters: `1D`, `1W`, `1M`, `All`. `STATE 004`
- Market filter: `MARKET` / `All deep markets`. `STATE 004`
- `Your rank` — present. No rank value captured. `STATE 004`
- `Search` — control. No filter action captured. `STATE 004`
- Count: `0 wallets`. `STATE 004`
- Empty state: `0 wallets`. `STATE 004`
- No rows, no chart, no table captured. Metadata: `controls=17`, `charts=0`, `tables=0`. `STATE 004`
- Oddity: leaderboard is empty despite copy describing “Every wallet across all deep markets.” `STATE 004`

### 3.3 Controls
- `1D`, `1W`, `1M`, `All` — time filters. No actions captured. `STATE 004`
- `MARKET` / `All deep markets` — market filter. No action captured. `STATE 004`
- `Your rank` — present; no interaction captured. `STATE 004`
- `Search` — search control. No action captured. `STATE 004`
- No modal, drawer, tooltip, or error state captured. `STATE 004`

---

## 4. State-specific selected repository table

| STATE | Selected repository / value | Trigger notes |
|---|---:|---|
| `STATE 010` | `ethereum/consensus-specs 0.8481` | click row on `/` |
| `STATE 011` | `ethers-io/ethers.js 0.8275` | click row |
| `STATE 012` | `sigp/lighthouse 0.8275` | click row |
| `STATE 013` | `status-im/nimbus-eth2 0.8262` | click row |
| `STATE 014` | `Consensys/gnark-crypto 0.8067` | click row |
| `STATE 015` | `foundry-rs/foundry 0.8034` | click row |
| `STATE 016` | `supranational/blst 0.8033` | click row |
| `STATE 017` | `flashbots/mev-boost 0.8028` | click row |
| `STATE 018` | `consensys/teku 0.8020` | click row |
| `STATE 019` | `ethereum/go-ethereum 0.7974` | click row |
| `STATE 020` | `argotorg/solidity 0.7954` | click row |
| `STATE 021` | `arkworks-rs/algebra 0.7954` | click row |
| `STATE 022` | `ethereum/eips 0.7946` | click row |
| `STATE 023` | `herumi/mcl 0.7903` | click row |
| `STATE 024` | `nethereum/nethereum 0.7903` | click row |
| `STATE 025` | `chainsafe/lodestar 0.7902` | click row |
| `STATE 026` | `argotorg/act 0.7884` | click row |
| `STATE 027` | `skalenetwork/libBLS 0.7828` | click row |
| `STATE 028` | `wevm/viem 0.7776` | click row |
| `STATE 029` | `a16z/halmos 0.7741` | click row |
| `STATE 030` | `Vectorized/solady 0.7734` | click row |
| `STATE 031` | `paradigmxyz/reth 0.7730` | click row |
| `STATE 032` | `argotorg/hevm 0.7725` | click row |
| `STATE 033` | `ethereum/web3.py 0.7719` | click row |
| `STATE 034` | `openzeppelin/openzeppelin-contracts 0.7698` | click row |
| `STATE 035` | `vyperlang/titanoboa 0.7695` | click row |
| `STATE 036` | `paulmillr/noble-curves 0.7692` | click row |
| `STATE 037` | `OffchainLabs/prysm 0.7689` | click row |
| `STATE 038` | `intellij-solidity/intellij-solidity 0.7684` | click row |
| `STATE 039` | `vyperlang/vyper 0.7666` | click row |
| `STATE 040` | `ethereum/execution-apis 0.7663` | click row |
| `STATE 041` | `nomicfoundation/hardhat 0.7655` | click row |
| `STATE 042` | `erigontech/erigon 0.7652` | **partial note only**; rest truncated |

`STATE 010–041` show no selected-repository detail panel in the captured text. `STATE 026–033` captured DOM text is byte-identical across all eight; `STATE 034–041` layout/content is identical except for selected row. `STATE 026–041`

---

## 5. Modals, drawers, tooltips, and transient UI
- No modals captured.
- No drawers captured.
- No tooltip content captured.
- Chart hover in `STATE 003` produced no tooltip content. `STATE 003`
- `Profile` click did not open a profile panel/drawer; it remained the main screen at `/`. `STATE 005`
- `Archive` click did not show an archive panel/drawer; it remained the live Round 3 screen. `STATE 008`
- Repository row clicks did not reveal a detail drawer/panel/order book/trade ticket in any captured state. `STATE 010–041`
- `Upload predictions`, `Connect your wallet`, `Create trade wallet`, `Hide all`, and leaderboard filters have no captured dialogs/results. `STATE 001–004`, `STATE 010–041`

---

## 6. Empty / gated / ended / error states

| State type | What is shown | States |
|---|---|---|
| Wallet-gated / connection cue | `Connect your wallet` is present, while `0x0000…dEaD` is also displayed; actual connection state ambiguous | `STATE 001–003`, `STATE 005–042` |
| Onboarding | Steps `2 Create a trade wallet`, `3 Add sUSDS`; no step `1` visible | `STATE 001–003`, `STATE 005–042` |
| Empty predictions | `No predictions loaded` with `Upload predictions` | `STATE 001–003`, `STATE 005–042` |
| Empty leaderboard | `0 wallets` | `STATE 004` |
| Live round | `LIVE` badge on `Round 3 · Originality` | `STATE 001–003`, `STATE 005–042` |
| Archive | `Archive` control exists; no archive content captured; click leaves live screen | `STATE 008` |
| Ended state | No ended state captured | — |
| Error state | No explicit error state captured in any state | — |

---

## 7. Odd / confusing / uncertain observations
- Onboarding numbering starts at `2`; no `1` is visible. `STATE 001–003`, `STATE 005–042`
- `Connect your wallet` appears alongside a displayed wallet address `0x0000…dEaD`; gating/connection status is ambiguous. `STATE 001–003`, `STATE 005–042`
- `No predictions loaded` appears while repository prices, charts, and nonzero totals are visible; relationship unclear. `STATE 001–003`, `STATE 005–042`
- `Profile` click produced no visible profile content and remained at `/`. `STATE 005`
- `Archive` click produced no archive content and remained on the live Round 3 market. `STATE 008`
- `Refresh volume`, `Round 3 · Originality LIVE`, wallet-address, and `AI Prediction Markets` clicks produced no visible content change. `STATE 002`, `STATE 006`, `STATE 007`, `STATE 009`
- Chart values are bare 4-decimal numbers with no `%` or unit, while copy calls them “UP price” and “share.” `STATE 001–003`, `STATE 005–042`
- The “Original work per repository” explainer is truncated at `DOWN`. `STATE 001–003`, `STATE 005–042`
- Metadata reports `charts=2` and `tables=2`, but the text capture exposes only limited chart axes/legend/control labels. The second chart’s visual type and the second table’s identity are not clearly captured. `STATE 001–003`, `STATE 005–042`
- Leaderboard is empty (`0 wallets`) despite copy describing all deep-market wallets. `STATE 004`
- Control counts vary for visually identical main-market content, e.g. `124` vs `132` vs `125` vs `131`. `STATE 001`, `STATE 005`, `STATE 006`, `STATE 008`
- Round has `LIVE` status but no visible end time or resolution details. `STATE 001–003`, `STATE 005–042`
- `STATE 042` is only partially supplied; only `erigontech/erigon 0.7652` is known. Do not infer the rest of its screen body. `STATE 042`

---

## Appendix A — Known repository row buttons from supplied inventory
The full 98-row list is not fully reconstructable from the truncated inventory. Known row labels observed include, in listed order:

`ethereum/consensus-specs 0.8481`, `ethers-io/ethers.js 0.8275`, `sigp/lighthouse 0.8275`, `status-im/nimbus-eth2 0.8262`, `Consensys/gnark-crypto 0.8067`, `foundry-rs/foundry 0.8034`, `supranational/blst 0.8033`, `flashbots/mev-boost 0.8028`, `consensys/teku 0.8020`, `ethereum/go-ethereum 0.7974`, `argotorg/solidity 0.7954`, `arkworks-rs/algebra 0.7954`, `ethereum/eips 0.7946`, `herumi/mcl 0.7903`, `nethereum/nethereum 0.7903`, `chainsafe/lodestar 0.7902`, `argotorg/act 0.7884`, `skalenetwork/libBLS 0.7828`, `wevm/viem 0.7776`, `a16z/halmos 0.7741`, `Vectorized/solady 0.7734`, `paradigmxyz/reth 0.7730`, `argotorg/hevm 0.7725`, `ethereum/web3.py 0.7719`, `openzeppelin/openzeppelin-contracts 0.7698`, `vyperlang/titanoboa 0.7695`, `paulmillr/noble-curves 0.7692`, `OffchainLabs/prysm 0.7689`, `intellij-solidity/intellij-solidity 0.7684`, `vyperlang/vyper 0.7666`, `ethereum/execution-apis 0.7663`, `nomicfoundation/hardhat 0.7655`, `erigontech/erigon 0.7652`, `argotorg/sourcify 0.7629`, `swiss-knife-xyz/swiss-knife 0.7619`, `ethereum/py_ecc 0.7614`, `evmts/tevm-monorepo 0.7611`, `argotorg/fe 0.7602`, `Certora/CertoraProver 0.7595`, `alloy-rs/alloy 0.7594`, `lambdaclass/ethrex 0.7587`, `apeworx/ape 0.7585`, `ipsilon/evmone 0.7585`, `grandinetech/grandine 0.7573`, `shazow/whatsabi 0.7511`, `lambdaclass/lambda_ethereum_consensus 0.7492`, `flashbots/mev-boost-relay 0.7479`, `erigontech/silkworm 0.7474`, `ethstaker/ethstaker-deposit-cli 0.7473`, `EspressoSystems/jellyfish 0.7468`, `hyperledger/besu 0.7450`, `libp2p/libp2p 0.7448`, `hyperledger-web3j/web3j 0.7447`, `taikoxyz/taiko-mono 0.7432`, `Commit-Boost/commit-boost-client 0.7422`, `OffchainLabs/stylus-sdk-rs 0.7393`, `Cyfrin/aderyn 0.7384`, `nethermindeth/nethermind 0.7383`, `TrueBlocks/trueblocks-core 0.7369`, `wealdtech/ethdo 0.7361`, `holiman/goevmlab 0.7356`, `DefiLlama/DefiLlama-Adapters 0.7315`, `ethdebug/format 0.7313`, `wighawag/hardhat-deploy 0.7299` … inventory truncates here. Additional known values from notes: `LFDT-web3j/web3j 0.7294`, `aestus-relay/mev-boost-relay 0.6998`, `safe-global/safe-smart-account 0.6667`, `succinctlabs/sp1 0.6607`, `dappnode/DAppNode 0.5665`, `succinctlabs/op-succinct 0.5451`, `ethpandaops/checkpointz 0.5446`. `STATE 001–003`, `STATE 010–041`