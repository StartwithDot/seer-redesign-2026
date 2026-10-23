# Deep Feature Inventory

## V4 QA repair
- Restored canonical theme persistence, mobile product navigation, full-domain fan values, probability-ranked Top 10, and per-outcome trade ticket resets.
- Fixed context truncation, title wrapping, shared table alignment, chart label spacing and excessive empty-state height.
- Scoped/global TypeScript, standalone bundle and source regressions pass. Browser rendering remains unverified due to socket EPERM and Chrome SIGABRT. See VISUAL-REVIEW.md for the ten-item audit.

## Current `/deep` redesign, 2026-10-23
- Rebuilt the root market surface with a sticky Seer suite nav, one horizontal round/status/category/sort/search tool row, a visible Deep Funding asker, evaluator-judgment framing, and the required “or an agent via API” use copy.
- Added a real many-outcome fan chart from the recorded repository histories. It has 1D, 1W, and All ranges, direct end labels, crosshair inspection, keyboard-selectable lines, shared outcome isolation, and URL-backed selection.
- Replaced the former left repository rail with a virtualized sortable outcome table. Tabs cover All outcomes, Top 10, My positions, Agent activity, and Discussion. Rows expose rank, probability, 1W change, volume, unavailable trader data, uploaded agent forecasts, persistent stars, keyboard movement, and detail routing.
- Added the permanent desktop trade rail with wallet setup, selected outcome, honest buy/sell preview, selected price history, participant-type disclosure, related outcomes, and existing Funds and Predictions flows. No signing or transaction is fabricated.
- Added a true mobile stack with horizontally scrollable tools and a fixed trade launcher that opens the trade rail as a bottom sheet with a visible close control.
- Theme is dark by default and synchronizes `localStorage['seer-theme']`, the app shell preference, and `<html data-theme>`. Light mode has independent surfaces and contrast tokens.
- Still unsupported: verified trade-wallet creation, deposits, conversions, withdrawals, liquidation, rebalance, execution progress, and public profile signing. F110 through F112, F124 through F132, and F151 remain unchecked where a verified adapter is absent.
- Verification passed: scoped TypeScript, standalone production bundle, passes 10 through 12, current and Step 3 audits, reachability regressions, 58 source contrast pairs, and redesigned-button handler checks. Browser rendering remains blocked by socket `EPERM` and Chrome `SIGABRT`, so F157 through F160 stay unchecked.

## Previous Step 3 audit checkpoint
- 17 unchecked items. F051 is implemented through an abortable account API request and reachable account drawer. F151 is now unchecked because public profile signing and persistence lack a verified service; Save draft remains available.
- Fixed chart inspection truncation, SVG pointer coordinates, series checkbox visibility, DOWN styling, exact contest price range, Swarm magnification/collisions/area encoding, missing token units and DOWN time range, CSV lifetime, profile deep links and missing merged-wallet identities.
- Added F166–F172 from the reference app, product spec and field audit: repository CSV export, outcome identities, merged-wallet address links, Split forecast markers, Swarm visibility, mobile ranking sort and honest profile drafts.
- Source review and regression checks cover every checked item. Scoped TypeScript and the standalone Deep production build pass; the repository-wide build now hits unrelated RiskOverview prop errors. Browser-wide gates F157–F160 remain unchecked: Vite listen fails EPERM and Chrome exits SIGABRT before navigation. No rendered light/dark or <=2 viewport claim is made.

- [x] F166 Repository market CSV export with identity, stored and displayed UP/DOWN, sum and residual; reachable in the repository inspector.
- [x] F167 All recorded outcome series identities, including Invalid result and missing last prices; Pool data → Recorded outcome series.
- [x] F168 Original merged-wallet address lists for each recorded leaderboard period, with Optimism explorer links from the wallet inspector.
- [x] F169 Loaded forecast UP markers in Split price bars, sharing predictions with Swarm rings and tethers.
- [x] F170 Swarm Hide all/Show all controls with an explicit hidden state; repository search continues to filter marks.
- [x] F171 Mobile ranking sort for every table column and both directions, preserving desktop sorting functionality when the table header is hidden.
- [x] F172 Save profile draft with device/session fallback; publishing stays explicitly disabled until a verified signing service is available.


## Step 3 audit result
- 17 unchecked items. F051, F131 and F132 were unchecked because account discovery and trade-wallet rejection/unknown states are fixtures or unreachable without a transaction adapter.
- Restored six archives with recorded histories, corrected contest kinds, all four real leaderboard periods and API profiles. Added F163–F165 below.
- Fixed market-weight export, default fabricated predictions, CSV validation, median, duplicate rail columns, Swarm axes and mobile guide navigation. Uploaded predictions persist with a session fallback.
- Browser verification attempted: Chrome exits SIGABRT with kill EPERM. Rendered light/dark, <=2 viewport scroll, responsive and exhaustive keyboard/dead-control gates remain unverified. F157–F160 remain unchecked.

