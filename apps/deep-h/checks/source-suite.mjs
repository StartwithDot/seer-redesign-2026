// Runs every copied registration unchanged, in independent browser contexts.
// The original serial runner remains available as npm run e2e:serial.
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
if(process.env.DEEP_URL)process.env.PREVIEW_URL=process.env.DEEP_URL;
const suiteName=process.env.DEEP_SUITE_NAME||'copied-suite';
process.env.DEEP_E2E_OUT=`../../after/${suiteName}/`;
process.env.DEEP_E2E_REPORTS=`../../reports/${suiteName}/`;
const h=await import('../e2e/lib/harness.mjs');
const [{parity},{navigation},{flows},{deadControls},{uiLaws},{screenshotTests,screenshotSizes},{viewports}]=await Promise.all([
 import('../e2e/specs/parity.mjs'),import('../e2e/specs/nav.mjs'),import('../e2e/specs/flow.mjs'),import('../e2e/specs/dead-controls.mjs'),import('../e2e/specs/ui-law.mjs'),import('../e2e/specs/screenshots.mjs'),import('../e2e/lib/testids.mjs')]);
await mkdir(h.out,{recursive:true});await mkdir(h.reports,{recursive:true});
const tests=[];const register=(id,name,fn)=>{h.assert(!tests.some(t=>t.name===name));tests.push({id,name,fn});};
parity(register);navigation(register);flows(register);deadControls(register);uiLaws(register);screenshotTests(register);
const required=[...Array.from({length:31},(_,i)=>'P'+String(i+1).padStart(2,'0')),...Array.from({length:8},(_,i)=>'L'+String(i+1).padStart(2,'0')),'D01','M01','X01','X02','X03'];
h.assert.deepEqual(required.filter(id=>!tests.some(t=>t.id===id)),[]);h.assert.equal(tests.filter(t=>/^Law\d+$/.test(t.id)).length,24);
const filter=process.env.DEEP_TEST_FILTER?new RegExp(process.env.DEEP_TEST_FILTER):null;
const jobs=[...viewports,screenshotSizes[1]].flatMap(viewport=>tests.filter(t=>(viewport.width!==1920||t.id==='screenshot')&&(!filter||filter.test(t.name))).map(entry=>({viewport,entry})));
const results=[],priorAttempts=[];
if(process.env.DEEP_RESUME==='1'){
 const checkpoint=JSON.parse(await readFile(new URL('progress.json',h.reports),'utf8'));
 h.assert.equal(checkpoint.registered,jobs.length,'Checkpoint inventory changed');
 for(const r of checkpoint.results){
  h.assert(jobs.some(j=>j.viewport.width===r.viewport&&j.entry.name===r.test),'Unknown checkpoint result');
  if(r.status==='PASS')results.push(r);else priorAttempts.push(r);
 }
}
const resumed=results.length,pending=jobs.filter(j=>!results.some(r=>r.viewport===j.viewport.width&&r.test===j.entry.name));
const runtime=await h.start();let next=0;
async function worker(){while(next<pending.length){const {viewport,entry}=pending[next++];const context=await h.contextFor(runtime.browser,viewport);let t,timer;
 const result={viewport:viewport.width,id:entry.id,test:entry.name,status:'PASS',errors:[],observed:{}};
 try{
  t=await h.testEnvironment(context,runtime.base,viewport,entry.name);
  await t.page.addInitScript(()=>{try{if(!sessionStorage.getItem('deep.e2e.reset')){localStorage.removeItem('deep-profile');localStorage.setItem('deep.tour.v1','done');sessionStorage.setItem('deep.e2e.reset','1');}}catch{}});
  // Tracing every restore in the dense control sweep can dominate renderer CPU.
  // Failure HTML, screenshots and errors are still captured by artifactFailure.
  const trace=process.env.DEEP_TRACE==='1';
  if(trace)await context.tracing.start({screenshots:true,snapshots:true,sources:true});
  await Promise.race([entry.fn(t),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Copied test timeout')),entry.id==='X01'?240000:60000);})]);
  h.assert.deepEqual(h.unexpected(t.errors),[],'Captured browser errors');
 }catch(e){result.status='FAIL';result.errors=[{message:e.message,stack:e.stack},...(t?h.unexpected(t.errors):[])];if(t)await h.artifactFailure(t,entry.name,e).catch(()=>{});}
 finally{
  clearTimeout(timer);if(t)result.observed=t.observed;
  if(process.env.DEEP_TRACE==='1')await context.tracing.stop(result.status==='FAIL'?{path:fileURLToPath(new URL(`${viewport.width}-${entry.name.replace(/[^a-z0-9.-]+/gi,'-')}.trace.zip`,h.reports))}:{}).catch(()=>{});
  await context.close();results.push(result);console.log(`${result.status} ${viewport.width} ${entry.id} ${entry.name}${result.errors.length?' '+result.errors[0].message.split('\n')[0]:''}`);
  await writeFile(new URL('progress.json',h.reports),JSON.stringify({registered:jobs.length,finished:results.length,results},null,2));
 }
}}
try{await Promise.all(Array.from({length:Number(process.env.DEEP_WORKERS||4)},worker));}finally{await runtime.close();}
await writeFile(new URL('results.json',h.reports),JSON.stringify(results,null,2));
await writeFile(new URL('coverage.json',h.reports),JSON.stringify({expected:jobs.length,covered:results.length,passed:results.filter(r=>r.status==='PASS').length,failed:results.filter(r=>r.status==='FAIL').length,unverified:jobs.length-results.length,filtered:!!filter,resumed,fresh:results.length-resumed,priorAttempts,registrations:tests.map(({id,name})=>({id,name}))},null,2));
console.log(JSON.stringify({total:results.length,failed:results.filter(r=>r.status==='FAIL').map(r=>({viewport:r.viewport,test:r.test,error:r.errors[0]?.message}))},null,2));
if(results.some(r=>r.status==='FAIL'))process.exitCode=1;
