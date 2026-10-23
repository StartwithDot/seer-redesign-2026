# flows states (opportunity; DeepSeek draft: Claude verifies against screenshots)

# User-flow audit — Seer / Opportunity Markets

## Notation and evidence limits
- `[observed STATE n]` = directly visible in the crawl notes/controls for the cited state.
- `[inferred]` = path or result not directly captured; inference is limited to observed hrefs, labels, or adjacent states.
- No independent verification is possible. Many captures are truncated; chart data, external destinations, and several click results are not captured.
- All cited states are from the provided crawl. Controls-inventory evidence is cited against the state where the control appears.

---

## 1. Home / pilot / protocol entry flows

### H1 — Load home
1. [observed STATE 001] Load `/` → home marketing page shows `Seer`, `BETA`, `The pilot`, `The protocol`, wallet `0x0000...dEaD`.
2. [observed STATE 001] Home market card shows `ACTIVE`, `LIQUIDITY $2.38K`, title `Seer AI Job Board Name`, top outcomes `SAI 6%`, `delegateyourjob.ai 5.9%`, `Zetsu.AI 4.1%`, `+232 MORE`, `LEADING · SAI 6%`.
3. [observed STATE 001] Home also shows `OPEN OPPORTUNITY →`, `VIEW ARCHIVED MARKETS (2) →`, process graphic, pilot copy, and protocol copy.

### H2 — Navigate to pilot/protocol sections
1. [observed STATE 001] Control `The pilot` / `#pilot` present; controls inventory also shows `/#pilot` on market pages.
2. [inferred] Clicking `The pilot` scrolls/jumps to pilot content observed as STATE 029; the click itself is not separately captured.
3. [observed STATE 029] `THE PILOT` content shows `One market live`, active market card, `OPEN OPPORTUNITY →`, `VIEW ARCHIVED MARKETS (2) →`.
4. [observed STATE 029] `The protocol` content shows `Closed beta today. Permissionless tomorrow.`, `TODAY / Seer One operates it`, `NEXT / Anyone launches`, `ANY DECISION / One shared layer`.
5. [observed STATE 030–032] Wallet panel can appear over `/#pilot` and `/#protocol`; `Close` dismisses it and content otherwise remains unchanged. STATE 032 control count returns 13→10.

### H3 — Open live opportunity from home
1. [observed STATE 001] Controls `OPEN OPPORTUNITY →`, `Name Seer's AI Job Board`, `Open opportunity: Seer AI Job Board Name`, and `LEADING · SAI 6% OPEN OPPORTUNITY →` link to `/markets/100/0x8b3c...a5e8`.
2. [inferred] Result is the active market page observed as STATE 003; the actual click navigation is not separately captured.

### H4 — Open archive from home
1. [observed STATE 001] Control `VIEW ARCHIVED MARKETS (2) →` links to `/archive`.
2. [inferred] Result is `/archive` observed as STATE 026; the actual click navigation is not separately captured.

---

## 2. Wallet overlay / wallet state flows

### W1 — Open connected-wallet overlay from home or pilot/protocol
1. [observed STATE 001] Wallet button `0x0000...dEaD` present.
2. [observed STATE 002] Click wallet button → connected-wallet overlay shows abbreviated address and `Disconnect`; controls inventory also shows `Close` and `Switch Networks`.
3. [observed STATE 030–031] On `/#pilot` and `/#protocol`, wallet click opens panel showing `Connected`, `0x0000••••dEaD`, `0 XDAI`, `Disconnect`.
4. [observed STATE 032] `Close` dismisses the panel; visible content otherwise unchanged; control count 13→10.
5. [inferred] `Disconnect` and `Switch Networks` effects cannot be established; no resulting state is captured.

### W2 — Open wallet overlay on live market page
1. [observed STATE 003] Wallet button `0x0000...dEaD` present.
2. [observed STATE 004] Click → connected-wallet overlay with address and `Disconnect`; market overlay also shows `0 XDAI`.
3. [observed STATE 004] Despite connected overlay, discussion still shows `Connect your wallet to share your take` and `CONNECT TO COMMENT`. This is contradictory and observed, not inferred.
4. [observed STATE 004] Trade panel separately shows `BAL: 0.00 SDAI`, so `0 XDAI` in wallet menu and `0.00 SDAI` in trade panel are both observed but format/asset differ.

