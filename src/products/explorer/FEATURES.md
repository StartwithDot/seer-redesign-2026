# Explorer Feature Inventory

## Global Shell, Navigation, And Wallet
- [x] F001 Beta notice with per-session dismissal — `Footer / Beta notice`
- [x] F002 Seer wordmark and brand links returning to the market index — `Global Shell / Header`
- [x] F003 Product navigation with active Markets state; Leaderboard in index and command search; Create Market opens a modal — `Header + Index + Search`
- [x] F004 Seer product switcher and footer links for Explorer, Deep, Futarchy, Opportunity, and Risk — `Global Shell / Product Nav + Footer`
- [x] F005 Policies menu with Verified Market Policy and Market Rules Policy — `Global Shell / Header Popover`
- [x] F006 Policy route plates with Open in Seer app and Markets return links — `Policy Record`
- [x] F007 App menu links to Futarchy, Deepfunding, Foresight, and Opportunity Markets — `Global Shell / App Popover`
- [x] F008 Connected account menu with Account, Deposit, Portfolio, Market Collections, and Trade Collateral — `Global Shell / Account Popover`
- [x] F009 Use smart account switch with persisted state — `Global Shell / Account Popover`
- [x] F010 Connected wallet fields: chain icon, truncated address, and xDAI balance — `Global Shell / Wallet`
- [x] F011 Disconnected Connect state without address or balance — `Global Shell / Wallet`
- [x] F012 Mock-wallet connect flow, wallet address copy, and honest rejected-signing state — `Wallet Sheet`
- [x] F013 Wrong-chain state and Switch to Ethereum, OP Mainnet, Gnosis, or Base action — `Trade + Quick Buy`
- [x] F014 Light and dark themes with persisted selection and content-preserving transition — `Global Theme`
- [x] F015 Five-step guided tour with focus restoration, reachable from command search and mobile navigation — `Global Help`
- [x] F016 Command palette for markets, outcomes, collections, and free-text search — `Global Search Overlay`
- [x] F017 Search by market, outcome, or collection with debounced `marketName` URL state — `Global Search + Index`
- [x] F018 Mobile navigation sheet containing every primary route, menu, help, wallet, and CTA — `Mobile Shell`
- [x] F019 Desktop, tablet, and mobile layouts with no horizontal overflow and real mobile trade controls — `Responsive Shell`
- [x] F020 Keyboard navigation, focus-visible states, tooltips, dialog focus traps, and Escape handling — `All Screens`
- [x] F021 Deep links, Back/forward support, route-keyed market pages, and restored scroll position — `Global Router`
- [x] F022 External links to chain explorers, Kleros curation, Reality.eth, Swapr, bridge, farming, docs, and live Seer app — `Link Layer`
- [x] F023 Not-found and not-in-sample route states with Markets and Open in Seer app recovery links — `Error Plate`
- [x] F024 Global loading, empty, error, pending, and disabled-control feedback — `All Screens`

## Information Finance Layer
- [x] F025 Compact Asked by, Priced, and How to use explanation — `Index / Signal Primer`
- [x] F026 Market creator or asker identity with address fallback — `Index Card + Market Record`
- [x] F027 Categorical, Multi Categorical, Scalar, Multi Scalar, Futarchy, and conditional market coverage — `Index + Market Record`
- [x] F028 Conditional parent question, parent outcome, parent link, and parent-token collateral explanation — `Index Card + Market Record`
- [x] F029 Lifecycle actions for create, verify, buy/sell, mint/merge/redeem, report, dispute, resolve, and provide liquidity — `Create + Trade + Resolution`
- [x] F030 Reality.eth oracle and Kleros dispute/verification context and outbound records — `Resolution + External Links`

