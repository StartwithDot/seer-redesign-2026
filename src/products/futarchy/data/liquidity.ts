import type { Market, Organization } from './types';

export type LiquidityPoolCategory = 'conditional' | 'prediction' | 'company';

export interface LiquidityPool {
  id: string;
  category: LiquidityPoolCategory;
  label: string;
  yesPair: string;
  noPair: string;
  swaprUrl: string;
  route: string;
  liquidity: number;
}

export interface LiquidityQuote {
  usdsAmount: number;
  wethAmount: number;
  share: number;
  yesUnits: number;
  noUnits: number;
  priceRange: [number, number];
  valid: boolean;
  errors: string[];
}

export function getLiquidityPools(market: Market, organization: Organization): LiquidityPool[] {
  const base = organization.liquidityUrl.replace(/\/$/, '');
  return [
    {
      id: `${market.id}-conditional`,
      category: 'conditional',
      label: 'Conditional market pair',
      yesPair: `YES / ${market.collateral}`,
      noPair: `NO / ${market.collateral}`,
      swaprUrl: `https://swapr.eth.limo/#/pools?chainId=${market.chainId}&market=${market.id}`,
      route: `/flm/${organization.id}`,
      liquidity: market.tvl,
    },
    {
      id: `${market.id}-prediction`,
      category: 'prediction',
      label: 'Prediction signal pair',
      yesPair: `YES / WETH`,
      noPair: 'NO / WETH',
      swaprUrl: `https://swapr.eth.limo/#/pools?chainId=${market.chainId}&market=${market.id}-prediction`,
      route: `/flm/${organization.id}`,
      liquidity: market.tvl * 0.42,
    },
    {
      id: `${market.id}-company`,
      category: 'company',
      label: 'Company token pair',
      yesPair: `YES / ${market.token}`,
      noPair: `NO / ${market.token}`,
      swaprUrl: `https://swapr.eth.limo/#/pools?chainId=${market.chainId}&market=${market.id}-company`,
      route: `/flm/${organization.id}`,
      liquidity: market.tvl * 0.28,
    },
  ];
}

export function quoteLiquidity(usdsAmount: number, wethAmount: number, market: Market): LiquidityQuote {
  const errors: string[] = [];
  const usds = Number.isFinite(usdsAmount) ? Math.max(0, usdsAmount) : 0;
  const weth = Number.isFinite(wethAmount) ? Math.max(0, wethAmount) : 0;
  if (usds <= 0) errors.push('Enter a USDS amount.');
  if (weth <= 0) errors.push('Enter a WETH amount.');
  if (usds > 250_000) errors.push('USDS amount must be 250,000 or less.');
  if (weth > 250) errors.push('WETH amount must be 250 or less.');
  const ratio = weth > 0 ? usds / weth : 0;
  if (weth > 0 && (ratio < 2500 || ratio > 4000)) errors.push('Keep the pair near the current USDS/WETH pool ratio.');
  return {
    usdsAmount: usds,
    wethAmount: weth,
    share: Math.min(9.99, (usds + weth * 3200) / Math.max(market.tvl, 1) * 100),
    yesUnits: usds / Math.max(market.yesPrice, 0.01),
    noUnits: usds / Math.max(market.noPrice, 0.01),
    priceRange: [market.yesPrice * 0.92, market.yesPrice * 1.08],
    valid: errors.length === 0,
    errors,
  };
}
