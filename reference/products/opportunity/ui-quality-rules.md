# UI quality rules (STRICT, binding for every product and every builder)
Everything here was learned the hard way while building Futarchy (26 e2e checks, 3 Opus reviews, 12 fix passes). Treat each rule as a test: if it is not checkable, make it checkable. Precedence: this file > docs/coding-rules.md details > older product specs > builder preferences. A product spec may ADD rules, never relax them.

## 0. Roles and token economy (how work is split)
- Claude (this chat or the next): decisions, specs, research synthesis, review, test diagnosis. Never bulk code.
- ChatGPT via `codex exec` (pipeline/lib.py `builder`): all code, in focused passes driven by a written spec; must end each pass with the build output.
- DeepSeek via local proxy (pipeline/lib.py `scout`): fetch + extract docs with quote-verified facts (pipeline/product_docs.py). Needs the proxy at 127.0.0.1:8318; if it is down, ask the user to restart it.
- Opus via `claude -p --model claude-opus-5-5 --allowedTools Read`: design review on REAL viewport screenshots (see section 14). 
- Codex sandbox cannot bind ports: it can NOT run e2e. Claude runs `npm run e2e -w apps/<product>` outside the sandbox and hands Codex the exact failures (save output to e2e_last.txt and tell Codex to read it).
- One pass = one coherent concern. Give Codex exact error text, file names and acceptance. Never commit or push unless the user asks.

## 1. Product identity (each product is its own world)
- Do NOT reuse another product's layout/hero/animation. Each product starts with a one-sentence THESIS and a WORLD (visual metaphor + a signature animation bound to real math of the product). Futarchy = "The Fork" (two parallel worlds). See docs/product-identity-guide.md for how to vary palette roles, rhythm, density and motion while staying inside EF.
- The EF skeleton is fixed: tokens in packages/ef/tokens.css, dark default + light mode, Inter Tight, tonal surfaces without borders, concentric radii, violet primary action, logo wordmark treatment. Products vary semantic colors, density, rhythm, motion character, hero structure, signature visual.
- Vocabulary comes from the REAL product (observed live UI + docs). Never invent product features or terms. Mark nothing as "illustrative" inside the UI; one "Sample data" chip in the footer only.

## 2. Layout law
- One container `.page`: max-width 1760px, padding-inline clamp(20px, 3.2vw, 56px). Header inner, every section, footer use it. Nothing bleeds past it. Horizontal scrollers live inside it with edge-fade masks.
- 12-col grid, 16px gap; 64px between sections; 24px between a section title row and content; cards radius 16, padding 20; nested radius 12; chips 8; all spacing from the 4px scale (4/8/12/16/20/24/32/48/64).
- Cards in one row have equal height. Two hero cards have equal height (+-2px). No vertical void > 32px inside any block; no void > 48px between hero blocks. Content must use the width: at 1920 content is 1760px, at 1440 >= 1340px.
- Hero is NEVER a decorative picture or poster headline. It is the product's live signal (data, list, chart) in bounded cards, adaptable to 1..N items.
- Every section root carries `data-align` so e2e asserts its left/right edges equal the container's.

## 3. Fixed-size component law (no component may change size with its content)
| Component | Size |
|---|---|
| Buttons / menu triggers / inputs / segmented controls | 40px high on touch (<=700px or hover:none); 36-40px desktop; min-width by variant; label never wraps |
| Verdict/state pills, outcome chips, status chips | ONE fixed width per family (e.g. 76px), 24px high, 12px text, centered; identical everywhere they appear |
| Tags (e.g. ACTIVE MARKET) | own fixed-width column/slot, fixed size, left edges identical on every row |
| Avatars | 20/24/32/44px sizes only; one avatar per entity used EVERYWHERE (data-avatar key) |
| List rows | 72px (list), 56px (table dense), 64px (table roomy); same row height for all rows |
| Table numerals | right-aligned, tabular-nums, fixed-width cell for number + bar |
| Chart canvases | height from tokens (mini 72-80px, card 280-360px, detail 520px; mobile 212-340px) |
- Numbers and units: `font-variant-numeric: tabular-nums`; a thin space between value and unit ("2433.45 USDS"); minus sign U+2212 in labels; percentages without gap before %.
- Rolling numbers: reel window height === line box height === item height (one CSS var), `overflow: clip`, translate in exact multiples, only changed digits animate, only significant digits roll (least-significant changes crossfade 120ms), never more than 2 digits per tick, reduced motion = none.

