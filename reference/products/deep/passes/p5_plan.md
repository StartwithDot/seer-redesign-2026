# apps/deep — Playwright E2E Plan (generated from `audit/PARITY_MAP.md`)

**Notation:** `[DEF]` = testid/name defined by this plan (implementation must add it) · `[OBS]` = value observed in the live trace table · `[UNK]` = value not derivable from the trace table → the test asserts *structure/format* and writes the observed literal to `test-results/observed.json` for review (never hardcoded).

**Fixed fixture constants (from trace table):** `SERIES=98`, `LB_ALL=76`, `PERIOD_COUNTS={1d:29,1w:34,1m:45,all:76}`, `ENDED_CONTESTS=7`, volume `~$293.82` `[OBS]`, liquidity `~$929.08` `[OBS]`, residual range `0.81–1.03`, `ROW_H={desktop:30,mobile:44}`, `EXPORT_BTN_H=40`.

---

## 1. Setup / harness

Copy the plumbing of `apps/futarchy/e2e/run.mjs` verbatim (build → `vite preview` → `chromium` → console-error capture → non-zero exit on any captured error); only the app path, port, and suites differ.

**Files**

```
apps/deep/e2e/run.mjs            # entry: build, preview, launch, run suites, report, exit code
apps/deep/e2e/lib/harness.mjs    # copy of futarchy harness
apps/deep/e2e/lib/testids.mjs    # the contract in §2.2 (single source of truth)
apps/deep/e2e/lib/mockWallet.mjs # addInitScript stub for window.ethereum
apps/deep/e2e/lib/api.mjs        # route stubs for get-market-charts / leaderboard / totals
apps/deep/e2e/fixtures/          # CSVs (see §4)
apps/deep/e2e/specs/{parity,nav,flow,dead-controls,ui-law,screenshots}.mjs
apps/deep/e2e/screenshots/       # §7 output
apps/deep/e2e/allowlist.mjs      # console-error allowlist; empty by default, each entry needs comment+issue
```

**run.mjs steps (exact order)**

1. `cwd = repo root`; app dir `apps/deep`. Build with the *same* command `apps/futarchy/e2e/run.mjs` uses for its own app (swap the workspace filter) — do not invent a new build. Exit non-zero on build failure.
2. Spawn `vite preview --port 4173 --strictPort` in `apps/deep`; wait for stdout `/Local:\s+http:\/\/localhost:(\d+)/`, hard timeout 60 s. If `PREVIEW_URL` env is set, skip build+preview and use it (enables smoke-testing a real deploy).
3. `chromium.launch({ headless: true })`; one `browser.newContext()` **per viewport**: `{viewport:{width:1440,height:900}, deviceScaleFactor:1}` and `{viewport:{width:390,height:844}, deviceScaleFactor:1, isMobile:true, hasTouch:true}`. Explicitly *no* `reducedMotion` default — the replay test sets it per-context.
4. Determinism: `context.addInitScript(mockWallet)`; `page.route()` stubs for network (§4.0); block third-party hosts by default (`page.route('**/*', …)` abort for non-app origins) except the allowlist of `[OBS]` external hosts reached only by link-click tests (which run with blocking off).
5. Console capture per page:
   - `page.on('console', m => m.type()==='error' && errors.push({text:m.text(), url, stack}))`
   - `page.on('pageerror', …)`, `page.on('requestfailed', …)` (ignore `net::ERR_ABORTED` from our own stub aborts).
   - At end of every test: `expect(errors.filter(notAllowlisted)).toEqual([])`. Allowlist entries require a reason string.
6. Navigate with `page.goto(new URL('/#'+hash, base))`; `waitForLoadState('networkidle')` where the stub count is known, otherwise `waitForFunction` on the route's root testid.
7. Timeout 15 s/action, 60 s/test; retries 0 locally, 1 in CI; on failure save `trace.zip`, screenshot, console dump, `document.documentElement.outerHTML`.
8. Report: JSON `{runId, viewport, test, status, errors[], observed{}}` + human summary; exit 1 if any fail or any console error.

---

## 2. PARITY tests — one per trace-table id

### 2.1 Test table

