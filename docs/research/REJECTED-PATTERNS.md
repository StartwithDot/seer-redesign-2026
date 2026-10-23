# Rejected Visual and UX Patterns

Date: 2026-10-22
Scope: Anti-Generic Guardrails (`poidh2/docs/research/REJECTED-PATTERNS.md`)

During our inspection of `supahero.io`, `navbar.gallery`, `cta.gallery`, `footer.design`, `3dicons.co`, `scrolltide.co`, and Web3 benchmark sites (`research/inspiration/home1..3`), we identified several visually flashy patterns that must be **strictly rejected** for Seer. Each pattern below conflicts with either the Electric Foundation brand kit, user comprehension, accessibility, or Seer's Information Finance thesis.

## 1. Rejected Brand & Color Patterns

### R-01: Warm Paper / Pastel Multi-Hue Rebasing
- **Observed In**: Earlier exploratory notes (`inspiration-notes-v2.md` referencing Gumroad `#F6F1E7` cream, Mailchimp butter yellow, Headspace orange/mint blobs).
- **Why Rejected**: Directly violates the official Electric Foundation brand kit (`#101013` near-black dark ground, `#F7F7F9` crisp cool-alabaster light ground, `#7A3CFF` electric violet primary). Turning Seer into a pastel sticker site destroys brand recognition and contradicts the POIDH #38 mandate to use the EF brand kit as the recognizable starting point.

### R-02: Converging Vanishing-Point Line Motifs (Many-to-One)
- **Observed In**: Monad (`06-monad-xyz.png`) and several competing POIDH #38 claims (e.g. Claim 171 "Convergence").
- **Why Rejected**: In the October 17, 2026 article *Redesigning Seer for Information Finance (Part II)* (`assets/x_post/post.md` and `c.png`), Seer explicitly instructed entrants to **reverse** the original EF line direction: **one line must enter from the left and fan out into many parallel lines to the right** (representing one question branching into many possible outcomes). Any converging left-to-right funnel is factually backwards relative to the brief.

### R-03: Neon Cyan / Rainbow Mesh Gradients and Blurry Glow Blobs
- **Observed In**: Scrolltide shader library (`Orchid Flow`, `Neon Mesh`), Uniswap (`12-uniswap-org.png`), and Ledger (`41-ledger.com`).
- **Why Rejected**: Blurry radial purple/cyan blobs reduce text contrast, look like generic 2022 crypto templates, and violate EF's crisp tonal surface architecture where elevation is communicated through solid luminance steps (`#101013` -> `#1A1A1E` -> `#1F1F24`) rather than neon drop-shadows.

## 2. Rejected Hero & Layout Formulas

### R-04: Centered Generic Slogan + Two Pill Buttons + Empty Fold
- **Observed In**: Numerous SaaS templates on `supahero.io` and `scrolltide.co`.
- **Why Rejected**: Fails the 5-second comprehension test. A visitor arriving at `seer.pm` needs to see *how* Information Finance works (a real question branching into priced outcomes and decision signals) and how the six interfaces connect, not a vague slogan like "Intelligence Reimagined."

### R-05: Unexplained Floating 3D Clay Icons or Rotating Spheres
- **Observed In**: `3dicons.co` generic icon sets (`Wallet`, `Gift`, `Target`, `Potion`) and generic WebGL agency demos.
- **Why Rejected**: Fails the 3D Acceptance Test. A rotating sphere or clay coin communicates zero information about Conditional Tokens, Reality.eth, Kleros, or market-driven triage. Every spatial or animated element in our concepts must represent actual Seer mechanics (such as a question splitting into conditional `YES`/`NO` trajectories or 98 repositories being ranked by original work share).

### R-06: Three Identical Icon-in-Circle Feature Cards
- **Observed In**: Standard startup templates ("Fast / Secure / Scalable").
- **Why Rejected**: Tells the user nothing specific about Seer. When explaining the protocol stack (`Conditional Tokens ERC1155->ERC20`, `Reality.eth Optimistic Oracle`, `Kleros Arbitration`) or the four market types (`Categorical`, `Multi Categorical`, `Scalar`, `Multi Scalar`), each item requires its own concrete structural diagram or real data example.

## 3. Rejected Product & UX Misrepresentations

### R-07: Presenting Markets as Automated Governance Execution
- **Observed In**: Naive interpretations of futarchy and AI markets.
- **Why Rejected**: Seer's bounty brief and live audits explicitly state that **Futarchy informs a DAO's decision rather than making the decision for it**, and **Opportunity Markets give reviewers a triage signal while leaving the final selection to them**. Our UI and copy must always distinguish the *Market Signal* from the *Human Decision Authority*.

### R-08: Chatbot / Prompt-Box Hero ("Ask Seer AI")
- **Observed In**: OpenAI / Lovable (`23-lovable-dev.png`) prompt-box heroes and the ambiguous unlabelled `"Ask Seer"` button critiqued in `products/home/audit/06-comprehension-problems.md` (C3).
- **Why Rejected**: Seer's agentic economy vision is about autonomous AI agents **forecasting, pricing outcomes, and batch-trading in markets** (as on `deep.seer.pm`), not a consumer LLM chat wrapper.

### R-09: Fake Social Proof, Invented TVL Counters, or Fabricated Testimonials
- **Observed In**: Injective (`01-injective-com.png` celebrity quote carousel) and SaaS CTA templates (`cta.gallery` "Join 10,000+ teams").
- **Why Rejected**: Violates Non-Negotiable Rule #7. We use only verified facts from Seer's documentation and Oct 2026 audits (`$331B` industry volume from The Block with `<2%` info finance; `2,947` indexed markets in Explorer; `98` repositories in Deep Round 3; `235` submissions in Opportunity Markets pilot; `33` DeFi assets in Risk Pricing Q3 2026).

### R-10: Scroll-Hijacking and Unbounded Particle Loops
- **Observed In**: Heavy WebGL showcase sites (`lusion.co`, `igloo.inc`).
- **Why Rejected**: Degrades usability, breaks keyboard navigation, causes motion sickness, and obscures financial figures. All motion in our three concepts is non-blocking, respects `prefers-reduced-motion: reduce`, and keeps tabular numbers rock-steady.
