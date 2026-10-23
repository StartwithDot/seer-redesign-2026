import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
async function load(entry) {
 const output = await build({ entryPoints:[new URL(entry,import.meta.url).pathname],bundle:true,write:false,platform:'node',format:'esm' });
 return import(`data:text/javascript;base64,${Buffer.from(output.outputFiles[0].text).toString('base64')}`);
}
const {galleryFor,galleryKey}=await load('../data/gallery.ts');
const rebrand=galleryFor('seer-rebrand-contest'),merch=galleryFor('seer-merch-devcon-mumbai');
assert.equal(rebrand.flatMap(s=>s.images).length,144);
assert.equal(merch.flatMap(s=>s.images).length,18);
assert.equal(rebrand[0].creator,'@hypedsgn');
assert.equal(rebrand[0].winner,true);
assert.equal(merch.filter(s=>s.winner).length,5);
assert.equal(merch.find(s=>s.title.startsWith('Seer merch full set')).proposal,'/ipfs/QmVMuib7W35vxdJKeRB1KvNsLbgVK3qC2PeeyFnnUbSTMR');
for(const gallery of [rebrand,merch]) {
 assert.equal(new Set(gallery.flatMap(s=>s.images).map(i=>i.id)).size,gallery.flatMap(s=>s.images).length);
 for(const submission of gallery) for(const image of submission.images) assert.match(image.url,/^https:\/\/cdn\.kleros\.link\/ipfs\/Qm[1-9A-HJ-NP-Za-km-z]{44}$/);
}
globalThis.HTMLElement=class { matches(){return false;} };
assert.equal(galleryKey({key:'ArrowLeft',target:null},0,144),143);
assert.equal(galleryKey({key:'ArrowRight',target:null},143,144),0);
assert.equal(galleryKey({key:'Home',target:null},140,144),0);
assert.equal(galleryKey({key:'End',target:null},0,144),143);
assert.equal(galleryKey({key:'Escape',target:null},0,144),null);
console.log('Gallery: 144/18 genuine assets, attribution, winner mapping, proposal links, unique IDs and keyboard wrapping pass.');

const rpc=await load('../data/contractRpc.ts');
const {readRedeemPositions,redemptionGuard,formatTokenAmount}=await load('../data/redemption.ts');
const tokens=JSON.parse(await readFile(new URL('../data/archiveTokens.json',import.meta.url)));
const record=tokens[0],scale=10n**18n;
const word=n=>BigInt(n).toString(16).padStart(64,'0');
const ctf='0x'+'c'.repeat(40),account='0x'+'a'.repeat(40);
let failToken=null,denominator=1n,approved=false,wrongWrapped=false;
const provider={request:async({method,params})=>{
 if(method==='eth_blockNumber')return '0x100';
 assert.equal(method,'eth_call');
 const [{to,data},block]=params;assert.equal(block,'0x100','All holdings use a single block');
 const selector=data.slice(2,10);
 const index=record.wrappedTokens.indexOf(to);
 if(to===failToken)throw Error('RPC unavailable');
 if(selector===rpc.selectors.conditionalTokens)return '0x'+rpc.addressWord(ctf);
 if(selector===rpc.selectors.condition)return record.conditionId;
 if(selector===rpc.selectors.parent)return '0x'+word(0);
 if(selector===rpc.selectors.denominator)return '0x'+word(denominator);
 if(selector===rpc.selectors.wrapped){const i=Number(BigInt('0x'+data.slice(10)));return '0x'+rpc.addressWord(wrongWrapped?account:record.wrappedTokens[i])+word(64)+word(0);}
 if(selector===rpc.selectors.numerator){const i=Number(BigInt('0x'+data.slice(74)));return '0x'+word(i===0?1:0);}
 if(selector===rpc.selectors.decimals)return '0x'+word(18);
 if(selector===rpc.selectors.balance)return '0x'+word(index===0?3n*scale:index===1?2n*scale:0);
 if(selector===rpc.selectors.allowance)return '0x'+word(approved?3n*scale:0);
 throw Error('Unexpected call '+selector);
}};
let positions=await readRedeemPositions(provider,account,'seer-rebrand-contest');
assert.equal(positions.length,17);
assert.equal(positions[0].payout,3n*scale);
assert.equal(positions[1].payout,0n);
assert.equal(redemptionGuard(positions[0]),null);
assert.match(redemptionGuard(positions[1]),/no payable/);
assert.match(redemptionGuard(positions[2]),/No shares/);
assert.equal(formatTokenAmount(1234567890123456789n),'1.234567890123456789');
failToken=record.wrappedTokens[0];positions=await readRedeemPositions(provider,account,'seer-rebrand-contest');
assert.equal(positions[0].balance,null);assert.equal(positions[0].payout,null);assert(positions[0].error);
assert.match(redemptionGuard(positions[0]),/Reload/);
assert.equal(positions[1].balance,2n*scale);
failToken=null;wrongWrapped=true;positions=await readRedeemPositions(provider,account,'seer-rebrand-contest');
assert(positions.every(p=>p.balance===null));wrongWrapped=false;
denominator=0n;await assert.rejects(readRedeemPositions(provider,account,'seer-rebrand-contest'),/not finalized/);denominator=1n;
await assert.rejects(readRedeemPositions(provider,account,'sample'),/no verified/);
console.log('Positions: one-block reads, precise payouts, unknown versus zero, partial failure, contract mismatch, unsettled and sample guards pass.');

