import type { Chain, Market } from '../types';

export const externalLinks = {
  liveApp: 'https://app.seer.pm/',
  docs: 'https://docs.seer.pm/',
  leaderboardDocs: 'https://docs.seer.pm/developers/api#trader-score',
  kleros: 'https://court.kleros.io/',
  klerosCuration: 'https://curation.kleros.io/',
  reality: 'https://reality.eth.limo/',
  swapr: 'https://v3.swapr.eth.limo/',
  bridge: 'https://bridge.gnosischain.com/',
  farming: 'https://app.seer.pm/',
  gnosis: 'https://gnosisscan.io',
} as const;

const explorerHosts: Record<Chain['key'], string> = {
  ethereum: 'https://etherscan.io',
  optimism: 'https://optimistic.etherscan.io',
  gnosis: 'https://gnosisscan.io',
  base: 'https://basescan.org',
};

export function getChainExplorer(chain: Chain) {
  return explorerHosts[chain.key];
}

export function getAddressExplorer(chain: Chain, address: string) {
  return `${getChainExplorer(chain)}/address/${address}`;
}

export function getMarketExplorer(chain: Chain, marketId: string) {
  return `${getChainExplorer(chain)}/search?f=0&q=${encodeURIComponent(marketId)}`;
}

export function getTransactionExplorer(chain: Chain, transaction: string) {
  return `${getChainExplorer(chain)}/tx/${transaction}`;
}

export function getLiveMarketUrl(market: Pick<Market, 'chainId' | 'slug'>) {
  return `${externalLinks.liveApp}markets/${market.chainId}/${encodeURIComponent(market.slug)}`;
}

// These Gnosis deployments and URL formats are recorded in the source app's links.ts.
export function getRealityUrl(market: Market, questionId = market.oracle.questions?.[0]?.id) {
  return market.chainId === 100 && /^0x[\da-f]{64}$/i.test(questionId ?? '')
    ? `https://reality.eth.limo/app/#!/network/100/question/0xE78996A233895bE74a66F451f1019cA9734205cc-${questionId}`
    : externalLinks.reality;
}

export function getVerificationUrl(market: Market) {
  if (market.chainId !== 100) return externalLinks.klerosCuration;
  return `https://curate.kleros.io/tcr/100/0x5aAF9E23A11440F8C1Ad6D2E2e5109C7e52CC672${market.verificationItemId ? `/${encodeURIComponent(market.verificationItemId)}` : ''}`;
}

export function getLiquidityUrl(market: Market, outcomeId: string) {
  const token = market.outcomes.find((outcome) => outcome.id === outcomeId)?.wrappedToken;
  const collateral = market.collateralAddress;
  if (market.chainId !== 100 || !/^0x[\da-f]{40}$/i.test(token ?? '') || !/^0x[\da-f]{40}$/i.test(collateral ?? '')) return getLiveMarketUrl(market);
  return `${externalLinks.swapr}#/add/${[token!, collateral!].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).join('/')}/enter-amounts`;
}
