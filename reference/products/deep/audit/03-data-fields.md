# data fields (deep; DeepSeek draft: Claude verifies against screenshots)

# User-visible field inventory — `deep` audit

Scope note: STATE ids are cited as given; ranges are inclusive. `—` means not captured/identifiable. `[inferred]` marks a guess. Crawl metadata such as `controls=124`, `charts=2`, `tables=2` is **not** treated as a user-visible field unless the notes show it as text.

## Main field table

| Field / string shown | Where shown (STATE ids) | Unit / format / rounding | API field if identifiable | Meaning / formula |
|---|---|---|---|---|
| `AI Prediction Markets` | `001–008`; `010–041` | plain text; app/product title | none captured | Product title. Clicking it in `002` leaves the same main screen. |
| `OPTIMISM` | `001`; `010–041` | uppercase text label | none directly; RPC endpoint path is `/optimism/` in `lb.drpc.org/optimism/...` `[inferred chain context]` | Network badge. Copy says Optimism is the only network for these contests. |
| `Leaderboard` | `001–008`; `010–041` | nav/button text | none captured | Opens leaderboard; `004` is the leaderboard screen. |
| `Profile` | `001–008`; `010–041` | nav/button text | none captured | Profile nav. In `005` the click leaves the same main screen; no profile content visible. |
| `Guide` | `001–008`; `010–041` | link text; href `https://deep-pm.gitbook.io/seer-docs` | none captured | Documentation/nav link; no resulting state captured. |
| `0x0000…dEaD` | `001–008`; `010–041` | abbreviated hex: `0x` + 4 hex chars + `…` + 4 hex chars; full API address is `0x000000000000000000000000000000000000dead` / `0x000000000000000000000000000000000000dEaD` | `get-profiles?addresses=0x...dead`; `get-redeemable?account=0x...dEaD`; walletconnect identity path/sender uses full address | Account/wallet address. Shown simultaneously with `Connect your wallet`, so connected/disconnected state is ambiguous. Clicking it in `006` leaves same main screen. |
| `Connect your wallet` | `001`; `010–041` | button text | none captured | Wallet connection CTA; no resulting state captured. |
| Step label `2` | `001`; `010–041` | integer label | none captured | Onboarding step number. No step `1` visible. |
| `Create a trade wallet` | `001`; `010–041` | button text | none captured | Step 2 control; no resulting state captured. |
| `A contract you own that batches hundreds of trades into one run.` | `001`; `010–041` | explanatory copy | none captured | Trade-wallet explanation. |
| Step label `3` | `001`; `010–041` | integer label | none captured | Onboarding step number. |
| `Add sUSDS` | `001`; `010–041` | text label | none captured | Step 3 label; no separate Add button captured. |
| `Every market settles in it, and it earns Sky savings yield meanwhile.` | `001`; `010–041` | explanatory copy | none captured | sUSDS settlement/yield explanation. |
| `Optimism is the only network these contests run on.` | `001`; `010–041` | explanatory copy | none captured | Network restriction/explanation. |
| `Round 3 · Originality` | `001–003`, `005–009`; `010–041` | text label | none directly; API market token labels include `_R3C` suffix `[inferred Round 3 marker]` | Round/contest label. No end time or resolution details captured. |
| `LIVE` | `001–003`, `005–009`; `010–041` | status badge text | none captured | Live status for Round 3; no ended state captured. |
| `Round 3 · Originality LIVE` | `001–003`, `005–009`; `010–041` | combined button text | none captured | Round/status control. Clicking it in `007` leaves same main screen. |
| `Archive` | `001–003`, `005–009`; `010–041` | tab/button text | none captured | Archive tab/control. Clicking it in `008` leaves the same live Round 3 screen; no archive content captured. |
| `ROUND 3 · ORIGINALITY` | `001`; `010–041` | uppercase section heading | none captured | Main section heading. |
| `Total volume ~$293.82` | `001`; `010–041` | USD; tilde `~` = approximate; `$`; 2 decimal places | No aggregate field captured. Closest per-market fields: `refresh-market-volume.volumes[marketId].totalVolumeMarket` and `.totalVolumeTokens`; mapping to this aggregate is unverified | Aggregate total volume. Formula, timeframe, update timestamp, and source not shown. |
| `Total liquidity ~$929.08` | `001`; `010–041` | USD; tilde `~` = approximate; `$`; 2 decimal places | No aggregate field captured. Closest per-market fields: `refresh-market-volume.volumes[marketId].totalLiquidityMarket` and `.totalLiquidityTokens`; mapping unverified | Aggregate total liquidity. Formula, timeframe, update timestamp, and source not shown. |
| `Refresh volume` | `001–003`, `005–009` | button text | likely `refresh-market-volume` `[inferred from name]`; click in `009` produced no visible change | Refreshes volume data. |
| `Charting by TradingView` | `001–003`, `005–009` | link text; href captured truncated: `https://www.tradingview.com/?utm_medium=lwc-link&utm_campaig...` | none captured | Chart attribution/link. |
| `Search outcomes` | `001–003`, `005–009` | input placeholder | none captured | Search/filter input for outcomes. |
| Repository row button | `001–003`, `005–009`; `010–041` | `<owner>/<repo>` string + space + decimal to 4 decimal places; no `%` or `$` shown; rows sorted descending by displayed value; 98 rows observed | Repo-name field not present in provided API. Chart keys are market ids. Price likely from `get-market-charts[marketId].series[].points[][1]` `[inferred; market-id-to-repo mapping absent]` | Row represents a repository market. Displayed value is described as “UP price” / “share of original work” `[inferred from copy]`. Values seen range `0.8481` to `0.5446`. Duplicate values occur. |
| Repository list length `98` | `010–017`; `018–025`; `026–033`; `034–041` | integer count observed from list | none captured | Number of repository rows observed. This is an observed count, not necessarily a literal UI label. |
| Selected-row title format `<repository> <4-dp decimal>` | `010–042` | same repo string + 4-dp value | same as repository row | Clicking a repo button changes the trigger/title to that repo + value, but in `018–041` no visible detail panel/order book/trade ticket appears. |
| `Hide all` | `001`; `010–041` | button text | none captured | Bulk hide control; target/effect not captured. |
| `Upload predictions` | `001`; `010–041` | button text | none captured | Upload control near empty state; result not captured. |
| `No predictions loaded` | `001`; `010–041` | empty-state text | none captured | Empty-state message. Shown alongside populated repo list and nonzero totals; relationship unclear. |
| `Share of original work over time` | `001`; `010–041` | chart title | Chart data supplied by `get-market-charts`; title itself not an API field | Line chart title. Caption says each line is a repository’s UP price. Axis labels/ticks/legend/time range not captured. |
| `Each line is a repository's UP price — the market's estimate of how much of it is original.` | `001`; `010–041` | explanatory copy | none captured | Defines chart lines as market-implied UP price/share of originality. |
| `ORIGINALITY` | `001`; `010–041` | uppercase section title | none captured | Section title for second chart/graphic. |
| `Original work per repository` | `001`; `010–041` | chart/section title | none captured | Second chart/section title. Visual type not fully captured. |
| `Each repository trades as a pair: UP is the share of original work, DOWN ` | `001`; `010–041` | truncated explanatory copy; capture cuts off after `DOWN` | none captured | Market pair explanation. DOWN meaning is not captured; UP/DOWN inverse relationship is `[inferred]` only. |
| Leaderboard time filters `1D`, `1W`, `1M`, `All` | `004` | short strings; time windows days/weeks/months/all-time `[inferred]` | no leaderboard API endpoint captured | Leaderboard time-range filters. No filter actions captured. |
| `MARKET` | `004` | label text | no leaderboard API endpoint captured | Market-filter label. |
| `All deep markets` | `004` | filter value | no leaderboard API endpoint captured | Market scope for leaderboard. |
| `Your rank` | `004` | label text | no leaderboard API endpoint captured | User-rank field/label. No numeric rank captured. |
| `Search` | `004` | search label/input | no leaderboard API endpoint captured | Leaderboard search. No action captured. |
| `0 wallets` | `004` | integer + noun; empty state | no leaderboard API endpoint captured | Wallet count is zero. Shown as empty leaderboard. |
| `Every wallet across all deep markets, ranked by profit/loss. Profit is realised and marked-to-market, in USD.` | `004` | explanatory copy | no leaderboard API endpoint captured | Defines leaderboard scope and profit/loss definition. No numeric P/L values captured. |

