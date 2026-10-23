# deep: UNOBSERVED states/flows (designers must not invent these)

Below is everything the supplied **FLOWS DRAFT** and **SCENARIO RESULTS** indicate could **not** be observed. Constraint: the data contains **no docs URL, contract address/ABI, admin URL, or product-team contact**. So “truth” is limited to: **ask product team**, **recover untruncated original crawl notes/STATE 042**, or **ask product team for the relevant contract/ABI** where on-chain behavior is involved.

## Wallet / account / funding / trade
- **Successful wallet connection / connected state / disconnect / network switch** — not captured. Reason: wallet state is ambiguous (`0x0000…dEaD` and `Connect your wallet` both visible); no successful wallet connection was captured. Truth: ask product team; wallet integration docs/contract not supplied.
- **Account menu/detail from clicking `0x0000…dEaD`** — not captured. Reason: click produced the same main market screen; no account menu/detail/wallet-state change captured. Truth: ask product team.
- **Wallet-gated trade confirmation / trade ticket / order book / buy-sell-confirm flow** — not captured. Reason: no trade ticket, order book, or funded/connected wallet state was captured. Truth: ask product team; contract/ABI is relevant but no contract address/ABI is supplied.
- **`Create trade wallet` flow/result/success/error** — not captured. Reason: controls `2 Create a trade wallet` / `Create trade wallet` are visible, but no resulting screen/dialog/state was captured. Truth: ask product team; contract/ABI if on-chain, but no contract identifier supplied.
- **`Add sUSDS` / funded-account / balance state / sUSDS-add control/result** — not captured. Reason: `3 Add sUSDS` text is visible, but no sUSDS-add control, dialog, result, or funded-account state was captured. Truth: ask product team; token/contract details would require an address/ABI not supplied.
- **Funded-account states generally** — not captured. Reason: no successful wallet connection or funded account was observed. Truth: ask product team; on-chain state would require contract/ABI not supplied.
- **Predictions upload dialog/result/error** — not captured. Reason: `No predictions loaded` and `Upload predictions` are visible, but no upload dialog/result/error was captured. Truth: ask product team.

## Profile
- **Profile panel/route content** — not captured. Reason: clicking `Profile` left the same main market screen; no profile content/panel was visible. Control count differs (`132` vs `124`) but no visible panel. Truth: ask product team; recover original crawl notes.
- **Profile editor UI/fields and unsigned profile review state** — not captured in detail. Reason: scenario says `open profile editor`, `enter display name`, `enter avatar link`, `enter social handle`, `verify unsigned profile review` were OK, but no resulting screen/state was supplied; FLOWS draft says no profile panel was captured. Truth: ask product team.
- **Profile save/submission/signing/persistence** — not captured. Reason: only “unsigned profile review” is noted; no saved/submitted/persisted state was captured. Truth: ask product team.

## Rounds / archive / search / comparison
- **Round-detail/change from `Round 3 · Originality LIVE`** — not captured. Reason: click produced the same main market screen; no round-detail/change was captured. Truth: ask product team.
- **Archive/past-round/ended-round content** — not captured. Reason: clicking `Archive` left the same live Round 3 screen; no archive content was visible. Scenario opened archive menu and `Round two originality`, but then failed `inspect archived consensus outcome`. Truth: ask product team; recover original crawl notes.
- **Archived consensus outcome inspection** — not captured. Reason: `archive-round-desktop` failed waiting for `getByPlaceholder(/Search outcomes/i)`; scenario crashed. Truth: ask product team.
- **Desktop outcome search** — not captured. Reason: `search-outcome-desktop` failed `search for consensus specs` waiting for `getByPlaceholder(/Search outcomes/i)`; scenario crashed. Truth: ask product team.
- **Mobile outcome search/select/clear/restore result states** — not captured. Reason: `search-outcome-mobile-mobile` steps were OK, but no resulting visual states/details were supplied. Truth: ask product team.
- **Repository comparison / compare predictions flow** — not captured. Reason: `compare-predictions-desktop` failed `inspect repository comparison` waiting for `getByRole('button', { name: /^REPOSITOR/`; scenario crashed. Truth: ask product team.
- **`AI Prediction Markets` self-navigation content change** — not captured. Reason: click left the same main market screen; no visible content change captured. Truth: ask product team.
- **`Refresh volume` visible result/loading/success/error** — not captured. Reason: click left the same main screen; data model only shows `GET /refresh-market-volume` status `200`, hits `2`; no UI state captured. Truth: ask product team; recover original crawl notes.
- **Second chart caption beyond `DOWN …`** — not captured. Reason: caption is truncated at `“DOWN …”`. Truth: recover original crawl notes; ask product team.
- **STATE 042 details** — not captured. Reason: `STATE 042` notes are truncated. Truth: recover original crawl notes; ask product team.

## Empty / loading / error / ended / populated states
- **Loading state** — not captured. Reason: FLOWS draft says loading/error/ended/mobile states were not captured. Truth: ask product team.
- **App error states** — not captured. Reason: no error state was captured. The scenario `FAIL`s are automation `TimeoutError`s, not captured app error UI. Truth: ask product team.
- **Ended round state** — not captured. Reason: only `LIVE` Round 3 was observed; no ended/archived round state was captured. Truth: ask product team.
- **Populated leaderboard / ranked rows / filter results / wallet search results / `Your rank` data** — not captured. Reason: `F03` shows `0 wallets` and explicitly says no ranked rows, filter actions, or `Your rank` data were captured; leaderboard scenarios report steps OK but supply no result details. Note: the `0 wallets` empty state itself was observed, so it is not unobservable. Truth: ask product team.
- **Post-upload “predictions loaded” state** — not captured. Reason: only `No predictions loaded` was observed; no post-upload state was captured. Truth: ask product team.

## Mobile / responsive-only behavior
- **Mobile visual/layout states** — not captured. Reason: FLOWS draft says all supplied captures are desktop; no mobile state was captured. Truth: ask product team.
- **Mobile leaderboard/wallet search/own-rank visual results** — not captured. Reason: `leaderboard-wallet-mobile-mobile` steps were OK, but no resulting state/details were supplied. Truth: ask product team.
- **Mobile return-to-markets navigation** — not captured. Reason: `leaderboard-wallet-mobile-mobile` failed `return to markets` waiting for `getByRole('button', { name: /^AI Predic/`; scenario crashed. Truth: ask product team.
- **Other mobile-only controls/menus/responsive behaviors for wallet, trade, profile, archive, upload** — not captured. Reason: no mobile state was captured; mobile scenario results are step statuses only. Truth: ask product team.

## Admin / creator flows
- **Admin/creator flows** — not captured. Reason: no market/round/outcome creation or management, no admin controls/states, and no upload dialog/result were observed; only public market screen and `Upload predictions` text were present. Truth: ask product team; no admin URL/docs/contract supplied.