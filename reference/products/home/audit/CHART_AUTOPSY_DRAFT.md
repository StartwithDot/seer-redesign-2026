# home: CHART AUTOPSY DRAFT (DeepSeek; verify visually)

# CHART AUTOPSY DRAFT — `home` / `/` (STATE 001)

## Verdict

- **Charts: 0. Tables: 0.** Capture metadata says `charts=0`, `tables=0`; supplied CHARTS section is empty. [STATE 001]
- **No data-visualization chart exists in the supplied evidence**, so there are no chart axes, scales, series, or chart API sources to autopsy. Any chart-like styling or SVG/canvas presence is not provable here: **[needs visual check]**.
- **Data model supplied is empty**: no API endpoint or JSON field is available to attribute to any home-page graphic. Any data-source claim beyond static copy is unverified: **[needs visual check]**.
- Exact layout, visual hierarchy, logo contents, and responsive/mobile graphics are not provable from text: **[needs visual check]**. A mobile capture marker `002m` appears in controls inventory, but no STATE 002 notes/screens are supplied. [STATE 001]

## Data-visualization inventory

| ID | Chart/graphic | Type | Axes & scale | Series | Data source | Interactions | Newcomer misread | Outdated |
|---|---|---|---|---|---|---|---|---|
| C-0 | None | No chart/table/data-viz | N/A — no chart exists | N/A | N/A — DATA MODEL empty | N/A | A newcomer might expect a probability chart from the “97.3%” callout, but it is not a chart in the supplied evidence | N/A |

## Non-chart graphics inventory

Listed only to close the “graphic” inventory. None are established data charts.

| Graphic / element | Type | Axes & scale | Series | Data source | Interactions | What a newcomer may misread | What looks outdated |
|---|---|---|---|---|---|---|---|
| Hero example prediction: **97.3%**, **Q2 2025**, **Ask Seer** | Numeric marketing/example callout or card; exact visual form **[needs visual check]** | No axes. Percentage format implies 0–100 scale, one decimal; Q2 2025 is time scope. Whether rendered as gauge/chart is unverified **[needs visual check]** | None — single example, not a series | Unverified; no API endpoint/field in supplied DATA MODEL. Likely static marketing copy, but **[needs visual check]** | **Ask Seer** action not specified **[needs visual check]**; nearby CTAs **Start Now** / **Learn More** link to app/docs [STATE 001] | May be taken as a live current market probability or live market dated Q2 2025; it is presented as an example. No update timestamp or data-source label captured | **Q2 2025** is an old example scope as of this review; no refresh evidence **[needs visual check]** |
| Airdrop banner: “Seer Initial Airdrop Distribution” + **Learn More** | Announcement banner; logo/graphic content **[needs visual check]** | None | None | Static announcement; no amount, date, eligibility, or distribution fields shown [STATE 001]. No API source supplied | **Learn More** → Medium announcement URL as captured [STATE 001] | May assume an active airdrop with known eligibility/date; the capture supplies none | No date, amount, or eligibility; may look stale/incomplete **[needs visual check]** |
| Four market-type cards: **Categorical**, **Multi Categorical**, **Scalar**, **Multi Scalar** | Info cards / marketing graphics with CTA; not charts | None | None — four type labels, not a data series | Static copy; no API endpoint/field supplied [STATE 001] | **View Example** ×4 → app market routes [STATE 001] | May be read as live examples or live counts; they are type definitions. **Multi Scalar** duplicates **Scalar** wording, creating confusion [STATE 001] | **Multi Scalar** description duplicates **Scalar**; section says “four different types” but distinction is not explained [STATE 001]. Visual freshness **[needs visual check]** |
| Settlement/dispute explainer: Conditional Tokens, ERC1155→ERC20, Reality.eth/Kleros | Text/technical explainer, possibly diagrammatic **[needs visual check]** | None | None | Static copy; no API/contract-address/version field supplied | Kleros footer link → `https://kleros.io/` [STATE 001]; other interactions **[needs visual check]** | May be mistaken for current integration status or audited contract details; no version/date captured | Integration status and version look unverified; may be outdated **[needs visual check]** |
| Use-case list / “A world of opportunities” + **More** | Tag/list graphic; not a chart | None | None — list of labels, not a series | Static copy [STATE 001] | **More** action not captured **[needs visual check]** | May read as live categories/counts; no counts or live data are shown | Generic list with ambiguous **More**; no dates or freshness indicators **[needs visual check]** |
| “Available on:” platform/logo area | Logo/platform strip; contents not captured [STATE 001] | None | None | No platform names/logos/data source captured; unverified **[needs visual check]** | Unknown **[needs visual check]** | May infer integrations or availability not proven by captured text | Missing platform names/logos makes it look incomplete/stale **[needs visual check]** |
| Footer social/icon links and duplicate docs labels | Icon/link graphics; not charts | None | None | Static links [STATE 001] | Captured: GitHub, X, Telegram, Discord, Medium, Kleros, Community, Images & Branding, Seer App, Blog, Docs/Documentation [STATE 001] | Textless icons may be unidentified; duplicate **Documentation** and **Docs** labels are inconsistent | Duplicate **Documentation** / **Docs** labels look unpolished/outdated [STATE 001] |

## Autopsy conclusion

There is **no chart to critique** on `home`: no axes, scales, series, chart API source, chart interactions, or chart-specific misread risk can be proven from the supplied text/data. The main visual-risk candidates are the **97.3%** marketing callout, which could be misread as live data, and several incomplete/stale-looking marketing graphics — airdrop banner, “Available on” strip, duplicated market-type copy, and duplicate docs labels. All visual-specific claims remain **[needs visual check]**.