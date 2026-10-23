# comprehension problems (futarchy; DeepSeek draft: Claude verifies against screenshots)

# Futarchy — Newcomer Comprehension & Confusing UI Audit

**Scope / evidence limits.** This report uses only the supplied crawl notes, control inventory, chart metadata, and data-model excerpts. All cited states are treated as desktop captures unless noted. No mobile/responsive states, keyboard/focus traces, contrast measurements, or console logs were supplied. These are explicit evidence gaps, not confirmed absences.

**Severity scale used:**  
5 = blocks correct interpretation or can create false belief about resolution/action; 4 = major confusion for newcomers, usually requires external knowledge; 3 = notable ambiguity or misleading label; 2 = minor friction/inconsistency; 1 = cosmetic.

---

## A. Critical newcomer comprehension blockers and confusing UI

| ID | Sev | Finding | Evidence | Status / uncertainty |
|---|---:|---|---|---|
| A-01 | 5 | GIP-152 has contradictory lifecycle/status. It appears in **Recently Closed** as **Awaiting Resolution / Status Awaiting / Impact +0.00%**, while its market page shows **Ended**, **Awaiting Resolution**, and **Final Result APPROVED** together. A newcomer cannot tell whether it is closed, ended, resolved, or still pending. | STATE001–009; STATE010–013, STATE016–019; STATE020–023 | **[observed]** labels coexist. Uncertainty: which label is authoritative, and whether one is stale. |
| A-02 | 5 | KIP-90 shows **TWAP Complete (TWAP impact -0.98%)**, **NO outcome is ahead on TWAP**, but also **Resolved: YES** and **Final Result APPROVED**. This is a direct recommendation-vs-result conflict unless the user already knows TWAP is advisory. | STATE024–033 | **[observed]** conflict. **[hypothesis]** TWAP may be non-binding and final result may come from Snapshot, but the UI does not explain this in capture. |
| A-03 | 5 | Wallet/token balances appear contradictory: wallet popover shows **24.68 XDAI**, market trading shows **0 sDAI** and **0.0004 GNO**, and collateral shows **0 xDAI** in one GIP-152 panel but **24.689107 xDAI** later. Users will not understand why they see **Insufficient balance**. | STATE004, STATE008, STATE012; STATE010–019; STATE020 vs STATE021–023, STATE030–033; STATE052 | **[observed]** value differences. **[hypothesis]** xDAI/XDAI/sDAI are different assets/representations or state is stale; not explained. |
| A-04 | 4 | Chain/entity taxonomy is confusing: header says **Gnosis**, active milestone says **ETH**, Organizations table has an **Ethereum** row whose **CHAIN** is **Gnosis**, and **Switch Networks** lists **Ethereum**, **Gnosis**, and **Connected**. | STATE001–009; STATE003, STATE007, STATE011, STATE026 | **[observed]** labels. **[hypothesis]** newcomer cannot distinguish chain, organization, market, and connection status. |
| A-05 | 4 | The Organizations table mixes DAOs with a row named **Ethereum**, carrying an **ACTIVE MARKET** badge and chain **Gnosis**, while the count still says **5 organizations**. | STATE001–009; especially STATE001, STATE006 | **[observed]** row and count. Uncertainty: whether “Ethereum” is an organization, a chain, or a market grouping. |
| A-06 | 4 | **Recently Closed** contains GIP-152 while it is still **Awaiting Resolution**. The section label contradicts the card status. | STATE001–009 | **[observed]**. |
| A-07 | 4 | Outcome/status vocabulary proliferates: **Outcome YES**, **Resolved: YES**, **Final Result APPROVED**, **WINNING OUTCOME: YES**, **Awaiting**, **Awaiting Resolution**, **Ended**. Newcomers cannot map these to one state model. | STATE001–009; STATE010–019; STATE021–023; STATE024–035; STATE052 | **[observed]** labels. Uncertainty: whether “APPROVED” is equivalent to “YES” or a separate Snapshot outcome. |
| A-08 | 4 | Trade construction requires composing **If Yes / If No**, **Buy / Sell**, and a separate **Bullish/Bearish → BUY/SELL** guidance table. The relationship between “outcome,” “view,” and trade direction is not explained inline. | STATE010–019 | **[observed]** controls and guidance table. |
| A-09 | 4 | Resolved markets still display active-looking **Buy/Sell**, amount input, and **Insufficient balance** alongside **Resolved: YES** and **Redeem Tokens**. Users may try to trade a resolved market. | STATE024–035; STATE052 | **[observed]** controls remain. **[hypothesis]** controls may be disabled or irrelevant, but this is not clear from capture. |
| A-10 | 4 | Market charts report **charts=2** but captures show canvases with **svg-paths=0**, **texts=[]**, no axes, no series labels, and no readable tooltip values. Hovering charts in Position and If No states produced no readable data. | STATE010–035; STATE052; chart metadata for STATE010–035, STATE052; hover states STATE016, STATE018 | **[observed]** no readable chart data. **[hypothesis]** charts may be blank, canvas-only, or capture-inaccessible; a rendering/accessibility failure is possible. |
| A-11 | 4 | GIP-151 trade preview shows **If Yes 0.00000111 GNO**, **Price impact 1082765.91%**, warning **“Price impact too high — pool depth insufficient for this size. Trade anyway.”**, and **Insufficient balance** simultaneously. The numbers and actions conflict. | STATE034–035; STATE036 | **[observed]** values and warning. **[hypothesis]** tiny-size/calculation bug or pathological pool state; not explained. |
| A-12 | 4 | “Impact” is used inconsistently: **Impact +0.00%** on cards, **Impact (spot) 0.00%** on one market, **Impact (spot) —** on resolved markets, and **TWAP impact** separately. | STATE001–009; STATE010–019; STATE024–035; STATE052 | **[observed]** multiple labels/values. **[hypothesis]** metrics differ but are not defined in capture. |
| A-13 | 4 | TWAP methodology copy is inconsistent. KIP-90 says recommendation uses 24-hour TWAP and “positive difference = approve, otherwise reject”; GIP-151 says 24-hour window ending one day before Snapshot vote ends and uses **> +1% / < -1% / otherwise neutral**. KIP-88 uses the simpler “positive difference → approve” explanation. | STATE024–033; STATE034–035; STATE044–052 | **[observed]** different explanatory copy. Uncertainty: whether thresholds genuinely differ by market or copy is stale. |
| A-14 | 4 | Multiple external/authority sources appear: **Resolve Question** linking to Reality.eth, **Snapshot Vote**, **View final results on Snapshot**, and **Resolution Question**. The UI does not explain which source is authoritative or how they interact. | STATE010–019; STATE024–035 | **[observed]** controls/links. **[hypothesis]** newcomer cannot tell whether Reality.eth, Snapshot, or Futarchy TWAP determines outcome. |
| A-15 | 3 | Add Liquidity uses unexplained pool categories: **Conditional Pools**, **Prediction Pools**, **Company Token Pools**. In STATE013, some conditional/company-token rows appear to share the same Swapr href, suggesting duplicate or overlapping pool links. | STATE013; STATE028; control inventory for STATE013 | **[observed]** categories and hrefs. **[hypothesis]** duplicate links may be intentional aliases or a data bug; not clear. |
| A-16 | 4 | Wallet identity is hidden and possibly broken: full address is never shown, top-right truncation is **0x00…dEaD**, connected-wallet area uses **0x0000...dEaD**, and **View more on explorer** points to an all-zero/truncated address URL rather than a full wallet address. | STATE004, STATE008, STATE012, STATE027, STATE037, STATE047; STATE052 | **[observed]** truncations and explorer href. **[hypothesis]** zero-address explorer link is a placeholder/bug. |
| A-17 | 3 | **Switch Networks** includes **Connected** alongside **Ethereum** and **Gnosis**; control inventory shows **“Gnosis Connected”** as a disabled button. “Connected” reads like a status, not a network. | STATE003, STATE007, STATE011, STATE026; control inventory | **[observed]** label. **[hypothesis]** network selector conflates network choice with connection state. |
| A-18 | 3 | STATE001 shows an empty **Active Milestones** area while the Organizations table already shows **Ethereum ACTIVE MARKET 1**; the active ETH milestone card appears from STATE002 onward. | STATE001 vs STATE002–009 | **[observed]** timing difference. **[hypothesis]** loading/hydration delay; not confirmed. |

