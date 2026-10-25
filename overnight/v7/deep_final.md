# DEEP v2 — FINAL FIX + MODERNISE (folder apps/deep-v2, React+TS). Read overnight/v7/COMMON.md and overnight/v7/deep-v2.md. The attached owner screenshot (top-most image) shows the CURRENT BROKEN table: 'Trade' buttons clipped at the right edge, a stray 'ethereum/consensus-specs' dropdown overlapping the 'Repositories' header and table header, icons hidden under neighbours.
The owner is furious: last day. Fix EVERYTHING, then self-check against the QA report the driver attaches (target: 0 overlap, 0 clipped, 0 icon-outside, 0 console errors).
## A. Bugs (from the automated tester)
1. Repositories table: columns must FIT the left column at 1440 and 1024 with no horizontal clipping: use a CSS grid with fixed/min-max columns (rank 56px, repo minmax(160px,1fr) with ellipsis, signal 150px, UP 80px, delta 80px, spark 96px, action 96px), the action 'Trade' button fully visible; below 900px switch rows to stacked cards. The stray dropdown/listbox that shows the selected repo name on top of the header must not overlap (find the search/autocomplete popup and position it correctly or hide until typing).
2. Mobile (390): `span.repository-name` is clipped without ellipsis: add text-overflow ellipsis + min-width:0 up the flex chain.
3. Leaderboard chart: the SVG labels (address · $ · markets) collide with each other: use label collision avoidance (show labels for top 5 only, others on hover with a floating tooltip), thicker hit areas, and keep the data.
4. Guide: buttons overlap each other ('Start here', 'Add sUSDS' vs 'Open full documentation', 'Do it now' vs Replay/Hide all): fix the guide drawer layout (flex column, wrap, 12px gaps; do not let it sit under the chart controls; drawer z-order above content with its own scrim).
5. Swarm view on mobile: 'Chart' button overlaps the replay play button: re-flow the controls (wrap to a second row).
## B. Modernise and make it feel alive (no fake live data, honesty stays)
- Page entrance: staggered rise for stat ribbon, chart card, desk, table rows (first 12 rows), 600ms, once.
- Numbers ease to new values (median, price, gap) when selection/range changes; the selected repo ribbon pulses once; sparklines in rows draw in on first reveal.
- Chart: hover highlight with the glass tooltip (exists) + smooth dimming; add a 'follow cursor' vertical rule with time label; the replay scrubber shows a moving playhead with trailing fill; draw-in on range change.
- Desk stepper: the progress line fills smoothly as steps complete; step buttons have loading and success micro-states (mock) with a check animation.
- Tabs and segmented controls: sliding thumb/underline everywhere (Markets/Leaderboard/Guide, Split/Swarm, UP/DOWN, ranges, section nav).
- Section nav (Repositories / Repository detail / Funds / Predictions / Replay) with scroll-spy and smooth scroll inside the scroll column.
- Leaderboard tab: podium for top three (rank numerals in Inter Tight, avatar chips, profit, volume, ROI) animated in, then the table; Guide tab: step cards with simple SVG diagrams.
- One typeface (Inter Tight), icons always inside their buttons (flex:none, 16-18px), consistent 8px rhythm, reduced-motion respected.
## Rules
Keep every feature and data-testid. After editing run `npx tsc --noEmit` (in apps/deep-v2). The driver rebuilds, re-runs the QA and screenshots, and sends you the next report. Report 6 lines.

## C. REAL STACKING BUG found by the tester (fix first)
When `.workspace-scroll` is scrolled, paths from `svg.rank-flow` (including the transparent 22px hit paths) are the top element at the centres of the sticky second-bar tabs (Markets, Leaderboard, Guide, Contest, Round chip) and the shell logo: they would steal clicks. Contain the chart: `contain: paint; overflow: hidden; isolation: isolate` on the chart card / svg wrapper, set `overflow: hidden` on `.workspace-scroll`'s horizontal axis, give the second bar and header `position: relative; z-index` above the scroll content, and make decorative/transparent hit paths `pointer-events: stroke` only inside the plot. The tester's overlap list for a `path` over `a.sb-tab` / `button.menu-trigger` / `a.sg-brand` must be empty.
