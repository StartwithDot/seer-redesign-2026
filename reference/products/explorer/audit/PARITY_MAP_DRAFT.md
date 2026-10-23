# explorer: PARITY MAP DRAFT (DeepSeek; verify against screenshots)

# PARITY MAP DRAFT — `explorer` redesign

Draft notes: every redesign-location cell is intentionally `TBD design`. Tests below are parity tests for the live observable surface; where the capture only proves a control or menu opens, the test asserts that, not an unobserved destination. States `045–055` lack screen-content notes in the supplied material, so they are not separately mapped beyond chart metadata.

## Global shell / cross-screen

| id | live feature/control/flow/state/data field | where it is today | where it must appear in the redesign | e2e test name | verification |
|---|---|---|---|---|---|
| G-01 | Beta warning copy: “Note that this is a Beta version and can still be unstable” | STATE 001–008, 009–019, 020–040, 056–069, 070–090 | TBD design | parity_beta_warning_visible_on_all_routes | Visit `/`, `/leaderboard`, `/create-market`, `/collections/default`, and a market route; assert the beta warning text is visible on each. |
| G-02 | Top-nav `Markets` link to `/` | STATE 001–008; controls inventory | TBD design | parity_top_nav_markets_links_home | From each captured route, click or assert `Markets`; verify href `/` and navigation to root feed. |
| G-03 | Top-nav `Leaderboard` link to `/leaderboard` | STATE 001–008; controls inventory | TBD design | parity_top_nav_leaderboard_links_route | From root, click `Leaderboard`; assert URL `/leaderboard` and leaderboard heading visible. |
| G-04 | Top-nav `Create Market` link to `/create-market` | STATE 001–008; controls inventory | TBD design | parity_top_nav_create_market_links_route | Click `Create Market`; assert URL `/create-market` and create-market start screen visible. |
| G-05 | `Policies` button opens menu with `Verified Market Policy` and `Market Rules Policy` | STATE 002, 010, 028, 033, 038, 056 | TBD design | parity_policies_menu_opens_with_two_policy_headings | Click `Policies`; assert both policy menu headings are visible; assert underlying page remains visible where captured. |
| G-06 | `App` button opens menu with `Futarchy`, `Deepfunding`, `Foresight`, `Opportunity Markets` | STATE 003, 011, 029, 034, 040, 058 | TBD design | parity_app_menu_opens_with_four_app_items | Click `App`; assert all four app menu items are visible and page content remains where captured. |
| G-07 | Connected wallet header: truncated address `0x0000...dEaD` plus `24.69 xDAI` | STATE 001–007, 009–014, 017–019, 020–040, 056–066, 068–069, 070–090 | TBD design | parity_connected_wallet_header_shows_truncated_address_and_balance | Mock connected wallet `0x...dEaD` and balance `24.69 xDAI`; assert header shows truncated address and formatted xDAI balance. |
| G-08 | Wallet menu from balance button: `Account`, `Deposit`, `Portfolio`, `Market Collections`, `Trade Collateral`, `Use smart account` | STATE 004, 012, 030, 035 | TBD design | parity_wallet_menu_opens_with_six_account_items | Click `24.69 xDAI`; assert all six menu items visible; assert no unobserved destination is required. |
| G-09 | Disconnected wallet header: `Connect` with no address or balance | STATE 008, 015–016, 067, 089 | TBD design | parity_disconnected_header_shows_connect_only | Mock disconnected wallet; assert `Connect` visible and address/balance absent. |
| G-10 | Theme toggle control: `Switch to dark mode` / `Switch to light mode` | STATE 005, 013, 031, 036, 059 | TBD design | parity_theme_toggle_changes_label_without_text_content_loss | Click theme toggle; assert label changes between dark/light wording and captured text content remains present. |
| G-11 | Logo/home link to `/` | STATE 001–008; controls inventory | TBD design | parity_logo_links_to_home | Click unnamed logo link; assert URL `/` and root feed visible. |
| G-12 | Observed external footer/social links: Kleros, Discord, Telegram, X, GitHub | Flows from `/` | TBD design | parity_external_footer_links_have_expected_hrefs | Assert anchor hrefs match captured Kleros, Discord, Telegram, X, and GitHub destinations. |

## Markets home `/`

