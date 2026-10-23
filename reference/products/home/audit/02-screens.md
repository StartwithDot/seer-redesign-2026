# screens (home; DeepSeek draft: Claude verifies against screenshots)

# Screen-by-screen audit — provided states

The provided notes contain exactly one captured route/state: **STATE 001**. No other routes/states, modals, drawers, or tooltips are documented in the supplied notes.

| STATE | Route | URL | Screen type | Purpose |
|---|---|---|---|---|
| STATE 001 | `/` | `https://seer.pm/` | Marketing/landing page | Introduces Seer prediction marketplace, market types, settlement/dispute stack, use cases, and CTAs to launch/create/trade. [STATE 001] |

## STATE 001 — `/` (`https://seer.pm/`) — landing page

### Purpose and capture scope
- Marketing/landing screen for the Seer prediction marketplace; introduces the product, market types, settlement/dispute stack, use cases, and CTAs to launch/create/trade. [STATE 001]
- Capture metadata: `controls=26`, `charts=0`, `tables=0`. [STATE 001]
- No wallet-gated, empty, ended, or error state is visible in this capture. [STATE 001]
- The notes do not provide a complete DOM order; the layout regions below are identifiable from named copy and controls, but exact vertical/visual arrangement is not fully specified. [STATE 001]

### Identifiable layout regions
- **Header**
  - Contains header links/controls: **Documentation**, **Blog**, **Launch App**. [STATE 001]
  - `Documentation` links to `https://seer-3.gitbook.io/seer-documentation`; `Blog` links to `https://seer-pm.medium.com/`; `Launch App` links to `https://app.seer.pm/`. [STATE 001]

- **Airdrop banner**
  - Announces “Seer Initial Airdrop Distribution” with a **Learn More** link/CTA. [STATE 001]
  - The captured airdrop link is `https://seer-pm.medium.com/announcing-the-seer-initial-airdr` as shown in the inventory; this may be truncated in the notes. [STATE 001]
  - No amount, date, eligibility, or distribution fields are shown. [STATE 001]

- **Hero**
  - Contains **Start Now** and secondary **Learn More** CTAs. [STATE 001]
  - Includes an example prediction estimate: **97.3%**, formatted as a percentage with one decimal. [STATE 001]
  - Includes an example market time scope: **Q2 2025**, formatted as quarter/year. [STATE 001]
  - Includes **Ask Seer**, a labeled control near the example prediction; its action/function is not specified. [STATE 001]
  - `Start Now` links to `https://app.seer.pm/`; hero `Learn More` links to `https://seer-3.gitbook.io/seer-documentation`. [STATE 001]

- **Market-types section/list**
  - States there are **four different types of Market**. [STATE 001]
  - Four market-type cards/entries are documented, each with a **View Example** control: **Categorical**, **Multi Categorical**, **Scalar**, **Multi Scalar**. [STATE 001]
  - Market-type descriptions:
    - **Categorical** — “Select one out of multiple outcomes.” [STATE 001]
    - **Multi Categorical** — “allowing selection of multiple outcomes.” [STATE 001]
    - **Scalar** — “Numeric outcome within a specified range.” [STATE 001]
    - **Multi Scalar** — “Numeric outcome within a specified range.” [STATE 001]
  - ⚠️ The notes flag that **Multi Scalar** duplicates the **Scalar** description with no stated distinction. [STATE 001]

- **Explainer/settlement panel**
  - Explains that Seer uses the **Conditional Tokens framework** to create/manage outcome tokens. [STATE 001]
  - Explains that Seer wraps **ERC1155** outcome tokens into **ERC20** tokens for smoother trading and DeFi integration. [STATE 001]
  - Explains that Seer uses **Kleros** to resolve disputes arising when answering **Reality.eth** questions; Kleros is described as a decentralized arbiter applying rules to simple/complex questions. [STATE 001]

