## NOTES CHUNK 1
## Screen inventory
- **STATE 001 `/`**: main “AI Prediction Markets” market screen; shows Round 3 Originality market, volume/liquidity, repository chart/table, wallet/onboarding prompts. Metadata: controls=124, charts=2, tables=2.
- **STATE 002**: clicking “AI Prediction Markets” leaves user on the same main market screen. Metadata unchanged.
- **STATE 003**: hovering the chart leaves same main screen; no tooltip content captured. Metadata unchanged.
- **STATE 004 `/leaderboard`**: leaderboard screen; ranks wallets across “All deep markets” by profit/loss. Metadata: controls=17, charts=0, tables=0. Empty state: “0 wallets”.
- **STATE 005**: clicking “Profile” returns/captures the same main market screen at `/`; no profile content visible. Metadata: controls=132, charts=2, tables=2.
- **STATE 006**: clicking “0x0000…dEaD” leaves same main market screen. Metadata: controls=125, charts=2, tables=2.
- **STATE 007**: clicking “Round 3 · Originality LIVE” leaves same main market screen. Metadata unchanged.
- **STATE 008**: clicking “Archive” leaves same live Round 3 market screen; no archive content visible. Metadata: controls=131, charts=2, tables=2.
- **STATE 009**: clicking “Refresh volume” leaves same main market screen; no visible change. Metadata unchanged.

## Data fields and formats
- Product title: `AI Prediction Markets`; network label: `OPTIMISM` (STATE 001).
- Wallet address: abbreviated hex `0x0000…dEaD` (STATE 001).
- Step labels: integers `2`, `3` (STATE 001); no step `1` visible.
- Round label: `Round 3 · Originality`; status `LIVE` (STATE 001).
- Section heading: `ROUND 3 · ORIGINALITY` (STATE 001).
- `Total volume ~$293.82` — dollar symbol, approximate tilde, 2 decimals (STATE 001).
- `Total liquidity ~$929.08` — dollar symbol, approximate tilde, 2 decimals (STATE 001).
- Repository rows: `owner/repo` string + decimal value with 4 places, e.g. `ethereum/consensus-specs 0.8481`; no `%` or `$` shown on row values (STATE 001).
- Visible repository list runs from `0.8481` down to `0.5446` (STATE 001).
- Leaderboard fields: time filters `1D`, `1W`, `1M`, `All`; market filter `All deep markets`; `Your rank`; `Search`; count `0 wallets` (STATE 004).
- Leaderboard copy defines profit as “realised and marked-to-market, in USD” (STATE 004).

## Charts / graphics
- Chart/graphic titled **“Share of original work over time”**; copy: “Each line is a repository's UP price — the market's estimate of how much of it is original.” Implies line-based chart; no axis labels or tooltip values captured (STATE 001; hover STATE 003).
- Second chart/graphic titled **“Original work per repository”**; copy begins: “Each repository trades as a pair: UP is the share of original work, DOWN” and is truncated (STATE 001). Visual type not captured.
- Metadata reports `charts=2` and `tables=2` on main market states (STATE 001–003, 005–009).

## Controls and observed actions
- `AI Prediction Markets` → same main screen (STATE 002).
- `Leaderboard` → `/leaderboard` screen (STATE 004).
- `Profile` → captured same main screen; no profile panel visible (STATE 005).
- `Guide` → present in nav; no resulting state captured (STATE 001).
- `0x0000…dEaD` → same main screen (STATE 006).
- `Connect your wallet` → present; no resulting state captured (STATE 001).
- `Create trade wallet` → present; no resulting state captured (STATE 001).
- `Round 3 · Originality LIVE` → same main screen (STATE 007).
- `Archive` → same live market screen; no archive content captured (STATE 008).
- `Refresh volume` → same screen; no visible change (STATE 009).
- `Hide all` → present below repository list; no resulting state captured (STATE 001).
- `Upload predictions` → present; no resulting state captured (STATE 001).
- Chart hover → no tooltip/content captured (STATE 003).
- Leaderboard controls present: `1D`, `1W`, `1M`, `All`, `MARKET`/`All deep markets`, `Your rank`, `Search`; no filter actions captured (STATE 004).

