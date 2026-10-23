# ux.md — Seer Explorer (app.seer.pm) redesign: evidence-based UX research brief

**Evidence base.** Desktop captures `audit/raw/001–090`, typed captures `audit-types/raw/*`, and scenario replays `audit/scenario-out/*` (all 8 pass). API behaviour from `POST .netlify/functions/markets-search` (2947 markets, 100/page). Anything not in those sources is marked **unknown** — notably real balances, trade sign/confirm, approve flow, create-market steps 2+, dispute/Kleros screens, portfolio/account pages, post-sign-in collections, policy body text, and keyboard behaviour (`policy links only`, `002`).

---

## 1. Jobs-to-be-done

1. **"Someone sent me a link — is this market worth my attention?"** Arrives with: a question URL and no context. Decides: trade, share, or leave. Evidence: link-landing surface `037` carries question, outcome rows and odds, but the trust signals are scattered (`037` meta row, `045` chart, `051` tooltip).
2. **"Where is the market mispriced, and can I get size?"** Arrives with: a topic or a scan intent. Decides: which market to open first. Evidence: home offers no sort header or compare view; ordering lives inside `Filters → Sort By` (`001`, `006`).
3. **"Can I trust these odds?"** Arrives with: a probability. Decides: act now, wait, or discount it. Evidence: liquidity/volume/P&L have missing or mixed units (`037`, `007`), verification is a small icon (`001`) or an amber banner (`audit-gap 023`), and the chart plots pool-implied price, disclosed only in a tooltip (`045`, `051`).
4. **"Where is this market in its lifecycle, and do I need to do something?"** Arrives with: a market that may be reporting, disputing, or pending. Decides: trade, report, or wait. Evidence: status strip (`037`), report dialog with 10 xDAI bond (`043`), "Answered too soon | Reopen question" (`090`, `audit-types 011`).
5. **"Can I consume this market as a fact, not a screenshot?"** Arrives with: an integration spec. Decides: which id to key on and how to resolve conditionality. Evidence: API records carry `id`, `parentMarket{id,conditionId,payoutReported,payoutNumerators}`, `parentOutcome`, `questions[].{bond,finalize_ts,is_pending_arbitration}`; the UI exposes none of the parent linkage (`001`, `006`, `051`).

---

## 2. Personas

**(a) Newcomer / forecaster — arrived via a market link.**
Needs, in order: the question in plain language, the odds, and a reason to believe them. On `037` the question and outcome rows are legible, but three things break the read: the chart y-axis auto-scales to 48–52 for a 50/50 market (`045`), the "Invalid" row shows `210.85 SER-INVALID` at 0% with no settlement meaning (`037`), and percentages do not sum to 100 — e.g. `No 74.5% + Yes 35.3% + Invalid 0%` in `056–069`. **Unknown:** whether visitors understand "outcome token" at all; no comprehension test was captured.

**(b) Trader / analyst — scanning many markets.**
Needs a dense, sortable, comparable surface. Home renders equal-tile cards in 4 columns with a donut and 2–3 legend rows (`001`); there is no table, no sort header, no compare view, and 2947 markets arrive 100 at a time via infinite scroll (`001`, API). The only ordering control is two clicks deep (`Filters`, `006`). Card hover mixes units — `5.75k sDAI (7.26k $)`, `4.94k YASHAR / 12.15k sDAI` (`007`) — so cross-market comparison requires mental currency conversion.

**(c) AI-agent builder — needs machine-readable facts.**
Needs: stable `id` and `conditionId`; `parentMarket.id` + `parentOutcome` (0=Yes, 1=No) to decide whether a child's tokens are worthless; `odds[]` with the same basis as the UI; `questions[].bond`, `min_bond`, `finalize_ts`, `is_pending_arbitration`; `verification`; `url` slug for deep links. `markets-search` is evidenced; **`get-market` is not observed in the audit — treat as unknown** and confirm before documenting. Today the conditionality exists only in JSON: 17 of 100 sampled markets are conditional, yet the UI's only trace is a filter checkbox (`006`) and a Related Conditional Markets tab (`051`, two identical titles differentiated solely by "being 'Yes'" vs "being 'No'" — `068`). The redesign should ship a "market facts" panel or documented JSON endpoint mirroring what the ticket actually uses.

