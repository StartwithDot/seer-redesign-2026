# Inspiration notes (Explorer). 76 human-made references captured, 13 contact sheets VIEWED (research/inspiration/explorer/sheet-01..13.png)
Blocked/empty (not usable): polymarket.com, kalshi.com (timeouts), predictit (blocked), bloomberg/reuters/etherscan/locomotive (bot walls), behance partial. Etherscan is known from the product reference only, not from a capture.

## Closest vocabulary: dense indexes and explorers (PRIMARY borrow)
- **dexscreener (70, sheet 11)**: edge-to-edge dense table, one row ≈ 24px, sticky columns, price/change cells coloured by sign, many time-window columns (5M 1H 6H 24H), left rail filters. BORROW: row density, change-window columns, colour only for delta. AVOID: orange/green neon, ad slots.
- **geckoterminal (71)**: same grammar with side panels (Trending, Top gainers) above a table. BORROW: small "top movers" strips as ledgers, not tiles.
- **tradingview screener (74, sheet 12)**: column-set tabs (Overview/Performance/Valuation), filter bar of dropdowns, light and quiet. BORROW: column presets as the "view" control; filters as typed query tokens.
- **coingecko / defillama (22,23,52,53)**: sparkline-in-row (7-day), sortable headers, chain filter. BORROW: inline sparkline column (our "Last 7 days" = odds history). AVOID: banner ads, rainbow categories.
- **finviz map (73)**: treemap with area=size and colour=change; strong "whole field at a glance". BORROW (alternate view): a "Map" view where area = liquidity and colour = odds drift; never primary.
- **hacker news (77)**: the density benchmark: 25+ items per screen, only text. BORROW: titles as the main object, grey meta lines.
- **uniswap explore (69)**: tokens table with 1D chart column; clean light mode.
- **hyperliquid trade (76)**: order-book ladder + chart + ticket in one dark frame; mono numerals. BORROW: ladder for pool-balance depth ("Pool Balances" = price ladder, SHARES/TOTAL) and ticket docked beside the chart.
- **gnosisscan/blockscout/etherscan (50,56)**: label : value rows, truncated hashes with copy, latest-blocks/latest-transactions two-column ledgers. BORROW: market page header as key/value block with copyable ids (conditionId, questionId, pool id), "Latest activity" ledger.
- **dune (51)**: plain list of dashboards with star counts. AVOID.

## Prediction-market lists
- **manifold browse (26, 60, sheet 4/10)**: one-line rows: title, trader count, tiny probability bar, "Bet" button; tabs All/Perps/Politics…; filter chips. BORROW: one-line row with inline probability bar (closest to our index). AVOID: chip row as main control.
- **metaculus (27, 61, 78)**: card grid with horizontal bars per outcome inside the card (ranked bars with names on them), left nav of topics. BORROW: ranked, named horizontal bars for multi-outcome fields (direct labelling); topic rail. AVOID: card grid composition.
- **gjopen (79)**: pure text table with sort/filter sidebar (Status, Type, Sort by, Challenges, Tags), pagination. BORROW: left "query" column (state/chain/verification as checklists with counts).
- **oddschecker (83)**: ad-laden odds comparison; only idea: one odds cell per bookmaker. AVOID.
- **app.seer.pm (63)**: the live product: 4-column card grid with donuts. AVOID composition; keep vocabulary (Yes/No, status dot, verified tick).

## Editorial / dataviz grammar (secondary)
- **Our World in Data grapher (03)**: direct end-of-line labels, entity picker with checkboxes and values in the right rail, Table/Map/Line view tabs. STRONG BORROW: view tabs on one dataset (Index / Map / Cards) and direct labels instead of legend.
- **D3 index chart (18)**: lines rebased to 100 at a chosen date with hover. BORROW for "compare markets": rebase odds to the same origin.
- **Streamgraph, beeswarm, bump chart, treemap, circle packing, force graph (13-19)**: techniques for many-outcome fields. Beeswarm fits 70-outcome markets (one dot per outcome on a 0-100% axis, labelled top 5); bump chart for leaderboard rank change. AVOID decorative use.
- **Pudding, FlowingData, Information is Beautiful, FT visual vocabulary, Datawrapper (01,05-08)**: annotation on data, serif headlines over charts. BORROW: serif/mono contrast for editorial headings only where data is explained.

## Award/studio sites (galleries 37-47, linear, vercel, raycast, framer, rive, lusion, igloo, basement)
- Linear/Raycast: near-black surfaces, tiny type, restrained purple/red accent. BORROW: command-palette-style global search (⌘K) as the primary navigation for 2,947 markets; keyboard-first rows.
- Lusion/Igloo/basement/rive: 3D/WebGL showpieces. AVOID for Explorer (a data tool, not a brand site); use at most a restrained canvas for the signature visual.
- Dribbble "prediction market"/leaderboard (43-45): mostly dashboard-card slop. AVOID (confirms the slop pattern to escape).

## Decisions fed to Phase D
1. Primary surface = dense ledger (rows ~28px), one-line markets with inline odds bar + named top outcomes + liquidity + status + sparkline; query column on the left (OWID/GJOpen/Dexscreener hybrid).
2. View tabs on the same dataset: Ledger (default) / Map (finviz-style) / Cards (EF kit patterns) — resolves the card-grid tension.
3. Market page: chart + ticket docked side by side (Hyperliquid), key/value ledger of ids (Etherscan), outcomes as ranked named bars (Metaculus), pool depth ladder.
4. ⌘K search/command palette (Linear) across markets, outcomes, collections, addresses.
5. Leaderboard as ranked ledger with rank-change marks (bump idea), Trader Score as a typographic mark, not a badge.
