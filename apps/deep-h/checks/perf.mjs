import {mkdir,writeFile} from 'node:fs/promises';
import os from 'node:os';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const h=await import('../e2e/lib/harness.mjs');
const base=process.env.DEEP_URL||'http://127.0.0.1:5202';
const browser=await chromium.launch({executablePath:h.chrome,headless:true});
const context=await h.contextFor(browser,{width:1440,height:900});
await context.addInitScript(()=>{
 const native=window.requestAnimationFrame.bind(window);window.__perf={callbacks:0,paints:0,native};
 window.requestAnimationFrame=fn=>native(t=>{window.__perf.callbacks++;fn(t);});
 const clear=CanvasRenderingContext2D.prototype.clearRect;
 CanvasRenderingContext2D.prototype.clearRect=function(...args){window.__perf.paints++;return clear.apply(this,args);};
});
const t=await h.testEnvironment(context,base,{width:1440,height:900},'performance');
const cdp=await context.newCDPSession(t.page);await cdp.send('Performance.enable');
const samples=[];
const metric=async()=>Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
async function sample(name,duration,action){
 const counters=await t.page.evaluate(()=>({callbacks:window.__perf.callbacks,paints:window.__perf.paints}));
 await t.page.evaluate(()=>{window.__perf.frames=[];window.__perf.long=[];window.__perf.last=0;const p=window.__perf;
  p.observer=new PerformanceObserver(list=>p.long.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration}))));p.observer.observe({type:'longtask',buffered:false});
  p.active=true;function frame(now){if(p.last)p.frames.push(now-p.last);p.last=now;if(p.active)p.native(frame);}p.native(frame);
 });
 const before=await metric(),start=performance.now();
 await Promise.all([new Promise(r=>setTimeout(r,duration)),action?.()]);
 const data=await t.page.evaluate(()=>{const p=window.__perf;p.active=false;p.observer.disconnect();return {frames:p.frames,longTasks:p.long,appRaf:p.callbacks,canvasPaints:p.paints};});
 const after=await metric(),elapsed=performance.now()-start,sorted=[...data.frames].sort((a,b)=>a-b),q=p=>sorted[Math.floor((sorted.length-1)*p)];
 const dropped=data.frames.filter(v=>v>25).reduce((n,v)=>n+Math.max(1,Math.round(v/16.667)-1),0);
 const row={name,durationMs:elapsed,frameCount:sorted.length,frameMs:{min:sorted[0],median:q(.5),p95:q(.95),p99:q(.99),max:sorted.at(-1)},overBudget16_67:sorted.filter(v=>v>16.67).length,missedVsyncIntervals:dropped,longTasks:data.longTasks,appRafCallbacks:data.appRaf-counters.callbacks,canvasPaints:data.canvasPaints-counters.paints,taskCpuOneCorePercent:100*(after.TaskDuration-before.TaskDuration)/(elapsed/1000),target60HzP95Met:q(.95)<=16.77};
 samples.push(row);console.log(JSON.stringify(row));return row;
}
async function settled(name){
 await t.page.waitForTimeout(800);const a=await t.page.evaluate(()=>({callbacks:window.__perf.callbacks,paints:window.__perf.paints})),before=await metric();await t.page.waitForTimeout(2500);const b=await t.page.evaluate(()=>({callbacks:window.__perf.callbacks,paints:window.__perf.paints})),after=await metric();
 const row={name,durationMs:2500,appRafCallbacks:b.callbacks-a.callbacks,canvasPaints:b.paints-a.paints,taskCpuOneCorePercent:100*(after.TaskDuration-before.TaskDuration)/2.5};assert.equal(row.appRafCallbacks,0,'Decorative or replay RAF did not settle');assert.equal(row.canvasPaints,0,'Canvas kept painting after stop');samples.push(row);console.log(JSON.stringify(row));
}
try{
 await t.go();await t.page.evaluate(()=>document.fonts.ready);await t.page.waitForTimeout(1000);
 await sample('98-series chart replay',13000,async()=>{await t.page.getByRole('button',{name:'▶ Replay',exact:true}).click();});await settled('chart replay stopped');
 await sample('nearest-line hover',5000,async()=>{const r=await t.id('time-figure').locator('canvas').boundingBox();for(let i=0;i<120;i++){await t.page.mouse.move(r.x+20+(i%40)*(r.width-60)/40,r.y+50+(i%12)*Math.max(1,r.height-90)/12);await t.page.waitForTimeout(30);}});
 await sample('Split to Swarm transition',3000,async()=>{await t.id('view-tab-swarm').click();});
 await t.upload();await t.mobileTab('Chart');
 await sample('Swarm five layers and picking',6000,async()=>{const r=await t.id('swarm-canvas').boundingBox();for(const name of ['UP price','Unpriced gap','Drift since first trade','Volume','Your predictions']){await t.page.locator('.swarm-layers').getByRole('button',{name,exact:true}).click();for(let i=0;i<16;i++)await t.page.mouse.move(r.x+30+i*(r.width-60)/16,r.y+r.height*.5);}});
 await sample('Swarm 98-repository replay',13000,async()=>{await t.page.getByRole('button',{name:'Play replay',exact:true}).click();});await settled('Swarm replay stopped');
 const end=Number(await t.page.getByRole('slider',{name:'Replay date'}).getAttribute('max'));await t.page.getByRole('button',{name:'Play replay',exact:true}).click();await t.page.waitForTimeout(500);await t.id('nav-leaderboard').click();await t.id('swarm-canvas').waitFor({state:'detached'});
 const offscreen=await sample('Replay after navigating away; Canvas unmounted',3000);assert.equal(offscreen.canvasPaints,0,'Offscreen Canvas kept painting');
 await h.poll(()=>t.page.evaluate(v=>window.__replayT===v,end),'Bounded offscreen replay completion',15000);await settled('offscreen after bounded replay completion');
 await t.go('/?round=round2-l2');await t.page.waitForTimeout(1000);
 await sample('3517-outcome inner wheel scroll',5000,async()=>{const r=await t.page.locator('.archive-table-scroll').boundingBox();await t.page.mouse.move(r.x+r.width*.7,r.y+r.height*.5);for(let i=0;i<50;i++){await t.page.mouse.wheel(0,420);await t.page.waitForTimeout(100);}});
 assert.deepEqual(h.unexpected(t.errors),[]);
 const report={environment:{browser:await browser.version(),deviceScaleFactor:1,viewport:{width:1440,height:900},theme:'dark',reducedMotion:'no-preference',mode:'headless',cpu:os.cpus()[0]?.model,logicalProcessors:os.cpus().length,totalMemoryGiB:os.totalmem()/2**30,platform:os.platform(),release:os.release(),note:'Wall-clock RAF sampling in installed Chrome; no claim of a physical display refresh measurement. App replay time continues for its bounded 12-second source contract after route navigation; the unmounted Canvas must not paint.'},budgetMs:16.67,p95TimerToleranceMs:.1,samples,failures:samples.filter(s=>s.target60HzP95Met===false).map(s=>s.name),errors:t.errors};
 await mkdir(new URL('../reports/',import.meta.url),{recursive:true});await writeFile(new URL('../reports/performance.json',import.meta.url),JSON.stringify(report,null,2));
}finally{await browser.close();}
