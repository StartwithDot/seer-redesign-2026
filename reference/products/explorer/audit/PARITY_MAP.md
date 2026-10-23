# PARITY_MAP.md

**Purpose.** Map every live Seer Explorer feature, control, flow, state, data field and chart to its location in the `explorer` redesign, and to the parity e2e test that proves it survives.

**Evidence column convention**
- `001`, `006`, `045`, `m1`, `scenario 01 / 06-*.png` — state ids under `audit/raw/`, `audit-types/raw/`, `audit/scenario-out/`. **Verified** (see VERIFIED OBSERVATIONS).
- `draft-only` — appears in the DeepSeek draft but **is not evidenced by any verified capture**. Test is written against the draft claim and must be re-confirmed against a screenshot before it is allowed to gate the build.

**Corrections applied where draft contradicts verified capture**
1. Home card footer figure `$27.74k` is **liquidity**, not volume (draft H-18). Volume appears in the hover breakdown (007).
2. Invalid outcome token value is **`210.85 SER-INVALID`** (draft said `9.00 SER-INVALID`).
3. State ids above `055` used by the draft (`056–069`, `070–090`) are not in the verified set; those rows are re-evidenced or marked `draft-only`.
4. Leaderboard sortable columns are **Score, Profit/Loss, Volume, ROI** only; `#`, `Account`, `Traded Markets` sorting is `draft-only`.
5. New-design-location cells use surface names (`Index`, `Market page`, `Ticket`, `Inspector`, `Leaderboard`, `Create`, `Menus`, `Collections`, `Global`, `Mobile`) + `TBD-concept` for layout.

---

## 1. Global shell / cross-screen

| ID | live feature/control/flow/state/data field | live state id (evidence) | new-design location | e2e test name |
|---|---|---|---|---|
| G-01 | Beta banner copy "Note that this is a Beta version and can still be unstable" | 001 | Global — TBD-concept | parity-beta-banner-visible-on-home |
| G-02 | Purple header bar containing all top-level nav | 001 | Global — TBD-concept | parity-header-bar-visible |
| G-03 | Logo mark linking to `/` | 001 | Global — TBD-concept | parity-logo-links-home |
| G-04 | Top-nav `Markets` → `/` | 001 | Menus — TBD-concept | parity-nav-markets-links-home |
| G-05 | Top-nav `Leaderboard` → `/leaderboard` | 001, 008, 009 | Menus — TBD-concept | parity-nav-leaderboard-links-leaderboard |
| G-06 | Top-nav `Create Market` → `/create-market` | 001, 027 | Menus — TBD-concept | parity-nav-create-market-links-create |
| G-07 | Chain icon in header | 001 | Menus — TBD-concept | parity-chain-icon-visible |
| G-08 | Wallet pill truncated address `0x0000...dEaD` | 001, 004 | Menus — TBD-concept | parity-wallet-pill-shows-truncated-address |
| G-09 | Account button labelled `24.69 xDAI` | 001, 004 | Menus — TBD-concept | parity-account-button-shows-balance |
| G-10 | Help icon in header | 001 | Menus — TBD-concept | parity-header-help-icon-visible |
| G-11 | Theme toggle `Switch to dark mode` / `Switch to light mode` | 001, 005, 013, 031 | Menus — TBD-concept | parity-theme-toggle-switches-label |
| G-12 | Dark theme = near-black surfaces + purple header | 005, 013, 031 | Global — TBD-concept | parity-dark-theme-applies-globally |
| G-13 | Theme toggle preserves page content | 005, 013, 031 | Global — TBD-concept | parity-theme-toggle-preserves-content |
| G-14 | Disconnected header shows `Connect`, no address/balance | 008 (draft-only for 015–016) | Menus — TBD-concept | parity-disconnected-header-shows-connect |
| G-15 | Menu overlay leaves underlying page visible/unchanged | 002, 003, 004 | Menus — TBD-concept | parity-menu-overlay-keeps-page-visible |
| G-16 | Recurring console 404 `rpc.walletconnect.org/v1/profile/reverse/<addr>` is a wallet profile lookup, not a Seer resource | runtime console | Global — not a UI surface (explicitly **not** a parity requirement) | parity-console-walletconnect-reverse-profile-404-not-seer-resource |

