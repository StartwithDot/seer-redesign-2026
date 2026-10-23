# risk.seer.pm - Interaction audit (facts only)

Method: Playwright + Chrome, 1440x900 desktop and 390x844 mobile, run 2026-10-18. Format: ELEMENT -> ACTION -> RESULT.
Context fact: the page reads "Trading Period: Until Wednesday, 30 September 2026 at 23:59 UTC", "Countdown: Ended". Q3 2026 data is shown and all sliders and CSV functions still work. No Predict/trade submission was possible (wallet not connected; Reown modal showed "Invalid App Configuration" banner in the test browser).

Screenshots (all in /Users/leo/Documents/POIDH/products/risk/flow-shots/). Key 8:
1. welcome.png - welcome/Guide modal as first seen on load
2. 02-main.png - full page, initial idle state
3. over-time.png - Over time (TradingView lightweight-charts) with all 33 series
4. asset-dragged.png - one asset edited: aggregate changed, row header shows delta, value label above slider, market marker below
5. details-open.png - Details / Risk Panel open (Credora)
6. modal-Connect.png - Connect modal (Reown AppKit)
7. upload-csv.png - Upload CSV Predictions modal
8. mobile-top.png (plus mobile-asset-open.png, mobile-menu.png, mobile-chart.png, mobile-participate.png, mobile-details.png, mobile-full.png)
Others: dark.png, help.png, cleared.png, chip-funds.png, pill-deselect.png, agg-top/agg-home/agg-end/agg-dragged.png, expand-all.png, row-expanded.png, asset-open.png, asset-edited.png, two-edited.png, connect-to-predict.png, connect-after-edit.png, email-connect.png, modal-Email_notifications.png, modal-Guide.png, upload-good.png, upload-bad.png, tooltip-nta.png, over-time-hover/zoom/pan/dbl/axis.png.