| id | live feature/control/flow/state/data field | where it is today | where it must appear in the redesign | e2e test name | verification |
|---|---|---|---|---|---|
| H-01 | Root market feed renders market cards | STATE 001–008 | TBD design | parity_home_renders_market_card_feed | Load `/`; mock market list; assert feed contains expected market cards and not charts/tables. |
| H-02 | Search input placeholder `Search by market, outcome or collection` | STATE 001–008; controls inventory | TBD design | parity_home_search_input_has_placeholder | Assert search input visible with exact placeholder. |
| H-03 | Search query updates URL to `/?marketName=e` | STATE 008 | TBD design | parity_home_search_updates_marketname_query_param | Type `e`; assert URL query contains `marketName=e`. |
| H-04 | Search state header switches to `Connect` and feed remains visible/unfiltered in capture | STATE 008 | TBD design | parity_home_search_state_can_show_connect_with_feed_visible | Mock disconnected/search state; assert `Connect` visible and market cards still present. |
| H-05 | `Filters` button opens filter panel over/with feed | STATE 006 | TBD design | parity_home_filters_button_opens_panel | Click `Filters`; assert filter panel opens and feed remains visible where captured. |
| H-06 | Home filter field `Market States` | STATE 006 | TBD design | parity_home_filter_market_states_visible | Open filters; assert `Market States` control visible. |
| H-07 | Home filter field `Verification Status` | STATE 006 | TBD design | parity_home_filter_verification_status_visible | Open filters; assert `Verification Status` control visible. |
| H-08 | Home filter field `Chain` | STATE 006 | TBD design | parity_home_filter_chain_visible | Open filters; assert `Chain` control visible. |
| H-09 | Home filter field `Sort By` | STATE 006 | TBD design | parity_home_filter_sort_by_visible | Open filters; assert `Sort By` control visible. |
| H-10 | Home filter field `Conditional Market` | STATE 006 | TBD design | parity_home_filter_conditional_market_visible | Open filters; assert `Conditional Market` control visible. |
| H-11 | Home filter field `Rewards` | STATE 006 | TBD design | parity_home_filter_rewards_visible | Open filters; assert `Rewards` control visible. |
| H-12 | Home filter field `Minimum Liquidity` | STATE 006 | TBD design | parity_home_filter_minimum_liquidity_visible | Open filters; assert `Minimum Liquidity` control visible. |
| H-13 | Home filter field `Futarchy` | STATE 006 | TBD design | parity_home_filter_futarchy_visible | Open filters; assert `Futarchy` control visible. |
| H-14 | `Create New Market` link to `/create-market` | STATE 001–008; controls inventory | TBD design | parity_home_create_new_market_links_route | Assert `Create New Market` href `/create-market`; click and assert route loads. |
| H-15 | `My collections` link to `/collections/default` | STATE 001–008; controls inventory | TBD design | parity_home_my_collections_links_route | Assert `My collections` href `/collections/default`; click and assert collections route loads. |
| H-16 | Market card title link opens market detail route `/markets/100/...` | STATE 001–008; controls inventory | TBD design | parity_home_market_card_title_opens_market_detail | Click first market card title; assert URL matches market detail route and market title visible. |
| H-17 | Market card outcome label plus percentage, e.g. `Yashar 60.9%`, `No 67.9%`, `Yes 50%` | STATE 001–008 | TBD design | parity_home_market_card_outcome_percentages_render | Mock card outcomes; assert each outcome label and percentage render in the expected order. |
| H-18 | Market card dollar volume format, e.g. `$27.74k`, `$918.38`, `$1.10k` | STATE 001–008 | TBD design | parity_home_market_card_volume_formats_dollar_and_k_suffix | Mock volumes; assert `$` prefix, two decimals, and `k` suffix for thousands. |
| H-19 | Numeric-market card value plus unit and bounds, e.g. `21.23 NOTE`, `9.092 GWEI`, bounds `10`/`50`, `0.1`/`120` | STATE 001–008 | TBD design | parity_home_numeric_market_card_value_unit_bounds_render | Mock numeric market card; assert value/unit and lower/upper bound text render. |
| H-20 | `Open interest and liquidity breakdown` button on home feed | STATE 007 | TBD design | parity_home_open_interest_breakdown_control_exists | Click breakdown control; assert control exists and no unobserved chart/table data is required by parity test. |
| H-21 | Market-card external GnosisScan address links | STATE 001–008; controls inventory | TBD design | parity_home_market_card_gnosisscan_links_have_hrefs | Assert GnosisScan anchors exist with captured `https://gnosisscan.io/address/...` href pattern. |
| H-22 | Market-card Kleros curation link | STATE 001–008; controls inventory | TBD design | parity_home_market_card_kleros_link_has_href | Assert Kleros anchor href contains `/tcr/100/...` captured pattern. |
| H-23 | Policies overlay on home keeps feed visible | STATE 002 | TBD design | parity_home_policies_overlay_keeps_feed_visible | Open `Policies`; assert policy headings and market feed both visible. |
| H-24 | App overlay on home keeps feed unchanged | STATE 003 | TBD design | parity_home_app_overlay_keeps_feed_unchanged | Open `App`; assert four app items and unchanged feed cards. |
| H-25 | Wallet overlay on home keeps feed unchanged | STATE 004 | TBD design | parity_home_wallet_overlay_keeps_feed_unchanged | Open wallet menu; assert six wallet items and feed cards remain. |
| H-26 | Theme toggle on home changes captured text content not observed; control remains | STATE 005 | TBD design | parity_home_theme_toggle_preserves_feed | Click theme toggle; assert control label changes and feed cards remain. |

## Leaderboard `/leaderboard`

