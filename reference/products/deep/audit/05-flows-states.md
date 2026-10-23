# flows states (deep; DeepSeek draft: Claude verifies against screenshots)

# User Flows Audit — `deep`

## Scope and limits

- All captured states are desktop. Chart inventory labels every capture `[desktop]`; no mobile state exists in the notes. `STATE 001–041`
- `STATE 042` is only partially captured (`erigontech/erigon 0.7652`) and is truncated. `STATE 042`
- No explicit loading, error, ended/resolved, successful-wallet-connection, successful-trade, or mobile-specific state is captured. `STATE 001–041`
- “Not observed” below means the crawl contains no resulting `STATE` for that step. “Inferred” means derived from copy, control inventory, or `DATA MODEL` only.

---

## 1. Landing / main market screen

1. Page: `/` main “AI Prediction Markets” market screen. `[observed STATE 001]`
2. Observed content: `Round 3 · Originality` with `LIVE`, `OPTIMISM`, total volume `~$293.82`, total liquidity `~$929.08`, repository list, 2 charts, wallet/onboarding prompts, `No predictions loaded`, `Upload predictions`. `[observed STATE 001]`
3. Observed wallet area: truncated address `0x0000…dEaD` and `Connect your wallet` appear simultaneously; connected/disconnected status is ambiguous. `[observed STATE 001]`
4. Observed onboarding: step `2 Create a trade wallet`, step `3 Add sUSDS`; no step `1` visible. `[observed STATE 001]`
5. Uncertainty: the page renders market data, charts, and totals while wallet prompts are visible, so wallet-gated rendering cannot be confirmed. `[observed STATE 001]`

---

## 2. Global navigation flows

### 2.1 `AI Prediction Markets` button

1. Page: main market screen. `[observed STATE 001]`
2. Control: click `AI Prediction Markets`. `[observed STATE 001 controls inventory]`
3. Result: remains on the same main market screen; metadata unchanged. `[observed STATE 002]`

### 2.2 `Leaderboard` button

1. Page: main market screen. `[observed STATE 001]`
2. Control: click `Leaderboard`. `[observed STATE 001 controls inventory]`
3. Result: `/leaderboard` leaderboard screen. `[observed STATE 004]`
4. Observed leaderboard content: time filters `1D`, `1W`, `1M`, `All`; market filter `All deep markets`; `Your rank`; `Search`; empty state `0 wallets`. `[observed STATE 004]`
5. Observed copy: leaderboard ranks wallets across “All deep markets” by profit/loss, with profit “realised and marked-to-market, in USD.” `[observed STATE 004]`
6. Uncertainty: leaderboard shows `0 wallets` despite describing “Every wallet across all deep markets.” `[observed STATE 004]`

### 2.3 `Profile` button

1. Page: main market screen. `[observed STATE 001]`
2. Control: click `Profile`. `[observed STATE 001 controls inventory]`
3. Result: captured same main market screen at `/`; no profile content visible. `[observed STATE 005]`
4. Uncertainty: control count differs from main screen (`132` vs `124`), but no profile panel, route content, or account detail is captured. `[observed STATE 001 vs STATE 005]`

### 2.4 `Guide` link

1. Page: main market screen. `[observed STATE 001]`
2. Control: `Guide` link with href `https://deep-pm.gitbook.io/seer-docs`. `[observed STATE 001 controls inventory]`
3. Result: destination content not captured. `[not observed — no resulting STATE]`

### 2.5 `Charting by TradingView` link

1. Page: main market screen. `[observed STATE 001]`
2. Control: `Charting by TradingView` link; href begins `https://www.tradingview.com/?utm_medium=lwc-link&utm_campaig...`. `[observed STATE 001 controls inventory]`
3. Result: destination content not captured; full href truncated. `[not observed — no resulting STATE]`

### 2.6 Wallet address button `0x0000…dEaD`

1. Page: main market screen. `[observed STATE 001]`
2. Control: click `0x0000…dEaD`. `[observed STATE 001 controls inventory]`
3. Result: remains on same main market screen. `[observed STATE 006]`
4. Uncertainty: address is visible while `Connect your wallet` is also present; no account menu/detail is captured. `[observed STATE 001; STATE 006]`

### 2.7 Round label `Round 3 · Originality LIVE`

1. Page: main market screen. `[observed STATE 001]`
2. Control: click `Round 3 · Originality LIVE`. `[observed STATE 001 controls inventory]`
3. Result: remains on same main market screen; no visible content change. `[observed STATE 007]`

### 2.8 `Archive`

1. Page: main market screen / live Round 3. `[observed STATE 001]`
2. Control: click `Archive`. `[observed STATE 001 controls inventory]`
3. Result: captured same live Round 3 market screen; no archive content visible. `[observed STATE 008]`
4. Uncertainty: `Archive` exists as a tab/control, but archive-selected or ended-round content is not captured. `[observed STATE 008]`

### 2.9 `Refresh volume`

1. Page: main market screen. `[observed STATE 001]`
2. Control: click `Refresh volume`. `[observed STATE 001 controls inventory]`
3. Result: same main market screen; no visible change. `[observed STATE 009]`
4. Data-model note: `GET /refresh-market-volume` appears with status 200 and hits 2, but no UI loading/refresh result is captured. `[inferred from DATA MODEL only]`

### 2.10 Chart hover

