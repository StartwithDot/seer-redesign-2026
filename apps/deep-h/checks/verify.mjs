import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
process.env.DEEP_E2E_REPORTS='../../reports/supplemental/';process.env.DEEP_E2E_OUT='../../after/supplemental/';
const h=await import('../e2e/lib/harness.mjs'),{chromium}=await import('playwright-core');
await mkdir(h.reports,{recursive:true});await mkdir(h.out,{recursive:true});
const browser=await chromium.launch({executablePath:h.chrome,headless:true});
const base=process.env.DEEP_URL||'http://127.0.0.1:5201',results=[],measurements={};
const selected=process.argv[2],groups={};
function test(group,name,fn){(groups[group]??=[]).push({name,fn});}
async function run(group,name,fn,{theme='dark',width=1440,height=900}={}){
 const context=await h.contextFor(browser,{width,height,isMobile:width<=700,hasTouch:width<=700});
 await context.addInitScript(t=>{try{localStorage.setItem('seer.theme',t);}catch{}},theme);
 const t=await h.testEnvironment(context,base,{width,height},'supplemental-'+name);
 const record={group,name,theme,width,status:'PASS'};
 try{await fn(t);assert.deepEqual(h.unexpected(t.errors),[]);}
 catch(e){record.status='FAIL';record.error=e.message;record.errors=t.errors;await h.artifactFailure(t,name,e).catch(()=>{});}
 finally{results.push(record);await context.close();console.log(`${record.status} ${group} ${theme} ${width} ${name}${record.error?' '+record.error.split('\n')[0]:''}`);}
}
test('parity','98 exact independent pairs',async t=>{
 await t.go();const source=h.fixtures.markets.marketsData;const rows=await t.id('split-row').evaluateAll(es=>es.map(e=>({name:e.dataset.repo,id:e.dataset.id,up:e.querySelector('[data-testid=up-market]').textContent,hatch:e.dataset.hatch,width:e.querySelector('.bar').getBoundingClientRect().width,upWidth:e.querySelector('.up').style.width,downWidth:e.querySelector('.down').style.width})));
 assert.equal(rows.length,98);for(const r of rows){const raw=source[r.name];assert.equal(r.up,raw.upPrice.toFixed(4));assert.equal(r.id,raw.id.toLowerCase());assert.equal(r.width,64);assert(Math.abs(parseFloat(r.upWidth)-raw.upPrice*100)<1e-4);assert(Math.abs(parseFloat(r.downWidth)-raw.downPrice*100)<1e-4);assert.equal(r.hatch,raw.upPrice+raw.downPrice>1?'over':'gap');}
 measurements.pairRecords=rows.length;
});
test('parity','fixtures remain byte faithful',async()=>{
 const {readdir}=await import('node:fs/promises');const {createHash}=await import('node:crypto');let count=0;const hashes=[];
 const sourceRoot=process.env.DEEP_SOURCE;const frozen=JSON.parse(await readFile(new URL('./fixture-source-hashes.json',import.meta.url),'utf8')).files;
 async function compare(path=''){for(const e of await readdir(new URL('../src/data/real/'+path,import.meta.url),{withFileTypes:true})){if(e.isDirectory())await compare(path+e.name+'/');else if(e.name.endsWith('.json')){const [a,b]=await Promise.all([readFile(new URL('../src/data/real/'+path+e.name,import.meta.url)),sourceRoot?readFile(sourceRoot+'/src/data/real/'+path+e.name):Promise.resolve(null)]);const actual=createHash('sha256').update(a).digest('hex'),expected=b?createHash('sha256').update(b).digest('hex'):frozen[path+e.name];assert.equal(actual,expected);hashes.push({path:path+e.name,sha256:actual,sourceSha256:expected});count++;}}}await compare();measurements.fixtureFiles=count;measurements.fixtureHashes=hashes;
});
test('alignment','seven Positions columns and stable ledger edges',async t=>{
 await t.go();await t.mobileTab('List');await t.id('positions-menu').click();await t.page.getByRole('menuitem',{name:'Positions',exact:true}).click();
 const layout=await t.id('split-table').evaluate(e=>{const header=e.querySelector('.list-columns'),row=e.querySelector('.repository-row');return {headerCells:header.children.length,rowCells:row.children.length,header:[...header.children].map(c=>c.getBoundingClientRect().left),row:[...row.children].map(c=>c.getBoundingClientRect().left),grid:e.querySelector('.repository-grid').scrollWidth,client:e.querySelector('.repository-grid').clientWidth};});
 assert.equal(layout.headerCells,7);assert.equal(layout.rowCells,7);assert.deepEqual(layout.header,layout.row);const grid=t.page.locator('.repository-grid');await grid.evaluate(e=>e.scrollLeft=e.scrollWidth);const last=t.id('down-diff').first();assert((await last.boundingBox()).width>40);
 await grid.evaluate(e=>e.scrollLeft=0);const box=await grid.boundingBox(),cdp=await t.context.newCDPSession(t.page);await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:1});const x=box.x+box.width-20,y=Math.min(t.viewport.height-90,box.y+70),distance=Math.min(220,box.width-40);for(let pass=0;pass<2;pass++){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1,radiusX:4,radiusY:4,force:1}]});for(let i=1;i<=14;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-distance*i/14,y,id:1,radiusX:4,radiusY:4,force:1}]});await t.page.waitForTimeout(16);}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await t.page.waitForTimeout(150);}
 const cell=await last.boundingBox();assert(await grid.evaluate(e=>e.scrollLeft>0));assert(cell.x>=box.x-1&&cell.x+cell.width<=box.x+box.width+1,'Last Positions column remains clipped after native horizontal pan');(measurements.positionsTouch??=[]).push({width:t.viewport.width,scrollLeft:await grid.evaluate(e=>e.scrollLeft),grid:box,lastCell:cell});
});
test('menus','intent keyboard clamp and stationary pointer',async t=>{
 await t.go();const trigger=t.id('round-switcher');await t.page.mouse.move(500,500);const r=await trigger.boundingBox();await t.page.mouse.move(r.x+r.width+70,r.y+r.height/2);
 await trigger.evaluate(e=>e.style.translate='70px 0');await t.page.waitForTimeout(180);assert.equal(await trigger.getAttribute('aria-expanded'),'false','Reflow must not open menu');await trigger.evaluate(e=>e.style.translate='');
 await trigger.hover();await t.id('round-menu').waitFor();await t.page.mouse.move(700,700);await t.id('round-menu').waitFor({state:'detached'});
 await trigger.focus();await t.page.keyboard.press('ArrowDown');await t.id('round-menu').waitFor();await t.page.keyboard.press('End');assert.match(await t.page.evaluate(()=>document.activeElement.textContent),/All contests/);await t.page.keyboard.press('Home');assert.match(await t.page.evaluate(()=>document.activeElement.textContent),/Round 3/);await t.page.keyboard.press('z');assert.match(await t.page.evaluate(()=>document.activeElement.textContent),/Zcash/);
 const box=await t.id('round-menu').boundingBox();assert(box.x>=11&&box.x+box.width<=t.viewport.width-11);await t.page.keyboard.press('Escape');assert.equal(await trigger.getAttribute('aria-expanded'),'false');await trigger.hover();await t.id('round-menu').waitFor();await t.page.setViewportSize({width:900,height:700});await t.id('round-menu').waitFor({state:'detached'});assert.equal(await t.id('round-menu').count(),0);
});
test('menus','Apps and separate account actions',async t=>{
 await t.go();await t.page.locator('.sg-apps').click();assert.equal(await t.page.locator('.sg-row').count(),6);await t.page.keyboard.press('Escape');await t.connect();await t.page.locator('.sg-connect').click();assert.equal(await t.page.locator('.sg-acct [role=menuitem]').count(),2);await t.page.locator('.sg-disc').click();assert.equal(await t.id('wallet-button').count(),1,'Shared disconnect preserves React state');await t.id('wallet-button').click();await t.id('nav-profile').waitFor();await t.page.locator('.wallet [role=menuitem]').filter({hasText:'Disconnect'}).click();assert.equal(await t.id('wallet-button').count(),0);
});
test('scroll','all 3517 archive outcomes reachable without document scroll',async t=>{
 await t.go('/?round=round2-l2');await t.mobileTab('List');const rows=t.page.locator('.archive-list tbody tr');assert.equal(await rows.count(),3517);await rows.last().scrollIntoViewIfNeeded();const last=await rows.last().boundingBox(),scroller=await t.page.locator('.archive-table-scroll').boundingBox();assert(last.y<scroller.y+scroller.height&&last.y+last.height>scroller.y);assert.deepEqual(await t.page.evaluate(()=>[scrollX,scrollY,document.documentElement.scrollWidth,document.documentElement.scrollHeight]),[0,0,t.viewport.width,t.viewport.height]);
});
test('scroll','Desk actions stay reachable on short screens',async t=>{
 await t.go();await t.desk();const button=t.id('start-trading');await button.scrollIntoViewIfNeeded();const box=await button.boundingBox();assert(box.y>=56&&box.y+box.height<=t.viewport.height-(t.viewport.width<=700?60:0)+1);assert.equal(await t.page.evaluate(()=>scrollY),0);await t.id('split-row').last().focus();assert.equal(await t.page.evaluate(()=>scrollY),0);
});
test('charts','theme repaints canvas without pointer or resize',async t=>{
 await t.go();const c=t.page.locator('canvas').first();await h.poll(()=>c.evaluate(e=>e.width>0&&e.__series));const pixels=()=>c.evaluate(e=>e.toDataURL());const a=await pixels();await t.page.locator('.sg-theme').click();await h.poll(async()=>await pixels()!==a,'Immediate theme repaint');assert.equal(await t.page.evaluate(()=>document.documentElement.dataset.theme),'light');const b=await pixels();await t.page.locator('.sg-theme').click();await h.poll(async()=>await pixels()!==b);assert.equal(await t.page.evaluate(()=>localStorage.getItem('seer.theme')),'dark');
});
test('charts','leg labels ranges hiding and expanded side filter',async t=>{
 await t.go();await t.page.getByRole('button',{name:'DOWN',exact:true}).click();assert.match(await t.page.locator('canvas').getAttribute('aria-label'),/DOWN/);await t.page.locator('canvas').focus();await t.page.keyboard.press('ArrowLeft');assert.match(await t.id('crosshair-label').innerText(),/median/);for(const label of ['1D','3D','1W','All','Lens'])await t.page.getByRole('button',{name:label,exact:true}).click();await t.id('hide-all').click();assert.equal(await t.page.locator('canvas').evaluate(e=>e.__series.filter(s=>s.alpha>0).length),0);assert.equal(await t.id('split-row').count(),98);await t.id('hide-all').click();await t.page.getByRole('button',{name:/Expand/}).click();await t.page.getByRole('textbox',{name:'Filter repositories'}).fill('ethereum/consensus-specs');assert.equal(await t.page.locator('.aside-list button').count(),1);await t.page.keyboard.press('Escape');assert.equal(await t.page.getByRole('dialog',{name:'Expanded chart'}).count(),0);
});
test('charts','all Swarm layers replay pause scrub and runtime reduction',async t=>{
 await t.go('/?view=swarm');assert(await t.page.getByRole('button',{name:'Your predictions',exact:true}).isDisabled());for(const name of ['UP price','Unpriced gap','Drift since first trade','Volume']){await t.page.getByRole('button',{name,exact:true}).click();assert.equal(await t.page.getByRole('button',{name,exact:true}).getAttribute('aria-pressed'),'true');}
 await t.page.getByRole('button',{name:'Play replay',exact:true}).click();await h.poll(()=>t.page.evaluate(()=>window.__replayT<1792351800));const a=await t.page.evaluate(()=>window.__replayT);await t.page.waitForTimeout(100);assert((await t.page.evaluate(()=>window.__replayT))>=a);await t.page.getByRole('slider',{name:'Replay date'}).fill('1790859600');assert.equal(await t.page.evaluate(()=>window.__replayT),1790859600);await t.page.waitForTimeout(100);assert.equal(await t.page.evaluate(()=>window.__replayT),1790859600);await t.page.getByRole('button',{name:'Play replay',exact:true}).click();await t.page.emulateMedia({reducedMotion:'reduce'});await h.poll(()=>t.page.evaluate(()=>window.__replayT===1792351800));
});
test('flows','fund conversion withdrawal and guarded amounts',async t=>{
 await t.go();await t.create();await t.openFunds();const dialog=t.id('funds-sheet'),amount=t.id('deposit-amount');await amount.fill('-1');assert(await dialog.getByRole('button',{name:'Deposit sUSDS',exact:true}).isDisabled());await amount.fill('1001');assert(await dialog.getByRole('button',{name:'Deposit sUSDS',exact:true}).isDisabled());await amount.fill('10');await dialog.getByRole('button',{name:'Deposit sUSDS',exact:true}).click();assert.equal(await t.id('susds-balance').innerText(),'10.0000');await amount.fill('5');await dialog.getByRole('button',{name:'Convert USDC/USDS to sUSDS'}).click();assert.equal(await t.id('susds-balance').innerText(),'15.0000');await t.id('withdraw-amount').fill('3');await dialog.getByRole('button',{name:'Withdraw sUSDS',exact:true}).click();assert.equal(await t.id('susds-balance').innerText(),'12.0000');const text=await dialog.innerText();assert.match(text,/995.00/);assert.match(text,/993.00/);assert(await t.id('rebalance').isDisabled());await dialog.getByRole('button',{name:'Close funds'}).click();await t.page.locator('.desk-tabs').getByRole('button',{name:'Funds',exact:true}).click();await t.page.getByRole('button',{name:'Manage funds'}).click();assert.equal(await amount.inputValue(),'');assert.equal(await t.id('withdraw-amount').inputValue(),'');
});
test('flows','CSV pending commit errors and exact export bytes',async t=>{
 await t.go();await t.upload('predictions-valid.csv',false);assert.equal(await t.id('predictions-summary').count(),0);await t.page.getByRole('button',{name:'Load Predictions',exact:true}).click();assert.equal(await t.id('predictions-summary').innerText(),'3 predictions loaded');for(const file of ['predictions-bad-header.csv','predictions-bad-value.csv','predictions-duplicate.csv','predictions-unknown.csv']){await t.upload(file,false);assert.equal(await t.id('predictions-summary').innerText(),'3 predictions loaded');assert(await t.id('predictions-parse-error').isVisible());}
 const [download]=await Promise.all([t.page.waitForEvent('download'),t.id('export-weights').click()]);const bytes=await readFile(await download.path());assert.equal(download.suggestedFilename(),'market-weights.csv');assert.equal(bytes.toString().split('\n').length,99);assert(!bytes.includes(13));assert(!bytes.toString().endsWith('\n'));assert.equal(bytes.subarray(0,13).toString(),'repo,up,down\n');
});
test('flows','Profile exact file limits HTTPS validation and cancel',async t=>{
 await t.go();await t.connect();await t.openProfile();await t.id('profile-name').fill('a'.repeat(40));assert.equal((await t.id('profile-name').inputValue()).length,32);await t.id('profile-link').fill('http://invalid.test');assert(await t.id('profile-save').isDisabled());await t.id('profile-link').fill('');const png=await readFile(new URL('../e2e/fixtures/avatar.png',import.meta.url));await t.id('profile-upload').setInputFiles({name:'exact.png',mimeType:'image/png',buffer:Buffer.concat([png,Buffer.alloc(512000-png.length)])});await h.poll(()=>t.id('profile-preview').locator('img').count().then(n=>n===1));assert.equal(await t.id('profile-dialog').getByRole('alert').count(),0);await t.id('profile-upload').setInputFiles({name:'over.png',mimeType:'image/png',buffer:Buffer.alloc(512001)});assert(await t.id('profile-dialog').getByRole('alert').isVisible());await t.id('profile-cancel').click();await t.openProfile();assert.equal(await t.id('profile-name').inputValue(),'');
});
test('navigation','every contest overview and direct case-insensitive detail',async t=>{
 for(const id of ['round3','zcash-nu7','zcash-grants','octant','round2-l2','round2-l1','round2-originality','round1','archived','all']){await t.go('/?round='+id);if(['archived','all'].includes(id))assert.equal(await t.page.locator('.contest-overview tbody tr').count(),id==='all'?8:7);else if(id!=='round3')await t.id('contest-market').waitFor();}await t.go('/repo/ETHEREUM/CONSENSUS-SPECS');await t.id('repo-detail').waitFor();await t.page.getByRole('link',{name:'Back to markets'}).click();await t.id('split-table').waitFor();
});
test('navigation','query preservation history and keyboard search',async t=>{
 await t.go('/?q=ethereum&sort=name&other=keep');await t.id('view-tab-swarm').click();let p=new URLSearchParams(new URL(t.page.url()).hash.split('?')[1]);assert.equal(p.get('other'),'keep');assert.equal(p.get('q'),'ethereum');await t.page.goBack();assert(!new URL(t.page.url()).hash.includes('view=swarm'));await t.page.keyboard.press('Control+k');const dialog=t.page.getByRole('dialog',{name:'Search repositories'});await dialog.getByRole('textbox').fill('consensus-specs');await t.page.keyboard.press('Enter');await t.id('repo-detail').waitFor();await t.page.keyboard.press('Escape');await t.id('split-table').waitFor();
});
test('flows','all six Guide shortcuts reach their intended target',async t=>{
 for(let step=0;step<6;step++){
  await t.go();if(step===1)await t.connect();if(step===2||step===3)await t.create();if(step===5){await t.funded();await t.upload();}
  await t.id('nav-guide').click();await t.page.getByRole('button',{name:'Do it now →',exact:true}).nth(step).click();
  await t.page.getByRole('dialog',{name:'Guide',exact:true}).waitFor({state:'detached'});
  if(step===0)await t.id('wallet-button').waitFor();
  else if(step===2||step===3){await t.id('funds-sheet').waitFor();await t.page.getByRole('button',{name:'Close funds',exact:true}).click();}
  else {const selector=step===1?'[data-testid="setup-step"][data-step="2"] button':step===4?'[data-testid="upload-predictions-button"]':'[data-testid="start-trading"]';await t.page.waitForFunction(s=>document.querySelector(s)===document.activeElement,selector);}
 }
});