- **Use-case list**
  - Use-case list includes: Elections, Sports, Political Forecasting, Financial Market Predictions, Event Outcomes, Crowdsourced Intelligence, Disaster and Risk Management, Insurance Underwriting, Social Good and Charity, Research and Development, Entertainment and Media, More. [STATE 001]
  - A **More** control appears under “A world of opportunities”; its action is not captured. [STATE 001]

- **Final CTA/contact region**
  - Contains a final **Start Now** CTA before contact. [STATE 001]
  - Contains **Get in Touch!** contact CTA; its action/destination is not captured. [STATE 001]
  - Contains contact email **info@seer.pm**, captured as `mailto:info@seer.pm`. [STATE 001]

- **“Available on:” area**
  - “Available on:” is present, but no platform names or logos are captured in text. [STATE 001]
  - This appears to be a logo/platform area, but its contents are not captured. [STATE 001]

- **Footer**
  - Footer controls/labels named in notes: **Seer App**, **Blog**, **Community**, **Docs**, **Documentation**, **Images & Branding**. [STATE 001]
  - Captured footer destinations:
    - `Seer App` → `https://app.seer.pm/` [STATE 001]
    - `Blog` → `https://seer-pm.medium.com/` [STATE 001]
    - `Community` → `https://discord.com/invite/rBEB4MYQwV` [STATE 001]
    - `Images & Branding` → `https://drive.google.com/drive/folders/1EOGhjj_jHJ5PPt86VEDu` [STATE 001]
  - Footer includes both **Documentation** and **Docs** labels; only `Documentation` is separately captured in the inventory as linking to `https://seer-3.gitbook.io/seer-documentation`. [STATE 001]
  - Footer social/icon links captured without text:
    - GitHub → `https://github.com/seer-pm` [STATE 001]
    - X → `https://x.com/seer_pm` [STATE 001]
    - Telegram → `https://t.me/Seerpredictionmarket` [STATE 001]
    - Discord → `https://discord.com/invite/rBEB4MYQwV` [STATE 001]
    - Medium → `https://seer-pm.medium.com/` [STATE 001]
    - Kleros → `https://kleros.io/` [STATE 001]

### Data shown
| Data / content | Value / format | Notes |
|---|---|---|
| Example prediction estimate | **97.3%** | Percentage, one decimal. [STATE 001] |
| Example market time scope | **Q2 2025** | Quarter/year format. [STATE 001] |
| Market type count | **four different types of Market** | Categorical, Multi Categorical, Scalar, Multi Scalar. [STATE 001] |
| Airdrop announcement | “Seer Initial Airdrop Distribution” | No amount, date, eligibility, or distribution fields shown. [STATE 001] |
| Contact email | **info@seer.pm** | Email format; captured as `mailto:info@seer.pm`. [STATE 001] |
| “Available on:” | Present | No platform names/logos captured in text. [STATE 001] |
| Charts/tables | None | `charts=0`, `tables=0`; no data visualization shown. [STATE 001] |

### Controls
The capture reports **26 controls total**, but the supplied control inventory is truncated and the text alone does not identify all 26 unambiguously. [STATE 001]

