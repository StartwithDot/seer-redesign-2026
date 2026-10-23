# SEER BENCHMARKS
Method: exact values below come from `research/crawl/*.json` at 1440px. Screenshot observations are marked `~`. OpenAI was challenge-blocked and Rainbow exposed no captured H1. Ledger's computed H1 is its eyebrow, so use the screenshot estimate for its visual headline.

## 1. Crawl Table
H1 shows `font-size / font-weight / letter-spacing in px`; `Sections / sticky` are computed counts.

| Site | H1 size / weight / tracking | Display / body font | Body background | Detected libs | Sections / sticky |
|---|---:|---|---|---|---:|
| anthropic.com | 40.8 / 400 / -0.408 | anthropicSerif / anthropicSans | `rgb(250,249,245)` | canvas 1 | 6 / 1 |
| apple.com/airpods-pro | 28 / 600 / +0.196 | SF Pro Display / SF Pro Text | `#FFFFFF` | video 16 | 18 / 12 |
| arc.net | 78 / 600 / -2.652 | Exposure VAR / Marlin | `#0B0B0B` | none | 6 / 0 |
| cursor.com | 26 / 400 / -0.325 | CursorGothic / CursorGothic | `#F7F7F4` | video 1 | 18 / 7 |
| framer.com | 54 / 500 / -2.16 | GT Walsheim Medium / sans-serif | `#000000` | framer-motion, video 4 | 6 / 1 |
| ledger.com | 14 / 500 / +0.42 | HMAlphaMono / Inter | `#FFFFFF` | none | 7 / 2 |
| linear.app | 64 / 510 / -1.408 | Inter Variable / Inter Variable | `#08090A` | none | 8 / 0 |
| mercury.com | 49.3 / 480 / normal | arcadiaDisplay / arcadia | `rgba(0,0,0,0)` | canvas 1, video 5 | 14 / 3 |
| notion.com | 96 / 600 / -4.60 | NotionInter / NotionInter | `#FFFFFF` | video 1 | 3 / 2 |
| openai.com | n/a / n/a / n/a | n/a / Arial | `rgba(0,0,0,0)` | none | 0 / 0 |
| phantom.com | 80 / 400 / -2.00 | Phantom / Phantom | `rgba(0,0,0,0)` | canvas 4, video 26 | 10 / 4 |
| rainbow.me | n/a / n/a / n/a | n/a / SF Rounded Web | `#111111` | canvas 1 | 0 / 2 |
| ramp.com | 64 / 400 / -0.01 | Lausanne / Lausanne | `lab(100 0 0)` | canvas 9, video 3 | 10 / 1 |
| raycast.com | 64 / 600 / normal | Inter / Inter | `#07080A` | canvas 1 | 0 / 0 |
| resend.com | 96 / 400 / -0.96 | domaine / inter | `#000000` | canvas 1, video 5 | 12 / 1 |
| stripe.com | 48 / 300 / -0.96 | sohne-var / sohne-var | `rgba(0,0,0,0)` | canvas 7 | 15 / 1 |
| uniswap.org | 64 / 485 / normal | Basel / Basel | `#FFFFFF` | canvas 1 | 1 / 1 |
| vercel.com | 64 / 400 / -3.84 | GeistSans / GeistSans | `#FAFAFA` | canvas 2 | 10 / 2 |

## 2. Quantified Conclusions
- **H1 at 1440:** captured range `14-96px`, median `64px`, central cluster `48-64px`; true campaign headlines visually occupy roughly `48-96px`. Seer may exceed this range intentionally because its hero is a split, type-led composition.
- **Tracking and line-height:** median tracking is `-0.011em`, with confident large type at about `-0.034em` to `-0.060em`; median H1 line-height ratio is `1.10`, central range `1.00-1.15`. Apple and Anthropic reach `1.14-1.25`.
- **Body and hierarchy:** median body size is `16px`, generally `16-17px`; Framer captures `12px` and Rainbow `20px`. Production pages use strong contrast between roughly `64px` headlines and `16px` support copy.
- **Section rhythm:** computed page-height divided by section count has a median of about `1,027px`. Screenshot pacing suggests ordinary sections at `~850-1,100px`, proof or utility bands at `~220-450px`, and cinematic or pinned stages receiving `~1,200-3,600px` of scroll runway.
- **CTA copy:** hero CTAs are usually one or two actions. Dominant copy uses 2-4 words and explicit verbs: `Get started`, `Open account`, `Download`, `Deploy now`, `Contact sales`; secondary copy uses `Learn more`, `Request a demo`, `Documentation`, or `Talk to sales`.
- **CTA form:** visually dominant controls are `~44-52px` high with `~20-28px` horizontal padding and `~12px` action gaps. The benchmark does not justify Seer's rejected centered slogan plus two-pill formula.
- **Navigation:** captured link counts are noisy (`0-14`) because menus and duplicates are included. Screenshots show `7-11` visible top-level destinations, one wordmark, and `1-2` account/action controls in a `~64-80px` header.
- **Footer:** common structure is a utility row, then `3-6` link columns, locale/legal details, and a brand block or oversized wordmark. Dense sites capture up to 30 links; sparse product pages use `0-3` visible footer destinations.
- **Smooth scroll and stickiness:** smooth-scroll use is not determinable from these fixtures; no Lenis, GSAP, or Locomotive library is reported. Framer Motion appears on framer.com. Sticky counts are Apple 12, Cursor 7, Phantom 4, Mercury 3, Ledger 2, Notion 2, Rainbow 2, Vercel 2, and 1 each on Anthropic, Framer, Ramp, Resend, Stripe, and Uniswap.
- **Pinning interpretation:** sticky counts can include headers and controls, so they are signals rather than proof of pinning. The strongest scroll-storytelling candidates visually are Apple, Cursor, Framer, Mercury, Phantom, Ramp, and Stripe; Arc, Linear, OpenAI, and Raycast show zero captured sticky elements.

