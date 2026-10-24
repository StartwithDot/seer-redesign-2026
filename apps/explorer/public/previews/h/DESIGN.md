---
name: Seer Explorer H
description: Captured market evidence expressed through calibrated violet and lavender instruments.
colors:
  page-dark: "#101013"
  panel-dark: "#1A1A1E"
  nested-dark: "#1F1F24"
  raised-dark: "#26262D"
  text-dark: "#EDEDF2"
  secondary-dark: "#A8A8B3"
  muted-dark: "#9999A5"
  action-dark: "#7B3AFF"
  action-hover-dark: "#8C56FF"
  accent-ink-dark: "#BB9BFF"
  selected-dark: "#241E33"
  line-dark: "#35353E"
  divider-dark: "#29292F"
  outcome-one-dark: "#9C6FF2"
  outcome-one-soft-dark: "#292038"
  outcome-two-dark: "#D6C8FF"
  outcome-two-soft-dark: "#292631"
  positive-dark: "#3DDC97"
  negative-dark: "#FF7B8E"
  caution-dark: "#F5B84A"
  info-dark: "#85B4FF"
  track-dark: "#777781"
  metal-dark: "#797586"
  metal-bright-dark: "#C7C3D5"
  shade-dark: "#0B0B0D"
  page-light: "#F7F7F9"
  panel-light: "#FFFFFF"
  nested-light: "#F1F1F4"
  raised-light: "#E8E8EE"
  text-light: "#17171C"
  secondary-light: "#5C5C66"
  muted-light: "#666672"
  action-light: "#6C2BD9"
  action-hover-light: "#5E21C6"
  selected-light: "#EFE9FC"
  line-light: "#C7C7D1"
  divider-light: "#E2E2E9"
  outcome-two-light: "#38246E"
  outcome-two-soft-light: "#ECE9F4"
  positive-light: "#087548"
  negative-light: "#B82740"
  caution-light: "#855700"
  info-light: "#255DB5"
  track-light: "#797985"
  metal-light: "#8B879B"
  metal-bright-light: "#443B58"
  shade-light: "#E2DEE9"
  hero-plate: "#0B0B0E"
  hero-text: "#F4F2FA"
  action-label: "#FFFFFF"
typography:
  display:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "44px"
    fontWeight: 520
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 550
    lineHeight: "34px"
    letterSpacing: "-0.025em"
  hero:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 560
    lineHeight: "28px"
    letterSpacing: "-0.025em"
  instrument:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 570
    lineHeight: "32px"
  title:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 550
    lineHeight: "20px"
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  control:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.2
  label:
    fontFamily: "Inter Tight, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
  mono:
    fontFamily: "ui-monospace, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  control: "8px"
  segmented: "10px"
  nested: "12px"
  surface: "16px"
  selected-thumb: "7px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  xxl: "24px"
  section: "32px"
  page-gutter: "clamp(20px,3.2vw,56px)"
