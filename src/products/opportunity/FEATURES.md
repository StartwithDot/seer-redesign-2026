# OPPORTUNITY FEATURE INVENTORY

## Global Shell And Orientation
- [x] F001 Opportunity product identity, product name, and route context — Global shell header
- [x] F002 Persistent primary navigation to Opportunity, Explorer, Protocol, and Archive — Global shell header
- [x] F003 Active-route indication and direct deep links for every primary destination — Global shell header
- [x] F004 Live pilot badge and pilot status for `Seer AI Job Board Name` — Opportunity Board status strip
- [x] F005 Pilot scale summary with 235 submissions and active state — Opportunity Board hero metrics
- [x] F006 Protocol roadmap with discovery, pricing, decision, and resolution stages — Protocol drawer or roadmap tab
- [x] F007 Contextual help, product tour, and guided first-use sequence — Help popover and opt-in tour overlay, with mobile Help accessible in the header.
- [x] F008 Global search or command palette across markets, submissions, creators, and transactions — Header search overlay
- [x] F009 Search keyboard shortcut, focus management, recent searches, and result deep links — Command palette
- [x] F010 Light and dark theme toggle with system, light, and dark preferences — Header appearance popover
- [x] F011 Persisted theme choice and no-flash initial theme application — Global shell
- [x] F012 Connect-wallet action, connected address, network, balance, and disconnect action — Header wallet control
- [x] F013 Wallet connection modal with provider choices, connecting, rejected, unsupported, and error states — Wallet drawer
- [x] F014 Network mismatch and switch-network recovery state — Wallet drawer
- [x] F015 Responsive mobile navigation and compact header controls — Mobile global shell
- [x] F016 Skip link, logical heading order, keyboard focus, and visible focus treatment — Global accessibility layer
- [x] F017 Reduced-motion fallbacks for marquee, transitions, charts, and animated visuals — Global accessibility layer
- [x] F018 Back-button behavior, Escape-to-close behavior, and route-safe modal restoration — URL-owned overlays and dialogs restore through browser history without leaving the product.

## Opportunity Board
- [x] F019 One-screen overview of the current opportunity, market signal, and sponsor task — `/opportunity` board
- [x] F020 Current market identity, title, market type, active status, and opening context — Board market header
- [x] F021 Market rail for all real and deterministic sample markets — Board → Browse markets, with wrapping market titles and mobile selector.
- [x] F022 Horizontal market marquee with pause-on-hover/focus and direct selection — Board → Across the markets.
- [x] F023 Selected-market persistence while navigating tabs and drawers — Board state
- [x] F024 Previous and next market controls with keyboard support — Board market controls
- [x] F025 Market count indicator and sample-data indicator for deterministic demo markets — Browse markets summary and labeled results.
- [x] F026 Headline metrics for total odds, priced outcomes, tied outcomes, and unpriced outcomes — Board signal strip
- [x] F027 Coverage readout for top 3, top 8, and top 27 submission sets — Board coverage module, visible on mobile as well as desktop.
- [x] F028 Total market odds display including the observed 99.0% total — Board signal strip
- [x] F029 Tier summary for 59 above-floor, 46 tied at 0.4%, and 130 unpriced/no-pool entries — Board signal strip
- [x] F030 Sponsor decision status and undecided/decided counts in the amber authority lane — Board decision rail
- [x] F031 Current recommendation, decision deadline, and next sponsor action — Board Sponsor task → Decision details.
- [x] F032 Data freshness/update timestamp and stale-data notice — Board → Source & market status, including original evidence image.
- [x] F033 Loading skeletons for board metrics, rail, and market panels — Board loading state
- [x] F034 Empty board state when no markets match the active workspace — Board empty state
- [x] F035 Market data error state with retry and degraded-data notice — Board error state

