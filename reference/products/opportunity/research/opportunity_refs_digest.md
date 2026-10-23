# opportunity_refs: library/repo digest (DeepSeek, quote-verified)

# Library decision guide — Galton/Plinko, bump charts, rigid-body sieve

Fit scores are 0–10 for the stated React/TS, Vite, plain-CSS-token, `motion`, d3-math, hand-written canvas/SVG stack. “Repo size” below is the supplied repository size, not a bundle size.

## mjskay/election-galton-board

- **What it does:** R code that builds Galton/Plinko boards approximating 538 and Economist election forecast distributions via binomial approximations.
- **Header:** License **MIT** · Stars **28** · Last push **2021-01-24T15:03:14Z** · Repo size **357382**.
- **Bundle/perf notes:** No bundle size or perf benchmark stated. Build flow downloads latest model versions and re-renders everything via `build.R`; experimental `plinko` R package constructs animated Plinko boards.
- **Best use in our products:** **Reference/math source only** for forecast-derived pin probabilities: binomial approximations to model predictions, board construction, and animated Plinko-board structure. Not a React/TS runtime component.
- **Risks/costs:** R, not JS/TS/React; last push 2021; large repo size as supplied; no stated SSR/bundle behavior; no Tailwind/shadcn coupling stated. Cost is translation/reimplementation, not integration.
- **Verdict:** **SKIP** as a production frontend dependency — **3/10**. Use as a math/design reference.

## johnwalley/d3-bumps-chart

- **What it does:** A d3 plugin/generator for drawing bump charts, with year-range configuration and selection/highlight events.
- **Header:** License **BSD-3-Clause** · Stars **16** · Last push **2023-12-24T22:43:38Z** · Repo size **2195**.
- **Bundle/perf notes:** No bundle size or perf benchmark stated. Supports AMD, CommonJS, and vanilla; vanilla usage exports a d3 global. Window width can be set from document body client width.
- **Best use in our products:** Concrete **bump-chart rank view** for forecast rank changes across periods/years: `selectYear` for scrubbing, `toggleSelectedCrew` for selected series, `highlightCrew` for hover/highlight. The example’s filtering, sorting by year, `transformData`, and `joinEvents` pattern can be adapted to forecast series.
- **Risks/costs:** d3 plugin, not a React component; vanilla d3-global/event API; `crew`-oriented event names need adaptation; low stars and last push 2023; no stated SSR behavior; no Tailwind/shadcn coupling. Learning cost is d3 generator/event integration.
- **Verdict:** **CONSIDER** — **6/10**. Adopt only if the bump chart is a signature visual and this saves meaningful custom-d3 work.

## AnsonH/plinko-game

- **What it does:** A Svelte 5 Plinko game replication using Tailwind CSS and matter-js, with client-side physics and manual/auto-bet UI.
- **Header:** License **unknown** (`null`) · Stars **127** · Last push **2025-02-17T04:49:06Z** · Repo size **506**.
- **Bundle/perf notes:** No bundle size stated. Physics runs client-side, so the outcome is unknown until the ball reaches the bottom. A hidden local-development page benchmarks payout probabilities/expected values and was used to tune matter-js physics parameters and control expected payout.
- **Best use in our products:** **Reference implementation** for a multi-row pin pyramid, payout bins, manual/auto-bet modes, real-time live stats, and physics-parameter tuning. Useful for Plinko feel and payout-table behavior, not as a React component.
- **Risks/costs:** Svelte 5 + Tailwind CSS + matter-js, not React/TS; Tailwind coupling; license unknown/null — do not copy without clarification; client-side physics can make actual average return higher than expected value, sometimes positive; Stake.com’s server-calculated outcome model differs. No stated SSR behavior. Learning cost spans Svelte, Tailwind, and matter-js.
- **Verdict:** **SKIP** as a dependency — **4/10**. Reference-only; use Matter.js directly in React.

