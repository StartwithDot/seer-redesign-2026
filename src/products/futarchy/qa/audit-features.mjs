import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFile(resolve(root, file), 'utf8');
const evidence = JSON.parse(await read('qa/feature-evidence.json'));
const gaps = JSON.parse(await read('qa/audit-gaps.json'));
const checklist = [...(await read('FEATURES.md')).matchAll(/^- \[([ x])\] (F\d{3}) (.+)$/gm)];
assert.equal(checklist.length, 155);
assert.equal(new Set(checklist.map(m => m[2])).size, checklist.length);
const parents = new Map([['index.tsx', null]]);
const contents = new Map();
for (const [file] of parents) {
  const source = await read(file);
  contents.set(file, source);
  const imports = [...source.matchAll(/(?:from\s*|import\s*\(|import\s*|@import\s*)['"]([^'"]+)['"]/g)];
  for (const [, specifier] of imports) {
    if (!specifier.startsWith('.')) continue;
    const base = resolve(root, dirname(file), specifier);
    for (const suffix of ['', '.tsx', '.ts', '.css', '/index.tsx', '/index.ts']) {
      const target = relative(root, base + suffix);
      if (target.startsWith('..')) continue;
      try {
        await read(target);
        if (!parents.has(target)) parents.set(target, file);
        break;
      } catch { /* Try the next module extension. */ }
    }
  }
}
const rows = [];
for (const [, status, id, description] of checklist) {
  const source = evidence[id];
  assert.ok(source && parents.has(source), `${id}: source must be imported by the product entry`);
  const code = contents.get(source);
  assert.ok(code.trim().length > 100, `${id}: empty implementation`);
  assert.equal(status === ' ', Boolean(gaps[id]), `${id}: unchecked status must have an explicit gap`);
  const line = code.split('\n').findIndex(line => /^export |^\.futarchy/.test(line)) + 1 || 1;
  const chain = [source];
  while (parents.get(chain[0])) chain.unshift(parents.get(chain[0]));
  rows.push(`| ${id} | ${status === 'x' ? 'Code verified' : 'Incomplete'} | [${source}:${line}](${source}#L${line}) | ${gaps[id] || description} | ${chain.join(' → ')} |`);
}
const remaining = checklist.filter(m => m[1] === ' ').length;
await writeFile(resolve(root, 'AUDIT.md'), `# Futarchy Step 3 code audit

155 items inspected; ${remaining} remain unchecked. This is source and import-reachability evidence, not a completed browser dead-control audit.

The requested ../products/futarchy/REQUIREMENTS.md does not exist. Comparison used ../apps/futarchy/src (including App, router, trade, liquidity, landing, palette and tour) and the available ../products/futarchy/design.md, design-v4.md, docs.md and audit-live inventories. Missing legacy organization routing and draft persistence are now explicitly inventoried. V now cycles research presets, matching the old app rather than changing chart mode.

The main navigation opens Home, Explorer, Create and organization/market routes. Home section controls expose the signal board, milestone filters, closed collection and organizations in a bounded region. Market action controls expose the listed drawers. Evidence buttons expose TWAP and resolution. Explorer rows and connected records expose entity routes. These are the UI entry points for the import chains below; an import alone does not prove a working control.

Fixes: bounded discovery with preserved filters and URL state; quote cancellation, stale-quote and duplicate-confirm guards; matched outcome merge limits; actual endpoint labels; V scenario presets; legacy routes and query handling; drawer history/share state; correct sDAI purchase target; verdict threshold consistency; NO winning-branch mark; simultaneous hover/focus rotation pause; lock-triggered haptics; and explicit missing-source states.

Limitations: live balances, indexer records, protocol writes, verified deployment/pool addresses and canonical oracle/proposal IDs cannot be inferred from generated examples. Those features remain unchecked. Chrome launches fail with SIGABRT before a page opens, so visual geometry, two-viewport compliance and exhaustive dead-control coverage remain unverified. The production build and data/render checks do not substitute for that evidence.

| Feature | Audit result | Source | Evidence or remaining gap | Import path from product entry |
| --- | --- | --- | --- | --- |
${rows.join('\n')}
`);
console.log(`Source coverage passed: ${checklist.length} items, ${parents.size} reachable modules, ${remaining} unchecked.`);
