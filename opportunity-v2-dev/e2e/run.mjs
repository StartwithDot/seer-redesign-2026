// Run outside the sandbox: npm run e2e -w apps/opportunity-v2.
// A separate test-mode bundle enables hooks; ordinary production builds omit them.
import assert from 'node:assert/strict';
import {colourAudit,geometryAudit,graphLabelAudit} from './audit.mjs';
import {auditSource} from './source-audit.mjs';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import {join,extname} from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = fileURLToPath(new URL('./out/', import.meta.url));
await mkdir(out, { recursive: true });
const vite = fileURLToPath(new URL('../../../node_modules/vite/bin/vite.js', import.meta.url));
async function build() {
  const child = spawn(process.execPath, [vite, 'build', '--mode', 'test', '--outDir', 'e2e/out/site'], { cwd: root, stdio: 'inherit' });
  await new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', code => code === 0 ? resolve() : reject(new Error(`Test build exited ${code}`))); });
}
await build();
// Vite chooses a free port (and retries occupied ones). Only the external runner starts it.
let preview;
let base;
async function startPreview() {
 preview = spawn(process.execPath, [vite, 'preview', '--host', '127.0.0.1', '--port', '4173', '--outDir', 'e2e/out/site'], {cwd: root, stdio: ['ignore', 'pipe', 'pipe']});
 base = await new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('Vite preview did not start')), 15000);
  let output = '';
  const read = chunk => {
   output += chunk.toString().replace(/\x1b\[[0-9;]*m/g, '');
   const url = output.match(/http:\/\/127\.0\.0\.1:\d+/);
   if (url) {clearTimeout(timer); resolve(url[0]);}
  };
  preview.stdout.on('data', read); preview.stderr.on('data', read);
  preview.once('error', error => {clearTimeout(timer); reject(error);});
  preview.once('exit', code => {clearTimeout(timer); reject(new Error(`Preview exited ${code}: ${output}`));});
 });
}
async function poll(read, message, timeout = 8000) {
  const until = Date.now() + timeout;
  while (Date.now() < until) { if (await read()) return; await new Promise(resolve => setTimeout(resolve, 40)); }
  throw new Error(message);
}
let browser, context, page;
let failures = 0;
const errors = [];
const live='seer-ai-job-board-name',final='seer-rebrand-contest';
const routes=['#/',`#/m/${live}`,`#/m/${final}`,'#/m/seer-merch-for-devcon-mumbai','#/markets'];
async function go(route = '#/', query = '') {
  await page.goto(`${base}/${query}${route}`);
  await page.locator('main h1').waitFor();
  assert(!await page.locator('body').innerText().then(text=>/\bstage\b/i.test(text)),'No internal working name in visible copy');
  assert.equal(await page.locator('[aria-label*="stage" i],[title*="stage" i]').count(),0,'No internal working name in accessible labels');
  await page.waitForFunction(() => Boolean(window.__oppTest));
  await page.evaluate(() => {window.__oppTest.setFeed(false);return document.fonts.ready;});
}
async function resetTest({ tour = false, width = 1440, height = 900 } = {}) {
  if (context) await context.close();
  context = await browser.newContext({ viewport: { width, height }, hasTouch: width <= 700, reducedMotion: 'no-preference' });
  // Browser request interception exercises the built app without binding a server port.
  if(process.env.E2E_STATIC)await context.route('http://opportunity.test/**',async route=>{
    const path=decodeURIComponent(new URL(route.request().url()).pathname);
    const asset=path==='/'?'index.html':path.slice(1);
    const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.woff2':'font/woff2','.svg':'image/svg+xml','.json':'application/json'};
    await route.fulfill({path:join(out,'site',asset),contentType:types[extname(asset)]||'application/octet-stream'});
  });
  await context.addInitScript(({ tour }) => {
    try{if(!sessionStorage.getItem('test.seeded')){localStorage.clear();localStorage.setItem('opportunity.theme','dark');}}catch{return;}
    if(!sessionStorage.getItem('test.seeded')){
      sessionStorage.setItem('test.seeded','true');
    }

  }, { tour });
  page = await context.newPage(); page.setDefaultTimeout(8000);errors.length = 0;
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  page.on('requestfailed', request => { if (request.failure()?.errorText !== 'net::ERR_ABORTED') errors.push(`${request.url()} ${request.failure()?.errorText}`); });
}
async function test(name, run, options) {
  try {
    await resetTest(options); await run(); assert.deepEqual(errors, [], 'Browser errors');
    await page.screenshot({ path: `${out}${name}.png` });
    console.log(`PASS ${name}`);
  } catch (error) {
    failures++; console.error(`FAIL ${name}\n${error.stack}`);
    if (page) await page.screenshot({ path: `${out}${name}-FAIL.png` }).catch(() => {});
  }
}
const state=()=>page.evaluate(()=>window.__oppTest.getState());
async function fits(){assert(await page.evaluate(()=>document.documentElement.scrollHeight===innerHeight&&document.documentElement.scrollWidth===innerWidth),'Document must fit viewport');}
async function boardView(name){
 await page.getByTestId('board-views').getByRole('tab',{name,exact:true}).click();
 await poll(()=>page.getByTestId('board-views').getByRole('tab',{name,exact:true}).getAttribute('aria-selected').then(v=>v==='true'),'Board view '+name);
 await page.mouse.move(0,0);
}
async function settle(){await poll(()=>page.evaluate(()=>!document.getAnimations().some(a=>a.playState==='running'&&a.effect?.getTiming().iterations!==Infinity&&!a.effect?.target?.closest('.explainer'))),'Transitions settle');}
async function observable(){return page.evaluate(()=>({
 hash:location.hash,theme:document.documentElement.dataset.theme,
 state:window.__oppTest.getState(),text:document.body.innerText,
 controls:[...document.querySelectorAll('button,input,a,tr[tabindex]')].map(e=>[e.getAttribute('aria-label'),e.getAttribute('aria-expanded'),e.getAttribute('aria-selected'),e.getAttribute('aria-pressed'),e.value]),
 dialogs:[...document.querySelectorAll('dialog[open],[role=tooltip],[role=listbox]')].map(e=>e.textContent),
 scroll:[...document.querySelectorAll('.scroll-pane')].map(e=>e.scrollTop)
}));}
try {
 if(process.env.E2E_STATIC)base='http://opportunity.test';else await startPreview();
 browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 await test('01-routes-viewport',async()=>{for(const n of [1,12])for(const route of routes){await go(route,`?n=${n}`);await fits();}});
 await test('02-market-sheet-click-targets',async()=>{
  await go('#/markets');const cards=page.locator('.market-card');const count=await cards.count();
  for(let i=0;i<count;i++){
   const card=cards.nth(i),id=await card.getAttribute('data-market-id');
   // Deliberately click title text, the reported failing target.
   await card.locator('.card-head strong').click();
   await poll(()=>page.locator('.expanded-market[open]').count().then(n=>n===1),'Card did not open sheet');
   assert.equal(new URLSearchParams((await page.evaluate(()=>location.hash)).split('?')[1]).get('open'),id);
   assert.equal(await page.locator('#market-sheet-title').innerText(),(await state()).markets.find(m=>m.id===id).title);
   await page.locator('.expanded-market').getByRole('button',{name:'Close',exact:true}).click();
   await poll(()=>page.locator('.expanded-market').count().then(n=>n===0),'Sheet did not close');
  }
  await go();await page.getByRole('button',{name:'Open expanded view',exact:true}).click();await page.locator('.expanded-market[open]').waitFor();await page.keyboard.press('Escape');
  for(const button of await page.locator('.desktop-rail .expand-market').all()){const label=await button.getAttribute('aria-label');await button.click();await page.locator('.expanded-market[open]').waitFor();assert.equal(await page.locator('#market-sheet-title').innerText(),label.replace('Open expanded view: ',''));await page.keyboard.press('Escape');await poll(()=>page.locator('.expanded-market').count().then(n=>!n),'Rail sheet close');}
 });
 await test('03-data-invariants',async()=>{
  await go();const s=await state(),m=s.markets.find(m=>m.id===live),rows=m.rows;
  assert.equal(rows.length,235);assert.equal(rows.filter(o=>o.odds!==null&&o.odds!==.4).length,59);assert.equal(rows.filter(o=>o.odds===.4).length,46);assert.equal(rows.filter(o=>o.odds===null).length,130);
  const sorted=[...rows].sort((a,b)=>(b.odds??-1)-(a.odds??-1));
  assert.equal(sorted.slice(0,27).reduce((a,o)=>a+o.odds,0).toFixed(1),'60.4');
  assert(Math.abs(rows.reduce((a,o)=>a+(o.odds??0),0)-99)<.11,'Real observed odds sum');
  for(const m of s.markets.filter(m=>m.sample)){
   assert.equal(new Set(m.rows.map(o=>o.name)).size,m.rows.length);assert(m.rows.some(o=>o.odds===null));assert(m.rows.some(o=>o.odds===.4));
   assert(Math.abs(m.rows.reduce((a,o)=>a+(o.odds??0),0)-100)<1e-8);
  }
  await go('#/markets?status=All');for(const card of await page.locator('.market-card').all()){
   const marketId=await card.getAttribute('data-market-id');if((await state()).markets.find(m=>m.id===marketId)?.sample){const text=await card.locator('.triage-label').innerText(),value=Number(text.match(/([\d.]+)%/)[1]);assert(value>=55&&value<=85,text);}
  }
 });
 await test('03b-ticks-conserve-mass',async()=>{
  await go();const initial=await state(),rows=initial.markets[0].rows,sum=rows.reduce((a,o)=>a+(o.odds??0),0);
  await page.evaluate(()=>{window.__oppTest.setFeed(true);for(let i=0;i<12;i++)window.__oppTest.tick();window.__oppTest.setFeed(false);});
  const next=(await state()).markets[0];assert.equal(next.tick,12);assert(Math.abs(next.rows.reduce((a,o)=>a+(o.odds??0),0)-sum)<1e-8);
  await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>{window.__oppTest.setFeed(true);window.__oppTest.tick();window.__oppTest.setFeed(false);});assert.equal((await state()).markets[0].tick,12);
 });
 await test('04-filters-counts',async()=>{
  await go('#/markets','?n=3');assert.equal(await page.locator('.market-card').count(),1);
  const filters=page.locator('.filters');for(const [label,count]of [['All',3],['Completed',2],['Active',1]]){
   await filters.getByRole('button',{name:`${label} ${count}`,exact:true}).click();await poll(()=>page.locator('.market-card').count().then(n=>n===count),label);
  }
  await go('#/markets');const s=await state();assert.equal(await page.locator('.market-card').count(),s.markets.filter(m=>m.status==='Active').length);
  const widths=await page.locator('.card-meta .status').evaluateAll(els=>els.map(e=>e.getBoundingClientRect().width));assert(widths.length&&widths.every(w=>w===widths[0]&&w>=76));
 });
 await test('05-tiles-switch-speed',async()=>{
  await go();await boardView('Bubbles');
  for(const option of await page.locator('.desktop-rail .market-row').all()){
   const before=await state(),name=await option.locator('strong').innerText(),target=before.markets.find(m=>m.title===name);
   const start=Date.now();await option.click();await poll(()=>page.locator(`.field[data-market="${target.id}"]`).count().then(n=>n===1),'Market morph',450);assert(Date.now()-start<=450);
   for(const tile of await page.locator('.field-tile,.field-chip').all()){assert((await tile.innerText()).trim());assert(await tile.isVisible());}
  }
 });
 await test('06-tour-blur',async()=>{
  await go();await page.getByRole('button',{name:'How it works',exact:true}).click();await page.getByRole('button',{name:'Guide me in the app',exact:true}).click();
  const targets=['.desktop-rail .rail','.marquee','[data-testid=heatmap-field]','.cut-row','.sponsor-lane','.right-panel .selection','.right-panel .ticket','.header > .primary'];
  for(let i=0;i<8;i++){
   await poll(()=>page.locator('.tour-card .data-line').innerText().then(t=>t.includes(`${i+1} / 8`)),'Tour step');
   await poll(async()=>{const a=await page.locator(targets[i]).boundingBox(),b=await page.locator('.tour-ring').boundingBox();return b.x<=a.x+2&&b.y<=a.y+2&&b.x+b.width>=a.x+a.width-2&&b.y+b.height>=a.y+a.height-2;},'Spotlight containment');
   assert(await page.locator('.tour-scrim').evaluate(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.backdropFilter.includes('10px')&&s.clipPath!=='none'&&r.width===innerWidth&&r.height===innerHeight;}));
   await poll(async()=>{const a=await page.locator('.tour-card').boundingBox(),b=await page.locator('.tour-ring').boundingBox();return a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y;},'Tour card intersects target');
   await page.locator('.tour-card').getByRole('button',{name:i===7?'Enter':'Next',exact:true}).click();
  }
  assert.equal(await page.locator('.tour[open]').count(),0);
 });
 await test('07-marquee-steps-ticket',async()=>{
  await go();assert((await page.locator('.right-panel .ticket').boundingBox()).height<=240);
  assert.equal(await page.locator('.marquee-track').evaluate(e=>getComputedStyle(e).animationName),'none');
  assert.equal(await page.locator('.ticker-chip').count(),await page.locator('.ticker-chip').evaluateAll(els=>new Set(els.map(e=>e.textContent)).size));
  assert.equal(await page.locator('[data-testid="ticker-bar"]').getByText('Live markets',{exact:true}).count(),1);

 });
 await test('07b-explainer',async()=>{
  await resetTest({tour:true});await go();assert.equal(await page.locator('dialog[open]').count(),0);await page.getByRole('button',{name:'How it works',exact:true}).click();await page.locator('.explainer[open]').waitFor();
  const chapters=['Call for entries become submissions','Traders set the odds of selection','Price becomes a triage tool','Sponsor makes final decision','Traders earn P&L based on final decision'];
  await poll(()=>page.locator('.explainer-step.active').innerText().then(t=>t.includes(chapters[1])),'Explainer autoplay',6000);
  for(let i=0;i<5;i++){await page.locator('.explainer-step').nth(i).click();assert.equal(await page.locator('#explainer-title').innerText(),chapters[i]);assert.equal(await page.locator('.scene-art svg').getAttribute('aria-label'),chapters[i]);}
  await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#explainer-title').innerText(),chapters[3]);
  await page.keyboard.press('Escape');assert.equal(await page.locator('.explainer').count(),0);await go();assert.equal(await page.locator('.explainer').count(),0,'Never auto opens');
 });
 await test('07c-field-filter-restoration',async()=>{
  await go();await page.emulateMedia({reducedMotion:'reduce'});await boardView('Bubbles');
  const snapshot=()=>page.locator('.field-tile').evaluateAll(els=>els.map(e=>({name:e.querySelector('strong').textContent,opacity:getComputedStyle(e).opacity,background:getComputedStyle(e).backgroundColor,color:getComputedStyle(e).color})));
  await poll(()=>page.locator('.field-tile').count().then(n=>n>1),'Field ready');const initial=await snapshot();assert(initial.every(t=>t.opacity==='1'));
  await page.locator('#review-cut').focus();await page.keyboard.press('Home');assert(await page.locator('.field-tile.dim').count()>0);
  await page.keyboard.press('End');await poll(()=>page.locator('.field-tile.dim,.field-chip.dim').count().then(n=>n===130),'Cut did not restore priced and tied cells');
  await page.getByRole('tab',{name:'Ranked',exact:true}).click();await page.getByRole('tab',{name:'Bubbles',exact:true}).click();
  await poll(async()=>JSON.stringify(await snapshot())===JSON.stringify(initial),'Cut/view colors did not restore');
  await page.getByRole('button',{name:'View shortlist',exact:true}).click();assert.equal(await page.getByTestId('board-views').getByRole('tab',{name:'Ranked',exact:true}).getAttribute('aria-selected'),'true');
  await page.getByRole('tab',{name:'Bubbles',exact:true}).click();
  await poll(async()=>JSON.stringify(await snapshot())===JSON.stringify(initial),'Field colors did not restore');
  await page.evaluate(()=>window.__oppTest.selectMarket('sample-1'));await poll(()=>page.locator('.field').getAttribute('data-market').then(id=>id==='sample-1'),'Switch sample');
  await page.evaluate(id=>window.__oppTest.selectMarket(id),live);await poll(async()=>JSON.stringify(await snapshot())===JSON.stringify(initial),'Field colors changed after switching markets');
 });
 await test('07e-named-field-and-cards',async()=>{
  await go();await page.emulateMedia({reducedMotion:'reduce'});await boardView('Bubbles');
  await poll(()=>page.locator('.field-tile').count().then(n=>n===59),'All priced cells render');
  assert(await page.locator('.field').evaluate(e=>{const r=e.getBoundingClientRect(),card=e.closest('.stage-card').getBoundingClientRect();return r.height>=180&&r.top>=card.top&&r.bottom<=card.bottom;}),'Field stays usable inside its bounded card');
  assert(await page.locator('.field.bubbles').count());
  assert.equal(await page.locator('.field-tile').count(),59);
  assert.equal(await page.locator('.tier-pane').count(),2);
  assert.equal(await page.locator('.tier-pane').nth(0).locator('.field-chip').count(),46);
  assert.equal(await page.locator('.tier-pane').nth(1).locator('.field-chip').count(),130);
  assert.equal(await page.locator('.stage-card .tier-summary,.field-band').count(),0);
  for(const [label,count] of [['Tied at 0.4%',46],['No pool',130]]){const pane=page.getByRole('region',{name:label,exact:true});assert.equal(await pane.locator('.tier-count').innerText(),String(count));}
  assert(await page.locator('.field-tile,.field-chip').evaluateAll(els=>els.every(e=>e.querySelector('strong')?.textContent.trim()&&e.title&&getComputedStyle(e.querySelector('strong')).display!=='none')));
  assert(await page.locator('.field-tile').evaluateAll(els=>els.every(e=>{const r=e.getBoundingClientRect();return r.width>=55.9&&r.height>=55.9;})));
  await page.getByRole('tab',{name:'Heatmap',exact:true}).click();
  assert.equal(await page.locator('button.field-tile[data-testid^=heatmap-]').count(),59);
  assert(await page.locator('.field-tile').evaluateAll(els=>els.every(e=>{const r=e.getBoundingClientRect();return r.width>=103.9&&r.height>=63.9&&e.querySelector('strong')?.textContent.trim()&&e.title;})),'Heatmap cells retain labels and readable dimensions');
  await page.getByRole('tab',{name:'Bubbles',exact:true}).click();
  for(const pane of await page.locator('.tier-pane').all()){
   const last=pane.locator('.field-chip').last();await last.scrollIntoViewIfNeeded();await last.click();assert.equal(await page.getByTestId('selected-submission-name').innerText(),await last.locator('strong').innerText());
  }
  for(const selector of ['.cut-row','.sponsor-lane'])assert(await page.locator(selector).evaluate(e=>e.closest('[data-testid="decision-card"]')!==null),'Decision controls live in the right column');
  await page.getByRole('button',{name:'View shortlist',exact:true}).click();await page.getByTestId('review-cut-divider').waitFor();assert((await page.getByTestId('review-cut-divider').innerText()).includes('Top 27 cover 60.4%')); 
  assert.equal(await page.getByTestId('board-views').getByRole('tab',{name:'Ranked',exact:true}).getAttribute('aria-selected'),'true');
 });
 await test('07d-sheet-last-row',async()=>{
  for(const [width,height] of [[1440,900],[390,844]]){
   await page.setViewportSize({width,height});await go();await page.getByRole('button',{name:'Open expanded view',exact:true}).click();await page.locator('.expanded-market[open]').waitFor();
   assert.equal(await page.locator('.sheet-outcomes tbody tr').count(),235);
   const last=page.locator('.sheet-outcomes tbody tr').last();await last.scrollIntoViewIfNeeded();
   assert(await last.evaluate(e=>{const row=e.getBoundingClientRect(),pane=e.closest('.sheet-body').getBoundingClientRect(),header=document.querySelector('.sheet-header').getBoundingClientRect();return row.top>=Math.max(pane.top,header.bottom)&&row.bottom<=pane.bottom;}),'Last submission row is clipped');
   await page.locator('.sheet-trading .ticket').scrollIntoViewIfNeeded();assert(await page.locator('.sheet-trading .ticket').isVisible());
   await page.locator('.sheet-body').evaluate(e=>e.scrollTop=e.scrollHeight);assert(await page.locator('.sheet-header').evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<innerHeight;}),'Sticky header lost');
   await page.keyboard.press('Escape');
  }
 });
 await test('08-dropdowns',async()=>{
  await go('#/markets');const triggers=page.locator('.filter-trigger');
  for(const trigger of await triggers.all()){
   await page.evaluate(()=>{window.__menuFrames=[];const until=performance.now()+600;const sample=()=>{const e=document.querySelector('.hover-panel');if(e)window.__menuFrames.push({opacity:Number(getComputedStyle(e).opacity),scale:new DOMMatrixReadOnly(getComputedStyle(e).transform).a});if(performance.now()<until)requestAnimationFrame(sample);};requestAnimationFrame(sample);});
   await trigger.focus();await page.locator('.hover-panel').waitFor();assert.equal(await page.locator('.hover-panel').count(),1);
   await poll(()=>page.locator('.hover-panel').evaluate(e=>getComputedStyle(e).opacity==='1'&&new DOMMatrixReadOnly(getComputedStyle(e).transform).a>.999),'Menu spring did not settle');
   assert(await page.evaluate(()=>window.__menuFrames.some(f=>f.opacity<.99||f.scale<.999)),'Menu never animated');
   const r=await page.locator('.hover-panel').boundingBox(),t=await trigger.boundingBox();assert(r.x>=0&&r.x+r.width<=1440&&r.y>=0&&r.y+r.height<=900);assert(r.y>=t.y+t.height+7||r.y+r.height<=t.y-7);
  }
  await page.keyboard.press('Escape');await poll(()=>page.locator('.hover-panel').count().then(n=>!n),'Menu Esc');
 });
 await test('09-wallet-buy-redeem',async()=>{
  await go();const ticket=page.locator('.right-panel .ticket');await ticket.getByRole('button',{name:'Connect wallet',exact:true}).click();
  await page.locator('.wallet-dialog').getByRole('button',{name:'Connect wallet',exact:true}).click();
  await ticket.getByRole('spinbutton').fill('20');await ticket.locator('.primary').click();
  let s=await state();assert.equal(s.balance,230);assert(s.positions[s.submissionId]>0);
  await ticket.getByRole('spinbutton').fill('1000');assert.equal(await ticket.locator('.primary').getAttribute('aria-disabled'),'true');
  await page.evaluate(id=>location.hash=`/m/${id}`,final);await poll(()=>state().then(s=>s.selectedId===final),'Final route');
  s=await state();const winner=s.markets.find(m=>m.id===final).rows.find(o=>o.name==='Electric Foundation');
  assert.equal(s.submissionId,winner.id);const before=s.balance;await ticket.getByRole('button',{name:'Redeem',exact:true}).click();
  s=await state();assert.equal(s.balance,before+10);assert.equal(s.positions[winner.id],0);assert.equal(await ticket.locator('.primary').getAttribute('aria-disabled'),'true');
 });
 await test('10-overlap',async()=>{
  for(const route of routes){await go(route);await page.mouse.move(0,0);const bad=await page.evaluate(()=>{
   const clipped=(e,r)=>{for(let p=e.parentElement;p&&p!==document.body;p=p.parentElement){const c=getComputedStyle(p);if(/hidden|clip|auto|scroll/.test(c.overflowX+c.overflowY)){const q=p.getBoundingClientRect(),cx=r.x+r.width/2,cy=r.y+r.height/2;if(cx<q.left||cx>q.right||cy<q.top||cy>q.bottom)return true;}}return false;};const visible=e=>{const r=e.getBoundingClientRect();if(!r.width||!r.height||r.bottom<0||r.top>innerHeight||e.closest('[aria-hidden=true]')||clipped(e,r))return false;const hit=document.elementFromPoint(Math.max(0,Math.min(innerWidth-1,r.x+r.width/2)),Math.max(0,Math.min(innerHeight-1,r.y+r.height/2)));return hit&&(e.contains(hit)||hit.contains(e));};
   // Compare painted rectangles: scroll content's DOM bounds include its clipped rows.
   const paintedRect=e=>{const r=e.getBoundingClientRect();let {left,right,top,bottom}=r;for(let p=e.parentElement;p&&p!==document.body;p=p.parentElement){const c=getComputedStyle(p),q=p.getBoundingClientRect();if(/hidden|clip|auto|scroll/.test(c.overflowX)){left=Math.max(left,q.left);right=Math.min(right,q.right);}if(/hidden|clip|auto|scroll/.test(c.overflowY)){top=Math.max(top,q.top);bottom=Math.min(bottom,q.bottom);}}return {left,right,top,bottom,x:left,y:top,width:right-left,height:bottom-top};};
   const els=[...document.querySelectorAll('button,input,a,h1,h2,output')].filter(visible),bad=[];
   for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){const a=els[i],b=els[j];if(a.contains(b)||b.contains(a)||a.closest('[data-overlay]')||b.closest('[data-overlay]'))continue;const r=paintedRect(a),s=paintedRect(b);if(a.matches('.bubbles .field-tile')&&b.matches('.bubbles .field-tile')&&Math.hypot(r.x+r.width/2-s.x-s.width/2,r.y+r.height/2-s.y-s.height/2)>=(r.width+s.width)/2)continue;if(Math.min(r.right,s.right)-Math.max(r.left,s.left)>2&&Math.min(r.bottom,s.bottom)-Math.max(r.top,s.top)>2)bad.push([a.textContent,b.textContent]);}return bad;
  });assert.deepEqual(bad,[],route);}
 });
 await test('11-click-all',async()=>{
  for(const width of [1440,390]){
  await page.setViewportSize({width,height:900});
  const setups=[...routes.map(route=>({name:route,open:()=>go(route)})),
   ...routes.filter(route=>route!=='#/markets').flatMap(route=>['Ranked','Bubbles','Heatmap'].map(view=>({name:`${route} ${view}`,open:async()=>{await go(route);await boardView(view);}}))),
   ...['Bubbles','Heatmap'].map(variant=>({name:variant,open:async()=>{await go();await page.getByRole('tab',{name:'Bubbles',exact:true}).click();await page.getByRole('tab',{name:variant,exact:true}).click();}})),
   {name:'Ranked',open:async()=>{await go();await page.getByRole('tab',{name:'Ranked',exact:true}).click();}},
   {name:'Explore table',open:()=>go('#/markets?view=Table&filter=all')},
   ...['Outcomes: Any','Featured'].map(name=>({name:`Explore menu ${name}`,open:async()=>{await go('#/markets');await page.getByTestId('explore-filters').getByRole('button',{name,exact:true}).focus();await page.locator('.hover-panel').waitFor();}})),
   {name:'Market switcher',open:async()=>{await go();await page.getByTestId('market-switcher').getByRole('button').focus();await page.locator('.hover-panel').waitFor();}},
   {name:'Ticket outcomes',open:async()=>{await go();if(width<=900)await page.locator('.mobile-ticket-trigger').click();await page.getByTestId('trade-ticket').locator('.filter-trigger').focus();await page.locator('.hover-panel').waitFor();}},
   {name:'Collapsed panel',open:async()=>{await go();if(width>900)await page.getByTestId('markets-panel-toggle').click();else await page.locator('.mobile-market-selector').click();}},
   ...Array.from({length:5},(_,step)=>({name:`Explainer ${step+1}`,open:async()=>{await go();await page.getByRole('button',{name:'How it works',exact:true}).click();for(let i=0;i<step;i++)await page.locator('.scene-controls').getByRole('button',{name:'Next',exact:true}).click();}})),
   {name:'Submission drawer',open:async()=>{await go();if(width<=900)await page.locator('.mobile-ticket-trigger').click();await page.getByRole('button',{name:/^Review submission/}).click();await page.locator('.lot-drawer[open]').waitFor();}},
   {name:'Mobile ticket',open:async()=>{await go();if(width<=900)await page.locator('.mobile-ticket-trigger').click();}},
   {name:'Market sheet',open:async()=>{await go('#/markets');await page.locator('.market-card').first().locator('.card-head strong').click();await page.getByTestId('market-sheet').waitFor();}},
   {name:'Rail arrow',open:async()=>{await go();if(width>900)await page.locator('.desktop-rail .rail-market').first().hover();else await page.locator('.mobile-market-selector').click();}},
   ...Array.from({length:8},(_,step)=>({name:`Tour ${step+1}`,open:async()=>{await go();await page.getByRole('button',{name:'How it works',exact:true}).click();await page.getByRole('button',{name:'Guide me in the app',exact:true}).click();for(let i=0;i<step;i++)await page.getByTestId('market-tour').getByRole('button',{name:'Next',exact:true}).click();}})),
   {name:'Protocol',open:async()=>{await go();await page.getByTestId('nav-rail').getByRole('button',{name:'The protocol',exact:true}).click();await page.locator('.protocol-modal').waitFor();}},
   {name:'Funded wallet',open:async()=>{await go();await page.getByTestId('header-wallet').click();await page.getByTestId('wallet-dialog').getByRole('button',{name:'Connect wallet',exact:true}).click();await page.getByTestId('header-wallet').click();}},
   {name:'Wallet',open:async()=>{await go();await page.locator('.header > .primary').click();await page.locator('.wallet-dialog[open]').waitFor();}},
   {name:'Palette',open:async()=>{await go();await page.evaluate(()=>document.activeElement?.blur());await page.keyboard.press('/');}}];
  for(const setup of setups){
   for(let k=0;k<3;k++)await page.keyboard.press('Escape');await page.evaluate(()=>{try{localStorage.clear();sessionStorage.clear();localStorage.setItem('opportunity.theme','dark');}catch{/* about:blank */}});await page.goto('about:blank');await setup.open();await page.mouse.move(0,0);await settle();const controls=[];
   for(const el of await page.locator('button,input,a,[role="tab"],[role="option"],tr[tabindex]').all()){
    if(!await el.isVisible())continue;
    if(!await el.evaluate(e=>{const d=[...document.querySelectorAll('dialog[open]')].at(-1);if(d&&!d.contains(e))return false;if(e.closest('#seer-global-header,.seer-footer'))return false;const r=e.getBoundingClientRect(),p=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return p&&(e.contains(p)||p.contains(e));}))continue;
    if(await el.getAttribute('target')==='_blank')continue;
    const snapshot=await el.ariaSnapshot();
    // YAML quotes keys containing ': '. Unwrap that key before parsing the ARIA role/name.
    const firstLine=snapshot.split('\n')[0];
    const key=firstLine.startsWith("- '")?'- '+firstLine.slice(3,firstLine.lastIndexOf("'")).replaceAll("''", "'"):firstLine;
    const match=key.match(/^- (button|tab|link|option|row|textbox|spinbutton|slider|searchbox)(?: "((?:[^"\\]|\\.)*)")?/);
    assert(match,`Unnamed control: ${snapshot}`);
    const role=match[1],name=match[2]?JSON.parse('"'+match[2]+'"'):'';
    assert(name.trim(),`Unnamed control: ${snapshot}`);
    const popup=await el.evaluate(e=>!!e.closest('.hover-panel'));
    const ordinal=controls.filter(c=>c.role===role&&c.name===name&&c.popup===popup).length;controls.push({role,name,ordinal,id:await el.getAttribute('data-testid'),popup});
   }
   for(const control of controls){
    if(process.env.E2E_TRACE)console.log('  ctl',setup.name,control.role,control.name);
    for(let k=0;k<3;k++)await page.keyboard.press('Escape');await page.evaluate(()=>{try{localStorage.clear();sessionStorage.clear();localStorage.setItem('opportunity.theme','dark');}catch{/* about:blank */}});await page.goto('about:blank');await setup.open();const resolve=async()=>{const scope=control.popup?page.locator('.hover-panel[role=listbox]'):(await page.locator('dialog[open]').count())?page.locator('dialog[open]').last():page;return control.id?scope.getByTestId(control.id):scope.getByRole(control.role,{name:control.name,exact:true}).nth(control.ordinal);};let el=await resolve();
    await el.waitFor({state:'visible'});await page.mouse.move(0,0);if(control.popup)await el.focus();await settle();
    if(await el.getAttribute('readonly')!==null){assert.equal(await el.getAttribute('aria-label'),'Trade amount');continue;}
    if(await el.getAttribute('aria-pressed')==='true'||await el.getAttribute('aria-selected')==='true'){
     const alternate=el.locator('xpath=ancestor::*[self::div or self::section][.//*[@aria-pressed="false" or @aria-selected="false"]][1]').locator('button[aria-pressed=false],button[aria-selected=false],tr[aria-selected=false]').first();
     if(await alternate.count()){
      // Market selection dismisses the mobile sheet; menu selection also closes its listbox.
      const owner=await el.evaluate(e=>{const menu=e.closest('[role=listbox]');const trigger=menu?.id?[...document.querySelectorAll('[aria-controls]')].find(t=>t.getAttribute('aria-controls')===menu.id):null;return {mobile:!!e.closest('dialog.market-sheet'),trigger:trigger?[...document.querySelectorAll('.filter-trigger')].indexOf(trigger):-1};});
      await alternate.click();
      if(owner.mobile&&!await page.locator('dialog.market-sheet[open]').count())await page.locator('.mobile-market-selector').click();
      if(owner.trigger>=0)await page.locator('.filter-trigger').nth(owner.trigger).press('ArrowDown');
      el=await resolve();await el.waitFor({state:'visible'});
     }
     else if(control.role!=='option'){throw new Error(`Selected control has no alternative to exercise: ${setup.name} ${control.name}`);}
    }if(await el.getAttribute('aria-disabled')==='true'||await el.isDisabled()){assert(await el.getAttribute('title'),'Disabled control requires explanation');continue;}
    if(control.role==='link'){
     const href=await el.getAttribute('href');
     if(href?.startsWith('#/')&&href.split('?')[0]===await page.evaluate(()=>location.hash.split('?')[0])){
      const targetPath=href.split('?')[0];
      const prime=targetPath==='#/markets'?`#/m/${live}`:'#/markets';
      await page.evaluate(hash=>{location.hash=hash;},prime);
      await poll(()=>page.evaluate(path=>location.hash.split('?')[0]===path,prime),'Prime internal route link');await settle();
     }
    }
    if(control.name==='The pilot'){await page.evaluate(id=>{window.__oppTest.selectMarket(id);location.hash=`/m/${id}`;},final);await poll(()=>state().then(s=>s.selectedId===final),'Prime pilot navigation');}
    if(await el.evaluate(e=>e.matches('.ticker-chip'))){const target=await el.getAttribute('data-market-id');await page.evaluate(id=>{const s=window.__oppTest.getState();window.__oppTest.selectMarket(s.markets.find(m=>m.id!==id).id);},target);}
    await page.evaluate(()=>document.activeElement?.blur());await page.mouse.move(0,0);
    // Keep transient options alive while waiting for their entrance animation.
    if(control.role==='option')await el.focus();
    await settle();el=await resolve();await el.waitFor({state:'visible'});
    const before=await observable();
    if(['textbox','searchbox'].includes(control.role))await el.fill('Rebrand');
    else if(control.role==='spinbutton')await el.fill('21');
    else if(control.role==='slider'){await el.focus();await el.press((await el.inputValue())==='1'?'End':'Home');}
    else if(await el.evaluate(e=>e.matches('.market-info'))){await el.focus();await page.getByRole('tooltip').waitFor();}
    else await el.click();
    await poll(async()=>JSON.stringify(await observable())!==JSON.stringify(before),`Dead control: ${setup.name} ${control.name}`,2000);
   }
  }
  }
 });
 await test('28-restored-v1-parity',async()=>{
  await go(`#/m/${final}`);
  const pilot=page.getByTestId('nav-rail').getByRole('button',{name:'The pilot',exact:true});
  const hint=async(trigger,text)=>{
   for(const mode of ['hover','focus']){
    await page.evaluate(()=>document.activeElement?.blur());await page.mouse.move(0,0);
    if(mode==='hover')await trigger.hover();else await trigger.focus();
    await poll(()=>page.getByRole('tooltip').allTextContents().then(values=>values.some(value=>value.includes(text))),`${mode}: ${text}`);
    await page.keyboard.press('Escape');await trigger.evaluate(e=>e.blur());await page.mouse.move(0,0);
   }
  };
  await hint(pilot,'The pilot');await pilot.click();
  await poll(()=>state().then(s=>s.selectedId===live),'Pilot selects live market');
  assert.equal(await page.locator('main h1').innerText(),'Seer AI Job Board Name');
  await poll(()=>page.evaluate(id=>location.hash===`#/m/${id}?filter=active`,live),'Pilot route preserves active filter');
  assert.equal(await page.evaluate(()=>location.hash),`#/m/${live}?filter=active`);
  assert.equal((await state()).status,'Active');
  await hint(page.getByRole('button',{name:'About selection markets',exact:true}),'How to use: Odds guide review; sponsor decides');
  await boardView('Ranked');
  await hint(page.getByTestId('ladder-tier-0'),'Filter submissions by their quoted odds.');
  assert.equal(await page.getByTestId('ranked-submissions').getAttribute('aria-description'),'Filter submissions by their quoted odds.');
  await boardView('Bubbles');
  for(const [label,text] of [['No pool','No trading pool exists for these submissions.'],['Tied at 0.4%','These submissions share the same quoted odds of 0.4%.']]){
   await hint(page.getByRole('region',{name:label,exact:true}).locator('h2 .tooltip-anchor'),text);
  }
  await page.getByRole('button',{name:'Open expanded view',exact:true}).click();await page.getByTestId('market-sheet').waitFor();
  assert.equal(await page.getByTestId('market-sheet').getByRole('group',{name:'Submission tiers'}).getAttribute('aria-description'),'Filter submissions by their quoted odds.');
  for(const [label,text] of [['Priced','Filter submissions by their quoted odds.'],['No pool','No trading pool exists for these submissions.'],['Tied at 0.4%','These submissions share the same quoted odds of 0.4%.']]){
   await hint(page.getByTestId('market-sheet').getByRole('group',{name:'Submission tiers'}).getByRole('button',{name:label,exact:true}),text);
  }
 });
 await test('12-colour-and-contrast',async()=>{
  await go();const colourRoutes=[...new Set([...routes,...(await state()).markets.map(m=>`#/m/${m.id}`)])];
  for(const theme of ['dark','light'])for(const route of colourRoutes){
   await go(route);await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);
   const check=async(label)=>{await page.mouse.move(0,0);await settle();await page.evaluate(()=>document.activeElement?.blur());const report=await page.evaluate(colourAudit);assert.deepEqual(report.yellows,[],`Non-EF hue: ${theme} ${route} ${label}`);assert.deepEqual(report.contrast,[],`Contrast >=4.5: ${theme} ${route} ${label}`);};
   if(route!=='#/markets')for(const view of ['Ranked','Bubbles','Heatmap']){await boardView(view);await check(view);}
   else await check('Explore');
   await page.getByTestId('header-wallet').click();await page.getByTestId('wallet-dialog').waitFor();await check('Wallet');await page.keyboard.press('Escape');
   await page.getByTestId('nav-rail').getByRole('button',{name:'How it works',exact:true}).click();await page.locator('.explainer[open]').waitFor();await check('Explainer');await page.keyboard.press('Escape');
   await page.getByTestId('top-bar').getByRole('button',{name:'Search markets',exact:true}).click();await page.getByTestId('command-palette').waitFor();await check('Palette');await page.keyboard.press('Escape');
   if(route==='#/markets')await page.locator('.market-card').first().click();else await page.getByRole('button',{name:'Open expanded view',exact:true}).click();
   await page.getByTestId('market-sheet').waitFor();await check('Market sheet');await page.keyboard.press('Escape');
  }
 });
 await test('13-reduced-motion',async()=>{
  await page.emulateMedia({reducedMotion:'reduce'});await go();await page.getByRole('button',{name:'How it works',exact:true}).click();
  assert.equal(await page.locator('.scene-art').getAttribute('data-static'),'true');
  assert.equal(await page.locator('.marquee-track').evaluate(e=>getComputedStyle(e).animationName),'none');
  const title=await page.locator('#explainer-title').innerText();await page.waitForTimeout(5200);assert.equal(await page.locator('#explainer-title').innerText(),title);
  await page.locator('.scene-controls').getByRole('button',{name:'Next',exact:true}).click();assert.notEqual(await page.locator('#explainer-title').innerText(),title);
  await page.emulateMedia({reducedMotion:'no-preference'});await poll(()=>page.locator('.scene-art').getAttribute('data-static').then(v=>v==='false'),'Runtime motion enabled');await page.emulateMedia({reducedMotion:'reduce'});await poll(()=>page.locator('.scene-art').getAttribute('data-static').then(v=>v==='true'),'Runtime motion stopped');
 });
 await test('14-mobile-touch',async()=>{
  const audit=async(label)=>{
   assert(await page.evaluate(()=>document.documentElement.scrollWidth===innerWidth),'Mobile horizontal overflow');
   const bad=await page.evaluate(()=>[...document.querySelectorAll('button,input,a,[role=option]')].flatMap(e=>{
    const r=e.getBoundingClientRect(),css=getComputedStyle(e);if(!r.width||!r.height||Number(css.opacity)===0||r.y<0||r.bottom>innerHeight||e.closest('[aria-hidden=true]'))return [];
    const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);if(!hit||!e.contains(hit))return [];
    return r.width<40||r.height<40?[{name:e.getAttribute('aria-label')||e.textContent,width:r.width,height:r.height}]:[];
   }));assert.deepEqual(bad,[],label);
  };
  for(const route of routes){await go(route);for(const view of route==='#/markets'?['Explore']:['Ranked','Bubbles','Heatmap']){
   if(view!=='Explore')await boardView(view);await audit(route+' '+view);
   await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));await audit(route+' bottom '+view);await page.evaluate(()=>window.scrollTo(0,0));
  }}
  await go();await page.locator('.mobile-market-selector').click();await page.locator('.market-sheet[open]').waitFor();await audit('Markets sheet');await page.keyboard.press('Escape');
  await page.locator('.mobile-ticket-trigger').click();await page.locator('.ticket-sheet[open]').waitFor();
  await page.locator('.ticket-sheet .ticket').scrollIntoViewIfNeeded();await audit('Trading sheet');await page.keyboard.press('Escape');
  await page.getByTestId('nav-rail').getByRole('button',{name:'How it works',exact:true}).click();await page.locator('.explainer[open]').waitFor();await audit('Explainer');await page.keyboard.press('Escape');
  await page.getByTestId('header-wallet').click();await page.getByTestId('wallet-dialog').waitFor();await audit('Wallet');
 },{width:390,height:844});
 await test('15-responsive-fit-variants',async()=>{
  const sizes=[[1366,768],[1280,720],[1152,720],[1024,768],[1440,900],[1920,1080],[2560,1440]];
  for(const [width,height] of sizes){
   await page.setViewportSize({width,height});
   for(const route of routes){
    await go(route,'?n=12');
    for(const variant of route==='#/markets'?['Explore']:['Ranked','Bubbles','Heatmap']){
     if(variant==='Ranked')await page.getByRole('tab',{name:'Ranked',exact:true}).click();
     else if(variant!=='Explore'){await page.getByRole('tab',{name:'Bubbles',exact:true}).click();await page.getByRole('tab',{name:variant,exact:true}).click();}
     await page.evaluate(()=>document.fonts.ready);await page.mouse.move(0,0);await settle();
     const violations=await page.evaluate(()=>{
      const failures=[],visible=[];
      const scrollParent=e=>{for(let p=e.parentElement;p;p=p.parentElement){const c=getComputedStyle(p);if(/auto|scroll/.test(c.overflowY+c.overflowX)&& (p.scrollHeight>p.clientHeight+1||p.scrollWidth>p.clientWidth+1))return p;}return null;};
      for(const e of document.querySelectorAll('main *,header *,footer *,nav.nav-rail *')){
       const r=e.getBoundingClientRect(),style=getComputedStyle(e);if(!r.width||!r.height||style.visibility==='hidden'||Number(style.opacity)===0||e.closest('[aria-hidden=true],.marquee'))continue;
       const pane=scrollParent(e),outside=r.left<-.5||r.top<-.5||r.right>innerWidth+.5||r.bottom>innerHeight+.5;
       if(pane){const pr=pane.getBoundingClientRect(),cs=getComputedStyle(pane);if(pr.top<0||pr.bottom>innerHeight+.5||pr.left<0||pr.right>innerWidth+.5)failures.push('scroll pane outside viewport');if(cs.scrollbarWidth==='none'&&!pane.parentElement.querySelector('.scroll-cue'))failures.push('no scroll cue');if(r.top<pr.top||r.bottom>pr.bottom||r.left<pr.left||r.right>pr.right)continue;}
       else if(outside)failures.push('outside: '+e.className);
       if(e.matches('button,a,input,[role=option]')&&r.top>=0&&r.bottom<=innerHeight)visible.push({e,r});
      }
      for(let i=0;i<visible.length;i++)for(let j=i+1;j<visible.length;j++){const a=visible[i],b=visible[j];if(a.e.contains(b.e)||b.e.contains(a.e))continue;if(a.e.matches('.bubbles .field-tile')&&b.e.matches('.bubbles .field-tile')&&Math.hypot(a.r.x+a.r.width/2-b.r.x-b.r.width/2,a.r.y+a.r.height/2-b.r.y-b.r.height/2)>=(a.r.width+b.r.width)/2)continue;const overlap=Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left)>1&&Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top)>1;if(overlap)failures.push('overlap: '+a.e.className+' / '+b.e.className);}
      if(document.documentElement.scrollHeight>innerHeight+1)failures.push('page scroll');return failures;
     });
     assert.deepEqual(violations,[],`${width}x${height} ${route} ${variant}`);assert.deepEqual(await page.evaluate(geometryAudit),[],`Painted overlaps ${width}x${height} ${route} ${variant}`);
     if(variant!=='Explore')for(const selector of ['.decision-card','.right-panel .ticket>.primary','.ticker-bar']){const r=await page.locator(selector).boundingBox();assert(r&&r.y>=0&&r.y+r.height<=height,`${selector} visible without scrolling`);}
    }
   }
  }
  await page.setViewportSize({width:1280,height:640});await go();
  assert(await page.evaluate(()=>document.documentElement.scrollHeight>innerHeight),'Short viewport scrolls');
  await page.locator('.ticker-bar').scrollIntoViewIfNeeded();assert(await page.locator('.ticker-bar').isVisible());
 });
 await test('17-search-routing-history',async()=>{
  await go();
  for(const shortcut of ['/','Control+k','Meta+k']){
   await page.evaluate(()=>document.activeElement?.blur());await page.keyboard.press(shortcut);
   await page.getByTestId('command-palette').waitFor();
   const input=page.getByRole('textbox',{name:'Search markets and submissions'});
   await input.fill('Rebrand');await input.press('ArrowDown');await input.press('Enter');
   await poll(async()=> (await state()).selectedId===final && await page.getByTestId('command-palette').count()===0,'Palette selects market');
   assert((await page.evaluate(()=>location.hash)).startsWith(`#/m/${final}`));
  }
  await page.getByRole('link',{name:'Seer home',exact:true}).click();assert.equal(await page.evaluate(()=>location.hash),'#/');
  await page.goBack();
  await poll(()=>page.evaluate(id=>location.hash.startsWith(`#/m/${id}`),final),'Back restores palette route');
  await page.goForward();
  await poll(()=>page.evaluate(()=>location.hash==='#/'),'Forward restores query-free home');
  assert.equal((await state()).status,'Active');
  await go('#/markets','?n=3');
  const filters=page.getByTestId('explore-filters');
  await filters.getByRole('button',{name:'All 3',exact:true}).click();
  await filters.getByRole('textbox',{name:'Search markets',exact:true}).fill('Rebrand');
  await poll(()=>page.locator('.market-card').count().then(n=>n===1),'Explore query results');
  const url=new URLSearchParams((await page.evaluate(()=>location.hash)).split('?')[1]);assert.equal(url.get('q'),'Rebrand');assert.equal(url.get('status'),'All');
  await filters.getByRole('textbox',{name:'Search markets',exact:true}).fill('');
  await page.goBack();await poll(()=>filters.getByRole('textbox',{name:'Search markets',exact:true}).inputValue().then(v=>v==='Rebrand'),'History restores query');
  await page.goForward();await poll(()=>filters.getByRole('textbox',{name:'Search markets',exact:true}).inputValue().then(v=>v===''),'Forward restores query');
  await filters.getByRole('button',{name:'Top 5',exact:true}).click();assert.equal(await page.locator('.market-card').count(),1);
  await filters.getByRole('button',{name:'Table',exact:true}).click();assert.equal(await page.getByTestId('explore-results').locator('tbody tr').count(),1);
  await filters.getByRole('textbox',{name:'Search markets',exact:true}).fill('no matching market');
  await page.locator('.empty').waitFor();await page.locator('.empty').getByRole('button',{name:'All',exact:true}).click();assert.equal(await page.getByTestId('explore-results').locator('tbody tr').count(),3);
 });
 await test('17b-explore-size-sort-and-avatars',async()=>{
  await go('#/markets?status=All','?n=12');
  const filters=page.getByTestId('explore-filters');
  const menu=async(label,value)=>{const trigger=filters.getByRole('button',{name:label,exact:true});await trigger.press('ArrowDown');await page.locator('.hover-panel').getByRole('option',{name:value,exact:true}).click();};
  await menu('Outcomes: Any','<25');
  let model=await state();assert.equal(model.size,'<25');
  assert.equal(await page.locator('.market-card').count(),model.markets.filter(m=>m.outcomes<25).length);
  await menu('Outcomes: <25','Any');await menu('Featured','Volume');
  model=await state();assert.equal(model.sort,'Volume');
  assert.deepEqual(await page.locator('.market-card').evaluateAll(els=>els.map(e=>e.dataset.marketId)),[...model.markets].sort((a,b)=>b.volume-a.volume).map(m=>m.id));
  const glyphs=await page.locator('[data-avatar]').evaluateAll(els=>els.map(e=>[e.dataset.avatar,e.textContent]));
  const seen=new Map();for(const [id,text] of glyphs){if(seen.has(id))assert.equal(seen.get(id),text);seen.set(id,text);}
 });
 await test('18-submission-review-and-sheet-url',async()=>{
  await go();await page.emulateMedia({reducedMotion:'reduce'});await boardView('Ranked');
  const cell=page.getByTestId('ranked-submissions').locator('[data-submission-id]').nth(1);await cell.waitFor({state:'visible'});const name=await cell.getByTestId('submission-name').innerText();
  await cell.click();assert.equal(await page.getByTestId('selected-submission').locator('.selected-top h2').innerText(),name);
  assert.equal(await page.getByTestId('lot-drawer').count(),0,'Single click selects');
  await cell.press('Enter');await page.getByTestId('lot-drawer').waitFor();assert.equal(await page.getByTestId('lot-drawer').locator('.selected-top h2').innerText(),name);
  await page.getByTestId('lot-drawer').getByRole('button',{name:'Sell',exact:true}).click();assert.equal(await page.locator('.right-panel .ticket').getByRole('button',{name:'Sell',exact:true}).getAttribute('aria-pressed'),'true');
  await go(`#/markets?status=All&open=${live}`);await page.getByTestId('market-sheet').waitFor();
  assert.equal(await page.locator('.sheet-outcomes tbody tr').count(),235);
  await page.getByTestId('market-sheet').getByRole('button',{name:'No pool',exact:true}).click();assert.equal(await page.locator('.sheet-outcomes tbody tr').count(),130);
  await page.keyboard.press('Escape');await poll(()=>page.getByTestId('market-sheet').count().then(n=>n===0),'Sheet closes');
  const query=new URLSearchParams((await page.evaluate(()=>location.hash)).split('?')[1]);assert.equal(query.get('status'),'All');assert.equal(query.has('open'),false);
  await page.goBack();await page.getByTestId('market-sheet').waitFor();await page.keyboard.press('Escape');
 });
 await test('19-wallet-sell-and-reset',async()=>{
  await go();const ticket=page.locator('.right-panel .ticket');
  await page.getByTestId('header-wallet').click();await page.getByTestId('wallet-dialog').getByRole('button',{name:'Connect wallet',exact:true}).click();
  await ticket.getByRole('spinbutton').fill('20');await ticket.locator('.primary').click();
  const bought=await state(),shares=bought.positions[bought.submissionId];assert(shares>0);
  await ticket.getByRole('button',{name:'Sell',exact:true}).click();await ticket.getByRole('spinbutton').fill('1');await ticket.locator('.primary').click();
  const sold=await state();assert.equal(sold.positions[sold.submissionId],shares-1);assert(sold.balance>bought.balance);
  await ticket.getByRole('spinbutton').fill('100000');assert.equal(await ticket.locator('.primary').getAttribute('aria-disabled'),'true');
  await page.getByTestId('header-wallet').click();await page.getByTestId('wallet-dialog').getByRole('button',{name:'Reset to 250 sDAI',exact:true}).click();assert.equal((await state()).balance,250);
  await page.getByTestId('header-wallet').click();await page.getByTestId('wallet-dialog').getByRole('button',{name:'Disconnect',exact:true}).click();assert.equal((await state()).connected,false);
 });
 await test('25-persistent-market-filter',async()=>{
  for(const entry of ['panel','switcher'])for(const filter of ['Completed','All']){
   await go('#/','?n=3');
   const panel=page.getByTestId('markets-rail');
   if(entry==='switcher')await page.getByTestId('market-switcher').locator('.filter-trigger').press('ArrowDown');
   const scope=entry==='panel'?panel:page.locator('.hover-panel');
   await scope.getByRole('button',{name:new RegExp(`^${filter} `)}).click();
   if(entry==='panel')await panel.getByRole('option',{name:'Seer Rebrand Contest',exact:true}).click();
   else await page.locator('.hover-panel').getByRole('option',{name:/Seer Rebrand Contest/}).click();
   const verify=async()=>{
    await poll(()=>state().then(s=>s.status===filter&&s.selectedId===final),'Filter and selection persist');
    assert.equal(await panel.getByRole('button',{name:new RegExp(`^${filter} `)}).getAttribute('aria-pressed'),'true');
    assert.equal(await panel.getByRole('option',{name:'Seer Rebrand Contest',exact:true}).getAttribute('aria-selected'),'true');
    assert.equal(new URLSearchParams((await page.evaluate(()=>location.hash)).split('?')[1]).get('filter'),filter.toLowerCase());
    await page.getByTestId('market-switcher').locator('.filter-trigger').press('ArrowDown');
    assert.equal(await page.locator('.hover-panel').getByRole('button',{name:new RegExp(`^${filter} `)}).getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('.hover-panel').getByRole('option',{name:/Seer Rebrand Contest/}).getAttribute('aria-selected'),'true');
    await page.keyboard.press('Escape');
   };
   await verify();await page.reload();await page.locator('main h1').waitFor();await verify();
  }
  await go('#/','?n=3');
  const panel=page.getByTestId('markets-rail');
  await panel.getByRole('button',{name:'Completed 2',exact:true}).click();
  await poll(()=>state().then(s=>s.status==='Completed'),'Completed');
  await panel.getByRole('option',{name:'Seer Rebrand Contest',exact:true}).click();
  await panel.getByRole('button',{name:'All 3',exact:true}).click();
  await page.goBack();await poll(()=>state().then(s=>s.status==='Completed'&&s.selectedId===final),'Back restores Completed');
  await page.goForward();await poll(()=>state().then(s=>s.status==='All'&&s.selectedId===final),'Forward restores All');
 });
 await test('26-light-default-and-theme-toggle',async()=>{
  await go();assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),'light','Old dark key must be ignored');
  assert.equal(await page.getByTestId('nav-rail').getByRole('button',{name:/theme/i}).count(),0);
  const toggle=page.getByTestId('top-bar').getByRole('button',{name:'Switch theme',exact:true});
  const rect=await toggle.boundingBox(),wallet=await page.getByTestId('header-wallet').boundingBox();
  assert.equal(rect.width,40);assert.equal(rect.height,40);assert(rect.x+rect.width<=wallet.x);
  for(const theme of ['dark','light']){
   await toggle.click();await poll(()=>page.evaluate(t=>document.documentElement.dataset.theme===t,theme),'Theme '+theme);
   await page.reload();await page.locator('main h1').waitFor();
   assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),theme);
   assert.equal(await page.evaluate(()=>localStorage.getItem('opportunity.v9.theme')),theme);
  }
 });
 await test('20-switcher-and-protocol',async()=>{
  await go();const switcher=page.getByTestId('market-switcher');await switcher.locator('.filter-trigger').focus();
  await page.getByRole('textbox',{name:'Find markets in switcher'}).fill('Gnosis');
  const option=page.locator('.hover-panel [role=option]').first();const title=await option.locator('span').first().innerText();await option.click();
  const selected=await state();assert.equal(selected.markets.find(m=>m.id===selected.selectedId)?.title,title);
  await page.getByRole('button',{name:'The protocol',exact:true}).click();await page.getByTestId('protocol-modal').waitFor();
  await poll(()=>page.getByTestId('protocol-modal').evaluate(e=>e.contains(document.activeElement)),'Protocol receives focus');
  assert.equal(await page.getByTestId('protocol-modal').evaluate(e=>e.matches(':modal')),true);
  for(const key of ['Tab','Shift+Tab']){await page.keyboard.press(key);assert(await page.getByTestId('protocol-modal').evaluate(e=>e.contains(document.activeElement)),'Protocol traps '+key);}
  for(const label of ['TODAY','NEXT','ANY DECISION'])assert(await page.locator('.protocol-modal').getByText(label,{exact:true}).isVisible());
  await page.keyboard.press('Escape');assert.equal(await page.locator('.protocol-modal').count(),0);
 });
 await test('16-board-choice-restoration',async()=>{
  await go();await page.evaluate(()=>{localStorage.removeItem('opportunity.v8.field');localStorage.setItem('opportunity.field','Ranked');});await go();assert.equal(await page.getByTestId('board-views').getByRole('tab',{name:'Heatmap',exact:true}).getAttribute('aria-selected'),'true');
  assert.deepEqual(await page.getByTestId('board-views').getByRole('tab').allTextContents(),['Heatmap','Bubbles','Ranked']);
  for(const view of ['Heatmap','Bubbles','Ranked']){await boardView(view);await go();assert.equal(await page.getByTestId('board-views').getByRole('tab',{name:view,exact:true}).getAttribute('aria-selected'),'true');assert.equal(await page.evaluate(()=>localStorage.getItem('opportunity.v8.field')),view);}
 });
 await test('21-nav-panel-and-breadcrumb',async()=>{
  await go();const nav=page.getByTestId('nav-rail'),panel=page.getByTestId('markets-rail');
  assert.equal(await nav.getByRole('button',{name:/wallet/i}).count(),0);
  assert.equal(Math.round((await nav.boundingBox()).width),64);
  assert.equal(Math.round((await page.getByTestId('top-bar').boundingBox()).height),56);
  const before=await page.getByTestId('market-board').boundingBox();
  await page.getByTestId('markets-panel-toggle').click();
  await poll(()=>panel.boundingBox().then(r=>r.width<=64),'Panel collapses to avatars');
  assert.equal(await panel.getByRole('textbox').isVisible(),false);
  assert(await panel.locator('.market-row .glyph').first().isVisible());
  assert((await page.getByTestId('market-board').boundingBox()).width>before.width);
  await page.getByTestId('markets-panel-toggle').click();await panel.getByRole('textbox').waitFor();
  await poll(()=>panel.boundingBox().then(r=>Math.abs(r.width-280)<1),'Panel restores width');
  await nav.getByRole('link',{name:'Archive',exact:true}).click();await poll(()=>state().then(s=>s.status==='Completed'),'Archive filter');
  assert((await page.evaluate(()=>location.hash)).includes('status=Completed'));
  await nav.getByRole('link',{name:'Explore',exact:true}).click();await poll(()=>state().then(s=>s.status==='All'),'Explore includes every market');
  await nav.getByRole('link',{name:'Markets',exact:true}).click();await page.locator('.field.heatmap').waitFor();
  await page.getByTestId('top-bar').getByRole('link',{name:'Opportunity Markets',exact:true}).click();await poll(()=>page.evaluate(()=>location.hash==='#/'),'Breadcrumb returns home');
 });
 await test('22-ranked-pareto-ladder',async()=>{
  await go();await boardView('Ranked');await page.emulateMedia({reducedMotion:'reduce'});
  const ladder=page.getByTestId('ranked-pareto-ladder'),pane=page.getByTestId('ranked-submissions');
  assert.equal(await ladder.locator('.coverage-readout').innerText(),'Top 27 · 60.4% of odds');
  assert.deepEqual(await ladder.locator('.ladder-head span').allTextContents(),['Rank','Submission','Odds','Cumulative']);
  assert.equal(await page.getByTestId('ladder-tier-0').getAttribute('aria-expanded'),'true');
  assert((await page.getByTestId('ladder-tier-0').innerText()).includes('Priced · 59'));
  const rows=(await state()).markets.find(m=>m.id===live).rows;
  const expected=[...rows].sort((a,b)=>(b.odds??-1)-(a.odds??-1));
  for(const row of await pane.locator('.ladder-row').all()){
   const id=await row.getAttribute('data-submission-id'),item=expected.find(o=>o.id===id);
   assert.equal(await row.locator('.ladder-submission>span:not(.glyph)').innerText(),item.name);
   assert(await row.getAttribute('title'));assert.equal(Math.round((await row.boundingBox()).height),40);
  }
  const second=pane.locator('.ladder-row').nth(1),id=await second.getAttribute('data-submission-id');
  await second.click();await page.mouse.move(0,0);assert.equal((await state()).submissionId,id);assert.equal(await page.getByTestId('lot-drawer').count(),0);
  await second.press('Enter');await page.getByTestId('lot-drawer').waitFor();await page.keyboard.press('Escape');
  await page.getByTestId('review-cut').fill('1');assert.equal(await ladder.locator('.coverage-readout').innerText(),`Top 1 · ${expected[0].odds.toFixed(1)}% of odds`);
  await page.getByTestId('review-cut').fill('27');await page.getByRole('button',{name:'View shortlist',exact:true}).click();
  await page.getByTestId('review-cut-divider').waitFor();assert((await page.getByTestId('review-cut-divider').innerText()).includes('60.4%'));
  assert.equal(Math.round((await page.getByTestId('review-cut-divider').boundingBox()).height),28);
  // Collapse priced rows so the virtualized tier controls are brought into view.
  await pane.evaluate(e=>e.scrollTop=0);await page.getByTestId('ladder-tier-0').click();
  for(const [key,label,count] of [[1,'Tied at 0.4%',46],[2,'No pool',130]]){
   const group=page.getByTestId(`ladder-tier-${key}`);await group.scrollIntoViewIfNeeded();assert((await group.innerText()).includes(`${label} · ${count}`));
   assert.equal(await group.getAttribute('aria-expanded'),'false');await group.click();assert.equal(await group.getAttribute('aria-expanded'),'true');
   await pane.evaluate(e=>e.scrollTop=e.scrollHeight);
   const last=expected.filter(o=>key===1?o.odds===.4:o.odds===null).at(-1);
   await page.getByTestId(`ranked-row-${last.id}`).waitFor();await page.getByTestId(`ranked-row-${last.id}`).click();await page.mouse.move(0,0);
   assert.equal((await state()).submissionId,last.id);assert.equal(await page.getByTestId('selected-submission-name').innerText(),last.name);
   await pane.evaluate(e=>e.scrollTop=0);await group.scrollIntoViewIfNeeded();await group.click();
  }
  const cut=page.getByRole('slider',{name:'Coverage review cut',exact:true});await cut.focus();await cut.press('Home');assert((await ladder.locator('.coverage-readout').innerText()).startsWith('Top 1 ·'));
  await cut.press('End');assert((await ladder.locator('.coverage-readout').innerText()).startsWith('Top 105 ·'));
  await page.evaluate(()=>document.activeElement?.blur());
  const svg=page.getByTestId('coverage-strip').locator('svg'),box=await svg.boundingBox();
  await page.mouse.move(box.x+box.width*.08,box.y+20);await page.mouse.down();await page.mouse.move(box.x+box.width*.2,box.y+20);await page.mouse.up();
  assert(Number(await cut.inputValue())>1&&Number(await cut.inputValue())<105,'Curve dragging adjusts review cut');
 });
 await test('23-mobile-panels-and-navigation',async()=>{
  await go();const nav=page.getByTestId('nav-rail'),r=await nav.boundingBox();assert.equal(Math.round(r.width),390);assert.equal(Math.round(r.y+r.height),844);
  await page.locator('.mobile-market-selector').click();await page.locator('.market-sheet[open]').waitFor();
  const panel=page.locator('.market-sheet');await panel.getByRole('textbox',{name:'Find a market',exact:true}).fill('AI Job');await panel.getByRole('option').first().click();
  await poll(()=>page.locator('.market-sheet').count().then(n=>n===0),'Mobile selector closes after selection');
  await page.locator('.mobile-ticket-trigger').click();await page.locator('.ticket-sheet[open]').waitFor();
  assert(await page.locator('.ticket-sheet').getByTestId('decision-card').isVisible());
  await page.locator('.ticket-sheet').getByTestId('trade-ticket').scrollIntoViewIfNeeded();assert(await page.locator('.ticket-sheet').getByRole('button',{name:'Connect wallet',exact:true}).isVisible());
  await page.keyboard.press('Escape');await nav.getByRole('link',{name:'Explore',exact:true}).click();await page.getByTestId('explore-results').waitFor();
  await nav.getByRole('link',{name:'Markets',exact:true}).click();await page.getByTestId('market-board').waitFor();
 },{width:390,height:844});
 await test('27-chart-label-contrast-both-themes',async()=>{
  for(const theme of ['light','dark'])for(const market of [live,final,'seer-merch-for-devcon-mumbai']){
   await go(`#/m/${market}`);
   if(await page.evaluate(()=>document.documentElement.dataset.theme)!==theme)await page.getByRole('button',{name:'Switch theme',exact:true}).click();
   for(const view of ['Heatmap','Bubbles','Ranked']){
    await boardView(view);await settle();
    if(view==='Ranked')for(const key of [1,2]){
     const pane=page.getByTestId('ranked-submissions'),tier=page.getByTestId(`ladder-tier-${key}`);
     // Group headers mount only when their virtualized range enters the viewport.
     await pane.evaluate(e=>e.scrollTop=e.scrollHeight);
     await tier.waitFor({state:'visible'});await tier.click();
    }
    if(view==='Ranked')await page.getByTestId('ranked-submissions').evaluate(e=>e.scrollTop=0);
    await settle();
    const check=async()=>{const report=await page.evaluate(graphLabelAudit);assert(report.count>0);assert.deepEqual(report.failures,[],`${theme} ${market} ${view}: every mounted label >=4.5`);};
    await check();
    if(view==='Ranked'){
     const pane=page.getByTestId('ranked-submissions');let previous=-1;
     while(true){
      const {top,max}=await pane.evaluate(e=>({top:e.scrollTop,max:e.scrollHeight-e.clientHeight}));
      if(top===previous||top>=max)break;previous=top;
      await pane.evaluate(e=>e.scrollTop+=Math.max(40,e.clientHeight-40));await settle();await check();
     }
    }
   }
  }
 });
 await test('24-source-EF-and-spacing',()=>auditSource(root));

} finally {if(browser)await browser.close();if(preview)preview.kill('SIGTERM');}
if(failures){console.error(`${failures} Opportunity checks failed; screenshots: ${out}`);process.exitCode=1;}
else console.log('All Opportunity checks passed');