| id | test name | exact assertion | selector hint |
|---|---|---|---|
| P01 | `nav.brand_home` | Wordmark link exists with accessible name **exactly** `AI Prediction Markets`; `[data-testid=brand-optimism]` is DOM-after it in the masthead, text `OPTIMISM`, and computed `background-color` alpha `0`, `border-*-width 0`, `padding 0` (no boxed tag), `font-variant-caps` ∈ {`small-caps`,`all-small-caps`}. From `#/leaderboard` click brand → hash is `#/`, split table visible | `getByRole('link',{name:'AI Prediction Markets'})`, `[data-testid=brand-optimism]` |
| P02 | `nav.leaderboard_route` | Click `[data-testid=nav-leaderboard]` → hash `#/leaderboard`, `h1` name `All deep markets`, `lb-row` count `76` | `getByRole('link',{name:'Leaderboard'})` |
| P03 | `flow.profile_open` | Disconnected: `nav-profile` count `0`. Mock-connected: visible, name `Profile`. Click → `role=dialog` name `/profile/i`, focus inside. `Escape` closes, focus returns to trigger | `[data-testid=nav-profile]` |
| P04 | `nav.guide_external` | `Guide` is an `<a>` with `target=_blank`, `rel` contains `noopener`, href is absolute `https:` **and not same-origin** (domain `[UNK]` → assert external only, literal written to observed.json). Click → `context.pages().length===2`, new page URL == href, app page hash unchanged | `getByRole('link',{name:'Guide'})` |
| P05 | `flow.connect_wallet` | Name `Connect wallet` when disconnected. Click → mock connect → name matches `/^0x[0-9a-f]{4}…[0-9a-f]{4}$/i`; `setup-counter` text `Setup 1/3`. Open wallet menu → `role=menu` with `Disconnect`; disconnect → name back to `Connect wallet`, counter `Setup 0/3`, step-1 state `pending` | `[data-testid=wallet-button]`, `[data-testid=setup-counter]` |
| P06 | `flow.onboarding_step1` | `setup-step[data-step="1"][data-state="active"]`; its action button name `/connect wallet/i`; steps 2 & 3 `aria-disabled=true`; step 3 still `aria-disabled=true` while step 2 `pending`; step-1 copy matches `/optimism/i` | `[data-testid=setup-step]`, `[data-testid=setup-step-action]` |
| P07 | `flow.create_trade_wallet` | After connect, step 2 enabled. Click → `aria-busy=true` then `false` ≤10 s; `step2-status` text non-empty and ∈ {success,failure} token set `[UNK literal recorded]`; assert it **never remains in pending**; on mock success → `data-state=done`, step 3 becomes enabled | `[data-testid=setup-step][data-step="2"]`, `[data-testid=step2-status]` |
| P08 | `flow.add_susds` | Step 3 `aria-disabled=true` + non-empty `title` OR `aria-description` before step 2 done. Then open `funds-sheet` (`role=dialog`); deposit `10` → `susds-balance` `10.0000`; withdraw `4` → `6.0000`; close → focus returns to step-3 button; step 3 `data-state=done` | `[data-testid=funds-sheet]`, `[data-testid=deposit-amount]`, `[data-testid=susds-balance]` |
| P09 | `nav.round3_active` | `round-switcher` name matches `/ROUND 3 · ORIGINALITY/` and contains `round-live-pill` text `LIVE`; `aria-expanded` false→true; `role=menu` holds exactly `8` `menuitem`s; exactly one has `aria-checked=true` (Round 3) and it is the only one containing `LIVE`; other 7 names match `/ended/i` | `[data-testid=round-switcher]`, `[data-testid=round-menu]`, `[data-testid=round-option]` |
| P10 | `flow.archive_select` | Menu lists `7` ended items. Select item `1` → switcher name equals that item's label, no `LIVE` pill, `archive-ended` visible and non-empty `[UNK copy → assert non-empty]`, split rows `0` (or `ended-empty` visible), URL carries `round=` (value recorded). Select Round 3 → `98` rows restored and volume text back to the live value | `[data-testid=archive-ended]` |
| P11 | `data.chart_98_series` | Intercept `**/data/get-market-charts**`, capture JSON → series length `98`. Switch to swarm: `swarm-canvas` exists; `page.evaluate(() => document.querySelector('[data-testid=swarm-canvas]').__labels.length)` === `98`. Split view: `split-row` count `98` | `[data-testid=swarm-canvas]`, `canvas.__labels` |
| P12 | `chart.crosshair` | Hover dot index 50 → `crosshair-label` text matches `/(date)/` + `/\$\d+\.\d{2,4}/`. Focus canvas, `ArrowRight` → label equals exact date+price of `series[51]`; `ArrowLeft` → `series[50]` (one trade per keypress) | `[data-testid=crosshair-label]` |
| P13 | `data.legend_prices_match` | For all `98`: `outcome-row[data-repo]` UP cell text === `series.up.toFixed(4)`; rendered order is non-increasing numerically; `98` rows in **both** rail and split table | `[data-testid=outcome-up]`, `[data-testid=col-up-price]` |
| P14 | `chart.isolate` | Hover `outcome-row[i]` → `canvas.__labels.filter(l=>l.alpha===1).length===1` and its id === i; keyboard focus+`Enter` same; pointer leave → `98` at alpha 1; mobile tap toggles | `[data-testid=outcome-row]` |
| P15 | `flow.search_outcomes` | Type substring of repo 1 → hash contains `q=<encoded>`; visible row count === count computed from the API fixture (not hardcoded); clear → `98`; deep link `#/?q=<x>` on fresh load yields the same count | `[data-testid=search-outcomes]` |
| P16 | `flow.hide_all` | `Hide all` button → `aria-pressed=true`, visible-series count `0`, name becomes `Show all`; click again → `98` visible, name `Hide all`. With an active `q`, restoring shows the *filtered* count, not 98 | `[data-testid=hide-all]` |
| P17 | `flow.refresh_volume` | Stub totals with `$293.82`; assert text matches `/~\$293\.82/`; re-stub with `$301.00`; click `refresh-volume` → `aria-busy` true→false, text matches `/~\$301\.00/` exactly, and `window.__loadCount` unchanged (no reload) | `[data-testid=totals-volume]`, `[data-testid=refresh-volume]` |
| P18 | `data.totals` | Dateline contains both a volume and a liquidity figure; each parses to a number equal to the stubbed API total ±`0.01`; `totals-volume` computed `text-decoration-style` is `dotted` `[OBS]`; both visible at 1440 and 390 | `[data-testid=totals-liquidity]` |
| P19 | `flow.upload_predictions` | Initial: `predictions-empty` text `No predictions loaded`. Upload valid CSV (3 matching + 1 unknown repo) → `predictions-parse-error` absent, predicted cells updated for exactly the 3, summary counts match fixture. Upload bad-header CSV → `predictions-parse-error` visible and lists line numbers; page does not crash; prior data policy recorded | `[data-testid=upload-predictions]` |
| P20 | `table.sort_repo` | Click Repository header → `aria-sort=ascending`, hash contains `sort=name`, column values ascend (`localeCompare`, case-insensitive). Second click → `aria-sort=descending`, order reverses, second-state param recorded `[UNK: -name or dir=desc]` into observed.json and asserted stable. Reload `?sort=name` → same ascending order | `[data-testid=sort-name]`, `th[aria-sort]` |
| P21 | `table.predicted_after_upload` | Pre-upload: all `98` predicted cells text exactly `—`. Post-upload: only matched repos show the CSV literal, others remain `—`; applying sort does not change the set | `[data-testid=col-predicted]` |
| P22 | `data.up_market_matches` | For all 98: `up-market` text === API price `.toFixed(4)`; `|up-diff|` === `|up-balance − up-market|` ±`1e-4`; sign convention recorded once and asserted consistently. Help button opens a popover with non-empty text `[UNK wording]` | `[data-testid=help-up]`, `[data-testid=up-market]` |
| P23 | `data.down_market_matches` | Same assertions on the DOWN column set; additionally `upPrice+downPrice` ∈ `[0.81,1.03]` for every row (ties to `data.sum_residual`) | `[data-testid=down-market]` |
| P24 | `table.sort_market` | Click MARKET header → `aria-sort` set (first direction recorded), hash `sort=` changes, numeric order matches direction; click DIFFERENCE header → different `sort` param and diff-ordered rows; a chevron element is visible in both header states | `[data-testid=sort-market]`, `[data-testid=sort-difference]` |
| P25 | `flow.export_weights` | Click → `download` event; filename matches `/\.csv$/`. Read bytes: first line exactly `repo,up,down` + `LF (0x0A)`, first byte `0x72` (no BOM, no CR); `98` data lines; per line `up+down` ≈ 1 ±`1e-4`. Button computed height `40` ±`0.5`, background transparent (ghost) | `[data-testid=export-weights]` |
| P26 | `table.row_detail` | Click (and separately `Enter` on focused) `split-row[0]` → hash matches `/^#\/repo\/[^/]+\/[^/]+$/`, `repo-detail` heading contains the repo slug; `history.back()` restores the list **with prior `sort`/`q`** | `[data-testid=split-row]`, `[data-testid=repo-detail]` |
| P27 | `flow.execute_strategy` | Button `disabled` + `title` while wallet unfunded or CSV missing. Checklist items count ≥3 and render in a fixed recorded order with states. After prereqs: enabled; click → items complete in DOM order, `aria-live` announcements in the same order, terminal state reached ≤10 s from mock, zero console errors | `[data-testid=start-trading]`, `[data-testid=checklist-item]` |
| P28 | `flow.sell_all` | `susds-balance=0` → `sell-all` disabled with non-empty `title`/`aria-description`. After deposit → enabled; click → confirm if present → balance `0.0000`, `sell-all` disabled again; `rebalance` enabled only with >1 asset | `[data-testid=sell-all]`, `[data-testid=rebalance]` |
| P29 | `nav.browse_seer` | Footer `Browse on Seer` is external `target=_blank` + `rel noopener`; click opens 1 new tab at that href; app page unchanged | `[data-testid=footer-browse-seer]` |
| P30 | `nav.footer_links` | Exactly `Kleros`, `Telegram`, `X`, `GitHub`; each href absolute `https:` off-origin, `target=_blank`, `rel` contains `noopener`; each click opens exactly one new tab with that href; hrefs snapshotted | `[data-testid=footer-link]` |
| P31 | `nav.attribution` | If `[data-testid=tradingview-attribution]` exists → visible, external, non-empty accessible name. If absent → report records `attribution: "dropped"` with reason and the test passes; a present-but-empty/broken attribution link fails | `[data-testid=tradingview-attribution]` |
| L01 | `lb.title` | `h1` name exactly `All deep markets`; description paragraph non-empty and visible at both viewports | `[data-testid=lb-title]`, `[data-testid=lb-description]` |
| L02 | `lb.period_switch` | `role=tablist` with tabs `1D,1W,1M,All`; each click sets `aria-selected=true` on itself only, hash gains `period=1d|1w|1m|all`, and `lb-row` count === `29/34/45/76` respectively; deep link per period reproduces count on fresh load | `[data-testid=lb-period]` |
| L03 | `lb.market_select` | `MARKET` combobox value/option text `All deep markets`; option count is exactly `1` `[OBS]`; select is enabled (not a dead control) and re-selecting the sole option changes no URL and throws nothing | `[data-testid=lb-market-select]` |
| L04 | `lb.your_rank` | Disconnected → `your-rank` shows a connect prompt and no rank number. Connected mock (not in list) → text matches `/not ranked/i` `[UNK literal → assert testid state="not-ranked"]` | `[data-testid=your-rank]`, `data-state` |
| L05 | `lb.search_address` | Input name `Search by address` + `Search` button; entering row 1's address → `1` row; garbage → `lb-empty` visible; clearing → `76` rows; URL param recorded `[UNK]` | `[data-testid=lb-search-input]`, `[data-testid=lb-search]` |
| L06 | `lb.rows_match_api` | `76` `lb-row`s; for every row rank/wallet(pnl, volume, roi, markets, mergedWallets) equals stubbed API: rank ascending from 1, numeric cells formatted, mergedWallets badge count matches API value | `[data-testid=lb-row]` |
| L07 | `lb.count` | Footer matches `/^\d+ wallets$/`; number === current `lb-row` count === API total; updates `29/34/45/76` with the period switch | `[data-testid=lb-count]` |
| L08 | `lb.states` | Stub delay → `lb-skeleton` visible with `aria-busy=true` on the table; `[]` → `lb-empty`; `500` → `lb-error` with a retry control; retry with healthy stub renders `76` rows | `[data-testid=lb-skeleton|lb-empty|lb-error]` |
| D01 | `flow.profile_save` | Name input: 32 chars accepted (counter `32/32`), 33rd rejected (value stays 32, counter at limit). Picture: drop zone accepts file input & URL field; 499 KB accepted, 501 KB rejected with a visible message. X handle field, live preview mirrors name/avatar. `Cancel` discards (reopen shows old). `Sign and save` → mock sign called once, dialog closes, reopen shows new name | `[data-testid=profile-dialog]`, `…profile-name|profile-upload|profile-link|profile-x|profile-preview|profile-cancel|profile-save` |
| M01 | `mobile.layout` | At 390: brand wordmark text hidden (`brand` accessible name still present or nav still reachable), `setup-strip` shows the compact `1·2·3` bar and opens a sheet (not inline steps), order in DOM/viewport is chart **before** list, split table scrolls horizontally inside its own container (`scrollWidth>clientWidth`) with the repo cell's `left` unchanged ±1 px after `scrollLeft=300`, all rows height `44` | `[data-testid=setup-strip]`, `[data-testid=split-table-scroll]` |
| X01 | `dead_controls.sweep` | Algorithm in §5, all routes × states, both viewports | §5 |
| X02 | `nav.keyboard` | §3.5 order holds, every control reachable, focus ring visible | §3.5 |
| X03 | `nav.history` | §3.4 history matrix passes; `window.__loadCount === 1` | §3.4 |