## Wallet-gated / empty / ended / error states
- Wallet prompt visible: `Connect your wallet`; address `0x0000…dEaD` also visible simultaneously (STATE 001).
- Onboarding steps visible: `2 Create a trade wallet`, `3 Add sUSDS` (STATE 001).
- Empty state on main market: `No predictions loaded`; `Upload predictions` control present (STATE 001).
- Empty leaderboard: `0 wallets` (STATE 004).
- Live state: `LIVE` badge on `Round 3 · Originality` (STATE 001).
- `Archive` nav exists, but no ended/archive state content captured (STATE 008).
- No explicit error state captured in any state.

## Concept-explaining copy
- “Optimism is the only network these contests run on.” (STATE 001)
- “Create a trade wallet — A contract you own that batches hundreds of trades into one run.” (STATE 001)
- “Add sUSDS — Every market settles in it, and it earns Sky savings yield meanwhile.” (STATE 001)
- “Each line is a repository's UP price — the market's estimate of how much of it is original.” (STATE 001)
- “Each repository trades as a pair: UP is the share of original work, DOWN” — truncated (STATE 001).
- Leaderboard: “Every wallet across all deep markets, ranked by profit/loss. Profit is realised and marked-to-market, in USD.” (STATE 004)

## Odd / confusing observations
- Onboarding starts at step `2`; no step `1` visible (STATE 001).
- `Connect your wallet` is shown while a wallet address `0x0000…dEaD` is already displayed (STATE 001).
- `Profile` click produces no visible profile content and remains at `/` (STATE 005).
- `Archive` click shows same live Round 3 market, not archive content (STATE 008).
- `Round 3 · Originality LIVE`, wallet-address, and `Refresh volume` clicks produce no visible content change (STATE 006, 007, 009).
- Chart values are four-decimal numbers with no explicit unit/percent sign, while copy calls them “UP price” and “share” (STATE 001).
- Lower explanation is cut off at “DOWN” (STATE 001).
- `No predictions loaded` / `Upload predictions` appears alongside a populated repository chart/list; relationship unclear (STATE 001).
- Leaderboard is empty (`0 wallets`) despite describing “Every wallet across all deep markets” (STATE 004).
- Metadata control counts vary for clicks that show visually identical market content, e.g. Profile=132 vs main=124 (STATE 001 vs STATE 005).

## NOTES CHUNK 2
## Shared capture (STATE 010–017)

- **Screen purpose:** “AI Prediction Markets” page for **Round 3 · Originality**, showing a ranked list of Ethereum repositories and market-implied “share of original work”; status **LIVE**, with an **Archive** tab. `STATE 010–017`
- **Network:** **OPTIMISM** badge; copy says “Optimism is the only network these contests run on.” `STATE 010–017`
- **Top nav/links:** **Leaderboard**, **Profile**, **Guide**. `STATE 010–017`
- **Wallet area:** truncated address **0x0000…dEaD** plus **Connect your wallet** button/control. `STATE 010–017`
- **Onboarding steps shown:**
  - **2 Create a trade wallet** — copy: “A contract you own that batches hundreds of trades into one run.” Control: **Create trade wallet**. `STATE 010–017`
  - **3 Add sUSDS** — copy: “Every market settles in it, and it earns Sky savings yield meanwhile.” `STATE 010–017`
- **Aggregate metrics:**
  - **Total volume ~$293.82** — USD, approximate, 2 decimals. `STATE 010–017`
  - **Total liquidity ~$929.08** — USD, approximate, 2 decimals. `STATE 010–017`
- **Ranked repository list:** 98 repository rows; each row shows repository name and a decimal value to 4 dp. Values range from **0.8481** (`ethereum/consensus-specs`) to **0.5446** (`ethpandaops/checkpointz`). `STATE 010–017`
- **Chart 1:** **“Share of original work over time”** — line chart; explanatory copy: “Each line is a repository's UP price — the market's estimate of how much of it is original.” Axes, time range, legend, and line detail are not exposed in the capture. `STATE 010–017`
- **Chart/graphic 2 / section:** **“ORIGINALITY — Original work per repository”**; copy begins: “Each repository trades as a pair: UP is the share of original work, DOWN …” and is truncated in the capture. Full meaning/remaining copy cannot be verified. `STATE 010–017`
- **Controls:**
  - **Connect your wallet** — wallet connection control. `STATE 010–017`
  - **Create trade wallet** — button. `STATE 010–017`
  - Repository rows act as clickable buttons/selectors; clicking each changes the page/title trigger to that repo. `STATE 010–017`
  - **Hide all** — label present; observed effect not captured. `STATE 010–017`
  - **Upload predictions** — upload control; observed result not captured. `STATE 010–017`
  - **Archive** — tab/label present; archive contents not shown. `STATE 010–017`