| id | live feature/control/flow/state/data field | where it is today | where it must appear in the redesign | e2e test name | verification |
|---|---|---|---|---|---|
| L-01 | Leaderboard page heading/copy `Profit & Loss Leaderboard` | STATE 009–026 | TBD design | parity_leaderboard_heading_visible | Load `/leaderboard`; assert heading `Profit & Loss Leaderboard` visible. |
| L-02 | Breadcrumb `/ Leaderboard` | STATE 009–019 | TBD design | parity_leaderboard_breadcrumb_visible | Assert breadcrumb text `/ Leaderboard` visible. |
| L-03 | Explanation copy: rankings by P/L in USD; `All` covers every Seer market on chain; `App` scopes to app markets; Deepfunding/Foresight per-market boards | STATE 009–026 | TBD design | parity_leaderboard_explanation_copy_visible | Assert explanatory paragraph contains the captured scoping copy. |
| L-04 | Trader Score explanation plus `How it works.` link | STATE 009–026 | TBD design | parity_leaderboard_trader_score_explanation_and_link | Assert score explanation text and `How it works.` link with docs href visible. |
| L-05 | Time-period control `1D` | STATE 009, 014 | TBD design | parity_leaderboard_time_filter_1d_activates_updating_state | Click `1D`; assert `Updating…` appears and table remains visible where captured. |
| L-06 | Time-period control `1W` | STATE 009, 015 | TBD design | parity_leaderboard_time_filter_1w_loads_table | Click `1W`; assert table remains visible and page-count/timestamp updates where captured. |
| L-07 | Time-period control `1M` | STATE 009, 016 | TBD design | parity_leaderboard_time_filter_1m_activates_updating_state | Click `1M`; assert `Updating…` appears and table remains visible. |
| L-08 | Time-period control `ALL` | STATE 009, 017 | TBD design | parity_leaderboard_time_filter_all_restores_all_table | Click `ALL`; assert ALL table state returns and `Your Rank` is present where captured. |
| L-09 | Loading/progress text `Updating…` after time-filter clicks | STATE 014, 016 | TBD design | parity_leaderboard_updating_text_shown_during_filter_change | Mock delayed response; assert `Updating…` is displayed while request is pending. |
| L-10 | `Filters` button opens leaderboard filter panel | STATE 018 | TBD design | parity_leaderboard_filters_button_opens_panel | Click `Filters`; assert filter panel expands. |
| L-11 | Leaderboard App filter options: `All`, `Foresight`, `Opportunity Markets`, `Deepfunding` | STATE 018 | TBD design | parity_leaderboard_app_filter_options_match_capture | Open filters; assert exact app options are present; assert Futarchy is absent in captured set. |
| L-12 | Leaderboard Chain filter options: `All`, `Ethereum`, `OP Mainnet`, `Gnosis`, `Base` | STATE 018 | TBD design | parity_leaderboard_chain_filter_options_match_capture | Open filters; assert exact chain options. |
| L-13 | `Your Rank` control | STATE 009, 017, 019 | TBD design | parity_leaderboard_your_rank_control_visible_when_connected | Mock connected wallet; assert `Your Rank` visible. |
| L-14 | Progress text `Finding your rank…` after `Your Rank` | STATE 019 | TBD design | parity_leaderboard_your_rank_shows_finding_progress | Click `Your Rank`; assert `Finding your rank…` appears and table remains visible. |
| L-15 | Leaderboard `Search` control | STATE 009–026 | TBD design | parity_leaderboard_search_control_visible | Assert `Search` control visible; where captured, assert typing does not remove table. |
| L-16 | Table column `#` with integer rank 1–25 per page | STATE 009–026 | TBD design | parity_leaderboard_rank_column_renders_integer_ranks | Mock rows; assert rank column has integer ranks in observed page range. |
| L-17 | Table column `Account` with pseudonymous names, ENS names, or `@handle · ENS` | STATE 009–026 | TBD design | parity_leaderboard_account_column_renders_name_formats | Mock account name variants; assert pseudonymous, ENS, and handle formats render. |
| L-18 | Table column `Score`: one-decimal numeric plus band `ELITE`/`GREAT`/`GOOD`/`AVERAGE` or `N/A` | STATE 009–026 | TBD design | parity_leaderboard_score_column_renders_number_band_or_na | Mock score rows; assert number plus band and `N/A` variants render. |
| L-19 | Table column `Profit/Loss`: signed USD with thousands separators and two decimals, e.g. `+$241,172.15` | STATE 009–026 | TBD design | parity_leaderboard_pnl_column_formats_signed_usd | Mock P/L values; assert `+$` prefix, comma separators, and two decimals. |
| L-20 | Table column `Volume`: USD with `$`, thousands separators, two decimals; can be `$0.00` | STATE 009–026 | TBD design | parity_leaderboard_volume_column_formats_usd | Mock volumes including zero; assert USD formatting and `$0.00`. |
| L-21 | Table column `ROI`: signed percent one decimal or `N/A` | STATE 009–026 | TBD design | parity_leaderboard_roi_column_formats_signed_percent_or_na | Mock ROI values; assert `+30.3%`, extreme percent, and `N/A` render. |
| L-22 | Table column `Traded Markets`: integer count, including `0` | STATE 009–026 | TBD design | parity_leaderboard_traded_markets_column_renders_integer | Mock counts; assert integer values including `0` render. |
| L-23 | Sortable `Score` column header and sort-status text | STATE 020–025 | TBD design | parity_leaderboard_sort_by_score_updates_descriptor | Click `Score`; assert sort descriptor updates to score-related text. |
| L-24 | Sortable `Profit/Loss` column header and sort-status text | STATE 022 | TBD design | parity_leaderboard_sort_by_pnl_updates_descriptor | Click `Profit/Loss`; assert sort descriptor updates to P/L-related text. |
| L-25 | Sortable `Volume` column header and sort-status text | STATE 023 | TBD design | parity_leaderboard_sort_by_volume_updates_descriptor | Click `Volume`; assert sort descriptor updates to volume-related text. |
| L-26 | Sortable `ROI` column header and sort-status text | STATE 024 | TBD design | parity_leaderboard_sort_by_roi_updates_descriptor | Click `ROI`; assert sort descriptor updates to ROI-related text. |
| L-27 | Sortable `#` column header | Controls inventory; STATE 009–026 | TBD design | parity_leaderboard_sort_by_rank_header_exists | Assert `#` header is interactive; click and assert sort state or descriptor changes if implemented. |
| L-28 | Sortable `Account` column header | Controls inventory; STATE 009–026 | TBD design | parity_leaderboard_sort_by_account_header_exists | Assert `Account` header is interactive and clickable. |
| L-29 | Sortable `Traded Markets` column header | Controls inventory; STATE 009–026 | TBD design | parity_leaderboard_sort_by_traded_markets_header_exists | Assert `Traded Markets` header is interactive and clickable. |
| L-30 | Sort descriptor text, e.g. `Sorted by Profit/Loss, high to low` | STATE 009–026 | TBD design | parity_leaderboard_sort_descriptor_visible | Assert sort descriptor text is visible in leaderboard table footer/header area. |
| L-31 | `Prev` pagination control | STATE 009–026 | TBD design | parity_leaderboard_prev_control_visible | Assert `Prev` control visible; click where enabled and assert pagination state changes or remains disabled. |
| L-32 | `Next` pagination control | STATE 025 | TBD design | parity_leaderboard_next_control_changes_page_count | Click `Next`; assert pagination text changes to `Page 2 of 166` where captured. |
| L-33 | Page count footer, e.g. `Page 1 of 166`, `Page 1 of 91` | STATE 009–026 | TBD design | parity_leaderboard_page_count_renders | Mock total; assert `Page 1 of N` text renders for captured totals. |
| L-34 | Updated timestamp footer, e.g. `Updated 10/18/2026, 8:39:31 PM` | STATE 009–026 | TBD design | parity_leaderboard_updated_timestamp_renders | Mock `updatedAt`; assert formatted timestamp text renders. |
| L-35 | Table renders 25 visible rank rows per page | STATE 009–026; DATA MODEL limit=25 | TBD design | parity_leaderboard_renders_25_rows_per_page | Mock 25 rows; assert table body has 25 rank rows. |
| L-36 | `Score N/A` explanation: too little history to score | STATE 021 | TBD design | parity_leaderboard_score_na_explanation_available | Trigger score `N/A`; assert explanation text/tooltip contains too-little-history copy. |
| L-37 | `ROI N/A` explanation: under `$0.01` of capital | STATE 024 | TBD design | parity_leaderboard_roi_na_explanation_available | Trigger ROI `N/A`; assert explanation text/tooltip contains under-`$0.01` capital copy. |
| L-38 | Disconnected leaderboard state still shows table rows | STATE 015–016 | TBD design | parity_leaderboard_disconnected_state_still_shows_rows | Mock disconnected wallet; assert `Connect` visible and leaderboard rows still render. |
| L-39 | `Your Rank` absent in captured disconnected leaderboard state | STATE 015–016 | TBD design | parity_leaderboard_your_rank_hidden_when_disconnected | Mock disconnected wallet; assert `Your Rank` is absent. |
| L-40 | Leaderboard search state has no visible query value or table change in capture | STATE 026 | TBD design | parity_leaderboard_search_preserves_table_in_capture | Type into search; assert table remains visible where captured and no unobserved filter result is required. |
| L-41 | Leaderboard API request params: `app`, `chainId`, `period`, `sort`, `dir`, `limit`, `offset`, `breakdown` | DATA MODEL get-pnl-leaderboard | TBD design | parity_leaderboard_api_request_uses_expected_query_params | Intercept request; assert query has app, chainId, period, sort, dir, limit, offset, breakdown values. |
| L-42 | Leaderboard API response fields `updatedAt`, `total`, `limit`, `offset`, `rows` | DATA MODEL get-pnl-leaderboard | TBD design | parity_leaderboard_api_response_metadata_renders | Mock response; assert updated timestamp and page totals derive from response metadata. |
| L-43 | Leaderboard row fields `rank`, `address`, `pnl`, `volume`, `roi`, `unit`, `marketCount`, `score` | DATA MODEL get-pnl-leaderboard | TBD design | parity_leaderboard_row_fields_map_to_columns | Mock row; assert each API field maps to rank, account, P/L, volume, ROI, traded markets, score. |

