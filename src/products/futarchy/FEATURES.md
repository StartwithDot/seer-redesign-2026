# Futarchy feature inventory

## GLOBAL SHELL, NAVIGATION & UTILITIES
- [x] F001 Futarchy brand home link and sticky scrolled-header state: Global shell
- [x] F002 Milestones and Organizations jump navigation: Global shell
- [x] F003 Deep-linkable hash routes for home, organization, market and create views: Global router
- [x] F004 Back control, breadcrumb trail, browser back/forward and route scroll restoration: Global shell and Market Workspace
- [x] F005 Dark/light theme toggle, persisted theme, pre-paint application and view-transition reveal: Global shell
- [x] F006 Real browser-wallet Connect Wallet request flow with waiting and rejection states: Wallet drawer
- [x] F007 Disconnected/connected wallet states and live account-change updates: Wallet drawer
- [x] F008 Wallet popover with identicon, truncated address, native balance and transactions placeholder: Wallet drawer
- [x] F009 Copy Address utility with clipboard confirmation: Wallet drawer
- [x] F010 Disconnect wallet utility: Wallet drawer
- [x] F011 View more on explorer wallet-address link: Wallet drawer
- [x] F012 Chain Selector with Ethereum, Gnosis, Connected, selected/disabled and switching states: Network popover
- [x] F013 Refresh RPC Connection utility and connection status: Network popover
- [x] F014 Header Search pill with `/` and Cmd/Ctrl+K shortcuts: Global search
- [x] F015 Command palette with grouped market, organization and action results, typeahead and arrow/Enter controls: Command palette
- [x] F016 Ten-step guided tour with first-visit start, spotlight, Back/Next/Close and replay from Help: Guided tour
- [x] F017 Seer product footer links to Explorer, Deep, Futarchy, Opportunity and Risk: Global footer
- [x] F018 Futarchy tagline, X and GitHub links: Global footer

## DISCOVERY & LANDING
- [x] F019 Landing view organized as one live decision surface rather than a widget dashboard: Signal Board
- [x] F020 Primary question headline and two-world explainer: Signal Board header
- [x] F021 Asked by, Priced and How to use context fields: Signal Board context strip
- [x] F022 Active, Include and Exclude summary counts: Signal Board header
- [x] F023 Create market primary action: Signal Board header
- [x] F024 Active signal list with live count and bounded scrolling: Signal Board switcher
- [x] F025 Signal rows with token avatar, proposal, condition, mini-spark, verdict pill and impact: Signal Board switcher
- [x] F026 Click-to-select, double-click/Enter/Open-to-navigate behavior: Signal Board switcher
- [x] F027 Eight-second signal rotation with hover/focus pause, hidden-page pause and tour suppression: Signal Board switcher
- [x] F028 Previous/Next controls and keyboard-navigable milestone tab chips: Signal Board switcher
- [x] F029 Selected-row progress indicator and automatic row/chip scrolling: Signal Board switcher
- [x] F030 Live board identity, condition, verdict chip, Open action and synchronized signal: Signal Board preview
- [x] F031 Mini/card fork charts plus YES Price, NO Price and Impact tiles: Signal Board preview
- [x] F032 Three-step fork/impact/verdict glyph explainer with hover and focus tooltips: Signal Board footer
- [x] F033 Milestone text search across question, token, organization, id and proposal: Discovery filter bar
- [x] F034 Multi-select Organization filter with avatars, counts and removable selections: Discovery filter bar
- [x] F035 Multi-select Token filter for ETH, GNO, PNK and AAVE with counts: Discovery filter bar
- [x] F036 Status segmented filter for All, Active, Awaiting and Resolved: Discovery filter bar
- [x] F037 Sort menu for Closing soon, Volume and Impact: Discovery filter bar
- [x] F038 Selected filter chips with remove actions, maximum-three preview and +N overflow: Discovery filter bar
- [x] F039 Active/closed result counts and Clear filters action: Discovery filter bar
- [x] F040 URL query synchronization, deep-link restoration and popstate handling for all filters: Discovery filter bar
- [x] F041 Active Milestones responsive card grid with single-result wide mode: Active Milestones
- [x] F042 Market-card identity fields: token, organization, chain and live countdown: Active Milestones
- [x] F043 Market-card question, YES price, NO price, Impact and verdict: Active Milestones
- [x] F044 Loading skeletons, aria-busy state and fixed card geometry: Active Milestones
- [x] F045 No milestones empty state with Clear filters recovery: Active Milestones
- [x] F046 Recently Closed market collection: Recently Closed
- [x] F047 Closed-card token, organization, question, status, outcome, impact and winning-fork mark: Recently Closed
- [x] F048 Show more expansion after the first eight closed markets: Recently Closed
- [x] F049 Organizations table with Name, Market/Active, Proposals, Chain and Liquidity columns, search, proposal sort and count: Organizations
- [x] F050 Organization row deep link/filter-and-scroll behavior, ACTIVE MARKET tag, liquidity bar/links, organization count and empty state: Organizations

