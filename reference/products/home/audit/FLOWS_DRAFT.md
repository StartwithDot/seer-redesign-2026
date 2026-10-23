# home: FLOWS DRAFT (DeepSeek)

# FLOWS DRAFT — `home` (`/`, `https://seer.pm/`)

## Evidence scope and legend

- Only **STATE 001** is captured: `/` at `https://seer.pm/`, a marketing/landing page. `controls=26`, `charts=0`, `tables=0`. No wallet-gated, empty, ended, or error state is visible. [observed STATE 001]
- Downstream app screens, docs pages, article content, example-market content, wallet UI, chain state, and funds state are **not captured**. [unobservable: not in supplied capture]
- Mobile capture marker `002m` appears in the controls inventory, but no STATE 002 notes/screens are supplied. [observed STATE 001 / unobservable: mobile state not provided]
- Exact URLs may be truncated in the capture; reproduced as captured. [observed STATE 001]
- `[observed STATE 001]` = directly supported by notes/controls/observed edges.
- `[inferred]` = inferred from an observed href or label, not from a captured destination state.
- `[unobservable: why]` = no supplied evidence.

### Precondition codes

| Code | Wallet | Chain | Funds | Role |
|---|---|---|---|---|
| `P-LAND` | Not indicated / landing page not wallet-gated [observed STATE 001] | Not indicated [observed STATE 001] | Not indicated [observed STATE 001] | Per-flow role [inferred] |
| `P-APP` | Unknown [unobservable: downstream app not captured] | Unknown [unobservable: downstream app not captured] | Unknown [unobservable: downstream app not captured] | Per-CTA label [inferred] |

> Important: the observed-edge list contains only one `View Example` edge, to `0x43d881...`. The other three `View Example` hrefs come from the controls inventory, so their navigation is marked `[inferred]` from href, not as a separate observed click.

---

## Flows

