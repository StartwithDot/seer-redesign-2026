import assert from 'node:assert/strict';
import {suite,pageFor,open,ids} from './lib.mjs';
await suite('scroll-panel',async(browser,check)=>{
 for(const size of [{width:1440,height:900},{width:1440,height:700},{width:1100,height:800},{width:390,height:844}])for(const route of ['home','market'])await check(`${route} ${size.width}x${size.height}: action, wheel containment and recovery`,async()=>{
  const p=await pageFor(browser,size);await open(p,route==='home'?'#/':'#/market/'+ids.binary);
  if(size.width<1100&&route==='home')await p.locator('.ix-tile').first().click();
  if(size.width<=1050&&route==='market')await p.locator('#mobile-trade').click();
  const scroller=p.locator(route==='home'?'.pn-scroll':'.trade-body'),cta=p.locator(route==='home'?'#tk-connect':'#tr-go');
  await scroller.waitFor({state:'visible'});await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const c=await cta.boundingBox();assert.ok(c.y>=0&&c.y+c.height<=size.height+1,JSON.stringify(c));assert.ok(c.x>=0&&c.x+c.width<=size.width+1);assert.ok(await cta.isEnabled());
  const before=await p.evaluate(()=>({page:scrollY,inner:document.querySelector('.pn-scroll,.trade-body').scrollTop}));const box=await scroller.boundingBox();await p.mouse.move(box.x+box.width/2,box.y+Math.min(60,box.height/2));const scrollable=await scroller.evaluate(e=>e.scrollHeight>e.clientHeight+1);await p.mouse.wheel(0,420);if(scrollable)await p.waitForFunction(({selector,old})=>document.querySelector(selector).scrollTop>old,{selector:route==='home'?'.pn-scroll':'.trade-body',old:before.inner});
  const after=await p.evaluate(()=>({page:scrollY,inner:document.querySelector('.pn-scroll,.trade-body').scrollTop}));assert.ok(scrollable?after.inner>before.inner:after.inner===before.inner);assert.equal(after.page,before.page);const cc=await cta.boundingBox();assert.ok(cc.y+cc.height<=size.height+1);
  if(route==='home'){
   if(size.width<1100)await p.locator('#pn-close').click();
   const tile=await p.locator('.ix-tile').first().boundingBox();await p.mouse.move(tile.x+tile.width/2,Math.min(size.height-40,tile.y+tile.height/2));await p.mouse.wheel(0,360);await p.waitForFunction(old=>scrollY>old,before.page);
  }
  await p.close();return {action:c,innerScroll:after.inner,pageUnchangedOverPanel:true};
 });
 await check('short empty inspector does not force scrolling',async()=>{const p=await pageFor(browser);await open(p,'#/?q=No-market-zzzz');await p.reload();await p.locator('.pn-empty').waitFor();const r=await p.locator('#ix-panel').evaluate(e=>({h:e.clientHeight,scroll:e.scrollHeight}));assert.ok(r.scroll<=r.h+1);await p.close();return r;});
});