## MARKET EVIDENCE & SIGNAL
- [x] F051 Market breadcrumb, Back behavior and stable market deep link: Market Workspace
- [x] F052 Market identity with token avatar, chain, organization and proposal-condition question: Market Workspace header
- [x] F053 Impact spot, Status and resolved YES/NO Outcome fields: Market Workspace summary
- [x] F054 Volume and TVL fields with explanatory info tooltips: Market Workspace summary
- [x] F055 Remaining Time, Resolution Date and Ended state: Market Workspace summary
- [x] F056 Final Result field and approved/rejected presentation: Market Workspace summary
- [x] F057 Resolution question text and proposal-specific resolution condition: Evidence drawer
- [ ] F058 Resolve Question link to the canonical Reality.eth question: Evidence drawer
- [ ] F059 Snapshot Vote and View final results on Snapshot links: Evidence drawer
- [ ] F060 Answer, report, dispute and Kleros resolution links/statuses: Evidence drawer
- [x] F061 Expandable TWAP recommendation panel with completed/running/locked state: Evidence drawer
- [x] F062 TWAP window, updated timestamp, YES TWAP, NO TWAP, TWAP impact and ahead-outcome fields: Evidence drawer
- [ ] F063 Five-day/24-hour observation-window explanation and >+1% Include, <-1% Exclude, otherwise Neutral rule: Evidence drawer
- [x] F064 More info disclosure for mechanics and market metadata: Evidence drawer
- [x] F065 Trading Pair, YES Price, NO Price, Spot Price and Impact spot metric strip: Market Workspace chart
- [x] F066 Chart/Field segmented view with session persistence: Market Workspace chart
- [x] F067 Shared spot history, NOW fork, YES thread, NO thread and projected future: Market Workspace chart
- [x] F068 ±1% corridor, TWAP slab, gap area and decision moment visualization: Market Workspace chart
- [x] F069 Collision-safe direct labels, merged close labels, end-label dots and pass/fail tooltips: Market Workspace chart
- [x] F070 Pointer scrub with time, YES, NO and Impact tooltip: Market Workspace chart
- [x] F071 Play/Pause, timeline range input, Now/+days output, Space and arrow-key replay: Market Workspace chart
- [x] F072 Deterministic live ticks, momentum states, signal-head sparks/halo and activity pulse: Market Workspace chart
- [x] F073 Field view with YES/NO particle streams, uncertainty corridor and Include/Neutral/Exclude gate: Market Workspace chart
- [x] F074 Field pointer repulsor and touch pointer lifecycle: Market Workspace chart
- [x] F075 Five-day TWAP gauge with ±1% band, needle, verdict labels, lock icon and optional haptic lock: Market Workspace verdict
- [x] F076 Rolling numeric values with signed formats, unit spacing, significant-digit animation and reduced-motion snap: Market Workspace
- [x] F077 More from organization related-market strip: Market Workspace footer
- [x] F078 Closed/resolved read-only market variant with disabled trading and locked verdict: Market Workspace
- [x] F079 Copy/share market permalink utility preserving selected evidence state: Market Workspace actions
- [x] F080 `v` preset, Space replay, arrow scrub, Esc back, `?n=1..12` and deterministic pulse/test hooks: Developer and QA utilities

