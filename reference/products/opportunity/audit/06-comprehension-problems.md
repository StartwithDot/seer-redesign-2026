# comprehension problems (opportunity; DeepSeek draft: Claude verifies against screenshots)

# Audit deliverable — Newcomer comprehension, confusing UI, jargon, hidden information, labels, accessibility, performance

## Scope, labels, severity

- Reviewed captures **STATE 001–071**, all marked **desktop** in the provided notes.
- Label key: **[O] = observed** in provided states/data; **[H] = hypothesis** inferred from observations; **[O/H] = observed UI fact with hypothesized impact**.
- Severity: **1** cosmetic, **2** minor confusion, **3** moderate comprehension/trust friction, **4** high risk of wrong action or blocked task, **5** critical/blocking.
- No mobile/tablet/responsive states, focus-order data, contrast data, or console logs were provided. Those cannot be asserted.
- “Hits” in the data model are crawl/request counts, not per-session timings.

---

## 1. Newcomer comprehension problems and confusing UI

| ID | Problem | Evidence | Sev | Label |
|---|---|---|---:|---|
| C01 | Clicking an outcome row/legend in the active market does **not** change the trade panel’s `OUTCOME`; it remains `SYMBIONT`. This can cause trading the wrong outcome. | STATE 003; STATE 007–014; STATE 015–016 | 5 | [O] |
| C02 | Trade panel defaults to `OUTCOME SYMBIONT`, a rank-27 outcome with a `TRADING` label, while top-ranked outcomes lack that label. Default rationale is unexplained. | STATE 003, 015–025 | 4 | [O] |
| C03 | Collapsed outcome list jumps from `15 Agora` to `27 Symbiont`, hiding ranks 16–26 until expansion. | STATE 003, 015 | 3 | [O] |
| C04 | `SHOW ALL 235 OUTCOMES` expands, but captured STATE 006 shows only ranks 01–64; ranks 65–235 are not shown in the capture. | STATE 006 | 3 | [O]; UI-vs-capture uncertainty |
| C05 | Outcome dropdown is extremely dense/concatenated, with very similar names (`SYNERGET`/`SYNERGENT`, `AGENTICJOBS`/`AGENTICGIGS`) and `controls=270`. Wrong-selection risk is high. | STATE 019 | 4 | [O]; impact [H] |
| C06 | Outcome-selection behavior is inconsistent across markets: finalized-market clicks change the URL/`TRADING` label, while active-market clicks do not update the trade panel. | STATE 007–014 vs. STATE 036–042 | 4 | [O] |
| C07 | `BUY` / `SELL` selected state is not clear in captures. | STATE 003, 015 | 3 | [O] |
| C08 | Quick amounts `+1`, `+5`, `+10`, `+100` show no currency/unit. | STATE 003, 021–024 | 3 | [O] |
| C09 | Trade panel shows `BAL: 0.00 SDAI` and disabled `ENTER AN AMOUNT` without explicit “connect wallet” or “insufficient funds” guidance. | STATE 003, 015–018 | 3 | [O] |
| C10 | Chart hover produces no visible tooltip/tooltip text. | STATE 005; STATE 037, 039, 041, 050, 053, 056, 068, 071 | 4 | [O] |
| C11 | Charts lack visible axes, time range, series values, or readable legends in captures; only `PRICE HISTORY` is labeled. Metadata reports `charts=3` or `charts=2`. | STATE 003, 015; STATE 033–071 | 4 | [O] |
| C12 | Wallet is connected in STATE 004, but discussion still says “Connect your wallet to share your take” and shows `CONNECT TO COMMENT`. | STATE 004 | 4 | [O] |
| C13 | Wallet rejection alert says both “User rejected the request.” and “Signing in...”, which is contradictory. | STATE 018 | 3 | [O] |
| C14 | After quick-amount clicks, trade quote remains `GETTING QUOTE…`, with `YOU RECEIVE … Shares` and `AVG PRICE —`; no resolved quote is captured. | STATE 021–024 | 4 | [O] |
| C15 | Account button on several pages produces no visible menu/panel; only control count changes, e.g. `284→287`. | STATE 027, 034; STATE 043–050, 052, 055, 058, 061, 064 | 3 | [O] |
| C16 | `Next designs` and `Scroll legend right` produce no visible text change in captures. | STATE 017, 028 | 2 | [O] |
| C17 | Archive rebrand card is marked `CLOSED` but still offers `OPEN OPPORTUNITY →`. | STATE 026 | 3 | [O] |
| C18 | Archive rebrand card shows `LEADING ODDS —` despite visible leading outcomes and percentages. | STATE 026 | 2 | [O] |
| C19 | `FINALIZED` market still shows `TRADING` on the selected outcome. | STATE 033–050, 051–058 | 3 | [O] |
| C20 | Archive copy says winning-share holders can still redeem from each market’s page, but captured finalized detail shows no redeem control. | STATE 026, 033 | 4 | [O] absence; functional gap [H] |
| C21 | Outcome CTAs are inconsistent: `VIEW PORTFOLIO ↗` vs `VIEW PROPOSAL`/`VIEW PROPOSAL ↗`; `VIEW IMAGES` only on some outcomes; Civic Signal truncates. | STATE 033–071 | 3 | [O] |
| C22 | `144 IMAGES` is shown, but text capture exposes repeated labels rather than unique image identities; mapping is unclear. | STATE 033–071 | 2 | [O] |
| C23 | Percentages use an unexplained trailing `+` and inconsistent precision (`80.1%+`, `1%+`, `0.6%+`, `0.7%+`). | STATE 033–071 | 3 | [O] |
| C24 | `$0.000` appears under outcomes with very different probabilities and has no visible field label. | STATE 033–071 | 4 | [O] |
| C25 | `outcome=4/5/6` URL variants are not visibly distinguished in captured page text. | STATE 051, 054, 057 | 3 | [O] |
| C26 | Wallet display `0x0000...dEaD` looks placeholder-like and may reduce trust. | STATE 001–004, 033–071 | 2 | [O]; trust impact [H] |
| C27 | Home text/links `Name Seer's AI Job Board` and `Where this goes` are ambiguous as controls; exact behavior not captured. | STATE 001 | 2 | [O] |
| C28 | `POSITION: 0.00` has no unit, while trade panel uses `Shares`. | STATE 003, 015, 033–071 | 3 | [O] |
| C29 | `TRADING` appears on the Symbiont row but is not clearly status, selection, or action. | STATE 003, 015 | 3 | [O] |
| C30 | Payment dropdown offers `SDAI`, `XDAI`, `WXDAI`, `OPPORTUNITY_CREDITS` without explanation. | STATE 020 | 3 | [O] |
| C31 | Connected menu shows `0 XDAI`; trade panel shows `BAL: 0.00 SDAI`; relationship is unexplained. | STATE 004 | 3 | [O] |
| C32 | Ended-market status labels are inconsistent: `CLOSED` on archive cards, `FINALIZED` on detail.