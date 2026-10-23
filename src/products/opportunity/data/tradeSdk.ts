// Official Seer AMM adapter, loaded only when requesting a live quote.
// API: seer-pm/demo/packages/seer-pm-sdk/src/{amm-trade,quote}.ts.
export interface TradeToken { address: string; chainId: number; symbol: string; decimals: number }
export interface AmmTrade {
  approveAddress: string; chainId: number; amountIn: bigint; amountOut: bigint;
  tokenIn: TradeToken; tokenOut: TradeToken;
  minimumAmountOut(): bigint;
  swapTransaction(options: { recipient: string }): Promise<{ to: string; data: string; value: bigint | string }>;
}
interface SeerSdk {
  TradeType: { EXACT_INPUT: number };
  fetchAmmQuote(client: unknown, type: number, chain: number, account: string,
    amount: string, outcome: TradeToken, collateral: TradeToken, mode: 'buy' | 'sell', slippage: string): Promise<{ trade: AmmTrade }>;
}
interface ViemSdk {
  custom(provider: { request(args: { method: string; params?: unknown[] }): Promise<unknown> }): unknown;
  createPublicClient(args: { transport: unknown; chain: { id: number; name: string; nativeCurrency: { name: string; symbol: string; decimals: number }; rpcUrls: { default: { http: string[] } } } }): unknown;
}
let loading: Promise<{ seer: SeerSdk; viem: ViemSdk }> | null = null;
export function loadTradeSdk() {
  if (!loading) {
    const seerUrl = 'https://esm.sh/@seer-pm/sdk@0.0.20?bundle&deps=viem@2.38.3';
    const viemUrl = 'https://esm.sh/viem@2.38.3';
    loading = Promise.all([import(/* @vite-ignore */ seerUrl), import(/* @vite-ignore */ viemUrl)])
      .then(([seer, viem]) => {
        if (typeof seer.fetchAmmQuote !== 'function' || typeof viem.createPublicClient !== 'function' || typeof viem.custom !== 'function') {
          throw new Error('Trading library unavailable. Retry the quote.');
        }
        return { seer: seer as SeerSdk, viem: viem as ViemSdk };
      }).catch(() => { loading = null; throw new Error('Could not load live trading. Check your connection and retry.'); });
  }
  return loading;
}
