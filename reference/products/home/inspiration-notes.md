# Homepage inspiration notes

Source: research/inspiration/home/sheet-01 to sheet-07. Sites 08 (locomotive.ca) and 24 (shadertoy.com) show a bot-check wall only, so no hero is visible. Site 37 is absent from the sheets. Site 06 is a single-screen intro.

## Particles and 3D hero

**01 stellar.org**: Dense gold particle dust drifting over black, with a serif headline. BORROW the sparse, slow particle field as atmosphere behind type. AVOID the gold-on-black glow.

**02 injective.com**: A 3D card floating over a hand, with a purple rim light. BORROW the single hero object sitting above a centred headline. AVOID the purple glow and gradient CTAs.

**03 lusion.co**: Chunky 3D primitives tumbling in a framed panel on a pale ground. BORROW the object as a framed, self-contained scene with a clear scroll cue. AVOID the saturated blue-and-black clutter.

**04 igloo.inc**: A photoreal igloo in fog with floating UI numbers. BORROW the restrained grey palette and the data tags as a secondary layer. AVOID the cinematic fog and fake HUD callouts.

**05 activetheory.net**: A small glowing ring emitting dust on near-black. BORROW the scale contrast: one small object, lots of empty dark space. AVOID the cyan ring glow.

**06 unseen.co**: Pale pink field, one big character icon, a single "Enter" button. BORROW the single-gesture entry screen and generous empty space. AVOID the novelty mascot.

**07 basement.studio**: A dark 3D room with a human/machine toggle. BORROW the two-state toggle as a concept (human vs machine), which maps well to raven vs logo. AVOID the heavy environment build.

**09 resn.co.nz**: Shards of black glass orbiting in a circle on black. BORROW the fragmented geometry that reads as "breaking apart", close to the dissolve. AVOID the glossy facets and low contrast.

**12 dogstudio.co**: Large display type over a painted animal portrait, with a browser warning bar. BORROW the big stacked headline overlapping a strong image. AVOID the purple gradient wash.

## Particle libraries and demos (reference only)

**19 godly.website**: Index of design work, not a hero. BORROW nothing directly; use only as a gallery of motion references.

**20 tympanus codrops, particles**: Tutorials on living particle systems. BORROW the "living particle system" approach as a method reference.

**21 tympanus codrops, webgl**: Tutorials on WebGL image effects. BORROW the image-to-effect transition idea.

**22 threejs points_waves**: Point-cloud waves, white on black. BORROW the wave motion as a reference for flowing particle paths. AVOID the uniform bubble look.

**23 threejs buffergeometry_points**: Dense colour point cloud with a sweeping shape. BORROW the density falloff, where particles thin out at the edges, which suits a dissolve.

**25 codepen tag particles**: Demo gallery. BORROW spring and noise motion ideas. AVOID the rainbow and neon effects.

## Scroll and typography

**10 14islands.com**: Huge sans type ("Design & Technology") with a light grey page and small caption. BORROW the oversized, mixed-weight headline and the sparse caption hierarchy.

**11 cuberto.com**: Centred headline above a grid of 3D tiles. BORROW the tile grid as a secondary scroll section. AVOID the generic agency layout.

**13 dennissnellenberg.com**: Full-bleed photo with huge type running off the edge. BORROW the type cropped by the frame as a scroll-stopping element.

**14 to 18 awwwards lists**: Galleries of WebGL, 3D, scrolling and storytelling sites. BORROW nothing directly; they show the common vocabulary, which we should avoid copying.

**26 linear.app**: Dark product hero with tight type and a real UI screenshot. BORROW the product-truth screenshot and sparse tagline. AVOID the screenshot-as-hero if it becomes the only story.

**27 stripe.com**: Flowing colour ribbon behind a large sentence, then logo strip. BORROW the sweeping ribbon as a motion metaphor for flight or flow. AVOID the rainbow gradient and the logo wall.

**31 anthropic.com**: Warm off-white, big serif-like sans, one underlined word. BORROW the calm paper ground and the single emphasised word. AVOID the whitespace-only minimalism that says nothing.

**38 apple.com airpods-pro**: One product, large, centred, scroll reveal. BORROW the single hero object and price/CTA pairing in one line.

**39 framer.com**: Dark page with a floating stack of images. BORROW the layered image cluster as a depth cue (near cards bigger and faster). AVOID the generic "design agent" copy.

**40 rive.app**: Dark, bold tech type with a grid of live demos. BORROW the demo tiles as proof of motion. AVOID the all-caps display type.

## Crypto and SaaS (mostly avoid)

**28 vercel.com**: Mega-menu on white, a black 3D block. BORROW the single 3D block as a hero object. AVOID the menu density for a homepage.

**29 coinbase.com**: Phone mock in a grey card with price list. AVOID the product-card hero; too much dashboard.

**30 uniswap.org**: Blurred colour blobs behind a form. AVOID the blurred blobs and the swap widget as hero.

**32 openai.com**: Empty chat box as hero. AVOID; a prompt box is not a story.

**33 solana.com**: Dark purple ribbon with bright headline and a promo card. BORROW the flowing ribbon line. AVOID the promo card and purple glow.

**34 ethereum.org**: Illustrated scene with an event banner. AVOID the banner and the illustration style.

**35 paradigm.xyz**: Near-empty white page with tiny scroll-slowed text and a single sentence. BORROW the slowed-down text as a scroll idea (speed tied to scroll) and the very low density of UI. AVOID the tiny text size.

**36 rainbow.me**: Phone mock plus a bold headline. AVOID the phone mock as hero.

**41 ledger.com**: Purple gradient, phone render, cookie banner. AVOID.

## 8 design principles for a particle-logo to raven homepage

- One hero object only. The logo is made of particles, and the raven is the same particles re-formed. Nothing else competes in the first viewport.
- Depth by motion, not by glow. Scale and scroll speed set depth: near particles are larger and move faster, far ones are smaller and slower. No bloom, no coloured rim light.
- Scroll drives the story. The dissolve, flow and flight are bound to scroll position, with a fixed stage and the raven leaving the frame as the next section starts.
- Keep the field sparse. Use few, deliberate particles on a near-black or warm-paper ground. Density falls off toward the edges so the form reads.
- Type is large and quiet. One oversized headline, cropped or set in a mixed weight, with a short caption. Type and particles share the same stage without overlap.
- Flow lines are the brand. Use one continuous curved path (as in the Stripe and Solana ribbons) to connect logo, dissolve and flight, instead of decorative gradients.
- No gradients, glows, blurred blobs or fake UI. The product is not shown as a dashboard in the hero. Proof comes later, in plain text, below the fold.
- Reduced motion and no-WebGL fallback. The page must read as a static logo and headline with the same copy, and the scroll story must degrade to a sequence of stills.