| ID | Flow / control | Preconditions | Numbered steps | Result |
|---|---|---|---|---|
| **F-HOME-01** | Airdrop banner → **Learn More** | `P-LAND`; role visitor/airdrop audience [inferred] | 1. [observed STATE 001] On `/`, activate **Learn More** in banner “Announcing the Seer Initial Airdrop Distribution”. 2. [observed STATE 001] Navigate to `https://seer-pm.medium.com/announcing-the-seer-initial-airdr` (may be truncated). 3. [inferred] Medium article renders. [unobservable: article content not captured] | Medium announcement page opens [inferred]; content unknown. |
| **F-HOME-02** | Header **Documentation** | `P-LAND`; role visitor/researcher [inferred] | 1. [observed STATE 001] Activate **Documentation** in header. 2. [observed STATE 001] Navigate to `https://seer-3.gitbook.io/seer-documentation`. 3. [inferred] GitBook documentation renders. [unobservable: docs content not captured] | Seer documentation page opens [inferred]. |
| **F-HOME-03** | Header **Blog** | `P-LAND`; role visitor/researcher [inferred] | 1. [observed STATE 001] Activate **Blog** in header. 2. [observed STATE 001] Navigate to `https://seer-pm.medium.com/`. 3. [inferred] Medium blog renders. [unobservable: blog content not captured] | Seer Medium blog opens [inferred]. |
| **F-HOME-04** | Header **Launch App** | `P-LAND` + `P-APP`; role prospective user [inferred] | 1. [observed STATE 001] Activate **Launch App**. 2. [observed STATE 001] Navigate to `https://app.seer.pm/`. 3. [inferred] Seer app opens. [unobservable: app wallet/chain/funds state not captured] | App launch route opens [observed href; app state unobservable]. |
| **F-HOME-05** | **Start Now** (hero and/or final CTA) | `P-LAND` + `P-APP`; role prospective user [inferred] | 1. [observed STATE 001] Activate **Start Now**. 2. [observed STATE 001] Navigate to `https://app.seer.pm/`. 3. [inferred] Seer app opens. [unobservable: exact separate hero vs final “Start Now” control identity not resolved; app state not captured] | App launch route opens [observed href; downstream unobservable]. |
| **F-HOME-06** | Hero **Learn More** | `P-LAND`; role visitor/researcher [inferred] | 1. [observed STATE 001] Activate hero **Learn More**. 2. [observed STATE 001] Navigate to `https://seer-3.gitbook.io/seer-documentation`. 3. [inferred] GitBook documentation renders. [unobservable: docs content not captured] | Documentation page opens [inferred]. |
| **F-HOME-07** | **Create A Market** | `P-LAND` + `P-APP`; role market creator [inferred from label] | 1. [observed STATE 001] Activate **Create A Market**. 2. [observed STATE 001] Navigate to `https://app.seer.pm/create-market`. 3. [inferred] Create-market app route opens. [unobservable: creation form, wallet/chain/funds requirements not captured] | Create-market route opens [observed href; form/requirements unobservable]. |
| **F-HOME-08** | **Start Trading** | `P-LAND` + `P-APP`; role trader [inferred from label] | 1. [observed STATE 001] Activate **Start Trading**. 2. [observed STATE 001] Navigate to `https://app.seer.pm/`. 3. [inferred] Trading app route opens. [unobservable: trading UI, wallet/chain/funds requirements not captured] | App/trading route opens [observed href; downstream unobservable]. |
| **F-HOME-09** | **View Example** — Categorical | `P-LAND` + `P-APP`; role visitor/prospective trader [inferred] | 1. [observed STATE 001] Activate **View Example** for Categorical. 2. [observed STATE 001] Navigate to `https://app.seer.pm/markets/100/0x43d881f5920ed29fc5cd4917d6` (may be truncated). 3. [inferred] Example market opens. [unobservable: market content/state not captured] | Example market route opens [observed edge/href]; content unobservable. |
| **F-HOME-10** | **View Example** — Multi Categorical | `P-LAND` + `P-APP`; role visitor/prospective trader [inferred] | 1. [observed STATE 001] Control **View Example** has href `https://app.seer.pm/markets/100/0x528c5535136ce58611dc347ae8` (may be truncated). 2. [inferred] Navigation follows href; separate click edge not listed. 3. [inferred] Example market opens. [unobservable: market content/state not captured] | Example market route expected [inferred from href]; content unobservable. |
| **F-HOME-11** | **View Example** — Scalar | `P-LAND` + `P-APP`; role visitor/prospective trader [inferred] | 1. [observed STATE 001] Control **View Example** has href `https://app.seer.pm/markets/100/0xe12f48ecdd6e64d95d1d8f1d5d` (may be truncated). 2. [inferred] Navigation follows href; separate click edge not listed. 3. [inferred] Example market opens. [unobservable: market content/state not captured] | Example market route expected [inferred from href]; content unobservable. |
| **F-HOME-12** | **View Example** — Multi Scalar | `P-LAND` + `P-APP`; role visitor/prospective trader [inferred] | 1. [observed STATE 001] Control **View Example** has href `https://app.seer.pm/markets/100/0x8df5b3a628b3d7703164620418` (may be truncated). 2. [inferred] Navigation follows href; separate click edge not listed. 3. [inferred] Example market opens. [unobservable: market content/state not captured] | Example market route expected [inferred from href]; content unobservable. |
| **F-HOME-13** | Footer **Seer App** | `P-LAND` + `P-APP`; role prospective user [inferred] | 1. [observed STATE 001] Activate footer **Seer App**. 2. [observed STATE 001] Navigate to `https://app.seer.pm/`. 3. [inferred] Seer app opens. [unobservable: app state not captured] | App route opens [observed edge/href]; downstream unobservable. |
| **F-HOME-14** | Footer **Blog** | `P-LAND`; role visitor/researcher [inferred] | 1. [observed STATE 001] Footer label **Blog** is named. 2. [observed STATE 001