## 3. Twelve Binding Seer Decisions
1. **Landing display:** at 1440 use `104px / 650 / -0.045em / 0.92`; at 1024 use `72px`; at 390 use `56px / 0.96`. Keep the prescribed `56-168px` clamp but do not normalize every section to one size.
2. **Type scale:** landing hierarchy is `104, 72, 48, 24, 18, 14`; product UI is `32, 24, 18, 16, 14, 12`. Use Inter Tight for display and Inter for product copy, with `tabular-nums` on all probabilities, prices, dates, and counts.
3. **Spacing:** keep the `4px` base and use `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 176`. Desktop gutter is `56px`, tablet `32px`, mobile `16px`; content max-width is `1328px`.
4. **Section rhythm:** standard editorial section `900px` minimum height, pinned story stage `2,800px` scroll runway with one `720px` viewport stage, transition band `320px`, and compact footer utility band `280px` before the wordmark.
5. **Motion:** Lenis `lerp: 0.09`; line reveal `900ms`, app flip `720ms`, control transitions `160ms`, all using `cubic-bezier(0.16, 1, 0.3, 1)` or GSAP `power4.out`. Scrub only transforms and opacity.
6. **Color ratio:** landing surface area is `82%` neutral, `14%` ink or charcoal, `4%` accent plus semantic; violet stays at or below `2%` of visible area. Product UI is `78%` neutral, `14%` data ink, `5%` semantic, `3%` violet.
7. **Navigation:** start at `72px`; after `80px` scroll condense to a `1040px` wide, `60px` high glass pill. Hide after a downward delta of `12px`, reveal after an upward delta of `8px`, and reveal immediately on keyboard focus.
8. **Actions:** one `52px` desktop or `48px` mobile primary CTA, `24px` horizontal padding, `12px` secondary gap, and 2-4 word copy. Use `Explore Markets`, `Open <app>`, or `Explore Seer`; never imply wallet connection before it exists.
9. **Application stage:** desktop split is `38%` menu and `62%` geometry. Allow direct selection and scroll sync; flip geometry over `720ms` with maximum `12deg` rotateY and `6deg` pointer tilt. Below `700px` height, replace pinning with stacked, fully readable states.
10. **Product density:** panel padding `24px`, data row `48px`, compact row `40px`, control height `44px`, probability display `32px`, table body `14px`, and metadata `12px`. Surface at most six primary columns before progressive disclosure.
11. **Footer:** use four link columns across `1328px`, `96px` top padding, a `56px` legal row, and an oversized Seer wordmark sized `clamp(96px, 16vw, 220px)`. Keep links above the wordmark with at least `64px` separation.
12. **Responsive and access:** breakpoints are `1024px` and `768px`; minimum target is `44x44px`; body contrast is at least `4.5:1`; focus rings are `2px` with `3px` offset. Reduced motion removes Lenis, scrub, flip, tilt, and word rotation while preserving every final state.

## 4. Prediction-Market Patterns and Seer Differences
Local evidence note: the fixture set contains Uniswap only. Polymarket and Kalshi are absent, so their patterns below are product-category analysis, not crawl-measured values.
- **Polymarket pattern:** category and search navigation, event-card probability grids, dominant percent likelihoods, Yes/No quote panels, order-book depth, volume/liquidity, event history, and portfolio positions.
- **Kalshi pattern:** regulated market catalog, category discovery, cent-priced Yes/No contracts, bid/ask order book, volume and open interest, expiry/settlement metadata, rules, and account/brokerage controls.
- **Uniswap pattern:** one dominant transaction panel, sell/buy token selectors, rate and fee details, token selector CTA, short protocol statistics, abstract token imagery, and a footer-heavy information architecture.
1. **Lead with decision use:** every market detail shows `question owner`, `market signal`, and `final decision authority` as one evidence strip instead of treating trade execution as the only outcome.
2. **Make settlement inspectable:** show the three resolution layers, Conditional Tokens, Reality.eth, and Kleros, plus deadline, reporting round, bond, and dispute state. Do not hide resolution behind generic `Rules`.
3. **Replace one universal card:** support `4` market grammars, categorical, multi-categorical, scalar, and multi-scalar, plus conditional branches. Each type gets its own probability visualization and comparison logic.
4. **Compare branches and risks:** Futarchy shows both branches and the `±1%` corridor; Risk Pricing shows `4` calibrated bands: `0-2%`, `2-5%`, `5-10%`, and `10-100%`, across its comparison set.
5. **Use information-finance restraint:** keep neutral surfaces dominant, semantic color at or below `5%`, and always pair color with text or shape. Avoid sportsbook urgency, casino language, neon ticker bands, and gamified P and L as the primary result.
6. **Export the signal:** provide weighted CSV, stable market links, timestamped snapshots, and plain-language implications for reviewers or decision-makers. Label Futarchy and Opportunity Market signals advisory; humans retain final authority.
