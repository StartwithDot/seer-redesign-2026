# Current build pass: F149 mobile navigation follow-up

Starting checklist: 149 checked, one unchecked (F149). This pass ticks zero items; one remains. Only one unchecked item exists, so there is no batch of 20 available.

Read the Design Book first, inspected landing captures d0/d3/d6 (blank white), landing CSS, Futarchy/shared shell and existing quality implementation. Root guidance is available under ../docs/ and was read. Changes stay within src/products/futarchy/; existing assets and Seer styles are retained.

Extracted the mobile disclosure behavior into useMobileNavigation. Escape now consumes the event in capture before the market workspace can interpret it as Back. Keyboard users can open at the first/last destination with Down/Up and navigate with arrows or Home/End. Tab retains normal page order and closes the disclosure when focus leaves; outside pointer/focus dismissal does not steal focus. Escape restores focus to the menu trigger. Short landscape viewports get a bounded, scrollable destination list.

Added browser regressions for navigation behavior at four widths and 240px-high landscape containment. Browser verification was attempted again: Chrome terminated with SIGABRT before a page opened. The new scenarios and visual critique passes have not run, so F149 remains unchecked.

Validation: product-scoped `npx tsc --noEmit` passed; pass 7 and pass 8 data/render checks passed; browser runner's production build passed before browser launch failed. Browser-navigation script syntax passed. These checks do not establish visual or browser sign-off.

## Previous accessibility follow-up

Starting checklist: 149 checked, one unchecked (F149). This pass ticks zero items; one remains. The requested first approximately 20 unchecked items do not exist in this checkout.

Read overnight/DESIGN_BOOK.md first, the Futarchy checklist/architecture, existing shared/product code, landing CSS and available research handoff. The referenced root rules were located under ../docs/ and read. Inspected land_d0, land_d3 and land_d6: these captures are blank white, consistent with the earlier review. Retained the existing real Seer imagery and visual language. Changes stay inside src/products/futarchy/.

## Implemented

Replaced the metric and signal-explainer tooltip implementations with one focused InfoTooltip component. Hover and focus expose descriptions; click pins/unpins them for touch; blur and outside presses dismiss them. Escape closes an explanation without activating the market Back shortcut or an enclosing modal Escape handler. Pointer users can move onto the explanation and read it. Placement follows scrolling/resizing and clamps to viewport edges. Descriptions use the existing light/dark surface and text tokens, unique accessible IDs, visible expanded state and 12px text. Removed obsolete hover-only tooltip CSS.

Added browser regression scenarios for explainer hover persistence, click toggling, keyboard dismissal, focus retention and viewport containment at 320, 390, 1024 and 1440px. These are integrated into the existing full browser runner, but have not executed successfully in this environment.

## Validation and remaining evidence

- `npx tsc --noEmit` from src/products/futarchy/: passed.
- `node src/products/futarchy/qa/run-pass8.mjs`: passed.
- `node src/products/futarchy/qa/run-pass7.mjs`: passed.
- Production browser-entry Vite build via qa/browser-build.mjs: passed.
- `node src/products/futarchy/qa/browser-pass8.mjs`: browser launch failed with SIGABRT before a page opened. No browser assertions or new screenshots completed. Required visual critique passes remain unavailable.

F149 remains unchecked because complete responsive, computed contrast, focus, touch and motion verification still needs a working browser. Do not treat production compilation or the newly added scenarios as visual sign-off.

---

# Futarchy build pass 8

F147 implemented and ticked in this pass. One item ticked; F149 is the one remaining item. Its implementation received additional accessibility, theme, responsive and motion work, but browser and visual sign-off remains unavailable.

## Pass 8 grounding

Read the Design Book first, the Seer Design Lab skill, FEATURES.md and the existing Futarchy/shared code. Inspected the seven landing screenshots; shots/land_d0.png through shots/land_d6.png are white captures, so they provide no visual detail. The existing Seer CSS, original Futarchy audit screenshots and product specification supplied the usable reference language. The root docs are absent inside poidh2 but were located and read under ../docs/. Existing product audit/spec resources are under ../products/futarchy/. This corrects the incomplete document-location note in the historical pass 7 review below.