## Market Index
- [x] F031 Compact diagonal split stage, question-to-outcome SVG with GSAP and a continuous market-image marquee — `Index / ExplorerStage`
- [x] F032 Trending-market navigation, manual motion pause, hover/focus pause, offscreen pause and reduced-motion fallback; quick buy in rows — `Stage + MarketTable`
- [x] F033 All markets, Trending, Ending soon, and New market views — `Index / View Tabs`
- [x] F034 Cards and compact table/index view toggle for Etherscan-like scanning — `Index / View Switch`
- [x] F035 Dense default table with photos/initials, asker profile, priced signal, type, top outcome, volume, liquidity, resolution, chain, verification and historical sparkline; stacked rows on mobile; optional existing cards — `Index / MarketTable`
- [x] F036 Infinite loading or pagination of large market sets without layout jumps — `Index / Market Board`
- [x] F037 Market avatar, full question, two-line clamp, tooltip, and creator line — `Index Card`
- [x] F038 Binary outcome distribution with exact percentages and distinct Yes/No colors — `Index Card / Outcome Instrument`
- [x] F039 Scalar market estimate, unit, bounds, and Up/Down actions — `Index Card / Scalar Instrument`
- [x] F040 Multi-outcome ranked bars with names, percentages or estimates, top-two Buy controls, and +N more — `Index Card / Multi Instrument`
- [x] F041 Closed or resolved card state showing the winning outcome — `Index Card`
- [x] F042 Four verification marks for Verified, Verifying, Challenged, and Not Verified with distinct shapes and tooltips — `Index Card`
- [x] F043 Star/favorite toggle for a market collection — `Index Card + Market Record`
- [x] F044 Volume, status, and +N outcome count in the card footer — `Index Card`
- [x] F045 Whole-card navigation while buy, star, marks, drawer actions, and links stop propagation — `Index Card`
- [x] F046 Hover, focus, and touch-pinned details drawer that overlays without reflowing the grid — `Index / Card Drawer`
- [x] F047 Drawer status, liquidity, market type, and chain explorer link — `Index / Card Drawer`
- [x] F048 Drawer Kleros verification link, Reality.eth link, rewards state, conditional parent, and resolution date — `Index / Card Drawer`
- [x] F049 Drawer open-interest and liquidity breakdown with volume, notional, and per-outcome pool balances — `Index / Pool Popover`
- [x] F050 Topic selector with every catalog subject, URL state and removable filter tag — `Index / Topic selector`
- [x] F051 Market-type filters for Categorical, Multi Categorical, Scalar, Multi Scalar, Futarchy, and conditional markets — `Index / Filter Drawer`
- [x] F052 Market States filter: All, Reports not open yet, Reports open, Waiting for answer, In Dispute, Pending execution, Closed — `Index / Filter Drawer`
- [x] F053 Verification Status filter: All, Verified, Verifying, Challenged, Not Verified — `Index / Filter Drawer`
- [x] F054 Chain filter: All, Ethereum, OP Mainnet, Gnosis, Base — `Index / Filter Drawer`
- [x] F055 Sort by Default, Liquidity, Volume, Open Interest, Opening Date, or Creation Date — `Index / Filter Drawer`
- [x] F056 Descending and ascending sort direction — `Index / Filter Drawer`
- [x] F057 Conditional Market, Rewards, and Futarchy-only switches — `Index / Filter Drawer`
- [x] F058 Minimum Liquidity numeric filter with dollar prefix and non-negative input — `Index / Filter Drawer`
- [x] F059 Filter counts and staged Cancel/Apply behavior — `Index / Filter Drawer`
- [x] F060 Applied search, sort, and filter state mirrored in shareable URLs — `Index / URL State`
- [x] F061 Removable active-filter tags, overflow count, and Clear filters action — `Index / Active Tags`
- [x] F062 Result count and no-results empty state with filter recovery — `Index / Toolbar`
- [x] F063 Quick-buy outcome and price selection from every card type and the trending strip — `Index / Quick Buy`
- [x] F064 Quick-buy custom amount input, pay token, You will get, and Pays-if-it-wins quote — `Index / Quick Buy`
- [x] F065 Quick-buy Connect, wrong-chain, Enter an amount, Not enough balance, pending, and rejected-request states — `Index / Quick Buy`
- [x] F066 Quick-buy outside-click, Escape, close, focus-return, and Open trading page link — `Index / Quick Buy`