---

## B. Other confusing UI and comprehension issues

| ID | Sev | Finding | Evidence | Status / uncertainty |
|---|---:|---|---|---|
| B-01 | 2 | Search/filter scope is unclear. Typing `e` changes **5 organizations** to **4 organizations**, removing Gnosis DAO and leaving Kleros DAO, Ethereum, VeloraDAO, Aave DAO. It is not clear that only the Organizations table is filtered, nor that this is a substring match. | STATE005, STATE009; control inventory “Filter by name...” at STATE001–008 | **[observed]** filter result. **[hypothesis]** users may expect milestones/markets to filter too. |
| B-02 | 3 | Active ETH market shows identical **YES Price 2401.44 USDS** and **NO Price 2401.44 USDS**, with **-0.00%** impact. Identical YES/NO prices are unintuitive for a futarchy market unless explained. | STATE002–009 | **[observed]** values. **[hypothesis]** placeholder/calculation state; not explained. |
| B-03 | 3 | Impact sign is not explained against outcome: KIP-81 shows **NO** with **+99.98%**, while GIP-149 shows **NO** with **-2.36%**; GIP-151 shows **YES** with **+0.00%**. A newcomer may read this as outcome contradiction rather than a price-impact metric. | STATE001–009 | **[observed]** values. Uncertainty: whether sign is outcome-relative, price-relative, or something else. |
| B-04 | 3 | Units are inconsistent across market metrics: **Volume (Total; sDAI)** is labeled, but TVL sometimes has **K** (`121.46K`, `101.20K`) and sometimes appears as **40.89** with no unit. | STATE024–035; STATE044; STATE052 | **[observed]**. |
| B-05 | 3 | Dates are ambiguous and inconsistently labeled: `8/12/2026` is labeled **Ended** on GIP-152, while `7/20/2026` and `7/3/2026` are labeled **Resolution Date**. Format could be US or non-US. | STATE010–019; STATE024–035 | **[observed]**. |
| B-06 | 3 | **Available -** appears as a dash rather than a numeric limit, while elsewhere the sidebar shows **sDAI Available 0 sDAI**. Users cannot tell whether availability is unknown, loading, or zero. | STATE010–019; STATE052 | **[observed]** dash and numeric value coexist. |
| B-07 | 4 | Quote/preview states are asymmetric and unstable: **If Yes** shows **Quote returned no output for this amount**; **If No** shows **1.00 sDAI**; clicking **If No** shows **Loading...** then **Receive If Yes 1.00 sDAI (estimate)**; after **Max**, **If Yes 0.00 GNO**, **Receive If No 0.00 sDAI**, **Recover Quote Unavailable**. | STATE010–013, STATE016–019 | **[observed]** sequence. **[hypothesis]** async quote race or stale quote state; not confirmed. |
| B-08 | 4 | **Max** produces zero amounts and **Quote Unavailable** on a market where the wallet already shows insufficient balance. The action does not produce a usable maximum. | STATE019 | **[observed]**. |
| B-09 | 3 | **If No** click briefly shows **Loading...** and an estimate, while another captured hover/quote state says **Quote returned no output for this amount**. | STATE017 vs STATE018 | **[observed]** different states. **[hypothesis]** transient loading/race; uncertainty high. |
| B-10 | 3 | **Insufficient balance** is presented as a disabled action button, not as an inline explanation near the amount input or balance. Users may not know which token is insufficient. | STATE010–015, STATE017, STATE018; STATE052 | **[observed]**. |
| B-11 | 3 | Collateral `xDAI Balance` is **0 xDAI** in one GIP-152 split panel but **24.689107 xDAI** in later GIP-152 and KIP-90 panels. | STATE020 vs STATE021–023, STATE030–033 | **[observed]**. **[hypothesis]** stale/loading/panel-specific state. |
| B-12 | 3 | **mergeable YES 0 · NO 0** appears without explanation. | STATE010–035; STATE052 | **[observed]** term. No definition captured. |
| B-13 | 3 | **Recover** is used as an action/label without explanation, including **Recover Quote Unavailable**. | STATE010–019; STATE024–035; STATE052 | **[observed]**. |
| B-14 | 4 | **Split Collateral**, **Merge Collateral**, and **Add Collateral** are core controls but are not explained beyond generic collateral copy. The panels introduce **BUY sDAI**, **xDAI Balance**, and **Max Approval**. | STATE020, STATE022, STATE030, STATE032, STATE040–043, STATE051; STATE052 | **[observed]** controls and copy. **[hypothesis]** newcomers will not understand split/merge mechanics or when to use them. |
| B-15 | 3 | **Max Approval** copy says **“Will request exact allowance for this transaction.”** “Allowance” is unexplained. | STATE020, STATE022, STATE030, STATE032; STATE052 | **[observed]**. |
| B-16 | 2 | **BUY sDAI** appears as a link in collateral panels; it is unclear whether it means “buy sDAI,” “use sDAI to buy,” or a token-pair label. | STATE020–023, STATE030–033; STATE052 | **[observed]** label. |
| B-17 | 2 | **Outcomes** and **More info** controls appear on resolved markets, but no content/result is captured. | STATE020–035 | **[observed]** controls; hidden content. |
| B-18 | 2 | **Add Collateral** appears alongside Split/Merge, but no Add Collateral interaction state is captured. | STATE020, STATE022, STATE030, STATE032 | **[observed]** control only; evidence gap. |
| B-19 | 2 | TWAP timestamps use 12-hour time with no date or timezone, e.g. `10:58:14 PM`–`11:00:11 PM`, `11:00:36 PM`–`11:04:00 PM`. | STATE024–035; STATE036–043; STATE044–049; STATE052 | **[observed]**. |
| B-20 | 3 | **TWAP Complete** and **FINAL TWAP WINDOW UPDATED** read like status/action labels but are not explained. | STATE024–035; STATE036–043; STATE044–052 | **[observed]**. |
| B-21 | 3 | GIP-152 summary strip says **Status Awaiting**, while the market field says **Status Awaiting Resolution**. | STATE021, STATE023 | **[observed]**. |
| B-22 | 3 | **Resolve Question** and **Resolution Question** are used for related-looking external links/actions without clarifying whether they are the same mechanism. | STATE010–019; STATE024–035 | **[observed]**. |
| B-23 | 3 | Info icons `ⓘ` next to **Volume (Total; sDAI)** and **TVL** have no captured tooltip/definition. | STATE010–035 | **[observed]** icons; tooltip content not captured. |
| B-24 | 2 | The **LIQUIDITY** column contains the value **Liquidity** as a link for Gnosis DAO/Kleros DAO and `-` for others. The column and value share a label, so it is unclear whether this is a metric or an action. | STATE001–009 | **[observed]**. |
| B-25 | 3 | The **ACTIVE** column and **ACTIVE MARKET** badge are not defined; e.g. Gnosis DAO has ACTIVE `0` with PROPOSALS `6`, while Ethereum has ACTIVE `1` and an ACTIVE MARKET badge. | STATE001–009 | **[observed]**. |
| B-26 | 2 | GIP-152 shows **Volume 0** and **TVL 0**, yet the Add Liquidity panel lists multiple pools. This may be correct but gives no explanation. | STATE010–013 | **[observed]**. |
| B-27 | 2 | Theme toggle is labeled **Switch to dark mode** / **Switch to light mode**, but clicking it in STATE002 changed controls count from 21 to 22 with no text-level visual difference captured. | STATE002; control inventory | **[observed]** control count change. **[hypothesis]** theme state may not be visibly or accessibly perceivable in capture. |
| B-28 | 2 | **Refresh RPC Connection** is exposed on the landing page without explaining RPC or when to use it. | control inventory for STATE001–008 | **[observed]** control. |
| B-29 | 3 | **Impact (spot)** is `—` on resolved KIP-90/GIP-151/KIP-88 markets but `0.00%` on GIP-152. Users cannot tell whether dash means unavailable, zero, or not applicable. | STATE024–035; STATE052 vs STATE010–019 | **[observed]**. |
| B-30 | 3 | Active milestone uses **USDS** as price unit without explanation; market pages use **sDAI**. | STATE002–009 vs STATE010–035 | **[observed]** unit difference. **[hypothesis]** different collateral/unit contexts; not explained. |
| B-31 | 3 | Active milestone question contains **EIP-8363**, **Scheduled for Inclusion**, and **Hegotá** without explanation. | STATE002–009 | **[observed]**. |
| B-32 | 3 | Proposal codes **GIP-152**, **KIP-90**, **GIP-151**, **KIP-88**, etc. are used as primary identifiers without explaining GIP/KIP or linking to proposal context beyond external Snapshot/Reality links. | STATE001–052 | **[observed]**. |

