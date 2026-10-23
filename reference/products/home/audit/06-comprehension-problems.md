# comprehension problems (home; DeepSeek draft: Claude verifies against screenshots)

# Audit: Newcomer Comprehension & Confusing UI — `home` (Seer landing page)

**Scope of evidence:** all findings below derive from a single captured state, **STATE 001** (`/`, https://seer.pm/). No other STATE ids were supplied in the notes, so **no cross-state comparison, no logged-in/app-state comparison, and no before/after comparison is possible.** The `CHARTS` and `DATA MODEL` sections of the crawl are empty, and no accessibility tree, DOM snapshot, viewport captures, console log, or network waterfall was provided.

**Severity scale used:** 1 = cosmetic; 2 = minor friction; 3 = notable confusion or extra effort for a newcomer; 4 = significant comprehension barrier; 5 = blocking / failure.

**Tagging convention:** `[observed]` = directly stated in notes or control inventory. `[hypothesis]` = inference from absence or design reasoning, not directly verified. Absence-based claims are always tagged `[hypothesis]` because a crawl may not capture tooltips, `aria-label`s, hover states, or image payloads.

---

## 1. Newcomer comprehension problems

| ID | Finding | Sev | Tag | Evidence |
|---|---|---|---|---|
| C1 | **Scalar and Multi Scalar are described with identical text** — both "Numeric outcome within a specified range." A newcomer cannot tell the two apart, yet the page asks them to choose between four market types. | 4 | [observed] | STATE 001 market-type copy |
| C2 | **Flagship probability example is grammatically inverted relative to the question.** Question concerns whether "any type of nuclear device" will be used offensively; the estimate is framed as the chance "that **no** nuclear device will be used offensively" (97.3%). Novices must perform a negation to connect the number to the question — a classic source of misreading in prediction markets. | 4 | [observed] text / [hypothesis] comprehension impact | STATE 001 concept copy |
| C3 | **"Ask Seer" is unlabelled as to function.** It sits next to the example prediction but the capture states the action is not specified; a newcomer cannot predict whether it is an AI chat, a glossary, or a market search. | 3 | [observed] label + unknown action / [hypothesis] confusion | STATE 001 control "Ask Seer" |
| C4 | **Probability number is shown with no explanation of what it means operationally** (i.e., that it relates to share price/payout). 97.3% appears as a bare one-decimal percentage. | 4 | [observed] bare percentage, no accompanying explanation in capture; [hypothesis] no explanation elsewhere on page | STATE 001 "97.3%" |
| C5 | **No step-by-step "how it works" narrative.** The page moves from a one-line definition → market taxonomy → Conditional Tokens/ERC1155/ERC20 → Kleros/Reality.eth → 13 use cases. The create → trade → resolve → redeem lifecycle is never laid out sequentially. | 4 | [hypothesis] (structural inference from captured copy) | STATE 001 |
| C6 | **Airdrop banner is a dangling CTA** — "Seer Initial Airdrop Distribution" with no amount, date, eligibility, or distribution mechanics shown. | 3 | [observed] | STATE 001 |
| C7 | **"More" control under "A world of opportunities" is undefined** — action not captured; reads as filler and gives no expectation of what expands. | 2 | [observed] label/unknown action | STATE 001 control "More" |
| C8 | **The single worked example is a nuclear-weapons scenario.** It is the first and only concrete illustration of the product, which is both an extreme risk topic and unlikely to match a newcomer's use case. | 2 | [observed] content / [hypothesis] effect on newcomer affect/trust | STATE 001 |
| C9 | **Example time scope "Q2 2025" may be stale** for a live product; a resolved past quarter used as the illustrative market weakens credibility. | 2 | [hypothesis] (crawl date not supplied) | STATE 001 |
| C10 | **Four identical "View Example" CTAs give no preview** of what differs between the four market types — the label carries no discriminating information. | 2 | [observed] labels / [hypothesis] effect | STATE 001 controls "View Example" ×4 |
| C11 | **"Get in Touch!" vs email vs Discord vs Telegram** — three contact channels, no indication of which is preferred for which purpose (sales, support, community). | 2 | [observed] / [hypothesis] newcomer hesitation | STATE 001 contact area + footer |

---

## 2. Jargon without explanation

No glossary, tooltip, or inline definition is evidenced anywhere in the capture. All "no explanation" claims are therefore `[hypothesis]` at the level of "none captured," but the terms themselves are `[observed]`.

| ID | Term(s) | Why it blocks a newcomer | Sev | Evidence |
|---|---|---|---|---|
| J1 | **Conditional Tokens framework** | Named as the mechanism for creating/managing outcome tokens with no plain-language gloss. | 3 | STATE 001 |
| J2 | **ERC1155 / ERC20 / "wraps … into …"** | Assumes Ethereum token-standard literacy; "wrapping" is unexplained. Used as a trust/technical credibility line, but it is the densest sentence on the page. | 4 | STATE 001 |
| J3 | **Kleros / Reality.eth / "decentralized arbiter"** | Resolution and dispute handling is the single most important thing a newcomer needs to trust; it is explained entirely in protocol names. | 4 | STATE 001 |
| J4 | **"outcome tokens," "DeFi integration," "smoother trading"** | Undefined benefit claims built on undefined nouns. | 3 | STATE 001 |
| J5 | **Categorical / Multi Categorical / Scalar / Multi Scalar** | Bespoke taxonomy presented without analogy to anything familiar; compounded by C1. | 3 | STATE 001 |
| J6 | **"Initial Airdrop Distribution"** | "Airdrop" unexplained; "distribution" implies a schedule/details that are absent (see H1). | 3 | STATE 001 |
| J7 | **"Market" as a proper-noun concept** ("four different types of Market") | No definition of what a Seer "market" is versus a generic market. | 2 | STATE 001 |
| J8 | **"Ask Seer"** | Product-name-as-verb; no indication whether it is an assistant, a search, or documentation. | 3 | STATE 001 |

---

## 3. Hidden information

| ID | Missing information | Sev | Tag | Evidence |
|---|---|---|---|---|
| H1 | Airdrop **amount, snapshot date, eligibility criteria, claim mechanics** — banner and its Medium link are the only surface. | 3 | [observed] absence in capture | STATE 001 banner + "Learn More" |
| H2 | **"Available on:" lists no platform names** — a social-proof/placement block with no visible contents in text; if the platform names exist only as logo images, they are invisible to text extraction and possibly to assistive tech. | 3 | [observed] text absence / [hypothesis] image-only implementation | STATE 001 |
| H3 | **No fees, gas costs, deposit currency, or chain/network** stated before "Launch App." | 4 | [hypothesis] | STATE 001 |
| H4 | **No resolution/settlement timeline** — a newcomer cannot learn when a position pays out or what happens if a question is disputed. | 4 | [hypothesis] | STATE 001 |
| H5 | **No eligibility/geographic restrictions or risk disclaimer** visible on the landing page — material for a financial-prediction product. | 3 | [hypothesis] (may exist in Docs/Terms, not surfaced here) | STATE 001 |
| H6 | **No statement of what a user needs before launching** (wallet, network switch, testnet vs mainnet). "Launch App" / "Start Now" give no prerequisite signal. | 3 | [hypothesis] | STATE 001 |
| H7 | **No trust signals** (team, audits, contract addresses, TVL/volume) despite a protocol-heavy pitch. | 3 | [hypothesis] | STATE 001 |
| H8 | **Example market links are opaque deep links** (`/markets/100/0x43d8…`); the "100" and the truncated address are unexplained to a newcomer inspecting the href. | 1 | [observed] URL pattern / [hypothesis] impact | STATE 001 control inventory |
| H9 | **"Images & Branding" points to a Google Drive folder** — the destination type is not signalled by the label; users may not expect to leave the site for a drive. | 2 | [observed] href / [hypothesis] surprise | STATE 001 control inventory |

---

## 4. Inconsistent labels and competing affordances

| ID | Finding | Sev | Tag | Evidence |
|---|---|---|---|---|
| L1 | **Five different labels for one destination** `https://app.seer.pm/`: "Launch App," "Start Now" (hero), "Start Now" (final), "Start Trading," "Seer App" (footer). A newcomer cannot tell whether these do different things. | 3 | [observed] | STATE 001 control inventory |
| L2 | **"Learn More" used twice for different destinations** — banner → Medium airdrop article; hero → GitBook documentation. Same word, different outcomes. | 3 | [observed] | STATE 001 control inventory |
| L3 | **"Documentation" and "Docs" both present** (header/footer) — duplicate vocabulary for presumably the same GitBook link. | 2 | [observed] | STATE 001 |
| L4 | **Discord reachable via two differently-labelled entries** — text link "Community" and an unlabelled icon link, same invite URL. | 2 | [observed] | STATE 001 control inventory |
| L5 | **Capitalisation inconsistency: "Market" (capitalised, "four different types of Market") vs "market" elsewhere** — implies a defined product term that is never defined. | 1 | [observed] | STATE 001 copy |
| L6 | **"Start Now" vs "Start Trading" vs "Create A Market"** — two of these go to the app root, one to `/create-market`; the pair invites an unintended choice for users who want to create rather than trade. | 2 | [observed] hrefs / [hypothesis] wrong-turn risk | STATE 001 control inventory |
| L7 | **Duplicate footer labels** for the same docs destination plus separate "Blog" appearing in both header and footer — repetition inflates the control count without new function. | 1 | [observed] | STATE 001 |

---

## 5. Accessibility / responsive

*These are the limits first: no a11y tree, focus order, contrast values, computed styles, or viewport breakpoints were supplied. Anything below marked `[hypothesis]` must be re-tested in-browser.*

| ID | Finding | Sev | Tag | Evidence |
|---|---|---|---|---|
| A1 | **Five icon-only links with no text**: GitHub, X, Telegram, Discord, Medium. If no `aria-label`/`title` is present, these have no accessible name (WCAG 2.4.4 / 4.1.2). | 4 | [observed] empty text / [hypothesis] missing accessible name | STATE 001 control inventory (5 anchors with "(no text)") |
| A2 | **One button with no text** in the header area — likely a menu/hamburger toggle; unlabelled if the accessible name is not supplied elsewhere. | 4 | [observed] empty text / [hypothesis] missing accessible name | STATE 001 control inventory ("button | (no text)") |
| A3 | **Four links named "View Example" with four different destinations** — identical accessible names defeat screen-reader link lists and voice-control ("click View Example"). Mitigated only if the card heading is programmatically associated. | 3 | [observed] identical labels + distinct hrefs / [hypothesis] lack of programmatic context | STATE 001 control inventory |
| A4 | **Two links named "Learn More" with different destinations** — same problem as A3, in the highest-attention region (banner + hero). | 3 | [observed] | STATE 001 |
| A5 | **No external-link or new-tab indication** on outbound links to Medium, GitHub, X, Telegram, Discord, Google Drive, Kleros. | 2 | [hypothesis] (target/rel not captured) | STATE 001 control inventory |
| A6 | **"Available on:" platform logos are likely image-only.** If implemented as unlabeled `<img>` or SVG without alt text, both the social proof and its content vanish for AT users — and, per H2, for text extraction too. | 3 | [hypothesis] | STATE 001 |
| A7 | **26 interactive controls on a marketing page, at least 6 of them unnamed or duplicate-destination** — inflates tab-stop count before the primary content; keyboard users pay a navigation tax. | 3 | [observed] count + names / [hypothesis] burden | STATE 001 (`controls=26`) |
| A8 | **Responsive/mobile behaviour unverifiable.** No viewport data was captured; the header stack (banner + Documentation + Blog + Launch App + unlabelled button) is a plausible overflow/wrap risk at narrow widths. | — (unknown) | [hypothesis], provisional 2 | STATE 001 |
| A9 | **Keyboard focus visibility, colour contrast, motion, and touch-target size not assessable** from the supplied notes. | — (unknown) | not assessed | crawl has no style/DOM data |
| A10 | **No charts or tables present** (`charts=0`, `tables=0`) — so there is no data-visualisation alternative-text gap to report in this state. | 1 (positive finding) | [observed] | STATE 001 metadata |

---

## 6. Performance and console errors

**Nothing can be asserted here.** The crawl supplies no console log, no network/waterfall data, no LCP/CLS/INP, no asset weights, and an empty `CHARTS` section. Reporting concrete errors would be fabrication.

| ID | Finding | Sev | Tag | Evidence |
|---|---|---|---|---|
| P1 | **No console, network, or performance metrics were captured for STATE 001** — this category is unassessed, not "clean." | — | [observed] absence of data | crawl metadata |
| P2 | **Plausible render-blocking / layout-shift risk from third-party and image assets** — banner + platform logo strip ("Available on:") + hero imagery on a page whose only captured content is text. Logo strips are a common CLS source. | 2 (provisional) | [hypothesis] | STATE 001 "Available on:", banner |
| P3 | **Outbound dependency surface is large** (Medium, GitBook, Discord, Telegram, X, GitHub, Google Drive, Kleros) — relevant only if any are embedded rather than linked; links alone carry no runtime cost. | 1 (provisional) | [hypothesis] | STATE 001 control inventory |
| P4 | **Two full-sentence banner link texts and a sticky-header CTA suggest a dynamic banner** — late insertion above the fold would shift the header (CLS). | 2 (provisional) | [hypothesis] | STATE 001 banner |

---

## 7. Data-completeness defects affecting this audit

| ID | Finding | Sev | Tag | Evidence |
|---|---|---|---|---|
| D1 | **Control count mismatch: capture reports `controls=26`, but the inventory enumerates 24** (23 anchors + 1 button). Two controls are unidentified, so an unknown number of label/a11y issues may be unreported. | 2 | [observed] | STATE 001 metadata vs control inventory |
| D2 | **Single-state coverage only.** No wallet-gated, empty, ended, or error state was visible (explicitly stated), so all comprehension findings concern the pre-connection marketing surface only. | 3 (coverage) | [observed] | STATE 001 |
| D3 | `DATA MODEL` and `CHARTS` sections are empty in the supplied material — any claim about underlying data shapes or visualisations would be unsupported. | 3 (coverage) | [observed] | truncated sections |

---

## 8. Prioritised shortlist for newcomers (top 6)

1. **C1 + J5 — Scalar/Multi Scalar are textually identical (sev 4).** Cheapest high-impact fix: differentiate the two descriptions.
2. **C2 + C4 — the only worked example is a negated nuclear-risk question with a bare percentage (sev 4).** Rewrite as an affirmative question and add one sentence mapping probability → price → payout.
3. **J2 + J3 — ERC1155/ERC20 wrapping and Kleros/Reality.eth are the trust-critical mechanics, stated in bare protocol names (sev 4).** Needs a plain-language layer or a linked "How resolution works."
4. **A1 + A2 — five unnamed icon links and one unnamed button (sev 4, pending AT verification).**
5. **L1 + L2 — five labels for one destination and one label for two destinations (sev 3).** Standardise to "Launch app" and disambiguate the two "Learn More" links.
6. **H1 + H2 — airdrop with no terms and an "Available on:" block with no visible platforms (sev 3).** Both are credibility holes at the exact moment of first impression.

---

## 9. Explicit uncertainty statement

- Every "no X exists" claim (J1–J8, H3–H7, C5, C11) is **absence-based** and could be falsified by hover tooltips, accordions, modal dialogs, or content below the captured fold. None of those were captured.
- Accessibility severities A1, A2, A6 depend on `aria-label`/`alt` attributes that a text-only crawl does not expose; treat as **suspected, not confirmed**.
- Responsive behaviour (A8) and all performance findings (P2–P4) are **hypotheses with no measurement**; they should be re-run against a real browser session before being raised as defects.
- No finding in this report is drawn from any state other than **STATE 001**.