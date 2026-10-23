import {chromium} from 'playwright-core';
const sites = ['navbar.gallery','supahero.io','cta.gallery','footer.design','3dicons.co','scrolltide.co','styles.refero.design'];
const b = await chromium.launch({channel:'chrome'});
for (const s of sites) {
  const p = await b.newPage({viewport:{width:1440,height:900}});
  try {
    await p.goto('https://'+s,{waitUntil:'domcontentloaded',timeout:45000}); await p.waitForTimeout(4000);
    const H = await p.evaluate(()=>document.documentElement.scrollHeight);
    for (let i=0;i<4;i++){ await p.evaluate(y=>window.scrollTo(0,y), Math.round(i*Math.min(H-900,3600)/3)); await p.waitForTimeout(1800);
      await p.screenshot({path:`research/inspo/${s.replace(/\./g,'_')}_${i}.png`}); }
  } catch(e){ console.error('fail',s,e.message); }
  await p.close();
}
await b.close();
