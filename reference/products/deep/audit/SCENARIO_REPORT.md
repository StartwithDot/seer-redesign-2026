# deep: scenario report (DeepSeek from scenario results)

# SCENARIO REPORT — `deep`

All listed scenarios report `console errors: []`.

| Scenario | Replayed flow | How far it got / UI states reached | Block |
|---|---|---|---|
| `leaderboard-wallet-desktop` | F03 View Leaderboard (desktop) | Reached `/leaderboard`. OK: open leaderboard → 1D/1W/1M/All rankings → enter wallet address → search wallet rankings → locate own rank → return to `/` markets. Revealed ranking filters and wallet-rank search states. | Not blocked. |
| `archive-round-desktop` | F07 Open Archive | Reached archive menu and round two originality. | **BLOCKED** at inspect archived consensus outcome: **unknown selector** — timeout waiting for `getByPlaceholder(/Search outcomes/i)`; scenario crashed. |
| `search-outcome-desktop` | Outcome-search flow; no dedicated entry in FLOWS DRAFT | No successful step reached. | **BLOCKED** immediately at search for consensus specs: **unknown selector** — timeout waiting for `getByPlaceholder(/Search outcomes/i)`; scenario crashed. |
| `profile-review-desktop` | F04 Open Profile | Reached profile editor: open editor → enter display name → enter avatar link → enter social handle → verify unsigned profile review. Extends F04 beyond draft’s captured no-profile-content state. | Not blocked. |
| `search-outcome-mobile-mobile` | Outcome-search flow (mobile); no dedicated draft entry; draft had no mobile states | Reached: search consensus specs → select consensus specs → clear outcome search → search ethers → select ethers series → restore complete outcome list. | Not blocked. |
| `compare-predictions-desktop` | Repository comparison; no dedicated draft flow (closest: F01 repository list) | No comparison UI reached. | **BLOCKED** at inspect repository comparison: **unknown selector** — timeout waiting for `getByRole('button', { name: /^REPOSITOR/ })`; scenario crashed. |
| `leaderboard-wallet-mobile-mobile` | F03 View Leaderboard (mobile) | Reached `/leaderboard`: open leaderboard → 1D/1W/1M/All rankings → enter wallet address → search wallet rankings → locate own rank. | **BLOCKED** at return to markets: **unknown selector** — timeout waiting for `getByRole('button', { name: /^AI Predic/ })` on `/leaderboard`; scenario crashed. |

## Blocked flows
- `archive-round-desktop` — unknown selector.
- `search-outcome-desktop` — unknown selector.
- `compare-predictions-desktop` — unknown selector.
- `leaderboard-wallet-mobile-mobile` — unknown selector.

No wallet, chain, funds, or role blockers are evidenced in the supplied scenario data.