## TRADING & POSITIONS
- [x] F081 If Yes/If No outcome selector: Trade drawer
- [x] F082 Buy/Sell side selector: Trade drawer
- [x] F083 Amount input in USDS/sDAI with decimal input mode, bounds and blur normalization: Trade drawer
- [x] F084 Max action and +$1/+$5/+$20/+$100 quick amounts: Trade drawer
- [ ] F085 Available collateral balance and unavailable placeholder: Trade drawer
- [x] F086 Quote outputs for receive-if-YES and recover-if-NO, including estimates: Trade drawer
- [x] F087 Quote loading state: Trade drawer
- [x] F088 Quote returned no output, Quote Unavailable and recover-error states: Trade drawer
- [x] F089 Price impact percentage, pool-depth warning and Trade anyway override: Trade drawer
- [x] F090 Insufficient balance disabled action and zero-balance guards: Trade drawer
- [ ] F091 Review trade/Confirm Swap flow with quote refresh and completion status: Trade drawer
- [x] F092 Wallet-required gate that opens the real connect flow only when needed: Trade drawer
- [x] F093 Your view matrix mapping Bullish/Bearish to Buy/Sell in each world: Trade drawer
- [ ] F094 Currency and company token balances for sDAI/USDS, GNO, PNK and wallet totals: Position drawer
- [ ] F095 Mergeable YES and NO balances for each collateral token: Position drawer
- [x] F096 CowSwap BUY-token links beside insufficient collateral: Position drawer
- [ ] F097 My Trades tab with wallet-scoped trade history: Activity/Position tabs
- [ ] F098 Position tab with active positions and No active positions empty state: Activity/Position tabs
- [ ] F099 Transaction status log with timestamps, step sequence, success, pending and failure/error states: Transaction drawer

## COLLATERAL, LIQUIDITY & RESOLUTION
- [x] F100 Split Collateral entry and modal/drawer: Collateral drawer
- [x] F101 Collateral token tabs for sDAI/GNO or sDAI/PNK: Collateral drawer
- [ ] F102 Connected wallet, amount, Max, token Available and xDAI Balance fields: Collateral drawer
- [x] F103 Max Approval exact-allowance disclosure, Add Collateral options and collateral explanation: Collateral drawer
- [ ] F104 Split Collateral submit, approval, pending, success, failure and disabled states: Collateral drawer
- [ ] F105 Merge Collateral panel with matching tabs, fields, approval and submit states: Collateral drawer
- [ ] F106 Standalone Add Collateral action and balance selection: Collateral drawer
- [ ] F107 smartSwap, closePositions, getPosition and canCloseCurrency position logic with surplus tracking and wrapped ERC1155/ERC20 outcomes: Position engine
- [x] F108 Add Liquidity modal and review entry: Liquidity drawer
- [x] F109 USDS/WETH liquidity amounts, Max, +1/+5/+20/+100 quick amounts and numeric bounds: Liquidity drawer
- [x] F110 Review liquidity action and wallet connection handoff: Liquidity drawer
- [x] F111 Conditional, Prediction and Company Token pool categories with YES/NO pairs: Liquidity drawer
- [ ] F112 Swapr pool links and organization Liquidity routes such as `/flm/gnosis` and `/flm/kleros`: Liquidity drawer and Organizations
- [ ] F113 Redeem Tokens action with Resolved outcome and WINNING OUTCOME field: Resolution drawer
- [x] F114 No redeemable tokens and no-winning-token empty states: Resolution drawer
- [ ] F115 Redeem loading, success, partial and failure states: Resolution drawer
- [ ] F116 Create, verify, mint/merge/redeem, buy/sell, report, dispute, resolve and provide-liquidity lifecycle with opening time, timeout and minimum bond: Lifecycle drawer
- [ ] F117 FutarchyFactory, FutarchyProposal, FutarchyRouter, FutarchyRealityProxy, ConditionalTokens and CTHelpers contract/provenance links: Evidence drawer

