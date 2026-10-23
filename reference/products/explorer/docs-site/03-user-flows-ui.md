# user flows ui (explorer docs; DeepSeek, from quote-verified facts)

Based only on the provided facts. “GAP” marks missing, unclear, or contradictory information in the supplied set.

## Prerequisites and entry points
- Seer is live on mainnet at `seer.pm`; the product web app is hosted at `app.seer.pm`. The docs separate app-usage guidance from developer-building guidance. [https://docs.seer.pm] [https://docs.seer.pm/app/navigate-our-site]
- Getting started covers wallet and network setup plus depositing tokens on Ethereum and Gnosis; the primary promoted token action is depositing wxDAI or sDAI. [https://docs.seer.pm/app/navigate-our-site]
- Collateral/token prerequisites vary by chain and flow: on Gnosis, the buy flow’s token switch shows wxDAI or xDAI on the right depending on which the user holds more of, while sDAI stays on the left; on Ethereum Mainnet the right side always shows DAI. [https://docs.seer.pm/app/buy-sell-outcome-tokens]
- Minting/splitting requires available sDAI or xDAI; one sDAI mints one outcome token for each outcome, while one xDAI mints about 0.9 outcome tokens per outcome because of the sDAI/xDAI exchange rate. [https://docs.seer.pm/app/mint-merge-redeem-outcome-tokens]
- Conditional markets do not use sDAI to place bets; users must first split or purchase parent outcome tokens from the main market, and conditional outcome tokens are minted/merged using parent outcome tokens instead of sDAI or xDAI. [https://docs.seer.pm/app/conditional-markets]
- Futarchy markets are currently only available on Gnosis Chain; the collateral example describes GNO as the token and wstETH as the currency. [https://docs.seer.pm/app/futarchy-markets]
- Verification requires sufficient xDAI available; the deposited xDAI is returned once the market is verified. [https://docs.seer.pm/app/verify-market]
- Reporting an answer requires enough bond in the wallet; the example shows a 0.1 DAI deposit required to submit an answer. [https://docs.seer.pm/app/report-answer]
- Raising a dispute requires paying a fixed arbitration fee whose amount is set by Kleros, not by Seer. [https://docs.seer.pm/app/raise-a-dispute]
- Buying/selling outcome tokens requires sufficient liquidity in the token pool; providing liquidity requires holding both tokens in the pair. [https://docs.seer.pm/app/buy-sell-outcome-tokens] [https://docs.seer.pm/app/provide-liquidity]
- Before merging, users must approve Seer to handle their outcome tokens. [https://docs.seer.pm/app/mint-merge-redeem-outcome-tokens]

## User-facing flows and UI behaviors

### Create a market
- The create-market flow starts from the home page by clicking “Create a market.” [https://docs.seer.pm/app/create-a-market]
- The first step is selecting a market type; the flow requires inputting the question and outcomes. [https://docs.seer.pm/app/create-a-market]
- Multi-scalar markets require a specific question-name format: each outcome has its own question, and the outcome type is placed in brackets to replace the outcome value. [https://docs.seer.pm/app/create-a-market]
- Creation includes specifying an opening date, and the market can only be resolved after that date. [https://docs.seer.pm/app/create-a-market]
- After previewing the market, the user clicks “Create Market.” [https://docs.seer.pm/app/create-a-market]
- A market can be verified during creation using a switch button in the “Verify it Now” row; clicking that switch opens a popup. Users may also complete verification later. Unverified markets display a warning. [https://docs.seer.pm/app/create-a-market] [https://docs.seer.pm/app/verify-market]
- Creators are directed to read the Verified Markets Policy and Market Resolution Policy before creating a market. [https://docs.seer.pm/app/create-a-market]

### Verify a market
- Markets can be verified by adding them to the Curate List of Verified Markets; verification gives the market extra credibility and requires meeting strict criteria. [https://docs.seer.pm/app/verify-market]
- Verification requires submitting images for both the market and its outcomes. [https://docs.seer.pm/app/verify-market]
- Verification can be initiated during creation or later from the market card on the home page. [https://docs.seer.pm/app/verify-market]
- A verified market is shown with images and a “Verified” tag. Markets a user submitted for verification are displayed with images visible only to that user. [https://docs.seer.pm/app/verify-market]

### Trade outcome tokens: buy/sell
- A prediction market lets participants buy shares of future outcomes; shares are tradable, e.g. as ERC20 tokens, and a share’s price indicates perceived likelihood—a 0.60$ share price corresponds to 60% probability. [https://docs.seer.pm]
- Users can buy or sell outcome tokens from a token pool if there is enough liquidity, in addition to minting. [https://docs.seer.pm/app/buy-sell-outcome-tokens]
- To buy, the user clicks an outcome on the left side of the UI; the buy flow uses a right-side amount input denominated in sDAI or wxDAI. [https://docs.seer.pm/app/buy-sell-outcome-tokens]
- After clicking Buy, a confirmation popup appears; it lets users check trade details including price and fee. Slippage exists between expected and actual received amounts because trading occurs on a DEX, and a minimum received amount protects against a large price spike, otherwise the transaction reverts. Clicking Continue executes the trade. [https://docs.seer.pm/app/buy-sell-outcome-tokens]
- Selling is the reverse of buying: it swaps outcome tokens back into collateral tokens. [https://docs.se