## Observed repository row values

Common display rule: these are all instances of the same row field: `<owner>/<repo>` + space + value to 4 decimal places. No `%` or `$` sign is shown. Rows are sorted descending. The table below enumerates only the row strings/values present in the provided notes; the source says 98 rows exist, but the controls inventory is truncated after `wighawag/hardhat-deploy 0.7299`, so lower rows are not fully enumerated.

| Repository string | Value | Specific selected-state trigger / citation |
|---|---:|---|
| `ethereum/consensus-specs` | `0.8481` | `010` trigger; also list |
| `ethers-io/ethers.js` | `0.8275` | `011` trigger; also list |
| `sigp/lighthouse` | `0.8275` | `012` trigger; also list |
| `status-im/nimbus-eth2` | `0.8262` | `013` trigger; also list |
| `Consensys/gnark-crypto` | `0.8067` | `014` trigger; also list |
| `foundry-rs/foundry` | `0.8034` | `015` trigger; also list |
| `supranational/blst` | `0.8033` | `016` trigger; also list |
| `flashbots/mev-boost` | `0.8028` | `017` trigger; also list |
| `consensys/teku` | `0.8020` | `018` trigger; also list |
| `ethereum/go-ethereum` | `0.7974` | `019` trigger; also list |
| `argotorg/solidity` | `0.7954` | `020` trigger; also list |
| `arkworks-rs/algebra` | `0.7954` | `021` trigger; also list |
| `ethereum/eips` | `0.7946` | `022` trigger; also list |
| `herumi/mcl` | `0.7903` | `023` trigger; also list |
| `nethereum/nethereum` | `0.7903` | `024` trigger; also list |
| `chainsafe/lodestar` | `0.7902` | `025` trigger; also list |
| `argotorg/act` | `0.7884` | `026` trigger; also list |
| `skalenetwork/libBLS` | `0.7828` | `027` trigger; also list |
| `wevm/viem` | `0.7776` | `028` trigger; also list |
| `a16z/halmos` | `0.7741` | `029` trigger; also list |
| `Vectorized/solady` | `0.7734` | `030` trigger; also list |
| `paradigmxyz/reth` | `0.7730` | `031` trigger; also list |
| `argotorg/hevm` | `0.7725` | `032` trigger; also list |
| `ethereum/web3.py` | `0.7719` | `033` trigger; also list |
| `openzeppelin/openzeppelin-contracts` | `0.7698` | `034` trigger; also list |
| `vyperlang/titanoboa` | `0.7695` | `035` trigger; also list |
| `paulmillr/noble-curves` | `0.7692` | `036` trigger; also list |
| `OffchainLabs/prysm` | `0.7689` | `037` trigger; also list |
| `intellij-solidity/intellij-solidity` | `0.7684` | `038` trigger; also list |
| `vyperlang/vyper` | `0.7666` | `039` trigger; also list |
| `ethereum/execution-apis` | `0.7663` | `040` trigger; also list |
| `nomicfoundation/hardhat` | `0.7655` | `041` trigger; also list |
| `erigontech/erigon` | `0.7652` | `042` trigger; also list |
| `argotorg/sourcify` | `0.7629` | list |
| `swiss-knife-xyz/swiss-knife` | `0.7619` | list |
| `ethereum/py_ecc` | `0.7614` | list |
| `evmts/tevm-monorepo` | `0.7611` | list |
| `argotorg/fe` | `0.7602` | list |
| `Certora/CertoraProver` | `0.7595` | list |
| `alloy-rs/alloy` | `0.7594` | list |
| `lambdaclass/ethrex` | `0.7587` | list |
| `apeworx/ape` | `0.7585` | list |
| `ipsilon/evmone` | `0.7585` | list |
| `grandinetech/grandine` | `0.7573` | list |
| `shazow/whatsabi` | `0.7511` | list |
| `lambdaclass/lambda_ethereum_consensus` | `0.7492` | list |
| `flashbots/mev-boost-relay` | `0.7479` | list |
| `erigontech/silkworm` | `0.7474` | list |
| `ethstaker/ethstaker-deposit-cli` | `0.7473` | list |
| `EspressoSystems/jellyfish` | `0.7468` | list |
| `hyperledger/besu` | `0.7450` | list |
| `libp2p/libp2p` | `0.7448` | list |
| `hyperledger-web3j/web3j` | `0.7447` | list |
| `taikoxyz/taiko-mono` | `0.7432` | list |
| `Commit-Boost/commit-boost-client` | `0.7422` | list |
| `OffchainLabs/stylus-sdk-rs` | `0.7393` | list |
| `Cyfrin/aderyn` | `0.7384` | list |
| `nethermindeth/nethermind` | `0.7383` | list |
| `TrueBlocks/trueblocks-core` | `0.7369` | list |
| `wealdtech/ethdo` | `0.7361` | list |
| `holiman/goevmlab` | `0.7356` | list |
| `DefiLlama/DefiLlama-Adapters` | `0.7315` | list |
| `ethdebug/format` | `0.7313` | list |
| `wighawag/hardhat-deploy` | `0.7299` | list; controls inventory truncates after this |
| `LFDT-web3j/web3j` | `0.7294` | `026` (near-duplicate of `hyperledger-web3j/web3j`) |
| `aestus-relay/mev-boost-relay` | `0.6998` | `026` (near-duplicate of `flashbots/mev-boost-relay`) |
| `safe-global/safe-smart-account` | `0.6667` | `026` |
| `succinctlabs/sp1` | `0.6607` | `026` |
| `dappnode/DAppNode` | `0.5665` | `026` |
| `succinctlabs/op-succinct` | `0.5451` | `026` |
| `ethpandaops/checkpointz` | `0.5446` | `026`; lowest listed |

