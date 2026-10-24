import assert from 'node:assert/strict';
import {suite,pageFor,open,ids} from './lib.mjs';
await suite('open-trade',async(browser,check)=>{
 for(const [label,key]of [['pointer','click'],['Enter','Enter'],['Space','Space']])await check(label+' opens the correct record without selecting the tile',async()=>{
  const p=await pageFor(browser);await open(p);const button=p.locator('.ix-tile').nth(1).locator('[data-open-trade]'),id=await button.getAttribute('data-open-trade'),before=await p.evaluate(()=>state.sel);
  assert.match(await button.getAttribute('aria-label'),/^Open trade: /);assert.equal(await button.getAttribute('title'),'Open trade');
  const r=await button.boundingBox();assert.equal(r.width,32);assert.equal(r.height,32);
  if(key==='click')await button.click();else await button.press(key);
  await p.waitForURL(url=>url.hash==='#/market/'+id);await p.locator('.market-title').waitFor();assert.equal(await p.evaluate(()=>state.sel),before);await p.close();return {market:id,selectedStayed:before};
 });
 await check('tile selection and arrow navigation remain distinct',async()=>{const p=await pageFor(browser);await open(p);const tile=p.locator('.ix-tile').nth(1),id=await tile.getAttribute('data-id');await tile.press('Space');assert.equal(await p.evaluate(()=>state.sel),id);assert.ok((await p.url()).includes('#/?'));await tile.press('Enter');await p.waitForURL(url=>url.hash==='#/market/'+id);await p.close();});
 await check('no old layers info mark remains on tiles',async()=>{const p=await pageFor(browser);await open(p);assert.equal(await p.locator('.ix-tile .tl-info').count(),0);assert.equal(await p.locator('.ix-tile [data-open-trade]').count(),41);await p.close();});
});