### 2.2 `data-testid` contract (single source of truth: `lib/testids.mjs`)

**Masthead/header:** `brand` (a[href="#/"]), `brand-optimism`, `nav-leaderboard`, `nav-guide`, `nav-profile`, `wallet-button`, `wallet-menu`, `setup-counter`, `round-switcher` (button, `aria-expanded`), `round-menu` (role=menu), `round-option` (+`aria-checked`), `round-live-pill`, `archive-ended`, `totals-volume`, `totals-liquidity`, `refresh-volume`.
**Setup/predictions:** `setup-strip`, `setup-step` (`data-step` 1|2|3, `data-state` pending|active|done|disabled), `setup-step-action`, `step2-status`, `predictions-card`, `upload-predictions` (file input), `predictions-empty`, `predictions-parse-error`, `predictions-summary`, `export-weights`, `start-trading`, `checklist-item` (+`data-state`).
**Funds sheet:** `funds-sheet`, `deposit-amount`, `withdraw-amount`, `susds-balance`, `sell-all`, `rebalance`.
**Views/tools:** `view-switch`, `view-tab-split`, `view-tab-swarm` (role=tab), `search-outcomes`, `hide-all` (aria-pressed), `swarm-canvas` (exposes `canvas.__labels: [{id,text,x,y,w,h,alpha}]`), `time-figure`, `crosshair-label`, `outcomes-rail`, `outcome-row` (`data-repo`), `outcome-up`, `isolate-badge`.
**Split table:** `split-table`, `split-table-scroll`, `split-row` (`data-repo`, `data-col` on cells), `col-repository`, `col-predicted`, `up-market|up-diff|up-balance`, `down-market|down-diff|down-balance`, `sort-name|sort-predicted|sort-market|sort-difference`, `help-up|help-down` (+`help-popover`).
**Repo detail:** `repo-detail`.
**Leaderboard:** `lb-title`, `lb-description`, `lb-period` (+`data-period`), `lb-market-select`, `your-rank` (+`data-state`), `lb-search-input`, `lb-search`, `lb-row`, `lb-count`, `lb-skeleton`, `lb-empty`, `lb-error`.
**Dialog:** `profile-dialog`, `profile-name`, `profile-upload`, `profile-link`, `profile-x`, `profile-preview`, `profile-cancel`, `profile-save`.
**Footer:** `footer-browse-seer`, `footer-link` (`data-network`), `tradingview-attribution`.
**Harness-only:** `window.__labels` = canvas labels (alias), `window.__loadCount` (increment in `addInitScript`), `window.__deep.mutations` (set by §5 observer).

