# Electric Foundation Brand System Audit and Token Specification

Date: 2026-10-22
Scope: Official Brand Extraction & Justified Extensions (`poidh2/docs/design/EF-BRAND-AUDIT.md`)
Primary Sources:
- Official Figma Board: `https://www.figma.com/design/cB6ZFMUkBwMBhHadLdiSmh/Seer-Branding?node-id=118-16652`
- Exported Kit Boards: `poidh2/assets/ef_kit/color-palette.png`, `dark-mode-board.webp`, `light-mode-board.webp`, `trade-ticket.png`
- Seer Part II Identity Update: `poidh2/assets/x_post/c.png`, `b.png`, `post.md`
- Heritage Brand Assets: `poidh2/assets/brand/logo.svg`, `star.svg`, `logo-alt.png`

## 1. Official Color Tokens & Discrepancy Reconciliation

Direct inspection of `poidh2/assets/ef_kit/color-palette.png` and `dark-mode-board.webp` / `light-mode-board.webp` reveals two text-label copy-paste typos inside the Figma swatch sheet that must be reconciled against the actual rendered pixels:
1. **Button Primary Swatch Label**: In `color-palette.png`, the text label inside the vivid electric-violet swatch reads `67676F` (copied by mistake from `Muted labels` directly above it), whereas the actual rendered swatch pixel value is `#7A3CFF` / `#7B3AFF`. We prioritize the rendered vivid electric violet (`#7A3CFF` / `#7B3AFF`) as `--ef-primary`.
2. **Light Mode Nested Surface Swatch Label**: In `color-palette.png`, the Light Mode `Nested Surface` column retains the dark-mode label `1F1F24` while rendering as a soft cool grey (`#F0F0F3` / `#F1F1F4`). We codify `#F1F1F4` for light-mode `--ef-bg-nested`.

### Verified Surface, Text, and Action Tokens

| Token Name | Role | Dark Mode Value | Light Mode Value | Source / Evidence |
|---|---|---|---|---|
| `--ef-bg-page` | Primary page canvas | `#101013` | `#F7F7F9` | Exact match to `color-palette.png` (`Page Background`) |
| `--ef-bg-card` | Primary card / container surface | `#1A1A1E` | `#FFFFFF` | Exact match to `color-palette.png` (`Card base`) |
| `--ef-bg-nested` | Nested row / input / pill surface | `#1F1F24` | `#F1F1F4` | Dark exact (`#1F1F24`); Light sampled from `color-palette.png` swatch |
| `--ef-bg-elevated` | Hover / popover / floating surface | `#26262C` | `#EAEAEF` | Tonal +1 step derived from EF surface ladder |
| `--ef-text-primary` | Headlines, questions, primary values | `#EDEDF2` | `#17171C` | Exact match to `color-palette.png` (`Text Primary`) |
| `--ef-text-secondary` | Supporting copy, outcome labels | `#A8A8B3` | `#5C5C66` | Exact match to `color-palette.png` (`Text Secondary`) |
| `--ef-text-muted` | Captions, volume footers, timestamps | `#67676F` | `#8E8E99` | Exact match to `color-palette.png` (`Muted labels`) |
| `--ef-primary` | Primary CTA, active chip, `Yes`/`Up` action | `#7A3CFF` | `#7A3CFF` | Sampled from `Button Primary` swatch in `color-palette.png` & `trade-ticket.png` |
| `--ef-primary-hover` | Primary button hover state | `#8B54FF` | `#6929EE` | Tonal luminance shift preserving saturation |
| `--ef-secondary-bg` | Secondary button / `No`/`Down` surface | `#241E33` | `#EFE9FC` | Exact match to `color-palette.png` (`Button Secondary`) |
| `--ef-secondary-text` | Secondary button / lavender accent text | `#9C6FF2` | `#6C2BD9` | Exact match to `color-palette.png` (`Button Secondary Text`) |
| `--ef-hairline` | Subtle structural divider (when needed) | `rgba(237, 237, 242, 0.07)` | `rgba(23, 23, 28, 0.08)` | Derived to support architectural schematics while keeping cards borderless |

