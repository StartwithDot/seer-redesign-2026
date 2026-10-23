import assert from 'node:assert/strict';
import { build } from 'esbuild';

// Execute the production hooks and event callbacks without claiming browser QA.
const host = {
  values: [], cursor: 0, effects: [],
  reset() { this.dispose(); this.values = []; this.cursor = 0; },
  dispose() { for (const value of this.values) value?.cleanup?.(); },
  render(fn) {
    this.cursor = 0; this.effects = [];
    const result = fn();
    for (const effect of this.effects) effect();
    return result;
  },
};
globalThis.__opportunityAuditHost = host;
const hooks = { name: 'audit-hooks', setup(plugin) {
  plugin.onResolve({ filter: /^react(?:\/jsx-runtime)?$/ }, args => ({ path: args.path, namespace: 'audit-hooks' }));
  plugin.onLoad({ filter: /.*/, namespace: 'audit-hooks' }, args => ({ contents: args.path.endsWith('jsx-runtime') ? `
    export const Fragment = 'fragment';
    export const jsx = (type, props, key) => ({ type, props, key });
    export const jsxs = jsx;
  ` : `
    const h = globalThis.__opportunityAuditHost;
    export const Fragment = 'fragment';
    export const useState = initial => { const i = h.cursor++; if (!(i in h.values)) h.values[i] = typeof initial === 'function' ? initial() : initial; return [h.values[i], value => { h.values[i] = typeof value === 'function' ? value(h.values[i]) : value; }]; };
    export const useRef = current => { const i = h.cursor++; if (!(i in h.values)) h.values[i] = { current }; return h.values[i]; };
    export const useCallback = fn => fn;
    export const useMemo = fn => fn();
    export const useId = () => 'audit-id';
    export const useEffect = (fn, deps) => { const i = h.cursor++; const previous = h.values[i]; if (!previous || !deps || deps.some((value, j) => value !== previous.deps[j])) { h.effects.push(() => { previous?.cleanup?.(); h.values[i] = { deps, cleanup: fn() }; }); } };
    export const useLayoutEffect = useEffect;
  ` }));
} };
let revision = 0;
async function load(entry, withHooks = false) {
  const output = await build({ entryPoints: [new URL(entry, import.meta.url).pathname], bundle: true, write: false, platform: 'node', format: 'esm', jsx: 'automatic', plugins: withHooks ? [hooks] : [] });
  return import(`data:text/javascript;base64,${Buffer.from(output.outputFiles[0].text + `\n// ${revision++}`).toString('base64')}`);
}
const stored = new Map();
globalThis.localStorage = { getItem: key => stored.get(key) ?? null, setItem: (key, value) => stored.set(key, value) };
globalThis.PopStateEvent = class extends Event { constructor() { super('popstate'); } };
const events = new EventTarget();
const entries = [{ href: 'https://seer.test/opportunity/review/seer-ai-job-board-name?n=12', state: {} }];
let cursor = 0;
const pop = () => window.dispatchEvent(new PopStateEvent());
globalThis.window = {
  get location() { return new URL(entries[cursor].href); }, localStorage,
  addEventListener: events.addEventListener.bind(events), removeEventListener: events.removeEventListener.bind(events), dispatchEvent: events.dispatchEvent.bind(events),
  scrollTo() {}, setTimeout, clearTimeout,
  history: {
    get state() { return entries[cursor].state; },
    pushState(state, _, href) { const target = new URL(href, window.location).href; entries.splice(++cursor); entries.push({ href: target, state }); },
    replaceState(state, _, href) { entries[cursor] = { href: new URL(href, window.location).href, state }; },
    back() { cursor = Math.max(0, cursor - 1); pop(); },
    forward() { cursor = Math.min(entries.length - 1, cursor + 1); pop(); },
  },
};
globalThis.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });

const { useOpportunityRoute } = await load('../hooks/useOpportunityRoute.ts', true);
const { useReviewOverlay } = await load('../hooks/useReviewOverlay.ts', true);
host.reset();
const router = host.render(useOpportunityRoute);
host.reset();
let overlay = host.render(() => useReviewOverlay(router.navigate));
overlay.setOverlay('shortlist');
assert.equal(window.location.search.includes('drawer=shortlist'), true);
overlay.setOverlay('dossier', false, { submission: 'delegateyourjob-ai' });
overlay.setOverlay('trade', false, { mode: 'sell' });
assert.equal(window.location.search.includes('mode=sell'), true);
overlay.setOverlay(null);
assert.equal(host.render(() => useReviewOverlay(router.navigate)).overlay, 'dossier');
window.history.back();
assert.equal(host.render(() => useReviewOverlay(router.navigate)).overlay, 'shortlist');
window.history.forward();
assert.equal(host.render(() => useReviewOverlay(router.navigate)).overlay, 'dossier');
overlay.setOverlay('compare', true, { compare: 'one,two' });
assert.equal(window.location.search.includes('compare=one%2Ctwo'), true);
window.history.replaceState({}, '', '/opportunity/review/seer-ai-job-board-name?drawer=trade&mode=sell');
const directCursor = cursor;
host.render(() => useReviewOverlay(router.navigate)).setOverlay(null);
assert.equal(cursor, directCursor, 'Closing a direct link must remain in this app.');
assert.equal(window.location.search.includes('drawer='), false);
host.reset();

