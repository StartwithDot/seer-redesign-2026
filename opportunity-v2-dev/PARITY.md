# V4 parity inventory and verification map

The requested `products/opportunity-v2/PARITY.md` and `IMPECCABLE_RULEBOOK.md` were absent on disk. This inventory is reconstructed from `apps/opportunity/src`, its working harness, the original hard constraints, and the binding Ledger spec. Changes are confined to this app; no product specification was edited.

| Group | Source and v2 implementation | Assertions in e2e/run.mjs |
| --- | --- | --- |
| Real and sample markets | Identical outcome JSON, generators, seeded math and store; title uses the approved “Seer AI Job Board Name” | 03, 03b: 235 outcomes, 59 priced, 46 floor, 130 without pools, 60.4% cut, unique samples, conserved ticks |
| Market selection | Rail, counts, find field, keyboard arrows, expansion action, mobile sheet, header switcher, ticker | 02, 04, 05, 11, 14, 20 |
| Board | Bubbles, Heatmap, List; all submissions named; tier panes scroll; remembered view; single select, Enter/double click opens | 05, 07c, 07e, 16, 18 |
| Review and sponsor | Review cut, combined odds, shortlist, sponsor pick count, pending/winner; now in Decision card | 06, 07c, 07e, 11, 15 |
| Selected submission | Avatar, name, odds, price, rank, labelled history, review drawer, Buy/Sell actions | 11, 18 |
| Trading | Buy/Sell, outcome menu, amount, four increments, summary tooltips, position/balance, disabled explanations | 09, 11, 19 |
| Wallet | Connect, funded balance, pay token menu, simulated buy/sell, insufficient funds/position, redeem, reset, disconnect | 09, 19 |
| Explore | Status/counts, decisions, sizes, query, sort, cards/table, top three, triage, metadata, empty reset | 02, 03, 04, 08, 11, 17 |
| Expanded market | Every entry point opens same sheet; charts, searchable tier table, selected row, ticket, sponsor, last row | 02, 07d, 11, 18 |
| URL and history | Market routes, filter query, sheet `?open=`, back/forward, brand home, Escape | 01, 02, 17, 18 |
| Search | Header, slash, Ctrl/Cmd+K, market/submission groups, arrows and Enter | 11, 17 |
| Explanation and tour | Five exact product chapters, scene animation/playback, guide, eight spotlight targets, blur, Escape | 06, 07b, 11, 13 |
| Protocol and navigation | Pilot, roadmap with TODAY/NEXT/ANY DECISION, Archive | 11, 20 |
| Themes and accessibility | Dark/light, contrast, visible control names, 40px mobile targets, native modal focus, reduced motion | 06, 10–15 |
| Layout | Required desktop sizes, bounded panes, viewport bounds, overlaps, short-window scrolling, mobile | 01, 07d, 10, 14, 15 |

## Corrections to stale assumptions

- V1 already uses an explicitly opened explainer; it does not automatically open on a first visit. The harness preserves that observed behavior.
- V1 already removed automatic marquee scrolling. Ledger uses a manually scrollable bottom ticker; testing infinite scrolling would contradict the approved spec.
- V1 does not have a separate five-step board footer anymore. The five exact chapters survive in the explainer; Ledger moves review/sponsor into the right column.
- Devcon declares 20 outcomes but supplies 18 observed rows, as in v1. Do not fabricate two submissions or change the data.
- Decision controls are stacked in one card, not equal-height neighboring footer columns.
- Tier headings split names and counts into separate elements; accessible regions identify each tier.
- Status widths are fixed within each component family; v2's 76px card tags replace the old 96px assumption.

## Validation limits

No server or browser suite was run in the sandbox. The harness builds in test mode, launches system Chrome using playwright-core, starts Vite preview (which retries occupied ports), captures failures, and stops preview in finally. Run `npm run e2e -w apps/opportunity-v2` externally. Tests assert required behavior and may reveal remaining visual/runtime issues; static validation does not establish browser passes.

Font installation was attempted with the authorized workspace command but failed with registry DNS ENOTFOUND. Existing Geist and Geist Mono CDN imports remain; offline font availability is not verified.
