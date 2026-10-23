# FEATURES_JSON.md

Evidence basis: verified UI observations and captured API responses. Fixtures are real saved API responses under `products/explorer/data/`. `markets-search.full.json` is the complete 100-market page; other fixtures are trimmed. Where a trimmed fixture’s exact filename was not in the verified inventory, the fixture is identified by endpoint rather than by a guessed filename.

Truncated fixtures may omit arrays/objects. Empty arrays below are real empty captures, not evidence that the field cannot exist.

---

## Units and rounding conventions

- API values are generally raw/unrounded. UI formatting is separate.
- USD fields: API floats/strings in dollars. Leaderboard table displays dollars with 2 decimals. Home cards use compact notation, e.g. `$27.74k`.
- Raw token amounts: integer strings in base units. Do not assume 18 decimals for every token; the Algebra subgraph exposes `decimals`.
- Timestamps: Unix seconds unless explicitly ISO.
- ROI: API ratio (`0.3025` = 30.25%); UI shows signed percent.
- Trader Score: 0–100, UI one decimal (`78.6`); API tier `Great`, UI badge `GREAT`.
- Outcome percentages: outcome rows show one decimal (`84.2%`). Chart end labels show two decimals (`84.20`, `14.80`).
- Chart y-axis: 0–100 for categorical; auto-scaled for scalar/50-50 markets (e.g. 48–52 or 8.5–9.2), which exaggerates movement.
- Charts plot liquidity-pool implied price, not executed trades. Tooltip warns this may not match outcome odds.

---

## Saved API fixtures

### 1. `markets-search.full.json`

- **Endpoint:** `POST https://app.seer.pm/.netlify/functions/markets-search`
- **Method:** POST
- **Request:** body `{}` observed. Other filter parameters were not captured.
- **Coverage:** complete 100-market page. Response reports `count: 2947` and `pages`.

```text
Response
  markets: Market[100]
  count: number                  // 2947 total markets
  pages: number                  // page count

Market
  id: string                     // 0xfbebbbaa625a345bf6d310cd12ad4483e0cd2df0
  chainId: number                // 100 = Gnosis
  type: string                   // "Generic"
  creator: string                // address
  factory: string                // address
  outcomes: string[]             // ["Lisbon","Munich ","Jakarta ","Others","Invalid"]
  odds: number[]                 // aligned to outcomes; unit not asserted
  openingTs: number              // Unix seconds, 1775591213
  questions: Question[]
  parentMarket: object|null      // {id, conditionId, payoutReported, payoutNumerators}
  parentOutcome: string|number   // index
  wrappedTokens: string[]        // token addresses
  poolBalance: (not asserted)
  verification: (not asserted)
  incentive: (not asserted)
  url: string                    // slug
  categories: array
  images: array/object
  liquidityUSD: number           // dollars
  volumeUSD: number              // dollars
  openInterestUSD: number        // dollars

Question
  id: string                     // 0xd218...
  bond: string                   // wei, e.g. "20000000000000000000" = 20e18
  timeout: (type not asserted)
  min_bond: (type not asserted)
  arbitrator: (not asserted)
  best_answer: (not asserted)
  finalize_ts: number            // Unix seconds
  is_pending_arbitration: boolean
```

- **Rounding:** raw API; UI home cards use compact USD (`$27.74k`) and tooltip compact values (`5.75k sDAI`, `7.26k $`, `5.10k $ traded`, `15.49k $ notional`).
- **Conditional example:** child markets can carry `parentMarket` and `parentOutcome`; 17 of 100 sampled markets were conditional.

---

### 2. Trimmed `get-market` fixture

- **Endpoint:** `POST https://app.seer.pm/.netlify/functions/get-market`
- **Method:** POST
- **Request:** request body/params not captured in the verified fixture note. Response is a single market object.
- **Fixture identifier:** trimmed `get-market` fixture; exact filename not asserted.

```text
Response
  id: string                     // 0xe179...
  marketName: string             // "Will Marine Le Pen be the National Rally"
  outcomes: string[]             // len 3, includes "Yes"
  parentOutcome: string          // "0"
  templateId: string             // "2"
  hasAnswers: boolean            // true
  questionsInArbitration: string // "0"
  openingTs: number              // Unix seconds
  finalizeTs: number             // Unix seconds
  encodedQuestions: string[]
  lowerBound: string             // "0" for categorical
  upperBound: string             // "0" for categorical
  payoutReported: boolean
  payoutNumerators: string[]
  outcomesSupply: string         // raw integer, e.g. 24616633683886735396980 ≈ 24,616.63 shares
  blockTimestamp: number         // Unix seconds
  type: string                   // "Generic"
  wrappedTokens: string[]
  collateralToken: string        // address
  collateralToken1: string       // zero address in example
  collateralToken2: string       // zero address in example
  parentCollectionId: string     // zero address
  conditionId: string
  questionId: string
  factory: string
```

- **Units:** timestamps Unix seconds; `outcomesSupply` raw token units; bounds and payout numerators are strings.
- **Rounding:** market meta displays USD liquidity/volume/P&L; addresses truncated in UI (`0xb328...30b1`). Scalar estimates use varying UI precision, e.g. `9.092 gwei` and `21.23 Note`; no global decimal rule asserted.

