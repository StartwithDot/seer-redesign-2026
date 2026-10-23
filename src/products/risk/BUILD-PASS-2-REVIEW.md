# Risk build pass 2: remaining-feature audit

Newly checked: **0**. Remaining: **9**, with 141 already checked at the start. There are fewer than 20 unchecked items. No checklist entries were changed.

## Changes

- Added a focused WalletAvailability component. The wallet chooser now exposes All wallet options, installation destinations for missing MetaMask and Trust extensions, a visible WalletConnect/QR configuration limitation, and an email/social handoff to the live Risk app. The handoff explicitly explains that drafts and sessions do not transfer. No authentication, QR session, signature or transaction is simulated.
- Guarded asynchronous wallet reads and failures by session generation. Disconnecting during account access or a network switch now prevents a late response from overwriting the disconnected session. Provider disconnect events also stop subsequent account/network events from restoring a session without an explicit connection action.
- Added regression coverage for late connection success and rejection, network-switch rejection after disconnect, stale provider events, and explicit reconnection.

## Remaining dependencies

- F095: ready/submitting/confirmed require an actual transaction adapter and published open round. Draft editing, CSV and ended states already work.
- F117/F118: email/social authentication service is absent.
- F119: injected wallets work; WalletConnect SDK and session configuration are absent. Installation links and availability explanations do not complete this feature.
- F122: signed local preferences exist; a notification authentication/delivery service is absent.
- F126: host index.html overwrites the canonical theme key from a separate preference/system choice before Risk loads. Fixing first paint requires editing outside the authorized product folder.
- F129/F130/F139: browser verification remains blocked. Vite fails to bind 127.0.0.1:5188 with EPERM, and browser-quality.cjs fails its HTTP prerequisite. Mobile and exhaustive control gates remain unchecked.

## Validation

- npx tsc --noEmit -p src/products/risk/tsconfig.json: clean.
- npx tsc --noEmit: clean.
- Existing pass6, pass7, pass8 and pass9 suites: pass.
- tests/wallet-session.cjs: pass.
- Landing reference images inspected were blank white. Landing CSS supplied the visual reference. Existing real asset portraits remain in place.
- The requested root docs files are absent from this checkout. Design Book, the available Seer Design Lab skill, Risk/shared source, checklist and existing review documentation were read.

Only Risk product files were edited. No commits or pushes.
