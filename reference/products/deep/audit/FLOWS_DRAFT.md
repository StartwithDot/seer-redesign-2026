# deep: FLOWS DRAFT (DeepSeek)

# FLOWS DRAFT — `deep` (`https://deep.seer.pm/`)

## Legend
- `[observed STATE n]` — directly captured in supplied crawl notes/states.
- `[observed control; edge]` — control is in the controls inventory and/or FLOWS edge, but the resulting screen may be same/unchanged.
- `[inferred]` — derived from copy/control order/API only; not a captured resulting state.
- `[unobservable: reason]` — no state/dialog/detail captured, with reason.

Scope: all supplied captures are desktop. `STATE 042` notes are truncated. No successful wallet connection, trade ticket, order book, sUSDS-add control, upload dialog, profile panel, archive content, error state, or mobile state was captured.

---

## F01. Initial load — main market screen
**Preconditions**
- Wallet: ambiguous — `0x0000…dEaD` and `Connect your wallet` are both visible. `[observed STATE 001]`
- Chain: `OPTIMISM` label visible. `[observed STATE 001]`
- Funds: none observed for viewing. `[observed STATE 001]`
- Role: visitor/observer. `[inferred from public rendering]`

**Steps**
1. Open `https://deep.seer.pm/`. `[observed STATE 001]`
2. Confirm title `AI Prediction Markets`, round `Round 3 · Originality`, status `LIVE`, `Total volume ~$293.82`, `Total liquidity ~$929.08`. `[observed STATE 001]`
3. Observe repository list: `98` rows, from `ethereum/consensus-specs 0.8481` down to `ethpandaops/checkpointz 0.5446`; values are 4-decimal, no `%`/`$` on row values. `[observed STATE 001]`
4. Observe wallet/onboarding area: `Connect your wallet`, `0x0000…dEaD`, `2 Create a trade wallet`, `Create trade wallet`, `3 Add sUSDS`, `No predictions loaded`, `Upload predictions`. `[observed STATE 001]`
5. Observe charts/sections: `Share of original work over time`; `ORIGINALITY` / `Original work per repository`; second caption truncated at `“DOWN …”`. `[observed STATE 001]`

**Result:** main market screen at `/`. `[observed STATE 001]`  
**Unobservable:** loading/error/ended/mobile states not captured.

---

## F02. Navigate to `AI Prediction Markets` (self-navigation)
**Preconditions:** same as F01.

**Steps**
1. From `/`, click `AI Prediction Markets`. `[observed control; edge]`
2. Captured result remains the same main market screen; metadata unchanged. `[observed STATE 002]`

**Result:** same `/` main screen. `[observed STATE 002]`  
**Unobservable:** no visible content change captured.

---

## F03. View Leaderboard
**Preconditions**
- Wallet: not required to view in capture. `[observed STATE 004]`
- Chain: no leaderboard-specific chain control captured. `[observed STATE 004]`
- Funds: none observed. `[observed STATE 004]`
- Role: viewer/competitor. `[inferred]`

**Steps**
1. From `/`, click `Leaderboard`. `[observed control; edge]`
2. Land on `/leaderboard`. `[observed STATE 004]`
3. Observe controls: `1D`, `1W`, `1M`, `All`, `MARKET` / `All deep markets`, `Your rank`, `Search`. `[observed STATE 004]`
4. Observe empty state `0 wallets` and copy: “Every wallet across all deep markets, ranked by profit/loss. Profit is realised and marked-to-market, in USD.” `[observed STATE 004]`

**Result:** `/leaderboard` screen with `0 wallets`. `[observed STATE 004]`  
**Unobservable:** no ranked rows, filter actions, or `Your rank` data captured.

---

## F04. Open `Profile`
**Preconditions**
- Wallet: none observed to click; profile likely account-dependent. `[inferred]`
- Chain: `OPTIMISM` shown on main. `[observed STATE 001]`
- Funds: none observed. `[observed STATE 001]`
- Role: visitor/connected user. `[inferred]`

**Steps**
1. From `/`, click `Profile`. `[observed control; edge]`
2. Captured result remains same main market screen at `/`; no profile content visible. `[observed STATE 005]`

**Result:** no profile panel/route content captured. `[observed STATE 005]`  
**Unobservable:** no profile content; control count differs (`132` vs `124`) but no visible panel.

---

## F05. Click wallet address `0x0000…dEaD`
**Preconditions**
- Wallet: address visible while `Connect your wallet` also visible; connection state ambiguous. `[observed STATE 001]`
- Chain: `OPTIMISM` shown. `[observed STATE 001]`
- Funds: none observed. `[observed STATE 001]`
- Role: wallet holder/visitor. `[inferred]`

