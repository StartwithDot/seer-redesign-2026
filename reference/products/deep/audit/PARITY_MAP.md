# PARITY MAP — every live feature -> new location -> e2e test (new-location column is fixed in design.md after Gate D; tests are fixed now)
| id | live feature (evidence) | must work how | new location | e2e test |
|---|---|---|---|---|
| P01 | Wordmark "AI Prediction Markets" + OPTIMISM tag (001d) | brand returns home | header/brand | nav.brand_home |
| P02 | Leaderboard link (004d) | route /leaderboard, deep link, back | route | nav.leaderboard_route |
| P03 | Profile link, only connected (005d) | opens profile dialog | header | flow.profile_open |
| P04 | Guide external (001d) | opens gitbook, new tab | header | nav.guide_external |
| P05 | Wallet button: Connect wallet / 0x…dEaD dropdown (001d) | connect mock, show address, disconnect | header | flow.connect_wallet |
| P06 | Step 1 Connect wallet (Optimism only copy) | state done/active | onboarding | flow.onboarding_step1 |
| P07 | Step 2 Create trade wallet button | mock creates wallet, step done; real tx state shown UNKNOWN | onboarding | flow.create_trade_wallet |
| P08 | Step 3 Add sUSDS (greyed until 2) | enabled after 2; deposit/withdraw sheet per docs, marked [from docs] | onboarding/funding | flow.add_susds |
| P09 | Round tab "Round 3 · Originality LIVE" | selected state | round switcher | nav.round3_active |
| P10 | Archive dropdown: 7 ended contests (008d) | list opens, each entry selectable; contents UNKNOWN -> shows "ended, data not in live API" state | round switcher | flow.archive_select |
| P11 | Chart: 98 UP series over time (data/get-market-charts) | all 98 drawn; axis exact with month | main figure | data.chart_98_series |
| P12 | Crosshair date + price (003d) | hover/focus shows time + value | figure | chart.crosshair |
| P13 | Legend chips w/ last UP price, 4dp (001d) | all 98 listed, sorted by UP desc | ranked list | data.legend_prices_match |
| P14 | Chip hover isolates line (010d) | isolate on hover/focus/tap | figure+list | chart.isolate |
| P15 | Search outcomes | filters list+chart | list | flow.search_outcomes |
| P16 | Hide all | hides all lines, toggle back | figure | flow.hide_all |
| P17 | Total volume ~$293.82 (dotted) + refresh icon | shows value, refresh re-reads refresh-market-volume | stats line | flow.refresh_volume |
| P18 | Total liquidity ~$929.08 | shows value | stats line | data.totals |
| P19 | Upload predictions + "No predictions loaded" | file input .csv, loads, shows loaded count; schema UNKNOWN -> accept owner,repo/predicted columns, show parse errors | predictions panel | flow.upload_predictions |
| P20 | Table REPOSITORY (sortable) | sort asc/desc | table | table.sort_repo |
| P21 | PREDICTED col | "—" until upload, then value | table | table.predicted_after_upload |
| P22 | UP BALANCE / MARKET / DIFFERENCE + help button | MARKET= upPrice 4dp; difference = predicted - market; help text UNKNOWN->docs wording | table | data.up_market_matches |
| P23 | DOWN BALANCE / MARKET / DIFFERENCE + help | MARKET= downPrice 4dp | table | data.down_market_matches |
| P24 | Sortable MARKET/DIFFERENCE headers (chevrons) | sort | table | table.sort_market |
| P25 | Export market weights | downloads CSV of repo,up,down | table | flow.export_weights |
| P26 | Row click | live = no-op; new design may open detail (additive) | table | table.row_detail |
| P27 | Start Trading / Execute Strategy (docs) | needs funded trade wallet + CSV; mock runs, shows progress [from docs] | predictions panel | flow.execute_strategy |
| P28 | Sell All to sUSDS, Rebalance (docs advanced) | present as [from docs] actions, enabled when balances>0 (mock) | funding | flow.sell_all |
| P29 | Footer card "Browse on Seer" | external link | footer | nav.browse_seer |
| P30 | Kleros / Telegram / X / GitHub footer | external links | footer | nav.footer_links |
| P31 | TradingView attribution | keep attribution if the lib is used, else drop with reason | footer | nav.attribution |
| L01 | Leaderboard title "All deep markets" + description | present | /leaderboard | lb.title |
| L02 | Period 1D/1W/1M/All | switch refetch (4 fixtures) | /leaderboard | lb.period_switch |
| L03 | MARKET select "All deep markets" | select, option(s) real; only 1 option observed | /leaderboard | lb.market_select |
| L04 | Your rank | needs connected wallet; mock wallet not in list -> "not ranked" state | /leaderboard | lb.your_rank |
| L05 | Search by address + Search | filter rows | /leaderboard | lb.search_address |
| L06 | Rows: rank, wallet(profile name/avatar), pnl, volume, roi, markets, mergedWallets | 76 real rows | /leaderboard | lb.rows_match_api |
| L07 | "N wallets" footer | count | /leaderboard | lb.count |
| L08 | Loading skeleton, empty, error | all three states | /leaderboard | lb.states |
| D01 | Profile dialog: display name <=32, picture drop/choose/link, X handle, preview, Cancel, Sign and save | validate limits, preview updates, cancel closes, save mock-signs | dialog | flow.profile_save |
| M01 | Mobile 390: header w/o wordmark, steps stacked, chart then list, table scrolls horizontally with sticky repo col | usable | all | mobile.layout |
| X01 | Dead-control sweep, every route desktop+mobile | zero silent controls | all | dead_controls.sweep |
| X02 | Keyboard reach | all controls tabbable | all | nav.keyboard |
| X03 | Back/forward, deep links | /, /leaderboard, round query | all | nav.history |
