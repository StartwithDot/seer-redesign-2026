# comprehension problems (explorer; DeepSeek draft: Claude verifies against screenshots)

## Severity scale used
5 = blocker / major trust or task failure; 4 = high confusion or broken-feeling flow; 3 = moderate comprehension/accessibility risk; 2 = minor confusion/cosmetic inconsistency; 1 = low-impact polish.  
“Observed” = directly stated in notes/captures/data. “Hypothesis” = inferred; explicitly marked.

## Evidence limitations
- All chart/canvas entries are labeled `[desktop]`; no mobile/responsive states are provided. Responsive behavior cannot be verified. [observed]
- No console-log capture is supplied. Absence of console errors in these notes is not proof that none occur. [observed limitation]
- Chart axes, series labels, focus states, ARIA names, contrast, and keyboard behavior are not exposed in most captures. Any such finding is marked hypothesis. [observed limitation]
- Root-feed captures report `charts=0 tables=0`; market detail captures expose chart counts but usually not readable axes/series. [STATE 001–008; STATE 037–040; STATE 087–090]

## A. Newcomer comprehension and confusing UI

| ID | Sev | Status | Finding and evidence |
|---|---:|---|---|
| A1 | 2 | Observed | Recurring beta notice “Note that this is a Beta version and can still be unstable” gives no scope, risk, or affected features. Seen across STATE 001–008, 009–019, 020–040, 056–069, 070–086, 087–090. |
| A2 | 3 | Observed | Market feed contains duplicate title “National Rally candidate win next French presidential” with different outcomes/volume: card 2 `No 67.9% / Yes 32.1% / $7.54k`; card 5 `No 74% / Yes 26% / $1.24k`. STATE 001–008. |
| A3 | 3 | Observed | Leaderboard has duplicate account names with different stats/ranks: `stormy-dull-puffin` at ranks 12 and 15; `indirect-mere-gibbon` at ranks 16 and 19. STATE 009–019, 020–025. |
| A4 | 4 | Observed symptom; cause hypothesis | Typing `e` in market search changes URL to `/?marketName=e` but feed remains unchanged/unfiltered and header switches from connected wallet to `Connect`. Search behavior and auth-state change are unexplained. STATE 008. |
| A5 | 3 | Observed | Market `Filters` expose advanced labels `Market States`, `Verification Status`, `Chain`, `Sort By`, `Conditional Market`, `Rewards`, `Minimum Liquidity`, `Futarchy` with no visible help text. STATE 006; leaderboard filter adds `App` and `Chain` options. STATE 018. |
| A6 | 3 | Observed | `App` menu lists `Futarchy`, `Deepfunding`, `Foresight`, `Opportunity Markets` without descriptions; opening it leaves the market feed unchanged. STATE 003, 011, 029, 034, 040, 058. |
| A7 | 3 | Observed | `Policies` opens headings `Verified Market Policy` and `Market Rules Policy`, but no policy body/content is captured. STATE 002, 010, 028, 033, 038, 056. |
| A8 | 3 | Observed | Wallet menu exposes `Account`, `Deposit`, `Portfolio`, `Market Collections`, `Trade Collateral`, `Use smart account` with no explanations; menu-item outcomes are not captured. STATE 004, 012, 030, 035, 041. |
| A9 | 5 | Observed | Outcome percentages are not consistently 100%-consistent: STATE 056–069 shows `No 74.5%` + `Yes 35.3%` + `Invalid 0%` = 109.8%; STATE 072–086 shows `Yes 84.2%` + `No 14.8%` + `Invalid 0%` = 99.0%; STATE 037–040 shows 60.8 + 38.1 + 0.9 + 0.5 + 0 = 100.3%. No explanation is given. |
| A10 | 4 | Observed | `Related Conditional Markets (2)` shows two cards with identical titles; differentiation is only the conditional text “being ‘Yes’” vs “being ‘No’”. STATE 068. |
| A11 | 4 | Observed | Trade widget shows `No Market` and `You will get No`; the outcome/action semantics are not self-evident. STATE 056–069. |
| A12 | 3 | Observed | `Mint` appears multiple times in the trade widget, including tab/action/button contexts, making the primary action ambiguous. STATE 056–069, 087. |
| A13 | 3 | Observed | `Your Rank` produces `Finding your rank…`; no resulting rank is captured while the table remains visible. STATE 019. |
| A14 | 5 | Observed | Leaderboard sorting appears broken/inconsistent: clicking Score reports `Sorted by Score, high to low` but rows remain P/L-ordered and scores are not ordered (`87.5` after `78.6`); clicking Profit/Loss descending reports `low to high` while rows remain high-to-low; Volume/ROI clicks leave rows unchanged. STATE 021–024. |
| A15 | 5 | Observed | `Next` changes footer to `Page 2 of 166` but displayed rows/ranks 1–25 are identical to page 1. STATE 025. |
| A16 | 4 | Observed | Leaderboard search: typing `e` shows no visible query value and no visible table change. STATE 026. |
| A17 | 4 | Observed | Time filters behave inconsistently: `1W` produces a different table and `Page 1 of 91`; `1D` and `1M` show `Updating…` but retain the same ALL rows/page count/timestamp. STATE 014–016. |
| A18 | 4 | Observed | After `1W` and `1M` clicks, header changes to `Connect` and `Your Rank` disappears, while other states show `0x0000...dEaD` / `24.69 xDAI`. STATE 015–016. |
| A19 | 4 | Observed | Leaderboard contains rows that violate intuitive accounting: rank 1 with `Score N/A`, `+$274.29`, `$0.00` volume, `+1.0%` ROI, `0` markets; ALL row 24 with `+1,368,132.0%` ROI, `$0.00`, `0`. STATE 015, 009–019. |
| A20 | 3 | Observed | Market status `Reports open` conflicts with report modal copy “This market is not resolved yet” and `Current answer: Not answered yet`. STATE 056–069 vs STATE 060. |
| A21 | 4 | Observed | STATE 090 shows `Pending execution`, `Deadline:` with no visible value, and question rows `Answer: Answered too soon` with `Reopen question`; the market lifecycle is unclear. |
| A22 | 4 | Observed | `Add Liquidity` modal says `Rewards ended on: January 4 2026, 22:31`, while the same market shows expected resolution `MAY 31, 2027`. The date relationship is unexplained. STATE 063 vs STATE 056–069. |
| A23 | 3 | Observed | Top-holder balances have no unit label and mix formats: `5.73k`, `0.14`, `<0.001`, `210.85`. STATE 069, 087. |
| A24 | 4 | Observed | `View pool details` exposes `SHARES` / `TOTAL` series with many numeric rows, anomalies such as `158.69` inserted in a descending series, and final values `0.7453`, `2.73`, `2.73`; labels are insufficient to interpret. STATE 064. |
| A25 | 4 | Observed | Chart captures expose canvas/SVG but no readable title, axes, or series labels; only one hover tooltip is captured. STATE 037–039, 057, 087–090. |
| A26 | 3 | Observed | Collections area is contradictory: `Sign in to view and manage your market collections` appears with a `Default` collection and `No markets in this collection.` STATE 032–036. |
| A27 | 4 | Observed | Create-market types `Categorical`, `Scalar`, `Multi Categorical`, `Multi Scalar` have no descriptions or examples. STATE 027–031. |
| A28 | 3 | Observed | Numeric markets show units and bounds such as `21.23 NOTE`, `9.092 GWEI`, bounds `10`/`50` and `0.1`/`120`, without explaining what NOTE/GWEI measure or what the bounds mean. STATE 001–008. |
| A29 | 3 | Observed | `Invalid` outcome rows show token-like values `9.00 SER-INVALID` or `210.85 SER-INVALID` with `0%`; the token and settlement meaning are unexplained. STATE 037–040, 070–086, 087. |
| A30 | 3 | Observed | In Comments state, `Switch to Gnosis` appears with `Connect`; the need to switch chain is not contextualized. STATE 067. |
| A31 | 3 | Observed | `Open interest and liquidity breakdown` produces no visible breakdown data in STATE 007, while later breakdown captures show data. STATE 007 vs STATE 044, 061. |
| A32 | 3 | Observed | `Max` and `More` controls in the trade widget produce no visible result in captured states. STATE 065–066. |
| A33 | 3 | Observed | Market metrics use unlabeled values: `Liquidity: 7.54k`, `Volume: 11.75k`, `P&L: 0.00` without currency/units; breakdown later mixes `$` and token units. STATE 037–040, 056–069 vs STATE 061. |
| A34 | 3 | Observed | Title contains literal placeholder `[party bloc]`; root feed also exposes placeholders `[Note]`, `[gwei]`. STATE 090; STATE 001–008. |
| A35 | 2 | Observed | Selected outcome label is truncated with ellipsis: `Left (UG, LFI, SOC, COM, VEC, RDG, DVG, EXG, …)`. Full label is hidden. STATE 090. |
| A36 | 2 | Observed | `Custom` date range picker exposes `Today`, `Last Week`, `Last Month`, `All`, `Previous Month`, `Next Month`, month label `October 2026`, and `Cancel` / `Save`; it is not clear how custom ranges relate to market lifetime. STATE 062. |
| A37 | 2 | Observed | `Hide questions` control in STATE 090 is not self-explanatory. |
| A38 | 2 | Observed | Leaderboard `Trader Score` explanatory copy references `How it works.` but the linked content is not captured. STATE 009–019, 020–025. |
| A39 | 2 | Observed | Leaderboard copy references `Deepfunding` and `Foresight` per-market boards; no corresponding control/capture demonstrates where those boards live. STATE 009–019. |
| A40 | 1 | Observed, with rounding uncertainty | Chart hover values in STATE 039 sum to 100.2%: `Yashar 59.60%`, `Likud 39.10%`, `Others 1.00%`, `Together Alliance 0.50%`. Could be independent rounding; no explanation is visible. |

