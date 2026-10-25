import {chromium} from 'playwright-core';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.route('https://opportunity.test/**',async route=>{const path=new URL(route.request().url()).pathname;try{const body=await readFile(new URL(`../dist${path==='/'?'/index.html':path}`,import.meta.url));await route.fulfill({body,contentType:path.endsWith('.js')?'application/javascript':path.endsWith('.css')?'text/css':path.endsWith('.woff2')?'font/woff2':'text/html'});}catch{await route.abort();}});
await page.addInitScript(()=>localStorage.setItem('opportunity.tour','done'));
try{
for(const theme of ['dark','light'])for(const width of [320,390,768,1024,1440,1920,2560]){
 await page.setViewportSize({width,height:900});
 for(const hash of ['#/','#/m/live','#/m/final','#/archive']){await page.goto('https://opportunity.test/'+hash);await page.locator('h1').waitFor();await page.evaluate(t=>document.documentElement.dataset.theme=t,theme);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${theme} ${width} ${hash} overflow`);}
}
await page.setViewportSize({width:1440,height:900});await page.goto('https://opportunity.test/#/m/live');await page.locator('.history-canvas').scrollIntoViewIfNeeded();await page.waitForTimeout(200);assert.equal(await page.locator('.history-legend button').count(),8);assert((await page.locator('.history-canvas canvas').evaluate(c=>c.__labels.length))>0);
await page.locator('#trade-amount').fill('10');assert.match(await page.locator('.trade-content dl').innerText(),/0.5%/);
await page.getByRole('button',{name:'Connect wallet',exact:true}).click();await page.keyboard.press('Escape');assert.equal(await page.locator('dialog[open]').count(),0);
await page.goto('https://opportunity.test/#/m/live');await page.getByRole('button',{name:'Help',exact:true}).click();await page.waitForTimeout(200);const overlap=await page.evaluate(()=>{const a=document.querySelector('[data-tour="handle"]').getBoundingClientRect(),b=document.querySelector('.tour-coach').getBoundingClientRect();return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;});assert(!overlap,'Tour coach covers handle');assert.deepEqual(errors,[]);console.log('Pass C: dark/light × 7 widths × 4 routes; history, quote, wallet, tour passed.');
}finally{await browser.close();}
