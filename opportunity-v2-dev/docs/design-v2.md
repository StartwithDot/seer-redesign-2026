# Opportunity Markets v2 "Ledger": redesign spec (binding)
Base: apps/opportunity-v2 is a COPY of the approved apps/opportunity (identical to the live GitHub version StartwithDot/seer-redesign, verified). Goal: a clearly DIFFERENT, more standard, world-class exchange look (not a re-skin that reads as a copy), WITHOUT losing a single component, feature or control (PARITY.md is the checklist and becomes tests). Doctrine: .claude/skills/impeccable (read SKILL.md + reference/), IMPECCABLE_RULEBOOK.md, ui-ux-pro-max guidance (typography, colour, chart rules), docs/ui-quality-rules.md (fixed sizes, no overlaps, labels, fit any viewport). Real product vocabulary only (see products/opportunity/stage-spec.md section 'Hard constraints'; no word 'Stage' in UI).

## 1. Colour (new; semantic roles unchanged). Tokens in src/tokens.css, dark default + full light theme, no raw hex in components
| Token | Dark | Light | Role |
|---|---|---|---|
| --bg | #0B0F14 | #F4F6F9 | page |
| --surface | #111720 | #FFFFFF | cards, panels |
| --raised | #171F2B | #EEF1F6 | inputs, chips, hover |
| --line | #232D3B | #DDE3EC | 1px hairline borders (borders are now allowed and used) |
| --text / --text-2 / --text-3 | #E7ECF3 / #9AA6B6 / #66738A | #0F1722 / #4A5668 / #6B778A | text (>=4.5:1 for text, >=3:1 for graphics) |
| --accent | #5B7CFA | #3F5EE0 | market/odds/interactive primary (replaces violet) |
| --accent-soft / --accent-text | #1A2447 / #9DB3FF | #E4EAFF / #3149B8 | selected states |
| --ramp-0..4 | #16213F #2B418F #3F5EE0 #5B7CFA #B4C5FF | light equivalents | heatmap + bubble fill by odds (log scale) |
| --sponsor / --sponsor-text | #F2B544 / #F2B544 | #B9770E / #8A5600 | sponsor authority ONLY (icon, chip text), never a stripe or bar |
| --up / --down | #2BD48A / #FF5D6C | #12915F / #D1334A | deltas only |
| --floor / --nopool | #6B7A90 / #3A4455 hatch | #8793A6 / #C3CBD8 hatch | tied-at-0.4% and no-pool tiers |
| --brand | #7B3AFF | #6C2BD9 | Seer violet ONLY in the wordmark, BETA chip and the Explainer scenes (brand moments), not product UI |
Never gradient text, glass, glow, side-stripe borders, pulsing decorative dots.

## 2. Type, shape, motion
Geist (UI) + Geist Mono (all numerals, ids, odds, prices; tabular) via @fontsource-variable (npm). Scale 12/13/14/16/20/28, line-heights on 4px grid; labels 12px/16px uppercase tracking .04em muted. Radii 10 (cards) / 8 (controls) / 6 (chips); 1px --line borders; elevation by border + surface step only. Spacing scale 4/8/12/16/24/32. Motion: exponential ease-out cubic-bezier(.16,1,.3,1), durations 120/200/360ms, NO bounce/elastic springs on UI (springs only where physics is the point: bubbles settling), no infinite loops except none; reduced motion = instant. Icons: inline SVG 1.5px stroke.

## 3. Layout (rearranged; same components)
- HEADER 56px: wordmark + BETA | nav (The pilot, The protocol popover, Archive) | MARKET SWITCHER chip (current market name + status dot + chevron; HoverMenu list with the Active/Completed/All filter and search; selecting morphs the board) | search pill (palette, / and Cmd+K) | ? | theme | Connect wallet / wallet pill.
- LEFT RAIL 288px (kept): Markets title + Explore button, Active/Completed/All segmented with counts, find field, 56px rows (avatar, full name up to 2 lines, '235 outcomes . 1 winner', expand-view icon button at the row edge).
- CENTER: market header row = avatar + title + status chip + Live data/Sample chip + info + 'Expanded view' button; metric line directly under it as ONE inline strip of label/value pairs with 1px dividers (Volume | Liquidity | Outcomes | Decision | Data), no enclosed capsules; then TOOLBAR (36px): one segmented control [Bubbles | Heatmap | List] (List moves into this group) on the left, the scale legend on the right (heatmap = gradient bar 'Odds 0.5% to 5.9%'; bubbles = size key); then the BOARD fills ALL remaining height: priced bubbles/heatmap on the left ~70% and the two named tier panes (Tied at 0.4% . 46, No pool . 130) on the right ~30%, each pane with header + count + internal scroll.
- RIGHT COLUMN 340px = three stacked cards: (1) Selected submission (avatar, name, Odds %, Price sDAI, Rank, mini price history 96px labelled, Review submission link), (2) DECISION card moved here from the old bottom bar: Review cut slider + readout 'Top 27 . 60.4% of odds' + Sponsor decision row (lock icon in --sponsor, 'Pick 1', status chip Pending/Winner, 'View shortlist' button), the cut also drawn on the board as the top-k outline, (3) compact Ticket (Buy/Sell, outcome menu, amount + chips, summary line with tooltips, wallet button).
- BOTTOM TICKER BAR 36px (replaces the top marquee): label 'Live markets', horizontally scrollable chips (name, outcomes, leader odds, arrow) that flash on a tick, NO infinite auto-scroll (impeccable flags marquees); right side: 'Live data' and 'Simulated trades' chips + 'Odds guide review. Sponsors decide.' Everything fits any viewport (1024x768 to 2560x1440; short windows scroll the page, nothing is clipped).
- Explore page, Market sheet (scrollable), lot drawer, wallet dialog, Explainer (keeps 5 animated scenes, now in --brand violet + new tokens), Tour (blurred spotlight) are all restyled to the same tokens with the new rhythm; mobile 390: rail becomes the market switcher sheet, decision+ticket become a bottom sheet.

## 4. Non-negotiables
Zero dead controls; every cell/bubble/chip named; no duplicate legends; dimmed colours always restore; keyboard + aria parity; light theme verified; `npx impeccable detect` clean (0 anti-patterns) on the running app; all PARITY.md items present (each gets a data-testid and an e2e assertion); no word 'Stage' in UI.
