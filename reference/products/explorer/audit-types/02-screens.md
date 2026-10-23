# screens (explorer; DeepSeek draft: Claude verifies against screenshots)

# Screen-by-screen audit — `explorer`

## Scope and uncertainty
- Covered states: **STATE 001–046** (desktop captures). No distinct market-detail URL routes are provided in the notes; only nav/menu hrefs are available. Market-detail “routes” are therefore identified by STATE id and market type.
- Explicit uncertainty: exact tooltip contents for **STATE 003** and **STATE 013** are not captured; exact breakdown values for **STATE 007** are not captured; exact pool details for **STATE 010** are not captured; unique overlay content for **STATE 024, 028–029, 031–032, 039, 042–043** is not described in the notes and is treated as baseline-only.
- Capture metadata reports `charts=3` broadly; for **STATE 016–029** and **STATE 030–046** metadata reports `charts=3`, `tables=1`. Visible evidence is one main market chart and, in pool-detail states, one long pool table (**STATE 016–029**, **STATE 030–046**).

---

## Shared shell / global regions

### Beta banner
- Every state shows: “Note that this is a Beta version and can still be unstable” (**STATE 001–046**).

### Top navigation
- Nav items: **Markets** (`/`), **Leaderboard** (`/leaderboard`), **Create Market** (`/create-market`), **Policies** button, **App** button (**STATE 001–046**).
- **Policies** submenu contains **Verified Market Policy** (`/policy/verified`) and **Market Rules Policy** (`/policy/rules`) (**STATE 002–003, 012–013, 023–024, 034–035**; notes also cite **STATE 045**).
- **App** menu contains **Futarchy** (`https://futarchy.seer.pm/`), **Deepfunding** (`https://deep.seer.pm/`), **Foresight** (`https://foresight.kleros.io/`), **Opportunity Markets** (`https://opportunity.seer.pm`) (**STATE 004, 014, 025, 036**).

### Wallet / account region
- Wallet chip normally shows truncated address `0x0000...dEaD` and balance `24.69 xDAI` (**STATE 001–039, 041–046**).
- **STATE 040** instead shows **Connect** and no wallet address/balance.
- Clicking the wallet/balance area opens account menu: **Account** (`/profile`), **Deposit** (button), **Portfolio** (`/portfolio`), **Market Collections** (`/collections/default`), **Trade Collateral** (`/trade-collateral`), **Use smart account** (button) (**STATE 005, 015, 026, 037**).

### Theme controls
- “Switch to light mode” and “Switch to dark mode” controls exist; no visual theme details are captured (**STATE 006, 016, 027, 038**).
- **STATE 006**: dark-mode toggle clicked; visible content unchanged.
- **STATE 027** and **STATE 038**: theme control state captured; no visible theme change described.

### Comments / lower tabs
- For **STATE 001–010** and **STATE 016–021**, comments are wallet-gated:
  - “Connect your wallet to share your take”
  - “Connect to comment”
  - Empty state: “No takes yet. Share the first one.”
- Tabs explicitly described: **Comments**, **Related Conditional Markets**, **Top Holders**, **Activity** (**STATE 001–010, 016–021**).
- Comments/gating is not explicitly described for **STATE 030–046** in the notes.

### Footer / auxiliary links
- Inventory records external icon links to Kleros, Discord, Telegram, X, and GitHub in early states (e.g. **STATE 001d**); footer layout is not described.

---

## Market-detail templates

### A. Ethereum BASEFEE scalar market template — STATE 001–010
- Purpose: Ethereum BASEFEE scalar market detail; status **“Trading Open”** (**STATE 001–010**).
- Layout regions visible/inventoried:
  - Shared beta/nav/wallet shell.
  - Market header/status area.
  - Main chart region: canvas `804x272` at `y=599`; secondary SVG `280x139` at `y=1639`; in **STATE 010** the SVG is at `y=2135` after pool-detail expansion (**STATE 001–010**).
  - Outcome list with per-outcome controls.
  - Trade panel.
  - Resolution/verified links and lower tab area.
- Data/links explicitly inventoried:
  - Resolution link: “Resolution opening at February 1 2027, 08:50 UTC” to `reality.eth.limo` (**STATE 001–010**).
  - **Verified** link to `curate.kleros.io` (**STATE 001–010**).
  - “Open interest and liquidity breakdown” button (**STATE 001–008**; expanded in **STATE 007**).
  - “Custom” chart-date control (**STATE 001–008**; opened in **STATE 008**).
  - “Charting by TradingView” attribution link (**STATE 001–008**).
- Outcome controls:
  - **Add Liquidity** button.
  - **View pool details** button.
  - **New conditional market** link to `/create-market?parentMarket=0x2324741962ff5b8331dbbdc88de8cf...` (**STATE 001–010**).
- Trade-panel controls inventoried:
  - Input value `0`; **Max**; **Calculate your potential return**; **Enter an amount** (disabled); **More**.
  - Tabs: **Mint**, **Merge**, **Redeem**.
  - Amount input; **Mint** button (disabled).
  - External **Add Liquidity** link to `v3.swapr.eth.limo`.
  - Token links to `gnosisscan.io`.
  - Inventory also records an input with value `on`; its UI role is not described (**STATE 001–008**).
- Lower tabs/comments: **Comments**, **Related Conditional Markets**, **Top Holders**, **Activity**; comments wallet-gated as above (**STATE 001–010**).
- Exact header metrics, outcome labels/prices, and full trade-panel labels for BASEFEE are not itemized in the notes; only the controls/links above are explicit.

### B. France National Assembly multi-scalar market template — STATE 011, 016–021
- Purpose: market detail/trading page for “How many seats in France’s National Assembly will [party bloc] win in the next French legislative election?” (**STATE 011, 016–021**).
- Status: **“Pending execution”** (**STATE 011, 016–021**).
- Market type label: **“Multi Scalar”** (**STATE 011, 016–021**).
- Header metrics: Liquidity `6.45k`; Volume `1.32k`; P&L `0.00`; **Verified** badge; units/currency not shown (**STATE 011, 016–021**).
- “Deadline:” label present with no visible value (**STATE 011, 016–021**).
- Questions list, each with **“Answer: Answered too soon”** and **“Reopen question”** button:
