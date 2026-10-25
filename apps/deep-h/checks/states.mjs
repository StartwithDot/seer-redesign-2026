import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
process.env.DEEP_E2E_REPORTS='../../reports/states/';process.env.DEEP_E2E_OUT='../../after/states/';
const h=await import('../e2e/lib/harness.mjs');
await mkdir(h.out,{recursive:true});await mkdir(h.reports,{recursive:true});
const {chromium}=await import('playwright-core');
const browser=await chromium.launch({executablePath:h.chrome,headless:true});
const base=process.env.DEEP_URL||'http://127.0.0.1:5201';
const definitions=[
 ['split',async t=>{await t.go();h.assert.equal(await t.id('split-row').count(),98);}],
 ['all-series',async t=>{await t.go();await t.page.getByRole('button',{name:'All',exact:true}).click();await t.page.waitForFunction(()=>document.querySelector('[data-testid=time-figure] canvas')?.__series?.length===98);}],
 ['swarm',async t=>{await t.go('/?view=swarm');await t.id('swarm-canvas').waitFor();}],
 ['expanded',async t=>{await t.go();await t.page.getByRole('button',{name:/Expand/}).click();await t.page.getByRole('dialog',{name:'Expanded chart'}).waitFor();}],
 ['isolation',async t=>{await t.go('/?iso='+h.fixtures.rows[0].id.toLowerCase());await t.id('time-figure').waitFor();}],
 ['hover',async t=>{await t.go();await t.id('time-figure').locator('canvas').hover({position:{x:120,y:110}});}],
 ['search-empty',async t=>{await t.go('/?q=not-a-repository');await t.mobileTab('List');h.assert.equal(await t.id('split-row').count(),0);}],
 ['list',async t=>{await t.go();await t.mobileTab('List');}],
 ['positions',async t=>{await t.go();await t.mobileTab('List');await t.id('positions-menu').click();await t.page.getByRole('menuitem',{name:'Positions',exact:true}).click();h.assert.equal(await t.id('col-predicted').count(),98);}],
 ['connected-react-menu',async t=>{await t.go();await t.connect();await t.id('wallet-button').click();await t.id('wallet-menu').waitFor();}],
 ['connected-shared-menu',async t=>{await t.go();await t.connect();await t.page.locator('.sg-connect').click();await t.page.locator('.sg-acct').waitFor();}],
 ['apps-menu',async t=>{await t.go();await t.page.locator('.sg-apps').click();h.assert.equal(await t.page.locator('.sg-row').count(),6);}],
 ['contests-menu',async t=>{await t.go();await t.id('round-switcher').click();h.assert.equal(await t.id('round-option').count(),8);}],
 ['csv-pending',async t=>{await t.go();await t.upload('predictions-valid.csv',false);await t.page.getByRole('button',{name:'Load Predictions',exact:true}).scrollIntoViewIfNeeded();}],
 ['csv-committed',async t=>{await t.go();await t.upload();h.assert.match(await t.id('predictions-summary').innerText(),/3 predictions loaded/);}],
 ['csv-invalid',async t=>{await t.go();await t.upload();await t.upload('predictions-bad-header.csv',false);await t.id('predictions-parse-error').waitFor();}],
 ['funds',async t=>{await t.go();await t.create();await t.openFunds();await t.deposit();h.assert.equal(await t.id('susds-balance').innerText(),'10.0000');}],
 ['funds-confirmation',async t=>{await t.go();await t.funded();await t.upload();await t.id('start-trading').click();await h.poll(()=>t.id('start-trading').innerText().then(s=>s==='Strategy complete'));await t.page.locator('.desk-tabs').getByRole('button',{name:'Funds',exact:true}).click();await t.page.getByRole('button',{name:'Manage funds'}).click();await t.id('sell-all').click();await t.page.getByRole('button',{name:'Confirm Sell All'}).waitFor();await t.page.locator('.funds-sheet .pending').scrollIntoViewIfNeeded();}],
 ['profile',async t=>{await t.go();await t.connect();await t.openProfile();await t.id('profile-name').fill('Originality analyst');await t.id('profile-x').fill('deep_analyst');}],
 ['search-dialog',async t=>{await t.go();await t.page.keyboard.press('Control+k');await t.page.getByRole('dialog',{name:'Search repositories'}).getByRole('textbox').fill('ethereum');}],
 ['wallet-rejected',async t=>{await t.go();await t.page.evaluate(()=>window.ethereum.__reject=true);await t.page.locator('.sg-connect').click();await t.page.getByRole('alert').waitFor();}],
 ['repository-detail',async t=>{await t.go('/repo/ethereum/consensus-specs');await t.id('repo-detail').waitFor();}],
 ...['round3','zcash-nu7','zcash-grants','octant','round2-l2','round2-l1','round2-originality','round1','archived','all'].map(id=>['contest-'+id,async t=>{await t.go('/?round='+id);if(id!=='round3'&&!['archived','all'].includes(id))await t.id('contest-market').waitFor();}]),
 ...['Start here','Read the market','Trade','Glossary'].map(tab=>['guide-'+tab.toLowerCase().replaceAll(' ','-'),async t=>{await t.go();await t.id('nav-guide').click();await t.page.getByRole('tab',{name:tab,exact:true}).click();await t.page.getByRole('tabpanel').waitFor();}]),
 ...['all','1d','1w','1m'].flatMap(period=>['Table + Map','Table','Map'].map(view=>['leaderboard-'+period+'-'+view.toLowerCase().replaceAll(' ','').replace('+','-'),async t=>{await t.go('/leaderboard?period='+period);await t.page.getByRole('button',{name:view,exact:true}).click();h.assert.equal(await t.id('lb-row').count(),h.fixtures.leaderboard[period].total);if(view!=='Table')h.assert(await t.page.getByText('P/L: USD (signed log) · Volume traded, USD (log) →',{exact:true}).isVisible(),'Axis unit caption must be visible');} ])),
 ['leaderboard-selected',async t=>{await t.go('/leaderboard');await t.id('lb-row').first().click();await t.page.locator('.wallet-inspector').waitFor();}],
 ['leaderboard-empty',async t=>{await t.go('/leaderboard?q=not-a-wallet');await t.id('lb-empty').waitFor();}],
 ['leaderboard-error',async t=>{await t.go('/leaderboard?fail=1');await t.id('lb-error').waitFor();}],
 ['leaderboard-loading',async t=>{t.api.set('leaderboard-all',{delay:5000});await t.page.goto(base+'/#/leaderboard',{waitUntil:'domcontentloaded'});await t.id('lb-skeleton').waitFor();}],
];
const stateFilter=process.env.DEEP_STATE_FILTER?new RegExp(process.env.DEEP_STATE_FILTER):null;
const jobs=['dark','light'].flatMap(theme=>[{width:1440,height:900},{width:390,height:844,isMobile:true,hasTouch:true}].flatMap(viewport=>definitions.filter(([name])=>!stateFilter||stateFilter.test(name)).map(([name,setup])=>({theme,viewport,name,setup}))));
let next=0;const manifest=[];
async function worker(){while(next<jobs.length){const {theme,viewport,name,setup}=jobs[next++];const context=await h.contextFor(browser,viewport);const record={theme,viewport,name,action:name,actionSequence:setup.toString(),expected:{theme,viewport,state:name},status:'PASS'};
 try{await context.addInitScript(t=>localStorage.setItem('seer.theme',t),theme);const t=await h.testEnvironment(context,base,viewport,'state-'+name);await t.page.emulateMedia({reducedMotion:'reduce'});await setup(t);await t.page.evaluate(()=>document.fonts.ready);await t.page.mouse.move(0,0);const file=`${theme}-${viewport.width}-${name}.png`;await t.page.screenshot({path:fileURLToPath(new URL(file,h.out)),animations:'disabled'});record.file=file;
  record.observed=await t.page.evaluate(()=>({hash:location.hash,theme:document.documentElement.dataset.theme,dialogs:[...document.querySelectorAll('dialog[open],[role=dialog]')].map(e=>e.getAttribute('aria-label')||e.getAttribute('aria-labelledby')),rows:document.querySelectorAll('[data-testid=split-row]').length,wallets:document.querySelectorAll('[data-testid=lb-row]').length,controls:[...document.querySelectorAll('button,a[href],input:not([hidden]),tr[tabindex],[role=button]')].filter(e=>e.checkVisibility()).map(e=>({id:e.getAttribute('data-testid'),name:e.getAttribute('aria-label')||e.textContent?.trim()||e.getAttribute('placeholder'),disabled:!!e.disabled,title:e.title,role:e.getAttribute('role')}))}));
  record.errors=h.unexpected(t.errors);if(record.errors.length)record.status='FAIL';
 }catch(e){record.status='FAIL';record.error=e.message;}
 finally{await context.close();manifest.push(record);console.log(`${record.status} ${theme} ${viewport.width} ${name}${record.error?' '+record.error.split('\n')[0]:''}`);await writeFile(new URL('progress.json',h.reports),JSON.stringify({expected:jobs.length,covered:manifest.length,manifest},null,2));}
}}
await Promise.all(Array.from({length:Number(process.env.DEEP_WORKERS||4)},worker));await browser.close();await writeFile(new URL(stateFilter?'manifest-refinements.json':'manifest.json',h.out),JSON.stringify({browser:browser.version(),motion:'reduce',deviceScaleFactor:1,expected:jobs.length,covered:manifest.length,failed:manifest.filter(r=>r.status==='FAIL').length,manifest},null,2));
console.log(JSON.stringify({expected:jobs.length,covered:manifest.length,failed:manifest.filter(r=>r.status==='FAIL').map(r=>({name:r.name,theme:r.theme,width:r.viewport.width,error:r.error,errors:r.errors}))},null,2));


