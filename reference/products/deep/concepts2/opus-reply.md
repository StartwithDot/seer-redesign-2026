I hit the usage limit partway through: 4 of the 9 mockups and the notes are done. None of them have been opened in a browser yet. Chrome, node and python all needed approval in this session, so I wrote them without seeing a render and there may be layout or script bugs.

Every number on screen is computed from the real API data, which is embedded in each file. Ended contests show only their name and status, marked "not in live API".

**Concept A – "Instrument" (built: main, leaderboard, mobile)**
- **Top:** the headline block is gone. Contests sit in a row of tabs like browser tabs, with an Active / Archived switch and a ★ pin on each. There's also an "All contests" tab and a "+" to find and pin more. Under it is a single line of figures (median, spread, volume, liquidity, last trade).
- **Across contests:** the "All contests" view groups them into Live and Ended. Your profit/loss across all contests comes from the leaderboard, which already covers every Deep market.
- **Chart:** an "Expand" button (or the F key) opens it full-screen. That adds drag-to-zoom, a side panel listing the highest and lowest repos at the cursor's time, and pinning up to 4 repos.
- **Layout:** one screen, no scrolling. The repo list has its own scroll box. Setup, predictions and funds share one docked panel with tabs.
- **Leaderboard:** each wallet is a dot, placed by profit/loss against volume. Switching periods animates the dots, and a replay plays 1D → 1W → 1M → All. Extras:
  - how concentrated winnings and losses are
  - a strip of ROI values on its own scale
  - each wallet's rank in every period
  - follow and compare (up to 3)
  - a marker for your own wallet ("not ranked")
  - address search

**Concept B – "Field" (built: main only)**
- The 98 repos are dots on a map-like grid, placed by UP price. Map-style layers switch what the dots show: price, unpriced gap, drift since first trade, volume, your predictions.
- A timeline at the bottom plays or scrubs the whole contest from Oct 1.
- The time chart slides up from the timeline and has a Maximise button that opens a large pop-up.

**Not built yet:**
- B's leaderboard (planned: one column per wallet, width = volume, height = profit/loss) and B's mobile screen.
- All three Concept C files (planned: an F1-style timing tower for the 98 repos; leaderboard showing how each wallet's rank moves across periods).

My recommendation so far is A, with B's timeline and layers built into A's full-screen chart.

Files are in `/private/tmp/claude-502/-Users-leo-Documents-POIDH/d9427bf9-b624-4de4-8438-4f298286c226/scratchpad/`:
- r2-A-main.html
- r2-A-lb.html
- r2-A-mob.html
- r2-B-main.html
- r2-notes.md
