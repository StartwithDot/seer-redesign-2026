import { build } from 'esbuild';
import assert from 'node:assert/strict';
import vm from 'node:vm';

async function compile(relative, globals = {}) {
  const result = await build({ entryPoints: [new URL(relative, import.meta.url).pathname], bundle: true, write: false, format: 'cjs' });
  const module = { exports: {} };
  vm.runInNewContext(result.outputFiles[0].text, { module, exports: module.exports, AbortController, DOMException,
    setTimeout, clearTimeout, ...globals });
  return module.exports;
}
const connection = await compile('../data/wallet-connection.ts');
const address = `0x${'1'.repeat(40)}`;
assert.equal(connection.parseChainId('0xa'), 10);
for (const value of ['10', '0xa-junk', '0x', '0x0', '0x20000000000000', null, 10]) {
  assert.equal(connection.parseChainId(value), null);
}
assert.equal(connection.parseAccounts([address])[0], address);
for (const value of [null, {}, ['invalid'], [address, 123]]) assert.throws(() => connection.parseAccounts(value), /invalid account/);
const provider = { request: async ({ method }) => method === 'eth_accounts' ? [address] : '0xa' };
assert.equal((await connection.readConnection(provider)).chainId, 10);
await assert.rejects(connection.readConnection({ request: async ({ method }) => method === 'eth_accounts' ? [address] : '0xa-junk' }), /invalid network/);
const controller = new AbortController();
const pending = connection.walletRead({ request: () => new Promise(() => {}) }, 'eth_accounts', [], controller.signal);
controller.abort();
await assert.rejects(pending, /cancelled/);
await assert.rejects(connection.walletRead(provider, 'eth_accounts', [], controller.signal), /abort/i);
const timed = await compile('../data/wallet-connection.ts', { setTimeout: callback => setTimeout(callback, 1) });
await assert.rejects(timed.walletRead({ request: () => new Promise(() => {}) }, 'eth_accounts'), /timed out/);
const { readWalletBalances } = await compile('../data/wallet-balances.ts');
const tokenController = new AbortController();
const tokenRead = readWalletBalances({ request: () => new Promise(() => {}) }, address, tokenController.signal);
tokenController.abort();
await assert.rejects(tokenRead, /cancelled/);

let observeChildren;
class Observer {
  constructor(callback) { observeChildren = callback; }
  observe() {}
  disconnect() { observeChildren = undefined; }
}
const makeDoc = () => ({ body: { children: [], style: { overflow: 'scroll' } } });
const { createModalStack } = await compile('../state/modal-stack.ts', { document: makeDoc(), MutationObserver: Observer });
for (const closeParentFirst of [false, true]) {
  const doc = makeDoc();
  const app = { inert: false }, prelocked = { inert: true }, layer1 = { inert: false }, layer2 = { inert: false };
  doc.body.children.push(app, prelocked, layer1);
  const stack = createModalStack(doc);
  const panel1 = {}, panel2 = {};
  const close1 = stack.register(panel1, layer1);
  assert.equal(app.inert, true);
  assert.equal(layer1.inert, false);
  doc.body.children.push(layer2);
  const close2 = stack.register(panel2, layer2);
  assert.equal(layer1.inert, true);
  assert.equal(layer2.inert, false);
  assert.equal(stack.isTop(panel1), false);
  const late = { inert: false };
  doc.body.children.push(late);
  observeChildren();
  assert.equal(late.inert, true, 'New body children cannot escape modal isolation');
  if (closeParentFirst) {
    assert.equal(close1(), false);
    assert.equal(doc.body.style.overflow, 'hidden');
    assert.equal(stack.isTop(panel2), true);
    close2();
  } else {
    assert.equal(close2(), true);
    assert.equal(stack.isTop(panel1), true);
    assert.equal(layer1.inert, false);
    assert.equal(app.inert, true);
    close1();
  }
  assert.equal(close1(), false, 'Cleanup is idempotent');
  assert.equal(app.inert, false);
  assert.equal(prelocked.inert, true, 'Original inert values survive the entire stack');
  assert.equal(late.inert, false);
  assert.equal(doc.body.style.overflow, 'scroll', 'Original scrolling is restored');
}
console.log('Pass 11 checks passed: strict wallet responses, read timeout/cancellation, balance cancellation, nested and out-of-order dialogs, dynamic background isolation, original lock restoration.');
