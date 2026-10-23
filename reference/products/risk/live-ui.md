# risk.seer.pm live UI capture (Oct 17 2026, browser pane)

Brand: "Foresight | Kleros", built by Kleros. Header: logo, Guide, avatar, Connect, 3 icon buttons. Page: purple-navy gradient with glows (not EF).

## Structure observed (top to bottom)
1. Title "Risk Pricing Predictions"; Trading Period until Wed 30 Sep 2026 23:59 UTC; Countdown: Ended.
2. SEER card with the question: "What is the yearly Probability of Default (PD) for the following DeFi assets during Q3 2026?" (+ subtext).
3. Round tabs: Q3 2026 | Q4 2026 (Coming soon).
4. "Market Estimate Risk" with view toggle: Risk bars | Over time.
5. Group chips: All 33, ETH Based 7, USD Based 13, BTC Based 6, Funds Based 7 (colored dots), followed by a wall of 33 colored ticker pills + "Clear all" (repeats the same filtering).
6. Risk bars: one bar per asset, label "PD (Ann.) x / PD (Quart.) y"; band legend and the aggregate sit below.
7. Over time: 33 near-flat lines at the bottom of a linear axis; right-hand end-label pills overlap (mF-ONE 1.92%, GACLO-1 0.77%, BTCB 0.77%, UBTC ...) and are unreadable.
8. Aggregate: "Chance that no listed asset defaults" 46.52% (Ann.) / 82.59% (Quart.), "No to All".
9. Participate (far below fold): Upload CSV Predictions, "0 of 33 assets edited", Expand all, group accordions, "Predict all the estimates above", Connect To Predict, Advanced, LP/trade link, Download CSV (24h data).

## Verified data (33 assets, PD Ann. %)
ETH: weETH .09 stETH .08 ETH+ .46 bsdETH .62 rETH .24 pufETH .29 avETH 12.58 · USD: PYUSD .06 RLUSD .05 USDC .04 USD1 .28 USDS .48 USDT .40 RUSD 5.51 USDF 15.80 avUSD 9.71 NUSD 7.12 iUSD 3.02 satUSD+ 2.43 USDO 2.07 · BTC: BTCB .77 solvBTC 2.27 tBTC .26 cbBTC .04 LBTC .48 UBTC 2.01 · Funds: GACLO-1 .77 BUIDL-I .17 JAAA .33 JTRSY .21 mF-ONE 1.92 STAC .25 U 2.33.
Quarterly PD = 1-(1-p)^(1/4) (e.g. avETH 12.58 -> 3.30).

## KEY MATH FINDING (computed)
prod(1 - PD_i) over these 33 ann. values = 0.46517 (46.52%, matches the live headline exactly); fourth root = 0.82585 (82.59%, matches Quart.). So the headline IS the product of survivals and the real data reproduces it. Hardcode nothing: compute it. Hazard-share view is valid: asset i contributes -ln(1-p_i) / sum -ln(1-p_j); avETH + USDF + avUSD + NUSD + RUSD carry most of it.

## Problems to fix
Obsolete gradient look; hue used decoratively for groups (collides with severity); filter duplication; bars crushed at left on stepped 0/2/5/10/100 axis; legend disconnected from data; two PD numbers per asset; aggregate not linked to assets; Over time unreadable; participate far below fold and a wall of inputs; Guide is a modal of links.

## PARITY AUDIT (Oct 17, complete traversal of the live site; every item must exist in apps/risk, redesigned)
Data files saved: credora.json (33 assets: PD, market PD to 3 decimals, rating grade, category, avg score, sub-scores), credora_api.json (full Credora profiles with per-metric explanation text, keys by credora slug incl. address; credora link = https://app.credora.network/assets/<slug>, contract = https://etherscan.io/address/<address>), chart.json (real market price history from Seer pools: data[asset][point] {pool{token0,token1 names}, token0Price, token1Price, periodStartUnix}; ~5-13 points from 2026-08-12 for each asset; the PD token is the one whose name ends with "PD"; quarterly PD q = min(token0Price, token1Price) times the sDAI rate; verified: annualised 1-(1-q)^4 matches live PD within ~8%, so scale each series so its last point equals the live PD; a NOTOALLPD pool is the "No to All" market).
1. Header: Foresight home link, "Built by Kleros" (link kleros.io), Guide button (opens welcome modal: Beginner User Guide, Advanced User Guide, Acquire xDAI; 3 steps), Email notifications button (modal: "Connect your wallet to subscribe to email notifications." + Connect), Help menu (Get Help, Report a Bug, Give Feedback, App Guide, Crypto Beginner's Guide, FAQ), Light/Dark mode toggle, Connect. First visit shows the Welcome modal.
2. Title "Risk Pricing Predictions"; Trading Period with full date; Countdown (Ended); the question card (SEER logo + star graphic + question with dotted-underline "Default (PD)" help tooltip + subtext). Decision: keep the QUESTION as a one-line subtitle with the PD tooltip; drop the poster art (logo card + star) because it is decoration; show SEER and Kleros credits in the footer ("Powered by Seer", "Built by Kleros").
3. Round tabs Q3 2026 / Q4 2026 (disabled, Coming soon).
4. Market Estimate Risk: view toggle Risk bars | Over time. Group chips (All 33, ETH Based 7, USD Based 13, BTC Based 6, Funds Based 7). 33 ticker pills are a MULTI-SELECT of arbitrary assets across groups; group chips select whole groups; Clear all empties; All selects everything; the selection drives BOTH views. After Clear all, picking USDC shows 1 bar. Risk bars: per selected asset a bar with PD (Ann.) and PD (Quart.) labels + band legend with four icon badges (check, !, !, x) and axis ticks 0%, 2%, 5%, 10%, 100%. Over time: TradingView lines per selected asset with end labels ("Charting by TradingView" credit).
5. Aggregate: "Chance that no listed asset defaults" 46.52% (Ann.) / 82.59% (Quart.), "No to All" shortcut.
6. Participate: intro text (choose how many protocols; same capital predicts on all), Upload CSV Predictions, "No to All" card (chance no listed asset defaults, aggregate slider 0-100 whose default is 46.52 = Market Estimate (Ann.) 46.52%), "n of 33 assets edited", Expand all / Collapse all, four group accordions; each asset row: ticker, PD (Ann.) rounded, Market PD (Ann.) to 3 decimals, a 0-100 slider, band gauge with 4 zones and 0/2/5/10/100 ticks, Details > Risk Panel (Credora): grade (A+..D), category (e.g. "Derivative - Liquid Restaking", "Stablecoin - Active Strategy", "Tokenized Assets - Fund"), "Avg. risk score: x" and x/5 sub-scores (Asset Quality, Protocol Security, Governance, Peg Track Record, Reserves Management, Regulatory/Legal Profile, Concentration, Recent Incident, Protocol & Operational Security, NAV Track Record, Funds Management; "-/5" when not scored; NUSD "Metric breakdown not published by Credora yet."; LBTC "Credora hasn't published a risk rating for this asset yet."), per-metric explanation text, Consensus PD (Ann.), "View on Credora" link, Ethereum Contract address with Etherscan link. Actions: Predict all the estimates above, Connect To Predict, Advanced, "Check the opportunities if you want to LP or Trade specific outcome tokens in Seer. Check it out", "Download the latest data (updated in the last 24 hours) in CSV format. Download CSV".
7. Footer: Get Help, Report a Bug, Give Feedback, App Guide, Crypto Beginner's Guide, FAQ, Telegram, X.