## ACTIVITY & CREATE MARKET
- [x] F118 Recent Activity, My Trades and Position tabs: Activity panel
- [x] F119 Last 30, Last 60 and Last 90 trades selector: Activity panel
- [x] F120 Activity table fields: Outcome, Buy/Sell, Amount conversion, Price and Date: Activity panel
- [x] F121 Mirrored YES+NO trade pairs at matching timestamps: Activity panel
- [x] F122 Bounded activity prepend on a six-second cadence (explicitly labeled example replay): Activity panel
- [x] F123 Fresh-row highlight, fixed panel height and preserved scroll position during prepend: Activity panel
- [x] F124 No trades empty state and historical closed-market mode: Activity panel
- [x] F125 Create a conditional market route and five-step form: Create Market
- [x] F126 Organization select plus New organization name: Create Market
- [x] F127 Proposal title and short description with length limits, counters and validation: Create Market
- [x] F128 Collateral token and Success metric fields with synchronized defaults: Create Market
- [x] F129 Closing date, UTC close-time hint and tomorrow-or-later validation: Create Market
- [x] F130 Step-completion markers and final Review summary: Create Market
- [x] F131 Create market submit with validation focus, wallet gate, demo-only receipt hash (explicitly not on-chain) and success state: Create Market
- [x] F132 Back to milestones, Create another and Open on seer.pm actions: Create Market
- [x] F133 Live pass/fail market preview with question, metric, collateral and close date: Create Market
- [x] F134 Inline error/alert states, Escape-to-back and accessible described-by fields: Create Market

## EXPLORER, DATA & STATES
- [x] F135 Etherscan-like search across markets, questions, outcomes, collections, organizations, wallets, contracts and transaction hashes: Explorer
- [x] F136 Filter drawer for market type, status, chain, collection, organization, liquidity, volume and time: Explorer
- [x] F137 Coverage for Categorical, Multi-categorical, Scalar, Multi-scalar, Conditional and Futarchy market types: Explorer
- [x] F138 Market result cards/rows with question, outcome distribution, volume and verified/chain/collection status marks: Explorer
- [x] F139 Collection pages, collection filters and market membership links: Collection Explorer
- [x] F140 Star/bookmark and saved-market collections with empty state: Explorer utilities
- [x] F141 Entity detail breadcrumb, lifecycle status, question, Reality.eth action and type/liquidity/volume/verified metadata: Explorer Entity
- [x] F142 1D/1W/1M/All/Custom ranges, step-line chart, direct end labels and floating Trade action: Explorer Entity
- [x] F143 Markets, Leaderboard, Create Market, Policies, App and Help navigation: Explorer shell
- [x] F144 Canonical formats for money, percentages, timestamps, addresses, hashes, tokens, units and unavailable values: Global data layer
- [x] F145 CSV export for current market, activity, position and filtered explorer datasets: Data utilities
- [x] F146 Copy and share utilities for entities, filtered views and transaction references: Data utilities
- [x] F147 Loading skeletons, empty collections/results, error/retry, offline and RPC-failure states for every list/table: Global state layer
- [x] F148 Disconnected, connecting, connected, wrong-network, switching-network and rejected-wallet states: Global wallet state layer
- [ ] F149 Light/dark parity, 320–2560px responsive layouts, keyboard navigation, focus trapping, 40px targets and reduced-motion fallbacks: Global quality layer
- [x] F150 Bidirectional entity navigation and permalinks across market, organization, collection, wallet, contract and transaction records: Explorer Entity graph