## 2. Deliberate & Justified Departures from the Base Kit

Per the POIDH #38 competition rules (*"start with the EF brand kit as a starting point... explain any deliberate departures"*), we document four targeted, high-discipline extensions required to represent Seer's six connected Information Finance interfaces:

1. **Reversal of the EF Line Motif (Mandatory Organizer Rule)**:
   - *Departure*: The original EF round-one concept converged multiple lines into one point. Following Seer's October 17, 2026 instruction (`assets/x_post/c.png`), we reverse the motif so **one horizontal violet line enters from the left and fans out into multiple parallel lines to the right** (`#7A3CFF` center core stepping through `#9C6FF2` and `#5628B4` on outer branches).
   - *Rationale*: Represents one structured question opening into many priced outcomes and specialized decision signals.
2. **Dual Brand Mark Support (EF Lightning-S + Heritage Raven-Star)**:
   - *Departure*: `dark-mode-board.webp` displays the geometric lightning-S hexagonal mark + lowercase `seer` wordmark, while Seer's October 17, 2026 X post (`c.png` and `b.png`) pairs the reversed violet fan-out lines with the white **raven-in-circle with four-point star** (`assets/brand/logo.svg`).
   - *Rationale*: Our header uses the crisp EF lightning-S + `seer` wordmark for product-suite consistency, while honoring the raven-star mark in the protocol insignia and heritage colophon so neither half of Seer's live identity is orphaned.
3. **Controlled Semantic Status Tokens (Strictly Scoped to Data Meaning)**:
   - *Departure*: The EF kit board only shows violet (`Yes`/`Up`) and dark violet-grey (`No`/`Down`) plus a red `LIVE` indicator dot (`BTC Up or Down 5m` card in `dark-mode-board.webp`). However, Futarchy (`+-1%` TWAP corridor), Opportunity Markets (market odds vs human sponsor decision), and Risk Pricing (`Low 0-2%`, `Moderate 2-5%`, `High 5-10%`, `Critical 10-100%`) cannot communicate directional impact or risk severity with violet alone.
   - *Rationale*: We add strictly scoped semantic data tokens (`--ef-sem-positive` `#3DDC97` dark / `#12915F` light; `--ef-sem-warning` `#F5B84A` dark / `#B9770E` light; `--ef-sem-danger` `#FF5C72` dark / `#D1334A` light; `--ef-sem-agent` `#5B9DFF` dark / `#2F6FD6` light) used **exclusively** inside data visualizations, risk bands, and status dots, never as decorative page backgrounds.
4. **Monospace Data Layer (`JetBrains Mono` / `IBM Plex Mono`)**:
   - *Departure*: The EF kit uses a single geometric grotesk (`Inter Tight`) across UI and numerals.
   - *Rationale*: Across 6 interfaces handling contract addresses (`0x8b3c...a5e8`), TWAP windows, CSV weights, and annualized PD tables, pairing `Inter Tight` (loaded via `@fontsource-variable/inter-tight` with `tabular-nums`) with a clean monospace stack for on-chain hashes, schema keys, and coordinate tags improves technical legibility.

## 3. Surface, Border, Radius, and Spacing Architecture
- **Tonal Separation Over Borders**: In `dark-mode-board.webp`, cards (`#1A1A1E`) sit on the `#101013` page without 1px strokes, and outcome rows (`#1F1F24`) nest inside cards with concentric radii.
- **Concentric Radii Scale**:
  - Outer feature / hero stage: `16px` (`--ef-radius-lg`)
  - Standard market / ecosystem card: `12px` (`--ef-radius-md`)
  - Nested outcome row / button / input: `8px` (`--ef-radius-sm`)
  - Search bar / filter chip / status badge: `999px` (`--ef-radius-pill`)
- **4px Spatial Grid**: All padding, gaps, and control heights snap to the 4px scale (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `48px`, `64px`). Interactive controls maintain a minimum `40px` height for touch accessibility.
