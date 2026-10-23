# Risk remaining-feature build pass

Newly ticked: 0. Remaining: 9. The existing inventory already had 141 of 150 features checked, so there were fewer than the requested approximately 20 unchecked features. No incomplete integration or unverified browser quality gate was marked complete.

Implemented inside Risk:
- Notification preferences now have a focused data adapter and state hook. Stored records validate account, email, timestamp and signature shape. Duplicate signing is blocked; account changes, drawer closure, unmount and cross-tab changes invalidate pending requests. Failed writes/removals show errors. The signed message explicitly states that local storage does not subscribe the user to email delivery. The input stays fixed during signing and the delivery limitation is visible before the action.
- Prediction availability and baseline lifecycle recovery share one data-layer policy. Header wallet opening participates in draft status, cancellation restores the correct state, and resetting an asset/aggregate to baseline clears stale editing status. Connected-account and closed-round transitions do not loop. No transaction or confirmation is simulated.
- Modal sheets respond to the visual viewport when a mobile software keyboard opens. Visible height and offset track resize/scroll with one scheduled frame; focused fields scroll into view; listeners, frames and CSS properties are removed on close. Mobile inputs use 16px type to avoid iOS focus zoom. The mobile prediction panel has one primary action in its fixed action area, with the bottom navigation safe-area height accounted for.

Outstanding checklist dependencies:
- F095: real ready/submitting/confirmed lifecycle requires a transaction adapter and an open published round.
- F117/F118: email/social sign-in requires a configured authentication service.
- F119: injected wallets work; WalletConnect QR/session support needs its SDK and public project configuration.
- F122: real notification sign-in and management requires a notification service; signed local preferences do not fulfill this feature.
- F126: the host index.html reads seer-theme-preference/system and overwrites seer-theme before product code loads. Correct pre-paint canonical-key behavior requires a host bootstrap change outside the authorized Risk folder.
- F129/F130/F139: mobile composition, sizing and controls have implementation coverage, but real viewport, overflow, keyboard and exhaustive dead-control browser verification remain outstanding.

Verification:
- Root `npx tsc --noEmit`: clean.
- Risk `npx tsc --noEmit -p src/products/risk/tsconfig.json`: clean.
- `node src/products/risk/tests/pass6.cjs`, `pass7.cjs`, `pass8.cjs`, `pass9.cjs`: pass. New tests cover preference validation, signature races, duplicate requests, close/account cancellation, storage errors, cross-tab removal, shared submission gates, header-wallet state transitions, visual viewport sizing, focused fields and complete cleanup. These are deterministic component/hook checks, not browser visual verification.
- `npx vite build --outDir /private/tmp/risk-pass9-dist`: passes; existing application bundle-size warning remains.
- Browser checks attempted: Vite cannot bind 127.0.0.1:5188 (EPERM); Playwright Chrome exits SIGABRT before creating a page. The existing browser quality suite cannot reach a server. No browser captures or visual approval claimed.
- All added/edited code files are below 400 lines.

Read Design Book first; inspected all seven land_d screenshots (blank white captures), landing CSS, parent repository research/quality/identity/coding/start/handoff/resource/template guidance, Risk research readiness and requirements, recorded flows, prior build reviews, Risk and shared implementation. Existing real token artwork and permitted initial fallbacks are retained. Only src/products/risk was edited; no landing/shared/root changes, commits or pushes.
