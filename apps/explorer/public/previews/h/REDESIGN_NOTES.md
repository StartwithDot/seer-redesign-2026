# Explorer H redesign

Status: complete. Implementation, integration, visual review, functional QA and durable design documentation are finished. Only H is edited. Current Explorer is the preserved G implementation in this repository.

## Source mapping

The attached prompt describes a different monorepo layout. Current G is public/explorer. H is created at the requested apps/explorer/public/previews/h. VISION.md and product-identity-guide.md are read from reference/products/explorer, EF tokens from src/design-system/tokens.css. The 870-line brief and full build spec were supplied in Downloads/Telegram Desktop. The doc_inputs PNGs, live control inventory and G dropdown-check script do not exist here. Baseline screenshots and an observed control inventory will be generated from the actual running G, with the missing inputs recorded rather than invented.

Data and local fonts are copied into H to keep it self-contained. The development server maps /previews/g/ to G read-only, /previews/h/ to H, and other product links to the existing production build. There is no application build step and no dependency at runtime.

## Human direction

The user selected: keep violet/lavender and refine the instruments. H uses a shared instrument language of calibrated arcs, ticks, interval ribbons and direct labels. Other approved semantic colours are reserved for caution, PnL and Agent mode. This decision precedes visual implementation.

## Boundaries

No commit, push, deployment, real wallet request or transaction. The captured records, history and all existing controls remain. Orders remain explicit local simulations. No library is added to the application runtime. Three-dimensional libraries and the optional promo are omitted in favour of lightweight SVG instruments and completion of product QA.

## Completion ledger

- [x] Read redesign prompt and map source locations.
- [x] Preserve G hashes and copy source to H.
- [x] Agree signature data language in writing.
- [x] Read/install requested skills and run baseline audit.
- [x] Capture baseline route/state matrix and controls.
- [x] Write design system and all component intents before visual edits.
- [x] Foundations, home, market and supporting route passes.
- [x] Motion, offline runtime, responsive and light-theme passes.
- [x] All seven requested browser check suites, final Impeccable review and fixes.
- [x] Capture and inspect after matrix, independent review and final report.

## Component design intents, recorded before implementation

1. Typography: Inter Tight gains three clear levels: the question, its leading signal, and evidence metadata. Tabular figures reserve their space, full market titles wrap, and small technical labels stop competing with the question. Existing permitted tile and inspector truncation keeps a full-text tooltip.

2. Iconography: a single 20px, 1.75px-stroke SVG sprite makes action, status and navigation immediately related. The tile's layers mark becomes an actual Open trade arrow, while read-only badges use separate sealed and conditional marks so information never masquerades as a button.

3. Shell: retain both 56px bars, with quieter product glyphs, an active underline, a distinct search focus state and a compact theme switch. Human and Agent have one sliding selected surface. The Apps menu stays a navigational list with real destinations.

4. Context and hero: the information user's three questions remain above the carousel. An editorial question sits over a local market image treated with a single dark scrim; outcome names and values form a clear versus readout. Segmented progress explains the six-second carousel and yields to hover, focus and reduced motion.

5. Filters: a visually continuous toolbar combines labelled icons, small active values and independent counts. More separates liquidity from incentives. The view switch and Create action remain in the existing reading order, with responsive wrapping rather than hidden primary actions.

6. Tiles: keep the 200px anatomy and show a large, stable leading value beside a calibrated arc. Scalars use an interval ribbon instead. The question, image, two outcomes, asker and volume keep fixed aligned slots. Selected state uses tonal lift and a thin accent. The Open trade arrow is distinct from tile selection; a separate copy affordance preserves the asker-filter action.

7. Index and Activity: sticky headers, measured column rhythm and quiet row focus support long scans. Direct values remain primary, miniature bars secondary. Only recorded history earns a sparkline. Empty states offer a specific recovery without pretending missing prices are zero.

