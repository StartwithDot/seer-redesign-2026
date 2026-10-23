# Opportunity art direction and QA

Read `overnight/DESIGN_BOOK.md`, the landing's tokens and typography, the original opportunity capture, existing product evidence, and all 158 feature inventory rows before editing. The supplied opportunity screenshots are entirely white, so they cannot establish individual layout defects. The older root research, quality and handoff documents are absent in this checkout. The table records defects established from the current implementation and the concrete fixes made inside this product.

| Worst problem | Fix | Preserved feature access |
| --- | --- | --- |
| The shared preview suspends to an empty screen and its bootstrap overwrites the theme key | Eager board module, product-local entry with visible startup text and an error boundary; local HTML reads the shared theme key before paint | Every existing route still exports through `Page`; local Vite configuration previews the product independently |
| The landing's optical study is reduced to a generic inline diagram | Reuse the actual Opportunity sculpture from `public/img/app_opportunity.webp`; create paper and charcoal treatments with no new imagery claims | Original source screenshot remains in Source & market status |
| Nested header pills and two violet CTAs compete with the market's primary action | Quiet header with a hairline, text navigation, an outlined wallet action and restrained violet | Search, appearance, wallet and Help remain present |
| Market browsing expands the whole page and pushes the selected opportunity away | Anchored, dismissible market popover with bounded results; Escape and outside click close it | Status filters, search, selector, previous/next, keyboard market browsing |
| The headline 99% total looks like one candidate's selection chance | Lead with 105 priced submissions out of 235 and 44.7% pricing coverage; retain 99% as the explicitly labeled sum | All pricing tiers, summed odds, leading candidate chances and coverage checkpoints |
| Identity, badges and numbers compete at the same scale | Clear 66px desktop / 42px mobile title, quieter provenance, 32px section headings and consistent spacing | All source labels, volume, depth, counts and sponsor context |
| Inherited artwork overlay and filters darken images and reduce caption contrast | Remove image dimming and overlay; captions use theme text tokens; image failures receive a tonal fallback and original link | Source imagery, originals and galleries |
| Four mobile utility controls crowd the header; the useful board action scrolls away | Labeled utility popover, 44px targets and a fixed bottom Explore submissions action | Search, appearance, Help, navigation and wallet; mobile trading remains a bottom sheet |
| Mobile review appends the full dossier and clips fallback candidates into a fixed chart height | Compact selected candidate preview links to the full dossier; bounded candidate lists and auto-height fallback field | Field, list, review cut, full record, charts, community, history, sponsor review, buy/sell |
| Archives have no visual evidence and primary destinations create extra page scrollbars | Illustrated editorial archive rows with three-record pagination; document owns destination scrolling | All archive records, filters, winning evidence, galleries, payouts and market dossiers |

First pass changed composition, artwork, identity, disclosure and mobile actions. Second source-review pass corrected inherited cascade conflicts: the priced signal's old grid and tinted block, hidden dark artwork, mobile freshness rows, capped destination scrolling, narrow decision controls and clipped fallback field. Reload timers are canceled on workspace changes and unmount so stale results cannot replace the current board.

## Validation

- `node_modules/.bin/tsc --noEmit -p src/products/opportunity/tsconfig.json` passes.
- `node_modules/.bin/vite build --config src/products/opportunity/vite.config.ts` passes; output is `/private/tmp/opportunity-art-build`.
- Existing source/feature, rendering, archive, routing, trading and transaction lifecycle checks pass. The inventory retains 156 implemented rows and the two pre-existing incomplete rows, F059 and F099. No feature row was removed or newly marked complete.
- Actual React rendering checks cover the hero, both artwork variants, archive imagery/actions, 105/235 coverage, retained 99% odds total and missing-signal state. The local startup script passes shared-key priority, system preference and default-light checks.
- Thirty text/background token pairs and white-on-violet actions pass AA. Minimum token contrast is 5.18:1. This is token validation, not a rendered contrast audit.
- Both final artwork treatments were visually inspected as image files. Browser screenshots at 1440, 1024 and 390 remain unverified: Vite local binding returns EPERM and installed headless Chrome aborts in this sandbox. No screenshot or zero-overlap claim is made.

The shared root `index.html` still rewrites `seer-theme` on full reload. It is outside the authorized folder. The product-local preview avoids that bootstrap; the ordinary root preview still has that limitation. Start the local product with `node_modules/.bin/vite --config src/products/opportunity/vite.config.ts` in an environment that permits local serving.
