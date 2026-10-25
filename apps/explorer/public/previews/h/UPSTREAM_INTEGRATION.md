# Correct upstream and local workflow

Delivery upstream: https://github.com/StartwithDot/seer-redesign-2026
Base branch: main
Integration branch: explorer-deep-integration

The similarly named seer-redesign repository was used as design lineage/source for Deep, but it is not the delivery target. The mistaken PR there was closed without merging. Do not publish further work there.

Authoritative work folders:
- apps/deep-h/ for Deep source
- apps/explorer/public/previews/h/ for Explorer source
- public/deep/previews/h/ for compiled Deep deployment
- public/explorer/previews/h/ for static Explorer deployment

The Vite root build copies public into dist. No landing, main App/router, root manifest/lockfile, Vite config or other existing upstream file is edited by this integration. Existing main product routes remain unchanged; these are additive H previews.

Local original checkout: C:/Users/josep/Desktop/seer_design. Its main now follows the latest corrected upstream. Old local history is kept on codex/preserved-local-main-cb70327, tracked edits in the named pre-sync stash, and old untracked source in the verified external backup. Do not reapply the old landing edits onto the updated branch. Completed product source and full QA archives are retained.

Future changes: fetch origin/main, create a product feature branch from current main, edit only the relevant source folder, rebuild/copy its public preview, test on the root production preview, and run checks/protect-upstream.mjs before committing. The guard verifies the correct origin and allows changes only inside the four product directories. Never force-push main or stage the old preserved work wholesale.

Build Deep from its folder with npm ci --workspaces=false --ignore-scripts --no-audit --no-fund, then npm run build --workspaces=false. Run node apps/explorer/public/previews/h/checks/sync-public.mjs from the repository root after a Deep build or Explorer edit. It copies only the two public preview folders, verifies hashes and deletes nothing. Add --check to verify without writing. Build the root with npm ci --ignore-scripts --no-audit --no-fund and npm run build. Preview the root with node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 5310 --strictPort.

Preview URLs:
- http://127.0.0.1:5310/explorer/previews/h/index.html
- http://127.0.0.1:5310/deep/previews/h/index.html

Historical standalone reports remain historical. Current integration results and source/deployment hash checks are in INTEGRATION_QA.md. Frozen G reference files and Deep fixture hashes preserve design-lineage parity without claiming those sources existed in this delivery repository. No real financial transaction is introduced.