## Universal Market Explorer
- [x] F036 Etherscan-style cross-market explorer for prediction, futarchy, funding, hiring, contest, and proposal markets — `/opportunity/explorer`
- [x] F037 Universal search across market ID, title, contract, creator, outcome, submission, transaction, and wallet — Explorer search
- [x] F038 Market-type filter spanning all supported opportunity market types — Explorer filter bar
- [x] F039 Status filter for active, pending, paused, resolved, finalized, and redeemed markets — Explorer filter bar
- [x] F040 Decision filter for undecided, shortlisted, selected, rejected, and withdrawn submissions — Explorer filter bar
- [x] F041 Outcome-count range filter and zero/one/many outcome presets — Explorer filter bar
- [x] F042 Date, volume, liquidity, odds, and submission-count range filters — Explorer filter popover
- [x] F043 Sort by relevance, newest, volume, liquidity, coverage, odds concentration, and decision readiness — Explorer sort control
- [x] F044 Density toggle for table, compact card, and analytical field views — Explorer view switcher
- [x] F045 Saved filter presets and reset-all-filters action — Explorer filter bar
- [x] F046 URL-encoded filters, sorting, pagination, and selected object restoration — Explorer query state restores filters, sort, density, market page, object page, preview, and record IDs.
- [x] F047 Result count, active-filter chips, removable filters, and no-result recovery — Explorer results header
- [x] F048 Paginated or virtualized result rows with stable keyboard navigation — Explorer result ledger
- [x] F049 Deep links to market, outcome, submission, wallet, creator, and transaction records — Explorer object links
- [x] F050 Unified timeline for creation, pool events, trades, decisions, disputes, resolution, and redemption — Explorer record timeline
- [x] F051 Copyable canonical IDs, addresses, hashes, and shareable record URLs — Explorer record actions
- [x] F052 Explorer loading, empty, partial-data, error, and retry states — Explorer states

## Market And Submission Data Model
- [x] F053 Market ID, title, type, description, status, creator/sponsor, and creation date — Market dossier
- [x] F054 Market contract address, chain/network, source application, and verification status — Market dossier
- [x] F055 Trading volume, available liquidity, pool status, and floor price — Market dossier
- [x] F056 Outcome count, decided count, decision status, and outcome-set completion — Market dossier
- [x] F057 Outcome/submission rank, stable ID, title/name, creator, and avatar — Submission dossier
- [x] F058 Outcome price, implied probability/odds, 24-hour delta, tier, and rank movement — Submission rows
- [ ] F059 User position, average entry, current value, profit/loss, and redeemable amount — Live share balances and archive payouts work; average entry and P&L exist only for labeled samples. Verified historical wallet fills/cost basis are not supplied.
- [x] F060 Winner flag, payout amount, redeem status, and resolution evidence — Resolved submission dossier
- [x] F061 Image thumbnail, proposal text, portfolio/Behance link, and external creator links — Submission dossier
- [x] F062 Sponsor comments, review notes, rejection reason, and decision timestamp — Submission dossier
- [x] F063 Proposal, discussion, reply, like, comment-count, and comment-thread content — Submission community panel
- [x] F064 Per-submission creation time, price history, trade history, and decision history — Submission timeline
- [x] F065 Missing-field placeholders and explicit unpriced, no-pool, unavailable, or withheld states — Universal data display

## Explore Field Lab
- [x] F066 Field, Bubbles, and Heatmap visual modes for scanning all submissions — `/opportunity/review/:market` Field tab
- [x] F067 Field mode plots rank, odds, tier, decision state, and selection state — Field tab
- [x] F068 Bubbles mode encodes odds with area and decision/tier with authority-safe marks — Field tab
- [x] F069 Heatmap mode exposes odds concentration, rank clusters, and coverage bands — Field tab
- [x] F070 Color legend and semantic key separating violet odds, amber sponsor authority, and green/red deltas — Field tab
- [x] F071 Visual scaling, label collision handling, and readable dense-market fallback — Field tab
- [x] F072 Click, tap, keyboard, and hover selection of a submission — Field tab
- [x] F073 Persistent selected-submission outline and synchronized selection across views — Field tab
- [x] F074 Submission tooltip with name, rank, odds, delta, tier, decision, and position — Field tab
- [x] F075 Zoom, pan, fit-to-view, reset, and compact-screen controls — Field tab
- [x] F076 Optional labels for top-ranked, selected, tied, unpriced, shortlisted, and winner submissions — Field tab
- [x] F077 Per-view preference persistence for mode, scaling, labels, and density — Field tab

