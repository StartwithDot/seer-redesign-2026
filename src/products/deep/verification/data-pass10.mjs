import { build } from 'esbuild';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

async function compile(relative, globals = {}) {
  const result = await build({ entryPoints: [new URL(relative, import.meta.url).pathname], bundle: true, write: false, format: 'cjs' });
  const module = { exports: {} };
  vm.runInNewContext(result.outputFiles[0].text, { module, exports: module.exports, URL, AbortController, DOMException,
    setTimeout, clearTimeout, ...globals });
  return module.exports;
}
const { readPortfolio } = await compile('../data/portfolio.ts');
const { readWalletBalances, optimismAssets } = await compile('../data/wallet-balances.ts');
const workspace = await compile('../data/workspace.ts');
const word = value => `0x${BigInt(value).toString(16).padStart(64, '0')}`;
const address = `0x${'1'.repeat(40)}`;
const up = `0x${'2'.repeat(40)}`;
const down = `0x${'3'.repeat(40)}`;
const repository = { marketId: 'market', owner: 'ethereum', name: 'repo', chart: { series: [
  { outcomeName: 'UP', outcomeId: up }, { outcomeName: 'DOWN', outcomeId: down },
  { outcomeName: 'Invalid result', outcomeId: `0x${'4'.repeat(40)}` },
] } };
const calls = [];
let chainReads = 0;
let failure = false;
let allFail = false;
let switchChain = false;
const provider = { request: async ({ method, params }) => {
  calls.push({ method, params });
  if (method === 'eth_chainId') return ++chainReads > 1 && switchChain ? '0x1' : '0xa';
  if (method === 'eth_blockNumber') return '0x100';
  assert.equal(method, 'eth_call', 'Only read-only RPC methods may be used');
  assert.equal(params[1], '0x100', 'Every balance must use the same block');
  if (allFail || failure && params[0].to === down) throw new Error('RPC unavailable');
  if (params[0].data === '0x313ce567') return word(6);
  assert.equal(params[0].data, `0x70a08231${address.slice(2).padStart(64, '0')}`);
  return word(params[0].to === down ? 0 : 1234567);
} };
const progress = [];
let snapshot = await readPortfolio(provider, address, [repository], new AbortController().signal, (...value) => progress.push(value));
assert.equal(snapshot.holdings[0].up, 1.234567);
assert.equal(snapshot.holdings[0].down, 0);
assert.equal(Number.isNaN(snapshot.holdings[0].value), true, 'No fabricated liquidation value');
assert.equal(snapshot.checkedTokens, 2);
assert.equal(snapshot.totalTokens, 2);
assert.equal(snapshot.block, 256);
assert.equal(progress.at(-1)[0], 2);
assert.equal(calls.filter(call => call.params?.[0]?.data === '0x313ce567').length, 1, 'Only nonzero tokens need precision');
failure = true;
snapshot = await readPortfolio(provider, address, [repository], new AbortController().signal);
assert.equal(Number.isNaN(snapshot.holdings[0].down), true, 'Failed reads are unavailable, never zero');
assert.equal(snapshot.failures.length, 1);
allFail = true;
await assert.rejects(readPortfolio(provider, address, [repository], new AbortController().signal), /No outcome-token balance/);
allFail = false; failure = false; switchChain = true; chainReads = 0;
await assert.rejects(readPortfolio(provider, address, [repository], new AbortController().signal), /network changed/);
await assert.rejects(readPortfolio(provider, 'invalid', [repository], new AbortController().signal), /Invalid account/);
const cancelled = new AbortController(); cancelled.abort();
await assert.rejects(readPortfolio(provider, address, [repository], cancelled.signal), /abort/i);
const tokenProvider = { request: async ({ method, params }) => {
  if (method === 'eth_chainId') return '0xa';
  if (method === 'eth_blockNumber') return '0x200';
  assert.equal(method, 'eth_call'); assert.equal(params[1], '0x200');
  if (params[0].to === optimismAssets.USDS.address) throw new Error('Failed USDS');
  return word(params[0].to === optimismAssets.USDC.address ? 2500000 : 1500000000000000000n);
} };
const balances = await readWalletBalances(tokenProvider, address);
assert.equal(balances.USDC, 2.5); assert.equal(balances.sUSDS, 1.5); assert.ok(Number.isNaN(balances.USDS));
assert.equal(workspace.mobileWorkspace('unknown'), 'chart');
assert.equal(workspace.deskWorkspace('funds'), 'funds');
assert.equal(workspace.mobileWorkspaceHref('desk', '/deep?view=swarm&q=ethereum', 'https://deep.test'), '/deep?view=swarm&q=ethereum&workspace=desk');
assert.equal(workspace.mobileWorkspaceHref('list', '/deep/leaderboard?view=map', 'https://deep.test'), '/deep?workspace=list');
const html = { dataset: {}, style: {} };
const theme = await compile('../state/theme.ts', { window: { localStorage: { getItem: () => { throw Error('Blocked'); }, setItem: () => { throw Error('Blocked'); } } }, document: { documentElement: html } });
assert.equal(theme.readStoredTheme(), 'dark'); theme.persistTheme('dark');
assert.equal(theme.readStoredTheme(), 'dark'); assert.equal(html.dataset.theme, 'dark');
assert.equal(theme.syncStoredTheme('light'), 'light'); assert.equal(theme.syncStoredTheme('invalid'), null);

function luminance(hex) {
  const rgb = hex.match(/\w\w/g).map(x => parseInt(x, 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
const css = await fs.readFile(new URL('../deep-pass10.css', import.meta.url), 'utf8');
const themes = css.match(/\.deep-app \{([\s\S]*?)\}/g).slice(0, 2);
let contrastChecks = 0;
for (const theme of themes) {
  const tokens = Object.fromEntries([...theme.matchAll(/(--[\w-]+): (#[\da-f]{6});/g)].map(match => [match[1], match[2]]));
  for (const foreground of ['--ef-text-primary', '--ef-text-secondary', '--ef-text-muted', '--ef-sem-positive', '--ef-sem-warning', '--ef-sem-danger', '--ef-secondary-text']) {
    for (const background of ['--ef-bg-page', '--ef-bg-card', '--ef-bg-nested', '--ef-secondary-bg']) {
      const values = [luminance(tokens[foreground]), luminance(tokens[background])].sort((a, b) => a - b);
      const ratio = (values[1] + .05) / (values[0] + .05);
      assert.ok(ratio >= 4.5, `${foreground} on ${background}: ${ratio.toFixed(2)}:1`); contrastChecks++;
    }
  }
  const ratio = 1.05 / (luminance(tokens['--ef-primary']) + .05);
  assert.ok(ratio >= 4.5, `White action text: ${ratio}:1`); contrastChecks++;
}
console.log(`Pass 10 data checks passed: read-only holdings, fixed blocks, decimals, zero/partial/error/cancel/network changes, asset balances, workspace links, theme persistence, ${contrastChecks} contrast pairs.`);
