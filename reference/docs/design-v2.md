# Design v2: the binding spec (overrides docs/design-principles.md where they conflict)

Truth sources: docs/ef-kit-real.md (exact EF values + card patterns), docs/live-products.md (what each product really is), kit/*.png|webp (look at these images before building).

## 1. Words are the enemy
- No explanatory paragraphs. Maximum: one headline (<= 5 words) and one caption line (<= 10 words) per page. Section titles <= 3 words.
- Meaning comes from visuals, labels, numbers, motion, and iconography. If something needs a sentence, redesign the visual.
- Delete all per-component "illustrative" notices. ONE small "Demo · sample data" chip in the footer only.
- No "how it works" copy blocks. Show it: animated diagrams, stepper icons with <= 2 word labels.
- Never write disclaimers about Seer features inside the UI. (Departures/honesty live in the claim text, not the pages.)
- Tooltips may hold detail (appear on hover/focus, 300ms delay).

## 2. EF fidelity (exact)
- Dark: page #101013, card #1A1A1E, nested #1F1F24, text #EDEDF2 / #A8A8B3 / #67676F. Light: page #F7F7F9, card #FFFFFF, nested #F0F0F3, text #17171C / #5C5C66 / #8E8E99.
- Primary violet ~#7B3AFF (hover +6% lightness, press -6%). Secondary button dark #241E33 with text #9C6FF2; light #EFE9FC with text #6C2BD9.
- Semantic: YES = solid violet, NO = secondary violet tile (as in kit). Up/Down same. Green/red only for deltas and LIVE.
- Surfaces separate by TONE, not borders. Borders only 1px rgba(255,255,255,.06) where needed.
- Dark default + working light toggle (all six pages).
- Font: "Inter Tight" (Google Fonts), weights 400/500/600/700; tabular-nums on every number; tight tracking on titles (-0.02em). Monospace only for addresses.
- Reproduce the kit components faithfully: pill search with magnifier, Filter pill with funnel + chevron, violet Create button with external-link glyph, category text-tabs row with violet filled "All" chip and arrow buttons, market cards with 40px rounded thumbnails, inline micro Yes/No buttons (~22px), card footers (muted 11-12px, vol + icons right), Up/Down big buttons, three-way segmented buttons, LIVE red dot, trade ticket (Amount, huge numeral, +$1 +$5 +$20 +$100 chips, big Confirm, square X).
- Logo: lightning-S glyph + "seer" wordmark as in the kit (draw as inline SVG).

## 3. Edge-to-edge and corner craft
- Layouts bleed: hero and key visuals are full-bleed (100vw), no boxed max-width wrappers around visuals. Text inset uses one gutter token (clamp(16px, 3vw, 40px)). Card grids use 8px gaps and run to the gutter.
- Media bleeds to card corners (thumbnails, charts, bars touch card edges, clipped by the card radius). No padded "image in a box inside a box".
- Concentric radii: inner radius = outer radius - padding. Card 16px, nested rows 10-12px, chips/buttons 8-10px, pills full. Never mismatched corners.
- Consistent 4px grid; every inset from the token scale (4/8/12/16/24).
- Charts are full-width inside cards, no inner frames.

## 4. Micro-detail checklist (all of these must be present)
- 1px inner top highlight on cards (inset 0 1px 0 rgba(255,255,255,.05)), no heavy shadows in dark; soft layered shadows in light.
- Cursor-following soft violet spotlight on cards (radial-gradient via CSS vars, 6% opacity).
- Press states: scale(.97) 90ms; hover: tonal step up 140ms; focus-visible: 2px violet ring with 2px offset.
- Numbers: odometer/rolling digits on change; count-up on first view; green/red flash (500ms) on tick; live simulated ticks every 1.5-4s on prices (random walk, seeded).
- Charts: line draw-in (stroke-dashoffset, 900ms ease-out), crosshair with value tooltip on hover, end-labels pills on the right axis (like Seer market chart), area fill fade.
- Entrance: staggered fade+rise (translateY 8px, 30ms stagger, max 8 items), once per element, IntersectionObserver.
- List reorders animate with FLIP (positions glide), never jump.
- Skeleton shimmer on first paint (400ms) before real content on every grid/table.
- Sticky header with backdrop blur and 1px bottom line that fades in after 8px scroll.
- Keyboard: "/" focuses search, "Esc" closes sheets, arrow keys in tab rows, "t" toggles theme. Show tiny kbd hints in the search pill.
- Cross-page navigation uses @view-transition { navigation: auto } with a short crossfade.
- Tooltips: 300ms delay, 8px radius, arrow-less, 11px text.
- Toggle/switch/segmented controls have a sliding thumb (transform), not instant background swap.
- Empty/loading/error states designed (icon + 2 words).
- prefers-reduced-motion: disable movement/ticks, keep opacity fades.
- Performance: no libraries, no images beyond inline SVG/emoji-free vector art; first paint < 1s.

## 5. Per-page concept (signature visual + interaction; real vocabulary)
1. Home (index.html): full-bleed. Headline "Ask the market." One caption. Live ticker tape (marquee of ~12 markets with price + delta) edge to edge. Below, a bleeding 5-tile mosaic, each tile a LIVE animated mini-UI of its product (explorer cards flipping, deep lines racing, futarchy twin lines diverging, opportunity bars reordering, risk dots sliding); tile hover expands and links through. Then a 3-step animated diagram of conditional tokens: 1 collateral -> splits into YES + NO tokens -> trade. Icons + <= 2 word labels. Footer.
2. App (app.html), the Explorer: replicate the kit's dark board. Top nav (Markets, Create Market, Policies, App), pill search with "/" hint, Filter pill (opens a popover with type/status/chain chips), violet Create Market. Category tab row with arrows. 4-col dense grid with all five kit card types (multi-outcome rows with inline Yes/No; three-way segmented; Up/Down with LIVE; head-to-head; single Yes/No). Also a view toggle Grid | Table (Etherscan-style dense table with sortable columns, volume, liquidity, status, age) so it reads as "Etherscan of prediction markets". Clicking a card/row opens a market detail sheet: header strip, step-line chart with end-label pills and range tabs (1D 1W 1M All), outcome list, and the kit's trade ticket (Amount, chips, Confirm -> confirmation animation: check draws, ticket collapses into a "Position" row). Prices tick live. Donut mini-charts allowed on multi-outcome cards (Seer signature).
3. Deep (deep.html): real model. Round tabs "Round 3 · Originality" (LIVE dot) + "Archive". Hero chart: ~24 repositories as lines of UP price over time racing on one canvas, end-label pills, hover isolates one line and dims the rest, scrubber to replay. Under it: repo grid where each repo is an UP/DOWN pair bar (UP violet share, DOWN muted) with live tick; "Upload predictions" drop zone (drag a file -> 24 agent lines animate in; works with any file, simulated) and "Export weights" button; mini leaderboard of agents (avatars, score, streak). 3-dot onboarding stepper (Wallet, Trade wallet, sUSDS) collapsible. No paragraphs.
4. Futarchy (futarchy.html): real model. "Active Milestones" cards: token logo (ETH/GNO/PNK drawn as simple vector glyphs), chain tag, question with the CONDITION in violet, "Open until" as a circular countdown ring, three stat tiles YES Price (blue), NO Price (amber), Impact (green) ticking live. Click -> detail: two price lines (if passes / if fails) drawing live with the gap shaded and Impact % as a big rolling number; a gauge showing the lean; Recently Closed row with Resolved YES/NO chips; Organizations table (Gnosis DAO, Kleros DAO, Ethereum, Aave DAO ...) with active/proposals/chain/liquidity bars. The DAO-decides idea is expressed by a locked "DAO decision" slot with a padlock glyph, not text.
5. Opportunity Markets (opportunity.html): a submissions grid of cards (logo tile, name, selection probability ring, +/- pp arrow, mini sparkline). Two lanes: left "Market" lane re-sorts live with FLIP animation as probabilities tick; right "Reviewers" lane is a column of locked slots (padlock, "Pending") that never reorders. Selecting a card pins it to both lanes with a connecting line. Timeline scrubber for the trading window. Labels only.
6. Risk Pricing (risk.html): one control strip: threshold chips (>=1% >=3% >=5% >=10% loss) + horizon segmented control (30d/90d/1y), sliding thumb. Heat matrix: protocols (Aave, Morpho, Sky/Maker, Compound, Spark, Euler) x thresholds, cells colored on a single violet-to-red scale with tabular numbers, animated recolor on change. Ladder chart: horizontal interval dots sharing ONE axis, a draggable vertical threshold line that live-reprices every row (numbers roll). Row click opens a drawer: sparkline, interval band, protocol-specific figure. Optional bps "spread" column. Labels only.

## 6. Shared system
- One ef.css (tokens, components) and one ef.js (nav/footer injection, theme, ticker engine, rolling numbers, tooltip, FLIP helper, chart helpers, spotlight, reveal, shortcuts, skeletons, seeded RNG). Identical nav + footer on all pages: logo, Markets/Deep/Futarchy/Opportunity/Risk links, pill search ("/"), theme icon button, violet Connect button; below 900px a hamburger sheet.
- Nav label mapping: Home (logo), Explorer ("Markets" -> app.html), Deep, Futarchy, Opportunity, Risk.

## 7. Acceptance (the judge and the human will check)
- Zero paragraphs > 14 words anywhere. Count words visible on first screen of each page: <= 60.
- Every interactive element works (test it): tabs, filters, sort, popovers, sheets, sliders, drag, theme, keyboard shortcuts.
- Works at 390px, 768px, 1440px; no horizontal scroll; touch targets >= 40px.
- Looks like the Seer kit at a glance (same cards, same violet, same buttons), only better.
