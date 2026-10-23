import { SEER_MARKET_URL } from './entities';
import { ASSET_OBSERVATIONS } from './asset-observations';
import type { AssetRecord, RiskGroup } from './types';

type AssetIdentity = Pick<AssetRecord, 'id' | 'ticker' | 'name' | 'group' | 'note'>;

const identities: AssetIdentity[] = [
  { id: 'weeth', ticker: 'weETH', name: 'Wrapped eETH', group: 'ETH Based', note: 'Restaking exposure with broad secondary liquidity.' },
  { id: 'steth', ticker: 'stETH', name: 'Lido Staked ETH', group: 'ETH Based', note: 'Large liquid-staking market with mature redemption routes.' },
  { id: 'eth-plus', ticker: 'ETH+', name: 'ETHx Yield Index', group: 'ETH Based', note: 'Diversified staking index with wrapper and rebalancing risk.' },
  { id: 'bsdeth', ticker: 'bsdETH', name: 'Base Staked ETH', group: 'ETH Based', note: 'Newer staking wrapper with lower observed market depth.' },
  { id: 'reth', ticker: 'rETH', name: 'Rocket Pool ETH', group: 'ETH Based', note: 'Decentralized node-operator set and established wrapper.' },
  { id: 'pufeth', ticker: 'pufETH', name: 'Puffer Staked ETH', group: 'ETH Based', note: 'Restaking and operator concentration are the primary watch items.' },
  { id: 'aveth', ticker: 'avETH', name: 'Avalon Staked ETH', group: 'ETH Based', note: 'Smaller float and wrapper-specific liquidity risk.' },

  { id: 'pyusd', ticker: 'PYUSD', name: 'PayPal USD', group: 'USD Based', note: 'Regulated issuer with concentrated redemption infrastructure.' },
  { id: 'rlusd', ticker: 'RLUSD', name: 'Ripple USD', group: 'USD Based', note: 'Fiat-backed stablecoin with relatively short operating history.' },
  { id: 'usdc', ticker: 'USDC', name: 'USD Coin', group: 'USD Based', note: 'Deep liquidity and mature issuer disclosures.' },
  { id: 'usd1', ticker: 'USD1', name: 'World Liberty USD', group: 'USD Based', note: 'Younger issuer and evolving redemption disclosures.' },
  { id: 'usds', ticker: 'USDS', name: 'Sky USD', group: 'USD Based', note: 'Protocol-native stablecoin with governance and collateral risk.' },
  { id: 'usdt', ticker: 'USDT', name: 'Tether USD', group: 'USD Based', note: 'Deep market utility with issuer and reserve transparency risk.' },
  { id: 'rusd', ticker: 'RUSD', name: 'Reserve USD', group: 'USD Based', note: 'Smaller active stablecoin with material issuer and liquidity risk.' },
  { id: 'usdf', ticker: 'USDF', name: 'Falcon USD', group: 'USD Based', note: 'Credit-backed design with concentrated counterparty exposure.' },
  { id: 'avusd', ticker: 'avUSD', name: 'Avalon USD', group: 'USD Based', note: 'Yield-bearing wrapper with strategy and redemption dependencies.' },
  { id: 'nusd', ticker: 'NUSD', name: 'Noble USD', group: 'USD Based', note: 'Cross-chain issuance adds bridge and operational dependencies.' },
  { id: 'iusd', ticker: 'iUSD', name: 'Indigo USD', group: 'USD Based', note: 'Synthetic design introduces collateral and peg defense risk.' },
  { id: 'satusd-plus', ticker: 'satUSD+', name: 'Satoshi USD Plus', group: 'USD Based', note: 'Limited market depth and elevated operational complexity.' },
  { id: 'usdo', ticker: 'USDO', name: 'Open Dollar', group: 'USD Based', note: 'Collateral, governance, and liquidity risks remain material.' },

  { id: 'btcb', ticker: 'BTCB', name: 'Binance Wrapped BTC', group: 'BTC Based', note: 'Custodian and bridge dependencies dominate the estimate.' },
  { id: 'solvbtc', ticker: 'solvBTC', name: 'Solv Bitcoin', group: 'BTC Based', note: 'Multi-chain wrappers create custody and redemption complexity.' },
  { id: 'tbtc', ticker: 'tBTC', name: 'Threshold Bitcoin', group: 'BTC Based', note: 'Decentralized custody reduces single-operator exposure.' },
  { id: 'cbbtc', ticker: 'cbBTC', name: 'Coinbase Wrapped BTC', group: 'BTC Based', note: 'Institutional custody with concentrated counterparty exposure.' },
  { id: 'lbtc', ticker: 'LBTC', name: 'Lombard Bitcoin', group: 'BTC Based', note: 'Restaking and validator dependencies affect redemption safety.' },
  { id: 'ubtc', ticker: 'UBTC', name: 'Unit Bitcoin', group: 'BTC Based', note: 'Newer wrapper with smaller liquidity and proof coverage.' },

  { id: 'gaclo-1', ticker: 'GACLO-1', name: 'Gnosis Access Credit', group: 'Funds Based', note: 'Credit performance and transfer restrictions shape liquidity.' },
  { id: 'buidl-i', ticker: 'BUIDL-I', name: 'BlackRock USD Institutional', group: 'Funds Based', note: 'Institutional fund structure with strong issuer controls.' },
  { id: 'jaaa', ticker: 'JAAA', name: 'Janus Henderson AAA CLO', group: 'Funds Based', note: 'High-quality structured credit with fund-level liquidity limits.' },
  { id: 'jtrsy', ticker: 'JTRSY', name: 'Janus Henderson Treasury', group: 'Funds Based', note: 'Treasury exposure with operational wrapper dependencies.' },
  { id: 'mf-one', ticker: 'mF-ONE', name: 'Matrixdock Fund One', group: 'Funds Based', note: 'Fund administration and secondary-market depth remain key.' },
  { id: 'stac', ticker: 'STAC', name: 'STAC Credit Fund', group: 'Funds Based', note: 'Private-credit performance and redemption terms drive risk.' },
  { id: 'u', ticker: 'U', name: 'Superstate Fund', group: 'Funds Based', note: 'Regulated fund wrapper with transfer and venue constraints.' },
];

const observations = new Map(ASSET_OBSERVATIONS.map((observation) => [observation.ticker, observation]));

export const RISK_ASSETS: AssetRecord[] = identities.map((identity) => {
  const observation = observations.get(identity.ticker);
  if (!observation) throw new Error(`Missing Credora observation for ${identity.ticker}`);
  return {
    ...identity,
    category: observation.category,
    grade: observation.grade,
    pdAnn: observation.pdAnn,
    marketPd: observation.marketPd,
    consensusPd: observation.consensusPd,
    avg: observation.avg,
    scores: observation.scores,
    marketUrl: SEER_MARKET_URL,
  };
});

export const ASSET_GROUPS: RiskGroup[] = ['ETH Based', 'USD Based', 'BTC Based', 'Funds Based'];