### 2.3 Extras named in the TESTS section with no PARITY id — flagged

| test | assertion |
|---|---|
| `data.sum_residual` | For all 98: `0.81 ≤ up+down ≤ 1.03`; each row has a non-empty hatch/pattern token (`data-hatch`) matching one of the recorded set; residual column consistent with §P22/P23 values |
| `chart.replay` | `t` advances monotonically with time; row order FLIPs (compare `data-repo` sequence before/after `t` step — must change when ranks differ); with `context.reducedMotion='reduce'` the animation jumps directly to the terminal frame (no intermediate frames observed) |

---

## 3. NAVIGATION

### 3.1 Route inventory (must all be UI-reachable)

| route | entry point |
|---|---|
| `#/` | brand |
| `#/leaderboard` | `nav-leaderboard` |
| `#/repo/<owner>/<repo>` | `split-row` (P26, additive) |
| dialog states (`profile`, `funds`, `predictions`) | header / setup steps |

Reachability test: from `#/`, BFS over same-origin `href`/clickable controls, assert each route above is visited; recorded in `observed.routes`.

### 3.2 Deep-link matrix (each row: fresh context → goto → assert → zero console errors)

| URL | expected |
|---|---|
| `#/` | `view-tab-split` selected, 98 rows, Round 3 active |
| `#/?view=swarm` | swarm tab selected, `swarm-canvas` visible, `__labels.length===98` |
| `#/?view=split` | split selected |
| `#/?view=bogus` | falls back to split, hash normalized or preserved — recorded, no error |
| `#/?sort=name` | P20 ascending order |
| `#/?sort=<bad>` | default order, no error |
| `#/?q=<repo substring>` | filtered count === computed count |
| `#/?iso=<owner/repo>` | exactly 1 series at alpha 1 |
| `#/?round=3` | Round 3 active, LIVE pill |
| `#/?round=<ended-slug>` | ended state (`archive-ended`), rows 0 |
| `#/?round=nope` | fallback to Round 3, recorded |
| `#/?dialog=profile` | dialog opens **iff** mock-connected; unconnected → dialog not shown, no error |
| `#/?dialog=funds`, `#/?dialog=predictions` | sheet visible at 390, dialog at 1440 |
| `#/leaderboard` | 76 rows |
| `#/leaderboard?period=1d|1w|1m|all` | counts 29/34/45/76, tab `aria-selected` |
| `#/leaderboard?period=x` | fallback `all` (76) |
| `#/leaderboard?dialog=profile` | dialog open |
| `#/repo/<o>/<r>` | detail heading = repo slug, back returns to list |
| `#/repo/<o>` (malformed) | graceful fallback (home or not-found with brand visible), no error |
| `#/unknown` | graceful fallback, brand visible, no dead end |