const {submitWalletTransaction,readTransactionReceipt,ReceiptPending}=await load('../data/transactions.ts');
const hash='0x'+'b'.repeat(64);let calls=[],chain='0x64',receipt=null,reject=false,gasBalance=scale;
const signer={request:async({method,params})=>{
 calls.push({method,params});
 if(method==='eth_chainId')return chain;
 if(method==='eth_accounts')return [account];
 if(method==='eth_call')return '0x';
 if(method==='eth_estimateGas')return '0x10000';
 if(method==='eth_gasPrice')return '0x1';
 if(method==='eth_getBalance')return '0x'+gasBalance.toString(16);
 if(method==='eth_sendTransaction'){if(reject)throw Object.assign(Error('Rejected'),{code:4001});return hash;}
 if(method==='eth_getTransactionReceipt')return receipt;
 throw Error(method);
}};
const transaction={to:record.wrappedTokens[0],data:rpc.encodeApproval(3n*scale),label:'Approve winner'};
assert.equal(transaction.data,'0x095ea7b3'+rpc.addressWord(rpc.gnosisRouter)+word(3n*scale));
const redeem=rpc.encodeRedemption(record.collateralToken,record.id,0,3n*scale);
assert.equal(redeem.length,2+8+8*64);assert.equal(redeem.slice(10+2*64,10+4*64),word(128)+word(192));
assert.equal(await submitWalletTransaction(signer,account,transaction),hash);
assert(calls.findIndex(c=>c.method==='eth_call')<calls.findIndex(c=>c.method==='eth_sendTransaction'));
assert(calls.findIndex(c=>c.method==='eth_estimateGas')<calls.findIndex(c=>c.method==='eth_sendTransaction'));
assert.equal(calls.find(c=>c.method==='eth_sendTransaction').params[0].value,'0x0');
chain='0x1';calls=[];await assert.rejects(submitWalletTransaction(signer,account,transaction),/Gnosis/);assert(!calls.some(c=>c.method==='eth_sendTransaction'));chain='0x64';
reject=true;await assert.rejects(submitWalletTransaction(signer,account,transaction),e=>e.code===4001);reject=false;
gasBalance=0n;calls=[];await assert.rejects(submitWalletTransaction(signer,account,transaction),/Insufficient xDAI/);assert(!calls.some(c=>c.method==='eth_sendTransaction'));gasBalance=scale;
assert.equal(await readTransactionReceipt(signer,hash),null);
receipt={transactionHash:hash,status:'0x0',blockNumber:'0x123'};await assert.rejects(readTransactionReceipt(signer,hash),/reverted/);
receipt={transactionHash:hash,status:'0x1',blockNumber:'0x123'};assert.deepEqual(await readTransactionReceipt(signer,hash),{block:'0x123'});
receipt={...receipt,from:account,to:transaction.to};assert.deepEqual(await readTransactionReceipt(signer,hash,{account,to:transaction.to}),{block:'0x123'});
await assert.rejects(readTransactionReceipt(signer,hash,{account:ctf,to:transaction.to}),ReceiptPending);
receipt={transactionHash:'0x'+'e'.repeat(64),status:'0x1',blockNumber:'0x123'};await assert.rejects(readTransactionReceipt(signer,hash),ReceiptPending);
console.log('Transactions: exact token allowance, ABI dynamic arrays, simulation and gas before signing, network/rejection guards, pending/revert/success and receipt-hash checks pass.');
