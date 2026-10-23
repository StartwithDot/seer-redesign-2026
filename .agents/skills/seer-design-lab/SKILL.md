---
name: seer-design-lab
description: Enforce the Seer Electric Foundation design research, design-system architecture, multi-concept landing-page prototyping, and real-browser visual QA workflow. Use when researching, designing, implementing, or reviewing Seer landing-page concepts and connected Information Finance product interfaces.
allowed-tools: client google
---
# Seer Design Lab

Enforce a studio-grade workflow for Seer's Electric Foundation rebrand and six-interface Information Finance ecosystem.

## Summary

Guide product architecture synthesis, official Electric Foundation token enforcement, reference transformation, three-concept landing-page prototyping, and iterative browser visual QA before advancing to secondary product surfaces.

## When to Use

- Designing or iterating on Seer landing-page concepts (`/design-lab`, `/design-lab/concept-a`, `/design-lab/concept-b`, `/design-lab/concept-c`)
- Auditing or extending the Electric Foundation design system tokens, typography, and component primitives
- Conducting visual reference transformation for Seer's six connected surfaces (Homepage, Seer App, Deep, Futarchy, Opportunity Markets, Risk Pricing)
- Running multi-viewport (1440px, 1024px, 390px) and dual-theme (dark/light) browser verification passes

## Steps

1. **Ground in Product Truth and 2026 Positioning**
   - Verify every claim, metric, and product capability against audited Seer documentation, live crawl fixtures, and official 2026 communications (`Information Finance infrastructure for the agentic economy`).
   - Distinguish live protocol mechanics (Conditional Tokens, Reality.eth, Kleros, Gnosis Chain sDAI/xDAI, Optimism sUSDS) from experimental initiatives and long-term vision.
   - Never fabricate trading volumes, customer counts, partnerships, or automated governance claims.

2. **Enforce Electric Foundation Brand Compliance**
   - Anchor all concepts in the official EF palette: Dark (`#101013` page, `#1A1A1E` card, `#1F1F24` nested, `#EDEDF2` primary text, `#A8A8B3` secondary text, `#67676F` muted) and Light (`#F7F7F9` page, `#FFFFFF` card, `#F1F1F4` nested, `#17171C` primary text, `#5C5C66` secondary text, `#8E8E99` muted), with primary electric violet (`#7A3CFF` / `#7B3AFF`) and secondary violet surfaces (`#241E33` dark / `#EFE9FC` light).
   - Reverse the EF line motif as mandated by Seer: one line enters from the left and fans out into multiple parallel lines to the right (representing one question branching into many outcomes).
   - Document and justify every semantic extension (such as risk bands or conditional comparison axes) in `EF-BRAND-AUDIT.md`.

3. **Transform References into Original Compositions**
   - Follow the transformation chain: Observed pattern -> underlying principle -> user need -> Seer-specific meaning -> original visual implementation.
   - Reject generic SaaS and crypto tropes: no centered slogan + two pills hero formula, no unexplained glowing orbs, no three-identical-icon-cards rows, and no fake dashboard decorations.

4. **Design for Both Question Askers and Traders**
   - Answer within five seconds: What Seer is, why it exists, why its six applications belong together, and what the visitor can do next.
   - Make explicit for every market surface: who asks the question, what the market prices, how decision-makers use the signal, and who retains final authority.

5. **Execute Multi-Pass Real Browser Visual QA**
   - Start the local development server and verify live HTTP responses before inspecting or reporting URLs.
   - Capture viewport-by-viewport screenshots at 1440px, 1024px, and 390px across both dark and light themes.
   - Check for zero horizontal overflow, zero text/label collisions, tabular numerals (`tabular-nums`), >= 40px touch targets, and WCAG 2.2 AA contrast.
   - Perform at least two critique-and-fix passes per concept and record findings in `VISUAL-REVIEW.md`.

6. **Respect the Stage 1 Approval Gate**
   - Deliver three distinct, interactive landing-page skeletons and a comparative 100-point rubric evaluation.
   - Stop and wait for explicit user direction before building the final complete homepage or the five specialized product interfaces.

## Gotchas

- Never use em-dashes in documentation or UI copy.
- Do not let offscreen canvases capture blank in full-page screenshots; scroll into view before capturing.
- Never present Futarchy TWAP recommendations or Opportunity Market odds as binding automated decisions; human voters and sponsors retain final authority.