### 3.3 Query-param round-trip
For each of `view, sort, q, iso, round, period, dialog`: set via UI → read hash → reload same hash → UI state identical (same testid states/counts). Two params together (`#/?view=swarm&q=x`) must not clobber each other (`url.searchParams` diff contains both).

### 3.4 History (X03)
Scripted sequence: `#/` → apply `sort=name` → `#/leaderboard` → `period=1w` → back to `#/` → open `#/repo/…`. Then `goBack()` ×5 asserting each hash exactly, `goForward()` ×5 asserting each hash exactly, and each state's *data state* restored (sort order, period count, filter). Assert `window.__loadCount === 1` throughout (SPA, no full reloads).

### 3.5 Keyboard order & tabbability (X02)
Expected `document.activeElement` testid sequence on `Tab` from `body` at 1440:
`brand → nav-leaderboard → nav-guide → wallet-button → (nav-profile if connected) → round-switcher → refresh-volume → view-tab-split → view-tab-swarm → search-outcomes → hide-all → export-weights → upload-predictions → split-row[0] … split-row[97] → outcome-row[0] → outcome-row[97] → footer-browse-seer → footer-link×4 → tradingview-attribution?`
Assertions: every step lands on the expected testid (recorded list, so a diff is a reviewable artefact); `Shift+Tab` reverses exactly; each focused element has a non-`none` outline/box-shadow; `Enter`/`Space` on tabs, rows, toggles and `hide-all` perform their action; dialog traps focus (Tab cycles within `profile-dialog`) and `Escape` restores focus to the trigger.