## Market Record
- [x] F067 `#/markets/:chainId/:slug` route with breadcrumb, Back, and Home links — `Market Record / Header`
- [x] F068 Status strip and lifecycle labels including Reports open, Trading Open, and Pending execution — `Market Record / Header`
- [x] F069 Conditional Market banner with parent link and worthless-token warning — `Market Record / Banner`
- [x] F070 Unverified-market warning with caution copy and Verify it link — `Market Record / Banner`
- [x] F071 Avatar, full question, literal placeholders, and headline hierarchy — `Market Record / Header`
- [x] F072 Verification mark, collection star, and Answer on Reality.eth action — `Market Record / Header`
- [x] F073 Meta fields: SEER mark, type, liquidity, volume, open interest, P&L, and verification — `Market Record / Meta`
- [x] F074 Liquidity and open-interest tooltips with pool-price caveat and per-outcome breakdown — `Market Record / Meta`
- [x] F075 Scalar Market Estimate, unit, numeric bounds, and resolution-opening timestamp — `Market Record / Scalar Summary`
- [x] F076 Multi-scalar question list with answer state, deadline, Reopen question link, and Hide/Show questions — `Market Record / Scalar Summary`
- [x] F077 Price-history ranges 1D, 1W, 1M, All, and Custom — `Market Record / Chart`
- [x] F078 Custom range presets Today, Last Week, Last Month, and All with calendar selection — `Market Record / Chart Popover`
- [x] F079 Calendar month navigation, date grid, Cancel, and Save — `Market Record / Chart Popover`
- [x] F080 Step-line chart for categorical outcomes and bounded estimate chart for scalar markets — `Market Record / Chart`
- [x] F081 Honest axes, units, time ticks, direct end labels, top-three series, and rest-series treatment — `Market Record / Chart`
- [x] F082 Hover and keyboard crosshair with timestamp and current top-outcome values — `Market Record / Chart`
- [x] F083 Zoom to data and previous/next range navigation with declared scale — `Market Record / Chart`
- [x] F084 CSV export of visible timestamp and outcome series — `Market Record / Chart Utility`
- [x] F085 No-price-history state with current odds shown as direct labels — `Market Record / Chart`
- [x] F086 Outcome rows with rank, avatar, name, probability bar, percent or estimate, and Invalid handling — `Market Record / Outcomes`
- [x] F087 Outcome radio selection synchronized with chart isolation and trade ticket — `Market Record / Outcomes`
- [x] F088 Outcome search and Show all for many-outcome markets — `Market Record / Outcomes`
- [x] F089 Keyboard Up/Down outcome navigation and selected-row emphasis — `Market Record / Outcomes`
- [x] F090 Add Liquidity, View/Hide pool details, and New conditional market actions — `Market Record / Outcome Actions`
- [x] F091 Pool Id, copy action, explorer link, liquidity chart, pool balances, SHARES/TOTAL ladder, and Last price — `Market Record / Pool Inspector`
- [x] F092 Add Liquidity dialog with farming copy, Swapr pool rate, reward end state, external action, learn-more link, and Return — `Liquidity Dialog`
- [x] F093 Major Events count and rows with UTC date, title, and description — `Market Record / Events`
- [x] F094 Market, Condition Id, Question Id, Collateral, and Creator records with copy and explorer links — `Market Record / IDs`
- [x] F095 Comments, Related Conditional Markets, Top Holders, and Activity tabs with keyboard navigation — `Market Record / Tabs`
- [x] F096 Comment gate, textarea when connected, connect/sign states, empty copy, and share-your-take flow ��� `Market Record / Comments`
- [x] F097 Related conditional-market search, count, status, parent/outcome copy, market links, and Reality.eth links — `Market Record / Related`
- [x] F098 Per-outcome holder tables with account/address links and formatted balances — `Market Record / Holders`
- [x] F099 Activity ledger with My activity filter, action, amount, outcome, timestamp, and transaction links — `Market Record / Activity`
- [x] F100 Ticket header with selected outcome avatar, name, current price, and Market order type — `Market Record / Trade Ticket`
- [x] F101 You pay amount, pay-token select, balance, and Max control — `Market Record / Trade Ticket`
- [x] F102 You will get rounded output, receive-outcome selector, and exact share value with copy — `Market Record / Trade Ticket`
- [x] F103 Average price, price after buy, potential return, quote-loading skeleton, and max-slippage setting — `Market Record / Trade Ticket`
- [x] F104 Trade CTA state machine: Market closed, Connect, Switch chain, Enter an amount, Not enough balance, Approve/Trade, pending, and rejected — `Market Record / Trade Ticket`
- [x] F105 Bridge-tokens link for low collateral balances — `Market Record / Trade Ticket`
- [x] F106 More disclosure with Mint, Merge, and Redeem modes, amount, balance, collateral select, and action states — `Market Record / Advanced Trade`
- [x] F107 Report Answer dialog with recorded xDAI bond, current answer, answer select, invalid option, Return, and Answer — `Resolution Dialog`
- [x] F108 Mobile floating Trade action and bottom sheet with Trade, Mint, Merge, and Redeem tabs — `Mobile Trade Sheet`
- [x] F109 Buy/sell and position economics across binary, categorical, scalar, multi-outcome, futarchy, and conditional markets — `Trade Ticket`

## Leaderboard
- [x] F110 Profit & Loss Leaderboard heading and Trader Score explanation — `Leaderboard / Header`
- [x] F111 How it works link to Seer leaderboard documentation — `Leaderboard / Header`
- [x] F112 Period controls 1D, 1W, 1M, and ALL — `Leaderboard / Controls`
- [x] F113 App filters for All, Foresight, Opportunity Markets, and Deepfunding — `Leaderboard / Controls`
- [x] F114 Chain filters for All, Ethereum, OP Mainnet, Gnosis, and Base — `Leaderboard / Controls`
- [x] F115 Your Rank lookup with finding, found, and no-account states — `Leaderboard / Controls`
- [x] F116 Search by username or address with Search action and clear-search recovery — `Leaderboard / Controls`
- [x] F117 Rank, Account, Score, Profit/Loss, Volume, ROI, and Traded Markets columns — `Leaderboard / Table`
- [x] F118 ENS, generated pseudonym, avatar, and address tooltip identity formats — `Leaderboard / Table`
- [x] F119 Trader Score value and ELITE, GREAT, GOOD, or N/A tier — `Leaderboard / Table`
- [x] F120 Score anatomy popover with Returns, Profit factor, Hit rate, Loss burn, Breadth, and sample shrink — `Leaderboard / Score Popover`
- [x] F121 Score and ROI unavailable explanations — `Leaderboard / Table`
- [x] F122 Sortable Score, Profit/Loss, Volume, and ROI columns with direction and accessible sort state — `Leaderboard / Table`
- [x] F123 Previous/Next pagination, page counter, sort descriptor, and update timestamp — `Leaderboard / Footer`
- [x] F124 Updating skeleton, empty results, error plate, Retry, and disconnected table state — `Leaderboard / States`

