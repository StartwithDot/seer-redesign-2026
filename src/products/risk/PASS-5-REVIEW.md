# Build pass 5

Completed 20 checklist items: F082–F092, F094, F096–F103.

Prediction desk: edited counts and group badges, aggregate reset, independent group and row expansion, category filters, keyboard sliders, market/user values, dossier actions, explicit wallet and round gates, reset/export, CSV import, schema guidance, template download and validation. CSV imports merge with the existing draft, including assets outside the current focus. Export always includes the canonical 33 assets plus No To All and uses the current saved data and draft values.

Removed the timed local “confirmed” simulation. No live submission adapter is configured. F095 remains unchecked because actual submitting and confirmed states cannot be implemented honestly without that integration. F093 remains unchecked: the available asset market URLs point to Seer search, rather than verified specific outcome tokens. Advanced links are explicitly labelled market searches.

Visual treatment follows the Design Book and landing tokens: Inter Tight, restrained violet, shared white/charcoal surfaces, bounded asset scrolling, compact expandable rows, and mobile stacking. CSV and dossier portals now inherit the Risk shell's theme tokens.

Validation:
- `npx tsc --noEmit -p src/products/risk/tsconfig.json`: passes.
- Deterministic data assertions: canonical 33-asset CSV roundtrip, 34 exported data rows, percentages/fractions, malformed/unknown/duplicate/range/column rejection, monotonic slider mapping, aggregate targets 0/1/25/50/99/100, recovery after 100% survival: pass.
- Risk entry bundle through esbuild: passes.
- Root `npx tsc --noEmit`: blocked by existing errors in Deep leaderboard, Explorer MarketRecordPage, and Futarchy ActivityTable. Those folders were not edited.
- Browser verification could not run: Vite listen returns EPERM and Chrome exits with SIGABRT under this environment's restrictions. No screenshots or visual approval claimed. Desktop/tablet/mobile and both-theme visual checks remain outstanding.

Root guidance files referenced by AGENTS.md were absent: NEW_CHAT_PROMPT, RESEARCH_PROTOCOL, NEXT_GEN_DESIGN_RULES, ui-quality-rules, product-identity-guide, coding-rules, handoff-project, resources, DESIGN_TEMPLATE. Read available overnight/DESIGN_BOOK.md, Seer design skill, landing screenshot and CSS, Risk feature inventory and existing implementation.