---

## C. Jargon without explanation

Terms are **[observed]** as present in UI; absence of explanation is based on captured copy only.

| Jargon / cluster | Evidence | Sev | Status / uncertainty |
|---|---|---:|---|
| **Futarchy** | Footer tagline only: “Futarchy — Market-based evaluation of governance decisions and milestones” (STATE001–019). | 3 | **[observed]** tagline. **[hypothesis]** insufficient onboarding for conditional-market mechanics. |
| **Milestones** / **Active Milestones** | STATE001–009 | 3 | **[observed]** section label. No definition captured. |
| **TWAP**, **TWAP impact**, **TWAP Complete**, **FINAL TWAP WINDOW** | STATE024–035; STATE036–043; STATE044–052 | 4 | **[observed]** terms. Short explanatory copy exists but is inconsistent (A-13). |
| **Impact (spot)** vs **Impact** vs **TWAP impact** | STATE001–009; STATE010–035; STATE052 | 4 | **[observed]** three metric labels. No unified definition. |
| **sDAI**, **xDAI**, **XDAI** | STATE004/012; STATE020–023; STATE052 | 4 | **[observed]** cases/units vary. Difference not explained. |
| **Split Collateral**, **Merge Collateral**, **Add Collateral**, **mergeable** | STATE020, STATE022, STATE030, STATE032, STATE040–043, STATE051; STATE010–035; STATE052 | 4 | **[observed]** controls/fields. Generic collateral copy does not explain split/merge. |
| **Max Approval** / **allowance** | STATE020, STATE022, STATE030, STATE032; STATE052 | 3 | **[observed]**. |
| **Recover** / **Recover Quote Unavailable** | STATE010–019; STATE024–035; STATE052 | 3 | **[observed]**. |
| **Conditional Pools**, **Prediction Pools**, **Company Token Pools** | STATE013; STATE028 | 4 | **[observed]** categories. No definitions captured. |
| **Swapr** | STATE013; STATE028 | 3 | **[observed]** external destination. |
| **Quote** / **Quote returned no output** / **Quote Unavailable** | STATE010–019 | 3 | **[observed]**. |
| **Pool depth** | Warning in STATE034–036 | 3 | **[observed]**. |
| **Snapshot** / **Snapshot Vote** / **View final results on Snapshot** | STATE010–035 | 3 | **[observed]** external governance source. Relationship to Futarchy not explained. |
| **Reality.eth** / **Resolve Question** / **Resolution Question** | STATE010–035 | 3 | **[observed]** external resolution link/action. |
| **GIP / KIP / EIP**, **Hegotá**, **Scheduled for Inclusion** | STATE002–009; STATE010–052 | 3 | **[observed]** codes/terms. |
| **USDS** | STATE002–009 | 3 | **[observed]** unit. |
| **ACTIVE MARKET**, **ACTIVE**, **PROPOSALS**, **LIQUIDITY** | STATE001–009 | 3 | **[observed]** table vocabulary. |
| **RPC Connection** | control inventory STATE001–008 | 2 | **[observed]**. |
| **Connected** in network selector | STATE003, STATE007, STATE011, STATE026 | 3 | **[observed]** network/status ambiguity. |
| **BUY sDAI** | STATE020–023, STATE030–033; STATE052 | 2 | **[observed]** link label. |
| **WINNING OUTCOME** / **APPROVED** | STATE024–035; STATE052 | 3 | **[observed]** outcome vocabulary. |
| **Outcomes** / **More info** | STATE020–035 | 2 | **[observed]** controls; no content captured. |
| **GNO / PNK / sDAI** token pairs | STATE001–052 | 3 | **[observed]** symbols. Token identities/roles not explained. |

