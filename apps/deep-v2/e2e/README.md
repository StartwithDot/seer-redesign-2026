Run from the repository root:

```
npm run e2e -w apps/deep
node apps/deep/e2e/shots.mjs
```

Both commands build and start Vite preview on a free loopback port, then launch system Chrome. `PREVIEW_URL=https://… npm run e2e -w apps/deep` skips the build and local preview. The screenshot runner also accepts `node apps/deep/e2e/shots.mjs <url> [width height prefix]` for viewport-by-viewport captures of an existing preview.

All writes stay under `apps/deep/e2e/`. `out/` contains real viewport PNGs and build/run logs. `test-results/` contains the result table, JSON records, unknown observed literals, coverage, per-viewport control inventories, and failure HTML/console/trace artifacts. A harness failure writes incomplete coverage and exits 1. It never manufactures screenshots or passes for unexecuted tests.

The registered suite covers P01–P31, L01–L08, D01, M01, X01–X03, navigation and flow checks, all 24 UI-law checks, and screenshot states at 1440×900, 1920×1080, and 390×844. Browser context is per viewport, with a new page, routes, error capture and trace per test. Real JSON in `src/data/real/` is the only market/leaderboard fixture source. CSVs contain three existing repository names; intentionally invalid rows only appear in negative upload fixtures.

Known specification conflicts, retained for review:

* `design.md` §2b replaces the original Split/Outcomes tables with one repository list and the leaderboard table with wallet dots. Legacy assertions requiring two 98-row lists, table-only fields, the old setup sheet, or table row geometry are still explicit failures if absent; SVG wallet dots expose genuine source values and are also checked through the selected wallet inspector.
* The plan requires 98 **text labels** in `canvas.__labels`, whereas the chart design limits direct labels to six plus an isolated repository to prevent collisions. The suite does not create invisible or fake label records. Actual time-series visibility has a separate `canvas.__series` hook.
* P25 asks exported UP+DOWN to sum to 1, while design/data parity requires the independent captured market legs, whose sum ranges around 0.81–1.03. The CSV test compares every number against the real capture and records its sum range; it never normalizes captured values.
* The valid CSV example with an unknown repository conflicts with the explicit unknown-repository parse-error example. Unknown repository names are tested as errors, retaining already loaded predictions.
* API fixtures are currently imported into the app. The route stubs do not claim bundled data caused a network call. Refresh call counts are asserted; loading/empty/error API tests fail if the app cannot reach the stubbed state.
* Tour, search palette and some trade-column contracts describe controls not present in the current app. Their assertions remain present rather than being marked passed based on DOM absence.

Verification in the restricted workspace: local loopback binding returned `listen EPERM: operation not permitted 127.0.0.1`. Consequently the browser suite and screenshots require execution in an environment that permits preview and Chrome. See the generated coverage report for all unexecuted cases.
