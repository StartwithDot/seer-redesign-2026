Pass 10 failure review

Browser execution is unavailable in this sandbox. Build and ESM syntax checks pass; a machine-side e2e rerun is required before claiming green.

Stale UI expectations updated:
- P03 flow.profile_open: return focus to the persistent wallet trigger, since the Profile menu item unmounts.
- P04 nav.guide_external: open Guide drawer, then verify full documentation URL, new tab and opener isolation.
- P05 flow.connect_wallet: disconnected onboarding returns to active step 1.
- P09 nav.round3_active: selected contest tab and eight contest options, excluding overview menu items.
- P10 flow.archive_select: six real archived contest snapshots selected through the contest menu, then return to live Round 3.
- P11 data.chart_98_series: assert 98 data series rather than 98 text labels; labels intentionally remain sparse.
- P14 chart.isolate: assert series opacity metadata, distinct from chart text labels.
- P17 flow.refresh_volume: request real captured token volumes; assert current stat strip, completion tooltip and refreshed inspector. USD totals are captured constants, not invented response fields.
- P21 table.predicted_after_upload, P22 data.up_market_matches, P23 data.down_market_matches, P24 table.sort_market: open Positions to expose predictions and both legs; keep every price/difference assertion.
- L01 lb.title: verify table-first content, including all seven table headings.
- L02 lb.period_switch, L07 lb.count: operate Period menu, retaining 29/34/45/76 counts and reload persistence.
- L03 lb.market_select: operate the actual single-market menu rather than a native select.
- X02 nav.keyboard: assert brand → Markets → Leaderboard → Guide → contest switcher, with focus rings and reverse traversal.
- X03 nav.history: record actual hash route entries, including focus isolation replaced into the home entry; traverse every entry backward and forward without document reloads.

Application defects fixed:
- P02/L01: hidden leaderboard heading restored.
- P03/P08: dialog focus restoration uses persistent account/onboarding controls when the originating menu item unmounts.
- P20 and view-switch preservation: query changes notify React synchronously while retaining hash history entries.
- P14: expose swarm series metadata without changing sparse chart label placement.
- L08: actual fetch, abort, loading, error and retry lifecycle using real bundled leaderboard JSON.
- D01: profile mock signing calls personal_sign, handles rejection, and only saves after success. Image validation test waits for FileReader completion.
- Refresh inspector reads the current market adapter value after refresh.
- Current navigation/sort controls expose disabled reasons where clicking would repeat the current state.

Harness defects fixed:
- P30: external first requests intercepted at browser-context level, including popup destinations.
- X01 and all reported sweep variants: 48-control batches, complete inventory guard (240), 3-second Playwright operation timeout, 240-second sweep test timeout; observable focus alone no longer passes. Operate menu, guide, position, form, file, row and SVG controls. Dedicated screenshots and failure artifacts replace redundant routine screenshots.
- Reuse one browser context across viewports; per-test pages and API routes remain isolated. Remove networkidle waits and fixed post-control sleeps; no fixed wait exceeds 600ms.

No test or parity ID was deleted. No browser PASS result is claimed.
