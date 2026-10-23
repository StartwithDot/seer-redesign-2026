// usage: node shotpage.mjs <url> <outPrefix> [desktopSlices=6] [mobileSlices=3]
import {chromium} from 'playwright-core';
const [,, url, pre, dN='6', mN='3'] = process.argv;
const b = await chromium.launch({channel:'chrome', args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
for (const [tag,w,h,n] of [['d',1440,900,+dN],['m',390,844,+mN]]) {
  const p = await b.newPage({viewport:{width:w,height:h}});
  if (process.env.THEME) await p.addInitScript(t=>{try{localStorage.setItem('seer-theme',t)}catch(e){}}, process.env.THEME);
  try {
    await p.goto(url,{waitUntil:'load'}); await p.waitForTimeout(3500);
    const H = await p.evaluate(()=>document.documentElement.scrollHeight);
    for (let i=0;i<n;i++) {
      const y = n===1?0:Math.round(i*Math.max(0,H-h)/(n-1));
      await p.evaluate(y=>window.scrollTo(0,y), y); await p.waitForTimeout(1500);
      await p.screenshot({path:`${pre}_${tag}${i}.png`});
    }
  } catch(e){ console.error('shot fail',tag,e.message); }
  await p.close();
}
await b.close();
