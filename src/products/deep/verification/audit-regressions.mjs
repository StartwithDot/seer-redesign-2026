import { build } from 'esbuild';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

async function compile(file, globals = {}, external = []) {
  const output = await build({ entryPoints: [new URL(file, import.meta.url).pathname], bundle: true,
    write: false, format: 'cjs', external, logLevel: 'silent' });
  const module = { exports: {} };
  vm.runInNewContext(output.outputFiles[0].text, { module, exports: module.exports, URL, AbortSignal,
    AbortController, console, setTimeout, clearTimeout, ...globals });
  return module.exports;
}
const accountAddress = `0x${'1'.repeat(40)}`;
const captured = JSON.parse(await fs.readFile(new URL('../../../../../products/deep/data/get-redeemable.json', import.meta.url)));
let calls = [], response = captured.data, requestError = false;
const account = await compile('../data/account.ts', { fetch: async (url, options) => {
  calls.push({ url, options });
  if (requestError) return { ok: false, status: 503 };
  if (options.signal.aborted) throw new Error('Aborted');
  return { ok: true, json: async () => response };
} });
assert.equal(account.parseWalletAccountResponse(captured.data).checkedAt, new Date(captured.data.checkedAt * 1000).toISOString());
assert.equal(Object.keys((await account.getWalletAccountResponse(accountAddress)).wallets).length, 0);
assert.equal(calls[0].url, `${account.accountEndpoint}?account=${accountAddress}`);
response = { checkedAt: 1792341734, wallets: { [accountAddress]: { unverifiedRecord: 'retained' } }, executors: [{ address: accountAddress }] };
const populated = await account.getWalletAccountResponse(accountAddress);
assert.equal(populated.wallets[accountAddress].unverifiedRecord, 'retained');
assert.equal(populated.executors[0].address, accountAddress);
for (const value of [null, {}, { ...response, wallets: [] }, { ...response, checkedAt: NaN }, { ...response, executors: {} }]) assert.throws(() => account.parseWalletAccountResponse(value));
await assert.rejects(() => account.getWalletAccountResponse('invalid'));
const controller = new AbortController(); controller.abort();
await assert.rejects(() => account.getWalletAccountResponse(accountAddress, controller.signal));
requestError = true; await assert.rejects(() => account.getWalletAccountResponse(accountAddress), /503/);
requestError = false; assert.ok(await account.getWalletAccountResponse(accountAddress));

// Preserve actual below-lens values rather than pinning them to the axis.
const geometry = await compile('../components/TimeFigureGeometry.ts');
const path = geometry.timeLinePath([{ timestamp: 1, price: .545 }, { timestamp: 2, price: .75 }], 1, 2, .55, .95);
assert.ok(Number(path.split(',')[1].split(' ')[0]) > 268);
const { concentration } = await compile('../data/wallet-analysis.ts');
const lossRows = [-10, -5, -1].map(profitLoss => ({ profitLoss }));
assert.equal(concentration(lossRows, false).topShare, 15 / 16);

// Import.meta asset URLs need their production-style base in this isolated VM.
const volumeBuild = await build({ entryPoints: [new URL('../data/market-volume.ts', import.meta.url).pathname], bundle: true,
  write: false, format: 'esm', logLevel: 'silent' });
const volumeSource = volumeBuild.outputFiles[0].text.replaceAll('import.meta.url', '"https://deep.test/data/market-volume.js"').replace(/export \{[\s\S]*?\};?\s*$/, 'globalThis.loadMarketVolumes = loadMarketVolumes;');
const validVolumes = JSON.parse(await fs.readFile(new URL('../data/refresh-market-volume.json', import.meta.url))).data.volumes;
let volumePayload = { data: { volumes: validVolumes } }, status = 200;
const volumeContext = { URL, fetch: async () => ({ ok: status === 200, status, json: async () => volumePayload }) };
vm.createContext(volumeContext); vm.runInContext(volumeSource, volumeContext);
assert.equal(Object.keys(await volumeContext.loadMarketVolumes()).length, Object.keys(validVolumes).length);
status = 503; await assert.rejects(() => volumeContext.loadMarketVolumes(), /503/);
status = 200; volumePayload = {}; await assert.rejects(() => volumeContext.loadMarketVolumes(), /Invalid/);
volumePayload = { data: { volumes: {} } }; await assert.rejects(() => volumeContext.loadMarketVolumes(), /Missing/);
volumePayload = { data: { volumes: validVolumes } }; assert.ok(await volumeContext.loadMarketVolumes());

// Reachability: recursively resolve every local import from the actual Deep entry.
const root = new URL('../', import.meta.url), reachable = new Set();
async function visit(file) {
  if (reachable.has(file)) return; reachable.add(file);
  const source = await fs.readFile(new URL(file, root), 'utf8');
  for (const match of source.matchAll(/(?:from\s*|import\s*\()\s*['"](\.[^'"]+)['"]/g)) {
    const target = new URL(match[1], new URL(file, root));
    for (const suffix of ['.tsx', '.ts', '']) {
      try { await fs.access(`${target.pathname}${suffix}`); await visit(`${target.pathname.slice(root.pathname.length)}${suffix}`); break; }
      catch (error) { if (error.code !== 'ENOENT' && error.code !== 'EISDIR') throw error; }
    }
  }
}
await visit('index.tsx');
for (const file of ['components/ContestTabs.tsx', 'components/AccountStatusDrawer.tsx', 'components/ArchiveHistory.tsx', 'components/ContestArchiveWorkspace.tsx', 'data/market-volume.ts']) assert.ok(reachable.has(file), `${file} reachable`);
console.log('Audit regressions passed: API shape/address/errors/retry/cancellation, real volume requests, below-lens values, top-two loser concentration and new component reachability.');
