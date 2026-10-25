# INTEGRATION CONTRACT (v6). Project: /Users/leo/Documents/POIDH/poidh2 (Vite + React 19 + TS, dev server http://127.0.0.1:5188 is already running with HMR; do NOT start another).
## Goal
Five finished product apps run under ONE persistent shell. The shell is the only chrome: logo + current product name on the left, an Apps menu (the OTHER four products only), a common light/dark toggle, and ONE Connect Wallet button. Inside a product there is no navigation to other products and no second wallet button or header.
## Products and where they live
| route | name | source | static build served at |
|---|---|---|---|
| /explorer | Seer App (Explorer) | prebuilt vanilla JS in public/explorer/previews/h/ (from the merged PR) | public/p/explorer/ (copy of that folder) |
| /deep | Deep | prebuilt React bundle public/deep/previews/h/ (source apps/deep-h) | public/p/deep/ (copy) |
| /futarchy | Futarchy | futarchy-dev/ (workspace root; the Vite app is futarchy-dev/app, uses packages/ef) | build output -> public/p/futarchy/ |
| /opportunity | Opportunity Markets | opportunity-v2-dev/ (Vite app at its root) | build output -> public/p/opportunity/ |
| /risk | Risk Pricing | risk-dev/ (Vite app at its root; depends on @seer/ef which is a monorepo workspace package: a copy is at ../packages/ef — vendor it into risk-dev or make it resolve) | build output -> public/p/risk/ |
All builds use base './' (already set) so they work under any subpath; entry is /p/<name>/index.html. Each app's own router is hash-based or relative; keep it working inside an iframe.
## Shared protocol every product already implements (packages/ef/seer-shell.js + SeerShell.tsx)
- Theme: localStorage key `seer.theme` = 'light'|'dark', and window event `seer:theme` with detail {theme}.
- Wallet (mock, honest): window.seerShell.openConnect(), event `seer:connect` (cancelable), `seer:disconnect`; connected address stored in sessionStorage (key WK in seer-shell.js; read it). Never fake a live connection; mock signing is rejected honestly.
- Shell header class prefix `sg-`; products use `top: var(--seer-header-h)` for sticky bars; the product-specific second bar (`.sb` / subbar) must STAY.
## Embedding model
Each product page is shown in a same-origin <iframe src="/p/<name>/index.html"> beneath the shell bar. The parent injects an adapter after the iframe loads: (1) CSS that hides the product's own Seer global header (the `.sg-*` header element created by seer-shell) and sets :root{--seer-header-h:0px}; (2) JS that hides/removes every <a> pointing to another product (hrefs containing /deep, /futarchy, /opportunity, /risk, /explorer, previews/h of others, opportunity.seer.pm, etc., except the current product) including the footers that list the other products; (3) theme sync via localStorage + dispatching `seer:theme` on the iframe window; (4) wallet: the shell Connect Wallet button dispatches `seer:connect` in the iframe (same-origin) and shows the short address read from sessionStorage once connected; clicking when connected shows a small menu (Copy address, Disconnect -> clears the sessionStorage key and calls iframe.contentWindow.seerShell.setConnected(null)).
## Quality bar
No console errors, no layout overlap, sticky bars work with the shell bar height (64px) above, light AND dark both clean, 1440 and 390 widths. Owner hates AI slop: keep UI minimal and consistent with the Seer landing (Instrument Serif display for the product name, Inter Tight UI, violet #6C47FF accent, charcoal #0E0E12 dark, white-first light). Do not touch src/seer-2026/designs/monument/ except where your task says. Do not commit or push.
