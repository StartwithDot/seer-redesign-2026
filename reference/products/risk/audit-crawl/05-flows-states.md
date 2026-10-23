# flows states (risk; DeepSeek draft: Claude verifies against screenshots)

# Risk Product — User Flow Audit

## Evidence conventions and limits

- `[observed STATE n]` = directly captured in crawl notes / state inventory.  
- `[inferred]` = logical step implied by visible controls, hrefs, API model, or state placement; **not directly captured**.
- Desktop control inventory uses suffixed ids such as `STATE 001d`; mobile controls use `STATE 043m–050m`.
- Mobile evidence is thin: notes provide no mobile screen copy beyond controls/chart dimensions. Mobile flows are therefore mostly `[inferred]`.
- No loading, empty, error, wallet-connect prompt, transaction confirmation, or resolved-outcome UI was captured. Those flows are listed as unobservable below.

---

## A. Landing / default market view

1. Navigate `/` → “Risk Pricing Predictions” page renders for Q3 2026. `[observed STATE 001]`
2. Page shows connected/truncated wallet `0x0000...0dEa`, trading period `Until Wednesday, 30 September 2026 at 23:59 UTC`, and countdown `Ended`. `[observed STATE 001]`
3. Page shows question: “What is the yearly Probability of Default (PD) for the following DeFi assets during Q3 2026?” `[observed STATE 001]`
4. Page shows quarter tabs `Q3 2026`, `Q4 2026`, `Coming soon`; view labels `Market Estimate Risk`, `Risk bars`, `Over time`; category counts `All 33`, `ETH Based 7`, `USD Based 13`, `BTC Based 6`, `Funds Based 7`; aggregate `46.52% (Ann.) / 82.59% (Quart.)`; `Market Estimate (Ann.) 46.52%`; `0 of 33 assets edited`. `[observed STATE 001]`
5. Page shows 33 asset PD cards with `PD (Ann.)` / `PD (Quart.)`, risk labels `LOW RISK`, `MODERATE RISK`, `HIGH RISK`, `CRITICAL RISK`, and scale ticks `0%`, `2%`, `5%`, `10%`, `100%`. `[observed STATE 001]`
6. No loading skeleton/spinner, empty-state message, error banner, or wallet-connect prompt is visible in the captured default state. `[observed absence in STATE 001]`

---

## B. Onboarding / Guide overlay

1. `/` → click `Guide` → Quick Guide overlay appears. `[observed STATE 002–003; control STATE 002d/003d]`
2. Overlay provides `Beginner User Guide`, `Advanced User Guide`, and `Acquire xDAI` links plus `Close`. `[observed STATE 002–003; controls STATE 002d/003d]`
3. Click `Beginner User Guide` → external Notion guide opens. `[observed control/href STATE 002d/003d]` `[inferred external navigation]`
4. Click `Advanced User Guide` → external Notion guide opens. `[observed control/href STATE 002d/003d]` `[inferred external navigation]`
5. Click `Acquire xDAI` → external CowSwap link opens. `[observed control/href STATE 002d/003d]` `[inferred external navigation]`
6. Click `Close` → overlay dismisses back to underlying page. `[observed control STATE 002d/003d]` `[inferred result]`
7. Hover chart trigger → no tooltip or chart detail text captured. `[observed STATE 003]`

Uncertainty: STATE 002–003 are described as the Guide overlay; exact visual distinction between STATE 002 and STATE 003 is not specified.

---

## C. Account details / wallet panel

1. `/` → click `Account details` → account panel opens showing connected wallet `0x0000...0dEa`, network `Gnosis`, and `Disconnect`. `[observed STATE 004; control STATE 001d]`
2. Click wallet address `0x0000...0dEa` → external Gnosisscan address page. `[observed control/href STATE 004d]` `[inferred external navigation]`
3. Click `Disconnect` → wallet disconnects and UI would move to a disconnected/connect state. `[observed control STATE 004d]` `[inferred result; disconnected UI not captured]`
4. Initial wallet-connect / wallet-gated entry flow was not captured: no connect prompt appears in STATE 001–042; only a truncated connected address is shown. `[observed absence in STATE 001–042]`

Wallet-gating uncertainty: the product clearly has wallet context and a `Disconnect` control, but no captured state shows connection, chain switching, signature rejection, or disconnected gating.

---

## D. Email notifications / wallet signature

1. `/` → click `Email notifications` → email notifications panel opens. `[observed STATE 005; control STATE 001d]`
2. Panel offers `Sign in`; notes describe notification management as wallet-signature-based. `[observed STATE 005]`
3. Click `Sign in` → wallet signature request is expected. `[observed control STATE 005d]` `[inferred signature prompt]`
4. After signing → notification-management UI would appear. `[inferred; post-sign-in state not captured]`
5. If signature is rejected → error/cancel state would appear. `[inferred; not captured]`

---

## E. Help menu

1. `/` → click `Help` → help menu opens. `[observed STATE 006; control STATE 001d]`
2. Menu shows `Get Help`, `Report a Bug`, `Give Feedback`, `App Guide`, `Crypto Beginner's Guide`, `FAQ`. `[observed STATE 006]`
3. Click any menu item → external link opens in a new tab. `[observed menuitem/href STATE 006d]` `[inferred external navigation]`

---

## F. Theme / view-control no-change states

1. Click `Light Mode` → captured state shows no visible text/content change. `[