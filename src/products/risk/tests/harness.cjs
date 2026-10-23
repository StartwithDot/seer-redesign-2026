const vm = require('node:vm');
const { createRequire } = require('node:module');
const req = createRequire(process.cwd() + '/package.json');
const esbuild = req('esbuild');
const React = req('react');

async function load(path, env = {}, hooks) {
  const code = (await esbuild.build({ entryPoints: ['src/products/risk/' + path], bundle: true, platform: 'node', format: 'cjs',
    external: ['react', 'react-dom', 'react/jsx-runtime'], write: false })).outputFiles[0].text;
  const module = { exports: {} };
  vm.runInNewContext(code, { module, exports: module.exports, require: name => name === 'react' && hooks ? hooks : req(name),
    console, URL, URLSearchParams, TextEncoder, MutationObserver: env.MutationObserver, ...env });
  return module.exports;
}

async function harness(path, name, props = {}, env = {}, args = value => [value]) {
  const values = [], effects = [];
  let pending = [], cursor = 0, tree, dirty = false;
  const hooks = {
    Component: React.Component,
    useState(initial) { const i = cursor++; if (!(i in values)) values[i] = typeof initial === 'function' ? initial() : initial;
      return [values[i], next => { values[i] = typeof next === 'function' ? next(values[i]) : next; dirty = true; }]; },
    useRef(initial) { const i = cursor++; if (!(i in values)) values[i] = { current: initial }; return values[i]; },
    useEffect(fn, deps) { const i = cursor++, previous = effects[i];
      if (!previous || deps.some((value, j) => value !== previous.deps[j])) pending.push(() => { previous?.cleanup?.(); effects[i] = { deps, cleanup: fn() }; }); },
    useCallback(fn) { cursor++; return fn; }, useMemo(fn) { cursor++; return fn(); }, useId() { return 'test-' + cursor++; },
  };
  const module = await load(path, env, hooks);
  const render = () => { dirty = false; cursor = 0; tree = module[name](...args(props)); const jobs = pending; pending = []; jobs.forEach(fn => fn()); };
  const flush = async () => { for (let i = 0; i < 8; i++) { await new Promise(resolve => setImmediate(resolve)); if (dirty) render(); } return tree; };
  render();
  return { get: () => tree, flush, update(next) { props = { ...props, ...next }; render(); }, close() { effects.forEach(e => e?.cleanup?.()); } };
}

function find(tree, predicate) {
  if (!tree || typeof tree !== 'object') return null;
  if (predicate(tree)) return tree;
  for (const child of [tree.props?.children].flat(Infinity)) { const result = find(child, predicate); if (result) return result; }
  return null;
}
module.exports = { load, harness, find, React, req };