---

## D. Hidden information

| ID | Hidden information | Evidence | Sev | Status / uncertainty |
|---|---|---|---:|---|
| D-01 | Full wallet address is not visible; only truncated forms. | STATE004, STATE008, STATE012; STATE052 | 3 | **[observed]**. “Copy Address” exists, but full address not shown. |
| D-02 | Explorer link does not expose a normal full wallet address; it points to an all-zero/truncated address URL. | STATE004, STATE008, STATE012, STATE027, STATE037, STATE047 | 4 | **[observed]** href. **[hypothesis]** placeholder/broken link. |
| D-03 | Info-icon definitions for **Volume** and **TVL** are not captured. | STATE010–035 | 3 | **[observed]** icons; tooltip content absent. |
| D-04 | Chart axes, series, legends, and tooltip values are absent/unreadable. | STATE010–035; STATE052; STATE016, STATE018 | 4 | **[observed]** no readable data. **[hypothesis]** canvas/rendering/accessibility issue. |
| D-05 | **Create market** screen is not captured. | STATE001–009 | 2 | **[observed]** control only; evidence gap. |
| D-06 | **Liquidity** links for Gnosis DAO/Kleros DAO are not followed in captures. | STATE001–009 | 2 | **[observed]** links only; evidence gap. |
| D-07 | **Resolve Question**, **Snapshot Vote**, **View final results on Snapshot** actions are not captured. | STATE010–035 | 3 | **[observed]** controls only; evidence gap. |
| D-08 | **Add Collateral** interaction is not captured. | STATE020, STATE022, STATE030, STATE032 | 2 | **[observed]** control only; evidence gap. |
| D-09 | **Outcomes** and **More info** content on resolved markets is not captured. | STATE020–035 | 2 | **[observed]** controls only. |
| D-10 | Numeric availability is hidden behind `Available -` while sidebar shows `sDAI Available 0 sDAI`. | STATE010–019; STATE052 | 3 | **[observed]**. |
| D-11 | TVL unit is missing for `40.89`. | STATE044; STATE052 | 3 | **[observed]**. |
| D-12 | TWAP update times lack date/timezone. | STATE024–035; STATE036–043; STATE044–049; STATE052 | 2 | **[observed]**. |
| D-13 | The relationship between TWAP recommendation and final result is hidden/not explained. | STATE024–033; STATE034–035; STATE044–052 | 4 | **[observed]** values; no binding/advisory explanation captured. |
| D-14 | Search filter scope is hidden; only the Organizations count changes. | STATE005, STATE009 | 2 | **[observed]** filter result. |
| D-15 | Meaning of **ACTIVE** column and **ACTIVE MARKET** badge is hidden. | STATE001–009 | 3 | **[observed]**. |
| D-16 | Meaning/source of **Final Result APPROVED** is hidden. | STATE010–023; STATE024–035 | 4 | **[observed]** label. Uncertainty: Snapshot vs Reality.eth vs Futarchy. |
| D-17 | Disabled reasons for **Gnosis Connected**, **Insufficient balance**, **Quote Unavailable** are not explained. | STATE003, STATE007, STATE011, STATE026; STATE010–019 | 3 | **[observed]** disabled controls. |
| D-18 | Price-impact calculation behind `1082765.91%` is hidden. | STATE034–036 | 4 | **[observed]** value; calculation not shown. |
| D-19 | Whether `24.68 XDAI`, `0 sDAI`, `24.689107 xDAI`, and `0 xDAI` refer to same/related balances is hidden. | STATE004/012; STATE010–019; STATE020–023, STATE030–033; STATE052 | 4 | **[observed]** values; no token/accounting explanation. |
| D-20 | GIP-152 has no TWAP block in captures while still showing **Final Result APPROVED**. | STATE020–023 vs STATE024–035 | 3 | **[observed]** absence. Uncertainty: pending resolution vs missing data. |

