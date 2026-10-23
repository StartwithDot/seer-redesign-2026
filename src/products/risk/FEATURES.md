# Risk Feature Inventory

## Global Shell & Navigation
- [x] F001 `/risk` product shell with Seer/Foresight identity, shared header, and Risk active — Global shell
- [x] F002 Overview, Assets, Over time, and Participate section navigation with active state and smooth/focused jumps — Persistent section tabs
- [x] F003 Quick Guide modal with first-visit welcome behavior, explicit close behavior, and completed-onboarding persistence — Guide overlay
- [x] F004 Beginner User Guide, Advanced User Guide, and Acquire xDAI links with the three onboarding steps — Guide overlay
- [x] F005 Help popover with hover/click/keyboard opening and Get Help, Report a Bug, Give Feedback, App Guide, Crypto Beginner's Guide, and FAQ — Header popover
- [ ] F006 Email notifications entry point and wallet-signature subscription flow — Notifications drawer
- [x] F007 Light/dark theme toggle with separately designed themes and canonical `localStorage['seer-theme']` persistence — Global shell
- [x] F008 Connect entry points from the header, email prompt, and prediction action — Global shell / wallet drawer
- [x] F009 Account details with address, network, Gnosisscan link, and Disconnect — Account drawer
- [x] F010 Seer product links for Explorer, Deep, Futarchy, Opportunity, and Risk plus “Seer. Information Finance.” — Global footer
- [x] F011 Built by/Secured by Kleros credit and `kleros.io` link — Global shell / footer
- [x] F012 Telegram, X, and GitHub links with the observed Kleros destinations — Global footer / Help
- [x] F013 Advanced LP/Trade link to the related Seer outcome-token market — Asset detail / Prediction desk
- [x] F014 Shareable deep-link state for selected assets, view, and horizon with Back/Forward and popstate synchronization — All routes

## Market Context & Rounds
- [x] F015 “Risk Pricing Predictions” page title — Hazard Desk
- [x] F016 Q3 Probability of Default question, estimation subtext, and explanatory `Default (PD)` tooltip — Hazard Desk
- [x] F017 Trading Period with the full 30 September 2026 23:59 UTC deadline — Market status strip
- [x] F018 Countdown/result state showing Ended, final prices, and closed date — Market status strip
- [x] F019 Q3 2026 active round selector — Round switcher
- [x] F020 Q4 2026 disabled round with Coming soon tooltip/state — Round switcher
- [x] F021 Asked by, Priced, and How to use context strip from the approved build — Hazard Desk
- [x] F022 xDAI, sDAI, and Foresight Credits/Seer Risk Credits payment context on Gnosis Chain — Guide / Prediction desk
- [x] F023 Market Estimate Risk heading and its Risk bars/Over time view controls — Hazard Desk toolbar

## Hazard Desk & Signature Figure
- [x] F024 “Chance that no listed asset defaults” aggregate with annual and quarterly values — Hazard Desk hero
- [x] F025 One PD estimate expressed at Ann. and Quart. horizons with consistent conversion — Hazard Desk / all asset surfaces
- [x] F026 Quart.-to-Ann. horizon slider with Quart. and Ann. presets and intermediate month label — Hazard Desk toolbar
- [x] F027 Risk bars/strip view with non-linear 0%, 2%, 5%, 10%, 100% scale and direct value labels — Hazard Desk
- [x] F028 Over time view switch that preserves asset selection and horizon state — Hazard Desk
- [x] F029 Survival Tide terrain: assets docked into severity depths as survival drains across the horizon — Hazard Desk signature figure
- [x] F030 Ghost history ridges, live market ridge, and dashed user-estimate ridge — Survival Tide
- [x] F031 Hazard/survival model from PD, including portfolio survival as the product of asset survivals — Survival Tide math
- [x] F032 Seeded default sparks/ripples proportional to asset hazard with pooled reduced-motion behavior — Survival Tide signature motion
- [x] F033 Low 0-2%, Moderate 2-5%, High 5-10%, and Critical 10-100% zones with non-color encoding and aligned ticks — Band ladder
- [x] F034 Violet market-estimate marker and teal user-estimate marker on the shared band scale — Band ladder
- [x] F035 Hover/focus asset card with ticker, grade, PD Ann., PD Quart., and risk band — Hover popover
- [x] F036 Click/focus previews an asset; double-click, Enter, or Details opens its full dossier — Hazard Desk interaction
- [x] F037 Exact survival axes, gridlines, direct asset labels, and collision-safe annotations — Survival Tide
- [x] F038 Rolling aggregate numbers with exact final values and reduced-motion fallback — Hazard Desk / Prediction desk
- [x] F039 Empty selected-assets state with “No assets selected” guidance and Select all recovery — Hazard Desk
- [x] F040 Market Estimate versus Your estimate legend that appears only when relevant — Hazard Desk
- [x] F041 Clicking the aggregate highlights assets by hazard contribution/share — Hazard Desk drill-down
- [x] F042 Band-crossing sweep plus the optional Rain/particle alternative view driven by PD — Alternative view

