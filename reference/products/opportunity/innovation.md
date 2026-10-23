# innovation.md: Opportunity Markets (Phase C)
Sources: research/opportunity_refs_digest.md (DeepSeek, quote-verified, gh metadata), research/animation_libs_digest.md, spike in apps/opportunity/spike (measured here). Tags: [verified] = read this session; [recalled] = from memory, NOT fetched, verify before citing in design.md.

## 1. Domain references (what to borrow / avoid)
| # | Reference | Tag | Borrow | Avoid |
|---|---|---|---|---|
| 1 | mjskay/election-galton-board (MIT, 28★, 2021) | verified | Binomial pin probabilities from a forecast; board of pins as an explanation of uncertainty | R tooling; a falling-ball spectacle that carries no per-item data |
| 2 | AnsonH/plinko-game (license null, 127★) | verified | Pin pyramid + payout bins, physics tuning via a benchmark page | Tailwind/Svelte code; unknown license: reference only, never copy |
| 3 | johnwalley/d3-bumps-chart (BSD-3, 16★, 2023) | verified | Rank-over-time "bump" encoding with hover highlight and scrubbing | Its API; we draw our own rank lines in SVG |
| 4 | Seer Futarchy (our finished product) | verified (repo) | Label engine, FLIP, pulse system, e2e harness | Its list + chart hero (identity guide forbids reuse) |
| 5 | Polymarket multi-outcome event pages | recalled | Outcome list sorted by odds with a Yes/No quick-buy per row | Long flat list with tiny multi-line chart (same crush as 002) |
| 6 | Kalshi / Manifold multi-choice markets | recalled | Row click opens trade ticket inline | Equal-weight rows for a 235-option field |
| 7 | Eurovision / sports leaderboards with live rank arrows | recalled | Rank-change chevrons and reorder animation that explains who moved | Decorative confetti |
| 8 | Hacker-News / Product Hunt style ranked submission boards | recalled | Rank number as the dominant element; submission = row with one line | Vote counts instead of prices |
| 9 | Gitcoin / Optimism RetroPGF ballot UIs (allocation of mass over many projects) | recalled | Mass allocation shown as areas, not just numbers | Wallet-first onboarding walls |
| 10 | Lorenz / Pareto curves in economics dashboards | recalled | One curve says "k items hold c% of mass" | Gini jargon |

Result: no reference shows *market price as triage with an authority above it*. The unoccupied ground is (a) concentration of crowd mass across a large field and (b) a visibly separate human decision.

## 2. Model for the signature visual (all numbers from the audit, 003)
- Field: 235 outcomes; tiers: 105 priced (top 8 = review set candidates; ranks 62-105 are 46 rows tied at the 0.4% / $0.004 floor), 130 unpriced ("—"). Prices sum to 99.0%.
- **Coverage curve** C(k) = sum of the k highest odds. Measured: C(3) 13.6%, C(8) 29.7%, C(15) 45.4%, C(27) 60.4%, C(40) 70.0%, C(61) 81.4%, C(105) 99.0%. Review saving S(k) = 1 - k/235; e.g. reviewing 27 entries (89% saved) covers 61% of crowd mass.
- **Honest message**: the crowd is not decisive (leader 5.9%); concentration is moderate. The visual shows that tension: "review k, cover c%", not a fake sure thing. Uncertainty = lane width/area; authority = a separate sponsor lane that no price animation can enter.
- Motion bound to meaning: dots move only when odds change (spring FLIP, k distance = rank change); mass flows between tiers when an outcome crosses the floor or becomes priced. No ambient loop.

## 3. Spike result (apps/opportunity/spike/index.html, measure.mjs; headless system Chrome, 1000x420 canvas, DPR 2, 6 s after 0.5 s warmup)
| Engine | N bodies | fps | p95 frame | JS work/frame |
|---|---|---|---|---|
| hand-written Verlet + spatial hash + 240 pegs | 235 | 60.0 | 16.8 ms | 1.34 ms |
| matter-js 0.20.0 | 235 | 60.0 | 16.8 ms | 0.96 ms |
| hand-written | 705 (3x) | 60.0 | 16.7 ms | 3.05 ms |
| matter-js | 705 | 60.0 | 16.8 ms | 3.23 ms |
Frame budget is therefore not a constraint at the real field size (target >= 55 fps: PASSED, 5x headroom at 3x load). Caveats: headless, not a mid laptop under load; interaction (hover, drag) not yet included.
**Visual finding (honest)**: the *falling-balls* version rendered poorly (shot-verlet.png, shot-matter.png): after 6 s the pile is a flat row and two leaders are still falling; it explains nothing the coverage curve does not. Decision: do NOT make a drop animation the hero. Physics stays only for settling/collision (so 235 dots do not overlap in the beeswarm), run once to equilibrium per odds update.

## 4. Library decisions
| Library | Decision | Reason |
|---|---|---|
| motion (already in stack) | ADOPT | springs, layout/FLIP for rank reorder, presence |
| d3-scale / d3-shape / d3-array / d3-force (collide only, or own hash) | ADOPT (scale/shape/array); force only if own relaxation is bigger | log-odds scales, coverage curve path, beeswarm packing |
| matter-js (25.9 KB gz measured, MIT) | SKIP | equal fps to hand-written (spike), adds 26 KB; DeepSeek's 9/10 ADOPT overridden by measurement |
| ogl / three / pixi | SKIP for hero | 235 circles at 1 ms/frame on canvas 2D; no shader need |
| GSAP / Lenis | SKIP | no scroll story on this product |
| tsparticles | SKIP | generic preset look |
| d3-bumps-chart | SKIP | draw rank lines ourselves |
| lightweight-charts (what the live site uses) | SKIP | house rule: no chart libs; its stepped lines caused the crushed chart (002 s2) |
Final stack: default stack only, zero additions, so no library justification row needs the user's OK.

## 5. Native platform features
CSS View Transitions for route/theme (already in Futarchy `viewTransition.ts`); `linear()` springs for hover/press; `@property` for animated conic/percent values; `content-visibility: auto` for the 235-row list plus row virtualization fallback; IntersectionObserver to pause canvas offscreen; OffscreenCanvas not needed at this load. Fallbacks: reduced motion = static frame, no FLIP.

## 6. Borrowed micro-details
`.btn-bubbles` (Futarchy copy of Uiverse) for Connect / Open. Nothing new from uiverse.io yet.

## 7. Implication for concepts (input to Phase D)
Three genuinely distinct directions the evidence supports: (1) **Coverage curve as the hero** ("Review k, cover c%" with a sponsor lane), (2) **Beeswarm field** (position = log odds, area = odds, tiers visible), (3) **Rank board with bump lines** (rank over time, FLIP). The falling sieve is demoted to a micro-motion.
