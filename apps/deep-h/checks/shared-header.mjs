import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
process.env.DEEP_E2E_REPORTS='../../reports/shared-header/';process.env.DEEP_E2E_OUT='../../after/shared-header/';
const h=await import('../e2e/lib/harness.mjs'),base=process.env.DEEP_URL||'http://127.0.0.1:5203';
await Promise.all([mkdir(h.reports,{recursive:true}),mkdir(h.out,{recursive:true})]);
const browser=await chromium.launch({executablePath:h.chrome,headless:true}),records=[];
try{
 for(const theme of ['dark','light'])for(const width of [1440,390]){
  const context=await h.contextFor(browser,{width,height:width===390?844:900,isMobile:width===390,hasTouch:width===390});
  await context.addInitScript(v=>{try{localStorage.setItem('seer.theme',v);}catch{/* Opaque restoration documents have no storage. */}Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.__copied=value;}}});},theme);
  const t=await h.testEnvironment(context,base,{width,height:width===390?844:900},'shared-header'),row={theme,width,status:'PASS',actions:[],destinations:[]};
  try{
   await t.go();const btn=t.page.locator('.sg-apps'),panel=t.page.locator('.sg-panel');
   const r=await btn.boundingBox(),px=r.x>80?r.x-16:r.x+r.width+16,delta=px-(r.x+r.width/2);await t.page.mouse.move(px,r.y+r.height/2);await btn.evaluate((e,d)=>e.style.translate=d+'px 0',delta);await t.page.waitForTimeout(180);assert.equal(await btn.getAttribute('aria-expanded'),'false');await btn.evaluate(e=>e.style.translate='');row.actions.push('stationary reflow remains closed');
   await t.page.mouse.move(0,0);await btn.hover();await h.poll(()=>btn.getAttribute('aria-expanded').then(x=>x==='true'));await btn.click();await t.page.mouse.move(5,300);await t.page.waitForTimeout(300);assert.equal(await btn.getAttribute('aria-expanded'),'true');await btn.click();await h.poll(()=>btn.getAttribute('aria-expanded').then(x=>x==='false'));row.actions.push('genuine hover, pin, leave, toggle');
   await btn.focus();await t.page.keyboard.press('ArrowDown');const links=panel.getByRole('menuitem');await t.page.keyboard.press('End');assert(await links.last().evaluate(e=>e===document.activeElement));await t.page.keyboard.press('Home');assert(await links.first().evaluate(e=>e===document.activeElement));await t.page.keyboard.press('ArrowUp');assert(await links.last().evaluate(e=>e===document.activeElement));await t.page.keyboard.press('Escape');assert.equal(await btn.getAttribute('aria-expanded'),'false');assert(await btn.evaluate(e=>e===document.activeElement));row.actions.push('arrows, Home/End, Escape and focus return; no source typeahead');
   await t.page.keyboard.press('Space');await h.poll(()=>btn.getAttribute('aria-expanded').then(x=>x==='true'));await t.page.locator('.sg-theme').focus();await h.poll(()=>btn.getAttribute('aria-expanded').then(x=>x==='false'));await btn.click();await t.page.mouse.click(6,80);await h.poll(()=>btn.getAttribute('aria-expanded').then(x=>x==='false'));row.actions.push('Space, focus exit, outside click');
   await btn.click();await t.page.setViewportSize({width:width-10,height:width===390?844:900});await h.poll(()=>btn.getAttribute('aria-expanded').then(x=>x==='false'));await t.page.setViewportSize({width,height:width===390?844:900});await t.page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));row.actions.push('resize closes');
   await btn.click();const destinations=await links.evaluateAll(es=>es.map(e=>({href:e.href,name:e.textContent.trim()})));assert.equal(destinations.length,6);
   for(const item of [...destinations,{href:new URL('/',base).href,name:'Seer brand'}]){
    await t.go();if(item.name!=='Seer brand')await t.page.locator('.sg-apps').click();
    const link=item.name==='Seer brand'?t.page.locator('.sg-brand'):t.page.locator('.sg-row').filter({hasText:item.name.split('\n')[0]}).filter({visible:true});
    const nativeDeep=item.href===new URL('/deep/',base).href;
    const handler=route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>Destination fixture</title>'});if(!nativeDeep)await context.route(item.href,handler);
    // Test the native navigation destination; the other product app is outside this package.
    await link.first().click();await t.page.waitForURL(item.href);assert.equal(t.page.url(),item.href);if(nativeDeep)await t.page.waitForFunction(()=>document.querySelectorAll('[data-testid=split-row]').length===98);row.destinations.push({...item,validation:nativeDeep?'Actual standalone Deep load and 98 fixtures':'Native navigation destination fixture; other app outside package'});if(!nativeDeep)await context.unroute(item.href,handler);
   }
   await t.go();await t.page.locator('.sg-theme').click();assert.equal(await t.page.evaluate(()=>document.documentElement.dataset.theme),theme==='dark'?'light':'dark');row.actions.push('theme switches');
   await t.connect();await t.page.locator('.sg-connect').click();const copy=t.page.locator('.sg-copy'),disc=t.page.locator('.sg-disc');await copy.waitFor();await t.page.keyboard.press('ArrowDown');assert(await disc.evaluate(e=>e===document.activeElement));await t.page.keyboard.press('ArrowUp');assert(await copy.evaluate(e=>e===document.activeElement));await copy.click();await t.page.waitForFunction(()=>window.__copied==='0x0000…dEaD');await t.page.locator('.sg-acct').waitFor({state:'detached'});row.actions.push('connect, wallet arrows and exact copied mock account label');
   await t.page.locator('.sg-connect').click();await t.page.evaluate(()=>navigator.clipboard.writeText=async()=>{throw Error('Injected clipboard rejection');});await t.page.locator('.sg-copy').click();await t.page.getByRole('menuitem',{name:'Copy failed',exact:true}).waitFor();await t.page.locator('.sg-acct').waitFor({state:'detached'});row.actions.push('clipboard rejection feedback');
   await t.page.locator('.sg-connect').click();await t.page.keyboard.press('Escape');assert.equal(await t.page.locator('.sg-acct').count(),0);await t.page.locator('.sg-connect').click();await t.page.locator('.sg-disc').click();assert.equal(await t.page.locator('.sg-connect').innerText(),'Connect');assert.equal(await t.id('wallet-button').count(),1);row.actions.push('wallet Escape and shared disconnect preserves React');
   assert.deepEqual(h.unexpected(t.errors),[]);
  }catch(e){row.status='FAIL';row.error=e.message;row.stack=e.stack;await h.artifactFailure(t,'shared-header',e).catch(()=>{});}
  records.push(row);console.log(`${row.status} ${theme} ${width}${row.error?' '+row.error.split('\n')[0]:''}`);await context.close();
 }
 const report={expected:4,covered:records.length,passed:records.filter(r=>r.status==='PASS').length,failed:records.filter(r=>r.status==='FAIL').length,unverified:4-records.length,records};await writeFile(new URL('../reports/shared-header.json',import.meta.url),JSON.stringify(report,null,2));assert.equal(report.failed,0);
}finally{await browser.close();}
