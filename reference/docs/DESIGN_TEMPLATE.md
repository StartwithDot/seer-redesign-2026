# DESIGN.md template (use for products/<name>/design.md). Format adapted from the community DESIGN.md convention (awesome-design-md / awesome-claude-design), extended with our test-driven sections. Every section is mandatory; keep each concrete (values, not adjectives).

## 1. Visual Theme and Atmosphere
Thesis (1 sentence). World (metaphor + the real math it is bound to). Mood words (3) and what it must NOT feel like. How it differs from the other products (hero structure, density, rhythm, motion character).

## 2. Color Palette and Roles
Table: token name, role, dark hex, light hex, where used, contrast on --card. Surfaces/text are EF tokens (do not change). Only product semantic tokens here (`--sem-*`, `--series-*`). Colorblind rule: meaning never by hue alone (state the second channel).

## 3. Typography
Inter Tight sizes/weights per role (H1, section title, card title, label 12, value 28, mono only for addresses), tracking, numerals (tabular, thin space before units, U+2212 minus), rolling-number policy.

## 4. Component Stylings (with FIXED sizes)
Per component: dimensions, radii (concentric), states (default/hover/press/focus/disabled/loading/empty), motion, tooltip text. Include pills/tags/avatars/rows/buttons/menus/inputs/charts.

## 5. Layout Principles
Container (.page 1760), grid, gutters, vertical rhythm, hero structure and equal-height rules, breakpoints (320/360/390/768/1024/1440/1920/2560) and what changes at each.

## 6. Depth and Elevation
Tonal steps, inner highlight, shadows (dark vs light), overlays, blur.

## 7. Motion and Signature Animation
Tokens used, signature animation spec (inputs, math formulas, parameters, particle budgets, timings), alternate view, reduced-motion behavior, offscreen pause, test hooks (`canvas.__pulse`, `canvas.__labels`).

## 8. Do's and Don'ts
Product-specific guardrails (at least 8 each), including "never invent product terms", copy budget, allowed strings list.

## 9. Screens, Data, Tests and Agent Prompt Guide
Per-screen layout (ASCII wireframes ok) and interactions; deterministic data spec (ids, ranges, formulas, single sources of truth); tests to add on top of docs/ui-quality-rules.md section 12; acceptance checklist; and a ready-to-paste prompt for the builder agent that lists the files to read, the passes to run, and the verification commands.
