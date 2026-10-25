# futarchy-dev: the Futarchy redesign "Parallel Lanes" (snapshot, 2026-10-25)
- app/ is the Vite + React 19 + TS app (copy of apps/futarchy2). packages/ef is the EF token package it imports (@seer/ef). design-notes/ has the design brief, the 9 build passes (prompts and logs), the lint tools.
- Run: `cd /Users/leo/Documents/POIDH/poidh2/futarchy-dev && npm install && npm run dev -- --host` (Vite prints the URL). Tests: `npm run e2e` (32 behaviour tests; all 32 passed on this snapshot). The live working copy in the main project is apps/futarchy2 (dev server http://localhost:5301 while it runs).
- Palette is strict EF (violet + neutrals). PASS world = EF violet solid line, FAIL world = tint-white dashed line.
