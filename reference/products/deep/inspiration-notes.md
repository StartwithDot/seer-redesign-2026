# Inspiration notes (viewed all 12 contact sheets, 69 captured references; research/inspiration/deep/sheet-01..12.png)
Failed/blocked captures (no signal): Polymarket, Kalshi (timeout), Reuters, Bloomberg (bot wall), repo-visualizer (404), locomotive (Cloudflare), observable bump-chart (404).

## Borrow
- **OWID grapher (03)**: direct end-of-line labels, a right-hand entity list where ticked entities are drawn and the rest are greyed, single time slider with play. Borrow: label ON the line ends, legend = selector, honest axis with real units.
- **Observable index chart / slope chart / bump idea (18, 66)**: index to a base date so 98 lines become "change since start"; slope chart (two time points, labels dodged) for start-vs-now. Borrow both as alternate lenses of the same data.
- **Beeswarm (13)**: one-axis dot cloud with collision dodge: ideal for 98 UP prices crushed into 0.65-0.85 (each dot = repo, named on hover).
- **Wealth & Health of Nations / Gapminder (20, 56)**: scrub-time animation with huge ghost year behind data; play/pause + slider. Borrow time scrubbing that replays the round (Oct 1 -> Oct 18) so the field breathes.
- **Pudding / Polygraph (01, 70)**: serif display + body, small multiples, annotation prose beside figure. Borrow editorial voice: a headline sentence derived from the data ("91 of 98 repos sit between 0.65 and 0.85").
- **Streamgraph/treemap/circle-pack (15, 16, 17)**: part-to-whole. UP/DOWN/uncertainty per repo is a part-to-whole: a stacked horizontal bar per row (UP | DOWN | unpriced residual) in a ranked list.
- **LMArena / SWE-bench / OpenRouter / HF leaderboard (26, 58, 57, 59)**: dense ranked tables with inline bars, uncertainty, Linear/Log toggle (OpenRouter), pinned columns. Borrow inline bar-in-row, sortable columns, rank + delta.
- **Elo ratings (62), KenPom (63)**: raw, dense, trustworthy numeric tables: tabular figures, rank deltas (1-yr change). Borrow rank delta column and table density.
- **Election Betting Odds (68)**: huge numerals as the primary object, tiny delta "+0.3% in last day". Borrow large tabular numerals + delta.
- **Manifold / Metaculus (33, 34)**: many-outcome markets as ranked rows with probability bar. Borrow row-with-bar; avoid card grids.
- **DefiLlama (28)**: dark, dense, CSV/PNG export buttons at the figure; borrow export-at-figure placement.
- **Star-history / Gource / OSS Insight (22-24)**: repos as the actors; Gource's organic radial growth is memorable but unreadable; borrow only the idea of repos as named marks, not the radial look.
- **Rive / Raycast / Linear / Framer (35, 37, 38, 39)**: near-black surfaces, a single saturated accent, big confident type, instrument-like product screenshots. Aligns with EF skeleton (near-black, violet).
- **Lusion / Igloo / basement (40-42)**: WebGL-grade motion; avoid: spectacle with no data meaning.

## Avoid
- Dribbble/Behance/awwwards/godly/siteinspire (44-52): trend gloss, glass, glow; used only to confirm what slop looks like (Dribbble 'prediction market' sheet 52 = the exact dashboard-with-KPI-tiles we must not make).
- Coingecko / Nasdaq screener (29, 71): chip-row filters + ad clutter.
- Datawrapper chart templates (08), Visual Vocabulary (07): taxonomies only.
- Default tableau/"rainbow" categorical palettes (live Deep chart, 15 streamgraph): colour must encode a variable (rank, change, UP-share), not identity.

## Decisions carried into concepts
1. Primary object = a bespoke instrument of 98 named marks over real data, not a line spaghetti.
2. Three lenses of the same data (position/spread, change since start, rank over time) with animated transitions.
3. Ranked typographic list with inline UP|DOWN|residual bar, rank delta and sparkline.
4. Time scrub replays Oct 1 -> Oct 18; end-of-line direct labels for isolated/top/bottom repos only.
5. Editorial headline generated from data; exact axes with month/year; log/zoom axis for the 0.65-0.85 band.