---

## 2. Menus

| ID | live feature/control/flow/state/data field | live state id (evidence) | new-design location | e2e test name |
|---|---|---|---|---|
| M-01 | `Policies` button opens menu | 002 | Menus — TBD-concept | parity-policies-menu-opens |
| M-02 | Menu item `Verified Market Policy` | 002 | Menus — TBD-concept | parity-policies-verified-market-policy-item-visible |
| M-03 | Menu item `Market Rules Policy` | 002 | Menus — TBD-concept | parity-policies-market-rules-policy-item-visible |
| M-04 | `App` button opens menu | 003 | Menus — TBD-concept | parity-app-menu-opens |
| M-05 | App item `Futarchy` (sister app) | 003 | Menus — TBD-concept | parity-app-menu-futarchy-item-visible |
| M-06 | App item `Deepfunding` | 003 | Menus — TBD-concept | parity-app-menu-deepfunding-item-visible |
| M-07 | App item `Foresight` | 003 | Menus — TBD-concept | parity-app-menu-foresight-item-visible |
| M-08 | App item `Opportunity Markets` | 003 | Menus — TBD-concept | parity-app-menu-opportunity-markets-item-visible |
| M-09 | Account button "24.69 xDAI" opens account menu | 004 | Menus — TBD-concept | parity-account-menu-opens |
| M-10 | Item `Account` | 004 | Menus — TBD-concept | parity-account-menu-account-item |
| M-11 | Item `Deposit` | 004 | Menus — TBD-concept | parity-account-menu-deposit-item |
| M-12 | Item `Portfolio` | 004 | Menus — TBD-concept | parity-account-menu-portfolio-item |
| M-13 | Item `Market Collections` | 004 | Menus — TBD-concept | parity-account-menu-market-collections-item |
| M-14 | Item `Trade Collateral` | 004 | Menus — TBD-concept | parity-account-menu-trade-collateral-item |
| M-15 | `Use smart account` toggle | 004 | Menus — TBD-concept | parity-account-menu-use-smart-account-toggle |
| M-16 | Account menu renders all six items + toggle simultaneously | 004 | Menus — TBD-concept | parity-account-menu-item-count |

---

## 3. Index (markets home, `/`)

### 3.1 Feed & cards

| ID | live feature/control/flow/state/data field | live state id (evidence) | new-design location | e2e test name |
|---|---|---|---|---|
| H-01 | Equal-tile market card grid, 4 columns | 001 | Index — TBD-concept | parity-index-card-grid-four-columns |
| H-02 | Infinite scroll loads additional markets | 001 | Index — TBD-concept | parity-index-infinite-scroll-loads-more |
| H-03 | No table view, no column sort header, no market-comparison affordance | 001 | Index — TBD-concept | parity-index-has-no-table-view |
| H-04 | Card title link → market detail `/markets/100/...` | 001 | Index → Market page | parity-index-card-title-opens-market-page |
| H-05 | Card question text (full sentence, may be long) | 001 | Index — TBD-concept | parity-index-card-question-text-renders |
| H-06 | Card avatar / market image | 001 | Index — TBD-concept | parity-index-card-avatar-renders |
| H-07 | Donut chart of outcome shares | 001 | Index — TBD-concept | parity-index-card-donut-chart-renders |
| H-08 | 2–3 legend rows: outcome label + percentage (e.g. `Yashar 60.9%`, `Yes 50%`) | 001 | Index — TBD-concept | parity-index-card-legend-outcome-percentages |
| H-09 | Card footer SEER logo | 001 | Index — TBD-concept | parity-index-card-seer-logo |
| H-10 | Card footer liquidity figure, `$` + `k` suffix (e.g. `$27.74k`, `$918.38`) | 001 | Index — TBD-concept | parity-index-card-liquidity-figure-format |
| H-11 | Tiny market status icon + verification icon in card footer | 001 | Index — TBD-concept | parity-index-card-status-and-verification-icons |
| H-12 | Hover breakdown tooltip button `Open interest and liquidity breakdown` | 007 | Inspector — TBD-concept | parity-index-card-hover-breakdown-tooltip-opens |
| H-13 | Tooltip field: Open interest `5.75k sDAI (7.26k $)` | 007 | Inspector — TBD-concept | parity-index-card-tooltip-open-interest-dual-unit |
| H-14 | Tooltip field: Volume `5.10k $` traded, notional `15.49k $` | 007 | Inspector — TBD-concept | parity-index-card-tooltip-volume-and-notional |
| H-15 | Tooltip field: Liquidity per outcome pool (`Yashar 4.94k YASHAR / 12.15k sDAI`) | 007 | Inspector — TBD-concept | parity-index-card-tooltip-per-outcome-pool-liquidity |
| H-16 | External GnosisScan address links on cards | 001 | Index — TBD-concept | parity-index-card-gnosisscan-link-href |
| H-17 | External Kleros curation (TCR) link on cards | 001 | Index — TBD-concept | parity-index-card-kleros-curation-link-href |

