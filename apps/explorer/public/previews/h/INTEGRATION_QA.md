# Correct repository integration QA

Validated 25 October 2026 (Asia/Calcutta) against StartwithDot/seer-redesign-2026 main b0f723bb2040c389c99be29376fde139a3bc4807. Fresh root production build served at http://127.0.0.1:5326. These results describe this corrected target, rather than the earlier source-lineage repository.

- Root TypeScript/Vite build: passed with unchanged upstream source and configuration. Deep isolated build: passed. Existing large-chunk warnings and upstream lens.jpg URL warning remain.
- Explorer: 152 passed cases across trade opening (5), panel scrolling (9), dropdowns (5), reference parity (44), alignment (13), contrast (74), and performance/reduced motion (2).
- Deep: 29 passed cases across fixture/independent-pair parity (5), flows (16), and navigation (8). All 16 frozen fixture hashes remain unchanged.
- Deep network sweep: 64 route/theme/viewport cases passed without interception, zero unexpected errors. One external avatar URL failed with a rendered fallback; it is recorded in reports/network.json.
- Deep performance: 7 active workloads passed the 16.67 ms p95 budget (measured p95 7.1-14.0 ms), plus 3 settled/offscreen lifecycle checks. Headless timing is not a physical display refresh measurement.
- Combined navigation: 4 desktop/mobile and dark/light cases passed, including 41 Explorer markets, 98 Deep pairs, theme retention, no horizontal overflow, zero local asset errors and zero page exceptions. Eight fresh screenshots were visually reviewed and retained in the local combined-review archive.

Total: 259 passing checks; no failed assertions. Compact evidence is in Explorer checks/results and Deep reports, including supplemental parity/flows/navigation. Historical design QA reports remain identified as historical.

Deployment: all 121 runtime files match their source or compiled Deep build by SHA-256. Run checks/sync-public.mjs --check after building Deep to repeat the comparison. Both source and public deployment copies are committed; root Vite copies public into dist.

Protection: all 4,644 pre-existing upstream tracked files were hash-compared unchanged in both the isolated integration and original local checkouts. Only four new product directories are added. No landing, main router, root manifest/lockfile/configuration, or existing upstream asset is changed. Existing SPA /explorer and /deep routes remain unchanged; preview entry paths are /explorer/previews/h/index.html and /deep/previews/h/index.html. The Apps menus link these additive previews to each other.

The original local checkout was updated to corrected upstream main while retaining the old branch, stash, verified external backup, product source, dependencies and full QA archives. The original 53 Deep source files were rechecked unchanged before copying integration updates locally.
