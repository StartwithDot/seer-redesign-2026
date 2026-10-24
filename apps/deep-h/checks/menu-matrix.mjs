import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
process.env.DEEP_E2E_REPORTS='../../reports/menu-matrix/';process.env.DEEP_E2E_OUT='../../after/menu-matrix/';
const h=await import('../e2e/lib/harness.mjs'),base=process.env.DEEP_URL||'http://127.0.0.1:5203';
await Promise.all([mkdir(h.reports,{recursive:true}),mkdir(h.out,{recursive:true})]);
const browser=await chromium.launch({executablePath:h.chrome,headless:true}),records=[];
const definitions=[
 ['contests',async t=>{await t.go();return t.id('round-switcher');},async t=>{await t.page.getByRole('menuitem',{name:/Zcash · NU7/}).click();assert.match(t.page.url(),/round=zcash-nu7/);} ],
 ['sort',async t=>{await t.go();await t.mobileTab('List');return t.page.locator('.list-tools').getByRole('button',{name:'Sort',exact:true});},async t=>{await t.page.getByRole('menuitem',{name:'Repository A–Z',exact:true}).click();assert.match(t.page.url(),/sort=name/);} ],
 ['positions',async t=>{await t.go();await t.mobileTab('List');return t.id('positions-menu');},async t=>{await t.page.getByRole('menuitem',{name:'Positions',exact:true}).click();assert.equal(await t.id('col-predicted').count(),98);} ],
 ['period',async t=>{await t.go('/leaderboard');return t.id('lb-period-menu');},async t=>{await t.page.getByRole('menuitem',{name:'1W',exact:true}).click();await h.poll(()=>t.id('lb-row').count().then(n=>n===34));assert.match(t.page.url(),/period=1w/);} ],
 ['market',async t=>{await t.go('/leaderboard');return t.id('lb-market-select');},async t=>{const url=t.page.url();await t.page.getByRole('menuitem',{name:'All deep markets · global leaderboard',exact:true}).click();assert.equal(t.page.url(),url);assert.equal(await t.id('lb-row').count(),76);} ],
 ['conversion',async t=>{await t.go();await t.create();await t.openFunds();return t.page.locator('.convert-source .menu-trigger');},async t=>{await t.page.getByRole('menuitem',{name:'USDS',exact:true}).click();assert.match(await t.page.locator('.convert-source .menu-trigger').innerText(),/USDS/);} ],
 ['app-wallet',async t=>{await t.go();await t.connect();return t.id('wallet-button');},async t=>{await t.id('nav-profile').click();await t.id('profile-dialog').waitFor();} ],
];
async function menuContract(t,trigger){
 await t.page.mouse.move(0,0);const r=await trigger.boundingBox(),px=r.x+r.width+16<t.viewport.width-8?r.x+r.width+16:r.x-16,delta=px-(r.x+r.width/2);
 await t.page.mouse.move(px,r.y+r.height/2);await trigger.evaluate((e,d)=>e.style.translate=d+'px 0',delta);await t.page.waitForTimeout(180);assert.equal(await trigger.getAttribute('aria-expanded'),'false','Stationary reflow opened menu');await trigger.evaluate(e=>e.style.translate='');
 await t.page.mouse.move(0,0);await trigger.hover();await h.poll(()=>trigger.getAttribute('aria-expanded').then(v=>v==='true'));
 const menu=trigger.locator('..').getByRole('menu');await menu.waitFor();const bounds=await menu.boundingBox();assert(bounds.x>=11&&bounds.x+bounds.width<=t.viewport.width-11,'Menu escaped viewport');
 await t.page.keyboard.press('Escape');await h.poll(()=>trigger.getAttribute('aria-expanded').then(v=>v==='false'));
 await trigger.focus();await t.page.keyboard.press('ArrowDown');await menu.waitFor();const items=menu.getByRole('menuitem');assert(await menu.evaluate(e=>e.contains(document.activeElement)));
 await t.page.keyboard.press('End');assert(await items.last().evaluate(e=>e===document.activeElement));await t.page.keyboard.press('Home');assert(await items.first().evaluate(e=>e===document.activeElement));
 await t.page.keyboard.press('ArrowUp');assert(await items.last().evaluate(e=>e===document.activeElement));const first=(await items.first().innerText()).trim()[0];await t.page.keyboard.press(first.toLowerCase());assert((await t.page.evaluate(()=>document.activeElement.textContent.trim().toLowerCase())).startsWith(first.toLowerCase()));
 await t.page.keyboard.press('Escape');await h.poll(()=>trigger.getAttribute('aria-expanded').then(v=>v==='false'));assert(await trigger.evaluate(e=>e===document.activeElement));
 await t.page.keyboard.press('Enter');await menu.waitFor();await t.page.keyboard.press('Escape');await t.page.keyboard.press('Space');await menu.waitFor();await t.page.keyboard.press('Escape');
 await trigger.click();await menu.waitFor();if(await t.page.locator('dialog[open]').count())await t.page.locator('dialog[open] h2').first().click();else await t.page.mouse.click(6,80);await h.poll(()=>trigger.getAttribute('aria-expanded').then(v=>v==='false'));
 await trigger.focus();await t.page.keyboard.press('ArrowDown');await menu.waitFor();if(await t.page.locator('dialog[open]').count())await t.page.locator('dialog[open] button').first().focus();else await t.page.locator('.sg-theme').focus();await h.poll(()=>trigger.getAttribute('aria-expanded').then(v=>v==='false'));
 await trigger.focus();await t.page.keyboard.press('ArrowDown');await menu.waitFor();await t.page.setViewportSize({width:t.viewport.width-10,height:t.viewport.width===390?844:900});await menu.waitFor({state:'detached'});await t.page.setViewportSize({width:t.viewport.width,height:t.viewport.width===390?844:900});await t.page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 await trigger.focus();await t.page.keyboard.press('ArrowDown');await menu.waitFor();
}
try{
 for(const theme of ['dark','light'])for(const width of [1440,390])for(const [name,setup,semantic] of definitions){
  const context=await h.contextFor(browser,{width,height:width===390?844:900,isMobile:width===390,hasTouch:width===390});await context.addInitScript(v=>localStorage.setItem('seer.theme',v),theme);const t=await h.testEnvironment(context,base,{width,height:width===390?844:900},'menu-matrix-'+name);const row={theme,width,name,status:'PASS'};
  try{const trigger=await setup(t);await menuContract(t,trigger);await semantic(t);assert.deepEqual(h.unexpected(t.errors),[]);row.observed={hash:new URL(t.page.url()).hash,contract:'reflow, hover, clamp, arrows, Home/End, typeahead, Escape/return, Enter/Space, outside/focus exit, resize, semantic action',idempotent:name==='market'};}
  catch(e){row.status='FAIL';row.error=e.message;row.stack=e.stack;await h.artifactFailure(t,'menu-matrix-'+name,e).catch(()=>{});}
  records.push(row);console.log(`${row.status} ${theme} ${width} ${name}${row.error?' '+row.error.split('\n')[0]:''}`);await context.close();
 }
 await writeFile(new URL('../reports/menu-matrix.json',import.meta.url),JSON.stringify({expected:records.length,covered:records.length,passed:records.filter(r=>r.status==='PASS').length,failed:records.filter(r=>r.status==='FAIL').length,unverified:0,records},null,2));assert.equal(records.filter(r=>r.status==='FAIL').length,0);
}finally{await browser.close();}