const { useUrlDialog } = await load('../hooks/useUrlDialog.ts', true);
for (const parameter of ['filters', 'redeem', 'galleryImage', 'explainer']) {
  host.reset();
  let dialog = host.render(() => useUrlDialog(parameter));
  dialog[1]('open');
  assert.equal(host.render(() => useUrlDialog(parameter))[0], 'open');
  window.history.back();
  assert.equal(host.render(() => useUrlDialog(parameter))[0], null);
  window.history.forward();
  assert.equal(host.render(() => useUrlDialog(parameter))[0], 'open');
  host.render(() => useUrlDialog(parameter))[1](null);
  assert.equal(window.location.search.includes(`${parameter}=`), false);
}
host.reset();
window.history.replaceState({}, '', '/opportunity/explorer?n=12&q=seer&objectPage=2&preview=market-seer-rebrand-contest&sort=featured');
const { useExplorerQueryState } = await load('../hooks/useExplorerQueryState.ts', true);
let query = host.render(useExplorerQueryState);
assert.equal(query.objectPage, 2); assert.equal(query.sort, 'featured');
assert.equal(query.previewId, 'market-seer-rebrand-contest');
query.setObjectPage(3); query.selectPreview('market-seer-merch-devcon-mumbai');
query.openRecord('market-seer-merch-devcon-mumbai');
query.closeRecord();
query = host.render(useExplorerQueryState);
assert.equal(query.objectPage, 3); assert.equal(query.recordId, null);
assert.equal(query.previewId, 'market-seer-merch-devcon-mumbai');
console.log('History: review overlays, nested dialogs, direct-link closure, Back/forward and canonical page/preview restoration pass.');
host.reset();

const { currentMarket, allMarkets } = await load('../data/markets.ts');
const { submissionsForMarket } = await load('../data/submissions.ts');
const { buildSubmissionDossier, buildMarketDossier } = await load('../data/records.ts');
const dossiers = submissionsForMarket(currentMarket.id).map(submission => buildSubmissionDossier(submission, currentMarket));
const cut = await load('../data/reviewCut.ts');
const list = await load('../data/reviewList.ts');
const mixed = [dossiers[110], dossiers[60], dossiers[3], dossiers[111], dossiers[4]];
assert.deepEqual(list.groupDossiersByTier(mixed).map(dossier => dossier.submission.tier), ['above-floor', 'above-floor', 'tied-floor', 'unpriced', 'unpriced']);
const shortlist = [{ submissionId: 'a', pinned: false, order: 0 }, { submissionId: 'b', pinned: true, order: 1 }, { submissionId: 'c', pinned: false, order: 2 }];
assert.deepEqual(cut.orderedShortlist(cut.moveShortlist(shortlist, 'a', 1)).map(entry => entry.submissionId), ['b', 'c', 'a']);
assert.deepEqual(cut.moveShortlist(shortlist, 'a', -1), shortlist, 'Disabled group boundary cannot silently reorder.');
const filters = await load('../data/explorer.ts');
const search = await load('../data/search.ts');
const filteredObjects = filters.filterObjectRecords(search.searchGlobal('seer', null), allMarkets, { ...filters.emptyFilters, kind: 'contest', decision: 'selected' });
assert(filteredObjects.length > 0);
assert(filteredObjects.every(record => record.marketIds.some(id => allMarkets.some(market => market.id === id && market.kind === 'contest'))));
assert(filteredObjects.every(record => record.decision === undefined || record.decision === 'selected'));
assert.equal(filters.sortMarkets([...allMarkets].reverse(), 'featured', '').slice(0, 3).every(market => market.source === 'verified'), true);
const rebrand = allMarkets.find(market => market.id === 'seer-rebrand-contest');
const archive = await load('../data/archive.ts');
assert.equal(buildMarketDossier(rebrand).events.find(event => event.type === 'resolution').date, archive.archiveEvidenceFor(rebrand.id).finalizedAt);
assert.equal(filters.filterMarkets([{ ...currentMarket, createdAt: '2026-10-23T23:59:59.999Z' }], { ...filters.emptyFilters, createdAtTo: '2026-10-23' }).length, 1);
assert.equal(filters.filterMarkets([{ ...currentMarket, signal: null }], { ...filters.emptyFilters, odds: { min: 0, max: 0 } }).length, 0, 'Unknown odds are not zero.');