## Create Market `/create-market`

| id | live feature/control/flow/state/data field | where it is today | where it must appear in the redesign | e2e test name | verification |
|---|---|---|---|---|---|
| CM-01 | Create-market start screen `Create New Market` | STATE 027–031 | TBD design | parity_create_market_start_screen_visible | Load `/create-market`; assert `Create New Market` heading/start screen visible. |
| CM-02 | Market type choice `Categorical` | STATE 027–031 | TBD design | parity_create_market_type_categorical_selectable | Assert `Categorical` control visible and selectable. |
| CM-03 | Market type choice `Scalar` | STATE 027–031 | TBD design | parity_create_market_type_scalar_selectable | Assert `Scalar` control visible and selectable. |
| CM-04 | Market type choice `Multi Categorical` | STATE 027–031 | TBD design | parity_create_market_type_multi_categorical_selectable | Assert `Multi Categorical` control visible and selectable. |
| CM-05 | Market type choice `Multi Scalar` | STATE 027–031 | TBD design | parity_create_market_type_multi_scalar_selectable | Assert `Multi Scalar` control visible and selectable. |
| CM-06 | `Next` control after type selection | STATE 027–031 | TBD design | parity_create_market_next_control_visible | Assert `Next` control visible; click and assert no unobserved form field is required by parity test. |
| CM-07 | Policies overlay on create-market leaves page content unchanged | STATE 028 | TBD design | parity_create_market_policies_overlay_preserves_page | Open `Policies`; assert policy headings and create-market content visible. |
| CM-08 | App overlay on create-market leaves page unchanged | STATE 029 | TBD design | parity_create_market_app_overlay_preserves_page | Open `App`; assert four app items and create-market content visible. |
| CM-09 | Wallet overlay on create-market leaves page unchanged | STATE 030 | TBD design | parity_create_market_wallet_overlay_preserves_page | Open wallet menu; assert six wallet items and create-market content visible. |
| CM-10 | Theme toggle on create-market | STATE 031 | TBD design | parity_create_market_theme_toggle_visible | Assert theme toggle control visible and clickable. |

## Collections `/collections/default`

| id | live feature/control/flow/state/data field | where it is today | where it must appear in the redesign | e2e test name | verification |
|---|---|---|---|---|---|
| COL-01 | Collection route `/collections/default` with collection name `Default` | STATE 032–036 | TBD design | parity_collections_default_route_loads | Load `/collections/default`; assert `Default` collection name visible. |
| COL-02 | Sign-in gate copy `Sign in to view and manage your market collections` | STATE 032–036 | TBD design | parity_collections_sign_in_gate_visible | Mock disconnected user; assert sign-in gate copy visible. |
| COL-03 | Empty collection message `No markets in this collection.` | STATE 032–036 | TBD design | parity_collections_empty_state_visible | Mock empty collection; assert empty message visible. |
| COL-04 | `My collections` route from home reaches collections page | STATE 001–008, 032–036 | TBD design | parity_collections_my_collections_entry_route | Click `My collections`; assert `/collections/default` and collection page visible. |
| COL-05 | Policies overlay on collections preserves page content | STATE 033 | TBD design | parity_collections_policies_overlay_preserves_page | Open `Policies`; assert policy headings and collection content visible. |
| COL-06 | App overlay on collections preserves page content | STATE 034 | TBD design | parity_collections_app_overlay_preserves_page | Open `App`; assert app items and collection content visible. |
| COL-07 | Wallet overlay on collections preserves page content | STATE 035 | TBD design | parity_collections_wallet_overlay_preserves_page | Open wallet menu; assert wallet items and collection content visible. |
| COL-08 | Theme toggle on collections | STATE 036 | TBD design | parity_collections_theme_toggle_visible | Assert theme toggle control visible and clickable. |

## Market detail shell and header