## Create And Collections
- [x] F125 Create Market modal and legacy creation route; connect at review, with honest live-app deployment handoff — `Create Market`
- [x] F126 Step 1 Type choices: Categorical, Scalar, Multi Categorical, and Multi Scalar with real examples — `Create Market`
- [x] F127 Three-step draft: answer type, validated question/rules/deadline and outcomes or bounds, review with copyable JSON; no deployment or signature simulated — `Create Market`
- [x] F128 Conditional-market prefill from parent market and outcome — `Create Market`
- [x] F129 SECURED BY KLEROS footer and Kleros link — `Create Market`
- [x] F130 Default collection route, sign-in gate, signing state, and rejected-request feedback — `Collections`
- [x] F131 Persistent starred markets with cross-tab storage updates — `Collections / Data Utility`
- [x] F132 Collection empty state, saved market grid, and card quick-buy access — `Collections`

## Data, States, Theme, And Utilities
- [x] F133 Market identity data: id, chain, slug, question, creator, factory, creation transaction, template, and raw record — `Data Adapter / Market Record`
- [x] F134 Market metrics: liquidity, volume, traded notional, open interest in USD and collateral, rewards, and P&L — `Data Adapter / Index + Market Record`
- [x] F135 Outcome data: names, images, odds, leading outcome, scalar values, wrapped tokens, and Invalid token value — `Data Adapter / Outcome Instruments`
- [x] F136 Pool data: outcome/collateral symbols and balances, pool id, ticks, price, and liquidity ladder — `Data Adapter / Pool Inspector`
- [x] F137 Chart history data: timestamp, outcome, percent or estimate, bounds, unit, and range — `Data Adapter / Chart`
- [x] F138 Event, comment, holder, and activity records with their empty states — `Data Adapter / Market Tabs`
- [x] F139 Leaderboard request and response data: period, app, chain, sort, direction, offset, rows, pages, total, and updatedAt — `Data Adapter / Leaderboard`
- [x] F140 Wallet data: address, chain, collateral balances, reverse lookup, and mock wallet list — `Data Adapter / Wallet`
- [x] F141 Shared number, money, percent, token, address, and timestamp formatting — `Data Formatting`
- [x] F142 Real captured API fixtures with consistent ids, units, rounding, and deterministic sample clock — `Data Adapter`
- [x] F143 Status and verification taxonomies preserved exactly across cards, filters, banners, and records — `Semantic Data Layer`
- [x] F144 Designed loading, empty, no-history, error, closed, ended, disconnected, wrong-chain, and rejected states — `All Screens`
- [x] F145 EF light/dark tokens with neutral Explorer palette, semantic outcome colors, status colors, and contrast checks — `Global Theme`
- [x] F146 Reduced-motion behavior, rolling numbers, chart interaction motion, and non-decorative transitions — `Global Motion`
- [x] F147 Responsive touch targets, semantic controls, focus management, tabular numerals, and accessible names — `All Screens`
- [x] F148 Copy address, copy ids, copy exact quote, CSV export, collection persistence, and shareable URL utilities — `Utility Layer`
- [x] F149 Query/filter/range/tab/outcome URL state and Back/forward restoration — `Utility Layer / Router`
- [x] F150 Optional current display clock plus deterministic test hooks without fake wallet signing — `Developer Utility`

## Step 3 Parity Additions
- [x] F151 Recent-markets view backed by browser-local record history — `Index / View Tabs`
- [x] F152 Distinct EF card treatments for micro binary, single binary, three-way, head-to-head, and live Up/Down markets — `Index / Outcome Instruments`
- [x] F153 Keyboard-focusable chart help explaining that history shows pool estimates, not completed trades — `Market Record / Chart`

## Step 3 Audit Result
- Audited 153 checked items through the reachable import graph, route renders, component inspection, data checks, and static control inspection. Remaining unchecked: 0.
- Reconciled the legacy Explorer and requirements again. Added Recent markets, five distinct EF card treatments, and chart help to the inventory and reachable UI.
- Imported the prepared audit layout rules, bounding the main board and record evidence while enforcing 5 columns at 1440, 6 at 1920, and 2 at 390.
- Repaired captured activity with missing outcome tokens and removed non-finite scalar/chart geometry from captured records.
- Removed two unreachable duplicate files: `components/MarketParentContext.tsx` and `data/sampleMarkets.ts`.
- Browser screenshots remain unavailable in this sandbox because Vite port binding returns EPERM and headless Chrome exits 134. Static layout gates and production compilation pass, but this does not replace real-browser visual QA.

