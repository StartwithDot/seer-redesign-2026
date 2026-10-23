import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { access, readFile } from 'node:fs/promises';
let moduleRevision = 0;
async function load(entry, plugins = []) {
  const output = await build({ entryPoints: [new URL(entry, import.meta.url).pathname], bundle: true, write: false, platform: 'node', format: 'esm', plugins });
  return import(`data:text/javascript;base64,${Buffer.from(output.outputFiles[0].text + '\n// module revision ' + moduleRevision++).toString('base64')}`);
}
const stored = new Map();
globalThis.localStorage = { getItem: key => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value) };
globalThis.window = { location: new URL('https://seer.test/opportunity?n=12'), localStorage };
const data = await load('../data/submissions.ts');
const { currentMarket, allMarkets, verifiedArchiveMarkets } = await load('../data/markets.ts');
const raw = JSON.parse(await readFile(new URL('../data/live_outcomes.json', import.meta.url)));
assert.equal(allMarkets.length, 12);
assert.equal(data.pilotSubmissions.length, 235);
for (const [index, row] of raw.entries()) {
  const actual = data.pilotSubmissions[index];
  assert.equal(actual.name, row.name); assert.equal(actual.oddsPercent, row.odds);
  assert.equal(actual.delta24h, null); assert.equal(actual.rankMovement, null); assert.equal(actual.source, 'verified');
}
const tierCounts = ['above-floor', 'tied-floor', 'unpriced'].map(tier => data.pilotSubmissions.filter(row => row.tier === tier).length);
assert.deepEqual(tierCounts, [59, 46, 130]);
const odds = data.pilotSubmissions.reduce((total, row) => total + (row.oddsPercent ?? 0), 0);
assert.equal(odds.toFixed(1), '99.0');
const records = await load('../data/records.ts');
const cut = await load('../data/reviewCut.ts');
const dossiers = data.pilotSubmissions.map(row => records.buildSubmissionDossier(row, currentMarket));
assert.deepEqual(cut.buildCoverageCheckpoints(dossiers).map(row => row.oddsPercent.toFixed(1)), ['13.6','29.7','60.4']);
const shortlist = [{ submissionId: dossiers[30].submission.id, pinned: false, order: 0 }, { submissionId: dossiers[50].submission.id, pinned: true, order: 1 }];
assert.equal(cut.includedForCut(dossiers, 1, 'sponsor', shortlist)[0].submission.id, dossiers[50].submission.id);
for (const market of allMarkets) {
  const rows = data.submissionsForMarket(market.id);
  assert.equal(rows.length, market.submissionCount);
  assert.equal(new Set(rows.map(row => row.id)).size, rows.length);
  assert.equal(new Set(rows.map(row => row.name)).size, rows.length);
}
assert.equal(data.submissionsForMarket(verifiedArchiveMarkets[0].id).filter(row => row.decision === 'selected').length, 1);
assert.equal(data.submissionsForMarket(verifiedArchiveMarkets[1].id).filter(row => row.decision === 'selected').length, 5);
const search = await load('../data/search.ts');
for (const record of search.searchRecords) assert(records.resolveExplorerRecord(record.id), `Dead canonical record: ${record.id}`);
assert(search.searchGlobal('@hypedsgn').some(record => record.kind === 'creator'));
const { buildPriceHistory } = await load('../data/priceHistory.ts');
const electric = data.submissionsForMarket('seer-rebrand-contest')[0];
assert(buildPriceHistory(electric, '30d').points.length > 100);
const evidence = await load('../data/submissionEvidence.ts');
const timeline = evidence.buildSubmissionTimeline(electric);
assert(timeline.resolutionHistory.some(event => event.state === 'recorded'));
assert(timeline.priceHistory.length > 100);
const { marketAnalysis } = await load('../data/analytics.ts');
const analysis = marketAnalysis(verifiedArchiveMarkets[0], 'odds', '30d');
assert(analysis.lines.every(line => line.values.length === analysis.labels.length), 'Historical series must align by timestamp.');
const filters = await load('../data/explorer.ts');
const state = filters.filtersFromSearch(new URLSearchParams('winners=five&outcomeCountMin=25&outcomeCountMax=100'));
const query = new URLSearchParams(); filters.applyExplorerStateToSearch(query, state, 'outcomes', 'field', 2);
assert.deepEqual(filters.filtersFromSearch(query), state);
assert.equal(query.get('sort'), 'outcomes');
assert.deepEqual(filters.filterMarkets(allMarkets, { ...filters.emptyFilters, winnerCount: 'five' }).map(market => market.id), ['seer-merch-devcon-mumbai']);
for (let n = 1; n <= 12; n++) {
  window.location = new URL(`https://seer.test/opportunity?n=${n}`);
  const markets = await load('../data/markets.ts');
  assert.equal(markets.allMarkets.length, n);
}
window.location = new URL('https://seer.test/opportunity?n=1');
const narrowRecords = await load('../data/records.ts');
assert(narrowRecords.resolveExplorerRecord('submission-seer-rebrand-contest-outcome-0'), 'Explicit archive deep links must work outside the visible count.');
// Exercise actual route and panel callbacks, including palette navigation and direct-link closure.
const hooks = { name: 'hooks-host', setup(plugin) {
  plugin.onResolve({ filter: /^react$/ }, () => ({ path: 'react', namespace: 'host' }));
  plugin.onLoad({ filter: /.*/, namespace: 'host' }, () => ({ contents: 'export const useCallback=fn=>fn; export const useEffect=()=>{}; export const useState=initial=>[typeof initial === "function"?initial():initial,()=>{}];' }));
} };
const entries = [{ href: 'https://seer.test/opportunity?n=1', state: {} }]; let cursor = 0;
window = { get location() { return new URL(entries[cursor].href); }, dispatchEvent() {}, scrollTo() {}, history: {
  get state() { return entries[cursor].state; }, pushState(state, _, href) { const target = new URL(href, window.location).href; entries.splice(++cursor); entries.push({href:target,state}); },
  replaceState(state, _, href) { entries[cursor] = { href: new URL(href, window.location).href, state }; }, back() { cursor = Math.max(0, cursor-1); }
} };
globalThis.PopStateEvent = class {};
const { useOpportunityRoute } = await load('../hooks/useOpportunityRoute.ts', [hooks]);
const { useUrlPanel } = await load('../hooks/useUrlPanel.ts', [hooks]);
const route = useOpportunityRoute(); const panel = useUrlPanel();
panel.openPanel('help'); panel.openPanel('search'); assert.equal(entries.length, 2);
route.navigate('/opportunity/explorer?record=market-seer-ai-job-board-name');
assert.equal(window.location.pathname, '/opportunity/explorer'); assert.equal(window.location.search.includes('panel='), false);
panel.closePanel(); assert.equal(window.location.pathname, '/opportunity/explorer');
panel.openPanel('help'); route.navigate(window.location.pathname + window.location.search, true);
assert.equal(window.location.search.includes('panel='), false, 'Starting tour must clear the help panel.');