All product changes stay in src/products/futarchy/. The existing Seer lens, architecture, branching line, cloud and prism imagery is retained. Production asset checks confirmed that those five assets and the brand mark are emitted and readable. No files in src/seer-2026/ were changed.

## Pass 8 state coverage

The validated research snapshot is an actual async module request. It has loading, error and retry states, including recovery from browsers caching rejected imports. A subscribable request resource prevents stale results after retries, cancellation and account changes. No artificial delay is used to manufacture research loading.

| List or table | Loading and failure source | Empty/recovery behavior |
| --- | --- | --- |
| Signal Board and selected preview | Research request, named per-list error boundary | Empty board and no selected signal |
| Active and closed milestones | Research request | Clear active filters, closed results and expansion |
| Organizations and organization membership | Research request | Clear name search, missing organization, empty membership |
| Related markets | Research request | Explicit no-other-signals state |
| Explorer collections, results, saved markets and records | Research request; saved/local receipt storage reads and writes | Clear search/filters, browse saved collection, storage retry |
| Entity outcomes and connected records | Research request; local receipt failures for wallet/transaction relations | No outcomes, no connections; failed local records remain errors |
| Organization leaderboard | Research request | No organizations to rank |
| Asset, position, trade and transaction tables | Async account-scoped portfolio module and wallet readiness | Dedicated empty state for each dataset |
| Activity replay and wallet activity | Research request; wallet module for My Trades and Position | Empty trades, disconnected account, historical feed |
| Collateral and redemption balances | Async wallet module; RPC, chain and online state | Unknown balance stays unavailable; genuine zero is preserved |
| Liquidity pools, contracts and lifecycle | Research request with per-list boundaries | Explicit empty pools/roles/lifecycle |

All lists remain readable from the stored snapshot while offline. A global connectivity notice describes that state; wallet-dependent lists hide stale reads and offer connect, switch network or Refresh RPC as appropriate. RPC responses are validated and read requests time out after 15 seconds. Account selection and network switch prompts are not timed out as though they were read requests. Genuine zero native balance no longer falls back to an invented balance. Portfolio, liquidity, trade and redemption examples remain labelled as research/local plans; this pass does not create a live indexer or transaction execution.

## Pass 8 quality work

Theme and scroll storage handle inaccessible browser storage; themes synchronize across tabs. Primary buttons, Create market and replay controls use white text on the same violet fill in both themes. Selected light-theme labels use the darker violet hover token. The light violet surface is #F0EDFF, giving #6C47FF labels 4.59:1 contrast. Main text, secondary and muted tokens meet 4.5:1 against their local paper/nested surfaces; primary white/violet contrast is 5.27:1. These token checks do not claim a full computed-browser contrast audit.

Added mobile labelled table rows, wrapping summary layouts, compact header treatment, bounded dialogs, visible focus and 40px touch sizing. Desktop containers now use up to 1760px. Fixed signal row/Open alignment, command combobox/listbox structure, zero-result Enter behavior, tab Home/End focus, wallet network keyboard controls, dialog stack/inert restoration and shortcut conflicts. Reduced motion updates at runtime, stops automatic activity/rotation/replay, clears Field particles and snaps rolling values while retaining timeline inspection.

## Pass 8 validation

- `npx tsc --noEmit` from src/products/futarchy/: passed.
- `node src/products/futarchy/qa/run-pass8.mjs`: passed. Request races/cancel/retry, snapshot errors, malformed RPC/timeout, zero balance, wallet readiness/storage failures and actual list/table render states.
- `node src/products/futarchy/qa/run-pass7.mjs`: passed. Existing entity graph, CSV, formats and history checks remain green.
- Futarchy-only Vite production library and browser-entry builds: passed. Wallet portfolio, research snapshot and Explorer emit as separate async chunks; all market imagery assets are readable. Builds use temporary output and disable environment-file loading.
- Edited stylesheets parse cleanly; all product source and QA files stay below 400 lines.
- Repository-wide `npx tsc --noEmit`: the earlier clean check was followed by new errors outside Futarchy in src/products/explorer/data/wallet.ts and src/products/explorer/hooks/useWallet.ts. WalletAccount literals there are missing reverseName and tokenBalances. Those files were not edited.
- `node src/products/futarchy/qa/browser-pass8.mjs`: production build passed; Chrome launch failed with SIGABRT before a page opened. This runner avoids a local listening socket by fulfilling real production assets through Playwright routing. Browser checks and screenshots did not complete.

