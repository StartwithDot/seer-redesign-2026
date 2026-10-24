import {assert,fixtures,poll} from '../lib/harness.mjs';
export const screenshotSizes=[{width:1440,height:900},{width:1920,height:1080},{width:390,height:844,isMobile:true,hasTouch:true}];
export function scenarios(t){
 const market=()=>t.go();
 const profile=async()=>{await market();await t.connect();await t.id('wallet-button').click();await t.id('nav-profile').click();await t.id('profile-name').fill('x'.repeat(32));await t.id('profile-dialog').waitFor();};
 const predictions=async()=>{await market();await t.upload();assert.match(await t.id('predictions-summary').innerText(),/3 predictions/);};
 return [
  ['home-split-default',market],
  ['home-split-connected',async()=>{await market();await t.connect();}],
  ['home-setup-complete',async()=>{await market();await t.funded();await t.upload();}],
  ['home-swarm',async()=>{await t.go('/?view=swarm');await t.id('swarm-canvas').waitFor();}],
  ['home-swarm-isolate',()=>t.go('/?view=swarm&iso='+fixtures.rows[0].id.toLowerCase())],
  ['home-swarm-labels-dense',()=>t.go('/?view=swarm')],
  ['home-swarm-crosshair',async()=>{await t.go('/?view=swarm');const canvas=t.id('swarm-canvas');const b=await canvas.boundingBox();await canvas.hover({position:{x:b.width*.5,y:b.height*.5}});}],
  ['home-search-active',()=>t.go('/?q=ethereum')],
  ['home-hide-all',async()=>{await market();await t.id('hide-all').click();assert.equal(await t.id('hide-all').getAttribute('aria-pressed'),'true');}],
  ['round-menu-open',async()=>{await market();await t.id('round-switcher').click();assert.equal(await t.id('round-option').count(),8);}],
  ['archive-ended',async()=>{await t.go('/?round=zcash-nu7');await t.id('contest-market').waitFor();}],
  ['predictions-empty',async()=>{await market();await t.desk();await t.id('predictions-empty').waitFor();}],
  ['predictions-loaded',predictions],
  ['predictions-parse-error',async()=>{await market();await t.upload('predictions-bad-header.csv',false);await t.id('predictions-parse-error').waitFor();}],
  ['funds-sheet',async()=>{await market();await t.create();await t.openFunds();await t.deposit();assert.equal(await t.id('susds-balance').innerText(),'10.0000');}],
  ['strategy-progress',async()=>{await market();await t.funded();await t.upload();await t.id('start-trading').click();await t.page.locator('.execution').waitFor({state:'attached'});}],
  ['profile-dialog',profile],
  ['repo-detail',async()=>{await t.go('/repo/'+fixtures.rows[0].name);await t.id('repo-detail').waitFor();}],
  ...['all','1d','1w','1m'].map(period=>['leaderboard-'+(period==='all'?'default':'period-'+period),async()=>{await t.go('/leaderboard?period='+period);await poll(()=>t.id('lb-row').count().then(n=>n===fixtures.leaderboard[period].total));}]),
  ['leaderboard-search',async()=>{await t.go('/leaderboard?q='+fixtures.leaderboard.all.rows[0].address);assert.equal(await t.id('lb-row').count(),1);}],
  ['leaderboard-empty',async()=>{t.api.set('leaderboard-all',{data:{rows:[],total:0}});await t.go('/leaderboard');await t.id('lb-empty').waitFor();}],
  ['leaderboard-error',async()=>{await t.go('/leaderboard?fail=1');await t.id('lb-error').waitFor();}],
  ['leaderboard-skeleton',async()=>{t.api.set('leaderboard-all',{delay:5000});await t.page.goto(new URL('/#/leaderboard',t.base).href,{waitUntil:'domcontentloaded'});await t.id('lb-skeleton').waitFor();}],
  ...(t.viewport.width<=700?[
   /* KNOWN SKIP (design-blocked): setup strip/sheet no longer exist (desk always open); see design_proposals_deep.md */
   /* KNOWN SKIP (design-blocked): table no longer scrolls horizontally at 390 */
   ['home-table-list',async()=>{await market();await t.mobileTab('List');await t.id('split-table').waitFor();}],
   ['predictions-sheet',async()=>{await market();await t.desk();await t.id('predictions-card').waitFor();}],
  ]:[]),
 ];
}
export async function captureScenario(t,name,setup){
 await t.page.emulateMedia({reducedMotion:'reduce'});await t.page.clock.setFixedTime(new Date('2026-10-19T00:00:00Z'));await setup();await t.page.evaluate(()=>document.fonts.ready);
 await t.shot(name);return {file:`${t.viewport.width}x${t.viewport.height}-${name}.png`,state:name,viewport:t.viewport};
}
export function screenshotTests(test){
 // Each scenario is asserted and captured independently: no previous state may satisfy its setup.
 const names=scenarios({viewport:{width:390}}).map(([name])=>name);
 for(const name of names)test('screenshot',`shots.${name}`,async t=>{
  const scenario=scenarios(t).find(([n])=>n===name);
  if(!scenario){t.observed.applicability='Mobile-only capture';return;}
  t.observed.screenshot=await captureScenario(t,name,scenario[1]);
 });
}
