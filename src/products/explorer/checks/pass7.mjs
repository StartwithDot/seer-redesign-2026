import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const temporary = await mkdtemp(join(tmpdir(), 'explorer-pass7-'));
try {
  const output = await build({ stdin: { contents: `export * from './data/markets'; export * from './data/chartHistory'; export * from './data/creation'; export * from './data/leaderboardQuery'; export * from './data/marketEvidence'; export { loadLeaderboard } from './data/leaderboardService';`, resolveDir: root }, bundle: true, write: false, platform: 'node', format: 'esm', loader: { '.png': 'dataurl', '.jpg': 'dataurl' } });
  const modulePath = join(temporary, 'data.mjs');
  await writeFile(modulePath, output.outputFiles[0].text);
  const data = await import(pathToFileURL(modulePath).href);
  let histories = 0;
  for (const market of data.markets) {
    const ranges = data.getBuiltinRanges();
    const month = data.getMarketHistory(market, ranges[2]);
    const week = data.getMarketHistory(market, ranges[1]);
    const monthByTime = new Map(month.points.map((point) => [point.timestamp, point.values]));
    for (const point of week.points) {
      if (monthByTime.has(point.timestamp)) assert.deepEqual(point.values, monthByTime.get(point.timestamp), 'Overlapping history must keep identical values');
      assert.ok(Date.parse(point.timestamp) <= Date.parse(data.historySampleClock));
      assert.ok(Date.parse(point.timestamp) >= Date.parse(market.createdAt));
      const values = Object.values(point.values);
      if (market.type === 'scalar' || market.type === 'multi-scalar') {
        assert.ok(values.filter(Number.isFinite).every((value) => value >= market.bounds[0] && value <= market.bounds[1]));
      } else if (values.every(Number.isFinite)) {
        assert.ok(Math.abs(values.reduce((a, b) => a + b, 0) - 100) < 1e-8);
      }
    }
    const future = data.getMarketHistory(market, { id: 'custom', label: 'Future', start: '2099-01-01', end: '2099-02-01' });
    assert.equal(future.points.length, 0, 'Future ranges cannot invent history');
    if (market.hasPriceHistory === false) {
      assert.equal(month.points.length, 0);
    }
    const outcome = market.outcomes.at(-1);
    const query = new URLSearchParams({ parent: market.slug, chainId: String(market.chainId), outcome: outcome.id });
    assert.equal(data.getCreationParent(query).outcome.id, outcome.id);
    query.set('outcome', 'missing');
    assert.equal(data.getCreationParent(query), null);
    histories++;
  }
  const query = { period: 'ALL', app: 'All', chain: 0, search: '', sort: 'profit', ascending: false, page: 1 };
  const baseline = data.queryLeaderboard(query);
  assert.ok(baseline.rows.length > 0);
  assert.equal(data.queryLeaderboard({ ...query, search: 'no-matching-account' }).total, 0);
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(data.loadLeaderboard(query, controller.signal), { name: 'AbortError' });
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response('', { status: 503 });
    await assert.rejects(data.loadLeaderboard(query, new AbortController().signal), /503/);
    globalThis.fetch = async () => Response.json({ rows: [{ address: 'invalid' }] });
    await assert.rejects(data.loadLeaderboard(query, new AbortController().signal), /invalid account/);
    globalThis.fetch = async () => Response.json({ rows: [{ rank: 1, address: '0x8f1F3A182A92078520dB730224650e25552d42D8', label: 'Test account', profit: 50, volume: 100, markets: 3, accuracy: 50 }] });
    const recovered = await data.loadLeaderboard(query, new AbortController().signal);
    assert.equal(recovered.rows.length, 1, 'Retry should recover from source failure');
  } finally { globalThis.fetch = originalFetch; }
  console.log(`Pass 7 checks passed: ${histories} market histories and conditional drafts; leaderboard failure, recovery, validation and cancellation.`);
} finally { await rm(temporary, { recursive: true, force: true }); }
