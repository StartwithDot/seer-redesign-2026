# Build pass 8

Ticked 4 items: F135, F143, F144, F149. 9 remain.

## Delivered

- Finalized market summaries use the prefetched markets-search API response in `products/opportunity/audit_archive/network.json`. Extracted a focused historical snapshot into `data/archiveEvidence.ts`, with an adapter in `data/archive.ts`. The archive and explorer dossiers show Electric Foundation and the five merchandise winners, exact UTC finalization dates, payout-reported evidence, full contract links and source-market links. Rebrand payout terms are recorded; the merchandise per-share settlement rate remains explicitly unavailable. Corrected the merchandise selected count to five and restored captured creation dates for archive filtering.
- Mobile market selection uses a native select. Explorer search, all filters and presets are accessible in a full-height filter sheet, with a results action and scrollable content. Existing mobile tab strip and bottom trade sheet remain available. Fixed inherited landing navigation CSS that could keep desktop navigation visible on mobile.
- Desktop explorer, archive and submission dossiers become non-blocking side panels at 1200px. The workspace reserves panel space and collapses its analysis grid when necessary. Smaller layouts keep modal drawers. Modal focus containment, scroll locking and focus return are distinct from non-modal behavior.
- Explorer and submission links preserve the sample workspace, encode IDs and open the intended object. Archive filters and sample inclusion now restore from the URL. Opening dossiers owns a history entry; moving between submissions replaces it; closing returns to the previous view. Direct links close in place. Clipboard fallback checks its result and reports failure honestly; share cancellation is handled.
- Global overlays now inherit Opportunity theme tokens by rendering inside its shell. Inline and drawer submission headings/tabs have unique accessible IDs. Review workspace tabs support arrows, Home and End.

## Verification

- `node src/products/opportunity/checks/pass-eight.mjs`: passes. Checks stored archive fields against captured API evidence, winner mapping, timestamps, share deep links, clipboard fallback/failure, actual router callbacks, drawer history ownership, previous-view return, sample preservation and route boundaries. The routing checks use a minimal hooks host and browser-history model; they are not browser end-to-end tests.
- `npx tsc --noEmit -p src/products/opportunity/tsconfig.json`: clean.
- Repository `npx tsc --noEmit`: initially clean; the final run reports an out-of-scope Risk error at `src/products/risk/data/pool-history.ts:35` (`string | null | undefined` assigned to `string | null`). Left untouched.
- Vite production build passes. Existing large-bundle advisory remains.
- `npm run dev`: denied with `listen EPERM` on 127.0.0.1:5188. Live HTTP, browser interactions, viewport screenshots and visual QA could not be executed. Responsive items are implemented; their visual verification is outstanding. F145 remains unchecked because a complete accessibility/touch-target audit has not passed.

## Remaining evidence and integration gaps

F121–F124 and F147 require verified executable contracts/ABIs, allowance/position reads, live quotes and transaction receipts. No transaction or redemption success is simulated. F136–F137 need the actual 144/18 gallery image records and attribution. F138 needs real wallet holdings and redemption history. Existing market/brand assets are retained; no replacement contest submissions were invented.

The required docs were found in `../docs/`, alongside prefetched research in `../products/opportunity/`. Read the Design Book first, landing screenshots/CSS, relevant shared/product code, prior review and source audit evidence. Only Opportunity files changed; no commits or pushes.
