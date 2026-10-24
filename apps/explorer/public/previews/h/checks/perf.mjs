import assert from 'node:assert/strict';
import {suite,pageFor,open} from './lib.mjs';
await suite('perf',async(browser,check)=>{
 await check('41-tile scroll and hover frame trace',async()=>{const p=await pageFor(browser,undefined,'dark','no-preference');await open(p);assert.equal(await p.locator('.ix-tile').count(),41);await p.waitForTimeout(650);
  const trace=p.evaluate(()=>new Promise(resolve=>{const times=[];let last=performance.now(),n=0;function frame(now){times.push(now-last);last=now;if(n++<180)requestAnimationFrame(frame);else resolve(times.slice(2));}requestAnimationFrame(frame);}));
  for(let i=0;i<12;i++){await p.mouse.move(100+(i%3)*300,500);await p.mouse.wheel(0,i<6?100:-100);await p.waitForTimeout(90);}
  const frames=await trace,sorted=[...frames].sort((a,b)=>a-b),mean=frames.reduce((s,n)=>s+n,0)/frames.length,result={frames:frames.length,medianMs:sorted[Math.floor(sorted.length*.5)],p95Ms:sorted[Math.floor(sorted.length*.95)],maxMs:Math.max(...frames),averageFps:1000/mean,over20ms:frames.filter(n=>n>20).length};await p.close();assert.ok(result.averageFps>=55,JSON.stringify(result));assert.ok(result.p95Ms<=20,JSON.stringify(result));return result;
 });
 await check('reduced motion stops carousel autoplay and keeps final instruments',async()=>{const p=await pageFor(browser);await open(p);const r=await p.evaluate(()=>({reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,timer:hc.timer,active:[...document.querySelectorAll('.hc-dot')].findIndex(e=>e.getAttribute('aria-current')==='true'),animations:document.getAnimations().filter(a=>a.playState==='running').length}));assert.equal(r.reduced,true);assert.equal(await p.locator('.hc-dot.run').count(),0);assert.ok(await p.locator('.tile-mark').first().isVisible());await p.close();return r;});
});
