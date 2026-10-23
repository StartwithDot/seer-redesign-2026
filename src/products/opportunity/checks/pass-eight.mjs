import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';

async function load(entry) {
  const output = await build({ entryPoints: [new URL(entry, import.meta.url).pathname], bundle: true, write: false, platform: 'node', format: 'esm' });
  return import(`data:text/javascript;base64,${Buffer.from(output.outputFiles[0].text).toString('base64')}`);
}
const { archiveEvidenceFor } = await load('../data/archive.ts');
const rebrand = archiveEvidenceFor('seer-rebrand-contest');
const merch = archiveEvidenceFor('seer-merch-devcon-mumbai');
assert.deepEqual(rebrand.winners, ['Electric Foundation']);
assert.equal(merch.winners.length, 5);
assert(merch.winners.includes('Seer Compass Shirt'));
assert.equal(archiveEvidenceFor('unrecognized-market'), null);
assert.equal(rebrand.finalizedAt, new Date(1791480130 * 1000).toISOString());
assert.match(rebrand.payout, /1.00 sDAI/);
assert.match(merch.payout, /rate not captured/);
// Validate every stored settlement field against the original captured API response.
const network = JSON.parse(await readFile(new URL('../../../../../products/opportunity/audit_archive/network.json', import.meta.url)));
const source = network.flatMap(record => record.samples ?? []).flatMap(sample => {
  try { return JSON.parse(sample).markets ?? []; } catch { return []; }
});
for (const evidence of [rebrand, merch]) {
  const captured = source.find(market => market.id === evidence.id);
  assert(captured);
  for (const field of ['finalizeTs', 'payoutReported', 'payoutNumerators', 'outcomes', 'collateralToken']) assert.deepEqual(evidence[field], captured[field]);
}

Object.defineProperty(globalThis, 'location', { configurable: true, value: { origin: 'https://seer.test', search: '?n=7&panel=wallet&q=old' } });
const { copyText, submissionUrl } = await load('../data/sharing.ts');
const link = new URL(submissionUrl('market /', 'candidate?&'));
assert.equal(link.pathname, '/opportunity/review/market%20%2F');
assert.equal(link.searchParams.get('submission'), 'candidate?&');
assert.equal(link.searchParams.get('n'), '7');
assert.equal(link.searchParams.get('drawer'), 'submission');
assert.equal(link.searchParams.get('panel'), null);
let copied = '';
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { clipboard: { writeText: async value => { copied = value; } } } });
await copyText('canonical-id');
assert.equal(copied, 'canonical-id');
let removed = false;
let restored = false;
let copySucceeded = true;
globalThis.document = {
  activeElement: { focus: () => { restored = true; } },
  createElement: () => ({ style: {}, setAttribute() {}, select() {}, remove: () => { removed = true; } }),
  body: { append() {} },
  execCommand: () => copySucceeded,
};
navigator.clipboard.writeText = async () => { throw new Error('Permission denied'); };
await copyText('fallback');
assert(removed && restored);
copySucceeded = false;
await assert.rejects(copyText('must not claim success'), /Copy unavailable/);
assert(removed && restored);
console.log('Pass 8: archive source parity, winner mapping, resolution dates, share deep links, clipboard fallback and failure checks passed.');

// Exercise real router callbacks with a minimal hooks host and browser history.
const hooksHost = {
  name: 'hooks-host',
  setup(plugin) {
    plugin.onResolve({ filter: /^react$/ }, () => ({ path: 'react', namespace: 'hooks-host' }));
    plugin.onLoad({ filter: /.*/, namespace: 'hooks-host' }, () => ({ contents: `
      export const useCallback = fn => fn;
      export const useEffect = () => {};
      export const useMemo = fn => fn();
      export const useRef = current => ({ current });
      export const useState = initial => [typeof initial === 'function' ? initial() : initial, () => {}];
    ` }));
  },
};
const output = await build({ entryPoints: [new URL('../hooks/useOpportunityRoute.ts', import.meta.url).pathname], bundle: true, write: false, platform: 'node', format: 'esm', plugins: [hooksHost] });
const { useOpportunityRoute } = await import(`data:text/javascript;base64,${Buffer.from(output.outputFiles[0].text).toString('base64')}`);
const entries = [{ href: 'https://seer.test/opportunity/review/market?n=7', state: {} }];
let cursor = 0;
const currentLocation = () => new URL(entries[cursor].href);
const windowMock = {
  get location() { return currentLocation(); },
  dispatchEvent() {}, scrollTo() {},
  history: {
    get state() { return entries[cursor].state; },
    pushState(state, _, href) { const target = new URL(href, currentLocation()).href; entries.splice(++cursor); entries.push({ href: target, state }); },
    replaceState(state, _, href) { entries[cursor] = { href: new URL(href, currentLocation()).href, state }; },
    back() { cursor = Math.max(0, cursor - 1); },
  },
};
globalThis.window = windowMock;
globalThis.PopStateEvent = class {};
const router = useOpportunityRoute();
router.navigate('/opportunity/review/market?submission=one&drawer=submission');
assert.equal(window.history.state.opportunityDossier, true);
assert.equal(window.location.search.includes('n=7'), true);
router.navigate('/opportunity/review/market?submission=two&drawer=submission', true);
assert.equal(entries.length, 2);
assert.equal(window.history.state.opportunityDossier, true);
window.history.back();
assert.equal(window.location.search, '?n=7');
router.navigate('/opportunity/review/market?submission=one&drawer=submission', true);
assert.equal(window.history.state.opportunityDossier, false, 'A replaced direct link must not navigate outside the app on close');
const count = entries.length;
router.navigate('https://other.test/');
router.navigate('/other-product');
assert.equal(entries.length, count);
assert.equal(window.location.pathname, '/opportunity/review/market');
console.log('Pass 8: drawer history ownership, previous-view return, sample preservation and route boundary checks passed.');
