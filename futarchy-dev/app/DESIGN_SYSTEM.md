# Futarchy at Seer Design System

Status: normative specification for every Futarchy route, state, theme, viewport, and interaction.

Product model:

> Each milestone is a conditional market. PASS forecasts the token price if the proposal passes. FAIL forecasts the token price if it fails. The GAP between those forecasts produces an Include, Neutral, or Exclude verdict. The DAO still decides.

Every existing route, query parameter, control, tooltip, modal, tour step, command, `data-testid`, `data-tour`, `aria-label`, and behavior remains available. Implementation may improve semantics or add labels, but must not rename or remove an existing contract.

## 1. Principles

### 1.1 Five-second comprehension

The primary reading path is always:

1. What proposal is being considered?
2. Which DAO asked the question?
3. What is the PASS forecast?
4. What is the FAIL forecast?
5. How large is the GAP?
6. Is the verdict Include, Neutral, or Exclude?
7. What can the user do next?

At a squint, the question leads, the paired forecasts support it, the GAP provides the verdict, and the primary action remains singular.

Use this canonical explanation wherever first-time comprehension is needed:

> PASS and FAIL markets forecast the token price under each outcome. Their GAP is the signal. The DAO still decides.

### 1.2 Parallel conditions, not opposing brands

PASS and FAIL belong to one market and one EF visual system.

- PASS uses a solid violet line.
- FAIL uses a dashed tint-white line in dark mode and a dashed graphite line in light mode.
- Every line is directly labeled.
- GAP direction uses a bracket, sign, and text.
- Color never carries the distinction alone.
- No blue, orange, teal, green, red, or unrelated accent hue is permitted.
- No gradient, glow, blurred decoration, glass effect, or purple-to-pink treatment is permitted.

### 1.3 Honest affordances

Only elements that perform an action may look like controls.

- A filled violet shape means a primary action.
- A tonal shape means a secondary action or explicit mode switch.
- Ghost actions use text and an icon, then gain an underline on hover.
- Informational status, verdict, time, organization, chain, and counts never use pill backgrounds or borders.
- Data tracks may use capsule geometry because the shape encodes a measured range, not an action.
- Hardware key notation may use a keycap shape because it represents a physical key, not a clickable control.

### 1.4 Lanes carry the product model

Milestones are lanes, not collections of interchangeable cards.

- Every active milestone is a full-width lane.
- PASS, FAIL, GAP, and verdict remain visible in the row.
- Selecting a lane updates one stable preview panel.
- Repeated surfaces use proximity and tonal steps before containers.
- Nested cards are prohibited.

### 1.5 The verdict informs, the DAO decides

The verdict is never presented as an automatic governance decision.

- The exact sentence `The DAO still decides.` remains visible within 24px of the verdict gauge and preview verdict.
- Use `Include`, `Neutral`, and `Exclude` only for the market-derived verdict.
- Use `PASS` and `FAIL` for conditional market series.
- Use `Resolved PASS` or `Resolved FAIL` for final proposal outcomes.
- Use `YES` and `NO` only when exposing an underlying oracle value is technically necessary, and pair it with the human term.

### 1.6 Progressive expertise

The default view answers the decision question. Advanced detail stays available without competing with it.

Default:

- PASS price
- FAIL price
- GAP
- verdict
- time remaining
- volume
- primary action

Disclosed on request:

- spot price
- TVL
- liquidity depth
- slippage
- oracle identifiers
- raw addresses
- complete chart data
- settlement metadata

### 1.7 Operational precision

- Normal text contrast is at least 4.5:1.
- Large text and data lines are at least 3:1 against their background.
- Focus is always visible.
- Pointer targets are at least 40px by 40px.
- Phone targets are 48px high where space permits.
- Numbers use tabular figures.
- Charts have text summaries and data-table alternatives.
- Motion explains state and relationship. It never delays input.
- At 200% zoom, content may grow beyond nominal row heights rather than clip.

## 2. Tokens

### 2.1 Color roles

The palette is violet and neutrals only. Transparency may only derive from a listed violet or neutral.

```css
:root,
[data-theme="dark"] {
  color-scheme: dark;

  --color-page: #101013;
  --color-surface: #1A1A1E;
  --color-surface-raised: #1F1F24;
  --color-surface-selected: #241E33;

  --color-text: #EDEDF2;
  --color-text-secondary: #A8A8B3;
  --color-text-tertiary: #67676F;
  --color-on-primary: #FFFFFF;

  --color-violet: #7B3AFF;
  --color-violet-hover: #8A55FF;
  --color-violet-pressed: #6C2BD9;
  --color-violet-soft: #241E33;
  --color-violet-text: #9C6FF2;
  --color-violet-tint: #C9B6FF;

  --color-pass-line: #8A55FF;
  --color-pass-text: #9C6FF2;
  --color-pass-fill: rgba(123, 58, 255, 0.24);

  --color-fail-line: #D8CBFF;
  --color-fail-text: #C9B6FF;
  --color-fail-fill: rgba(216, 203, 255, 0.12);

  --color-gap-fill: rgba(123, 58, 255, 0.24);
  --color-rule: rgba(237, 237, 242, 0.08);
  --color-grid: rgba(237, 237, 242, 0.06);
  --color-scrim: rgba(16, 16, 19, 0.80);
  --color-selection: rgba(123, 58, 255, 0.32);
  --color-focus: #D8CBFF;
  --color-caret: #C9B6FF;
}

[data-theme="light"] {
  color-scheme: light;

  --color-page: #F7F7F9;
  --color-surface: #FFFFFF;
  --color-surface-raised: #F0F0F3;
  --color-surface-selected: #EFE9FC;

  --color-text: #17171C;
  --color-text-secondary: #5C5C66;
  --color-text-tertiary: #8E8E99;
  --color-on-primary: #FFFFFF;

  --color-violet: #6C2BD9;
  --color-violet-hover: #7B3AFF;
  --color-violet-pressed: #6C2BD9;
  --color-violet-soft: #EFE9FC;
  --color-violet-text: #6C2BD9;
  --color-violet-tint: #6C2BD9;

  --color-pass-line: #6C2BD9;
  --color-pass-text: #6C2BD9;
  --color-pass-fill: rgba(108, 43, 217, 0.24);

  --color-fail-line: #5C5C66;
  --color-fail-text: #5C5C66;
  --color-fail-fill: rgba(92, 92, 102, 0.12);

  --color-gap-fill: rgba(108, 43, 217, 0.24);
  --color-rule: rgba(23, 23, 28, 0.08);
  --color-grid: rgba(23, 23, 28, 0.06);
  --color-scrim: rgba(23, 23, 28, 0.56);
  --color-selection: rgba(108, 43, 217, 0.24);
  --color-focus: #6C2BD9;
  --color-caret: #6C2BD9;
}
```

Usage constraints:

- `--color-text-tertiary` is limited to disabled text, decorative axis ticks, and nonessential metadata. It is not valid for normal body copy.
- Placeholder text uses `--color-text-secondary`.
- Generic positive and negative deltas use a sign, arrow, and text. They do not introduce green or red.
- PASS and FAIL labels always accompany their line styles.
- Error and success states use an icon, explicit copy, and the neutral or violet palette.
- Text selection uses `--color-selection`.
- Form carets use `--color-caret`.

### 2.2 Spacing

All structural layout uses an 8px grid. The 4px icon gap and 12px compact control padding are documented optical exceptions.

```css
:root {
  --space-0: 0;
  --space-icon: 4px;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 40px;
  --space-6: 48px;
  --space-7: 56px;
  --space-8: 64px;
  --space-10: 80px;
  --space-12: 96px;
  --space-16: 128px;

  --padding-control-compact: 12px;
  --padding-control: 16px;
  --padding-panel: 24px;
  --gutter-page: 24px;
  --gutter-page-phone: 16px;
  --gap-column: 24px;
  --gap-section: 32px;

  --p-density: 1;
}
```

- Related text uses 4px or 8px separation.
- Label to value uses 4px.
- Control groups use 8px.
- Related component groups use 16px.
- Panel content uses 24px.
- Major sections use 32px.
- Page-level narrative separation uses 48px or 64px.
- Density must never reduce a touch target below 40px.

### 2.3 Radius and shape

```css
:root {
  --radius-none: 0;
  --radius-control: 8px;
  --radius-inner: 12px;
  --radius-panel: 16px;
  --radius-cta: 20px;
  --radius-circle: 999px;
}
```

- Primary and secondary calls to action use `20px`.
- Utility controls, inputs, filter chips, tabs, and menus use `8px`.
- Nested chart tooltips and compact internal surfaces use `8px` or `12px`.
- Task panels use `16px`.
- Icon buttons are 40px circles.
- Informational labels have no container radius because they have no container.
- Capsule tracks and status dots are data-shape exceptions, not control shapes.

### 2.4 Tonal elevation

Elevation uses surface color only. `box-shadow`, glow, backdrop blur, and translucent glass surfaces are prohibited.

| Level | Dark | Light | Use |
|---|---|---|---|
| 0 | `#101013` | `#F7F7F9` | Page |
| 1 | `#1A1A1E` | `#FFFFFF` | Primary task panel |
| 2 | `#1F1F24` | `#F0F0F3` | Raised control, menu, nested chart field |
| Selected | `#241E33` | `#EFE9FC` | Selected lane, selected mode, focused data context |
| Overlay | `#1F1F24` | `#FFFFFF` | Modal, command palette, tour popover |

A 1px tonal rule may separate dense table rows. It must use `--color-rule`, not a contrasting border.

### 2.5 Typography

Inter Tight variable is the only interface family.

```css
:root {
  --font-ui: "Inter Tight", "Arial Narrow", Arial, sans-serif;

  --font-size-12: 12px;
  --font-size-14: 14px;
  --font-size-16: 16px;
  --font-size-20: 20px;
  --font-size-25: 25px;
  --font-size-31: 31px;
  --font-size-39: 39px;

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;

  --line-16: 16px;
  --line-24: 24px;
  --line-32: 32px;
  --line-40: 40px;
  --line-48: 48px;
}

html {
  font-family: var(--font-ui);
  font-optical-sizing: auto;
  font-synthesis: none;
  font-feature-settings: "tnum" 1, "case" 1;
}
```

Load one variable WOFF2 containing weights 400 through 600. Use `font-display: swap`. Preload only that critical file.

| Role | Size / line | Weight | Tracking | Measure |
|---|---|---:|---:|---:|
| Display | `39px / 48px` | 600 | `-0.02em` | `18ch` |
| Page title | `31px / 40px` | 600 | `-0.015em` | `32ch` |
| Section title | `25px / 32px` | 600 | `-0.01em` | `36ch` |
| Component title | `20px / 24px` | 600 | `-0.01em` | `40ch` |
| Lane title | `16px / 24px` | 600 | `-0.005em` | available width |
| Prominent body | `16px / 24px` | 400 | `0` | `65ch` |
| Product body | `14px / 24px` | 400 | `0` | `68ch` |
| Dense label | `14px / 16px` | 500 | `0` | `36ch` |
| Caption | `12px / 16px` | 500 | `0.01em` | `44ch` |
| Caps label | `11px / 16px` | 600 | `0.08em` | one line |
| Numeric large | `25px / 32px` | 600 | `-0.01em` | tabular |
| Numeric small | `14px / 16px` | 600 | `0` | tabular |

Rules:

- Page headings and short centered copy use `text-wrap: balance`.
- Body copy uses `text-wrap: pretty`.
- Do not place an eyebrow above a page or section heading.
- Uppercase is limited to `PASS`, `FAIL`, `GAP`, compact chart labels, and 11px table labels.
- Body copy on phone uses 16px where it explains a concept or labels a form.
- Inputs use at least 16px on phone to prevent browser zoom.
- Long identifiers use `overflow-wrap: anywhere`.
- Normal prose never uses `word-break: break-all`.

### 2.6 Number formatting

All visible values and timers use tabular figures.

