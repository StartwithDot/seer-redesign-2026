# Product identity guide: one family, six distinct worlds
Goal: each product must feel designed for ITS thesis, not skinned from a template, while still obviously Seer/EF. Judges open six links: the family resemblance must be the EF skeleton; the personality must be the product's idea.

## 1. What is fixed (EF skeleton, never changes)
- Tokens in packages/ef/tokens.css: surfaces (--bg #101013, --card #1A1A1E, --nested #1F1F24; light #F7F7F9/#FFFFFF/#F0F0F3), text (#EDEDF2/#A8A8B3/#67676F), violet primary (#7B3AFF, hover/press variants), violet-soft secondary surfaces, Inter Tight (+ JetBrains Mono only for addresses), concentric radii (16/12/8), tonal separation without borders, 4px grid, header pattern (brand · nav · search pill · help · theme · Connect Wallet), footer pattern, dark default with light mode.
- Primary actions (Connect Wallet, Create, Open, Confirm) stay EF violet/white everywhere.
- Layout container, fixed-size components, label/overlap/motion/test rules from docs/ui-quality-rules.md.

## 2. What each product MAY vary (and must, deliberately)
1. THESIS + WORLD: one sentence + a visual metaphor taken from the product's real mechanism and math.
2. Semantic data colors (see section 3).
3. Hero structure (do not repeat Futarchy's "signal list + chart card"): pick from list/board/matrix/field/timeline/map/ladder patterns that fit the data shape.
4. Density and rhythm: dense instrument (Risk, Explorer), kinetic board (Opportunity), calm architectural (Futarchy), exploratory field (Deep).
5. Motion character: tempo, easing, particle behavior, signature animation (section 4).
6. Information scale: big thin numerals vs compact tabular grids, chart height ratios, card density.
7. One distinctive component family (Futarchy: fork glyph + corridor + gauge; Risk: band gauge; Opportunity: lanes; Deep: UP/DOWN pair bars; Explorer: market card + table).

## 3. Color organization (switching colors carefully)
Rules:
- Surfaces and text never change. Only SEMANTIC and DATA colors vary, defined in `apps/<p>/src/product.css` as named tokens (`--sem-*`, `--series-*`) that reference the approved palette below; never raw hex in components.
- Each product may use: EF violet (always), at most TWO additional chromatic families for meaning, plus the shared status colors for deltas/LIVE. Every color has a role written in the product spec's color table (role, dark hex, light hex, where used, contrast).
- Contrast: text >= 4.5:1, graphics/lines >= 3:1 on --card in BOTH themes; verify by script (WCAG formula) or test 11; colorblind safety: never encode meaning by hue alone (add shape/position/label/pattern).
- Light mode gets its own darker variants (do not reuse dark hex).
Approved palette (extend only with the user's approval):
| Name | Dark | Light | Typical meaning |
|---|---|---|---|
| violet | #7B3AFF | #6C2BD9 text / #7B3AFF fill | EF primary, YES/UP/selected/market |
| lavender | #9C6FFF | #6C2BD9 | secondary violet text |
| ink-grey | #A8A8B3 | #5C5C66 | NO/DOWN/neutral thread |
| green | #3DDC97 | #12915F | positive delta, Low risk, Open |
| amber | #F5B84A | #B9770E | caution, Moderate risk, Resolving, sponsor/decision |
| orange | #FF8A4C | #C2551A | High risk |
| red | #FF5C72 | #D1334A | negative delta, Exclude, Critical risk |
| blue | #5B9DFF | #2F6FD6 | agents/Deep UP, informational |
| teal | #2FD4C0 | #0E9A8B | cool accent for instruments (Risk), series 3 |
Proposed identity per product (confirm in each product's own spec):
- Futarchy (DONE): violet YES vs ink-grey NO; verdict Include=violet, Neutral=grey, Exclude=red. Calm, slow (600-900ms), thin 300-weight numerals.
- Risk Pricing: cool instrument. Severity ramp bound to the REAL bands (Low 0-2% green, Moderate 2-5% amber, High 5-10% orange, Critical 10%+ red); market estimate marker in violet; user prediction marker in teal (distinct from the market). Dense tabular, precise, quick (160-300ms) motion, faint measurement grid texture allowed on chart areas only.
- Opportunity Markets: kinetic selection. Market odds violet; SPONSOR/REVIEWER decision uses amber/gold so the two authorities are never confused; leader highlighted with a violet halo; springy FLIP reorders, fast.
- Deep: agents and ecosystems. UP = blue, DOWN = ink-grey; up to 6 categorical series from violet/blue/teal/amber/lavender/red with hover isolation (dim others to 20%); exploratory/field motion (relaxation, flocking).
- Explorer: neutral workhorse (Etherscan-like). Mostly neutrals + violet; outcome colors for donuts from the categorical set; status colors Open green, Resolving amber, Resolved grey; density highest, motion minimal and crisp.
- Home: the ecosystem map shows each product's accent as a small chip, no new colors.

## 4. Signature animation per product (bound to real math, not decoration)
- Futarchy (done): conditional prices fork (GBM + Ornstein-Uhlenbeck gap), Signal head halo/sparks (momentum), ribbon shimmer, corridor proximity glow, Field view (flow-field streams to a decision gate).
- Risk (suggested): defaults as a Poisson process: hazard-rate visualization. PD (annual) -> hazard lambda = -ln(1-PD); show survival curve S(t)=exp(-lambda t) per asset as a living "tide line" that drains over the quarter; the headline "chance no listed asset defaults" is the product of survivals; animate sampled default events as rare sparks (Monte Carlo with seeded RNG) and let users drag the horizon. Band gauge with moving market-estimate marker.
- Opportunity (suggested): triage as a sieve/Galton board: many submissions fall through pegs weighted by odds, collecting into a ranked top; FLIP reordering as odds tick; sponsor lane locked until decision.
- Deep (suggested): repositories as territories (Voronoi/treemap with Lloyd relaxation) split into UP/DOWN halves; prices tick the borders; agent predictions flock toward consensus.
- Explorer (suggested): minimal: live-ticking numbers, sparkline draw-in, density-first micro-interactions (row hover preview), no heavy particles.
Rule: the animation must explain something the numbers alone cannot (direction, tension, uncertainty, authority, scale).

## 5. How to start a new product (checklist)
1. Docs digest (DeepSeek product_docs.py) + live UI notes + newcomer-confusion list (products/<p>/docs.md, live-ui.md).
2. Thesis + world + math (products/<p>/world.md) and a color table (section 3).
3. Hero structure choice that differs from previous products; written spec design.md with allowed strings, components, sizes, per-screen layout, motion budget, tests to add.
4. Scaffold apps/<p> (copy apps/futarchy config/deps), reuse shared pieces by copying the proven components (HoverMenu, Tooltip, Avatar system, RollingNumber, Segmented, label engine, pulse system, tour, palette, router) then adapt styling; extract to packages/ui only if the user asks.
5. Passes (a: foundation+layout+controls, b: hero/signature, c: detail/secondary views, d: tour+tests), then e2e, real captures, Opus review loop, final polish.
