const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const { createRequire } = require('node:module');
const req = createRequire(process.cwd() + '/package.json');
const esbuild = req('esbuild');
const React = req('react');
const { renderToStaticMarkup } = req('react-dom/server');
async function load(path, env = {}, hooks) {
  const code = (await esbuild.build({ entryPoints: ['src/products/risk/' + path], bundle: true, platform: 'node', format: 'cjs', external: ['react', 'react-dom', 'react/jsx-runtime'], write: false })).outputFiles[0].text;
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, require: name => name === 'react' && hooks ? hooks : req(name), console, URLSearchParams, TextEncoder, ...env });
  return module.exports;
}
async function harness(path, name, props = {}, env = {}) {
  let values = [], effects = [], pending = [], cursor = 0, tree, dirty = false;
  const hooks = {
    Component: React.Component,
    useState(initial) { const i = cursor++; if (!(i in values)) values[i] = typeof initial === 'function' ? initial() : initial; return [values[i], next => { values[i] = typeof next === 'function' ? next(values[i]) : next; dirty = true; }]; },
    useRef(initial) { const i = cursor++; if (!(i in values)) values[i] = { current: initial }; return values[i]; },
    useEffect(fn, deps) { const i = cursor++; const previous = effects[i]; if (!previous || deps.some((value, j) => value !== previous.deps[j])) pending.push(() => { previous?.cleanup?.(); effects[i] = { deps, cleanup: fn() }; }); },
    useCallback(fn) { cursor++; return fn; },
    useMemo(fn) { cursor++; return fn(); },
    useId() { return 'test-id-' + cursor++; },
    useSyncExternalStore(subscribe, read) { const [value, set] = hooks.useState(read); hooks.useEffect(() => subscribe(() => set(read())), [subscribe]); return value; },
  };
  const module = await load(path, env, hooks);
  const render = () => { dirty = false; cursor = 0; tree = module[name](props); const jobs = pending; pending = []; jobs.forEach(fn => fn()); };
  const flush = async () => { for (let i = 0; i < 6; i++) { await new Promise(resolve => setImmediate(resolve)); if (dirty) render(); } return tree; };
  render();
  return { get: () => tree, flush, attachRef(element) { values.find(value => value && typeof value === 'object' && 'current' in value && value.current === null).current = element; }, update(next) { props = { ...props, ...next }; render(); }, close() { effects.forEach(e => e?.cleanup?.()); } };
}
function find(tree, predicate) {
  if (!tree || typeof tree !== 'object') return null;
  if (predicate(tree)) return tree;
  for (const child of [tree.props?.children].flat(Infinity)) { const result = find(child, predicate); if (result) return result; }
  return null;
}
(async () => {
  const { RISK_ASSETS } = await load('data/assets.ts');
  const math = await load('data/math.ts');
  const { POOL_SERIES, POOL_HISTORY } = await load('data/pool-history.ts');
  const { buildHistory, decodePoolHistory } = await load('data/history.ts');
  const { buildPredictionCsv, parsePredictionCsv } = await load('data/prediction-csv.ts');
  const snapshot = JSON.parse(fs.readFileSync('src/products/risk/data/pool-snapshot.json'));
  const observations = JSON.parse(fs.readFileSync('src/products/risk/data/asset-snapshot.json'));
  assert.equal(POOL_SERIES.length, 35);
  assert.equal(POOL_SERIES.filter(s => !s.points.length).length, 1);
  assert.equal(POOL_HISTORY['No to All'].length, 11);
  assert.equal(POOL_SERIES.reduce((sum, s) => sum + s.points.length, 0), snapshot.data.flat().length);
  for (let index = 0; index < 35; index++) {
    assert.equal(POOL_SERIES[index].points.length, snapshot.data[index].length);
    for (let p = 0; p < snapshot.data[index].length; p++) {
      const raw = snapshot.data[index][p], point = POOL_SERIES[index].points[p];
      assert.equal(point.token0Id, raw.pool.token0.id); assert.equal(point.token1Id, raw.pool.token1.id);
      assert.equal(point.poolId, raw.pool.id); assert.equal(point.poolLiquidity, raw.pool.liquidity);
      assert.equal(point.pointLiquidity, raw.liquidity ?? null);
      for (const key of ['sqrtPrice', 'token0Price', 'token1Price', 'periodStartUnix']) assert.equal(point[key], raw[key]);
    }
  }
  for (const asset of RISK_ASSETS) {
    const row = observations.find(r => r.ticker === asset.ticker);
    assert.equal(asset.pdAnn, Number(row.marketPd.replace('%', '')));
    assert.equal(asset.pdAnn, asset.marketPd); assert.equal(asset.pdAnn, asset.consensusPd);
    const history = buildHistory(asset);
    assert(history.length > 0); assert(Math.abs(history.at(-1).marketPd - asset.marketPd) < 1e-10);
    assert(history.every((point, i) => point.marketPd >= 0 && point.marketPd <= 100 && (!i || point.timestamp >= history[i - 1].timestamp)));
    const base = history[0];
    const q = Math.min(Number(base.source.token0Price), Number(base.source.token1Price));
    assert.equal(base.poolPrice, q);
  }
  assert.equal(decodePoolHistory('unknown', 2).length, 0);
  assert.equal(RISK_ASSETS.find(a => a.ticker === 'NUSD').avg, null);
  assert.equal(RISK_ASSETS.find(a => a.ticker === 'LBTC').avg, null);
  for (const value of [0, 0.00000001, 0.001, 2, 50, 99.999, 100]) assert(Math.abs(math.quarterlyToAnnualPd(math.annualToQuarterlyPd(value)) - value) < 1e-10);
  for (const target of [0, 0.0001, 1, 46.52, 99.999, 100]) {
    const estimates = math.scaleEstimatesToPortfolioSurvival(RISK_ASSETS, {}, target);
    assert(Math.abs(math.portfolioSurvivalFromEstimates(RISK_ASSETS, estimates) * 100 - target) < 1e-8);
  }
  for (const target of [0.000001, 99.999999]) {
    assert(Math.abs(math.portfolioSurvivalFromEstimates(RISK_ASSETS, math.scaleEstimatesToPortfolioSurvival(RISK_ASSETS, {}, target)) * 100 - target) < 1e-8);
  }
  assert.equal(math.hazardAtHorizon(100), Infinity);
  assert(Math.abs(Object.values(math.hazardShares(RISK_ASSETS)).reduce((a, b) => a + b, 0) - 1) < 1e-12);
  let previous = -1;
  for (let position = 0; position <= 1000; position++) { const value = math.predictionSliderPd(position); assert(value >= previous); previous = value; }
  const csv = buildPredictionCsv(RISK_ASSETS, {}, true);
  assert.equal(csv.trim().split('\n').length, 35);
  const parsed = parsePredictionCsv(csv, RISK_ASSETS);
  assert.equal(parsed.errors.length, 0); assert.equal(parsed.loadedCount, 33);
  for (const asset of RISK_ASSETS) assert(Math.abs(parsed.estimates[asset.id] - asset.pdAnn) < 0.0001);
  console.log('PASS: all original pool fields, 35 series, 33 canonical values, endpoints, missing series, math boundaries and CSV round trip');

  const { SourceDataPanel } = await load('components/SourceDataPanel.tsx');
  const sourceHtml = renderToStaticMarkup(React.createElement(SourceDataPanel));
  assert(sourceHtml.includes('Empty API series')); assert(sourceHtml.includes('No to All')); assert(sourceHtml.includes('token0Price')); assert(sourceHtml.includes('questionId'));
  const { MarketContext } = await load('components/MarketContext.tsx');
  const upcomingHtml = renderToStaticMarkup(React.createElement(MarketContext, { roundId: 'q4-2026', onRoundChange() {} }));
  assert(upcomingHtml.includes('Terms not published')); assert(!upcomingHtml.includes('Trading open'));
  const { DataSkeleton } = await load('components/DataBoundary.tsx');
  for (const view of ['assets', 'history', 'details', 'submission']) assert(renderToStaticMarkup(React.createElement(DataSkeleton, { view })).includes('aria-busy="true"'));
  console.log('PASS: source inspection, unavailable series, explicit upcoming status and four accessible loading surfaces');

  let loaded, resolveSlow;
  const csvHook = await harness('components/CsvPredictionModal.tsx', 'CsvPredictionModal', { assets: RISK_ASSETS, open: true, onClose() {}, onLoad(values, count) { loaded = { values, count }; } });
  const input = () => find(csvHook.get(), element => element.type === 'input' && element.props.type === 'file');
  const file = { name: 'draft.csv', size: 90, text: () => new Promise(resolve => { resolveSlow = resolve; }) };
  const pending = input().props.onChange({ target: { files: [file] } }); await csvHook.flush();
  assert(find(csvHook.get(), element => element.type === 'button' && element.props.children?.[1] === ' Load predictions').props.disabled);
  await input().props.onChange({ target: { files: [{ name: 'bad.txt', size: 3 }] } }); await csvHook.flush();
  resolveSlow('asset,probability\nweETH,3%'); await pending; await csvHook.flush();
  assert(find(csvHook.get(), element => element.props?.role === 'alert'));
  await input().props.onChange({ target: { files: [{ name: 'good.csv', size: 30, text: async () => 'asset,probability\nweETH,3%' }] } }); await csvHook.flush();
  const loadButton = find(csvHook.get(), element => element.type === 'button' && element.props.children?.[1] === ' Load predictions');
  assert.equal(loadButton.props.disabled, false); loadButton.props.onClick(); await csvHook.flush();
  assert.equal(loaded.count, 1); assert.equal(loaded.values.weeth, 3);
  assert.equal(find(csvHook.get(), element => element.type === 'strong' && element.props.children === 'Drop a CSV here').props.children, 'Drop a CSV here');
  const pendingClose = input().props.onChange({ target: { files: [file] } }); await csvHook.flush(); csvHook.update({ open: false });
  resolveSlow('asset,probability\nweETH,4%'); await pendingClose; csvHook.update({ open: true }); await csvHook.flush();
  assert(!find(csvHook.get(), element => element.type === 'span' && element.props.children === 'Reading file…'));
  csvHook.close();
  console.log('PASS: CSV pending, invalid replacement, stale read cancellation, valid load, reset and close during read');

  const storage = new Map([['seer-theme', 'light']]), listeners = {};
  const window = { localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) }, addEventListener: (key, fn) => listeners[key] = fn, removeEventListener: key => delete listeners[key] };
  const document = { documentElement: { dataset: {}, style: {} } };
  const themeHook = await harness('hooks/useTheme.ts', 'useTheme', {}, { window, document });
  await themeHook.flush(); themeHook.get().toggleTheme(); await themeHook.flush();
  assert.equal(document.documentElement.dataset.theme, 'dark'); assert.equal(storage.get('seer-theme'), 'dark');
  storage.set('seer-theme', 'light'); listeners.storage({ key: 'seer-theme' }); await themeHook.flush();
  assert.equal(themeHook.get().theme, 'light'); assert.equal(document.documentElement.style.colorScheme, 'light');
  themeHook.close();
  let reduced = false, motionChange, canceled = [];
  const media = { get matches() { return reduced; }, addEventListener: (_, fn) => motionChange = fn, removeEventListener() {} };
  const rolling = await harness('components/RollingNumber.tsx', 'RollingNumber', { value: 30 }, { window: { matchMedia: () => media }, performance: { now: () => 0 }, requestAnimationFrame: () => 17, cancelAnimationFrame: id => canceled.push(id) });
  await rolling.flush(); rolling.update({ value: 60 }); await rolling.flush(); reduced = true; motionChange(); await rolling.flush();
  assert(canceled.includes(17)); assert.equal(rolling.get().props.children[0], '60.00'); rolling.close();
  console.log('PASS: theme toggle, canonical persistence, cross-tab synchronization and live reduced-motion animation cancellation');

  const luminance = hex => { const channels = hex.match(/\w\w/g).map(x => parseInt(x, 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4); return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722; };
  const pairs = [['656570', 'f0f0f3'], ['0c756c', 'f0f0f3'], ['875000', 'fff2dc'], ['a52620', 'ffffff'], ['a0a0ad', '1f1f24'], ['76d6c6', '1f1f24'], ['ffb3ab', '1a1a1e'], ['ffffff', '6c47ff']];
  for (const [foreground, background] of pairs) { const a = luminance(foreground), b = luminance(background); assert((Math.max(a, b) + .05) / (Math.min(a, b) + .05) >= 4.5, `${foreground} on ${background}`); }
  console.log('PASS: light/dark muted, semantic and primary-action token contrast ≥ 4.5:1');

  const { tideCurves } = await load('data/tide.ts');
  for (const horizon of [3, 6, 12]) {
    const curves = tideCurves(RISK_ASSETS, { weeth: 100 }, horizon);
    assert.equal(curves.market.length, 13); assert.equal(curves.market[0], 1);
    assert.equal(curves.months.at(-1), horizon);
    assert.equal(curves.user[0], 1); assert.equal(curves.user.at(-1), 0);
    assert.equal(curves.market.at(-1), math.portfolioSurvival(RISK_ASSETS, horizon));
    assert(curves.market.every((value, i) => !i || value <= curves.market[i - 1]));
    const firstSurvival = RISK_ASSETS.reduce((survival, asset) => survival * math.survivalAtHorizon(buildHistory(asset)[0].marketPd, horizon), 1);
    assert.equal(curves.ghosts[0].at(-1), firstSurvival);
  }
  const { marketOutcomeRows, marketRecordFields } = await load('data/market-record.ts');
  const rawMarket = JSON.parse(fs.readFileSync('src/products/risk/data/seer-market.json'));
  assert.equal(marketOutcomeRows.length, 35);
  assert.equal(marketOutcomeRows.filter(row => row.kind === 'Asset default').length, 33);
  for (const row of marketOutcomeRows) { assert.equal(row.token, rawMarket.wrappedTokens[row.index]); assert.equal(row.payout, rawMarket.payoutNumerators[row.index]); }
  assert.equal(marketRecordFields.find(([key]) => key === 'Outcome supply · raw units')[1], rawMarket.outcomesSupply);
  console.log('PASS: exact-horizon survival curves, real historical ridges, extreme targets and complete market outcome reconciliation');

  const { marketEntities } = await load('data/entities.ts');
  const entityList = marketEntities('weETH');
  assert(entityList.some(entity => entity.label === 'Parent collection'));
  assert(entityList.every(entity => /^https:\/\/gnosisscan.io\/(address|tx)\/0x/.test(entity.href)));
  let entityUrl = new URL('https://seer.test/risk/asset/weeth');
  const events = {}, copies = [];
  const entityWindow = { location: { get href() { return entityUrl.href; }, get search() { return entityUrl.search; } }, history: { state: {}, replaceState(_state, _title, url) { entityUrl = new URL(url, entityUrl); } }, addEventListener(key, fn) { events[key] = fn; }, removeEventListener(key) { delete events[key]; } };
  const entityHook = await harness('components/EntityInspector.tsx', 'EntityInspector', { entities: entityList, onCopy: async (value, label) => copies.push([value, label]) }, { window: entityWindow, URL });
  const condition = entityList.find(entity => entity.label === 'Condition');
  find(entityHook.get(), e => e.type === 'button' && e.props.title === condition.value).props.onClick(); await entityHook.flush();
  assert.equal(entityUrl.searchParams.get('entity'), condition.value);
  const detail = find(entityHook.get(), e => e.type === 'section' && e.props['aria-label'] === 'Condition details');
  assert(detail); assert.equal(find(detail, e => e.type === 'input').props.value, condition.value);
  await find(detail, e => e.type === 'button' && e.props.children === 'Copy entity link').props.onClick();
  assert(copies.some(([value]) => value.includes('entity=' + condition.value)));
  entityUrl = new URL('https://seer.test/risk/asset/weeth'); events.popstate(); await entityHook.flush();
  assert(!find(entityHook.get(), e => e.type === 'section'));
  entityHook.close();
  console.log('PASS: entity identifiers, real event/contract outbound links, canonical copy links and Back/Forward synchronization');

  const { LoadBoundary } = await load('components/DataBoundary.tsx');
  let retries = 0;
  const boundary = new LoadBoundary({ view: 'history', onRetry() { retries++; } });
  boundary.state = { error: true };
  const recovery = boundary.render();
  assert.equal(recovery.props.role, 'alert');
  find(recovery, e => e.type === 'button' && e.props.children === 'Retry this view').props.onClick(); assert.equal(retries, 1);
  const tooltip = await harness('components/Tooltip.tsx', 'Tooltip', { label: 'PD help', children: 'Published terms define default.' });
  find(tooltip.get(), e => e.type === 'button').props.onFocus(); await tooltip.flush();
  assert(find(tooltip.get(), e => e.props?.role === 'tooltip'));
  let stopped = false;
  find(tooltip.get(), e => e.type === 'button').props.onKeyDown({ key: 'Escape', stopPropagation() { stopped = true; } }); await tooltip.flush();
  assert(stopped); assert(!find(tooltip.get(), e => e.props?.role === 'tooltip')); tooltip.close();
  const touchTooltip = await harness('components/Tooltip.tsx', 'Tooltip', { label: 'PD help', children: 'Terms' });
  const touchButton = () => find(touchTooltip.get(), e => e.type === 'button');
  touchButton().props.onPointerDown(); touchButton().props.onFocus(); await touchTooltip.flush(); touchButton().props.onClick(); await touchTooltip.flush();
  assert(find(touchTooltip.get(), e => e.props?.role === 'tooltip'));
  touchButton().props.onPointerDown(); touchButton().props.onClick(); await touchTooltip.flush(); assert(!find(touchTooltip.get(), e => e.props?.role === 'tooltip')); touchTooltip.close();
  const { PredictionActionPanel } = await load('components/PredictionActionPanel.tsx');
  for (const roundStatus of ['ended', 'upcoming', 'active']) {
    const panel = PredictionActionPanel({ assets: RISK_ASSETS, estimates: { weeth: 3 }, lifecycle: 'idle', roundStatus, walletAddress: '0x' + '1'.repeat(40) });
    assert(find(panel, e => e.type === 'button' && e.props.children?.includes?.('Predict selected')).props.disabled);
    assert(find(panel, e => e.props?.className === 'risk-predict-mobile-action'));
  }
  const readonlyStorage = { getItem() { return null; }, setItem() { throw new Error('Storage disabled'); } };
  const estimateHook = await harness('hooks/useUserEstimates.ts', 'useUserEstimates', {}, { window: { localStorage: readonlyStorage } });
  estimateHook.get().setEstimate('weeth', 3); await estimateHook.flush(); assert.equal(estimateHook.get().estimates.weeth, 3);
  estimateHook.get().setEstimate('weeth', NaN); await estimateHook.flush(); assert.equal(estimateHook.get().estimates.weeth, 3);
  estimateHook.get().setEstimates({ weeth: 4, unknown: 2, usdc: -1 }); await estimateHook.flush();
  assert.equal(estimateHook.get().estimates.weeth, 4); assert.equal(Object.keys(estimateHook.get().estimates).length, 1); estimateHook.close();
  console.log('PASS: visible retry recovery, focus/Escape tooltip policy, honest submission gates and unavailable-storage editing');

  const handlers = {};
  let classes = new Set(), closed = 0;
  const fakeDocument = { activeElement: null, body: { classList: { add(value) { classes.add(value); }, remove(value) { classes.delete(value); } } },
    querySelector() { return shell; }, addEventListener(key, fn) { handlers[key] = fn; }, removeEventListener(key) { delete handlers[key]; } };
  class Element {
    constructor() { this.inert = false; this.nodeType = 1; this.tabIndex = 0; this.isConnected = true; }
    getClientRects() { return [1]; }
    closest() { return this.inert ? this : null; }
    focus() { fakeDocument.activeElement = this; }
  }
  const previousFocus = new Element(), background = new Element(), layer = new Element();
  const first = new Element(), last = new Element(), panel = new Element();
  panel.parentElement = layer; panel.querySelector = () => null; panel.querySelectorAll = () => [first, last]; panel.contains = element => [panel, first, last].includes(element);
  const shell = { nodeType: 1, children: [background, layer] }; fakeDocument.activeElement = previousFocus;
  const modal = await harness('components/Modal.tsx', 'Modal', { open: false, label: 'CSV', onClose() { closed++; } }, { document: fakeDocument, HTMLElement: Element });
  modal.attachRef(panel); modal.update({ open: true });
  assert.equal(fakeDocument.activeElement, first); assert.equal(background.inert, true); assert.equal(layer.inert, false); assert(classes.has('risk-modal-open'));
  let prevented = 0;
  handlers.keydown({ key: 'Tab', shiftKey: true, preventDefault() { prevented++; } }); assert.equal(fakeDocument.activeElement, last);
  handlers.keydown({ key: 'Tab', shiftKey: false, preventDefault() { prevented++; } }); assert.equal(fakeDocument.activeElement, first);
  fakeDocument.activeElement = previousFocus; handlers.focusin({ target: previousFocus }); assert.equal(fakeDocument.activeElement, first);
  handlers.keydown({ key: 'Escape', preventDefault() {}, stopPropagation() {} }); assert.equal(closed, 1);
  modal.close(); assert.equal(background.inert, false); assert.equal(fakeDocument.activeElement, previousFocus); assert(!classes.has('risk-modal-open')); assert.equal(prevented, 2);
  console.log('PASS: modal focus trap, outside-focus recovery, Escape dismissal, inert background and focus restoration');
})().catch(error => { console.error(error); process.exitCode = 1; });
