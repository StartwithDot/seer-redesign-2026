# External resources (curated; source: research/resources_digest.md, DeepSeek read of the GitHub READMEs, filtered by Claude)
Principle: our house rules (docs/ui-quality-rules.md, product-identity-guide.md, coding-rules.md) WIN. External repos are references, checklists and generators; many assume Tailwind/shadcn defaults, which our rules forbid. Never paste a generated design wholesale: it produces the generic look we are avoiding. Check licenses before copying text.

## Adopt now (cheap, high value)
| Resource | What we take | How |
|---|---|---|
| anthropics/skills (`frontend-design` skill, Apache-2.0 for most skills) | Anti-generic design principles and the skill format | Use the same principles in the Opus review prompt; the skill can be installed as a Claude Code plugin (needs the user's OK); our own skill is already in `.claude/skills/seer-ui-quality/` |
| VoltAgent/awesome-design-md + VoltAgent/awesome-claude-design (MIT) | The DESIGN.md format (9 sections: atmosphere, color roles, typography, components, layout, depth, Do's/Don'ts, responsive, agent prompt guide) and real brand examples (Linear, Stripe, Vercel, Framer, Cohere...) | Use `docs/DESIGN_TEMPLATE.md` for every product's design.md; read 2-3 example DESIGN.md files (Linear, Stripe, Vercel) as quality references, never copy their identity |
| nextlevelbuilder/ui-ux-pro-max-skill (MIT) | Pre-delivery checklist, anti-patterns, dataviz/motion rules | Import its checklist items into the Opus review prompt and the test list; optionally run its design-system generator ONLY for ideation (palette/type ideas), then override with EF tokens |
| vercel-labs/agent-skills `web-design-guidelines` (100+ UI rules; license not stated in README: verify) | Review checklist (accessibility, theming, reduced motion, typography, performance) | Have Claude run it as a review pass against the built pages; filter against our rules |
| addyosmani/agent-skills (MIT, `frontend-ui-engineering`) | Verification-gate structure (Overview/When/Process/Red flags/Verification) | Copy the structure for product spec checklists and "definition of done" |
| agentskills/agentskills (open Agent Skills format) | `SKILL.md` packaging | Done: `.claude/skills/seer-ui-quality/SKILL.md` makes the rules auto-discoverable; Codex reads AGENTS.md |
| bergside/awesome-design-skills (MIT) | Paired SKILL.md + DESIGN.md pairs, WCAG gates | Inspiration for the tests section; optional `npx typeui.sh pull <slug>` for reference |

## Use as inspiration lists (per product research step)
- hal9ai/awesome-dataviz (+ its chart-method catalogue and MCP): choose chart forms deliberately (for Risk: log band strip plot, survival small multiples, heat matrix, bump/slope).
- sergey-pimenov/awesome-web-animation: easings, scroll/canvas/SVG animation references; Easings.net for easing curves.
- terkelg/awesome-creative-coding: noise, flow fields, particle math, shader references (Book of Shaders, canvas-sketch, Pts) for each product's signature animation.
- design-tokens/community-group (DTCG 2025.10 stable): naming/structure reference for tokens (keep our CSS variables; record DTCG alignment in design.md).
- uiverse.io (user's favorite): borrow micro-detail TECHNIQUES for crucial buttons/toggles/loaders (we already adapted the bubble-burst button); adapt to tokens; never paste unchanged.

## Skip
tenfoldmarc/website-builder-setup (overlaps, extra installs), remotion-dev/skills (video), obra/superpowers (general engineering process; optional).

## Workflow integration (how the pipeline uses these)
1. Research step per product: `python3 pipeline/product_docs.py <product> "<topic>" <urls>` (DeepSeek docs digest) + browser capture of the live UI + pick chart forms/animation references from the lists above.
2. Spec step: write products/<p>/design.md from docs/DESIGN_TEMPLATE.md.
3. Review step: Opus prompt includes the anti-generic checklist from frontend-design / ui-ux-pro-max / web-design-guidelines (see docs/handoff-project.md section 6).
4. To refresh this list: `PYTHONPATH=pipeline python3 pipeline/resource_scout.py` (gh CLI + DeepSeek); candidates in research/gh_candidates.json (141 repos from gh search).


## Libraries for innovative visuals/motion (DeepSeek digest: research/animation_libs_digest.md; verify licenses/sizes in each product's Phase C spike)
| Library | Verdict | Use for |
|---|---|---|
| motion (motiondivision/motion, MIT) | ALWAYS (already in stack) | springs, layout/FLIP, presence, scroll-linked effects |
| d3 (scales/shapes/array/random) | ALWAYS | math, paths, interpolation |
| GSAP (greensock/GSAP, now free; check plugin license) | CONSIDER for Homepage | timeline choreography, ScrollTrigger storytelling, SVG path animation |
| Lenis (MIT) | CONSIDER (Homepage/story pages) | smooth scroll synced to WebGL/GSAP |
| matter-js (MIT) | CONSIDER for Opportunity | physics sieve / Galton board with real collisions |
| ogl (~29 KB, license unclear: verify) / pixi (MIT) / three (MIT) | CONSIDER | shader backdrops, large particle fields (Deep, Risk rain view), 3D only if it explains something |
| visx (MIT) / unovis (Apache-2.0) | CONSIDER | standard chart primitives (Explorer detail) when bespoke canvas is not needed |
| Vizzu (repo is vizzuhq/vizzu-lib, the digest got a 404 on vizzu/vizzu-lib) | VERIFY | animated chart-to-chart morphing (bar -> scatter -> area) |
| rive-wasm / lottie-web | CONSIDER sparingly | designed onboarding/empty states; not data-bound |
| tsparticles | SKIP for signature visuals | generic look; confetti only |
Rule: additions need a justification row in design.md (see docs/coding-rules.md library policy) and a spike with >= 55 fps.
