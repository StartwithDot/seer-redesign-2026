# Build pass 6

Completed 20 items: F093, F104–F114, F120, F121, F123, F128, F140–F143. Remaining: 29.

The next incomplete dossier and wallet features require their data dependencies, so the published profile and roster items were completed alongside the UI. Email/social authentication, WalletConnect/QR, actual transaction submission, and unverified oracle/dispute links remain unchecked.

Asset dossier: canonical `/risk/asset/:id` links; preserved originating section, filters and selection; back-to-results breadcrumb; three-decimal market annual/quarterly values and editable user estimate; full 0–100% editor; Credora by RedStone grade/category/average; ordered metric scores with asset-specific hover/focus explanations and touch expansion; NUSD/LBTC missing-data treatment; consensus value from the existing row data; published Credora slugs; Ethereum contracts; copy/share with failure feedback; Gnosis market, collateral, outcome-token, factory and creation-transaction links. Saved history now fits all points inside its viewport.

Advanced LP/Trade now opens the recorded Seer market instead of an unverified search. The market provenance disclosure distinguishes saved oracle answer/arbitration state from the UI round's closed status. Condition/question exploration links are provided, but F115/F116 remain unchecked pending verified end-to-end oracle/dispute/entity coverage.

Wallet: correct array-shaped accountsChanged handling, explicit disconnected/connecting/connected/wrong-network/rejected/unavailable/error states, user-triggered Gnosis switching, guarded async account reads, local disconnect, full copyable address, Gnosisscan link, collateral/gas guidance. Notification signing uses the wallet hook, hex-encoded personal_sign, signature validation, and account-change checks. It continues to say that preferences are stored locally; delivery is not connected. No submission or confirmation is simulated. Mobile Tools exposes Guide, Help, Email, Theme and Connect/Account in an accessible sheet.

Source data: `data/credora-profiles.json` is the 32 relevant published profiles from `../products/risk/credora_api.json`; `weETH` resolves to canonical `eeth`, and LBTC has no published profile. `data/seer-market.json` is the complete saved get-market sample from `../products/risk/audit-crawl/network.json`. Existing observations remain the list/consensus source. No new ratings, market addresses or metric explanations were invented. Existing tonal asset portraits use the Design Book's allowed fallback; no arbitrary token imagery was introduced.

References: overnight/DESIGN_BOOK.md, shots/land_d6.png, src/seer-2026/seer2026.css, shared shell, Risk inventory/code, parent research protocol/rules, prefetched Risk research and BUILD_SPEC. Root docs were missing, but the referenced guidance was located in ../docs. Work stayed in src/products/risk; no commits, pushes, shared-shell edits or landing edits.

Validation:
- `npx tsc --noEmit -p src/products/risk/tsconfig.json`: clean.
- `node src/products/risk/tests/pass6.cjs`: passes 33 rendered ratings, exact roster memberships, saved market links, all originating dossier routes, preserved filters/selection, default horizon, popstate, wallet events, Gnosis switching, rejection, signature encoding, account guards, disconnect and missing-provider cases. Hook harness tests are deterministic checks, not browser verification.
- Final root `npx tsc --noEmit`: clean. An intermediate combined build encountered an Opportunity nonBlocking prop error while that folder was changing; the final root check passes. That folder was not edited by this pass.
- `npx vite build --outDir /private/tmp/risk-pass6-dist`: passes (538 modules; production bundle generated).
- Browser visual QA remains blocked: Vite listen returns EPERM at 127.0.0.1:5188; system headless Chrome exits 134. No viewport screenshots, contrast measurement or visual approval claimed. Both-theme desktop/tablet/mobile checks remain outstanding.
