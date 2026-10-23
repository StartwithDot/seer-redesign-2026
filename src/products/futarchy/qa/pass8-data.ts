import { check } from './assert';
import { createResource } from '../data/resource';
import { loadResearchSnapshot, validateResearchSnapshot } from '../data/research';
import { marketSnapshot } from '../data/marketSnapshot';
import { nativeBalance, validAccount, walletChain, walletRequest } from '../data/walletRpc';
import { walletReadiness } from '../data/walletReadiness';
import { getWalletPortfolio } from '../data/portfolio';
import { readSavedMarkets, savedMarketsKey, writeSavedMarkets } from '../data/savedMarkets';
import { readReceiptRecords, receiptsKey } from '../data/localRecords';
import { readLocalWalletEntities } from '../data/explorer';
import type { WalletState } from '../hooks/useWallet';

export async function checkPass8Data() {
  const requests: { resolve: (value: number) => void; reject: (reason: Error) => void }[] = [];
  const resource = createResource(() => new Promise<number>((resolve, reject) => requests.push({ resolve, reject })), 'Read failed');
  let updates = 0;
  const unsubscribe = resource.subscribe(() => { updates += 1; });
  check.equal(resource.getSnapshot().loading, true);
  const original = resource.reload(), replacement = resource.reload();
  requests[1].resolve(42); await replacement;
  requests[0].resolve(7); await original;
  check.equal(resource.getSnapshot().data, 42);
  check.equal(resource.getSnapshot().loading, false);
  const cancelled = resource.reload(); resource.cancel(); requests[2].resolve(99); await cancelled;
  check.equal(resource.getSnapshot().data, 42);
  const failing = resource.reload(); requests[3].reject(new Error('Provider unavailable')); await failing;
  check.equal(resource.getSnapshot().error, 'Read failed');
  check.equal(resource.getSnapshot().data, null);
  const recovered = resource.reload(); requests[4].resolve(8); await recovered;
  check.equal(resource.getSnapshot().error, null);
  check.equal(resource.getSnapshot().data, 8);
  unsubscribe(); const before = updates;
  const unsubscribed = resource.reload(); requests[5].resolve(9); await unsubscribed;
  check.equal(updates, before);

  check.equal(await loadResearchSnapshot(), marketSnapshot);
  const duplicate = { ...marketSnapshot, markets: [marketSnapshot.markets[0], marketSnapshot.markets[0]] };
  check.throws(() => validateResearchSnapshot(duplicate));
  for (const patch of [{ volume: Number.NaN }, { organizationId: 'missing' }, { closesAt: 'invalid' }, { history: [{ at: 'invalid', yes: 1, no: 2 }] }]) {
    check.throws(() => validateResearchSnapshot({ ...marketSnapshot, markets: [{ ...marketSnapshot.markets[0], ...patch }] }));
  }
  check.equal(validateResearchSnapshot({ markets: [], organizations: [] }).markets.length, 0);
  check.equal(nativeBalance('0x0'), '0.0000');
  check.equal(nativeBalance('0xde0b6b3a7640000'), '1.0000');
  check.equal(nativeBalance('0x1bc16d674ec80000'), '2.0000');
  check.equal(walletChain('0x64'), 100); check.equal(walletChain('0x1'), 1);
  for (const raw of [null, 100, '10', '0x', '0xg', { toString: () => '0x64' }]) {
    check.throws(() => nativeBalance(raw)); check.throws(() => walletChain(raw));
  }
  check.throws(() => walletChain('0x0')); check.throws(() => walletChain('0xffffffffffffffff'));
  const address = `0x${'1'.repeat(40)}`;
  check.ok(validAccount(address)); check.ok(!validAccount('0x1234')); check.ok(!validAccount(1234));
  let observedMethod = '';
  check.equal(await walletRequest({ request: async args => { observedMethod = args.method; return '0x64'; } }, { method: 'eth_chainId' }), '0x64');
  check.equal(observedMethod, 'eth_chainId');
  await check.rejects(() => walletRequest({ request: async () => { throw new Error('RPC unavailable'); } }, { method: 'eth_chainId' }));
  await check.rejects(() => walletRequest({ request: () => new Promise(() => {}) }, { method: 'eth_getBalance' }, 5));
  const ready: WalletState = { status: 'connected', address, chainId: 100, balance: '0.0000' };
  const cases: [WalletState, boolean, string][] = [
    [ready, true, 'ready'], [ready, false, 'offline'], [{ status: 'disconnected' }, true, 'disconnected'],
    [{ status: 'rejected', error: 'User rejected' }, true, 'disconnected'],
    [{ ...ready, status: 'connecting' }, true, 'connecting'], [{ ...ready, status: 'switching' }, true, 'switching'],
    [{ ...ready, rpcLoading: true }, true, 'connecting'], [{ ...ready, error: 'RPC failed' }, true, 'rpc-error'],
    [{ ...ready, chainId: 1 }, true, 'wrong-network'], [{ ...ready, balance: undefined }, true, 'rpc-error'],
  ];
  cases.forEach(([state, online, expected]) => check.equal(walletReadiness(state, online), expected));
  const portfolio = getWalletPortfolio(address, '0.0000', marketSnapshot.markets[0]);
  check.equal(portfolio.assets.find(asset => asset.asset === 'xDAI')?.amount, 0);
  check.equal(portfolio.assets.find(asset => asset.asset === 'xDAI')?.available, false);

  const store = new Map<string, string>();
  const local = { getItem: (key: string) => store.get(key) ?? null, setItem: (key: string, value: string) => { store.set(key, value); } };
  Object.assign(globalThis, { localStorage: local });
  check.equal(readSavedMarkets().error, '');
  writeSavedMarkets(['eip-8363', 'eip-8363', 'gip-152']);
  check.equal(readSavedMarkets().saved.length, 2);
  for (const raw of ['{bad', '{}', '[1]', '[""]']) { store.set(savedMarketsKey, raw); check.ok(readSavedMarkets().error); }
  store.set(savedMarketsKey, '["gip-152"]'); check.equal(readSavedMarkets().error, '');
  store.set(receiptsKey, JSON.stringify([{ address, hash: `0x${'2'.repeat(64)}`, draft: { title: 'Treasury budget' } }]));
  check.equal(readReceiptRecords().receipts.length, 1); check.equal(readLocalWalletEntities().entities.length, 2);
  for (const raw of ['{bad', '{}', '[null]', '[{}]']) { store.set(receiptsKey, raw); check.ok(readReceiptRecords().error); check.equal(readLocalWalletEntities().entities.length, 0); }
  Object.assign(globalThis, { localStorage: { getItem: () => { throw new Error('Storage denied'); }, setItem: () => { throw new Error('Storage denied'); } } });
  check.ok(readSavedMarkets().error); check.ok(readReceiptRecords().error); check.throws(() => writeSavedMarkets(['eip-8363']));
  Object.assign(globalThis, { localStorage: local }); store.clear();
  console.log('Pass 8 data checks passed: request races/cancel/retry, snapshot validation, RPC timeout/malformed responses, zero balance, wallet readiness and storage recovery.');
}