## liabru/matter-js

- **What it does:** A JavaScript 2D rigid-body physics engine for the web.
- **Header:** License **MIT** · Stars **18478** · Last push **2026-09-30T17:14:46Z** (as supplied) · Repo size **22802**.
- **Bundle/perf notes:** No bundle size or perf benchmark stated. Supports concave/convex hulls, mass/area/density, elastic/inelastic restitution, broad/mid/narrow-phase collision detection, stable stacking/resting, friction/resistance, sleeping/static bodies, chamfered corners, canvas vectors/textures, and time scaling for slow-motion/speed-up.
- **Best use in our products:** Concrete **Plinko physics** for balls falling through a pin pyramid into forecast bins; **rigid-body sieve** visuals; slow-motion signature reveals via time scaling; stable bin/stack behavior; canvas rendering of vectors/textures.
- **Risks/costs:** Physics tuning cost for pin spacing/restitution/friction; imperative canvas integration; if used for outcome-driven Plinko, client-side physics means the result is unknown until the ball reaches the bottom, and tuned parameters can shift expected payout. No stated SSR behavior; no Tailwind/shadcn coupling stated. MIT is low license risk.
- **Verdict:** **ADOPT** — **9/10** for any real rigid-body/Plinko/sieve visual.

## Which library for which visual

| Visual need | Use from supplied facts | Caveat |
|---|---|---|
| Galton board / Plinko forecast board | **Matter.js** for physics; **election-galton-board** as binomial/model reference; **plinko-game** as pin/payout/tuning reference | Election board is R; plinko-game is Svelte/Tailwind and license-unknown |
| Bump chart rank changes | **d3-bumps-chart** | Draws bump charts; general morph animation not stated |
| Physics sieves / rigid-body collisions | **Matter.js** | Rigid-body engine; not stated as a particle-field system |
| Animated chart morphing | **d3-bumps-chart** only for bump-chart rendering; no general morph library in facts | Morphing/animation support not stated |
| Particle fields | **None listed** | No supplied library states particle-field support |
| Scroll-driven storytelling | **None listed** | Not covered by supplied facts |
| Path/morph animation | **None listed**; d3-bumps-chart draws charts but path morph is not stated | Not covered |
| WebGL shader backdrops | **None listed** | Matter.js canvas renderer is vectors/textures, not stated as WebGL shader system |
| Number tickers | **None listed** | Not covered |
| Timeline choreography | **None listed** | Matter.js time scaling supports slow-motion/speed-up only |
| Manual/auto-bet UI + payout benchmark | **plinko-game** as reference | Svelte/Tailwind, unknown license |
| Forecast distribution math | **election-galton-board** as reference | R code, last push 2021 |

## Minimal stack recommendation

- **ALWAYS:** Keep the stated React/TS + plain CSS tokens + `motion` + d3 math + hand-written canvas/SVG stack as the default for non-physics visuals. For any core **Plinko / rigid-body sieve / collision** visual, use **Matter.js** — MIT, high stars, supplied last push, and the only listed engine with the needed collision, resting, friction, sleeping/static, canvas, and time-scaling features.
- **ADD ONLY WITH WRITTEN JUSTIFICATION:** `d3-bumps-chart` for bump charts only. Justify it against custom d3 work because it is small/BSD-3-Clause but low-star, last pushed 2023, d3-global/event-oriented, and not React.
- **REFERENCE ONLY — DO NOT DEPEND:** `election-galton-board` for binomial forecast math/board construction; `plinko-game` for pin pyramid, payout, auto/manual-bet, and physics-tuning patterns. Do not copy `plinko-game` code without clarifying its null license.
- **DO NOT EXPECT FROM THIS LIST:** particle fields, scroll-driven storytelling, path/morph animation, WebGL shader backdrops, number tickers, or timeline choreography. None are supplied by these facts; build/evaluate them outside this fact set.