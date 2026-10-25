// Runs in the browser. Composite translucent surfaces instead of testing token pairs.
export function colourAudit() {
 const canvas=document.createElement('canvas');canvas.width=canvas.height=1;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});
 const rgb=value=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=value;ctx.fillRect(0,0,1,1);const c=[...ctx.getImageData(0,0,1,1).data];return [c[0],c[1],c[2],c[3]/255];};
 const mix=(a,b)=>[...a.slice(0,3).map((v,i)=>v*a[3]+b[i]*(1-a[3])),1];
 const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
 // Neutral EF ink has very low chroma. Chromatic surfaces must stay violet;
 // the exact green/red exceptions are reserved for arrow delta text.
 const yellow=(c,delta=false)=>{const [r,g,b]=c.slice(0,3),max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;if(c[3]===0||d<=16)return false;
  const exceptions=[[61,220,151],[18,145,95],[255,92,114],[209,51,74]];
  if(delta&&exceptions.some(v=>v.every((n,i)=>Math.abs(n-c[i])<=1)))return false;
  let h=max===r?((g-b)/d)%6:max===g?(b-r)/d+2:(r-g)/d+4;h=(h*60+360)%360;
  return h<250||h>280;
 };
 const contrast=[],yellows=[];
 for(const e of document.querySelectorAll('*')){
  const r=e.getBoundingClientRect(),style=getComputedStyle(e);
  if(!r.width||!r.height||style.visibility==='hidden'||style.display==='none')continue;
  const label=e.getAttribute('data-testid')||e.getAttribute('aria-label')||e.tagName+'.'+e.className;
  for(const pseudo of [null,'::before','::after']){
   const css=pseudo?getComputedStyle(e,pseudo):style;if(pseudo&&['none','normal'].includes(css.content))continue;
   for(const prop of ['color','backgroundColor','borderTopColor','borderRightColor','borderBottomColor','borderLeftColor','outlineColor','fill','stroke','accentColor','caretColor']){
    const value=css[prop];if(value&&CSS.supports('color',value)&&yellow(rgb(value),prop==='color'&&/[↑↓]/.test(e.textContent)&&e.children.length===0))yellows.push({label,pseudo,prop,value});
   }
   // Chromium may serialize gradients in rgb, hex, color(srgb), or oklab.
   for(const value of css.backgroundImage.match(/(?:rgba?|hsla?|oklch|oklab|color)\([^)]*\)|#[\da-f]{3,8}\b/gi)||[])if(CSS.supports('color',value)&&yellow(rgb(value)))yellows.push({label,pseudo,prop:'backgroundImage',value});
  }
  if(![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())||e.closest('[aria-hidden=true]'))continue;
  const x=Math.max(0,Math.min(innerWidth-1,r.x+r.width/2)),y=Math.max(0,Math.min(innerHeight-1,r.y+r.height/2));
  if(r.bottom<0||r.top>innerHeight||r.right<0||r.left>innerWidth)continue;
  const hit=document.elementFromPoint(x,y);if(!hit||!e.contains(hit))continue;
  const chain=[];for(let p=e;p;p=p.parentElement)chain.unshift(p);
  let bg=rgb(getComputedStyle(document.documentElement).getPropertyValue('--bg'));
  for(const p of chain)bg=mix(rgb(getComputedStyle(p).backgroundColor),bg);
  const fg=mix(rgb(style.color),bg),ratio=(Math.max(lum(fg),lum(bg))+.05)/(Math.min(lum(fg),lum(bg))+.05);
  if(ratio<4.5)contrast.push({label,text:e.textContent.trim().slice(0,80),ratio:+ratio.toFixed(3),foreground:style.color,background:bg});
 }
 return {contrast,yellows};
}

export function geometryAudit(){
 const painted=e=>{const r=e.getBoundingClientRect();let {left,right,top,bottom}=r;
  for(let p=e.parentElement;p;p=p.parentElement){const c=getComputedStyle(p),q=p.getBoundingClientRect();if(/hidden|clip|auto|scroll/.test(c.overflowX)){left=Math.max(left,q.left);right=Math.min(right,q.right);}if(/hidden|clip|auto|scroll/.test(c.overflowY)){top=Math.max(top,q.top);bottom=Math.min(bottom,q.bottom);}}
  return {left,right,top,bottom,width:right-left,height:bottom-top};};
 const els=[];
 for(const e of document.querySelectorAll('button,input,a,h1,h2,output,th,td,svg text')){
  const style=getComputedStyle(e),r=painted(e);if(style.visibility==='hidden'||Number(style.opacity)===0||r.width<=0||r.height<=0||r.bottom<=0||r.top>=innerHeight||e.closest('[aria-hidden=true]'))continue;
  const hit=document.elementFromPoint(Math.max(0,Math.min(innerWidth-1,(r.left+r.right)/2)),Math.max(0,Math.min(innerHeight-1,(r.top+r.bottom)/2)));
  if(hit&&(e.contains(hit)||hit.contains(e)))els.push({e,r});
 }
 const bad=[];
 for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){
  const a=els[i],b=els[j];if(a.e.contains(b.e)||b.e.contains(a.e)||a.e.closest('[data-overlay]')||b.e.closest('[data-overlay]'))continue;
  if(a.e.matches('.bubbles .field-tile')&&b.e.matches('.bubbles .field-tile')){if(Math.hypot((a.r.left+a.r.right-b.r.left-b.r.right)/2,(a.r.top+a.r.bottom-b.r.top-b.r.bottom)/2)>=(a.r.width+b.r.width)/2)continue;}
  if(Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left)>2&&Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top)>2)bad.push([a.e.outerHTML.slice(0,180),b.e.outerHTML.slice(0,180)]);
 }
 return bad;
}

// All mounted chart labels, including clipped cells. Ranked bars have no text
// inside their 3/8px marks: their labels are audited against the actual row fill.
export function graphLabelAudit(){
 const ctx=document.createElement('canvas').getContext('2d',{willReadFrequently:true});
 const rgb=value=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=value;ctx.fillRect(0,0,1,1);const c=[...ctx.getImageData(0,0,1,1).data];return [...c.slice(0,3),c[3]/255];};
 const lum=c=>c.slice(0,3).reduce((sum,v,i)=>sum+(v/255<=.04045?v/255/12.92:((v/255+.055)/1.055)**2.4)*[.2126,.7152,.0722][i],0);
 const failures=[];let count=0;
 for(const label of document.querySelectorAll('.field-tile strong,.field-tile>span:not(.tile-flash),.field-chip strong,.ladder-submission>span,.ladder-rank,.ladder-odds,.ladder-cumulative')){
  const chain=[];for(let el=label;el;el=el.parentElement)chain.unshift(el);
  let fill=rgb(getComputedStyle(document.documentElement).getPropertyValue('--bg'));
  for(const el of chain){const next=rgb(getComputedStyle(el).backgroundColor);fill=[...next.slice(0,3).map((v,i)=>v*next[3]+fill[i]*(1-next[3])),1];}
  const ink=rgb(getComputedStyle(label).color),ratio=(Math.max(lum(ink),lum(fill))+.05)/(Math.min(lum(ink),lum(fill))+.05);count++;
  if(ratio<4.5)failures.push({label:label.textContent,ratio,ink,fill});
 }
 return {count,failures};
}