**Steps**
1. Click `0x0000…dEaD`. `[observed control; edge]`
2. Captured result remains same main market screen. `[observed STATE 006]`

**Result:** no account menu/detail captured. `[observed STATE 006]`  
**Unobservable:** no account menu/detail/wallet-state change captured.

---

## F06. Click round label `Round 3 · Originality LIVE`
**Preconditions:** same as F01.

**Steps**
1. Click `Round 3 · Originality LIVE`. `[observed control; edge]`
2. Captured result remains same main market screen; no visible content change. `[observed STATE 007]`

**Result:** same live Round 3 market screen. `[observed STATE 007]`  
**Unobservable:** no round-detail/change captured.

---

## F07. Open `Archive`
**Preconditions**
- Wallet: none observed. `[observed STATE 001]`
- Chain: `OPTIMISM` shown. `[observed STATE 001]`
- Funds: none observed. `[observed STATE 001]`
- Role: visitor. `[inferred]`

**Steps**
1. From live Round 3 screen, click `Archive`. `[observed control; edge]`
2. Captured result remains same live Round 3 market screen; no archive content visible. `[observed STATE 008]`

**Result:** no archive/past-round content captured. `[observed STATE 008]`  
**Unobservable:** archive-selected/ended-round content not captured.

---

## F08. `Refresh volume`
**Preconditions**
- Wallet: none observed. `[observed STATE 001]`
- Chain: `OPTIMISM` shown. `[observed STATE 001]`
- Funds: none observed. `[observed STATE 001]`
- Role: visitor. `[inferred]`

**Steps**
1. Click `Refresh volume`. `[observed control; edge]`
2. Captured result remains same main screen; no visible change. `[observed STATE 009]`
3. Data model shows `GET /refresh-market-volume` status `200`, hits `2`. `[inferred from DATA MODEL only]`

**Result:** no visible UI change captured. `[observed STATE 009]`  
**Unobservable:** no loading indicator or updated totals captured.

---

## F09. Hover chart
**Preconditions**
- Wallet: none observed. `[observed STATE 001]`
- Chain: `OPTIMISM` shown. `[observed STATE 001]`
- Funds: none observed. `[observed STATE 001]`
- Role: observer. `[inferred]`

**Steps**
1. On main screen, hover chart/canvas region titled `Share of original work over time`; canvas size `942x364` at `y=489`. `[observed STATE 001; hover STATE 003]`
2. No tooltip content was captured. `[unobservable: no tooltip content captured]`

**Result:** same main screen; no tooltip content. `[observed STATE 003]`  
**Unobservable:** axes, legend, time range, plotted line detail, tooltip values not exposed.

---

## F10. Search outcomes
**Preconditions**
- Wallet: none observed. `[observed STATE 001]`
- Chain: `OPTIMISM` shown. `[observed STATE 001]`
- Funds: none observed. `[observed STATE 001]`
- Role: visitor/observer. `[inferred]`

**Steps**
1. From `/`, focus input `Search outcomes`. `[observed control STATE 001]`
2. Enter `e`. `[observed edge in FLOWS: “search input: e (new state 043)”]`
3. FLOWS edge returns to `/`. `[observed edge only; no STATE 043 notes]`

**Result:** same route `/`. `[observed edge STATE 043 via FLOWS; no detailed notes]`  
**Unobservable:** no `STATE 043` notes; no filtered list/content captured.

---

## F11. Select a repository row
**Preconditions**
- Wallet: none observed to browse/select. `[observed STATE 001; STATE 010–041]`
- Chain: `OPTIMISM` shown. `[observed STATE 001]`
- Funds: none observed. `[observed STATE 001]`
- Role: visitor/observer. `[inferred]`

**Steps**
1. From `/`, click a repository row button labelled `<owner>/<repo> <4-dp value>`. `[observed controls; edges]`
2. Captured result remains `/`; selected-repo trigger/title is recorded, but no repository-detail panel, order book, or trade ticket is visible. `[observed STATE 010–042]`

**Result:** same main market screen; no visible detail/trade UI. `[observed STATE 010–042]`  
**Unobservable:** selected-repo detail, order book, trade ticket not captured.

**Observed row-click mapping**

