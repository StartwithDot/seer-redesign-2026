import assert from 'node:assert/strict';
import {build} from 'esbuild';
// Runs the actual wallet transaction hook in a deterministic hook host. This is
// state-machine verification, not browser UI verification or an on-chain trade.
const host={values:[],cursor:0,effects:[],render(fn){this.cursor=0;return fn();}};
globalThis.__opportunityHookHost=host;
const plugin={name:'hooks-host',setup(p){
 p.onResolve({filter:/^react$/},()=>({path:'react',namespace:'hooks-host'}));
 p.onLoad({filter:/.*/,namespace:'hooks-host'},()=>({contents:`
 const h=globalThis.__opportunityHookHost;
 export const useState=initial=>{const i=h.cursor++;if(!(i in h.values))h.values[i]=typeof initial==='function'?initial():initial;return [h.values[i],value=>{h.values[i]=typeof value==='function'?value(h.values[i]):value}];};
 export const useRef=initial=>{const i=h.cursor++;if(!(i in h.values))h.values[i]={current:initial};return h.values[i];};
 export const useCallback=fn=>fn;
 export const useEffect=fn=>{h.effects.push(fn)};
 `}));
}};
const result=await build({entryPoints:[new URL('../hooks/useWalletTransactions.ts',import.meta.url).pathname],bundle:true,write:false,platform:'node',format:'esm',plugins:[plugin]});
const {useWalletTransactions}=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
const render=()=>host.render(useWalletTransactions);
const account='0x'+'a'.repeat(40),to='0x'+'c'.repeat(40),hash='0x'+'b'.repeat(64);
let receipt=null,reject=false,chain='0x64',offline=false;
let resolveSend;
const wallet={request:async({method})=>{
 if(offline)throw Error('Provider disconnected');
 if(method==='eth_accounts')return [account];
 if(method==='eth_chainId')return chain;
 if(method==='eth_call')return '0x';
 if(method==='eth_estimateGas')return '0x1000';
 if(method==='eth_gasPrice')return '0x1';
 if(method==='eth_getBalance')return '0x100000';
 if(method==='eth_sendTransaction'){
  if(reject)throw Object.assign(Error('Rejected'),{code:4001});
  return new Promise(resolve=>{resolveSend=resolve;});
 }
 if(method==='eth_getTransactionReceipt')return receipt;
 throw Error(method);
}};
let flow=render();assert.equal(flow.transaction.status,'idle');
const sending=flow.execute(wallet,account,{to,data:'0x1234',label:'Redeem winner'});
await Promise.resolve();assert.equal(render().transaction.status,'confirming');
await assert.rejects(render().execute(wallet,account,{to,data:'0x1234',label:'Duplicate'}),/already in progress/);
while(!resolveSend)await Promise.resolve();resolveSend(hash);assert.equal(await sending,hash);
flow=render();assert.equal(flow.transaction.status,'pending');assert.equal(flow.receipts.length,0);
await flow.checkReceipt();assert.equal(render().transaction.status,'pending');
offline=true;await render().checkReceipt();assert.equal(render().transaction.status,'pending','Provider errors must preserve pending state');offline=false;
chain='0x1';await render().checkReceipt();assert.equal(render().transaction.status,'pending');chain='0x64';
receipt={transactionHash:hash,status:'0x1',blockNumber:'0x123',from:account,to};
await render().checkReceipt();flow=render();assert.equal(flow.transaction.status,'success');assert.equal(flow.receipts.length,1);assert.equal(flow.receipts[0].account,account);assert.equal(flow.receipts[0].to,to);assert(Number.isFinite(Date.parse(flow.receipts[0].confirmedAt)));
reject=true;await assert.rejects(flow.execute(wallet,account,{to,data:'0x1234',label:'Approve winner'}));flow=render();assert.equal(flow.transaction.status,'rejected');assert.equal(flow.receipts.length,1);reject=false;
resolveSend=null;const reverting=flow.execute(wallet,account,{to,data:'0x1234',label:'Redeem again'});while(!resolveSend)await Promise.resolve();resolveSend(hash);await reverting;
receipt={transactionHash:hash,status:'0x0',blockNumber:'0x124',from:account,to};await render().checkReceipt();flow=render();assert.equal(flow.transaction.status,'failed');assert.equal(flow.receipts.length,1,'Reverts cannot add success records');
console.log('Actual wallet hook: confirming, duplicate guard, pending, disconnect/network recovery, receipt success, rejected and reverted states pass.');
