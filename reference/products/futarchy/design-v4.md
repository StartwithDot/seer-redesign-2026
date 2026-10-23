# Futarchy: revision 4 amendments (binding; overrides design-v3.md and earlier where they conflict)
Trigger: user review of a 2000px screenshot. (1) Too much empty space left/right: the content column is only ~1470px at 2000px wide and ~1240px at 1440. (2) Hero left side (huge tagline + count tiles + stepper cards) reads old-fashioned; count tiles duplicate information. (3) Bug: the merged chart label renders as 'Yes:2433.45::No:2432.48=' because the dashed corridor line style leaks into the label stroke.

## 1. Wider canvas (nothing else may regress)
- `.page` max-width 1760px; padding-inline clamp(20px, 3.2vw, 56px). At 1440 the content is >= 1340px, at 1920 it is 1760px; all sections, header inner, footer share it. Grids use minmax() so cards stay 320-420px wide (4-5 columns on wide screens). Charts and canvases resize with ResizeObserver; no fixed pixel widths.
- Tests: alignment (03) and overlaps (16) also run at 1920 and 2560; add an assertion that container width === min(1760, viewport - 2*gutter) +-2px at 1440/1920/2560; no horizontal overflow at 2560.

## 2. Hero rethink: "Live signal board" (replaces v3 section 5 and v2 section 3.2)
Remove: the 4 totals tiles, the 3 stepper cards, the chip switcher inside the chart card (kept ONLY below 1000px as the compact fallback), the giant poster headline.
Structure inside .page:
A. Slim hero header row (height ~72px): LEFT = the real tagline as the page H1 at clamp(26px, 2.4vw, 40px)/1.1, weight 500, single line (balanced if it wraps), eyebrow-free; RIGHT = inline summary pills `5 Active` `2 Include` `1 Exclude` (12px, verdict-colored dots, text-2) then actions: first visit shows primary "Take the tour" + secondary "Create market"; afterwards only "Create market" (secondary).
B. Two equal-height cards (grid 12 cols, gap 16, height ~ clamp(440px, 52vh, 560px)):
 - LEFT card, 4 cols (min 360px): SIGNAL LIST. Header row: "Active" label with a pulsing dot + count. Rows (72px each): Avatar 32, [ID + condition on one line, ellipsis], MiniSpark (SVG 64x24 forking YES/NO line, verdict-colored winner thread), verdict pill (Include/Neutral/Exclude), Impact % right-aligned (tabular, verdict color). Selected row: tonal surface + a 3px verdict-colored bar on the left that slides between rows (motion layoutId), a 2px progress hairline along the bottom of the selected row showing the 8s auto-rotate (pauses on hover/focus, off for reduced motion). Hover: tonal step + chevron; Enter/click opens the milestone, ArrowUp/Down changes selection (roving tabindex, role=listbox). More rows than fit: the list scrolls internally with top/bottom fade masks; with ONE milestone the list shows one row and the card height collapses gracefully (no dead space).
 - RIGHT card, 8 cols: header row = Avatar 28 + "ETH · EIP-8363" + condition (single line ellipsis) + lean pill + Open button (chevron); chart region flex:1 (min 300px) filling the card with NO empty band; footer = one compact stat row (YES Price | NO Price | Impact with the 4px micro-gauge) as inline stats separated by 1px dividers (not tiles), 64px high.
C. "How it resolves" thin strip (full width, 56px, below the two cards, low emphasis): three 28px animated glyphs connected by drawn lines with 12px labels `If Yes · If No` -> `Impact` -> `Include · Neutral · Exclude`; draws once when scrolled into view; hidden below 700px.
D. <1000px: A stacks; the chip switcher returns above the chart card; the signal list becomes a horizontal snap row of compact cards below the chart card.

## 3. Chart label bug (all charts)
Always `ctx.setLineDash([])`, restore `lineJoin='round'`, and `ctx.save()/restore()` around label drawing so dashed corridor/NOW styles never leak into text. Merged label text: 'Yes 2433.45 · No 2432.48' (middle dot, normal spacing, 12px, token colors), drawn with a card-colored halo stroke (alpha .85, width 4) BEFORE the fill. Add an e2e pixel check that the label bounding box region contains no dashed-stroke pattern: simplest acceptable check = assert (via a debug flag on canvas.__labels entries) that each label was drawn with lineDash length 0.

## 4. Tests to add/update
22 Hero geometry (rewrite): header row exists with H1 at <=40px; left (list) and right (chart) cards equal height +-2px at >=1000px; list rows fill the card (no vertical gap > 24px below the last row for N>=4); no totals tiles / stepper cards present; strip present at >=700px; with ?n=1 the page has no vertical void > 48px in the hero; with ?n=12 the list scrolls internally and the page height does not grow.
24 Signal list: ArrowDown changes selection and the chart card header updates; Enter opens detail; auto-rotate advances after 8.5s (skip under reduced motion, where selection never auto-advances); selected-row bar uses the verdict color of that milestone.
03/16 extended widths as in section 1.
Keep all existing tests meaningful (update, do not weaken).