| State | Exact clicked control label |
|---|---|
| `STATE 010` | `ethereum/consensus-specs 0.8481` |
| `STATE 011` | `ethers-io/ethers.js 0.8275` |
| `STATE 012` | `sigp/lighthouse 0.8275` |
| `STATE 013` | `status-im/nimbus-eth2 0.8262` |
| `STATE 014` | `Consensys/gnark-crypto 0.8067` |
| `STATE 015` | `foundry-rs/foundry 0.8034` |
| `STATE 016` | `supranational/blst 0.8033` |
| `STATE 017` | `flashbots/mev-boost 0.8028` |
| `STATE 018` | `consensys/teku 0.8020` |
| `STATE 019` | `ethereum/go-ethereum 0.7974` |
| `STATE 020` | `argotorg/solidity 0.7954` |
| `STATE 021` | `arkworks-rs/algebra 0.7954` |
| `STATE 022` | `ethereum/eips 0.7946` |
| `STATE 023` | `herumi/mcl 0.7903` |
| `STATE 024` | `nethereum/nethereum 0.7903` |
| `STATE 025` | `chainsafe/lodestar 0.7902` |
| `STATE 026` | `argotorg/act 0.7884` |
| `STATE 027` | `skalenetwork/libBLS 0.7828` |
| `STATE 028` | `wevm/viem 0.7776` |
| `STATE 029` | `a16z/halmos 0.7741` |
| `STATE 030` | `Vectorized/solady 0.7734` |
| `STATE 031` | `paradigmxyz/reth 0.7730` |
| `STATE 032` | `argotorg/hevm 0.7725` |
| `STATE 033` | `ethereum/web3.py 0.7719` |
| `STATE 034` | `openzeppelin/openzeppelin-contracts 0.7698` |
| `STATE 035` | `vyperlang/titanoboa 0.7695` |
| `STATE 036` | `paulmillr/noble-curves 0.7692` |
| `STATE 037` | `OffchainLabs/prysm 0.7689` |
| `STATE 038` | `intellij-solidity/intellij-solidity 0.7684` |
| `STATE 039` | `vyperlang/vyper 0.7666` |
| `STATE 040` | `ethereum/execution-apis 0.7663` |
| `STATE 041` | `nomicfoundation/hardhat 0.7655` |
| `STATE 042` | `erigontech/erigon 0.7652` — partial notes only |

---

## F12. External link `Guide`
**Preconditions:** none observed; role visitor. `[inferred]`

**Steps**
1. From `/`, click `Guide`. `[observed control; edge]`
2. Navigate to `https://deep-pm.gitbook.io/seer-docs`. `[observed edge]`

**Result:** external GitBook destination. `[observed edge]`  
**Unobservable:** destination content not captured.

---

## F13. External link `Charting by TradingView`
**Preconditions:** none observed; role visitor. `[inferred]`

**Steps**
1. From `/`, click `Charting by TradingView`. `[observed control; edge]`
2. Navigate to TradingView href beginning `https://www.tradingview.com/?utm_medium=lwc-link&utm_campaig…` (truncated). `[observed edge]`

**Result:** external TradingView destination. `[observed edge]`  
**Unobservable:** full href and destination content truncated/not captured.

---

## F14. External link `Browse on Seer`
**Preconditions:** none observed; role visitor. `[inferred]`

**Steps**
1. From `/`, click `Browse on Seer`. `[observed edge]`
2. Navigate to `https://app.seer.pm/?chains=10`. `[observed edge]`

**Result:** external Seer app. `[observed edge]`  
**Unobservable:** destination content not captured.

---

## F15. External link `https://kleros.io/`
**Preconditions:** none observed; role visitor. `[inferred]`

**Steps**
1. From `/`, click `https://kleros.io/`. `[observed edge]`
2. Navigate to `https://kleros.io/`. `[observed edge]`

**Result:** external Kleros. `[observed edge]`  
**Unobservable:** destination content not captured.

---

## F16. External link `Telegram`
**Preconditions:** none observed; role visitor. `[inferred]`

**Steps**
1. From `/`, click `Telegram`. `[observed edge]`
2. Navigate to `https://t.me/kleros`. `[observed edge]`

**Result:** external Telegram. `[observed edge]`  
**Unobservable:** destination content not captured.

---

## F17. External link `X`
**Preconditions:** none observed; role visitor. `[inferred]`

**Steps**
1. From `/`, click `X`. `[observed edge]`
2. Navigate to `https://x.com/kleros_io`. `[observed edge]`

**Result:** external X. `[observed edge]`  
**Unobservable:** destination content not captured.

---

## F18. External link `GitHub`
**Preconditions:** none observed; role visitor. `[inferred]`