| Data | Visible format | Accessible format |
|---|---|---|
| Price at or above 1 | `2,430.25 USDS` | Same, with full currency name if needed |
| Price below 1 | `0.0834 GNO` | Same |
| Lane GAP | `+2.14%` | `Positive 2.14 percent gap` |
| Gauge GAP | `+2.143%` | `Positive 2.143 percent five-day average gap` |
| Zero GAP | `0.00%` | `Zero percent gap` |
| Volume | `$1.4M` | `1.4 million US dollars` |
| Timer | `2d 4h` | `2 days, 4 hours remaining` |
| Date | locale date plus time | Include timezone in title or description |
| Missing value | `Not available` | Never use a bare hyphen as the accessible value |

Use `Intl.NumberFormat`. Preserve a leading zero. Never animate container width when digits change. `RollingNumber` exposes one static accessible string while animated digits remain `aria-hidden`.

### 2.7 Motion

```css
:root {
  --motion-fast: 120ms;
  --motion-standard: 200ms;
  --motion-deliberate: 320ms;
  --motion-chart: 480ms;
  --motion-route: 180ms;

  --ease-out-quart: cubic-bezier(.25, 1, .5, 1);
  --ease-out-expo: cubic-bezier(.16, 1, .3, 1);
}
```

`180ms` is a route-specific duration. It is not available for general component motion.

- Use transform and opacity only.
- Do not animate width, height, top, left, margin, padding, blur, shadow, or color.
- Do not use bounce, elastic, or spring physics.
- Exit duration is shorter than entrance duration.
- Rapid state changes cancel the previous animation and establish the latest state immediately.
- Correct state must never depend on an `animationend` event.

### 2.8 Control and layer tokens

```css
:root {
  --control-height: 40px;
  --control-height-phone: 48px;
  --icon-inline: 16px;
  --icon-control: 20px;
  --icon-heading: 24px;
  --focus-width: 2px;
  --focus-offset: 2px;

  --z-base: 0;
  --z-sticky: 20;
  --z-header: 30;
  --z-popover: 50;
  --z-scrim: 70;
  --z-modal: 80;
  --z-tour: 90;
  --z-toast: 100;
  --z-tooltip: 110;
}
```

Global focus:

```css
:where(a, button, input, select, textarea, [tabindex]):focus-visible {
  outline: var(--focus-width) solid var(--color-focus);
  outline-offset: var(--focus-offset);
}
```

Browser surfaces:

- Selection background: `--color-selection`.
- Caret: `--color-caret`.
- Scrollbar width: 8px.
- Scrollbar track: `--color-surface`.
- Scrollbar thumb: `--color-text-tertiary`.
- Scrollbar thumb hover: `--color-text-secondary`.
- Link underline offset: 4px.
- Interactive elements use `touch-action: manipulation`.

## 3. Affordance grammar

### 3.1 Element grammar

| Element | Interactive | Required style | Required semantics |
|---|---:|---|---|
| Primary CTA | Yes | Solid violet, white text, 40px high, 20px radius | Native button or link with action label |
| Secondary CTA | Yes | Violet-soft surface, violet text, 40px high, 20px radius | Native button or link |
| Utility control | Yes | Raised tonal rectangle, 40px high, 8px radius | Native control |
| Ghost action | Yes | Text plus optional icon, no resting fill, underline on hover | Native button or link |
| Icon button | Yes | 40px circle, 20px icon, tonal hover | Accessible name required |
| Inline link | Yes | Text underline on hover and focus, arrow for external destination | Native anchor |
| Segmented control | Yes | 40px tonal track with sliding thumb | `radiogroup` or `tablist`, based on behavior |
| Filter chip | Yes | 40px tonal rectangle, check appears when active | `aria-pressed` |
| Applied filter token | Yes | 40px tonal rectangle with 16px close icon | Label begins with `Remove` |
| Lane row | Yes | Full-width row, tonal hover and selected state | Button controls preview |
| Sort heading | Yes | Ghost text plus chevron | `aria-sort` on column header |
| Tooltip trigger | Yes | Info glyph or underlined help text, no pill | `aria-describedby` |
| Status | No | 8px dot plus text | Text names the state |
| Verdict | No | 16px verdict-needle glyph plus bold word | Text names the verdict |
| Countdown | No | 16px clock plus tabular text | Full duration in accessible label |
| Organization | No, unless linked | Avatar plus text | Link styling only when linked |
| Chain | No, unless linked | Token glyph or avatar plus text | No border or fill |
| Count | No | Plain tabular number plus noun | Live region only if context changes |
| Active market marker | No | 8px dot plus `Active market` | No tag container |
| Chart direct label | No | Line glyph plus text and value | Included in chart description |
| Keyboard key | No | Compact keycap notation | Not focusable |

### 3.2 Control construction

- Height: 40px desktop, 48px phone.
- Horizontal padding: 16px default, 12px compact.
- Gap between icon and label: 8px.
- Inline icon: 16px.
- Button icon: 20px.
- Heading icon: 24px.
- Utility radius: 8px.
- CTA radius: 20px.
- Icon button: 40px circle.
- Minimum gap between adjacent targets: 8px.
- Labels use 14px, weight 600.
- A primary or secondary CTA may use a 1px inner top highlight:
  - Primary: `rgba(255, 255, 255, 0.16)`.
  - Secondary: `rgba(216, 203, 255, 0.12)` dark or `rgba(108, 43, 217, 0.12)` light.
- The highlight is a flat pseudo-element, not a shadow.
- The existing primary-button bubble treatment may remain only on the single primary CTA. Bubbles must use flat palette colors, remain clipped inside the button, animate only with transform and opacity, and disappear under reduced motion.

### 3.3 Common states

| State | Primary | Secondary or utility | Ghost | Icon |
|---|---|---|---|---|
| Rest | Violet fill | Tonal fill | Transparent | Transparent |
| Hover | Violet-hover fill | Selected tonal fill | Text becomes primary and underlined | Raised tonal fill |
| Active | `translateY(1px)` | `translateY(1px)` | `translateY(1px)` | `translateY(1px)` |
| Focus-visible | 2px ring, 2px offset | Same | Same | Same |
| Disabled | 44% opacity, no pointer events | Same | Same | Same |
| Loading | Disabled, stable width, spinner and active verb | Same | Same | Same |

Additional rules:

- Hover styles apply only inside `@media (hover: hover)`.
- Pointer press feedback begins within 100ms.
- Disabled controls retain their label and set the native `disabled` attribute when available.
- Loading labels use a verb such as `Creating market`, `Adding liquidity`, or `Connecting`.
- A loading spinner is 16px and may rotate with transform. Reduced motion shows a static progress glyph.
- Cursor is `pointer` for active controls and `not-allowed` for disabled controls.

### 3.4 Segmented control

- Outer height: 40px.
- Outer padding: 4px.
- Radius: 8px.
- Thumb radius: 6px.
- Each segment has a minimum 40px target.
- Thumb movement uses `transform: translateX(...)` over `200ms` with `--ease-out-quart`.
- Text does not move.
- Mode switches use `radiogroup`.
- Content tabs use `tablist`, `tab`, and `tabpanel`.
- Arrow keys change the active item.
- Home and End move to the first and last item.
- No selected count or status may reuse this pattern.

### 3.5 Informational patterns

```text
[8px dot] Active
[clock icon] 2d 4h
[avatar] Gnosis DAO
[token icon] Ethereum
[verdict-needle right] Include
[verdict-needle center] Neutral
[verdict-needle left] Exclude
```

These patterns have no border, background, hover state, cursor, or independent focus target.

## 4. Icon and shape language

### 4.1 Icon construction

All icons live in `src/components/icons.tsx`.

- View box: `0 0 24 24`.
- Default display: 24px.
- Safe area: x and y coordinates from 3 through 21.
- Stroke: `1.75`.
- Fill: none unless a documented data dot requires fill.
- Caps: round.
- Joins: round.
- Color: `currentColor`.
- Decorative icons set `aria-hidden="true"` and `focusable="false"`.
- Icon-only controls receive an accessible name on the control.
- Do not use emoji, Unicode symbols, an icon library, or mixed stroke weights.
- A chevron may rotate with transform instead of duplicating an up variant.

### 4.2 Exact icon list

| Export | Name | 24px-grid construction |
|---|---|---|
| `IconArrowRight` | arrow-right | Horizontal line from x5 to x19 at y12; head from x13,y6 to x19,y12 to x13,y18 |
| `IconArrowLeft` | arrow-left | Mirror of arrow-right |
| `IconArrowUpRight` | arrow-up-right | Diagonal from x7,y17 to x17,y7; corner from x8,y7 to x17,y7 to x17,y16 |
| `IconChevronDown` | chevron-down | Path from x6,y9 through x12,y15 to x18,y9 |
| `IconCheck` | check | Path from x5,y12.5 through x9.5,y17 to x19,y7.5 |
| `IconX` | x | Diagonals x6,y6 to x18,y18 and x18,y6 to x6,y18 |
| `IconSearch` | search | Circle centered 10.5,10.5 with radius 6.5; handle to x20,y20 |
| `IconSun` | sun | Radius-4 center circle and eight 2px cardinal or diagonal rays |
| `IconMoon` | moon | Single crescent contour bounded by x4 through x21 |
| `IconWallet` | wallet | Rounded body x3,y7.5 to x21,y20; clasp on right; upper fold line |
| `IconPlus` | plus | Lines x12,y5 to y19 and y12 from x5 to x19 |
| `IconMinus` | minus | Line x5 to x19 at y12 |
| `IconInfo` | info | Radius-9 circle, vertical stem y11 to y17, dot at y7 |
| `IconHelp` | help | Radius-9 circle, question path centered, dot at y17 |
| `IconPlay` | play | Open triangle from x9,y7 to x17,y12 to x9,y17 |
| `IconPause` | pause | Vertical lines at x9 and x15 from y7 to y17 |
| `IconClock` | clock | Radius-9 circle; hand x12,y7 to x12,y12 to x15.5,y14 |
| `IconFlag` | flag | Mast x5,y3 to y21; flag contour from y5 through y11 |
| `IconUsers` | users | Primary head at x9,y8, supporting head at x16,y8, two shoulder contours |
| `IconLayers` | layers | Three aligned diamond planes centered at x12 |
| `IconLink` | link | Two rounded chain contours with shared diagonal x9.5,y14.5 to x14.5,y9.5 |
| `IconExternal` | external | Open square from x5,y5 to x19,y19 plus up-right arrow |
| `IconCopy` | copy | Rounded squares x4,y4 to x16,y16 and x8,y8 to x19,y19 |
| `IconFilter` | filter | Funnel x4,y5 to x20,y5, narrowing to x14,y12, stem to y17 |
| `IconBolt` | bolt | Angular contour from x13.5,y2 through x5.5,y14 and x18.5,y10 to x10.5,y22 |
| `IconLock` | lock | Rounded body x5,y10 to x19,y21; shackle from x8,y10 through x16,y10 |
| `IconGauge` | gauge | Upper semicircle from x4,y18 to x20,y18; center needle to x16,y13 |
| `IconFork` | fork | Stem x3,y12 to x9,y12; upper branch curves to x19,y6 and ends x21,y6; lower branch curves to x19,y18 and ends x21,y18 |
| `IconGapBracket` | gap-bracket | Vertical caps at x5 and x19 from y7 to y17; horizontal connector at y12; center tick from y9 to y15 |
| `IconVerdictNeedle` | verdict-needle | Baseline x4,y18 to x20,y18; needle x12,y6 to x12,y18; small angled head at y6 |
| `IconPassLine` | pass-line | Solid line x3 to x21 at y12 |
| `IconFailLine` | fail-line | Line x3 to x21 at y12 with `stroke-dasharray="6 4"` |
| `IconOrg` | org | Head circle centered x12,y8 radius 3; single shoulder contour x5,y20 through x19,y20 |
| `IconToken` | token | Outer circle centered x12,y12 radius 8; inner broken ring radius 4 |
| `IconLiquidity` | liquidity | Parallel rails x4 to x20 at y8 and y16; central level line x7 to x17 at y12 |
| `IconResolve` | resolve | Flag mast and contour with a compact check inside the flag field |
| `IconTrade` | trade | Upper arrow x4,y8 to x18,y8 pointing right; lower arrow x20,y16 to x6,y16 pointing left |
| `IconReplay` | replay | Arc from x19,y8 around center x12,y12 to x7,y18; arrowhead at x5,y8; play triangle centered |
| `IconMore` | more | Three 1px circles centered at x6, x12, and x18 on y12 |

