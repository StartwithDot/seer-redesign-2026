# Innovation & technical spike — Deep
## Domain findings (from audit + references)
- Data truth (data/*.json): 98 repos, UP 0.545-0.848 (median 0.747; 91/98 inside 0.65-0.85), DOWN 0.08-0.37, UP+DOWN 0.81-1.03 (residual = unpriced/Invalid mass), 22-79 trades per repo series over 2026-10-01..10-18, ~$293 volume. The live chart wastes this: spaghetti inside a 0.2 band.
- Model math for the new views (all computed client-side from the real JSON):
  - spread view: position = UP price on a zoomed exact axis (0.50-0.90) or beeswarm collision-dodged;
  - change view: index_i(t) = UP_i(t) - UP_i(t0) (percentage points since the round started);
  - rank view: rank_i(t) = argsort_desc(UP_·(t)) on the 30-min step grid (830 buckets); rank delta = rank(t0)-rank(now);
  - residual_i = 1 - UP_i - DOWN_i (shown, never hidden); difference_i = predicted_i - UP_i (after CSV upload).
## Library decisions (research/deep_libs_digest.md, DeepSeek quote-verified; research/animation_libs_digest.md)
| lib | verdict | reason |
|---|---|---|
| Canvas 2D (native) | USE for the main 98-series instrument | spike below: 60 fps, zero deps |
| d3-scale / d3-shape / d3-array | USE (math only) | scales, step curves, bisect for hover |
| d3-delaunay | USE (tiny) | nearest-line/point picking for hover/touch on 98 marks |
| d3-force | SKIP | no graph requirement |
| pixijs | SKIP | Canvas2D already meets budget; no WebGL need |
| uPlot | SKIP | single-chart tool; we need custom morphing views |
| motion (framer-motion) | OPTIONAL for UI transitions only | default stack |
## Spike (products/deep/spike/index.html, run.mjs; headless Chrome 1440x700, dpr 1)
98 real UP series resampled to 830 half-hour buckets (81k vertices), step-stroked, with continuous value<->rank morph and per-frame highlight of one series. **Measured: 60-62 fps sustained over 7 s (frames per second: 62,60,61,60,61,61,61).** Budget with 3x headroom confirmed: hover isolate, scrub and lens morph are feasible without WebGL.
Finding from the screenshot (spike.png): the raw rank lens is very noisy (ties and 30-min jitter create vertical bars): the rank lens must be smoothed (daily median rank) or drawn only for isolated repos; ties broken by volume. This is a design input, not a failure.

## Signature-visual candidates this evidence supports (for Opus to choose or reject; not a design decision)
1. **Field instrument**: one canvas of 98 named marks; lens switch animates between Spread (zoomed exact axis / beeswarm), Change-since-start (index chart) and Rank (smoothed bump). Scrub replays the round.
2. **Ranked editorial list with inline UP|DOWN|residual bars** as the primary reading surface, the chart demoted to an isolated-repo detail (OWID/LMArena pattern).
3. **Prediction overlay**: after CSV upload each mark gets a predicted tick; the gap to market is drawn as a bar, so the agent builder sees edge directly (difference = predicted - UP).
## Performance/accessibility budget
Main thread frame <= 16 ms at 98 series x 830 buckets (measured above). Canvas must have an accessible twin: the ranked list is the screen-reader and keyboard path (every mark is a focusable list row). Reduced-motion: lens morph becomes a crossfade.
## Fixed technical facts the build must respect
Chart API takes <= 64 ids per call (2 calls for 98); stored prices 6 dp, displayed 4 dp; time grid 1800 s; markets-data supplies the repo names (chart ids are lowercase addresses, names come from markets-data keys); leaderboard supports period all|1d|1w|1m, limit up to 100.