## NEW INFORMATION ARCHITECTURE
1. `Global Shell`: beta notice, compact header, search/command palette, product menus, help, theme, wallet, and mobile sheet.
2. `#/` Market Index: one job is finding a market fast; slim trending strip, compact category rail, view switch, filter drawer, active tags, then the market board.
3. Cards remain the primary browsing object: type-aware outcome instruments make binary, scalar, multi-outcome, futarchy, and conditional markets legible at a glance.
4. A compact table alternative supplies Etherscan-like scanning without turning the product into a generic dashboard.
5. Card interactions stay layered: whole card opens the record, Buy opens quick-buy, star saves, marks explain, and details open a drawer or pool popover.
6. `#/markets/:chainId/:slug` Market Record: one job is understanding and acting on one market; identity and signal first, then chart, outcomes, record data, and evidence.
7. The record uses tabs/drawers for Events, IDs, Comments, Related, Holders, and Activity so the primary screen stays within two viewports.
8. The sticky trade ticket remains visible beside the record on desktop and becomes a bottom sheet on mobile.
9. `#/leaderboard`: one job is comparing traders; controls stay in one row and the ranked table remains the dominant object.
10. `#/create-market`: one job is choosing the market type; later work is honestly gated or linked to the live app.
11. `#/collections/default`: one job is managing saved markets; sign-in state, empty state, and the same card interactions remain reachable.
12. Popovers hold explanations and precise values; dialogs hold report, liquidity, and wallet actions; drawers hold filters and dense secondary data.
13. Every screen has first-class light and dark themes, explicit loading/empty/error states, keyboard access, and mobile behavior.
14. Creative idea: the **Trading Board** turns each market into a compact price-to-payout instrument, then expands it into an Etherscan-like market record.
15. The signature interaction connects price to consequence: select an outcome, see its exact chance, type an amount, and watch the payout value resolve.
16. Binary cards use a calibrated tug bar, scalar cards use an estimate/range instrument, and multi-outcome cards use directly labelled ranked bars.
17. This preserves the user-chosen prediction-market card language while replacing donuts, decorative charts, and Polymarket-style feed sameness with precise linked records.
18. Cross-links connect question, creator, condition, question id, collateral, pools, holders, transactions, Reality.eth, Kleros, and chain explorers.
19. The result is fresh because the market is the instrument and the explorer record is the evidence trail, not a reskinned trading feed.

## Build pass 6 implementation notes
- Trade quotes use a clearly labelled local logarithmic pricing illustration, not an executable pool quote. Slippage, output, price impact, exact-copy output, buy/sell inputs, and mobile trading modes are reachable.
- F104, F106, F107, and F109 remain unchecked: approval/allowance reads, collateral balances, complete-set holdings, current oracle answers/bonds, and scalar settlement economics still need live adapters. Their review surfaces reject submission honestly and do not sign.
- F111 remains unchecked: the documentation action currently opens the general Seer documentation, not a verified leaderboard-methodology page.
- Leaderboard filters, search, sorting, rank lookup, score breakdown, and pagination operate on an explicitly labelled sample settlement ledger. No sample results are represented as live performance. F142 remains unchecked.
- F124 remains unchecked: empty and disconnected states work, but an async updating/error/retry data source is not implemented.
- Verification: Explorer TypeScript and its isolated Vite production build pass; quote and leaderboard data checks pass. Browser QA could not run because this sandbox blocks port binding and Chrome aborts on launch.

## Build pass 7 implementation notes
- Completed F124–F132, F137, F138 (11 newly checked items). Account sessions are local; signing does not imply a backend account sync service.
- Creation starts with no type selected, gates type selection on connection, explains four supported types, disables Next until valid, and exposes an honest step-2 handoff. Conditional drafts preserve the selected outcome and parent chain, validate the link, show the parent question and collateral risk, and link back to its record. Kleros context is reachable.
- Collection stars now use one validated browser store across index, record and collections, with same-tab and cross-tab updates, empty states and quick-buy. Unknown saved identifiers are preserved. Browser wallets can sign a scoped local-session message; preview wallets reject without creating a signature. Account changes invalidate pending session results. Browser-local saves remain browsable without a signature; server sync is explicitly unavailable.
- Leaderboard reads a labelled local JSON fixture through cancellable HTTP requests. Loading skeletons, source errors, retry, validation errors, empty search and disconnected browsing are reachable. It remains sample performance, not captured API data.
- History uses deterministic UTC samples shared across ranges. Scalar history and CSV contain estimates rather than Up/Down share prices. Future/reversed ranges cannot invent data, values respect bounds, categorical values sum to 100%, and the final sample matches displayed values. No-data custom ranges offer recovery.
- Evidence panels label sample records, support missing holder/activity data, and match My activity against the actual connected address instead of a hard-coded flag.
- Reviewed the first 20 open items. F104/F106/F107/F109 remain blocked by missing deployed sample identifiers, executable quotes, allowances, complete-set balances and oracle reads. F111 stays open: no leaderboard-specific official documentation URL could be verified. F133–F136 remain open: captured factory/creation/template, collateral exchange-rate, wrapped-token and pool records are unavailable. No substitute records were fabricated to tick them.
- Validation: `node src/products/explorer/checks/pass7.mjs`, Explorer `npx tsc --noEmit -p src/products/explorer/tsconfig.json`, and isolated Vite production build. Local HTTP/browser QA is blocked by sandbox EPERM on port binding; no screenshots from this pass are claimed.

