# Futarchy: the live UI today (futarchy.seer.pm, observed Oct 17 2026)

## Landing
Header: Futarchy mark + word, theme toggle, white "Connect Wallet" button. Sections: **Active Milestones**, **Recently Closed**, **Organizations** (+ "Create market").
- Milestone card: round token logo (ETH/GNO/PNK), chain tag (ETH, Gnosis), question "What will the impact on ETH price be **if EIP-8363 is Scheduled for Inclusion in Hegota?**" (condition in violet), "Open until: 6d 17h 25m", three stat tiles: YES Price (blue) 2426.89 USDS | NO Price (amber) 2426.85 USDS | Impact (green) +0.00%.
- Recently Closed cards: token logo, chain tag, question, Status Awaiting / Resolved, Outcome YES/NO, Impact %. Real rows: GNO GIP-152 Awaiting Resolution; PNK KIP-90 YES +0.68%; GNO GIP-151 YES +0.00%; PNK KIP-88 YES +0.91%; PNK KIP-86 YES +0.94%; GNO GIP-149 NO +0.08%; GNO GIP-145 YES +1.96%; PNK KIP-81 NO +99.98% (price question); GNO GIP-153 YES +2.47%.
- Organizations table: NAME | ACTIVE | PROPOSALS (sortable) | CHAIN | LIQUIDITY. Rows: Gnosis DAO 0/6 Gnosis; Kleros DAO 0/4 Gnosis; Ethereum (ACTIVE MARKET tag) 1/1; VeloraDAO 0/0 ETH; Aave DAO 0/0 ETH. Footer "5 organizations".

## Milestone detail (/markets/0x0d78...)
Header: question (condition violet). Metric row: Impact (spot) <0.01% | Status Active | Volume (Total; USDS) 2.61M | TVL 231.05K | Remaining Time 6d 15h 58m. Chips: Active, "Resolve Question" (opens Reality.eth), "+ Add Liquidity". Right of header: short resolution text + collapsible "TWAP Complete" panel: "5-day TWAP of conditional ETH prices (YES vs NO), Oct 9 12:00 - Oct 14 12:00 UTC, ending before ACDC #189 ... Recommendation: include if YES > NO by more than 1%, exclude if NO > YES by more than 1%, neutral within the band." "FINAL TWAP WINDOW" (currently shows a raw ethers error).
Chart card: strip of stats (Trading Pair WETH/USDS, Yes Price, No Price, Spot Price, Impact (spot)); price chart with YES line, NO line, grey dashed spot history, "SPOT" tag, y-axis 2400-2850, step-like conditional lines (low liquidity).
Trade panel: tabs If Yes | If No; Buy | Sell; Amount (USDS) with Max; Available; Outcomes: "If Yes: receive 0.0004113 WETH" / "If No: recover 1.00 USDS".
Below: tabs Recent Activity | My Trades | Position; "Last 30/60/90 trades"; table Outcome (YES/NO + buy/sell) | Amount (e.g. 329.35 NO_USDS in / 0.1356 NO_WETH out) | Price (2429.65) | Date. NOTE trades come in YES+NO PAIRS at the same time (each trade mirrors in both pools).

## Where a newcomer gets lost today
1. Nothing shows that two parallel worlds exist (YES-world price vs NO-world price). Just two numbers.
2. "Impact" has no visual anchor; the +-1% decision band exists only as a sentence inside a collapsed panel.
3. The TWAP window (the period that actually decides) is hidden; the chart shows noisy spot-like lines.
4. Trade panel jargon: "If Yes/If No", "Recover 1.00 USDS" confuse (conditional token mechanics unexplained).
5. Closed milestones show Outcome + Impact but not the story (which side won, by how much vs the band).
6. Raw contract error text surfaces in the UI.
