import type { WalletProvider } from '../state/wallet';
import type { Repository } from './types';
import type { MarketHolding } from './trading';
import { parseChainId } from './wallet-connection';

export type PortfolioSnapshot = {
  holdings: MarketHolding[];
  block: number;
  checkedTokens: number;
  totalTokens: number;
  failures: string[];
};

const addressPattern = /^0x[0-9a-f]{40}$/i;
const wordPattern = /^0x[0-9a-f]{64}$/i;

async function request(provider: WalletProvider, method: string, params: unknown[], signal: AbortSignal) {
  signal.throwIfAborted();
  let timer: ReturnType<typeof setTimeout> | undefined;
  let cleanup = () => {};
  const cancelled = new Promise<never>((_, reject) => {
    const abort = () => reject(new DOMException('Read cancelled', 'AbortError'));
    signal.addEventListener('abort', abort, { once: true });
    timer = setTimeout(() => reject(new Error('Token read timed out.')), 12_000);
    cleanup = () => signal.removeEventListener('abort', abort);
  });
  try { return await Promise.race([provider.request({ method, params }), cancelled]); }
  finally { clearTimeout(timer); cleanup(); }
}

export async function readPortfolio(provider: WalletProvider, address: string, repositories: Repository[],
  signal: AbortSignal, onProgress: (checked: number, total: number) => void = () => {}): Promise<PortfolioSnapshot> {
  if (!addressPattern.test(address)) throw new Error('Invalid account address.');
  if (parseChainId(await request(provider, 'eth_chainId', [], signal)) !== 10) {
    throw new Error('Switch to Optimism to read market holdings.');
  }
  const block = await request(provider, 'eth_blockNumber', [], signal);
  if (typeof block !== 'string' || !/^0x[0-9a-f]+$/i.test(block)) throw new Error('Invalid Optimism block response.');
  const blockNumber = Number.parseInt(block, 16);
  if (!Number.isSafeInteger(blockNumber)) throw new Error('Optimism block number is too large to display.');
  const tokens = repositories.flatMap(repository => repository.chart.series
    .filter(series => series.outcomeName === 'UP' || series.outcomeName === 'DOWN')
    .map(series => ({ repository, series })));
  const holdings = new Map<string, MarketHolding>();
  const failures: string[] = [];
  let next = 0;
  let checked = 0;
  let succeeded = 0;
  const worker = async () => {
    while (next < tokens.length) {
      signal.throwIfAborted();
      const { repository, series } = tokens[next++];
      const token = series.outcomeId;
      try {
        if (!addressPattern.test(token)) throw new Error('Invalid recorded outcome-token address.');
        const raw = await request(provider, 'eth_call', [{ to: token, data: `0x70a08231${address.slice(2).padStart(64, '0')}` }, block], signal);
        if (typeof raw !== 'string' || !wordPattern.test(raw)) throw new Error('Invalid token balance response.');
        const balance = BigInt(raw);
        let amount = 0;
        if (balance > 0n) {
          const rawDecimals = await request(provider, 'eth_call', [{ to: token, data: '0x313ce567' }, block], signal);
          if (typeof rawDecimals !== 'string' || !wordPattern.test(rawDecimals)) throw new Error('Invalid token decimals response.');
          const decimals = Number(BigInt(rawDecimals));
          if (!Number.isInteger(decimals) || decimals < 0 || decimals > 36) throw new Error('Unsupported token precision.');
          const scale = 10n ** BigInt(decimals);
          amount = Number(balance / scale) + Number(balance % scale) / Number(scale);
          if (!Number.isFinite(amount)) throw new Error('Token balance is too large to display.');
        }
        const holding = holdings.get(repository.marketId) ?? { marketId: repository.marketId, up: NaN, down: NaN, value: NaN };
        holding[series.outcomeName === 'UP' ? 'up' : 'down'] = amount;
        holdings.set(repository.marketId, holding);
        succeeded++;
      } catch (error) {
        signal.throwIfAborted();
        failures.push(`${repository.owner}/${repository.name} ${series.outcomeName}: ${error instanceof Error ? error.message : 'Read failed.'}`);
      }
      onProgress(++checked, tokens.length);
    }
  };
  await Promise.all(Array.from({ length: Math.min(6, tokens.length) }, worker));
  signal.throwIfAborted();
  if (parseChainId(await request(provider, 'eth_chainId', [], signal)) !== 10) {
    throw new Error('The wallet network changed during the holdings read. Switch to Optimism and retry.');
  }
  if (tokens.length && !succeeded) throw new Error('No outcome-token balance could be read. Check the RPC connection and retry.');
  return { holdings: Array.from(holdings.values()), block: blockNumber, checkedTokens: succeeded,
    totalTokens: tokens.length, failures };
}
