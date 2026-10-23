const assert = {
  ok(value: unknown, message = 'Expected truthy value') { if (!value) throw new Error(message); },
  equal(a: unknown, b: unknown) { if (a !== b) throw new Error(`Expected ${String(a)} to equal ${String(b)}`); },
  deepEqual(a: unknown, b: unknown) { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error('Values differ'); },
  match(a: string, b: RegExp) { if (!b.test(a)) throw new Error(`${a} does not match ${b}`); },
};
import { renderToStaticMarkup } from 'react-dom/server';
import { toCsv } from '../data/export';
import { findEntity, relatedEntities, marketExport } from '../data/entityGraph';
import { explorerEntities, explorerMarkets, entityHref, filterExplorer, emptyFilters, localWalletEntities } from '../data/explorer';
import { money, timestamp, signedPercent, tokenAmount, shortAddress, shortHash, outcomeValue, countdownLabel } from '../data/format';
import { EntityHistoryChart } from '../components/EntityHistoryChart';
import { ExplorerEntityView } from '../components/ExplorerEntityView';
import { ExplorerGuideView } from '../components/ExplorerGuideView';

const store = new Map<string, string>();
Object.assign(globalThis, { localStorage: { getItem: (key: string) => store.get(key) || null } });
const location = { hash: '#/explorer', href: 'https://test.local/futarchy#/explorer' };
Object.assign(globalThis, { location });
assert.equal(money(Number.NaN), '—');
assert.equal(timestamp('bad-date'), '—');
assert.match(timestamp('2026-10-23T12:00:00Z'), /UTC$/);
assert.equal(signedPercent(1.2), '+1.20%');
assert.equal(tokenAmount(12.25, 'sDAI'), '12.25 sDAI');
assert.equal(shortAddress('0x12345678901234567890'), '0x1234…7890');
assert.equal(shortHash(''), '—');
assert.equal(outcomeValue(62, '%'), '62.0%');
assert.equal(countdownLabel('invalid', Date.now()), '—');
const csv = toCsv([{ question: '"Quoted",\nquestion', amount: '=1+1', count: 0 }, { question: 'x', amount: '@formula', count: 3 }]);
assert.ok(csv.startsWith('\uFEFF"question","amount","count"\r\n'));
assert.ok(csv.includes('""Quoted"",\nquestion'));
assert.ok(csv.includes('"\'=1+1"'));
assert.ok(csv.includes('"\'@formula"'));
assert.ok(csv.includes('"0"'));
const filtered = filterExplorer(explorerMarkets, { ...emptyFilters, organization: 'gnosis', liquidity: '100' });
const exported = marketExport(filtered.map(m => m.id));
assert.equal(exported.length, filtered.length);
assert.ok(exported.every(r => /Illustrative/.test(r.provenance)));
for (const entity of explorerEntities) {
  assert.ok(findEntity(entity.kind, entity.id), `Missing record ${entity.kind}/${entity.id}`);
  for (const target of relatedEntities(entity.kind, entity.id)) {
    assert.ok(findEntity(target.kind, target.id), `Dangling edge ${target.kind}/${target.id}`);
    assert.ok(relatedEntities(target.kind, target.id).some(reverse => reverse.kind === entity.kind && reverse.id === entity.id), `Missing reverse edge ${entity.kind}/${entity.id} to ${target.kind}/${target.id}`);
  }
}
const address = `0x${'1'.repeat(40)}`, hash = `0x${'2'.repeat(64)}`;
store.set('futarchy-demo-receipts', JSON.stringify([{ address, hash, draft: { title: 'Treasury allocation' } }]));
assert.equal(localWalletEntities().length, 2);
assert.ok(relatedEntities('wallet', address).some(e => e.kind === 'transaction' && e.id === hash));
assert.ok(relatedEntities('transaction', hash).some(e => e.kind === 'wallet' && e.id === address));
assert.ok(findEntity('wallet', `0x${'3'.repeat(40)}`));
store.set('futarchy-demo-receipts', '{bad-json');
assert.deepEqual(localWalletEntities(), []);
store.clear();
for (const entity of explorerEntities.filter(e => e.kind !== 'collection')) {
  const html = renderToStaticMarkup(<ExplorerEntityView kind={entity.kind} id={entity.id} />);
  assert.ok(html.includes('Connected records'), `Failed render ${entity.kind}/${entity.id}`);
}
const market = explorerMarkets.find(m => m.source)!;
const chart = renderToStaticMarkup(<EntityHistoryChart market={market} />);
assert.ok(chart.includes('History observation'));
assert.ok(chart.includes('step chart'));
assert.ok(!chart.includes('NaN'));
assert.ok(!chart.includes('Infinity'));
const sample = explorerMarkets.find(m => !m.source)!;
assert.ok(renderToStaticMarkup(<EntityHistoryChart market={sample} />).includes('No stored history'));
location.hash = `${entityHref('market', market.id)}?tab=Resolution`;
assert.ok(renderToStaticMarkup(<ExplorerEntityView kind="market" id={market.id} />).includes('Question on Reality.eth'));
assert.ok(renderToStaticMarkup(<ExplorerEntityView kind="market" id="unknown" />).includes('Record not found'));
for (const section of ['leaderboard', 'policies', 'help']) assert.ok(renderToStaticMarkup(<ExplorerGuideView section={section} />).length > 500);
console.log(`Pass 7 data/render checks passed: ${explorerEntities.length} indexed entities, bidirectional graph, CSV safety/filter parity, formats, chart and guide views.`);