### 3.6 No dead ends
For every entry in the §5 state matrix: assert ≥1 visible control resolving to `#/` (brand) and that `history.back()` leaves the state successfully; assert no state renders a full-screen blocker without an exit control.

---

## 4. FLOW tests

### 4.0 Mock contract (`lib/mockWallet.mjs`, `lib/api.mjs`)
`window.ethereum` stub: `eth_requestAccounts` → `['0x'+ '11'.repeat(20)]`, `eth_chainId` → `'0xa'` (Optimism 10), `wallet_switchEthereumChain` no-op, `eth_sendTransaction` → deterministic fake hash, `personal_sign` → deterministic signature, plus a `__calls[]` log so tests assert call counts/ordering. API stubs: `get-market-charts` (98 series, deterministic seed), totals, leaderboard (76 entries), upload/tx endpoints. Every stub asserts it was *called* the expected number of times.

### 4.1 `connect → create trade wallet → add sUSDS → upload CSV → start trading` (P05–P08, P19, P27)
1. `#/` disconnected: `Connect wallet`; all setup steps 2/3 `aria-disabled=true`.
2. Click → mock connect → `Setup 1/3`, step1 `done`, step2 enabled.
3. Step 2 click → busy → terminal success → step2 `done`, step3 enabled.
4. Step 3 → `funds-sheet` → deposit `10` → `susds-balance 10.0000` → close, step3 `done`.
5. Upload `predictions-valid.csv` → predicted cells updated (P21), `start-trading` still disabled (checklist shows the remaining item).
6. Reopen funds sheet, deposit until funded → `start-trading` enabled; click → checklist items complete in order, progress region announced via `aria-live`, terminal state ≤10 s, no console error.
Negative branches: cancel/escape at each dialog leaves prior state intact; rejecting the wallet request (`eth_requestAccounts` throws) leaves `Connect wallet` and shows no crash.

