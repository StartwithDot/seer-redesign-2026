// Semantic checks for repeated controls, supplementing the copied mutation-based sweep.
import {mkdir,writeFile} from 'node:fs/promises';
process.env.DEEP_E2E_REPORTS='../../reports/semantic-controls/';process.env.DEEP_E2E_OUT='../../after/semantic-controls/';
const h=await import('../e2e/lib/harness.mjs'),{chromium}=await import('playwright-core');
await mkdir(h.reports,{recursive:true});await mkdir(h.out,{recursive:true});
const browser=await chromium.launch({executablePath:h.chrome,headless:true}),base=process.env.DEEP_URL||'http://127.0.0.1:5201',records=[];
for(const theme of ['dark','light'])for(const width of [1440,390]){
 const context=await h.contextFor(browser,{width,height:width===390?844:900,isMobile:width===390,hasTouch:width===390});
 await context.addInitScript(t=>{try{localStorage.setItem('seer.theme',t);}catch{}},theme);
 const t=await h.testEnvironment(context,base,{width,height:width===390?844:900},'semantic-controls');
 try{
  await t.go();const names=await t.id('split-row').evaluateAll(es=>es.map(e=>e.dataset.repo));h.assert.equal(names.length,98);
  for(const name of names){const record={theme,width,kind:'repository',name,status:'PASS'};try{await t.mobileTab('List');const row=t.page.locator('[data-testid=split-row]').filter({has:t.page.locator(`[title=${JSON.stringify(name)}]`)});await row.click();h.assert.equal(await t.page.locator('.desk-body>h2').innerText(),name);h.assert.equal(new URL(t.page.url()).hash.split('?')[0],'#/');}catch(e){record.status='FAIL';record.error=e.message;}records.push(record);}
  await t.go('/leaderboard');const addresses=await t.id('lb-dot').evaluateAll(es=>es.map(e=>e.dataset.address));h.assert.equal(addresses.length,76);
  for(const address of addresses){const record={theme,width,kind:'wallet-map',address,status:'PASS'};try{const close=t.page.getByRole('button',{name:'Close wallet inspector'});if(await close.isVisible())await close.click();const dot=t.page.locator(`[data-testid=lb-dot][data-address=${JSON.stringify(address)}]`);await dot.focus();await dot.press('Enter');h.assert.equal(await t.page.locator('.wallet-inspector .address').first().innerText(),address);h.assert.equal(await t.page.locator(`[data-testid=lb-row][data-address=${JSON.stringify(address)}]`).getAttribute('aria-selected'),'true');}catch(e){record.status='FAIL';record.error=e.message;}records.push(record);}
  h.assert.deepEqual(h.unexpected(t.errors),[]);
 }catch(e){records.push({theme,width,kind:'state',status:'FAIL',error:e.message});}
 finally{await context.close();await writeFile(new URL('progress.json',h.reports),JSON.stringify(records,null,2));console.log(`${theme} ${width}: ${records.filter(r=>r.width===width&&r.theme===theme&&r.status==='PASS').length} semantic selections passed`);}
}
await browser.close();const result={expected:696,covered:records.filter(r=>r.kind!=='state').length,passed:records.filter(r=>r.status==='PASS').length,failed:records.filter(r=>r.status==='FAIL').length,unverified:696-records.filter(r=>r.kind!=='state').length,records};await writeFile(new URL('results.json',h.reports),JSON.stringify(result,null,2));console.log(JSON.stringify({...result,records:records.filter(r=>r.status==='FAIL')},null,2));if(result.failed||result.unverified)process.exitCode=1;