const inventory = await readFile(new URL('../FEATURES.md', import.meta.url), 'utf8');
const checklist = [...inventory.matchAll(/^- \[([ x])\] (F\d{3}) /gm)].map(([, mark, id]) => ({ id, checked: mark === 'x' }));
const featureEvidence = JSON.parse(await readFile(new URL('./feature-evidence.json', import.meta.url), 'utf8'));
assert.equal(checklist.length, featureEvidence.length, 'Every checklist row needs one evidence record.');
assert.deepEqual(checklist.filter(item => !item.checked).map(item => item.id), ['F059', 'F099']);
for (const item of checklist) {
  const proof = featureEvidence.find(entry => entry.id === item.id);
  assert(proof, `Missing evidence for ${item.id}`);
  assert.equal(proof.checked, item.checked, `Checklist and evidence disagree for ${item.id}`);
  await access(new URL(`../${proof.file}`, import.meta.url));
  assert.deepEqual(proof.importPath.slice(0, 2), ['index', 'OpportunityApp'], `${item.id} is not traced from the product entry.`);
}
const paritySources = await Promise.all([
  readFile(new URL('../components/MarketRail.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../components/OpportunityApp.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../components/ProtocolDrawer.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../components/MarketExplainer.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../components/MarketHero.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../components/SubmissionDossierPanel.tsx', import.meta.url), 'utf8'),
]);
assert.match(paritySources[0], /Market status/); assert.match(paritySources[0], /Find a market/); assert.match(paritySources[0], /Clear market filters/);
for (const product of ['Explorer', 'Deep', 'Futarchy', 'Opportunity', 'Risk']) assert.match(paritySources[1], new RegExp(`>${product}<`));
assert.match(paritySources[2], /Anyone launches/); assert.match(paritySources[2], /Open Seer to launch a market/);
assert.match(paritySources[3], /Traders earn P&L based on final decision/);
assert.match(paritySources[4], /onClick=\{onOpenReview\}/); assert.match(paritySources[4], /Market depth/);
assert.match(paritySources[5], /Market depth/); assert.match(paritySources[5], /outcome-specific price impact/);
console.log('Audit: 158 checklist rows have reachable source evidence; exact pilot data/counts/coverage, all canonical links, 1..12 scaling, parity additions, shortlist preference, archived history, filter restoration and panel navigation pass.');
