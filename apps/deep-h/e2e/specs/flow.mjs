import {assert,poll} from '../lib/harness.mjs';
export function flows(test){
 test('flow','flow.blocked_storage',async t=>{
  await t.page.addInitScript(()=>{for(const key of ['localStorage','sessionStorage'])Object.defineProperty(window,key,{configurable:true,get(){throw new DOMException('Storage blocked','SecurityError');}});});
  await t.go();await t.connect();await t.openProfile();await t.id('profile-name').fill('Deep analyst');await t.id('profile-save').click();await t.id('profile-dialog').waitFor({state:'detached'});await t.openProfile();assert.equal(await t.id('profile-name').inputValue(),'Deep analyst');
 });
 test('flow','flow.onboarding_to_strategy',async t=>{
  await t.go();await t.funded();await t.upload();const order=await t.id('checklist-item').allTextContents();assert.equal(order.length,4);assert(order[0].includes('Wallet')&&order[1].includes('Trade wallet')&&order[2].includes('sUSDS')&&order[3].includes('CSV'));
  assert((await t.id('checklist-item').evaluateAll(es=>es.map(e=>e.dataset.state))).every(s=>s==='done'));await t.id('start-trading').click();await poll(()=>t.id('start-trading').innerText().then(v=>v==='Strategy complete'),'Execute strategy terminal',10000);
  const methods=await t.page.evaluate(()=>window.ethereum.__calls.map(c=>c.method));t.observed.walletMethods=methods;assert(methods.includes('eth_requestAccounts'));assert(methods.includes('eth_sendTransaction'));
 });
 test('flow','flow.wallet_rejection',async t=>{await t.go();await t.page.evaluate(()=>{window.ethereum.__reject=true;});await t.page.locator('.sg-connect').click();await t.page.getByRole('alert').waitFor();assert.equal(await t.id('wallet-button').count(),0);assert.equal(await t.id('setup-counter').innerText(),'Setup 0/3');});
 test('flow','flow.cancel_dialogs',async t=>{await t.go();await t.create();await t.openFunds();await t.id('deposit-amount').fill('10');await t.page.keyboard.press('Escape');await t.openFunds();assert.equal(await t.id('susds-balance').innerText(),'0.0000');await t.page.keyboard.press('Escape');await t.openProfile();await t.id('profile-name').fill('Unsaved name');await t.id('profile-cancel').click();await t.openProfile();assert.equal(await t.id('profile-name').inputValue(),'');});
 test('flow','flow.view_switch_preserves_query',async t=>{
  await t.go('/?sort=name&q=ethereum&iso=0x7cae39d3c40b0db913ba38f61f18173be8105852');const before=new URLSearchParams(t.page.url().split('?')[1]);await t.id('view-tab-swarm').click();assert.equal(await t.id('view-tab-swarm').getAttribute('aria-selected'),'true');assert.equal(await t.id('view-tab-split').getAttribute('aria-selected'),'false');assert.match(t.page.url(),/view=swarm/);
  const after=new URLSearchParams(t.page.url().split('?')[1]);for(const key of ['sort','q','iso'])assert.equal(after.get(key),before.get(key));await t.page.reload();assert(await t.id('swarm-canvas').isVisible());await t.id('view-tab-split').click();assert.equal(await t.id('view-tab-split').getAttribute('aria-selected'),'true');await t.id('time-figure').waitFor();
 });
 test('extra','chart.replay',async t=>{
  await t.go('/?view=swarm');const end=await t.page.evaluate(()=>window.__replayT);const first0=await t.id('split-row').evaluateAll(es=>es.map(e=>e.dataset.repo));await t.page.getByRole('button',{name:'Play replay',exact:true}).click();
  await poll(()=>t.page.evaluate(end=>window.__replayT<end,end),'Replay starts');const samples=[];for(let i=0;i<6;i++){samples.push(await t.page.evaluate(()=>window.__replayT));await t.page.waitForTimeout(100);}assert(samples.every((v,i)=>!i||v>=samples[i-1]));assert(samples.at(-1)>samples[0]);
  const first=await t.id('split-row').evaluateAll(es=>es.map(e=>e.dataset.repo));await t.page.getByRole('slider',{name:'Replay date'}).fill('1790859600');const earlier=await t.id('split-row').evaluateAll(es=>es.map(e=>e.dataset.repo));assert.notDeepEqual(earlier,first0);
  await t.page.emulateMedia({reducedMotion:'reduce'});await t.page.getByRole('button',{name:'Play replay',exact:true}).click();assert.equal(await t.page.evaluate(()=>window.__replayT),end);await t.page.waitForTimeout(100);assert.equal(await t.page.evaluate(()=>window.__replayT),end);
 });
 test('flow','flow.expand_chart',async t=>{await t.go();await t.page.locator('h2').first().click();await t.page.keyboard.press('f');await t.page.getByRole('dialog',{name:'Expanded chart'}).waitFor();await t.page.keyboard.press('Escape');assert.equal(await t.page.getByRole('dialog',{name:'Expanded chart'}).count(),0);});
}
