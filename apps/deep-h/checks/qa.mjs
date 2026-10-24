import {chromium} from 'playwright-core';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),out=new URL('after/',root),reports=new URL('reports/',root);
await mkdir(out,{recursive:true});await mkdir(reports,{recursive:true});
const base=process.env.DEEP_URL||'http://127.0.0.1:5200';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const sizes=[[1920,1080],[1440,900],[1280,800],[1100,800],[820,1000],[390,844],[1440,700]];
const manifest=[],results=[],errors=[];
for(const theme of ['dark','light'])for(const [width,height] of sizes){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
 await context.addInitScript(t=>localStorage.setItem('seer.theme',t),theme);
 const page=await context.newPage();page.on('pageerror',e=>errors.push({theme,width,message:e.message}));
 await page.goto(base+'/#/');await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>document.querySelector('canvas')?.__series?.length>0);
 const file=`${theme}-${width}x${height}.png`;await page.screenshot({path:fileURLToPath(new URL(file,out))});
 const geometry=await page.evaluate(()=>{
  const rect=s=>document.querySelector(s)?.getBoundingClientRect().toJSON();
  const rowHeights=[...document.querySelectorAll('[data-testid=split-row]')].map(e=>e.getBoundingClientRect().height);
  return {root:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],viewport:[innerWidth,innerHeight],theme:document.documentElement.dataset.theme,chart:rect('canvas'),context:rect('.contest-band'),desk:rect('.desk'),list:rect('.repository-box'),rowCount:rowHeights.length,rowHeights:[...new Set(rowHeights)],actions:[...document.querySelectorAll('.chart-controls button')].map(e=>({name:e.textContent,box:e.getBoundingClientRect().toJSON()}))};
 });
 manifest.push({file,action:'Fresh root navigation; selected persisted theme; fonts and chart ready',expected:'98 rows, full framing, instrument and bounded shell',observed:geometry});
 try{assert.deepEqual(geometry.root,[width,height]);assert.equal(geometry.rowCount,98);assert.deepEqual(geometry.rowHeights,[width<=700?44:30]);assert(geometry.chart.height>=140);results.push({check:'alignment',theme,width,status:'PASS'});}catch(e){results.push({check:'alignment',theme,width,status:'FAIL',error:e.message});}
 await context.close();
}
await writeFile(new URL('manifest.json',out),JSON.stringify({browser:browser.version(),deviceScaleFactor:1,motion:'reduce',captures:manifest},null,2));
await writeFile(new URL('alignment.json',reports),JSON.stringify({results,errors},null,2));
await browser.close();console.log(JSON.stringify({pass:results.filter(r=>r.status==='PASS').length,fail:results.filter(r=>r.status==='FAIL'),errors},null,2));
