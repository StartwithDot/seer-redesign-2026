# Risk Pricing Visual Review

## Pass 10: supplied 1440px and 390px captures

1. **Two consecutive heroes obscured the job.** The oversized market question is now a compact market rail; the image-led Hazard Desk is the single page hero.
2. **The overview exceeded the two-screen target.** Round metadata, method, controls, secondary instruments, and footer links are compressed or progressively disclosed without removing them.
3. **Header utilities looked like an icon tray.** Guide, help, email, theme, search, and account remain reachable, with secondary actions grouped under Tools and only Search/Connect kept direct on desktop.
4. **The dark captures were effectively light.** Risk now binds a separate charcoal palette through both the document theme and the shell theme, including art, glass, borders, charts, and overlays.
5. **The hero artwork felt buried inside a dashboard card.** The landing-family architecture image now spans the full decision surface, with copy placed in its native negative space.
6. **The portfolio dial had colliding readouts and weak hierarchy.** Number, prompt, horizon, and annual/quarterly strip now have isolated type rules and non-overlapping regions.
7. **The Survival Tide labels collided across four narrow docks.** The dock field is 388 SVG units wide, group columns are separated by 94 units, and vertical labels use a bounded 22-unit collision pass.
8. **The selected-asset panel was a tall empty sidebar.** It is now a compact horizontal readout below the full-width Tide, returning the lost chart width to the primary signal.
9. **Mobile reproduced a microscopic desktop chart and clipped navigation.** The top shell is logo plus Tools, routes remain in the bottom bar, and mobile uses a compact survival curve with a contained two-column direct-label list.
10. **The footer and repeated card treatments looked like a generic template.** Equal mini-cards were flattened into hairline readouts, controls use one analysis rail, and the footer is a compact editorial link band.

## Verification

- `npx tsc --noEmit -p src/products/risk/tsconfig.json` passes.
- `npm run build` passes; Vite reports only existing cross-product chunk-size and Deep import warnings.
- Risk pass 6, 7, 8, and 9 deterministic suites pass.
- The sandbox rejects both `127.0.0.1:5188` (`EPERM`) and local headless Chrome launch (`SIGABRT`/`EPERM`). The supplied captures were the visual baseline; `tests/file-visual-qa.mjs` provides 390/1024/1440 dual-theme capture and measurement for an unrestricted machine.
