# Landing refinement review

## Art direction correction, current pass

Scope: `/seer-2026`. Read `overnight/ART_DIRECTION.md`, `overnight/BENCHMARKS.md`, the Seer Design Lab skill, existing brand research, and product knowledge before editing. The referenced root research protocol and UI rule files are absent. All ten supplied viewport images display as blank white, so findings below come from source and authored asset inspection, not rendered page screenshots.

Eight priorities corrected:

- Cramped hero art: the wide Blender film occupied a narrow portrait crop. Let the film span the desktop composition at its original aspect ratio, with its prism separated from the copy and a dedicated mobile crop.
- Loose display leading: the hero's four lines had the same relaxed rhythm as supporting headlines. Restore 104px / 650 / .92 desktop display and 56px / .96 mobile display, and centralize the hierarchy and tracking in landing tokens.
- Wordy hero support: the long single sentence weakened the contrast between the headline and its explanation. Use two direct sentences, a 416px measure, and 1.5 leading.
- Empty application-stage spacing: reduce the title-to-stage gap, align menu and description to the editorial gutter, and move the art caption to its composition edge.
- Weak application hierarchy: give the active title stronger weight, keep inactive titles above AA contrast, use a restrained violet marker, and restore the 720ms flip. Copy changes at the visual midpoint and direct selection reaches the fully visible face.
- Flat glass: separate reflective rim gradients from transparent glass faces, narrow specular transitions, reduce violet fill, and distinguish contact, intermediate, and ambient shadows. Apply the same material logic to the process ring without changing its morph.
- Fragmented chapter transitions: retain the scrolling paper-to-mist background, normalize chapter spacing, and fade only the charcoal background. Remove negative section margins and whole-section masking that could fade content near chapter boundaries.
- Oversized footer identity: reduce the logo to a 400px desktop maximum, preserve its gutter alignment and every link, and tighten the closing section's mobile spacing.

Pass one reviewed composition, hierarchy, material, and preserved controls. Pass two corrected desktop video containment, flip endpoints, compact-height typography, and background-only transitions.

Validation: all six sections, five app tabs, five panels and geometries, unique SVG IDs, existing link destinations, and media paths pass static rendering checks. The actual GSAP timeline passes all five selection endpoints and both sides of each flip midpoint. Authored Inter Tight font measurements at the actual weight pass headline and app-menu fit at 1440px, 1024px, and 390px. Tested body and action contrast ranges from 4.99:1 to 11.01:1. Lenis, pins, word highlighting, line reveals, process morphs, video, magnetic actions, keyboard selection, and reduced-motion branches remain.

Build dependency: the baseline `npm run build` failed because a pre-existing Futarchy QA file imports `node:assert/strict` without Node declarations. Added `@types/node` for the current Node 22 toolchain from the local npm cache, with its normal registry URL and integrity in the lockfile. No other product source was edited.

Live browser QA remains unavailable: Vite fails with `listen EPERM 127.0.0.1:5188`; Chrome also exits during launch. No live screenshots, browser collision checks, or runtime scroll assertions are claimed. TypeScript and Vite production build pass.

Source: supplied desktop 1440 × 900 and mobile 390 viewport slices, overnight/ART_DIRECTION.md.

## Pass one: composition

- Hero lens is visually subordinate: enlarge its video footprint while preserving the original video, cursor tilt and copy stacking.
- Display tracking is too compressed: relax tracking and line height for clearer letterforms.
- Pinned applications leave excess space between heading and content: rebalance the stage and anchor art to its menu.
- Inactive app names need readable contrast: retain a restrained neutral while keeping selection in ink.

## Pass two: material and rhythm

- Glass reads as plastic: sharpen narrow specular transitions, improve edge contrast and separate contact from ambient shadows.
- Repeated evenly weighted columns flatten the story: give applications an art-dominant split and process a more balanced arrangement.
- Section rhythm feels disconnected: reduce excess chapter padding and feather the process paper surface into the preceding background.
- Footer identity overwhelms navigation: reduce desktop wordmark footprint and tighten mobile spacing.

## Verification

`npm run build` passed (TypeScript and Vite production build).
Local browser verification could not run: Vite listen on 127.0.0.1:5188 was rejected with EPERM by this environment. Rendered overlap, viewport parity and scroll behavior therefore require browser verification. Existing animation hooks, pinning timelines, keyboard tabs, links, video and reduced-motion behavior were retained.

