# Build pass 10

Ticked 3 items: F121, F122, and F145. No checklist items remain.

The trade drawer now presents a five-stage, state-driven flow for wallet connection, live quote, review, wallet confirmation, and receipt. It continues to use verified outcome mappings, live SDK quotes, exact approvals, wallet simulation, gas checks, receipt polling, and a fresh quote after approval. Confirming, pending, successful, rejected, and failed transactions are visible and announced. Transaction status is filtered to the active trade so an unrelated wallet action cannot appear inside the ticket.

Confirmed approvals and trades now create validated, deduplicated local records from genuine wallet receipts. The success sheet shows the exact hash and block, links to Gnosisscan, and opens a verified Explorer transaction drawer with its sender, target contract, connected market, timestamp, and copy/share actions. Invalid or fabricated record shapes are rejected.

The accessibility layer now provides coarse-pointer target sizing, keyboard focus scroll margins, forced-colors focus treatment, assertive failure announcements, and equivalent focus states for hover affordances. Dense Field marks keep their compact visual encoding but use an independent 44px button hit area and retain the existing native submission selector and arrow-key field navigation.

The Seer design-lab guidance shaped the restrained five-stage treatment, semantic violet and amber states, both-theme token use, and the decision to preserve small analytical marks without sacrificing touch access.

## Validation

- `npx tsc --noEmit`: clean.
- `npx tsc --noEmit -p src/products/opportunity/tsconfig.json`: clean.
- `node src/products/opportunity/checks/pass-ten.mjs`: verified receipt persistence, canonical Explorer resolution, malformed record rejection, 44px analytical hit areas, coarse-pointer rules, forced-colors focus, and live error announcements.
- Pass 8, pass 9, wallet lifecycle, and React panel checks all pass.
- `npx vite build --outDir /private/tmp/opportunity-pass10-build`: passes. The existing large-chunk advisory remains.

## Visual QA constraint

The required local Vite listener was attempted and rejected by the sandbox with `listen EPERM`. A file-based headless Chrome fallback also exited without producing a screenshot. The available `shots/land_d0.png` through `shots/land_d6.png` references were inspected and are entirely white. Automated data, render, TypeScript, and production-build checks completed, but live 1440px, 1024px, and 390px dual-theme screenshot review could not run in this environment.
