// Built artifacts served by Playwright interception; no server or port binding.
import {chromium} from 'playwright-core';
import {readFileSync,readdirSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../dist/',import.meta.url)),out=fileURLToPath(new URL('./out/pass3/',import.meta.url));mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://stage.local/**',route=>{const path=new URL(route.request().url()).pathname;try{const file=path==='/'?'index.html':path.slice(1);if(file.includes('..'))throw Error('path');const contentType=file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.woff2')?'font/woff2':'text/html';return route.fulfill({body:readFileSync(root+file),contentType});}catch{return route.fulfill({status:404,body:''});}});
 await page.addInitScript(()=>localStorage.setItem('opportunity.stage.tour','seen'));
 await page.goto('https://stage.local/');await page.locator('.field-tile').first().waitFor();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollHeight),900);
 const tiles=await page.locator('.field-tile:not(:has(.merged-preview))').count();assert.ok(tiles>=10&&tiles<=16,`labels ${tiles}`);
 await page.screenshot({path:out+'dark-stage.png'});
 await page.getByRole('button',{name:'Help',exact:true}).click();await page.screenshot({path:out+'dark-tour.png'});await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Connect wallet',exact:true}).first().click();await page.screenshot({path:out+'dark-wallet.png'});await page.locator('.wallet-dialog .primary').click();
 await page.locator('.ticket>.primary').click();assert.match(await page.locator('.position').first().innerText(),/Buy/);
 await page.getByRole('button',{name:'Review submission'}).click();await page.screenshot({path:out+'dark-drawer.png'});await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Switch to light mode'}).click();await page.screenshot({path:out+'light-stage.png'});
 await page.getByRole('button',{name:'Review submission'}).click();await page.screenshot({path:out+'light-drawer.png'});await page.keyboard.press('Escape');
 await page.locator('.header>.primary').click();await page.screenshot({path:out+'light-wallet.png'});await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Help',exact:true}).click();await page.screenshot({path:out+'light-tour.png'});await page.keyboard.press('Escape');
 await page.locator('.rail-title a').click();await page.screenshot({path:out+'light-explore.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollHeight),900);
 await page.getByRole('button',{name:'Archive',exact:true}).click();await page.screenshot({path:out+'light-archive.png'});
 await page.getByRole('button',{name:'Switch to dark mode'}).click();await page.screenshot({path:out+'dark-archive.png'});
 await page.getByRole('link',{name:'Back to Markets'}).click();
 await page.setViewportSize({width:390,height:900});await page.screenshot({path:out+'mobile-dark-stage.png'});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=390));
 await page.locator('.mobile-market-selector').click();await page.screenshot({path:out+'mobile-dark-markets.png'});await page.keyboard.press('Escape');
 await page.locator('.mobile-ticket-trigger').click();await page.screenshot({path:out+'mobile-dark-ticket.png'});await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Switch to light mode'}).click();await page.screenshot({path:out+'mobile-light-stage.png'});
 await page.locator('.mobile-ticket-trigger').click();await page.screenshot({path:out+'mobile-light-ticket.png'});
 assert.deepEqual(errors,[]);console.log(`PASS: ${tiles} labeled tiles; viewport fit; ticket trade; tour, wallet, drawer, archive; dark/light; mobile sheets; no runtime errors. ${readdirSync(out).length} captures`);
}finally{await browser.close();}