### 3.2 Search

| ID | live feature/control/flow/state/data field | live state id (evidence) | new-design location | e2e test name |
|---|---|---|---|---|
| H-18 | Search input placeholder `Search by market, outcome or collection` | 001 | Index — TBD-concept | parity-index-search-input-placeholder |
| H-19 | Search writes URL query `?marketName=` | 001 | Index — TBD-concept | parity-index-search-writes-marketname-query |
| H-20 | Search / disconnected state renders `Connect` with feed still present | 008 | Index — TBD-concept | parity-index-search-state-shows-connect-with-feed |

### 3.3 Filters panel (006) — one row per Filters group

| ID | live feature/control/flow/state/data field | live state id (evidence) | new-design location | e2e test name |
|---|---|---|---|---|
| H-21 | `Filters` button opens the filter panel | 006 | Index — TBD-concept | parity-index-filters-button-opens-panel |
| H-22 | Group **Market States**: All, Reports not open yet, Reports open, Waiting for answer, In Dispute, Pending execution, Closed | 006 | Index — TBD-concept | parity-index-filter-group-market-states |
| H-23 | Group **Verification Status**: All, Verified, Verifying, Challenged, Not Verified | 006 | Index — TBD-concept | parity-index-filter-group-verification-status |
| H-24 | Group **Chain**: All, Ethereum, OP Mainnet, Gnosis, Base | 006 | Index — TBD-concept | parity-index-filter-group-chain |
| H-25 | Group **Sort By**: Default, Liquidity, Volume, Open Interest, Opening Date, Creation Date | 006 | Index — TBD-concept | parity-index-filter-group-sort-by |
| H-26 | Sort direction Desc/Asc switch | 006 | Index — TBD-concept | parity-index-filter-sort-direction-switch |
| H-27 | Conditional Market — `Show only conditional markets` | 006 | Index — TBD-concept | parity-index-filter-conditional-market-toggle |
| H-28 | Minimum Liquidity numeric input | 006 | Index — TBD-concept | parity-index-filter-minimum-liquidity-input |
| H-29 | Rewards — `Show only markets with rewards` | 006 | Index — TBD-concept | parity-index-filter-rewards-toggle |
| H-30 | Futarchy — `Show only futarchy markets` | 006 | Index — TBD-concept | parity-index-filter-futarchy-toggle |
| H-31 | `Cancel` button | 006 | Index — TBD-concept | parity-index-filters-cancel-button |
| H-32 | `Apply` button | 006 | Index — TBD-concept | parity-index-filters-apply-button |

### 3.4 Index CTAs

| ID | live feature/control/flow/state/data field | live state id (evidence) | new-design location | e2e test name |
|---|---|---|---|---|
| H-33 | `Create New Market` link → `/create-market` | 001 | Index → Create | parity-index-create-new-market-links-create |
| H-34 | `My collections` link → `/collections/default` | 001 | Index → Collections | parity-index-my-collections-links-collections |

---

## 4. Leaderboard (`/leaderboard`)

