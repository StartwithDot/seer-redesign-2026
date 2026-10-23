# comprehension problems (explorer; DeepSeek draft: Claude verifies against screenshots)

# Explorer Audit — Newcomer Comprehension, Confusing UI, Jargon, Hidden Info, Labels, Accessibility, Performance

**Evidence base:** crawl notes for STATE 001–046, controls inventory, charts inventory, and truncated API/data-model. **No live re-testing was performed.** Where the crawl notes are truncated (notably STATE 022–029 and the API payloads) I say so rather than infer. All items are tagged **[observed]** (directly in the notes/data) or **[hypothesis]** (my inference, explicitly uncertain).

**Severity scale:** 1 = cosmetic · 2 = minor friction · 3 = causes hesitation or a wrong assumption · 4 = likely task failure or blocked comprehension · 5 = newcomer cannot understand what the product pays out / cannot act safely.

---

## A. Newcomer comprehension problems

| # | Problem | Evidence (STATE) | Tag | Sev |
|---|---|---|---|---|
| A1 | **No coherent explanation of what a share costs or pays.** Scalar market shows three incompatible-looking numbers for the same market: header `Market Estimate: 21.23 Note`, chart label `Market Estimate` with `21.2%`, outcome prices `0.648` / `0.295`. Nothing states whether these are probabilities, percentages, or token amounts. | 030–032 | [observed] numbers; [hypothesis] that no explanation exists elsewhere (not captured) | **5** |
| A2 | **No explanation of the buy flow.** Trade panel only shows `You pay` / `You will get` / `Avg price 0 sDAI` / `Parameters: Max slippage 1%`; the return requires clicking `Calculate your potential return`; the primary button is disabled as `Enter an amount`. A newcomer cannot predict cost, payout, or fees before committing. | 016–021 | [observed] | **4** |
| A3 | **Complete-set mechanics (`Mint` / `Merge` / `Redeem`) are unlabelled jargon** with no tooltip or helper text; `Mint` appears twice on the same panel (tab and button), so it is ambiguous which one is the action. | 016–021 (tab `Mint`, `Merge`, `Redeem`; separate disabled `Mint` button) | [observed] | **4** |
| A4 | **Wallet balance contradicts trade balance.** Header wallet shows `24.69 xDAI`; trade panel shows `Balance: 0 sDAI`; assets offered are `sDAI` and `xDAI`. Nothing explains that sDAI ≠ xDAI or that a wrap/deposit step (`Deposit`, `Trade Collateral`) is required. | 016–021 (with 026/037 wallet menu) | [observed] | **4** |
| A5 | **Question resolution state is unintelligible.** Five questions each read `Answer: Answered too soon` with a `Reopen question` button, on a market whose status is `Pending execution`. The user is not told what "too soon" means or what reopening does. Clicking it produces only the raw error `User rejected the request.` | 016–021; 017 | [observed] | **4** |
| A6 | **The France multi-outcome math is not reconcilable from the page.** Percentages sum to 99.8% (31.6+29.1+24.9+7.6+6.6); seat estimates sum to 576 (182+168+144+44+38) for a 577-seat assembly; `Invalid` is listed as a 6th outcome at 0%. No note explains rounding or the Invalid outcome. | 016–021 | [observed] arithmetic; [hypothesis] rounding is the cause; [hypothesis] 577 is the expected total | **2** |
| A7 | **Header metrics do not reconcile with the detail breakdown.** France header: `Liquidity 6.45k`, `Volume 1.32k`, `P&L 0.00`. Expanded breakdown: `Open interest 3.13k sDAI (0 $)`, `Volume 1.32k $ traded, notional 4.80k $`, per-outcome sDAI summing to ≈2.27k. Different aggregation definitions are never stated. | 016–021 vs 018 | [observed] figures; [hypothesis] that they use different denominators | **3** |
| A8 | **Status vocabulary is opaque and inconsistent.** The same product shows `Trading Open` (001–010), `Pending execution` (011–021), `Reports open` (022–046). None is defined; "Pending execution" gives no indication of whether trading is allowed. | 001–010, 011–021, 022–046 | [observed] labels; [hypothesis] mapping to lifecycle stages | **4** |
| A9 | **"Deadline:" is rendered with no value**, so a newcomer cannot tell when the market closes or resolves. The only date evidence elsewhere is `Major Events: 1 UPCOMING · OCT 1, 2029 · 00:00 UTC · Reality.eth Resolution · Expected resolution date`. | 016–021 | [observed] empty label; [hypothesis] that a missing/rejected date field causes it (API `finalizeTs: 33260976000` is not a plausible near-term timestamp) | **4** |
| A10 | **"Open interest: 3.13k sDAI (0 $)"** presents a token quantity and a parenthetical `0 $` with no label for either; a reader cannot tell whether the market has $0 of interest or $0 USD valuation. | 018 | [observed] | **3** |
| A11 | **The scalar market's quote unit "Note" collides with the market subject** ("clarification *notes* published…"), and `Market Estimate: 21.23 Note` reads as a count of notes rather than a price estimate. | 030–032 | [observed]; [hypothesis] on how a newcomer parses it | **3** |
| A12 | **Duplicate wallet-gated comment prompts** (`Connect your wallet to share your take`, `Connect to comment`, `No takes yet. Share the first one.`) with no explanation of why a wallet is needed for a free-text comment, and "takes" is unexplained product slang. | 001–021 | [observed] | **3** |
| A13 | **"Verified" badge is unexplained** and links out to `curate.kleros.io/tcr/...`. A newcomer cannot learn who verified the market, what was verified, or what a TCR is. | 001–046 (link in 001d–008d etc.); 016–021, 030–046 show `Verified` | [observed]; [hypothesis] that no in-app glossary exists | **3** |
| A14 | **External app destinations are presented as if internal.** `App` menu items open `futarchy.seer.pm`, `deep.seer.pm`, `foresight.kleros.io`, `opportunity.seer.pm` (mixed domains, one unrelated to seer.pm) with no external-link cue. | 004, 014, 025, 036 | [observed] hrefs; [hypothesis] trust impact | **3** |
| A15 | **A constant, non-dismissible Beta warning** on every screen ("this is a Beta version and can still be unstable") with no statement of what risk that implies (funds? data? uptime?). | 001–046 | [observed] presence; [hypothesis] no dismiss control (not captured) | **2** |