### 4.3 Product shapes

#### Fork mark

The fork is the product signature: one question enters, then divides into PASS and FAIL conditions.

```text
question line ----+---- PASS
                  |
                  +---- FAIL
```

- Compact mark: 24px.
- Heading mark: 32px.
- Empty-state mark: 48px.
- PASS branch: solid violet.
- FAIL branch: dashed tint-white or graphite.
- Shared stem: text-secondary neutral.
- Branch labels remain visible where space permits.

#### Lane tracks

```text
PASS  ===================  2,430.25
GAP            [=====|  ]  +2.14%
FAIL  - - - - - - - - -   2,379.34
```

- PASS rail: 2px, solid, `--color-pass-line`.
- FAIL rail: 2px, `stroke-dasharray: 6 4`, `--color-fail-line`.
- Rail ends: round.
- Track label width: 40px.
- Value width: 72px, right-aligned.
- GAP rail: 8px high.
- GAP fill starts at the center and scales toward the leading side.
- GAP fill uses `transform: scaleX(...)`, with origin set to the center.
- Needle: 2px wide, 24px high.
- Neutral center tick: 1px wide, 16px high.
- The GAP sign and verdict word remain textual.

#### GAP bracket

The bracket spans the measurable distance between PASS and FAIL.

- Compact lane bracket: 16px high.
- Chart bracket: variable width with 8px end caps.
- Positive direction: right of center.
- Negative direction: left of center.
- Neutral: center tick only.
- PASS-leading fill uses violet at 24%.
- FAIL-leading fill uses tint-white or graphite at 12%.
- Direction is repeated by sign and direct text.

#### Verdict needle

- Track range: `-3%` through `+3%`.
- Exclude threshold: below `-1%`.
- Neutral range: `-1%` through `+1%`.
- Include threshold: above `+1%`.
- Needle visual width: 2px.
- Needle target is not interactive unless the gauge is explicitly used as a chart scrubber.
- Include tilts the compact glyph 20 degrees right.
- Exclude tilts it 20 degrees left.
- Neutral remains vertical.

## 5. Layout system and breakpoints

### 5.1 Spatial thesis

The landing page reads top to bottom:

1. Decision explanation and primary action
2. Filters
3. Active lane header with reading key
4. Lane list and selected preview
5. Recently closed milestones
6. Organizations
7. Footer

The detail page reads:

1. Back and breadcrumb
2. Proposal question and organization
3. Core stats
4. Fork chart
5. Verdict and trade task
6. Activity
7. Footer

### 5.2 Grid

```css
.layout {
  width: min(calc(100% - 48px), 1392px);
  margin-inline: auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 24px;
}
```

| Viewport | Page width | Outer margin | Columns | Gap | Calculated column |
|---:|---:|---:|---:|---:|---:|
| 1920px | 1392px | 264px | 12 | 24px | 94px |
| 1440px | 1392px | 24px | 12 | 24px | 94px |
| 1024px | 976px | 24px | 8 | 16px | 108px |
| 768px | 720px | 24px | 8 | 16px | 76px |
| 390px | 358px | 16px | 4 | 16px | 77.5px |

Breakpoints:

```css
/* Phone */
@media (max-width: 767px) {}

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) {}

/* Compact desktop */
@media (min-width: 1024px) and (max-width: 1439px) {}

/* Desktop and wide */
@media (min-width: 1440px) {}
```

### 5.3 Landing board

At 1440px and wider:

- Lane list: columns 1 through 7, 802px.
- Preview: columns 8 through 12, 566px.
- Column gap: 24px.
- Shared lane header: 48px high, spans all 12 columns.
- Lane viewport: 520px high.
- Preview panel: 520px high.
- Lane row: 104px high.
- Five lanes exactly match the panel height.
- More than five lanes scroll inside the lane viewport.
- Preview remains sticky with `top: 128px`.
- The lane scroller chains page scrolling when its start or end is reached.
- Scrollbar remains visible on hover and keyboard focus.

At 1024px:

- Lane list: four columns, 480px.
- Preview: four columns, 480px.
- Lane viewport and preview: 416px.
- Four lanes fit.
- Preview padding reduces to 16px.
- Low-priority lane metadata moves into a tooltip or disclosure.

At 768px and below:

- Board becomes one column.
- Preview is placed immediately after the selected lane.
- Internal lane scrolling is removed.
- Preview is not sticky.
- DOM and focus order match visual order.

### 5.4 Preview proportion

At desktop:

- Panel outer width: 566px.
- Panel padding: 24px.
- Inner width: 518px.
- Header: 64px.
- Header-to-chart gap: 16px.
- Mini chart: `aspect-ratio: 4 / 3`, width 100%, maximum height 392px.
- The chart flex-fills remaining panel space without stretching its ratio.

### 5.5 Detail layout

At 1440px and wider:

- Main chart column: 8 columns, 920px.
- Right task column: 4 columns, 448px.
- Gap: 24px.
- Right task column is sticky at `top: 128px`.
- Activity spans 12 columns below.
- The right column contains verdict, DAO note, trade panel, then advanced metrics.

At 1024px:

- Chart: 5 columns.
- Right task column: 3 columns.
- Trade quote details collapse behind an advanced disclosure.

At 768px and below:

- Chart, verdict, trade, and activity stack.
- Order remains chart, verdict, trade, activity.
- A phone-only Trade CTA may remain sticky at the bottom and scroll to the trade panel.

### 5.6 Height budget at 1440px by 900px

At 100% zoom with no applied-filter row:

| Region | Height | Cumulative bottom |
|---|---:|---:|
| Header | 64px | 64px |
| Subbar | 48px | 112px |
| Main top padding | 16px | 128px |
| Decision strip | 144px | 272px |
| Gap | 16px | 288px |
| Filter toolbar | 56px | 344px |
| Gap | 16px | 360px |
| Lane header | 48px | 408px |
| First three lanes | 312px | 720px |
| Fourth lane | 104px | 824px |

An applied-filter row adds 48px. Three complete lanes still end at 768px. At increased text size or zoom, components grow and this viewport target yields to readability.

### 5.7 Sticky and focus offsets

```css
html {
  scroll-padding-top: 128px;
}

[data-focus-anchor] {
  scroll-margin-top: 136px;
}
```

Phone pages with a sticky Trade action also use:

```css
html {
  scroll-padding-bottom: calc(96px + env(safe-area-inset-bottom));
}
```

Sticky content must never obscure a focused element.

## 6. Component specifications

### 6.1 App shell, Header, and Subbar

**Anatomy**

```text
[Skip to main content]

+------------------------------------------------------------------+
| [Seer fork] Futarchy  Milestones  Organizations   Search  Help   |
|                                                Theme  Connect     |
+------------------------------------------------------------------+
| [Back] [Breadcrumb or section tabs]             Route utilities  |
+------------------------------------------------------------------+
| main route content                                               |
```

**Geometry**

- Header height: 64px.
- Subbar height: 48px.
- Header and subbar are sticky.
- Header inner width: 1392px maximum.
- Header horizontal padding follows page gutters.
- Primary navigation targets: 40px high.
- Search control: 176px by 40px at desktop, 40px icon control on phone.
- Utility controls: 40px.
- Header gap: 8px between utilities, 24px between navigation groups.
- Header uses page color at the top and surface color after 8px of page scroll.
- Scrolled state changes tonally with no border or shadow.
- Subbar uses `--color-surface`.

**States and motion**

- Current navigation item uses weight 600 and a 2px violet underline.
- Search, help, theme, and connect controls follow the control grammar.
- Header tonal state changes immediately.
- Route content uses the route transition in Section 7.
- Theme uses the theme crossfade in Section 7.
- Help opens a keyboard-shortcut popover.
- Search opens the command palette and focuses its input.

**Accessibility**

- The skip link is first in DOM order and becomes visible on focus.
- Navigation uses `<nav aria-label="Primary">`.
- Subbar uses `<nav aria-label="Breadcrumb">` or `<nav aria-label="Sections">`.
- Current route uses `aria-current="page"`.
- Route changes move focus to the route `<main>` heading without scrolling twice.
- Existing hash routes remain:
  - `#/`
  - `#/org/:slug`
  - `#/m/:id`
  - `#/create`
- Query filters remain shareable.
- Back restores filter values, selected lane, and scroll position.
- Global shortcuts do not fire while an input, textarea, select, or content-editable element is active.

**Copy**

Header labels:

- `Milestones`
- `Organizations`
- `Search`
- `Help and shortcuts`
- `Use light theme` or `Use dark theme`
- `Connect wallet`

Help popover shortcuts:

| Shortcut | Action |
|---|---|
| `/` | Search |
| `Ctrl K` or `Cmd K` | Open command palette |
| `?` | Open help |
| `G`, then `M` | Go to milestones |
| `G`, then `O` | Go to organizations |
| Arrow Up or Arrow Down | Select previous or next lane |
| Enter | Open selected milestone |
| Escape | Close the current overlay |

### 6.2 Footer

**Anatomy**

```text
[Futarchy at Seer]  Market forecasts inform proposals.
                    The DAO still decides.

[Existing footer links]                         [Theme status]
```

**Geometry**

- Minimum height: 96px desktop.
- Padding: 24px vertically.
- Top separation: 64px from the final content section.
- Content aligns to the page grid.
- Product statement maximum width: 52ch.
- Links wrap with 16px row and column gaps.
- Phone minimum height: 160px.

**States and motion**

- Links use the ghost-link pattern.
- Theme status is informational plain text.
- No entrance animation.

**Accessibility**

- Use a semantic `<footer>`.
- Preserve every existing footer destination.
- External links include an external icon and accessible destination context.
- Link labels remain visible at 200% zoom.

**Copy**

`Market forecasts inform proposals. The DAO still decides.`

### 6.3 Hero decision strip

**Anatomy**

```text
+------------------------------------------------------------------+
| What happens to the token if a proposal passes?  [Create market] |
| PASS and FAIL markets forecast each outcome. The GAP is signal.  |
|                                                                  |
| [org avatar] Asked by {DAO}   [dot] 5 active   [clock] 2d 4h     |
| [needle] 2 Include   [needle] 2 Neutral   [needle] 1 Exclude     |
+------------------------------------------------------------------+
```

**Geometry**

- Desktop height: 144px.
- Surface: level 1.
- Radius: 16px.
- Padding: 24px.
- Internal desktop grid: question and explanation span 8 columns; action and summary span 4.
- Heading: 31px/40px.
- Explanation: 16px/24px, maximum 65ch.
- Metadata row height: 24px.
- Metadata gap: 24px.
- CTA height: 40px.
- No detached `GlyphStrip` appears inside the hero.

**States and motion**

- Selected-market metadata updates when the selected lane changes.
- Metadata crossfades over 200ms.
- Counts update atomically in one polite status region.
- The CTA remains stable and does not move when counts change.

**Accessibility**

- The strip uses the page `<h1>`.
- Organization identity is avatar plus text.
- Avatar is decorative when the organization name is visible.
- Timer has a full-duration accessible label.
- Verdict summaries include words and needle direction.
- Dynamic count announcements use one atomic phrase, such as `5 active markets, 2 Include, 2 Neutral, 1 Exclude`.

**Copy**

Heading:

`What happens to the token if a proposal passes?`

Explanation:

`PASS and FAIL markets forecast the token price under each outcome. Their GAP is the signal. The DAO still decides.`

Metadata:

- `Asked by {organization}`
- `{count} active markets`
- `Next resolution in {time}`
- `{count} Include`
- `{count} Neutral`
- `{count} Exclude`

Primary action:

`Create market`

### 6.4 Filter toolbar

**Anatomy**

