import {chromium} from 'playwright-core';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url),dir=new URL('baseline/',root);
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const sizes=[[1920,1080],[1440,900],[1280,800],[1100,800],[820,1000],[390,844],[1440,700]],manifest=[];
for(const theme of ['dark','light'])for(const [width,height] of sizes){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
 await context.addInitScript(t=>localStorage.setItem('seer.theme',t),theme);
 const page=await context.newPage();
 await page.goto('http://127.0.0.1:5199/#/');await page.evaluate(()=>document.fonts.ready);
 const file=`${theme}-${width}x${height}.png`;await page.screenshot({path:fileURLToPath(new URL(file,dir))});
 const measured=await page.evaluate(()=>({theme:document.documentElement.dataset.theme,rows:document.querySelectorAll('[data-testid=split-row]').length,chart:document.querySelector('canvas').getBoundingClientRect().toJSON(),context:document.querySelector('.contest-band').getBoundingClientRect().toJSON(),document:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],viewport:[innerWidth,innerHeight]}));
 manifest.push({file,action:'Fresh root navigation with persisted theme',observed:measured});await context.close();
}
await writeFile(new URL('manifest.json',dir),JSON.stringify({browser:browser.version(),deviceScaleFactor:1,motion:'reduce',captures:manifest},null,2));
await browser.close();console.log('Captured 14 baseline viewports');
