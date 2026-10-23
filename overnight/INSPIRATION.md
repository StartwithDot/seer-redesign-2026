# Seer: inspiration transformed

Read against `ART_DIRECTION.md`. Visually reviewed all 28 supplied screenshots: four each from navbar.gallery, supahero.io, cta.gallery, footer.design, 3dicons.co, scrolltide.co and styles.refero.design; none missing.
References below use local filename stems and frame numbers. Dimensions are visual estimates at 1440px, not measured site tokens. Screenshots establish appearance only; all motion and interaction adaptations are proposals.
The referenced project `docs/` rules were absent in this checkout. This study follows the available art direction and Seer Design Lab reference-transformation guidance.

## NAV
- **Observed:** Supahero `_0` uses a full-width header; `_1–3` show a roughly 1024px floating capsule with approximately 24px side padding. **Adapt:** Begin with a quiet white header, then condense into a glass pill; keep logo left, Apps and Connect Wallet right. Use blur, a thin inner highlight and layered shadow without reducing label contrast.
- **Observed:** Navbar `_0` gives a compact sidebar strong hierarchy through aligned labels, consistent icon slots and a separated bottom promotion. **Adapt:** Borrow the alignment discipline for the Apps menu: typographic app names with brief purpose lines, generous row spacing and no decorative icon tiles or advertising panel.
- **Observed:** Navbar `_2` Cloudflare and `_3` Browserbase group dense menus under meaningful headings; the trigger stays visually connected to the menu. **Adapt:** Anchor a restrained Apps disclosure beneath its trigger, showing verified destinations only; support click, keyboard focus, Escape and explicit expanded state.
- **Observed:** Footer `_0–3` keeps a thin, consistent navigation strip while imagery changes below. **Adapt:** Keep Seer's navigation visually stable across the story; hide on scroll-down and reveal on scroll-up, with keyboard focus always restoring visibility. Reserve violet for active/focus cues.

## HERO
- **Observed:** 3dicons `_0` gives its two-line title roughly 770px of width within a 970px content column, with substantial air before the next feature. **Adapt:** Preserve the confidence of large type and whitespace in a split composition: Seer's exact headline left, borderless lens video right; avoid reproducing the centered two-pill arrangement.
- **Observed:** Supahero `_0` contrasts the asymmetric Amoth text/object hero with Better Stack's centered composition. **Adapt:** Use the asymmetric principle to balance a 56–168px Inter Tight headline against one large optical object; give the lens visual weight without placing text over its refraction.
- **Observed:** Scrolltide `_0` separates an approximately 88px headline from approximately 20px supporting copy and a compact action row. **Adapt:** Establish a similarly decisive scale contrast with tight display tracking, readable support copy and deliberate line breaks; replace the atmospheric backdrop with matched white video/page edges.
- **Observed:** Refero `_0` places generous space around its headline and gives the next action a clearly bounded area. **Adapt:** Keep the hero explanation and actions easy to locate within the left column: Explore Markets links to the app; Learn More scrolls into the statement. On mobile, stack the lens after the copy and actions.

## CTA
- **Observed:** 3dicons `_0` pairs a solid black download action with a quieter outlined support action; their heights match at roughly 50px. **Adapt:** Give Explore Markets a violet primary treatment and Learn More a quiet text treatment with arrow; maintain a 44–52px hit area and clear keyboard focus.
- **Observed:** CTA `_3` counterpublic makes one action dominant through exceptional size and empty black surroundings. **Adapt:** Give the final Explore Seer action exclusive visual emphasis beneath the massive closing headline, on white; keep Connect Wallet secondary and link to the real app when no wallet flow exists.
- **Observed:** CTA `_2` Wearedirect uses two broad adjoining destinations with sharply differentiated labels. **Adapt:** Distinguish exploration from wallet entry through explicit verbs and hierarchy, without adding a competing split-panel section or implying a connection has occurred.
- **Observed:** CTA `_1` Native Security uses a short benefit statement with one compact action; `_2` Studioloop uses conversational project language. **Adapt:** Use specific Open <app> links beside the active application description. Propose damped magnetic movement and an arrow slide on hover, with a stationary full-size hit target and reduced-motion fallback.

## FOOTER
- **Observed:** Footer `_1` Trove, Aperios and Nothin' use oversized wordmarks as the architectural base of the page. **Adapt:** End with an oversized official Seer wordmark beneath useful links, aligned to the main page margins; size it responsively without clipped letters or horizontal overflow.
- **Observed:** Footer `_0` The Content Architecture separates brand/contact, resources and legal content across a broad horizontal field. **Adapt:** Group verified Seer app, documentation and community destinations into readable columns; keep secondary information small but legible, with no invented newsletter or legal destinations.
- **Observed:** Footer `_2` Harvest Hall leaves a large quiet interval between its compact utility links and expressive bottom illustration. **Adapt:** Let white space separate Seer's links from its wordmark; any optical detail stays subordinate and cannot obstruct links or resemble the reference's blue token pile.
- **Observed:** Footer `_3` Cronicle joins a concise closing statement to a faint oversized brand name; Eclipse Space places utility navigation alongside a dominant scene. **Adapt:** Connect the closing headline, action and wordmark through one continuous white composition, with a subtle entrance reveal; preserve strong contrast for all functional text.