---

## E. Inconsistent labels, units, and formats

| ID | Inconsistency | Evidence | Sev | Status / uncertainty |
|---|---|---|---:|---|
| E-01 | Lifecycle labels: **Awaiting**, **Awaiting Resolution**, **Ended**, **Resolved**, **Final Result APPROVED**. | STATE001–009; STATE010–019; STATE021–023; STATE024–035 | 5 | **[observed]**. |
| E-02 | Outcome labels: **Outcome YES**, **Resolved: YES**, **Final Result APPROVED**, **WINNING OUTCOME: YES**. | STATE001–009; STATE024–035; STATE052 | 4 | **[observed]**. |
| E-03 | Date labels: **Ended** vs **Resolution Date** for a date field. | STATE010–019 vs STATE024–035 | 3 | **[observed]**. |
| E-04 | Impact labels: **Impact**, **Impact (spot)**, **TWAP impact**. | STATE001–009; STATE010–035; STATE052 | 4 | **[observed]**. |
| E-05 | Wallet truncations: **0x00…dEaD** vs **0x0000...dEaD**. | STATE052 | 2 | **[observed]**. |
| E-06 | Token case/format: **XDAI**, **xDAI**, **sDAI**. | STATE004; STATE020–023; STATE052 | 4 | **[observed]**. |
| E-07 | Availability: `Available -` vs `sDAI Available 0 sDAI`. | STATE052 | 3 | **[observed]**. |
| E-08 | **Resolve Question** vs **Resolution Question**. | STATE010–019; STATE024–035 | 3 | **[observed]**. |
| E-09 | **Status Awaiting** vs **Status Awaiting Resolution**. | STATE021, STATE023 | 3 | **[observed]**. |
| E-10 | **Insufficient balance** vs **Insufficient balance.** | STATE010–019 vs STATE052 | 1 | **[observed]**. |
| E-11 | **Liquidity** is both column name and value/link. | STATE001–009 | 2 | **[observed]**. |
| E-12 | Chain labels mix **Gnosis**, **ETH**, **Ethereum**. | STATE001–009; STATE003/007/011/026 | 4 | **[observed]**. |
| E-13 | Units: **Volume (Total; sDAI)** vs TVL with **K** vs TVL with no unit (`40.89`). | STATE024–035; STATE044; STATE052 | 3 | **[observed]**. |
| E-14 | Numeric scale: `3.95K`, `121.46K`, `89.13K`, `101.20K`, but `40.89` raw. | STATE024–035; STATE044 | 2 | **[observed]**. |
| E-15 | Time format: 12-hour `10:58:14 PM` with no date/timezone. | STATE024–035; STATE036–043; STATE044–049; STATE052 | 2 | **[observed]**. |
| E-16 | `Impact (spot)` is `0.00%` on GIP-152 but `—` on resolved KIP-90/GIP-151/KIP-88. | STATE010–023 vs STATE024–035, STATE052 | 3 | **[observed]**. |
| E-17 | Same market family shows **Yes/No Price** identical on GIP-152 and GIP-151, but KIP-90 prices differ slightly (`0.0067` vs `0.0068`). | STATE010–035 | 3 | **[observed]**. Uncertainty: expected market state or display rounding. |
| E-18 | `BUY sDAI` appears as a link label while other sDAI references are balances/tokens. | STATE020–023, STATE030–033; STATE052 | 2 | **[observed]**. |

