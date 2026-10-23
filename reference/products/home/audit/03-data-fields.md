# data fields (home; DeepSeek draft: Claude verifies against screenshots)

## Scope and caveats
- Captured home/landing state: **STATE 001** only (`https://seer.pm/`). No wallet-gated, empty, ended, or error state is visible in the supplied notes. [STATE 001]
- The supplied **DATA MODEL section is empty/truncated**. No API fields, JSON shapes, or endpoint contracts are available. Therefore no API-field mapping can be made without inventing data. [STATE 001]
- Strings below are limited to those explicitly present in the supplied notes/capture. Paraphrased concept copy in the notes is not treated as verbatim UI text unless quoted.
- `*` in the API column means: **not identifiable — no data model fields were supplied**.

## User-visible numbers / strings / fields

| Field / string | Where shown (STATE ids) | Unit / format / rounding | API field if identifiable (data model) | Meaning / formula |
|---|---|---|---|---|
| `97.3%` | STATE 001 — example prediction estimate | Percentage; one decimal place; underlying rounding behavior not stated | Not identifiable* | Example probability estimate: chance that no nuclear device will be used offensively. [STATE 001] |
| `Prediction markets estimate a 97.3% chance that no nuclear device will be used offensively.` | STATE 001 — example prediction copy | Sentence; includes percentage to one decimal | Not identifiable* | Concept-explaining example probability statement. [STATE 001] |
| `Q2 2025` | STATE 001 — example market time scope | Quarter + year (`Qn YYYY`) | Not identifiable* | Example market time scope. [STATE 001] |
| `four different types of Market` | STATE 001 — landing-page copy | English word count + phrase; not a numeric digit | Not identifiable* | States that there are four market types. [STATE 001] |
| `Categorical` | STATE 001 — market-type card/list | Plain label | Not identifiable* | One of the four market types. [STATE 001] |
| `Select one out of multiple outcomes` | STATE 001 — Categorical description | Plain text | Not identifiable* | Categorical market definition. [STATE 001] |
| `Multi Categorical` | STATE 001 — market-type card/list | Plain label | Not identifiable* | One of the four market types. [STATE 001] |
| `allowing selection of multiple outcomes` | STATE 001 — Multi Categorical description | Plain text | Not identifiable* | Multi Categorical definition. [STATE 001] |
| `Scalar` | STATE 001 — market-type card/list | Plain label | Not identifiable* | One of the four market types. [STATE 001] |
| `Numeric outcome within a specified range` | STATE 001 — Scalar description | Plain text | Not identifiable* | Scalar definition. [STATE 001] |
| `Multi Scalar` | STATE 001 — market-type card/list | Plain label | Not identifiable* | One of the four market types; captured description duplicates Scalar. [STATE 001] |
| `Numeric outcome within a specified range` | STATE 001 — Multi Scalar description | Plain text | Not identifiable* | Duplicate of Scalar description in capture; distinction from Scalar is not stated. [STATE 001] |
| `Announcing the Seer Initial Airdrop Distribution: Learn More` | STATE 001 — airdrop banner | Plain text banner + CTA | Not identifiable* | Airdrop announcement banner; contains title `Seer Initial Airdrop Distribution`. No amount, date, eligibility, or distribution fields shown. [STATE 001] |
| `Learn More` | STATE 001 — airdrop banner; hero secondary CTA | Plain label | Not identifiable* | CTA. Banner links toward a Medium airdrop article; hero links to documentation. [STATE 001] |
| `Documentation` | STATE 001 — header; footer | Plain label | Not identifiable* | Documentation link; href to GitBook. [STATE 001] |
| `Blog` | STATE 001 — header; footer | Plain label | Not identifiable* | Blog link; href to Medium. [STATE 001] |
| `Launch App` | STATE 001 — header | Plain label | Not identifiable* | App-launch CTA; href to `app.seer.pm`. [STATE 001] |
| `Start Now` | STATE 001 — hero; final CTA before contact | Plain label | Not identifiable* | CTA; href to `app.seer.pm`. [STATE 001] |
| `Ask Seer` | STATE 001 — near example prediction | Plain label | Not identifiable* | Control; action/function not specified in capture. [STATE 001] |
| `Create A Market` | STATE 001 — CTA | Plain label | Not identifiable* | Market-creation CTA; href `app.seer.pm/create-market`. [STATE 001] |
| `Start Trading` | STATE 001 — CTA | Plain label | Not identifiable* | Trading CTA; href `app.seer.pm`. [STATE 001] |
| `View Example` ×4 | STATE 001 — one per market type: Categorical, Multi Categorical, Scalar, Multi Scalar | Plain label repeated four times | Not identifiable* | CTA to example market; hrefs point to `app.seer.pm/markets/100/0x…` routes. [STATE 001] |
| `A world of opportunities` | STATE 001 — section associated with `More` | Plain text heading/label [inferred from note wording] | Not identifiable* | Section heading/copy; exact role not further captured. [STATE 001] |
| `More` | STATE 001 — under `A world of opportunities`; final item in use-case list | Plain label | Not identifiable* | Control/link or list item; action not captured. [STATE 001] |
| `Get in Touch!` | STATE 001 — contact CTA | Plain label | Not identifiable* | Contact CTA. [STATE 001] |
| `info@seer.pm` | STATE 001 — contact email link/address | Email address format (`local@domain`) | Not identifiable* | Contact email. [STATE 001] |
| `Seer App` | STATE 001 — footer | Plain label | Not identifiable* | Footer link to `app.seer.pm`. [STATE 001] |
| `Community` | STATE 001 — footer | Plain label | Not identifiable* | Footer link to Discord. [STATE 001] |
| `Docs` | STATE 001 — footer | Plain label | Not identifiable* | Footer docs link; duplicates the `Documentation` label. [STATE 001] |
| `Images & Branding` | STATE 001 — footer | Plain label | Not identifiable* | Footer link to a Google Drive folder. [STATE 001] |
| `Available on:` | STATE 001 — landing page | Label with colon; logo/platform area [inferred] | Not identifiable* | Platform/logo area; no platform names/logos are captured. [STATE 001] |
| `Conditional Tokens framework` | STATE 001 — concept copy | Plain text | Not identifiable* | Framework used to create/manage outcome tokens. [STATE 001] |
| `ERC1155` | STATE 001 — concept copy | Token-standard identifier string | Not identifiable* | Outcome-token standard; wrapped into ERC20 tokens. [STATE 001] |
| `ERC20` | STATE 001 — concept copy | Token-standard identifier string | Not identifiable* | Wrapped token standard for smoother trading and DeFi integration. [STATE 001] |
| `Kleros` | STATE 001 — concept copy | Proper noun | Not identifiable* | Dispute-resolution protocol used when answering Reality.eth questions. [STATE 001] |
| `Reality.eth` | STATE 001 — concept copy | ENS-style name string | Not identifiable* | Question/answer source for markets; disputes go to Kleros. [STATE 001] |
| `Elections` | STATE 001 — use-case list | Plain label | Not identifiable* | Use case. [STATE 001] |
| `Sports` | STATE 001 — use-case list | Plain label | Not identifiable* | Use case. [STATE 001] |
| `Political Forecasting` | STATE 001 — use-case list | Plain label | Not identifiable* | Use case. [STATE 001] |
| `Financial Market Predictions` | STATE 001 — use-case list | Plain label | Not identifiable* | Use case. [STATE 001] |
| `Event Outcomes` | STATE 001 — use-case list | Plain label | Not identifiable* | Use case. [STATE 001] |
| `Crowdsourced Intelligence` | STATE 001 — use-case list | Plain label | Not identifiable* | Use case. [STATE 001] |
| `Disaster and Risk Management` | STATE 001 — use-case list | Plain label | Not identifiable* | Use case. [STATE 001] |
| `Insurance Underwriting` | STATE 001 — use-case list | Plain label | Not identifiable* | Use case. [STATE 001] |
| `Social Good and Charity` | STATE 001 — use-case list | Plain label | Not identifiable* | Use case. [STATE 001] |
| `Research and Development` | STATE 001 — use-case list | Plain label | Not identifiable* | Use case. [STATE 001] |
| `Entertainment and Media` | STATE 001 — use-case list | Plain label | Not identifiable* | Use case. [STATE 001] |