- [x] F163 Archived API histories and outcome identities for all six supplied ended-contest fixtures; unavailable paired prices stay unavailable.
- [x] F164 Independently recorded 1D, 1W, 1M and All leaderboard rows, original timestamps/limits, and nullable ROI without invented returns.
- [x] F165 Uploaded prediction persistence and honest empty initial state; market weights export actual market prices independently of uploaded predictions.

## Previous pass: balance integrity and remaining dependencies
- Completed 0 additional full checklist items; 148 checked and 14 remaining. This checkout already contains the shell, theme, routing and prior build passes.
- Funds now reports the block and UTC read time for its connected-wallet balances. The snapshot is cleared on refresh and account/network/session changes; partial token failures remain unavailable.
- Positive balances smaller than display precision now show a less-than amount instead of zero, including connected-wallet assets, conversion source labels and market holdings.
- Holdings reads reject malformed network identifiers and unsafe block numbers, and recheck Optimism after the batch. All capital operations remain unavailable without verified trade-wallet discovery, factory and transaction integration. F110–F112 and F124–F130 remain unchecked.
- Validation passed: repository and scoped TypeScript, pass 10/11/12 data checks and production build to `/private/tmp/deep-pass12-build`. The build retains a non-fatal large-chunk warning. All Deep implementation files remain under 400 lines.
- Browser QA attempted again: Vite cannot listen on 127.0.0.1:5188 (EPERM), and Chrome exits SIGABRT before loading a page. F157–F160 remain unchecked. No rendered light/dark, responsive or keyboard verification is claimed.

## Global Shell, Navigation, Links, And Theme
- [x] F001 Seer suite brand link from Deep: sticky `/deep` header returns to the Seer homepage.
- [x] F002 Product navigation and Deep active state: sticky suite nav across Explorer, Deep, Futarchy, Opportunities, Risk, and Docs.
- [x] F003 Leaderboard navigation and route: horizontal `/deep` tool row links to `/deep/leaderboard`; leaderboard analysis retains its top-wallet labels.
- [x] F004 Guide entry point and full Deep documentation link: visible Guide control on desktop and mobile opens the existing drawer.
- [x] F005 Connect wallet action and disconnected state: header wallet button plus sticky trade-rail setup block.
- [x] F006 Connected wallet identity, short address, and wallet menu: header wallet button.
- [x] F007 Disconnect action and connected-to-disconnected reset: wallet menu; reset Desk and leaderboard rank state.
- [x] F008 Profile entry only while connected: wallet menu; opens the Profile dialog.
- [x] F009 Light and dark theme toggle with persisted `seer-theme` preference: global header utility; pre-paint `data-theme`.
- [x] F010 Browse on Seer cross-app callout to the Optimism market explorer: global footer.
- [x] F011 Kleros, Telegram, X, and GitHub footer links: global footer link cluster.
- [x] F012 Explorer, Deep, Futarchy, Opportunity, and Risk product links: global Seer footer.
- [x] F013 Optimistic Etherscan wallet/profile link and copyable full address: Profile/account popover and wallet detail.
- [x] F014 Protocol provenance links to Reality.eth and Kleros where market identifiers are available: repository detail provenance drawer.
- [x] F015 TradingView attribution link when TradingView is used, or an explicit omission note when it is not: chart footer metadata.

## Contest, Round, Archive, And Summary
- [x] F016 Contest switcher with checked current contest: Round select in the horizontal market toolbar.
- [x] F017 Archive access with seven ended contest names and ended status: Round and Status controls route into the contest archive.
- [x] F018 All contests aggregate view with count, contest rows, and global leaderboard link: `/deep/contests`.
- [x] F019 Pinned/open contest tabs with selected state and close control for ended tabs: sticky horizontal strip on contest routes.
- [x] F020 Round 3 · Originality live snapshot identity and selected state: `/deep` title and metadata row.
- [x] F021 Zcash · NU7, Zcash · Grants, Octant, Round 2 · L2, Round 2 · L1, Round 2 · Originality, and Round 1 archive entries: contest menu and `/deep/contests/:id`.
- [x] F022 Contest kind, LIVE/ENDED status, market count, and latest price range: contest overview table.
- [x] F023 Archived contest chart with real history or a data-unavailable empty state: `/deep/contests/:id` chart pane.
- [x] F024 Archived YES/NO, UP/DOWN, multi-outcome, and single-price contest adaptations: `/deep/contests/:id` market view.
- [x] F025 Archived YES versus NO or UP versus DOWN leg toggle: contest chart toolbar.
- [x] F026 Archived Hide all/Show all, search outcomes, price/name sort, and row selection: contest market list and chart.
- [x] F027 Archived proposal/outcome, group, market price, paired price, balance, predicted, and difference columns: contest market table.
- [x] F028 Export current archived market view as CSV: contest market toolbar.
- [x] F029 Ended/data-not-in-live-API state without invented contest statistics: archived contest detail.
- [x] F030 Repository/proposal count and median UP or YES price: compact contest stat line.
- [x] F031 Total volume and total liquidity as reported, with units and approximation marking: compact contest stat line.
- [x] F032 Refresh volume action with busy, success, and failure states: volume statistic control.
- [x] F033 Last trade timestamp and timezone: compact contest stat line.
- [x] F034 Asked by, what is priced, and how to use the signal context strip: root context row names Deep Funding and includes “or an agent via API”; archives retain their context disclosure.

