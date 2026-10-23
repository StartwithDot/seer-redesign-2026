const assert = require('node:assert/strict');
const { load, harness, find } = require('./harness.cjs');
const address = '0x' + '1'.repeat(40);
const otherAddress = '0x' + '2'.repeat(40);
const signature = '0x' + 'a'.repeat(130);
const key = 'risk-notification-request';
function environment() {
  const values = new Map(), handlers = {};
  return { values, handlers, window: {
    location: { origin: 'https://seer.test' },
    localStorage: { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) },
    addEventListener: (event, listener) => handlers[event] = listener,
    removeEventListener: event => delete handlers[event],
  } };
}
async function notificationHook(wallet, env = environment()) {
  return { hook: await harness('hooks/useNotificationPreference.ts', 'useNotificationPreference',
    { wallet, open: true }, env, props => [props.wallet, props.open]), env };
}
(async () => {
  const { readNotificationPreference, notificationMessage } = await load('data/notification-preference.ts');
  const valid = { email: 'risk@example.com', address, signature, createdAt: '2026-10-23T12:00:00.000Z' };
  const env = environment(); env.values.set(key, JSON.stringify(valid));
  assert.equal(readNotificationPreference(env.window.localStorage, address).email, valid.email);
  assert.equal(readNotificationPreference(env.window.localStorage, otherAddress), null);
  for (const invalid of [[], null, { ...valid, email: 'invalid' }, { ...valid, signature: '0x123' }, { ...valid, createdAt: 'no date' }]) {
    env.values.set(key, JSON.stringify(invalid)); assert.equal(readNotificationPreference(env.window.localStorage, address), null);
  }
  assert.equal(readNotificationPreference({ getItem() { throw Error('blocked'); } }, address), null);
  assert(notificationMessage(valid.email, address, 'https://seer.test', valid.createdAt).includes('does not subscribe to email delivery'));

  let resolve, calls = 0;
  const wallet = { address, hasProvider: true, signMessage() { calls++; return new Promise(done => resolve = done); } };
  const { hook, env: signingEnv } = await notificationHook(wallet);
  hook.get().setEmail('risk@example.com'); await hook.flush();
  const first = hook.get().sign(); const duplicate = hook.get().sign(); await hook.flush();
  assert.equal(calls, 1); assert.equal(hook.get().status, 'signing');
  hook.update({ wallet: { ...wallet, address: otherAddress } }); await hook.flush();
  resolve(signature); await first; await duplicate; await hook.flush();
  assert.equal(signingEnv.values.has(key), false); assert.equal(hook.get().savedRequest, null);
  hook.close();

  const closing = await notificationHook(wallet);
  closing.hook.get().setEmail('risk@example.com'); await closing.hook.flush();
  const cancelled = closing.hook.get().sign(); await closing.hook.flush();
  closing.hook.update({ open: false }); await closing.hook.flush();
  resolve(signature); await cancelled; await closing.hook.flush();
  assert.equal(closing.env.values.has(key), false); closing.hook.close();

  const success = await notificationHook({ ...wallet, signMessage: async () => signature });
  success.hook.get().setEmail('risk@example.com'); await success.hook.flush();
  await success.hook.get().sign(); await success.hook.flush();
  assert.equal(success.hook.get().status, 'saved'); assert(success.env.values.has(key));
  success.env.window.localStorage.removeItem = () => { throw Error('storage blocked'); };
  success.hook.get().remove(); await success.hook.flush();
  assert.equal(success.hook.get().status, 'error'); assert(success.hook.get().savedRequest);
  success.env.values.delete(key); success.env.handlers.storage({ key }); await success.hook.flush();
  assert.equal(success.hook.get().savedRequest, null); success.hook.close();

  const unavailable = environment();
  unavailable.window.localStorage.setItem = () => { throw Error('Storage full'); };
  const failure = await notificationHook({ ...wallet, signMessage: async () => signature }, unavailable);
  failure.hook.get().setEmail('risk@example.com'); await failure.hook.flush();
  await failure.hook.get().sign(); await failure.hook.flush();
  assert.equal(failure.hook.get().status, 'error'); assert.equal(failure.hook.get().savedRequest, null); failure.hook.close();
  console.log('PASS: signed preference validation, account/close cancellation, duplicate guards, real signature saving, storage errors and cross-tab removal');

  const { predictionAvailability, restingPredictionState } = await load('data/prediction-state.ts');
  for (const round of ['ended', 'upcoming', 'active']) {
    for (const count of [0, 1, 33]) {
      const gate = predictionAvailability(round, count, count);
      assert.equal(gate.allowed, false); assert(gate.reason.length > 20);
    }
  }
  assert.equal(restingPredictionState('ended', 3), 'ended');
  assert.equal(restingPredictionState('active', 0), 'idle');
  assert.equal(restingPredictionState('active', 1), 'editing-asset');
  const { RISK_ASSETS } = await load('data/assets.ts');
  const desk = await harness('components/PredictionDesk.tsx', 'PredictionDesk', {
    assets: RISK_ASSETS, estimates: {}, roundStatus: 'ended', walletAddress: null, walletOpen: false, walletStatus: 'disconnected',
    onEstimateChange() {}, onEstimatesChange() {}, onConnect() {}, onDetails() {},
  });
  const state = () => find(desk.get(), e => e.props?.lifecycle)?.props.lifecycle;
  assert.equal(state(), 'ended');
  desk.update({ walletOpen: true }); await desk.flush(); assert.equal(state(), 'wallet-connect');
  desk.update({ walletOpen: false }); await desk.flush(); assert.equal(state(), 'ended');
  desk.update({ walletAddress: address, walletOpen: true }); await desk.flush(); assert.equal(state(), 'ended');
  desk.update({ walletOpen: false }); await desk.flush(); assert.equal(state(), 'ended'); desk.close();
  console.log('PASS: shared submission gates and header-wallet lifecycle without stale or repeated transitions');

  const properties = new Map(), listeners = {}, frames = new Map();
  let nextFrame = 0, scrolled = 0;
  class Element { matches() { return true; } scrollIntoView() { scrolled++; } }
  const input = new Element();
  const panel = { contains: element => element === input, parentElement: { style: {
    setProperty: (name, value) => properties.set(name, value), removeProperty: name => properties.delete(name),
  } } };
  const viewport = { height: 420, offsetTop: 24,
    addEventListener: (name, fn) => listeners[name] = fn, removeEventListener: name => delete listeners[name] };
  const viewportEnv = { HTMLElement: Element, document: { activeElement: input }, window: { visualViewport: viewport,
    requestAnimationFrame(fn) { frames.set(++nextFrame, fn); return nextFrame; }, cancelAnimationFrame: id => frames.delete(id) } };
  const flushFrames = () => { for (const [id, fn] of frames) { frames.delete(id); fn(); } };
  const sheet = await harness('hooks/useDialogViewport.ts', 'useDialogViewport', { open: true, panelRef: { current: panel } },
    viewportEnv, props => [props.open, props.panelRef]);
  flushFrames(); assert.equal(properties.get('--risk-visible-height'), '420px');
  assert.equal(properties.get('--risk-visible-top'), '24px'); assert.equal(scrolled, 1);
  viewport.height = 300; listeners.resize(); listeners.scroll(); assert.equal(frames.size, 1);
  flushFrames(); assert.equal(properties.get('--risk-visible-height'), '300px');
  listeners.resize(); sheet.close();
  assert.equal(frames.size, 0); assert.equal(properties.size, 0); assert.equal(Object.keys(listeners).length, 0);
  console.log('PASS: mobile keyboard viewport sizing, focus visibility, pooled frames and complete sheet cleanup');
})().catch(error => { console.error(error); process.exitCode = 1; });