### 4.2 `archive_select` — §P10 steps as written; plus "Return to Round 3 restores 98 rows and the live totals text".

### 4.3 `profile_save` — §D01 steps; add: reopening the dialog after save shows persisted name; 32-char boundary; 500 KB boundary via runtime-generated `Buffer.alloc(499*1024)` / `Buffer.alloc(501*1024)` fixtures.

### 4.4 `leaderboard period switch` — §L02: tab-by-tab, asserting order `29 → 34 → 45 → 76`, `aria-selected` exclusivity, `lb-count` sync, and that switching period while a search is active re-applies the search (count ≤ period count).

### 4.5 `view switch Split/Swarm` — tab click: `aria-selected` flips, hash gains `view=swarm|split`, split list hidden (`aria-hidden`/unmounted — recorded), swarm canvas `__labels.length===98`, `iso`/`q`/`sort` preserved across the switch, and the selected view survives reload.

---

## 5. DEAD-CONTROL sweep (X01)

**Enumeration selector** (per route+state+viewport), scoped to visible, non-inert subtrees:
`button, a[href], input:not([type=hidden]), select, textarea, [role=tab], [role=switch], [role=menuitem], [role=row], [contenteditable="true"]`
filtered by `el.checkVisibility() && !el.closest('[inert],[aria-hidden="true"],[hidden]')`.

**State matrix (route × state × {1440,390})**

| route | states |
|---|---|
| `#/` | disconnected default; connected (step1 done); connected+wallet+sUSDS+CSV; `view=swarm`; `q` active; hide-all toggled; isolate active; round menu open; funds sheet open; predictions sheet open (mobile); ended-round selected |
| `#/leaderboard` | default; each period; market select open; search with result; search with none; skeleton (delayed stub); empty ([]); error (500) |
| `#/repo/<o>/<r>` | default |
| dialog | `profile-dialog` open (fields filled + empty) |

**Per control, the algorithm**

1. Restore the state (re-`goto` deep link; skip if the previous control navigated). 
2. Before-snapshot: `{hash, url, dialogs, focusedTestid, aria: {expanded, checked, pressed, selected} for the control, scrollX/Y}`.
3. Install (once per page): `MutationObserver` on `document.documentElement` (`childList,subtree,attributes,characterData`) incrementing `window.__deep.mutations`; a `download` listener; a dialog-insert counter; a `popup`/`context.pages()` counter.
4. Operate: `scrollIntoViewIfNeeded()`, then real `click()`; for `input` also fill `'test'` (and clear); for `select` choose the first non-current option and restore; for `[role=row]` click the row and `Enter` if focusable.
5. Wait `250 ms` + one `requestAnimationFrame` + `networkidle`-with-timeout-1s.
6. **Pass** if any of: hash/URL changed; `dialogs` count changed; `mutations > 0`; `activeElement` testid changed; any of `aria-expanded/checked/pressed/selected` changed; a download fired; `context.pages()` grew (external link); a navigation committed.
7. **Otherwise pass only if intentionally inert:** `disabled === true || aria-disabled === 'true'` **and** (`title` non-empty **or** `aria-description` non-empty). Else **FAIL** listing the control signature `{tag, testid, role, accessibleName, href, route, state, viewport}`.
8. Restore URL if step 4 navigated (`history.back()` or re-goto).
9. Assert zero console errors accumulated across the sweep.

**Allowed exceptions (each must be matched explicitly, not silently skipped):**
- External links with `target=_blank` → pass on "new tab opened with that href; current page unchanged" (P04, P29, P30, attribution).
- `download`-bearing controls → pass on the download event (P25).
- `mailto:`/`tel:` hrefs.
- Controls inside `[inert]`/`[aria-hidden=true]`/`hidden` subtrees (excluded at enumeration; counted in report as `skipped-hidden`).
- Canvas-only hit targets inside `swarm-canvas` (canvas clicks are covered by P12/P14 instead).
- Duplicate links pointing to an already-verified same-href destination (deduped by signature; count reported).

**Output:** `test-results/dead-controls.json` = `[{signature, route, state, viewport, disposition: changed|inert-with-affordance|external-tab|download|skipped-hidden|FAIL}]`, with a hard gate: `FAIL.length === 0`.

---

## 6. UI-law checks

