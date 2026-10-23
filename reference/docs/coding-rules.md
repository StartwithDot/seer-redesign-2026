# Coding rules for builders (ChatGPT/Codex). Binding. Violations are rejected in review.

## Stack (fixed, do not add libraries without a written reason in the PR note)
Vite + React 19 + TypeScript (strict). Styling: plain CSS files / CSS Modules + tokens from packages/ef/tokens.css. Animation: `motion` (springs, layout/FLIP, presence), CSS (scroll-driven, view transitions, `linear()` easing), canvas 2D / raw WebGL for the signature visual. Math/data: d3-scale, d3-shape, d3-array, d3-random (seeded). NO Tailwind, NO component kits (MUI, shadcn, Chakra), NO icon packs (draw inline SVG), NO charting libs (draw SVG/canvas), NO state libs, NO router unless the spec says so.

## Anti-slop law
- No gradient text. No gradient backgrounds except where the product spec names one. No glassmorphism, no glow shadows, no neon outlines, no emoji, no stock "sparkle" icons.
- No row of three feature cards. No centered hero + subtitle + two buttons template. No icon-in-colored-circle stat cards. No testimonial/pricing/FAQ patterns.
- Copy budget: every visible string is either (a) in the product's spec, or (b) a data label/unit. Never write marketing prose, helper paragraphs, or disclaimers inside the UI. Headline <= 5 words, caption <= 10 words.
- All colors from tokens. Surfaces separate by tonal steps, not borders. Radii concentric (inner = outer - padding). Spacing only from the 4px scale.
- Numbers: font-variant-numeric: tabular-nums everywhere; money/percent never jump width.
- Placeholder data must be deterministic (seeded) and believable (real token names, real-looking ranges); never "Lorem", "Item 1", "John Doe".

## Motion law
- Durations from tokens only (90/140/420ms) except the signature animation, which the spec timeboxes. Easing: --ease-out or --ease-spring. No bounce on data, only on press/enter.
- Every animation is tied to meaning in the spec (state change, data tick, entry). No ambient decorative loops except the signature visual named in the spec.
- Respect prefers-reduced-motion (swap movement for opacity, stop tickers).
- 60fps budget: canvas redraw only on change or rAF while visible (IntersectionObserver), cap devicePixelRatio at 2, no layout thrash.

## Code law
- TypeScript strict, no `any`, no unused code, no dead files. Small components (<150 lines), pure math in src/math/ with unit-style comments on the formula.
- `npm run build` and `npx tsc --noEmit` must pass before you finish. Report the command output tail.
- Accessibility: semantic elements, visible focus ring (2px violet, 2px offset), 40px minimum touch targets, aria-labels on icon buttons, keyboard operable.
- Do not edit packages/ef/tokens.css except to add a token the spec names. Do not touch other apps.
- Do not commit, do not push, do not install global packages.

## Definition of done
Matches the product's design.md literally, works at 390/768/1440, no console errors, no horizontal scroll, light and dark both correct.


## Library policy (updated): default stack + justified additions
Default stack (always allowed): React 19, TypeScript, Vite, `motion`, d3-scale/shape/array/random, hand-written canvas 2D/SVG, raw CSS. Still forbidden: Tailwind, component kits (MUI/shadcn/Chakra), icon packs, state libs, UI chart kits with their own look.
ADDITIONS are allowed ONLY with a row in the design.md "Library justification" table: library, license (permissive only), version, gzip size, what it enables that hand-written canvas/SVG + motion cannot, perf evidence from the Phase C spike (>= 55 fps), fallback, and the user's OK for anything > 40 KB gz. Candidates evaluated in research/animation_libs_digest.md (GSAP, Lenis, three/ogl, pixi, matter-js, tsparticles, vizzu, Observable Plot, visx, unovis, ECharts, theatre.js, rive/lottie). Total extra JS beyond the default stack: budget 150 KB gz per product. Lazy-load (dynamic import) any heavy library used only by an alternative view.
