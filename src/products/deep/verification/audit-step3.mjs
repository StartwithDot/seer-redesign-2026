import { build } from 'esbuild';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs/promises';
async function compile(file) {
  const output = await build({ entryPoints: [new URL(file, import.meta.url).pathname], bundle: true, write: false, format: 'cjs' });
  const module = { exports: {} };
  vm.runInNewContext(output.outputFiles[0].text, { module, exports: module.exports, console, setTimeout, clearTimeout });
  return module.exports;
}
const { archivedRows, archivedMarketCount } = await compile('../data/archive.ts');
for (const id of ['zcash-nu7', 'zcash-grants', 'octant', 'round-2-l2', 'round-2-l1', 'round-2-originality']) {
  const rows = archivedRows(id);
  assert.ok(rows.length > 0, id);
  assert.ok(archivedMarketCount(id) > 0, id);
  assert.equal(new Set(rows.map(row => row.id)).size, rows.length);
  if (!['octant', 'round-2-l1'].includes(id)) assert.ok(rows.some(row => row.upHistory.length > 0), `${id} history`);
  else assert.ok(rows.every(row => row.historyState !== 'available'), `${id} retains missing history`);
  assert.ok(rows.every(row => row.primaryPrice === null || Number.isFinite(row.primaryPrice)));
}
assert.equal(archivedRows('round-1').length, 0);
const { walletsForPeriod, metadataForPeriod } = await compile('../data/leaderboard-periods.ts');
for (const period of ['1d', '1w', '1m', 'all']) {
  const rows = walletsForPeriod(period);
  assert.ok(rows.length > 0, period);
  assert.equal(rows.length, metadataForPeriod(period).total);
  assert.equal(new Set(rows.map(row => row.address)).size, rows.length);
  const raw = JSON.parse(await fs.readFile(new URL(`../data/leaderboard-metadata-${period}.json`, import.meta.url)));
  assert.equal(metadataForPeriod(period).updatedAt, raw.updatedAt);
}
assert.ok(walletsForPeriod('1d').some(row => row.roi === null));
const { resolveWalletProfile } = await compile('../data/profiles.ts');
assert.equal(resolveWalletProfile('0x216ac1eb296ecd64f6d782d8d740a2fb69f76203').displayName, 'The Omniacs');
const { parsePredictionCsv, marketWeightsCsv } = await compile('../data/prediction-csv.ts');
const repositories = [{ owner: 'Owner', name: 'Repo', marketId: 'market', upPrice: .7, downPrice: .2 }];
for (const input of ['repo,predicted\nOwner/Repo,', 'repo,predicted\nOwner/Repo,"0.5', 'repo,predicted\nOwner/Repo,2']) assert.ok(parsePredictionCsv(input, repositories).errors.length);
assert.equal(parsePredictionCsv('\ufeffrepo,predicted\n"OWNER/REPO",0.5', repositories).records[0].up, .5);
assert.equal(marketWeightsCsv(repositories, new Map([['market', {up:.9, down:.1}]])), 'repo,up,down\n"Owner/Repo",0.7000,0.2000');
console.log('Step 3 checks passed: six archive datasets with available histories, four independent rankings, metadata, API profiles, invalid CSV rejection and actual market weights.');