## Asset Selection & Discovery
- [x] F043 All 33, ETH Based 7, USD Based 13, BTC Based 6, and Funds Based 7 group selectors — Picker / Asset explorer
- [x] F044 Group identity through diamond, circle, square, and hexagon glyphs/lanes rather than decorative hue — Picker / tables
- [x] F045 Multi-select ticker roster: weETH, stETH, ETH+, bsdETH, rETH, pufETH, avETH, PYUSD, RLUSD, USDC, USD1, USDS, USDT, RUSD, USDF, avUSD, NUSD, iUSD, satUSD+, USDO, BTCB, solvBTC, tBTC, cbBTC, LBTC, UBTC, GACLO-1, BUIDL-I, JAAA, JTRSY, mF-ONE, STAC, U — Picker
- [x] F046 Group chips replace selection while ticker pills toggle/add arbitrary cross-group selections — Picker
- [x] F047 Clear all and Select all behavior, including the unselected empty state — Picker
- [x] F048 Selection synchronization across the hero, gallery/table, Over time, and Participate surfaces — Global selection state
- [x] F049 Staggered picker entrance, hover lift, selection check draw, group pulse, and press feedback — Picker micro-interactions
- [x] F050 Asset search by ticker and discoverable full identity — Global search / command palette
- [x] F051 Sort by PD, Name, Grade, and change/mover rank where available — Asset explorer
- [x] F052 Search, filters, sort, selection, view, and horizon mirrored in shareable URL state — All routes
- [x] F053 Compare/isolate behavior for one or several assets with `?n=1..33` deterministic adaptation — Asset explorer

## Assets Gallery & Table
- [x] F054 Assets gallery containing all 33 asset tiles — `/risk/assets`
- [x] F055 Asset tile identity: group glyph, ticker, and Credora grade — Asset tile
- [x] F056 PD (Ann.) and PD (Quart.) values with `<0.01%` formatting — Asset tile / table
- [x] F057 Credora grade chip with missing-grade fallback — Asset tile / table
- [x] F058 Per-asset survival sparkline/curve — Asset tile / dense table
- [x] F059 Logarithmic band gauge marker for each asset — Asset tile / dense table
- [x] F060 Independent tile selection toggle synchronized with the chart — Asset tile
- [x] F061 Tile click opens Credora/asset details without losing list context — Asset drawer / dossier
- [x] F062 Group filter tabs for All, ETH, USD, BTC, and Funds in the gallery — `/risk/assets`
- [x] F063 Gallery sort selector for PD, Name, and Grade — `/risk/assets`
- [x] F064 Intersection-triggered tile entrance and hover replay of the survival line — Asset gallery
- [x] F065 Dense sortable 56px-row table with inline sparkline, one horizon-adjusted PD value, peer/rank context, and hover/selected/edited states — `/risk/assets`

## Over Time & Movers
- [x] F066 Real market history decoded from Seer pool prices for each asset — `/risk/history`
- [x] F067 Selected-asset market history shown as individually normalized ridge/small-multiple lines — `/risk/history`
- [x] F068 User estimate shown as a right-edge marker, dashed segment, and rescaled endpoint — `/risk/history`
- [x] F069 Direct collision-free end labels for market and user values — `/risk/history`
- [x] F070 Pointer and keyboard crosshair with nearest-point asset/value/date inspection — History chart
- [x] F071 Exact date axis, time labels, and history endpoints — History chart
- [x] F072 Zoom, pan, and range controls while preserving selection state — History chart
- [x] F073 Top movers for 24h and 7d using slope/delta marks — `/risk/history`
- [x] F074 Optional log-scale multi-line view with hover isolation and group lanes — `/risk/history`
- [x] F075 Responsive chart redraw, empty/history-unavailable state, and TradingView attribution where retained — History chart