| id | live feature/control/flow/state/data field | where it is today | where it must appear in the redesign | e2e test name | verification |
|---|---|---|---|---|---|
| MD-01 | Market detail route loads market page | STATE 037–044, 056–069, 070–090 | TBD design | parity_market_detail_route_loads | Open market route; assert market title, outcome rows, and trade panel render. |
| MD-02 | Breadcrumb `/ Market` | STATE 070–090 | TBD design | parity_market_detail_breadcrumb_visible | Assert breadcrumb `/ Market` visible. |
| MD-03 | Market title/question text, including literal placeholders such as `[party bloc]` | STATE 037–090 | TBD design | parity_market_detail_title_renders_question_and_placeholder | Mock market title; assert full question and literal `[party bloc]` placeholder render unchanged. |
| MD-04 | Market status `Reports open` | STATE 037–090 | TBD design | parity_market_status_reports_open_visible | Mock open-reporting market; assert `Reports open` visible. |
| MD-05 | Market status `Pending execution` | STATE 090 | TBD design | parity_market_status_pending_execution_visible | Mock pending multi-scalar market; assert `Pending execution` visible. |
| MD-06 | Market type `Categorical` | STATE 037–090 | TBD design | parity_market_type_categorical_visible | Mock categorical market; assert `Categorical` visible. |
| MD-07 | Market type `Multi Scalar` | STATE 090 | TBD design | parity_market_type_multi_scalar_visible | Mock multi-scalar market; assert `Multi Scalar` visible. |
| MD-08 | Badge `Conditional Market` | STATE 056–069 | TBD design | parity_market_conditional_badge_visible | Mock conditional market; assert `Conditional Market` badge visible. |
| MD-09 | Badge `Verified` | STATE 037–090 | TBD design | parity_market_verified_badge_visible | Mock verified market; assert `Verified` badge visible. |
| MD-10 | Market metric `Liquidity` with captured values such as `27.74k`, `7.54k`, `7.16k`, `6.45k` | STATE 037–090 | TBD design | parity_market_liquidity_metric_renders | Mock liquidity; assert `Liquidity:` label and formatted value render. |
| MD-11 | Market metric `Volume` with captured values such as `5.10k`, `11.75k`, `49.69k`, `1.32k` | STATE 037–090 | TBD design | parity_market_volume_metric_renders | Mock volume; assert `Volume:` label and formatted value render. |
| MD-12 | Market metric `P&L: 0.00` | STATE 037–090 | TBD design | parity_market_pnl_metric_renders | Mock P&L zero; assert `P&L: 0.00` visible. |
| MD-13 | `Answer on Reality.eth!` link/button | STATE 037–090 | TBD design | parity_market_reality_answer_control_opens_report_modal | Click `Answer on Reality.eth!`; assert `Report Answer` modal opens. |
| MD-14 | `Deadline:` label on multi-scalar market | STATE 090 | TBD design | parity_market_deadline_label_visible | Mock multi-scalar market; assert `Deadline:` label visible. |
| MD-15 | `Hide questions` control on multi-scalar market | STATE 090 | TBD design | parity_market_hide_questions_control_visible | Assert `Hide questions` control visible and clickable. |
| MD-16 | Question rows with `Answer: Answered too soon` | STATE 090 | TBD design | parity_market_question_rows_show_answered_too_soon | Mock multi-scalar questions; assert each row shows `Answer: Answered too soon`. |
| MD-17 | `Reopen question` control per question row | STATE 090 | TBD design | parity_market_reopen_question_control_visible | Assert `Reopen question` control visible for each captured question row. |
| MD-18 | Conditional-market explanation copy: conditional on main question `Yes`; tokens worthless if main resolves differently | STATE 056–069 | TBD design | parity_market_conditional_explanation_copy_visible | Mock conditional market; assert conditional-on-copy and worthless-token copy visible. |
| MD-19 | Market-page wallet connected/disconnected state | STATE 056–069, 070–090 | TBD design | parity_market_wallet_state_renders_connected_or_connect | Toggle wallet mock; assert connected address/balance or `Connect` renders. |
| MD-20 | `Switch to Gnosis` control in captured disconnected market state | STATE 067 | TBD design | parity_market_switch_to_gnosis_control_visible | Mock disconnected/wrong-chain state; assert `Switch to Gnosis` control visible. |
| MD-21 | Policies overlay on market detail preserves page content | STATE 038, 056 | TBD design | parity_market_policies_overlay_preserves_page | Open `Policies`; assert policy headings and market content visible. |
| MD-22 | App overlay on market detail preserves page content | STATE 040, 058 | TBD design | parity_market_app_overlay_preserves_page | Open `App`; assert app items and market content visible. |
| MD-23 | Wallet overlay on market detail preserves page content | STATE 030, 035 | TBD design | parity_market_wallet_overlay_preserves_page | Open wallet menu; assert wallet items and market content visible. |
| MD-24 | Theme toggle on market detail | STATE 042, 059 | TBD design | parity_market_theme_toggle_visible | Assert theme toggle control visible and clickable. |

## Market outcomes, chart, and liquidity breakdown