## B. Jargon without explanation

| ID | Sev | Status | Finding and evidence |
|---|---:|---|---|
| B1 | 3 | Observed | App/product jargon `Futarchy`, `Deepfunding`, `Foresight`, `Opportunity Markets` has no inline definition. STATE 003, 011, 029, 034, 040, 058. |
| B2 | 3 | Observed | Filter jargon `Conditional Market`, `Rewards`, `Market States`, `Verification Status`, `Minimum Liquidity`, `Futarchy` lacks help text. STATE 006, 018. |
| B3 | 4 | Observed | Token/unit jargon `xDAI`, `sDAI`, `XDAI`, `SEER`, `SER-INVALID`, `LEPEN_NRYES`, `LPY_NR_NO`, `LPY_NR_YES`, `GWEI`, `NOTE` appears without glossary. STATE 001–008, 037–040, 056–069, 060, 063, 087. |
| B4 | 3 | Observed | `Answer on Reality.eth!` and `Reality.eth Resolution` reference an external resolution mechanism without explanation on the market page. STATE 037–040, 056–069, 070–086, 087–090. |
| B5 | 3 | Observed | Trade actions `Mint`, `Merge`, `Redeem`, `Max slippage`, `Avg price`, `Potential return`, `Add Liquidity`, `View pool details`, `New conditional market` are not defined. STATE 056–069, 087. |
| B6 | 3 | Observed | `Trader Score` explanation uses `returns`, `profit factor`, `hit rate edge`, `loss burn`, `breadth`, and `shrunk toward the middle` without defining those terms. STATE 009–019, 020–025. |
| B7 | 2 | Observed | Score bands `ELITE`, `GREAT`, `GOOD`, `AVERAGE` have no visible threshold mapping. STATE 009–019. |
| B8 | 4 | Observed | Breakdown jargon `Open interest`, `notional`, `LPY_NR_NO`, `LPY_NR_YES` appears without definitions. STATE 061. |
| B9 | 3 | Observed | Status jargon `Reports open`, `Pending execution`, `Answered too soon`, `Reopen question` is not explained. STATE 056–069, 060, 090. |
| B10 | 3 | Observed | `Use smart account` and `Trade Collateral` are wallet-menu terms with no explanation. STATE 004, 012, 030, 035, 041. |
| B11 | 2 | Observed | `Farming rewards (SEER)` is introduced without explaining SEER, farming, or eligibility. STATE 063. |
| B12 | 2 | Observed | `Hide questions` in STATE 090 is unexplained. |
| B13 | 2 | Observed | `Max` appears repeatedly for slippage, trade amount, and token balance contexts; no scope label. STATE 056–069, 087. |
| B14 | 2 | Observed | `Custom` time range is unexplained relative to `1D/1W/1M/All`. STATE 062. |

## C. Hidden information

| ID | Sev | Status | Finding and evidence |
|---|---:|---|---|
| C1 | 3 | Observed | Policy content is hidden: only policy headings are captured. STATE 002, 010, 028, 033, 038, 056. |
| C2 | 3 | Observed | `Open interest and liquidity breakdown` shows no data in STATE 007; breakdown data appears only in later states. STATE 007 vs STATE 044, 061. |
| C3 | 4 | Observed | Charts lack accessible/visible axes and series labels in text; only canvas/SVG shell and one hover tooltip are exposed. STATE 037–039, 057, 087–090. |
| C4 | 3 | Observed | App menu selections and wallet menu selections do not show resulting pages/content in captures. STATE 003–004, 011–012, 029–030, 034–035, 040–