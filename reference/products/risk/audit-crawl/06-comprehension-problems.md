# comprehension problems (risk; DeepSeek draft: Claude verifies against screenshots)

# Risk product audit — newcomer comprehension, confusing UI, jargon, hidden info, labels, accessibility/responsive, performance

**Scope:** `/` “Risk Pricing Predictions”, Q3 2026, 33 DeFi assets. Evidence is limited to supplied crawl notes, STATE ids, charts metadata, controls inventory, and truncated data model. No direct screenshots, DOM accessibility tree, console logs, timing traces, or color-contrast data were supplied.

**Severity key:** 5 = blocks core understanding/task; 4 = high confusion or likely task error; 3 = medium; 2 = minor; 1 = cosmetic.

**Status key:** [observed] = directly stated/captured in notes; [hypothesis] = inferred, needs verification.

---

## 1. Newcomer comprehension problems and confusing UI

| ID | Issue | Evidence | Severity | Status |
|---|---|---|---:|---|
| C1 | **“Probability of Default (PD)” is not defined.** The UI asks users to estimate PD but does not explain what “default” means for a DeFi asset, what event triggers it, or how PD is measured. | STATE 001; STATE 023–032; STATE 033–042 | 5 | [observed] copy contains term; [hypothesis] newcomer cannot interpret it |
| C2 | **“Yearly PD” during a quarter is internally confusing.** The question says “yearly Probability of Default … during Q3 2026”, while fields show `PD (Ann.)` and `PD (Quart.)` and the trading period ends 30 Sep 2026. | STATE 001; STATE 011; STATE 033–042 | 5 | [observed] |
| C3 | **Aggregate “Chance that no listed asset defaults” is ambiguous and conflicts with “Market Estimate (Ann.)”.** The same `46.52%` appears as “Chance that no listed asset defaults” and “Market Estimate (Ann.) 46.52%”, but one phrasing is no-default probability and the other implies a market PD estimate. | STATE 001; STATE 023–032; STATE 033–042 | 5 | [observed] values/labels; [hypothesis] users will misread direction |
| C4 | **Risk bands lack thresholds and the scale is unexplained/non-linear-looking.** Labels `LOW RISK`, `MODERATE RISK`, `HIGH RISK`, `CRITICAL RISK` appear with ticks `0%`, `2%`, `5%`, `10%`, `100%`; no mapping or scale explanation is shown. | STATE 001; STATE 023–032; STATE 033–042 | 4 | [observed] labels/ticks; [hypothesis] users cannot map asset PD to risk band |
| C5 | **Asset symbols are not decoded into protocol names.** 33 symbol buttons such as `weETH`, `ETH+`, `bsdETH`, `pufETH`, `satUSD+`, `GACLO-1`, `BUIDL-I`, `JAAA`, `JTRSY`, `mF-ONE`, `STAC`, `U` are shown without full names or descriptions. | STATE 001; STATE 012–016; STATE 023–032 | 4 | [observed] |
| C6 | **View controls `Market Estimate Risk`, `Risk bars`, `Over time` do not show clear captured content changes.** Triggers were captured, but no visible text/content change was captured for related controls, and chart details were absent. | STATE 007–010; STATE 011; STATE 023