components:
  button-primary:
    backgroundColor: "{colors.action-dark}"
    textColor: "{colors.action-label}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover-dark}"
    textColor: "{colors.action-label}"
  button-primary-light:
    backgroundColor: "{colors.action-light}"
    textColor: "{colors.action-label}"
  button-secondary:
    backgroundColor: "{colors.nested-dark}"
    textColor: "{colors.text-dark}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  button-secondary-hover:
    backgroundColor: "{colors.raised-dark}"
  button-disabled:
    backgroundColor: "{colors.raised-dark}"
    textColor: "{colors.secondary-dark}"
  input:
    backgroundColor: "{colors.nested-dark}"
    textColor: "{colors.text-dark}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  market-card:
    backgroundColor: "{colors.panel-dark}"
    textColor: "{colors.text-dark}"
    rounded: "{rounded.surface}"
    padding: "16px"
    height: "200px"
  market-card-selected:
    backgroundColor: "{colors.selected-dark}"
  inspector:
    backgroundColor: "{colors.panel-dark}"
    rounded: "{rounded.surface}"
    width: "416px"
  open-trade:
    textColor: "{colors.secondary-dark}"
    rounded: "{rounded.control}"
    padding: "8px"
    size: "32px"
  open-trade-hover:
    backgroundColor: "{colors.selected-dark}"
    textColor: "{colors.accent-ink-dark}"
  segment:
    backgroundColor: "{colors.nested-dark}"
    rounded: "{rounded.segmented}"
    padding: "3px"
  segment-selected:
    backgroundColor: "{colors.panel-dark}"
    textColor: "{colors.text-dark}"
    rounded: "{rounded.selected-thumb}"
  primary-navigation:
    backgroundColor: "{colors.page-dark}"
    textColor: "{colors.secondary-dark}"
    height: "56px"
  status-chip:
    backgroundColor: "{colors.nested-dark}"
    textColor: "{colors.secondary-dark}"
    padding: "3px 6px"
  outcome-choice-selected:
    backgroundColor: "{colors.outcome-one-soft-dark}"
    textColor: "{colors.accent-ink-dark}"
    rounded: "{rounded.nested}"
    padding: "10px 12px"
  scalar-interval:
    textColor: "{colors.secondary-dark}"
  related-row:
    backgroundColor: "{colors.panel-dark}"
    textColor: "{colors.text-dark}"
    padding: "16px 20px"
---

# Design System: Seer Explorer H

## Overview

**Creative North Star: "Calibrated information"**

This is the code-led record of the human-pinned Electric Foundation identity and the selected direction, "Keep violet/lavender, refine the instruments." The name describes the shipped measuring-instrument language; it does not imply a new identity approval, concept seed, QUALITY BAR card or approved comp. The durable product constraint is that a researcher can read a question, its asker and its priced claim without starting a trade.

The interface is dense and calm. Small calibrated arcs and interval ribbons turn repeated market cards into readable instruments. Near-black tonal surfaces establish grouping, violet identifies actions and selection, and lavender distinguishes the second outcome. The light theme has its own near-white surface ramp and deeper outcome inks. A dark photographic hero remains dark in either theme.

**Key Characteristics:**
- Calibrated data marks with direct outcome names and values.
- Tonal surfaces, fine dividers and restrained rounded geometry.
- Local Inter Tight, stable tabular figures and compact controls.
- Persistent actions beside independently scrolling evidence.
- Honest missing-data, error and local-simulation states.

Evidence: `app.css`, `seer-shell.css`, `seer-subbar.css`, `subbar.css`, `icons.js` and `app.js`, in the stylesheet order in `index.html`. The direction contract in `REDESIGN_NOTES.md`, `PRODUCT.md` and `DESIGN_SYSTEM.md` supply authority; the final CSS cascade supplies the values below. Sampled captures: desktop/phone home in dark, desktop home in light, Related phone in light and scalar order phone in dark. This document is not a new browser-test result. The sidecar is schema v2; its ramps are explicitly generated display previews, not additional shipping CSS tokens.

## Colors

The primary family is violet/lavender; semantic status inks remain separate from market ranking.

### Primary

- **Action Violet:** `action-dark` and `action-light` fill primary controls with white labels; their hover counterparts deepen or brighten the same family.
- **Readable Violet:** `accent-ink-dark` is the dark-theme label, selection outline and focus ink. Light uses `action-light` for this role.
- **Outcome Violet:** `outcome-one-dark` supplies the first graph stroke; its text uses Readable Violet. In light mode both stroke and text use `action-light`.
- **Outcome Lavender:** `outcome-two-dark` supplies the second dark-theme trace and text. `outcome-two-light` is its independent deep ink in light. Hollow legend marks, dashed traces and SVG hatch reinforce the distinction.
- **Selected Tone:** `selected-*`, `outcome-one-soft-dark` and `outcome-two-soft-*` are quiet fills beneath selected surfaces or outcome choices.

### Secondary

- **Positive / Negative:** `positive-*` and `negative-*` distinguish profit and loss.
- **Caution:** `caution-*` identifies warnings and unverified status.
- **Agent Blue:** `info-*` identifies machine-readable context and JSON keys.

### Neutral