### W3 — Wallet click on archive or finalized market
1. [observed STATE 026 / STATE 033] Wallet button present on `/archive` and finalized market detail.
2. [observed STATE 027 / STATE 034 / STATE 043–050] Clicking wallet changes control counts only: e.g. 284→287; no account menu text is captured.
3. [inferred] A panel may have opened but is not visible in captured text; cannot confirm.

---

## 3. Active market browsing flows

### M1 — Load active market detail
1. [observed STATE 003] Load `/markets/100/0x8b3c...a5e8` → status `ACTIVE`, title `Seer AI Job Board Name`, contract `0x8b3c...a5e8`, `VOLUME $7,877`, `LIQUIDITY $2,382`.
2. [observed STATE 003] Page shows `PRICE HISTORY`, legend, outcomes, discussion, and trade panel.
3. [observed STATE 003] Collapsed outcome list shows ranks `01`–`15`, then jumps to `27 Symbiont` with tag `TRADING`; ranks 16–26 are hidden until expansion.
4. [observed STATE 003] All visible outcome rows show `POSITION: 0.00`.

### M2 — Expand full outcome list
1. [observed STATE 003] Control `SHOW ALL 235 OUTCOMES` present.
2. [observed STATE 006] Click → expanded list; capture shows ranks `01`–`64` only, last visible `64 Taskora ... 0.4% $0.004`.
3. [observed STATE 006] Expanded state still claims `235` outcomes; controls inventory shows `SHOW TOP OUTCOMES` in this state.
4. [inferred] Collapse via `SHOW TOP OUTCOMES` and ranks 65–235 are not captured. Data model for `get-market` reports `outcomes` length `80`, while UI says `235`; discrepancy cannot be resolved from captures.

### M3 — Search outcomes
1. [observed STATE 003; controls inventory] `Search outcomes` input present on active market page.
2. [observed STATE 025] Typing `e` filters outcomes to names containing `e`; ranks become non-contiguous (`02`, `03`, `04`, `05`, `07`, `08`, `09`, `11`, `12`, `13`, `14`, `17`, …).
3. [inferred] Clear-search behavior, empty-result state, and full result set are not captured.

### M4 — Price-history legend and chart interactions
1. [observed STATE 003] `PRICE HISTORY` chart section and legend buttons present: `SAI 6%`, `delegateyourjob.ai 5.9%`, `Zetsu.AI 4.1%`, `Wageware 3.6%`, `Workmesh 3.5%`, `CW 3.3%`, `Synergent 3.2%`, `Foreguild 3.1%`, `Auspex 3.1%`, `WorkX 2.8%`.
2. [observed STATE 003] `Scroll legend left` is disabled; `Scroll legend right` is enabled.
3. [observed STATE 017] Click `Scroll legend right` → no visible text change captured.
4. [observed STATES 007–014] Click legend buttons for SAI/delegateyourjob.ai/Zetsu.AI/Wageware/Workmesh/CW/Synergent/Foreguild → visible page/trade panel does not change; trade `OUTCOME` remains `SYMBIONT`.
5. [observed STATE 005] Chart hover → captured state is identical to STATE 004; no tooltip text captured.
6. [observed STATE 037 / 039 / 041 / 050 / 053 / 056] Finalized-market chart hover states also show no visible tooltip or chart value change.
7. [inferred] Chart data, axes, time range, and tooltip content cannot be determined. `Charting by TradingView` link exists in controls inventory; its destination state is not captured.

### M5 — Outcome row / legend click as trade selector
1. [observed STATE 015–016] Clicking `Auspex 3.1%` or `WorkX 2.8%` does not visibly change the trade panel’s `OUTCOME`, which still shows `SYMBIONT`.
2. [observed STATES 007–014] Same no-visible-change behavior for other legend buttons.
3. [inferred] Outcome selection from the visible list/legend may be broken or may require a different control; capture does not establish the intended flow.

---

## 4. Trade-panel flows — active market