| ID | live feature/control/flow/state/data field | live state id (evidence) | new-design location | e2e test name |
|---|---|---|---|---|
| L-01 | Heading `Profit & Loss Leaderboard` | 009 | Leaderboard — TBD-concept | parity-leaderboard-heading-visible |
| L-02 | Explanatory prose describing the Trader Score (0–100: returns, profit factor, hit rate edge, loss burn, breadth; shrunk toward the middle for few markets) | 009 | Leaderboard — TBD-concept | parity-leaderboard-trader-score-explanation-copy |
| L-03 | `How it works` link | 009 | Leaderboard — TBD-concept | parity-leaderboard-how-it-works-link |
| L-04 | Period control `1D` | 009 | Leaderboard — TBD-concept | parity-leaderboard-period-1d |
| L-05 | Period control `1W` | 009 | Leaderboard — TBD-concept | parity-leaderboard-period-1w |
| L-06 | Period control `1M` | 009 | Leaderboard — TBD-concept | parity-leaderboard-period-1m |
| L-07 | Period control `ALL` | 009 | Leaderboard — TBD-concept | parity-leaderboard-period-all |
| L-08 | `Filters` button opens leaderboard filter panel | 018 | Leaderboard — TBD-concept | parity-leaderboard-filters-button-opens-panel |
| L-09 | Filter group **App**: All, Foresight, Opportunity Markets, Deepfunding | 018 | Leaderboard — TBD-concept | parity-leaderboard-filter-group-app |
| L-10 | Filter group **Chain**: All, Ethereum, OP Mainnet, Gnosis, Base | 018 | Leaderboard — TBD-concept | parity-leaderboard-filter-group-chain |
| L-11 | `Your Rank` control | 009 | Leaderboard — TBD-concept | parity-leaderboard-your-rank-control |
| L-12 | Search input "by username or address" | 009 | Leaderboard — TBD-concept | parity-leaderboard-search-input-placeholder |
| L-13 | `Search` button | 009 | Leaderboard — TBD-concept | parity-leaderboard-search-button-visible |
| L-14 | Column `#` (rank) | 009 | Leaderboard — TBD-concept | parity-leaderboard-column-rank |
| L-15 | Column `Account` — generated pseudonym (`scientific-decisive-toucan`) or ENS (`shotaro.eth`) | 009 | Leaderboard — TBD-concept | parity-leaderboard-column-account-name-formats |
| L-16 | Column `Score` — one-decimal value + band badge (`78.6 GREAT`, `87.5 ELITE`, `68.7 GOOD`) | 009 | Leaderboard — TBD-concept | parity-leaderboard-column-score-value-and-band |
| L-17 | Column `Score` — `N/A` variant + help icon on the header | 009 | Leaderboard — TBD-concept | parity-leaderboard-column-score-na-and-help-icon |
| L-18 | Column `Profit/Loss` — USD, 2 decimals | 009 | Leaderboard — TBD-concept | parity-leaderboard-column-profit-loss-usd |
| L-19 | Column `Volume` — USD, 2 decimals | 009 | Leaderboard — TBD-concept | parity-leaderboard-column-volume-usd |
| L-20 | Column `ROI` — signed percent | 009 | Leaderboard — TBD-concept | parity-leaderboard-column-roi-signed-percent |
| L-21 | Column `Traded Markets` — integer count | 009 | Leaderboard — TBD-concept | parity-leaderboard-column-traded-markets |
| L-22 | Sortable header `Score` | 009 | Leaderboard — TBD-concept | parity-leaderboard-sort-by-score |
| L-23 | Sortable header `Profit/Loss` | 009 | Leaderboard — TBD-concept | parity-leaderboard-sort-by-profit-loss |
| L-24 | Sortable header `Volume` | 009 | Leaderboard — TBD-concept | parity-leaderboard-sort-by-volume |
| L-25 | Sortable header `ROI` | 009 | Leaderboard — TBD-concept | parity-leaderboard-sort-by-roi |
| L-26 | Pagination `Previous` | 009 | Leaderboard — TBD-concept | parity-leaderboard-pagination-previous |
| L-27 | Pagination `Next` | 009 | Leaderboard — TBD-concept | parity-leaderboard-pagination-next |
| L-28 | Sort descriptor text, e.g. `Sorted by Profit/Loss, high to low` | draft-only | Leaderboard — TBD-concept | parity-leaderboard-sort-descriptor-visible |
| L-29 | Pending-state text `Updating…` on period change | draft-only | Leaderboard — TBD-concept | parity-leaderboard-updating-text-on-period-change |
| L-30 | `Finding your rank…` progress after `Your Rank` | draft-only | Leaderboard — TBD-concept | parity-leaderboard-finding-your-rank-progress |
| L-31 | Page counter `Page 1 of N` | draft-only | Leaderboard — TBD-concept | parity-leaderboard-page-counter |
| L-32 | Footer timestamp `Updated <date, time>` | draft-only | Leaderboard — TBD-concept | parity-leaderboard-updated-timestamp |
| L-33 | 25 rows rendered per page | draft-only | Leaderboard — TBD-concept | parity-leaderboard-rows-per-page |
| L-34 | Sortable headers `#`, `Account`, `Traded Markets` | draft-only (not supported by verified capture — treat as optional) | Leaderboard — TBD-concept | parity-leaderboard-optional-sortable-rank-account-traded |
| L-35 | Disconnected state still renders table rows | 009 | Leaderboard — TBD-concept | parity-leaderboard-disconnected-still-shows-rows |
| L-36 | `Your Rank` absent when disconnected | draft-only | Leaderboard — TBD-concept | parity-leaderboard-your-rank-hidden-when-disconnected |