---

## F. Accessibility / responsive problems

| ID | Sev | Finding | Evidence | Status / uncertainty |
|---|---:|---|---|---|
| F-01 | 4 | Chart canvases contain no text or SVG path text in captures (`svg-paths=0`, `texts=[]`), so charts are not screen-reader- or text-capture-friendly. | STATE010–035; STATE052; chart metadata | **[observed]** no chart text. **[hypothesis]** screen-reader users receive no chart data. |
| F-02 | 3 | Social and GitHub footer links appear with no text in control inventory. | control inventory for STATE001–008; hrefs to x.com and github.com | **[observed]** no text. **[hypothesis]** icon-only links may lack accessible names. |
| F-03 | 3 | `ⓘ` info icons next to Volume/TVL have no captured tooltip/accessible description. | STATE010–035 | **[observed]** icons; tooltip content absent. |
| F-04 | 2 | Wallet button includes emoji identicon `👾` plus truncated address. | STATE001–019; STATE052 | **[observed]**. **[hypothesis]** screen readers may read the emoji or ellipsis awkwardly. |
| F-05 | 3 | All chart captures are desktop-sized canvases (`760x420` or `754x420`). No mobile/responsive states were supplied. | chart metadata STATE010–035; STATE052 | **[observed]** desktop captures. **[hypothesis]** fixed canvas widths and dense tables/modals may overflow narrow viewports; unverified. |
| F-06 | 3 | Dense tables/modals with many columns and controls are used for Organizations, trade, collateral, and liquidity; no responsive evidence is provided. | STATE001–009; STATE010–035; STATE052 | **[hypothesis]** narrow-screen usability risk; cannot confirm without responsive states. |
| F-07 | 3 | Disabled controls such as **Gnosis Connected**, **Insufficient balance**, and **Quote Unavailable** are presented as buttons without visible reason/description. | STATE003/007/011/026; STATE010–019; control inventory | **[observed]** disabled controls. **[hypothesis]** users of assistive tech may not learn why disabled. |
| F-08 | 2 | Theme toggle label changes **Switch to dark mode** / **Switch to light mode**, but no text-level visual difference was captured after clicking. | STATE002; control inventory | **[observed]** click/count change. **[hypothesis]** theme state may not be perceivable in capture; contrast not assessable. |
| F-09 | — | Keyboard focus order, focus visibility, ARIA names, and color contrast were not supplied. | — | **Evidence gap**: cannot assess. |