## Build pass 8 implementation notes
- Completed F140, F141, F143-F150 (10 newly checked items); 10 items remain unchecked.
- Wallet identities now satisfy the declared model. Native and collateral balances carry chain, symbol, precision and sample/wallet origin. Read-only ERC20 calls verify symbol/decimals before accepting balances; unavailable reads stay unavailable. Preview balances are asset/chain-specific. Wallet details and account pages show balances, contract links and refresh. Ethereum ENS reverse names are forward-confirmed; unsupported records fall back to addresses. No approval or transaction target is inferred from these read-only assets.
- Formatting handles unavailable numbers/dates consistently, preserves token units and negative compact values, and uses UTC timestamps. Semantics share exact market-state/type/verification labels across filters, cards, lifecycle, record and marks.
- Catalog HTTP loading supports cancellation, timeout, invalid/missing/duplicate records, error and retry. Closed quick-buy, ended reward, unavailable-balance, scalar maximum-payout and conditional settlement states are explicit. Fixed stale quote timers and quote/chain/account changes.
- Both themes use the landing's white/charcoal canvases, with separate violet text/action tokens and tested 4.5:1 contrast. Focus traps survive rerenders, trap stacked dialogs, restore focus, lock background scrolling and use unique dialog IDs. Outcome radios have keyboard movement; controls have larger touch targets, semantic names and tabular numbers. Actual mobile layout still requires browser verification.
- Rolling quote output respects reduced motion. Footer current-time mode is optional and explicitly leaves sample odds unchanged; snapshot time remains deterministic. `?explorerClock=<UTC ISO timestamp>` fixes the displayed clock for QA. No wallet signing is simulated.
- Copy/CSV/save utilities remain reachable. CSV escaping includes carriage returns and download URLs are released after the click. URL filters, pagination, record range/tab/outcome/pool and popstate restoration work; draft search cannot overwrite a navigated URL. Dense source/event/lifecycle data uses disclosures, with raw-record copying and exact sample metrics.
- F104/F106/F107/F109 remain open: executable quotes, allowances, complete-set holdings and verified oracle settlement reads are absent. F111 stays open because leaderboard-specific official documentation could not be verified; the general link is honestly named Seer documentation. F133-F136/F142 remain open: local identifiers, wrapped tokens, pool ladders and API fixtures are illustrative, not captured deployed records. Null fields are exposed instead of replaced with fabricated contracts/transactions.
- Validation: pass 7 and pass 8 checks, 64 route/state renders, Explorer TypeScript, and isolated Vite production build. Browser QA is blocked by sandbox port EPERM and Chrome exit 134. No new browser screenshots are claimed.

## Current build pass: captured market integration
- Completed F133, F135 and F142 (3 newly checked items). 7 items remain open. The existing shell, theme and router were retained.
- Two independently collateralized categorical records from the existing API captures now appear first in the index, search, collections and deep links. Factory, creation transaction, template, creator, wrapped tokens, outcome imagery and unrounded USD metrics preserve captured values. Missing odds, P&L, exchange rates and capture timestamps are explicitly unavailable. The deterministic evaluation clock is not presented as a capture timestamp.
- A separate captured-pool inspector supports pool selection, reserve units, token addresses, contract links and raw liquidity. Missing pools and tick ladders have explicit states. Token quantities are never added as dollar totals. F136 remains open because the captured tick files belong to conditional pools outside the admitted independent-market adapter.
- Captured records never use illustrative history, events, holders, activity or generated related markets. Existing event captures are used where present. Trading remains unavailable without executable quotes and verified contract actions; no transaction or wallet rejection is simulated for a captured record.
- F104, F106, F107, F109 remain open for executable trading/oracle integration. F111 remains open for a verified leaderboard documentation destination. F134 remains open for collateral exchange rates and account P&L. F136 remains open for complete pool/tick integration.
- Validation: pass 7, extended pass 8 with capture consistency and 72 route/theme/account renders, scoped TypeScript and isolated Vite production build. Browser QA could not run: local port binding returns EPERM. Landing screenshots land_d0 through land_d6 are blank in this checkout; landing CSS supplied the visual reference. No changes to src/seer-2026 or shared product files.


