# Build pass 7

Ticked 6 items: F132, F141, F142, F146, F148, F150. 13 remain.

Implemented recoverable submission price-history loading/error states with data validation, retry and existing empty/partial evidence disclosure. Market analytics already handles these states. Charts do not animate; reduced-motion rules now disable motion throughout the Opportunity shell.

Added Opportunity semantic theme overrides: charcoal dark background, violet chart accents, amber sponsor authority, neutral live/sample/status badges, contrast-adjusted delta colors, explicit native input themes and white primary-button text. Existing market imagery remains in use; no substitute contest images were invented.

Routes now load separate chunks through Suspense with a visible loading fallback and retry boundary. Unknown routes have a board recovery action; malformed encoded market IDs cannot crash the router. An offline notice preserves access to stored snapshots and offers connection checking. Sample workspace count supports 1–12 deterministic, explicitly sampled market records via ?n=, preserving n across navigation. Preference reads validate field/sort values; theme honors the shared key and continues when storage is unavailable. Review workspace writes remain scoped by market and wallet, with session fallback on storage failure.

Additional improvements: submission drawer restoration on URL changes, unique accessible dialog IDs, initial-focus reverse-Tab trapping, mobile full-height dossiers and bottom trade sheet, sticky mobile tab strip and focus-visible styles. F143–F145 remain unchecked pending full browser interaction and viewport verification; desktop non-blocking drawer behavior remains incomplete. F149 remains unchecked pending a complete share/copy and back-navigation audit. F147 remains unchecked because transaction execution is unavailable.

## Verification

- `npx tsc --noEmit -p src/products/opportunity/tsconfig.json`: clean after final changes.
- `npx vite build --outDir /tmp/opportunity-pass7-dist`: passes; bundle-size advisory remains.
- Executable assertions: all 12 sample counts, unique stable IDs, deterministic results, sample provenance, unknown route recovery, malformed encoded ID handling and trailing slash handling pass.
- Repository `npx tsc --noEmit`: blocked by Risk profiles.ts assigning nullable max_score to a number type. No changes made outside Opportunity.
- `npm run dev`: sandbox rejects 127.0.0.1:5188 with EPERM. No live HTTP or browser screenshots could be verified. Visual contrast and layout checks remain uncertified.

## Evidence limits

F121–F124 remain unchecked: no verified execution contract/ABI, live executable quotes, allowance/position reads or settlement evidence. F135–F138 remain unchecked: actual archive winner identities, payout evidence, resolution dates and 144/18 submission image records are unavailable in the current product sources. No transaction or redemption success is simulated.

The supplied docs/ instruction files are absent from this checkout. Read overnight/DESIGN_BOOK.md, landing screenshot/style references, the seer-design-lab skill, all relevant Opportunity/shared implementation and prior pass review. User authorization is for this Opportunity build pass; the skill's earlier landing approval gate does not require another approval for this work.
