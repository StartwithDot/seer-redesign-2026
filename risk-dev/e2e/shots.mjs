import { chromium } from '/Users/leo/Documents/POIDH/node_modules/playwright-core/index.mjs';
const base=process.env.BASE||'http://127.0.0.1:5182/';
const b=await chromium.launch({channel:'chrome'});
async function shot(name,w,h,theme,scrollTo){
 const ctx=await b.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();
 await p.addInitScript(t=>{localStorage.setItem('risk2-guide-seen','1');localStorage.setItem('risk2-theme',t)},theme);
 await p.goto(base);await p.waitForSelector('[data-testid="page-title"]');await p.waitForTimeout(900);
 if(scrollTo){await p.getByTestId('nav-assets').click();await p.waitForTimeout(1500)}
 await p.screenshot({path:`e2e/out/${name}.png`});await ctx.close();
}
await shot('v-hero-dark',1440,900,'dark');await shot('v-assets-dark',1440,900,'dark',1);
await shot('v-hero-light',1440,900,'light');await shot('v-assets-light',1440,900,'light',1);
await shot('v-mobile',390,844,'dark');await shot('v-mobile-assets',390,844,'light',1);
await shot('v-1920',1920,1080,'dark',1);
await b.close();