---

## 5. Create (`/create-market`) — step 1

| ID | live feature/control/flow/state/data field | live state id (evidence) | new-design location | e2e test name |
|---|---|---|---|---|
| C-01 | Step indicator "1 of 2" dots | 027 | Create — TBD-concept | parity-create-step-indicator-shows-step-one-of-two |
| C-02 | `Type` select, empty by default | 027 | Create — TBD-concept | parity-create-type-select-empty-default |
| C-03 | `Next` disabled until a type is chosen | 027 | Create — TBD-concept | parity-create-next-disabled-until-type-chosen |
| C-04 | Wallet gate: page requires connected wallet | 027 | Create — TBD-concept | parity-create-requires-connected-wallet |
| C-05 | Footer `SECURED BY KLEROS` + social icons | 027 | Create — TBD-concept | parity-create-kleros-footer-visible |
| C-06 | Steps 2+ of the create flow | not observed (UNOBSERVED.md) | Create — TBD-concept | parity-create-steps-two-plus-not-yet-testable |

---

## 6. Collections (`/collections/default`)

| ID | live feature/control/flow/state/data field | live state id (evidence) | new-design location | e2e test name |
|---|---|---|---|---|
| CL-01 | `/collections/default` route requires sign-in | 032 | Collections — TBD-concept | parity-collections-requires-sign-in |
| CL-02 | Empty-state message for a collection with no markets | 032 | Collections — TBD-concept | parity-collections-empty-state |
| CL-03 | Signed-in collection content | not observed (UNOBSERVED.md) | Collections — TBD-concept | parity-collections-signed-in-not-yet-testable |

---

## 7. Market page — shell, header, meta

