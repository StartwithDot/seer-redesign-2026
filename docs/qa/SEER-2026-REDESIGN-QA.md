# Seer 2026 hero redesign QA

## Static verification completed

- Official local Seer SVG asset: `/public/assets/brand/logo.svg`
- Official Inter Tight package: `@fontsource-variable/inter-tight`
- Official EF light tokens: `#F7F7F9`, `#17171C`, `#5C5C66`, `#7A3CFF`
- Only `Apps` and `Connect Wallet` appear in primary navigation
- `Apps` and `Explore Markets` route to `https://app.seer.pm/`
- `Learn More` routes to the verified official documentation at `https://docs.seer.pm/`
- Text remains semantic HTML outside the WebGL canvas
- Sculpture uses four procedural, bevelled `ExtrudeGeometry` meshes with physical thickness and rounded section ends
- Renderer is lazy loaded after the essential page load, capped at 1.5 DPR, and continuous motion invalidations are throttled to 20 FPS
- No textures, particles, HDR assets, bloom, or postprocessing are used
- GSAP entrance is 2.8 seconds, followed by bounded yoyo oscillation
- Reduced motion disables the entrance and ambient movement
- Visibility changes pause and resume active GSAP timelines
- Unsupported and low-performance devices retain the CSS sculpture fallback
- Scrapped architectural image assets remain archived but unused, as documented in `/public/assets/seer-2026/README.md`
- Wallet flow only calls an injected EIP-1193 provider and never simulates success

## Browser verification pending

The IDE terminal bridge did not execute shell commands during this session, including a one-line file-write test. Because the new packages could not be installed, these required checks remain pending:

1. `npm install`
2. `npm run build`
3. Start preview and verify `/seer-2026`
4. Capture 1440 by 900 and 390 by 844 screenshots
5. Confirm no horizontal overflow and inspect final WebGL materials in Chrome
6. Verify pointer damping and the 2.8-second rotation sequence in motion

Do not treat this implementation as browser-verified until those checks pass.