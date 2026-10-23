# Design Reference Atlas: Seer Electric Foundation Laboratory

Date: 2026-10-22
Scope: 26 Curated Visual & Functional References (`poidh2/docs/research/DESIGN-REFERENCE-ATLAS.md`)

All references below were inspected via live web browsing (`google:browse`) and/or multi-viewport screenshot strips in `research/inspiration/home/`, `home2/`, and `home3/`. Every entry follows the transformation sequence: **Observed pattern -> underlying principle -> user need -> Seer-specific meaning -> original visual implementation**.

## 1. Navigation Systems (`navbar.gallery` & Benchmarks)

### Ref 01: Consensys Multi-Product Ecosystem Header
- **Source**: Navbar Gallery (`https://navbar.gallery/`) / Consensys
- **Visual Reference**: Inspected via `navbar.gallery` index #543 (Dropdowns, Megamenu, Static Navbar)
- **Relevant Page Section**: Global sticky top navigation and multi-product flyout
- **Pattern Category**: Multi-product ecosystem navigation
- **Successful Design Principle**: Grouping distinct infrastructure applications under a structured two-column ecosystem menu where each item pairs an icon glyph, product title, one-line role definition, and chain/status badge.
- **Interaction Observations**: Hover/click trigger with 90ms intent delay; keyboard arrow traversal; clear active indicator on current surface.
- **Why Relevant to Seer**: Visitors landing on `seer.pm` must immediately discover that Seer powers five specialized applications (Seer App, Deep, Futarchy, Opportunity Markets, Risk Pricing).
- **Why Inappropriate if Copied**: Enterprise bloat (15+ links across 4 columns) overwhelms newcomers.
- **Seer Reinterpretation**: A compact 6-surface Ecosystem Switcher + inline quick-pills showing each surface's **Question Type**, **Primary User**, and **Live URL**.
- **Licensing / Originality**: Custom architectural implementation in React/CSS; zero copied markup.

