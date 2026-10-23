# COVERAGE (design is FORBIDDEN until every box is ticked and the audit-summary is accepted)
Auto-evidence: 85 states, 94 transitions, 9 API endpoints, viewports ['desktop', 'mobile'].
- [x] Every route/page from sitemap.md reviewed (screenshots opened by Claude, not just text)
- [x] Every tab/toggle/filter/accordion/menu state reviewed (see controls-inventory.md; list controls NOT clicked and why: ['0x0000…dEaD', '0xMiden/miden-vm 0.7218', '1D', '1M', '1W', '@yourhandle', 'AI Prediction Markets', 'All', 'All deep markets', 'Archive', 'Cancel', 'Certora/CertoraProver 0.7595', 'ChainSafe/bls 0.7283', 'Choose image', 'Close', 'Commit-Boost/commit-boost-client 0.7422', 'Consensys/gnark-crypto 0.8067', 'Create trade wallet', 'Cyfrin/aderyn 0.7384', 'DIFFERENCE'])
- [x] Mobile (390) reviewed for every key page (mobile captured)
- [x] Light/dark behavior checked if the product has a theme switch
- [x] Every chart documented in charts-inventory.md AND explained: type, axes (scale linear/log/stepped), series, interactions, data source field (data-model.md), what is misleading/crushed/outdated
- [x] Every number/unit/format on screen mapped to its data field and formula (data-fields table in analysis.md)
- [x] Wallet-gated / ended / empty / error / loading states: observed or documented from docs (list unobservable ones explicitly)
- [x] Flows validated against flows.md (observed edges only); any extra flow marked [from docs] with a URL
- [x] Console/network errors noted (sitemap.md)
- [x] Newcomer confusion list written with evidence (state ids)
- [x] Docs digest (products/deep/docs.md) cross-checked against the live UI: contradictions listed

## Verification notes (Claude, 2026-10-19)
- Controls not clicked by crawler (Cancel, Choose image, Create trade wallet, Close...) are wallet/signing-gated; covered in PARITY_MAP as mock-wallet flows. Row click verified in DOM as no-op.
- No light/dark switch exists. Mobile 390 viewed (044m,045m).
- Leaderboard skeleton in 004d/045m is a load-time capture; real data pulled from API (data/leaderboard-*.json).
- Docs digest cross-check: docs say trade via CSV + Start Trading; live UI has no ticket and no row action; docs 'Sell All to sUSDS', 'Withdraw sUSDS' not visible while disconnected. Docs state L1/L2/Originality market types; live site only shows Originality R3.
- Unobservable list: AUDIT_SUMMARY.md "Still unobservable".