| id | live feature/control/flow/state/data field | where it is today | where it must appear in the redesign | e2e test name | verification |
|---|---|---|---|---|---|
| MD-25 | Outcome row label plus percentage, e.g. `#1 Yashar 60.8%`, `#1 No 74.5%`, `#1 Yes 84.2%` | STATE 037–090 | TBD design | parity_market_outcome_rows_render_labels_and_percentages | Mock outcomes; assert ordered outcome rows with labels and percentages. |
| MD-26 | Outcome numeric token display, e.g. `9.00 SER-INVALID`, `210.85 SER-INVALID`, with `0%` | STATE 037–090 | TBD design | parity_market_invalid_outcome_renders_token_value_and_percent | Mock invalid outcome; assert token value plus `0%` render. |
| MD-27 | Multi-scalar approximate seats, e.g. `~ 182 seats`, `~ 168 seats` | STATE 090 | TBD design | parity_market_multi_scalar_renders_approximate_seats | Mock multi-scalar outcomes; assert `~ N seats` text per outcome. |
| MD-28 | Per-outcome `Add Liquidity` control | STATE 037–090 | TBD design | parity_market_outcome_add_liquidity_opens_modal | Click `Add Liquidity`; assert liquidity/farming modal opens. |
| MD-29 | Per-outcome `View pool details` control | STATE 056–090 | TBD design | parity_market_outcome_view_pool_details_expands | Click `View pool details`; assert expansion/`Hide pool details` state appears. |
| MD-30 | Per-outcome `Hide pool details` toggled state | STATE 064 | TBD design | parity_market_outcome_hide_pool_details_collapses | Click `Hide pool details`; assert expanded details collapse. |
| MD-31 | Per-outcome `New conditional market` control | STATE 037–090 | TBD design | parity_market_outcome_new_conditional_market_control_visible | Assert `New conditional market` control visible per outcome row. |
| MD-32 | Chart time controls `1D`, `1W`, `1M`, `All`, `Custom` | STATE 037–090 | TBD design | parity_market_chart_time_controls_visible | Assert all five chart time controls visible. |
| MD-33 | Chart hover tooltip with timestamp and outcome percentages | STATE 039, 057 | TBD design | parity_market_chart_hover_shows_timestamp_and_outcomes | Hover chart; assert tooltip contains timestamp and outcome-name plus percent values. |
| MD-34 | `Custom` opens date-range picker with `Today`, `Last Week`, `Last Month`, `All`, `Previous Month`, `Next Month` | STATE 062 | TBD design | parity_market_custom_chart_range_picker_opens | Click `Custom`; assert all six range options visible. |
| MD-35 | Custom piecker month label and calendar grid `Su Mo Tu We Th Fr Sa` | STATE 062 | TBD design | parity_market_custom_range_picker_calendar_renders | Assert month label and weekday header row render. |
| MD-36 | Custom picker `Cancel` and `Save` controls | STATE 062 | TBD design | parity_market_custom_range_picker_cancel_save_visible | Assert `Cancel` and `Save` controls visible and clickable. |
| MD-37 | `Open interest and liquidity breakdown` control on market detail | STATE 044, 061 | TBD design | parity_market_open_interest_breakdown_opens | Click breakdown control; assert breakdown data labels appear. |
| MD-38 | Breakdown `Open interest` label and value, e.g. `7.22k LEPEN_NRYES (7.68k $)` | STATE 061 | TBD design | parity_market_breakdown_open_interest_renders | Mock breakdown; assert open-interest label and token/dollar value render. |
| MD-39 | Breakdown `Volume` traded plus notional, e.g. `11.75k $ traded, notional 17.31k $` | STATE 061 | TBD design | parity_market_breakdown_volume_notional_renders | Assert volume traded and notional values render. |
| MD-40 | Breakdown per-outcome `Liquidity`, e.g. `No: 7.18k LPY_NR_NO / 0.38 LEPEN_NRYES` | STATE 061 | TBD design | parity_market_breakdown_liquidity_per_outcome_renders | Mock per-outcome liquidity; assert token amounts render per outcome. |
| MD-41 | Outcome probability chart canvas renders on market page | STATE 037–090 chart inventory | TBD design | parity_market_outcome_chart_canvas_visible | Assert chart canvas exists and is visible; hover test covers tooltip. |

## Market trade widget and events

| id | live feature/control/flow/state/data field | where it is today | where it must appear in the redesign | e2e test name | verification |
|---|---|---|---|---|---|
| MD-42 | Selected outcome label in trade widget, e.g. `No Market`, `You will get No`, selected `Left (...)` | STATE 037–090 | TBD design | parity_market_trade_widget_selected_outcome_label_renders | Mock selected outcome; assert selected outcome text appears in trade widget. |
| MD-43 | `You pay` token label, e.g. `sDAI`, `LEPEN_NRYES` | STATE 037–090 | TBD design | parity_market_trade_you_pay_token_label_renders | Mock collateral token; assert `You pay` label and token symbol render. |
| MD-44 | Default `You pay` amount `0 sDAI` or `0 LEPEN_NRYES` | STATE 037–090 | TBD design | parity_market_trade_default_pay_amount_zero | Assert default amount shows `0` plus token symbol. |
| MD-45 | `Max` button in trade amount area | STATE 037–090 | TBD design | parity_market_trade_max_button_visible | Assert `Max` button visible in pay/amount area. |
| MD-46 | `You will get` outcome label | STATE 037–090 | TBD design | parity_market_trade_you_will_get_outcome_renders | Assert `You will get` label plus selected outcome render. |
| MD-47 | `Avg price` with token amount, e.g. `0 sDAI`, `0 LEPEN_NRYES` | STATE 037–090 | TBD design | parity_market_trade_avg_price_renders | Assert `Avg price` label and token-formatted price render. |
| MD-48 | `Potential return` with token amount and percent, e.g. `0.00 sDAI (0.00%)` | STATE 037–090 | TBD design | parity_market_trade_potential_return_renders | Assert `Potential return` label plus amount and percent render. |
| MD-49 | Multi-scalar variant `Calculate your potential return` | STATE 090 | TBD design | parity_market_trade_calculate_potential_return_variant_visible | Mock multi-scalar market; assert `Calculate your potential return` text visible. |
| MD-50 | `Max slippage 1%` parameter copy | STATE 037–090 | TBD design | parity_market_trade_max_slippage_visible | Assert `Max slippage 1%` text visible. |
| MD-51 | `Enter an amount` prompt and `Amount` input | STATE 037–090 | TBD design | parity_market_trade_amount_input_and_prompt_visible | Assert `Enter an amount` prompt and `Amount` input visible. |
| MD-52 | `More` control in trade widget | STATE 056–066 | TBD design | parity_market_trade_more_control_visible | Assert `More` control visible and clickable. |
| MD-53 | Trade action tab `Mint` | STATE 037–090 | TBD design | parity_market_trade_mint_tab_visible | Assert `Mint` tab/button visible. |
| MD-54 | Trade action tab `Merge` | STATE 037–090 | TBD design | parity_market_trade_merge_tab_visible | Assert `Merge` tab/button visible. |
| MD-55 | Trade action tab `Redeem` | STATE 037–090 | TBD design | parity_market_trade_redeem_tab_visible | Assert `Redeem` tab/button visible. |
| MD-56 | `Balance: 0 sDAI` or `Balance: 0 LEPEN_NRYES` | STATE 037–090 | TBD design | parity_market_trade_balance_renders | Mock balance; assert `Balance:` label and token amount render. |
| MD-57 | Collateral choices `sDAI` and `xDAI` | STATE 037–090 | TBD design | parity_market_trade_collateral_choices_visible | Assert both `sDAI` and `xDAI` collateral choices visible. |
| MD-58 | Final `Mint` action button in trade widget | STATE 037–090 | TBD design | parity_market_trade_mint_action_button_visible | Assert final `Mint` action button visible and enabled state follows amount input. |
| MD-59 | Major Events block `1 UPCOMING` | STATE 037–090 | TBD design | parity_market_major_events_upcoming_count_visible | Assert `1 UPCOMING` and event block visible. |
| MD-60 | `Reality.eth Resolution` event plus `Expected resolution date` and formatted date | STATE 037–090 | TBD design | parity_market_reality_resolution_event_renders | Mock resolution timestamp; assert event label, `Expected resolution date`, and formatted UTC date render. |

