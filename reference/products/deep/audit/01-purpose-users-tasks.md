# purpose users tasks (deep; DeepSeek draft: Claude verifies against screenshots)

# deep — research extraction

## Scope and uncertainty
This extraction uses only the supplied crawl notes and data. The source contains complete observations for `STATE 001–041`; the provided `STATE 042` note and controls inventory are truncated, so I do not rely on them for task conclusions. No explicit user-role names are given; role labels below are inferred from controls, copy, and gating cues. No trade ticket, order book, deposit form, upload dialog, profile content, archive content, error state, or ended-round content was captured.

## Purpose of the product
`deep` at `https://deep.seer.pm/` presents an **“AI Prediction Markets”** front-end on **OPTIMISM**: a round-based prediction/contest screen for repository **“share of original work.”** The captured live round is **“Round 3 · Originality”** with status **“LIVE”**; it shows **~98 repository rows** with 4-decimal **UP prices**, aggregate **Total volume ~$293.82** and **Total liquidity ~$929.08**, plus charts: **“Share of original work over time”** and **“Original work per repository.”** Copy says each line is a repository’s UP price, “the market's estimate of how much of it is original,” and that repositories trade as a pair where **UP is the share of original work** and **DOWN** is truncated. (`STATE 001`, `STATE 010–017`, `STATE 026–041`)

The product also provides wallet/onboarding prompts for a **trade wallet** and **sUSDS**, an **“Upload predictions”** empty-state control, a **Leaderboard** that ranks wallets by profit/loss across “All deep markets,” and an **Archive** tab for past rounds. (`STATE 001`, `STATE 004`, `STATE 008`)

## Who uses it — inferred
- **Prediction-market traders/contest participants** on Optimism who need a trade wallet and sUSDS settlement. Evidence: onboarding steps **“2 Create a trade wallet”** and **“3 Add sUSDS”**; copy: “Optimism is the only network these contests run on.” (`STATE 001`, `STATE 010–017`)
- **Wallet holders/competitors** checking rank and profit/loss. Evidence: Leaderboard ranks “Every wallet across all deep markets, ranked by profit/loss,” with **“Your rank”** and profit “realised and marked-to-market, in USD.” (`STATE 004`)
- **Observers/researchers** comparing repository originality via the repository list and charts; market data renders even while **“Connect your wallet”** is visible. (`STATE 001`, `STATE 010–017`)
- **Users with predictions to upload.** Evidence: **“No predictions loaded”** empty state plus **“Upload predictions.”** (`STATE 001`, `STATE 010–017`)

## Jobs-to-be-done — inferred
1. Understand the market’s estimate of a repository’s **share of original work** via its UP price. (`STATE 001`)
2. Compare repositories and monitor UP-price changes over time using the two chart panels. (`STATE 001`, `STATE 003`)
3. Set up trading infrastructure via a **trade wallet** and funding/settlement via **sUSDS**. (`STATE 001`, `STATE 010–017`)
4. Load/upload one’s predictions. (`STATE 001`, `STATE 010–017`)
5. Track wallet performance/rank across deep markets by profit/loss. (`STATE 004`)
6. Switch between the live round and archive/past rounds. (`STATE 008`, `STATE 010–017`)
7. Search/filter repository outcomes and refresh volume. (`STATE 001`, `STATE 009`)

## Primary tasks — max 8

### 1. Connect a wallet
1. Open the **“AI Prediction Markets”** screen on **“OPTIMISM.”** (`STATE 001`)
2. Use **“Connect your wallet.”** (`STATE 001`)
3. Confirm connection state; no post-connect state was captured. (`STATE 001`)

**Needs — Wallet:** yes, to connect. **Funds:** none observed. **Role:** visitor → wallet-connected user.  
**Uncertainty:** the truncated address **“0x0000…dEaD”** is displayed at the same time as **“Connect your wallet,”** so connected/disconnected status is ambiguous. (`STATE 001`, `STATE 010–017`)

### 2. Create a trade wallet
1. Locate onboarding step **“2 Create a trade wallet.”** (`STATE 001`)
2. Read the step copy: “A contract you own that batches hundreds of trades into one run.” (`STATE 001`)
3. Select **“Create trade wallet.”** (`STATE 001`)

