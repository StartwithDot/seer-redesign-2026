import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
process.env.DEEP_E2E_REPORTS='../../reports/scroll-surfaces/';process.env.DEEP_E2E_OUT='../../after/scroll-surfaces/';
const h=await import('../e2e/lib/harness.mjs'),base=process.env.DEEP_URL||'http://127.0.0.1:5203';
await Promise.all([mkdir(h.reports,{recursive:true}),mkdir(h.out,{recursive:true})]);
const browser=await chromium.launch({executablePath:h.chrome,headless:true}),records=[];
const cases=[
 ['repository',async t=>{await t.go();await t.mobileTab('List');return t.page.locator('.repository-scroll');}],
 ['archive',async t=>{await t.go('/?round=round2-l2');await t.mobileTab('List');return t.page.locator('.archive-table-scroll');}],
 ['dock',async t=>{await t.go();await t.upload('predictions-valid.csv',false);const candidates=t.page.locator('.desk-body,.predictions-card,.setup-panel,.predictions-panel,.execute-panel');let chosen=candidates.first();for(let i=await candidates.count()-1;i>=0;i--)if(await candidates.nth(i).evaluate(e=>/auto|scroll/.test(getComputedStyle(e).overflowY)&&e.scrollHeight>e.clientHeight+1)){chosen=candidates.nth(i);break;}return chosen;}],
 ['detail',async t=>{await t.go('/repo/ethereum/consensus-specs');return t.page.locator('.detail');}],
 ['overview',async t=>{await t.go('/?round=all');return t.page.locator('.contest-overview');}],
 ['Guide',async t=>{await t.go();await t.id('nav-guide').click();return t.page.locator('.guide-content');}],
 ['Funds',async t=>{await t.go();await t.create();await t.openFunds();return t.id('funds-sheet');}],
 ['wallet-inspector',async t=>{await t.go('/leaderboard');await t.id('lb-row').first().click();return t.page.locator('.wallet-inspector');}],
];
try{
 for(const theme of ['dark','light'])for(const width of [1440,390])for(const [name,setup] of cases){
  const height=width===390?844:700,context=await h.contextFor(browser,{width,height,isMobile:width===390,hasTouch:true});await context.addInitScript(v=>{try{localStorage.setItem('seer.theme',v);}catch{}},theme);const t=await h.testEnvironment(context,base,{width,height},'scroll-'+name),row={theme,width,height,name,status:'PASS'};
  try{
   const region=await setup(t);await region.waitFor();await region.evaluate(e=>e.scrollTop=0);await t.page.waitForTimeout(100);
   const box=await region.evaluate(e=>{const r=e.getBoundingClientRect();let top=r.top,bottom=r.bottom,left=r.left,right=r.right;for(let p=e.parentElement;p;p=p.parentElement){const s=getComputedStyle(p),b=p.getBoundingClientRect();if(/auto|scroll|hidden|clip/.test(s.overflowY)){top=Math.max(top,b.top);bottom=Math.min(bottom,b.bottom);}if(/auto|scroll|hidden|clip/.test(s.overflowX)){left=Math.max(left,b.left);right=Math.min(right,b.right);}}return {top,bottom,left,right};});const x=Math.min(width-24,Math.max(24,(box.left+box.right)/2)),top=Math.max(60,box.top),bottom=Math.min(height-65,box.bottom),y=(top+bottom)/2;assert(bottom-top>30);
   const max=await region.evaluate(e=>Math.max(0,e.scrollHeight-e.clientHeight));row.observed={max,box,point:{x,y},hit:await region.evaluate((e,p)=>({inside:e.contains(document.elementFromPoint(p.x,p.y)),element:document.elementFromPoint(p.x,p.y)?.className}),{x,y})};await t.page.mouse.move(x,y);await t.page.mouse.wheel(0,280);await t.page.waitForTimeout(250);const wheel=await region.evaluate(e=>e.scrollTop);row.observed.wheel=wheel;if(max>1)assert(wheel>0,'Wheel did not scroll the bounded region');
   await region.evaluate(e=>e.scrollTop=0);await t.page.waitForTimeout(100);const cdp=await context.newCDPSession(t.page),start=bottom-18,distance=Math.min(220,bottom-top-40);await t.page.evaluate(()=>{window.__touchMoves=0;document.addEventListener('touchmove',()=>window.__touchMoves++,{passive:true});});await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y:start,id:1,radiusX:4,radiusY:4,force:1}]});for(let i=1;i<=14;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:start-distance*i/14,id:1,radiusX:4,radiusY:4,force:1}]});await t.page.waitForTimeout(16);}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await t.page.waitForTimeout(150);const touch=await region.evaluate(e=>e.scrollTop);row.observed.touch=touch;row.observed.trustedTouchMoves=await t.page.evaluate(()=>window.__touchMoves);if(max>1)assert(touch>0,'Touch gesture did not scroll the bounded region');
   const doc=await t.page.evaluate(()=>({window:[scrollX,scrollY],html:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],body:[document.body.scrollLeft,document.body.scrollTop],root:document.getElementById('root').scrollTop}));assert.deepEqual(doc.window,[0,0]);assert.deepEqual(doc.html,[width,height]);assert.deepEqual(doc.body,[0,0]);assert.equal(doc.root,0);assert.deepEqual(h.unexpected(t.errors),[]);Object.assign(row.observed,{document:doc,disposition:max>1?'wheel and native touch both scroll inner region':'content fits; gesture remains contained'});
  }catch(e){row.status='FAIL';row.error=e.message;row.stack=e.stack;await h.artifactFailure(t,'scroll-'+name,e).catch(()=>{});}
  records.push(row);console.log(`${row.status} ${theme} ${width} ${name}${row.error?' '+row.error.split('\n')[0]:''}`);await context.close();
 }
 const report={expected:32,covered:records.length,passed:records.filter(r=>r.status==='PASS').length,failed:records.filter(r=>r.status==='FAIL').length,unverified:32-records.length,records};await writeFile(new URL('../reports/scroll-surfaces.json',import.meta.url),JSON.stringify(report,null,2));assert.equal(report.failed,0);
}finally{await browser.close();}
