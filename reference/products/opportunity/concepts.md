# concepts.md: Opportunity Markets (Phase D)
Common ground (all concepts): EF skeleton; violet = market odds; amber = sponsor authority; green/red only for deltas; kinetic but fast (140-420ms springs); 235-row list stays as the detail layer; sample data uses the real tier structure (8 leaders, ~53 priced, 46 floor-tied at 0.4%, 130 unpriced; sum 99.0%). Vocabulary from copy-inventory only.

## Concept 1: "The Cut" (coverage curve hero)  [recommended]
- Thesis: Odds are a triage queue: review k entries, cover c% of the crowd's money; the sponsor still decides.
- World: a Lorenz-style curve of coverage C(k) over ranked entries with a draggable cut line. Left of the cut = review lane (violet dots, FLIP-sorted); right = rest of the field. A locked amber lane at the end holds the sponsor decision (padlock until decision).
- Hero: wide card: curve (hand-drawn SVG/canvas), cut handle, live readout "27 of 235 · 60.4%" and "Review saved 89%". Under it the ranked board (72px rows).
- Signature animation: when odds tick, dots slide along the curve by spring (distance = rank change), the cut readout rolls; floor-tied entries merge into one "44 tied" cluster that expands on hover. Math: C(k), S(k) = 1 - k/N (innovation.md s2).
- Fixes (AUDIT_SUMMARY): #1 invisible idea, #2 crushed chart (replaced by readable curve + per-outcome sparkline on hover), #3 unlabelled % vs $, #5 inconsistent sort, #7 235-row list, #11 unpriced tier.
- Alternative view: "Field" beeswarm (position = log odds).

## Concept 2: "The Field" (beeswarm)
- Thesis: The crowd's attention is a landscape; a few peaks, a long flat floor.
- Hero: x = odds on a log scale, dots packed by collision (area = odds), tiers as bands (priced / floor / unpriced dust), sponsor lane separate at right.
- Animation: odds ticks nudge dots, packing re-relaxes (Verlet, 1 ms/frame measured).
- Weakness: reading exact rank and trading requires the list anyway; log axis is a newcomer trap (Hick/Miller fine, comprehension in 5s weaker).

## Concept 3: "The Ladder" (rank board with bump lines)
- Thesis: Rank is the story: who moved up, who fell.
- Hero: top 15 as a bump chart over the last 14 days with direct end labels; below, rows with rank chevrons.
- Animation: FLIP row reorder + line morph on tick.
- Weakness: closest to a generic leaderboard (Jakob), says nothing about 235 or the sponsor; rank history data needs the market-chart endpoint (exists) but early liquidity spikes distort ranks (002).

## Scoring (0-5) against ux.md criteria and identity guide
| Criterion | C1 Cut | C2 Field | C3 Ladder |
|---|---|---|---|
| Insight in 5s (who leads, how sure, what next) | 5 | 3 | 4 |
| Comprehension without text (signature visual) | 4 | 3 | 3 |
| Fixes sponsor-vs-market authority | 5 | 4 | 2 |
| Handles 235 + unpriced tiers | 5 | 5 | 2 |
| Clicks to buy <= 2 | 4 | 3 | 4 |
| Differs from Futarchy / other products | 5 | 4 | 2 |
| Build risk (time to 23:59 Oct 23) | 3 | 3 | 4 |
| Total / 35 | 31 | 25 | 21 |

Why the others lose: C2 trades legibility for beauty and still needs the list for every task; C3 repeats the generic exchange/leaderboard pattern and ignores the real concentration story.
Decision pending: the user picks (one question).