## Remaining verification

F149 remains unchecked. Run qa/browser-pass8.mjs in an environment that permits Chrome, inspect the viewport captures in both themes at all eight widths, and complete two critique/fix passes. Actual responsive geometry, complete computed contrast, focus trapping, touch targets and runtime motion behavior have not received browser sign-off here.

## Historical pass 7 review

Implemented F141–F146, F148 and F150. Eight items ticked; two remain.

## Design grounding

Read overnight/DESIGN_BOOK.md, the Seer Design Lab skill, the existing Futarchy/shared implementation and src/seer-2026/seer2026.css. Inspected shots/land_d0.png through shots/land_d6.png. The additional entity views use Inter Tight, large restrained headings, existing market study imagery, violet for selection, white surfaces and charcoal dark surfaces. No src/seer-2026 files were changed.

The root instruction references docs/RESEARCH_PROTOCOL.md, NEXT_GEN_DESIGN_RULES.md, ui-quality-rules.md, product-identity-guide.md, coding-rules.md, handoff-project.md, resources.md, DESIGN_TEMPLATE.md and NEW_CHAT_PROMPT.md. Those files are absent from this checkout. The available Design Book and skill supplied the applicable design guidance.

## Implementation review

Entity views provide status, metadata, question, resolution actions, source warnings, outcome links and bounded connected-record lists. Chart ranges operate on stored observations; examples without history explicitly say it is unavailable. Charts provide pointer scrubbing and an accessible observation slider. Trade, activity, position and liquidity links open the corresponding workspace drawers. Entity tabs and explorer scopes are retained in permalinks.

CSV downloads export the selected market, current activity window, selected wallet dataset or filtered Explorer results. Spreadsheet formula cells are escaped; multiline content and quoted text are preserved. Wallet data exports explicitly identify examples. Copy/share includes fallback text when browser capabilities fail.

Wallet operations use real EIP-1193 requests. Request generations prevent stale RPC results after account changes or disconnects; rejection code 4001 is recognized without relying on Error instances. Failed RPC reads do not retain a stale displayed balance. Native units reflect the selected chain. Wallet focus returns to its trigger, and the background scroll is locked while open.

## Validation

- `npx tsc --noEmit -p src/products/futarchy/tsconfig.json`: passed.
- `node src/products/futarchy/qa/run-pass7.mjs`: passed. Covers 94 indexed entity renders, no dangling graph edges, reverse navigation, local receipt/wallet relations, malformed storage, unknown records, history availability, resolution sections, CSV protection and filtered export parity, canonical formatting and UTC timestamps.
- Futarchy-only Vite production library build: passed, 111 modules transformed. Output directed to a temporary directory.
- Repository-wide `npx tsc --noEmit`: blocked by errors outside this task's scope in Deep's missing ShareView and Risk's pool-history nullable type. Those files were not edited.
- Vite dev server: denied by sandbox, `listen EPERM 127.0.0.1:5188`.
- Playwright Chrome launch: terminated by sandbox before a page could open. No browser screenshots, visual parity claims or browser interaction claims are made.

## Still unchecked

F147: Added a route error/retry boundary, real lazy-loading skeleton, global offline notice and wallet RPC failure recovery. A complete state audit of every existing list/table remains, so the item is not ticked.

F149: Added responsive entity layouts, keyboard chart controls, visible focus treatment, dark-theme button contrast and wallet focus restoration. Required browser verification at 320–2560px, both themes, touch targets, focus traps, reduced motion and two visual critique/fix passes remains blocked by this environment. The item is not ticked.
