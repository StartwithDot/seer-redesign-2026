# Opportunity Markets v2.1: NEW STRUCTURE + EF COLOURS (binding; overrides design-v2.md where they conflict)
User verdict on v2: good, but it still reads as a copy of v1 (same graph, same arrangement), the blue is NOT an EF colour, and there is yellow on the main screen. Required: (1) EF-foundation colours only, no yellow; (2) a genuinely new, simple, modern graph anyone understands; (3) new buttons, new sleek sidebar, new top bar, new filters; (4) a new structure is allowed if NO content/feature is lost (PARITY.md + v1 features all remain). Doctrine: .claude/skills/impeccable (0 detector findings), docs/ui-quality-rules.md (fit any viewport, fixed sizes, named cells, no overlaps).

## 1. Colour: EF only (source: packages/ef/tokens.css + docs/product-identity-guide.md). Delete the blue-slate palette and #5B7CFA everywhere
Surfaces dark: --bg #101013, --card #1A1A1E, --nested #1F1F24; light: #F7F7F9 / #FFFFFF / #F0F0F3. Text dark #EDEDF2 / #A8A8B3 / #67676F; light from tokens.css. Borders: 1px hairline = text colour at 10% alpha (derived, not a new hue).
Primary/interactive: EF violet #7B3AFF (hover/press from tokens.css; lavender #9C6FFF text on dark, #6C2BD9 text on light).
Odds ramp (multi-hue, all EF): lowest = --nested, then EF blue #5B9DFF, EF violet #7B3AFF, top = lavender #9C6FFF (log scale of odds). Selected/top-k outline = lavender.
SPONSOR/DECISION authority = EF teal #2FD4C0 (light #0E9A8B). There must be NO yellow/amber anywhere on screen (amber only for a genuine warning toast). Pending chip = neutral ink-grey #A8A8B3; Winner chip = teal.
Up #3DDC97 (light #12915F) / down #FF5C72 (light #D1334A) for deltas only; floor tier = ink-grey; no-pool = hatched --nested. Brand violet in wordmark/Explainer remains EF violet.
A script test must assert every colour value in tokens.css is from this list (or a derived alpha/tint of it) and that no hex outside tokens.css exists in src.

## 2. New structure (same content, new arrangement)
- LEFT NAV RAIL 64px (always visible, sleek): wordmark mark, then icon buttons (40px, radius 12, tooltip labels) for Markets (home), Explore, Archive, The protocol (popover TODAY/NEXT/ANY DECISION), How it works ('?' opens the Explainer), and at the bottom theme toggle and the wallet button/avatar. Selected item = violet-soft fill, no stripes. The old header nav links (The pilot, The protocol, Archive) are replaced by this rail ('The pilot' = the live market item in the Markets panel).
- MARKETS PANEL 280px beside the rail (collapsible with a chevron to icon-only avatars): filter as three pill chips [Active 7 | Completed 5 | All 12], find field, 60px market rows (avatar, full name <=2 lines, '235 outcomes . 1 winner', expand icon), Explore link at the bottom. Smooth collapse animation (200ms ease-out).
- TOP BAR 56px: breadcrumb 'Opportunity Markets / <current market>' where the market name is the market-switcher HoverMenu; centered search pill (palette, / and Cmd+K); right: Connect wallet. Nothing else.
- MAIN: market header (avatar, title, chips Active / Live data / '1 winner', inline metrics Volume | Liquidity | Outcomes | Decision | Data as one quiet line, 'Expanded view' button) then the BOARD card with underlined tabs [Ranked | Bubbles | Heatmap] (animated indicator) and the legend.
- RIGHT COLUMN 340px, unchanged content order: Selected submission, Decision (Review cut + Sponsor decision in teal + View shortlist), Ticket.
- BOTTOM TICKER 36px (non-looping scrollable chips, flash on tick) + Live data / Simulated trades chips.
- Mobile 390: nav rail becomes a bottom tab bar, markets panel a sheet, right column a bottom sheet.

## 3. The new default graph: RANKED PARETO LADDER (simple, modern, self-explanatory)
One chart, three layers, nothing hidden:
1. COVERAGE STRIP (top, 72px, labelled): cumulative odds curve over rank (axis 0-100% on the left, ranks 1 to N below), the review cut as a draggable handle with the readout chip 'Top 27 . 60.4% of odds'; hover shows rank, name, cumulative %.
2. RANKED BARS (the body, fills the height, virtualised): rows of 40px: rank | avatar | submission name | horizontal bar (length = odds, EF ramp colour by odds) | odds % (Geist Mono) | cumulative % (muted). Sticky column headers 'Rank, Submission, Odds, Cumulative'. Rows above the cut are full strength, rows below are lighter but still readable (>= 4.5:1). A 28px cut divider row sits between rank k and k+1 with the chip 'Review cut . Top 27 cover 60.4%' and a teal 'Sponsor reviews above this line' caption.
3. TIERS inside the same list as collapsible group headers: 'Priced . 59' (expanded), 'Tied at 0.4% . 46' (collapsed, expands to named rows with a flat bar), 'No pool . 130' (collapsed, hatched bars with names); each header shows the count and total odds share. Selecting a row updates the right panel and highlights the curve point; hover syncs both.
Bubbles and Heatmap stay as the other two tabs, restyled with the EF multi-hue ramp, keeping their named tier panes at the right. Default tab = Ranked.

## 4. Buttons and controls (new system)
Primary 40px radius 10, EF violet fill, inset 1px top highlight (rgba(255,255,255,.16)), label + 16px arrow icon that slides 2px on hover, press scale .98, focus ring 2px lavender offset 2. Secondary: --card fill + 1px hairline border, hover --nested. Icon buttons 36-40px round-rect with tooltip. Tabs: underline with a shared animated indicator (translate+width, 200ms cubic-bezier(.16,1,.3,1)). Chips: 28px pills with a leading status dot (static, no pulse). Segmented controls only where a binary mode exists (Buy|Sell). No outlined-box nav links, no side-stripe borders, no nested cards, no infinite animations.

## 5. Acceptance
All PARITY.md features present; 0 impeccable detector findings on the running app; EF-colour test green; fits 1366x768, 1280x720, 1152x720, 1440x900, 1920x1080, 2560x1440; light + dark verified; every control works (click-all); named cells everywhere; real market names exactly (Seer AI Job Board Name, Seer Rebrand Contest, Seer Merch for Devcon Mumbai); no word 'Stage' in UI.
