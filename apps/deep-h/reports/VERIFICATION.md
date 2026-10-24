# Verification record

Generated 2026-10-24T21:53:07.803Z. Status: **required measured checks passed**. Local preview: http://127.0.0.1:5203/#/ (also /deep/).

Only apps/deep-h is authored. Original source revision cebb9ad60ce06ceae9e33d6048d1fe446f77eb4f, fixtures and sibling workspace files are preserved. See README.md for runnable commands and REDESIGN_NOTES.md for all sixteen intents and source discrepancies.

| Check | Expected | Passed | Failed | Unverified |
|---|---:|---:|---:|---:|
| Copied e2e | 588 | 588 | 0 | 0 |
| Fresh functional/UI-law rerun | 154 | 154 | 0 | 0 |
| parity | 5 | 5 | 0 | 0 |
| alignment | 4 | 4 | 0 | 0 |
| menus | 8 | 8 | 0 | 0 |
| scroll | 8 | 8 | 0 | 0 |
| charts | 3 | 3 | 0 | 0 |
| flows | 16 | 16 | 0 | 0 |
| navigation | 8 | 8 | 0 | 0 |
| contrast | 4 | 4 | 0 | 0 |
| accessibility | 5 | 5 | 0 | 0 |
| Semantic repository/wallet controls | 696 | 696 | 0 | 0 |
| Expanded menu matrix | 28 | 28 | 0 | 0 |
| Shared header | 4 | 4 | 0 | 0 |
| Viewport/theme captures | 14 | 14 | 0 | 0 |
| Meaningful state captures | 208 | 208 | 0 | 0 |
| Unintercepted network | 64 | 64 | 0 | 0 |
| Performance workloads | 7 | 7 | 0 | 0 |
| Settled animation checks | 3 | 3 | 0 | 0 |
| Native wheel/touch surface matrix | 32 | 32 | 0 | 0 |

Build: TypeScript + Vite passed. One inherited large-chunk warning remains because real fixtures are bundled. Exact output: build.log; asset byte counts/hashes: build-manifest.json. No new runtime libraries.

The complete copied suite has all 588 viewport/test cases covered, from 280 unchanged named registrations. The initial completed attempt was 587 pass / 1 fail: the original Guide setup selector threw an invalid-selector error. The corrected affected case passed; prior attempt and exception remain in copied-final-attempt1-results.json and copied-final/coverage.json. The fresh functional rerun and menu matrix additionally check the final implementation. The source serial orchestrator remains as npm run e2e:serial. The portable npm e2e orchestrator changes isolation/recording, not registrations or assertions; checkpoint continuation is explicitly recorded.

## Measurements

Chrome 155.0.8059.86, Windows 10.0.26300, DPR 1; 11th Gen Intel(R) Core(TM) i5-11400H @ 2.70GHz, 12 logical processors, 15.73 GiB RAM. Headless testing only. Both themes and 1920×1080, 1440×900, 1280×800, 1100×800, 820×1000, 390×844 and 1440×700 are captured. State captures use reduced motion; performance uses no-preference. Runtime reduced-motion switching is covered by copied UI20 and supplemental charts.

Measured minimum text contrast: 5.40:1. Minimum meaningful graphic/stroke contrast: 3.08:1. Measurements include composited Canvas foreground over plot/lens/quantile surfaces and actual SVG mark outlines, merged-wallet rings and label fills. Exact samples: supplemental/contrast.json. Redundant context grid/band fills are not claimed to meet foreground contrast.

| Performance workload | Frame p95 ms | Missed 60Hz intervals | Long tasks >50ms | One-core task CPU |
|---|---:|---:|---:|---:|
| 98-series chart replay | 13.90 | 11 | 0 | 87.86% |
| nearest-line hover | 7.10 | 1 | 0 | 25.81% |
| Split to Swarm transition | 7.10 | 2 | 0 | 17.26% |
| Swarm five layers and picking | 7.10 | 0 | 0 | 23.56% |
| Swarm 98-repository replay | 14.00 | 8 | 0 | 90.69% |
| Replay after navigating away; Canvas unmounted | 7.10 | 0 | 0 | 22.32% |
| 3517-outcome inner wheel scroll | 7.10 | 0 | 0 | 36.30% |

60Hz budget is 16.67ms, with 0.1ms timer quantization tolerance for p95. RAF sampling is not a physical display refresh measurement. Total missed intervals: 22; target is not a claim of zero dropped frames. Stopped/offscreen-completed replay has zero application RAF callbacks and zero Canvas paints in each 2.5-second sample. Operational replay continues its bounded 12-second timeline after navigation; Canvas unmounts. Memoizing the unrelated leaderboard reduced the sampled offscreen render cost from 99.82% to 22.32% of one core. Full distributions, long-task entries and scope are in performance.json; before measurements are retained.

Network: 64 route/theme/size combinations, 0 unexpected events. Remote avatar failures remain recorded individually and use the address-derived fallback; this does not claim the third-party avatar server was repaired. Injected fixture errors/rejections are separately identified in their state/flow checks. No broad error allowlist was added.

## Evidence and limits

- baseline-partial.json records the interrupted source baseline: 322 pass, 13 fail, incomplete. baseline-suite.log is retained. No green or complete source baseline claim.
- after/manifest-all-states.json merges the 204 original reached states with the latest 40 affected captures into 208 unique state/theme/size cases, with observed route/control data, action sequences and PNG hashes. Filename alone is never the evidence.
- viewed-screenshots.json and viewed-contact-manifest-1.json record composition and individual-image review. The independent review found and corrected mobile SVG sizing, endpoint dates, archive metadata hierarchy, Funds confirmation visibility and compact map annotations/captions. Impeccable before/after reports are manual; the unavailable engine is not reported as having run.
- source-skip-inventory.json records every retained source skip/disposition and stronger supplemental coverage. Dense plot marks retain exact source geometry and overlapping hit regions; full identities and equivalent 40px-or-larger table/list controls provide selection alternatives. The report does not claim every SVG dot itself is a 40px target or independently pointer-clickable at an overlapping center.
- The supplied handoff image/control inventories and some lineage documents are absent from the repository. Parity is verified against the retrieved source/fixtures and fresh baseline, not missing captures.
- Funding, creation, conversion, strategy execution and balances remain local mocks. The shared Copy address action intentionally copies the documented mock label 0x0000…dEaD. Shared and App disconnect paths remain distinct. No live financial integration is introduced.
- The Apps Deep entry is loaded natively in the isolated preview, including all 98 fixtures. Other product destinations retain their native paths; those other apps are outside this package and destination navigation is tested using explicit fixtures.
- Other browsers, platforms, DPRs, live wallets and production hosting are not verified. No commits, pushes or deployment.

## Commands used

From apps/deep-h: npm run build; npm run preview -- --host 127.0.0.1 --port 5203 --strictPort. Complete copied run: DEEP_URL=http://127.0.0.1:5202 DEEP_SUITE_NAME=copied-final DEEP_WORKERS=4 DEEP_RESUME=1 npm run e2e; final affected rerun targets 5203. Fresh functional rerun targets 5203 with DEEP_TEST_FILTER=^(?!dead_controls|shots\.) and DEEP_RESUME=0. Supplemental: node checks/verify.mjs; node checks/menu-matrix.mjs; node checks/shared-header.mjs; node checks/dead-controls.mjs; node checks/qa.mjs; node checks/states.mjs; node checks/network.mjs; node checks/perf.mjs. PowerShell syntax and environment setup are in README.md.