---

## 3. Primary tasks (click counts from captured states; typing counted as one step)

**1. Find a market by topic — current: 1 click + typing, or 3+ with filters.**
1. Open `/` (`001`). 2. Type in `Search by market, outcome or collection` → URL becomes `/?marketName=e` (`008`). 3. Open `Filters` (`006`). 4. Set up to 8 fields. 5. `Apply`. 6. Scroll and click a title.
*Fails:* search produced no visible feed change (`008`); filter labels are unexplained (Market States, Verification Status, Conditional Market, Futarchy — `006`).

**2. Read odds and judge reliability — 0 clicks to see, 2+ hovers to trust.**
1. Read outcome rows (`037`). 2. Hover the chart (`045`, `055`). 3. Open the liquidity help tooltip (`051`). 4. Hover a card for the breakdown (`007`).
*Fails:* auto-scaled y-axis exaggerates flat markets (`045`), end-label pills cover ticks such as "80.00" (`045`), units missing on `Liquidity 7.54k / Volume 11.75k` (`037`).

**3. Place a trade preview — 3 clicks + typing to first preview (scenario 01, now 6/6).**
1. Open market. 2. Click an outcome row to set the ticket (`06-*.png`; Yes preselected). 3. Type `You pay` amount. 4. Read `You will get` = `1.1868081659397476` shares. 5. Read Avg price / Price after buy / Potential return. 6. Adjust Max slippage (1%). 7. CTA.
*Fails:* order-type dropdown is labelled "Market"; output unrounded; CTA resolves to `Not enough balance.` on the mock wallet; `Mint / Merge / Redeem` are hidden under a `More` accordion whose opened state was not captured effect-wise (`065`, `066`).

**4. Understand a conditional market — 0 clicks if you land on the child, 1–2 if you start from home.**
1. On the child page, read the banner: conditional on "`<parent question>`" being "Yes"/"No", else tokens worthless (`audit-gap 001`, `012`; mobile `026`, `038`). 2. If starting from home: `Filters → Show only conditional markets` (`006`) or the `Related Conditional Markets` tab (`051`).
*Fails:* the parent is never linked from the card or the child's meta row; collateral switch to `LEPEN_NRYES / LEPEN_NRNO` is unexplained.

**5. Check who is winning — 1 click to reach, 4+ to interrogate.**
1. Header `Leaderboard` (`008`). 2. Period `1D/1W/1M/ALL`. 3. `Filters` (App, Chain). 4. Click a column to sort. 5. `Next`.
*Fails:* sorting reports "Sorted by Score, high to low" while rows stay P/L-ordered (`021–024`); `Next` yields identical rows (`025`); `1D`/`1M` stick on "Updating…" (`014–016`); search is a no-op (`026`).

**6. Check resolution/dispute status and report an answer — 3 clicks to the dialog.**
1. Open market. 2. Read the status strip (`037`, `090`). 3. Click `Answer on Reality.eth!` (`037`). 4. In the dialog choose an answer or `Mark this question invalid`, note the 10 xDAI bond (`043`). 5. `Answer`.
*Fails:* "Reports open" coexists with "This market is not resolved yet" and "Current answer: Not answered yet" (`056–069` vs `060`); `Deadline:` renders with no value and "Answered too soon" is unexplained (`090`); `finalize_ts` is visible only in JSON.

---

## 4. First-5-seconds test

**A stranger should understand:** this is a prediction market; here is a question; the percentage is a probability; here is whether I can act on it.

**Live home (`001`) communicates:** brand, a beta disclaimer, nav, search, a 4-column card grid with donut + legend rows, a `$` liquidity figure, and two small status icons. It does **not** communicate that a percentage is a probability, how markets are ordered, or why some are conditional.

