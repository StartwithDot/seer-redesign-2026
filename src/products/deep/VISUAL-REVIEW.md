# Deep redesign visual review

Reference: `assets/ref-deep.webp` was inspected for arrangement only. The resulting composition is original: no left sidebar, a Seer suite nav, one horizontal tool row, an information-finance context strip, a reversed EF fan chart, a virtualized outcome table, and a permanently vertical sticky trade rail.

First critique and fix pass: made Deep Funding visible as the asker, reframed the question around evaluator judgment, restored leaderboard and contest-tab reachability, moved the former repository sorts into the horizontal toolbar, and kept unavailable trader and participant-type data explicitly reported as unavailable.

Second critique and fix pass: raised muted dark text to an AA-calibrated token, separated display violet from readable violet text, expanded compact controls to at least 40px, corrected table header and row geometry at the 1024 breakpoint, protected scaled SVG strokes and tablet label size, removed hidden mobile SVG labels from the tab order, restored arrow-key row movement and Enter-to-open, added a zero-result clear action, and restored the visible close header on the 390px trade sheet.

Static verification covers all redesigned buttons, 58 theme contrast pairs, scoped TypeScript, the standalone bundle, archive and leaderboard fixtures, wallet cancellation/error paths, dialog isolation, and legacy component reachability. The fan chart uses real recorded price histories and the right rail never changes to a horizontal desktop layout.

Browser QA remains environment-blocked. Vite cannot bind `127.0.0.1:5188` (`EPERM`) and installed Chrome exits `SIGABRT` even for a minimal headless document. No 1440, 1024, or 390 screenshot approval is claimed, and F157 through F160 remain unchecked pending a browser-capable environment.


## V4 repair audit, 2026-10-23
The eight supplied page captures are blank. They cannot establish visible layout or contrast defects. The following ten defects were identified in source against overnight/v4/deep.md and repaired within Deep:
1. Header grid minimum widths exceeded tablet space. Flexible navigation columns and compact intermediate breakpoints now fit the controls.
2. Product navigation vanished on mobile. A native disclosure now exposes all products, contests and leaderboard.
3. Title and metadata competed in a single unwrappable row. They now wrap with readable title leading.
4. Context truncated the asker and required agent use line. Context wraps instead of ellipsizing.
5. Fan clamped every price into 50–90%, misrepresenting values outside that interval. The chart now uses a labelled 0–100% domain.
6. Fan names could collide with end percentages. Names have a separate shorter text budget and readable label type.
7. Table headers and rows used incompatible width constraints. A shared column definition aligns both, with contained scrolling at narrow desktop widths.
8. Empty tabs and the mobile fan imposed large fixed blank areas. State and chart heights now follow their content; the table viewport remains bounded.
9. Top 10 selected the first ten rows of any active sort. It now selects the ten highest probabilities independently of sort.
10. Trade review and amount survived outcome changes. Both desktop and mobile tickets reset on market identity; nonfinite amounts and duplicate connection requests are blocked.
Additional fixes: canonical seer-theme restores without a shell preference; liquidity includes its token unit; recorded snapshot no longer claims live data; selected changes receive semantic colors.

Control source audit: nav links and native disclosure navigate/open; theme toggles persistence; command search opens a searchable dialog; wallet controls invoke connect/network/balance handlers; round/status route to contests; category/sort/search update query state; forecast button opens CSV tools; fan ranges update geometry; paths/labels select and isolate; view and outcome tabs change URL state; row selection, keyboard detail navigation and stars have handlers; positions reads holdings; discussion copies links/opens guide; ticket side/leg/amount recompute estimates, review discloses unsupported signing; funds opens its drawer; history ranges recalculate; related outcomes select; mobile trade opens a closable sheet; share/footer controls copy, disclose or navigate. No successful signing is simulated.

Validation: scoped and repository TypeScript pass; standalone Deep production bundle passes; audit-current and v4-repair regressions pass. Browser verification remains blocked: Vite listen EPERM, Chrome SIGABRT before navigation. No rendered visual pass or resolution of the blank captures is claimed.


## V4 final spec repair
The eight supplied desktop/light/mobile captures are entirely white. Their cause cannot be determined from pixels alone; no successful rendered QA is claimed. The reference supplies arrangement only.

Ten worst code/spec problems addressed, in priority order:
1. A render exception could leave Deep blank: added a product-scoped recovery boundary with reload and live-app links. Lazy-import failures in the outer shell remain outside this boundary.
2. Mobile outcome search was beyond the horizontal toolbar: placed search first at full width and wrapped the remaining controls.
3. Preview unnecessarily required wallet connection: a valid amount now opens an honest review without signing or connecting.
4. Agent/human bars implied invented proportions: removed the bars from the rail and outcome rows; retained explicit missing-data labels and local forecast values.
5. Fan history discarded recorded transitions and drew smooth invented prices: preserved every recorded step in the selected period.
6. Fixed 438px SVG height letterboxed narrower desktop charts: use the native aspect ratio and reserve separate space for range controls.
7. Absolutely positioned chart readout could cover chart annotations: moved the readout into normal flow and restored it on mobile.
8. Short filtered lists reserved a full empty 464/520px viewport: bound height to the number of available rows while preserving virtualization.
9. Enter on outcome rows unexpectedly navigated while pointer click selected: Enter now selects; Alt+Enter and double-click explicitly open details.
10. Small mobile chart labels, ambiguous weekly changes, and inconsistent focus styling: raised label size, added the mobile 1W caption, percentage-point accessible label, and explicit focus outlines.

