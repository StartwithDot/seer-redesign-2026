# purpose users tasks (home; DeepSeek draft: Claude verifies against screenshots)

## Scope and evidence base

- Audit covers the live `home` screen at `/` (https://seer.pm/), captured as **STATE 001**. [STATE 001]
- STATE 001 is a marketing/landing screen for the Seer prediction marketplace; it introduces the product, market types, settlement/dispute stack, use cases, and CTAs. [STATE 001]
- Capture metadata: `controls=26`, `charts=0`, `tables=0`. [STATE 001]
- No wallet-gated, empty, ended, or error state is visible in this landing-page capture. [STATE 001]
- Downstream app screens reached from CTAs are **not captured**. Wallet, funds, and role requirements after leaving `/` are therefore marked **unknown**, not “none.” [STATE 001]

## Purpose of the product

Seer is a **prediction marketplace**: users estimate probabilities, create markets, and trade on outcomes. The landing page frames prediction markets as probability estimators, with an example estimate of **97.3%**. [STATE 001]

The product supports **four market types**: **Categorical**, **Multi Categorical**, **Scalar**, and **Multi Scalar**. [STATE 001]

Seer’s stated mechanics:
- Uses the **Conditional Tokens framework** to create/manage outcome tokens. [STATE 001]
- Wraps **ERC1155** outcome tokens into **ERC20** tokens for smoother trading and DeFi integration. [STATE 001]
- Uses **Kleros** to resolve disputes arising from **Reality.eth** questions. [STATE 001]

The `/` screen itself is a **marketing/landing page** whose purpose is to explain Seer and route visitors to the app, market creation, trading, documentation, examples, community, and contact. [STATE 001]

## Who uses it

User segments are not explicitly defined in STATE 001; the following are **implied by controls and copy**:

- **Prospective users / visitors** evaluating Seer via the landing page. [STATE 001]
- **Traders** via **Start Trading** and app-launch CTAs. [STATE 001]
- **Market creators** via **Create A Market**. [STATE 001]
- **Documentation/learners** via **Documentation**, **Learn More**, and **Blog**. [STATE 001]
- **Community members** via **Community** / Discord link. [STATE 001]
- **Contact/partner inquiries** via **Get in Touch!** and **info@seer.pm**. [STATE 001]
- **Airdrop audience** via the airdrop banner **Learn More**. [STATE 001]
- **Example viewers** via four **View Example** controls. [STATE 001]

No demographic, eligibility, or role-restriction detail is stated. [STATE 001]

## Jobs-to-be-done

1. Understand what Seer is and how prediction-market probabilities are framed, including the **97.3%** example. [STATE 001]
2. Choose among the four market types and create a market. [STATE 001]
3. Trade on market outcomes. [STATE 001]
4. Inspect example markets for each market type. [STATE 001]
5. Understand outcome-token and dispute mechanics: Conditional Tokens, ERC1155→ERC20, Reality.eth, Kleros. [STATE 001]
6. Find documentation, blog, community, and contact channels. [STATE 001]
7. Check the Seer Initial Airdrop Distribution announcement. [STATE 001]
8. Explore use cases such as elections, sports, political forecasting, financial predictions, event outcomes, risk management, insurance underwriting, social good, R&D, and entertainment/media. [STATE 001]

## Primary tasks

### 1. Read product documentation
1. On `/`, select **Documentation** in the header or **Learn More** as the hero secondary CTA. [STATE 001]
2. Read the Seer documentation at the destination. [STATE 001]

Needs: wallet not indicated; funds not indicated; role: visitor/researcher. [STATE 001]

### 2. Launch the Seer app
1. Select **Launch App** in the header, **Start Now** in the hero/final CTA, or **Seer App** in the footer. [STATE 001]
2. Continue into the Seer app. [STATE 001]

Needs: wallet unknown; funds unknown; role: prospective user. Downstream app requirements are not captured. [STATE 001]

### 3. Create a market
1. Select **Create A Market**. [STATE 001]
2. Complete the market-creation flow in the app. [STATE 001]

Needs: wallet unknown; funds unknown; role: market creator, implied by the CTA label. Downstream creation requirements are not captured. [STATE 001]

### 4. Start trading
1. Select **Start Trading**, or enter the app via **Launch App** / **Start Now**. [STATE 001]
2. Trade on markets in the app. [STATE 001]

Needs: wallet unknown; funds unknown; role: trader, implied by the CTA label. Downstream trading requirements are not captured. [STATE 001]

### 5. View an example market
1. Under **Categorical**, **Multi Categorical**, **Scalar**, or **Multi Scalar**, select **View Example**. [STATE 001]
2. Open and inspect the example market. [STATE 001]

Needs: wallet not indicated; funds not indicated; role: visitor/prospective trader. [STATE 001]

### 6. Learn about the airdrop
1. In the airdrop banner, select **Learn More** under “Announcing the Seer Initial Airdrop Distribution.” [STATE 001]
2. Read the announcement. [STATE 001]

Needs: wallet not indicated; funds not indicated; role: visitor/airdrop audience. No amount, date, eligibility, or distribution fields are shown in STATE 001. [STATE 001]

### 7. Join the community
1. Select **Community** in the footer, or use the Discord icon link. [STATE 001]
2. Join the Seer Discord community. [STATE 001]

Needs: wallet not indicated; funds not indicated; role: community member. [STATE 001]

### 8. Contact Seer
1. Select **Get in Touch!** or **info@seer.pm**. [STATE 001]
2. Send an inquiry to the contact channel. [STATE 001]

Needs: wallet not indicated; funds not indicated; role: visitor/partner inquiry. [STATE 001]

## Task requirements matrix

| # | Task | Wallet | Funds | Role |
|---|------|--------|-------|------|
| 1 | Read documentation | Not indicated; landing page not wallet-gated [STATE 001] | Not indicated | Visitor/researcher |
| 2 | Launch app | Unknown; downstream app not captured [STATE 001] | Unknown | Prospective user |
| 3 | Create a market | Unknown; downstream app not captured [STATE 001] | Unknown | Market creator, implied by label [STATE 001] |
| 4 | Start trading | Unknown; downstream app not captured [STATE 001] | Unknown | Trader, implied by label [STATE 001] |
| 5 | View example market | Not indicated [STATE 001] | Not indicated | Visitor/prospective trader |
| 6 | Learn about airdrop | Not indicated [STATE 001] | Not indicated | Visitor/airdrop audience |
| 7 | Join community | Not indicated [STATE 001] | Not indicated | Community member |
| 8 | Contact Seer | Not indicated [STATE 001] | Not indicated | Visitor/partner inquiry |

## Explicit uncertainties and excluded controls

- **Downstream requirements are unknown.** STATE 001 only captures `/`; app, create-market, trading, and example-market screens are not captured, so wallet/funds/role requirements are not verifiable. [STATE 001]
- **Airdrop details are incomplete.** No amount, date, eligibility, or distribution fields are shown. [STATE 001]
- **Ask Seer** is present near the example prediction, but its action is not specified; it is not treated as a definable task. [STATE 001]
- **More** appears under “A world of opportunities,” but its action is not captured; it is not treated as a definable task. [STATE 001]
- **Available on:** is present, but no platform names/logos are captured in text. [STATE 001]
- **Multi Scalar** description duplicates **Scalar** (“Numeric outcome within a specified range”); no stated distinction. [STATE 001]
- Footer includes both **Documentation** and **Docs** labels. [STATE 001]
- Capture reports **26 controls** total, but text alone does not identify all 26 unambiguously. [STATE 001]
- No charts or tables are present in the capture. [STATE 001]