```text
[Search milestones] [Organizations v] [Token v] [Status segments]
[Closing soon v] [Clear]                      5 active, 8 closed

[check Gnosis] [check GNO] [Remove filter] [Show 2 more]
```

**Geometry**

- Base row height: 56px.
- Applied-filter row: 48px and omitted when empty.
- Search width: 272px at desktop.
- Organization trigger: 176px.
- Token trigger: 128px.
- Sort trigger: 176px.
- Status segmented control: up to 320px.
- Gaps: 8px between controls, 16px before result output.
- Search and utility controls use 8px radius.
- Result output is plain text without a shape.
- Applied filter tokens wrap before truncating.
- `Show n more` is an operable ghost disclosure.

**States and motion**

- Search filters without changing focus.
- Search input updates the URL after a 200ms debounce.
- Menu, status, sort, and applied values update the URL immediately.
- Clear resets filters, route, selected lane, and scroll position.
- Result changes crossfade over 120ms without moving the toolbar.
- Loading keeps control widths stable.
- Error leaves controls available and adds a retry message below the row.

**Accessibility**

- Section label: `Filters`.
- Search has a visible or screen-reader label `Search milestones`.
- Multi-select options use check marks and `aria-checked`.
- Status segmented control uses a radiogroup.
- Result count uses `aria-live="polite"` and `aria-atomic="true"`.
- Applied filter removal labels use `Remove {filter}`.
- Clear is absent when there is nothing to clear.
- No essential selected value is hidden behind an inert `+n`.

**Copy**

- `Search milestones`
- `Organizations`
- `Token`
- `All`, `Active`, `Awaiting`, `Resolved`
- `Closing soon`, `Volume`, `Impact`
- `Clear filters`
- `{active} active, {closed} closed`

### 6.5 Lane row

**Anatomy**

```text
+------------------------------------------------------------------+
| [token] Proposal question                           [Open icon]   |
|         [org] DAO  [chain] Chain  [clock] 2d 4h                  |
|                                                                  |
| PASS  solid track                         2,430.25                |
| GAP              bracket and needle       +2.14%                 |
| FAIL  dashed track                        2,379.34                |
|                                            [needle] Include      |
+------------------------------------------------------------------+
```

**Geometry**

- Desktop height: 104px.
- At text zoom, use `min-height: 104px` and allow growth.
- Padding: 16px.
- Radius: 8px.
- Internal grid:
  - Identity: `minmax(208px, 2fr)`.
  - Signal: `minmax(248px, 3fr)`.
  - Outcome: 112px.
  - Open control: 40px.
- Column gap: 8px.
- Avatar: 32px.
- Lane title: 16px/24px, weight 600.
- Metadata: 12px/16px.
- Track stack: 64px.
- PASS and FAIL rows: 24px each.
- GAP row: 16px.
- Open icon target: 40px.
- Noninteractive metadata has no background or border.

**States and motion**

- Rest: level-1 surface.
- Hover: level-2 surface.
- Selected: selected surface and visible fork glyph.
- Focus-visible: 2px focus ring.
- Loading: geometry-matched static skeleton.
- Error: question remains visible; signal area states `Prices unavailable` with retry.
- Hovering or focusing one lane dims siblings to 62% opacity over 120ms.
- Selected lane remains at 100%.
- First load uses the 40ms stagger in Section 7.
- GAP fill and needle animate with transform only.
- Double click continues to open detail.
- Single click selects.
- Enter opens detail.
- Space selects without routing.
- Arrow keys select adjacent lanes.

**Accessibility**

- Render each lane inside a semantic list item.
- The selecting surface is a native button.
- Use `aria-current="true"` on the selected lane.
- Use `aria-controls` for the preview.
- Preserve existing `data-id`, `data-org`, `data-avatar`, and `data-tour`.
- Visual tracks are `aria-hidden`.
- Expose one text summary:
  - `{question}. PASS price {value}. FAIL price {value}. GAP {value}. Verdict {verdict}.`
- The open icon button retains its existing accessible label.
- Timer updates visually each second but is not a per-second live region.

**Copy**

- `PASS`
- `FAIL`
- `GAP`
- `Include`, `Neutral`, or `Exclude`
- `Volume {value}`
- `{time} remaining`
- Open control accessible label: `Open {proposal}`

### 6.6 Lane list and reading key

**Anatomy**

```text
Active milestones   [dot] 5 active

How to read: [fork] PASS / FAIL   [bracket] GAP   [needle] Verdict

+----------------------------+  +-------------------------------+
| lane 1                     |  | selected preview              |
| lane 2                     |  |                               |
| lane 3                     |  |                               |
| lane 4                     |  |                               |
| lane 5                     |  |                               |
+----------------------------+  +-------------------------------+
```

**Geometry**

- Section header: 48px.
- Title and active count occupy the left side.
- Reading key occupies the right side on one line.
- Key item icon: 16px.
- Key text: 12px/16px.
- Key item visual gap: 4px.
- Key item target: at least 40px.
- Key group gap: 16px.
- Lane viewport: 520px desktop.
- No extra padding appears between rows.
- List and preview stretch to equal height.

**States and motion**

- Key items reveal tooltips on hover, focus, and tap.
- List loading shows five lane skeletons to reserve the panel height.
- Empty list replaces the lane viewport with the empty state.
- Internal scroll activates only when more than five rows exist at desktop.
- Selected preview does not cause lane height changes.
- Reduced motion disables auto-advance and all lane entrance motion.

**Accessibility**

- Heading is `<h2 id="active-title">Active milestones</h2>`.
- List uses `aria-labelledby="active-title"`.
- Key tooltip triggers are keyboard reachable.
- Key content is supplemental. Core labels remain in each lane.
- Internal scroller receives `tabindex="0"` only when it overflows and uses the accessible name `Active milestone list`.
- PageUp, PageDown, Home, and End work inside the overflowing list.

**Copy**

Key labels and tooltips:

| Label | Tooltip |
|---|---|
| `PASS / FAIL` | `PASS forecasts the token price if the proposal passes. FAIL forecasts it if the proposal fails.` |
| `GAP` | `GAP is the percentage difference between the PASS and FAIL forecasts.` |
| `Verdict` | `Above +1% is Include, below -1% is Exclude, and the range between is Neutral.` |

### 6.7 Preview panel and mini chart

**Anatomy**

```text
+--------------------------------------------------+
| [token] Proposal question        [Open market]   |
| [org] Asked by DAO              [needle] Include |
|                                                  |
| PASS solid step line                    PASS val |
|       flat GAP ribbon                            |
| FAIL dashed step line                    FAIL val|
|                                                  |
| GAP +2.14%                  The DAO still decides.|
+--------------------------------------------------+
```

**Geometry**

- Desktop height: 520px.
- Radius: 16px.
- Padding: 24px.
- Header height: 64px.
- Header gap: 16px.
- Chart ratio: 4:3.
- Direct end labels reserve 72px on the right.
- Mini-chart axis label: 11px/16px.
- Grid opacity: 6%.
- Latest trade dot: 8px.
- `Open market` is a secondary CTA.
- Verdict is glyph plus text, not a chip.

**States and motion**

- Selecting a lane crossfades preview content.
- New chart lines redraw from the left over 480ms.
- The old market remains visible until the replacement is ready.
- Loading uses a chart skeleton with direct-label placeholders.
- Empty range states `No trades in this range`.
- Data failure presents a retry action inside the chart field.
- Latest trade dot pulses twice, then becomes static.
- Auto-advance pauses on hover, focus, document hide, tour, and reduced motion.

**Accessibility**

- Panel label includes the proposal.
- Provide a concise screen-reader summary:
  - `{proposal}. PASS is {value}, FAIL is {value}, a {gap} gap. The current verdict is {verdict}.`
- Mini-chart SVG is decorative when the summary is present.
- `Open market` is reachable after the selected lane.
- No chart information is available only through hover.
- Preserve existing preview IDs used by `aria-controls`.

**Copy**

- `Asked by {organization}`
- `PASS {value}`
- `FAIL {value}`
- `GAP {value}`
- `Verdict: {verdict}`
- `The DAO still decides.`
- `Open market`

### 6.8 Closed milestones list

**Anatomy**

```text
Recently closed   8 results                         [Show more]

[token] [org] Question     [fork] [dot] Resolved PASS  GAP +2.14% [open]
[token] [org] Question     [fork] [dot] Awaiting       GAP pending [open]
```

**Geometry**

- Section gap from active board: 48px.
- Section header: 48px.
- Row height: 88px desktop.
- Row padding: 16px.
- Internal columns:
  - Identity and question: `minmax(280px, 2fr)`.
  - Fork: 96px.
  - Status: 152px.
  - Final GAP: 176px.
  - Open: 40px.
- Organization uses 24px avatar plus text.
- Mini fork: 88px by 48px.
- Status uses 8px dot plus text.
- No organization, status, outcome, or GAP pill is allowed.

**States and motion**

- Entire row is a link.
- Hover uses a tonal level change.
- Focus uses the global ring.
- `Show more` is a secondary CTA and disables only when all rows are shown.
- First reveal may use 40ms row stagger, capped at five rows.
- Awaiting rows keep their final GAP field stable and display `Pending`.

**Accessibility**

- Use a heading and semantic list.
- Row accessible name includes organization, question, resolution state, and final GAP.
- Fork is decorative when outcome text is present.
- Status is never communicated by dot color alone.
- `Show more` announces the new total in a polite live region.

**Copy**

- `Recently closed`
- `{count} results`
- `Awaiting resolution`
- `Resolved PASS`
- `Resolved FAIL`
- `Final GAP {value}`
- `Final GAP pending`
- `Show more`

### 6.9 Organizations table and rows

**Anatomy**

```text
Organizations                         [Search organizations]

NAME               MARKET          ACTIVE  PROPOSALS  CHAIN      LIQUIDITY
[avatar] Gnosis DAO [fork] [dot]       2        14     [icon] Gnosis  $1.2M
```

**Geometry**

- Section gap: 48px.
- Search control: 272px by 40px.
- Table surface radius: 16px.
- Header row: 48px.
- Data row: 64px.
- Table padding: 0 16px.
- Desktop columns:
  - Name: `minmax(240px, 2fr)`.
  - Market: 152px.
  - Active: 80px.
  - Proposals: 104px.
  - Chain: 144px.
  - Liquidity: 160px.
- Row avatar: 32px.
- Chain avatar: 16px.
- Liquidity rail: 80px by 8px.
- Column labels: 11px uppercase with 0.08em tracking.

**States and motion**

- Organization row is a full-row link.
- Hover changes the row to level 2.
- Selected organization uses the selected surface and `aria-current`.
- Sort is a ghost action with a rotating chevron.
- Search results reflow over 320ms using transform and opacity only.
- Loading reserves the header and at least four rows.
- Empty search offers `Clear search`.

**Accessibility**

- Use a semantic `<table>` at desktop.
- Search has a visible label or screen-reader label.
- Sort button updates `aria-sort`.
- Numbers are right-aligned and tabular.
- Liquidity rail is decorative; visible text supplies the value.
- Active market status is dot plus text.
- Organization count is plain text.
- At phone width, visual rows stack but retain table semantics or use an equivalent labeled list.

**Copy**

- `Search organizations`
- `Name`
- `Market`
- `Active`
- `Proposals`
- `Chain`
- `Liquidity`
- `Active market`
- `{count} organizations`
- `No organizations match this search.`
- `Clear search`

### 6.10 Detail header and breadcrumb

**Anatomy**

```text
[Back] Milestones / {organization} / {proposal}

[token] Proposal question
        [org avatar] Asked by {DAO}   [dot] Active   [clock] 2d 4h

[Trade] [Add liquidity] [Resolve question] [Copy link]
```

**Geometry**

- Breadcrumb row: 40px.
- Header minimum height: 168px.
- Header padding-block: 24px.
- Token avatar: 48px.
- Question: 31px/40px, maximum 32ch.
- Metadata row: 24px.
- Action row: 40px.
- Gaps: 16px from breadcrumb to title, 8px title to metadata, 16px metadata to actions.
- `Trade` is the only primary CTA.
- `Add liquidity` is secondary.
- `Resolve question` and `Copy link` are ghost actions.
- Status and timer remain plain text patterns.