## SCROLL STORYTELLING
- **Observed:** Scrolltide `_0–3` progresses from a large promise into an extended visual collection, then a clear browse action and the next content type. **Adapt:** Preserve the changing scale and clear progression in Seer's prescribed order: hero, statement, applications, Forecast/Trade/Resolve, Kleros, final action. Do not transplant its catalogue grid.
- **Observed:** Navbar `_0–3` alternates full-width examples with unequal paired examples, creating visual rhythm. **Adapt:** Create rhythm through typography-led statements followed by one large application composition. Pin the application stage; synchronize active app name, description and glass geometry, while allowing direct menu selection.
- **Observed:** Supahero `_0–3` repeats a two-column gallery while alternating light, dark, photographic and abstract subjects. **Adapt:** Borrow changes in visual weight, not repeated boxes: tween off-white to soft grey to white, reserve charcoal for Kleros, then return to white; overlap restrained parallax layers across transitions.
- **Observed:** Refero `_1–2` interrupts repeated examples with a wide editorial banner, marking a change of pace. **Adapt:** Make How It Works a deliberate pause: one object morphs from shards to lens to sealed ring as Forecast, Trade and Resolve advance. Use Lenis/ScrollTrigger; disable scrub for reduced motion and simplify pinning below 700px viewport height.

## 3D-GLASS OBJECT TREATMENT
- **Observed:** 3dicons `_1–2` makes materials readable through curved highlights, directional light and soft contact shadows, even at small size. **Adapt:** Use those material cues for Seer's Blender lens video: believable optical thickness, controlled specular edges and soft grounding; reject its toy-like saturated icon vocabulary.
- **Observed:** Refero `_1` Integrated Biosciences and Supahero `_2` pair large close-cropped translucent green forms with restrained text. **Adapt:** Give the hero lens enough scale to reveal refraction, but preserve a clear text zone; match the video edge white exactly to the page so no rectangular container appears.
- **Observed:** Refero `_2` teenage engineering uses physical staging and cast shadows to establish depth; Scrolltide `_1` Ora uses layered mechanical parts. **Adapt:** Build distinct application geometry through offset rings, branching arcs, nested layers, stepped planes and calibrated segments. Use inline SVG plus CSS glass with inner highlights and layered shadows, not generic primitives or dashboard panels.
- **Observed:** Supahero `_1–3` floats its translucent navigation above detailed imagery while preserving a coherent surface edge. **Adapt:** Apply blur plus saturation selectively to navigation and optical compositions; keep body text on clear surfaces. Propose damped lens tilt capped at 6 degrees and backface-hidden application flips, disabled for reduced motion.

## TYPOGRAPHY
- **Observed:** Refero `_0` uses an approximately 70px serif headline over approximately 16px explanatory text; Scrolltide `_0` uses a heavier approximately 88px sans headline. **Adapt:** Borrow the scale contrast while retaining Inter Tight, 600–700 display weights, approximately -0.04em tracking and 56–168px responsive sizing; do not import either site's type identity.
- **Observed:** Supahero `_0` lets a short, approximately 60px title establish the page before a quieter single-line explanation; 3dicons `_0` breaks its headline into two substantial lines. **Adapt:** Break “Where information becomes a market.” deliberately at desktop widths and reflow naturally on mobile; constrain support copy so it never competes with the headline.
- **Observed:** Navbar `_1` Zentro makes a large two-column link list the main navigation content. **Adapt:** Make the applications menu a vertical typographic composition rather than icon cards; active app names use full ink and inactive names use the art direction's 25% treatment, with accessible labels and a stronger focus/hover state.
- **Observed:** Footer `_1–3` repeatedly turns brand typography into a large spatial element; Refero `_1–3` keeps captions compact and consistently aligned. **Adapt:** Use giant statements and the final wordmark to structure the page, with readable 18–20px body copy at >=4.5:1 contrast. Propose 0.9s line-mask reveals, scroll-linked statement emphasis and one meaningful sentence-scale word flip; no letter-by-letter animation.

## Do / Don't
- Do use white as the dominant field; don't spread violet into a page-wide wash.
- Do make Information Finance understandable; don't substitute generic crypto or AI slogans.
- Do adapt proportions and hierarchy; don't reproduce reference compositions or branding.
- Do use the supplied Blender lens; don't replace it with glowing orbs or default primitives.
- Do make each app's geometry meaningful; don't repeat icon-title-description cards.
- Do reserve charcoal for Kleros; don't inherit the galleries' dark page shells.
- Do use real destinations and verified claims; don't invent metrics, partners or wallet success.
- Do connect animation to reading and state changes; don't add noisy loops or letter gimmicks.
- Do preserve contrast, keyboard access and reduced-motion states; don't hide meaning behind motion.
- Do keep the full story usable on mobile; don't require pinning or hover to reach an action.
