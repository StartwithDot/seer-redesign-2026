import outcomes from './tradeOutcomes.json';
import { addressResult, addressWord, call, hexResult, selectors, uintResult, uintWord } from './contractRpc';
import { formatTokenAmount } from './redemption';
import { loadTradeSdk, type AmmTrade, type TradeToken } from './tradeSdk';
import type { WalletProvider } from './wallet';
import type { WalletTransaction } from './transactions';
import type { TradeMode } from './trade';
import { sdaiAddress } from './wallet';

export const tradeOutcomeById = new Map(outcomes.map(outcome => [outcome.id, outcome]));
export type TradeOutcome = typeof outcomes[number];
export interface LiveTradeQuote {
  outcome: TradeOutcome; mode: TradeMode; account: string; amount: bigint;
  receive: bigint; minimum: bigint; balance: bigint; allowance: bigint;
  inputDecimals: number; outputDecimals: number; quotedAt: number;
  router: string; execution: WalletTransaction; trade: AmmTrade;
  priceImpactPercent: number | null; referenceAmount: bigint | null; priceImpactNote: string;
}
export function parseTradeAmount(value: string, decimals = 18) {
  if (!/^\d+(?:\.\d+)?$/.test(value) || value.length > 80) throw new Error('Enter a positive decimal amount.');
  const [whole, fraction = ''] = value.split('.');
  if (fraction.length > decimals) throw new Error(`Use at most ${decimals} decimal places.`);
  const amount = BigInt(whole) * 10n ** BigInt(decimals) + BigInt(fraction.padEnd(decimals, '0') || '0');
  if (amount <= 0n || amount >= 2n ** 256n) throw new Error('Amount is outside the supported range.');
  return amount;
}
export function addTradeAmount(value: string, increment: number) {
  let current = 0n;
  if (value.trim() && !/^0+(?:\.0+)?$/.test(value)) current = parseTradeAmount(value);
  const next = current + BigInt(increment) * 10n ** 18n;
  if (next >= 2n ** 256n) throw new Error('Amount is outside the supported range.');
  return formatTokenAmount(next);
}
export function quotePriceImpact(amount: bigint, receive: bigint, referenceAmount: bigint, referenceReceive: bigint) {
  if (amount <= 0n || receive <= 0n || referenceAmount <= 0n || referenceAmount >= amount || referenceReceive <= 0n) return null;
  const baseline = amount * referenceReceive;
  // Compare output per input using integer arithmetic before formatting a percent.
  return Number((baseline - receive * referenceAmount) * 1_000_000n / baseline) / 10_000;
}
export async function verifyTradeOutcome(provider: WalletProvider, outcome: TradeOutcome, block = 'latest') {
  const [condition, wrapped, ctf] = await Promise.all([
    call(provider, outcome.contract, selectors.condition, '', block),
    call(provider, outcome.contract, selectors.wrapped, uintWord(outcome.index), block),
    call(provider, outcome.contract, selectors.conditionalTokens, '', block),
  ]);
  if (hexResult(condition) !== outcome.condition.toLowerCase() || addressResult(wrapped) !== outcome.token.toLowerCase()) {
    throw new Error('Outcome contract does not match the audited record.');
  }
  const denominator = uintResult(await call(provider, addressResult(ctf), selectors.denominator, outcome.condition.slice(2), block));
  if (denominator > 0n) throw new Error('This outcome is finalized. Use the payout view.');
}
export async function readTradeHolding(provider: WalletProvider, account: string, outcome: TradeOutcome, mode: TradeMode) {
  await verifyTradeOutcome(provider, outcome);
  const token = mode === 'buy' ? sdaiAddress : outcome.token;
  const [balance, decimals] = await Promise.all([
    call(provider, token, selectors.balance, addressWord(account)), call(provider, token, selectors.decimals),
  ]);
  const precision = Number(uintResult(decimals));
  if (precision !== 18) throw new Error('Unexpected token precision. Trading is unavailable for this token.');
  return { balance: uintResult(balance), decimals: precision };
}
export async function fetchLiveTradeQuote(provider: WalletProvider, account: string, outcome: TradeOutcome,
  mode: TradeMode, amountText: string, slippage: string, loader = loadTradeSdk): Promise<LiveTradeQuote> {
  addressWord(account);
  const bps = Number(slippage) * 100;
  if (!Number.isInteger(bps) || bps < 10 || bps > 500) throw new Error('Slippage must be between 0.1% and 5%.');
  const holding = await readTradeHolding(provider, account, outcome, mode);
  const amount = parseTradeAmount(amountText, holding.decimals);
  if (holding.balance < amount) throw new Error(mode === 'buy' ? 'Insufficient collateral balance.' : 'Insufficient outcome shares.');
  const { seer, viem } = await loader();
  const client = viem.createPublicClient({ transport: viem.custom(provider), chain: {
    id: 100, name: 'Gnosis', nativeCurrency: { name: 'xDAI', symbol: 'xDAI', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.gnosischain.com'] } },
  } });
  const token = (address: string, symbol: string): TradeToken => ({ address, symbol, chainId: 100, decimals: 18 });
  const { trade } = await seer.fetchAmmQuote(client, seer.TradeType.EXACT_INPUT, 100, account,
    formatTokenAmount(amount), token(outcome.token, outcome.title), token(sdaiAddress, 'sDAI'), mode, slippage);
  const quotedAt = Date.now();
  const populated = await trade.swapTransaction({ recipient: account });
  const input = mode === 'buy' ? sdaiAddress : outcome.token;
  const output = mode === 'buy' ? outcome.token : sdaiAddress;
  const minimum = trade.minimumAmountOut();
  addressWord(trade.approveAddress); addressWord(populated.to);
  if (trade.chainId !== 100 || trade.amountIn !== amount || trade.amountOut <= 0n || minimum <= 0n ||
    minimum !== trade.amountOut * BigInt(10_000 - bps) / 10_000n ||
    trade.tokenIn.address.toLowerCase() !== input.toLowerCase() || trade.tokenOut.address.toLowerCase() !== output.toLowerCase() ||
    populated.to.toLowerCase() !== trade.approveAddress.toLowerCase() || BigInt(populated.value) !== 0n ||
    !/^0x(?:[a-f0-9]{2}){4,}$/i.test(populated.data)) throw new Error('Live route does not match this order.');
  const allowance = uintResult(await call(provider, input, selectors.allowance, addressWord(account) + addressWord(trade.approveAddress)));
  let priceImpactPercent: number | null = null;
  let referenceAmount: bigint | null = null;
  let priceImpactNote = 'A smaller live reference quote is unavailable. Refresh to retry.';
  const referenceSize = amount / 100n;
  if (referenceSize > 0n && referenceSize < amount) {
    try {
      const { trade: reference } = await seer.fetchAmmQuote(client, seer.TradeType.EXACT_INPUT, 100, account,
        formatTokenAmount(referenceSize), token(outcome.token, outcome.title), token(sdaiAddress, 'sDAI'), mode, slippage);
      if (reference.chainId !== 100 || reference.amountIn !== referenceSize || reference.amountOut <= 0n ||
        reference.approveAddress.toLowerCase() !== trade.approveAddress.toLowerCase() ||
        reference.tokenIn.address.toLowerCase() !== input.toLowerCase() || reference.tokenOut.address.toLowerCase() !== output.toLowerCase()) {
        throw new Error('Reference route differs.');
      }
      priceImpactPercent = quotePriceImpact(amount, trade.amountOut, referenceSize, reference.amountOut);
      referenceAmount = referenceSize;
      priceImpactNote = 'Estimated change in output per input versus a fresh quote at 1% of this order, using the same tokens and router. Includes route fees; a negative value means better execution.';
    } catch { /* The full executable quote remains usable when the small quote has no route. */ }
  }
  return { outcome, mode, account, amount, receive: trade.amountOut, minimum, balance: holding.balance, allowance,
    inputDecimals: 18, outputDecimals: 18, quotedAt, router: trade.approveAddress, trade,
    priceImpactPercent, referenceAmount, priceImpactNote,
    execution: { to: populated.to, data: populated.data, label: `${mode === 'buy' ? 'Buy' : 'Sell'} ${outcome.title}` } };
}
export function liveQuoteGuard(quote: LiveTradeQuote, account: string | null, now = Date.now()) {
  if (!account || account.toLowerCase() !== quote.account.toLowerCase()) return 'Wallet changed. Request a fresh quote.';
  if (now - quote.quotedAt >= 30_000 || now < quote.quotedAt) return 'Quote expired. Refresh and review again.';
  return null;
}
export async function prepareLiveTrade(provider: WalletProvider, quote: LiveTradeQuote, account: string | null) {
  const guard = liveQuoteGuard(quote, account);
  if (guard) throw new Error(guard);
  const fresh = await readTradeHolding(provider, quote.account, quote.outcome, quote.mode);
  if (fresh.balance < quote.amount) throw new Error('Balance changed. Refresh the order.');
  const input = quote.mode === 'buy' ? sdaiAddress : quote.outcome.token;
  const allowance = uintResult(await call(provider, input, selectors.allowance, addressWord(quote.account) + addressWord(quote.router)));
  const expired = liveQuoteGuard(quote, account);
  if (expired) throw new Error(expired);
  // Approval is exact and separate. The user reviews a new quote after its receipt.
  return allowance < quote.amount ? {
    to: input, data: `0x${selectors.approve}${addressWord(quote.router)}${uintWord(quote.amount)}`,
    label: `Approve ${quote.mode === 'buy' ? 'sDAI' : quote.outcome.title}`,
  } : quote.execution;
}
