import { build } from 'esbuild';
import assert from 'node:assert/strict';
import vm from 'node:vm';

async function compile(relative) {
  const result = await build({ entryPoints: [new URL(relative, import.meta.url).pathname], bundle: true, write: false, format: 'cjs' });
  const module = { exports: {} };
  vm.runInNewContext(result.outputFiles[0].text, { module, exports: module.exports,
    AbortController, DOMException, setTimeout, clearTimeout });
  return module.exports;
}
const { formatAssetBalance } = await compile('../data/asset-format.ts');
assert.equal(formatAssetBalance(0), '0.00');
assert.equal(formatAssetBalance(1e-18), '<0.01');
assert.equal(formatAssetBalance(1e-18, 6), '<0.000001');
assert.equal(formatAssetBalance(0.01), '0.01');
assert.equal(formatAssetBalance(123.45), '123.45');
for (const value of [NaN, Infinity, -1]) assert.equal(formatAssetBalance(value), 'Unavailable');

const { readWalletBalanceSnapshot } = await compile('../data/wallet-balances.ts');
const { readPortfolio } = await compile('../data/portfolio.ts');
const address = `0x${'1'.repeat(40)}`;
const calls = [];
const provider = { request: async ({ method, params }) => {
  calls.push({ method, params });
  if (method === 'eth_chainId') return '0xa';
  if (method === 'eth_blockNumber') return '0x100';
  if (method === 'eth_call') return `0x${'0'.repeat(63)}1`;
  throw new Error(`Unexpected request ${method}`);
} };
const snapshot = await readWalletBalanceSnapshot(provider, address);
assert.equal(snapshot.block, 256);
assert.equal(snapshot.address, address);
assert.ok(Number.isFinite(Date.parse(snapshot.checkedAt)));
assert.equal(snapshot.balances.sUSDS, 1e-18);
assert.equal(snapshot.balances.USDC, 1e-6);
assert.ok(calls.filter(call => call.method === 'eth_call').every(call => call.params[1] === '0x100'));
for (const read of [
  p => readWalletBalanceSnapshot(p, address),
  p => readPortfolio(p, address, [], new AbortController().signal),
]) {
  await assert.rejects(read({ request: async ({ method }) => method === 'eth_chainId' ? '0xa-junk' : '0x100' }), /Optimism/);
  await assert.rejects(read({ request: async ({ method }) => method === 'eth_chainId' ? '0xa' : '0x20000000000000' }), /too large/);
  let chains = 0;
  await assert.rejects(read({ request: async args => args.method === 'eth_chainId'
    ? (++chains === 1 ? '0xa' : '0x1') : provider.request(args) }), /network changed/);
}
console.log('Pass 12 checks passed: dust versus zero/unavailable, block-pinned balance metadata, strict network parsing, safe block numbers and network changes.');
