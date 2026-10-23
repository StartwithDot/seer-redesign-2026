import market from './seer-market.json';

export const SAVED_MARKET = market;
export const SEER_MARKET_URL = `https://app.seer.pm/markets/100/${market.id}`;
export function outcomeFor(ticker: string) {
  const index = market.outcomes.indexOf(ticker);
  return index < 0 ? null : { index, token: market.wrappedTokens[index], name: market.outcomes[index] };
}
export const chainAddressUrl = (address: string, chain: 'ethereum' | 'gnosis' = 'gnosis') =>
  `https://${chain === 'ethereum' ? 'etherscan.io' : 'gnosisscan.io'}/address/${address}`;
export interface MarketEntity { label: string; value: string; href: string; explorerLabel?: string; }
export function marketEntities(ticker: string): MarketEntity[] {
  const outcome = outcomeFor(ticker);
  const entity = (label: string, value: string): MarketEntity => ({ label, value, href: chainAddressUrl(value) });
  return [
    entity('Market contract', market.id),
    ...(outcome ? [entity(`${ticker} outcome token`, outcome.token)] : []),
    entity('Collateral · sDAI', market.collateralToken),
    entity('Factory', market.factory),
    // bytes32 entities are not addresses. The creation transaction records their values.
    { label: 'Condition', value: market.conditionId, href: `https://gnosisscan.io/tx/${market.transactionHash}#eventlog`, explorerLabel: 'View creation event' },
    { label: 'Market question', value: market.questionId, href: `https://gnosisscan.io/tx/${market.transactionHash}#eventlog`, explorerLabel: 'View creation event' },
    { label: 'Parent collection', value: market.parentCollectionId, href: `https://gnosisscan.io/address/${market.id}#readContract`, explorerLabel: 'Read market contract' },
    ...market.questions.map((question, index) => ({ label: `Oracle question ${index + 1}`, value: question.id, href: `https://gnosisscan.io/tx/${market.transactionHash}#eventlog`, explorerLabel: 'View question creation event' })),
    ...market.questions.map((question, index) => entity(`Kleros arbitrator ${index + 1}`, question.arbitrator)),
    entity('Creator', market.creator),
    { label: 'Creation transaction', value: market.transactionHash, href: `https://gnosisscan.io/tx/${market.transactionHash}` },
  ];
}
