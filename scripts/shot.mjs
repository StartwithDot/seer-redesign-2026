import {chromium} from 'playwright-core';
const [,, url='http://127.0.0.1:5188/seer-2026', w='1440', h='900', out='/tmp/shot.png', scroll='0', full='0'] = process.argv;
const b = await chromium.launch({channel:'chrome', args:['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const p = await b.newPage({viewport:{width:+w,height:+h}});
await p.goto(url); await p.waitForTimeout(4500);
if (+scroll) { await p.evaluate(y=>window.scrollTo(0,y), +scroll); await p.waitForTimeout(1800); }
await p.screenshot({path:out, fullPage: full==='1'});
await b.close();