### T1 — Initial trade state
1. [observed STATE 003 / STATE 015] Trade panel shows `BUY` / `SELL` tabs; `OUTCOME SYMBIONT`; `PAY WITH SDAI`; `AMOUNT`; `BAL: 0.00 SDAI`; quick amounts `+1`, `+5`, `+10`, `+100`.
2. [observed STATE 003] Trade outputs initially show `YOU RECEIVE 0.0 Shares`, `AVG PRICE —`, `SLIPPAGE 0.5%`.
3. [observed STATE 003] Prompt `ENTER AN AMOUNT` is shown and marked `DISABLED` in controls inventory.
4. [observed STATE 003] Default outcome is `SYMBIONT`, listed at rank `27` with `TRADING` label; top-ranked outcomes lack that label.

### T2 — Change payment asset
1. [observed STATE 020] Click `SDAI` → dropdown shows `SDAI`, `XDAI`, `WXDAI`, `OPPORTUNITY_CREDITS`.
2. [inferred] Selecting a different asset is not captured; resulting balance/quote behavior cannot be determined.

### T3 — Open trade outcome selector
1. [observed STATE 019] Click `SYMBIONT` → very large outcome list opens; controls inventory shows `Search options` input and many `option` buttons.
2. [observed STATE 019] Captured list appears dense/concatenated; no selection result is captured.
3. [inferred] Selecting an outcome from this dropdown and its effect on quote/trade panel cannot be established.

### T4 — Request a quote via quick amount
1. [observed STATE 021–024] Click `+1`, `+5`, `+10`, or `+100` → trade output shows `… Shares`, `AVG PRICE —`, `GETTING QUOTE…`.
2. [observed STATE 021–024] Final quote does not resolve in captured states; amount value is not visible in capture.
3. [inferred] Manual amount entry, quote success, validation, insufficient-balance handling, and submit action are not captured.

### T5 — BUY/SELL and submit
1. [observed STATE 003 / STATE 015] `BUY` and `SELL` tabs are visible.
2. [observed STATE 003] Selected tab is not clear in capture; no toggle effect is captured.
3. [inferred] SELL flow, trade submission, wallet confirmation, and post-trade position update are not observed.

---

## 5. Discussion / comment flows — active market

### D1 — Wallet-gated and empty discussion
1. [observed STATE 003 / STATE 015–018] Discussion shows `Connect your wallet to share your take`, `CONNECT TO COMMENT`, and `No takes yet. Share the first one.`
2. [observed STATE 004] Even with connected-wallet overlay visible, discussion still shows the wallet gate and `CONNECT TO COMMENT`.
3. [observed DATA MODEL] `market-comments` response returns `"data": []`, consistent with the empty discussion capture.

### D2 — Click comment gate
1. [observed STATE 018] Click `CONNECT TO COMMENT` → alerts appear: `User rejected the request.` and `Signing in...`.
2. [observed STATE 018] The two messages are contradictory in the capture; no successful sign-in or comment submission is shown.
3. [inferred] Successful wallet sign-in, comment composer, and comment submission are not captured.

---

## 6. Archive flows

### A1 — Load archive
1. [observed STATE 026] Load `/archive` → `ARCHIVE`, `Past markets`, copy: `Finalized opportunity markets. Holders of winning shares can still redeem them from each market's page.`
2. [observed STATE 026] Card 1: `CLOSED`; `LIQUIDITY $1.11K`; `Seer Rebrand Contest`; leading rows `Electric Foundation 80.1%+`, `Convergent 1%+`, `Constellation Oracle 0.6%+`; `+14 MORE`; `DESIGNS`; `144 IMAGES`; footer `LEADING ODDS —`; `OPEN OPPORTUNITY →`.
3. [observed STATE 026] Card 2: `CLOSED`; `LIQUIDITY $0.00`; `Seer Merch for Devcon Mumbai`; rows include `Purple Seer Apparel Set :Tshirt+hat 10.5%+`, `Proof of Belonging Tshirt 3.6%+`, `See What The Market Believes T shirt 10.4%+`; `+15 MORE`; `DESIGNS`; `18 IMAGES`.
4. [observed STATE 026] Card 1 shows both `CLOSED` and `OPEN OPPORTUNITY →`; this is contradictory but directly observed.

### A2 — Archive design carousel / next designs
1. [observed STATE 028] Click `Next designs` → no visible text change captured; control count moves 176→177.
2. [inferred] No carousel state, image change, or pagination result can be established from text capture.