## Prediction Workspace
- [x] F076 Participate guidance: choose any number of protocols and use the same capital across all at once — `/risk/predict`
- [x] F077 Focused, pinned prediction panel/drawer with one independently scrolling list and one primary submission action — `/risk/predict`
- [x] F078 No to All / NO TO ALL shortcut and aggregate market card — Prediction desk
- [x] F079 Aggregate 0-100 slider with fine pointer steps and PageUp/PageDown/Home/End keyboard support — No to All card
- [x] F080 Aggregate edits rescale every asset hazard proportionally to the requested no-default chance — Prediction math
- [x] F081 Aggregate Ann. and Quart. values, market baseline, and directional delta in percentage points — No to All card
- [x] F082 Edited count, per-group edited badges, check state, and reset visibility — Prediction desk
- [x] F083 Aggregate Reset link restoring all market estimates without hidden state — No to All card
- [x] F084 Expand all/Collapse all and four independently expandable group accordions — Prediction list
- [x] F085 All/ETH/USD/BTC/Funds filters inside the Participate asset list — Prediction list
- [x] F086 Collapsed asset row with status, ticker, market PD, expand control, and fixed row geometry — Prediction list
- [x] F087 Expanded asset row with Market PD (Ann.), user value, delta, band gauge, and Details — Prediction list
- [x] F088 Per-asset logarithmic slider with arrow/PageUp/PageDown behavior and monotonic PD mapping — Prediction list
- [x] F089 Market tag versus bold user estimate, signed delta, and edited check/minus state — Prediction row
- [x] F090 Per-asset Details action opening the Credora dossier — Prediction row
- [x] F091 Predict Selected and “Predict all the estimates above” actions with explicit enabled/disabled reasons — Prediction actions
- [x] F092 Connect To Predict wallet gate that never silently submits or signs — Prediction actions
- [x] F093 Advanced section retaining the LP/Trade specific outcome-token opportunity — Prediction actions
- [x] F094 Reset Predictions and Export Predictions actions when edits exist — Prediction actions
- [ ] F095 Idle, editing-asset, editing-aggregate, CSV-loaded, exported, wallet-connect, ready, submitting, confirmed, and ended lifecycle states — Prediction state machine

## CSV & Data Utilities
- [x] F096 Upload CSV Predictions modal/action — CSV drawer
- [x] F097 Drag-and-drop zone and accessible `.csv` file picker with selected-file state — CSV drawer
- [x] F098 Required `asset,probability` schema, example rows, and schema hint tooltip — CSV drawer
- [x] F099 Download CSV Template action — CSV drawer
- [x] F100 Parser accepting decimal fractions and percent strings, skipping `No To All`, and rejecting invalid assets/ranges/extra columns — CSV drawer
- [x] F101 Valid Load Predictions flow updating edited rows, aggregate, deltas, and group badges — Prediction desk
- [x] F102 Clear invalid-format, empty, and parse error states — CSV drawer
- [x] F103 Client CSV download/export with `asset,probability`, 34 rows including `No To All`, date-stamped filename, and latest-data freshness note — Global utility

## Asset Dossier, Risk Data & Links
- [x] F104 Asset detail drawer/route with back, breadcrumb, and preserved originating filter/selection — `/risk/asset/:id`
- [x] F105 Market PD Ann./Quart. and Your estimate values at three-decimal precision — Asset dossier
- [x] F106 Credora by RedStone letter grade, category, and average risk score — Risk Panel
- [x] F107 Metric score fields with x/5 or `-/5`: Asset Quality, Protocol Security, Governance, Peg Track Record, Reserves Management, Regulatory/Legal Profile, Concentration, Recent Incident, Protocol & Operational Security, NAV Track Record, and Funds Management — Risk Panel
- [x] F108 Asset-specific metric explanation text in hover/focus tooltips — Risk Panel
- [x] F109 NUSD “metric breakdown not published” and LBTC “risk rating not published” plus null-grade/null-category fallbacks — Risk Panel
- [x] F110 Consensus PD (Ann.) tied to the same source value as the market row — Risk Panel
- [x] F111 View on Credora link using the asset's Credora slug — External links
- [x] F112 Ethereum contract address, shortened display, and Etherscan address link — External links
- [x] F113 Connected wallet address and Gnosisscan link — Account drawer
- [x] F114 Seer LP/Trade/outcome-token market links — Asset dossier / Prediction desk
- [x] F115 Kleros and Reality.eth provenance/resolution links when a question, answer, or dispute record exists — Market provenance
- [x] F116 Copy/share canonical asset or market link plus explorer links for contract, condition, question, factory, collateral, wrapped tokens, collection, and transaction entities — Entity utility

