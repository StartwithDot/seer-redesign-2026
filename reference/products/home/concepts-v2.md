I couldn't save this to `products/home/concepts-v3.md` because write permission wasn't granted, so the full write-up is below. If you allow the write, I'll save it there.

# Seer homepage: three concepts (light, colored, crisp dots)

**Shared by all three**
- **Ground and type:** light paper ground. Inter Tight for the interface and body text, plus one display font per concept.
- **Dot logo:** built from `logo_dots_white.png` as live points. Ring dots are light violet `#8B5CF6`, raven and star dots are dark purple `#4A1773`. Dots are 1.6 to 2px with no blur, glow or halo.
- **App colors (the same in every concept):**
  - Futarchy: violet `#5B3DF5`
  - Risk Life Table: coral `#FF5B3D`
  - Opportunity Stage: lime `#B8F26B`, ink text
  - Deep: cobalt `#2F5BFF`
  - Explorer: butter `#FFD84A`, ink text
- **App visuals:** each app is shown with a real crop of its built screen from `apps/*`.
- **Dot hover and click:**
  - A pointer within 64px pushes dots out 6 to 10px, and they spring back in 400ms.
  - Hovering the star makes its dots twinkle.
  - Clicking the logo, or pressing Enter on the "Play the raven" button, turns the dots into the raven. It hops once and turns back into the logo.
- **Reduced motion:** the logo stays still and the raven is shown perched at each stop instead of flying.

---

## A. "Ask Seer" (the editorial almanac)
**Thesis.** You ask Seer a question and get a number back. The page reads like a well-set almanac: one question, its odds, and the five ways Seer answers questions.

**Palette**
- **Base:**
  - Paper `#F6F1E7` (ground)
  - Ink `#14122B` (text)
  - Muted ink `#5E5A73`
  - Rule `#E4DCCB`
- **Accents:**
  - Lilac stage `#DCD3FF`
  - Violet `#5B3DF5` (CTA)
  - Butter highlight pill `#FFE98A`
- **Chapter tints:** violet `#E7E1FF`, coral `#FFE0D6`, lime `#EAF8D2`, cobalt `#DCE5FF`, butter `#FFF3C2`.

**Display font:** Instrument Serif, with an italic accent word on the highlight pill.

**Hero at 1440**
- **Nav:** dot mark, "Seer", Apps, Docs, Blog, and a "Launch app" violet pill.
- **Left half:** headline, subline, two CTAs.
- **Right half:** a 560px lilac stage with 32px rounded corners holding the live dot logo.
- **Ask Seer card:** overlaps the stage's lower-left edge, tilted -2deg. It has a 2px ink outline and a flat 6px ink offset like a sticker, with no blur shadow. Inside: a live question, a large "97.3% say no", a 7-day line and an "Ask Seer" button.

**Hero at 390:** mark plus "Launch app", a 44px headline, and a full-width CTA. The stage is 358px square and the Ask card overlaps its bottom third. "Read the docs" becomes a text link under the card.

**Copy**
- **Headline:** "Prediction markets for *every* question."
- **Subline:** "Create, trade and settle markets on anything. One open protocol, five apps."
- **CTAs:** "Launch app" and "Read the docs".

**Sections**
1. **Hero.**
2. **What Seer is.** Three large serif sentences, each with a tiny inline figure:
   - "Create a market on anything." Four market-type chips: Categorical, Multi Categorical, Scalar, Multi Scalar.
   - "Trade outcomes as ERC20 tokens." One coin splitting into YES and NO.
   - "Kleros settles disputes." A gavel made of 40 dots.
3. **Five app chapters.** Sticky panels with rounded tops, each sliding over the last. Each has its tinted ground, the app name in 96px serif, one sentence and a link. A real UI crop takes 60% of the width and bleeds off alternate sides. One hand-drawn ink arrow points at the key detail.
   - **Futarchy:** fork chart. "Let markets decide which proposal passes."
   - **Risk Life Table:** survival dial. "See how likely each asset is to default this year."
   - **Opportunity Stage:** coverage curve and cut handle. "Review the few submissions the market backs."
   - **Deep:** UP/DOWN split bars. "Price how much of a repo is truly original."
   - **Explorer:** three quote cards. "Every market, priced and buyable in place."
4. **A world of opportunities.** The 11 use cases as tinted chips with a dark corner node, scattered around "Ask about anything." Hovering a chip lifts it and shows how many live markets match.
5. **Closing.** A violet field with "Ready to ask your own?", a "Start now" button in paper and the line "Questions? info@seer.pm".
6. **Footer** on ink: Seer App, Docs, Blog, Community, Images & Branding.