---

### 3. Trimmed `markets-charts` fixture

- **Endpoint:** `GET https://app.seer.pm/.netlify/functions/markets-charts?ids=<comma-separated-market-ids>`
- **Method:** GET
- **Request params:** `ids` — comma-separated market addresses.
- **Fixture identifier:** trimmed `markets-charts` fixture.

```text
Response
  <marketId>: Point[][]           // keyed by market address; nested arrays observed

Point
  pool: {
    id: string
    token0: {id: string, name: string}   // e.g. "Savings xDAI"
    token1: {id: string, name: string}   // e.g. "YES"
    liquidity: string                    // raw integer string
  }
  liquidity: string                      // raw integer string; example "0"
  sqrtPrice: string                      // raw integer string
  token0Price: string                    // decimal string, e.g. "0.050004102846..."
  token1Price: string                    // decimal string
```

- **Units:** `liquidity`/`sqrtPrice` raw strings; prices are token ratios.
- **Rounding:** chart end pills 2 decimals (`84.20`); y-axis categorical 0–100, scalar auto-scaled. Tooltip timestamp plus all outcomes.

---

### 4. Trimmed `market-chart` fixture

- **Endpoint:** `GET https://app.seer.pm/.netlify/functions/market-chart?marketId=<id>&chainId=100`
- **Method:** GET
- **Request params:** `marketId`, `chainId` (example `100`).
- **Fixture identifier:** trimmed `market-chart` fixture.

```text
Response
  Point[][]                       // array of chart point arrays

Point
  pool: {
    id: string
    token0: {id: string, name: string}   // e.g. "YASHAR"
    token1: {id: string, name: string}   // e.g. "Savings xDAI"
    liquidity: string
  }
  liquidity: string               // raw integer string
  sqrtPrice: string               // raw integer string
  token0Price: string             // decimal string, example "3.030551341..."
  token1Price: string             // decimal string
```

- **Units:** raw pool integers; token price ratios.
- **Rounding:** same chart formatting as above. Chart plots pool-implied price, not trade history.

---

### 5. Trimmed `get-market-events` fixture

- **Endpoint:** `GET https://app.seer.pm/.netlify/functions/get-market-events?chainId=100&marketId=<id>`
- **Method:** GET
- **Request params:** `chainId=100`, `marketId`.
- **Fixture identifier:** trimmed `get-market-events` fixture.

```text
Response
  data: []                        // empty capture
```

- **Schema:** no event object fields were exercised by this fixture. Do not infer event fields from the UI “Major Events” panel alone.
- **Units/rounding:** not applicable in captured response.

---

### 6. Trimmed `market-comments` fixture

- **Endpoint:** `GET https://app.seer.pm/.netlify/functions/market-comments?market_id=<id>&chain_id=100`
- **Method:** GET
- **Request params:** `market_id`, `chain_id=100`.
- **Fixture identifier:** trimmed `market-comments` fixture.

```text
Response
  data: []                        // empty capture
```

- **Schema:** no comment object fields were exercised. UI comments are sign-in gated (“Connect your wallet to share your take”, “No takes yet…”).
- **Units/rounding:** not applicable in captured response.

---

### 7. Trimmed `get-token-transactions` fixture

- **Endpoint:** `GET https://app.seer.pm/.netlify/functions/get-token-transactions?chainId=100&marketId=<id>`
- **Method:** GET
- **Request params:** `chainId=100`, `marketId`.
- **Fixture identifier:** trimmed `get-token-transactions` fixture.

```text
Response
  topHolders: {
    <tokenAddress>: Holder[]
  }

Holder
  address: string                 // 0xc704...
  balance: string                 // raw integer string, e.g. 4773514033848597806572
```

- **Units:** holder balances are raw token units; use token decimals, not a blanket 18-decimal assumption.
- **Rounding:** UI Top Holders table formatting not captured. Activity table is long (~660 controls); transaction fields are not present in the verified snippet, so they are not asserted here.

---

### 8. Trimmed `get-pnl-leaderboard` fixture

- **Endpoint:** `GET https://app.seer.pm/.netlify/functions/get-pnl-leaderboard`
- **Method:** GET
- **Request params:** `app=all&chainId=all&period=all&sort=pnl&dir=desc&limit=25&offset=0&breakdown=1`
- **Fixture identifier:** trimmed `get-pnl-leaderboard` fixture.

