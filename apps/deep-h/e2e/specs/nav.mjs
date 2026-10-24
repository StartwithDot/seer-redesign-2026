import {assert,poll} from '../lib/harness.mjs';
export function navigation(test){
 test('X03','nav.history',async t=>{
  await t.go();const start=await t.page.evaluate(()=>window.__loadCount),states=[new URL(t.page.url()).hash];
  const remember=()=>states.push(new URL(t.page.url()).hash);
  await t.id('sort-name').click();remember();await t.id('nav-leaderboard').click();await t.id('lb-period-menu').waitFor();remember();await t.id('lb-period-menu').click();await t.page.locator('[data-period="1w"]').click();await poll(()=>t.id('lb-row').count().then(n=>n===34));remember();await t.id('nav-markets').click();await t.id('split-row').first().focus();remember();await t.page.keyboard.press('Enter');await t.id('repo-detail').waitFor();remember();
  for(let i=states.length-2;i>=0;i--){await t.page.goBack();await poll(()=>new URL(t.page.url()).hash===states[i],`Back ${states[i]}`);}
  for(let i=1;i<states.length;i++){await t.page.goForward();await poll(()=>new URL(t.page.url()).hash===states[i],`Forward ${states[i]}`);}

  assert.equal(await t.page.evaluate(()=>window.__loadCount),start);
 });
 test('X02','nav.keyboard',async t=>{
  await t.go();await t.page.evaluate(()=>document.activeElement?.blur());await t.page.locator('body').click({position:{x:1,y:1}});const visited=[];
  const expected=['sg-brand','sg-apps','sg-theme','sg-connect','nav-markets','nav-leaderboard','nav-guide'];
  for(let i=0;i<expected.length;i++){
   await t.page.keyboard.press('Tab');const focused=await t.page.evaluate(()=>{const e=document.activeElement,s=getComputedStyle(e);return {id:e.getAttribute('data-testid')||e.className.split(' ').pop(),outline:s.outlineStyle,shadow:s.boxShadow};});visited.push(focused.id);
   assert.equal(focused.id,expected[i],`Tab ${i+1}: ${JSON.stringify(visited)}`);assert(focused.outline!=='none'||focused.shadow!=='none','Missing focus ring');
  }
  t.observed.tabOrder=visited;for(let i=expected.length-2;i>=0;i--){await t.page.keyboard.press('Shift+Tab');assert.equal(await t.page.evaluate(()=>document.activeElement.getAttribute('data-testid')||document.activeElement.className.split(' ').pop()),expected[i]);}
 });
 test('nav','nav.deep_links_and_reachability',async t=>{
  for(const hash of ['/','/?round=zcash-nu7','/?view=swarm&q=ethereum&sort=name','/leaderboard?period=1w','/repo/ethereum/consensus-specs']){await t.go(hash);assert.equal(await t.id('nav-markets').getAttribute('href'),'#/');if(await t.id('nav-markets').getAttribute('aria-disabled')==='true'){assert(await t.id('nav-markets').getAttribute('title'));}else await t.id('nav-markets').click();if(hash.includes('round='))await t.go('/');await t.id('split-table').waitFor({state:'attached'});await t.mobileTab('List');assert(await t.id('split-table').isVisible());}
 });
 test('nav','nav.menus_keyboard_and_clamp',async t=>{
  await t.go();const trigger=t.id('round-switcher');await trigger.focus();await t.page.keyboard.press('ArrowDown');const menu=t.id('round-menu');await menu.waitFor();await t.page.keyboard.press('ArrowDown');assert(await menu.evaluate(e=>e.contains(document.activeElement)));
  await t.page.keyboard.press('End');await t.page.keyboard.press('Escape');assert.equal(await menu.count(),0);assert(await trigger.evaluate(e=>e===document.activeElement));
  await trigger.hover();await menu.waitFor({timeout:500});const a=await trigger.boundingBox(),b=await menu.boundingBox();assert(b.x>=0&&b.x+b.width<=t.viewport.width);assert(b.y>=a.y+a.height+7||b.y+b.height<=a.y-7);await t.page.mouse.move(t.viewport.width-1,t.viewport.height-1);await menu.waitFor({state:'detached',timeout:1000});
 });
}