## Market, Chart, Pool, Profile, And API Data
- [x] F035 Market id, repository name, owner, repository slug, and open market status: repository rows and detail identity block.
- [x] F036 UP price as share of original work, stored to 6 decimals and displayed to 4: split rows, charts, inspector, and CSV export.
- [x] F037 DOWN price as dependency share, stored to 6 decimals and displayed to 4: split rows, pair charts, inspector, and CSV export.
- [x] F038 UP+DOWN sum, residual `1 − UP − DOWN`, unpriced gap, and over-1 amount: split bar, inspector, and Swarm residual layer.
- [x] F039 First UP price, current change since Oct 1, and rank/change context: row delta, inspector, and Swarm drift layer.
- [x] F040 UP/DOWN minimum, maximum, price-change count, and time range: repository inspector.
- [x] F041 Per-market volume and liquidity in tokens and market units: repository inspector and refresh adapter.
- [x] F042 Wrapped outcome tokens, parent outcome, parent wrapped tokens, and parent market status: market provenance drawer.
- [x] F043 Middle-market ids and payout-reported flags: contest/market provenance drawer.
- [x] F044 Pool liquidity, tick, token0, token1, ticks, fee tier, and pool price for UP and DOWN pools: repository technical drawer.
- [x] F045 Chart market id, outcome id, outcome name UP/DOWN/Invalid result, and last price: chart data adapter.
- [x] F046 Chart points as Unix timestamp and price pairs, deduplicated into horizontal step endpoints: time chart and replay.
- [x] F047 Total volume/liquidity market strings and token totals per chart market: totals adapter and tooltips.
- [x] F048 Leaderboard scope, period, sortBy, sortDir, unit, updatedAt, total, limit, and offset: leaderboard metadata.
- [x] F049 Leaderboard rank, address, P/L, volume, ROI, market count, and merged wallets: leaderboard table and map.
- [x] F050 Profile display name, avatar, and X handle returned by the profiles API: leaderboard identity resolution.
- [x] F051 Redeemable checkedAt, wallets, and executors account response: wallet/redeemable status drawer even when empty.
- [x] F052 Contest id, name, kind, live flag, rows, and market count: contest router and overview.
- [x] F053 Contest row id, name, group, primary price, paired price, UP history, and DOWN history: archived contest adapter.

## Split View And Time Figure
- [x] F054 Share of original work over time plus the default many-outcome field: Fan and History chart headers.
- [x] F055 Fan, History, and Swarm view switch persisted in `view` URL state: chart-card toolbar.
- [x] F056 Expand chart dialog, `F` shortcut, Escape close, focus trap, and focus restoration: full-screen chart overlay.
- [x] F057 UP versus DOWN series toggle: time figure chart controls.
- [x] F058 1D, 3D, 1W, and All time ranges: time figure chart controls.
- [x] F059 Lens scale focused on 0.55–0.95 for UP or 0–0.45 for DOWN versus full 0–1 scale: time figure scale toggle.
- [x] F060 Show top ten series by default and Show all matching series: time figure visibility control.
- [x] F061 Hide all and Show all series control: time figure and shared list state.
- [x] F062 Replay and Stop control with animated time progression and reduced-motion fallback: time figure toolbar.
- [x] F063 Ninety-eight horizontal UP or DOWN step series drawn from real price points: time figure SVG with accessible list twin.
- [x] F064 p10–p90 distribution band computed independently for UP and DOWN: time figure envelope.
- [x] F065 Median series and exact median value: time figure envelope and labels.
- [x] F066 Hover crosshair with UTC date/time and isolated or median value: time figure interactive readout.
- [x] F067 Repository tooltip with name, leg, price, and UTC timestamp: chart hover preview.
- [x] F068 Left/right keyboard movement by one recorded trade and live caption update: keyboard-accessible time figure.
- [x] F069 Shared repository isolation on hover, focus, selection, and URL `iso`; non-selected lines dim to 20%: all field views.
- [x] F070 Expanded direct labels for top, bottom, and selected repositories with collision avoidance: expanded chart.
- [x] F071 Expanded repository filter and ranked value list beside the chart: expanded chart side rail.
- [x] F072 Exact price grid, UTC Oct date ticks, NOW rule, and dashed cursor rule: time figure axes.

