const assert = require('node:assert/strict');
const { load, harness, find, React, req } = require('./harness.cjs');
const { renderToStaticMarkup } = req('react-dom/server');

(async () => {
  const { RISK_ASSETS } = await load('data/assets.ts');
  const { sortRiskAssets } = await load('data/asset-sort.ts');
  const grades = ['D', '', 'AA', 'A-', 'AAA', 'A', 'A+', 'BBB'];
  const sorted = sortRiskAssets(grades.map((grade, i) => ({ ...RISK_ASSETS[0], grade, ticker: String(i) })), 'grade');
  assert.equal(sorted.map(asset => asset.grade).join(','), 'AAA,AA,A+,A,A-,BBB,D,');
  const { assetRiskRank } = await load('data/asset-rank.ts');
  const { AssetMobileList } = await load('components/AssetMobileList.tsx');
  let opened, toggled;
  const mobile = AssetMobileList({ assets: RISK_ASSETS, estimates: { weeth: 9 }, horizon: 3,
    selected: ['weeth'], onOpen: id => opened = id, onToggle: id => toggled = id });
  const html = renderToStaticMarkup(mobile);
  assert(html.includes('Peer / overall risk rank')); assert(html.includes('Your PD')); assert(html.includes('USD Based'));
  for (const asset of RISK_ASSETS) {
    const rank = assetRiskRank(asset);
    assert(rank.overall >= 1 && rank.overall <= 33); assert(rank.peer >= 1 && rank.peer <= rank.peerCount);
    find(mobile, e => e.type === 'button' && find(e, x => x.type === 'strong' && x.props.children === asset.ticker)).props.onClick();
    assert.equal(opened, asset.id);
    find(mobile, e => e.type === 'button' && e.props['aria-label'] === `${asset.id === 'weeth' ? 'Remove' : 'Add'} ${asset.ticker} focus`).props.onClick();
    assert.equal(toggled, asset.id);
  }
  console.log('PASS: grade modifier/missing ordering and all 33 mobile dossier/focus actions, ranks and estimate fields');

  const { oracleRecords, REALITY_DEPLOYMENT, oracleStatus } = await load('data/provenance.ts');
  const { OracleProvenance } = await load('components/OracleProvenance.tsx', {}, { useState: value => [value, () => {}] });
  const provenance = OracleProvenance({ initiallyOpen: true });
  const provenanceHtml = renderToStaticMarkup(provenance);
  assert.equal(provenance.props.open, true); assert(provenanceHtml.includes('Not published')); assert(provenanceHtml.includes('No dispute recorded'));
  for (const question of oracleRecords) {
    const url = new URL(question.realityUrl);
    const parts = url.hash.slice(3).split('/');
    assert.equal(parts[0], 'network'); assert.equal(parts[1], '100'); assert.equal(parts[2], 'question');
    assert.equal(parts[3], REALITY_DEPLOYMENT.address + '-' + question.id);
    assert.equal(new URL(question.arbitratorUrl).pathname, '/address/' + question.arbitrator);
    assert.equal(question.hasAnswer, false); assert.equal(oracleStatus(question), 'No answer recorded');
    assert.equal(oracleStatus({ ...question, best_answer: '0x' + '0'.repeat(64), hasAnswer: true, finalize_ts: 1 }), 'Answer recorded');
    assert.equal(oracleStatus({ ...question, is_pending_arbitration: true }), 'Arbitration pending');
  }
  const context = await harness('components/MarketContext.tsx', 'MarketContext', { roundId: 'q3-2026', compact: true, onRoundChange() {} });
  find(context.get(), e => e.type === 'button' && e.props['aria-haspopup'] === 'dialog').props.onClick(); await context.flush();
  assert(find(context.get(), e => e.type?.name === 'MarketProvenance').props.open); context.close();
  console.log('PASS: market resolution disclosure, official Reality.eth hash routing, Kleros contract and truthful zero-answer/dispute states');

  let draft = {}, connects = 0;
  const props = { assets: RISK_ASSETS, estimates: {}, walletAddress: null, walletOpen: false, walletStatus: 'disconnected', roundStatus: 'ended',
    onConnect() { connects++; }, onDetails() {}, onEstimatesChange(next) { draft = next; }, onEstimateChange(id, value) { draft = { ...draft, [id]: value }; } };
  const desk = await harness('components/PredictionDesk.tsx', 'PredictionDesk', props);
  const panel = () => find(desk.get(), e => e.type?.name === 'PredictionActionPanel');
  const list = () => find(desk.get(), e => e.type?.name === 'PredictionAssetList');
  assert.equal(panel().props.lifecycle, 'ended');
  list().props.onEstimateChange('weeth', 4); desk.update({ estimates: draft }); await desk.flush();
  assert.equal(panel().props.lifecycle, 'editing-asset');
  desk.update({ walletOpen: true }); panel().props.onConnect(); await desk.flush();
  assert.equal(panel().props.lifecycle, 'wallet-connect'); assert.equal(connects, 1);
  desk.update({ walletOpen: false }); await desk.flush();
  assert.equal(panel().props.lifecycle, 'ended'); assert.equal(draft.weeth, 4);
  assert(find(desk.get(), e => e.props?.className === 'risk-predict-notice').props.children.includes('closed'));
  desk.update({ walletOpen: true }); panel().props.onConnect(); await desk.flush(); desk.update({ walletStatus: 'rejected' }); await desk.flush();
  assert.equal(panel().props.lifecycle, 'ended'); assert.equal(draft.weeth, 4);
  desk.update({ walletStatus: 'connected', walletAddress: '0x' + '1'.repeat(40) });
  panel().props.onSubmit('selected'); await desk.flush(); assert.equal(panel().props.lifecycle, 'ended');
  panel().props.onReset(); await desk.flush(); assert.equal(Object.keys(draft).length, 0); desk.close();
  console.log('PASS: edit, cancelled/rejected wallet, connected closed-round gate and reset preserve valid lifecycle and never submit');

  const emptyList = await harness('components/PredictionAssetList.tsx', 'PredictionAssetList', { assets: [], estimates: {}, onDetails() {}, onEstimateChange() {} });
  assert(!find(emptyList.get(), e => e.type === 'button' && e.props.children === 'Show all selected assets'));
  assert(find(emptyList.get(), e => e.type === 'button' && e.props.children === 'Expand all').props.disabled); emptyList.close();
  let target, observerCallback;
  const timers = new Map(); let nextTimer = 0;
  const focusDocument = { body: {}, getElementById: () => target };
  class Observer { constructor(fn) { observerCallback = fn; } observe() {} disconnect() {} }
  const focusWindow = { setTimeout(fn) { const id = ++nextTimer; timers.set(id, fn); return id; }, clearTimeout(id) { timers.delete(id); }, matchMedia: () => ({ matches: true }) };
  const { focusRiskSection } = await load('data/route-focus.ts', { document: focusDocument, window: focusWindow, MutationObserver: Observer });
  focusRiskSection('assets'); focusRiskSection('history');
  let focusCount = 0, scrollOptions;
  target = { focus() { focusCount++; }, scrollIntoView(options) { scrollOptions = options; } };
  observerCallback(); assert.equal(focusCount, 1); assert.equal(scrollOptions.behavior, 'auto'); assert.equal(timers.size, 0);
  console.log('PASS: empty prediction recovery and cancelled lazy-route focus with reduced motion');
})().catch(error => { console.error(error); process.exitCode = 1; });