Additional repo-like strings mentioned without a captured value: `ChainSafe/bls`, `NethermindEth/juno`, `OffchainLabs/…` (`026` capitalization/truncation notes). A bare value `0.6250` is mentioned as an example in `026` but is not tied to a repo in the provided notes.

## API endpoints and what each returns

| Endpoint | Observed return / shape | Audit note |
|---|---|---|
| `POST https://lb.drpc.org/optimism/As_mVw7_50IPk85yNYubcezE_O23TT8R8JDnrqRhf0fE` | JSON-RPC object: `{ id: "int:2", jsonrpc: "str:2.0", result: "str:0x455cfe5340615e1" }` | Optimism RPC call; method/params not captured. Not directly identifiable as a user field. Status `200`, hits `104`. |
| `GET https://rpc.walletconnect.org/v1/identity/0x000000000000000000000000000000000000dEaD?sender=0x000000000000000000000000000000000000dEaD&st=appkit&sv=react-wagmi-1.8.2&projectId=dbd73564d393353e4ee73b085c73b59d` | `{ name: None, avatar: None, resolvedAt: "str:2026-10-17T20:04:25.800451569Z" }` | Wallet identity/profile resolution for the displayed address; name/avatar empty. Timestamp is ISO 8601. |
| `GET https://api.web3modal.org/appkit/v1/config?projectId=dbd73564d393353e4ee73b085c73b59d&st=appkit&sv=react-wagmi-1.8.2` | `{ features: [ len=11, { id: "str:multi_wallet", isEnabled: "bool:False", config: "NoneType:None" }, ... ] }` | Wallet-modal/appkit config. Not market data. |
| `GET https://api.web3modal.org/projects/v1/origins?projectId=dbd73564d393353e4ee73b085c73b59d&st=appkit&sv=react-wagmi-1.8.2` | `{ allowedOrigins: [ "len=5", "str:https://deep.seer.pm/" ] }` | Allowed-origin config for wallet modal. |
| `GET https://api.web3modal.org/getAnalyticsConfig?projectId=dbd73564d393353e4ee73b085c73b59d&st=appkit&sv=react-wagmi-1.8.2` | `{ isAnalyticsEnabled: "bool:True", isAppKitAuthEnabled: "bool:False" }` | Wallet-modal analytics/auth config. |
| `GET https://deep.seer.pm/.netlify/functions/get-profiles?addresses=0x000000000000000000000000000000000000dead` | `{ profiles: {} }` | Profile lookup for address; empty. Likely supports displayed wallet/profile, but UI shows no profile content. |
| `GET https://deep.seer.pm/.netlify/functions/get-market-charts?ids=0x6aa9ba4a89cc1f5d854b898ed34f4370a3857585%2C0x6ea039fba3c1a54ed6c5ef04c394dd2a9c26c52a%2C...` | Object keyed by market id, e.g. `"0x6aa9...":{"series":[{"points":[[1790859600,0.200004],[1790951400,0.200004],...]}]}`. Points are `[timestamp, decimal value]`; timestamp appears to be Unix seconds `[inferred]`; values in API example use 6 decimal places. Response was not fully parseable in capture. | Chart series data. UI chart title/copy not in this response. Market-id-to-repository-name mapping is not provided. |
| `GET https://deep.seer.pm/.netlify/functions/get-redeemable?account=0x000000000000000000000000000000000000dEaD` | `{ checkedAt: "int:1792341734", wallets: {}, executors: [] }` | Redeemable positions/executors for account; empty. `checkedAt` appears to be Unix seconds `[inferred]`. |
| `GET https://deep.seer.pm/.netlify/functions/refresh-market-volume?ids=0x5d6a571b0f663c33831e6f81dd3c3f554eca188b%2C0xe263e7febb2ccfe1ebb05f289cf858d3becec83f%2C...` | `{ volumes: { "<marketId>": { "totalVolumeMarket": "str:236.75735312570777 PY_ECC_R3C", "totalVolumeTokens": "str:556.2281493895624", "totalLiquidityMarket": "str:857.2434273558574 PY_ECC_R3C", "totalLiquidityTokens": "str:248.50458551985668" }, ... } }` | Per-market volume/liquidity. Values are decimal **strings**, not rounded. `totalVolumeMarket`/`totalLiquidityMarket` include token/market labels such as `PY_ECC_R3C`, `BLOCKSCOUT_R3C`, `LFDT_WEB3J_R3C`, `MCL_R3C`, `NOBLE_CURVES_R3C`, `ALGEBRA_R3C`, `RBUILDER_R3C`, `SOLHINT_R3C`, `L2BEAT_R3C`, `GNARK_CRYPTO_R3C`, `SOLADY_R3C`, `TAIKO_MONO_R3C`. |