8. Inspector: the selected market becomes a compact evidence instrument with a split outcome selector, custom validated amount, optional fixed chips and a small payoff measure. A scrolling middle and persistent bottom actions prevent the current clipped-CTA failure. Details is a focused overlay with all covered controls inert.

9. Full record: a precise thin gauge, payoff, runway and real history form one tight composition. WHO, WHAT and HOW stay visible in the information hierarchy. Every priced outcome remains selectable by its original index, including the 80-outcome case.

10. Trade console: the balance scale is rebuilt from layered SVG with a plausible suspended mechanism and finite damped changes. It explains pay versus contingent payout; the estimate, demo balance, validation and simulation CTA remain textual and usable without the illustration. The quote body scrolls above a persistent action.

11. Leaderboard: proportional stacks form a compact top-ten profile, with direct ranks and values. Score rings retain supplied scores rather than invented formulas. The table, periods and unavailable filter messages preserve the capture's limitations. The score explanation is available on demand.

12. Supporting flows: Create gets a true two-step indicator and preserves disabled preview fields and the handoff. Policies becomes a readable editorial document. Dialogs, sheets and toasts use the same radii, typography, focus and status treatment. Wallet choice remains genuine optional provider discovery.

13. Agent: an explicit Agent view explanation, a one-shot scan accent, copyable ids and syntax-coloured JSON distinguish machine-readable information from the human ticket. Original data is copied without display transformations. All JSON remains selectable and understandable with styling disabled.

14. Motion: one restrained grammar connects finite gauge, tile, quote and scale transitions. Only carousel progress may repeat, because it represents time until the next slide. The requested idle sway is omitted because the same brief prohibits decorative loops.

15. Light theme: near-white tonal surfaces and darker violet/indigo inks are chosen independently. Selected surfaces, traces, patterns, text and focus indicators are checked against their actual light backgrounds.

16. System states: captured loading, error, no matches and unavailable history are designed states with specific recovery or provenance. Skeleton shimmer exists only while a real request is pending and is still under reduced motion. No fabricated telemetry fills gaps.

## Skills and baseline audit

Installed impeccable, ui-ux-pro-max and diagram-design as skill folders through the standard Codex installer, without project hooks. All READMEs and applicable SKILL/reference instructions were inspected. The checksum-verified official Impeccable engine 0.1.17 ran its context and baseline source scan. No downloaded install script or unchecked interpreter module was run from a cloned repository. UI UX Pro Max ran with isolated Python and explicitly selected reviewed helper modules.

The baseline scan reports 14 findings: overused-font (4), gradient-text (2), bounce-easing (4), pulsing-dot (2), dark-glow (1), repeating-stripes-gradient (1). Retain Inter Tight as the explicit brand constraint. Replace visible glow, pulses and decorative bounce; replace CSS stripe gradients with SVG pattern marks. Some gradient-text reports are selector-level candidates and require rendered confirmation. Source findings remain separate from browser observations.

All 74 referenced image URLs were downloaded as immutable local assets with source URLs and SHA-256 provenance. No new imagery or market data is generated.

## Integration and first review

The 250 baseline captures were inspected in ten viewport/theme contact sheets. First implementation review found missing tooltip hiding, an incorrect Activity class alias, a wordmark overflow, toolbar crowding and missing source-specific inspector field styles; these were corrected in one batch. The second browser pass found keydown bubbling that skipped the first dropdown item and focusout closing an advanced menu during internal focus movement. Keyboard opening now stops propagation, and focus transitions within the menu preserve it.

Open trade, all four required panel sizes, dropdown behavior and 32 parity checks now pass. Test-only corrections distinguish a short panel that correctly needs no scroll, use actual source class and data attributes, and preserve rather than reset theme storage across reload. G source hashes and all four frozen data files remain unchanged. Final captures and independent review remain open.

## Final review checkpoint