## Market tabs, comments, related markets, holders, activity

| id | live feature/control/flow/state/data field | where it is today | where it must appear in the redesign | e2e test name | verification |
|---|---|---|---|---|---|
| TAB-01 | `Comments` tab | STATE 037–090 | TBD design | parity_market_comments_tab_visible | Assert `Comments` tab visible and selectable. |
| TAB-02 | Comments wallet gate copy `Connect your wallet to share your take` | STATE 037–090 | TBD design | parity_market_comments_gate_copy_visible | Mock disconnected wallet; assert gate copy visible. |
| TAB-03 | `Connect to comment` button | STATE 037–090 | TBD design | parity_market_connect_to_comment_button_visible | Assert `Connect to comment` button visible and clickable. |
| TAB-04 | Comments empty state `No takes yet. Share the first one.` | STATE 037–090 | TBD design | parity_market_comments_empty_state_visible | Mock no comments; assert empty-state copy visible. |
| TAB-05 | Comment signing state `Signing in...` and error `User rejected the request.` | STATE 089 | TBD design | parity_market_comment_signing_and_rejection_error_visible | Mock rejected signing; assert `Signing in...` then `User rejected the request.` visible. |
| TAB-06 | `Related Conditional Markets` tab | STATE 068 | TBD design | parity_market_related_conditional_markets_tab_visible | Assert tab visible and selectable. |
| TAB-07 | Related-markets count `Related Conditional Markets (2)` | STATE 068 | TBD design | parity_market_related_markets_count_renders | Mock two related markets; assert count `(2)` renders. |
| TAB-08 | `Search by outcome:` input in related-markets tab | STATE 068 | TBD design | parity_market_related_markets_search_control_visible | Assert `Search by outcome:` input visible. |
| TAB-09 | Related-market cards differentiated by `Conditional on ... being "Yes"` / `"No"` | STATE 068 | TBD design | parity_market_related_cards_show_yes_no_condition_text | Mock related cards; assert Yes-condition and No-condition text render. |
| TAB-10 | Related-market card status `Reports open` and `Answer on Reality.eth!` link | STATE 068 | TBD design | parity_market_related_card_status_and_report_link_visible | Assert each related card shows `Reports open` and report link. |
| TAB-11 | `Top Holders` tab | STATE 069, 087 | TBD design | parity_market_top_holders_tab_visible | Assert tab visible and selectable. |
| TAB-12 | Top-holder `Yes` table with `Balance` column | STATE 069, 087 | TBD design | parity_market_top_holders_yes_table_renders | Mock Yes holders; assert Yes table and Balance column values render. |
| TAB-13 | Top-holder `No` table with `Balance` column | STATE 069, 087 | TBD design | parity_market_top_holders_no_table_renders | Mock No holders; assert No table and Balance column values render. |
| TAB-14 | Top-holder `Invalid` table with `Balance` column | STATE 069, 087 | TBD design | parity_market_top_holders_invalid_table_renders | Mock Invalid holders; assert Invalid table and Balance column values render. |
| TAB-15 | Holder balance formatting: `k` suffix, decimals, `<0.001` | STATE 069, 087 | TBD design | parity_market_holder_balance_formats_render | Mock balances `6.58k`, `454.03`, `<0.001`; assert all formats render. |
| TAB-16 | `Activity` tab with `My activity` list | STATE 088 | TBD design | parity_market_activity_tab_and_my_activity_visible | Assert `Activity` tab visible; open and assert `My activity` visible. |
| TAB-17 | Activity row format: username, action, amount, outcome/token, timestamp | STATE 088 | TBD design | parity_market_activity_rows_render_expected_fields | Mock activity row; assert username, action, amount, outcome, and timestamp render. |
| TAB-18 | Activity actions `Bought`, `Sold`, `Split` | STATE 088 | TBD design | parity_market_activity_actions_bought_sold_split_visible | Mock mixed activity; assert all three action labels render. |
| TAB-19 | Activity amount formats including decimals, `sDAI`, and `<0.001` | STATE 088 | TBD design | parity_market_activity_amount_formats_render | Mock `0.89`, `150.00 sDAI`, `<0.001`; assert each format renders. |

## Market modals and modal state