**Steps**
1. From `/`, click `GitHub`. `[observed edge]`
2. Navigate to `https://github.com/kleros`. `[observed edge]`

**Result:** external GitHub. `[observed edge]`  
**Unobservable:** destination content not captured.

---

## F19. Connect wallet — unobservable result
**Preconditions**
- Wallet: `Connect your wallet` visible; `0x0000…dEaD` also visible; exact connection state ambiguous. `[observed STATE 001]`
- Chain: `OPTIMISM` shown; copy says “Optimism is the only network these contests run on.” `[observed STATE 001]`
- Funds: none observed. `[observed STATE 001]`
- Role: visitor → wallet-connected user. `[inferred]`

**Steps**
1. Click `Connect your wallet`. `[observed control STATE 001]`
2. Complete wallet connection. `[unobservable: no post-click wallet-connection state captured]`

**Result:** unknown; no connected-wallet state captured.  
**Unobservable:** no wallet modal, chain switch, signature, success/failure, or connected-state capture.

---

## F20. Create trade wallet — unobservable result
**Preconditions**
- Wallet: likely connected wallet required. `[inferred from onboarding]`
- Chain: Optimism. `[inferred from copy: “Optimism is the only network these contests run on.”]`
- Funds: none observed for creation. `[observed STATE 001]`
- Role: wallet-connected user/trader. `[inferred]`

**Steps**
1. Locate onboarding step `2 Create a trade wallet`; copy: “A contract you own that batches hundreds of trades into one run.” `[observed STATE 001]`
2. Click `Create trade wallet`. `[observed control STATE 001]`
3. Confirm creation/signature. `[unobservable: no resulting trade-wallet creation state captured]`

**Result:** unknown; no created-wallet state captured.  
**Unobservable:** no modal, transaction, signature, success/failure, or created trade-wallet state captured.

---

## F21. Add sUSDS — unobservable result
**Preconditions**
- Wallet: trade wallet created. `[inferred from step order]`
- Chain: Optimism. `[inferred from copy]`
- Funds: sUSDS required; copy: “Every market settles in it, and it earns Sky savings yield meanwhile.” `[observed STATE 001 copy; amount/minimum inferred only]`
- Role: trader. `[inferred]`

**Steps**
1. Locate onboarding step `3 Add sUSDS`. `[observed STATE 001]`
2. Add sUSDS to trade wallet. `[unobservable: no separate Add control label captured]`
3. Confirm sUSDS balance/funding. `[unobservable: no balance/deposit state captured]`

**Result:** unknown; no sUSDS-add flow captured.  
**Unobservable:** no `Add` button label, deposit form, amount, or resulting state captured.

---

## F22. Upload predictions — unobservable result
**Preconditions**
- Wallet: likely connected/trade wallet. `[inferred]`
- Chain: Optimism. `[inferred from copy]`
- Funds: unknown. `[unobservable]`
- Role: participant/competitor. `[inferred]`

**Steps**
1. Locate empty-state message `No predictions loaded`. `[observed STATE 001]`
2. Click `Upload predictions`. `[observed control STATE 001]`
3. Select/upload predictions file. `[unobservable: no upload dialog, accepted format, or result captured]`

**Result:** unknown; no upload dialog/result captured.  
**Unobservable:** no dialog, file format, validation, success/error, or loaded-predictions state captured. Also `No predictions loaded` coexists with populated market list/totals, so scope is unclear. `[observed STATE 001]`

---

## F23. `Hide all` — unobservable effect
**Preconditions:** none observed; role visitor. `[inferred]`

**Steps**
1. From `/`, click `Hide all`. `[observed control STATE 001]`
2. Observe what is hidden. `[unobservable: no resulting state captured]`

**Result:** unknown; effect not captured.  
**Unobservable:** no hidden state, chart/list change, or toggle state captured.

---

## F24. Leaderboard filters/search — unobservable result
**Preconditions**
- Wallet: optional to view; `Your rank` likely wallet-dependent. `[inferred]`
- Chain: no leaderboard filter captured. `[observed STATE 004]`
- Funds: none observed. `[observed STATE 004]`
- Role: viewer/competitor. `[inferred]`

**Steps**
1. From `/`, click `Leaderboard` → `/leaderboard`. `[observed STATE 004]`
2. Click one of `1D`, `1W`, `1M`, `All`. `[observed controls STATE 004; action unobservable]`
3. Use `MARKET` / `All deep markets`. `[observed controls STATE 004; action unobservable]`
4. Use `Search`. `[observed control STATE 004; action unobservable]`
5. View `Your rank`. `[observed control STATE 004; data unobservable]`

