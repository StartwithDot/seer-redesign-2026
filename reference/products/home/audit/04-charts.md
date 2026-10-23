# charts (home; DeepSeek draft: Claude verifies against screenshots)

# Home (`/`) — chart / graphic audit

## Evidence and scope
- STATE 001 reports `charts=0`, `tables=0`; no charts or tables are present in the captured home screen. [STATE 001]
- The captured page has **no data visualization**: content is text, CTAs, and market-type cards. [STATE 001]
- Therefore there are **zero plotted charts** to audit for chart type, axes, scale, series/colors, chart interactions, or data source field. [STATE 001]
- The supplied CHARTS inventory contains no entries; no chart-level size/text metadata is available to supplement STATE 001. [STATE 001]

## Chart inventory
- **No charts exist in STATE 001.** Axes/scales, series/colors, interactions, and data source fields are not applicable. [STATE 001]

## Non-chart graphics / data-display-adjacent elements
These are UI/marketing elements, not plotted charts. Axes, scales, and series are not applicable.

| Element | Type | Axes / scale | Series / colors | Interactions | Data source field | What it communicates | Newcomer misread / outdated / crushed / colliding |
|---|---|---|---|---|---|---|---|
| Example prediction estimate **97.3%** | Textual probability example, not a chart or gauge | N/A — one-decimal percentage | N/A | Nearby **Ask Seer** control; action not specified | No chart data field; marketing example text | Illustrates prediction-market probability concept | Could be misread as a live market probability or chart value; capture presents it as an example, not a live visualization. [STATE 001] |
| Market-type cards: **Categorical**, **Multi Categorical**, **Scalar**, **Multi Scalar** | Informational cards with CTAs, not charts | N/A | No series/colors captured | Four **View Example** links; destinations captured | None | Explains four market types | **Scalar** and **Multi Scalar** have identical descriptions (“Numeric outcome within a specified range”), so a newcomer cannot distinguish them from the cards. [STATE 001] |
| **“Available on:”** area | Logo/platform strip; graphical contents not captured | N/A | Not captured | None captured | None | Intended to show platform availability | Contents/logo names are not captured; may appear blank or unsubstantiated. Cannot assess outdated logos, collision, or crushing from notes. [STATE 001] |
| **Airdrop announcement banner** | Announcement banner, not a chart | N/A | Not captured | **Learn More** link to Medium | None | Announces “Seer Initial Airdrop Distribution” | No amount, date, eligibility, or distribution fields are shown; a newcomer cannot determine actionable distribution details. [STATE 001] |
| **“Ask Seer”** near example prediction | Labeled control, not a chart | N/A | N/A | Action not specified in capture | None captured | Possibly a query/assistant affordance | Ambiguous; a newcomer may not know what the control does. [STATE 001] |

## Uncertainty
- STATE 001 is a text/capture summary without screenshot geometry, color values, or layout measurements; crushed/colliding visual issues for non-chart graphics cannot be verified beyond the recorded oddities. [STATE 001]
- The **“Available on:”** platform names/logos are explicitly not captured, so any graphic audit of that strip is incomplete. [STATE 001]
- No chart data source fields or chart interaction metadata exist in STATE 001; any mapping would be speculative. [STATE 001]