Control code review: header product/logo/docs links navigate; menu expands; command search opens a dialog and supports arrows/Enter; guide opens and closes; theme persists; wallet controls invoke the provider or show an error. Round/status navigate; category/query filter; sort changes ordering; forecasts open CSV tools; leaderboard navigates. Chart views and periods update state; lines/labels/rows select and isolate; tabs switch content; stars persist. Positions connect/read/retry; discussion copies a link or opens the guide. Trade side/leg/amount update estimates, review shows signing limitations, funds opens setup, history ranges update, related outcomes select, and mobile Trade opens a focus-trapped bottom sheet. Disabled actions expose prerequisites. This is source verification, not a passed browser dead-control test.

Validation: repository and Deep-scoped TypeScript passed; existing V4 repair and pass-12 data checks passed. Browser server launch failed with listen EPERM at 127.0.0.1:5188, preventing new captures and rendered layout/contrast verification.

## V4 screenshot critique repair, 2026-10-23

The eight supplied desktop/light/mobile captures contain no visible UI. They cannot establish overlaps or successful rendering. Changes below address source-confirmed defects against overnight/v4/deep.md. No browser-verified visual result is claimed.

1. Mobile fan used the desktop 1000-unit canvas despite hiding its right labels, wasting 24% of the instrument width. Compact viewBox is now 760 units.
2. Mobile removed axes, dates and crosshair entirely. Restored readable scale, UTC dates and touch/pointer crosshair; retained the selected outcome readout.
3. Independent UP markets were presented as a probability field without explaining their meaning. Added the originality-share interpretation and explicit independent-market semantics.
4. Snapshot status said Live and charts said NOW. Status now says Recorded round; chart endpoints identify the snapshot/date.
5. Weekly price differences were formatted as percentage changes. Rows and selected outcome now use percentage points, including the accessible label.
6. Small chart labels and 9px row metadata made dense data difficult to read. Increased row metadata, chart-label contrast and line visibility; shortened labels and supplied full-name SVG titles.
7. Table virtualization reset only when result count changed, leaving same-size filtered/reordered sets scrolled away from their first result. Reset now follows the actual result set; removed duplicate selection URL writes.
8. Repository details required an undisclosed double-click or Alt+Enter. Added a visible details action in the desktop rail and mobile trade sheet.
9. Stars persisted but offered no way to review saved outcomes. Added an explicit Watchlist filter with count and an All outcomes return action.
10. Outcome tabs lacked standard keyboard navigation; zero token prices could fabricate enormous buy estimates through a .0001 divisor. Added arrow/Home/End tab navigation and roving focus, and disabled preview when a valid positive token price is unavailable. Price-history geometry now preserves recorded step transitions and bounds its axis to 0–1.

Control source review: Header/WalletControl/CommandSearch, MarketToolbar, FanChart, chart-view switches, OutcomeTable/OutcomeRow, TradeRail, prediction upload/export, share, modal close/focus and funds/guide handoffs have state handlers, navigation targets or explicit disabled states. Existing unreported participant types remain honest unavailable text. Removed unused arbitrary 62% forecast-bar styling. This is source verification, not a claim of exhaustive browser dead-control coverage.

Validation: scoped and repository TypeScript checks passed; data-pass10, data-pass11, data-pass12 and v4-repair checks passed. Vite startup was attempted and failed with listen EPERM on 127.0.0.1:5188. Blank supplied captures remain unresolved evidence; rendered contrast, collision and mobile-sheet checks require a browser-capable environment.


## V4 deep art-direction and control repair
Supplied d0–d3, light and mobile captures are blank. Findings below come from source/spec inspection, not a claimed rendered comparison. Changes stay inside src/products/deep/.

Ten worst actionable source findings, repaired:
1. Guide actions targeted a removed workspace. All six now route to Funds, forecasts or trade-preview dialogs; stale strategy instructions updated.
2. Tablet navigation hid Opportunities, Risk and Docs without a menu. The complete product menu is now available at 901–1100px.
3. Fan view forced a 470px body even when its responsive SVG was smaller. Removed that minimum for fan view.
4. Mobile fan SVG was compressed below a usable inspection height. Added a 210px minimum and retained its viewBox ratio.
5. Five stacked leading-outcome rows crowded the mobile instrument. Use a leading full-width row and two compact paired rows.
6. Chart tabs lacked roving focus and arrow/Home/End navigation. Added both, retaining URL state.
7. Chart had no keyboard crosshair and 98 sequential path focus stops. Added keyboard scrubbing, a focusable chart, a usage hint and selected-path focus; all outcomes remain available in the keyboard-navigable table.
8. Hovering a lower-ranked outcome could highlight an unlabelled path. Label layout now includes the isolated outcome.
9. Mini history could stop before its snapshot marker; its marker used a separately supplied price. Extend the step path to the range end and position the marker at the actual final history value. Increased axis type size.
10. Trade estimates could overflow to Infinity and long values could escape the ticket. Validate the computed estimate, wrap long values, and add explicit amount/share accessible names.

Additional fixes: watchlist empty-state recovery, accessible virtual row counts/indices, tabular numerals and visible thin scrollbars.
Control source review: toolbar selects/search update filters or routes; chart ranges, hover, selection and views update state; outcome tabs, sorting, stars and position reads have handlers; wallet actions call the existing wallet implementation; ticket toggles, amount, review, funds, history and related outcomes have handlers. Guide now opens current dialogs. Search, theme, share, CSV and dialog dismissal retain their existing functional handlers. Unsupported capital actions remain explicitly unavailable; preview never signs.
Validation: repository and scoped TypeScript; V4 repair and pass-12 data checks. Vite fails listen EPERM on 127.0.0.1:5188; Chrome exits SIGABRT with kill EPERM. Both-theme 1440/1024/390 captures and exhaustive browser interaction verification remain blocked, not passed.
