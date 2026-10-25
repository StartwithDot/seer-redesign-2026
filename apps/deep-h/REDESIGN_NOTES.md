# Deep H redesign record

## Scope and provenance

The user requested reading the brief, full build spec, then redesign sheet in that strict order. All three supplied documents were read in that order before source changes.

Source: https://github.com/StartwithDot/seer-redesign at cebb9ad60ce06ceae9e33d6048d1fe446f77eb4f. Retrieved into a new temporary sparse checkout. Only apps/deep-h in the active workspace is authored. Original source, other applications, root manifests and shared packages are unchanged. Package identity is @seer/deep-h. EF is vendored unchanged initially at vendor/ef; subsequent local shell changes are documented here.

The repository supplies the expected components, 98 original market pairs, archive fixtures, and copied e2e suite. It does not contain products/deep/handoff, the inv_* captures, captured control JSON, or the requested full product documents. Supplied Markdown establishes those observations; fresh baseline captures establish this run. Older available reference/product documents are lineage only.

## Setup and baseline

- npm install --workspaces=false --no-audit --no-fund inside destination: 103 packages. No root lockfile edits.
- npm run build: passed TypeScript and Vite. Source bundle 5.58 MB uncompressed / 1.16 MB gzip. Existing large chunk warning recorded.
- Baseline preview: http://127.0.0.1:5199/ using node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 5199 --strictPort.
- Browser: installed Chrome, exact version in baseline/manifest.json, DPR 1, reduced motion.
- checks/capture-baseline.mjs captured 14 theme/size combinations including 1440x700. Browser initially could not reach sandbox localhost; restarting preview and checks in the same external context resolved it.
- Copied harness portability edits: Windows Chrome executable; Node invocation of npm; fileURLToPath for trace paths. Assertions and registrations retained.
- The serial baseline run was stopped after reaching mobile control sweeps. It is a partial baseline, with failures recorded in baseline-suite.log. No complete/green baseline claim is made. Fresh baseline captures and CSS snapshots remain unchanged after the default build was subsequently updated to the redesign.

## Skill provenance and use

Separate scratch clones outside the project:

| Skill | Revision | Method and limitation |
|---|---|---|
| pbakaus/impeccable | 936867543ac2576920d663cc9803597f6044f3ac | README read. Existing installed Codex skill applied manually. Engine launcher failed because curl.exe/engine cache unavailable; no detector success claimed. Read audit, new-work and craft-floor. Pinned redesign sheet overrides a new concept selection round. |
| nextlevelbuilder/ui-ux-pro-max-skill | d14efff8ed1faa4187f004f79926f428c8074ec7 | README read. Existing installed search script run with isolated Python and explicitly selected installed module path. Exact-brief output in reports/uipro-generated.md. Retry in reports/uipro-focused.md. |
| cathrynlavery/diagram-design | 0b9b10cab3dbf695642fa1a6c4b4f60df9083689 | README and installed instructions read. Applied line/scatter/direct-label/data-honesty method to native charts. EF palette and supplied brand override default diagram skin. No separate diagram installation or diagram verification claimed. |

UI UX Pro Max's first result recommended neon Cyberpunk UI and a showcase landing page. These conflict with the explicit brief and are rejected. Focused retry supplied relevant data density, contrast, keyboard, focus and reduced-motion guidance; its sales landing pattern, corporate palette, generic widgets and replacement fonts are rejected. Final reconciled system is DESIGN_SYSTEM.md.

No 3D: price comparisons and historical steps need accurate planar axes. An additional object conveys no information here. No promo before verification. No new runtime library.

## Baseline audit, manual Impeccable workflow

The engine did not run. This is a manual audit using its five dimensions, without an invented numerical score. Viewed dark desktop/mobile baseline: typography has compressed heading leading; mobile context takes 424px and clips the plot below bottom navigation; numeric ledger is readable but repository identities truncate; Desk labels/actions are cramped. Source confirms Positions emits seven cells under a five-column override, theme alone does not repaint TimeFigure, tooltip lacks left clamp, menus can open following stationary-pointer reflow, and idle header animations repeat. Theme and remaining viewport images are reviewed in the capture contact sheets. These findings map to intents below and supplemental checks.

Evidence traps retained: predictions_loaded is pending in supplied documentation; menu_market_sort is Positions; profile_dialog was disconnected; market_error is ordinary terminal; fail affects only leaderboard. Fresh captures use action/state assertions. Both themes exist. Shared Disconnect does not reset React, while React Disconnect clears connected/trade only. This redesign preserves that functional distinction.

## Sixteen design intents, recorded before implementation