**States and motion**

- Back restores prior list filters, lane selection, and scroll.
- Copy link produces a toast.
- Add liquidity opens its modal.
- Resolve opens the external resolver in a new tab.
- Trade scrolls and focuses the first trade control.
- Closed markets replace Trade with disabled text `Market closed`; they do not show a false primary action.
- Route entrance follows Section 7.

**Accessibility**

- Back is a labeled control, not only a chevron.
- Breadcrumb uses an ordered list.
- The current page breadcrumb is plain text with `aria-current="page"`.
- Organization identity is linked when a route exists.
- External resolver announces that it opens a new tab.
- Copy link uses the Clipboard API with a fallback.
- Focus moves to the `<h1>` on direct arrival.

**Copy**

- `Back to milestones`
- `Asked by {organization}`
- `Active`, `Awaiting resolution`, or `Resolved PASS/FAIL`
- `{time} remaining`
- `Trade`
- `Add liquidity`
- `Resolve question`
- `Copy link`
- `Market closed`

### 6.11 Stats row

**Anatomy**

```text
PASS PRICE       FAIL PRICE       GAP          VOLUME       TIME LEFT
2,430.25 USDS    2,379.34 USDS    +2.14%       $1.4M        2d 4h

[Show advanced metrics]
Spot price   TVL   Liquidity depth   Oracle
```

**Geometry**

- Default strip height: 88px.
- Surface: level 1.
- Radius: 16px.
- Padding: 16px 24px.
- Five equal data columns.
- Label: caps role.
- Value: 20px/24px, weight 600.
- Advanced disclosure target: 40px.
- Advanced region uses the same parent surface, not nested cards.
- Desktop advanced metrics use four columns.
- Phone default metrics use a two-column grid.

**States and motion**

- Values roll over 320ms.
- Value updates do not change cell width.
- Advanced metrics expand through disclosure state; content crossfades without animating height.
- Missing data shows `Not available`.
- Loading reserves all five cells.
- Error affects only the unavailable cell and includes a local retry when possible.

**Accessibility**

- Use a `<dl>`.
- PASS and FAIL labels remain explicit.
- Tooltips supplement but do not replace labels.
- Advanced disclosure uses `aria-expanded` and `aria-controls`.
- Rolling digits are hidden from assistive technology.
- The static formatted value is announced only when a meaningful update occurs, not on every market tick.

**Copy**

Default:

- `PASS price`
- `FAIL price`
- `GAP`
- `Volume`
- `Time left`
- `Show advanced metrics`

Advanced:

- `Spot price`
- `Total value locked`
- `Liquidity depth`
- `Oracle`
- `Hide advanced metrics`

### 6.12 Fork chart

**Anatomy**

```text
Conditional price history       [1H] [1D] [5D] [1M] [ALL] [Data]

PRICE FIELD
PASS solid step line                                      PASS 2,430.25
       flat GAP ribbon
FAIL dashed step line                                     FAIL 2,379.34
                         | crosshair

GAP FIELD
+1% threshold  - - - - - - - - - - - - - - - - -
 0% center
-1% threshold  - - - - - - - - - - - - - - - - -

[time scrubber and handles]
```

**Geometry**

- Desktop panel minimum height: 608px.
- Padding: 24px.
- Radius: 16px.
- Toolbar: 40px.
- Toolbar-to-field gap: 16px.
- Price field: minimum 320px.
- GAP field: 96px.
- Field gap: 16px.
- Scrubber: 48px.
- Right label reserve: 88px.
- Left y-axis reserve: 56px.
- X-axis reserve: 32px.
- Grid follows an 8px alignment rhythm and renders at 6% opacity.
- Axis labels: 11px/16px.
- PASS line: 2px solid.
- FAIL line: 2px dashed with a 6px line and 4px gap.
- Decision thresholds: 1px dashed neutral line.
- Crosshair: 1px neutral line.
- Latest trade point: 8px with a 40px pointer target.
- Tooltip: 200px wide, 12px padding, 8px radius.
- Presets use one segmented control.
- Data and export controls use ghost actions.

**Field view**

The chart has two synchronized fields:

1. Price field: PASS and FAIL step lines with a flat GAP ribbon between them.
2. GAP field: the percentage difference over time with `+1%`, `0%`, and `-1%` references.

The price field uses three parts of the available plot height. The GAP field uses one part. Selecting `GAP focus` through advanced chart controls expands the GAP field while retaining current PASS and FAIL values in the chart header.

**Lines, ribbon, and labels**

- PASS is always solid violet.
- FAIL is always dashed tint-white or graphite.
- Direct labels sit at the final visible point.
- Labels contain the appropriate line glyph, series name, and value.
- No detached legend is used.
- PASS-leading ribbon uses violet at 24%.
- FAIL-leading ribbon uses tint-white or graphite at 12%.
- Ribbon direction is also named in the tooltip.
- Lines use `vector-effect="non-scaling-stroke"` during redraw motion.
- No gradient fill is permitted.

**Crosshair and tooltip**

- Pointer movement snaps to the nearest timestamp.
- Keyboard focus activates the same crosshair.
- Arrow Left and Arrow Right move one sample.
- Shift plus arrow moves five samples.
- Page Up and Page Down move one visible interval.
- Home and End move to the first and latest visible sample.
- Tooltip content:
  - full date and time with timezone
  - PASS price
  - FAIL price
  - GAP
  - verdict at that sample
- Tooltip stays within the plot bounds.
- Touch opens the tooltip on tap. A second tap outside dismisses it.
- Pointer targets around points are at least 40px.

**Scrubber**

- Visual rail: 8px high.
- Handle visual: 8px wide.
- Handle target: 48px.
- Dragging has immediate transform feedback.
- Keyboard and preset controls provide alternatives to dragging.
- Selected range is reflected in the URL, for example `?range=5d`.
- A selected timestamp may use `at=` for shareable analysis.
- Back and forward restore the prior range.

**Presets**

- `1H`
- `1D`
- `5D`
- `1M`
- `ALL`

The default is `5D`, matching the verdict average. Presets change the data range without routing away.

**States and motion**

- Initial lines redraw left to right over 480ms.
- Ribbon grows from the left over 480ms.
- Tooltip enters over 120ms.
- Crosshair movement uses 120ms only for keyboard stepping; pointer movement tracks directly.
- New samples update without replaying the full chart.
- Latest trade dot pulses for two 480ms cycles.
- Loading shows geometry-matched axes and static line placeholders.
- Empty state says `No trades in this range`.
- Error state says `Price history could not load` and provides `Retry`.
- More than 1,000 points are sampled or aggregated before render.
- Resize work is throttled to one frame.

**Accessibility**

- Chart has an accessible name and summary.
- Include a `View data table` action.
- Data table contains timestamp, PASS, FAIL, GAP, and verdict.
- Data table is sortable and exportable as CSV.
- Chart interaction uses one focusable slider-like overlay, not hundreds of focusable SVG points.
- Direct labels meet 4.5:1 text contrast.
- Lines meet 3:1 against the field.
- Pattern and text supplement color.
- Reduced motion renders complete lines immediately.

**Copy**

- `Conditional price history`
- `PASS forecast`
- `FAIL forecast`
- `GAP`
- `PASS leads by {value}` or `FAIL leads by {value}`
- `Include threshold`
- `Exclude threshold`
- `View data table`
- `Download CSV`
- `GAP focus`
- `Price and GAP`
- `No trades in this range. Choose a longer range.`
- `Price history could not load. Check your connection and retry.`

### 6.13 Verdict gauge

**Anatomy**

```text
5-day average GAP                                 +2.143%

Exclude          Neutral          Include
---------|-----------|---------------^----------
        -1%          0%             +1%

[needle right] Include
The DAO still decides.
```

**Geometry**

- Panel minimum height: 192px.
- Padding: 24px.
- Radius: 16px.
- Heading row: 32px.
- Gauge track: 8px high.
- Gauge target area: 40px high.
- Needle: 2px by 24px.
- Threshold ticks: 1px by 16px.
- Verdict labels: 12px/16px.
- Verdict result: 20px/24px, weight 600.
- DAO note: 14px/24px.
- There is no selected thumb or pill around the verdict.

**States and motion**

- Live state updates the value and needle.
- Locked state adds a 16px lock icon and plain text `Final`.
- Needle transforms over 320ms.
- GAP fill scales from center over 480ms.
- Crossing a threshold updates the word immediately, then completes the visual motion.
- No vibration is triggered without a direct user action.
- Loading preserves the track and replaces the value with a static placeholder.
- Missing data shows `Verdict unavailable`.

**Accessibility**

- Use a section heading `5-day average GAP`.
- Provide one accessible phrase:
  - `The five-day average GAP is positive 2.143 percent. The verdict is Include. The DAO still decides.`
- The gauge itself is not focusable unless it exposes interactive historical values.
- A separate 40px info button may open the methodology tooltip.
- Thresholds are named in text.
- Locked state includes text, not only a lock icon.

**Copy**

- `5-day average GAP`
- `Exclude`
- `Neutral`
- `Include`
- `Final`
- `The DAO still decides.`
- Methodology tooltip: `Above +1% is Include, below -1% is Exclude, and the range between is Neutral.`

### 6.14 Trade panel

**Anatomy**

```text
Trade

[PASS market | FAIL market]
[Buy | Sell]

Amount
[                       100.00 USDS]
[+1] [+5] [+20] [+100]                         [Max]

You receive                                0.0411 WETH
Average price                           2,430.25 USDS
Price impact                                      0.12%

[Trade PASS]
```

**Geometry**

- Desktop width: full 448px sidebar.
- Padding: 24px.
- Radius: 16px.
- Section title: 20px/24px.
- Control group gap: 16px.
- Outcome segmented control: 40px.
- Buy/Sell tabs: 40px.
- Amount input: 64px.
- Quick amount controls: 40px.
- Quote row: 24px.
- Primary action: 40px desktop, 48px phone.
- Advanced quote disclosure: 40px ghost action.
- One primary action appears at a time.

**States and motion**

- PASS and FAIL mode switches move the segmented thumb over 200ms.
- Buy and Sell use tabs or a segmented mode switch, not informational chips.
- Amount validates on blur.
- Quote updates roll over 320ms.
- Disconnected state changes the primary label to `Connect wallet to trade`.
- Pending state disables every field and says `Submitting trade`.
- Success produces a toast and updates activity.
- Recoverable failure preserves all entered values.
- Resolved or awaiting markets disable the form and state why.
- The existing primary CTA bubble effect may remain under the restrictions in Section 3.

**Accessibility**

- Section label: `Trade`.
- Use a fieldset with visible legend for outcome and side.
- Input has a visible `Amount` label.
- Use `inputmode="decimal"`.
- Input errors connect through `aria-describedby`.
- Failed submission focuses the error summary or first invalid field.
- Quick amounts have labels such as `Add 20 USDS`.
- `Max` is a ghost action.
- Quote changes are not announced on each keystroke. Announce the final quote after a short idle interval.
- Disabled state uses a native disabled fieldset and explanatory text.

**Copy**

- `PASS market`
- `FAIL market`
- `Buy`
- `Sell`
- `Amount`
- `Max`
- `Available`
- `You receive`
- `Average price`
- `Price impact`
- `Minimum received`
- `Show quote details`
- `Trade PASS`
- `Trade FAIL`
- `Connect wallet to trade`
- `Submitting trade`
- `Market closed`
- Error example: `The quote expired. Review the updated amount and try again.`

### 6.15 Activity table

**Anatomy**

```text
[Recent activity | My trades | Position]  30 trades  [Last 30 trades v]

OUTCOME        AMOUNT                    PRICE          DATE
[solid] PASS   80.24 USDS to 0.033 WETH  2,430.25      Oct 17, 12:06
[dashed] FAIL  80.24 USDS to 0.034 WETH  2,379.34      Oct 17, 12:06
```

