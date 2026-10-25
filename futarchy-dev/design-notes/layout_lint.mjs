// node pipeline/layout_lint.mjs <baseUrl> <hash1,hash2,..>  -> prints layout defects at 1440/768/390
import {chromium} from 'playwright-core';
const base=process.argv[2], hashes=(process.argv[3]||'').split(',');
const b=await chromium.launch({channel:'chrome'});const out=[];
for(const [w,h] of [[1440,900],[768,1024],[390,844]]){for(const hash of hashes){
 const c=await b.newContext({viewport:{width:w,height:h},isMobile:w<500});const p=await c.newPage();
 await p.addInitScript(()=>{try{localStorage.setItem('seer.tour','done');localStorage.setItem('futarchy-tour','done')}catch{}});
 await p.goto(base+hash);await p.waitForTimeout(3000);
 const r=await p.evaluate(()=>{const o=[];const vis=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&s.opacity!=='0'};
  const name=e=>(e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(e.className&&typeof e.className==='string'?'.'+e.className.trim().split(/\s+/).slice(0,2).join('.'):''))+' "'+(e.textContent||'').trim().slice(0,28)+'"';
  if(document.documentElement.scrollWidth>innerWidth+1)o.push('PAGE horizontal scroll '+document.documentElement.scrollWidth+'>'+innerWidth);
  for(const e of document.querySelectorAll('body *')){if(!vis(e))continue;const s=getComputedStyle(e);
   if(e.children.length===0&&(e.textContent||'').trim()){const fs=parseFloat(s.fontSize);if(fs<11)o.push('tiny text '+fs+'px '+name(e));if(!e.closest('.sr-only')&&!e.matches('.sr-only')&&e.scrollWidth>e.clientWidth+2&&s.overflow!=='visible'&&s.textOverflow!=='ellipsis')o.push('clipped text '+name(e));}
   if(e.matches('a,button,[role=button],[role=tab],input,select')){const r=e.getBoundingClientRect();if((r.height<32||r.width<32)&&r.top<innerHeight*3)o.push('small target '+Math.round(r.width)+'x'+Math.round(r.height)+' '+name(e));}}
  const ints=[...document.querySelectorAll('a,button,[role=tab],input,select')].filter(vis).slice(0,150);
  for(let i=0;i<ints.length;i++)for(let j=i+1;j<ints.length;j++){if(ints[i].contains(ints[j])||ints[j].contains(ints[i]))continue;const a=ints[i].getBoundingClientRect(),b=ints[j].getBoundingClientRect();const ox=Math.min(a.right,b.right)-Math.max(a.left,b.left),oy=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);if(ox>4&&oy>4)o.push('OVERLAP '+name(ints[i])+' x '+name(ints[j]));}
  return [...new Set(o)].slice(0,25)});
 out.push({w,hash,issues:r});await c.close();}}
await b.close();for(const x of out)console.log(`## ${x.w}px ${x.hash||'/'} (${x.issues.length})\n`+x.issues.map(i=>' - '+i).join('\n'));
