import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const theme = fs.readFileSync(new URL('../state/theme.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(theme, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
for (const expected of ['dark', 'light']) {
  const storage = new Map([['seer-theme', expected]]);
  const document = { documentElement: { dataset: {}, style: {} } };
  const context = { exports: {}, document, window: { localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) } } };
  vm.runInNewContext(compiled, context);
  assert.equal(document.documentElement.dataset.theme, expected, 'Canonical theme works without shell preference');
  assert.equal(storage.get('seer-theme'), expected);
}
const table = fs.readFileSync(new URL('../components/OutcomeTable.tsx', import.meta.url), 'utf8');
assert.match(table, /tab === 'top'.*sort\(\(a, b\) => b.upPrice - a.upPrice\).*slice\(0, 10\)/);
const fan = fs.readFileSync(new URL('../components/FanChart.tsx', import.meta.url), 'utf8');
assert.match(fan, /Math.max\(0, Math.min\(1, price\)\)/);
assert.match(fan, /\[0, .25, .5, .75, 1\]/);
const page = fs.readFileSync(new URL('../pages/MarketsPage.tsx', import.meta.url), 'utf8');
assert.equal((page.match(/key=\{selected.marketId\}/g) ?? []).length, 2, 'Both tickets reset for a new market');
console.log('V4 repair checks passed: canonical theme boot, probability top ten, full chart domain, and ticket identity.');