## List And Comparison
- [x] F078 Table and compact-list views for exact comparison of all submissions — `/opportunity/review/:market` List tab
- [x] F079 Columns for rank, submission, creator, odds, price, 24-hour delta, tier, position, decision, and winner — List tab
- [x] F080 Column sorting, ascending/descending direction, and persisted sort state — List tab
- [x] F081 Search within submissions plus tier, decision, outcome, price, and winner filters — List tab
- [x] F082 Above-floor, tied-at-0.4%, and unpriced/no-pool tier grouping — Table and compact modes use the same global tier order.
- [x] F083 Expandable row detail without losing table position — List tab
- [x] F084 Row keyboard navigation, select-on-focus, and accessible table semantics — Row keys ignore nested controls and compact focus follows arrow navigation.
- [x] F085 Bulk selection, clear selection, add-to-shortlist, and compare action — List tab
- [x] F086 Virtualization or pagination for the 235-submission pilot — List tab
- [x] F087 Copy submission link and open submission dossier actions — List tab

## Review Cut And Sponsor Triage
- [x] F088 Review-cut slider or percentile control that narrows the candidate set — `/opportunity/review/:market` Review Cut tab
- [x] F089 Live cut summary showing included count, excluded count, odds captured, and coverage gained — Review Cut tab
- [x] F090 Coverage checkpoints for top 3, top 8, and top 27 candidate sets — Review Cut tab
- [x] F091 Rank, odds, tier, and sponsor-preference cut strategies — Review Cut tab
- [x] F092 Add, remove, pin, unpin, reorder, and clear shortlisted submissions — Display and reorder operations share pinned and unpinned group boundaries.
- [x] F093 Shortlist tray with live count, compact submission cards, and dossier links — Review Cut drawer
- [x] F094 Persisted review cut and shortlist per market and connected user — Review Cut state
- [x] F095 Market-odds recommendation presented as triage evidence rather than an automatic winner — Review Cut recommendation card
- [x] F096 Sponsor comparison of shortlisted candidates and decision rationale capture — Review Cut comparison panel
- [x] F097 Confirm selection, reject, defer, and withdraw-decision actions with validation — Sponsor decision drawer
- [x] F098 Decision preview showing affected submissions, odds context, and final authority ownership — Sponsor decision drawer
- [ ] F099 Optimistic, pending, confirmed, failed, and already-decided transaction states — Local signature states exist; source sponsor transaction submission is unavailable without a verified sponsor authorization and write interface.

## Sponsor Decision And Step Story
- [x] F100 Amber sponsor-lane status distinct from violet market odds — `/opportunity/review/:market` Decision lane
- [x] F101 Step story explaining pool, price signal, review cut, sponsor choice, resolution, and payout — Decision lane stepper
- [x] F102 Current-step emphasis, completed-step confirmation, and future-step context — Decision lane stepper
- [x] F103 Sponsor name/avatar, authority scope, deadline, quorum/rules context, and decision history — Decision lane
- [x] F104 Decided market display of selected winner, payout schedule, and sponsor rationale — Decision lane
- [x] F105 Kleros and Reality.eth resolution/dispute context where applicable — Decision lane resolution popover

## Selected Submission Drawer
- [x] F106 Side drawer for one submission with title, creator, image, description, and rank — Submission dossier drawer
- [x] F107 Current odds, price, 24-hour delta, tier, position, volume, and liquidity fields — Submission dossier drawer
- [x] F108 Submission price-history chart with range controls and hover crosshair/readout — Submission dossier drawer
- [x] F109 Creation, trade, decision, dispute, resolution, and redemption timeline — Submission dossier drawer
- [x] F110 Proposal/IPFS, portfolio/Behance, X, website, market, contract, and explorer links — Submission dossier drawer
- [x] F111 Discussion thread, replies, likes, comments, and add-comment control — Submission dossier drawer
- [x] F112 Copy link, share, add/remove shortlist, compare, buy, sell, and sponsor-decision actions — Submission dossier drawer
- [x] F113 Drawer close, previous/next submission, keyboard navigation, and URL deep-link state — Submission dossier drawer

