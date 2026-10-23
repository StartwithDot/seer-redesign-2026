# home: scenario report (DeepSeek from scenario results)

# SCENARIO REPORT — `home` (`https://seer.pm/`)

Mapped to supplied flows where URL/label matches. Example-market scenarios are reported as “View Example” flow variants; exact draft ID is not resolvable from the supplied target URLs.

| Scenario | Flow replayed | How far it got | Step results / UI states reached | Blocked? |
|---|---|---|---|---|
| **01-launch-app-desktop** | **Launch App** — F-HOME-04 | **3/3 OK** | 1. Entry found at `https://seer.pm/`. 2. Followed to `https://app.seer.pm/`. 3. Destination rendered at `https://app.seer.pm/`. Console errors: `[]`. | No |
| **07-start-now-mobile-mobile** | **Start Now** mobile — F-HOME-05 | **3/3 OK** | 1. Entry found at `https://seer.pm/`. 2. Followed to `https://app.seer.pm/`. 3. Destination rendered at `https://app.seer.pm/`. Console errors: `[]`. | No |
| **08-example-market-mobile-mobile** | **View Example / example market** mobile — F-HOME-09/10/11 family; exact ID unresolved | **1/3, then crash** | 1. Entry found at `https://seer.pm/`. 2. Follow homepage link **FAIL**: `TimeoutError: page.waitForURL: Timeout 30000ms exceeded.` Log URL: `https://app.seer.pm/markets/100/the-price-of-bitcoin-at-the-start-of-2`. Scenario crashed. Destination not verified. Console errors: `[]`. | **Yes — navigation wait timeout** |
| **04-example-market-one-desktop** | **View Example / example market** desktop — exact ID unresolved | **1/3, then crash** | 1. Entry found at `https://seer.pm/`. 2. Follow homepage link **FAIL**: `TimeoutError: page.waitForURL: Timeout 30000ms exceeded.` Log URL: `https://app.seer.pm/markets/100/who-will-win-the-2024-us-presidential-`. Scenario crashed. Destination not verified. Console errors: `[]`. | **Yes — navigation wait timeout** |
| **02-documentation-desktop** | **Documentation** — F-HOME-02 | **3/3 OK** | 1. Entry found at `https://seer.pm/`. 2. Followed to `https://seer-3.gitbook.io/seer-documentation`. 3. Destination rendered. Console errors: `[]`. | No |
| **03-create-market-entry-desktop** | **Create A Market** — F-HOME-07 | **3/3 OK** | 1. Entry found at `https://seer.pm/`. 2. Followed to `https://app.seer.pm/create-market`. 3. Destination rendered. Console errors: `[]`. Only entry observed; form/wallet/chain/funds requirements not evidenced. | No |
| **05-example-market-two-desktop** | **View Example / example market** desktop — exact ID unresolved | **1/3, then crash** | 1. Entry found at `https://seer.pm/`. 2. Follow homepage link **FAIL**: `TimeoutError: page.waitForURL: Timeout 30000ms exceeded.` Log URL: `https://app.seer.pm/markets/100/which-swing-states-will-trump-win-in-2`. Scenario crashed. Destination not verified. Console errors: `[]`. | **Yes — navigation wait timeout** |
| **06-airdrop-announcement-desktop** | **Airdrop banner → Learn More** — F-HOME-01 | **3/3 OK** | 1. Entry found at `https://seer.pm/`. 2. Followed to `https://seer-pm.medium.com/announcing-the-seer-initial-airdrop-distrib`. 3. Destination rendered. Console errors: `['Failed to load resource: the server responded with a status of 403 ()']`. | No — rendered, but one 403 resource console error |

## BLOCKED flows

- **08-example-market-mobile-mobile**
- **04-example-market-one-desktop**
- **05-example-market-two-desktop**

All three are blocked at **follow homepage link** by **`TimeoutError: page.waitForURL: Timeout 30000ms exceeded`**, followed by **scenario crashed**. Destination UI was not reached/verified.

**Cause attribution from supplied data:** navigation wait timeout. The supplied data does **not** identify **wallet / chain / funds / role / unknown selector** as the cause, and console errors are `[]` for all three.

## Not blocked

**01-launch-app-desktop, 07-start-now-mobile-mobile, 02-documentation-desktop, 03-create-market-entry-desktop, 06-airdrop-announcement-desktop** completed entry → navigation → destination rendered.

No wallet, chain, funds, role, or unknown-selector blocker is evidenced in the supplied scenario data.