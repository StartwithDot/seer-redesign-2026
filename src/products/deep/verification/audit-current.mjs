import { build } from 'esbuild';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
async function compile(file) {
  const result = await build({ entryPoints: [new URL(file, root).pathname], bundle: true, write: false, format: 'cjs', logLevel: 'silent' });
  const module = { exports: {} };
  vm.runInNewContext(result.outputFiles[0].text, { module, exports: module.exports });
  return module.exports;
}
const math = await compile('data/field-analysis.ts');
assert.equal(math.swarmPriceX(0), 32);
assert.equal(math.swarmPriceX(1), 968);
assert.ok(Math.abs((math.swarmPriceX(.85) - math.swarmPriceX(.65)) / .2 / 936 - 10 / 3) < 1e-10);
for (let i = 1; i <= 100; i++) assert.ok(math.swarmPriceX(i / 100) > math.swarmPriceX((i - 1) / 100));
const raw = JSON.parse(await fs.readFile(new URL('data/rows.json', root)));
const volumeMax = Math.max(...raw.map(row => Number(row.vol.split(' ')[0])));
for (const mode of ['liquidity', 'volume', 'coincident']) {
  const items = raw.map((row, index) => ({ id: row.id, x: mode === 'coincident' ? 500 : math.swarmPriceX(row.up),
    radius: mode === 'volume' ? Math.sqrt(Math.max(16, Number(row.vol.split(' ')[0]) / volumeMax * 289)) : 10.5 }));
  const placed = math.dodgeSwarmMarks(items);
  assert.equal(placed.size, 98);
  for (let i = 0; i < items.length; i++) for (let j = 0; j < i; j++) {
    const a = items[i], b = items[j];
    assert.ok(Math.hypot(a.x - b.x, placed.get(a.id) - placed.get(b.id)) >= a.radius + b.radius + 3.98, `${mode} ${i}/${j}`);
  }
}
assert.equal(math.valueAtOrBefore([{ timestamp: 2, price: .7 }], 1), null);
assert.equal(math.quantile([.8, .2, .6, .4], .5), .5);
const steps = math.stepPoints([{ timestamp: 2, price: .4 }, { timestamp: 1, price: .3 }, { timestamp: 2, price: .5 }]);
assert.equal(JSON.stringify(steps), JSON.stringify([{ timestamp: 1, price: .3 }, { timestamp: 2, price: .3 }, { timestamp: 2, price: .5 }]));
for (const period of ['all', '1d', '1w', '1m']) {
  const file = period === 'all' ? 'leaderboard-reference' : `leaderboard-${period}`;
  const rows = JSON.parse(await fs.readFile(new URL(`data/${file}.json`, root)));
  const source = JSON.parse(await fs.readFile(new URL(`../../../../apps/deep/src/data/real/leaderboard-${period}.json`, root)));
  for (const row of rows) {
    const original = source.rows.find(item => item.address.toLowerCase() === row.address.toLowerCase());
    assert.deepEqual(row.mergedWalletAddresses, original.mergedWallets ?? []);
    assert.equal(row.profitLoss, original.pnl);
  }
}
const chart = await fs.readFile(new URL('components/TimeFigureChart.tsx', root), 'utf8');
assert.match(chart, /chartEnd = Math\.min\(end, replayTime \|\| end\)/, 'Hover must not truncate history');
assert.match(chart, /getScreenCTM/, 'Pointer coordinates account for SVG fitting');
assert.match(chart, /if \(checked\) next.delete/, 'Checkbox reveals a hidden series');
assert.match(chart, /TradingView is not used/);
const checklist = await fs.readFile(new URL('FEATURES.md', root), 'utf8');
assert.equal([...checklist.matchAll(/^- \[ \] F\d+/gm)].length, 17);
console.log('Current audit checks passed: exact 3.3x lens, 98-mark circle separation, missing history, step deduplication, four-period merged identities, chart inspection/visibility and checklist integrity.');