test('accessibility','native modal and expanded background containment',async t=>{
 await t.go();await t.connect();await t.openProfile();const modal=t.id('profile-dialog');for(let i=0;i<20;i++){await t.page.keyboard.press('Tab');assert(await modal.evaluate(e=>e.contains(document.activeElement)));}await t.page.keyboard.press('Escape');assert.equal(await t.page.evaluate(()=>document.activeElement.dataset.testid),'wallet-button');await t.page.keyboard.press('Escape');await t.page.getByRole('button',{name:/Expand/}).click();for(let i=0;i<18;i++){await t.page.keyboard.press('Tab');assert(await t.page.locator('.chart-expanded').evaluate(e=>e.contains(document.activeElement)));}assert(await t.page.locator('#seer-global-header').evaluate(e=>e.inert));
 await t.page.keyboard.press('Control+k');const search=t.page.getByRole('dialog',{name:'Search repositories',exact:true});await search.waitFor();for(let i=0;i<5;i++){await t.page.keyboard.press('Tab');assert(await search.evaluate(e=>e.contains(document.activeElement)));}await t.page.keyboard.press('Escape');await search.waitFor({state:'detached'});assert.equal(await t.page.locator('.chart-expanded').count(),1,'Search Escape must leave the expanded chart open');assert(await t.page.locator('.chart-expanded').evaluate(e=>e.contains(document.activeElement)));await t.page.keyboard.press('Escape');assert.equal(await t.page.locator('#seer-global-header').evaluate(e=>e.inert),false);
});
test('accessibility','mobile names targets status and full identities',async t=>{
 await t.go();await t.mobileTab('List');await t.id('split-row').first().focus();assert.match(await t.page.locator('.identity-reveal').innerText(),/ethereum\/consensus-specs/);const bad=await t.page.locator('button,a[href],input:not([hidden])').evaluateAll(es=>es.filter(e=>e.checkVisibility()).flatMap(e=>{const r=e.getBoundingClientRect();if(!r.width||!r.height||r.bottom<0||r.top>innerHeight)return [];const name=e.getAttribute('aria-label')||e.textContent?.trim()||e.labels?.[0]?.textContent||e.title;return !name||(innerWidth<=700&&(r.width<39.5||r.height<39.5))?[{name,box:r.toJSON()}]:[];}));assert.deepEqual(bad,[]);await t.id('split-row').first().click();assert.match(await t.page.locator('.desk-body').innerText(),/ethereum\/consensus-specs/);
});
test('contrast','effective text and semantic graphic ratios',async t=>{
 await t.go();const samples=await t.page.evaluate(()=>{
  const cv=document.createElement('canvas');cv.width=cv.height=1;const c=cv.getContext('2d');const rgba=color=>{c.clearRect(0,0,1,1);c.fillStyle=color;c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data].map((v,i)=>i===3?v/255:v);};
  const blend=(f,b)=>[0,1,2].map(i=>f[i]*f[3]+b[i]*(1-f[3]));const lum=a=>a.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
  const items=[...document.querySelectorAll('button,input,small,dt,dd,.muted,.stat>span,.stat>strong,.asker-strip b,.asker-strip span,.chart-title h2,.plot-key span')];
  const result=items.filter(e=>e.checkVisibility()&&(e.textContent?.trim()||e.placeholder)).flatMap(e=>{const r=e.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return [];let parent=e,ancestors=[];while(parent){ancestors.unshift(parent);parent=parent.parentElement;}let bg=[16,16,19];for(const a of ancestors)bg=blend(rgba(getComputedStyle(a).backgroundColor),bg);const style=getComputedStyle(e),fg=blend(rgba(style.color),bg),large=parseFloat(style.fontSize)>=24;return [{text:e.textContent?.trim().slice(0,80)||e.placeholder,fg,bg,ratio:ratio(fg,bg),required:large?3:4.5}];});
  const css=getComputedStyle(document.documentElement),bg=rgba(css.getPropertyValue('--bg'));for(const token of ['--series-up','--series-down','--median','--green','--red','--amber','--focus'])result.push({text:token,ratio:ratio(rgba(css.getPropertyValue(token)),bg),required:3});
  const band=rgba(css.getPropertyValue('--median'));band[3]=.15;
  // Match actual painter combinations: UP/DOWN retain their leg color in All
  // and filtered views at .95; Swarm uses .8 on plot/lens, not quantile fill.
  for(const [surface,background] of [['plot',bg],['quantile band',blend(band,bg)]])for(const [token,alpha] of [['--series-up',1],['--series-down',1],['--series-up',.95],['--series-down',.95]]){const ink=rgba(css.getPropertyValue(token));ink[3]=alpha;result.push({text:token+' at '+alpha+' on '+surface,ratio:ratio(blend(ink,background),background),required:3});}
  for(const [surface,background] of [['plot',bg],['Swarm lens',rgba(css.getPropertyValue('--nested'))]])for(const token of ['--series-up','--green','--red']){const ink=rgba(css.getPropertyValue(token));ink[3]=.8;result.push({text:token+' at .8 on '+surface,ratio:ratio(blend(ink,background),background),required:3});}
  return result;
 });
 await t.go('/leaderboard');
 const mapSamples=await t.page.evaluate(()=>{
  const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const c=canvas.getContext('2d');
  const rgba=color=>{c.clearRect(0,0,1,1);c.fillStyle=color;c.fillRect(0,0,1,1);return [...c.getImageData(0,0,1,1).data].map((v,i)=>i===3?v/255:v);};
  const blend=(f,b)=>[0,1,2].map(i=>f[i]*f[3]+b[i]*(1-f[3]));const lum=a=>a.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
  return [...document.querySelectorAll('.board-chart svg circle:not(.dot-hit),.board-chart svg text')].filter(e=>e.checkVisibility()).flatMap(e=>{
   const css=getComputedStyle(e),text=e.tagName.toLowerCase()==='text',paint=text?css.fill:css.stroke;if(paint==='none')return [];
   const ancestors=[];for(let p=e;p;p=p.parentElement)ancestors.unshift(p);let bg=[16,16,19];for(const p of ancestors)bg=blend(rgba(getComputedStyle(p).backgroundColor),bg);const fg=rgba(paint);fg[3]*=Number(text?css.fillOpacity:css.strokeOpacity);
   return [{text:text?'Map label '+e.textContent:e.classList.contains('wallet-ring')?'Merged-wallet ring':'Wallet mark outline',ratio:ratio(blend(fg,bg),bg),required:text?4.5:3,alpha:fg[3],color:paint}];
  });
 });
 samples.push(...mapSamples);
 (measurements.contrast??=[]).push({theme:await t.page.evaluate(()=>document.documentElement.dataset.theme),width:t.viewport.width,samples});assert.deepEqual(samples.filter(s=>!Number.isFinite(s.ratio)||s.ratio+.01<s.required),[]);
});
const mobileGroups=new Set(['parity','alignment','menus','scroll','flows','navigation','accessibility','contrast']);
for(const [group,tests] of Object.entries(groups)){if(selected&&group!==selected)continue;for(const entry of tests){
 if(entry.name==='fixtures remain byte faithful'){await run(group,entry.name,entry.fn);continue;}
 if(group==='charts'||entry.name==='native modal and expanded background containment'){await run(group,entry.name,entry.fn);continue;}
 for(const theme of ['dark','light']){await run(group,entry.name,entry.fn,{theme});if(mobileGroups.has(group)&&!['leg labels ranges hiding and expanded side filter'].includes(entry.name))await run(group,entry.name,entry.fn,{theme,width:390,height:844});}
}}
for(const group of Object.keys(groups)){const records=results.filter(r=>r.group===group);if(!records.length)continue;await writeFile(new URL(group+'.json',h.reports),JSON.stringify({expected:records.length,covered:records.length,passed:records.filter(r=>r.status==='PASS').length,failed:records.filter(r=>r.status==='FAIL').length,unverified:0,records,measurements:group==='contrast'?measurements.contrast:measurements},null,2));}
await browser.close();console.log(JSON.stringify({pass:results.filter(r=>r.status==='PASS').length,fail:results.filter(r=>r.status==='FAIL')},null,2));if(results.some(r=>r.status==='FAIL'))process.exitCode=1;

