import { protocolRecords } from './protocolSnapshot';
import type { Market } from './types';

export interface ProtocolToken {
  address: string; symbol: string; decimals: number;
  category: 'currency' | 'company'; side: 'base' | 'yes' | 'no';
}
export interface ProtocolRecord {
  chainId: number; snapshotId: string; snapshotUrl?: string; questionId: string;
  liquidityUrl?: string; tokens: ProtocolToken[];
  pools: { address: string; category: 'conditional' | 'prediction' | 'company'; side: 'yes' | 'no'; token0: string; token1: string }[];
  contracts: Record<string, string>;
  windowStart: number | null; windowHours: number | null; windowDescription: string;
}

export const protocolFor = (market: Pick<Market, 'marketAddress'>) => protocolRecords[market.marketAddress.toLowerCase()];
export const chainExplorer = (chainId: number) => chainId === 1 ? 'https://etherscan.io' : 'https://gnosisscan.io';
export const marketUrl = (market: Market) => `https://futarchy.seer.pm/markets/${market.marketAddress}`;

export function canonicalEvidence(market: Market) {
  const protocol = protocolFor(market);
  const space = market.organizationId === 'kleros' ? 'kleros.eth' : `${market.organizationId}.eth`;
  return {
    ...market.evidence,
    realityUrl: protocol?.questionId ? `https://reality.eth.limo/#!/network/${protocol.chainId}/question/${protocol.questionId}` : '',
    snapshotUrl: protocol?.snapshotUrl || (protocol?.snapshotId ? `https://snapshot.box/#/s:${space}/proposal/${protocol.snapshotId}` : ''),
  };
}