**Geometry**

- Panel radius: 16px.
- Header: 56px.
- Table header: 40px.
- Data row: 56px.
- Padding-inline: 16px.
- Outcome column: 160px.
- Amount column: flexible.
- Price column: 144px.
- Date column: 160px.
- Outcome line glyph: 24px.
- Tab and menu controls: 40px.
- Internal scrolling begins after 15 paired rows at desktop.
- More than 50 visible rows use virtualization.

**States and motion**

- Tabs use an underline or sliding thumb and remain clearly interactive.
- New trades enter at the top with opacity and 8px translation over 320ms.
- Existing scroll position remains anchored.
- A new row does not force a user back to the top.
- Loading reserves table columns and rows.
- Empty tabs use a contextual empty state.
- Data failure keeps tabs available and offers retry.
- Historical markets do not simulate new activity.

**Accessibility**

- Use a semantic table.
- Tabs use `tablist`.
- Outcome includes line glyph plus `PASS` or `FAIL`.
- Buy and Sell remain visible text.
- Column sorts, if enabled, use `aria-sort`.
- Activity count is plain text.
- Scroller has an accessible name.
- Live updates use one optional polite region and never announce every price tick.
- Phone stacked rows retain explicit data labels.
- Preserve existing scroll anchoring behavior and activity events.

**Copy**

- `Recent activity`
- `My trades`
- `Position`
- `{count} trades`
- `Last 30 trades`
- `No trades yet.`
- `Connect a wallet to see your trades.`
- `You do not have a position in this market.`
- `Activity could not load. Retry.`

### 6.16 Modals: Liquidity and Connect

#### Shared modal anatomy

```text
flat scrim

+--------------------------------------------------+
| Modal title                              [Close] |
| Explanation                                      |
|                                                  |
| Form or wallet choices                           |
|                                                  |
| [Cancel]                         [Primary action] |
+--------------------------------------------------+
```

**Shared geometry**

- Scrim: `--color-scrim`, no blur.
- Modal radius: 16px.
- Padding: 24px.
- Header: 40px.
- Footer controls: 40px.
- Viewport margin: 32px desktop, 16px phone.
- Maximum height: `calc(100dvh - 64px)`.
- Modal content scrolls when necessary.
- Close icon target: 40px.
- Action gap: 8px.

**Shared states and motion**

- Open: scrim fades in; modal moves from `translateY(8px) scale(.98)` to rest over 320ms.
- Close: opacity and transform over 200ms.
- Escape and close button dismiss when safe.
- An unsaved form requests confirmation before dismissal.
- Submission disables controls and preserves modal dimensions.
- Errors appear beside the related field and in a summary when multiple fields fail.

**Shared accessibility**

- Use a native dialog when supported or `role="dialog"` with `aria-modal="true"`.
- Title is referenced by `aria-labelledby`.
- Description is referenced by `aria-describedby`.
- Focus enters at the title or first field.
- Focus is trapped while open.
- Focus returns to the trigger on close.
- Background content becomes inert.
- Close has an explicit accessible name.
- Modal position never obscures the focused field.

#### Liquidity modal

**Geometry and content**

- Width: 640px.
- Fields:
  - amount
  - token
  - PASS allocation
  - FAIL allocation
  - expected pool share
- Amount input: 64px.
- Allocation controls: 40px.
- Summary region: level-2 tonal surface, 16px padding, 12px radius.
- Primary action: `Add liquidity`.
- Secondary action: `Cancel`.

**States and copy**

- `Add liquidity`
- `Amount`
- `PASS allocation`
- `FAIL allocation`
- `Expected pool share`
- `Wallet balance`
- `Approving token`
- `Adding liquidity`
- Success: `Liquidity added.`
- Error: `Liquidity could not be added. Your funds were not moved. Review the quote and try again.`

#### Connect modal

**Geometry and content**

- Width: 480px.
- Wallet row: 56px.
- Wallet icon: 32px.
- Row gap: 8px.
- Recently used wallet may be the primary choice.
- Other wallets are tonal action rows.
- Connection status is dot plus text, not a pill.

**States and copy**

- `Connect wallet`
- `Choose a wallet to continue.`
- `Recently used`
- `Connecting`
- `Connected`
- Error: `The wallet did not connect. Open the wallet, approve the request, then try again.`
- `Try again`

### 6.17 Create wizard

**Anatomy**

```text
Create a conditional market

Step 2 of 4
Ask -------- Conditions -------- Market -------- Review

+--------------------------------------------------------------+
| Visible field labels and helper text                         |
|                                                              |
| Live question preview with fork                              |
+--------------------------------------------------------------+

[Back]                                      [Save and continue]
```

**Geometry**

- This is a route, not a modal.
- Maximum content width: 920px.
- Main form width: 600px.
- Context or preview width: 296px.
- Column gap: 24px.
- Page top padding: 32px.
- Form panel padding: 24px.
- Field height: 48px.
- Textarea minimum height: 128px.
- Field gap: 24px.
- Sticky action footer: 72px desktop.
- Progress line: 8px high visual area within a 40px semantic row.
- Phone uses one column and a bottom action region above the safe area.

**Steps**

1. **Ask**
   - Organization
   - Proposal identifier
   - Decision question
   - Token and chain
2. **Conditions**
   - PASS condition
   - FAIL condition
   - Resolution source
   - Close and resolution times
3. **Market**
   - Collateral
   - Initial liquidity
   - Market parameters
   - Advanced settings disclosure
4. **Review**
   - Complete question sentence
   - PASS and FAIL definitions
   - Fees and liquidity
   - Resolution details
   - Final confirmation

**States and motion**

- Step content crossfades and translates 8px over 180ms.
- Back does not erase valid entries.
- Draft auto-saves after 500ms of inactivity.
- Refresh restores the draft.
- Validation occurs on blur and submit, not every keystroke.
- Submission disables all fields and says `Creating market`.
- Success routes to the new detail page.
- A recoverable failure preserves the draft.
- Exiting with unsaved changes requests confirmation.

**Accessibility**

- Every field has a visible label.
- Required fields use text and a visible indicator.
- Helper and error text connect through `aria-describedby`.
- Each step uses a fieldset and legend where fields form one decision.
- Failed submission focuses a linked error summary.
- Back and cancel remain available.
- Progress is announced as `Step n of 4`.
- Completed steps use a check glyph plus text, not color alone.
- Existing route and form test contracts remain intact.

**Copy**

- `Create a conditional market`
- `Step {n} of 4`
- `Ask`
- `Conditions`
- `Market`
- `Review`
- `Save and continue`
- `Back`
- `Create market`
- Preview sentence:
  - `What happens to {token} if {proposal} passes?`
- Helper:
  - `Define PASS and FAIL so traders and the resolving oracle read the same conditions.`
- Error:
  - `The close time must be before the resolution time. Choose a later resolution time.`

### 6.18 Guided tour

**Anatomy**

```text
[target with violet focus outline]

+--------------------------------+
| Step 2 of 5                    |
| The GAP is the signal          |
| PASS minus FAIL produces the   |
| current market verdict.        |
|                                |
| [Back]              [Next]     |
+--------------------------------+
```

**Geometry**

- Popover width: 320px.
- Padding: 16px.
- Radius: 12px.
- Target gap: 8px.
- Controls: 40px.
- Progress text: 12px/16px.
- Target outline: 2px violet with 4px offset.
- Optional scrim uses the flat scrim token with no blur.
- Phone tour uses a bottom sheet with 16px page margins.

**Tour sequence**

1. **The question**
   - `This DAO is asking what happens to the token if the proposal passes.`
2. **PASS and FAIL**
   - `PASS and FAIL are separate conditional price forecasts.`
3. **The GAP**
   - `The difference between those forecasts is the market signal.`
4. **The verdict**
   - `The GAP maps to Include, Neutral, or Exclude. The DAO still decides.`
5. **Trade**
   - `Trade the conditional market when your forecast differs from its price.`

**States and motion**

- Open over 320ms with opacity and 8px translation.
- Step changes crossfade over 200ms.
- Target outline moves through transform-based continuity where practical.
- No automatic progression.
- Tour pauses lane auto-advance.
- Close restores the prior selected lane and focus.

**Accessibility**

- Tour starts only through an explicit action unless an existing first-run contract requires otherwise.
- Popover uses dialog semantics.
- Focus remains inside tour controls.
- Escape closes.
- Back and Next are always available except Back on the first step.
- Final action reads `Finish`.
- Step count is text, not a pill.
- Highlighted content is also described in the popover.

### 6.19 Command palette

**Anatomy**

```text
+------------------------------------------------------------+
| [search] Search markets, organizations, and commands       |
+------------------------------------------------------------+
| Markets                                                    |
| [token] Proposal question                         Enter    |
| Organizations                                              |
| [org] Gnosis DAO                                  Enter    |
| Commands                                                   |
| Create market                                     Ctrl N   |
+------------------------------------------------------------+
```

**Geometry**

- Width: 640px.
- Maximum height: 560px.
- Top offset: 96px.
- Radius: 16px.
- Search row: 56px.
- Result row: 48px.
- Group heading: 32px.
- Padding: 8px.
- Result icon: 24px.
- Phone palette fills the viewport below the 64px header.
- Scrim is flat and unblurred.

**States and motion**

- Opens from Search, `/`, or `Ctrl K` / `Cmd K`.
- Search receives immediate focus.
- Results update after a 120ms debounce.
- Arrow keys move the active result.
- Enter activates.
- Escape closes.
- Selected result uses the selected tonal surface.
- Empty query shows recent routes and common commands.
- No-match state offers `Create market` only when the query can seed the form.
- Open and close follow modal motion.

**Accessibility**

- Use dialog semantics.
- Input uses `role="combobox"` with the result list.
- Active result uses `aria-activedescendant`.
- Groups have accessible labels.
- Shortcuts are supplementary text.
- Result count is announced politely after search settles.
- Routing closes the palette and focuses the destination heading.

**Copy**

- `Search markets, organizations, and commands`
- `Markets`
- `Organizations`
- `Commands`
- `Recent`
- `No results for "{query}".`
- `Create market`
- `Open help and shortcuts`
- `Switch theme`

### 6.20 HoverMenu

`HoverMenu` remains the component name for compatibility. It must not require hover.

**Anatomy**

```text
[Organizations v]

+--------------------------------+
| [search] Search organizations  |
| [check] Gnosis DAO          4  |
| [     ] Nouns DAO           2  |
| [     ] Kleros              1  |
+--------------------------------+
```

**Geometry**

- Trigger height: 40px.
- Trigger radius: 8px.
- Trigger padding: 12px or 16px.
- Menu minimum width: 240px.
- Menu maximum width: 320px.
- Menu maximum height: 320px.
- Menu padding: 8px.
- Option height: 40px desktop, 48px phone.
- Check icon: 16px.
- Avatar: 24px.
- Count is plain tabular text.
- Menu offset: 8px from trigger.

**States and motion**

- Open on click, Enter, Space, or Arrow Down.
- Hover may style the trigger but does not open the menu automatically.
- Single-select closes after selection.
- Multi-select stays open until dismissal.
- Active options show a check.
- Trigger label summarizes the selection without pretending a count is a status.
- Enter over 200ms with opacity and 4px translation.
- Exit over 120ms.
- Position flips before it would leave the viewport.
- Phone renders the same options in a bottom sheet.

**Accessibility**

- Trigger uses `aria-haspopup`, `aria-expanded`, and `aria-controls`.
- Menu uses listbox semantics where appropriate.
- Multi-select uses `aria-multiselectable`.
- Arrow keys, Home, End, typeahead, and Escape work.
- Focus returns to the trigger after close.
- Search appears when there are more than eight options.
- Counts do not enter the option name unless useful.
- Outside click and route changes dismiss safely.

**Copy**

- `Search organizations`
- `Search tokens`
- `All organizations`
- `All tokens`
- Selection summary:
  - one item: selected label
  - two items: both labels
  - more than two: `{first} and {count} more`

### 6.21 Tooltip

**Anatomy**