### Ref 02: Cloudflare & Browserbase Sticky Technical Bar
- **Source**: Navbar Gallery (`https://navbar.gallery/`) / Cloudflare (#544) & Browserbase (#536)
- **Visual Reference**: Inspected via `navbar.gallery` (#536, #544)
- **Relevant Page Section**: Top utility + primary nav bar
- **Pattern Category**: Technical status + navigation bar
- **Successful Design Principle**: Separating protocol-level utility (documentation, chain status, theme switcher, command palette `/` shortcut) from primary application routing.
- **Interaction Observations**: Instant keyboard focus ring, compact 40px interactive targets, responsive drawer below 1024px.
- **Why Relevant to Seer**: Seer serves both human decision-makers and technical/agent builders who expect quick access to Docs, GitHub, and live app routes.
- **Why Inappropriate if Copied**: SaaS login/pricing CTAs ("Start Free Trial") do not fit a decentralized protocol.
- **Seer Reinterpretation**: Replace SaaS CTAs with "Explore Ecosystem" and direct links to live Seer surfaces (`app.seer.pm`, `futarchy.seer.pm`, `deep.seer.pm`, `opportunity.seer.pm`, `risk.seer.pm`).
- **Licensing / Originality**: Original token-driven CSS implementation.

### Ref 03: Official Electric Foundation Web App Top Bar
- **Source**: Seer EF Brand Kit (`https://www.figma.com/design/cB6ZFMUkBwMBhHadLdiSmh/Seer-Branding`)
- **Visual Reference**: `poidh2/assets/ef_kit/dark-mode-board.webp` & `light-mode-board.webp`
- **Relevant Page Section**: App header & category rail
- **Pattern Category**: Brand foundation navigation
- **Successful Design Principle**: Lightning-S mark + lowercase `seer` wordmark on `#101013` dark ground (`#F7F7F9` light ground), tonal pill search bar (`#1A1A1E`), clean text links, and a high-contrast `#7A3CFF` primary action pill with external-link icon.
- **Interaction Observations**: Zero 1px structural borders; hierarchy achieved strictly through surface luminance steps (`#101013` -> `#1A1A1E` -> `#1F1F24`).
- **Why Relevant to Seer**: This is the non-negotiable visual truth of the Electric Foundation identity.
- **Why Inappropriate if Copied Unchanged**: The kit header (`Markets / Create Market / Policies / App`) is designed for the Seer App explorer, not the protocol homepage.
- **Seer Reinterpretation**: Preserve the exact EF logo, tonal pill geometry, and `#7A3CFF` action button while adapting the navigation items to introduce the protocol and route across all six surfaces.
- **Licensing / Originality**: Official Seer brand kit asset.

## 2. Hero Sections (`supahero.io` & Captured Strips)

### Ref 04: Seer Part II Reversed Fan-Out Motif
- **Source**: Seer Official X Announcement (`https://x.com/seer_pm/status/2111351009801089244`)
- **Visual Reference**: `poidh2/assets/x_post/c.png`
- **Relevant Page Section**: Hero signature graphic
- **Pattern Category**: Brand motif & conceptual diagram
- **Successful Design Principle**: One violet line entering from the left and smoothly branching into seven parallel horizontal lines to the right on a near-black ground.
- **Interaction Observations**: Static in the X post, begging for interactive mathematical binding where a single input question branches into multiple priced outcomes and specialized surfaces.
- **Why Relevant to Seer**: Explicitly mandated by the contest organizer ("Reverse the direction of EF's line design: ONE line enters from the LEFT and FANS OUT into many parallel lines to the RIGHT").
- **Why Inappropriate if Copied as a Flat Image**: Pasting `c.png` as a static JPEG misses the opportunity to explain Information Finance interactively.
- **Seer Reinterpretation**: Used across all three concepts as a living SVG/Canvas spine where one question on the left branches into priced outcomes and decision signals on the right.
- **Licensing / Originality**: Official Seer contest asset re-engineered as procedural SVG/Canvas geometry.

### Ref 05: Linear "Product Development System for Teams and Agents"
- **Source**: Supahero (`https://supahero.io/`) & `https://linear.app/`
- **Visual Reference**: `research/inspiration/home3/strip-02-linear-app.png` (Frames 1-6)
- **Relevant Page Section**: Left-aligned hero + Fig 0.1 / 0.2 / 0.3 architectural diagrams
- **Pattern Category**: Architectural dark hero & technical figure numbering
- **Successful Design Principle**: Restrained tonal grey hierarchy (`#EDEDF2` primary, `#A8A8B3` secondary, `#67676F` muted), left-aligned headline explicitly naming both humans and agents, followed by crisp architectural schematics labeled `FIG 0.1`, `FIG 0.2`, `FIG 0.3`.
- **Interaction Observations**: Calm, mechanical transitions; real UI proof anchored below the fold without neon glows.
- **Why Relevant to Seer**: Seer's 2026 identity ("Information Finance infrastructure for the agentic economy") requires the exact same institutional restraint and dual human/agent clarity.
- **Why Inappropriate if Copied**: Linear is monochrome grey/white; Seer requires Electric Foundation's `#7A3CFF` violet and `#241E33` deep violet secondary surfaces.
- **Seer Reinterpretation**: In **Concept A (Protocol / Infrastructure)**, we pair left-aligned architectural typography with `FIG 0.1 - 0.3` schematic diagrams of Conditional Tokens (`ERC1155 -> ERC20`), `Reality.eth`, and `Kleros`.
- **Licensing / Originality**: Original layout and diagrams using EF tokens.

### Ref 06: Monad Hairline Blueprint & Dual-Mode Contrast
- **Source**: `https://monad.xyz/`
- **Visual Reference**: `research/inspiration/home3/strip-06-monad-xyz.png` (Frames 1-6)
- **Relevant Page Section**: Hero fan-lines & 4-card technical specification row (`300ms`, `600ms`, `Near-zero`, `Full EVM`)
- **Pattern Category**: Vector line geometry & technical proof cards
- **Successful Design Principle**: Fine violet vector lines radiating with mathematical precision, paired with dark technical specification cards that use minimal line-art diagrams (clock, concentric rings, decay curve, isometric cube) above crisp tabular metrics.
- **Interaction Observations**: High contrast transitions between light editorial sections and deep near-black technical panels.
- **Why Relevant to Seer**: Demonstrates how violet vector line work can look institutional and engineered rather than like a "crypto casino."
- **Why Inappropriate if Copied**: Monad's lines converge toward the center horizon; Seer's lines must fan out from left (1 question) to right (many outcomes).
- **Seer Reinterpretation**: Used to inspire the precision vector line weights and market-type specification diagrams in **Concept A** and **Concept B**.
- **Licensing / Originality**: Original mathematical SVG curves.

### Ref 07: Injective Rim-Lit Spatial Stage & Violet Chapter Panel
- **Source**: `https://injective.com/`
- **Visual Reference**: `research/inspiration/home3/strip-01-injective-com.png` (Frames 1-6)
- **Relevant Page Section**: Hero stage & full-width electric violet chapter panel ("The Blockchain Built for Finance")
- **Pattern Category**: Spatial dark hero & high-contrast chapter blocking
- **Successful Design Principle**: Near-black (`#101013`) stage where a single sculptural centerpiece commands attention above/beside the headline, contrasted lower on the page by a bold electric-violet structural callout panel with crisp white architectural line art.
- **Interaction Observations**: Tabbed industry vertical selector ("AI & Agentic Finance", "Derivatives Markets", "Tokenization") where the active card elevates in solid electric violet.
- **Why Relevant to Seer**: Shows how a bold electric violet accent can anchor an institutional financial narrative covering both institutions and AI agents.
- **Why Inappropriate if Copied**: Injective's "By the Numbers" stat block and celebrity quote carousel feel like generic marketing filler.
- **Seer Reinterpretation**: In **Concept B (Signal / Spatial Experience)**, we use a spatial interactive canvas where the reversed EF fan-out streams connect a live question to six interactive surface nodes, and use an active violet selector card for the six Seer products.
- **Licensing / Originality**: Original interactive canvas and product data.

### Ref 08: Hyperliquid Sparse Depth Field & Live Market Terminal Preview
- **Source**: `https://hyperliquid.xyz/`
- **Visual Reference**: `research/inspiration/home3/strip-07-hyperliquid-xyz.png` (Frames 1-6)
- **Relevant Page Section**: Dot-field transition band, live asset ticker pills, and real product UI showcase
- **Pattern Category**: Particle depth field & live financial instrument proof
- **Successful Design Principle**: Variable-size crisp dots creating depth without blurry bloom, paired with real, functional-looking market ticker pills (`SKHYNIX`, `XYZ100`, `ZEC`, `HYPE`, `S&P500`) that ground the abstract thesis in concrete tradable instruments.
- **Interaction Observations**: Clicking or hovering market pills updates the live preview context.
- **Why Relevant to Seer**: Visitors understand Information Finance fastest when they can inspect real questions from Futarchy (`EIP-8363`), Deep (`98 repos`), Opportunity (`235 names`), and Risk (`33 DeFi assets`).
- **Why Inappropriate if Copied**: Hyperliquid is a perpetual futures DEX; Seer must highlight the *decision signal* and *question asker*, not just orderbooks.
- **Seer Reinterpretation**: In **Concept C (Intelligence / Product Experience)**, we let visitors switch between real audited questions from all five Seer apps and inspect both the **Asker's Decision View** and the **Trader's Market View**.
- **Licensing / Originality**: Uses real audited Seer fixture data from `products/*/audit/`.

### Ref 09: Stripe Flowing Ribbon & Two-Tone Typography
- **Source**: Supahero (`https://supahero.io/`) & `https://stripe.com/`
- **Visual Reference**: `research/inspiration/home3/strip-03-stripe-com.png` & `home2/04-stripe-com.png`
- **Relevant Page Section**: Hero headline + flowing ribbon + interactive product workbench
- **Pattern Category**: Information hierarchy & interactive product storytelling
- **Successful Design Principle**: Two-tone typography where the primary claim is high-contrast (`#EDEDF2` or `#17171C`) and the supporting context is muted (`#A8A8B3` or `#5C5C66`), paired with live UI components that demonstrate how multiple products share one infrastructure spine.
- **Why Relevant to Seer**: Helps balance dense financial concepts with immediate visual scannability.
- **Why Inappropriate if Copied**: Stripe's multi-color warm rainbow gradient violates the Electric Foundation palette rules.
- **Seer Reinterpretation**: Strict adherence to EF violet (`#7A3CFF`), lavender (`#9C6FF2`), and tonal neutrals (`#101013` / `#1A1A1E` / `#1F1F24`).
- **Licensing / Originality**: Original implementation.

### Ref 10: Better Stack & Zed Technical Clarity Heroes
- **Source**: Supahero (`https://supahero.io/`) - Better Stack & Zed entries
- **Visual Reference**: Inspected via `supahero.io` curated collection
- **Relevant Page Section**: Hero above-the-fold composition
- **Pattern Category**: High-density developer & analyst hero
- **Successful Design Principle**: Pairing a concise, zero-fluff headline with an interactive telemetry or code/signal inspector right in the first viewport so technical visitors can test the thesis immediately.
- **Why Relevant to Seer**: Fits **Concept C (Intelligence / Product Experience)** where visitors can toggle between Human Reader and AI Agent JSON/CSV signal modes.
- **Why Inappropriate if Copied**: Pure developer CLI aesthetics alienate DAO voters and non-technical grant reviewers.
- **Seer Reinterpretation**: Pair plain-language decision rules ("Who asks / What is priced / How the signal is used") with an optional Agent Schema / CSV weight inspector.
- **Licensing / Originality**: Original implementation.

### Ref 11: Attio & Ramp Annotated Product Storytelling
- **Source**: Supahero (`https://supahero.io/`) & `research/inspiration/home2/17-ramp-com.png`
- **Visual Reference**: `research/inspiration/home2/17-ramp-com.png`
- **Relevant Page Section**: Hero product preview with callout labels
- **Pattern Category**: Annotated interface pedagogy
- **Successful Design Principle**: Pointing explicit callout tags at an interface preview to explain *how* to read the screen (e.g. "1. Sponsor opens submissions", "2. Traders price selection odds", "3. Reviewers triage top candidates").
- **Why Relevant to Seer**: Solves the #1 comprehension barrier identified in our audits of Futarchy, Deep, Opportunity, and Risk: newcomers do not know how a market price translates into a decision without taking away human authority.
- **Why Inappropriate if Copied**: Ramp's yellow palette and handwritten consumer finance stickers do not match EF's institutional tone.
- **Seer Reinterpretation**: Crisp tabular callout badges in EF tonal surfaces (`#1F1F24` with `#9C6FF2` index tags) pointing to real Seer data fields.
- **Licensing / Originality**: Original implementation.

### Ref 12: Phantom Prediction Market Ticket Proof
- **Source**: `https://phantom.com/`
- **Visual Reference**: `research/inspiration/home3/strip-08-phantom-com.png` (Frame 4)
- **Relevant Page Section**: Interactive outcome card showcase
- **Pattern Category**: Micro-component clarity
- **Successful Design Principle**: Showing the actual `Yes` / `No` outcome probabilities and share prices inside a clean, self-contained card so the mechanic reads without a paragraph of prose.
- **Why Relevant to Seer**: Mirrors the EF kit's `trade-ticket.png` (`Clarity Act (H.R.3633) signed into law in 2026?`, `Yes 69c`, `No 37c`).
- **Why Inappropriate if Copied**: Consumer wallet marketing copy lacks Seer's Information Finance depth.
- **Seer Reinterpretation**: Embed authentic EF trade ticket and signal readout components directly inside our ecosystem exploration modules.
- **Licensing / Originality**: Built directly from `poidh2/assets/ef_kit/trade-ticket.png` specifications.

## 3. Conversion & Call-To-Action Systems (`cta.gallery`)

### Ref 13: Tines & Native Security Dual-Path Enterprise CTAs
- **Source**: CTA Gallery (`https://cta.gallery/`) - Tines & Native Security
- **Visual Reference**: Inspected via `cta.gallery` curated collection
- **Relevant Page Section**: Hero and closing conversion blocks
- **Pattern Category**: Dual-intent CTA hierarchy
- **Successful Design Principle**: Pairing a high-conviction action button for ready users with an low-friction exploratory action for researchers, accompanied by concrete trust metadata below the buttons.
- **Why Relevant to Seer**: Seer visitors split into two distinct intents: exploring the 6 live applications versus understanding the protocol/documentation.
- **Why Inappropriate if Copied**: "Book a Demo" or "Enter Work Email" forms violate Web3 permissionless norms.
- **Seer Reinterpretation**: Primary CTA: `Explore the 6 Interfaces` / `Launch Seer App ↗` (`#7A3CFF` fill); Secondary CTA: `Inspect Live Signals` / `Read Protocol Docs` (`#241E33` dark / `#EFE9FC` light with `#9C6FF2` / `#6C2BD9` label).
- **Licensing / Originality**: Original EF button implementation.

### Ref 14: Builderstable & Counterpublic Role-Based Routing Cards
- **Source**: CTA Gallery (`https://cta.gallery/`) - Builderstable & Counterpublic
- **Visual Reference**: Inspected via `cta.gallery`
- **Relevant Page Section**: Pre-footer action matrix
- **Pattern Category**: Persona-segmented conversion
- **Successful Design Principle**: Instead of a single generic bottom banner, offering 3 to 4 role-specific launchpads so different user personas know exactly where to go next.
- **Why Relevant to Seer**: A DAO delegate needs `futarchy.seer.pm`, an AI agent builder needs `deep.seer.pm`, a bounty sponsor needs `opportunity.seer.pm`, and a DeFi risk analyst needs `risk.seer.pm`.
- **Why Inappropriate if Copied**: Generic SaaS pricing tiers ("Starter / Pro / Enterprise").
- **Seer Reinterpretation**: A "Start From Your Question" routing matrix where selecting your role or question type routes directly to the matching Seer application and its live documentation.
- **Licensing / Originality**: Original implementation.

### Ref 15: EF Kit Trade Ticket Action Module
- **Source**: Seer EF Brand Kit (`poidh2/assets/ef_kit/trade-ticket.png`)
- **Visual Reference**: `poidh2/assets/ef_kit/trade-ticket.png`
- **Relevant Page Section**: Interactive confirmation control
- **Pattern Category**: Micro-conversion & pricing feedback
- **Successful Design Principle**: Pairing quick-increment chips (`+$1`, `+$5`, `+$20`, `+$100`) and tabular dollar figures (`$100.00`) with a full-width `#7A3CFF` action button and a secondary `#241E33` cancel/reset button.
- **Why Relevant to Seer**: Demonstrates authentic EF component DNA when previewing how market conviction is staked.
- **Why Inappropriate if Copied as a Live Wallet Transaction**: Contest demos must be safe, read-only simulations without requesting real wallet signatures.
- **Seer Reinterpretation**: Used as an interactive, read-only "Signal Simulator" in Concept C so visitors can test how staking conviction moves implied probability or TWAP impact.
- **Licensing / Originality**: Official EF kit pattern.

## 4. Footer Systems (`footer.design`)

### Ref 16: The Content Architecture & Decimals Structured Protocol Footers
- **Source**: Footer Design (`https://footer.design/`) - The Content Architecture & Decimals (Editor's Choice)
- **Visual Reference**: Inspected via `footer.design` Editor's Choice collection
- **Relevant Page Section**: Multi-column architectural footer
- **Pattern Category**: Ecosystem directory footer
- **Successful Design Principle**: Organizing footer links by functional layer (1. The Six Interfaces, 2. Protocol Stack & Oracles, 3. Developers & Docs, 4. Community & Governance) above a clean colophon with verifiable status and data provenance.
- **Why Relevant to Seer**: Ensures every single one of the six competition surfaces and all official documentation/community channels (`docs.seer.pm`, `deep-pm.gitbook.io/seer-docs`, `github.com/seer-pm`, `x.com/seer_pm`, `t.me/Seerpredictionmarket`, `discord.com/invite/rBEB4MYQwV`) are one click away from the bottom of every page.
- **Why Inappropriate if Copied**: Newsletter signup forms and fake copyright boilerplate.
- **Seer Reinterpretation**: Full 6-surface directory footer with chain badges (`Gnosis Chain`, `Optimism`), oracle attribution (`Conditional Tokens`, `Reality.eth`, `Kleros`), and an explicit `"Sample data from verified Oct 2026 audits"` disclosure chip.
- **Licensing / Originality**: Original implementation.

### Ref 17: Aperios Design & Trove Large Typographic Brand Anchor
- **Source**: Footer Design (`https://footer.design/`) - Aperios Design & Trove
- **Visual Reference**: Inspected via `footer.design` Large Type / Dark categories
- **Relevant Page Section**: Footer brand sign-off
- **Pattern Category**: Brand reinforcement colophon
- **Successful Design Principle**: Anchoring the bottom of the page with the reversed EF fan-out line motif and the Seer mark so the visual story completes its circuit from top to bottom.
- **Why Relevant to Seer**: Reinforces brand recall for judges comparing six links across multiple tabs.
- **Why Inappropriate if Copied**: Oversized agency self-promotion that dwarfs the actual navigation links.
- **Seer Reinterpretation**: A balanced footer sign-off combining the EF lightning-S mark, the legacy raven-star heritage badge, and the reversed fan-out motif.
- **Licensing / Originality**: Original implementation.

## 5. Spatial & Dimensional Design (`3dicons.co` & Spatial Benchmarks)

### Ref 18: 3dicons.co Lighting, Silhouette, and Material Restraint Study
- **Source**: `https://3dicons.co/` (CC0 library by Vijay Verma)
- **Visual Reference**: Inspected via `3dicons.co` (`Chart`, `Target`, `Lock`, `Wallet` renders)
- **Relevant Page Section**: Dimensional object rendering analysis
- **Pattern Category**: Spatial silhouette & material study
- **Successful Design Principle**: Clear readable silhouettes, controlled rim lighting, and matte/satin surface contrast.
- **Why Relevant to Seer**: Teaches why arbitrary 3D clay icons (pumpkins, wallets, locks) **fail** the 3D acceptance test for an institutional Information Finance protocol, whereas dimensional depth that encodes *branching market probabilities* succeeds.
- **Why Inappropriate if Copied**: Dropping cartoonish 3D icons onto Seer cards would look like generic 2021 Web3 template art and violate EF's flat tonal surface language.
- **Seer Reinterpretation**: Reject stock 3D icons; instead, build a procedural 3D/spatial depth projection in **Concept B** where depth (z-axis scale, parallax velocity, and luminance) directly represents **market liquidity, outcome probability, and branching from 1 question into N outcomes**.
- **Licensing / Originality**: No stock 3D icons imported; 100% custom procedural Canvas/SVG geometry.

### Ref 19: Lusion & Igloo Framed Spatial Stage
- **Source**: `https://lusion.co/` & `https://www.igloo.inc/`
- **Visual Reference**: `research/inspiration/home3/04-lusion-co.png` & `05-igloo-inc.png`
- **Relevant Page Section**: Contained interactive canvas stage with telemetry HUD tags
- **Pattern Category**: Bounded interactive WebGL/Canvas stage
- **Successful Design Principle**: Housing an interactive spatial scene inside a sharply framed architectural stage (`16px` radius, `#1A1A1E` card surface) with crisp tabular telemetry readouts overlaid at the corners, preventing canvas chaos from hurting text legibility.
- **Why Relevant to Seer**: Allows **Concept B (Signal / Spatial Experience)** to deliver a breathtaking interactive particle/branching network while keeping headlines, navigation, and CTAs 100% crisp and accessible.
- **Why Inappropriate if Copied**: Full-window scroll-hijacking and low-contrast fog make financial information slow to read.
- **Seer Reinterpretation**: A responsive, bounded interactive Signal Stage in Concept B where users can click any of the 5 application nodes or scrub through the "Question -> Trading -> Signal -> Decision" pipeline, with instant static fallback under `prefers-reduced-motion`.
- **Licensing / Originality**: Original custom Canvas 2D/3D projection engine.

### Ref 20: Vercel Isometric Infrastructure Block
- **Source**: `https://vercel.com/`
- **Visual Reference**: `research/inspiration/home3/strip-10-vercel-com.png`
- **Relevant Page Section**: Architectural stack diagram
- **Pattern Category**: Layered protocol diagram
- **Successful Design Principle**: Representing a shared infrastructure layer beneath multiple specialized frontends using clean geometric planes and hairline connectors.
- **Why Relevant to Seer**: Directly communicates Seer's core bounty prompt: *"introduces Seer as the protocol beneath these applications and shows how they fit together in one ecosystem."*
- **Why Inappropriate if Copied**: Vercel's rainbow prism triangle is its proprietary brand mark.
- **Seer Reinterpretation**: An interactive 3-layer protocol schematic (`Layer 1: Conditional Tokens ERC1155/ERC20` -> `Layer 2: Reality.eth + Kleros Resolution` -> `Layer 3: Five Specialized Information Finance Surfaces`).
- **Licensing / Originality**: Original SVG schematic.

## 6. Motion & Interactive Storytelling (`scrolltide.co` & Digests)

### Ref 21: Scrolltide "Fan Deck" & "Scroll Index" Choreography
- **Source**: Scrolltide (`https://scrolltide.co/`)
- **Visual Reference**: Inspected via `scrolltide.co` Components & Sections library (`Fan Deck`, `Scroll Index`, `Focus Reveal`, `Lime Metrics`)
- **Relevant Page Section**: Interactive section transitions and index navigation
- **Pattern Category**: Scroll-linked & interactive state choreography
- **Successful Design Principle**: Binding visual progression to an explicit step index (`01 / 04`) where each step highlights one structural layer and updates an adjacent visual stage without hijacking native browser scroll.
- **Interaction Observations**: Smooth cubic-bezier(`0.2, 0, 0, 1`) transitions; keyboard and click operable steppers in addition to scroll visibility.
- **Why Relevant to Seer**: Ideal for walking newcomers through the 4-step Information Finance lifecycle (*1. Question Posed -> 2. Humans & AI Agents Price Outcomes -> 3. Market Signal Distilled -> 4. Human Authority Decides & Oracle Resolves*).
- **Why Inappropriate if Copied**: GPU-heavy background swirl shaders (`Orchid Flow`, `Plum Mesh`) distract from financial data and violate EF's flat surface discipline.
- **Seer Reinterpretation**: Implemented as an interactive Lifecycle Stepper and Fan-Out Signal Spine with zero scroll-hijacking.
- **Licensing / Originality**: Original React + CSS state choreography.

### Ref 22: Apple Product Reveal Pacing & Price/Action Pairing
- **Source**: `https://www.apple.com/`
- **Visual Reference**: `research/inspiration/home3/strip-11-apple-com.png`
- **Relevant Page Section**: Chapter headlines and comparison grid
- **Pattern Category**: Pacing & scannable comparison
- **Successful Design Principle**: Starting each major section with a two-line high-contrast statement, followed immediately by a visual comparison where every item shares aligned horizontal rows for effortless scanning.
- **Why Relevant to Seer**: Helps visitors compare the 6 Seer interfaces across shared attributes (*Who Asks*, *What Is Priced*, *How Signal Is Used*, *Who Decides*, *Chain & Collateral*).
- **Why Inappropriate if Copied**: Hardware photography does not apply to a smart contract protocol.
- **Seer Reinterpretation**: Used to structure the 6-Surface Comparison Matrix and Ecosystem Directory.
- **Licensing / Originality**: Original implementation.

## 7. Design Systems & Data Visualization (`styles.refero.design`, Local Audits & Digests)

### Ref 23: VoltAgent / Refero Design System Token Architecture (`DESIGN.md` Standard)
- **Source**: `research/resources_digest.md` & `docs/ef-system.md` (Note: `styles.refero.design` was blocked by robots/network policy during live browse; verified via local curated `resources.md` and `ef-system.md` records)
- **Visual Reference**: `docs/ef-system.md` & `poidh2/assets/ef_kit/color-palette.png`
- **Relevant Page Section**: Design token hierarchy and dark/light parity
- **Pattern Category**: Enforceable CSS custom property architecture
- **Successful Design Principle**: Separating primitive palette values from semantic surface, text, action, and data-series tokens so dark mode (`#101013` / `#1A1A1E` / `#1F1F24`) and light mode (`#F7F7F9` / `#FFFFFF` / `#F1F1F4`) switch seamlessly without per-component overrides.
- **Why Relevant to Seer**: Ensures all three homepage concepts and all five future product interfaces share one single source of truth in `src/design-system/tokens.css`.
- **Why Inappropriate if Copied**: Generic Tailwind/shadcn slate palettes (`#09090b`) deviate from the exact EF Figma swatches (`#101013`, `#1A1A1E`, `#1F1F24`, `#7A3CFF`, `#241E33`, `#9C6FF2`).
- **Seer Reinterpretation**: Exact EF hex values codified in `poidh2/src/design-system/tokens.css`.
- **Licensing / Originality**: Original token architecture.

### Ref 24: Seer X Post Dark-Violet Statistical Chart (`b.png`)
- **Source**: Seer Official X Post (`https://x.com/seer_pm/status/2111351009801089244`)
- **Visual Reference**: `poidh2/assets/x_post/b.png` ("Prediction markets work at scale")
- **Relevant Page Section**: Empirical problem statement section
- **Pattern Category**: Evidence-based data storytelling
- **Successful Design Principle**: Presenting three stark, verifiable macro numbers on the left (`$331B traded Jan-Sep 2026`, `77% sports & parlays, Sep`, `<2% information, Sep`) alongside a clean stacked bar chart and source citation (`The Block, taker notional, 6 Oct 2026`).
- **Why Relevant to Seer**: This is Seer's own flagship argument for why Information Finance must exist. Re-creating this exact data story interactively on the homepage grounds the entire rebrand in hard evidence.
- **Why Inappropriate if Copied as a Raster Image**: A static PNG cannot adapt to mobile widths or light mode.
- **Seer Reinterpretation**: Built as a responsive, theme-aware SVG/HTML empirical evidence module across the landing page concepts with full citation to The Block (Oct 6, 2026).
- **Licensing / Originality**: Official Seer data re-rendered as accessible DOM/SVG.

### Ref 25: Etherscan Scoped Explorer & Freshness Attribution
- **Source**: `docs/competitor-patterns.md` (`https://etherscan.io`)
- **Visual Reference**: `facts/explorer_patterns.json`
- **Relevant Page Section**: Search scope pills and data freshness stamps
- **Pattern Category**: Explorer ergonomics
- **Successful Design Principle**: Making entity scopes explicit (`Categorical`, `Scalar`, `Conditional`, `Futarchy`, `Deep`, `Opportunity`, `Risk`) and pairing every live metric with its chain and settlement status.
- **Why Relevant to Seer**: Directly supports the bounty brief describing Seer App as *"Seer's equivalent of Etherscan."*
- **Why Inappropriate if Copied**: Etherscan's cluttered ad banners and dense 11px tables overwhelm first-time visitors on a protocol homepage.
- **Seer Reinterpretation**: Clean scoped filter chips and live market inspector rows in **Concept C**.
- **Licensing / Originality**: Original implementation.

### Ref 26: Futarchy Reference Implementation ("The Fork" Counterfactual Comparison)
- **Source**: `products/futarchy/HANDOFF.md` & `https://futarchy.seer.pm`
- **Visual Reference**: `products/futarchy/audit-live/`
- **Relevant Page Section**: Dual conditional branch comparison (`YES Price` vs `NO Price` + `TWAP Impact`)
- **Pattern Category**: Counterfactual decision visualization
- **Successful Design Principle**: Plotting the `If Pass (YES)` and `If Fail (NO)` trajectories side by side with an explicit `+-1%` TWAP decision corridor so a voter can read the market's impact forecast in under five seconds.
- **Why Relevant to Seer**: Provides a concrete, mathematically grounded preview of how Seer's specialized surfaces turn market prices into governance intelligence.
- **Why Inappropriate if Copied as the Whole Homepage**: The homepage must represent all six interfaces, not only Futarchy.
- **Seer Reinterpretation**: Featured as one of the five interactive application lenses inside the homepage's Ecosystem Explorer.
- **Licensing / Originality**: Original homepage preview component using audited `EIP-8363` / `GIP-152` data.