```text
Response
  app: string                     // "all"
  chainId: string                 // "all"
  period: string                  // "all"
  sort: string                    // "pnl"
  dir: string                     // "desc"
  unit: string                    // "USD"
  updatedAt: string               // ISO, "2026-10-18T15:09:31.213+00:00"
  total: number                   // 4130
  limit: number                   // 25
  offset: number                  // 0
  rows: Row[25]

Row
  rank: number                    // 1
  address: string                 // 0x2ff...
  pnl: number                     // USD float, 241172.15314631056
  volume: number                  // USD float, 1428994.8499800863
  roi: number                     // ratio, 0.30255383620362536
  unit: string                    // "USD"
  marketCount: number             // 55
  score: number                   // 78.6, 0–100 one decimal
  tier: string                    // "Great" (UI displays "GREAT")
  scoreBreakdown: {
    method: string                // "markets"
    score: number                 // 78.6
    tier: string                  // "Great"
    components: {
      returns: number             // 55.3
      profitFactor: number        // 100
      hitRate: number             // 100
      lossBurn: number            // 79.8
      breadth: number             // 89.9
    }
    sampleShrink: {
      scoredMarketCount: number   // 50
      factor: number              // 0.8333333333333334
      rawScore: number            // 84.3
    }
    inputs: {
      roi: number                 // 0.3025275400715047 ratio
      profitFactor: number        // 3.7206220508169086
      hitRate: number             // 0.6818181818181818 ratio
      breakEvenHitRate: number    // 0.36887166146580463 ratio
      hitEdge: number             // 0.31294652035237713 ratio
      lossBurn: number            // 0.10110324912630321
      breadth: number             // 0.6293275505702169
    }
  }
  updatedAt: string               // ISO
```

- **Units:** `pnl`/`volume` dollars; `roi` ratio; score/components 0–100; inputs mostly ratios.
- **Rounding:** UI leaderboard dollars 2 decimals; ROI signed percent (decimal places not asserted); score one decimal; tier badge uppercase (`GREAT`, `ELITE`, `GOOD`). `N/A` appears when history is insufficient.

---

### 9. Trimmed `get-portfolio-pl` fixture

- **Endpoint:** `GET https://app.seer.pm/.netlify/functions/get-portfolio-pl`
- **Method:** GET
- **Request params:** `account=<address>&chainId=100&period=all&collateralProfile=default&marketId=<id>`
- **Fixture identifier:** trimmed `get-portfolio-pl` fixture.

```text
Response
  account: string                 // lowercase address, e.g. 0x000...dead
  chainId: number                 // 100
  period: string                  // "all"
  marketIds: string[]
  startTime: number               // Unix seconds
  endTime: number                 // Unix seconds
  valueStart: number              // example 0; unit not asserted
  valueEnd: number                // example 0; unit not asserted
  tradingCollateralNetOut: number // example 0; unit not asserted
  lpCollateralNetOut: number      // example 0; unit not asserted
```

- **Units/rounding:** units for the P/L integer fields are not asserted by the captured snippet; no UI rounding rule inferred.

---

### 10. Trimmed Algebra subgraph fixture

- **Endpoint:** `POST https://app.seer.pm/subgraph?_subgraph=algebra&_chainId=100`
- **Method:** POST
- **Request params:** query `_subgraph=algebra`, `_chainId=100`. GraphQL request body not captured in the verified note.
- **Fixture identifier:** trimmed Algebra subgraph fixture.

```text
Response
  data.pools: Pool[]

Pool
  id: string                      // 0xa73a...
  fee: string                     // "13061" encoded; do not convert without confirmed units
  liquidity: string               // raw integer string
  tickSpacing: string             // "60"
  sqrtPrice: string               // raw integer string
  tick: string                    // "-46811"
  token0: Token
  token1: Token
  token0Price: string             // decimal string
  token1Price: string             // decimal string
  volumeToken0: string            // token units, decimal string
  volumeToken1: string            // token units, decimal string
  volumeUSD: string               // USD string; fixture "0"
  txCount: string                 // integer string, "123"
  totalValueLockedToken0: string  // token units
  totalValueLockedToken1: string  // token units
  totalValueLockedUSD: string     // USD string; fixture "0"
  untrackedVolumeUSD: string      // USD string; fixture "0"
  feesUSD: string                 // USD string; fixture "0"

Token
  id: string
  symbol: string                  // "OTHERS", "sDAI"
  name: string                    // "OTHERS", "Savings xDAI"
  decimals: string                // "18"
  __typename: string              // "Token"
```

- **Units:** token amounts are decimal strings; USD fields are strings; tick signed integer; fee encoding not asserted.
- **Rounding:** pool balances UI shows SHARES price 4 decimals (`0.9881`); USD compact where displayed. `volumeUSD: "0"` coexists with non-zero token volume — do not derive USD from token amounts.

---

## External service fixtures captured alongside (not Seer market data)

### 11. Wallet modal wallets fixture

- **Endpoint:** `GET https://api.web3modal.org/getWallets?page=1&entries=4`
- **Method:** GET
- **Request params:** `page=1`, `entries=4`.
- **Fixture identifier:** trimmed wallet-modal wallets fixture.

```text
Response
  count: number                   // 612
  nextPage: number|null           // 2
  previousPage: null
  data: Wallet[4]

Wallet
  id: string
  name: string
  homepage: string                // URL with utm params
  image_id: string                // UUID
  order: number                   // 10
  mobile_link: string|null
  desktop_link: string|null
  link_mode: string|null
  webapp_link: null
  rdns_web_wallet: null
  app_store: string|null          // URL
  play_store: string|null         // URL
  rdns: null
  chrome_store: null
  injected: null
  chains: string[]                // "eip155:1"
  categories: string[]