## Trade Ticket
- [x] F114 Buy and Sell mode toggle with clear active-state and order context — Trade ticket drawer
- [x] F115 Outcome selector including selected submission, winner, and alternate outcomes — Trade ticket
- [x] F116 Payment/currency selector with supported balances and unavailable options — Trade ticket
- [x] F117 Amount input, numeric validation, quick amount presets, clear, and Max action — Trade ticket
- [x] F118 Quote, estimated receive, average price, price impact, slippage, and minimum receive — Live primary and reference quotes calculate guarded price impact and minimum receive.
- [x] F119 Live quote refresh, quote expiry, stale quote, and recalculation states — Trade ticket
- [x] F120 Insufficient token balance, insufficient position, no-pool, unpriced, and market-closed guards — Trade ticket states
- [x] F121 Approve-token, connect-wallet, review-order, confirm, pending, success, rejected, and failed states — Trade ticket flow
- [x] F122 Trade confirmation with transaction hash and links to Gnosisscan/explorer records — Trade ticket success sheet
- [x] F123 Redeem action for finalized winning positions with payout preview — Archive Payouts and redeem drawer
- [x] F124 Redeemed, nothing-to-redeem, unauthorized, pending, failed, and success states — Archive Payouts and redeem drawer

## Analytical Charts
- [x] F125 Market odds history chart across all priced outcomes — Market dossier Analytics tab
- [x] F126 Cumulative odds-coverage chart with top-N annotations and thresholds — Market dossier Analytics tab
- [x] F127 Rank and bump-line chart showing movement across submissions — Market dossier Analytics tab
- [x] F128 Heat/rank distribution chart for price concentration and unpriced population — Market dossier Analytics tab
- [x] F129 Per-submission price and probability history chart — Submission dossier drawer
- [x] F130 Hover crosshair, synchronized readouts, active legend, and focusable data points — All charts
- [x] F131 Range selectors, zoom/pan where useful, reset, and responsive chart sizing — All charts
- [x] F132 Chart loading, empty, partial, error, and reduced-motion/no-animation states — All charts

## Archive, Resolution, And Community
- [x] F133 Archive index of finalized markets including `Seer Rebrand Contest` and `Seer Merch for Devcon Mumbai` — `/opportunity/archive`
- [x] F134 Archive filters by market type, date, sponsor, status, submission count, and outcome — Archive index
- [x] F135 Finalized market summary with winner, payout, resolution date, and final decision — Archive market dossier
- [x] F136 Gallery/carousel for 144 rebrand images and 18 merch submissions — Archive gallery tab
- [x] F137 Gallery keyboard controls, thumbnails, zoom/lightbox, count, and creator attribution — Archive gallery tab
- [x] F138 Winner/redeem/pay-out display and related wallet position state — Archive market dossier Payouts tab
- [x] F139 Discussion, reply, like, comment-count, and comment-thread persistence — Community panel
- [x] F140 External X, website, Behance/portfolio, proposal/IPFS, app.seer.pm, TradingView, and Gnosisscan links — Contextual link groups

