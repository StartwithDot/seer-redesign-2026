import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {createRequire} from 'node:module';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const entry=`
 import {createElement} from 'react';
 import {renderToStaticMarkup} from 'react-dom/server';
 import {ArchiveGallery} from './src/products/opportunity/components/ArchiveGallery';
 import {GalleryLightbox} from './src/products/opportunity/components/GalleryLightbox';
 import {WalletProvider} from './src/products/opportunity/hooks/WalletContext';
 import {ArchivePositions} from './src/products/opportunity/components/ArchivePositions';
 import {RedeemDrawer} from './src/products/opportunity/components/RedeemDrawer';
 import {TransactionStatus} from './src/products/opportunity/components/TransactionStatus';
 import {galleryFor} from './src/products/opportunity/data/gallery';
 export function gallery(id){return renderToStaticMarkup(createElement(ArchiveGallery,{marketId:id}));}
 export function lightbox(){const items=galleryFor('seer-rebrand-contest')[0];return renderToStaticMarkup(createElement(GalleryLightbox,{images:items.images,titles:items.images.map(()=>items.title),creators:items.images.map(()=>items.creator),initialIndex:0,onClose:()=>{}}));}
 export function walletPanel(Component,state){const wallet={status:'disconnected',address:null,chainId:null,receipts:[],transaction:{status:'idle'},read:async()=>{},...state};return renderToStaticMarkup(createElement(WalletProvider,{wallet},createElement(Component,{marketId:'seer-rebrand-contest',initialIndex:0,onClose:()=>{}})));}
 export {ArchivePositions,RedeemDrawer,TransactionStatus};
`;
const output=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,platform:'node',format:'cjs'});
// React SSR accesses feature detection only; no browser success is asserted.
globalThis.matchMedia=()=>({matches:true});
const directory=await mkdtemp(join(tmpdir(),'opportunity-render-'));
const bundle=join(directory,'panels.cjs');await writeFile(bundle,output.outputFiles[0].text);
const module=createRequire(import.meta.url)(bundle);
await rm(directory,{recursive:true});
for(const [id,count] of [['seer-rebrand-contest',144],['seer-merch-devcon-mumbai',18]]){
 const html=module.gallery(id);assert.match(html,new RegExp(`${count} of ${count} images`));
 assert.match(html,/Zoom image/);assert.match(html,/Image thumbnails/);assert.match(html,/cdn.kleros.link/);assert.match(html,/aria-pressed="true"/);
}
assert.match(module.lightbox(),/Zoom in/);assert.match(module.lightbox(),/@hypedsgn/);assert.match(module.lightbox(),/role="dialog"/);
assert.match(module.walletPanel(module.ArchivePositions,{}),/Connect a wallet/);
assert.match(module.walletPanel(module.RedeemDrawer,{status:'wrong-network'}),/Switch to Gnosis Chain/);
assert.match(module.walletPanel(module.TransactionStatus,{transaction:{status:'pending',label:'Redeem winner',message:'Waiting for an on-chain receipt.',hash:'0x'+'b'.repeat(64)}}),/Check confirmation/);
assert.match(module.walletPanel(module.TransactionStatus,{transaction:{status:'failed',label:'Redeem winner',message:'Transaction reverted on-chain.',hash:'0x'+'b'.repeat(64)}}),/role="alert"/);
console.log('React rendering: archive counts/images/thumbnails, attributed lightbox, disconnected/wrong-network payouts and pending/failed transaction controls pass.');