## Build pass 2: remaining integration batch
- Completed F136 (1 newly checked item); 6 items remain unchecked. The inventory had only 7 unchecked items at the start of this pass.
- Admitted the two captured categorical conditional markets only after matching each collateral address to a wrapped outcome of its captured independent parent. Parent question, selected outcome, token symbol, and navigation preserve this relationship. Existing captured market and outcome imagery is retained.
- Pool inspection now reaches the four captured conditional pools and their tick records. Pool price is derived from Q96 square-root price with token-decimal adjustment and correct collateral orientation. Missing reserve captures remain unavailable.
- The focused liquidity ladder uses exact BigInt arithmetic, anchored at captured active liquidity. Current interval, empty-interval toggle, raw gross/net records, precise price tooltip, token contracts and pool copy actions are reachable. Captures are explicitly incomplete snapshots, never executable depth or quotes.
- F104/F106/F107/F109 remain unchecked because executable quotes, verified allowance/action contracts, complete-set holdings and oracle transaction integration are absent. F134 remains unchecked for collateral exchange rates and account P&L. F111 remains unchecked because a leaderboard-specific official documentation destination could not be verified.
- Validation: scoped TypeScript clean, pass 7 checks, extended pass 8 checks with 80 route/theme/account renders, and isolated Vite production build. Live browser QA is blocked by local server binding EPERM; no screenshots are claimed. Viewed landing screenshot land_d0 is blank; landing CSS supplied the available visual language. No shared or landing source files changed.

## Build pass 3: remaining integration review
- Completed F111 (1 newly checked item); 5 items remain unchecked. Only six unchecked items existed at the start of this pass.
- Verified the official documentation index at https://docs.seer.pm/llms.txt and the leaderboard scoring section at https://docs.seer.pm/developers/api#trader-score. The reachable How it works action now opens that specific methodology reference. The standalone app/leaderboard page could not be fetched, so the link uses the verified API reference.
- Reviewed F104/F106/F107/F109/F134 against the existing captured records and official API documentation. Executable quotes, verified transaction adapters, complete-set holdings, current oracle reads, collateral rates and market account P&L are still unavailable in this checkout. These items remain unchecked. Shell DNS cannot resolve the live app; no new API capture or successful live integration is claimed.
- Corrected redemption gating until settlement, reporting gating independently of trading status, stale report-answer selection on reopening, unavailable sell holdings falling back to collateral balances, and missing advanced collateral balances. Removed synthetic signing rejection from trade review and quick buy. Quick buy explicitly reviews a sample estimate and hands off to the live app. No approvals, transactions or wallet rejections are simulated by these controls.
- Source metrics now honor explicitly provided collateral open interest before considering an exchange-rate conversion; invalid or non-positive rates cannot trigger a conversion.
- Validation: pass 7 checks, pass 8 checks (80 static route/theme/account renders), scoped TypeScript and isolated production build. Browser QA remains blocked by local port binding EPERM. No new browser screenshots are claimed. Landing reference land_d0 is blank; landing CSS supplied the visual language. No shared or landing source files changed.


## Build pass 4: position data dependency
- Newly checked: 0. Remaining unchecked: 5 (F104, F106, F107, F109, F134). The inventory contained five unchecked items, rather than twenty.
- Added a reachable Your outcome holdings disclosure to captured-market tickets on desktop and mobile. Connected browser wallets can read actual wrapped ERC20 outcome balances and refresh them. Preview accounts cannot read live holdings.
- Reads validate the active account and chain before and after fetching, pin balance and precision calls to one block, time out, preserve partial failures as unavailable, and discard stale UI results. Exact BigInt quantities and mixed-decimal minimum balances avoid floating-point loss. Copy actions preserve all digits.
- The minimum balance is labelled as an inventory measure, not merge eligibility. Unwrapped positions, executable buy/sell routes, verified mint/merge/redeem contracts, current oracle state, USD rates and cost basis remain unavailable. No signature or transaction is constructed. These partial dependencies do not justify checking the five remaining feature items.
- Validation: new position data checks, pass 7, pass 8 (80 static route/state renders), scoped TypeScript and isolated Vite production build passed. Local browser verification remains blocked by port binding EPERM. No shared or landing files changed.

## Build pass 5: collateral balance dependency
- Newly checked: 0. Remaining unchecked: 5 (F104, F106, F107, F109, F134). Only five unchecked items existed at the start of this pass.
- Extended the captured-market holdings inspector with exact collateral balances, including conditional parent-outcome collateral. Collateral and outcome token balance/precision reads use the same block and validate the wallet account/network before and after fetching. Unknown contracts and failed reads remain unavailable independently of successful outcome reads.
- Added reachable Connect, browser-wallet selection and switch-network controls inside the inspector. Collateral and outcome rows expose chain-specific contract links, exact amounts and copy actions. No collateral quantity is inferred from native balances, converted to USD without a rate, or presented as an allowance or mint quote.
- Extended position checks for collateral contract selection, missing contracts, mixed decimals and independent read failures. Position checks, pass 7, pass 8 (80 route/state renders), scoped TypeScript and isolated Vite production build pass.
- F104/F106/F107/F109 remain open for verified executable quotes/actions, complete-set contract integration and live oracle state. F134 remains open for verified collateral USD rates and account cost basis/P&L. No simulated approval, signing or transaction was added.
- Visual QA remains blocked by local server binding EPERM at 127.0.0.1:5191. Viewed landing reference land_d3 is blank; landing CSS supplied the visual language. Referenced root docs are absent from this checkout. No shared or landing source files changed.