## Swarm Field
- [x] F073 Exact UP axis with a labelled ×3.3 lens over 0.65–0.85 and the 91-of-98 concentration note: Swarm view.
- [x] F074 One collision-dodged repository dot per market, positioned exactly by UP price: Swarm SVG.
- [x] F075 Dot size encodes liquidity and the tail starts at Oct 1 UP price: Swarm marks.
- [x] F076 Drift tail color encodes positive or negative movement since Oct 1: Swarm drift encoding.
- [x] F077 Giant replay date and median marker behind the live field: Swarm temporal context.
- [x] F078 UP price layer: Swarm layer switcher.
- [x] F079 Unpriced gap layer with amber gap and red overlap semantics: Swarm layer switcher.
- [x] F080 Drift since first trade layer: Swarm layer switcher.
- [x] F081 Volume layer with area-scaled dots: Swarm layer switcher.
- [x] F082 Your predictions layer, disabled until predictions are loaded · Swarm layer switcher.
- [x] F083 Prediction rings and tethers from market price to user prediction · Swarm prediction overlay.
- [x] F084 Pointer picking, hover preview, click selection, and selected inspector overlay · Swarm SVG.
- [x] F085 Replay strip with play/pause, p10/p50/p90 envelope, scrubber, NOW line, and Oct date ticks · Swarm bottom timeline.
- [x] F086 Time chart return button and reduced-motion morph/crossfade behavior · Swarm toolbar.

## Repository List, Inspector, And Detail
- [x] F087 Repository count and filtered result count: horizontal search output and All outcomes tab.
- [x] F088 Search outcomes with URL `q`, live filtering, and Clear filters: horizontal toolbar and zero-result table state.
- [x] F089 Market versus Positions workflow: market rows plus the My positions tab backed by verified wallet reads.
- [x] F090 Sort menu: probability, volume, Repository A–Z, Repository Z–A, 1W change, and loaded forecast difference: horizontal toolbar.
- [x] F091 Direct sortable Outcome, Probability, 1W change, and Volume headers with current sort state: virtualized table header.
- [x] F092 Stable rank number and owner/repository name with truncation: virtualized outcome row.
- [x] F093 Real UP/DOWN proportions: selected-outcome pair bar; table rows show the UP probability bar.
- [x] F094 Current UP and DOWN market values to four decimals: selected outcome card and repository detail.
- [x] F095 Signed 1W market change: outcome row and selected outcome card.
- [x] F096 Loaded agent forecast or explicit not-reported state: Agent activity tab and outcome rows.
- [x] F097 UP and DOWN prediction differences: existing Predictions review flow.
- [x] F098 UP and DOWN difference explanations with dismiss control: existing Guide and difference-help components.
- [x] F099 Row hover/focus isolation, URL selection, and pointer-leave reset: table and fan chart.
- [x] F100 Row click selects the outcome and updates the permanent right-hand inspector and trade rail.
- [x] F101 Row double-click or Enter opens repository detail; Up/Down arrows move virtualized row focus.
- [x] F102 No outcomes match state and Clear search/category action: fan and outcome table.
- [x] F103 Repository inspector fields: name, UP, Oct 1, change, DOWN, residual, range, changes, volume, and liquidity: Repository dock and overlays.
- [x] F104 Repository detail breadcrumb/back link and Escape-to-return behavior: `/deep/repo/:owner/:repo`.
- [x] F105 Isolated repository UP and DOWN step chart with legend and Oct 1–18 axes: `/deep/repo/:owner/:repo`.

## Trade Desk, Predictions, Execution, And Funds
- [x] F106 Dock tabs Desk, Repository, and Funds with one active workspace: desktop dock and mobile Desk tab.
- [x] F107 Three-step setup ledger: Connect wallet, Create trade wallet, Add sUSDS: Desk setup panel.
- [x] F108 Setup 1/3 progress counter synchronized with wallet and funding state: header wallet button and Desk.
- [x] F109 Connect wallet step action, active/done/pending states, and prerequisite tooltip: Desk setup step 1.
- [ ] F110 Create trade wallet action and owned-contract explanation: Desk setup step 2.
- [ ] F111 Create trade wallet pending, creating, success, and rejected states with honest unknown transaction state: Desk setup step 2.
- [ ] F112 Add sUSDS step action, settlement/yield explanation, and funded balance: Desk setup step 3.
- [x] F113 Predictions empty state, loaded count, and readiness status: Desk predictions panel.
- [x] F114 CSV file picker accepting `.csv` and drag-and-drop upload: Desk predictions panel.
- [x] F115 Download sample predictions CSV with `repo,predicted` rows: Desk predictions panel.
- [x] F116 CSV parser support for UTF-8 BOM, quoted two-column rows, and case-insensitive repository names: upload utility.
- [x] F117 CSV errors for wrong header, wrong row columns, unknown repository, invalid/out-of-range prediction, duplicate repository, empty file, and unreadable file: inline upload error list.
- [x] F118 Pending prediction count and Load Predictions confirmation: Desk predictions panel.
- [x] F119 Export market weights CSV with `repo,up,down` and four-decimal values: Desk predictions panel.
- [x] F120 Review table fields: current market prices, predicted prices, UP/DOWN token balances, and market-to-prediction differences: Positions repository mode.
- [x] F121 Strategy checklist for wallet, trade wallet, sUSDS balance, and predictions CSV: Desk execution panel.
- [x] F122 Starting sUSDS amount input for a new strategy, with positive/available-balance validation: Desk execution panel.
- [x] F123 Start Trading / Execute Strategy action with missing-prerequisite tooltip and disabled state: Desk execution panel.
- [ ] F124 Per-market execution progress, staged checklist, completion state, and retry/failure state: Desk execution panel.
- [ ] F125 Funds drawer with sUSDS, USDC, USDS, and market holdings balances: Funds dock tab and drawer.
- [ ] F126 Deposit sUSDS amount input and deposit action with validation and status: Funds drawer.
- [ ] F127 Convert from USDC or USDS menu and conversion action with source-balance validation: Funds drawer.
- [ ] F128 Withdraw sUSDS amount input and withdrawal action with validation and status: Funds drawer.
- [ ] F129 Sell All to sUSDS action with holdings prerequisite, confirm, cancel, partial-liquidity warning, and gas warning: Funds drawer.
- [ ] F130 Rebalance action using existing balances when the starting sUSDS input is empty: Funds drawer and strategy panel.
- [ ] F131 Wallet connection and trade-wallet rejection alerts with Dismiss action: global alert region.
- [ ] F132 Mock transaction/signing rejection and transaction-state UNKNOWN honesty; no fabricated wallet signing: all wallet-gated flows.