## Art direction revision, 2026-10-23

Scope: `/seer-2026`, assessed against the supplied desktop and mobile viewport slices, `overnight/ART_DIRECTION.md`, and `overnight/BENCHMARKS.md`. The referenced root `docs/` rules are absent from this checkout.

Eight findings addressed:
- Hero lens cropped beyond the frame: present the complete authored video scene behind the desktop copy, with a separate mobile crop.
- Hero copy and actions below the desktop fold: rebalance display leading, top spacing, and supporting copy measure.
- Excessive voids in the applications stage: anchor optics and menu to a shared grid and shorten the heading-to-content gap.
- Weak application selection hierarchy: increase active weight while keeping inactive controls readable.
- Milky glass: reduce uniform violet density, sharpen specular stops, and separate contact and ambient shadows.
- Flat process ring: add clearer refraction stops and retain layered depth shadows through all morph states.
- Disconnected section rhythm: normalize title scale, gutters, and chapter spacing, preserving the white-to-grey background animation.
- Dominant footer logo: reduce its footprint and align it to the editorial gutter; maintain every footer link.

Implementation inspection pass: all five application tabs, descriptions, links, keyboard handlers, flip timelines, Lenis, pins, and reduced-motion branches remain. Removed the empty WebM source from the hero; the valid MP4 remains.
Validation pass: `npm run build` passes. Local live-browser QA was blocked because the environment rejects the Vite listening socket (`listen EPERM 127.0.0.1:5188`). No post-change browser screenshots or runtime scroll assertions are claimed.


## Blender asset integration, 2026-10-23

Reviewed supplied land_d0 through land_d6 page screenshots (hero, menu and app swaps, How It Works, Kleros, invitation). Kept layout, pinning, text highlighting, scroll runways and links. Exported six WebP stills from existing Blender out.png sources because public/img was empty. Hero now uses hero.webm/hero.mp4 and hero.jpg with multiply and directional masks. Headline reveal blur is confined to the hero; sheen runs once. Reduced motion uses the poster and static app selection, without scrub, tilt, parallax or sheen.

Source discrepancy: render/kleros/out.png is a white studio scene with violet faces despite its dark monochrome RECIPE.md. CSS grayscale/invert, screen blend and a radial edge mask present those monoliths against exact #0C0C0F. A correctly rendered dark source would improve material fidelity. No generated replacements were used.

Validation: npm run build passes. Live visual QA was attempted but this environment rejects the Vite localhost listener with EPERM and Chrome exits during sandboxed launch. No live viewport screenshots or scroll interaction verification could be completed. Existing screenshots and source assets were visually inspected; desktop/tablet/mobile and reduced-motion browser checks remain unverified.


## Editorial correction, 2026-10-23

The supplied ten viewport images are blank; they cannot substantiate rendered visual findings. This pass audited the landing source against ART_DIRECTION.md and BENCHMARKS.md.

Eight source findings addressed: hero film competing with copy; offscreen reveals running on mount; conflicting display scales; inconsistent gutters; application selection/flip timing mismatch; weak process-glass contact shadows; inconsistent chapter transitions and spacing; undersized footer identity. Removed accumulated competing CSS passes and established one final composition per component. Preserved links, five app tabs, keyboard selection, Lenis, scroll pinning, video, morphs, magnetic actions and reduced-motion branches.

Source review pass: checked 390px headline measures, compact-height stacking, editorial gutters and pinned stage content allocation. Motion review pass: section reveals now trigger on arrival, application flips share the same segment boundaries as tab selection, navigation uses directional thresholds, and app flips use 12 degrees rather than 90 degrees.

Live QA blocked: localhost Vite listener rejected with EPERM. Browser overflow, collision and interaction checks remain unverified.

Build attempted: npm run build currently fails in unrelated product files: deep/components/AppShell.tsx imports missing ShareView; risk/data/pool-history.ts returns possible undefined where string|null is required. Those files are outside the user-authorized /seer-2026 scope and were not changed. Earlier passing build entries above describe earlier revisions only.


## Current art direction correction

Evidence: all ten attached viewport slices appear blank. Findings below are source-level composition issues, not claims about rendered captures. The shared project rules were located in ../docs; the landing art direction and benchmarks supply the current spec.

