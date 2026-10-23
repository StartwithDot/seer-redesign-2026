# explorer: UNOBSERVED states/flows (designers must not invent these)

Shorthand used below: **PT** = ask the product team.  
**No docs URL and no contract address/ABI are present in the supplied data**; the only URLs present are `app.seer.pm` routes. I have not invented docs/contract references.

| # | What could NOT be observed | Reason / evidence from supplied data | Where truth could be found |
|---|---|---|---|
| 1 | Wallet-gated trade confirmation and trade execution on desktop: trade sheet, trade preview, confirm/sign, confirmation result, post-trade state | Scenario `01-search-trade-preview-desktop` failed at `select Yes outcome`: timeout waiting for `getByText(/^#\s*\d+\s+Yes$/i)`; scenario crashed. Trade panel is visible on market detail, but no trade action/confirmation was captured. | PT; captured route is `/markets/100/will-marine-le-p

## Update 2026-10-19 (Claude)
- Item 1 RESOLVED up to the confirm click: pre-trade quote observed (scenario 01/07 fixed). Still unobservable: approve/confirm/sign, tx pending, success and post-trade states (wallet-gated; mock wallet rejects).
- Conditional market page OBSERVED (audit-gap 001/012). Futarchy proper: other app.
- Still unobservable: create-market steps 2+, dispute/Kleros UI, resolve/redeem after close, Portfolio/Account/Deposit/Trade Collateral pages, collections after sign-in, comment posting, add/remove liquidity tx UI, Policies page bodies, keyboard behaviour, empty/error states beyond skeletons. Docs-only facts must be tagged [from docs].