### A3 — Open archived market
1. [observed STATE 026] `OPEN OPPORTUNITY →` present on rebrand card.
2. [inferred] Result is the finalized rebrand detail observed as STATE 033; the actual click navigation is not separately captured.
3. [inferred] Opening the merch card and any merch market detail are not captured.

### A4 — Back from archive
1. [observed STATE 026] `← BACK TO OPPORTUNITIES` present.
2. [inferred] Result is home STATE 001; click result not separately captured.

### A5 — Redeem winning shares
1. [observed STATE 026] Copy states winning-share holders can still redeem them from each market's page.
2. [observed STATE 033–071] Finalized rebrand detail shows outcomes and `POSITION: 0.00`, but no redemption control or redemption flow is captured.
3. [inferred] Redemption cannot be confirmed.

---

## 7. Finalized / resolved market flows

### F1 — Load finalized market detail
1. [observed STATE 033] Load `Seer Rebrand Contest` detail → `FINALIZED`, contract `0xe785...4b8a`, `VOLUME $7,197`, `LIQUIDITY $1,111`, `DESIGNS 144 IMAGES`.
2. [observed STATE 033] Copy explains multi-scalar market, team final selection, `$3,000` winner, top 5 Seer credits.
3. [observed STATE 033] Outcomes visible: `01 Electric Foundation 80.1%+ $0.000`, `02 Convergent 1%+ $0.000`, `03 Constellation Oracle 0.6%+ $0.000`, `04 Prism 0.7%+ $0.000`; all visible `POSITION: 0.00`; `05 Civic Signal` truncated.
4. [observed STATE 043–050 / 059–071] No trade form or order-entry controls are visible on finalized detail.

### F2 — Select finalized outcome
1. [observed STATE 036] Outcome `01 Electric Foundation` selected; `TRADING` label shown.
2. [observed STATE 038] Click `02 Convergent` → URL `?outcome=1`; `TRADING` label moves to Convergent.
3. [observed STATE 040] Click `03 Constellation Oracle` → URL `?outcome=2`; `TRADING` label moves to Constellation Oracle.
4. [observed STATE 043 / 044 / 046 / 048] `outcome=0/1/2/3` variants correspond to `TRADING` moving to Electric / Convergent / Constellation / Prism.
5. [observed STATE 051 / 054 / 057] `?outcome=4/5/6` variants are effectively identical in captured text; selected-outcome change is not visually distinguishable.
6. [observed STATE 043–058] Market remains `FINALIZED` while a `TRADING` label appears on selected outcome; contradiction is directly observed.

### F3 — Finalized outcome links
1. [observed STATE 033] Controls include `VIEW PORTFOLIO ↗` and `VIEW IMAGES` on `01 Electric Foundation`; `VIEW PROPOSAL ↗` and `VIEW IMAGES` on `02 Convergent`; `VIEW PROPOSAL` on `03`/`04`; truncated `VIEW PORT...` on `05 Civic Signal`.
2. [observed STATE 033] `View on Seer ↗` and `BACK TO ARCHIVE` also present.
3. [inferred] Destinations for portfolio, proposal, image, and external Seer links are not captured.

### F4 — Finalized wallet and chart interactions
1. [observed STATE 043 / 044] Click wallet `0x0000...dEaD` → control count 284→287; no visible menu text captured.
2. [observed STATE 050 / 053 / 056] Hover chart → no tooltip or chart-value change captured.
3. [observed STATE 043–058] No wallet-gated prompt, empty-state message, or error message is captured on finalized detail.

---

## 8. Mobile-specific behavior

1. [observed] Chart inventory explicitly labels many captured states `[desktop]` (e.g. STATE 003, 006, 015, 018, 019).
2. [observed] Controls inventory contains suffixed states `072m`, `073m`, `077m`, `089m`, `090m`, but the notes do not describe viewport, layout, mobile controls, or responsive behavior for them.
3. [inferred — not established] No mobile-specific user flow can be confirmed. Mobile wallet gating, trade panel behavior, outcome list behavior, and navigation are unobserved.

---

## 9. Cross-flow state summary

