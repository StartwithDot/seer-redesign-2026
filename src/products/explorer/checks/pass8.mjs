import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const temporary = await mkdtemp(join(tmpdir(), 'explorer-pass8-'));
const memory = new Map();
globalThis.localStorage = globalThis.sessionStorage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: (key) => memory.delete(key) };
globalThis.document = { documentElement: { dataset: {}, style: {} } };
globalThis.window = { localStorage, location: { hash: '#/markets', search: '' }, matchMedia: () => ({ matches: true }) };
try {
  const output = await build({
    stdin: { contents: `export * from './data/markets'; export * from './data/capturedMarkets'; export * from './data/poolLadder'; export * from './data/wallet'; export * from './data/walletBalances'; export * from './data/walletIdentity'; export * from './data/walletTokens'; export * from './data/semantics'; export * from './data/clock'; export * from './data/trade'; export * from './data/marketService'; export * from './lib/format'; export * from './lib/marketFilters'; export * from './lib/chartExport'; export * from './lib/theme'; export * from './lib/recordQuery'; export * from './lib/creationDraft'; export { parseHash, currentExplorerHash, explorerRouteUrl } from './hooks/useExplorerRoute'; export { matchesIndexKind } from './components/IndexFilterBar'; import React from 'react'; import { renderToStaticMarkup } from 'react-dom/server'; import { Page } from './index'; export const render = () => renderToStaticMarkup(React.createElement(Page));`, resolveDir: root },
    bundle: true, write: false, platform: 'node', format: 'esm', loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.css': 'empty' },
    banner: { js: `import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);` },
  });
  const modulePath = join(temporary, 'check.mjs');
  await writeFile(modulePath, output.outputFiles[0].text);
  const data = await import(pathToFileURL(modulePath).href);
  assert.equal(data.formatPercent(NaN), 'Unavailable');
  assert.equal(data.formatDate('not-a-date'), 'Unavailable');
  assert.equal(data.formatToken(Infinity, 'sDAI'), 'Balance unavailable');
  assert.equal(data.formatCompactMoney(-1234567), '−$1.2M');
  assert.equal(data.formatNumber(1234.56), '1,234.56');
  assert.ok(data.formatUtcTimestamp(data.sampleClock).includes('UTC'));
  const account = data.demoAccounts[0];
  assert.notEqual(data.tokenBalance(account, 100, 'sDAI').value, account.balance);
  assert.equal(data.tokenBalance(account, 8453, 'sDAI'), null);
  assert.equal(data.nativeBalanceOn(account, 10), 0.02);
  assert.equal(data.parseHash('#/markets/100oops/question').name, 'not-found');
  assert.equal(data.parseHash('#/').name, 'markets');
  const filters = { ...data.defaultMarketFilters, types: ['scalar'], verification: ['verifying'], chains: [8453], minLiquidity: 500, direction: 'asc' };
  const query = data.serializeMarketQuery({ search: 'Ethereum', view: 'new', layout: 'table', page: 2, topic: '', filters });
  assert.deepEqual(data.parseMarketFilters(new URLSearchParams(query)), filters);
  assert.equal(data.readChartQuery(new URLSearchParams('range=custom&start=2026-02-30&end=2026-03-02'), '2026-01-01').rangeId, '1m');
  assert.equal(data.clockTimestamp('current', '?explorerClock=2026-10-23T09%3A30%3A00Z', 0), data.sampleClock);
  assert.equal(data.clockTimestamp('snapshot', '', 0), data.sampleClock);
  assert.equal(data.clockTimestamp('current', '', 0), '1970-01-01T00:00:00.000Z');
  const captured = data.markets.filter((market) => market.provenance.origin === 'captured-api');
  assert.equal(captured.length, data.capturedMarkets.length);
  assert.ok(captured.filter((market) => market.parent).length > 0);
  assert.ok(captured.some((market) => market.pool.records.length > 0));
  for (const market of captured) {
    const raw = market.identity.rawRecord;
    assert.equal(market.identity.market, raw.id);
    assert.equal(market.identity.factory, raw.factory);
    assert.equal(market.identity.creationTransaction, raw.transactionHash);
    assert.equal(market.volume, raw.volumeUSD);
    assert.equal(market.openInterest, raw.openInterestUSD);
    const recordedOutcomes = market.outcomes.filter((outcome) => outcome.id !== 'estimate');
    assert.equal(recordedOutcomes.length, raw.outcomes.length);
    assert.equal(market.collateralUsdRate, null);
    assert.ok(Number.isNaN(market.pnl));
    assert.equal(market.provenance.capturedAt, '', 'An unrecorded capture time must not be invented');
    assert.ok(Array.isArray(market.pool.records));
    for (const [index, outcome] of recordedOutcomes.entries()) {
      assert.equal(outcome.wrappedToken, raw.wrappedTokens[index]);
      if (raw.odds[index] === null) assert.ok(Number.isNaN(outcome.chance));
      else assert.equal(outcome.chance, raw.odds[index]);
    }
    for (const pool of market.pool.records) {
      assert.ok(pool.price > 0 && Number.isFinite(pool.price));
      assert.ok(pool.outcomeBalance === null || pool.outcomeBalance >= 0);
      assert.ok(pool.collateralBalance === null || pool.collateralBalance >= 0);
      if (pool.ticks.length) {
        const ladder = data.poolLadder(pool);
        assert.equal(ladder.length, pool.ticks.length - 1);
        assert.equal(ladder.find((row) => row.active).liquidity, pool.liquidity);
        assert.ok(ladder.every((row) => BigInt(row.liquidity) >= 0n));
      }
      assert.ok([pool.token0.address, pool.token1.address].includes(market.collateralAddress));
      assert.ok(market.outcomes.some((outcome) => [pool.token0.address, pool.token1.address].includes(outcome.wrappedToken)));
    }
  }
  const originalFetch = globalThis.fetch;
  const fixture = JSON.parse(await readFile(join(root, 'data/catalog.fixture.json'), 'utf8'));
  try {
    globalThis.fetch = async () => new Response('', { status: 503 });
    await assert.rejects(data.loadMarketSnapshot(), /503/);
    globalThis.fetch = async () => Response.json({ ...fixture, marketIds: ['missing'] });
    await assert.rejects(data.loadMarketSnapshot(), /unavailable record/);
    globalThis.fetch = async () => Response.json({ ...fixture, marketIds: [fixture.marketIds[0], fixture.marketIds[0]] });
    await assert.rejects(data.loadMarketSnapshot(), /duplicate/);
    globalThis.fetch = async () => Response.json(fixture);
    const loaded = await data.loadMarketSnapshot();
    assert.equal(loaded.markets.length, data.markets.length);
    loaded.markets[0].pool.balances[0].shares = -1;
    assert.ok(data.markets[0].pool.balances[0].shares > 0, 'Snapshots must not mutate the catalog');
    const abort = new AbortController(); abort.abort();
    globalThis.fetch = async (_url, { signal }) => { if (signal.aborted) throw new DOMException('Cancelled', 'AbortError'); };
    await assert.rejects(data.loadMarketSnapshot(abort.signal), { name: 'AbortError' });
  } finally { globalThis.fetch = originalFetch; }
  const provider = { request: async ({ method }) => ({ eth_accounts: [account.address], eth_chainId: '0x64', eth_getBalance: '0xde0b6b3a7640000' })[method] };
  const browser = await data.readBrowserAccount(provider);
  assert.equal(browser.account.balance, 1);
  assert.equal(browser.account.tokenBalances[0].symbol, 'xDAI');
  assert.ok(Number.isNaN(data.tokenBalance(browser.account, 100, 'sDAI').value));
  const hexWord = (value) => `0x${BigInt(value).toString(16).padStart(64, '0')}`;
  const erc20 = { request: async ({ params }) => {
    const call = params[0].data;
    if (call === '0x313ce567') return hexWord(18);
    if (call === '0x95d89b41') return `0x${Buffer.from('sDAI').toString('hex').padEnd(64, '0')}`;
    if (call.startsWith('0x70a08231')) return hexWord(25000000000000000000n);
    throw Error('Unexpected call');
  } };
  const collateral = await data.readCollateralBalances(erc20, account.address, 100);
  assert.equal(collateral[0].value, 25);
  const invalidAsset = await data.readCollateralBalances({ request: async () => hexWord(6) }, account.address, 100);
  assert.ok(Number.isNaN(invalidAsset[0].value), 'Metadata mismatch cannot become a collateral balance');
  assert.equal(await data.readReverseName({ request: async () => { throw Error('Unsupported'); } }, account.address, 1), null);
  const name = 'forecast.eth';
  const ens = (matches) => ({ request: async ({ method, params }) => {
    if (method === 'web3_sha3') return hexWord(1);
    const call = params[0].data;
    if (call.startsWith('0x0178b8bf')) return `0x${'9'.repeat(64)}`;
    if (call.startsWith('0x691f3431')) return `${hexWord(32)}${hexWord(name.length).slice(2)}${Buffer.from(name).toString('hex').padEnd(64, '0')}`;
    if (call.startsWith('0x3b3b57de')) return `0x${(matches ? account.address.slice(2) : '8'.repeat(40)).padStart(64, '0')}`;
    throw Error('Unexpected ENS call');
  } });
  assert.equal(await data.readReverseName(ens(true), account.address, 1), name);
  assert.equal(await data.readReverseName(ens(false), account.address, 1), null, 'A reverse name must match its forward owner');
  const noBalance = await data.readBrowserAccount({ request: async (args) => { if (args.method === 'eth_getBalance') throw Error('Offline'); return provider.request(args); } });
  assert.ok(Number.isNaN(noBalance.account.balance), 'Unavailable native balance must not become zero');
  for (const market of data.markets) {
    assert.ok(data.marketStateLabels[market.marketState]);
    assert.ok(data.verificationLabels[market.verification]);
    for (const outcome of market.outcomes.filter((item) => item.id !== 'estimate' && item.price > 0 && item.price <= 1)) {
      const buy = data.estimateTrade(market, outcome, 25, 'Buy');
      const sale = data.estimateTrade(market, outcome, buy.output, 'Sell');
      assert.ok(Number.isFinite(buy.output) && buy.output > 0);
      assert.ok(sale.output <= 25.000001, 'A round trip against the same sample price must not create collateral');
    }
  }
  const csv = data.buildHistoryCsv({ series: [{ id: 'a', name: 'A,"B"' }], points: [{ timestamp: 't', values: { a: 1.25 } }, { timestamp: 'u', values: { a: 2.5 } }] }, 1, 1);
  assert.equal(csv, 'timestamp_utc,"A,""B"""\nu,2.5');
  const creation = { type: 'categorical', question: 'Will the observable event occur?', rule: 'Use the official public source at the stated deadline.', deadline: '2027-01-01T00:00:00Z', outcomes: 'Yes\nNo', unit: '', lower: '', upper: '' };
  const draftClock = Date.parse('2026-10-23T00:00:00Z');
  assert.equal(data.validCreationDraft(creation, draftClock), true);
  assert.equal(data.validCreationDraft({ ...creation, outcomes: 'Yes\nyes' }, draftClock), false);
  assert.equal(data.validCreationDraft({ ...creation, deadline: '2020-01-01' }, draftClock), false);
  assert.equal(data.validCreationDraft({ ...creation, question: 'Too short' }, draftClock), false);
  assert.equal(data.validCreationDraft({ ...creation, type: 'scalar', lower: '0', upper: '100', unit: 'USD' }, draftClock), true);
  assert.equal(data.validCreationDraft({ ...creation, type: 'scalar', lower: '100', upper: '10', unit: 'USD' }, draftClock), false);
  assert.equal(data.validCreationDraft({ ...creation, type: 'scalar', lower: '', upper: '100', unit: 'USD' }, draftClock), false);
  // Native and legacy links resolve to the same captured market, including query state.
  const firstRecord = data.markets[0];
  const nativeUrl = data.explorerRouteUrl(`#/markets/${firstRecord.chainId}/${firstRecord.slug}?range=1w`);
  assert.equal(nativeUrl, `/explorer/market/${encodeURIComponent(firstRecord.id)}?range=1w`);
  window.location.pathname = nativeUrl.split('?')[0];
  window.location.search = '?range=1w';
  window.location.hash = '';
  assert.equal(data.parseHash(data.currentExplorerHash()).slug, firstRecord.slug);
  assert.equal(data.parseHash(data.currentExplorerHash()).query.get('range'), '1w');
  window.location.pathname = '/explorer';
  window.location.search = '';
  for (const market of data.markets) {
    assert.ok(data.matchesIndexKind(market, 'All'));
    if (data.matchesIndexKind(market, 'Binary')) assert.equal((market.settlementKind ?? market.type), 'categorical');
    if (data.matchesIndexKind(market, 'Scalar')) assert.ok(['scalar', 'multi-scalar'].includes(market.settlementKind ?? market.type));
  }
  let renders = 0;
  for (const theme of ['light', 'dark']) {
    data.storeTheme(theme);
    assert.equal(document.documentElement.dataset.theme, theme);
    for (const connected of [false, true]) {
      if (connected) localStorage.setItem('explorer-wallet-state', JSON.stringify({ account, chainId: 100 }));
      else localStorage.removeItem('explorer-wallet-state');
      for (const market of data.markets) {
        window.location.hash = `#/markets/${market.chainId}/${market.slug}?tab=activity&outcome=${market.outcomes.at(-1).id}&range=1w`;
        const html = data.render();
        assert.ok(html.includes('How to read this signal'));
        assert.ok(html.includes('Market information'));
        for (const panel of ['overview', 'activity', 'positions', 'liquidity', 'resolution', 'community']) assert.ok(html.includes(`record-tab-${panel}`));
        assert.ok(html.includes(market.provenance.origin === 'captured-api' ? 'Captured Seer API snapshot' : 'Illustrative market snapshot'));
        const markup = html.replace(/src="data:[^"]+"/g, '');
        assert.ok(!markup.includes('NaN') && !markup.includes('Infinity'), market.id);
        const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
        assert.equal(new Set(ids).size, ids.length, 'Rendered ids must be unique');
        renders++;
      }
      for (const panel of ['overview', 'activity', 'positions', 'liquidity', 'resolution', 'community']) {
        window.location.hash = `#/markets/${firstRecord.chainId}/${firstRecord.slug}?panel=${panel}`;
        const html = data.render();
        assert.ok(html.includes(`id="record-panel-${panel}"`));
        if (panel === 'resolution') assert.ok(html.includes('Source data and exact values'));
        if (panel === 'positions') assert.ok(html.includes('holdings'));
        renders++;
      }
      for (const route of ['#/markets?types=scalar&chains=8453', '#/leaderboard', '#/collections/default', '#/create-market', '#/account?view=account']) {
        window.location.hash = route;
        assert.ok(data.render().includes('explorer-main'));
        renders++;
      }
    }
  }
  const css = await readFile(join(root, 'styles/base.css'), 'utf8');
  const luminance = (hex) => {
    const values = hex.replace('#', '').match(/../g).map((value) => parseInt(value, 16) / 255).map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return values[0] * .2126 + values[1] * .7152 + values[2] * .0722;
  };
  const contrast = (a, b) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  for (const block of css.split('html[data-theme=')[0].split('}').slice(0, 1).concat(css.slice(css.indexOf("html[data-theme='dark']")).split('}').slice(0, 1))) {
    const tokens = Object.fromEntries([...block.matchAll(/--([\w-]+): (#[\da-f]{6});/g)].map((match) => [match[1], match[2]]));
    for (const color of ['ink', 'secondary', 'muted', 'violet-ink', 'green', 'amber', 'red', 'blue', 'teal']) {
      for (const surface of ['paper', 'surface', 'nested']) assert.ok(contrast(tokens[color], tokens[surface]) >= 4.5, `${color} on ${surface} must meet 4.5:1`);
    }
    assert.ok(contrast('#ffffff', tokens.violet) >= 4.5);
  }
  console.log(`Pass 8 checks passed: wallet reads, source failures/retry/cancellation, economics, URL round trips, CSV, deterministic clock, theme contrast and ${renders} route/state renders.`);
} finally { await rm(temporary, { recursive: true, force: true }); }
