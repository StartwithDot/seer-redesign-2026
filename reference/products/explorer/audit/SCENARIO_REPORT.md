# explorer: scenario report (DeepSeek from scenario results)

# explorer — SCENARIO REPORT

All scenarios emit the same console error: `Failed to load resource: the server responded with a status of 404 ()`. No wallet/chain/funds/role block is evidenced in this data.

## Completed scenarios

### 02-leaderboard-comparison-desktop — 9/9 OK
**Flow:** markets home → leaderboard → ranking comparison/pagination.  
**Progress:** complete.  
**UI states reached:** markets home; `/leaderboard`; weekly rankings; all-time rankings; ranking filters; Gnosis rankings; score-sorted rankings; next page; previous page.

### 08-mobile-leaderboard-comparison-mobile — 9/9 OK
**Flow:** mobile markets home → mobile leaderboard → ranking comparison/pagination.  
**Progress:** complete.  
**UI states reached:** mobile markets home; `/leaderboard`; weekly mobile rankings; all-time mobile rankings; mobile ranking filters; Gnosis mobile rankings; mobile score sort; next mobile page; previous mobile page.

### 03-market-research-desktop — 8/8 OK
**Flow:** markets home → Marine Le Pen market → chart/range research → holders/activity/related markets.  
**Progress:** complete.  
**UI states reached:** markets home; market `100` detail; custom chart range; last month selected; saved chart date range; holders view; activity view; related conditional markets.

### 05-report-answer-preview-desktop — 5/5 OK
**Flow:** markets home → Marine Le Pen market → report answer → invalid question → pre-answer review.  
**Progress:** complete.  
**UI states reached:** markets home; market `100` detail; report answer opened; invalid question selected; pre-answer state reviewed.

### 06-collections-gate-desktop — 4/4 OK
**Flow:** markets home → My collections → sign-in gate → empty collection.  
**Progress:** complete for the gate-review flow.  
**UI states reached:** markets home; `/collections/default`; collection sign-in requirement; empty collection.  
**Note:** sign-in requirement is observed, but no post-sign-in management state is present in this data.

## Blocked scenarios

### 01-search-trade-preview-desktop — BLOCKED after 3 OK
**Flow:** markets home → search “Marine Le Pen” → market detail → select Yes → trade preview.  
**Progress:** stopped at `select Yes outcome`; then `scenario crashed`.  
**UI states reached:** markets home; search URL with `marketName=Marine+Le+Pen`; market `100` detail.  
**Block reason:** unknown selector — waiting for `getByText(/^#\s*\d+\s+Yes$/i)` timed out after 15s. Trade preview was not reached.

### 07-mobile-search-trade-preview-mobile — BLOCKED after 3 OK
**Flow:** mobile markets home → search “Marine Le Pen” → market detail → open Yes trade sheet.  
**Progress:** stopped at `open Yes trade sheet`; then `scenario crashed`.  
**UI states reached:** mobile markets home; search URL with `marketName=Marine+Le+Pen`; market `100` detail.  
**Block reason:** unknown selector — waiting for `getByText(/^#\s*\d+\s+Yes$/i)` timed out after 15s. Trade sheet was not reached.

### 04-liquidity-investigation-desktop — BLOCKED after 3 OK
**Flow:** markets home → Marine Le Pen market → expand first outcome pool → inspect liquidity chart.  
**Progress:** stopped at `inspect liquidity chart`; then `scenario crashed`.  
**UI states reached:** markets home; market `100` detail; first outcome pool expanded.  
**Block reason:** unknown selector — waiting for `getByText(/^Liquid .../)` with `scrollIntoViewIfNeeded` timed out after 15s. Liquidity chart was not inspected.

## Block classification

- **Unknown selector:** `01`, `04`, `07`.
- **Wallet:** no wallet block evidenced.
- **Chain:** no chain block evidenced.
- **Funds:** no funds block evidenced; trade/liquidity steps were never reached.
- **Role:** no role block evidenced. `06` observed a sign-in requirement but completed its gate-review steps.