## Wallet, Account & Notifications
- [ ] F117 Connect modal with Email input and submit action — Wallet drawer
- [ ] F118 Google and other social sign-in options — Wallet drawer
- [ ] F119 MetaMask, WalletConnect/QR, Trust, and All Wallets options including provider states — Wallet drawer
- [x] F120 Disconnected, connecting, connected-address, wrong-network, rejected, and disconnected states — Wallet state machine
- [x] F121 Gnosis network context and xDAI/sDAI/Foresight Credit readiness guidance — Wallet / Guide
- [ ] F122 Email notification wallet-signature sign-in with “free/no transaction” explanation and post-sign-in management — Notifications drawer
- [x] F123 Honest wallet handling: no fake signing/transacting, with visible configuration/provider errors and unchanged prediction state — Wallet state machine

## States, Themes, Responsive & Accessibility
- [x] F124 First-class white/light theme with darkened semantic colors and chart-specific treatment — All routes
- [x] F125 First-class charcoal/dark theme with hairline-alpha surfaces and controlled violet accent — All routes
- [x] F126 Theme applied before first paint, persisted, synchronized across shell/product, and reversible — Global shell
- [x] F127 `prefers-reduced-motion` static charts, no rolling/particles, and cleared animation pools — All motion
- [x] F128 Mobile hamburger/bottom navigation containing Guide, Help, Email, Theme, and Connect — Mobile shell
- [ ] F129 Real 390px layouts: stacked hero, full-width rows, bottom-sheet drawers, and sticky primary action — Mobile routes
- [ ] F130 No horizontal overflow at 320-2560px, 40px touch targets, fixed component sizes, and tabular numerals — All routes
- [x] F131 Modal, drawer, popover, tooltip, accordion, selected, hover, focus, open, and closed visual states — Shared components
- [x] F132 Empty selection/list/filter states with recovery actions — Hazard Desk / Asset explorer
- [x] F133 Loading skeletons for assets, chart history, details, and submission surfaces — All data views
- [x] F134 API/chart/data error and retry states without blank canvases or silent failures — All data views
- [x] F135 CSV empty, selected, valid, invalid, loading, and loaded states — CSV drawer
- [x] F136 Wallet disconnected, connected, rejected, wrong-network, and configuration-error states — Wallet drawer
- [x] F137 Ended, Coming soon, final-price, and participation-disabled/allowed states kept explicit despite stale live copy — Market status
- [x] F138 Semantic HTML, accessible names, focus-visible rings, dialog focus traps, Escape policy, tooltips on focus, and colorblind-safe labels — All routes
- [ ] F139 Keyboard navigation, Back/Forward/deep links, and dead-control coverage for every button/link/input/tab/toggle — Quality gate

## Data Fields & Math
- [x] F140 Asset fields: ticker, group, `pdAnn`, `marketPd`, `consensusPd`, grade, category, `avg`, `scores`, and `note` — Thin data adapter
- [x] F141 Canonical 33-row asset roster with 7 ETH, 13 USD, 6 BTC, and 7 Funds memberships — Thin data adapter
- [x] F142 Credora grades (AAA/AA/BBB/BB/B/CCC/CC/C/D scale, observed A+..D and null) and categories for liquid restaking/staking, index, wrapped/centralized-custody derivatives, active/alternative/RWA stablecoins, and credit/fund tokenized assets — Risk Panel data
- [x] F143 Credora profile fields: `metrics_rating`, `address`, `rating_type`, `avg_risk_score`, `credora_slug`, and `risk_profiles[]` with `score`, `content`, `max_score`, `metric_name`, `display_order`; 32 profiles cover 33 assets and preserve the `weETH`→`eeth` alias — Risk Panel data
- [x] F144 Pool fields: pool/token IDs and names, pool liquidity, point liquidity, `sqrtPrice`, `token0Price`, `token1Price`, and `periodStartUnix` — History adapter
- [x] F145 Real 35-series chart data versus the 33 UI assets, including `NOTOALLPD`/No to All, asset-name decoding, and per-series point counts — History adapter
- [x] F146 Market fields: id, market name, outcomes, parent outcome, template, answers/arbitration, opening/finalize timestamps, encoded questions, bounds, payout fields/supply, block timestamp, type, wrapped tokens, collateral tokens, collection, condition, question, and factory; reconcile 35 API outcomes with 33 UI assets — Market adapter
- [x] F147 Annual-to-quarterly formula `PDq = 1-(1-PDa)^(1/4)` used consistently everywhere — Math layer
- [x] F148 Survival, hazard `lambda=-ln(1-PD)`, portfolio survival, hazard-share, proportional rescale, and logarithmic slider mapping — Math layer
- [x] F149 Pool-price-to-annual-PD history conversion, final-point scaling to live market PD, and missing-series fallback — History adapter
- [x] F150 Real saved API JSON through a thin deterministic adapter with identical IDs, units, rounding, and single-source values across list/detail/chart/CSV — Data layer