## AUDIT ADDITIONS
- [x] F151 Legacy `#/org/:id` organization permalinks remain reachable: Global router
- [x] F152 Persist and restore the creation draft between visits: Create Market
- [x] F153 Bounded discovery sections with URL restoration and preserved filter controls: Signal Board
- [x] F154 Drawer URL state, Back/forward restoration and shared selected-drawer permalinks: Market Workspace
- [x] F155 Disabled evidence actions with an explicit reason when canonical IDs are incomplete: Evidence drawer and Explorer Entity

## NEW INFORMATION ARCHITECTURE
- **Screen map**
- `/futarchy`: Signal Board: live branching signal, switcher, discovery controls, closed strip and organizations; one job is finding the decision to inspect.
- `/futarchy/m/:id`: Market Workspace: identity, Decision Spine and verdict in the first viewport; evidence, trading, positions, liquidity and activity open as bounded drawers or tabs.
- Evidence drawer: resolution text, Reality.eth/Snapshot/Kleros links, TWAP math, contracts and provenance.
- Trade and Position drawers: quote/trade actions, balances, collateral operations, transaction log and redemption without leaving the market.
- Activity tab: Recent Activity, My Trades and Position with filters, CSV export and live bounded updates.
- `/futarchy/create`: focused five-step conditional-market creation with a sticky pass/fail preview.
- `/futarchy/explorer`: search-first cross-market index with filters, result table/cards and saved collections.
- `/futarchy/explorer/:kind/:id`: canonical Etherscan-like entity pages for markets, outcomes, organizations, collections, wallets, contracts and transactions.
- Global overlays: wallet, network, command palette, tour, share/copy and error/retry; all are dismissible, keyboard-safe and URL-aware.
- **Creative idea**
- The fresh object is a living Decision Spine: one shared history enters a NOW gate, forks into pass/fail worlds, and the ±1% corridor/TWAP window becomes the product's navigation instrument.
- The same spine re-labels itself as a spark, signal, verdict gauge, resolved fork and explorer preview, making Futarchy an observatory for branching decisions rather than a prediction-market card wall.
- **Explorer**
- Explorer search indexes every market type and entity, with verified/chain/collection marks, permalink histories, cross-links, lifecycle tabs, custom ranges, collections, bookmarks and CSV export.
- Market detail tabs are Overview, Chart, Trades, Positions, Liquidity, Resolution and Contracts; every tab remains reachable in one click from the entity header.
- **Quality constraints**
- Each primary screen has one job and stays within roughly two viewports; secondary depth uses tabs, drawers and popovers instead of long pages.
- Every control has a visible outcome or explicit disabled reason; loading, empty, error, wallet and theme states are designed in both light and dark.

## Step 3 audit gaps

Checked means implemented and statically reachable, not browser-certified. Evidence for every item is in [AUDIT.md](AUDIT.md).

- F058: Canonical Reality.eth IDs are incomplete in the fixtures.
- F059: Canonical Snapshot proposal IDs are incomplete.
- F060: Oracle/dispute status is inferred; real question IDs and dispute records are absent.
- F063: Five daily fixture averages do not implement hourly medians and the production observation window.
- F085: Collateral availability is generated, not read from token contracts.
- F091: Confirm only records local review; no swap execution or settlement.
- F094: Token balances and totals are generated account examples.
- F095: Outcome balances are generated examples.
- F097: Trade history is generated, not indexed wallet trades.
- F098: Positions are generated, not indexed holdings.
- F099: Transaction steps are generated examples, not execution records.
- F102: Token availability is generated; only the native wallet balance is live.
- F104: Split is a local check; no token approval, pending receipt or execution.
- F105: Merge is a local check; no token approval, pending receipt or execution.
- F106: Add collateral only prepares a local plan.
- F107: Engine returns estimates; it never wraps, swaps or mutates positions.
- F112: Pool links are constructed from fixture slugs, not verified pool addresses.
- F113: Redemption action only checks example winning units.
- F115: No redemption submission, loading receipt or partial settlement.
- F116: Lifecycle metadata and statuses are examples; opening time is not recorded.
- F117: Protocol role links search names; deployed provenance is unavailable.
- F149: Chrome exits SIGABRT before browser assertions and visual sign-off.