Eight problems addressed:
- Hero film exceeded its grid track and could enlarge the first screen: bounded its footprint and prevented intrinsic grid expansion.
- Four-line headline felt compressed: restored 1.02 leading, deliberate tracking and ink emphasis; reserved violet for actions.
- Chapter gutters drifted on mobile: application stage now uses the shared gutter.
- Application selection lacked emphasis and changed before the visual midpoint: violet active text and flip-midpoint selection timing.
- Radial masks washed away the optical renders: extended the fully opaque area and separated captions from the art.
- Process glass looked uniformly lavender: narrow white specular edge, restrained neutral refraction and preserved layered contact shadows.
- Chapters repeated the same pacing: expanded statement breathing room, tightened process alignment and gave charcoal its own generous interval.
- Footer logo competed with the final headline and navigation: reduced desktop footprint and preserved every link.

Verification: preserved all five apps, links, keyboard selection, scroll pins, Lenis, video, reveals, geometry morph and reduced-motion branches. No dependencies added. Browser QA attempted but Vite cannot bind 127.0.0.1:5188 (EPERM); rendered overlap, overflow and scroll behavior remain unverified.

## Art direction repair, 2026-10-23

Evidence: the ten supplied viewport slices are blank. These are source and asset findings, not a claim of live browser inspection. Read the full ART_DIRECTION.md and BENCHMARKS.md, the existing product/brand research, and the shared rules found at ../docs. Only src/seer-2026 was edited; production build output is generated by the required build.

Eight worst problems and the applied changes:

- **Cropped hero composition:** square cropping cut the authored film and its optical focal point. A bounded 600px desktop art track uses a measured 65% crop, with a separate 68% mobile crop. The video, poster and cursor tilt stay.
- **Unstable display hierarchy:** competing overrides flattened headline rhythm. Replaced the six stylesheet cascades with one composition each: 104px hero, 112px statement, 72px app title, 88px process title, 104px trust title, 128px invitation at 1440. Display tracking is -.045em; mobile hero is 56px. Arrival reveals remain.
- **Drifting spacing and excess stage voids:** sections used different gutters, unsupported intermediate values and unconstrained art heights. Shared 56/32/16px gutters, a 1328px editorial width, a 4px spacing scale and viewport-bounded app optics align the page. Existing 2800px app and 1800px process pin runways remain.
- **Muddy and boxed application imagery:** studio renders had inconsistent grey horizons, white backdrops and uniform violet. Activated the existing bespoke SVG glass compositions for all five apps, with narrow neutral specular stops, layered contact/ambient shadows and a translucent refracting lens. Each app keeps its distinct geometry and 3D flip.
- **Weak selection and low-contrast reading:** active app names now use ink and stronger weight with one violet arrow; descriptions use readable charcoal. Statement words start at 50% ink before scrubbing to full ink. Direct app selection updates the Lenis target and the viewport together. Reduced-motion selection has no flip.
- **Flat process glass:** replaced broad lavender refraction with neutral transparent stops, a narrow white highlight and a defined inner edge. Separated contact, middle and ambient shadows while preserving the original shards-to-ring morph and GSAP Flip.
- **Abrupt chapter transitions:** paper and grey share the existing scroll background tween. The sole charcoal chapter has 48px feathered edges; its incoming overlap stays within the process section's bottom breathing room. The following white section stays in normal document flow. Static reduced-motion chapters preserve paper/grey colors.
- **Underpowered footer composition:** increased the Seer mark to a bounded 640px desktop footprint, aligned it with the page gutter and gave the links four columns. Added the already-verified ecosystem destinations while retaining all existing links. Primary actions share 52px desktop/48px mobile sizing and a restrained layered shadow.

### Source critique pass

Inspected the actual hero poster and all six application/trust renders in a contact sheet. Inspected the full landing source, motion hooks, product copy and destination evidence. Consolidated styles; preserved all features, video playback, Lenis lerp .09, line/word reveals, pointer tilt, magnetic actions, navigation hide/reveal, app flips and process morphs. No dependencies, stats, numbered labels, cards or placeholder controls added.

### Verification and second correction pass

Local Vite listener failed with listen EPERM 127.0.0.1:5188; Playwright's installed Chrome launch exited with SIGABRT under this sandbox. No live viewport, overflow, collision, keyboard or scroll verification is claimed.

