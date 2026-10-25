# Seer Explorer H: calibrated information

The user chose violet/lavender instruments. The design treats each market as an information instrument: one question, a calibrated distribution, a named source and an explicit next action. This is an Operate surface, built directly in code. The user-pinned skeleton wins over generic design-tool suggestions.

UI UX Pro Max was run with the supplied product brief, density 7, motion 3 and variance 4. Its useful outputs are data density, strong filtering, row highlighting, accessible contrast and responsive hierarchy. Its generic Enterprise Gateway, sales CTA, blue palette, external fonts and GSAP recommendations are rejected because they contradict this product's structure, EF identity and dependency budget. The raw generated result is preserved beside this file.

## Tokens

| Role | Dark | Light |
|---|---|---|
| Page | #101013 | #F7F7F9 |
| Panel | #1A1A1E | #FFFFFF |
| Nested | #1F1F24 | #F1F1F4 |
| Raised | #26262D | #E8E8EE |
| Primary text | #EDEDF2 | #17171C |
| Secondary text | #A8A8B3 | #5C5C66 |
| Readable muted | #9999A5 | #666672 |
| Primary action | #7B3AFF | #6C2BD9 |
| Outcome 1 fill/text | #9C6FF2 | #6C2BD9 |
| Outcome 2 fill/text | #D6C8FF | #38246E |
| Remaining outcomes | #A8A8B3 | #666672 |
| Positive PnL | #3DDC97 | #087548 |
| Negative PnL | #FF7B8E | #B82740 |
| Caution | #F5B84A | #855700 |
| Agent/info | #85B4FF | #255DB5 |

Primitive tokens map to semantic roles, then component states. No random per-category colours. Outcome 1 is a solid mark, outcome 2 a dashed/hollow mark and SVG hatch, remaining outcomes neutral. Name and value accompany every mark. Violet selection is independent of outcome ranking.

## Typography and geometry

Local Inter Tight variable font, no external font request. Addresses, ids and JSON alone use system monospace. Probabilities and amounts use tabular numerals, lining figures and stable reserved widths. Scale: display 40/44, market heading 28/34, hero 24/28, instrument 28/32, title 15/20, body 14/20, control 13/18, metadata 12/16. No tiny uppercase eyebrow decoration. Headings balance; permitted tile and inspector title truncation retains the complete question in a tooltip and accessible name. Full records wrap all key text.

Spacing uses 4 and 8px units. Page gutter remains clamp(20px,3.2vw,56px). Header 56px, subnav 56px, context at least 48px, hero 200px, 16px grid gaps, 200px tiles and a 416px inspector. Surface radius 16, nested radius 12, control radius 8. Tonal hierarchy provides depth. Hairlines are used for calibration, focus and selected state, never combined with large ambient shadows.

## Signature visual grammar

Every instrument uses a fine track, discrete tick marks, rounded solid primary stroke and patterned secondary stroke. Tiles show a calibrated half-arc with an explicit lead value. Scalars show their estimate on a bounded interval ribbon. Multi-outcome arcs show the first three plus a remainder track. Full gauges retain the same grammar with 0/25/50/75/100 ticks. History uses the actual timestamp spacing and unsmoothed observations. Runway uses a frozen-snapshot now marker, not the machine clock. Payoff and coin heights encode supplied or explicitly estimated numbers, not decoration.

The scale uses layered vector metal tones, a real fulcrum and suspended pans. It moves only in response to quote changes. The prompt's optional idle sway conflicts with its ban on decorative loops; the non-looping constraint wins. Coin rebounds are tiny and finite, with a still reduced-motion state. No 3D package is necessary.

## Icon system

One inline SVG symbol sprite, 20px grid, 1.75px stroke, round caps and joins. Open trade is a 16px arrow in a 32px desktop hit area, enlarged on touch layouts. Filter, view, navigation, copying, status, help and product glyphs share this construction. Brand raven geometry is preserved as the brand asset. Native inputs remain semantic, with authored visual treatment.

## Motion

| Time | Purpose | Easing |
|---|---|---|
| 120ms | press and focus feedback | out |
| 180ms | arrow nudge, hover, dropdown | out |
| 240ms | tabs, segmented indicators, amount changes | in-out |
| 400ms | instrument mark and quote-number update | out |
| 600ms | finite scale spring and coin settling | damped spring |

Out: cubic-bezier(.16,1,.3,1). In-out: cubic-bezier(.65,0,.35,1). Stagger: at most 16ms per tile, capped after 12 tiles, already-visible content only. No whole-page fade, ambient pulse, glowing dot, idle scale loop or ornamental background motion. Carousel progress reflects its six-second interval and pauses on hover/focus; reduced motion stops autoplay. Agent's scan accent runs once on entry. Reduced motion preserves immediate selected/pressed state and replaces motion with a short opacity change.

## Component states

Default, hover, pressed, selected, focus-visible, disabled, busy, empty and error are distinct. Validation identifies the custom amount problem beside the field and prevents preview confirmation. Dropdowns preserve hover intent, pinned click/keyboard opening, outside click, Escape and one-open-at-a-time behavior. Sticky panel actions remain reachable as the middle scrolls. Mobile overlays restore focus, contain Tab and keep their primary action clear of safe-area insets.

## EF departures

| Departure | Reason |
|---|---|
| Readable muted text replaces decorative muted swatches for small text | 4.5:1 text contrast is more useful than preserving an inaccessible swatch in a label. Raw kit colours remain available for nonessential decoration. |
| Light primary uses #6C2BD9 | The supplied EF secondary violet gives stronger white-label and adjacent-background contrast. |
| Outcome 2 uses deep indigo in light mode | The user's lavender family needs its own light-mode ink to retain clarity and contrast. |
| Dark outcome 1 uses lavender-violet for graph strokes | A thin instrument stroke needs at least 3:1 contrast against tonal panels. |
| Author-defined positive, negative, caution and info inks | These explain PnL, verification and Agent status; they never become rainbow market categories. |
| No shadows or gradients on page surfaces | Matches the explicit anti-slop constraints. Photos use a solid tonal scrim and restrained treatment rather than a gradient background. |

## Acceptance

Control parity, no fabricated data, complete route and state coverage, functional Open trade, reachable panel CTA at every requested size, no document overflow, measured contrast, clean runtime console, local-only rendering, reduced-motion behavior and reviewed screenshots. G file hashes must remain unchanged.

The development direction contract is recorded in REDESIGN_NOTES.md. Its provenance is the explicitly pinned human brief; no generated seed, QUALITY BAR card or approved image comp exists.
