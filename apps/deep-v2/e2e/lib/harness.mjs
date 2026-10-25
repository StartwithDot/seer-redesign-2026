import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import allowlist from '../allowlist.mjs';
import { mockWallet } from './mockWallet.mjs';
import { installAPI, fixtures } from './api.mjs';
export { assert, fixtures };
export const app = fileURLToPath(new URL('../../',import.meta.url));
export const out = new URL(process.env.DEEP_E2E_OUT || '../out/',import.meta.url);
export const reports = new URL(process.env.DEEP_E2E_REPORTS || '../test-results/',import.meta.url);
export const chrome = process.env.DEEP_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
export async function command(args) {
  await new Promise((resolve,reject)=>{
    const p=spawn(process.platform==='win32'?'C:/Program Files/nodejs/node.exe':'npm',process.platform==='win32'?['C:/Program Files/nodejs/node_modules/npm/bin/npm-cli.js',...args]:args,{cwd:app,stdio:'inherit'});
    p.on('error',reject);p.on('exit',code=>code===0?resolve():reject(Error(`npm ${args.join(' ')} exited ${code}`)));
  });
}
export async function start() {
  await Promise.all([mkdir(out,{recursive:true}),mkdir(reports,{recursive:true})]);
  let preview;
  let base=process.env.PREVIEW_URL;
  try {
    if(!base) {
      await command(['run','build']);
      const server=createServer();
      await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
      const port=server.address().port;await new Promise(resolve=>server.close(resolve));
      preview=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',String(port),'--strictPort'],{cwd:app,stdio:'pipe'});
      let log='';preview.stdout.on('data',d=>{log+=d;});preview.stderr.on('data',d=>{log+=d;});
      preview.on('error',e=>{log+=e.message;});
      base=`http://127.0.0.1:${port}`;
      const deadline=Date.now()+60000;
      for(;;){
        if(preview.exitCode!==null)throw Error(`Preview exited: ${log}`);
        try{if((await fetch(base)).ok)break;}catch{}
        if(Date.now()>deadline)throw Error(`Preview timed out: ${log}`);
        await new Promise(resolve=>setTimeout(resolve,100));
      }
    }
    const browser=await chromium.launch({executablePath:chrome,headless:true});
    return {browser,base,close:async()=>{await browser.close();preview?.kill('SIGTERM');}};
  }catch(e){preview?.kill('SIGTERM');throw e;}
}
export async function poll(fn, message='Condition not met', timeout=5000) {
  const deadline=Date.now()+timeout;let last;
  do{try{const value=await fn();if(value)return value;}catch(e){last=e;}await new Promise(r=>setTimeout(r,50));}while(Date.now()<deadline);
  throw Error(`${message}${last?`: ${last.message}`:''}`);
}
export async function contextFor(browser,viewport) {
  const {isMobile=false,hasTouch=false,width,height}=viewport;
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile,hasTouch});
  await context.addInitScript(mockWallet);return context;
}
export async function testEnvironment(context,base,viewport,name) {
  await context.unrouteAll({behavior:'wait'});await context.clearCookies();const page=await context.newPage(),errors=[],downloads=[];
  page.setDefaultTimeout(name.startsWith('dead_controls')?3000:10000);
  page.on('console',m=>{if(m.type()==='error')errors.push({type:'console',text:m.text(),location:m.location(),url:page.url()});});
  page.on('pageerror',e=>errors.push({type:'pageerror',text:e.message,stack:e.stack,url:page.url()}));
  page.on('response',r=>{if(r.status()>=400)errors.push({type:'http',text:`${r.status()} ${r.url()}`});});
  page.on('requestfailed',r=>{if(!r.failure()?.errorText.includes('ERR_ABORTED'))errors.push({type:'requestfailed',text:`${r.url()} ${r.failure()?.errorText}`});});
  page.on('download',d=>downloads.push(d));
  const api=await installAPI(page,base);
  const observed={apiCalls:api.calls};
  const id=s=>page.getByTestId(s);
  const go=async(hash='/')=>{const target=new URL('./#'+hash,base.endsWith('/')?base:base+'/').href;if(page.url().split('#')[0]===target.split('#')[0]){await page.goto('about:blank');}await page.goto(target);await page.waitForFunction(()=>document.querySelector('main.page')?.children.length>0);if(hash.includes('leaderboard')&&name!=='lb.states'&&!name.includes('skeleton'))await page.getByTestId('lb-skeleton').waitFor({state:'detached'});};
  const mobileTab=async name=>{if(viewport.width<=700)await page.locator('.mobile-tabs').getByRole('button',{name,exact:true}).click();};
  const openProfile=async()=>{await id('wallet-button').focus();await page.keyboard.press('ArrowDown');await id('nav-profile').click();await id('profile-dialog').waitFor();};
  const navigate=async(hash)=>{await page.evaluate(hash=>{location.hash='#'+hash;},hash);await poll(()=>page.url().endsWith('#'+hash),`Navigate ${hash}`);};
  const desk=async()=>{if(viewport.width<=700)await page.locator('.mobile-tabs').getByRole('button',{name:'Desk',exact:true}).click();const tab=page.locator('.desk-tabs').getByRole('button',{name:'Desk',exact:true});if(await tab.isVisible())await tab.click();};
  const connect=async()=>{
    // Use the wallet menu at both widths, matching the visible UI entry point.
    await page.locator('.sg-connect').click();
    await poll(()=>id('wallet-button').textContent().then(t=>t.includes('0x')),'Wallet connection');
  };
  const create=async()=>{await connect();await desk();await id('setup-step').filter({has:page.getByText('Create trade wallet',{exact:true})}).getByTestId('setup-step-action').click();await poll(()=>page.locator('[data-testid="setup-step"][data-step="2"]').getAttribute('data-state').then(v=>v==='done'),'Trade wallet creation',10000);};
  const openFunds=async()=>{await desk();await page.getByRole('button',{name:'Add sUSDS',exact:true}).click();await id('funds-sheet').waitFor();};
  const deposit=async(amount='10')=>{await id('deposit-amount').fill(amount);await id('funds-sheet').getByRole('button',{name:'Deposit sUSDS',exact:true}).click();};
  const upload=async(file='predictions-valid.csv',load=true)=>{await desk();await id('upload-predictions').setInputFiles(fileURLToPath(new URL('../fixtures/'+file,import.meta.url)));if(load)await page.getByRole('button',{name:'Load Predictions',exact:true}).click();};
  const funded=async()=>{await create();await openFunds();await deposit();await page.getByRole('button',{name:'Close funds',exact:true}).click();};
  const shot=async(label=name)=>{await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:fileURLToPath(new URL(`${viewport.width}x${viewport.height}-${label.replace(/[^a-z0-9.-]+/gi,'-')}.png`,out)),fullPage:false,animations:'disabled',caret:'hide'});};
  return {base,page,context,viewport,id,go,navigate,mobileTab,openProfile,desk,connect,create,openFunds,deposit,upload,funded,shot,observed,api,errors,downloads,assert,poll,fixtures};
}
export function unexpected(errors){return errors.filter(e=>!allowlist.some(rule=>rule.reason&&rule.issue&&rule.pattern.test(e.text)));}
export async function artifactFailure(t,name,error) {
  const prefix=`${t.viewport.width}-${name.replace(/[^a-z0-9.-]+/gi,'-')}`;
  await Promise.allSettled([
    () => t.shot(`FAIL-${name}`),
    async () => writeFile(new URL(prefix+'.html',reports),await t.page.content()),
    () => writeFile(new URL(prefix+'.json',reports),JSON.stringify({error:error.stack,errors:t.errors},null,2)),
  ].map(fn=>Promise.resolve().then(fn)));
}
