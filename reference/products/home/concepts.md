# Seer homepage: three concepts on one particle field

Shared facts: the field holds 15k dots (logo → raven) on a near-black #07060d background. Depth comes only from perspective z, size by distance, depth of field and parallax. The engine needs one change for all three: N anchors instead of 2, plus `heading` and `perch` per anchor.
Products, each shown with its own accent dot (no new colors): Futarchy (violet), Risk Life Table (teal), Opportunity Stage (amber), Deep (blue), Explorer (ink-grey).

---

## Concept A: "Perches"
**Thesis:** the seer watches every market. The raven flies a route across the page and stops on one perch per product. Scrolling reads like a bird's itinerary.

**Story (7 pages)**
1. **Hero.** The logo flows, centred. The line *Markets know what's next.* sits 64px below the ring and never touches it.
2. **Take-off.** The logo dissolves (ring first, star last) and re-forms as the raven, wings up. It climbs right at scale 1 → 0.45. The line *One protocol. Five ways to ask it.* appears at left.
3. **Futarchy.** The raven lands on the left end of a thin 1px fork line (the Futarchy glyph, drawn in SVG, not particles). Scale 0.30, wings relax. The product name and one sentence sit at right.
4. **Risk Life Table.** The raven crosses to the right and perches on a falling survival line, scale 0.26.
5. **Opportunity Stage.** The raven perches on the top peg of a 5-row sieve glyph, scale 0.22.
6. **Deep and Explorer.** Two perches on one page, scale 0.18, because these two are reference tools.
7. **Landing.** The raven lands at scale 0.15 on the "o" of *Launch app*, then folds its wings. Footer follows.

**Products.** One signature line-glyph per product (fork, tide, sieve, cells, index rule): 1px, 240px wide, in the product accent. Name in display type, one sentence, then *Open →*. No boxes.

**Particles on hover and click**
- Hovering a perch makes the raven bank its head toward the cursor. Within 60px, dots ruffle (up to 8px offset, 300ms spring).
- Clicking a product makes the raven take off along the glyph line. The page navigates after 450ms.
- In the hero, the cursor parts the flow within 90px. Dots return on the curl field.

```
P1 1440                                   | P1 390
[S Seer      Apps Docs Blog    Launch app]| [S Seer        ≡]
              .:::::::. *                 |      .::::. *
            ::  raven  ::   560px box     |    :: raven ::  300px
             '::::::::'                   |     '::::::'
        Markets know what's next.  56/serif|  Markets know
                 scroll ↓                 |  what's next. 36
P3 1440                                   | P3 390
   ,>  ─────────┬──── fork 240px          |   ,> ───┬── 200px
  raven(0.30)   └────                     |  raven  └──
                        FUTARCHY  40      |  FUTARCHY 32
                        Decide by what    |  Decide by what the
                        the market expects|  market expects.
                        Open →            |  Open →
P7 1440                                   | P7 390
        Ask the market.            72     |  Ask the market. 40
        Launch app   (raven 0.15 on "o")  |  Launch app  ,>
        Docs · Blog · info@seer.pm        |  Docs · Blog
[footer]                                  | [footer]
```

**Type and color**
- Display: Instrument Serif 72/56/40. UI: Inter Tight 15/17.
- Violet #7B3AFF is used only on *Launch app*. Each product accent is used only on its glyph and its 6px dot.

**Depth.** Glyph lines sit at a fake z of 0 (fixed, crisp). The raven sits in front at z +0.15, so it blurs slightly on its fast legs between perches. Camera parallax is ±7°.

**Fixed sizes**
- Header 64px. Perch rows 520px tall.
- Glyphs 240×80. Text column 420px. Gutter 16px on mobile.

**Copy**
- Futarchy: *Decide by what the market expects.*
- Risk Life Table: *Price the chance a protocol fails this quarter.*
- Opportunity Stage: *Let markets rank what deserves funding.*
- Deep: *Weigh which open-source work matters.*
- Explorer: *Every Seer market, in one index.*

**Risks**
- The left-right zig-zag is the most common scroll-story pattern, and it is closest to today's demo.
- Five landings can feel like a gimmick by the third one.

---