- **Empty/state messaging:** **“No predictions loaded”** appears near **Upload predictions**. `STATE 010–017`
- **Ended/error states:** no ended, error, or failure state is shown in these captures; round status is **LIVE**. `STATE 010–017`
- **Concept copy:**
  - Trade wallet batches “hundreds of trades into one run.” `STATE 010–017`
  - sUSDS: “Every market settles in it, and it earns Sky savings yield meanwhile.” `STATE 010–017`
  - UP price is described as the market’s estimate of how much of a repository is original. `STATE 010–017`

## State-specific selected repo/value

| STATE | Page/selected repo | Value | Trigger |
|---|---|---:|---|
| `STATE 010` | ethereum/consensus-specs | 0.8481 | click button “ethereum/consensus-specs 0.8481” on `/` |
| `STATE 011` | ethers-io/ethers.js | 0.8275 | click button “ethers-io/ethers.js 0.8275” on `/` |
| `STATE 012` | sigp/lighthouse | 0.8275 | click button “sigp/lighthouse 0.8275” on `/` |
| `STATE 013` | status-im/nimbus-eth2 | 0.8262 | click button “status-im/nimbus-eth2 0.8262” on `/` |
| `STATE 014` | Consensys/gnark-crypto | 0.8067 | click button “Consensys/gnark-crypto 0.8067” on `/` |
| `STATE 015` | foundry-rs/foundry | 0.8034 | click button “foundry-rs/foundry 0.8034” on `/` |
| `STATE 016` | supranational/blst | 0.8033 | click button “supranational/blst 0.8033” on `/` |
| `STATE 017` | flashbots/mev-boost | 0.8028 | click button “flashbots/mev-boost 0.8028” on `/` |

## Odd / confusing

- Onboarding numbering starts at **“2”**; step 1 is not shown. `STATE 010–017`
- Wallet address **0x0000…dEaD** is displayed while **Connect your wallet** is still present; relationship/gating state is ambiguous. `STATE 010–017`
- **“No predictions loaded”** appears despite visible markets/prices and volume/liquidity metrics. `STATE 010–017`
- The **“Original work per repository”** explanatory sentence is truncated mid-copy at “DOWN …”. `STATE 010–017`
- Metadata reports **124 controls, 2 charts, 2 tables**, but the text capture exposes only limited chart axes/legend/control labels. `STATE 010–017`
- Duplicate value **0.8275** appears for `ethers-io/ethers.js` and `sigp/lighthouse`. `STATE 011–012`
- Round has **LIVE** status but no visible end time or resolution details. `STATE 010–017`

## NOTES CHUNK 3
**Scope:** STATE 018–025 are the same screen at `https://deep.seer.pm/` after clicking different repository buttons; visible page content is identical across all eight captures. Capture metadata on all: `controls=124 charts=2 tables=2` (STATE 018–025).

**Trigger mapping**
| STATE | Trigger |
|---|---|
| 018 | click button “consensys/teku 0.8020” |
| 019 | click button “ethereum/go-ethereum 0.7974” |
| 020 | click button “argotorg/solidity 0.7954” |
| 021 | click button “arkworks-rs/algebra 0.7954” |
| 022 | click button “ethereum/eips 0.7946” |
| 023 | click button “herumi/mcl 0.7903” |
| 024 | click button “nethereum/nethereum 0.7903” |
| 025 | click button “chainsafe/lodestar 0.7902” |

**Screen / purpose**
- App title “AI Prediction Markets”; network label “OPTIMISM”; nav: “Leaderboard”, “Profile”, “Guide” (STATE 018–025).
- Contest screen for “Round 3 · Originality”, with “LIVE” status and an “Archive” tab/control (STATE 018–025).
- Main heading: “ROUND 3 · ORIGINALITY” (STATE 018–025).

**Wallet / onboarding**
- Header shows truncated account-like string `0x0000…dEaD` and a “Connect your wallet” button (STATE 018–025).
- Wallet/onboarding copy: “Optimism is the only network these contests run on.” (STATE 018–025).
- Step “2” — “Create a trade wallet”; explanatory copy: “A contract you own that batches hundreds of trades into one run.”; control: “Create trade wallet” (STATE 018–025).
- Step “3” — “Add sUSDS”; explanatory copy: “Every market settles in it, and it earns Sky savings yield meanwhile.” No separate Add button label visible in capture (STATE 018–025).
- Visible onboarding numbering starts at “2”; no step “1” label is captured (STATE 018–025).