**Raven**
- **Takeoff:** on first scroll, the logo turns into a 120px raven that perches on the Futarchy crop.
- **Route:** it hops from crop to crop, shrinking 120, 104, 92, 80, 72px. Its dots stay ink on every tint.
- **Landing:** it lands on "Start now" and its dots switch to paper on violet. It folds into the star, and the star sits in the button.

```
HERO 1440
| (o) Seer        Apps  Docs  Blog                    [Launch app] |
|  Prediction markets for         .------------------------------. |
|  [every] question.              |   . : ' ring dots  *         | |
|                                 |  :   ::raven dots::    :     | |
|  Create, trade and settle       |   '.  ::::::::::     .'      | |
|  markets on anything. One   .---+-----------------.  ' .       | |
|  open protocol, five apps.  | Seer, will a nuclear |           | |
|  [Launch app]  Read the docs| 97.3% say no  ~~~~~  |-----------' |
|                             | [ Ask Seer ]         |  tilt -2deg |
|                             '----------------------'             |
HERO 390
| (o) Seer      [Launch app] |
| Prediction markets         |
| for [every] question.      |
| [       Launch app       ] |
| .------------------------. |
| |   dot logo on lilac    | |
| '--| Ask Seer  97.3%   |-' |
|       Read the docs        |
RISK CHAPTER 1440
|~~~~ rounded top, coral tint #FFE0D6 slides over violet ~~~~~~~~|
|  Risk Life Table            .---------------------------------- |
|  See how likely each asset  | real crop: survival dial, 33     |
|  is to default this year.   | rings, sweep hand  <~~ "after 12m"|
|  Read the table ->     (raven perched on crop edge, 92px)       |
```
**Risks**
- Serif, stickers and arrows together could tip into Notion or Gumroad imitation.
- The sticky panels need careful scroll handling on short laptop screens.
- The sample question is from Q2 2025, so it must pull a live market from Explorer data.

---

## B. "Price the future" (bold color blocking)
**Thesis.** Each viewport is one flat, confident color with oversized type, and the dots are color on color. Seer reads as a loud, playful protocol brand.

**Palette**
- **Hero field:** violet `#5B3DF5` with paper text `#FBF8FF`.
- **Logo on violet:** ring dots `#C9B8FF`, raven dots `#2A0E4A`.
- **Elsewhere:** paper `#F6F1E7` between fields, ink `#14122B`, and the five app colors at full strength for the chapter fields.
- **CTA:** lime `#B8F26B` with ink text, as the "yes" color.

**Display font:** Inter Tight Black, all caps, used for the headline only.

**Hero at 1440**
- **Nav:** sits on paper above the hero panel.
- **Panel:** a violet panel inset 24px from the page edges with a 40px radius, holding a 132px caps headline.
- **Logo:** 640px tall, with its ring cropped by the panel's right edge.
- **Ticker:** a slow row of live market pills along the bottom of the panel, which pauses on hover.

**Hero at 390:** 12px inset, a 52px headline over 3 lines, a 300px logo cropped at the right, a full-width lime CTA and one ticker pill.

**Copy**
- **Headline:** "PRICE THE FUTURE."
- **Subline:** "Seer is the open protocol for prediction markets. Create one on anything, trade outcomes as tokens, let Kleros settle disputes."
- **CTAs:** "Start now" and "Learn more".

**Sections**
1. **Hero panel.**
2. **How it works.** One dot figure: a coin, then outcome tokens, then ERC20 trading, then redeeming. Labeled "Deposit", "Trade", "Redeem".
3. **Five apps.** Each gets one full-bleed field in its own color, with a 120px name and a real crop tilted 3deg like a sticker.
4. **Market types.** One sentence with four live inline widgets: a radio button, checkboxes, a slider and two sliders.
5. **Closing.** A lime field with "YOUR QUESTION NEXT." and a "Create a market" button.
6. **Footer** on ink.

**Raven:** it crosses each field diagonally, from top-left to bottom-right, shrinking from 200 to 80px. Its dots always contrast with the field (paper on cobalt, ink on lime). It lands on "Create a market".