The final matrix contains148 valid captures covering37 states, desktop and phone, both themes, plus12 full-page captures. All capture contexts report zero page errors. All seven suites passed before icon unification. The final icon regression has only test-label normalization corrections pending: replaced left-arrow glyphs become SVG while labels/destinations remain. Independent finish review is running; its complete material fix list will be applied as one batch. The source scan has one brand-font warning, retained per the explicit brief, and zero applicable failures.

## Direction contract

THESIS: Make captured market evidence readable through calibrated instruments. A researcher can understand the signal without initiating a trade.

OWN-WORLD: The human-pinned Electric Foundation world supplies Inter Tight, near-black tonal surfaces, violet/lavender outcome inks, fine calibration ticks and a patterned secondary trace. Standard web controls retain their familiar roles. A researcher uses the dark view during sustained evening comparison; the independent light ramp supports bright daytime work.

STORY: Scan questions, identify the asker and priced claim, select a market, read the signal and its limits, then optionally inspect a simulated order or the machine-readable capture.

FIRST VIEWPORT: At1440x900, two56px navigation rows precede the48px context strip,200px hero and filtering row. A three-column grid presents at least six200px tiles beside a416px inspector with a persistent primary action. The signature move is the shared calibrated arc/range ribbon that makes the leading value readable across tiles and the full record. Phone retains full hero questions and directly accessible Human/Agent modes.

FORM: Existing product composition and identity were explicitly fixed by the human brief; no concept tournament, roll, seed, alternative-ranking approval or QUALITY BAR card was used. Physical measuring instruments inform only type, palette, density and the signature data mark, never the navigation. Seed reference: none; human-pinned brief. No retroactive approval is asserted.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Independent review correction batch

The first independent review returned recapture: Pools, Related and market Agent JSON screenshots showed the record top instead of the selected tabs. Their captures now scroll to the actual tabs/panels. The complete matrix was refreshed. The useful material observations from that review were fixed together: full mobile hero question with a240px phone hero, scalar value/unit on one line, scalar endpoint/proportional settlement captions in HOW, order console, confirmation and success, and formal recording of the existing human-pinned direction. No numeric market data or quote calculations changed. Two extra scalar states expand final evidence to156 captures.

All 74 sourced raster images now embed their source URL and original SHA-256. The provenance manifest preserves original and current metadata-bearing file hashes; pixels are unchanged. Impeccable raster scan reports74 rasters, zero missing provenance.

## Baseline evidence expansion

G source hashes remain unchanged. Post-review framing corrections and additional shared states expand the baseline from 250 to 340 valid screenshots across all five sizes and both themes. An attempted history-point baseline was correctly reclassified as H-only: G has no history crosshair canvas. No G capability is claimed for that added control. The authoritative final baseline excludes this H-only state and the new custom amount/scalar-order evidence. Existing history curves remain captured in G.

## Final technical verification

All seven final suites pass 152 assertions: parity44, alignment13, dropdowns5, scroll-panel9, Open trade5, contrast74, performance2. Contrast was expanded to all 37 interactive states in both themes. It exposed missing explicit styles in the inspector history SVG; labels, line, endpoint, guides, crosshair and tooltip now use existing semantic tokens. The same reviewer inspected all four refreshed Details captures and scored this technical fix resolved. The raster and font assets remain local. Final G baseline 340, final H matrix 156, full pages 12; capture errors 0, page exceptions 0, no document overflow. See FINAL_QA.md for measurements and remaining verification limits.

## Completion

The independent documenter finished token-bearing DESIGN.md and schema-v2 .impeccable/design.json, verified YAML/JSON, references and source hashes, and documented actual responsive/component/motion values plus observed drift. The finish-review contract is discharged: review verdicts are saved, all scored fixes resolved, all152 final checks pass, all shipping rasters carry origin metadata, and documentation is complete. Preview responds HTTP200 at http://127.0.0.1:5196/previews/h/index.html. G seven-source-file hashes and all four data fixtures remain unchanged. No work remains in this H redesign iteration; measured host-frame outliers and unavailable external verification are explicitly recorded in FINAL_QA.md.
