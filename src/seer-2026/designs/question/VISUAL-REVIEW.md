# Question art direction repair

Reviewed the supplied 1440px and 390px slices against both v5 briefs. Changes stay in this design folder.

Eight problems addressed:
1. Desktop violet signal stopped beneath the opaque price backing: extend its endpoint to the number.
2. Cursor blink continued after typing: render it only during the question's introduction.
3. Word animation and visible panel used different timeline scales: trigger a fresh word-mask entrance on each actual panel handoff, including reverse scroll.
4. Absolute panels depended on successful pin initialization: stacked flow is now the default; the pin class is installed and removed with the matching GSAP context.
5. Market data floated between excessive empty bands: use deliberate heading-to-market spacing and let remaining space separate the closing action.
6. Deep's desktop columns interrupted numerical reading order: flow the ranking down each column, retaining ordered single-column mobile flow.
7. Mobile pass/fail values squeezed two labels beside one another: stack full-width comparisons with consistent baseline alignment and separators.
8. Footer signature overwhelmed the preceding typographic argument: retain the official oversized asset but cap its desktop width at 760px.

Pass one: supplied screenshot critique and implementation repair.
Pass two: source review of pin lifecycle, reverse scroll, compact height, reduced motion, mobile ranking and comparison layouts.

Validation: `npx tsc --noEmit` passed. Mechanical detector reports only font warnings; Instrument Serif and Inter Tight are explicitly required by COMMON.md.
Fresh browser QA could not run: Vite's bind to 127.0.0.1:5188 is rejected with EPERM by this environment. No post-change screenshot or measured overflow claim is made.