1. Page: main market screen with chart `Share of original work over time`. `[observed STATE 001]`
2. Control: hover chart. `[observed STATE 001 controls inventory]`
3. Result: same main screen; no tooltip content captured. `[observed STATE 003]`
4. Uncertainty: chart canvas is present at `942x364`, but no axis labels, legend, or tooltip values are captured. `[observed STATE 001; STATE 003]`

---

## 3. Wallet / onboarding / wallet-gated flows

### 3.1 Initial wallet prompt flow

1. Page: main market screen. `[observed STATE 001]`
2. Observed controls/copy: `Connect your wallet`; `Create trade wallet`; step `2 Create a trade wallet`; step `3 Add sUSDS`; address `0x0000…dEaD`. `[observed STATE 001]`
3. Observed copy: trade wallet is “A contract you own that batches hundreds of trades into one run.” `[observed STATE 001]`
4. Observed copy: sUSDS — “Every market settles in it, and it earns Sky savings yield meanwhile.” `[observed STATE 001]`
5. Uncertainty: address and `Connect your wallet` coexist; actual connected/disconnected state is not determinable. `[observed STATE 001]`

### 3.2 `Connect your wallet`

1. Page: main market screen. `[observed STATE 001]`
2. Control: click `Connect your wallet`. `[observed STATE 001 controls inventory]`
3. Result: no resulting wallet-connection state captured. `[not observed — no resulting STATE]`

### 3.3 `Create trade wallet`

1. Page: main market screen / onboarding step 2. `[observed STATE 001]`
2. Control: click `Create trade wallet`. `[observed STATE 001 controls inventory]`
3. Result: no resulting trade-wallet creation state captured. `[not observed — no resulting STATE]`

### 3.4 `Add sUSDS` step

1. Page: main market screen / onboarding step 3. `[observed STATE 001]`
2. Observed: copy only; no separate `Add` button label is visible in captures. `[observed STATE 001; STATE 010–017]`
3. Result: no sUSDS-add flow or completion state captured. `[not observed — no resulting STATE]`

### 3.5 Wallet-gated trade flow

1. Page: main market screen. `[observed STATE 001]`
2. Observed: market data and repository prices render while wallet prompts are present. `[observed STATE 001]`
3. Observed: no order book, trade ticket, buy/sell control, or trade confirmation is captured on main screen or after repository-row clicks. `[observed STATE 001; STATE 010–041]`
4. Inferred from copy only: `Create trade wallet` and `Add sUSDS` are presented as prerequisites for trading/settlement. `[inferred from STATE 001 copy]`
5. Result: a complete wallet-gated trading flow could not be observed. `[not observed — no resulting STATE]`

### 3.6 Onboarding step 1

1. Observed: onboarding numbering starts at `2`; no step `1` is visible. `[observed STATE 001; STATE 010–017]`
2. Result: step 1 flow/content cannot be observed. `[not observed — missing from captures]`

---

## 4. Repository row selection flows

### 4.1 General row-click flow

1. Page: main market screen with 98 repository rows. `[observed STATE 001; STATE 010–017]`
2. Control: click a repository row button, e.g. `ethereum/consensus-specs 0.8481`. `[observed STATE 010]`
3. Result: captured state remains the main market screen with the row/trigger recorded; no repository-detail panel, order book, or trade ticket appears. `[observed STATE 010]`
4. Observed across multiple row clicks: visible page content remains identical or effectively unchanged; selected-repository detail is not visible. `[observed STATE 010–041]`
5. Uncertainty: notes differ slightly by chunk — earlier states record a selected-repo trigger/title change, later chunks describe byte-identical captures — but no user-visible detail view is captured. `[observed STATE 010–041]`

### 4.2 Observed repository-row states

All entries below are row-click results on the main market screen; no repo detail/trade UI is visible.

| Result state | Control / clicked row | Result |
|---|---|---|
| `STATE 010` | `ethereum/consensus-specs 0.8481` | same main screen; no detail captured `[observed STATE 010]` |
| `STATE 011` | `ethers-io/ethers.js 0.8275` | same main screen; no detail captured `[observed STATE 011]` |
| `STATE 012` | `sigp/lighthouse 0.8275` | same main screen; no detail captured `[observed STATE 012]` |
| `STATE 013` | `status-im/nimbus-eth2 0.8262` | same main screen; no detail captured `[observed STATE 013]` |
| `STATE 014` | `Consensys/gnark-crypto 0.8067` | same main screen; no detail captured `[observed STATE 014]` |
| `STATE 015` | `foundry-rs/foundry 0.8034` | same main screen; no detail captured `[observed STATE 015]` |
| `STATE 016` | `supranational/blst 0.8033` | same main screen; no detail captured `[observed STATE 016]` |
| `STATE 017` | `flashbots/mev-boost 0.8028` | same main screen; no detail captured `[observed STATE 017]` |
| `STATE 018` | `consensys/teku 0.8020` | same main screen; no detail captured `[observed STATE 018]` |
| `STATE 019` | `ethereum/go-ethereum 0.7974` | same main screen; no detail captured `[observed STATE 019]` |
| `STATE 020` | `argotorg/solidity 0.7954` | same main screen; no detail captured `[observed STATE 020]` |
| `STATE 021` | `arkworks-rs/algebra 0.7954` | same main screen; no detail captured `[observed STATE 021]` |
| `STATE 022` | `ethereum/eips 0.7946` | same main screen; no detail captured `[observed STATE 022]` |
| `STATE 023` | `herumi/mcl 0.7903