**Live market page (`037`) communicates:** the question and outcome percentages survive a 5-second read. It misfires on: the chart's 48–52 axis implying noise (`045`), the unexplained invalid row (`037`), and a status strip whose vocabulary (Reports open / Trading Open / Pending execution) is not self-defining.

**Signature visual without text:** the donut + 2–3 legend rows is the only "probability" signature on home (`001`); the step chart with end-label pills is the one on detail (`045`). Neither was tested for unaided comprehension — **unknown**.

---

## 5. Heuristic evaluation (Nielsen) and Laws of UX

| Heuristic | Finding | State id | Sev |
|---|---|---|---|
| Visibility of system status | Chart auto-scale hides magnitude (48–52 for 50/50); leaderboard shows "Updating…" while retaining old rows | `045`, `014–016` | 4 |
| Match with real world | `SER-INVALID`, `sDAI/xDAI`, and mixed `$`/token units force translation | `037`, `007`, `069` | 3 |
| User control & freedom | Filters have Cancel/Apply; depth actions (Mint/Merge/Redeem) sit in an unlabeled `More` accordion | `006`, `065`, `066` | 3 |
| Consistency & standards | Search doesn't filter (`008`) while Filters does (`006`); leaderboard has sort headers, home has none; percentages don't sum to 100 | `008`, `006`, `001`, `056–069` | 4 |
| Error prevention | Disabled "Not enough balance." is correct; unrounded 1.1868081659397476 and unexplained 1% slippage invite mistakes | `scenario 01` | 3 |
| Recognition over recall | Conditionality requires remembering a banner seen on another page; parent never linked | `audit-gap 001`, `006`, `051` | 4 |
| Flexibility & efficiency | No table/compare view over 2947 markets; infinite scroll only | `001`, API | 4 |
| Aesthetic & minimalist design | Outcome row hosts a radio, three links and a ticket-changing click at once | `scenario 01`, `044`, `051` | 3 |
| Error recovery | No feedback when search does nothing; "Answered too soon" has no remedy text beyond a Reopen button | `008`, `090` | 4 |
| Help & documentation | Liquidity tooltip (`051`) and "How it works" (`008`, `009`) exist; policy bodies unobserved (`002`); content coverage unknown | `051`, `002` | 3 |

**Laws of UX.**
- **Jakob's Law** — traders expect sortable tables; leaderboard has them (`018`), the market feed does not (`001`).
- **Fitts's Law** — the only trust affordances on a card are tiny status icons in the footer (`001`), while the destructive/high-stakes actions are large.
- **Hick's Law** — `Filters` presents eight decision fields at once with no defaults explained (`006`); creation opens on an empty type select that gates Next (`027`).
- **Miller's Law** — the Trader Score explainer enumerates five weighted components in one paragraph before any row is read (`008`, `009`).
- **Law of Proximity** — on `007` and the outcome row, `$`, sDAI and per-outcome tokens sit adjacent with no visual grouping, so they read as one quantity.

---

## 6. Measurable success criteria

Baselines marked **unknown** must be instrumented in the current build before/after comparison.

| Criterion | Definition | Target | Current |
|---|---|---|---|
| Time-to-first-insight | Median seconds from page load to a correct verbal read of the leading outcome's probability | ≤10 s (detail), ≤20 s (home) | **unknown** |
| Clicks per task | Find by topic; trade preview; report answer | ≤3 / ≤3 / ≤3 | 1+typing (broken, `008`); 3 (`scenario 01`); 3 (`037`→`043`) |
| Words on first screen | Prose words above the first market card, excluding nav and control labels | ≤40 | **unknown** (beta banner + labels present, `001`) |
| Signature-visual comprehension | 5-second test: % of participants who call the donut/step chart a probability without reading a legend | ≥80% | **unknown** |
| Rows visible on first screen | Markets at 1440×900 before scroll | ≥12 | 4-column grid; exact count **unknown** (`001`) |
| Controls needing no explanation | % of primary controls a first-time user can describe unprompted | 100% | Fails on `Filters` fields (`006`), market type (`027`), Trader Score (`008`) |