**Data fields / formats**
- “Total volume ~$293.82”; format: approximate USD, tilde prefix, dollar sign, two decimals (STATE 018–025).
- “Total liquidity ~$929.08”; same approximate USD format (STATE 018–025).
- Repository list/leaderboard: each row is a repository identifier string followed by a numeric UP price with four decimal places, e.g. `ethereum/consensus-specs 0.8481`, `ethers-io/ethers.js 0.8275`, …, `ethpandaops/checkpointz 0.5446` (STATE 018–025).
- List is ordered descending by displayed UP value, from `0.8481` to `0.5446`; no `%` sign or unit is displayed on the values (STATE 018–025).
- Clicked values are present in the list: `consensys/teku 0.8020` (STATE 018), `ethereum/go-ethereum 0.7974` (STATE 019), `argotorg/solidity 0.7954` (STATE 020), `arkworks-rs/algebra 0.7954` (STATE 021), `ethereum/eips 0.7946` (STATE 022), `herumi/mcl 0.7903` (STATE 023), `nethereum/nethereum 0.7903` (STATE 024), `chainsafe/lodestar 0.7902` (STATE 025).
- Ties visible: `argotorg/solidity` and `arkworks-rs/algebra` both `0.7954`; `herumi/mcl` and `nethereum/nethereum` both `0.7903` (STATE 020–024).

**Charts / graphics**
- Chart panel title: “Share of original work over time”; explanatory copy: “Each line is a repository's UP price — the market's estimate of how much of it is original.” Described as a line chart, but no axes, timestamps, legend, or plotted lines are visible in the capture text (STATE 018–025).
- Second panel title: “ORIGINALITY” / “Original work per repository”; explanatory copy begins: “Each repository trades as a pair: UP is the share of original work, DOWN” and is truncated in the capture (STATE 018–025).
- Capture metadata reports `charts=2` and `tables=2`; visible chart/table internals are limited to headings, copy, and the repository list (STATE 018–025).

**Controls**
- Nav controls: “Leaderboard”, “Profile”, “Guide” (STATE 018–025).
- Wallet controls: “Connect your wallet” (STATE 018–025).
- Onboarding control: “Create trade wallet” (STATE 018–025).
- Round controls/tabs: “Round 3 · Originality”, “LIVE”, “Archive” (STATE 018–025).
- List/table controls: repository buttons such as “consensys/teku 0.8020” etc.; “Hide all” (STATE 018–025).
- Prediction upload area: “No predictions loaded”; control “Upload predictions” (STATE 018–025).

**Gated / empty / ended / error states**
- Wallet-gated/disconnected cue: “Connect your wallet” is shown, while a truncated `0x0000…dEaD` address is also displayed; connection state is ambiguous in the capture (STATE 018–025).
- Empty state: “No predictions loaded” with “Upload predictions” control (STATE 018–025).
- Live state: “LIVE” is shown for Round 3 (STATE 018–025).
- Archive state/tab exists but is not selected in the captures (STATE 018–025).
- No error state and no ended-state message are visible (STATE 018–025).

**Concept-explaining copy**
- “Optimism is the only network these contests run on.” (STATE 018–025).
- Trade wallet: “A contract you own that batches hundreds of trades into one run.” (STATE 018–025).
- sUSDS: “Every market settles in it, and it earns Sky savings yield meanwhile.” (STATE 018–025).
- UP price: “the market's estimate of how much of it is original” (STATE 018–025).
- Market pairing: “Each repository trades as a pair: UP is the share of original work, DOWN …” (truncated) (STATE 018–025).

**Odd / confusing**
- Onboarding numbering begins at “2”, with no visible step “1” (STATE 018–025).
- Truncated wallet address `0x0000…dEaD` appears alongside “Connect your wallet”, making the actual connection status unclear (STATE 018–025).
- Clicking different repository buttons in STATE 018–025 produces no visible change in captured page text; no selected-repository detail panel is visible (STATE 018–025).
- Second chart/copy is truncated at “DOWN” in every capture (STATE 018–025).
- Near-duplicate repository families appear, e.g. `hyperledger-web3j/web3j` vs `LFDT-web3j/web3j`, and `flashbots/mev-boost-relay` vs `aestus-relay/mev-boost-relay` (STATE 018–025).
- “Hide all” appears near the repository list while a separate “No predictions loaded” empty state is also shown (STATE 018–025).