1. Typography: replace compressed leading in TimeFigure, Guide, Detail and archive headings with selective Newsreader display at 30/32 desktop, 25/28 mobile. Inter Tight remains the UI and numeric face with tabular figures; addresses and UTC use mono. Verify copy fit, long identities, and both theme captures.

2. Icons: add components/Icon.tsx, one 20px inline SVG grid with 1.75px rounded stroke. Replace masks and action glyphs in active controls while preserving labels and test identities. Raven paths remain inherited. Verify accessible names, no missing icons, and mobile targets.

3. Shell: recompose Masthead, context band and vendored EF shell with quieter selection, complete framing, compact fact alignment, and bounded overflow. Mobile spends substantially less height on facts while retaining every value and framing sentence. Preserve Apps, both wallets, contest tabs and menu timing. Verify stationary-pointer reflow and focus behavior.

4. TimeFigure: increase typographic hierarchy and plot area, use blue historical UP versus neutral DOWN, restrained global band and violet median/selection. Preserve exact steps, ranges, All emphasis, nearest-line threshold and real UTC. Correct DOWN caption/accessible label and bitmap sizing; clamp tooltip edges. Verify math, repaint, canvas bounds, keyboard and expansion.

5. Pair anatomy: keep 64x8 exact independent bars, left UP blue and right DOWN neutral, residual hatching and explicit accessible pair/residual description. Add real residual examples to Guide. No normalization or invented ticks. Verify first pair widths, negative residual, and Positions formulas.

6. Swarm: preserve nonlinear horizontal price lens and fixed price coordinates, reduce ghost-date weight, use price colors consistently, and separate replay/layer controls from plot marks. Retain liquidity sizing, drift, volume, predictions, all five layers and 12-second replay. Verify axis coordinates, label collisions, reduced motion and settled CPU.

7. Ledger/detail: redesign SplitList tools and exact seven Positions columns with operable local horizontal scroll. Preserve 30px desktop/44px mobile row heights, static ranks, sorting, price drift and selection/detail distinction. Full identity is visible in selected Inspector and available on keyboard focus. Detail gets the same figure grammar. Verify column edges and all 98 rows.

8. Desk: make setup, CSV review and execution an ordered operational ledger with one execution action. Show pending versus committed clearly, keep export disconnected, and bound scrolling for short screens. Preserve parser, four prerequisites, timers and accounting. Verify upload errors, reset boundaries and action reachability.

9. Funds: make balances the anchor, group deposit/conversion and withdrawal, and distinguish Sell All confirmation. Preserve mock arithmetic, drafts/reset, validation and disabled Rebalance. Native sheet adapts to mobile bottom placement. Verify actual accounting and confirm/cancel.

10. Guide: editorial reading hierarchy for four tabs, six actions, real pair examples, full glossary and documentation link. Explain documented versus mock behavior with one visible note while retaining all original paragraphs. Verify keyboard tab cycling, actions and focus return.

11. Leaderboard: align signed P/L, API ROI and ranks; coordinate ranked ledger, SVG map, inspector and analysis. Preserve seven columns including unavailable Score, actual scale formulas, merged rings, Follow and Compare limit. Refine all three layouts and mobile inspector. Verify every period, view, data attribute and state.

12. Archives: preserve all outcomes and ids, clarify group/name hierarchy, keep bounded scroll and sticky headings, and treat absent history as an intentional state. Distinguish market definition count from flattened outcomes. Verify eight contests, both overviews, export and 3517-row reachability.

13. Feedback: align Modal, Profile, Search, menu, tooltip, alerts and confirmation surfaces. Preserve native dialog focus containment, file limits, signing/local storage and all shortcuts. Add avatar failure fallback and readable full identities. Verify rejection, errors, recovery, storage and focus.

14. Motion: remove inherited idle loops, use 120ms hover, 180ms menu/dialog entry, 240ms selection and 400ms view reveal; bar mount 600ms remains bounded. Operational timers remain 900/140/1400/12000ms. Reduce preference removes interpolation and retains feedback/state. Verify runtime reduction, no endless animations and frame distributions.

15. Themes: retain EF surfaces and purposeful light variants, use semantic data tokens throughout SVG/Canvas and repaint immediately on theme events. Test disabled, focus, selection, hatches and native backdrops. Contrast script records actual ratios and remaining context-line limitations.

16. States: preserve synchronous Round3 fixtures without loading theater; design actual CSV, wallet, archive, search and leaderboard states with recovery. Add deterministic image fallback instead of fabricated avatar art. Verify captures through actual actions and distinguish injected failures from unexpected errors.

## Verification record

The implemented redesign covers shell, Split/Swarm, the seven-column ledger, Desk, Funds, four Guide tabs, Profile/Search, all eight contests, both overviews, repository detail and all leaderboard periods/views. Final measured results and unresolved limits are collected in reports/VERIFICATION.md. The full copied sweep is still being completed while this record is being assembled; completion is established only by its coverage/result artifacts.

