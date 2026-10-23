# EF kit: real values (from the user's Figma exports in kit/)
Source images: kit/dark-mode-board.webp, light-mode-board.webp, color-palette.png, trade-ticket.png. These override any earlier guessed tokens.

## Palette (as labelled in the kit)
| Role | Dark | Light |
|---|---|---|
| Page background | #101013 | #F7F7F9 |
| Card base | #1A1A1E | #FFFFFF |
| Nested surface | #1F1F24 | #1F1F24 label shown, renders as light grey ~#F0F0F3 |
| Text primary | #EDEDF2 | #17171C |
| Text secondary | #A8A8B3 | #5C5C66 |
| Muted labels | #67676F | #8E8E99 |
| Button primary | vivid violet ~#7A3CFF (label in kit reads 67676F by mistake; swatch renders ~#7B3AFF) | same |
| Button secondary | #241E33 | #EFE9FC |
| Button secondary text | #9C6FF2 | #6C2BD9 |

## Structure of the real Seer web app (dark board)
- Top bar: logo (lightning-S + "seer" wordmark), pill search field "Search markets...", links Markets / Create Market / Policies / App, a "Filter" pill with funnel icon + chevron, and a violet "Create Market" button with an external-link icon.
- Category row under it: horizontally scrolling text tabs (All [filled violet chip], Elections, Politics, Business, Science, Crypto, Pop Culture, Sports, DOGE, Weather, MLB ASG, ...) with left/right arrow buttons at both ends.
- Market grid: 4 columns of cards, dense. Card types seen:
  1. Multi-outcome list: thumbnail + question, then rows "label  NN%  [Yes][No]" (Yes = solid violet, No = dark violet-grey), footer "$170K Vol." with gift and bookmark icons.
  2. Three-way sports: two flag rows with %, then three segmented buttons (Argentina, Draw, England).
  3. Up/Down binary (BTC Up or Down 5m): big full-width violet "Up" and dark "Down" buttons, footer shows red "LIVE" dot + category.
  4. Head to head esports: two team rows with 100%/0% and two buttons (1 Win / Vici Gaming), footer volume, game, time.
  5. Single question with big Yes / No buttons (Strait of Hormuz...).
- Card anatomy: 12px-ish radius, no borders, tonal surface steps only (page -> card -> nested row), 40px thumbnails with rounded-8 corners, tiny muted footer text (11-12px) with icons right aligned, segmented violet Yes/No micro-buttons (~22px high) inline on the row.
- Trade ticket (Desktop - 1): two cards. Left: flame icon + "400K Vol.", "4M ago", question in bold, two big tiles Yes 69c (solid violet) / No 37c (dark violet, lavender text). Right: "Amount" label, huge $100.00 numeral (grey, tabular), quick-add chips +$1 +$5 +$20 +$100, big violet "Confirm" and a square violet-tinted X button.
- Typography: clean geometric grotesk, tight letterspacing, semibold titles, regular body, tabular numerals for money/percent.
- Light mode mirrors dark: white cards on #F7F7F9, violet buttons unchanged, secondary buttons pale lavender.