Implemented in `specs/ui-law.mjs` as `Law01…Law24` (the ids from `ui-quality-rules §12` are transcribed from that file at implementation time — it is not quoted in this brief, so only the six measurable laws named here are specified). Each returns `{law, pass, offenders[]}` and a screenshot of the first offender.

| law | measurement |
|---|---|
| **Row height** | Every `split-row`, `lb-row`, `outcome-row`, `checklist-item` box height === `30` at 1440 and `44` at 390, tolerance `±0.5`; also assert height is identical across all rows (spread `≤0.5`) |
| **Column left edges** | For each `data-col` group in `split-table`, collect cell `left` across all 98 rows; `max−min ≤ 0.5`; header cell `left` equals body cell `left` ±`0.5` |
| **No horizontal overflow** | At 320×844 and 390×844: `document.scrollingElement.scrollWidth ≤ clientWidth + 1`; then per-element scan for `rect.right > viewport.width + 1` **excluding** `[data-testid=split-table-scroll]` and its descendants; for the table scroller assert `scrollWidth > clientWidth` (intentional) and that, after `scrollLeft = 300`, the repo cell `left` is unchanged ±1 (sticky col, M01) |
| **LIVE label stable width** | Width of `round-live-pill` measured in 3 states (menu closed, menu open, switcher hover/focus); spread `≤0.5 px`; also assert the pill is present in exactly one menu item (P09) |
| **Label overlap (`canvas.__labels`)** | `labels = canvas.__labels`; assert `labels.length === visibleSeriesCount`; every label rect fully inside canvas bounds ±`0.5`; all pairwise intersections have area `≤1 px²`; label rects never intersect `crosshair-label` rect; re-run after view switch, isolate, hide-all, and at 1920 (more space must not reduce label count) |
| **Inspector never covers its row** | Hover/focus `outcome-row[i]`, get row box and `inspector` box; intersection area === `0`; at 390 the inspector is a bottom sheet — assert it does not overlap the focused row after auto-scroll (record whether a scroll occurred) |

---

## 7. Screenshot list

Convention `screenshots/{w}x{h}-{route}-{state}.png`; context options for capture: `reducedMotion:'reduce'`, `deviceScaleFactor:1`, caret hidden, `document.fonts.ready` awaited, animations disabled, clock frozen, stubs deterministic, mock wallet state pre-set by deep link.

**1440×900 (primary set, full list)**

| file | state |
|---|---|
| `1440x900-home-split-default` | disconnected, Round 3, split |
| `1440x900-home-split-connected` | step1 done |
| `1440x900-home-setup-complete` | wallet + sUSDS + CSV loaded |
| `1440x900-home-swarm` | `view=swarm` |
| `1440x900-home-swarm-isolate` | `iso=<repo>` |
| `1440x900-home-swarm-crosshair` | crosshair on index 50 |
| `1440x900-home-search-active` | `q` filtered, 12-row result |
| `1440x900-home-hide-all` | all series hidden |
| `1440x900-round-menu-open` | 8 items, Round 3 checked |
| `1440x900-archive-ended` | ended contest selected |
| `1440x900-predictions-empty` | `No predictions loaded` |
| `1440x900-predictions-loaded` | valid CSV applied |
| `1440x900-predictions-parse-error` | bad CSV |
| `1440x900-funds-sheet` | balance 10.0000 |
| `1440x900-strategy-progress` | checklist mid-run |
| `1440x900-profile-dialog` | filled, 32/32 |
| `1440x900-repo-detail` | `#/repo/<o>/<r>` |
| `1440x900-leaderboard-default` | 76 rows |
| `1440x900-leaderboard-period-1d` (and `1w`,`1m`) | 29/34/45 |
| `1440x900-leaderboard-search` | one address filtered |
| `1440x900-leaderboard-empty` | `[]` stub |
| `1440x900-leaderboard-error` | 500 stub |
| `1440x900-leaderboard-skeleton` | delayed stub |

**1920×1080:** `home-split-default`, `home-swarm`, `home-swarm-labels-dense` (label-collision check), `leaderboard-default`.

**390×844 (mobile):** `home-split-default`, `home-setup-strip` (compact 1·2·3), `home-setup-sheet`, `home-swarm`, `home-table-scrolled-x300` (sticky repo col visible), `predictions-sheet`, `funds-sheet`, `round-menu-open`, `leaderboard-default`, `leaderboard-period-1m`, `profile-dialog`.

**Gate:** screenshots are produced in the same run as the assertions; a viewport/state with assertions but no screenshot (or vice versa) fails the run's completeness check.