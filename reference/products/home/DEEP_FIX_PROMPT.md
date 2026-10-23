# Prompt for the Deep chat: align Deep with the new Seer landing, and fix layout bugs

You are fixing the Deep app (served at http://127.0.0.1:4173/, code in apps/deep). Do not redesign it from scratch and do not spend credits on new concepts. Make targeted fixes. Work only inside apps/deep. Do not commit or push. No em dashes anywhere (copy or code comments).

## What I saw (1440x900 desktop)
1. EXPANDED CHART IS BROKEN (the "Expand F" button). The expanded view is a full-viewport overlay but it does not sit above the app header:
   - The chart title ("Share of original work over time / UP price, step = one trade") is drawn UNDER the "AI Prediction Markets" logo and overlaps it.
   - The Split / Swarm / Expand-Esc buttons sit under the "Connect wallet" button and overlap it.
   - Fix: the expanded overlay must be a proper top layer (own stacking context, z-index above header, position fixed, inset 0) with its own toolbar row: title left, series toggles (Split, Swarm), a clearly visible "Close (Esc)" button right, and the range controls (UP, DOWN, 1D, 3D, 1W, All, Lens, Replay, Hide all) in a second row. Keep the header hidden or dimmed while expanded. Esc and the Close button both exit. Lock page scroll while open, restore focus on close. Make the chart fill the remaining height and keep the y axis labels (0.55 to 0.95) and x axis labels fully inside the viewport.
2. HEADER differs from the landing page. Landing header is: SEER logo (raven mark + italic SEER) left, then Protocol, Apps (dropdown of all products), Docs, and a "Launch app" violet pill right. Deep header is: "AI Prediction Markets OPTIMISM" badge, Markets, Leaderboard (76), Guide, Connect wallet. Do this:
   - Keep Deep's own tabs (Markets, Leaderboard, Guide) but restyle the bar to match the landing: same height (64px), same background (#0a0a0a with 1px bottom border rgba(255,255,255,0.08)), same type (Inter Tight, 15px, weight 500), same active indicator.
   - Replace the generic two-square logo with the Seer raven mark + "SEER" wordmark, and show "Deep" as a small violet label next to it (keep the network badge OPTIMISM as a small pill on the right side of the tabs, not glued to the logo).
   - Add an "Apps" dropdown (same product list as the landing: Seer App, Deep, Futarchy, Opportunity Markets, Risk Pricing, Explorer, each linking to its product URL, Deep marked current) so users can move between products. Place it before Connect wallet.
   - "Connect wallet" uses the same pill button as the landing primary button (dark #121218 face, thin border, violet/electric/lavender blobs drifting inside continuously, text white). Not a flat violet fill.
3. CONTEST BAR (Contests 8, Round 3 Originality, then the stats REPOSITORIES / MEDIAN UP / VOLUME / LIQUIDITY / LAST TRADE): the contest selector and stats are misaligned relative to each other and to the content grid:
   - Align the left edge of "Contests" with the left edge of the chart title below it, and the right edge of the last stat with the right edge of the repositories panel (same 24px page gutter on both sides).
   - Stats: equal column widths, labels in the same small uppercase style, values on the same baseline, 1px dividers full height of the bar. The VOLUME refresh icon must not shift the baseline.
   - "Round 3 Originality" tab should read as the active tab of Contests (same height as the bar, bottom border violet), not a floating box.
4. BOTTOM DESK PANEL (tabs Desk / Repository / Funds, with SETUP, YOUR PREDICTIONS, EXECUTE STRATEGY columns) is misaligned:
   - The three columns have different top paddings and heading baselines: set a shared grid (3 columns, same 24px padding, same section-heading style and baseline).
   - The setup stepper (1 Connect wallet, 2 Create trade wallet, 3 Add sUSDS) is cramped and the step texts wrap unevenly: give each step equal width, align step number circles on one line, titles on one line, helper text 2 lines max with equal reserved height, buttons all on the same baseline and same size ("Connect wallet", "Create trade wallet", "Add sUSDS"; disabled ones use the disabled style but same geometry).
   - EXECUTE STRATEGY rows (Wallet, Trade wallet, sUSDS balance, Predictions CSV) need consistent label/value alignment; the "Start Trading" button full width of its column with the same height as the other buttons.
   - The footer status strip (Prices to Oct 18..., Browse on Seer, Kleros, Telegram, X, GitHub) must align to the same gutters and not overlap the table bottom.
5. REPOSITORIES TABLE (right panel): header columns (# / REPOSITORY / UP-GAP-DOWN / UP / Delta OCT 1) are not aligned with their data: the numeric columns must be right aligned with tabular numbers, the bars column a fixed width, repository names truncate with ellipsis, row height consistent, sticky header, a visible focus/hover row state. Search box and the Market / Sort dropdowns align to the same 24px gutter.
6. Check at 1440, 1280, 1024, 820 and 390 widths: no overlap, no horizontal scroll, the desk panel stacks on small widths, the repository panel becomes a second tab on mobile, the expanded chart works on mobile (rotate hint optional).

## Design suggestions so Deep feels like the same product as the landing
- Tokens: copy the landing tokens. Surfaces #0a0a0a / #121218 / #181822; borders rgba(255,255,255,0.08); text white 100 / 65 / 40; EF violet #7B3FF2; electric violet #4B3BFF for emphasis panels; lavender #B8A4FF for small accents. Remove any other accent colours except chart series colours and the green/red delta numbers.
- Type: UI and numbers in Inter Tight (tabular numbers on all prices), page and panel titles in Instrument Serif (e.g. "Share of original work over time" as a serif 22px title). Monospace only for timestamps.
- Corners and lines: 12px radius on panels, 1px hairlines, no heavy shadows. Use the landing's neon spine idea once: a single thin violet line (1px, slow travelling light packet) under the header that ends at the Connect wallet button. Subtle, not decorative everywhere.
- Buttons: same moving-blob pill as the landing for primary actions (Connect wallet, Start Trading); secondary buttons dark with thin border.
- Chart: keep it. Make the "now" marker a crisp violet line with a small price tag, soften gridlines to 6% white, make the median line the brightest element, and add a hover crosshair with a compact tooltip (repository, UP price, time). When a repository row is hovered in the table, highlight its line in the chart and dim the rest (nice agent/outcome link, matches the Deep story: many outcomes priced together).
- Empty states: "No predictions loaded" gets a small illustration-free explanation and one clear action.
- Add a "Back to Seer" logo link to https://seer.pm so users can return to the landing; landing links to deep.seer.pm.

## Done means
Screenshots at the widths above, expanded view open and closed, no overlaps, no console errors, keyboard focus visible everywhere, and a short list of what changed.
