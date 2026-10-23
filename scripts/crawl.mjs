import {chromium} from 'playwright-core';
import fs from 'fs';
const sites = ['stripe.com','linear.app','vercel.com','raycast.com','framer.com','arc.net','resend.com','mercury.com','ramp.com','polymarket.com','kalshi.com','uniswap.org','apple.com/airpods-pro','notion.com','cursor.com','openai.com','anthropic.com','phantom.com','rainbow.me','ledger.com'];
const b = await chromium.launch({channel:'chrome'});
for (const s of sites) {
  const id = s.replace(/[^a-z0-9]/gi,'_');
  const p = await b.newPage({viewport:{width:1440,height:900}});
  try {
    await p.goto('https://'+s,{waitUntil:'domcontentloaded',timeout:40000}); await p.waitForTimeout(3500);
    const H = await p.evaluate(()=>document.documentElement.scrollHeight);
    const prof = {site:s, pageHeight:H};
    for (let i=0;i<6;i++){ const y=Math.round(i*Math.min(Math.max(H-900,0),5400)/5); await p.evaluate(y=>window.scrollTo(0,y),y); await p.waitForTimeout(1200); await p.screenshot({path:`research/crawl/${id}_${i}.png`}); }
    await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(600);
    Object.assign(prof, await p.evaluate(()=>{
      const cs=(e)=>getComputedStyle(e); const t=(e)=>(e?.innerText||'').trim().replace(/\s+/g,' ').slice(0,140);
      const h1=document.querySelector('h1'); const c=h1?cs(h1):null;
      const navLinks=[...document.querySelectorAll('header a, nav a')].map(t).filter(Boolean).slice(0,14);
      const ctas=[...document.querySelectorAll('a,button')].filter(e=>{const r=e.getBoundingClientRect();const k=cs(e);return r.top<900&&r.width>80&&r.height>30&&(k.backgroundColor!=='rgba(0, 0, 0, 0)')}).map(t).filter(Boolean).slice(0,6);
      const heads=[...document.querySelectorAll('h2,h3')].map(t).filter(Boolean).slice(0,24);
      const sections=document.querySelectorAll('section').length;
      const sticky=[...document.querySelectorAll('*')].filter(e=>cs(e).position==='sticky').length;
      const bgs=[...document.querySelectorAll('section,main>div,body')].slice(0,30).map(e=>cs(e).backgroundColor).filter((v,i,a)=>a.indexOf(v)===i).slice(0,8);
      const fonts=[...new Set([...document.querySelectorAll('h1,h2,p,button,a')].slice(0,60).map(e=>cs(e).fontFamily.split(',')[0].replace(/["']/g,'')))].slice(0,5);
      const w=window; const libs=[['gsap',!!w.gsap],['ScrollTrigger',!!w.ScrollTrigger],['Lenis',!!(w.Lenis||document.documentElement.classList.contains('lenis'))],['THREE',!!w.THREE],['lottie',!!w.lottie],['framer-motion',!!document.querySelector('[data-framer-name],[style*="--framer"]')],['canvas',document.querySelectorAll('canvas').length],['video',document.querySelectorAll('video').length]].filter(x=>x[1]).map(x=>x[0]+(typeof x[1]==='number'?':'+x[1]:''));
      const footer=[...document.querySelectorAll('footer a')].map(t).filter(Boolean).slice(0,30);
      return {title:document.title, h1:t(h1), h1Style:c?{fontSize:c.fontSize,fontWeight:c.fontWeight,letterSpacing:c.letterSpacing,lineHeight:c.lineHeight,color:c.color,family:c.fontFamily.split(',')[0]}:null, bodyBg:cs(document.body).backgroundColor, bodyFont:cs(document.body).fontFamily.split(',')[0], bodySize:cs(document.body).fontSize, navLinks, ctas, heads, sections, sticky, sectionBgs:bgs, fonts, libs, footerLinks:footer};
    }));
    fs.writeFileSync(`research/crawl/${id}.json`, JSON.stringify(prof,null,1));
    console.log('ok',s);
  } catch(e){ console.log('fail',s,e.message.slice(0,80)); }
  await p.close();
}
await b.close();