## 4. Typography and labels
- Type floor 12px/16px for any label; label color >= 4.5:1 on its surface; per card only 3 text sizes (12, 15, 28); titles 15/500; page H1 clamp(26px, 2.4vw, 40px).
- Labels have a defined structure: [muted 12px caption] over [value]; captions never wrap; values never truncate silently (ellipsis + tooltip when truncated).
- Explanations never sit in the page chrome. They live in on-demand surfaces: a Tour and tooltips (one shared Tooltip: 300ms delay, role=tooltip, also on keyboard focus, 240px max, never overlapping its trigger, clamped to viewport, hidden when trigger scrolls away). Tooltip text may be one sentence; page text may not.
- Copy budget: every visible string is in the product spec's allowed list or is a data label/unit. Headline <= 6 words. No paragraph > 14 words outside tooltips/tour.

## 5. Overlap and collision law (hard)
- No two interactive/text elements may intersect except parent/child or `data-overlay`. Sticky header legitimately covers scrolled content: e2e must scroll to top and ignore header-vs-content pairs.
- Canvas text uses ONE label engine (placement with min 18px vertical separation, 12px inset, merge when closer, labels sit ABOVE/BELOW lines never on them, halo stroke in card color alpha .85 width 4 drawn BEFORE fill). Always `ctx.save()`/`restore()` around labels and `setLineDash([])` before text (a dashed corridor style once leaked into label strokes and printed "Yes:2433::No:"). Export `canvas.__labels` (and `[]` for canvases without text) for tests.
- Popovers/menus: 8px offset, flip/clamp to viewport, never cover their own trigger, close timers cancel other menus' timers, one open at a time.
- Fixed/sticky elements never hide focused content (scroll-padding-top).

## 6. Interaction law
- Click SELECTS, double-click/Enter/Open button OPENS. A list that previews (hero signal list) must not navigate on single click.
- Hash router: `#/`, `#/org/<slug>`, `#/m/<id>` (adapt per product). Back/forward work; brand is a link home; detail has an icon Back button + breadcrumb; Esc goes back; scroll restored. Filters/sort/search state mirrored in the URL query.
- All dropdowns are the shared HoverMenu: opens on hover (90ms intent), focus, click, ArrowDown; closes 220ms after leave, Esc, outside click, selection (single); role=menu/listbox, arrows, typeahead; avatars + counts in items; multi-select with custom animated check (no native checkbox); selected values as removable chips (max 3 then +N); touch: tap toggles.
- Search: header pill + command palette ("/" and Cmd/Ctrl+K), grouped results, arrows+Enter. Inline filter row: one 44px row; wraps cleanly <1100px.
- Guided tour: auto-starts on first visit only; afterwards the hero shows no tour CTA (header help icon + palette remain). Spotlight cut-out must contain its target (e2e asserts +-2px). <=12 words per step.
- Empty, loading (skeleton shimmer 400ms), error states designed for every list/table.
- Crucial buttons (Connect Wallet, Create, Open, Add Liquidity, Resolve, Tour) use the shared `.btn-bubbles` hover effect (Uiverse reference in products/futarchy/uiverse-bubbles.css), `isolation:isolate`, not clipped by parents, off under reduced motion.

