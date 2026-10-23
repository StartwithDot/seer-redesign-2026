# Build pass 6

Completed F125–F131, F133–F134, F139–F140 (11 items). 19 remain.

The market dossier now has Overview and Analytics views. Analytics provides probability history, cumulative coverage with top-3/8/27 checkpoints, rank snapshots, and price-tier distribution. Pointer inspection, keyboard range inspection, series toggles, history ranges and reset work without animation. Colors inherit both shell themes. Archive has verified contest records, optional labeled samples, seven filters, empty recovery, and deep-linked dossier inspection. Discussion comments, replies and likes persist separately per market/submission on this device; the interface explicitly states that they are private and not published.

Evidence corrections: unpriced submissions no longer receive an invented price history. Verified archive markets no longer receive generated submission identities. Archive dossier timelines tolerate missing resolution timestamps. Verified history contains only available source snapshots, with missing history explained instead of interpolated. Archive imagery uses existing brand reference boards, not purported contest submissions.

## Checks

- `npx tsc --noEmit -p src/products/opportunity/tsconfig.json`: passes.
- `npx vite build --outDir /tmp/opportunity-pass6-dist`: passes.
- Data assertions across every market, four chart modes, all history ranges, missing archive evidence, unpriced history and source separation: pass.
- Repository `npx tsc --noEmit`: blocked by existing Futarchy errors in ActivityTable.tsx and index.tsx, outside this task's scope.
- Browser QA attempted: local Vite listen rejected with EPERM; Chrome process launch also rejected by sandbox. Screenshot, contrast and viewport QA remains unverified. Responsive rules are implemented but not visually certified.

## Items left unchecked in this batch

F121–F124 require verified execution contracts, ABIs, allowance/position reads, settlement evidence and live quotes. The existing deterministic quote is not safe transaction input. No approvals, signatures, hashes or redemption successes have been invented.

F132 remains unchecked because the entire existing chart suite does not yet implement every loading/error/retry state. The new market analytics surface handles loading, empty, partial evidence, error and retry.

F135–F138 require actual winner identities, resolution timestamps, payout/position evidence and 144 rebrand/18 merch image records. Those source records and gallery assets are absent. Existing brand boards cannot substitute for submission galleries.

F139 persistence is local to the browser, explicitly disclosed. It is not a server-backed public discussion service.