```text
[help trigger]
      +--------------------------------+
      | Concise explanatory sentence.  |
      +--------------------------------+
```

**Geometry**

- Maximum width: 280px.
- Padding: 8px 12px.
- Radius: 8px.
- Type: 12px/16px.
- Gap from trigger: 8px.
- Pointer: 8px, tonal fill.
- No shadow or blur.
- Surface: overlay tonal level.
- Text color: primary.

**States and motion**

- Pointer delay: 400ms.
- Keyboard focus delay: 0ms.
- Touch opens on tap.
- Enter: opacity and 4px translation over 120ms.
- Exit: opacity over 120ms.
- Escape dismisses.
- Tooltip closes when the trigger leaves the DOM.
- Position flips or shifts to remain inside 8px viewport margins.

**Accessibility**

- Use `role="tooltip"`.
- Trigger references the tooltip with `aria-describedby`.
- Tooltip itself is not focusable and contains no controls.
- Critical instructions, errors, and primary labels never exist only in a tooltip.
- Decorative tooltip icons remain hidden from assistive technology.
- A tooltip-triggering help action uses the affordance grammar and a 40px target.

**Copy**

- One or two sentences.
- Maximum recommended length: 160 characters.
- Start with the term being explained.
- Avoid `Learn more` unless it is a real link outside the tooltip.

### 6.22 Toasts, empty, loading, and error states

#### Toast anatomy

```text
+------------------------------------------+
| [icon] Market created.          [View] X |
+------------------------------------------+
```

**Toast geometry**

- Width: 360px desktop.
- Minimum height: 56px.
- Padding: 12px 16px.
- Radius: 12px.
- Bottom-right offset: 24px.
- Stack gap: 8px.
- Phone width: `calc(100% - 32px)`.
- Phone offset: 16px plus safe area.
- Icon: 20px.
- Dismiss target: 40px.

**Toast states and motion**

- Information: info icon plus explicit text.
- Success: check icon plus explicit text.
- Error: x icon plus recovery action.
- Enter: opacity and 8px translation over 200ms.
- Exit: opacity over 120ms.
- Informational and success toasts dismiss after 4 seconds.
- Error toasts with a recovery action persist until dismissed or resolved.
- Hover and focus pause dismissal.
- Maximum visible stack: three. Additional messages queue.

**Toast accessibility**

- Information and success use `role="status"` and polite announcements.
- Errors use `role="alert"`.
- Toasts never steal focus.
- Dismiss and recovery actions are keyboard reachable.
- Repeated updates consolidate into one contextual sentence.

#### Empty states

- Minimum region height: 240px.
- Fork mark: 48px.
- Title: 20px/24px.
- Body: 14px/24px, maximum 48ch.
- One primary or secondary recovery action.
- No decorative card grid.

Required copy:

| Context | Title | Body | Action |
|---|---|---|---|
| Active, no data | `No active milestones yet.` | `Create a conditional market to begin forecasting a proposal.` | `Create market` |
| Filters | `No milestones match these filters.` | `Change or clear the current filters.` | `Clear filters` |
| Chart range | `No trades in this range.` | `Choose a longer range to view price history.` | `View all history` |
| Activity | `No trades yet.` | `Trades will appear here after the market opens.` | None |
| Organization search | `No organizations match this search.` | `Check the spelling or clear the search.` | `Clear search` |

#### Loading states

- Reserve final geometry to prevent layout shift.
- Use solid tonal placeholders.
- Do not use gradient shimmer.
- Optional pulse changes opacity only over 960ms, derived from two chart-duration intervals.
- Under reduced motion, placeholders remain static.
- Delays below 200ms show no loading indicator.
- Delays above 1 second include visible text such as `Loading markets`.
- Buttons retain their width and active verb.
- Charts render a skeleton field, never an empty axis frame.

#### Error and offline states

- Use x, info, or replay icons with explicit text.
- Do not rely on red.
- Keep successfully loaded content visible.
- Place local errors inside the affected region.
- Place route-level errors beneath the route heading.
- Always include cause and recovery.

Required copy:

- `Markets could not load. Check your connection and retry.`
- `Price history could not load. Check your connection and retry.`
- `You are offline. Previously loaded market data remains available.`
- `The request timed out. Retry when your connection is stable.`
- `Retry`

## 7. Motion choreography

### 7.1 Motion thesis

The authored focal sequence is the selected lane becoming a conditional forecast:

1. The selected lane remains spatially fixed.
2. The preview content crossfades.
3. PASS and FAIL redraw together from the left.
4. The GAP ribbon grows between them.
5. The verdict needle settles at the resulting position.

All supporting motion acknowledges input or preserves continuity.

### 7.2 Choreography table

| Event | From | To | Duration | Easing |
|---|---|---|---:|---|
| First lane load | `opacity: 0`, `translateY(8px)` | Visible and at rest | 320ms | Expo |
| Lane stagger | Previous lane delay | Next lane delay | 40ms each | N/A |
| Lane sibling dim | `opacity: 1` | `opacity: .62` | 120ms | Quart |
| Button press | `translateY(0)` | `translateY(1px)` | 120ms | Quart |
| Segmented thumb | Previous segment | Selected segment | 200ms | Quart |
| Preview exit | Visible | `opacity: 0` | 120ms | Quart |
| Preview enter | `opacity: 0` | Visible | 200ms | Expo |
| Chart line redraw | `scaleX(0)` | `scaleX(1)` | 480ms | Expo |
| GAP ribbon growth | Centered `scaleX(0)` | Measured scale | 480ms | Expo |
| Verdict needle | Previous x transform | New x transform | 320ms | Expo |
| Route change | `opacity: 0`, `translateY(8px)` | Visible and at rest | 180ms | Quart |
| Modal open | `.98` scale, 8px down, transparent | Rest and visible | 320ms | Expo |
| Modal close | Rest and visible | `.98` scale, 8px down, transparent | 200ms | Quart |
| Tooltip open | 4px toward trigger, transparent | Rest and visible | 120ms | Quart |
| Number roll | Old digit at rest | New digit at rest | 320ms | Expo |
| Theme switch | Old root visible | New root visible | 320ms total | Quart |
| Toast enter | 8px down, transparent | Rest and visible | 200ms | Expo |
| Latest trade pulse | Scale 1, opacity 1 | Scale 1.5, opacity 0 | 480ms, twice | Quart |

Lane stagger is capped at 200ms. Rows after the sixth use the same final delay.

### 7.3 First load

Content remains visible by default so script failure never leaves a blank page. Use `@starting-style` where supported or add a motion-ready state only after content is mounted.

```css
.lane {
  opacity: 1;
  transform: translateY(0);
}

@starting-style {
  .lane {
    opacity: 0;
    transform: translateY(8px);
  }
}
```

Each lane receives `--lane-index`, with delay calculated in 40ms increments and capped at 200ms.

### 7.4 Lane selection

- Input changes selected state immediately.
- Old preview fades over 120ms.
- New preview begins after no more than 40ms and reaches full opacity over 200ms.
- Chart line groups use `transform-origin: left center`.
- PASS and FAIL begin together.
- GAP begins 40ms after the lines.
- Needle begins after the first 160ms and finishes with the GAP.
- Controls remain interactive throughout.
- A second selection cancels the first sequence and starts from the current visual state.

### 7.5 Route changes

- Route content enters with opacity and `translateY(8px)` over 180ms.
- Back navigation may invert the translation to `translateY(-8px)` if direction is known.
- Header and subbar remain fixed.
- New route semantics and focus update immediately.
- Animation does not delay routing or history changes.

### 7.6 Theme switch

Use the existing View Transitions path when available.

- Old root fades to 0 over 120ms.
- New root fades from 0 over 200ms.
- No radial reveal, clip wipe, blur, or glow.
- Theme tokens switch once.
- Chart series retain PASS and FAIL geometry.
- Without View Transitions, values change immediately.

### 7.7 Number roll

- Each digit occupies a fixed-width tabular slot.
- Old digit moves up 100% and fades.
- New digit moves from 100% below to rest and becomes opaque.
- Decimal points, signs, units, and separators remain fixed.
- Rapid updates replace the prior animation.
- Assistive technology receives one complete formatted value.

### 7.8 Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    scroll-behavior: auto !important;
    transition: none !important;
  }
}
```

Reduced-motion behavior:

- Lanes appear immediately.
- Preview changes immediately.
- Charts render complete lines immediately.
- Number rolls become direct text replacement.
- Auto-advance stops.
- Latest trade pulse becomes a static dot.
- Theme changes immediately.
- Modal and tooltip state remains clear without spatial motion.
- Smooth scroll becomes instant.

## 8. Mobile rules at 390px

### 8.1 Global

- Viewport content width: 358px.
- Page gutter: 16px.
- Grid: four columns with 16px gaps.
- No element may cause horizontal page scrolling.
- Use `min-width: 0` on grid and flex children.
- Long text wraps.
- Long identifiers use `overflow-wrap: anywhere`.
- Touch controls are 48px high where possible and never below 40px.
- Adjacent targets have at least 8px separation.
- Respect left, right, and bottom safe-area insets.
- Browser zoom remains enabled.
- Descriptive body and all form fields use at least 16px text.

### 8.2 Header and Subbar

- Header remains 64px.
- Brand stays visible.
- Search and help remain directly accessible as 40px icon buttons.
- Theme and connect may move into a labeled overflow menu.
- Landing subbar shows two equal-width text tabs: `Milestones` and `Organizations`.
- Detail subbar shows `Back to milestones`; the full current title remains in the page heading.
- No horizontally scrolling navigation strip.

### 8.3 Hero

- Minimum height: 232px.
- Padding: 16px.
- Heading: 25px/32px.
- Explanation: 16px/24px.
- Create market CTA spans full width.
- Metadata wraps into two rows.
- Status counts remain plain glyph and text pairs.
- Nothing is truncated.

### 8.4 Filters

- Search occupies full width.
- One `Filters` utility button opens a bottom sheet containing organization, token, and status controls.
- Sort remains a 48px full-width utility control or joins the sheet.
- Applied filter tokens wrap.
- `Show n more` expands the collection.
- Results appear as plain text below controls.
- Closing the sheet returns focus to the Filters button.

### 8.5 Lanes and preview

- Lane uses `min-height: 176px`.
- Internal order:
  1. token, title, and open control
  2. organization, chain, and countdown
  3. PASS track
  4. GAP bracket and value
  5. FAIL track
  6. verdict
- Track labels remain visible.
- Values remain right-aligned.
- Open control is always visible.
- Selected preview appears immediately after the selected lane.
- Preview uses 16px padding.
- Mini chart uses the available width and a 4:3 ratio.
- No nested lane scrolling.
- Hover behavior has equivalent selected and pressed states.

### 8.6 Closed milestones

- Each row uses `min-height: 160px`.
- Question occupies the first row.
- Status and final GAP occupy the second row.
- Organization is avatar plus text.
- Fork may reduce to 64px wide.
- Entire row remains one link.
- Show more spans the available width when present.

### 8.7 Organizations

- Search spans full width.
- Each organization becomes a labeled row with `min-height: 144px`.
- Name and active-market status lead.
- Active, proposals, chain, and liquidity form a two-column definition grid.
- There is no horizontal table scroll.
- Sort controls appear above the list with explicit labels.

### 8.8 Detail

- Breadcrumb reduces to a labeled Back action.
- Header actions wrap.
- Trade is full width and first.
- Add liquidity is full width and second.
- Resolve and Copy link are ghost actions.
- Stats use two columns; the final odd metric spans both.
- Chart comes before verdict and trade.
- Advanced metrics remain collapsed by default.
- A sticky bottom Trade CTA may occupy 72px plus the safe-area inset.
- Page content reserves 96px bottom space so focus is not obscured.

### 8.9 Fork chart

- Panel padding: 16px.
- Presets wrap into a full-width segmented control.
- Price field minimum height: 240px.
- GAP field: 96px.
- Right-side endpoint labels move inside the field at the final point.
- Y-axis uses no more than three labels.
- X-axis uses no more than three timestamps.
- Crosshair activates on tap.
- Scrubber target remains 48px.
- Data table renders as labeled rows without horizontal scroll.
- `Download CSV` remains available through the chart overflow menu.

### 8.10 Verdict and trade

- Verdict panel padding: 16px.
- Gauge labels use 12px and remain fully visible.
- DAO note stays directly below the verdict.
- Trade amount input is 64px.
- Quick amounts use a two-by-two grid if four controls do not fit.
- Primary trade action is 48px and full width.
- Quote details use a disclosure below the primary quote.

### 8.11 Activity

- Tabs wrap only if all labels remain visible. Otherwise use a menu for secondary tabs, while `Recent activity` remains visible.
- Table rows visually stack with labels:
  - Outcome
  - Amount
  - Price
  - Date
- Each row uses at least 136px.
- Semantic table relationships remain available to assistive technology.
- Internal horizontal scrolling is prohibited.

### 8.12 Overlays

- Liquidity and Connect become bottom sheets.
- Top corners use 16px radius.
- Maximum height: `calc(100dvh - 64px)`.
- Command palette fills the viewport below the header.
- Tour uses a bottom sheet.
- HoverMenu uses a bottom sheet.
- Tooltip shifts within 8px viewport margins.
- Bottom-sheet actions remain above the safe area.

## 9. Light mode mapping

### 9.1 Token map

| Role | Dark | Light |
|---|---|---|
| Page | `#101013` | `#F7F7F9` |
| Surface | `#1A1A1E` | `#FFFFFF` |
| Raised surface | `#1F1F24` | `#F0F0F3` |
| Selected surface | `#241E33` | `#EFE9FC` |
| Primary text | `#EDEDF2` | `#17171C` |
| Secondary text | `#A8A8B3` | `#5C5C66` |
| Tertiary text | `#67676F` | `#8E8E99` |
| Primary action | `#7B3AFF` | `#6C2BD9` |
| Primary hover | `#8A55FF` | `#7B3AFF` |
| Secondary action surface | `#241E33` | `#EFE9FC` |
| Secondary action text | `#9C6FF2` | `#6C2BD9` |
| PASS line | `#8A55FF` | `#6C2BD9` |
| PASS text | `#9C6FF2` | `#6C2BD9` |
| FAIL line | `#D8CBFF` | `#5C5C66` |
| FAIL text | `#C9B6FF` | `#5C5C66` |
| GAP fill | `rgba(123,58,255,.24)` | `rgba(108,43,217,.24)` |
| FAIL-leading fill | `rgba(216,203,255,.12)` | `rgba(92,92,102,.12)` |
| Grid | `rgba(237,237,242,.06)` | `rgba(23,23,28,.06)` |
| Rule | `rgba(237,237,242,.08)` | `rgba(23,23,28,.08)` |
| Focus | `#D8CBFF` | `#6C2BD9` |
| Scrim | `rgba(16,16,19,.80)` | `rgba(23,23,28,.56)` |