## October 2026 Explorer redesign
- Default dark theme and complete light tokens; persists `seer-theme`. Standalone preview initializes before paint. Shared HTML integration is prepared in `INTEGRATION.patch` and requires scope approval.
- Product header, searchable command palette (`/` or Cmd/Ctrl K), primary creation modal, wallet state, product links and theme toggle.
- Stage is 258px on desktop and 276px on mobile. One question fans into five answer structures. Diagram prices are explicitly examples. Trending uses captured market images with initial-based fallbacks; no screenshot imagery is reused.
- Nine semantic market-type chips, the original multi-select filter drawer, immediate lifecycle/verification/chain/sort/direction/liquidity/rewards/conditional controls, topic selection, active tags and clear-all. Deep/AI, Opportunity and Risk are semantic catalog subsets, not invented on-chain types.
- Default table paginates 20 records. Existing card instruments remain available in Cards view. Captured and sample origin is visible on each row. Sparklines use existing history and independent scales, with an unavailable state.
- Visible Asked by / Priced / How to use strips in index and record. Human/Agent reader switches expose documentation and copyable snapshot record examples.
- Record tabs: Overview, Activity, Positions, Liquidity, Resolution, Community. Charts, range controls/CSV, outcomes, pools, source/raw values, oracle lifecycle, conditional relationships, comments and holders remain reachable. Desktop ticket is sticky; mobile uses the existing bottom-sheet ticket.
- Contract links appear only for actual address-shaped identifiers; sample identities are preserved under source details.
- Existing hash deep links are preserved. Canonical `/explorer/market/<id>` mapping is implemented within Explorer; the shared router change is pending scope approval.
- Validation: scoped TypeScript, isolated Vite build, wallet/position checks, history/conditional checks and expanded static route/filter/state checks. Browser viewport/dead-control verification remains unverified: local Vite bind returns EPERM and Chrome launch aborts in the sandbox. No new screenshots are claimed.
- Asset search covered original previews, product data, research, kit and the supplied UI design directory. No reusable standalone market photos were found there. Existing captured image URLs remain in use; remote download failed DNS resolution, so no local image copies are claimed.

### October 23 QA repairs
- Render failures inside Explorer expose a reload action; trending has bundled startup content and stable ordering for unavailable volume.
- Trending/new/ending sort direction is honored. Chart and metric help support click toggles.
- Responsive index rows retain asker, priced signal and resolution information. Verification tooltips remain visible; primary compact controls have 40px targets.
- Canonical detail reload integration still requires the shared router change documented in INTEGRATION.patch. Browser viewport verification remains blocked by sandbox process/network restrictions; source and render checks do not establish visual parity.

## Final screenshot/spec QA corrections
- Stage pause now controls the question fan and marquee together; visibility changes preserve manual pause.
- Quick-buy closes before Wallet opens. Desktop More exposes policies/products and guided help.
- Mobile fan uses readable HTML type labels; list metadata preserves the priced explanation and metric labels.
- Table reserves all nine column widths and exposes named quick-buy actions without requiring hover.
- Multi-select inline filters display selection counts; narrow detail tabs scroll.
- Standalone preview displays startup/loading and recoverable import-error states. Supplied integrated blank screenshots remain unverified because local browser serving is blocked (EPERM).
- Source inventory: 170 buttons, zero without click/submit/disabled handling. Interactive browser dead-control verification remains outstanding.

### Scoped screenshot QA, 2026-10-23
- Bundled records appear immediately and survive catalog refresh failure with a retry notice.
- Index filters follow the compact stage directly; per-market Asked by / Priced / How to use remains visible.
- Stage labels, list typography, filter controls, pagination explanations and marquee keyboard/reduced-motion behavior are repaired in spec-qa.css and their components.
- Wallet dialogs suspend creation without destroying the draft or running both focus traps. Large market avatars share image fallback handling.
- Native-control source audit: 293 controls with handlers, destinations, submit or explicit read-only/disabled semantics. Browser behavior remains unverified due to EPERM. See VISUAL-REVIEW.md for the ten-item critique and shared-router limitation.

### Source QA follow-up, 23 October 2026
- Restored the general index signal strip and Human/Agent reader; scalar rows display estimate units.
- Trending uses the existing unavailable-value-aware sorter; modified market-link clicks retain native browser behavior.
- Command-palette creation opens the creation modal; global search shortcuts respect existing dialogs. Stage observer/listener cleanup is explicit.
- Corrected desktop column budgets, intermediate-width table scrolling, verification width, and mobile metric/action layout and metadata sizes.
- Scoped TypeScript, isolated build and pass8 (488 static route/state renders) pass. Source audit covers 298 native controls with zero unresolved handling/destination semantics. Browser QA and the supplied integrated blank-screen failure remain unverified because local serving returns EPERM.