**Needs — Wallet:** likely a connected wallet, inferred from onboarding; not proven by captured post-click state. **Funds:** none observed for creation. **Role:** wallet-connected user/trader.  
**Uncertainty:** no resulting state after **“Create trade wallet”** was captured; onboarding starts at step **“2,”** with no step **“1”** visible. (`STATE 001`, `STATE 010–017`)

### 3. Add sUSDS
1. Complete or observe step **“2 Create a trade wallet”** as the preceding onboarding step. (`STATE 001`)
2. Locate step **“3 Add sUSDS.”** (`STATE 001`)
3. Add sUSDS to the trade wallet; no separate **“Add sUSDS”** button label was captured. (`STATE 001`, `STATE 010–017`)

**Needs — Wallet:** trade wallet, inferred from step order. **Funds:** sUSDS required; copy says “Every market settles in it, and it earns Sky savings yield meanwhile.” Amount/minimum not captured. **Role:** trader.  
**Uncertainty:** no separate Add control or resulting state was captured. (`STATE 001`, `STATE 010–017`)

### 4. Search/browse/select a repository market
1. On the main market screen, use **“Search outcomes”** to search/filter repository rows. (`STATE 001`)
2. Optionally use **“Refresh volume”**; no visible change was captured. (`STATE 001`, `STATE 009`)
3. Select a repository row button, e.g. **“ethereum/consensus-specs 0.8481”**, **“ethers-io/ethers.js 0.8275”**, or **“ethpandaops/checkpointz 0.5446.”** (`STATE 001`, `STATE 010–041`)
4. Read the selected trigger/title; no repository detail panel was captured. (`STATE 010–041`)

**Needs — Wallet:** none to browse/select. **Funds:** none to browse/select. **Role:** visitor/observer.  
**Uncertainty:** clicking repository rows produced no visibly changed captured content across `STATE 010–041`; no trade ticket, order book, or selected-repo detail panel appeared. Trading after selection cannot be specified from the capture. (`STATE 010–041`)

### 5. Inspect originality charts
1. Locate chart **“Share of original work over time”**; read: “Each line is a repository's UP price — the market's estimate of how much of it is original.” (`STATE 001`)
2. Hover the chart; no tooltip content was captured. (`STATE 003`)
3. Use **“Hide all”** to hide chart/list content; exact effect was not captured. (`STATE 001`)
4. Inspect **“Original work per repository”**; copy is truncated at **“DOWN …”**. (`STATE 001`, `STATE 010–017`)
5. Optionally follow **“Charting by TradingView.”** (`STATE 001`)

**Needs — Wallet:** none observed. **Funds:** none observed. **Role:** observer/trader.  
**Uncertainty:** axes, legend, time range, tooltip values, and line detail are not exposed in the capture; metadata reports `charts=2` but visible internals are limited. (`STATE 001`, `STATE 003`)

### 6. Upload predictions
1. Locate empty state **“No predictions loaded.”** (`STATE 001`, `STATE 010–017`)
2. Use **“Upload predictions.”** (`STATE 001`, `STATE 010–017`)
3. Complete upload; no dialog, accepted format, or result was captured. (`STATE 001`)

**Needs — Wallet:** likely a connected wallet/trade wallet, inferred; not confirmed. **Funds:** unknown. **Role:** participant/competitor.  
**Uncertainty:** **“No predictions loaded”** appears alongside a populated repository list, chart, volume, and liquidity, so whether it refers to the user’s own predictions or market predictions is unclear. (`STATE 001`, `STATE 010–017`)

### 7. View leaderboard and rank/filter
1. Select **“Leaderboard”** to navigate to `/leaderboard`. (`STATE 001`, `STATE 004`)
2. Use time filters **“1D”**, **“1W”**, **“1M”**, **“All”**; market filter **“MARKET”** / **“All deep markets”**; and **“Search.”** (`STATE 004`)
3. View **“Your rank”** and ranking copy: “Every wallet across all deep markets, ranked by profit/loss. Profit is realised and marked-to-market, in USD.” (`STATE 004`)

**Needs — Wallet:** optional to view; a wallet is likely needed for **“Your rank,”** but this is not confirmed. **Funds:** none to view. **Role:** viewer/competitor.  
**Uncertainty:** the leaderboard captured **“0 wallets,”** and no filter actions or ranked rows were captured. (`STATE 004`)

### 8. Explore archive/past rounds
1. From live round **“Round 3 · Originality LIVE,”** select **