const assert = require('node:assert/strict');
const { load, harness, find } = require('./harness.cjs');
(async () => {
  const { RISK_ASSETS } = await load('data/assets.ts');
  const math = await load('data/math.ts');
  assert.equal(math.logarithmicPdPosition(.01), 0);
  assert.equal(math.logarithmicPdPosition(1), 50);
  assert.equal(math.logarithmicPdPosition(100), 100);
  const { parsePredictionCsv } = await load('data/prediction-csv.ts');
  assert(parsePredictionCsv('asset,probability\nUSDC,1.1', RISK_ASSETS).errors.length);
  assert.equal(parsePredictionCsv('asset,probability\nUSDC,1.1%', RISK_ASSETS).estimates.usdc, 1.1);
  assert(Math.abs(parsePredictionCsv('asset,probability\nUSDC,0.011', RISK_ASSETS).estimates.usdc - 1.1) < 1e-12);
  for (const asset of RISK_ASSETS) {
    const spark = await harness('components/AssetSparkline.tsx', 'AssetSparkline', { asset });
    assert(spark.get().props['aria-label'].includes('projected survival'));
    const endpoint = find(spark.get(), node => node.type === 'circle');
    assert(Number.isFinite(endpoint.props.cy));
    const commands = find(spark.get(), node => node.props?.pathLength === 1).props.d;
    const ys = [...commands.matchAll(/[ML] [\d.]+ ([\d.]+)/g)].map(m => Number(m[1]));
    assert.equal(ys.length, 25);
    assert(ys.every((value, i) => !i || value >= ys[i - 1]), asset.ticker + ' survival must drain');
    spark.close();
  }
  const handlers = {};
  const env = { document: { body: {}, querySelector: () => null }, MutationObserver: class { observe() {} disconnect() {} } };
  const visits = [];
  const guide = await harness('components/QuickGuide.tsx', 'QuickGuide', {
    open: true, onClose: () => visits.push('closed'), onNavigate: section => visits.push(section),
  }, env);
  const button = label => find(guide.get(), node => node.type === 'button' && node.props.children === label);
  button('Start guided tour').props.onClick(); await guide.flush();
  assert.equal(guide.get().props.label, 'Risk guided tour');
  assert(button('Previous').props.disabled);
  for (let i = 0; i < 3; i++) { button('Next').props.onClick(); await guide.flush(); }
  button('Finish guide').props.onClick();
  assert.deepEqual(visits, ['overview', 'assets', 'history', 'participate', 'closed']);
  guide.update({ open: false }); await guide.flush();
  guide.update({ open: true }); await guide.flush();
  assert(button('Start guided tour')); guide.close();
  let exports = 0;
  const panel = await harness('components/PredictionActionPanel.tsx', 'PredictionActionPanel', {
    assets: RISK_ASSETS,
    estimates: {},
    lifecycle: 'ended',
    onConnect() {},
    onCsv() {},
    onExport() { exports++; },
    onReset() {},
    onSubmit() {},
    roundStatus: 'ended',
    walletAddress: null,
  });
  const download = find(panel.get(), node => node.type === 'button' && node.props.children === 'Download latest data');
  assert(download, 'Baseline CSV download must remain reachable before edits');
  download.props.onClick();
  assert.equal(exports, 1);
  panel.close();
  console.log('PASS: logarithmic gauge endpoints, strict CSV units, all 33 survival curves, guided tour, and baseline CSV download');
})().catch(error => { console.error(error); process.exitCode = 1; });
