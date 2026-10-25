import assert from 'node:assert/strict';
import {suite,pageFor,open,ids} from './lib.mjs';
import {states} from './states.mjs';
await suite('contrast',async(browser,check)=>{
 for(const theme of ['dark','light'])for(const state of states.filter(s=>!s.loading&&!s.error))await check(theme+' '+state.name,async()=>{const hash=state.hash;
  const p=await pageFor(browser,undefined,theme);await open(p,hash);await p.locator(state.ready).first().waitFor();if(state.act)await state.act(p,{width:1440,height:900});
  const result=await p.evaluate(()=>{
   const rgba=s=>{const m=s?.match(/[\d.]+/g);return m?[+m[0],+m[1],+m[2],m[3]===undefined?1:+m[3]]:[0,0,0,0];};const over=(a,b)=>{const v=a[3]+b[3]*(1-a[3]);return v?[0,1,2].map(i=>(a[i]*a[3]+b[i]*b[3]*(1-a[3]))/v).concat(v):[0,0,0,0];};
   const lum=c=>c.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
   const bg=e=>{const chain=[];for(let p=e;p;p=p.parentElement)chain.unshift(p);let c=[16,16,19,1];for(const n of chain)c=over(rgba(getComputedStyle(n).backgroundColor),c);return c;};
   const visible=(e,graphic=false)=>{if(e.closest(graphic?'[hidden],[inert]':'[hidden],[inert],[aria-hidden=true]'))return false;const c=getComputedStyle(e),r=e.getBoundingClientRect();if(c.display==='none'||c.visibility==='hidden'||+c.opacity===0||r.width===0||r.height===0)return false;for(let p=e.parentElement;p;p=p.parentElement){const c=getComputedStyle(p);if(c.display==='none'||c.visibility==='hidden'||+c.opacity===0)return false;}return true;};
   const failures=[],samples=[];for(const el of document.querySelectorAll('body *')){
    if(!visible(el)||el.matches('script,style,defs,symbol,option')||el.closest('defs,symbol')||el.closest(':disabled')||el.closest('[aria-disabled=true]'))continue;
    const direct=[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());if(!direct&&!el.matches('input:not([type=range]):not([type=radio]):not([type=checkbox])'))continue;
    if(el.closest('.sr'))continue;const cs=getComputedStyle(el),background=bg(el),foreground=rgba(el instanceof SVGElement?cs.fill:cs.color),value=ratio(over(foreground,background),background);
    const entry={selector:el.tagName.toLowerCase()+(el.id?'#'+el.id:el.classList.length?'.'+[...el.classList].join('.') :''),text:el.textContent?.trim().slice(0,70),ratio:+value.toFixed(2),fg:el instanceof SVGElement?cs.fill:cs.color,bg:background};samples.push(entry);if(value<4.5-.02)failures.push(entry);
   }
   const graphics=[];for(const el of document.querySelectorAll('.mark-track,.mark-segment,.mark-tick,.chance-arc,.dial-ticks path,.ribbon-track,.pn-chart .ln,.pn-chart .end,.history-line')){if(!visible(el,true))continue;const cs=getComputedStyle(el),background=bg(el.parentElement),stroke=el instanceof SVGElement?rgba(cs.stroke==='none'?cs.fill:cs.stroke):rgba(cs.backgroundColor);if(stroke[3]===0||cs.stroke.startsWith('url'))continue;const r=ratio(over(stroke,background),background);graphics.push({selector:el.className.baseVal||el.className,ratio:+r.toFixed(2)});if(r<3-.02)failures.push({graphic:el.className.baseVal||el.className,ratio:+r.toFixed(2)});}
   return {textSamples:samples.length,minText:Math.min(...samples.map(s=>s.ratio)),graphics:graphics.length,minGraphic:Math.min(...graphics.map(s=>s.ratio)),failures};
  });await p.close();assert.deepEqual(result.failures,[],JSON.stringify(result.failures).slice(0,2500));return result;
 });
});