## Leaderboard And Wallet Landscape
- [x] F133 `/deep/leaderboard` title, description, and all-deep-markets scope: leaderboard screen.
- [x] F134 1D, 1W, 1M, and All period switch with URL persistence: leaderboard toolbar.
- [x] F135 All deep markets selector with the real available option: leaderboard toolbar.
- [x] F136 Replay periods through 1D, 1W, 1M, and All with Stop control: leaderboard toolbar.
- [x] F137 Search by address with live matching and Clear search empty state: leaderboard toolbar.
- [x] F138 Table + Map, Table, and Map view switch: leaderboard layout control.
- [x] F139 Wallet count, total volume, and winners/losers summary: leaderboard toolbar.
- [x] F140 Ranked table columns #, Account, Profit/Loss, Volume, ROI, Markets, and unavailable Score: leaderboard table.
- [x] F141 Sortable leaderboard headers, selected row, keyboard activation, profile name/avatar resolution, identicon fallback, and P/L bars: leaderboard table.
- [x] F142 P/L against volume map with signed-log P/L, log volume, explicit axes, wallet dot size, merged-wallet rings, and collision fan-out: leaderboard map.
- [x] F143 Top-three winner and top-two loser direct labels, hover/selection linking, and wallet tooltips: leaderboard map.
- [x] F144 Winner/loser concentration bars and ROI comb distribution: leaderboard analysis panel.
- [x] F145 Wallet inspector with rank, address, P/L, volume, ROI, markets, merged wallets, and rank in every period: leaderboard side drawer.
- [x] F146 Follow/unfollow wallets, persistent Following list, compare up to three wallets, and removable comparison chips: leaderboard wallet drawer.
- [x] F147 Your rank states: disconnected, connected-not-ranked, and ranked when data exists: leaderboard toolbar and wallet drawer.
- [x] F148 Leaderboard loading skeleton, zero-wallets empty state, request error, map error, and Retry: leaderboard screen.

## Profile, Guide, Search, And Cross-Cutting States
- [x] F149 Profile dialog with display name maximum 32 characters and live character count: connected wallet menu.
- [x] F150 Profile avatar upload/drop for PNG/JPEG/WebP/GIF up to 500KB plus HTTPS image URL alternative: Profile dialog.
- [ ] F151 Profile X handle, live row preview, validation errors, Cancel, and Sign and save: Profile dialog.
- [x] F152 Profile persistence fallback to memory when local storage is unavailable and honest mock-signing rejection: Profile dialog.
- [x] F153 Guide tabs Start here, Read the market, Trade, and Glossary with arrow-key navigation: Guide drawer.
- [x] F154 Six-step guided flow with Do it now jumps: Connect Wallet, Create Trade Wallet, Get sUSDS, Deposit to Trade Wallet, Upload CSV Predictions, Execute Strategy: Guide drawer.
- [x] F155 Guide explanations for UP/DOWN, sum, unpriced/over-1, difference, Split/chart/Swarm, complete sets, Score, and trade-wallet risk: Guide drawer.
- [x] F156 Command search opened by `/` or Ctrl/Cmd+K, repository results, keyboard selection, no-match state, Escape, and focus restoration: global search dialog.
- [ ] F157 Loading, empty, error, disabled, busy, success, rejected, LIVE, ENDED, disconnected, connected, funded, and executing states across every screen: shared state system.
- [ ] F158 Light and dark first-class surfaces, contrast, colorblind-safe hatching/labels, persisted theme, and theme crossfade: shared product theme.
- [ ] F159 Responsive 1440 desktop and 390 mobile layouts with a sticky vertical desktop trade rail, horizontal mobile tools, stacked fan/list content, bottom-sheet trading, touch targets, and no horizontal page scroll: all screens.
- [ ] F160 Semantic HTML, focus-visible, keyboard navigation, ARIA labels/current/pressed states, tooltips, dialog focus traps, and reduced motion: all screens.
- [x] F161 Shareable/copyable deep links for `/deep`, `/deep/leaderboard`, repository details, contest ids, and `round/view/q/iso/sort/period/dialog` state: global routing utility.
- [x] F162 Back/forward history, deep-link restoration, scroll reset on route change, and retry query-state cleanup: global routing utility.