## Behavioral and harness corrections

- The Guide's original `[data-step=2]` selector is invalid CSS because its unquoted value begins with a number. The destination quotes the value so the delayed setup-focus action no longer throws. This was an actual page error found by the copied sweep; it is not suppressed.
- Positions had seven body cells under a five-column visual override. The destination gives header and body the same explicit seven-column grid and bounded horizontal scroll. All original cells, formulas and values remain.
- The expanded chart now makes background controls inert, traps Tab and accepts Escape from its filter input. The ordinary `/` and F shortcuts retain their input guards.
- Theme changes invalidate both Canvas painters immediately. Canvas bitmap dimensions use their actual content bounds. Tooltip coordinates clamp at the plot edges. These correct presentation defects without changing price or axis mathematics.
- Failed remote avatars replace themselves with the source address-derived Identicon. External request failures remain visible in the unintercepted network report; no error allowlist was added.
- Shared EF Disconnect continues to leave React's connected/trade state alone; the App wallet Disconnect retains its original narrower reset. No wallet, chain, financial or rebalance integration is invented.
- The supplied full spec explicitly says shared Copy address copies the mock bridge string `0x0000…dEaD`. That exact source behavior is preserved and asserted, with success/rejection feedback. It is not described as a recovered full blockchain address.
- Mobile Chart retains its source list below the plot in a bounded inner scroll. It does not hide controls merely to simplify the first screenshot.
- Native touch checks found a one-pixel shell pan from the hidden root scroll container. The fixed shell now uses overflow:clip; intended inner regions retain their own scrolling. The repository's inner vertical region contains vertical overscroll but permits horizontal chaining to its outer Positions grid, so a native horizontal pan moves headers and values together.
- The local Vite preview accepts the shared shell's native /deep/ entry and its relative assets. Its original relative base and all production link destinations remain intact. The current Deep entry is tested through an actual load of all 98 fixtures; sibling product applications are outside this isolated package.
- The menu's initial negative translate could briefly reduce its prescribed trigger gap during animation. It now reveals 4px of padding through clip-path and opacity, keeping the 8px gap stable in either placement. Assertions are unchanged.
- Escape respects a topmost native dialog. Search restores focus after its dialog unmounts, and the nested Search-in-expanded-chart case verifies that closing Search leaves expansion intact, then a second Escape closes expansion.
- Performance measurement found unrelated leaderboard work during historical replay after navigation. React memoization and a stable retry callback avoid that work while retaining the bounded replay timeline and all leaderboard state/data behavior. Before/after measurements are retained; no price or timer math is changed.

The original serial runner is retained as `npm run e2e:serial`. `npm run e2e` uses checks/source-suite.mjs: every original registration and assertion is imported unchanged, with isolated browser contexts, configurable worker count and failure artifacts. This avoids cross-test storage/viewport contamination and the recording cost of tracing every dense-list restoration. Optional DEEP_TRACE=1 restores tracing. DEEP_RESUME=1 resumes a same-inventory checkpoint, records the resumed/fresh counts and retains failed prior attempts; it never treats an unfinished case as passed. Windows executable/fileURLToPath adaptations and lazy failure capture repair platform errors without weakening assertions. Source-owned overlay/current-state skips are reported separately.

## Visual review corrections

The first independent finish review requested readable mobile SVG labels, removal of Detail letterboxing, archive metadata below its heading and a visibly reached Funds confirmation capture. Those were corrected and recaptured. Follow-up review found the compact wallet map's loss annotation and volume caption collided with ticks. Redundant mobile annotations were reduced and the caption moved beneath SVG into HTML. Full-size originals and composition sheets are retained with a viewed-image record. Missing source handoff inventories remain an explicit evidence gap.

Test corrections are kept distinct from App defects: Windows file URL conversion; opaque-origin storage guards in test initialization; proper outside-pointer placement in the reflow test; waiting for the second resize event to settle; the documented short mock clipboard value; and excluding impossible Canvas color/layer combinations from contrast sampling. Actual painter combinations and SVG ring strokes are measured. A plain native-scroll control proved that this Chrome's high-level synthetic scroll emitted no touchmove; the final test sends trusted touch start/move/end events instead, and measures the actual clipped inner region. See reports/touch-probe.log and the [Chrome Input protocol](https://raw.githubusercontent.com/ChromeDevTools/devtools-protocol/master/pdl/domains/Input.pdl). No functional assertion or copied test registration was removed. Builds and browser checks run sequentially after transient asset 404s were traced to an overlapping rebuild; final network verification uses a completed, stable production build.