- **Page / Panel / Nested / Raised:** the four `*-dark` and `*-light` surface families provide grouping without ambient elevation.
- **Text / Secondary / Muted:** primary content, supporting context and less prominent metadata use their matching theme roles. `secondary-dark` also supplies neutral remaining outcomes; light uses `muted-light` for those marks.
- **Line / Divider / Track:** outlines, separators and chart calibration have independent values. The final track override is brighter than the original raised-surface track.
- **Metal / Metal Bright / Shade:** vector scale and coin materials use these restrained neutral roles, not additional market categories.
- **Hero Plate / Hero Text:** fixed dark editorial image plate and readable foreground, preserved across themes.

**The Named Mark Rule.** A color never carries an outcome alone: accompany the mark with its name and value, and preserve the patterned second series.

**The Independent Light Rule.** Use the authored light inks and tonal surfaces together; do not invert dark colors mechanically.

## Typography

**Display and Body Font:** local variable Inter Tight (`assets/inter-tight.woff2`, weights 100 to 900), with system-ui/sans-serif fallback. This is an explicit brand requirement.

**Label/Mono Font:** system monospace for ids, addresses and JSON. Controls and ordinary metadata retain Inter Tight.

### Hierarchy

- **Display:** the full-record probability uses the frontmatter display token; it becomes 38px below 1350px and 40px on phones. Its percent suffix is 24px.
- **Headline:** full question uses the headline token with a 38ch desktop limit, expanding to 60ch at the single-column market layout. Phone is 24px/30px. Leaderboard uses 32px/38px on desktop and 28px/34px on phone.
- **Hero:** the frontmatter hero role becomes 23px/27px below 1099px and 18px/22px on phone. The final phone rule removes the two-line clamp so the complete question remains visible.
- **Instrument:** large tile probability uses the instrument token. Scalar tile values use 24px/30px with an 11px/16px unit kept on the same baseline. Phone inspector probabilities grow to 30px.
- **Title:** card and inspector questions use the title role, usually a two-line clamp. Inspector permits three lines on phone; complete text remains in titles and accessible names.
- **Body:** normal text uses the body token; explicit evidence rows commonly use 14px/20px. Related phone rows use 13px/20px.
- **Control / Label:** primary actions use the control role; outcome labels use the label role. Supporting selectors also carry 10px and 11px metadata in the shipping build; these exceptions are recorded below rather than promoted into the general type scale.
- **Mono:** JSON and ids use the mono family; compact machine panels locally use 11px, with wrapping or internal scrolling.

**The Stable Number Rule.** Probabilities and amounts use tabular lining figures, with reserved measure widths where present. Keep numbers stable while labels wrap.

## Layout

The global header is fixed at 56px. The second navigation row is sticky below it and also 56px. The desktop context strip starts at 48px; it wraps at 850px and has a 100px phone minimum. The home gutter follows the frontmatter clamp. Shell and full-record page margins are separately authored at 24px desktop and 16px phone; do not assume one universal container token.

The home hero and cards are 200px high on desktop. The final phone hero is 240px. Home has a flexible market region, 16px gap and 416px inspector. Default tiles have three columns. At 1750px and above there are four; 1100px to 1299px uses two alongside the inspector; 901px to 1099px returns to three after the inspector becomes a sheet; 601px to 900px uses two; phones at 600px and below use one. This is the actual cascade, not a uniform column-count progression.

Inspector is sticky from 128px, with its maximum height computed from its observed viewport offset. Its middle scrolls with contained overscroll; the action/footer remains in the flex column. Below 1100px it becomes a full-width bottom sheet, at most 88dvh/760px, then viewport minus 64px on phone. Full-record trade console uses 360px desktop width, 336px below 1350px, and becomes a bottom overlay at 1050px. Persistent mobile actions open it. Bottom padding respects safe-area insets.

Cards use 16px padding and 12px interior gaps. Inspector and trade middle use 16px 20px, with 12px 20px footer padding. Related rows have a minimum 64px height and 16px 20px padding; phone uses 16px. Pools separate label, values and action, then move the label to a full first row on phone. Tables retain intentional horizontal internal overflow rather than compressing columns into unreadable data.