| ID | live feature/control/flow/state/data field | live state id (evidence) | new-design location | e2e test name |
|---|---|---|---|---|
| P-01 | Market detail route renders | 037, audit-types 001 | Market page — TBD-concept | parity-market-page-route-loads |
| P-02 | Breadcrumb `Home / Market` | 037 | Market page — TBD-concept | parity-market-page-breadcrumb |
| P-03 | Status strip with coloured top border + dot | 037 | Market page — TBD-concept | parity-market-page-status-strip-renders |
| P-04 | Status `Reports open` (purple) | 037 | Market page — TBD-concept | parity-market-page-status-reports-open |
| P-05 | Status `Trading Open` (cyan) | audit-types 001 | Market page — TBD-concept | parity-market-page-status-trading-open |
| P-06 | Status `Pending execution` (teal) | audit-types 011 | Market page — TBD-concept | parity-market-page-status-pending-execution |
| P-07 | Verification icon top-right | 037 | Market page — TBD-concept | parity-market-page-verification-icon |
| P-08 | Star / favourite toggle top-right | 037 | Market page — TBD-concept | parity-market-page-favourite-star-toggle |
| P-09 | Avatar + full question headline | 037 | Market page — TBD-concept | parity-market-page-question-headline |
| P-10 | Placeholder token in title, e.g. `[party bloc]`, preserved literally | 001 | Market page — TBD-concept | parity-market-page-title-placeholder-preserved |
| P-11 | Meta row: SEER logo | 037 | Market page — TBD-concept | parity-market-meta-seer-logo |
| P-12 | Meta: market type `Categorical` / `Scalar` / `Multi Scalar` | 037, audit-types 001, 011 | Market page — TBD-concept | parity-market-meta-type-label |
| P-13 | Meta: `Liquidity` value (`$` + `k`) | 037 | Market page — TBD-concept | parity-market-meta-liquidity-value |
| P-14 | Meta: Liquidity help tooltip copy ("The chart represents the token distribution in the liquidity pool over time and may not fully align with the outcome odds…") | 051 | Market page → Inspector | parity-market-meta-liquidity-help-tooltip-copy |
| P-15 | Meta: `Volume` value | 037 | Market page — TBD-concept | parity-market-meta-volume-value |
| P-16 | Meta: `P&L` value | 037 | Market page — TBD-concept | parity-market-meta-pnl-value |
| P-17 | Meta: `Verified` badge | 037 | Market page — TBD-concept | parity-market-meta-verified-badge |
| P-18 | Scalar headline `Market Estimate: 9.092 gwei` / `21.23 Note` | audit-types 001, 022 | Market page — TBD-concept | parity-market-scalar-estimate-headline |
| P-19 | Scalar bounds copy `Resolution opening at February 1 2027, 08:50 UTC` | audit-types 001 | Market page — TBD-concept | parity-market-resolution-datetime-copy |
| P-20 | Multi-scalar question list, each row `Answer: Answered too soon` + `Reopen question` | audit-types 011 | Market page — TBD-concept | parity-market-multiscalar-question-list |
| P-21 | Multi-scalar `Hide questions` toggle | audit-types 011 | Market page — TBD-concept | parity-market-multiscalar-hide-questions-toggle |
| P-22 | `Answer on Reality.eth!` link | 037 | Market page — TBD-concept | parity-market-answer-on-reality-eth-link |
| P-23 | "Major Events" panel: `1 UPCOMING`, `JAN 1, 2027 00:00 UTC`, `Reality.eth Resolution`, `Expected resolution date` | 037 | Market page — TBD-concept | parity-market-major-events-panel |
| P-24 | Conditional Market badge | draft-only | Market page — TBD-concept | parity-market-conditional-badge |
| P-25 | Conditional explanation copy (conditional on parent `Yes`; worthless if parent resolves otherwise) | draft-only | Market page — TBD-concept | parity-market-conditional-explanation-copy |
| P-26 | `Switch to Gnosis` control (wrong-chain state) | draft-only | Market page — TBD-concept | parity-market-switch-to-gnosis-control |

---

## 8. Market page — Report Answer dialog (043)

| ID | live feature/control/flow/state/data field | live state id (evidence) | new-design location | e2e test name |
|---|---|---|---|---|
| RA-01 | Clicking `Answer on Reality.eth!` opens the Report Answer dialog | 043 | Market page — TBD-concept | parity-report-answer-dialog-opens |
| RA-02 | Current answer row `Not answered yet` | 043 | Market page — TBD-concept | parity-report-answer-current-answer-row |
| RA-03 | Radio option "Choose an answer" | 043 | Market page — TBD-concept | parity-report-answer-choose-answer-radio |
| RA-04 | Option "Mark this question invalid" | 043 | Market page — TBD-concept | parity-report-answer-mark-invalid-option |
| RA-05 | Bond display `10 xDAI` | 043 | Market page — TBD-concept | parity-report-answer-bond-display |
| RA-06 | `Return` button closes the dialog | 043 | Market page — TBD-concept | parity-report-answer-return-button |
| RA-07 | `Answer` submit button | 043 | Market page — TBD-concept | parity-report-answer-submit-button |

---

## 9. Market page — chart (045 / 055)