## NOTES CHUNK 4
# AUDIT NOTES — deep.seer.pm (STATE 026–033)

## Capture-level observation (applies to all 8 states)
- STATE 026–033 are triggered by clicking different repo buttons (argotorg/act 0.7884, skalenetwork/libBLS 0.7828, wevm/viem 0.7776, a16z/halmos 0.7741, Vectorized/solady 0.7734, paradigmxyz/reth 0.7730, argotorg/hevm 0.7725, ethereum/web3.py 0.7719) — but the captured DOM text is **byte-identical across all eight** (same list, same totals, same truncated second chart caption). No repo-detail panel, order book, or trade ticket appears in any capture. Flag as odd: click does not visibly change captured content. (STATE 026–033)

## Screens & purpose
- Single screen: "AI Prediction Markets" front-end on **OPTIMISM**; a round-based repo-"originality" prediction contest. Tabs: "Round 3 · Originality", "LIVE", "Archive". (STATE 026)
- Global nav: Leaderboard, Profile, Guide (no content for these captured). (STATE 026)
- Page = onboarding checklist (steps 2–3) + market-list/leaderboard of ~98 repos + 2 charts. (STATE 026)
- Metadata per state: `controls=124 charts=2 tables=2`. (STATE 026–033)

## Data fields (with unit/format)
- Wallet address: truncated `0x0000…dEaD` (0x + 4 hex … 4 hex, ellipsis). Label "Connect your wallet" beside it. (STATE 026)
- Round label: "Round 3 · Originality"; status tag "LIVE"; separate "Archive" link. (STATE 026)
- Total volume: `~$293.82` — USD, tilde = approximate, 2 dp. (STATE 026)
- Total liquidity: `~$929.08` — USD, tilde, 2 dp. (STATE 026)
- Repo rows: `<org>/<repo>` + price, decimal 0–1 at **4 decimal places** (e.g. 0.8481, 0.6250, 0.5665). Highest listed: ethereum/consensus-specs 0.8481; lowest: ethpandaops/checkpointz 0.5446. (STATE 026)
- 98 repo/price rows present; rows appear sorted descending by price. (STATE 026)
- Duplicate values (different repos): ethers-io/ethers.js & sigp/lighthouse both 0.8275; argotorg/solidity & arkworks-rs/algebra both 0.7954; herumi/mcl & nethereum/nethereum both 0.7903. (STATE 026)

Notable rows (price): ethereum/consensus-specs 0.8481 · ethers-io/ethers.js 0.8275 · sigp/lighthouse 0.8275 · status-im/nimbus-eth2 0.8262 · Consensys/gnark-crypto 0.8067 · foundry-rs/foundry 0.8034 · supranational/blst 0.8033 · flashbots/mev-boost 0.8028 · consensys/teku 0.8020 · ethereum/go-ethereum 0.7974 · argotorg/solidity 0.7954 · arkworks-rs/algebra 0.7954 · ethereum/eips 0.7946 · herumi/mcl 0.7903 · nethereum/nethereum 0.7903 · chainsafe/lodestar 0.7902 · argotorg/act 0.7884 · skalenetwork/libBLS 0.7828 · wevm/viem 0.7776 · a16z/halmos 0.7741 · Vectorized/solady 0.7734 · paradigmxyz/reth 0.7730 · argotorg/hevm 0.7725 · ethereum/web3.py 0.7719 … safe-global/safe-smart-account 0.6667 · succinctlabs/sp1 0.6607 · dappnode/DAppNode 0.5665 · succinctlabs/op-succinct 0.5451 · ethpandaops/checkpointz 0.5446. (STATE 026)

## Charts / graphics
1. "**Share of original work over time**" — line chart; caption: "Each line is a repository's UP price — the market's estimate of how much of it is original." Axes/legend/time range not captured in text; ~98 series implied by list. (STATE 026)
2. Section header "**ORIGINALITY**" / chart "**Original work per repository**" — caption truncated in capture: "Each repository trades as a pair: UP is the share of original work, DOWN …" (pair structure: UP = original share, DOWN = inverse, inferred only from truncated copy). (STATE 026)
- Chart x/y axis labels, ticks, and time window are **absent from the capture** — cannot verify scale. (STATE 026)