## 7. Motion and micro-animation law
- Durations from tokens (90/140/420ms; signature animations timeboxed in the spec). Easing: --ease-out or --ease-spring. Press scale .97 (buttons .96). Hover = tonal step 140ms. Focus ring 2px violet offset 2.
- Every animation is bound to meaning (state change, data tick, entry, momentum). No decorative ambient loops except the product's named signature visual. Each product has a signature animation derived from its own math (Futarchy: Signal head sparks/halo on the fork heads, ribbon shimmer, corridor proximity glow, Field particle view). Find the analogous real-math motion for each product (hazard/survival for Risk, Galton/sieve for Opportunity, Voronoi/relaxation for Deep, etc.).
- Particle systems: pooled (<=80 per small chart, ~420/stream for Field), no per-frame allocation, fixed-step Verlet, additive blend in dark only, pause when offscreen (IntersectionObserver), reduced motion = static frame AND clear the pool immediately when the media query changes at runtime.
- Entrances: staggered fade+rise (8px, 30ms stagger, max 8 items), once. Lists reorder with FLIP. Theme toggle uses a view-transition reveal. Route changes use view transitions with safe fallbacks (never await slow work inside the update callback; skip an in-flight transition on rapid navigation).

## 8. Charts / canvas law
- Size every canvas from a ResizeObserver on its PARENT (devicePixelRatio capped at 2), redraw on resize/tick. Clip all drawing to the plot rect with a 6px top inset. Never draw outside the card.
- Colors: resolve CSS variables once per theme through one `withAlpha(color, a)` helper returning rgba(); NEVER append hex alpha to var()/rgb() strings (caused `addColorStop('99')` errors).
- Domains: fit y to ALL visible points + 8% pad (2nd-98th percentile on mobile after decimating to ~1 point per 2 CSS px). Card/mini/hero charts show a 60% history / 40% future split with NOW at 60% (50/50 under 500px). Never let history spikes clip.
- Canvases only draw while visible. Therefore screenshots must be viewport-by-viewport (scroll then capture), never full-page, otherwise charts look blank (this produced a false "missing charts" finding once).
- Exposed test hooks (non-production guarded): `canvas.__labels`, `canvas.__pulse = {mode, particles}`, `window.__<product>Test`.

## 9. Data law
- Deterministic seeded generators (src/math/rng.ts); believable real vocabulary and ranges; no duplicates when scaled (`?n=` override up to 12 must generate unique items); one single source of truth per value shown in several places (list, card, tile, detail must read identical numbers/formatting); closed outcomes must obey the product's own rule; formats: compact money ($21.1K, $2.4M), em dash for none.

## 10. Responsive and accessibility law
- Test widths: 320, 360, 390, 768, 1024, 1440, 1920, 2560. No horizontal overflow ever (grid items `min-width:0`; tables become labelled rows <600px; stat strips become 2-col grids <700px).
- Touch targets >= 40px for every button/link/segment at touch widths. Every interactive element has an accessible name; focus visible; Esc closes dialogs; focus trapped in modals; contrast >= 4.5:1 for labels.
- Mobile page height guard (landing < 4600px at 390). prefers-reduced-motion respected everywhere.

## 11. Code law (from docs/coding-rules.md, repeated because it matters)
Vite + React 19 + TypeScript strict; plain CSS + tokens; `motion` for springs/layout; d3-scale/shape/array/random; no Tailwind, no UI kits, no icon packs, no chart libs. Small components (<150 lines), pure math in src/math with formula comments, no dead code. `npm run build` + `tsc` must pass every pass.