| ID | live feature/control/flow/state/data field | live state id (evidence) | new-design location | e2e test name |
|---|---|---|---|---|
| CH-01 | Range buttons `1D 1W 1M All Custom` | 045 | Market page — TBD-concept | parity-chart-range-buttons-present |
| CH-02 | Chart help icon | 045 | Market page — TBD-concept | parity-chart-help-icon |
| CH-03 | `Custom` opens calendar popover | 045 | Market page — TBD-concept | parity-chart-custom-opens-calendar-popover |
| CH-04 | Popover presets Today / Last Week / Last Month / All | 045 | Market page — TBD-concept | parity-chart-custom-presets |
| CH-05 | Popover `Cancel` / `Save` | 045 | Market page — TBD-concept | parity-chart-custom-cancel-save |
| CH-06 | Export (document) icon top-right | 045 | Market page — TBD-concept | parity-chart-export-icon |
| CH-07 | Legend dots with latest % per outcome | 045 | Market page — TBD-concept | parity-chart-legend-latest-percentages |
| CH-08 | Previous / next arrows | 045 | Market page — TBD-concept | parity-chart-prev-next-arrows |
| CH-09 | Step-line chart rendering | 045 | Market page — TBD-concept | parity-chart-step-line-renders |
| CH-10 | Y-axis 0–100 for categorical; auto-scale for near-50/50 (48–52) and scalar (8.5–9.2) — known exaggeration | 045, audit-types 001 | Market page — TBD-concept | parity-chart-y-axis-range-behaviour |
| CH-11 | End-label pills (e.g. `Yes 84.20`, `No 14.80`) | 045 | Market page — TBD-concept | parity-chart-end-label-pills |
| CH-12 | Known defect: end-label pill collides with / covers y-axis tick | 045 | Market page — TBD-concept | parity-chart-end-label-pill-tick-collision |
| CH-13 | Crosshair hover tooltip: timestamp + all outcome values | 055 | Market page — TBD-concept | parity-chart-crosshair-hover-tooltip |
| CH-14 | Irregular x-axis labels (`May, Jul, Sep, Nov, 2026, Mar…`) | 045 | Market page — TBD-concept | parity-chart-x-axis-irregular-labels |
| CH-15 | Known defect: small black square glyph at chart origin | 045 | Market page — TBD-concept | parity-chart-origin-black-square-artifact |
| CH-16 | Chart plots liquidity-pool implied price, not trade prices; tooltip warns it may not match odds | 045, 051 | Market page — TBD-concept | parity-chart-plots-pool-price-not-trades |

---

## 10. Market page — outcome rows & per-row links

| ID | live feature/control/flow/state/data field | live state id (evidence) | new-design location | e2e test name |
|---|---|---|---|---|
| O-01 | Outcome row `#1 Yes 84.2%` with radio selector | scenario 01 / 06-*.png | Market page — TBD-concept | parity-outcome-row-label-percent-radio |
| O-02 | Invalid outcome row shows token value `210.85 SER-INVALID` and `0%` | scenario 01 / 06-*.png | Market page — TBD-concept | parity-outcome-invalid-token-value-and-zero-percent |
| O-03 | Selecting an outcome row changes the Ticket outcome | scenario 01 | Market page → Ticket | parity-outcome-select-updates-ticket |
| O-04 | Per-row `Add Liquidity` link | scenario 01 | Market page → Inspector | parity-outcome-add-liquidity-link |
| O-05 | Per-row `View pool details` link | scenario 01 | Market page → Inspector | parity-outcome-view-pool-details-link |
| O-06 | Per-row `New conditional market` link | scenario 01 | Market page → Create | parity-outcome-new-conditional-market-link |

---

## 11. Inspector — Pool details (scenario 04) and Add Liquidity dialog (044)