## Controls & actions
- "Connect your wallet" — wallet connect entry point. (STATE 026)
- "Create trade wallet" — button under step 2. (STATE 026)
- Repo rows/buttons (each labelled `<repo> <price>`, e.g. "argotorg/act 0.7884") — clicking one is the trigger for STATE 026–033; effect not observable in text capture. (STATE 026–033)
- "Hide all" — bulk toggle for all series/rows (presumably hides chart lines or list). (STATE 026)
- "Upload predictions" — next to the "No predictions loaded" empty state. (STATE 026)
- "LIVE" / "Archive" — round status toggle between active and past rounds. (STATE 026)
- 124 controls reported vs 98 repo buttons + ~10 named controls in text ⇒ ~26 controls not rendered in the text capture (chart toggles, sort, per-row expand, etc. — unidentified). (STATE 026)

## Wallet-gating / empty / error states
- Wallet-gated: header shows address placeholder `0x0000…dEaD` with "Connect your wallet" — page renders market data and charts while unconnected. (STATE 026)
- Onboarding step 2: "Create a trade wallet — A contract you own that batches hundreds of trades into one run." (STATE 026)
- Step 3: "Add sUSDS — Every market settles in it, and it earns Sky savings yield meanwhile." ⇒ markets settle in sUSDS; sUSDS accrues "Sky savings yield". (STATE 026)
- Network restriction copy: "Optimism is the only network these contests run on." (STATE 026)
- Empty state: "**No predictions loaded**" + "Upload predictions" button — shown simultaneously with a populated 98-repo list and $293.82 volume (confusing: suggests the user's own predictions/portfolio are empty, not the market). (STATE 026)
- No error state observed in any capture. (STATE 026–033)

## Concept-explaining copy
- "Each line is a repository's UP price — the market's estimate of how much of it is original." (STATE 026)
- "Each repository trades as a pair: UP is the share of original work, DOWN …" (truncated). (STATE 026)
- "A contract you own that batches hundreds of trades into one run." (trade wallet). (STATE 026)
- "Every market settles in it, and it earns Sky savings yield meanwhile." (sUSDS). (STATE 026)
- "Optimism is the only network these contests run on." (STATE 026)

## Odd / confusing
- Onboarding numbering jumps from implicitly-missing step 1 to "2" and "3"; step 1 not present in capture. (STATE 026)
- Eight distinct clicks produce identical captures — no selected-state highlight or detail view visible. (STATE 026–033)
- Second chart caption cut off mid-sentence ("DOWN ") in all states. (STATE 026–033)
- "No predictions loaded" coexists with populated market list and nonzero totals. (STATE 026)
- Possible duplicate/near-duplicate repo entries: `LFDT-web3j/web3j` (0.7294) and `hyperledger-web3j/web3j` (0.7447); `flashbots/mev-boost-relay` (0.7479) and `aestus-relay/mev-boost-relay` (0.6998). (STATE 026)
- Inconsistent org capitalisation across rows: `Consensys/…` vs `consensys/teku`; `ChainSafe/bls` vs `chainsafe/lodestar`; `NethermindEth/juno` vs `nethermindeth/nethermind`; `OffchainLabs/…`. (STATE 026)
- Volume/liquidity are prefixed "~" (approximate) with no source or update timestamp shown. (STATE 026)

## NOTES CHUNK 5
## Audit notes — STATES 034–041

**Scope / screen purpose**
- All eight captures are the same `https://deep.seer.pm/` screen after clicking a repository row button; only the triggered/selected repository differs. Layout, totals, list, copy, and states are otherwise identical in the capture. [034–041]
- Screen is labeled **“AI Prediction Markets”** on **OPTIMISM**; it presents **Round 3 · Originality** as **LIVE** and includes nav to **Leaderboard / Profile / Guide**. [034–041]
- Purpose shown: prediction/trading view for “share of original work” per repository, plus onboarding prompts for a trade wallet and sUSDS. [034–041]
- Crawl metadata per state: `controls=124`, `charts=2`, `tables=2`. [034–041]

**Data fields / formats**
- Network label: **OPTIMISM** — text label. [034–041]
- Wallet/account: **0x0000…dEaD** — truncated hex address. [034–041]
- Round label: **Round 3 · Originality**; status **LIVE**. [034–041]
- Total volume: **~$293.82** — USD, approximate (`~`), 2 decimals. [034–041]
- Total liquidity: **~$929.08** — USD, approximate (`~`), 2 decimals. [034–041]
- Repository list: **98 rows** (by count), each field = repository name string + decimal price to **4 decimal places**; no `%` sign shown. Examples: top `ethereum/consensus-specs 0.8481`; bottom `ethpandaops/checkpointz 0.5446`. [034–041]
- Selected-row title format: `<repository> <4-dp decimal>`, matching the row value. [034–041]
- Empty-state label: **“No predictions loaded”**. [034–041]
- Truncated explainer text: **“Each repository trades as a pair: UP is the share of original work, DOWN ”** — capture cuts off after “DOWN”. [034–041]

**State-specific selected row**
- 034: `openzeppelin/openzeppelin-contracts 0.7698` [034]
- 035: `vyperlang/titanoboa 0.7695` [035]
- 036: `paulmillr/noble-curves 0.7692` [036]
- 037: `OffchainLabs/prysm 0.7689` [037]
- 038: `intellij-solidity/intellij-solidity 0.7684` [038]
- 039: `vyperlang/vyper 0.7666` [039]
- 040: `ethereum/execution-apis 0.7663` [040]
- 041: `nomicfoundation/hardhat 0.7655` [041]

**Charts / graphics**
- Visible chart title: **“Share of original work over time”**. Subtitle: **“Each line is a repository's UP price — the market's estimate of how much of it is original.”** Shows multiple repository lines over time; axis labels/units are not visible in the capture. [034–041]
- Metadata says 2 charts, but the capture exposes only one clear chart title. A second section is labeled **“ORIGINALITY / Original work per repository”** with the truncated UP/DOWN explainer; its actual graphic/axis is not legible in the text capture. [034–041]

**Controls**
- **Leaderboard**, **Profile**, **Guide** — top-nav controls. [034–041]
- **Connect your wallet** — wallet connection control. [034–041]
- **Create trade wallet** — onboarding button under step 2. [034–041]
- **LIVE** and **Archive** — tab controls. [034–041]
- Repository row buttons — 98 clickable rows labeled repository + price; clicking one produces the corresponding STATE title/trigger. [034–041]
- **Hide all** — labeled control; exact effect not captured. [034–041]
- **Upload predictions** — labeled control near the “No predictions loaded” empty state; dialog/result not captured. [034–041]

**Wallet-gated / empty / ended / error states**
- Wallet prompts visible: **“Connect your wallet”** plus onboarding steps for creating a trade wallet and adding sUSDS. [034–041]
- Empty state visible: **“No predictions loaded”** with **“Upload predictions”**. [034–041]
- No ended state observed; only **LIVE** and an **Archive** tab with no archive content captured. [034–041]
- No error state observed. [034–041]

**Concept copy**
- **“Optimism is the only network these contests run on.”** [034–041]
- Step 2: **“Create a trade wallet”** — **“A contract you own that batches hundreds of trades into one run.”** [034–041]
- Step 3: **“Add sUSDS”** — **“Every market settles in it, and it earns Sky savings yield meanwhile.”** [034–041]
- Chart explainer: each line is a repository’s **UP price**, “the market’s estimate of how much of it is original.” [034–041]
- Originality explainer starts: **“Each repository trades as a pair: UP is the share of original work, DOWN …”** [034–041]

**Odd / confusing**
- Truncated wallet address **0x0000…dEaD** appears alongside **“Connect your wallet”**, so connected/disconnected status is ambiguous. [034–041]
- Onboarding steps begin at **2**; no step 1 is visible. [034–041]
- **“No predictions loaded”** appears while repository prices, chart, and totals are visible; the relationship between “predictions” and market data is unclear. [034–041]
- Repository “share” values are shown as bare decimals without `%` or explicit 0–1 unit. [034–041]
- **“Hide all”** is ambiguous: it does not state what is hidden. [034–041]
- Copy is cut off at **“DOWN ”**. [034–041]
- Metadata reports `charts=2` and `controls=124`, but only one chart title and a subset of named controls are legible in the capture. [034–041]
- Total volume/liquidity are approximate and have no stated timeframe. [034–041]

## NOTES CHUNK 6
## STATE 042 — `erigontech/erigon 0.7652`

- **Screen