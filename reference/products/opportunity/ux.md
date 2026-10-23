# ux.md: Opportunity Markets, user-centered analysis (Phase B)
Evidence ids refer to products/opportunity/audit (AUDIT_SUMMARY.md, sitemap.md state ids) and audit_wallet (mock read-only wallet, W-ids = audit_wallet state ids). Anything not observed is tagged [unverified].

## 1. Jobs to be done
The live copy defines four roles, only two of which have any UI: traders (trade panel), readers (archive/landing). Sponsor and submitter exist as copy only (001, 002 rules card, 009 "winning entry receives $3,000").
| Who arrives | With what question | Decision they make |
|---|---|---|
| Newcomer (from a Seer link/X post) | "What is this, is it worth my time?" | Trade now, bookmark, leave |
| Trader / analyst | "Which submission is mispriced, and is the odds move real?" | Buy/sell an outcome, size, exit |
| Sponsor / DAO member [copy-only role] | "Is the crowd narrowing 235 entries to a short list I can review?" | Which top N to review, when to decide |
| Submitter [copy-only role] | "Is my entry rated, how high, who is ahead?" | Keep pushing, trade own entry |

## 2. Personas
1. **Mina, newcomer (DAO contributor, no prediction-market experience).** Knows what a Seer logo is. Wants to understand in seconds why a name contest is a market. Pain: 001 chips are text; market page 002 looks like a generic list; "5.9% $0.059" unlabelled.
2. **Dario, trader (Polymarket regular).** Wants rank, delta, depth, and a readable price history. Pain: chart y-axis 0-24 crushed (002 s2-s4); no 24h delta anywhere; default outcome Symbiont rank 27 (002); no liquidity/depth per outcome.
3. **Ines, sponsor (Seer One team member picking the name).** Wants a shortlist she can review and a clear "I decide" moment. Pain: nothing shows the sponsor step, deadline or review state; finalize shows only winner (009).

## 3. Primary tasks (clicks counted from observed UI; [unverified] = needs connected trade)
| # | Task | Observed path | Clicks / time | Where it fails |
|---|---|---|---|---|
| T1 | Understand the product | `/` read hero + 5 chips | 0 clicks, ~45s reading 212 words | Chain is text; sponsor step not shown as authority (001) |
| T2 | See who is leading | `/` pilot card or market top rows | 0-1 | Fine, but % and $ unlabelled; leader flips live (W002 shows SAI 6% above delegateyourjob.ai 5.9%, 001 showed the opposite) |
| T3 | Find a specific submission | market page, type in "Search 235 outcomes" | 2 | Keeps original ranks, no highlight of match (004) |
| T4 | Read why the odds moved | scroll to Price history | 1 scroll (list is 27 rows tall first) | Chart crushed, legend 10 of 235, no event markers (002 s2-s4, 018 s3) |
| T5 | Buy an outcome | Pick outcome in dropdown (default Symbiont) -> amount -> connect wallet | 4+ [unverified after connect] | Row click does not obviously set the trade outcome; wallet modal is a white light-theme dialog on dark UI (W002); button changes to "ENTER AN AMOUNT" |
| T6 | Check result / redeem | archive -> finalized market -> winner panel -> connect wallet to redeem | 3 | Winner and 1.00 sDAI/share shown (009) but final odds 80.1% vs payout confusion; list unsorted by odds (009 s1) |

## 4. First-5-seconds test
A stranger should understand: *a crowd prices 235 submissions; the price decides which few the sponsor reviews; the sponsor still decides.* Currently the page communicates: a headline about AI review cost and five text chips (001), and on the market page a generic trading list. Words on first screen today: 212 on `/` (about 70 above the fold), 121 on the market page before the outcome list. Nothing moves, nothing shows 235 becoming a few.

## 5. Heuristic evaluation (Nielsen, with evidence)
| Heuristic | Finding | Evidence |
|---|---|---|
| Visibility of system status | No "deadline / decision pending / sponsor reviewing" state; closed vs finalized naming differs | 005 vs 009 |
| Match with real world | "Outcome", "submission", "name", "opportunity", "market" used interchangeably | copy-inventory |
| User control | Selecting an outcome sets URL `?outcome=N` with no visible feedback (finalized) | 010-016 |
| Consistency | Finalized list not sorted by odds, live list is | 009 s1 vs 002 |
| Error prevention | Trade panel preselects rank-27 outcome with unexplained TRADING badge | 002 s2 |
| Recognition over recall | % vs $ unlabelled; "+" suffix on archive odds ("80.1%+") | 005, 009 |
| Flexibility | No sort/filter beyond text search; 235 rows in one page of ~22,000px | 003 |
| Aesthetic/minimal | Sound; chart is the exception (stepped lines, spikes) | 002 s2 |
| Help | No tooltip/tour at all; wallet explanation absent | AUDIT_SUMMARY |
| Error recovery | Unobservable: failed trades [unverified] | |
Laws of UX in play: Hick (235 options, no narrowing), Miller (10 legend items, 27 rows), Von Restorff (nothing marks the leader or the sponsor decision), Doherty (live odds without any tick feedback), Jakob (looks like generic exchange so users expect a book/depth).

## 6. Success criteria for the redesign
| Metric | Today | Target |
|---|---|---|
| Time-to-first-insight (who leads, how sure, what happens next) | >25s, needs reading (212 words) | <= 5s without scrolling |
| Words on first screen (market page) | 121 before the list | <= 40, explanations on demand (tooltips/tour) |
| Clicks to buy a chosen outcome (pre-connect) | 4+ | <= 2 (row click sets outcome and amount focus) |
| Clicks to read why odds moved | scroll + squint | 1 (hover/scrub shows move and its size) |
| Find any of 235 submissions (130 unpriced, 44 tied at floor) | search only | search + rank jump + filter, 1 interaction |
| Sponsor vs market authority distinguishable | no | yes, without text (separate lane and colour: violet market, amber sponsor) |
| Comprehension of signature visual w/o text | n/a | stranger can say "many entries narrow to a few" in 5s |
| Layout | overflow free at 320-2560 | same + 235-row scroll at >= 55fps |
