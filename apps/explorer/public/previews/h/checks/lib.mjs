import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
export const H=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const origin=process.env.EXPLORER_ORIGIN||'http://127.0.0.1:5310';
export const entryPath='/explorer/previews/h/index.html';
export const ids={binary:'0xe1793927eb763864967426fe7750ab0dc6f019f3',categorical:'0x31cb54c49479243333594eb7343d31f6bd1ddfd3',scalar:'0x2324741962ff5b8331dbbdc88de8cf1c06fa5ca8',many:'0x8b3c7f3f09f6a85353926d8ee0f12decc1c9a5e8'};
export async function launch(){
  let modulePath;try{modulePath=createRequire(import.meta.url).resolve('playwright-core');}catch{modulePath='C:/Users/josep/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core/index.mjs';}
  const {chromium}=await import(pathToFileURL(modulePath));
  const executablePath=process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe';
  return chromium.launch({executablePath,headless:true});
}
export async function settle(page){await page.locator('#app .loading').waitFor({state:'hidden',timeout:15000});await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
let visit=0;
export async function open(page,hash='#/',variant='h'){await page.goto(origin+(variant==='h'?entryPath:'/previews/g/index.html')+'?qa='+(++visit)+hash);await settle(page);}
export async function save(name,result){await fs.mkdir(path.join(H,'checks/results'),{recursive:true});await fs.writeFile(path.join(H,'checks/results',name+'.json'),JSON.stringify(result,null,2));}
export const sizes=[{width:1440,height:900},{width:1920,height:1000},{width:1100,height:800},{width:820,height:1000},{width:390,height:844}];
export async function suite(name,fn){const browser=await launch(),checks=[];const check=async(label,run)=>{try{const data=await run();checks.push({label,pass:true,data});}catch(e){checks.push({label,pass:false,error:e.stack||String(e)});console.log('FAIL',name,label,String(e).slice(0,400));}};try{await fn(browser,check);}catch(e){checks.push({label:'suite setup',pass:false,error:e.stack||String(e)});}finally{await browser.close();}const result={name,testedAt:new Date().toISOString(),pass:checks.every(c=>c.pass),checks};await save(name,result);console.log(JSON.stringify({suite:name,passed:checks.filter(c=>c.pass).length,failed:checks.filter(c=>!c.pass).length}));if(!result.pass)process.exitCode=1;return result;}
export async function pageFor(browser,size=sizes[0],theme='dark',motion='reduce'){const context=await browser.newContext({viewport:size,reducedMotion:motion});await context.addInitScript(({theme})=>{if(!localStorage.getItem('seer.theme')){localStorage.setItem('seer.theme',theme);localStorage.setItem('seer-theme',theme);}if(!localStorage.getItem('deck.agent'))localStorage.setItem('deck.agent','false');},{theme});const page=await context.newPage();page.setDefaultTimeout(15000);page.setDefaultNavigationTimeout(10000);return page;}