| ID | live feature/control/flow/state/data field | live state id (evidence) | new-design location | e2e test name |
|---|---|---|---|---|
| I-01 | Pool details panel opens from `View pool details` | scenario 04 / 03-*.png | Inspector — TBD-concept | parity-pool-details-panel-opens |
| I-02 | Pool Id truncated address `0xb328...30b1` | scenario 04 / 03-*.png | Inspector — TBD-concept | parity-pool-details-pool-id-truncated-address |
| I-03 | Liquidity Chart | scenario 04 / 03-*.png | Inspector — TBD-concept | parity-pool-details-liquidity-chart |
| I-04 | Pool Balances table ladder: SHARES price `0.9881`, token amounts, total | scenario 04 / 03-*.png | Inspector — TBD-concept | parity-pool-details-balances-table-ladder |
| I-05 | Add Liquidity dialog opens from outcome row | 044 | Inspector — TBD-concept | parity-add-liquidity-dialog-opens |
| I-06 | Farming Rewards copy ("Earn farming rewards (SEER) by providing liquidity to existing markets.") | 044 | Inspector — TBD-concept | parity-add-liquidity-farming-rewards-copy |
| I-07 | Available Pools: Swapr `~ 3.00k SEER / day` | 044 | Inspector — TBD-concept | parity-add-liquidity-available-pools-swapr-rate |
| I-08 | `Rewards end:` date | 044 | Inspector — TBD-concept | parity-add-liquidity-rewards-end-date |
| I-09 | `Add liquidity ->` external link | 044 | Inspector — TBD-concept | parity-add-liquidity-external-link |
| I-10 | `Learn more about the farming program` link | 044 | Inspector — TBD-concept | parity-add-liquidity-learn-more-link |
| I-11 | `Return` button | 044 | Inspector — TBD-concept | parity-add-liquidity-return-button |
| I-12 | Dialog variants 046 / 047 | 046, 047 (content not separately documented) | Inspector — TBD-concept | parity-add-liquidity-dialog-variants-render |
| I-13 | Add/remove liquidity transaction UI | not observed (UNOBSERVED.md) | Inspector — TBD-concept | parity-add-liquidity-transaction-not-yet-testable |

---

## 12. Ticket (trade panel & advanced tabs)

| ID | live feature/control/flow/state/data field | live state id (evidence) | new-design location | e2e test name |
|---|---|---|---|---|
| T-01 | Ticket header: selected outcome icon + name | scenario 01 / 06-*.png | Ticket — TBD-concept | parity-ticket-header-selected-outcome |
| T-02 | Order-type dropdown `Market` | scenario 01 / 06-*.png | Ticket — TBD-concept | parity-ticket-order-type-dropdown-market |
| T-03 | `You pay` amount input | scenario 01 / 06-*.png | Ticket — TBD-concept | parity-ticket-you-pay-input |
| T-04 | Pay token select `sDAI` | scenario 01 / 06-*.png | Ticket — TBD-concept | parity-ticket-pay-token-select-sdai |
| T-05 | Pay balance display `0 sDAI` | scenario 01 / 06-*.png | Ticket — TBD-concept | parity-ticket-pay-balance-display |
| T-06 | `Max` button | scenario 01 / 06-*.png | Ticket — TBD-concept | parity-ticket-max-button |
| T-07 | Direction arrow between pay / receive | scenario 01 / 06-*.png | Ticket — TBD-concept | parity-ticket-direction-arrow |
| T-08 | `You will get` computed, unrounded (e.g. `1.1868081659397476 Yes shares`) | scenario 01 / 06-*.png | Ticket — TBD-concept | parity-ticket-you-will-get-unrounded-value |
| T-09 | Receive-side outcome selector | scenario 01 / 06-*.png | Ticket — TBD-concept | parity-ticket-receive-outcome-selector |
| T-10 | `Low balance? Bridge tokens from other networks` link | scenario 01 / 06-*.png | Ticket — TBD-concept | parity-ticket-bridge-tokens-link |
| T-11 | `Avg price` field | scenario 01 / 06-*.png | Ticket — TBD-concept | parity-ticket-avg-price-field |
| T-12 | `Price after buy` field | scenario 01 / 06-*.png | Ticket — TBD-concept | parity-ticket-price-after-buy-field |
| T-13 | `Potential return` field with loading skeleton | scenario 01 / 06-*.png | Ticket — TBD-concept | parity-ticket-potential-return-skeleton |
| T-14 | `Max slippage 1%` + settings icon | scenario 01 / 06-*.png | Ticket — TBD-concept | parity-ticket-max-slippage-control |
| T-15 | CTA state `Enter an amount` | scenario 01 / 06-*.png | Ticket — TBD-concept | parity-ticket-cta-enter-an-amount |
| T-16 | CTA state `Not enough balance.` (disabled) | scenario 01 / 06-*.png | Ticket — TBD-concept | parity-ticket-cta-not-enough-balance-disabled |
| T-17 | CTA state `Trade` / `Approve` | not observed (UNOBSERVED.md) | Ticket — TBD-concept | parity-ticket-cta-trade-approve-not-yet-testable |
| T-18 | `More` accordion toggle | scenario 01 / 06-