## 12. Required automated tests (copy apps/futarchy/e2e/run.mjs as the base; keep every check meaningful)
01 route errors (console/page errors, 404s) · 02 overflow at all widths · 02b mobile density · 03 container alignment (incl 1920/2560 width formula) · 04 routing/history/breadcrumb/brand · 05 tour lifecycle + spotlight contains target · 06 search + palette · 07 filters + URL · 08 adaptation (?n=1, ?n=12, empty state, canvas non-blank, no stroke pixels in top 4px) · 09 bounded live activity (card height, document height unchanged, scrollTop preserved) · 10 verdict/replay/needle (poll, blur before key presses) · 11 themes + contrast · 12 touch targets · 13 accessibility/dialogs · 14 reduced motion tickers · 15 digit reel windows (glyph box fits window) · 16 no DOM/canvas label overlaps (scroll to 0, skip header pairs) · 17 HoverMenu (hover/leave timings, keyboard, avatars, URL, viewport containment; select by accessible name) · 18 tour CTA lifecycle · 19 avatar consistency · 20 signal-head momentum/ticks/reduced motion (deterministic test hook; pool clears on media change) · 21 alternative view (Field) toggle/model/replay/reduced motion · 22 hero geometry · 24 signal list select vs open · plus per-product: single-click select, fixed pill widths, tag column alignment, tooltip presence, `.btn-bubbles` no overflow.
- Test hygiene: `resetTest` before each test (media no-preference, tour flag, session keys); blur focus before key shortcuts; poll instead of fixed waits; scope locators (header vs footer brand); never weaken a test to pass.
- Run: `npm run e2e -w apps/<product> > e2e_last.txt 2>&1` (Claude, outside Codex), then read failures.

## 13. Visual verification protocol
1. `apps/<p>/e2e/shots.mjs <url> <w> <h> <prefix>` captures viewport-sized screenshots while scrolling (zsh does not word-split unquoted vars: call it once per URL). Look at them yourself: layout, alignment, voids, label legibility, color semantics.
2. Capture the animation: several screenshots 250-300ms apart cropped on the signature element; test the alternate view in both verdict states.
3. Probe suspicious tests directly with a tiny playwright script before sending anything to Codex (most failures were test timing/state leaks, a few were real).
4. Opus review (max 3 rounds): prompt template in docs/handoff-project.md; give it ONLY real viewport captures; expect false positives from artifacts; verify each finding before acting.

## 14. Pitfall checklist (every bug we actually hit)
blank cards from offscreen canvases in full-page shots · hero chart y-domain fitted to the fork clipping the history into spikes · dash style leaking into label text · hex alpha appended to CSS var colors · label halos drawn as opaque black · labels sitting on the lines · reel window shorter than the line box clipping digit bottoms · pools not cleared on runtime reduced-motion change · metric strips widening the page on phones (min-width:0 + 2-col grid) · sticky header counted as overlap · key shortcuts ignored because focus was inside a control · needle/chips asserted before springs settled · exclusive tests leaking reduced-motion emulation · duplicate `.brand` locators (header+footer) · view-transition callback timing out · SVG `<rect>` with undefined width · unlabeled "Awaiting/Resolved" segments touching · tags positioned after variable-length names · pills with different widths · list click navigating instead of selecting · repeated sample data at `?n=12` · Impact numbers differing between list and chart · org avatars reusing one glyph · hero left column voids from space-between against a taller card.

## 15. Definition of done (per product)
Spec matched literally; all tests green at all widths; no overlaps; fixed sizes verified; signature animation + alternate view verified in real captures; Opus score <= 4 on the slop scale with no high-impact findings left; light and dark verified; reduced motion verified; nothing committed unless the user asks.

## 16. Resources
Curated external references and skills: docs/resources.md. design.md structure: docs/DESIGN_TEMPLATE.md. Rules are packaged as a skill: .claude/skills/seer-ui-quality/SKILL.md.

## 17. Research gate (new, mandatory)
No design before the Phase A audit is signed off (docs/RESEARCH_PROTOCOL.md): crawl every route/state/tab at desktop AND mobile with `pipeline/audit_capture.mjs`, digest with DeepSeek (`audit_digest.py`), open the screenshots, autopsy every chart, derive flows ONLY from observed transitions, map every number to its data field. Then ux.md (user-centered analysis), innovation.md (references, libraries, spike), concepts.md (3 concepts, one chosen), and only then design.md with a trace table to audit artifacts. A chart or flow drawn without an autopsy/observed edge is a defect (this is exactly what went wrong in the Risk chat).
