import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {start,contextFor,testEnvironment,artifactFailure,unexpected,reports,assert} from './lib/harness.mjs';
import {viewports} from './lib/testids.mjs';
import {parity} from './specs/parity.mjs';
import {navigation} from './specs/nav.mjs';
import {flows} from './specs/flow.mjs';
import {deadControls} from './specs/dead-controls.mjs';
import {uiLaws} from './specs/ui-law.mjs';
import {screenshotTests,screenshotSizes} from './specs/screenshots.mjs';
const tests=[],results=[],runId=new Date().toISOString();
const register=(id,name,fn)=>{assert(!tests.some(t=>t.name===name),`Duplicate test ${name}`);tests.push({id,name,fn});};
parity(register);navigation(register);flows(register);deadControls(register);uiLaws(register);screenshotTests(register);
// Fixed inventory: a missing parity id fails before browser execution.
const required=[...Array.from({length:31},(_,i)=>'P'+String(i+1).padStart(2,'0')),...Array.from({length:8},(_,i)=>'L'+String(i+1).padStart(2,'0')),'D01','M01','X01','X02','X03'];
assert.deepEqual(required.filter(id=>!tests.some(t=>t.id===id)),[],'Missing parity tests');
assert.equal(tests.filter(t=>/^Law\d+$/.test(t.id)).length,24,'Missing UI laws');
let runtime;
try{
 runtime=await start();
 const context=await contextFor(runtime.browser,viewports[0]);
 for(const viewport of [...viewports,screenshotSizes[1]]){
  try{
   for(const entry of tests){
    if(viewport.width===1920&&entry.id!=='screenshot')continue;
    const t=await testEnvironment(context,runtime.base,viewport,entry.name);await t.page.setViewportSize({width:viewport.width,height:viewport.height});
    // Reset persisted user state once per test, preserving it across reloads inside that test.
    await t.page.addInitScript(()=>{try{if(!sessionStorage.getItem('deep.e2e.reset')){localStorage.removeItem('deep-profile');localStorage.setItem('deep.tour.v1','done');sessionStorage.setItem('deep.e2e.reset','1');}}catch{/* Storage may be blocked or the document may have an opaque origin. */}});
    await context.tracing.start({screenshots:true,snapshots:true,sources:true});
    const record={runId,viewport:viewport.width,id:entry.id,test:entry.name,status:'PASS',errors:[],observed:t.observed};
    let timer;
    try{
     await Promise.race([entry.fn(t),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(`${entry.id==='X01'?240:60} second test timeout`)),entry.id==='X01'?240000:60000);})]);
     assert.deepEqual(unexpected(t.errors),[],'Captured browser errors');
     // Screenshot tests capture every required viewport; failures capture their own state.
    }catch(e){record.status='FAIL';record.errors=[{message:e.message,stack:e.stack},...unexpected(t.errors)];await artifactFailure(t,entry.name,e);}
    finally{
     clearTimeout(timer);
     await context.tracing.stop(record.status==='FAIL'?{path:fileURLToPath(new URL(`${viewport.width}-${entry.name.replace(/[^a-z0-9.-]+/gi,'-')}.trace.zip`,reports))}:{});
     await t.page.close();
    }
    results.push(record);console.log(`${record.status} ${viewport.width} ${entry.id} ${entry.name}${record.errors.length?' — '+record.errors[0].message:''}`);
   }
  }finally{await context.unrouteAll({behavior:"wait"});}
 }
}catch(e){results.push({runId,viewport:'—',id:'HARNESS',test:'build → preview → Chromium',status:'FAIL',errors:[{message:e.message,stack:e.stack}],observed:{}});}
finally{
 await runtime?.close();
 await writeFile(new URL('results.json',reports),JSON.stringify(results,null,2));
 await writeFile(new URL('dead-controls.json',reports),JSON.stringify(results.flatMap(r=>r.observed.deadControls??[]),null,2));
 await writeFile(new URL('observed.json',reports),JSON.stringify(results.map(r=>({viewport:r.viewport,test:r.test,...r.observed})),null,2));
 // A blocked harness is explicitly incomplete; it never produces invented screenshots or PASS records.
 const executed=new Set(results.map(r=>r.test));
 await writeFile(new URL('coverage.json',reports),JSON.stringify({requiredParityIds:required,registered:tests.map(({id,name})=>({id,name})),unexecuted:tests.filter(t=>!executed.has(t.name)).map(t=>t.name),complete:!results.some(r=>r.id==='HARNESS')&&tests.every(t=>executed.has(t.name))},null,2));
 const table=results.map(r=>({Viewport:r.viewport,ID:r.id,Test:r.test,Result:r.status,Detail:r.errors[0]?.message?.split('\n')[0]??''}));
 console.table(table);
 await writeFile(new URL('result-table.md',reports),'| Viewport | ID | Test | Result | Detail |\n|---|---|---|---|---|\n'+table.map(r=>`| ${r.Viewport} | ${r.ID} | ${r.Test} | ${r.Result} | ${r.Detail.replaceAll('|','\\|')} |`).join('\n')+'\n');
 if(results.some(r=>r.status==='FAIL'))process.exitCode=1;
}
