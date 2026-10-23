# Prompt for the Explorer chat: fix Seam (preview A) into a next-gen Information Finance explorer

Context: Seer Explorer is Seer's MAIN product, the "Etherscan of Seer": every market on the protocol, readable at a glance. The Seam preview (http://127.0.0.1:5187/previews/a/index.html) is the only direction worth keeping, but it is roughly 50 percent right. Do NOT start new concepts and do NOT spend credits on more previews. Fix preview A in place, one numbered item at a time, verify with real viewport screenshots after each group (1440x900, 1100, 820, 390). Work only inside apps/explorer (and its preview folder). No commits. No em dashes anywhere.

Brand: Electric Foundation (near-black #0a0a0a / #121218 / #181822, EF violet #7B3FF2, electric #4B3BFF for emphasis only, lavender #B8A4FF accents, white 100/65/40 text, Inter Tight, tabular numbers on every price). Information Finance framing: a market is a question someone asks; the explorer shows who asks, what is priced, how to use the signal.

## What I verified in the preview (1440x900), problems in order of pain
1. SIDEBAR (left icon rail: list, check, chain, sort, flag, wave icons) is poorly designed and disorganised. Icons have no labels, meanings are unclear, and clicking one opens a "Filters" floating card that sits ON TOP of the market tiles and the rail itself (covers the content, overlaps the trending strip), and it STAYS stuck open; a second click on the rail hits the card instead of toggling. The filter groups (Market States, Verification, Chain...) are long radio lists with raw counts, a tiny close X, and Cancel/Apply at the bottom hidden under the fold at 900px.
2. TRENDING is a single thin strip (one question + a number + a bar + dots). Nobody reads or uses it. I asked for a proper highlight of trending prediction markets, well organised.
3. TILES are cluttered and truncated: titles cut with "...", outcome names cut ("Yes 8...", "Left (UG, LFI, S..."), tiny grey meta lines ("Reports open", "+2 more", "Pending executi..."), a hatched bar, two buttons, and the check and star icons all fight in a 216px card. People should read the question and the key facts without hovering.
4. AGENT TAB: selecting "Agent" next to "Human" only swaps the tiny footer text into monospace ("p 0.745 · thin · c5 $534"). There is no real agent-specific experience.
5. MARKET PAGE: opens, but the top navigation does not work reliably there (Leaderboard works once, then Markets, Create Market and Home do nothing and the page stays on the leaderboard). The page layout (big title, "rope" depth bar, Information three-column text, Pull ticket card) looks like a generic form, not a prediction market.

## Research digest (what good explorers do; look at these, do not copy)
- Polymarket: category chips row under the nav (Trending, Breaking, New, Politics, Sports, Crypto...), a big featured market with live chart on top, then a dense but airy grid; each tile = question, a compact probability readout, the top 2 outcomes with prices, volume, nothing else; extra info on hover or in the detail.
- Limitless (limitless.exchange): top category row (Crypto, Sport, Finance, Politics), a large hero banner carousel, then a split module: ONE featured live market with a real chart and a positions list on the left, a "Most Loved" ranked list on the right with a View All button. Clear module titles with item counts.
- Manifold (manifold.markets): left nav with LABELS (Browse, Election, Predictile, About, App), top tabs for topics, a sort pill group (Best, Hot, New, Any status) and a filter icon; list rows with a small avatar, title, traders count, activity flame, mini probability bar and a single Bet button.
- Kalshi: category tabs, a prominent "trending" column list with 24h change arrows, tiles that show 2 outcomes with Yes/No prices and a sparkline.
- Etherscan (the metaphor Seer uses): dense but aligned tables, tabular numbers, a stats header row (markets, total volume, 24h volume, active traders, liquidity), tabs for what the thing is, filters in a horizontal bar, details on a dedicated page.
Take away: top filter bar (not a floating sidebar card), labeled navigation, one strong featured module, tiles with a single clear reading order, details on hover/focus panels, and a distinct detail page.

## Fixes, in order

### A. Navigation and filters (replace the sidebar)
- Remove the icon-only rail and the floating Filters card. Replace with: (1) a labeled left rail ONLY if it holds navigation (Markets, Trending, New, Ending soon, Leaderboard, My collections, Create) with icon + text, 220px, collapsible to icons with tooltips and a visible expand control; active item has a violet indicator; keyboard accessible; no stuck states; or drop the rail entirely and use the top bar; (2) a horizontal FILTER BAR above the grid: category chips (All, Politics, Crypto, Sports, Culture, Tech, Science, Finance, Markets about Seer/Reality/Kleros) as a scrollable chip row, then pills for Status (Open, Answering, In dispute, Closed), Verification (Verified, Unverified), Chain, Type (Binary, Categorical, Multi-categorical, Scalar, Multi-scalar), Sort (Trending, Newest, Volume, Liquidity, Ending soon), each pill opens a small anchored popover (checkbox lists with counts, Apply auto), with active filters shown as removable chips and a "Clear all". Popovers close on outside click and Escape and never cover the filter bar itself.
- Search stays in the header; add `/` shortcut hint (already there) and recent searches.
- Header: keep logo, Markets, Leaderboard, Create Market, Policies, App dropdown, Connect. Make the App dropdown list all Seer products with a tiny animated glyph each and real links (Seer App, Deep, Futarchy, Opportunity Markets, Risk Pricing, Explorer, current marked), same component as the landing header. Remove the Beta banner or make it a single dismissable thin line that stays dismissed.

### B. Trending highlight (replace the strip)
- A "Trending now" module, 2 columns, full width, sitting directly under the stats header:
  - Left (60%): one FEATURED market card, big: question (2 lines max, full text visible), who asks (creator or "Asked on Reality.eth") and category chip, a live probability chart (real series if available else a smooth sample from price history), the leading outcome with its price and 24h change, volume, liquidity, time to resolution, and two clear actions (Trade, View market). It auto-advances every 8s with 5 progress segments and pause on hover; arrows and keyboard supported.
  - Right (40%): "Most traded today" ranked list of 5 rows: rank number, question (one line, ellipsis only if over 70 chars, full text on hover), leading outcome price, 24h change arrow, tiny sparkline. Clicking a row swaps the featured market. "View all" link.
  - Above both: a stats header row (Markets, Total volume, 24h volume, Active traders, Open disputes) in Etherscan style.
- Below that, a horizontal "Ending soon" and "New" rail only if it adds value; otherwise skip.

### C. Tiles (the grid)
- Make tiles roomier and readable without hover. Grid: 3 columns at 1440, 2 at 1000, 1 at 600; min tile height 220; gap 20; padding 20.
- Tile reading order: (1) category chip + status dot (Open, Answering, In dispute, Closed) + verified tick; (2) question in full, up to 3 lines, no truncation with "..." unless 3 lines are exceeded; (3) the two leading outcomes as rows: outcome name (full, wraps), price, thin probability bar; for categorical markets show top 2 and "+N more outcomes"; for scalar markets show a small range dial; (4) footer: volume, liquidity, closes in 12d, star. Nothing else.
- Remove the hatched bar texture and the dual big buttons. Trade actions appear on hover/focus as a bottom slide-in row (Yes / No) so the tile stays calm; touch devices show a single Trade chevron.
- Hover/focus (desktop): tile lifts 2px, border becomes violet, and a compact "peek" panel slides out (or expands in place) with: asked by, resolution source, 7d mini chart, depth/liquidity, last trade, number of traders, a "How to read it" one liner (e.g. "61% means traders collectively price Yashar at 61 cents per share"). Never use native title tooltips.
- Every number tabular, prices in cents with a consistent format, percentages one decimal. Skeleton loading states. Empty state with a message and a "Clear filters" button.

### D. Human / Agent toggle (make it a real mode)
- Segmented control with a sliding indicator. "Agent" switches the whole explorer into an agent-readable view, not just monospace footers:
  - Tiles gain a machine strip: market id (short hash, copy on click), outcome token ids, implied probability to 3 decimals, bid/ask spread, depth at 1 percent, last update age, resolution source (Reality.eth), and an "API" chip that copies the JSON or the endpoint URL.
  - A right-side "Agent console" drawer (toggle) showing the query currently implied by the filters as a JSON/GraphQL snippet with a Copy button and a live response preview (first 3 markets), so builders see how an agent would fetch the same list.
  - Subtle visual change: a thin violet scanline across the top of the page (slow looping), mono labels, grid becomes denser rows with a "table" layout option. Animations small and purposeful (numbers tick, rows highlight on update).
  - A visible mode label ("Agent view") and a one-line explainer.

### E. Market page (detail)
- Fix navigation first: header links, logo and breadcrumbs always work from every route (hash router bug: after visiting Leaderboard, Markets/Create/Home do nothing). Write a Playwright check that clicks every header item from every route and asserts the URL and visible heading.
- Layout like a real market terminal: top: breadcrumb, question title (max 2 lines), meta chips (type, verified, chain, closes in), actions (Share, Star, Answer on Reality.eth). Row 1: left 2/3 = main chart module with tabs (Price, Depth, Volume, Traders) and range chips (1D 1W 1M All), outcome legend with live prices; right 1/3 = sticky trade ticket (Buy/Sell tabs, outcome selector, amount, shares and avg price preview, price impact, fees, balance, one primary action). Row 2: tabs below the chart: About (who is asking, what is priced, how to use the signal, resolution rules and timeline), Outcomes (table with price, 24h change, volume, liquidity), Activity (recent trades), Holders, Dispute and Resolution (Reality.eth answer, bond, challenge window, Kleros status as a clear stepper).
- The "rope" fair-depth visual is a good idea; keep it as one tab or as a small insight card ("Price impact: 5 points per $1.5K") not the page hero.
- Related markets row at the bottom.

### F. Design polish and breathing space
- Spacing scale 4/8/12/16/24/32/48; page gutter 32 at desktop; section gaps 32 to 48; headings in Instrument Serif for module titles (Trending now, Most traded today, All markets), Inter Tight for UI.
- Buttons: same dark pill with slow drifting violet/electric/lavender blobs as the landing for primary actions (Trade, Connect, Create Market); secondary buttons dark with thin border.
- Motion: subtle and meaningful only: number tick on price change, row flash on update, popover fade/slide 120ms, tile hover lift, carousel progress. Respect prefers-reduced-motion.
- Dark mode is default; the theme toggle must work and both themes pass contrast checks.
- Responsiveness: 390px shows a single column, the filter bar scrolls horizontally, the featured module stacks, the ticket becomes a bottom sheet.

## Done means
Screenshots at 1440, 1100, 820, 390 of: home (featured + grid), a filter popover open, tile hover peek, Agent mode, market page, leaderboard, header App dropdown; the Playwright navigation test passing; no console errors; a short list of what changed and any remaining gaps stated honestly.
