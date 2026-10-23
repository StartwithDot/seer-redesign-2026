# Risk Pricing: handoff (current, 2026-10-20)
App: apps/risk (Vite + React 19 + TS). Dev: `npm run dev -w apps/risk` (port 5181 via `npx vite --port 5181`). Build: `npm run build -w apps/risk`. E2E: `npm run e2e -w apps/risk` (DeepSeek-written cases in e2e/cases.mjs + harness e2e/run.mjs; ONLY="name" runs one). Nothing committed or deployed.
Design: approved hero mock products/risk/mock/hero.html -> ported. Header name tabs (Overview, Assets, Over time, Participate), terrain graph + picker, pinned Participate panel on the right (only its list scrolls), Assets tile gallery, Credora drawer, Over time ridge chart, real live behaviours per products/risk/flow.md.
Specs kept: BUILD_SPEC.md (data-testid contract), flow.md (live interactions), live-ui.md (parity + data decoding), credora*.json, chart.json (real data), audit-crawl/, docs-site/.
Old Life Table version, older design specs and all build/e2e logs were moved (not deleted) to /Users/leo/Documents/POIDH-risk-backup-2026-10-20.
Open: Low/Moderate/High/Critical labels overlap the colored bar under the terrain (dark); light/mobile polish; Opus review not run on this version; footer/header links verified live (2026-10-20).
