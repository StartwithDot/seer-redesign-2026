# Deep H

An isolated redesign of the original Deep application from StartwithDot/seer-redesign, revision cebb9ad60ce06ceae9e33d6048d1fe446f77eb4f. The original fixtures, routes and mock financial behavior are retained. EF is local to this package in vendor/ef. No other workspace package is required.

From this folder:

```powershell
npm install --workspaces=false --no-audit --no-fund
npm run build
npm run preview -- --host 127.0.0.1 --port 5203 --strictPort
```

Preview: http://127.0.0.1:5203/#/

```powershell
# Complete copied registrations, including the original control sweeps and screenshots.
$env:PREVIEW_URL='http://127.0.0.1:5203'
$env:DEEP_WORKERS='4'
npm run e2e

# The original serial orchestrator is also retained.
npm run e2e:serial

# Additional semantic and visual checks.
$env:DEEP_URL='http://127.0.0.1:5203'
node checks/verify.mjs
node checks/menu-matrix.mjs
node checks/shared-header.mjs
node checks/dead-controls.mjs
node checks/scroll-surfaces.mjs
node checks/qa.mjs
node checks/states.mjs
node checks/network.mjs
# Run performance separately, after other browser workloads stop.
node checks/perf.mjs
node checks/report.mjs
```

The harness uses installed Windows Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`. Set DEEP_CHROME to use another installed executable. Browser/version, viewport and theme evidence are recorded in the reports. Other browsers/platforms are not claimed.

The fixture-byte comparison defaults to this run's retrieved source checkout. On another machine, set DEEP_SOURCE to the original repository's apps/deep directory before running checks/verify.mjs or checks/parity.mjs. The report records all 16 SHA-256 comparisons.

`npm run e2e` imports every copied test registration and assertion, with independent contexts and failure artifacts. PREVIEW_URL or DEEP_URL targets an existing production preview. Without either, it builds and starts its own preview. DEEP_SUITE_NAME selects the report folder. DEEP_RESUME=1 continues a matching report checkpoint and retains prior failed attempts. DEEP_TRACE=1 enables expensive tracing; by default failure HTML, screenshot and errors are saved without tracing every dense-list reload. DEEP_TEST_FILTER is for explicitly reported affected-check reruns; the complete run has no filter.

See DESIGN_SYSTEM.md and REDESIGN_NOTES.md for the design and source discrepancies. See reports/VERIFICATION.md for measured results, exact evidence locations and remaining gaps. The large initial fixture bundle still produces Vite's chunk-size warning. Funding, conversion, wallet creation and strategy execution are the source's local mock behavior.