| Control | Region / context | Href / action as captured | Notes |
|---|---|---|---|
| **Learn More** | Airdrop banner | `https://seer-pm.medium.com/announcing-the-seer-initial-airdr` | Captured URL may be truncated. [STATE 001] |
| *(unnamed button)* | Captured in inventory | — | Button has no text; action not captured. [STATE 001] |
| **Documentation** | Header | `https://seer-3.gitbook.io/seer-documentation` | [STATE 001] |
| **Blog** | Header | `https://seer-pm.medium.com/` | [STATE 001] |
| **Launch App** | Header | `https://app.seer.pm/` | [STATE 001] |
| **Start Now** | Hero CTA | `https://app.seer.pm/` | [STATE 001] |
| **Learn More** | Hero secondary CTA | `https://seer-3.gitbook.io/seer-documentation` | [STATE 001] |
| **Ask Seer** | Near example prediction | Action not specified | Label is ambiguous; no described function. [STATE 001] |
| **Create A Market** | CTA | `https://app.seer.pm/create-market` | [STATE 001] |
| **Start Trading** | CTA | `https://app.seer.pm/` | [STATE 001] |
| **View Example** — Categorical | Market-type entry | `https://app.seer.pm/markets/100/0x43d881f5920ed29fc5cd4917d6` | URL as captured; may be truncated. [STATE 001] |
| **View Example** — Multi Categorical | Market-type entry | `https://app.seer.pm/markets/100/0x528c5535136ce58611dc347ae8` | URL as captured; may be truncated. [STATE 001] |
| **View Example** — Scalar | Market-type entry | `https://app.seer.pm/markets/100/0xe12f48ecdd6e64d95d1d8f1d5d` | URL as captured; may be truncated. [STATE 001] |
| **View Example** — Multi Scalar | Market-type entry | `https://app.seer.pm/markets/100/0x8df5b3a628b3d7703164620418` | URL as captured; may be truncated. [STATE 001] |
| **More** | “A world of opportunities” | Action not captured | [STATE 001] |
| **Start Now** | Final CTA before contact | Inventory captures `Start Now` linking to `https://app.seer.pm/`; the notes also name a final `Start Now` before contact | Exact separate control identity is not fully resolved in the captured inventory. [STATE 001] |
| **Get in Touch!** | Contact CTA | Action not captured | [STATE 001] |
| **info@seer.pm** | Contact email | `mailto:info@seer.pm` | [STATE 001] |
| **Seer App** | Footer | `https://app.seer.pm/` | [STATE 001] |
| **Blog** | Footer | `https://seer-pm.medium.com/` | [STATE 001] |
| **Community** | Footer | `https://discord.com/invite/rBEB4MYQwV` | [STATE 001] |
| **Docs** | Footer | Destination not separately captured | Footer includes both `Docs` and `Documentation`. [STATE 001] |
| **Documentation** | Footer | `https://seer-3.gitbook.io/seer-documentation` | [STATE 001] |
| **Images & Branding** | Footer | `https://drive.google.com/drive/folders/1EOGhjj_jHJ5PPt86VEDu` | [STATE 001] |
| *(icon link)* | Footer social | `https://github.com/seer-pm` | No text captured. [STATE 001] |
| *(icon link)* | Footer social | `https://x.com/seer_pm` | No text captured. [STATE 001] |
| *(icon link)* | Footer social | `https://t.me/Seerpredictionmarket` | No text captured. [STATE 001] |
| *(icon link)* | Footer social | `https://discord.com/invite/rBEB4MYQwV` | No text captured. [STATE 001] |
| *(icon link)* | Footer social | `https://seer-pm.medium.com/` | No text captured. [STATE 001] |
| *(icon link)* | Footer social | `https://kleros.io/` | No text captured. [STATE 001] |

### Modals / drawers / tooltips
- No modals, drawers, or tooltips are reported in the supplied notes for STATE 001. [STATE 001]
- No overlay state is captured. Absence from this capture should not be treated as proof that the live product has none. [STATE 001]

### Explicit uncertainties and oddities
- The notes contain only **STATE 001**; no additional routes/states are documented. [STATE 001]
- The control inventory is truncated; the capture reports **26 controls**, but the supplied text does not identify all 26 unambiguously. [STATE 001]
- Exact actions/destinations for **Ask Seer**, **More**, **Get in Touch!**, and the unnamed button are not captured. [STATE 001]
- “Available on:” has no named platforms or logos in captured text. [STATE 001]
- **Multi Scalar** description duplicates **Scalar** (“Numeric outcome within a specified range”) with no stated distinction. [STATE 001]
- The airdrop announcement has no distribution details, dates, eligibility, or amounts. [STATE 001]
- Footer includes both **Documentation** and **Docs** labels. [STATE 001]
- Example wording asks whether “any type of nuclear device” will be used offensively, while the estimate is framed as the chance “that no nuclear device will be used offensively.” [STATE 001]
- No charts or tables are shown: `charts=0`, `tables=0`. [STATE 001]
- The supplied data-model section is truncated and contains no usable API shape details; no API data beyond page copy can be described from the notes. [STATE 001]