Used the installed Inter Tight font via Pillow to measure headlines. At 390, adjusted app/process display to about 42px so their deliberate lines fit a 358px column rather than wrapping into extra lines. Bound desktop app optics to available viewport height; aligned process pin breakpoint to its CSS layout at 769px. Changed the shared margin reset to :where so it cannot override intentional section spacing. Checked dark chapter negative margin against its neighbor's padding. Ran SSR structural checks for all six sections, five tabs, five panels, five geometries, unique SVG identifiers, real destinations and media file existence. CSS parsing passed for all six stylesheets. Body/control contrast: charcoal on mist 7.82:1, secondary on paper 6.50:1, inactive controls on mist 4.99:1, white on violet 5.27:1, trust body on charcoal 11.01:1. Scroll flip midpoint aligns with active selection; runtime interaction remains unverified.

Validation: npm run build (TypeScript and Vite) required after the final corrections; result recorded below.

Final build result: npm run build exited 0. TypeScript passed; Vite built in 1.92s. Existing shared bundle-size and product mixed-import warnings are non-failing. The SSR/asset/contrast check passed after all final code changes.


## Current eight-point art direction pass

Evidence: the ten attached viewport slices are blank. Read overnight/ART_DIRECTION.md, overnight/BENCHMARKS.md, EF_KIT_VALUES.md, the shared rules located in ../docs, landing source, and the actual hero and Kleros images. Findings describe source and asset defects; they are not a live screenshot assessment. Changes are confined to src/seer-2026.

- Cramped hero rhythm: four lines at .96 leading and a tightly framed film competed for attention. Set leading to 1.02, a 448px support measure, 144/96px desktop breathing room, and a 640px art track with intersecting edge masks. Retained the authored prism film and cursor tilt.
- Accidental statement wrapping: a free-flow 112px paragraph gave no deliberate editorial rhythm. Use three authored desktop lines at 104px, 72px at tablet, and natural 56px mobile wrapping. Keep word highlighting; raise initial ink opacity to .62 for legibility.
- Tiny signal diagram: a 500:360 SVG fitted into a shallow wide frame occupied only the center of its column. Let it span the 62% art column, preserve stroke alignment, and declare the signal transform origin in view-box coordinates.
- Excess application-stage void: the two-line title and square SVG padding constrained the main visual. Share one desktop heading line when space permits, enlarge optics within the viewport, and tighten the SVG view box around the geometry. Preserve the 2800px scroll runway and all five distinct compositions.
- Weak selection hierarchy: small, nearly equal names did not establish a clear reading order. Increase desktop names to 44px, retain readable secondary ink, add a restrained violet selection rule, and align copy with the menu. Selection follows actual flip-timeline time on desktop and mobile, preserving direct and keyboard control.
- Uniformly milky glass: broad translucent stops and low contact contrast flattened optics and the process ring. Narrow highlights, deepen neutral refraction edges, reduce the overlay blur, and separate contact/middle/ambient shadows. Retain GSAP Flip, shards, sealing, and all motion.
- Washed-out Kleros art: inverting a white studio image turned its environment into a grey wash and its lit pillars dark. Use an instance-specific SVG luminance transfer to keep highlights and suppress the studio backdrop, then screen against exact #0E0E12. Preserve the image, word resolution and parallax. Balance the 45/55 split and feather both chapter edges.
- Disconnected footer: an oversized gap and uneven identity/copy weight weakened the end of the story. Share chapter spacing tokens, shorten the footer gap, rebalance the wordmark to 544px, and increase the footer proposition to 36px. Keep every action and all four destination groups.

Second correction pass: measured local Inter Tight at 320, 360, 390, 901, 1024 and 1440. Corrected the narrowest application labels and short-height pin layouts. Verified six sections, five tabs/panels/optics, unique SVG IDs, existing media/destinations and all six CSS files through SSR and CSS parsing. Body contrast passes: primary copy on paper 8.74:1; secondary on mist 5.81:1; white on violet 5.27:1; trust detail on charcoal 11.01:1. Inspected a luminance-transfer simulation of the actual Kleros asset; this is an asset preview, not a browser screenshot.

Live-browser verification remains blocked: Vite listener returns EPERM on 127.0.0.1:5188; installed Chrome aborts during Playwright launch. No rendered overlap, runtime scroll, performance or keyboard assertions are claimed. Existing Lenis, animation hooks, pin runways, media, links and reduced-motion branches remain in source. No numbered labels, statistics or new dependencies were added.

