# Build pass 9

Ticked 6 items: F123, F124, F136, F137, F138, F147. 3 remain: F121, F122, F145.

Archive market dossiers now expose Gallery and Payouts beside Overview and Analytics. Gallery uses the official IPFS manifest: all 144 rebrand images and 18 merchandise images, mapped to genuine outcome titles. It includes submission and winner filters, counts, previous/next, arrow/Home/End operation, a bounded thumbnail rail, original links, proposal PDFs and recorded creator portfolios. The lightbox supports 100–300% zoom and scroll panning. Loading and gateway failures are visible with retry. Rebrand creator attribution is recorded; unavailable merchandise authors remain explicit. The PDF-only merchandise submission remains reachable without a fabricated image. Generic brand-board archive visuals were replaced by actual submissions.

Payouts reads wallet shares, allowance and settlement values from Gnosis through the connected EIP-1193 provider, validates recorded contracts against live condition/token values and pins reads to one block. Unknown balances remain distinct from zero. Payouts use integer contract arithmetic. Only held winning shares with positive payouts enable redemption. The drawer re-reads before a write, captures an explicit acknowledgement, approves only the required token amount, simulates and estimates gas, checks xDAI fee balance and requests wallet confirmation. After approval confirmation the user reviews and confirms redemption separately. Pending transactions survive provider failures and network changes; success requires a matching transaction hash, sender, contract and successful mined receipt. Rejections, reverts, insufficient network fees, disconnected/wrong-network, unsettled markets and partial data have visible recovery. Confirmed session redemptions link to Gnosisscan. Zero holdings are never described as proof of past redemption.

Global wallet controls and live announcements expose confirming/pending transactions. Wallet context is shared within Opportunity only. New files remain under 400 lines, with no dependency additions, commits or pushes and no edits to shared or landing code.

## Validation

- `node src/products/opportunity/checks/pass-nine.mjs`: passes asset counts, genuine CID formats, creator/winner mapping, gallery navigation, single-block reads, exact payout arithmetic, partial errors, mismatched contracts, settlement guards, exact approval/redemption ABI, simulation, fees, network/rejection and receipt checks.
- `node src/products/opportunity/checks/transaction-lifecycle.mjs`: exercises the actual wallet transaction hook in a deterministic hook host. Passes confirming, duplicate prevention, pending, provider/network recovery, successful receipt, rejected and reverted states. Mock providers exist only in checks.
- `node src/products/opportunity/checks/render-panels.mjs`: React rendering passes gallery counts, thumbnails, attributed lightbox, disconnected/wrong-network payout messages and pending/failed transaction controls. This is not a browser interaction test.
- Existing pass-eight source/routing checks pass.
- `npx tsc --noEmit -p src/products/opportunity/tsconfig.json`: clean.
- Repository `npx tsc --noEmit` was clean earlier in this turn. The later `npm run build` fails on concurrent, out-of-scope Explorer wallet types missing `reverseName` and `tokenBalances`. No Explorer edits made.
- `npx vite build --outDir /private/tmp/opportunity-pass9-final`: passes. Existing bundle-size advisory remains.

## Outstanding verification and features

The sandbox denies the local Vite listener with `listen EPERM` and Chrome launch terminates. Live HTTP, 1440/1024/390 screenshots, browser interaction tests and full contrast/accessibility QA could not run. Remote IPFS images are real manifest assets, but gateway loading was not verified in this sandbox. No wallet funds were moved; live chain execution must still be exercised by a consenting wallet owner.

F121/F122 remain unchecked because the trade ticket still estimates historical quotes and delegates to the source market; full live trade routing/approval/receipt integration is absent. F145 remains unchecked pending the complete browser accessibility and touch-target audit. The added gallery and redemption controls include labels, focus treatment, keyboard alternatives, live messages, 44px controls, both themes and reduced-motion inheritance, but that does not certify the whole product.

Read Design Book first, the landing CSS and all seven `land_d*.png` files (every pixel is white), applicable skill/docs from `../docs/`, checklist/current architecture, existing product/shared code, prior passes and source audit evidence. The prefetched audit screenshot files referenced by the index are missing; available original Opportunity desktop/mobile screenshots were inspected. The user explicitly authorized this build pass, so no earlier landing approval gate was repeated.