## Theme, Responsive, State, And Utilities
- [x] F141 Authority color tokens: violet market odds, amber sponsor decision, green/red deltas only — Design-system theme layer
- [x] F142 Light and dark chart palettes, surfaces, borders, text contrast, and semantic states — Design-system theme layer
- [x] F143 Mobile market selector, filter sheet, tab strip, bottom trade ticket, and full-height drawers — Responsive layouts
- [x] F144 Desktop split view with market context, analytical workspace, and non-blocking drawers — Responsive layouts
- [x] F145 Touch targets, hover alternatives, keyboard operation, screen-reader labels, and live announcements — Accessibility layer
- [x] F146 Route loading, suspense, empty, not-found, error, offline, and retry states — Global route state layer
- [x] F147 Wallet disconnected, connecting, connected, wrong-network, insufficient-balance, and transaction-pending states — Global wallet state layer
- [x] F148 Deterministic sample generation for `?n=1..12`, with real-versus-sample labeling and no fabricated real facts — Demo data utility
- [x] F149 URL-filter restoration, selected-object deep links, share/copy utilities, and safe return to prior view — Routing utility
- [x] F150 Persisted field mode, view density, theme, review cut, shortlist, and wallet-safe preferences — Local preference utility

## Additional source parity found during audit
- [x] F151 Invalid-outcome refund explanation and contract settlement fraction — Help → How markets work → payout step; Archive → Payouts → redeem drawer. Payout uses on-chain numerator / denominator rather than an assumed one-token return.
- [x] F152 Complete paginated universal object results with stable-ID search — Explorer search includes every matching canonical object, with ten results per page; the command palette keeps a compact result limit.
- [x] F153 Board-local market status filters, title search, and no-result recovery — Market spine controls preserve a useful board even with 1..12 records.
- [x] F154 Seer ecosystem footer navigation across Explorer, Deep, Futarchy, Opportunity, and Risk — Persistent product footer.
- [x] F155 Permissionless launch roadmap and direct Seer launch affordance — Protocol drawer shows TODAY, NEXT, ANY DECISION and links to the verified Seer app.
- [x] F156 Explicit P&L and payout explanation from entry through sponsor decision and settlement — How markets work explainer and trade payout context.
- [x] F157 Direct Open opportunity actions from the board hero and market dossiers — Board and explorer records deep-link into the review workspace.
- [x] F158 Market depth context using aggregate recorded liquidity plus live outcome quote impact — Board and dossiers label market depth; trade review exposes outcome-specific price impact and slippage.

## NEW INFORMATION ARCHITECTURE
- `/opportunity` — **Opportunity Board**: identify the active opportunity, read its market signal, and see the sponsor’s next task.
- `/opportunity/explorer` — **Universal Explorer**: search and inspect markets, outcomes, submissions, creators, wallets, and transactions across every market type.
- `/opportunity/review/:marketId` — **Review Cut**: one job—turn market odds into a shortlist for sponsor triage, with Field, List, and Review Cut tabs.
- `/opportunity/archive` — **Decision Archive**: one job—compare resolved opportunities, winners, galleries, payouts, and evidence.
- **Market dossier drawer** — type-agnostic identity, contract, status, liquidity, odds, timeline, analytics, and external records.
- **Submission dossier drawer** — one candidate’s full record, price history, proposal, portfolio, discussion, trade, and decision actions.
- **Trade/redeem drawer** — one transactional job with quote, guardrails, wallet lifecycle, confirmation, payout, and explorer links.
- **Command palette** — global jump to any object; **wallet popover** handles connection; **help/tour overlay** handles onboarding.
- Filters, columns, comparison, shortlist tools, and advanced chart controls live in tabs, popovers, and drawers so each screen stays within two viewports.
- Every route preserves deep links and light+dark presentation; reduced motion and keyboard navigation remain available everywhere.
- **Creative idea: “Odds are weather; the sponsor still steers.”** Violet probability signals reveal where attention is worth spending, while an amber decision lane preserves human authority.
- The interface reads like an operating console for opportunity triage—not a trading-terminal reskin—using coverage, concentration, rank movement, and decision readiness as its primary language.
- **Explorer principle:** behave like Etherscan across all market types: one canonical object model, universal search, filters, timelines, hashes, addresses, copy/share actions, and links out to Gnosisscan, Kleros, Reality.eth, and source apps.
- Different market types expose domain-specific fields through dossier tabs, but navigation, state, provenance, and transaction evidence remain consistent.