---

## B. Confusing UI

| # | Problem | Evidence (STATE) | Tag | Sev |
|---|---|---|---|---|
| B1 | **The outcome price column mixes two semantics.** For normal outcomes it shows a price/probability (`0.648`, `0.295`, `51.6%`); for `Invalid` the same column position shows a stake plus a token name (`10.00 SER-INVALID`). | 030–032, 033–043, 044–046 | [observed] | **4** |
| B2 | **Bracketed bounds `[10,50]`** appear in outcome labels (`#1 DOWN [10,50]`, `#2 UP [10,50]`) with no key, axis reference, or legend. | 030–032 | [observed] | **4** |
| B3 | **Pool-detail table headers do not match the rows.** Headers are `SHARES` and `TOTAL`, but every row contains three values (e.g. `0.4584`, `1.02`, `3120.46`); the third column is unlabeled, and `Last: 0.3159` has no stated meaning. | 021 (also 010) | [observed] | **4** |
| B4 | **Add-Liquidity drawer contradicts itself.** Copy says "Earn farming rewards (SEER) by providing liquidity", while the same panel says `Rewards ended on: January 5 2026, 13:21` (in the past relative to the crawl's 2026-10 timeframe). `Available Pools:` is followed by no visible pool. | 020 (and 009) | [observed]; [hypothesis] on crawl date (2026-10-16 from `resolvedAt`) | **4** |
| B5 | **Same label, two behaviours.** `Add Liquidity` (button) opens an in-app drawer (009, 020); a separate `Add Liquidity` link goes to `v3.swapr.eth.limo` (external); the drawer also contains `Add liquidity`. Three capitalisation variants, two destinations. | 009, 010, 020, 021; controls inventory | [observed] | **3** |
| B6 | **Custom date picker has no range affordance.** Presets `Today / Last Week / Last Month / All` sit beside `Previous Month / Next Month` and a day grid, with only `Cancel` / `Save`; nothing indicates whether presets replace or seed the range, or which dates are selected. | 008, 019 | [observed] controls; [hypothesis] on ambiguity | **3** |
| B7 | **Expand actions cause page jump.** Expanding pool details moves the page's SVG element from y=1639 to y=2135 (BASEFEE) — the viewport shifts when a row is expanded. | 010 (vs 001–009); 011 vs 021 | [observed] geometry change; [hypothesis] that it is a scroll jump | **2** |
| B8 | **Duplicated chart canvases.** Every state reports two identical canvases at the same position and size (804×272 at y=599; 798×272 at y=704), and metadata claims `charts=3` on every state while only one main chart is visible. | 001–046 (charts inventory) | [observed] duplicates; [hypothesis] hidden/overlaid duplicate layer | **3** |
| B9 | **Header composition changes between states of the same market.** `P&L` is present in 033–039 and 041–043 but absent in 040 for the same categorical market (same `Liquidity 1.18k`, `Volume 61.89`). | 033–043, esp. 040 | [observed] | **3** |
| B10 | **Two identical panels claim "Mint"**, one as a tab and one as a primary action button that is disabled; with `More` collapsing additional options, the action hierarchy is unclear. | 016–021 | [observed] | **3** |
| B11 | **Non-functional-looking preference controls.** Clicking the theme toggle leaves content unchanged (`Switch to dark mode` clicked, 006; `Switch to light mode`, 038). | 006, 038 | [observed] no visible change; [hypothesis] broken toggle vs. capture normalisation | **3** |
| B12 | **Long, truncated pages.** France pool expansion truncates at `#2 Ce` and the page extends to y≈2107; pool table is described as "one long pool table". | 021 | [observed] truncation; [hypothesis] that the truncation is crawl-only | **2** |
| B13 | **Hover tooltip values differ from the currently displayed values** (`No: 51.90% / Yes: 48.20%` in tooltip vs `51.6% / 48.4%` on the page) with no timestamp-based explanation. | 035 vs 033–034 | [observed] difference; [hypothesis] time-of-hover vs latest tick | **2** |

---

## C. Jargon without explanation (all [observed] as strings; absence of definitions is the finding)

| Term | Where | Sev |
|---|---|---|
| `sDAI`, `xDAI`, `SEER`, `SER-INVALID`, `FRNALEFT` / `FRNACENTRE` / `FRNAFARRIGH` / `FRNARIGHT` / `FRNAOTHER` | 016–021, 018, 021, 030–046 | **4** (token symbols are used as money and as units with no legend) |
| `Scalar`, `Multi Scalar`, `Categorical` | 016–021, 030–032, 033–046 | **4** |
| `Mint`, `Merge`, `Redeem`, `conditional market`, `New conditional market` | 016–021, 030–046 | **4** |
| `Max slippage`, `Avg price`, `notional`, `Open interest`, `P&L`, `pool`, `Pool Id`, `SHARES` / `TOTAL` | 016–021, 018, 021, 030–046 | **3** |
| `Answered too soon`, `Reopen question`, `Pending execution`, `Reports open` | 016–021, 011–021, 022–046 | **4** |
| `Reality.eth Resolution`, `Kleros`, `TCR` (`curate.kleros.io/tcr/…`), `Verified` | 001–046 | **3** |
| `Futarchy`, `Deepfunding`, `Foresight`, `Opportunity Markets`, `Use smart account`, `Trade Collateral`, `Market Collections` | 004, 014, 025, 036, 005, 015, 026, 037 | **3** |
| `takes` ("No takes yet") | 001–021 | **2** |
| `Charting by TradingView` | 001–046 | **1** |

No glossary, tooltip, or inline definition for any of the above appears anywhere in the captured notes. **[observed absence]**

---

## D. Hidden information

| # | Hidden / undisclosed | Evidence | Tag | Sev |
|---|---|---|---|---|
| D1 | Deadline value entirely missing behind the `Deadline:` label | 016–021 | [observed] | **4** |
| D2 | No units on header metrics: `Liquidity 6.45k`, `Volume 1.32k`, `P&L 0.00`; same for `1.11k`, `1.18k`, `781.17`, `88.65`, `61.89`, `107.76`. Only the breakdown reveals `sDAI` / `$`. | 016–021, 030–046 | [observed] | **3** |
| D3 | `Hide questions` control: label only, behaviour not captured; whether it hides 5 bloc questions or resolution text is unknown | 016–021 | [observed] no behaviour captured; [hypothesis] untested | **2** |
| D4 | `More` in the trade panel: contents never observed | 016–021 | [observed] | **3** |
| D5 | Policy content never rendered: menu offers `Verified Market Policy` / `Market Rules Policy`, and the overlay shows only those headings; no policy text captured in any state | 002, 012, 023, 024, 034, 045 (headings); 002 (overlay) | [observed] for captures; [hypothesis] that content exists beyond capture | **3** |
| D6 | Tabs `Related Conditional Markets`, `Top Holders`, `Activity` never show content; `Comments` is wallet-gated | 016–021 | [observed] | **3** |
| D7 | `Use smart account` is a menu entry with no visible on/off state — user cannot see which signing mode is active | 005, 015, 026, 037 | [observed] label only; [hypothesis] it is a toggle | **3** |
| D8 | `Parameters: Max slippage 1%` is collapsed under a generic heading, so the default slippage tolerance is effectively buried | 016–021 | [observed] | **3** |
| D9 | Charts carry no axis labels or values in text form (`texts=[]` on all canvases and SVGs) — the only visible text is a legend (`Left 31.6%` etc.) | 001–046 (charts inventory); 016–021 legend | [observed] | **4** |
| D10 | Invalid-outcome stake differs (`10.00 SER-INVALID` vs `5.00 SER-INVALID`) with no explanation of what the stake means or why it varies | 030–032/033–043 vs 044–046 | [observed] | **3** |
| D11 | Wallet identity is an obviously synthetic address `0x0000...dEaD` shown as if it were the user's account | 001–039, 041–046 | [observed]; [hypothesis] demo/placeholder state presented without disclosure | **3** |

---

## E. Inconsistent labels and terms

| Concept | Variants observed | Evidence | Sev |
|---|---|---|---|
| Market type | `Multi Scalar` · `Scalar` · `Categorical` · API `type: "Generic"` (BASEFEE market) | 016–021 · 030–032 · 033–046 · data model `get-market` | **3** |
| Status | `Trading Open` · `Pending execution` · `Reports open` | 001–010 · 011–021 · 022–046 | **4** |
| Add-liquidity action | `Add Liquidity` (button) · `Add Liquidity` (external link) · `Add liquidity` (drawer) | 009/010/020/021; controls inventory | **3** |
| Volume unit | `1.32k` (header) · `1.32k $ traded` · `notional 4.80k $` · bare `88.65` / `61.89` / `107.76` | 016–021, 018, 030–046 | **3** |
| Liquidity unit | `6.45k` · `3.10k FRNALEFT / 642.63 sDAI` · `1.11k` · `781.17` | 016–021, 018, 030–046 | **3** |
| Date concept | `Deadline:` (no value) · `Expected resolution date` · `Resolution opening at February 1 2027, 08:50 UTC` · `OCT 1, 2029 · 00:00 UTC` | 016–021 · 001–010 (link) | **3** |
| "Verified" concept | `Verified` badge → Kleros TCR, vs `Verified Market Policy` menu item | 001–046 · 002/012/023/034/045 | **3** |
| Wallet indicator | Full chip `0x0000...dEaD / 24.69 xDAI` vs bare `Connect` | 001–039, 041–046 vs 040 | **3** |
| Resolution time source | UI link text `February 1 2027, 08:50 UTC` vs API `get-market-events.event_at: 2027-02-01T00:00:00+00:00` (≈8h50m apart); `openingTs: 1801471821` ≈ 2027-02-01 08:50 UTC matches the link, not the events API | 001–010 link; data model | **3** (observed source disagreement; [hypothesis] the events record rounds to midnight) |

---

## F. Accessibility and responsive problems

| # | Problem | Evidence | Tag | Sev |
|---|---|---|---|---|
| F1 | **Icon-only controls with no accessible name**: `button | (no text)` in every state (001d–008d and onward); footer links for Kleros, Discord, Telegram, X, GitHub all `a | (no text)`; logo/root link `a | (no text) | /`; token links `a | (no text)` to gnosisscan. | 001–046; controls inventory | [observed] | **4** |
| F2 | **Charts have no text alternative**: canvases report `texts=[]`, SVGs report `12 paths` and `texts=[]`. Price history is entirely visual. | 001–046 (charts inventory) | [observed]; [hypothesis] no aria-label/table fallback | **4** |
| F3 | **Colour-only outcome encoding** on the chart (five blocs / Yes-No / candidates distinguished by legend colours only, no in-chart labels). | 016–021 legend; 033–035; 044–046 | [observed] colour-dependent legend; [hypothesis] contrast/colour-blind failure | **4** |
| F4 | **Duplicate chart canvases** stacked at identical coordinates — likely duplicate exposure to assistive tech or a hidden rendered layer. | 001–046 | [observed]; [hypothesis] cause | **3** |
| F5 | **Custom input labelled `on`** (`input | | on`) — an unlabeled/toggle-like control whose purpose is not conveyed by its name. | 001d–008d | [observed] | **3** |
| F6 | **Date-picker days are `div role="option"`** with verbose names ("Choose Sunday, September 27th, 2026"); native grid/listbox semantics and keyboard behaviour are unverified. | 008, 019 | [observed] element type; [hypothesis] keyboard support unknown | **3** |
| F7 | **Theme preference has no visible effect**, so a light/dark preference cannot be honoured. | 006, 038 | [observed] no change; [hypothesis] broken | **3** |
| F8 | **No responsive/mobile evidence at all** — every capture is `[desktop]`; control count varies 58–120 per state but no viewport data. Mobile usability cannot be assessed. | 001–046 headers | [observed gap] | **n/a — unassessable** |
| F9 | **Very long, deeply nested pages** (page height >2100px on France pool states; one "long pool table") with no observed skip links or table-region labelling. | 011–021 | [observed] extent; [hypothesis] scroll burden | **2** |

---

## G. Performance / console-error signals

| # | Signal | Evidence | Tag | Sev |
|---|---|---|---|---|
| G1 | **Repeated failing identity lookup**: `GET rpc.walletconnect.org/v1/profile/reverse/0x…dEaD` returns **404** `"No name for address is found"` on 114 hits. | data model | [observed] 404; [hypothesis] retried each poll/session, producing console noise | **3** |
| G2 | **Very high request volume**: `algebra` subgraph POST 845 hits, `lb.drpc.org/gnosis` POST 953 hits, `get-market` 248, `market-chart` 124, `market-comments` 124, `get-market-events` 124, `get-portfolio-pl` 114, magic.link config 114, web3modal `getWallets` 124 across the crawl. | data model | [observed] counts; [hypothesis] polling/refetch loops | **3** |
| G3 | **Wallet-list paging is inefficient**: `getWallets?page=1&entries=4` with `count: 612` implies up to ~153 pages of 4 to populate the connect modal. | data model | [observed] parameters; [hypothesis] on modal behaviour | **3** |
| G4 | **Unparseable response**: `li.quest/v1/chains` recorded as "not parseable JSON". | data model | [observed]; [hypothesis] crawl truncation rather than app bug — uncertainty stated | **2** |
| G5 | **User-facing wallet error leaked raw**: `User rejected the request.` after `Reopen question`, with page otherwise unchanged — an error surfaced in place of a product explanation, and the action's state is unchanged. | 017 | [observed] | **4** |
| G6 | **USD valuation fields are zero** in the pool payload (`volumeUSD: "0"`, `totalValueLockedUSD: "0"`, `feesUSD: "0"`) despite non-zero token amounts; the UI correspondingly shows `(0 $)` in the interest breakdown. | data model (BASEFEE DOWN/sDAI pool); 018 (`0 $`) | [observed] zeros; [hypothesis] missing price feed causes both | **3** |
| G7 | **Anomalous timestamp**: `finalizeTs: 33260976000` on the BASEFEE market is not a plausible near-term date, while `openingTs: 1801471821` ≈ 2027-02-01 08:50 UTC and the events API says `2027-02-01T00:00:00Z`. Plausibly related to the empty `Deadline:` render. | data model; 016–021 | [observed] values; [hypothesis] causal link to D1 | **3** |
| G8 | No explicit JavaScript console error text is present in the notes. | — | [observed absence] — I cannot claim console errors beyond the 404 and the surfaced wallet rejection. | **n/a** |

---

## H. Highest-priority fixes (severity 4–5, deduplicated)

1. **A1** — explain scalar pricing (`0.648` / `21.23 Note` / `21.2%`) with units and a worked example (030–032).
2. **A2, A3** — explain the trade flow, `Mint`/`Merge`/`Redeem`, fees, and max payout before the user types an amount (016–021).
3. **A4** — explain xDAI ↔ sDAI and why `24.69 xDAI` is not spendable as `0 sDAI` (016–021, 026/037).
4. **A5/A8/D1** — define `Trading Open` / `Pending execution` / `Reports open`, fix the empty `Deadline:`, and replace `Answered too soon` + raw `User rejected the request.` with a real explanation (011–021, 017).
5. **B1/A13/C** — label the outcome price column consistently, explain `SER-INVALID`, `[10,50]`, and what "Verified" means (030–046).
6. **B3, F1, F2** — fix pool-table headers for three-value rows; give every icon-only control a name; provide a text/table fallback for the charts (001–046, 021).

---

## I. Explicit limits of this audit

- **STATE 022–029 notes are truncated** at "Status: Reports open… Action" — I make no claims about their overlays, trade panel, or errors.
- **Controls inventory and data model are truncated**, so hit counts (845/953/124/…) are crawl totals, not per-page-load measurements; I do not assert a polling interval.
- **STATE 006 and 038** show "no visible change" after theme toggles; this may be a capture artefact rather than a defect — flagged as hypothesis, not fact.
- **All states are desktop**; nothing supports any claim about mobile/tablet layout, touch targets, or overflow.
- **No console/log dump was provided**; the only error evidence is the 404 reverse-lookup, the unparseable `li.quest` response, and the UI-surfaced `User rejected the request.` (017).
- **Arithmetic observations** (99.8% / 576 seats / ≈2.27k sDAI) are computed from the figures in the notes; whether they are product bugs, rounding, or differing aggregation definitions is unverified.