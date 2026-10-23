const assert = require('node:assert/strict');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const req = createRequire(process.cwd() + '/package.json');
const esbuild = req('esbuild');
const React = req('react');
const { renderToStaticMarkup } = req('react-dom/server');
async function compile(file) {
  return (await esbuild.build({ entryPoints: [file], bundle: true, platform: 'node', format: 'cjs', external: ['react', 'react-dom', 'react-dom/server', 'react/jsx-runtime'], write: false })).outputFiles[0].text;
}
function harness(code, env, exportName) {
  let values = [], effects = [], cursor = 0, pending = [], result, dirty = false;
  const hooks = {
    useState(initial) { const i = cursor++; if (!(i in values)) values[i] = typeof initial === 'function' ? initial() : initial; return [values[i], next => { values[i] = typeof next === 'function' ? next(values[i]) : next; dirty = true; }]; },
    useRef(initial) { const i = cursor++; if (!(i in values)) values[i] = { current: initial }; return values[i]; },
    useCallback(fn) { cursor++; return fn; },
    useEffect(fn, deps) { const i = cursor++; const previous = effects[i]; if (!previous || deps.some((value, j) => value !== previous.deps[j])) { pending.push(() => { previous?.cleanup?.(); effects[i] = { deps, cleanup: fn() }; }); } },
  };
  const module = { exports: {} };
  vm.runInNewContext(code, { ...env, module, exports: module.exports, require: name => name === 'react' ? hooks : req(name), URLSearchParams, TextEncoder, console });
  const render = () => { dirty = false; cursor = 0; result = module.exports[exportName](); const current = pending; pending = []; current.forEach(fn => fn()); };
  const flush = async () => { for (let i = 0; i < 8; i++) { await new Promise(resolve => setImmediate(resolve)); if (dirty) render(); } return result; };
  render();
  return { flush, get: () => result };
}
function browser(url, provider) {
  let location = new URL(url); const listeners = {};
  return {
    get location() { return location; }, ethereum: provider,
    addEventListener(event, fn) { (listeners[event] ??= []).push(fn); },
    removeEventListener(event, fn) { listeners[event] = (listeners[event] || []).filter(x => x !== fn); },
    emit(event) { (listeners[event] || []).forEach(fn => fn()); },
    history: { replaceState(_, __, url) { location = new URL(url, location); }, pushState(_, __, url) { location = new URL(url, location); } },
  };
}
(async () => {
  const source = await compile('src/products/risk/data/assets.ts');
  const module = { exports: {} }; vm.runInNewContext(source, { module, exports: module.exports, require: req });
  const { RISK_ASSETS } = module.exports;
  assert.equal(RISK_ASSETS.length, 33);
  for (const [group, size] of [['ETH Based', 7], ['USD Based', 13], ['BTC Based', 6], ['Funds Based', 7]]) assert.equal(RISK_ASSETS.filter(a => a.group === group).length, size);
  assert(RISK_ASSETS.every(a => a.marketUrl.endsWith('0xc84786b06390f11ded0dd362e27fc881b540e6f2')));
  const profiles = JSON.parse(require('node:fs').readFileSync('src/products/risk/data/credora-profiles.json'));
  assert.equal(Object.keys(profiles).length, 32);
  assert.equal(profiles.eeth.credora_slug, 'eeth');
  assert.equal(profiles.nusd.avg_risk_score, null);
  assert(!profiles.lbtc);
  const ratingCode = await compile('src/products/risk/components/RiskRatingPanel.tsx');
  const ratingModule = { exports: {} }; vm.runInNewContext(ratingCode, { module: ratingModule, exports: ratingModule.exports, require: req });
  for (const asset of RISK_ASSETS) {
    const html = renderToStaticMarkup(React.createElement(ratingModule.exports.RiskRatingPanel, { asset }));
    assert(html.includes('Credora by RedStone'));
    if (asset.ticker === 'LBTC') assert(html.includes('risk rating not published'));
    else { assert(html.includes('app.credora.network/assets/')); assert(html.includes('role="tooltip"')); }
  }
  console.log('PASS: 33 dossier ratings, published metrics, missing ratings, canonical groups and real market links');
  const urlCode = await compile('src/products/risk/data/urlState.ts');
  for (const section of ['overview', 'assets', 'history', 'participate']) {
    const window = browser(`https://seer.test/risk/asset/weeth?section=${section}&q=eth&assets=weeth,steth&selection=focus&horizon=8`);
    const hook = harness(urlCode, { window }, 'useRiskUrlState'); await hook.flush();
    assert.equal(hook.get().state.dossier, 'weeth'); assert.equal(hook.get().state.section, section); assert.equal(hook.get().state.horizon, 8);
    assert.equal(window.location.pathname, '/risk/asset/weeth');
    hook.get().update({ dossier: null }, 'replace'); await hook.flush();
    assert.equal(hook.get().state.query, 'eth'); assert.equal(hook.get().state.assets.length, 2);
    assert.equal(window.location.pathname, { overview: '/risk', assets: '/risk/assets', history: '/risk/history', participate: '/risk/predict' }[section]);
  }
  for (const [path, section] of [['/risk/assets', 'assets'], ['/risk/history', 'history'], ['/risk/predict', 'participate']]) {
    const window = browser('https://seer.test' + path); const hook = harness(urlCode, { window }, 'useRiskUrlState'); await hook.flush(); assert.equal(hook.get().state.section, section); assert.equal(hook.get().state.horizon, 12);
    window.history.replaceState({}, '', '/risk/asset/usdc?section=history'); window.emit('popstate'); await hook.flush(); assert.equal(hook.get().state.dossier, 'usdc'); assert.equal(hook.get().state.section, 'history');
  }
  console.log('PASS: dossier reloads, all originating routes, preserved filters/selection, default horizon, popstate');
  const walletCode = await compile('src/products/risk/hooks/useWallet.ts');
  const first = '0x' + '1'.repeat(40), second = '0x' + '2'.repeat(40);
  let accounts = [], chain = '0x1', reject = false; const listeners = {}; const calls = [];
  const provider = { async request({ method, params }) { calls.push({method, params}); if (reject) throw { code: 4001 }; if (method === 'eth_accounts' || method === 'eth_requestAccounts') return accounts; if (method === 'eth_chainId') return chain; if (method === 'wallet_switchEthereumChain') { chain = '0x64'; return null; } if (method === 'personal_sign') return '0x' + 'a'.repeat(130); throw Error(method); }, on(event, fn) { (listeners[event] ??= new Set()).add(fn); }, removeListener(event, fn) { listeners[event].delete(fn); } };
  const window = browser('https://seer.test/risk', provider); const hook = harness(walletCode, { window }, 'useWallet'); await hook.flush(); assert.equal(hook.get().status, 'disconnected');
  accounts = [first]; await hook.get().connect(); await hook.flush(); assert.equal(hook.get().status, 'wrong-network');
  await hook.get().switchNetwork(); await hook.flush(); assert.equal(hook.get().status, 'connected');
  accounts = [second]; listeners.accountsChanged.forEach(fn => fn(accounts)); await hook.flush(); assert.equal(hook.get().address, second);
  chain = '0x1'; listeners.chainChanged.forEach(fn => fn(chain)); await hook.flush(); assert.equal(hook.get().status, 'wrong-network');
  reject = true; await hook.get().switchNetwork(); await hook.flush(); assert.equal(hook.get().status, 'rejected'); reject = false;
  const signature = await hook.get().signMessage('Seer preference'); assert.equal(signature.length, 132); assert(calls.find(c => c.method === 'personal_sign').params[0].startsWith('0x53656572'));
  accounts = [first]; await assert.rejects(hook.get().signMessage('Changed account'), /account changed/);
  hook.get().disconnect(); await hook.flush(); assert.equal(hook.get().address, null); assert.equal(hook.get().status, 'disconnected');
  listeners.accountsChanged.forEach(fn => fn([first])); await hook.flush(); assert.equal(hook.get().address, null);
  const absent = harness(walletCode, { window: browser('https://seer.test/risk') }, 'useWallet'); await absent.flush(); assert.equal(absent.get().status, 'unavailable');
  assert(!calls.some(c => /sendTransaction|signTransaction/.test(c.method)));
  console.log('PASS: wallet account arrays, connect, wrong network, switch, rejection, valid signing, changed-account guard, disconnect, missing provider, no transactions');
})().catch(error => { console.error(error); process.exitCode = 1; });
