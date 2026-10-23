export const guideTabs = ['Start here', 'Read the market', 'Trade', 'Glossary'];
export const guideSteps = [
    { title: 'Connect Wallet', body: 'Connect an injected EVM wallet on Optimism. Review the address and network before continuing.', target: 'deep-setup' },
    { title: 'Create Trade Wallet', body: 'An owned contract batches orders. This checkout has no verified factory: creation is unavailable and no signature is requested.', target: 'deep-setup' },
    { title: 'Get sUSDS', body: 'sUSDS is the savings-bearing settlement collateral. Review your actual wallet balances. Conversion needs a verified adapter, unavailable here.', target: 'deep-funds' },
    { title: 'Deposit to Trade Wallet', body: 'Deposit only to a verified owned contract. Never send funds to an unverified address. Deposits are unavailable in this build.', target: 'deep-funds' },
    { title: 'Upload CSV Predictions', body: 'Upload repo,predicted rows with values between 0 and 1. Review validation errors and confirm Load Predictions.', target: 'deep-predictions' },
    { title: 'Execute Strategy', body: 'Review differences and starting collateral. Execution requires a verified trade wallet, funding and executor; it remains gated here.', target: 'deep-strategy' },
];
export const glossary = [
    ['UP / DOWN', 'UP prices the share of original work; DOWN prices dependency carry. These are separately traded prices.'],
    ['Sum and residual', 'Sum = UP + DOWN. Unpriced gap = 1 − sum when positive; over-1 is the excess when sum exceeds 1. Hatching marks this residual.'],
    ['Difference', 'UP difference = predicted − UP; DOWN difference = 1 − predicted − DOWN. A positive difference indicates disagreement, not guaranteed profit.'],
    ['Split, time chart and Swarm', 'Split compares the price boundaries; the time chart shows recorded trades. Swarm positions repositories by UP price, with a magnified lens over the crowded band.'],
    ['Complete sets', 'A complete set holds every outcome of a conditional market. Its collateral and redemption depend on the market and resolution rules. Check provenance before trading.'],
    ['Score', 'Score is unavailable in the saved ranking. It is never inferred from P/L or volume.'],
    ['Trade-wallet risk', 'An owned contract can hold collateral and outcome tokens. Contract bugs, approvals, slippage, liquidity, gas and resolution disputes can put funds at risk.'],
];
