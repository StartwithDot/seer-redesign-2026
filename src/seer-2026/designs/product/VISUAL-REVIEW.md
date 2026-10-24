# Product correction pass, 24 October 2026

Authority: overnight/v5/COMMON.md, overnight/v5/product.md and supplied desktop/mobile slices. All edits remain in this design folder.

Eight worst problems addressed:
1. Navigation advanced from raw scroll while the screenshot timeline lagged behind. Active state now follows the rendered timeline; each wipe finishes at the corresponding product boundary.
2. Hero caption collided with the front window. Increased the reserved stack height and gave the caption an independent control row.
3. Desktop story images extended below the pinned viewport. Frame and image height now account for browser chrome, header and heading, including the intermediate breakpoint.
4. Description labels became separate miniature headings against the brief. Restored inline bold lead-ins, larger body text and clear paragraph spacing.
5. Statement text faded below readable contrast. Scrub now interpolates from readable secondary ink to primary ink.
6. How-it-works steps started completely transparent, leaving apparent empty space. Steps stay visible while their staggered movement plays; role captions attach to each step with a fine rule.
7. Mobile product chapters had weak separation and tiny supporting copy. Strengthened titles, paragraph sizing and chapter spacing while preserving stacked independent links.
8. Footer and controls drifted in scale. Enlarged mobile wordmark, standardized footer touch targets and legal copy, corrected the downward-arrow hover direction, and added visible enlargement feedback to screenshot links.

Second source review: checked all breakpoint overrides, reduced-motion fallbacks, inactive-panel inert handling and timeline click destinations. Supplied screenshots are unchanged, including the Futarchy tour overlay embedded in the asset.

Validation: TypeScript check run; see task report for outcome. Detector reports only two font warnings; Inter Tight is explicitly mandated. Browser QA attempted: Vite fails with listen EPERM on 127.0.0.1:5188. No new rendered captures or interaction results are claimed.
