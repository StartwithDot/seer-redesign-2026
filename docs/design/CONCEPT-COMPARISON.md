# Three-Concept Scoring, Comparison, and Selection Framework

Date: 2026-10-22
Scope: Stage 1 Concept Evaluation (`poidh2/docs/design/CONCEPT-COMPARISON.md`)

## 1. Executive Summary of the Three Directions

| Attribute | Concept A: The Protocol Ledger | Concept B: The Signal Field | Concept C: The Decision Workbench |
|---|---|---|---|
| **Preview Route** | `/design-lab/concept-a` | `/design-lab/concept-b` | `/design-lab/concept-c` |
| **Strategic Archetype** | Protocol / Infrastructure (Editorial & Architectural) | Signal / Spatial Experience (Cinematic Canvas Topology) | Intelligence / Product Experience (Interactive Workbench) |
| **Core Visual Thesis** | Positions Seer as an institutional settlement and oracle ledger (`FIG 0.1 - 0.5`) beneath six specialized applications. | Visualizes Information Finance as a living 3D-perspective beam where one question enters on the left and branches into six surface nodes. | Lets visitors immediately experience Seer's utility across all 6 surfaces and toggle between Decision Maker, Trader, and AI Agent JSON modes. |
| **Signature Seer Element** | Interactive `FIG 0.1` Reversed EF Signal Topology Blueprint + Dual-Reader Switch + Full 6-Surface Architectural Ledger Table. | HTML5 Canvas 3D-Perspective Fan-Out Signal Network with deterministic signal packets, 6-Node Selector Bar, and Spatial Telemetry HUD. | Live Multi-Surface Decision Workbench + 3-Mode Reader Switch (`Decision Maker` / `Trader` / `AI Agent Schema`) + Authentic EF Two-Card Trade Ticket. |
| **Total Rubric Score** | **92 / 100** | **90 / 100** | **94 / 100 (Recommended)** |

## 2. 100-Point Rubric Evaluation Matrix

| Criterion | Weight | Concept A | Concept B | Concept C | Justification & Deduction Notes |
|---|---:|---:|---:|---:|---|
| **1. Electric Foundation brand fidelity** | 15 | 14 | 14 | **15** | All three strictly use EF surfaces (`#101013`/`#1A1A1E`/`#1F1F24` dark; `#F7F7F9`/`#FFFFFF`/`#F1F1F4` light), `#7A3CFF` primary violet, `#241E33`/`#EFE9FC` secondary, and the reversed fan-out motif. Concept C scores 15/15 for embedding the exact two-card EF Trade Ticket from `trade-ticket.png`. |
| **2. Distinctiveness and artistic quality** | 15 | 14 | **15** | 14 | Concept B achieves the highest spatial drama via its custom Canvas beam projection and full-width `#7A3CFF` architectural chapter panel. Concept A (-1) is intentionally restrained; Concept C (-1) prioritizes functional instrument density. |
| **3. Seer product communication** | 15 | 14 | 13 | **15** | Concept C communicates both the *Question Asker* and *Trader / AI Agent* workflows interactively in the first viewport. Concept B (-2) requires clicking nodes below the canvas to read all six product specifics. |
| **4. Navigation & ecosystem discoverability** | 15 | **14** | 13 | **14** | Shared 6-surface Ecosystem Mega-Menu makes every interface 1 click away. Concept A's full-width Ledger Table and Concept C's 6-Surface Workbench tabs expose all six interfaces effortlessly. |
| **5. Typography & visual hierarchy** | 10 | **10** | 9 | 9 | Concept A's editorial `FIG 0.1 - 0.5` hierarchy and asymmetric split grid achieve 10/10 clarity. Concept B and C (-1) pack slightly denser telemetry into the first viewport. |
| **6. UX clarity & behavioral reasoning** | 10 | 9 | 8 | **10** | Concept C's explicit 3-mode switch (`Decision Maker` / `Trader` / `AI Agent Schema`) directly resolves the newcomer comprehension gap between reading a signal and placing a trade. |
| **7. Interaction & motion quality** | 5 | 4 | **5** | **5** | Concept B's deterministic signal packet canvas and Concept C's live ticket & lens switcher feel responsive and purposeful. Concept A (-1) relies on quieter state switches. |
| **8. Responsive execution (1440 / 1024 / 390)** | 5 | **5** | **5** | 4 | All three collapse cleanly down to `390px` without horizontal overflow. Concept C (-1) has a slightly taller above-the-fold stack on `390px` screens due to the two-card workbench. |
| **9. Accessibility & performance** | 5 | 4 | 4 | 4 | All three pass WCAG 2.2 AA contrast (`>= 4.5:1`), support keyboard `Esc` and focus rings, and respect `prefers-reduced-motion`. (-1 across all three reserved for live wallet/RPC integration tests in Phase 2). |
| **10. Scalability across six products** | 5 | 4 | 4 | 4 | The shared `src/design-system/` tokens and component primitives scale directly to Explorer, Deep, Futarchy, Opportunity, and Risk Pricing. |
| **TOTAL** | **100** | **92** | **90** | **94** | |

## 3. Comparative Synthesis

- **Best Overall Design**: **Concept C (`The Decision Workbench`, 94/100)** because it proves Seer's Information Finance thesis through immediate, hands-on product utility while incorporating the exact EF kit trade ticket and a 3-mode reader toggle (`Decision Maker` / `Trader` / `AI Agent Schema`).
- **Most Original Visual Direction**: **Concept B (`The Signal Field`, 90/100)** for turning the mandatory reversed EF line motif into a living spatial beam network where one question visibly branches into six surface terminals.
- **Best Architectural & Institutional Communication**: **Concept A (`The Protocol Ledger`, 92/100)** for its `FIG 0.1 - 0.5` schematic clarity and side-by-side 6-surface ledger table.
- **Strongest Foundation for All Six Applications**: **Concept C + Concept A Hybrid**, combining Concept C's interactive multi-surface workbench and EF ticket components with Concept A's `FIG 0.3` 6-surface comparison ledger and Concept B's spatial fan-out canvas.
- **Largest Engineering Risk**: In Concept B, unthrottled canvas redraws on low-power mobile devices could consume battery if not gated by `IntersectionObserver` and `prefers-reduced-motion` (mitigated in our implementation).
- **Largest UX Risk**: In Concept C, exposing both the Decision Readout and the Trade Ticket in the hero requires clear visual framing so non-traders know they do not need to trade to use the signal (mitigated via the `1. Decision Maker` default mode and dual authority badges).

## 4. What Each Concept Needs Before Full Stage 2 Expansion
- **If Concept A is chosen**: Embed Concept B's animated signal packet flow into the `FIG 0.1` blueprint SVG and add Concept C's interactive `AI Agent JSON` schema preview tab.
- **If Concept B is chosen**: Add Concept A's structured comparison table below the constellation grid so analytical readers can scan all 6 surfaces in one aligned view.
- **If Concept C is chosen (Recommended)**: Incorporate Concept B's spatial fan-out beam header above the workbench and Concept A's `FIG 0.4` protocol settlement stack diagrams below the fold.