No API endpoint for the leaderboard, leaderboard `0 wallets`, repo-name mapping, aggregate `~$293.82`/`~$929.08`, chart titles/copy, onboarding steps, or empty-state text is present in the provided data model. The closest market-data endpoints are `get-market-charts` and `refresh-market-volume`, but their mapping to the displayed aggregate totals and repo rows is not verifiable from the notes.

## Explicit uncertainties / gaps

- The repository list is reported as **98 rows**, but the provided controls inventory truncates after `wighawag/hardhat-deploy 0.7299`; lower rows are only partially represented by scattered examples. The row table above is exhaustive for the strings/values present in the notes, not for all 98 rows.
- The aggregate totals `~$293.82` and `~$929.08` have no identifiable aggregate API field in the provided data model. `refresh-market-volume` returns per-market `totalVolumeMarket`, `totalVolumeTokens`, `totalLiquidityMarket`, and `totalLiquidityTokens`; the aggregation formula is not shown.
- The displayed repository decimal is called “UP price” and “share of original work” in copy, but no `%` or unit is shown. Its API mapping is likely a chart-series value, but the market-id-to-repo mapping is absent. Treat the 0–1/share interpretation as `[inferred]`.
- Chart axes, ticks, legend, time range, and tooltip values are not captured. Hovering the chart in `003` produced no tooltip content.
- The second chart/explainer is truncated at `DOWN ` in every captured state; the full meaning of DOWN cannot be verified.
- Onboarding starts at step `2`; no step `1` is visible. Onboarding copy says Optimism is the only network and that markets settle in sUSDS, but no step-1 content is captured.
- `0x0000…dEaD` is visible alongside `Connect your wallet`; connected/disconnected status is ambiguous. Clicking the address in `006` leaves the same main screen.
- `No predictions loaded` coexists with a populated repository list and nonzero volume/liquidity. It may refer to the user’s own predictions rather than market data `[inferred]`, but this is not confirmed.
- `Profile` click in `005` shows no profile content and remains on `/`; `Archive` click in `008` shows the same live Round 3 screen; `Refresh volume` in `009` shows no visible change. These controls’ effects are not captured.
- Leaderboard is empty (`0 wallets`) despite copy describing “Every wallet across all deep markets.” No leaderboard API endpoint or numeric P/L rows are captured.
- Repository duplicates/ties are visible: `0.8275` for `ethers-io/ethers.js` and `sigp/lighthouse`; `0.7954` for `argotorg/solidity` and `arkworks-rs/algebra`; `0.7903` for `herumi/mcl` and `nethereum/nethereum`. Near-duplicate repo families are also visible (`hyperledger-web3j/web3j` vs `LFDT-web3j/web3j`; `flashbots/mev-boost-relay` vs `aestus-relay/mev-boost-relay`).
- Inconsistent org capitalization appears in repo strings, e.g. `Consensys/...` vs `consensys/teku`, `ChainSafe/bls` vs `chainsafe/lodestar`, `NethermindEth/juno` vs `nethermindeth/nethermind`, and `OffchainLabs/...` entries.
- No error state and no ended/resolved state are captured. Only `LIVE` and an `Archive` tab are present; archive content is not shown.
- Crawl metadata control/chart/table counts vary across visually identical states (e.g. `controls=124` vs `132` in `005`), but those counts are not user-visible fields and are not included in the main table.