Phone navigation keeps Markets, Leaderboard, Policies and Human/Agent accessible. Search is an icon-sized field that expands across the row while focused, with a close control. Filters become icon controls; view mode, totals and Create occupy dedicated toolbar rows. Do not infer that a desktop-hidden label means its action disappears.

## Elevation & Depth

Depth is predominantly tonal: panel, nested and raised surfaces, selected tint and fine dividers. Cards have no resting ambient shadow. Overlays use a near-black translucent scrim (`rgba(5,5,9,.68)` for the inspector; `.72` for dialogs), border and stacking order. Selected cards use a one-pixel inset outline; keyboard focus uses a two-pixel violet outline offset by three pixels. Hover raises a card by two pixels, without adding a cast shadow.

Masks use a 12px fade at internally scrolling panel edges as an overflow cue. This is not a gradient page background. SVG scale shadows represent the physical object. Radio and checkbox inset shadows form their checked marks. None establishes a general floating-card shadow vocabulary. The one expanded-phone-search cast shadow is listed as drift below.

**The Tonal Depth Rule.** Establish hierarchy with the authored surface ramp and purposeful dividers; do not add gradient or glow backgrounds or large ambient surface shadows.

## Shapes

Surface corners use the frontmatter surface radius, nested containers the nested radius, controls the control radius. Segmented tracks use the segmented radius and selected thumbs the smaller thumb radius. Small chips use 4px/5px corners, avatars 8px/10px and circular second-outcome legend marks. These local silhouettes have semantic roles and do not replace the main corner hierarchy.

The shared icon sprite has a 20px viewBox, 1.75px stroke and round caps/joins. Point-of-use sizes vary from 12px metadata to 20px controls. Open trade uses a 16px arrow in a 32px desktop hit area, enlarged to 40px on phone. Preserve the supplied raven brand geometry as its own asset.

## Components

### Buttons

Compact, direct and tonal. Primary has the frontmatter fill, padding and corner, minimum 40px height, and a 13px semibold label. Hover uses the corresponding action-hover color. Secondary uses nested fill, raised hover and a minimum 36px height. Generic press shifts one pixel. Focus is a two-pixel visible outline. Disabled primary uses raised fill and secondary text; disabled native controls keep a not-allowed cursor. Busy simulation changes the label to Simulating and disables confirmation while pending.

Open trade is separate from selection: its up-right arrow moves two pixels up and right on hover/focus in 160ms, uses selected tone, and shows an Open trade tooltip. It stops propagation and navigates to the full record. Copy-asker is another distinct action, revealed on desktop hover/focus and always visible on phone.

### Chips and outcome choices

Status/type chips use compact nested fill and readable secondary text. Outcome buttons use nested fill at rest, theme-specific outcome ink, and selected soft fill with a one-pixel outline in the matching outcome color. First/second ranking is independent of violet navigation selection. Quick amounts are a four-column group; pressed state adds violet tint and outline.

### Cards and evidence containers

Market card has fixed measured slots: 44px header, flexible signal area and 24px footer. Title and image anchor the question; the numeral and calibrated half-arc or scalar ribbon establish its signal. Hover changes to nested fill and shifts up two pixels; selected uses selected tint and accent outline. Related rows are full-title links with a separate 20px action slot. Pools rows preserve explicit label/value/action alignment and wrap their phone label independently.

### Inputs and validation

Fields have nested fill, an initially transparent one-pixel border, control corners and 10px 12px padding. Focus changes the border to accent ink. Search combines field and icon with a one-pixel outline that changes on focus-within. Custom-amount error is adjacent 12px/16px negative text; invalid quick input takes negative ink, exposes aria-invalid and disables preview. Selected radio/checkbox marks use authored inset fills, not textual check glyphs.

### Navigation and menus

Top product shell preserves the raven and compact current-product badge. Main navigation uses 13px labels and a two-pixel violet active underline; phone uses 12px. Human/Agent, view modes, history ranges and tabs share a sliding tonal thumb with a 240ms in-out transition. Menus use nested hover rows in a panel with a fine border and nested corners, 180ms opacity/transform entry, keyboard opening, outside click and Escape. Hover intent waits 80ms and exit 180ms in the filter popover. Only one menu remains open; focus moving within it does not dismiss it.