**Result:** no filter/search/rank result captured; screen showed `0 wallets`. `[observed STATE 004]`  
**Unobservable:** no filter action, ranked rows, or `Your rank` value captured.

---

## F25. Trade a repository market — inferred core flow, not observable
**Preconditions**
- Wallet: connected wallet. `[inferred]`
- Chain: Optimism. `[inferred from copy]`
- Funds: sUSDS in trade wallet. `[inferred from onboarding copy]`
- Role: trader/contest participant. `[inferred]`

**Steps**
1. Connect wallet via `Connect your wallet`. `[observed control STATE 001; result unobservable]`
2. Create trade wallet via `Create trade wallet`. `[observed control STATE 001; result unobservable]`
3. Add sUSDS. `[observed step copy STATE 001; result unobservable]`
4. Select repository row, e.g. `ethereum/consensus-specs 0.8481`. `[observed STATE 010; no detail panel]`
5. Enter trade ticket / choose UP or DOWN / confirm trade. `[unobservable: no order book, trade ticket, buy/sell control, or confirmation captured]`

**Result:** cannot specify; no trade UI or trade confirmation captured.  
**Unobservable:** no trade ticket, order book, UP/DOWN trade controls, transaction flow, or success/error state captured.

---

# FLOW SCENARIOS TO SCRIPT NEXT

Use these as replay/probe specs for `pipeline/scenario_lib.mjs`. For repository rows, reload `/` between clicks to isolate each scenario.

## Observed replay scenarios

| Scenario name | Start URL | Steps |
|---|---|---|
| `S01_main_load` | `https://deep.seer.pm/` | 1. `goto /`; 2. assert `AI Prediction Markets`, `Round 3 · Originality`, `LIVE`, `Total volume ~$293.82`, `Total liquidity ~$929.08`, `Connect your wallet`, `0x0000…dEaD`, `No predictions loaded`. |
| `S02_self_nav_ai_prediction_markets` | `https://deep.seer.pm/` | 1. `goto /`; 2. `click "AI Prediction Markets"`; 3. assert route `/` and same main-screen text. |
| `S03_open_leaderboard` | `https://deep.seer.pm/` | 1. `goto /`; 2. `click "Leaderboard"`; 3. assert URL `/leaderboard`; 4. assert `1D`, `1W`, `1M`, `All`, `All deep markets`, `Your rank`, `Search`, `0 wallets`. |
| `S04_open_profile` | `https://deep.seer.pm/` | 1. `goto /`; 2. `click "Profile"`; 3. capture route and visible text; assert no profile panel captured. |
| `S05_click_wallet_address` | `https://deep.seer.pm/` | 1. `goto /`; 2. `click "0x0000…dEaD"`; 3. capture route/text; assert same main screen. |
| `S06_click_round_label` | `https://deep.seer.pm/` | 1. `goto /`; 2. `click "Round 3 · Originality LIVE"`; 3. capture route/text. |
| `S07_click_archive` | `https://deep.seer.pm/` | 1. `goto /`; 2. `click "Archive"`; 3. capture route/text; assert no archive content visible. |
| `S08_click_refresh_volume` | `https://deep.seer.pm/` | 1. `goto /`; 2. `click "Refresh volume"`; 3. capture visible text and network calls; assert no visible change. |
| `S09_hover_chart` | `https://deep.seer.pm/` | 1. `goto /`; 2. `hover` chart canvas `942x364` at `y=489`, titled `Share of original work over time`; 3. capture tooltip/DOM. |
| `S10_search_outcomes_e` | `https://deep.seer.pm/` | 1. `goto /`; 2. `fill "Search outcomes" "e"`; 3. capture route/text. |
| `S11_repo_row_click_<STATE>` | `https://deep.seer.pm/` | 1. `goto /`; 2. `click "<exact row label from F11 mapping>"`; 3. assert route `/`; 4. capture selected-repo trigger/text. Run for `STATE 010`–`STATE 042`; `STATE 042` partial. |
| `S12_external_guide` | `https://deep.seer.pm/` | 1. `goto /`; 2. `click "Guide"`; 3. assert URL `https://deep-pm.gitbook.io/seer-docs`. |
| `S13_external_charting_tradingview` | `https://deep.seer.pm/` | 1. `goto /`; 2. `click "Charting by TradingView"`; 3. assert URL starts `https://www.tradingview.com/`. |
| `S14_external_browse_on_seer` | `https://deep.seer.pm/` | 1. `goto /`; 2. `click "Browse on Seer"`; 3. assert URL `https://app.seer