## NEW INFORMATION ARCHITECTURE
1. `/deep`: **Read the field**: a sticky suite nav and horizontal tools lead into the asker/priced/use context, evaluator question, Fan|History|Swarm instrument, virtualized outcomes table, and permanent vertical trade rail.
2. `/deep/contests`: **Choose a contest**: one dense typographic table for all eight contests, with LIVE/ENDED, type, market count, range, and a link to the global leaderboard.
3. `/deep/contests/:id`: **Read one past contest**: chart plus searchable ranked outcomes, with leg toggle and CSV export; unavailable API values remain visibly unavailable.
4. `/deep/repo/:owner/:repo`: **Inspect one repository**: identity/provenance, UP|DOWN|residual, metrics, one isolated history chart, and links back to its field.
5. `/deep/leaderboard`: **Compare wallets**: table/map/both views and a wallet drawer; one selection links every ranking, metric, and comparison control.
6. Capital actions live in the trade rail and Funds drawer. Predictions retain their CSV upload/review/export flow. Unsupported transaction actions remain disabled or end in an explicit no-signing-adapter state.
7. Drawers and dialogs absorb secondary jobs: Guide, Funds, Predictions, Profile, wallet/account, provenance, expanded history, leaderboard wallet, and command search.
8. Desktop targets roughly two 900px viewports through the virtualized table. The right rail is sticky, internally scrollable, and never rotates into a horizontal desktop panel.
9. Mobile uses a stacked context, question, chart, and list with horizontal tools and a fixed trade launcher. Trading opens as a bottom sheet with a visible close control and safe-area spacing.
10. Empty, unavailable, loading, error, disconnected, connected, and honest preview states remain distinct. Unsupported funded/executing states are not fabricated.
11. **Creative idea: the probability fan.** One evaluator question enters from the left and branches through recorded histories into many labelled repository outcomes. History and Swarm retain the deeper analytical lenses.
12. Uploaded agent predictions appear as tethered votes that converge toward or diverge from market consensus; replay shows the field forming over Oct 1–18, so motion explains disagreement rather than decorating it.
13. The visual grammar follows the EF line motif: one field enters the instrument and branches into 98 named outcomes, with direct labels, measured axes, hatching, and editorial data sentences.
14. This is deliberately not a Polymarket reskin: there is no odds-card grid or generic KPI wall. The many-outcome field remains primary while the trade preview stays secondary and honest.
15. **Explorer handoff:** Browse on Seer opens the Etherscan-like explorer across all Seer market types, with search by market/outcome/collection, filters, chain/collection/status metadata, liquidity/volume analytics, and deep links from Deep markets and wallets.
16. Theme is `localStorage['seer-theme'] = 'light' | 'dark'`, applied as `data-theme` before first paint and designed independently for contrast and readable chart series.

## Build pass 7 verification and limitations
- Completed 14 checklist items: F120, F123, F131–F141, F147.
- Connected-wallet sUSDS, USDC and USDS balances use read-only Optimism RPC calls, with loading, refresh, partial-read and request-error states. Unread trade-wallet and outcome balances remain unavailable.
- Removed generated holdings, preview funding, one-to-one conversion, simulated deployment success and fabricated execution progress. Unsupported requests never sign or submit a transaction.
- F110–F112, F124–F130 remain unchecked: this checkout provides no verified trade-wallet factory/executor, owned-wallet discovery or transaction adapter. A rejected creation request is not a successful deployment.
- Period controls are functional, but only the bundled all-time reference rows exist. Shorter periods show unavailable states instead of scaled invented results. Summary counts match the rows. Reference data is explicitly labelled and is not presented as a live ranking.
- Scoped TypeScript and standalone Deep production bundle pass. Data checks cover token call encoding, decimals, partial failures, zero balances, invalid responses, wrong network, address validation, unavailable periods and summary consistency.
- Browser QA attempted: sandbox denies the Vite listening socket and Chrome exits with SIGABRT/EPERM. Responsive visual and browser interaction verification remains outstanding; no screenshots were fabricated.