function nodes(tree, predicate) {
  if (tree === null || tree === undefined || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(item => nodes(item, predicate));
  return [...(predicate(tree) ? [tree] : []), ...nodes(tree.props?.children, predicate)];
}
const { ReviewListRows } = await load('../components/ReviewListRows.tsx', true);
let selected = null, opened = null, expanded = null, selectedIds = [];
const props = { dossiers: mixed, columns: Array.from({ length: 10 }, (_, key) => ({ key: String(key), label: String(key) })), sort: { key: 'rank', direction: 'asc' }, density: 'table', selectedId: '', selectedIds, expandedId: null, shortlistIds: [], groupByTier: true,
  onSelect: id => { selected = id; }, onToggleSort() {}, onSelectedIdsChange: ids => { selectedIds = ids; }, onExpandedChange: id => { expanded = id; }, onShortlistToggle() {}, onOpenDossier: id => { opened = id; }, onCopyLink() {},
};
let tree = ReviewListRows(props);
const rows = nodes(tree, node => node.type === 'tr' && node.props['data-submission-row']);
assert.deepEqual(rows.map(row => row.props['data-submission-row']), list.groupDossiersByTier(mixed).map(dossier => dossier.submission.id));
let prevented = false;
const rowDom = { tagName: 'TR', focus() { rows[0].props.onFocus(); } };
rows[0].props.onKeyDown({ key: ' ', target: { tagName: 'INPUT' }, currentTarget: rowDom, preventDefault() { prevented = true; } });
assert.equal(prevented, false); assert.equal(selected, null); assert.equal(expanded, null);
rows[0].props.onKeyDown({ key: 'Enter', target: rowDom, currentTarget: rowDom, preventDefault() {} });
assert.equal(opened, rows[0].props['data-submission-row']);
tree = ReviewListRows({ ...props, density: 'compact' });
assert.equal(nodes(tree, node => node.type === 'input' && node.props.type === 'checkbox').length, mixed.length + 1);
const compactRows = nodes(tree, node => node.type === 'button' && node.props['data-submission-row']);
const focusables = compactRows.map(row => ({ tagName: 'BUTTON', focus() { row.props.onFocus(); }, closest() { return { querySelectorAll() { return focusables; } }; } }));
compactRows[0].props.onKeyDown({ key: 'ArrowDown', target: focusables[0], currentTarget: focusables[0], preventDefault() {} });
assert.equal(selected, compactRows[1].props['data-submission-row']);
nodes(tree, node => node.type === 'input' && node.props.type === 'checkbox')[0].props.onChange({ target: { checked: true } });
assert.equal(selectedIds.length, mixed.length);
console.log('Lists: global tier order, pinned reorder, nested keyboard controls, compact focus/bulk parity and filtered canonical records pass.');

const { withPrivateReviews } = await load('../data/reviewDossiers.ts');
const candidate = dossiers[0];
const reviewRecord = { id: 'private-review', submissionId: candidate.submission.id, action: 'select', status: 'confirmed', rationale: 'Personal review', signature: '0x' + 'a'.repeat(130), createdAt: '2026-10-23T00:00:00Z', signedAt: '2026-10-23T00:01:00Z', error: null };
const workspace = { ...cut.defaultReviewWorkspace, decisions: { [candidate.submission.id]: reviewRecord } };
const privateDossier = withPrivateReviews([candidate], workspace)[0];
assert.equal(privateDossier.submission.decision, candidate.submission.decision);
assert.equal(privateDossier.winner, candidate.winner);
assert.equal(privateDossier.sponsorReview.comment, candidate.sponsorReview.comment);
assert.equal(privateDossier.sponsorReview.decisionTimestamp, candidate.sponsorReview.decisionTimestamp);
assert.match(privateDossier.sponsorReview.notes.at(-1), /Private review/);
assert.equal(privateDossier.timeline.decisionHistory.length, candidate.timeline.decisionHistory.length + 1);

const { useReviewWorkspace } = await load('../hooks/useReviewWorkspace.ts', true);
host.reset();
const account = '0x' + 'a'.repeat(40);
let workspaceHook = host.render(() => useReviewWorkspace('first', account));
workspaceHook.update({ cutSize: 11 });
workspaceHook = host.render(() => useReviewWorkspace('first', account));
const staleUpdate = workspaceHook.update;
host.render(() => useReviewWorkspace('second', '0x' + 'b'.repeat(40)));
workspaceHook = host.render(() => useReviewWorkspace('second', '0x' + 'b'.repeat(40)));
assert.equal(workspaceHook.state.cutSize, 27);
staleUpdate({ cutSize: 77 });
assert.equal(host.render(() => useReviewWorkspace('second', '0x' + 'b'.repeat(40))).state.cutSize, 27);
workspaceHook.update({ cutSize: 13 });
workspaceHook = host.render(() => useReviewWorkspace('second', '0x' + 'b'.repeat(40)));
assert.equal(JSON.parse(stored.get(workspaceHook.storageKey)).cutSize, 13);
host.reset();
const interruptedKey = `opportunity-review-workspace-v1:interrupted:${account}`;
stored.set(interruptedKey, JSON.stringify({ ...workspace, decisions: { [candidate.submission.id]: { ...reviewRecord, status: 'pending' } } }));
workspaceHook = host.render(() => useReviewWorkspace('interrupted', account));
assert.equal(workspaceHook.state.decisions[candidate.submission.id].status, 'failed');
console.log('Authority: private signatures preserve source decisions/winners; stale account callbacks and interrupted requests cannot masquerade as confirmation.');
host.reset();

const rpc = await load('../data/contractRpc.ts');
const live = await load('../data/liveTrade.ts');
const outcome = live.tradeOutcomeById.values().next().value;
const scale = 10n ** 18n, routerAddress = '0x' + 'c'.repeat(40), ctf = '0x' + 'd'.repeat(40);
const word = value => BigInt(value).toString(16).padStart(64, '0');
const provider = { request: async ({ method, params }) => {
  assert.equal(method, 'eth_call');
  const selector = params[0].data.slice(2, 10);
  if (selector === rpc.selectors.condition) return outcome.condition;
  if (selector === rpc.selectors.wrapped) return '0x' + rpc.addressWord(outcome.token);
  if (selector === rpc.selectors.conditionalTokens) return '0x' + rpc.addressWord(ctf);
  if (selector === rpc.selectors.denominator || selector === rpc.selectors.allowance) return '0x' + word(0);
  if (selector === rpc.selectors.decimals) return '0x' + word(18);
  if (selector === rpc.selectors.balance) return '0x' + word(1000n * scale);
  throw Error('Unexpected read');
} };
let badReference = false, badOrder = false, failReference = false;
const loader = async () => ({ viem: { createPublicClient: value => value, custom: value => value }, seer: { TradeType: { EXACT_INPUT: 0 }, fetchAmmQuote: async (_, __, ___, ____, amountText, token, collateral, mode) => {
  const amount = live.parseTradeAmount(amountText);
  const reference = amount < scale;
  if (reference && failReference) throw Error('Reference route unavailable');
  const amountOut = mode === 'buy' ? reference ? amount * 25n / 2n : amount * 10n : reference ? amount / 8n : amount / 10n;
  return { trade: { approveAddress: reference && badReference ? ctf : routerAddress, chainId: 100, amountIn: amount, amountOut,
    tokenIn: mode === 'buy' ? collateral : token, tokenOut: badOrder ? collateral : mode === 'buy' ? token : collateral,
    minimumAmountOut: () => amountOut * 9950n / 10000n,
    swapTransaction: async () => ({ to: routerAddress, data: '0x12345678', value: 0n }),
  } };
} } });
for (const mode of ['buy', 'sell']) {
  const quote = await live.fetchLiveTradeQuote(provider, account, outcome, mode, '10', '0.5', loader);
  assert.equal(quote.priceImpactPercent, 20);
  assert.equal(quote.referenceAmount, scale / 10n);
  assert.equal(quote.minimum, quote.receive * 9950n / 10000n);
  assert.equal(live.liveQuoteGuard(quote, account, quote.quotedAt + 29999), null);
  assert.match(live.liveQuoteGuard(quote, account, quote.quotedAt + 30000), /expired/);
  assert.match(live.liveQuoteGuard(quote, ctf), /Wallet changed/);
}
badReference = true;
assert.equal((await live.fetchLiveTradeQuote(provider, account, outcome, 'buy', '10', '0.5', loader)).priceImpactPercent, null);
badReference = false; failReference = true;
assert.equal((await live.fetchLiveTradeQuote(provider, account, outcome, 'buy', '10', '0.5', loader)).priceImpactPercent, null);
failReference = false; badOrder = true;
await assert.rejects(live.fetchLiveTradeQuote(provider, account, outcome, 'buy', '10', '0.5', loader), /does not match/);
assert.equal(live.addTradeAmount('0.000000000000000001', 1), '1.000000000000000001');
assert.equal(live.addTradeAmount('', 5), '5');
assert.equal(live.addTradeAmount('10', 100), '110');
assert.throws(() => live.addTradeAmount('invalid', 1));
assert.equal(live.quotePriceImpact(10n, 100n, 10n, 100n), null);
console.log('Trading: validated buy/sell reference quotes, exact price impact, missing/mismatched reference recovery, expiry and precise quick-add amounts pass.');