---

## G. Performance, console, and application error states

| ID | Sev | Finding | Evidence | Status / uncertainty |
|---|---:|---|---|---|
| G-01 | 4 | Chart rendering appears suspect: `charts=2` but canvases show no SVG paths/text and no readable tooltip data. | STATE010–035; STATE052; hover STATE016/018 | **[observed]** empty chart text. **[hypothesis]** rendering or canvas-capture failure; console errors not supplied. |
| G-02 | 4 | Quote flow produces contradictory/error states: **Quote returned no output**, **Loading...**, **1.00 sDAI (estimate)**, **Quote Unavailable**, and **0.00** outputs. | STATE010–019 | **[observed]** states. **[hypothesis]** async quote race, stale state, or calculation issue. |
| G-03 | 4 | **Max** does not return a usable maximum; it yields zero amounts and **Quote Unavailable**. | STATE019 | **[observed]**. |
| G-04 | 4 | Price impact reaches **1082765.91%** with a warning and an **Insufficient balance** state. | STATE034–036 | **[observed]**. **[hypothesis]** calculation bug or extreme pool state. |
| G-05 | 3 | High repeated API/RPC hit counts in data model: index JSON 134, registry GraphQL 132, candles GraphQL 953, Gnosis RPC 2016, Web3Modal config 135, Snapshot 107. | DATA MODEL excerpts | **[observed]** hit counts. **[hypothesis]** performance/latency risk; no per-page timing or console trace supplied. |
| G-06 | 3 | `xDAI Balance` changes from `0 xDAI` to `24.689107 xDAI` between panels/states. | STATE020 vs STATE021–023, STATE030–033 | **[observed]**. **[hypothesis]** stale/loading/RPC state. |
| G-07 | 3 | STATE001 empty Active Milestones followed by populated active ETH card from STATE002. | STATE001 vs STATE002–009 | **[observed]**. **[hypothesis]** hydration/loading timing. |
| G-08 | 3 | Pool links in STATE013 appear duplicated across categories: e.g. conditional and company-token GNO pool rows share hrefs. | STATE013; control inventory | **[observed]** href duplication. **[hypothesis]** intentional alias or data/link bug. |
| G-09 | 4 | Explorer link for wallet points to an all-zero/truncated address. | STATE004, STATE008, STATE012, STATE027, STATE037, STATE047 | **[observed]** href. **[hypothesis]** placeholder/broken link. |
| G-10 | 2 | Theme toggle click changes controls count but no text-level visual difference captured. | STATE002 | **[observed]** count change. **[hypothesis]** theme/hydration issue; low confidence. |
| G-11 | — | No console-error entries or HTTP error statuses are included in the supplied notes; data-model examples show status 200. | DATA MODEL excerpts | **Evidence gap**: cannot confirm or deny console errors. |

---

## H. Explicit evidence gaps / uncertainty

- **[Observed gap]** No mobile/responsive captures were provided; responsive behavior is therefore unverified.  
- **[Observed gap]** No console logs, stack traces, Lighthouse results, or network timing were supplied; performance findings are based on hit counts and empty chart metadata only.  
- **[Observed gap]** No keyboard/focus/ARIA/contrast data were supplied; accessibility findings are limited to visible text/canvas evidence and control labels.  
- **[Observed gap]** **Create market**, **Liquidity** destinations, **Resolve Question**, **Snapshot Vote**, **View final results on Snapshot**, **Add Collateral**, **Outcomes**, and **More info** have no resulting screens captured.  
- **[Hypothesis]** Several contradictions may be stale/loading state rather than permanent design defects: empty Active Milestones in STATE001, `0 xDAI` vs `24.689107 xDAI`, quote transitions, and GIP-152’s **Awaiting Resolution** + **Final Result APPROVED**. The notes do not establish root cause.