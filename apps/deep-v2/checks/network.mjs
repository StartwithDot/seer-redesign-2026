// Runs without request interception. Deliberate fixture failures are checked elsewhere.
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import {mockWallet} from '../e2e/lib/mockWallet.mjs';
const base=process.env.DEEP_URL||'http://127.0.0.1:5203';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const records=[],events=[];
const routes=['/','/?view=swarm','/repo/ethereum/consensus-specs',...['zcash-nu7','zcash-grants','octant','round2-l2','round2-l1','round2-originality','round1','all','archived'].map(x=>'/?round='+x),...['all','1d','1w','1m'].map(x=>'/leaderboard?period='+x)];
try{
 for(const theme of ['dark','light'])for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:width===390?844:900},deviceScaleFactor:1});await context.addInitScript(mockWallet);await context.addInitScript(v=>localStorage.setItem('seer.theme',v),theme);const page=await context.newPage();
  const record=(kind,data)=>events.push({theme,width,route:page.url(),kind,...data});
  page.on('pageerror',e=>record('runtime',{message:e.message}));page.on('console',m=>{if(['error','warning'].includes(m.type()))record('console-'+m.type(),{message:m.text(),location:m.location()});});
  page.on('response',r=>{if(r.status()>=400)record('response',{url:r.url(),status:r.status(),resource:r.request().resourceType()});});
  page.on('requestfailed',r=>record('requestfailed',{url:r.url(),failure:r.failure()?.errorText,resource:r.resourceType()}));
  for(const route of routes){
   await page.goto(base+'/#'+route,{waitUntil:'domcontentloaded'});await page.locator('main.page').waitFor();
   if(route.includes('leaderboard')){await page.getByTestId('lb-skeleton').waitFor({state:'detached'});assert.equal(await page.getByTestId('lb-error').count(),0);await page.waitForTimeout(1500);}
   const imageState=await page.locator('img.identicon').evaluateAll(es=>es.map(e=>({src:e.src,complete:e.complete,naturalWidth:e.naturalWidth})));
   assert.equal(imageState.filter(e=>e.complete&&e.naturalWidth===0).length,0,'Broken avatar remained after fallback');
   records.push({theme,width,route,status:'PASS',imageState});
  }
  await page.goto(base+'/#/');await page.getByTestId('nav-guide').click();for(const tab of ['Start here','Read the market','Trade','Glossary'])await page.getByRole('tab',{name:tab,exact:true}).click();await page.keyboard.press('Escape');
  await page.locator('.sg-connect').click();await page.getByTestId('wallet-button').click();await page.getByTestId('nav-profile').click();await page.getByTestId('profile-name').fill('Network QA');await page.keyboard.press('Escape');
  await context.close();
 }
 const remoteImageURLs=new Set(events.filter(e=>e.resource==='image'&&e.url&&!e.url.startsWith(base)).map(e=>e.url));
 const classified=events.map(e=>({...e,classification:e.failure?.includes('ERR_ABORTED')?'cancelled-navigation':e.resource==='image'&&remoteImageURLs.has(e.url)?'remote-avatar-with-rendered-fallback':e.kind.startsWith('console')&&[...remoteImageURLs].some(u=>e.location?.url===u||e.message.includes(u))?'remote-avatar-browser-log':'unexpected'}));
 const unexpected=classified.filter(e=>e.classification==='unexpected');
 await writeFile(new URL('../reports/network.json',import.meta.url),JSON.stringify({browser:await browser.version(),mode:'headless; no network interception',expected:routes.length*4,covered:records.length,records,events:classified,unexpected,remoteAvatarFailures:classified.filter(e=>e.classification==='remote-avatar-with-rendered-fallback').length},null,2));
 assert.deepEqual(unexpected,[],'Unexpected console/network errors; inspect reports/network.json');console.log(JSON.stringify({covered:records.length,unexpected:unexpected.length,remoteAvatarFailures:remoteImageURLs.size}));
}finally{await browser.close();}