### Wallet-gated
- [observed STATE 003 / 015–018] Discussion is wallet-gated: `Connect your wallet to share your take`, `CONNECT TO COMMENT`.
- [observed STATE 004] Wallet overlay connected, but discussion gate still visible.
- [observed STATE 003 / 015] Trade balance `BAL: 0.00 SDAI`; no explicit insufficient-balance message captured.

### Loading
- [observed STATE 021–024] Quick-amount clicks produce `GETTING QUOTE…`, `… Shares`, `AVG PRICE —`; quote does not resolve in capture.
- [observed STATE 018] Comment sign-in shows `Signing in...` simultaneously with `User rejected the request.`

### Empty
- [observed STATE 003 / 015] `No takes yet. Share the first one.`
- [observed STATE 003 / 033] All visible outcome positions `POSITION: 0.00`.
- [observed STATE 003] Trade initial state `BAL: 0.00 SDAI`, `YOU RECEIVE 0.0 Shares`, `AVG PRICE —`, `ENTER AN AMOUNT`.
- [observed STATE 026] Archive rebrand card `LEADING ODDS —`; merch card `LIQUIDITY $0.00`.

### Ended / resolved
- [observed STATE 001 / 003] Live pilot market status `ACTIVE`.
- [observed STATE 026] Archive cards status `CLOSED`.
- [observed STATE 033–071] Rebrand detail status `FINALIZED`.
- [observed STATE 043–058] `FINALIZED` detail still shows `TRADING` label on selected outcome.
- [inferred] Redemption after finalization is not captured despite archive copy.

### Error
- [observed STATE 018] Comment gate click produces `User rejected the request.` and `Signing in...`; no other error state is captured in archive/finalized/trade flows.

---

## 10. Flows that could not be observed, and why

1. **Initial wallet connection / authentication** — wallet already displays `0x0000...dEaD`; captures show connected-wallet overlay and comment signing error, but no connect-wallet form.
2. **Disconnect and Switch Networks effects** — controls present in STATE 002/004/030 etc., but no resulting state captured.
3. **Successful comment sign-in and comment submission** — only rejection/signing alert in STATE 018; composer and success state absent.
4. **Successful trade quote resolution** — only `GETTING QUOTE…` in STATE 021–024; final quote, amount, and receive value do not resolve.
5. **Manual amount entry and validation** — amount input exists, but no entered amount or validation result captured.
6. **Insufficient-balance flow** — zero balances are shown, but no explicit insufficient-balance message is captured.
7. **SELL flow / BUY-SELL toggle effect** — tabs visible; selected state unclear; no trade side change captured.
8. **Trade submission / wallet confirmation / post-trade position** — no submit or confirmation flow captured.
9. **Outcome selection via trade dropdown** — STATE 019 opens dropdown and search, but no selection result captured.
10. **Outcome selection via rows/legend updating trade panel** — clicks in STATE 007–016 did not visibly change `OUTCOME`; intended flow cannot be confirmed.
11. **Full 235-outcome list** — STATE 006 captures only ranks 01–64; `get-market` data model reports 80 outcomes; discrepancy unresolved.
12. **Collapse via `SHOW TOP OUTCOMES`** — control appears in STATE 006, but click result is not captured.
13. **Full search-result behavior / empty search** — STATE 025 shows filtered non-contiguous ranks; clear and no-result states are absent.
14. **Archive carousel `Next designs` effect** — STATE 028 shows no visible text change; only control-count change.
15. **Archived merch market detail** — archive merch card visible, but no merch detail state captured.
16. **Redeem winning shares** — archive copy mentions redemption, but no redeem control or flow is captured on finalized detail.
17. **External destinations** — `View on Seer ↗`, contract link, `Charting by TradingView`, `VIEW PORTFOLIO ↗`, `VIEW PROPOSAL`, `VIEW IMAGES` results are not captured.
18. **Chart data and tooltips** — canvas/svg present and `charts=2`/`charts=3` metadata reported, but no axes, legends, series, values, or tooltip text captured across hover states.
19. **Wallet menu on archive/finalized detail** — clicks change control counts only; no menu text captured.
20. **Mobile/responsive behavior** — no mobile states described; suffixed controls-inventory states (`072m`, etc.) lack notes, so mobile layout and interactions cannot be established.