## 1. Page load
- Page load -> immediately a modal "Quick Guide" opens (role=dialog) over a grey backdrop; same content as the header Guide button (section 2).
- Welcome modal -> Escape key -> stays open. Click on backdrop -> stays open. Click "Close" -> closes. Does not reopen after closing during same session; after page reload it does not reappear (localStorage key `onboarding-done` exists).
- URL never changes during any interaction (always https://risk.seer.pm/). No hash/query state for tabs, chips, pills, view.

## 2. Header (desktop)
- Logo "Foresight" -> link to https://risk.seer.pm/ (same tab). "Built by KLEROS" logo -> https://kleros.io/ (target _blank).
- Guide button -> opens modal "Quick Guide" with "Close" button, an infographic image (3 steps: 1 "Check our Beginner User Guide", 2 "Choose between Light and Dark Mode", 3 "Prepare your xDAI, sDAI or Foresight Credits for trading"), heading "Welcome!", text "Check our Beginner User Guide before making your first prediction (fire emoji). To trade you will need either xDAI, sDAI, or Foresight Credits on Gnosis Chain."
  - Link "Beginner User Guide" -> Notion page "Default-Risk-Prediction-Markets-Beginner-User-Guide-35da95a2cc7d80fba056c16d17e99303" (jagged-ironclad-e1b.notion.site, _blank).
  - Link "Advanced User Guide" -> Notion page "Default-Risk-Prediction-Markets-Under-the-hood-35da95a2cc7d80429390eda234554ec8" (_blank).
  - Link "Acquire xDAI" -> https://swap.cow.fi/#/1/swap/ETH/0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE?targetChainId=100 (_blank).
  - Escape and backdrop click do not close it; only "Close".
- Round avatar icon next to Connect (x~1169) -> non-button in the accessibility list (no click handler found; not in interactive element list).
- Connect button (blue) -> opens Reown AppKit modal ("UX by reown"): top banner "Invalid App Configuration" (with close X), "Email" input, "Continue With Google", social icons (X, Discord, a purple icon, GitHub, "..." more), divider "or", wallet list: "WalletConnect (QR CODE badge)", "Trust Wallet", "MetaMask", "All Wallets 140+", footer "Haven't got a wallet? Get started". Escape closes it.
- Settings-gear icon (aria-label "Email notifications") -> opens modal "Email notifications": text "Connect your wallet to subscribe to email notifications." with a "Connect" button and a (submit) control. Clicking its Connect -> opens the same Reown AppKit modal. Escape closes the email modal.
- Help icon (question mark, aria-label "Help") -> dropdown menu, all links open _blank:
  - Get Help -> https://t.me/+HrYn_tzqTGFlYTc0
  - Report a Bug -> https://github.com/kleros/futarchy-ui/issues
  - Give Feedback -> https://t.me/+HrYn_tzqTGFlYTc0
  - App Guide -> Beginner User Guide Notion page (same as above)
  - Crypto Beginner's Guide -> https://ethereum.org/en/wallets/
  - FAQ -> Beginner User Guide Notion page (same URL as App Guide)
- Sun icon (aria-label "Light Mode") -> click -> html class `light` becomes `dark`; body background rgb(250,251,252) -> rgb(27,0,63); click again -> returns to light. No reload, no URL change.
- Mobile hamburger "Open menu" -> hidden on desktop.

## 3. Page title block
- Heading "Risk Pricing Predictions"; "Trading Period: Until Wednesday, 30 September 2026 at 23:59 UTC"; "Countdown: Ended".
- Question card (SEER logo): "What is the yearly Probability of Default (PD) for the following DeFi assets during Q3 2026?" and sub-line "What is the probability? Estimate the risk level of the following protocols."
- "Default (PD)" (dotted underline, cursor-help, role=button, with ? icon) -> hover, focus, click, Enter -> no tooltip or DOM change observed.

## 4. Quarter tabs
- Q3 2026 -> active (underline); click -> no change.
- Q4 2026 + "Coming soon" label -> disabled button; click does nothing.

## 5. "Market Estimate Risk" section: view tabs, chips, pills
- View toggle "Risk bars" (default, aria-pressed=true) / "Over time" (aria-pressed=false). Click Over time -> bar chart replaced by canvas time-series chart; pressed state swaps. Pills/chips remain and keep their selection. Mobile: both toggle buttons show icon only (aria-label/title keep names).
- Group chips (aria-pressed): All 33, ETH Based 7 (blue dot), USD Based 13 (green), BTC Based 6 (orange), Funds Based 7 (purple).
  - Chip click -> selection REPLACED by exactly that group's pills (not additive); the chip becomes pressed. E.g. All -> ETH Based: bars 33 -> 7; USD: 13; BTC: 6; Funds: 7.
  - "All" -> all 33 pills selected and All pressed.
  - Deselecting one pill after a group chip -> chip loses pressed state, remaining pills stay (e.g. ETH group minus weETH = 6 bars).
- 33 ticker pills in order: weETH, stETH, ETH+, bsdETH, rETH, pufETH, avETH | PYUSD, RLUSD, USDC, USD1, USDS, USDT, RUSD, USDF, avUSD, NUSD, iUSD, satUSD+, USDO | BTCB, solvBTC, tBTC, cbBTC, LBTC, UBTC | GACLO-1, BUIDL-I, JAAA, JTRSY, mF-ONE, STAC, U. Pill is filled in its group color when selected, outline grey when not.
  - Pill click -> toggles that asset in the chart (bar removed/added); "All" chip loses pressed state if not all 33 selected.
  - From empty state, clicking a pill (e.g. USDC) selects only it; further pills add (USDC, USDT -> 2 bars).
- "Clear all" (last pill; shown only when at least one pill selected) -> all pills deselected, all chips unpressed, button text becomes "Select all", chart area shows dashed empty box "No assets selected - pick a category or asset above to plot it.", and the green aggregate strip below the chart disappears. "Select all" -> restores 33 (equal to All).
- Risk bars view: one horizontal bar per selected asset in pill order; left asset name; right of bar "PD (Ann.): x%" (bold) and "PD (Quart.): y%" (grey, "<0.01%" when below). Bar length uses non-linear x scale with dashed gridlines; bar gradient blue. Hover over bars -> no tooltip/diff. Below bars: risk legend gauge (0%, 2%, 5%, 10%, 100% ticks; bands "LOW RISK" green check, "MODERATE RISK" yellow !, "HIGH RISK" orange !, "CRITICAL RISK" red x).
- Aggregate strip (below chart, green): shield icon, "46.52% (Ann.)", "82.59% (Quart.)", right: "Chance that no listed asset defaults > No to All". Clicking "No to All" text in this strip -> nothing changes (static span). Strip value is the market value; does not change with user edits and does not change with pill selection.

## 6. Over time view (canvas, TradingView lightweight-charts; "TV" logo bottom-left)
- Series: one line per selected pill in group colors; each series has a dotted horizontal price line to the right axis and a right-axis label (colored tag "ASSET" + value, e.g. "mF-ONE 1.92%", "cbBTC 0.04%") at the latest value, sorted by value (labels overlap in dense region near 0.1-0.5%).
- X axis: dates "13 17 21 25 Sep 5 9 13 17 21 25 29" (about Aug 13 to Sep 30 2026); lines flat over most of the range with small steps around Aug 19-20 and a step near Aug 15.
- Hover on plot -> vertical dashed crosshair line, dot at every series at that x, date label on the x axis (e.g. "02 Sep '26 18:30:00"), horizontal dashed crosshair with black value label on the right axis (e.g. "7.12%"). No tooltip panel and no DOM text change.
- Mouse wheel on chart -> zooms horizontally (visible range changes, page does not scroll). Left-drag -> pans. Double-click -> no reset. Click -> nothing. Hover on right axis -> only crosshair label.
- No legend component and no time-range buttons exist (no 1D/1W/ALL controls). Legend equals the right-axis labels and the pills above.
- Pills/chips filter the series live (same as Risk bars). Clear all -> same empty message.

## 7. Participate section
- Heading "Participate"; card "Set estimates for the protocols below: You can choose how many protocols you want to predict. Note that the same capital can be used to predict on all protocols at once."
- "Upload CSV Predictions" button -> modal "Upload CSV Predictions": label "Required CSV File", code box showing "asset,probability / LBTC,55% / USDF,30% / ...", text "Each row represents a prediction for a protocol's score in the Gnosis ecosystem.", "Download CSV Template" button, file drop zone (aria-label "DropZone"; hidden input accept=".csv"), "Close", "Load Predictions".
  - "Download CSV Template" -> downloads `risk-pricing-predictions-<Day, DD Mon YYYY HH_MM_SS GMT>.csv`; header `asset,probability`, 34 rows: 33 assets (weETH,stETH,ETH+,bsdETH,rETH,pufETH,PYUSD,RLUSD,USDC,USD1,USDS,USDT,BTCB,solvBTC,tBTC,cbBTC,LBTC,UBTC,GACLO-1,BUIDL-I,JAAA,JTRSY,mF-ONE,STAC,RUSD,USDF,avUSD,NUSD,iUSD,satUSD+,avETH,U,USDO) with decimal fractions (e.g. weETH,0.0009108200305935066) plus final row `No To All,0.46519598216646624`. Values = current market estimates.
  - Selecting a file -> file name appears in the drop zone (no validation message shown for a wrong-format file `foo,bar`).
  - "Load Predictions" with `asset,probability / LBTC,55% / USDF,30%` -> modal closes; "0 of 33" becomes "2 of 33 assets edited"; aggregate 46.52% -> 17.49% (Ann.), 82.59% -> 64.67% (Quart.), delta "29.03pp"; ("Reset", "Reset Predictions", "Export Predictions" appear); BTC Based and Funds Based/USD groups show "1 edited" badges. Percent strings with % parsed.
- Sticky aggregate card "NO TO ALL" (green dot; "?" help; "chance no listed asset defaults"; large "46.52% (Ann.)" green, "82.59% (Quart.)" grey; slider 0-100; footer "Market Estimate (Ann.) 46.52%" and "0 of 33 assets edited"). The card sticks to the top of the viewport while scrolling the asset list (desktop and mobile).
  - Help "?" hover -> tooltip: "The market's current consensus on the annualized probability that none of the listed assets default, implied by current trading prices. This slider is tied to the asset sliders: moving it rescales every asset's probability of default proportionally. Raise it and all risks fall; lower it and all risks rise."
  - Slider (input range 0-100, step 0.0001, aria-valuetext "46.52") keyboard: ArrowLeft one step -> text "<0.01pp" delta appears, "33 of 33 assets edited", "Reset" link appears, each group shows "7 edited/13 edited/6 edited/7 edited", buttons "Reset Predictions" and "Export Predictions" appear. PageDown -> 36.52% (Ann.), 77.74% (Quart.), "10.00pp" (PageUp/Down = 10). Home -> 0% (Ann.), 0% (Quart.), 46.52pp. End -> 100.00% (Ann.), 100.00% (Quart.), 53.48pp.
  - Mouse drag from 46.52 to ~66% -> 66.25% (Ann.) 90.22% (Quart.) with green up-arrow "19.73pp"; every asset row changes (e.g. weETH 0.09% -> 0.05% with green down-arrow "0.04pp"; avETH 12.58% -> 6.98%; USDF 15.80% -> 8.84%); "33 of 33 assets edited". Raising "no default" lowers all PDs proportionally. Delta arrow: green up when aggregate rises, red down when it falls.
  - "Reset" (right of edited count) -> restores 46.52% / 82.59%, "0 of 33 assets edited", removes delta, Reset/Reset Predictions/Export Predictions, group badges.
- "Expand all" (link right of card) -> expands the four group headers (ETH Based 7, USD Based 13, BTC Based 6, Funds Based 7) to list asset rows (each row collapsed with "+"); label becomes "Collapse all" (collapses groups). Group header click toggles that group (arrow icon up/down). Group header shows count (grey) and, when edited, blue badge "N edited".
- Asset row (collapsed): colored dot (group), asset name, market PD (Ann.) e.g. "0.09%", small grey minus-circle icon (status; not clickable), "+" icon. Hover -> light blue row highlight. Click row -> expands (icon becomes "-").
- Asset row (expanded, unedited):
  - "Market PD (Ann.)" label with "?" tooltip: "The market's current consensus on the annualized probability this asset defaults, implied by current trading prices."
  - Green tag with market value e.g. "0.091%" above the slider and a black vertical tick at the market position on the track; slider handle sits at the market position (weETH input value 1.8888/100, aria-valuetext "1.889"; scale is non-linear: aggregate 46.52 vs asset 0.091% at 1.889, 0.62% at 10.46, 12.58% at 56.52, 15.80% at 61.14).
  - Risk gauge below: 0%, 2%, 5%, 10%, 100% with LOW/MODERATE/HIGH/CRITICAL RISK labels and icons (static, no marker).
  - "Details" accordion (collapsed, "+").
- Asset slider moved (keyboard ArrowRight once, or drag): row header changes at once: market value replaced by user value in bold (e.g. "0.53%") followed by delta arrow + "pp" (red up arrow "0.44pp" when PD raised vs market; green down arrow when lowered; "<0.01pp" for tiny), grey minus icon becomes green check-circle. Bold value "0.533%" appears above the handle; green market tag "0.091%" with "Market PD (Ann.)" label moves BELOW the slider. Aggregate card updates: "46.31% (Ann.) 82.50% (Quart.)" and red down arrow "0.21pp" (higher asset PD lowers the aggregate), "1 of 33 assets edited", "Reset" appears; group header badge "1 edited"; bottom buttons "Reset Predictions" and "Export Predictions" appear.
  - Keyboard: ArrowRight small step; PageUp raised weETH to 9.97% (+9.87pp), PageDown lowered stETH to "0%" (0.08pp). Slider range also reaches 100.00% (aggregate then 0%, 46.52pp).
  - Editing one asset to 100% -> aggregate 0% (Ann.) 0% (Quart.), 46.52pp.
  - Per-row minus/check icon click -> no effect (not a reset). There is no per-asset reset/remove control; only aggregate "Reset" and bottom "Reset Predictions" (resets all, no confirmation, no dialog).
  - Editing in the Risk bars/Over time charts: charts unaffected (show market values only).
- Details accordion (click) -> opens "Risk Panel" card: title "Risk Panel", "credora by RedStone" logo link (https://app.credora.network, text "Credora - data provider"), big letter grade (weETH "A+"), category title (e.g. "Derivative - Liquid Restaking"), "Avg. risk score: 4.57"; 8 sub-score tiles, each "x/5" + label + "?" icon: Asset Quality, Protocol Security, Governance, Peg Track Record, Reserves Management, Regulatory/Legal Profile, Concentration, Recent Incident (weETH: 4.6, 4.3, 4.5, 4.8, 4.8, "-", 4, 5; some assets have 7 tiles/other labels, e.g. U has "Protocol & Operational Security"); "0.09%" with label "Consensus PD (Ann.)"; link "View on Credora" -> https://app.credora.network/assets/<slug> (eeth, steth, eth+, bsdeth, reth, pufeth, aveth, pyusd, rlusd, usdc, usd1, usds, usdt, rusd, usdf, avusd, nusd, iusd, ...), "Ethereum Contract" with shortened address link (e.g. 0x35fa16...118ac2 -> https://etherscan.io/address/<full address>, _blank).
  - Each sub-score "?" hover -> tooltip with a long asset-specific paragraph (weETH: Asset Quality text begins "eETH is fully backed 1:1 by native ETH staked...", Protocol Security "eETH is a rebasing ERC-20 of modest complexity ... 11 audits across 8 independent firms ...", Governance "Semi-centralized. Control splits across two Safe multisigs: 6-of-10 Upgrade Admin ...", Peg Track Record "eETH targets a 1:1 claim on pooled ETH ... volatility ~2.47% ...", Reserves "All backing is held as ETH staked on the Ethereum Beacon Chain ...", Regulatory "No entity holds reserves on behalf of holders ...", Concentration "Holder concentration is low on a look-through basis ... ~160,000 holder addresses ...", Recent Incident "No exploit, fund loss, or smart contract vulnerability ... past six months ...").
  - "Consensus PD (Ann.)" equals the market PD shown in the row (e.g. weETH 0.09%).
- "Reset Predictions" (appears only when edits exist) -> all sliders back to market values, "0 of 33 assets edited", buttons disappear. No dialog.
- "Export Predictions" (only with edits) -> downloads `risk-pricing-predictions-<date GMT>.csv`, same format as template but with edited values (e.g. weETH,0.09965...) and last row `No To All,<edited aggregate>` (34 rows).
- "Predict all the estimates above" (text label) and "Connect To Predict" (blue button): enabled in every state observed (initial, after asset edit, after aggregate edit, after CSV load); never disabled; label never changes (wallet not connected). Click -> opens the same Reown AppKit modal as header Connect (same with 0 edits and with edits). No other state (approve, predict, ready-to-submit) could be reached without a wallet.
- "Advanced" (heading, not a button/modal): text "Check the opportunities if you want to LP or Trade specific outcome tokens in Seer. Check it out" -> link "Check it out" -> https://app.seer.pm/markets/100/0xc84786B06390F11dED0DD362E27Fc881B540e6F2 (_blank, noopener).
- "Download CSV" (footer line "Download the latest data (updated in the last 24 hours) in CSV format.") -> downloads `risk-pricing-predictions-<Day, DD Mon YYYY HH_MM_SS GMT>.csv`, header `asset,probability`, 34 rows (same as template, market values).

## 8. Footer
- "Secured by Kleros" -> https://kleros.io; Telegram icon -> https://t.me/+HrYn_tzqTGFlYTc0; X icon -> https://x.com/kleros_io; GitHub icon -> https://github.com/kleros/futarchy-ui (all _blank).

## 9. Mobile (390x844)
- No horizontal overflow (scrollWidth 390).
- Header: logo + Kleros logo + hamburger "Open menu". Hamburger -> dropdown panel: blue "Connect" button, then rows "Guide", "Help", "Email notifications", "Dark Mode"; page behind blurred/dimmed. (Desktop's separate Guide/Connect/gear/help/sun controls are collapsed into this menu.)
- Title block stacks: heading, Trading Period (label and value on two lines), Countdown, question card with SEER logo above text.
- "Market Estimate Risk" heading with view toggle shown as two icons only (no "Risk bars"/"Over time" text). Group chips wrap into 3 rows; pills wrap; bar chart shows asset name left, PD text right of bar, narrower gauge with the same legend.
- Aggregate green strip stacks: score, then "Chance that no listed asset defaults > No to All" on a second line.
- Participate: card text wraps; Upload CSV Predictions button; sticky aggregate card keeps ("NO TO ALL", value row, slider, "Market Estimate (Ann.) 46.52%" and "0 of 33 assets edited" in two columns). Rows full width; expanded row slider "Market PD (Ann.)" label slightly cut at left edge; "Details" full width.
- All functions (chips, pills, sliders, Details, CSV) present; nothing hidden besides the header nav and view-toggle labels.

## State machine of the prediction flow
States (observed):
1. IDLE (page load, welcome modal blocks interaction until "Close"): all sliders at market values; "0 of 33 assets edited"; no Reset/Reset Predictions/Export Predictions; "Connect To Predict" visible.
2. EDITING-ASSET: entered by moving any asset slider (keyboard or drag) or loading a CSV. Edited count = number of assets whose value differs from market ("1 of 33"... ). Row header shows user value + delta pp + green check icon; group badge "N edited"; aggregate card recomputes ("No default" chance = product of (1 - PD) per asset, quarterly = 4th root) with delta; "Reset", "Reset Predictions", "Export Predictions" appear. Assets can be edited independently; count grows per asset touched.
3. EDITING-AGGREGATE: entered by moving the aggregate slider (any step). All 33 assets become edited ("33 of 33"); all asset PDs rescale proportionally; aggregate delta shows green up/red down arrow. Touching an individual asset afterwards changes aggregate again.
4. RESET: aggregate "Reset" or "Reset Predictions" -> back to IDLE (no confirmation).
5. CSV-LOADED: after Upload -> Load Predictions -> same as EDITING-ASSET for the rows in the file (count = rows applied; aggregate recomputed).
6. EXPORTED: "Export Predictions" -> downloads CSV of current values; state unchanged.
7. WALLET CONNECT: "Connect" (header, Email modal, or "Connect To Predict") -> Reown AppKit modal (email/social/WalletConnect/Trust/MetaMask/All Wallets); in the test session it showed "Invalid App Configuration"; page state (edits) unchanged underneath.
8. READY TO PREDICT / SUBMITTING / CONFIRMED: not reachable without a connected wallet; the button label stays "Connect To Predict" in all unconnected states. Trading period shows "Ended".
- Persistent: no state is stored in URL; edits are lost on reload (not observed stored; localStorage only holds appkit/onboarding keys).

## Information inventory
Per page:
- Title "Risk Pricing Predictions"; trading period end date/time (UTC); countdown ("Ended"); question text (yearly Probability of Default during Q3 2026); quarter tabs (Q3 2026, Q4 2026 coming soon); view toggle; group chips with counts (33/7/13/6/7); 33 pills; risk-band legend (LOW 0-2%, MODERATE 2-5%, HIGH 5-10%, CRITICAL 10-100%; ticks 0,2,5,10,100%); aggregate "chance that no listed asset defaults": 46.52% annual, 82.59% quarterly; "Market Estimate (Ann.) 46.52%"; assets-edited counter "x of 33"; per-group "N edited"; user aggregate + delta in pp; CSV format hints and template; Advanced LP/Trade link; Download CSV note ("updated in the last 24 hours"); footer (Kleros, Telegram, X, GitHub); header Guide/Help/Email notification/theme/Connect.
Per asset (collapsed): group color dot, ticker, market PD annual (2 decimals), status icon (minus/check), expand icon; when edited: user PD, delta pp with direction arrow.
Per asset (Risk bars): ticker, PD (Ann.), PD (Quart.) (market, 2 decimals, "<0.01%").
Per asset (expanded): "Market PD (Ann.)" with 3-decimal value (e.g. 0.091%); user slider value (3 decimals) when edited; risk gauge; Details.
Per asset (Details / Risk Panel): Credora letter grade (e.g. A+, A-, B+), category (e.g. Derivative - Liquid Restaking / Liquid Staking / Index), average risk score, 7-8 sub-scores out of 5 with per-score explanatory tooltip text, Consensus PD (Ann.), Credora link, contract address (Etherscan) link.
Per asset market values (Ann. / Quart.): weETH 0.09/0.02, stETH 0.08/0.02, ETH+ 0.46/0.12, bsdETH 0.62/0.16, rETH 0.24/0.06, pufETH 0.29/0.07, avETH 12.58/3.30, PYUSD 0.06/0.02, RLUSD 0.05/0.01, USDC 0.04/<0.01, USD1 0.28/0.07, USDS 0.48/0.12, USDT 0.40/0.10, RUSD 5.51/1.41, USDF 15.80/4.21, avUSD 9.71/2.52, NUSD 7.12/1.83, iUSD 3.02/0.76, satUSD+ 2.43/0.61, USDO 2.07/0.52, BTCB 0.77/0.19, solvBTC 2.27/0.57, tBTC 0.26/0.07, cbBTC 0.04/<0.01, LBTC 0.48/0.12, UBTC 2.01/0.51, GACLO-1 0.77/0.19, BUIDL-I 0.17/0.04, JAAA 0.33/0.08, JTRSY 0.21/0.05, mF-ONE 1.92/0.48, STAC 0.25/0.06, U 2.33/0.59.
Over time: per-asset history lines (about Aug 13 - Sep 30 2026), crosshair date/time (with seconds) and value, last value per series on right axis.
Not shown anywhere: user's token balance, trade size/amount input, cost/payout, fees, liquidity, volume, per-asset "Your estimate vs market" textual comparison beyond delta pp, any per-asset reset, any confirmation step.
