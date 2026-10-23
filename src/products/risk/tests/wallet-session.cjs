const assert = require('node:assert/strict');
const { harness } = require('./harness.cjs');
const address = '0x' + '1'.repeat(40);
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
async function setup() {
  const providerListeners = {}, browserListeners = {}, pending = [];
  let chain = '0x64', accounts = [];
  const provider = {
    isMetaMask: true,
    request({ method }) {
      if (method === 'eth_accounts') return Promise.resolve(accounts);
      if (method === 'eth_requestAccounts' || method === 'wallet_switchEthereumChain') {
        const request = deferred(); pending.push(request); return request.promise.then(value => { if (method === 'eth_requestAccounts') accounts = value; return value; });
      }
      if (method === 'eth_chainId') return Promise.resolve(chain);
      throw Error(method);
    },
    on(event, fn) { providerListeners[event] = fn; },
    removeListener(event) { delete providerListeners[event]; },
  };
  const window = { ethereum: provider, addEventListener(event, fn) { browserListeners[event] = fn; },
    removeEventListener(event) { delete browserListeners[event]; }, dispatchEvent() {} };
  const hook = await harness('hooks/useWallet.ts', 'useWallet', {}, { window, Event: class Event {} });
  await hook.flush();
  return { hook, pending, providerListeners, setChain(value) { chain = value; } };
}
(async () => {
  for (const outcome of ['resolve', 'reject']) {
    const { hook, pending } = await setup();
    const request = hook.get().connect(); await hook.flush();
    assert.equal(hook.get().status, 'connecting');
    hook.get().disconnect(); await hook.flush();
    if (outcome === 'resolve') pending[0].resolve([address]); else pending[0].reject(Error('Late provider failure'));
    await request; await hook.flush();
    assert.equal(hook.get().status, 'disconnected'); assert.equal(hook.get().address, null);
    hook.close();
  }
  const { hook, pending, providerListeners, setChain } = await setup();
  setChain('0x1');
  const connecting = hook.get().connect(); pending[0].resolve([address]); await connecting; await hook.flush();
  assert.equal(hook.get().status, 'wrong-network');
  const switching = hook.get().switchNetwork(); await hook.flush();
  providerListeners.disconnect(); await hook.flush();
  pending[1].reject(Error('Late network failure')); await switching; await hook.flush();
  assert.equal(hook.get().status, 'disconnected'); assert.equal(hook.get().address, null);
  providerListeners.accountsChanged([address]); providerListeners.chainChanged('0x64'); await hook.flush();
  assert.equal(hook.get().status, 'disconnected');
  const reconnecting = hook.get().connect(); setChain('0x64'); pending[2].resolve([address]);
  await reconnecting; await hook.flush(); assert.equal(hook.get().status, 'connected');
  hook.close();
  console.log('PASS: late wallet success/error, disconnect during network switch, stale provider events and explicit reconnection');
})().catch(error => { console.error(error); process.exitCode = 1; });