| id | live feature/control/flow/state/data field | where it is today | where it must appear in the redesign | e2e test name | verification |
|---|---|---|---|---|---|
| MOD-01 | `Report Answer` modal opens from `Answer on Reality.eth!` | STATE 043, 060 | TBD design | parity_report_answer_modal_opens | Click `Answer on Reality.eth!`; assert `Report Answer` modal visible. |
| MOD-02 | Report modal copy: not resolved; provide answer by depositing bond of `10 XDAI` | STATE 060 | TBD design | parity_report_answer_not_resolved_and_bond_copy_visible | Assert not-resolved copy and `10 XDAI` bond copy visible. |
| MOD-03 | Report modal `Current answer: Not answered yet` | STATE 060 | TBD design | parity_report_answer_current_answer_visible | Assert `Current answer: Not answered yet` visible. |
| MOD-04 | Report modal `Choose an answer` control | STATE 060 | TBD design | parity_report_answer_choose_answer_control_visible | Assert `Choose an answer` control visible. |
| MOD-05 | Report modal `Mark this question invalid` control | STATE 060 | TBD design | parity_report_answer_mark_invalid_control_visible | Assert `Mark this question invalid` control visible. |
| MOD-06 | Report modal `Return` control | STATE 060 | TBD design | parity_report_answer_return_control_visible | Assert `Return` control visible and closes modal. |
| MOD-07 | Report modal `Answer` action control | STATE 060 | TBD design | parity_report_answer_action_control_visible | Assert `Answer` action control visible. |
| MOD-08 | `Add Liquidity` / `Farming Rewards` modal opens from per-outcome `Add Liquidity` | STATE 063 | TBD design | parity_add_liquidity_modal_opens | Click `Add Liquidity`; assert liquidity/farming modal opens. |
| MOD-09 | Farming copy: earn farming rewards `SEER` by providing liquidity | STATE 063 | TBD design | parity_add_liquidity_farming_copy_visible | Assert farming rewards copy visible. |
| MOD-10 | Farming modal `Available Pools:` section | STATE 063 | TBD design | parity_add_liquidity_available_pools_visible | Assert `Available Pools:` label visible. |
| MOD-11 | Farming modal rewards-ended text, e.g. `Rewards ended on: January 4 2026, 22:31` | STATE 063 | TBD design | parity_add_liquidity_rewards_ended_text_visible | Mock rewards date; assert rewards-ended text renders. |
| MOD-12 | Farming modal `Add liquidity` control | STATE 063 | TBD design | parity_add_liquidity_action_control_visible | Assert `Add liquidity` control visible. |
| MOD-13 | Farming modal `Learn more about the farming program` link | STATE 063 | TBD design | parity_add_liquidity_learn_more_link_visible | Assert learn-more link visible and has href. |
| MOD-14 | Farming modal `Return` control | STATE 063 | TBD design | parity_add_liquidity_return_control_visible | Assert `Return` control visible and closes modal. |
| MOD-15 | Pool-details expansion from `View pool details` | STATE 064 | TBD design | parity_pool_details_expansion_visible | Click `View pool details`; assert expanded pool-details area visible. |
| MOD-16 | `Liquidity Chart` label in pool details | STATE 064 | TBD design | parity_pool_details_liquidity_chart_label_visible | Assert `Liquidity Chart` label visible. |
| MOD-17 | Pool details `Pool Id:` with truncated hex value | STATE 064 | TBD design | parity_pool_details_pool_id_visible | Assert `Pool Id:` label and truncated `0x...` value render. |
| MOD-18 | Pool details `Pool Balances:` with token amounts | STATE 064 | TBD design | parity_pool_details_pool_balances_visible | Assert `Pool Balances:` label and captured token amounts render. |
| MOD-19 | Pool details `SHARES` and `TOTAL` series labels | STATE 064 | TBD design | parity_pool_details_shares_total_series_visible | Assert `SHARES` and `TOTAL` series labels visible. |
| MOD-20 | Pool details `Last:` value, e.g. `Last: 0.7454` | STATE 064 | TBD design | parity_pool_details_last_value_visible | Assert `Last:` label and numeric value render. |

## API / data-model fields backing the UI

| id | live feature/control/flow/state/data field | where it is today | where it must appear in the redesign | e2e test name | verification |
|---|---|---|---|---|---|
| DATA-01 | `get-pnl-leaderboard` query params `app`, `chainId`, `period`, `sort`, `dir`, `limit`, `offset`, `breakdown` | DATA MODEL | TBD design | parity_data_get_pnl_leaderboard_query_contract | Intercept request; assert query contract matches captured params and values. |
| DATA-02 | Leaderboard response `updatedAt`, `total`, `limit`, `offset`, `rows` | DATA MODEL | TBD design | parity_data_leaderboard_response_metadata_contract | Mock response; assert UI uses `updatedAt`, `total`, `limit`, and `offset`. |
| DATA-03 | Leaderboard row fields `rank`, `address`, `pnl`, `volume`, `roi`, `unit`, `marketCount`, `score` | DATA MODEL | TBD design | parity_data_leaderboard_row_contract | Mock row object; assert each field maps into the leaderboard table. |
| DATA-04 | `get-market` fields: `id`, `marketName`, `outcomes`, `parentOutcome`, `templateId`, `hasAnswers`, `openingTs`, `finalizeTs`, `encodedQuestions`, `lowerBound`, `upperBound`, `payoutReported`, `payoutNumerators`, `outcomesSupply`, `type`, `wrappedTokens`, `collateralToken`, `conditionId`, `questionId`, `factory` | DATA MODEL | TBD design | parity_data_get_market_contract | Mock get-market response; assert market title, outcomes, type, timestamps, bounds, and collateral fields map to UI. |
| DATA-05 | `markets-search` response fields `markets`, `id`, `type`, `creator`, `outcomes`, `openingTs`, `questions` | DATA MODEL | TBD design | parity_data_markets_search_contract | Mock search response; assert feed can render market id, type, outcomes, and opening timestamp. |
| DATA-06 | `markets-charts` response chart/pool fields including `pool.id`, `token0`, `token1`, `liquidity`, `sqrtPrice`, `token0Price` | DATA MODEL | TBD design | parity_data_markets_charts_contract | Mock charts response; assert chart/pool data is accepted and chart canvas renders without error. |
| DATA-07 | Subgraph pools fields `id`, `fee`, `liquidity`, `tickSpacing`, `sqrtPrice`, `tick`, `token0`, `token1`, `token0Price`, `token1Price`, `volumeToken0`, `volumeToken1`, `volumeUSD`, `txCount`, `totalValueLockedToken0`, `totalValueLockedToken1`, `totalValueLockedUSD`, `feesUSD` | DATA MODEL | TBD design | parity_data_subgraph_pool_contract | Mock subgraph pool; assert pool-details/liquidity data labels can use captured fields. |
| DATA-08 | Wallet identity reverse-resolution response can return no name for address | DATA MODEL walletconnect identity/reverse | TBD design | parity_data_wallet_reverse_resolution_fallback | Mock reverse-resolution 404; assert header falls back to truncated address without error. |
| DATA-09 | Wallet list integration response `getWallets` fields `id`, `name`, `homepage`, `image_id`, `chains`, `supports_wc`, `supports_wcpay` | DATA MODEL getWallets | TBD design | parity_data_get_wallets_contract | Mock getWallets response; assert connect-wallet integration receives wallet id, name, chains, and support flags. |