## Build pass 8 verification and limitations
- Completed 13 checklist items: F142–F146 and F149–F156.
- Wallet landscape uses signed-log P/L and log volume with explicit USD axes, market-count sizing, merged-wallet rings, collision fan-out, direct labels, keyboard selection and exact readouts. Analysis uses the available rows, without estimating missing periods.
- Wallet inspector includes available period ranks, device-persisted following with session fallback, and up to three removable comparisons. Account data remains explicitly labelled as a bundled reference dataset.
- Profile editor supports bounded names, image upload/drop, HTTPS alternatives, X handles, preview and validation. Sign and save explicitly rejects unsupported signing and retains only a local draft, with memory fallback. No public profile is changed.
- Guide provides four keyboard-navigable tabs, six actionable workspace jumps, market explanations and risk context. Global repository search supports slash and Ctrl/Cmd+K, keyboard results and focus restoration.
- Fixed dialog initial focus, stable focus during editing, unique title ids, disabled-control exclusion and body scroll lock.
- F110–F112 and F124–F130 remain blocked by missing verified trade-wallet discovery, factory and transaction adapters. F148 and the remaining cross-cutting gates are not claimed complete.
- Scoped `npx tsc --noEmit -p src/products/deep/tsconfig.json` and standalone Deep bundle pass. Data checks cover signed-log symmetry, finite geometry, ten coincident wallets, concentration, empty data and unavailable-storage fallback.
- Browser QA attempted again: Vite listen is denied with EPERM; Chrome launch exits with SIGABRT. Dual-theme responsive browser verification remains outstanding. No screenshots claimed.


## Build pass 9 verification and limitations
- Completed 3 checklist items: F148, F161, F162. 14 remain unchecked.
- Leaderboard reads the existing, explicitly labelled reference dataset through a separate versioned JSON asset request. Loading skeletons, validated rows, empty snapshot, HTTP/JSON request errors and retry are implemented. Shorter periods remain unavailable. Map rendering has an isolated error boundary with retry and a table fallback.
- Share view exposes a selectable, copyable URL on every Deep route. Field lens, repository sort, search, isolated outcome, leaderboard period/view/search, chart expansion and Guide use URL state. Legacy round links resolve contests. Transient jump/retry/error parameters are excluded from shared URLs.
- Fixed query loss during nested-route bootstrap, root URLs with query strings, malformed route handling, and stale chart/sort state after history navigation. Deliberate view/sort/period/dialog changes create history entries; search, hover and replay replace them. Internal links preserve native modifier-click behavior and otherwise use Deep routing. Route changes reset scroll; retry preserves filters and removes retry/error flags.
- Read-only wallet balances and the existing real repository-owner imagery remain intact. No trade-wallet discovery/factory/executor adapter is available in this checkout. F110–F112 and F124–F130 remain unchecked; no successful transactions, holdings or execution progress were fabricated.
- Validation passed: scoped `npx tsc --noEmit -p src/products/deep/tsconfig.json`, repository `npx tsc --noEmit`, and a standalone Deep production build including the separate JSON asset. Direct assertions passed for bootstrap/query preservation, history, sort/dialog restoration, duplicate history suppression, share cleanup, reference-row validation, empty/invalid/duplicate data, unavailable periods, HTTP/JSON failures and recovery.
- Browser QA attempted: Vite cannot bind 127.0.0.1:5188 (EPERM), and Chrome exits with SIGABRT in this sandbox. Responsive, contrast and full accessibility gates F157–F160 remain unchecked. No browser screenshots or visual verification are claimed.

## Build pass 10 verification and limitations
- Completed 0 full checklist items; 14 remain unchecked. The remaining items combine verified transaction capabilities and browser-wide quality gates. Partial implementation is not counted as completion.
- Added connected-wallet UP/DOWN holdings reads across the recorded market-token addresses. Reads use one Optimism block, bounded concurrency, queried token precision, cancellation, progress, partial failures and retry. Failed token reads remain unavailable rather than zero; no liquidation value, sale quote or trade-wallet balance is invented. F125 remains unchecked because an owned trade-wallet address and its balances cannot yet be verified.
- Funds now expands into a URL-linked drawer, with unique accessible labels, actual conversion-source balance labels, amount validation and sale prerequisites. Sales and other capital actions remain disabled without a verified adapter. The repository's saved executor bytecode does not provide a verified discovery/factory/execution interface. Source retrieval failed because network resolution is unavailable. F110–F112 and F124–F130 remain unchecked.
- Mobile Chart/List/Desk/Board navigation is reachable from every route; workspace and dock state survive deep links and history navigation. Added stacked repository rows, touch targets, safe-area spacing, bottom-sheet dialogs, bounded desktop panels and mobile Swarm scaling. Market owner imagery remains the existing real GitHub imagery.
- Theme follows the landing CSS's paper, charcoal and violet, with session fallback, cross-tab synchronization, explicit primary-action text contrast and reduced-motion transitions. Direct assertions pass for 58 text/surface contrast pairs. Residual and overlap marks use distinct patterns; negative drift has dashed tails. F158 remains unchecked until the rendered routes are verified in both themes.
- Dialogs render through a portal, isolate background controls with inert, enforce topmost-dialog Escape/Tab handling and restore focus. Dock tabs and wallet/contest menus support arrow keys and Home/End. Fixed disconnected setup progress, inaccurate network labels, malformed account responses and stale wallet initialization/connection responses. F157, F159 and F160 remain unchecked pending full browser interaction and responsive QA.
- Corrected isolated repository chart spacing to use recorded timestamps and prediction tethers to use the same Swarm price scale as market dots.
- Passed scoped `npx tsc --noEmit -p src/products/deep/tsconfig.json`, repository `npx tsc --noEmit`, `node src/products/deep/verification/data-pass10.mjs`, and `npm run build -- --outDir /private/tmp/deep-pass10-build`. Existing repository chunk-size and unrelated dynamic-import warnings remain non-fatal. All Deep implementation files remain below 400 lines.
- Browser verification runner: `node src/products/deep/verification/browser-pass10.mjs`, with optional `DEEP_QA_URL` and `DEEP_QA_OUTPUT`. This sandbox denies Vite's listening socket (EPERM); Chrome launch exits SIGABRT with kill EPERM. No rendered screenshots or successful browser checks are claimed. The supplied landing screenshots are blank; landing CSS provided the visual reference.

