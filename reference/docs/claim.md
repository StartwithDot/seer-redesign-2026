# POIDH claim (bounty #38): submission-ready text

Title:
Seer, Redesigned for Information Finance

Description:

X: @monkeypath

Six interfaces, one ecosystem (public demos, no sign-in):
1. Homepage: https://seer-redesign-orcin.vercel.app/
2. Seer App (Explorer): https://seer-redesign-orcin.vercel.app/explorer/
3. Deep: https://seer-redesign-orcin.vercel.app/deep/
4. Futarchy: https://seer-redesign-orcin.vercel.app/futarchy/
5. Opportunity Markets: https://seer-redesign-orcin.vercel.app/opportunity/
6. Risk Pricing: https://seer-redesign-orcin.vercel.app/risk/
Source: https://github.com/StartwithDot/seer-redesign

Design rationale
I came to Seer through the Deep Funding contest. The UI was complex and dated, and the information I needed was scattered across screens. This redesign fixes that.
- Built for both sides. Every interface opens with the same three lines: Asked by, Priced, How to use. A reader gets the signal without trading; traders get a fixed ticket beside it.
- Everything in one view. No endless scrolling. Deep puts the chart, ranking and trading desk on one screen. Explorer puts the market list and the selected market's odds and ticket side by side.
- One app, not six. One header, one Apps menu, one sub-header style, and the Connect button in the same place on every interface (each product keeps its own wallet steps, e.g. Deep's trade wallet and sUSDS setup), so moving between them feels like one product.
- Seer App as the explorer for all markets: Tiles and Index views, a photo and asker on every market, filters across all market types, and a Human / Agent switch that shows the same market as a copyable API call.
- Homepage shows the protocol and its five apps as one ecosystem, with who asks in each. In Seer App the "Asked by / Priced / How to use" row updates for whatever market you select.
- The EF line motif runs in the direction Seer asked for: one line in, many outcomes out.

Departures from the EF kit
- Second outcome colour: pale lavender (dark) or deep indigo (light) with a hatched fill, so Yes and No are easy to tell apart. Same violet hue family.
- Market photos in Explorer, so the list is scannable.
- Red on negative numbers (Futarchy exclude, Deep deltas) for instant sign reading.
- Risk uses a violet scale from low to high risk instead of traffic lights.
- Translucent header with blur, for continuity between the homepage and the apps.

Note: data comes from public Seer sources. No live trading; wallet connect and trade confirmations are demo flows.