### Calibrated instruments

Tile half-arcs use three-pixel rounded strokes, a one-pixel tick and a brighter independent track. Second series is dashed; larger categorical fills use the six-pixel SVG hatch pattern. Full dial carries 0/25/50/75/100 labels, a ten-pixel distribution arc and a two-pixel needle. Scalars use a bounded ribbon with direct estimate and endpoints. History follows captured timestamps with unsmoothed segments and real observations; its second series is dashed. Missing history stays a labelled unavailable state. Scalar payoff explicitly names upper/lower endpoints and proportional settlement.

Inspector history uses a two-pixel outcome-one stroke with no line fill, a quiet solid area, explicit secondary-text SVG axis labels and violet endpoint text. Endpoint halos use a four-pixel panel-colored stroke with paint-order:stroke. The one-pixel crosshair is dashed; its circle uses panel fill and a two-pixel outcome stroke. The raised tooltip uses a fine line border and 11px/16px text. These final styles prevent the browser's default black SVG label fill from leaking into dark mode.

Balance scale is a vector instrument with fulcrum, suspended pans and layered metal/coin shapes. It moves when quote values change. The finite spring uses stiffness 260, damping 20 and stops when velocity and position error are below .02. Coin additions settle once over 600ms. Rolling digits transition over 400ms; compact quote changes over 240ms. Gauge entry uses 600ms. Tile mark entry/hover uses 400ms. Agent scan occurs once over 1600ms. The six-second carousel progress describes actual time and pauses on hover/focus; reduced motion disables autoplay. Pending-load opacity alternates every 1400ms only while the real local data request is pending. Reduced motion cancels these animations, snaps instruments to their target and preserves immediate state changes.

### Overlays and actions

Inspector and trade overlays retain a scrolling middle and persistent primary action. Details overlays make covered controls inert. Dialogs use surface corners, panel fill, fine border, bounded height, internal scrolling and a dark scrim. Mobile overlays restore focus, contain Tab and keep actions above safe-area padding. Local-simulation copy stays visible beside actions and completion, while live handoffs remain explicit.

## Do's and Don'ts

### Do:
- **Do** preserve local Inter Tight, the supplied raven and the human-pinned EF identity.
- **Do** apply the correct theme's surface, text, outcome and status roles together.
- **Do** pair every signal color with a name, value and the existing second-series pattern.
- **Do** retain full question access, persistent actions and internally scrolling evidence at small heights.
- **Do** use the shared SVG family and meaningful accessible labels for action controls.
- **Do** encode supplied values and actual timestamps; label missing data and simulated estimates honestly.
- **Do** make instrument motion finite and keep the still reduced-motion state usable.

### Don't:
- **Don't** add glow, gradient page backgrounds or large ambient surface shadows.
- **Don't** turn outcome ranks into arbitrary category colors or rely on color alone.
- **Don't** add idle scale sway, ambient pulses or ornamental motion loops.
- **Don't** convert evidence labels into decorative uppercase kickers or introduce glyph icons as a new icon system.
- **Don't** promote a source exception or detector false positive into a new house-style rule.

Observed drift, not canonized or repaired: `DESIGN_SYSTEM.md` planned display 40/44 and metadata 12/16, while source has the documented 44px probability and local 10/11px metadata. Phone hero intentionally follows the final complete-question correction, 240px and 18/22, rather than the original desktop hero dimensions. The expanded phone search has `box-shadow:0 8px 24px #0003` in `subbar.css`, an isolated exception to the no-surface-shadow direction. Literal `DEMO ORDER ESTIMATE` remains uppercase in `app.js` despite CSS text-transform:none; that inherited label is not a reusable eyebrow pattern. Generic buttons still retain their short color/press transition under reduced motion, while named instrument/overlay animations are cancelled. These are source observations for future review, not repaired or declared newly approved by this documentation pass.
