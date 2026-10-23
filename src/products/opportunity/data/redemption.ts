import tokens from './archiveTokens.json';
import { archiveEvidenceFor } from './archive';
import { addressResult, addressWord, call, gnosisRouter, hexResult, selectors, uintResult, uintWord } from './contractRpc';
import type { WalletProvider } from './wallet';

export interface RedeemPosition {
  marketId: string; contract: string; collateral: string; condition: string;
  index: number; title: string; token: string; balance: bigint | null;
  numerator: bigint; denominator: bigint; allowance: bigint | null;
  payout: bigint | null; block: string; error: string | null;
}
export async function readRedeemPositions(provider: WalletProvider, account: string, marketId: string): Promise<RedeemPosition[]> {
  addressWord(account);
  const evidence = archiveEvidenceFor(marketId);
  const record = tokens.find(token => token.id === evidence?.id);
  if (!evidence || !record) throw new Error('This market has no verified settlement contract.');
  const block = await provider.request({ method: 'eth_blockNumber' });
  if (typeof block !== 'string' || !/^0x[0-9a-f]+$/i.test(block)) throw new Error('Block number unavailable.');
  const [ctf, condition, parent] = await Promise.all([
    call(provider, gnosisRouter, selectors.conditionalTokens, '', block).then(addressResult),
    call(provider, record.id, selectors.condition, '', block).then(hexResult),
    call(provider, record.id, selectors.parent, '', block).then(hexResult),
  ]);
  if (ctf === `0x${'0'.repeat(40)}` || condition !== record.conditionId || parent !== `0x${'0'.repeat(64)}`) {
    throw new Error('Settlement contract differs from captured evidence. Open the source market.');
  }
  const denominator = uintResult(await call(provider, ctf, selectors.denominator, condition.slice(2), block));
  if (denominator === 0n) throw new Error('On-chain settlement is not finalized yet.');
  const result: RedeemPosition[] = [];
  // Limit concurrent RPC calls; each row keeps unknown balances distinct from zero.
  for (let start = 0; start < record.wrappedTokens.length; start += 3) {
    result.push(...await Promise.all(record.wrappedTokens.slice(start, start + 3).map(async (token, offset) => {
      const index = start + offset;
      const base = { marketId, contract: record.id, collateral: record.collateralToken, condition, index,
        title: evidence.outcomes[index].trim(), token, denominator, numerator: 0n, block };
      try {
        const [wrapped, decimals, balance, numerator, allowance] = await Promise.all([
          call(provider, record.id, selectors.wrapped, uintWord(index), block).then(addressResult),
          call(provider, token, selectors.decimals, '', block).then(uintResult),
          call(provider, token, selectors.balance, addressWord(account), block).then(uintResult),
          call(provider, ctf, selectors.numerator, condition.slice(2) + uintWord(index), block).then(uintResult),
          call(provider, token, selectors.allowance, addressWord(account) + addressWord(gnosisRouter), block).then(uintResult),
        ]);
        if (wrapped !== token.toLowerCase() || decimals !== 18n || numerator > denominator) throw new Error('Outcome contract could not be verified.');
        // CTF settlement uses integer floor(balance * numerator / denominator).
        return { ...base, balance, numerator, allowance, payout: balance * numerator / denominator, error: null };
      } catch (error) {
        return { ...base, balance: null, allowance: null, payout: null, error: error instanceof Error ? error.message : 'Outcome read failed.' };
      }
    })));
  }
  return result;
}

export function formatTokenAmount(amount: bigint): string {
  const scale = 10n ** 18n;
  const fraction = (amount % scale).toString().padStart(18, '0').replace(/0+$/, '');
  return `${amount / scale}${fraction ? `.${fraction}` : ''}`;
}
export function redemptionGuard(position: RedeemPosition | null) {
  if (!position || position.balance === null || position.payout === null || position.allowance === null) return 'Reload the position before redeeming.';
  if (position.balance <= 0n) return 'No shares to redeem. Zero holdings do not prove prior redemption.';
  if (position.payout <= 0n) return 'This position has no payable winning shares.';
  return null;
}
