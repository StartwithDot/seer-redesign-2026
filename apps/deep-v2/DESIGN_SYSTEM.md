# Deep H: an originality instrument

Deep puts historical evidence, independent price pairs and an operational strategy desk in one full-width instrument. The data leads. The design uses an editorial title, a precise ranked ledger, understated measurement rules and a clear sequence from setup to execution.

Mode: Operate for Markets, Desk and wallet flows; Read for Guide. Existing approved composition retained. No new concept round.

## Foundation

| Role | Dark | Light | Use |
|---|---|---|---|
| Page | #101013 | #F7F7F9 | Shell and plot |
| Surface | #1A1A1E | #FFFFFF | Desk, menu, dialog |
| Nested | #1F1F24 | #F0F0F3 | Inputs and active controls |
| Primary text | #EDEDF2 | #17171C | Content and figures |
| Secondary text | #A8A8B3 | #5C5C66 | Labels and axes |
| Primary action | #7B3AFF | #7B3AFF | White action label |
| Selected / prediction | #B79CFF | #6C2BD9 | Selection, focus, prediction tether |
| UP / information | #5B9DFF | #2F6FD6 | Left pair leg, UP history and dots |
| DOWN / neutral | #A8A8B3 | #5C5C66 | Right pair leg and DOWN history |
| Gain / ready | #3DDC97 | #117A50 | Positive drift, positive P/L and satisfied guard |
| Loss / overlap | #FF5C72 | #C12B43 | Negative drift, P/L, overlap hatch, errors |
| Caution / gap | #F5B84A | #946008 | Residual layer and gap hatch |

Actual calculated ratios are saved in reports/contrast.json. Alpha context lines are secondary context; full-strength selected traces and tabular exact values carry precise data. Audit separately records effective composited colors.

UP blue and DOWN neutral are disclosed departures from captured violet/lavender and implement the identity guide's approved Deep palette. Violet remains the Seer action/selection/prediction anchor. Color is redundant with left/right position, signs, hatching and visible labels.

## Type, icons and geometry

- Inter Tight Variable: UI 13/18, secondary 12/16, numeric tabular figures. Ledger 12/30 desktop and 12/44 mobile.
- Newsreader Variable: selective figure/editorial headings 30/32 desktop, 25/28 mobile, normal 450 weight, serif fallback. This is a documented EF departure and fixes the compressed 22/16 baseline.
- JetBrains Mono 11/16: addresses, ids and UTC only. Other numbers use tabular Inter Tight.
- Custom SVG family: 20x20, stroke 1.75, rounded joins/caps, inherited currentColor. Icons have labels; decorative SVG aria-hidden. Original raven paths retained.
- Spacing base 4px, working steps 8/12/16/24/32. Radius 16 for dialog, 12 for nested surfaces, 8 for controls. Dense ledger and plot boundaries stay square.
- Desktop: global header 56, app navigation 48, compact contest/context band, chart plus bounded Desk left and repository ledger right. Right ledger 400 at 1280+, 340 at intermediate widths. Dock 252; chart takes remaining height.
- Mobile at 700 and below: fixed shell and 60px bottom navigation, compact but complete context, bounded Chart/List/Desk regions. Chart retains the source list below the figure inside its own scroll area; List and Desk bring their respective operational content into view. Main chart controls wrap in independent rows. Intermediate widths retain columns without compressing the chart below useful height; context and Desk can scroll internally.
- Positions: seven deliberate columns in a local horizontal scroll region, common header/value edges, minimum width sufficient for full figures. All 98 buttons remain mounted.

## Chart grammar

Recorded steps stay steps. No invented interpolation of prices. The global p10/p90 band remains global under search; median is a distinct violet rule. Foreground UP is blue, DOWN neutral, selected violet. Context is subordinate. Time axis UTC and price domain explicit. The Swarm uses the existing piecewise lens, fixes x to price, and packs only vertically. Radius formulas are inherited exactly. Labels never move data coordinates.

Pair bars retain exact 64x8 dimensions and independent widths. Positive residual is patterned gap; negative residual patterned overlap. Unknown values retain the U+2014 compatibility glyph, never zero. Wallet map keeps log volume and signed-log P/L; ring count means merged wallets. ROI and Score are never fabricated.

Responsive SVG text compensates for the actual preserveAspectRatio scale, targeting an 11px rendered label. Compact maps omit redundant near-zero tick text. Mobile maps omit direct extreme-wallet annotations: periods with no winners can otherwise place their first loss annotation on the tick row. Marks, coordinates, values, accessible dot identities, the complete ledger and Inspector remain. The axis/units caption sits in HTML beneath the plot so a compressed thumbnail cannot merge it into its tick row. Detail and archive endpoint dates use end anchors. Mobile detail removes the old minimum height that caused letterboxing.

## Motion and interruption

| Trigger | Target | Duration / easing | Stagger | Interruption / reduction |
|---|---|---|---|---|
| Hover/focus | Control tone | 120ms / cubic-bezier(.2,.8,.2,1) | 0 | Immediate reversal; no interpolation under reduce |
| Press | Button transform | 120ms / same | 0 | Release restores; no movement under reduce |
| Menu opening | Opacity, 4px padding clip reveal | 180ms / same | 0 | Close cancels; static under reduce; preserves the 8px trigger gap throughout |
| Native dialog entry | Opacity, 8px translate | 180ms / same | 0 | Unmount cancels; static under reduce |
| Tab / selection | Tone and underline | 240ms / same | 0 | Latest state wins; static under reduce |
| View content | Opacity | 400ms / cubic-bezier(.4,0,.2,1) | 0 | Unmount cancels; static under reduce |
| Pair mount | Scale from own anchor | 600ms / out | 0 | One bounded mount; static under reduce |
| Swarm layout morph | Position | inherited 420ms linear | 0 | Offscreen cancels; static under reduce |
| Historical replay | Time only, stepped quotes | 12000ms full interval, linear | 0 | Stop/scrub cancel; reduce jumps END |

Operational timers are separate: create wallet 900ms after request; execution 140ms per prediction; Profile signing 140ms; Guide focus 140ms; leaderboard period 1400ms; menu hover 90/220ms. No idle logo, ping, sheen, scanline, chart or particle loop.

All and filtered historical series retain the active leg color at 95% opacity. Swarm foreground marks retain their source 80% paint opacity. Wallet fills retain 55% opacity with opaque meaningful outlines; merged-wallet ring strokes use 85% so their count remains legible in light mode. Exact effective ratios, including actual SVG strokes and alpha composition, are in reports/supplemental/contrast.json.

Historical replay keeps its bounded source timeline after route navigation. The Canvas unmounts; the unrelated leaderboard is memoized with stable route snapshots and a stable retry callback so that timeline updates do not rebuild the wallet table/map. No replay price, timestamp, timer, selection or query contract changes.

## Component states and preserved boundaries

Controls: default, hover, focus-visible, selected/current, disabled with explanation, busy, error. Native dialogs retain Escape/containment/return. Menus retain keyboard typeahead where implemented, clamp/flip, outside/focus close and genuine hover intent. Reflow under a stationary pointer must not count as pointer intent.

App memory owns wallet, committed predictions, replay, selected repo and dock. Pending CSV stays local. Archive remount resets its local state. Follow/Compare remain transient. Only theme and local profile persist. Both account paths retain their separate disconnect semantics for compatibility.
