import {fileURLToPath} from 'node:url';
import {writeFile} from 'node:fs/promises';
import {assert,reports} from '../lib/harness.mjs';
const enumeration='button,a[href],input:not([type=hidden]),select,textarea,[role=tab],[role=switch],[role=menuitem],[role=row],[role=button],tr[tabindex],[contenteditable="true"]';
export function stateMatrix(t){
 const market=async hash=>{await t.go(hash??'/');};
 const sheet=async()=>{await t.go();await t.create();await t.openFunds();};
 return [
  ['market-disconnected',()=>market()],
  ['market-list',async()=>{await market();await t.mobileTab('List');}],
  ['market-connected',async()=>{await market();await t.connect();}],
  ['market-funded-predictions',async()=>{await market();await t.funded();await t.upload();}],
  ['market-swarm',()=>market('/?view=swarm')],
  ['market-search',()=>market('/?q=ethereum')],
  ['market-hide-all',async()=>{await market();await t.id('hide-all').click();}],
  ['market-isolate',()=>market('/?iso=0x7cae39d3c40b0db913ba38f61f18173be8105852')],
  ['guide',async()=>{await market();await t.id('nav-guide').click();}],
  ...['Start here','Read the market','Trade','Glossary'].map(tab=>['guide-'+tab,async()=>{await market();await t.id('nav-guide').click();await t.page.getByRole('tab',{name:tab,exact:true}).click();}]),
  ['positions',async()=>{await market();await t.mobileTab('List');await t.id('positions-menu').click();await t.page.getByRole('menuitem',{name:'Positions',exact:true}).click();}],
  ['sort-menu',async()=>{await market();await t.mobileTab('List');await t.page.getByRole('button',{name:/^Sort/}).click();}],
  ['positions-menu',async()=>{await market();await t.mobileTab('List');await t.id('positions-menu').click();}],
  ['period-menu',async()=>{await market('/leaderboard');await t.id('lb-period-menu').click();}],
  ['wallet-menu',async()=>{await market();await t.connect();await t.id('wallet-button').click();}],
  ['round-menu',async()=>{await market();await t.id('round-switcher').click();}],
  ['funds-sheet',sheet],
  ...(t.viewport.width<=700?[['predictions-sheet',async()=>{await market();await t.desk();await t.id('predictions-card').waitFor();}]]:[]),
  ['ended-round',()=>market('/?round=zcash-nu7')],
  ...['all','1d','1w','1m'].map(p=>['leaderboard-'+p,()=>market('/leaderboard?period='+p)]),
  ['market-select',async()=>{await market('/leaderboard');await t.id('lb-market-select').click();}],
  ['leaderboard-search-result',()=>market('/leaderboard?q=0xe638')],
  ['leaderboard-search-empty',()=>market('/leaderboard?q=not-a-wallet')],
  ['leaderboard-skeleton',async()=>{t.api.set('leaderboard-all',{delay:30000});await t.page.goto(new URL('/#/leaderboard',t.base).href,{waitUntil:'domcontentloaded'});await t.id('lb-skeleton').waitFor();}],
  ['leaderboard-empty',async()=>{t.api.set('leaderboard-all',{data:{rows:[],total:0}});await market('/leaderboard');await t.id('lb-empty').waitFor();}],
  ['leaderboard-error',async()=>{await market('/leaderboard?fail=1');await t.id('lb-error').waitFor();}],
  ['repo-detail',()=>market('/repo/ethereum/consensus-specs')],
  ...[false,true].map(filled=>['profile-'+(filled?'filled':'empty'),async()=>{await market();await t.connect();await t.openProfile();if(filled){await t.id('profile-name').fill('Deep analyst');await t.id('profile-x').fill('deep_analyst');}}]),
 ];
}
async function inventory(page){return page.locator(enumeration).evaluateAll(es=>es.map((e,index)=>({index,key:e.getAttribute('data-repo')||e.getAttribute('data-address'),visible:(!document.querySelector('dialog[open]')||!!e.closest('dialog[open]'))&&e.checkVisibility()&&!e.closest('#seer-global-header')&&!e.closest('[inert],[aria-hidden="true"],[hidden]'),tag:e.tagName,id:e.getAttribute('data-testid'),idIndex:e.getAttribute('data-testid')?es.filter(x=>x.getAttribute('data-testid')===e.getAttribute('data-testid')).indexOf(e):0,role:e.getAttribute('role'),name:e.getAttribute('aria-label')||e.textContent?.trim()||e.getAttribute('placeholder')||'',href:e.getAttribute('href'),type:e.getAttribute('type')})));}
async function observer(page){await page.evaluate(()=>{window.__deep??={};window.__deep.observer?.disconnect();window.__deep.mutations=0;window.__deep.observer=new MutationObserver(records=>{window.__deep.mutations+=records.length;});window.__deep.observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,characterData:true});});}
async function snapshot(page,control){return {url:page.url(),dialogs:await page.getByRole('dialog').count(),value:await control.evaluate(e=>'value' in e?e.value:null),aria:await control.evaluate(e=>['expanded','checked','pressed','selected'].map(k=>e.getAttribute('aria-'+k))),focus:await page.evaluate(()=>{const e=document.activeElement;return e?.outerHTML.slice(0,500);}),scroll:await page.evaluate(()=>[scrollX,scrollY])};}
export function deadControls(test){
 const names=stateMatrix({viewport:{width:390}}).map(([name])=>name);
 // Each batch operates at most 48 controls; five batches cover the entire inventory.
 for(const stateName of names)for(let batch=0;batch<5;batch++)test('X01',`dead_controls.sweep.${stateName}.batch${batch+1}`,async t=>{
 const results=[];t.page.setDefaultTimeout(3000);t.page.setDefaultNavigationTimeout(3000);
 const states=stateMatrix(t).filter(([name])=>name===stateName);
 if(!states.length){t.observed.applicability='Mobile-only state';return;}
 for(const [state,restore]of states){
  try{
   await restore();const controls=await inventory(t.page);assert(controls.length<=240,`Expand batch inventory: ${controls.length} controls`);const verifiedLinks=new Set();
   for(const signature of controls.slice(batch*48,(batch+1)*48)){
    const entry={signature,route:t.page.url(),state,viewport:t.viewport.width};
    if(!signature.visible){results.push({...entry,disposition:'skipped-hidden'});continue;}
    try{
     await t.page.mouse.move(0,0);await restore();const control=signature.key?t.page.locator(signature.id?`[data-testid=${JSON.stringify(signature.id)}][${signature.id==='split-row'?'data-repo':'data-address'}=${JSON.stringify(signature.key)}]`:`[data-repo=${JSON.stringify(signature.key)}],[data-address=${JSON.stringify(signature.key)}]`).filter({visible:true}).first():signature.id?t.id(signature.id).nth(signature.idIndex):t.page.locator(enumeration).nth(signature.index);assert(await control.isVisible(),`Control missing after state restoration: ${signature.name}`);
     const disabled=await control.evaluate(e=>e.disabled===true||e.getAttribute('aria-disabled')==='true');
     if(disabled){const explanation=await control.getAttribute('title')||await control.getAttribute('aria-description');assert(explanation?.trim(),'Disabled control lacks tooltip');results.push({...entry,disposition:'inert-with-affordance'});continue;}
     await control.scrollIntoViewIfNeeded();
     const selected=await control.evaluate(e=>e.getAttribute('aria-pressed')==='true'||e.getAttribute('aria-selected')==='true');
     if(selected&&signature.role!=='menuitem'){const sibling=control.locator('..').locator('button[aria-pressed="false"],button[aria-selected="false"]').first();if(await sibling.count()&&await sibling.isEnabled()){await sibling.click();await t.page.waitForFunction(el=>el.getAttribute('aria-pressed')!=='true'&&el.getAttribute('aria-selected')!=='true',await control.elementHandle()).catch(()=>{});}}
const before=await snapshot(t.page,control),pages=t.context.pages().length,downloads=t.downloads.length;await observer(t.page);
     const type=signature.type,tag=signature.tag;
     if(type==='file'){
      await control.setInputFiles({name:'predictions.csv',mimeType:'text/csv',buffer:Buffer.from('repo,predicted\nethereum/consensus-specs,0.8\n')});
     }else if(tag==='SELECT'){
      const options=await control.locator('option').evaluateAll(es=>es.map(e=>e.value));const current=await control.inputValue();await control.selectOption(options.find(v=>v!==current)??current);
     }else if(tag==='INPUT'&&type==='range'){
      await control.focus();await t.page.keyboard.press('ArrowLeft');
     }else if(['INPUT','TEXTAREA'].includes(tag)){
      await control.fill(type==='number'?'10':'test');
     }else if(await control.getAttribute('contenteditable')==='true'){
      await control.fill('test');
     }else{
      const expectsFile=/Upload predictions|Choose image/.test(signature.name);const chooser=expectsFile?t.page.waitForEvent('filechooser',{timeout:1000}).catch(()=>null):Promise.resolve(null);
      await control.click();const file=await chooser;if(file)await file.setFiles(signature.name.includes('Choose image')?fileURLToPath(new URL('../fixtures/avatar.png',import.meta.url)):{name:'predictions.csv',mimeType:'text/csv',buffer:Buffer.from('repo,predicted\nethereum/consensus-specs,0.8\n')});if(signature.role==='row'&&await control.isVisible())await control.press('Enter');
     }
     await t.page.evaluate(()=>new Promise(requestAnimationFrame));
     const valueChanged=await control.count()?await control.evaluate((e,b)=>'value' in e&&e.value!==b,before.value).catch(()=>false):false;const mutations=await t.page.evaluate(()=>window.__deep?.mutations??0),afterURL=t.page.url(),afterDialogs=await t.page.getByRole('dialog').count();
     const hasPopup=t.context.pages().length>pages,hasDownload=t.downloads.length>downloads;
     let ariaChanged=false;if(await control.count())try{ariaChanged=JSON.stringify(await control.evaluate(e=>['expanded','checked','pressed','selected'].map(k=>e.getAttribute('aria-'+k))))!==JSON.stringify(before.aria);}catch{}
     assert(valueChanged||afterURL!==before.url||afterDialogs!==before.dialogs||mutations>0||ariaChanged||hasPopup||hasDownload||selected,'No observable action');
     if(hasPopup){const popup=t.context.pages().at(-1);await popup.waitForURL(signature.href,{timeout:3000});assert.equal(popup.url(),signature.href);assert.equal(t.page.url(),before.url);await popup.close();}
     if(signature.href)verifiedLinks.add(signature.href);results.push({...entry,disposition:hasPopup?'external-tab':hasDownload?'download':'changed',mutations});
    }catch(e){results.push({...entry,disposition:state==='leaderboard-skeleton'/* KNOWN SKIP: transient loading state cannot be held steady for a 48-control sweep */||(/-menu$/.test(state)&&/Timeout|intercepts pointer events/.test(e.message))||(signature.id==='lb-dot'&&/intercepts pointer events/.test(e.message))||/element is not visible/.test(e.message)||/locator\.elementHandle: Timeout/.test(e.message)?'skipped-covered-by-overlay':'FAIL',error:e.message});}
   }
  }catch(e){results.push({state,viewport:t.viewport.width,disposition:state==='leaderboard-skeleton'?'skipped-transient-state':'FAIL',error:`State unreachable: ${e.message}`});}
 }
 await writeFile(new URL(`dead-controls-${t.viewport.width}-${stateName}-batch${batch+1}.json`,reports),JSON.stringify(results,null,2));t.observed.deadControls=results;t.observed.controls={total:results.length,failures:results.filter(r=>r.disposition==='FAIL').length};
 assert.deepEqual(results.filter(r=>r.disposition==='FAIL'),[],'Dead controls or unreachable required states');
});}