## Requirements comparison additions
- [x] F151 Guided spotlight tour with Previous/Next/Finish, route context, restart, and retained guide links — Header Guide / mobile Tools
- [ ] F152 Every primary route stays within two viewport heights at desktop and mobile sizes — Browser layout gate
- [x] F153 Route-specific view/horizon controls only appear where they change visible content — Workspace toolbar
- [x] F154 Asset dossier exposes peers, annual hazard and saved-history context — Asset dossier
- [x] F155 Original pool fields and full market-record JSON can be inspected and exported — Over time / Asset dossier source disclosure

## Audit status
See `AUDIT.md` for per-item code/entry-point evidence and remaining dependencies. F006 is unchecked because the reachable notification flow signs a local preference; it does not subscribe to email delivery. F095/F117/F118/F119/F122 need external services or transaction configuration. F129/F130/F139/F152 require real browser validation; the sandbox rejects the local server port and browser launch. No fake authentication, submissions, or delivery were introduced.

## NEW INFORMATION ARCHITECTURE
- `/risk` — **Hazard Desk**: one job, compare portfolio survival and see which assets drive risk; compact status strip, aggregate tide gauge, band atlas, and one primary Predict action.
- `/risk/assets` — **Risk Explorer**: one job, find and compare assets; dense searchable table is primary, gallery is a tab, filters/sort/selection stay in the URL.
- `/risk/history` — **Movers & Time**: one job, understand change; 24h/7d movers first, then an opt-in log multi-line/ridge detail with isolate, zoom, and direct labels.
- `/risk/asset/:id` — **Asset Dossier**: one job, inspect one entity; identity, PD/hazard, survival history, Credora metrics, peers, contract/provenance, and LP/Trade links.
- `/risk/predict` — **Prediction Desk**: one job, set and submit estimates; No to All first, focused asset editor, CSV import/export, then a single wallet-gated submit action.
- Overlays — Guide tour, Help, Email, Wallet/Account, CSV import, and compact Credora popover; drawers on mobile and popovers/split panes on desktop.
- Each primary route fits within two viewports through tabs, bounded charts, drawers, and progressive disclosure; mobile replaces the rail with a bottom bar and sticky action.
- Light and dark are separate first-class compositions; every route keeps the same feature parity, focus order, and URL state.
- **Fresh idea — Survival Tide:** “Risk is a clock, not a label.” Each asset is a buoy whose hazard drains survival over time; severity bands are physical depth zones, not a legend.
- The aggregate is the tide level, violet marks the market, teal marks the user, and seeded default sparks reveal hazard; dragging the horizon re-drains the whole instrument.
- Direct labels, hazard-share highlighting, movers, and user-versus-market endpoints explain relationships that an odds card grid cannot.
- This is an editorial risk instrument, not a Polymarket reskin: no equal tile grid, decorative category colors, generic KPI strip, or passive market cards.
- **Explorer contract:** a Seer-wide Etherscan-like surface explores every market type—Categorical, Multi Categorical, Scalar, Multi Scalar, Futarchy, Risk, Opportunity, and Deep.
- Explorer search covers question, outcome, asset, collection, wallet, contract, condition, Reality.eth question/answer, Kleros dispute, factory, and transaction identifiers.
- Explorer filters cover market type, network, status, collection, creator/oracle, time, liquidity/volume, and resolution state; results use dense sortable entity tables.
- Explorer detail pages expose market identity, outcomes, timeline, liquidity/trading, wrapped/collateral tokens, collection, condition/question, dispute/answer, and chain provenance.
- Every entity has stable deep links, copy/share utilities, explorer outbound links, and cross-links between Risk assets, Seer markets, LP/trade surfaces, and protocol records.
- No feature is lost: every checklist item is reachable through these routes, tabs, drawers, popovers, command search, or explicit disabled states with reasons.