## Current build request: remaining-item audit and fixes
- Started from the existing ten-pass implementation, with 148 checked features and 14 unchecked. Completed 0 additional full checklist items; 14 remain. The shell, theme and routing already exist, so they were preserved and audited.
- F157/F160 partial improvements: account and network events invalidate stale reads, malformed chain/account responses are rejected, network switching is confirmed with an RPC read, unattended wallet reads time out, and connected-wallet balance reads cancel on account/network changes. Approval prompts are not timed out. Initialization failures are visible and reconnectable.
- F157 partial improvement: filtering to zero repositories now shows an explicit chart empty state with Clear search instead of an instrument still reporting an unrelated selected outcome.
- F160 partial improvements: dialogs share one background/scroll lock that survives nested and out-of-order closure, includes newly inserted body siblings and restores original inert values. Focus trapping includes summary controls and excludes disabled/negative-tabindex controls. Route changes update the page title, announce the destination and focus main content when no dialog is open. The field heading hierarchy now starts with its h1.
- Removed the misleading Create/Retry availability loop. Trade-wallet creation is visibly unavailable with a linked explanation and a working handoff to the live Deep app. No deployment, signing, transaction, execution progress, funds or conversion rate is simulated. F110–F112 and F124–F130 remain unchecked because a verified trade-wallet discovery/factory/execution integration is missing.
- All seven supplied shots/land_d*.png references are entirely white (RGB extrema 255–255). Landing CSS supplies the visual reference. Existing real repository-owner GitHub imagery remains in use. No changes were made to src/seer-2026 or shared products.
- Validation: pass 10 and new pass 11 data checks pass, including strict wallet responses, cancellation, timeout, nested/out-of-order modal locks and dynamic background isolation. Repository TypeScript and production build pass; existing large-chunk warning remains. Deep source files stay below 400 lines.
- Browser QA remains blocked: Vite listen on 127.0.0.1:5188 fails EPERM and Chrome exits SIGABRT with kill EPERM. F158–F160 are not claimed complete without rendered dual-theme/responsive/keyboard verification; F157 also includes unsupported funded/executing states. No screenshots or successful browser checks are claimed.


## V4 final repair
- Trade estimates and honest review work without connecting a wallet; no signing or transaction is simulated.
- Fan chart preserves recorded history transitions. Mobile search is first in a wrapped toolbar; selected outcome readout remains visible.
- Short lists shrink to available rows; Enter selects an outcome and Alt+Enter opens details. Watchlist persistence and existing data flows remain intact.
- Unreported agent/human activity is text, without invented proportional bars. Product render errors show reload/live-app recovery.
- TypeScript and existing data checks pass. Rendered browser QA remains unverified because the sandbox rejects the Vite listening socket.

## V4 critique repairs
- Compact fan retains scale, snapshot dates, crosshair and selected-outcome readout. Labels explain independent originality-share markets.
- Watchlist filtering works across All outcomes, Top 10 and My positions. Outcome tabs support arrows, Home and End.
- Repository details have a visible action in the rail and mobile trade sheet. Invalid/zero token prices cannot produce trade previews.
- Weekly differences use percentage points; mini-history uses recorded step transitions and bounded price axes. Table scroll resets when filtered results change.
- Source control review and TypeScript/data checks passed. Browser visual QA remains blocked by Vite listen EPERM; blank supplied screenshots do not verify rendering.


## V4 art-direction and control repairs
- All six Guide task actions open current Funds, Agent forecasts or Trade preview dialogs; forecasts and preview use URL state and browser history.
- Chart view tabs support arrows/Home/End. Fan inspection supports arrows/Home/End/Escape; the isolated outcome receives a direct label.
- Tablet product menu exposes every product, mobile leading outcomes use a compact grid, and fan sizing removes forced desktop voids.
- Trade previews reject nonfinite estimates; saved price history extends its last recorded step to the snapshot marker. Watchlist empty states offer recovery.
- Source control review and TypeScript/data checks pass. Browser rendering remains unverified: local listen EPERM and Chrome SIGABRT.