## Concept B: "Into the Field"
**Thesis:** a forecast is seeing far. The raven does not cross the page; it flies *into* it. Shrinking is real distance, not a scale trick. Each product sits at a deeper plane, so scrolling is travel forward.

**Story (6 pages)**
1. **Hero.** The logo flows at z 0, filling 560px. The line *Markets know what's next.* sits below it, at left of centre.
2. **Turn.** The logo dissolves. The raven re-forms facing away from the viewer, with its back and raised wings visible. It begins flying into the screen.
   - The camera follows: z 0 → −2, scale 1 → 0.5, dots get denser and smaller.
   - Text: *One protocol beneath five instruments.*
3. **Planes 1 and 2.**
   - Futarchy, then Risk Life Table. Each is a typographic plane: name, one sentence, a 1px signature line. The plane slides past the camera with CSS translateZ parallax (near = faster, larger).
   - The raven passes between them and keeps going deeper (scale 0.35 → 0.25).
   - A depth tick sits in the right margin: `01 ─ 02 ─ 03 ─ 04 ─ 05`.
4. **Planes 3 and 4.** Opportunity Stage, then Deep. The raven is at scale 0.2. Out-of-focus near dots from its swarm trail drift past the lens, larger and dimmer through depth of field (DoF).
5. **Plane 5.** Explorer, framed as the far plane: *everything you passed, indexed.* The raven is at scale 0.16, at the horizon.
6. **Landing.**
   - The raven turns side-on and lands at scale 0.15 on a single 1px horizon rule.
   - Above the rule: *Ask the market.* and *Launch app* (violet).
   - Below the rule: the five product names in one quiet row of type, each with its dot.

**Products.** Each is introduced as a distance: a plane you fly through. The order runs near to far, from deciding (Futarchy) to indexing (Explorer). There are no boxes; the plane is only type plus its glyph.

**Particles on hover and click**
- In the hero, the cursor tilts the camera ±7°. The ring (back plane) and star (front plane) separate visibly; this is the main depth "reveal".
- Hovering a plane makes the raven glance back (head yaw 20°). The plane's glyph line draws in over 400ms.
- Clicking a plane makes the raven dive toward it. Dots stream past the lens and navigation follows (cap 450ms).
- Reduced motion: stills at each plane.

```
P1 1440                                   | P1 390
[S Seer      Apps Docs Blog    Launch app]| [S Seer        ≡]
              .:::::::. *                 |      .::::. *
            ::  logo   ::   560 @ z0      |    :: logo ::  300
             '::::::::'                   |     '::::::'
   Markets know what's next.   56         |  Markets know
   Five instruments, one protocol. 17     |  what's next. 36
P3 1440                                   | P3 390
 FUTARCHY  (near, 48, fast)          01 ● |  FUTARCHY 32     ●
 Decide by what the market expects.  02 ○ |  Decide by what...
 ───┬── fork                         03 ○ |        ^ raven .25
          ^  raven .3 (back view)    04 ○ |  RISK LIFE TABLE 24
        RISK LIFE TABLE (far, 32)    05 ○ |  (far, slower)
        Price the chance a protocol fails.|
P6 1440                                   | P6 390
            Ask the market.     72        |  Ask the market. 40
            Launch app                    |  Launch app
 ─────────────────,>─────────── horizon   |  ─────,>────── 1px
 ● Futarchy ● Risk ● Opportunity ● Deep ● Explorer | ● Futarchy ● Risk
[footer]                                  | ● Opp ● Deep ● Explorer
```

**Type and color**
- Display: Instrument Serif. Size steps with depth: 48 near, 32 far, then 72 at the landing.
- UI: Inter Tight 15/17. The depth tick uses JetBrains Mono 12 (departure).
- Planes get dimmer with distance: text alpha 1.0, 0.72, 0.5 (tonal steps, not gradients).

**Depth**
- Real perspective z on the raven. CSS translateZ on the type planes uses the same fov 35 as the WebGL camera, so text and dots share one space.
- DoF on the swarm trail. Parallax speed ratio 1 : 0.6 : 0.35.

**Fixed sizes**
- Header 64px. Each plane is 100vh of scroll, with text fixed at a 480px column.
- Horizon rule spans the full container (1200px max).

**Copy:** same five sentences as A, plus *Five instruments, one protocol.* and *Ask the market.*

