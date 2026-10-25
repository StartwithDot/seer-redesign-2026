# Explorer H final QA

Review date: 24/10/2026, 17:46:18 IST.

Preview: http://127.0.0.1:5196/previews/h/index.html

Scope: H only. Preserved G source hashes and all four frozen fixtures match. No commit, push, deployment or transaction.

| Required check | Result | Cases |
|---|---|---|
| parity | PASS | 44 |
| alignment | PASS | 13 |
| dropdowns | PASS | 5 |
| scroll-panel | PASS | 9 |
| open-trade | PASS | 5 |
| contrast | PASS | 74 |
| perf | PASS | 2 |

Total: 152 passing assertions. Every suite report and SUITE_SUMMARY.json is stored in checks/results.

Computed text contrast minimum: 4.78:1. Essential data graphic minimum: 3.62:1. Contrast covers all 37 interactive states in dark and light, including dialogs, dropdowns, Agent JSON, scalar orders, supporting tabs and Details history. Disabled controls are excluded per WCAG; decorative gridlines and brand logos are not treated as essential data marks. HTML tracks are compared to parent backgrounds; SVG strokes/fills use composited backgrounds.

Performance: 179 animation intervals; median 7.0ms, p95 14.0ms, average 119.9fps. Peak 27.8ms; 4 intervals exceeded 20 ms. Average and p95 targets pass. This is not a claim that every host frame is below 16.67 ms. Reduced-motion autoplay/animation check passes.

Open trade: pointer, Enter and Space reach the correct record without selecting the tile;32px desktop hit area and labels confirmed. Scroll: home and full order panel at 1440x900,1440x700,1100x800,390x844; CTA stays visible, inner wheel is contained, main page recovers outside the panel, short panels need no scroll.

Alignment: five viewport sizes ×2 themes;200px tile anatomy and per-row offsets, hero action separation, full record text bounds, all phone carousel questions complete, inspector variants and no document overflow. Tables retain their deliberate internal overflow.

Parity: actual observed G control inventory, fixture equality, hash preservation and observable actions across filters, sorting, search, asker, modes, storage, sheets, quick/full quotes, simulation, pagination, Create, charts, downloads and tabs. Symbol-to-SVG replacements normalize decorative arrows; labels and destinations remain. New controls include custom amount, copy asker/id and Close search. Scalar settlement wording was corrected without changing data or numerical quote calculations.

Runtime: zero page exceptions, zero external rendering requests and zero HTTP errors across tested routes. All 74 images and Inter Tight are local. Wallet modal and handoffs were tested; no live provider account request or signature was made.

Evidence: 340 valid G baseline captures across five sizes/both themes; 156 valid H captures across 39 states ×2sizes ×2themes, plus 12 full pages. All contact sheets were inspected, with full-resolution critical screens and independent review. The original 250-state baseline was expanded after review while G stayed unchanged. History crosshair, custom amount and extra scalar order states are H additions, explicitly excluded from G.

Independent review: first recapture request corrected tab framing. Full review then requested supporting-tab rhythm and remaining glyph corrections. Both scored resolved in FINISH_REVIEW.md, disposition ship at scored-fix scope. An additional required contrast/graphic correction in inspector history was separately reviewed and scored resolved. The full review is preserved in FINISH_REVIEW_FULL.md.

Impeccable: baseline 14 findings; final source scan 1 warning for explicitly pinned Inter Tight, zero applicable failures. Dispositions recorded in checks/results/impeccable-dispositions.json. No second detector was run after independent review. Raster provenance scan:74 rasters, zero missing embedded origin records. Original/current file hashes remain in assets/provenance.json.

Limitations and adaptations: official doc_inputs reference PNGs/live_controls_per_route.json and G dropdown script were absent, so observed preserved G is the parity authority. The prompt describes a different monorepo and a macOS Chrome path; this workspace uses Windows Chrome and the supplied static helper. No apps/explorer package/build wrapper exists; H needs no application build and has not been verified through that nonexistent wrapper. Physical-phone/Safari rendering and live external protocol/wallet outcomes were not tested. Optional 3D and promo were skipped. Rare host frame outliers are measured above.

Durable design documentation: DESIGN_SYSTEM.md, DESIGN.md, .impeccable/design.json, PRODUCT.md and REDESIGN_NOTES.md.

Documentation validation completed: DESIGN.md frontmatter and schema-v2 design.json parse;50 concrete theme colors, nine type roles, responsive values and ten component snippets are recorded. Final preview health check returned HTTP200.
