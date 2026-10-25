import {chromium} from 'playwright-core';
const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const c=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});const p=await c.newPage(),cdp=await c.newCDPSession(p);
await p.setContent('<meta name="viewport" content="width=device-width,initial-scale=1"><div id="s" style="height:500px;overflow:auto"><div style="height:2000px">Native scroll control</div></div>');
await p.evaluate(()=>{window.events=[];for(const type of ['touchstart','touchmove','touchend','pointerdown'])document.addEventListener(type,e=>window.events.push({type,trusted:e.isTrusted,prevented:e.defaultPrevented}),{passive:true});});
await cdp.send('Input.synthesizeScrollGesture',{x:180,y:420,yDistance:-220,speed:600,gestureSourceType:'touch'});await p.waitForTimeout(200);console.log('synthetic',await p.evaluate(()=>({scroll:document.getElementById('s').scrollTop,events:window.events})));
await p.evaluate(()=>{document.getElementById('s').scrollTop=0;window.events=[];});
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:180,y:420,id:1,radiusX:4,radiusY:4,force:1}]});
for(let i=1;i<=14;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:180,y:420-i*15,id:1,radiusX:4,radiusY:4,force:1}]});await p.waitForTimeout(16);}
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(200);console.log('dispatched',await p.evaluate(()=>({scroll:document.getElementById('s').scrollTop,events:window.events})));
await b.close();