**Risks**
- Flying into the screen needs a back-view bird. This means a new `points_back.json` shape, or a yaw on the existing silhouette.
- CSS z and WebGL z can drift out of sync; one shared camera matrix is required.
- Far planes at 32px and 0.5 alpha must still pass the 4.5:1 contrast rule.

---

## Concept C: "Margin Notes"
**Thesis:** Seer is the annotation beneath every decision. The page reads like an editorial essay of five short sentences (Paradigm / Anthropic restraint). The raven lives in a fixed 280px left margin, like a hand-drawn note, and flies down beside the text.

**Story (6 pages)**
1. **Hero.** The logo flows in the margin column at 400px. The headline *Prediction markets, as infrastructure.* is set huge (88px) in the right column, so the two never overlap.
2. **First sentence.** The logo dissolves into the raven, scale 0.6, still in the margin. The essay starts: *Conditional tokens split one question into tradable outcomes.*
3. **Products.**
   - Each product is one sentence in the essay. Its name is underlined in its accent, Anthropic style.
   - The raven glides down the margin and holds level with the sentence being read.
   - Hovering a product name makes the bird's dots briefly act out the product's mechanism:
     - Futarchy: the flock splits in two.
     - Risk Life Table: dots drain downward.
     - Opportunity Stage: dots sift into a ranked line.
     - Deep: dots settle into cells.
     - Explorer: dots line up in rows.
   - After each, the dots re-form as the bird.
4. **Resolution.** *Kleros settles disputes; markets settle beliefs.*
5. **Deep and Explorer** (the sentences continue).
6. **Landing.** The raven lands at scale 0.15 on the margin rule, beside *Launch app*.

```
P1 1440                                   | P1 390 (margin → top band)
[S Seer      Apps Docs Blog    Launch app]| [S Seer        ≡]
 .::::. *  |  Prediction                  |     .::::. *   240
 :logo:    |  markets, as                 |     '::::'
 '::::'    |  infrastructure.   88        |  Prediction markets,
 280 margin|                              |  as infrastructure. 40
P3 1440                                   | P3 390
   ,>      |  Futarchy lets a DAO decide  |  ,> (sticky 64px band)
  raven.3  |  by what the market expects; |  Futarchy lets a DAO
           |  Risk Life Table prices ...  |  decide by what the...
P6 1440                                   | P6 390
     ,>    |  Ask the market.  Launch app |  Ask the market.
 ──────────|  Docs · Blog · info@seer.pm  |  Launch app  ,>
```

**Type and color**
- Display: Instrument Serif 88/40. Body: Inter Tight 22 for the essay.
- Underlines in the product accents. Violet #7B3AFF only on the CTA.

**Depth.** Weakest of the three: the margin is narrow, so parallax is limited to ±4°. DoF shows only during the mechanism bursts.

**Fixed sizes**
- Margin 280px; text column 640px.
- Mobile: the margin becomes a sticky 64px top band with the raven at scale 0.12.

**Risks**
- Five new particle behaviors means about five shader modes, which threatens the 30 KB and 60fps budgets.
- The bursts can read as "decorative particles", which is a banned pattern.
- The hero object is cramped in a margin.

---

## Pick: B, "Into the Field"
- **It is the only concept where shrinking means something.** The raven gets smaller because it is flying away from the viewer, toward the future. That makes depth (perspective, DoF, parallax) the story itself rather than an effect, which is what Stellar and Lusion do best.
- **The hero stays a single object.** The products arrive as planes you pass through, not as a list or grid. The near-to-far order (decide → price → rank → weigh → index) also explains how the five products relate.
- **A loses** because the left-right perch zig-zag is the stock scroll-story layout, the closest to the current demo, and it repeats five times.
- **C loses** because the hero is shrunk into a margin, and its product introductions rely on five new particle tricks. That costs a lot of engine work and risks the decorative-particles ban.

**What to borrow into B**
- From A: the click-to-dive navigation and the landing on a typographic line.
- From C: the accent underline on each product name in the final row.

**Engine work needed for B**
1. N anchors with a z value per anchor.
2. Yaw on the bird, for the back view.
3. One camera matrix exported to CSS for the type planes.
4. A hover attractor uniform.
