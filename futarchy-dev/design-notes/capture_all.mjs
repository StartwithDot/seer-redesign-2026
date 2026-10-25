// node products/futarchy2/capture_all.mjs <outDirSuffix>  (dev server on :5301)
import {chromium} from 'playwright-core'; import fs from 'node:fs';
const out='products/futarchy2/shots/'+(process.argv[2]||'cur');fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({channel:'chrome',args:['--use-gl=angle','--enable-unsafe-swiftshader']});
const U='http://localhost:5301/';
async function page(vp,mob,theme){const c=await b.newContext({viewport:vp,isMobile:mob});const p=await c.newPage();await p.addInitScript(t=>{try{localStorage.setItem('seer.theme',t);localStorage.setItem('seer.tour','done');localStorage.setItem('futarchy-tour','done')}catch{}},theme);return p}
const D={width:1440,height:900},M={width:390,height:844};
let p=await page(D,false,'dark');
await p.goto(U);await p.waitForTimeout(3000);await p.screenshot({path:out+'/landing_d_top.png'});await p.screenshot({path:out+'/landing_d_full.png',fullPage:true});
await p.goto(U+'#/organizations');await p.waitForTimeout(2500);await p.screenshot({path:out+'/orgs_d.png'});
await p.goto(U+'#/m/aave-412');await p.waitForTimeout(3000);await p.screenshot({path:out+'/detail_d_top.png'});await p.screenshot({path:out+'/detail_d_full.png',fullPage:true});
await p.goto(U+'#/m/aave-412');await p.waitForTimeout(1500);await p.getByRole('button',{name:/Add Liquidity/i}).first().click().catch(()=>{});await p.waitForTimeout(800);await p.screenshot({path:out+'/modal_liquidity.png'});
await p.goto(U);await p.waitForTimeout(1500);await p.keyboard.press('Control+k');await p.waitForTimeout(800);await p.screenshot({path:out+'/palette.png'});
await p.goto(U);await p.waitForTimeout(1500);await p.getByRole('button',{name:/Connect/i}).first().click().catch(()=>{});await p.waitForTimeout(800);await p.screenshot({path:out+'/modal_connect.png'});
await p.goto(U+'#/create');await p.waitForTimeout(2000);await p.screenshot({path:out+'/create_d.png'});
p=await page(D,false,'light');await p.goto(U);await p.waitForTimeout(3000);await p.screenshot({path:out+'/landing_light.png'});await p.goto(U+'#/m/aave-412');await p.waitForTimeout(3000);await p.screenshot({path:out+'/detail_light.png'});
p=await page(M,true,'dark');await p.goto(U);await p.waitForTimeout(3000);await p.screenshot({path:out+'/landing_m_top.png'});await p.goto(U+'#/m/aave-412');await p.waitForTimeout(3000);await p.screenshot({path:out+'/detail_m_top.png'});await p.screenshot({path:out+'/detail_m_full.png',fullPage:true});
await b.close();
