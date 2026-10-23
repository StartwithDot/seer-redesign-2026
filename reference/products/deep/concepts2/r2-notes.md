# Deep — Round 2 shell concepts (partial: usage limit hit)

Status: built and assembled: r2-A-main, r2-A-lb, r2-A-mob, r2-B-main. Not built yet: r2-B-lb, r2-B-mob, all three C files.
None of them have been opened in a browser yet: headless Chrome, node and python all needed approval, so no screenshots were taken.
Data: the real API JSON (rows, get-market-charts, leaderboard all/1d/1w/1m) is embedded verbatim, and every number on screen is computed from it at runtime.
Totals ~$293.82 / ~$929.08 are the live header values. Ended contests show only their name and status, marked "not in live API".
Fonts: system only (ui-sans-serif / ui-monospace; B allows ui-rounded). No external requests.

## A — "Instrument" (TradingView terminal)
- Thesis: the contest is an instrument. The 98-line chart is the main surface, and every task docks around it.
- Top: browser-style contest tabs, not a hero. The Active/Archived switch and a ★ pin on each tab (Flashscore-style). "Σ All contests" tab. "+" opens a picker with pin toggles.
  Under the tabs, a one-line status bar in monospace (median, p10–p90, 91/98 in the 0.65–0.85 band, UP+DOWN 0.81–1.03, volume with refresh, liquidity, last trade).
- Aggregation: the "Σ All" view groups contests into Live and Ended lanes. Each lane has a price strip, but only R3 has one; the others show a dashed "not in live API". A side panel shows your P/L across all deep markets: the leaderboard's scope is global, since marketCount reaches 298 > 98. It also shows global totals and the top 6.
- Maximise: an "Expand F" button opens the chart full-screen. It adds a zoom strip (drag to zoom over the p10–p90 band), an inspector (highest and lowest at the cursor time), pinning up to 4 repos, and a UP/DOWN switch. Esc closes it.
- Shell: one viewport. The chart sits top-left. A bottom dock has tabs Desk (setup steps, predictions CSV, Start Trading with a checklist of what's missing), Repository (detail with UP/DOWN history) and Funds (actions from the guide, disabled with reasons). The watchlist is its own scroll box with a split bar (UP | amber hatch = unpriced | DOWN, red = overlap), a Market/Positions switch and sortable columns. Status bar holds the footer links.
- Leaderboard "Landscape": 76 wallets plotted as P/L (signed log) against volume (log). Dot size = markets traded, rings = merged wallets, and wallets with no volume sit in their own strip.
  Periods morph with animation, and "Replay periods" plays 1D→1W→1M→All.
  Extras, all computed from real data:
  - Concentration bars: the top 3 winners' share of all profit and the top 2 losers' share of all losses.
  - An ROI strip on its own axis (the API's ROI is not P/L ÷ volume).
  - A wallet inspector showing rank in every period.
  - Follow (stored per browser) and compare (up to 3).
  - Your-wallet marker: "not ranked".
  - Address search that dims non-matches.
  - Market select with per-contest options disabled ("not in live API").
- Mobile: contest selector, a short status line, the chart with a full-screen ⤢, the list as a scroll box, and bottom tabs Markets / Desk / Contests (Active · Archived · Σ All) / Leaders.

## B — "Field" (Windy / FlightRadar map)
- Thesis: you fly over the contest. 98 repos form a swarm on a 0.01-step dot grid laid along UP price, and time is a scrubber you play like weather.
- Contests: a floating panel (FlightRadar-style) with an Active / Archived / Σ All switch and ★ pins. Σ All shows totals across contests plus your global P/L. An ended contest blanks the field with an honest empty state.
- Layers (Windy-style): UP price, Unpriced gap (dot size = |1−UP−DOWN|), Drift since first trade (tails), Volume, and Your predictions (rings, unlocked by uploading a CSV).
- Time: bottom timeline with play, drag to scrub, and a real trade-activity histogram. Everything re-lays out at the scrubbed time: field, card, cursor.
- Chart maximise: "⌃ Time chart" slides up a 280px drawer with the 98-line chart. Its Maximise button opens a large pop-up with ranges, UP/DOWN, a ranked list at the cursor time, and pinning up to 4.
- Also: a selected-repo card at bottom-left, a compact setup/predictions desk at top-right, and the repo list as its own scroll box.
- Planned leaderboard (not built): a "Skyline" — column width = volume, height = signed P/L — with 4 period thumbnails that double as the period control.

## C — "Timing" (F1 timing tower + Flashscore), not built
- Planned: a Flashscore-style grouped contest column, a 98-row timing tower (position, ▲▼ since first trade, gap to leader, gap to the repo ahead, split bar), a race-trace chart (gap to median over time) with a ⤢ pop-up, and a compact desk.
- Planned leaderboard: a bump chart across 1D/1W/1M/All that joins the same address between periods, plus a wallet card.

## Recommendation
A is the strongest on parity and how it reads at first glance. Use B's timeline and layers inside A's maximised chart.
