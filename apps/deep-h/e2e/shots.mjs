// Real viewport captures only. Optional CLI: node e2e/shots.mjs <url> [w h prefix].
// With no dimensions, captures every specified state at all three viewport sizes.
import {mkdir,writeFile} from 'node:fs/promises';
import {start,chrome,contextFor,testEnvironment,out} from './lib/harness.mjs';
import {chromium} from 'playwright-core';
import {scenarios,captureScenario,screenshotSizes} from './specs/screenshots.mjs';
const [url,w,h,prefix='viewport']=process.argv.slice(2);let runtime;const results=[];
try{
 await mkdir(out,{recursive:true});
 if(url){const browser=await chromium.launch({executablePath:chrome,headless:true});runtime={browser,base:url,close:()=>browser.close()};}else runtime=await start();
 for(const viewport of w?[{width:+w,height:+h}]:screenshotSizes){
  const context=await contextFor(runtime.browser,viewport);
  try{
   if(w){
    const t=await testEnvironment(context,runtime.base,viewport,prefix);await t.page.emulateMedia({reducedMotion:'reduce'});await t.page.goto(url);await t.page.evaluate(()=>document.fonts.ready);
    const total=await t.page.evaluate(()=>document.documentElement.scrollHeight);
    for(let y=0,i=0;y<total;y+=Math.floor(viewport.height*.9),i++){await t.page.evaluate(y=>scrollTo(0,y),y);await t.shot(`${prefix}-${i}`);}results.push({viewport:viewport.width,state:prefix,status:'PASS'});await t.page.close();
   }else{
    for(const [name]of scenarios({viewport})){
     const t=await testEnvironment(context,runtime.base,viewport,name);
     try{const setup=scenarios(t).find(([n])=>n===name)[1];const shot=await captureScenario(t,name,setup);if(t.errors.length)throw Error(JSON.stringify(t.errors));results.push({...shot,status:'PASS'});}catch(e){results.push({viewport:viewport.width,state:name,status:'FAIL',error:e.message});}finally{await t.page.close();}
    }
   }
  }finally{await context.close();}
 }
}catch(e){results.push({state:'HARNESS',status:'FAIL',error:e.message});}
finally{await runtime?.close();await writeFile(new URL('screenshots.json',out),JSON.stringify(results,null,2));console.table(results);if(results.some(r=>r.status==='FAIL'))process.exitCode=1;}
