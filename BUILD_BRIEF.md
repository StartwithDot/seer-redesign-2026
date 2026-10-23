# BUILD BRIEF — Seer /seer-2026 (hero + landing)

Work ONLY inside /Users/leo/Documents/POIDH/poidh2. Never touch parent folders, .env, archive/, snow/.
Read first: AGENT_BRIEF.md, EF_KIT_VALUES.md, knowledge/ecosystem_map.md, knowledge/product_*.md, src/seer-2026/*, src/design-system/tokens.css.
Assets: assets/brand/logo.svg (official Seer logo — use it, never redraw), assets/ef_kit/ (palette), public/fonts/.
Reference image: assets/reference-hero.webp (also attached). Dev server already runs on http://127.0.0.1:5188/seer-2026 (vite, HMR). Verify with `npm run build` (must pass tsc + vite).
Existing hero in src/seer-2026 is WRONG: a flat top-down disc. Replace the sculpture, keep structure/copy plumbing if useful.

## PHASE 1 — HERO (do this fully before phase 2)
Reconstruct the reference sculpture as procedural R3F geometry, viewed in 3/4 perspective from slightly above (like the reference):
- 3 stacked, thick matte-white circular wall rings (open top, cylinders with real wall thickness, rounded edges), different heights/diameters, offset vertically; the top one is the largest, with an elliptical opening.
- Inside: a spiral/ramp ribbon (white, thick) curling down through the middle, and ONE translucent violet curved glass panel (curved arc segment, MeshPhysicalMaterial transmission-lite/opacity ~0.85, violet #6C47FF-ish; use real EF violet from EF_KIT_VALUES.md) standing inside the centre, with soft violet glow spilled on the white surfaces (use a violet point light + subtle emissive floor tint, no bloom pass).
- Matte ceramic white (roughness ~0.85), soft studio lighting (hemisphere + 1 key directional with soft shadow + fill), ground contact shadow (baked radial gradient plane or ContactShadows-like, restrained), faint violet reflection on floor beneath. Background: warm off-white, subtle vertical gradient, soft floor horizon. Sculpture sits right side, large, slightly cropped by right edge is OK, never boxed.
- No intersections/clipping/gaps. Must look good completely still.
- Motion: GSAP entrance timeline 2.8s (layers rotate gently into alignment), then very slow bounded oscillation (few degrees per layer, independent), damped pointer parallax with small limits. frameloop="demand"-style: stop rendering when static/hidden; DPR capped at 1.75; reduced-motion = no animation. Lazy-load canvas (already React.lazy) + lightweight CSS/SVG fallback that looks like the sculpture (soft grey rings + violet panel).
- HTML: nav = official logo left; right "Apps" (https://app.seer.pm/) and "Connect Wallet" (only real wallet flow if app supports it; otherwise opens https://app.seer.pm/ — never fake a connection). Eyebrow "INFORMATION FINANCE" (small, tracked). H1 "Where information becomes a market." (tight tracking, bold, black, deliberate line breaks, NO gradient text, Inter Tight). Support: "Collective forecasts, capital-backed conviction, and actionable signals. Infrastructure for decisions made by people and agents." Primary CTA "Explore Markets" (violet pill with arrow, soft violet shadow, -> https://app.seer.pm/), secondary "Learn More" (text + arrow, scrolls to next section). Text contrast must be strong (current grey text is too faint). Mobile 390px: text on top, sculpture below, no overlap.
- Fade-and-rise text intro, one sequence.

## PHASE 2 — LANDING SECTIONS (below hero, same page, hero untouched)
Keep backgrounds mostly white/off-white like the hero; shift to soft grey / charcoal only where design demands (Kleros section charcoal or monochrome, final CTA high-contrast). Seamless transitions (gradient bridges, no boxed sections). Violet only as controlled accent. No dashboards, floating cards, particles, glowing wires, fake stats, decorative labels. Use Inter Tight + existing tokens. GSAP ScrollTrigger for choreography (add to hero's gsap import; register plugin), CSS for simple stuff, ONE shared lazy R3F canvas (or SVG) for sections 02/03 geometry; pause when off-screen; DPR cap; reduced-motion respected.
01 Information Finance — big editorial headline + short paragraph; custom geometric SVG/CSS animation: several separate shapes/lines converging into one organised signal. White -> soft grey bridge.
02 Explore the Seer Applications — strongest section. Sticky editorial layout: left column list/tabs + headline + description + link; right large procedural geometry (R3F, same white-ceramic + violet-glass language) that morphs per app, accent light changes. Scroll-driven (ScrollTrigger pin) AND clickable tabs; keyboard accessible. Five apps, each with a unique minimal geometry derived from purpose, working real link:
  - Seer App — Discover, create, and trade markets. https://app.seer.pm/
  - Futarchy — Market-informed governance decisions.
  - Deep — AI prediction markets and collective evaluation.
  - Opportunity Markets — read knowledge/product_opportunity.md + apps/opportunity (../apps/opportunity, read-only) to write accurate copy.
  - Risk Pricing — Market-based estimates of financial risk.
  Get the real URLs for Futarchy/Deep/Opportunity/Risk from knowledge/ecosystem_map.md and SOURCES_INDEX.md; if a URL is unknown, mark it in a TODO list in your final report rather than inventing.
03 How Information Markets Work — Forecast → Trade → Resolve; stepper/scroll, ONE evolving sculptural object whose geometry subtly changes per stage; one short plain-language sentence each, no Web3 jargon.
04 Secured by Kleros — monochrome charcoal section, official Kleros identity (check assets/ and knowledge/ for a Kleros logo; if none exists, use a clean wordmark text "Kleros" and flag it in the report — do not draw a fake logo). Explain dispute resolution role in Seer. Structured geometry suggesting verification/finality; extremely restrained motion.
05 Final Invitation — high contrast, spacious. Headline "A new foundation for information markets." Primary "Explore Seer", secondary "Connect Wallet" (same honest behaviour as hero). Minimal footer: official logo, app links, docs, community links (use real URLs from knowledge/ only).

## QUALITY BAR
Priority: visual precision > brand accuracy > readability > meaningful motion > performance. Premium 2026, architectural minimalism, generous whitespace, no AI-slop. Don't add design docs. Mobile 390px and desktop 1440x900 both clean. Keep component files split (src/seer-2026/sections/*.tsx), lazy-load heavy scenes. Do not commit.
Final report: list files changed, TODOs (unknown URLs/logos), and any known defects. Keep it under 20 lines.