Build verification: the first full npm run build after implementation passed (TypeScript and Vite, 1.99s). Final verification encountered concurrent out-of-scope edits: Opportunity records.ts missing archiveEvidenceFor and Risk AssetSelector.tsx missing AssetSort. A retry cleared the Opportunity error; Risk remains under verification. No product files outside the landing were changed.

Final build result: npm run build exits 2 solely because src/products/risk/components/AssetSelector.tsx:58 references AssetSort without importing the existing type from ../data/types. The user restricts changes to the named landing folder, so that Risk file was not edited. The landing passed SSR, asset, CSS, type-measure and contrast checks; the final whole-project build is blocked by this external type error.

## V4 landing correction

The nine supplied v4 viewport captures are blank; the owner reference is visible. Findings below are source-level, pending browser verification.

1. Hero fan crossed the headline plane: assigned it an independent grid track and local input geometry.
2. Visuals occupied mismatched frames: application canvases now use their authored 8:7 ratio and the process uses 10:7.
3. Crowded outcome labels: reserved fixed label/value columns and widened the mobile market area.
4. Uneven spacing: statement and invitation share chapter spacing; applications reserve header clearance.
5. Cropped trust artwork: removed its 112% overscan and negative horizontal margin.
6. Low-contrast intermediate states: increased statement, process panel and price opacity while preserving reveals.
7. White chapter seams: feather edges now reference the actual paper token.
8. Mobile overlap and excessive copy reservation: stacked fan remains in normal flow, narrower headline scale, usable minimum bar width, natural app-description height.

Kept Lenis, scroll pin runways, app flip timelines, line reveals, word highlighting, links, keyboard selection and reduced-motion branches. Only src/seer-2026 source edited.

Validation: npm run build passed (tsc --noEmit and Vite; built in 2.85s). Vite reports a non-failing large-chunk warning. Live QA attempted: npm run dev fails with listen EPERM 127.0.0.1:5188. No browser collision, transition or performance verification claimed.


## V4 focused repair, 2026-10-23

Source audit against COMMON.md and the visible owner reference. The nine supplied landing slices are blank; no rendered defects are inferred from those images.

1. Hero collision risk: bounded the fan to its own clipped grid track, reduced headline width, and reserved tablet node clearance.
2. Unreadable visuals: replaced clipped moving Seer App chips with four complete, labeled market rows; enlarged shared diagram labels and separated Deep's header from its selected probability.
3. Misaligned labels: standardized outcome heading/row insets, price columns and caption alignment; shortened the Futarchy authority label to fit its region.
4. Weak spacing: budgeted pinned title, menu, description and artwork against the viewport; reserved mobile description space so tab changes do not shift the diagram.
5. Cut-off artwork: made both canvas helpers fill the measured stage, removed render zoom and retained complete market rows rather than partially clipped marquees.
6. Low contrast: darkened hero prices, thickened price bars and raised secondary juror ink on charcoal.
7. Janky transitions: reduced application rotations from 75 to 18 degrees and render drift from 3% to 1%; preserved the existing scroll timeline, midpoint selection, pin runway and text reveals.
8. Mobile overlap: increased outcome row height to 44px, reserved a taller fan stage, allowed action groups and footer text to wrap, and tightened navigation at 360px.

Verification: live Vite startup attempted and rejected by sandbox with listen EPERM on 127.0.0.1:5188. Browser collision, visual parity and performance checks remain unverified. No dependencies or files outside src/seer-2026 changed. Production build result recorded after final edits.

Final validation: npm run build passed after all source edits (TypeScript and Vite, 2.93s Vite build). Vite retains its non-failing large-chunk warning.


## Current correction pass

Eight source-level repairs: wider hero diagram track and smaller headline; solid thicker outcome bars; shared heading/row alignment with more node clearance; consistent paper and chapter spacing; shorter-height desktop pin budgets; clearer chapter boundaries without white gradient wash; direct mobile tab crossfades without intervening products; taller mobile fan with 48px rows and stable app copy space. Captions now explain what to read from each diagram. Desktop scroll choreography and text reveals retained.

The supplied landing slices are blank. Live visual QA remains blocked by sandbox listen EPERM on port 5188, so rendered collision and performance checks are not claimed. Build validation follows below.
