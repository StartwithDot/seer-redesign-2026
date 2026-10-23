# screens (explorer; DeepSeek draft: Claude verifies against screenshots)

# Explorer (app.seer.pm) — screen-by-screen audit

## Scope, conventions, and explicit uncertainty

- All captures are on `app.seer.pm`. The recurring beta notice is: “Note that this is a Beta version and can still be unstable” [STATE 001–008, STATE 009–019, STATE 020–040, STATE 056–069, STATE 070–090].
- Wallet header, when connected: truncated address `0x0000...dEaD` plus balance `24.69 xDAI` [STATE 001–007, STATE 009–014, STATE 017–019, STATE 020–040, STATE 056–066, STATE 068–069, STATE 070–090].
- Disconnected/connect header: `Connect`, with no address or balance shown [STATE 008, STATE 015–016, STATE 067, STATE 089].
- Root/market-feed captures report `charts=0 tables=0`; no rendered chart, graphic, or table is visible [STATE 001–008].
- Leaderboard captures report `charts=0 tables=1`; the only data graphic is the leaderboard table [STATE 009–026].
- Create Market and Collections captures report `charts=0 tables=0` [STATE 027–036].
- Market-detail captures report chart counts of 2–3, but chart axes/series are generally not exposed in text captures; only counts, time controls, and one captured hover tooltip are available [STATE 037–040, STATE 056–069, STATE 087–090].
- **Uncertainty:** STATE 045–055 have chart inventory entries but no screen-content notes in the supplied material; they cannot be described beyond chart metadata. STATE 070–071 and STATE 073–086 are covered only by the shared-shell/main-market notes; individual trigger labels for those states are not enumerated. STATE 091m appears only in the controls inventory, with no screen notes, so it is not described.
- No policy body text, no leaderboard full 25-row dump, and no Create Market form fields are captured. Those gaps are marked below.

---

## Route: `/` — Markets home

### STATE 001 — baseline Markets home
**Purpose:** root market feed / Markets home [STATE 001].

**Layout regions**
- Beta notice at top [STATE 001].
- Global top nav: `Markets`, `Leaderboard`, `Create Market`, `Policies`, `App` [STATE 001].
- Wallet/header area: connected address `0x0000...dEaD` and balance `24.69 xDAI` [STATE 001].
- Search input: placeholder `Search by market, outcome or collection` [STATE 001].
- Feed controls: `Filters`, `Create New Market`, `My collections` [STATE 001].
- Market-card feed [STATE 001].

**Data shown**
- Market cards show free-text questions, outcome labels/percentages, and dollar-formatted volume/value. Examples: `Yashar 60.9%`, `No 67.9%`, `$27.74k`, `$918.38`, `$1.10k` [STATE 001].
- Numeric-market cards can show values plus units and bounds, e.g. `21.23 NOTE`, `9.092 GWEI`, bounds `10`/`50` and `0.1`/`120` [STATE 001].
- Captured feed includes (same list across STATE 001–008; last card truncated):
  1. Israeli Knesset 2026: `Yashar 60.9%`, `Likud 38.2%`, `Others 0.9%`; `$27.74k` [STATE 001–008].
  2. National Rally candidate win next French presidential: `No 67.9%`, `Yes 32.1%`; `$7.54k` [STATE 001–008].
  3. Marine Le Pen National Rally candidate next French presidential: `Yes 85.1%`, `No 14.9%`; `$7.16k` [STATE 001–008].
  4. France National Assembly seats `[party bloc]`: `Left (...) 36.9%`, `Centre (...) 34%`, `Far Right (...) 29.1%`; `$6.45k` [STATE 001–008].
  5. Duplicate National Rally candidate title: `No 74%`, `Yes 26%`; `$1.24k` [STATE 001–008].
  6. Polymarket negative-risk fix before Jan 1 2027: `No 51.6%`, `Yes 48.4%`; `$1.18k` [STATE 001–008].
  7. Polymarket API fees paid per individual positions by Jan 1 2027: `Yes 50%`, `No 50%`; `$1.17k` [STATE 001–008].
  8. Polymarket oracle other than UMA before Jan 1 2027: `No 65.8%`, `Yes 34.2%`; `$1.15k` [STATE 001–008].
  9. Polymarket public API documented fees-paid endpoint by Jan 1 2027: `No 69.7%`, `Yes 30.3%`; `$1.12k` [STATE 001–008].
  10. Kurdish militant armed attack inside Iran 2026: `No 90.9%`, `Yes 9.1%`; `$1.12k` [STATE 001–008].
  11. Truncated card: “Polymarket clarification notes causing ≥25pp…” [STATE 001–008].

**Controls**
- Buttons/links: unnamed button, logo link `/`, `Markets` link `/`, `Leaderboard` link `/leaderboard`, `Create Market` link `/create-market`, `Policies` button, `App` button, wallet button `24.69 xDAI`, theme toggle `Switch to dark mode`, `Filters` button, `Create New Market` link `/create-market`, `My collections` link `/collections/default`, search input, market-card links, `Open interest and liquidity breakdown` buttons, external Gnosis Scan/Kleros links [STATE 001].

### STATE 002 — `Policies` menu on Markets home
- Clicking `Policies` shows headings `Verified Market Policy` and `Market Rules Policy`; the market feed remains visible [STATE 002].
- No policy body text is captured [STATE 002].

### STATE 003 — `App` menu on Markets home
- Clicking `App` opens items `Futarchy`, `Deepfunding`, `Foresight`, `Opportunity Markets`; the market feed remains unchanged [STATE 003].

### STATE 004 — wallet menu on Markets home
- Clicking `24.69 xDAI` opens wallet/account menu: `Account`, `Deposit`, `Portfolio`, `Market Collections`, `Trade Collateral`, `Use smart account`; feed remains unchanged [STATE 004].

### STATE 005 — dark mode on Markets home
- Clicking `Switch to dark mode` changes no captured text content; no visual styling is captured [STATE 005].

### STATE 006 — `Filters` panel on Markets home
- `Filters` opens a filter panel over/with the market feed [STATE 006].
- Filter fields: `Market States`, `Verification Status`, `Chain`, `Sort By`, `Conditional Market`, `Rewards`, `Minimum