## Non-user-facing capture metadata (recorded for completeness)
| Metadata | Value | Where | User-visible? | Notes |
|---|---:|---|---|---|
| `controls` | `26` | STATE 001 | No | Capture reports 26 controls; text alone does not identify all 26 unambiguously. [STATE 001] |
| `charts` | `0` | STATE 001 | No | No charts in capture. [STATE 001] |
| `tables` | `0` | STATE 001 | No | No tables in capture. [STATE 001] |

## API endpoints and return values
**No API endpoints are identified in the supplied notes.** The DATA MODEL section is empty/truncated, so no return payloads, response fields, or endpoint contracts can be stated without inventing them. [STATE 001]

| API endpoint | What it returns | Evidence |
|---|---|---|
| None identified | No return schema can be stated | No API endpoint paths, network calls, JSON responses, or data-model fields are present in the supplied notes. [STATE 001] |

## Observed link targets (not API endpoints; no return data)
| Control / link | URL / target as captured | What it points to | API return? |
|---|---|---|---|
| Airdrop banner `Learn More` | `https://seer-pm.medium.com/announcing-the-seer-initial-airdr` (truncated in notes) | Medium airdrop article | No — navigational link. [STATE 001] |
| `Documentation` / `Learn More` | `https://seer-3.gitbook.io/seer-documentation` | GitBook documentation | No — navigational link. [STATE 001] |
| `Blog` / icon-only Medium link | `https://seer-pm.medium.com/` | Medium blog | No — navigational link. [STATE 001] |
| `Launch App` / `Start Now` / `Start Trading` / `Seer App` | `https://app.seer.pm/` | App home | No — UI route. [STATE 001] |
| `Create A Market` | `https://app.seer.pm/create-market` | Market creation UI | No — UI route. [STATE 001] |
| `View Example` 1 | `https://app.seer.pm/markets/100/0x43d881f5920ed29fc5cd4917d6` (truncated in notes) | Example market UI route | No — UI route; path contains market id/address-looking segment. [STATE 001] |
| `View Example` 2 | `https://app.seer.pm/markets/100/0x528c5535136ce58611dc347ae8` (truncated in notes) | Example market UI route | No — UI route; path contains market id/address-looking segment. [STATE 001] |
| `View Example` 3 | `https://app.seer.pm/markets/100/0xe12f48ecdd6e64d95d1d8f1d5d` (truncated in notes) | Example market UI route | No — UI route; path contains market id/address-looking segment. [STATE 001] |
| `View Example` 4 | `https://app.seer.pm/markets/100/0x8df5b3a628b3d7703164620418` (truncated in notes) | Example market UI route | No — UI route; path contains market id/address-looking segment. [STATE 001] |
| `info@seer.pm` | `mailto:info@seer.pm` | Email link | No — mail link. [STATE 001] |
| `Community` / icon-only Discord link | `https://discord.com/invite/rBEB4MYQwV` | Discord community | No — navigational link. [STATE 001] |
| `Images & Branding` | `https://drive.google.com/drive/folders/1EOGhjj_jHJ5PPt86VEDu` (truncated in notes) | Google Drive branding assets | No — navigational link. [STATE 001] |
| Icon-only GitHub link | `https://github.com/seer-pm` | GitHub | No — navigational link. [STATE 001] |
| Icon-only X link | `https://x.com/seer_pm` | X/Twitter | No — navigational link. [STATE 001] |
| Icon-only Telegram link | `https://t.me/Seerpredictionmarket` | Telegram | No — navigational link. [STATE 001] |
| Icon-only Medium link | `https://seer-pm.medium.com/` | Medium | No — navigational link. [STATE 001] |
| Kleros link | `https://kleros.io/` | Kleros site | No — navigational link. [STATE 001] |
| Unlabeled button | No text; no href/action captured | Unknown | No — action unknown. [STATE 001] |

## Explicit uncertainties / oddities
- **No API/data model**: the DATA MODEL section is empty/truncated, so no field mapping or API return schema is possible. [STATE 001]
- **Controls inventory truncated**: capture reports 26 controls, but text alone does not identify all 26 unambiguously. [STATE 001]
- **`Available on:`**: no platform names/logos are captured; contents unknown. [STATE 001]
- **Airdrop**: no amount, date, eligibility, or distribution fields shown. [STATE 001]
- **`Multi Scalar`**: description duplicates `Scalar`; no stated distinction. [STATE 001]
- **`Ask Seer`**: action/function not captured; meaning uncertain. [STATE 001]
- **`More`**: action under `A world of opportunities` not captured. [STATE 001]
- **Footer duplication**: both `Documentation` and `Docs` labels appear. [STATE 001]
- **Example wording mismatch**: notes flag the question framing “any type of nuclear device” versus the estimate framed as chance “that no nuclear device will be used offensively.” [STATE 001]
- **Truncated URLs**: the airdrop Medium URL, Google Drive URL, and example market URLs are truncated in the notes. [STATE 001]
- **No charts/tables**: `charts=0`, `tables=0`; no data visualization fields exist in this capture. [STATE 001]