### 9.2 Component behavior

- Light mode is designed directly, not generated through inversion.
- PASS remains solid violet.
- FAIL becomes dashed graphite so it remains visible on white.
- Tonal elevation becomes darker as a nested neutral, not shadowed.
- Selected lanes use `#EFE9FC`.
- Primary controls use `#6C2BD9` to preserve white-text contrast.
- Secondary controls use `#EFE9FC` with `#6C2BD9`.
- Grid and rules stay at 6% and 8% neutral opacity.
- Modal scrims do not blur the page.
- Charts, icons, avatars, and organization marks must be inspected independently in both themes.
- Tertiary text remains restricted to nonessential or disabled content.
- Browser selection, caret, scrollbar, and focus ring all switch with theme tokens.
- Theme preference follows the saved user choice first, then `prefers-color-scheme`.
- Initial HTML receives the resolved theme before first paint to prevent flashing.

## 10. Implementation order and file map

### 10.1 Implementation order

#### Phase 1: Preserve the contract

1. Inventory all routes, query parameters, hash behavior, `data-testid`, `data-tour`, `aria-label`, modal triggers, commands, and tour steps.
2. Capture landing and detail behavior in dark and light modes.
3. Record keyboard behavior, history restoration, and mobile states.
4. Do not begin visual migration until the behavior inventory is complete.

#### Phase 2: Foundation

1. Add semantic color, spacing, radius, type, motion, and layer tokens.
2. Load Inter Tight variable correctly.
3. Theme selection, caret, scrollbar, focus, and text selection.
4. Complete the inline SVG icon set.
5. Implement shared Button, IconButton, Segmented, StatusText, TimeText, OrgIdentity, VerdictText, and FilterChip primitives.
6. Remove pill styling from every informational element.

#### Phase 3: Shell and navigation

1. App shell and skip link.
2. Header and Subbar.
3. Breadcrumbs and reliable Back behavior.
4. Deep-link restoration.
5. Help popover and keyboard shortcuts.
6. Footer.
7. Route focus and route transitions.

#### Phase 4: Landing

1. Decision strip.
2. Filter toolbar.
3. Lane row.
4. Lane list and attached reading key.
5. Equal-height preview panel.
6. Closed milestones.
7. Organizations table.
8. Loading, empty, error, and long-content states.
9. Exact 1440px by 900px height-budget verification.

#### Phase 5: Detail

1. Detail header and actions.
2. Stats row and progressive metrics.
3. Fork chart fields, labels, crosshair, tooltip, scrubber, presets, data table, and export.
4. Verdict gauge and permanent DAO note.
5. Trade panel.
6. Activity table.
7. Sticky behavior and focus offsets.

#### Phase 6: Protected flows and overlays

1. Liquidity modal.
2. Connect modal.
3. Create wizard.
4. Guided tour.
5. Command palette.
6. HoverMenu.
7. Tooltip.
8. Toast region.

#### Phase 7: Motion and resilience

1. Lane stagger and sibling dimming.
2. Preview crossfade and chart redraw.
3. Number rolling.
4. Theme transition.
5. Route transition.
6. Reduced-motion path.
7. Slow network, offline, timeout, permission, and transaction failure states.
8. Animation interruption tests.

#### Phase 8: Verification

Test at:

- 1920px wide
- 1440px by 900px
- 1024px wide
- 768px wide
- 390px wide
- 200% browser zoom
- dark mode
- light mode
- reduced motion
- pointer, keyboard, and touch input

Acceptance checks:

- A DAO member can identify the question, asker, PASS, FAIL, GAP, verdict, and DAO authority in five seconds.
- A trader can identify the selected market, prices, timing, and Trade action in five seconds.
- No informational status resembles a button.
- PASS is always solid violet.
- FAIL is always dashed tint-white or graphite.
- Landing columns match height.
- Five 104px lanes equal the 520px desktop preview.
- At least three complete lanes appear in the 1440px by 900px first viewport.
- No horizontal page scroll occurs at 390px.
- Every focus target is visible.
- Charts have text and table alternatives.
- Every route, test hook, tour hook, and existing behavior remains operational.
- No new package is introduced.

### 10.2 File ownership

This is the target ownership map. If a target file does not exist, create it rather than duplicating responsibility elsewhere.

| File | Ownership |
|---|---|
| `src/App.tsx` | App shell, route parsing, deep links, route focus, history restoration, modal coordination |
| `src/index.css` | Global tokens, themes, typography, grid, browser surfaces, shared state selectors, reduced motion |
| `src/components/icons.tsx` | Complete 24px inline SVG icon system |
| `src/components/Button.tsx` | Primary, secondary, utility, ghost, loading, and icon-button primitives |
| `src/components/Segmented.tsx` | Segmented controls, tabs, sliding thumb, keyboard behavior |
| `src/components/StatusText.tsx` | Dot plus status text, no pill treatment |
| `src/components/TimeText.tsx` | Clock plus countdown text and full accessible duration |
| `src/components/OrgIdentity.tsx` | Avatar plus organization or chain text, linked and plain variants |
| `src/components/VerdictText.tsx` | Verdict needle plus Include, Neutral, or Exclude text |
| `src/components/FilterChip.tsx` | Toggle chips and removable applied-filter controls |
| `src/components/Header.tsx` | Header navigation, search trigger, help, theme, connect action, scrolled state |
| `src/components/Subbar.tsx` | Section tabs, detail breadcrumb, Back behavior, route utilities |
| `src/components/Footer.tsx` | Footer statement and existing footer links |
| `src/components/Landing.tsx` | Filter state, URL synchronization, landing section order, empty-state selection |
| `src/components/MilestoneHero.tsx` | Decision strip, selected-market summary, landing primary action |
| `src/components/GlyphStrip.tsx` | Compact attached reading key and its three tooltips |
| `src/components/SignalList.tsx` | Lane list, lane row selection, roving focus, sibling dimming, responsive preview placement |
| `src/components/MarketSignal.tsx` | Lane tracks, GAP bracket, mini-chart values, PASS and FAIL shape rules |
| `src/components/MilestoneCard.tsx` | Compatibility owner for any remaining milestone-card route; migrate countdown output to `TimeText` |
| `src/components/ClosedStrip.tsx` | Closed milestone rows, mini fork, status text, final GAP |
| `src/components/OrgTable.tsx` | Organization search, sorting, responsive table rows, liquidity values |
| `src/components/Chips.tsx` | Temporary compatibility exports only; noninteractive `LeanChip` and `OrgChip` styling must migrate to semantic text components |
| `src/components/DetailHeading.tsx` | Detail breadcrumb relationship, proposal heading, metadata, primary and secondary actions |
| `src/components/MetricStrip.tsx` | Core stats row and advanced-metrics disclosure |
| `src/components/ForkChart.tsx` | Full price field, GAP field, direct labels, crosshair, tooltip, scrubber, presets, table, CSV export |
| `src/components/VerdictGauge.tsx` | Five-day GAP gauge, thresholds, needle, locked state, DAO note |
| `src/components/TradePanel.tsx` | Outcome and side selection, amount, quotes, validation, transaction states |
| `src/components/ActivityTable.tsx` | Activity tabs, filters, live rows, scroll anchoring, responsive table |
| `src/components/LiquidityModal.tsx` | Liquidity dialog, fields, quote, transaction lifecycle |
| `src/components/ConnectModal.tsx` | Wallet selection, connection lifecycle, recovery |
| `src/components/CreateWizard.tsx` | Four-step creation route, validation, autosave, review, submission |
| `src/components/GuidedTour.tsx` | Tour sequence, target positioning, focus management, completion state |
| `src/components/CommandPalette.tsx` | Search, command groups, keyboard navigation, route activation |
| `src/components/HoverMenu.tsx` | Click and keyboard menu behavior, multi-select, responsive sheet |
| `src/components/Tooltip.tsx` | Accessible tooltip positioning, delay, dismissal, descriptions |
| `src/components/ToastRegion.tsx` | Toast queue, live regions, timing, dismissal, recovery actions |
| `src/components/StatePanel.tsx` | Shared empty, loading, offline, timeout, and error presentations |
| `src/components/RollingNumber.tsx` | Tabular fixed-slot number animation and static accessible value |
| `src/components/ForkMark.tsx` | Shared product fork mark in compact, heading, and empty-state sizes |
| `src/format.ts` | Locale-aware price, GAP, volume, date, and countdown formatting |
| `src/data/milestones.ts` | Product data only; no presentation labels or theme decisions |
| `DESIGN_SYSTEM.md` | Normative visual, interaction, motion, accessibility, and responsive contract |

### 10.3 Migration constraints

- Preserve existing component exports until every caller has migrated.
- Preserve all existing data and route behavior.
- Do not create parallel button, tooltip, modal, or icon systems.
- Do not retain `.chip` styling on noninteractive status, verdict, time, organization, chain, or count output.
- Keep `motion/react` only where it already provides interruption or layout continuity. Prefer CSS for bounded transitions.
- Do not add a package for icons, charts, controls, focus traps, or animation.
- React components remain strict TypeScript.
- SVG chart and icon code remains authored in the repository.
- Every migrated component must ship dark, light, phone, keyboard, loading, empty, error, and reduced-motion states together.
