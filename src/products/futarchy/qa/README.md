# Futarchy pass 8 checks

Run from the project root:

```sh
node src/products/futarchy/qa/run-pass8.mjs
node src/products/futarchy/qa/run-pass7.mjs
npx tsc --noEmit -p src/products/futarchy/tsconfig.json
node src/products/futarchy/qa/browser-pass8.mjs
```

`run-pass8.mjs` bundles the actual data and components into a temporary runner. It verifies request races, cancellation, failures and retry, snapshot validation, read RPC timeouts, malformed RPC responses, genuine zero native balances, wallet readiness, storage read/write recovery and rendered list states. Server rendering checks the home, routes, Explorer, wallet tables and gate markup; it does not prove browser interactions.

`browser-pass8.mjs` builds the real Futarchy Page, styles, font and imagery into a temporary folder. Playwright fulfills requests from that local production output, avoiding the sandbox restriction on listening sockets. It never reads environment files or invokes a real wallet. Its injected EIP-1193 test provider accepts account/read/network methods and rejects all signing and transaction methods.

The browser runner checks both themes at 320, 360, 390, 768, 1024, 1440, 1920 and 2560px; target size, selected-label contrast, overflow, table labels and control overlaps; drawer focus trapping and restoration; empty result recovery, bookmarks, palette keyboard behavior, runtime reduced motion, RPC failure/recovery and offline wallet gates. Additional tooltip scenarios cover hover persistence, click toggling, Escape dismissal, focus retention and viewport containment. It also holds and rejects a real research chunk request to exercise loading and retry. Viewport-sized screenshots are retained in the temporary directory printed by the runner. Inspect those captures and perform two critique/fix passes before marking F149 complete. The script itself is not visual sign-off.

Mobile navigation scenarios at 320, 390, 768 and 1000px cover arrow-key opening and cycling, Home/End, Escape without triggering workspace Back, focus restoration, Tab/outside-focus dismissal, actual Explorer navigation and scrollable destination access in a 240px-high viewport. These scenarios are implemented in `browser-navigation.mjs` and run as part of the browser suite; they have not completed in this sandbox.

Chrome defaults to `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`. Set `FUTARCHY_QA_CHROME` to an existing Chromium executable on another machine. On this sandbox, Chrome exits with SIGABRT before a page opens; no browser checks or screenshots have completed.