```
HERO 1440
| (o) Seer        Apps  Docs  Blog                    [Launch app] |
| .--------------------------------------------------------------. |
| | PRICE THE                               . : ' ring dots  *   |
| | FUTURE.                               :   ::raven::     (crop |
| | Seer is the open protocol for          '. ::::::::     edge) |
| | [Start now]  Learn more                                       |
| | ( Will ETH close above 4k? 62% ) ( Who wins? 41% ) ( ... ->  |
| '--------------------------------------------------------------' |
HERO 390
| .---------------------. |
| | PRICE THE FUTURE.   | |
| |   : ::raven:: :(cut)| |
| | [   Start now     ] | |
| | ( ETH > 4k? 62%  -> | |
| '---------------------' |
DEEP FIELD 1440
|################ cobalt #2F5BFF full bleed ######################|
|  DEEP                         .-----------------------.         |
|  Price how much of a repo     | real crop: UP / DOWN  |\ 3deg   |
|  is truly original. [Explore] '-----------------------'-'       |
|                 raven (paper dots) crossing  \__ 96px           |
```
**Risks**
- Five saturated fields in a row can be tiring.
- The caps headline is close to Wise's.
- Text on the lime and butter fields must stay ink to keep contrast.

---

## C. "Every question splits in two" (the diptych)
**Thesis.** Seer's core move is the conditional token split: one unit of collateral becomes one token per outcome. Every section is two tints divided by a seam, and the raven rides the seam.

**Palette**
- **Hero halves:** lilac `#DCD3FF` and mint `#CFF1E0`, which signal YES and NO without the red/green cliché.
- **Seam:** ink `#14122B`, 2px.
- **Elsewhere:** paper `#F6F1E7`, with a violet `#5B3DF5` CTA.

**Display font:** Fraunces 600.

**Hero at 1440:** lilac left, mint right. The 520px logo sits on the seam, with violet dots on the lilac side and ink dots on the mint side. The headline spans the seam, and under the logo sit "YES 62%" and "NO 38%" pills.

**Hero at 390:** the seam turns horizontal, with lilac on top and mint below.

**Copy**
- **Headline:** "Every question splits in two."
- **Subline:** "Deposit collateral, get one token per outcome, trade what you believe. Kleros settles disputes."
- **CTAs:** "Launch app" and "How it works".

**Sections**
1. **Hero diptych.**
2. **The split.** A live figure: drag a coin onto the seam and it splits into YES and NO, then drag them back to merge. Caption: "1 in, 1 YES + 1 NO out. Merge them back anytime."
3. **Five app chapters.** The app tint and copy on the left, a real crop on paper on the right. Hovering the crop widens it to 70%.
4. **Use cases.** Two columns of words either side of the seam. Hovering a word shows a live question.
5. **Market types.** Each row splits into the question on the left and the answer shape on the right.
6. **Closing diptych:** "Ask your own question." with "Start now" and info@seer.pm.
7. **Footer** on ink.

**Raven:** it flies straight down the seam, banking as the seam shifts and shrinking from 160 to 64px. Its dots take the color of whichever half they sit on. It lands on the closing seam and becomes the star.

```
HERO 1440
| (o) Seer        Apps  Docs  Blog   |                [Launch app] |
|   lilac #DCD3FF                    |              mint #CFF1E0   |
|           Every question splits in | two.                        |
|                     :   ::raven:: | ::::    :                    |
|                    [ YES  62% ]   |   [ NO  38% ]                |
HERO 390
| lilac: Every question   |
| splits in two. ::raven  |
|-------------------------|  seam
| mint: [YES 62%][NO 38%] |
OPPORTUNITY CHAPTER 1440
| lime tint #EAF8D2                  | paper  .-------------------. |
|  Opportunity Stage                 |        | real crop: curve  | |
|  Review the few submissions the    |        | + cut handle      | |
|  market backs.  Open the stage ->  | raven  '-------------------' |
```
**Risks**
- A center seam works against left-aligned reading and can feel rigid across seven sections.
- Lilac and mint can feel soft and pastel.
- Splitting the logo's dot colors may make it read as two marks.

---

## My pick: A, "Ask Seer"
- **Real promise first:** it leads with what the product does (ask, get a number) using real seer.pm content, not a slogan.
- **Fits every rule:** paper, flat tints, dark dots on light, real crops, and no glow.
- **One clear thread:** the raven perching on each real app crop shows the five apps sharing one protocol, and it stays crisp on every tint.
- **Borrowed moves:** take B's lime "yes" color for the closing CTA and C's split figure for the ERC20 line in section 2.
- **Next step:** a design.md for A with exact spacing, the raven's flight path and the five chosen crops.
