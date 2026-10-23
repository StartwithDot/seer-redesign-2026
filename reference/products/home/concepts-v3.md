## Concept A: Night Oracle

**Hero headline:** "Ask the question. *Read the answer in prices.*" (Instrument Serif, second line italic)
**Sub:** "Seer is Information Finance infrastructure for the agentic economy. Anyone, person or agent, can turn what they need to know into a market and read the crowd's estimate without placing a trade."

**Hero layout:** This follows Injective's composition. A centred 420px dot raven sits on black, and the serif headline overlaps the bottom of its circle. Below it are the sub, two pills, and the reversed fan as a full-width band across the bottom. The fan is labelled "One question" on the left and "Many priced outcomes" on the right. The top edge of the violet panel shows at the bottom of the screen.

**Fan-out line role:** One horizontal spine runs along the bottom of every chapter. In each chapter its single line comes in from the left and fans out into that chapter's object.

**Chapters:**
1. **Protocol (black).** A coin drops onto the line and splits into YES and NO tokens. Their ERC1155 label flips to ERC20. A Reality.eth answer is disputed and Kleros stamps the verdict. Four fan shapes name the four market types.
2. **Seer App (violet).** An isometric index tower of market slabs, tone-on-tone. A new slab slides in and becomes an explorer row with question, price and volume.
3. **Deep (black).** An isometric field of 64 pillars, one per grant proposal. Agent dots hop between them and the pillar heights settle into prices.
4. **Futarchy (violet).** An isometric road forks into PASS and FAIL lanes, each ending at a price post. The two numbers move apart. Caption: "The DAO votes. The market informs."
5. **Opportunity (black).** A grid of submission sheets. Prices lift some of them and the shortlist narrows to five. Then a reviewer's seal overrides one pick.
6. **Risk (violet).** Isometric terraces show survival stepping down over time, three protocols side by side.
7. **Close (black).** An agent asks a question and the market answers.

**Asker-first moment:** Every chapter opens with an eyebrow naming who asks, for example "Asked by a grant committee". It closes with a "What you learn" line, so a visitor gets the signal without becoming a trader.

**Raven journey:** On scroll the hero dots drain left into the spine. At each chapter's junction they re-form as a flying raven, shrinking from 100% down to 15%. On the final page it lands on the single line of the footer fan, next to "Launch App".

**Why it reads premium, not slop:** Each screen has one object. There are only two typefaces, and the serif carries the voice. Motion is slow and mechanical. There is no extra chrome, so the empty black space does the structural work.

---

## Concept B: Asked By

**Hero headline:** "Every question / has a price." (Inter Tight 600, second line in violet tint)
**Sub:** "Seer turns what people and agents need to know into markets. One question fans out into priced outcomes you can read, cite and act on, without placing a trade."

**Hero layout:** An editorial split. On the left, a 460px dot raven with the grotesk headline overlapping its lower third, then the sub and pills. On the right is a real question with its asker. One line fans out into five outcomes: Base 41, Arbitrum 27, Optimism 14, Gnosis 9, Other 9. Line weight scales with each outcome's price. A "How to read it" note sits underneath.

**Fan-out line role:** The fan is the data. Every line ends at a named outcome and a price.

**Chapters, ordered by who asks:**
1. **Opportunity (violet): a grant committee asks.** A stack of paper submissions fans out. Prices sort them, and a reviewer's pen ticks the final three.
2. **Futarchy (black): a DAO asks.** A signpost splits into Pass and Fail, with a conditional GNO price on each arm.
3. **Risk (violet): a lender asks.** An hourglass column per protocol. Sand marks the survival probability each quarter.
4. **Deep (black): an agent asks.** A field of 64 tokens is priced at once. Agents fill it in and humans' scores resolve it.
5. **Seer App (violet): everyone reads.** An open ledger book whose rows are every market.
6. **Protocol (black).** "Beneath all five": token split, the ERC20 wrap and the Kleros verdict, drawn as one cross-section.

**Asker-first moment:** The hero itself. You see who is asking before you see a trader.

**Raven journey:** The raven dissolves into the hero question's fan, then reappears small, perched on each chapter's "Asked by" line. On the last page it lands on top of the ledger.

**Why it reads premium, not slop:** Labels sit directly on the data. Typography has real contrast. There are no cards. The design is built on real numbers.

---

## Concept C: Relay

**Hero headline:** "Where agents ask / and markets answer." (Newsreader)
**Sub:** "Information Finance infrastructure for the agentic economy. People and AI agents post what they need to know, traders price every outcome, and anyone can read the signal."

**Hero layout:** The raven is the junction. One line enters its circle from the left and nine lines leave it on the right. Above the incoming line, the asker rotates: a DAO, a grant committee, a lender, an AI agent. Each comes with its real question, and the outcome labels on the outgoing lines change with it. A violet tick travels along the lines.

**Fan-out line role:** It is a relay. The question goes in, the raven reads it, and priced outcomes come out.

**Chapters:**
1. **Deep (violet).** A dot-matrix field of 64 outcome columns. An agent's query lands and the columns set their heights.
2. **Opportunity (black).** A dot grid of submissions thins to a shortlist. A reviewer's mark stays bright.
3. **Futarchy (violet).** A dot river forks into pass and fail, with a price on each bank.
4. **Risk (black).** Dot strata erode over time, a survival curve per protocol.
5. **Seer App (violet).** Every market as one dot in a single index sphere.
6. **Protocol (black).** Dots split into YES and NO, then wrap and resolve.

**Asker-first moment:** The rotating asker in the hero, plus an "Ask Seer" field at the close.

**Raven journey:** The raven travels as each chapter's junction node and shrinks along the way. It lands where the final line ends, at "Ask Seer".

**Why it reads premium, not slop:** One material, white dots, carries the whole page. The motion explains how information flows instead of decorating it.

```html A
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Seer, Information Finance</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap">
<style>
:root{--bg:#0a0a0a;--raised:#121218;--v:#7b3ff2;--v-hi:#8d58f5;--panel:#4b3bff;--t1:#fff;--t2:rgba(255,255,255,.66);--t3:rgba(255,255,255,.42);--hair:rgba(255,255,255,.1);--sans:"Inter Tight",system-ui,sans-serif;--serif:"Instrument Serif",Georgia,serif}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--bg);color:var(--t1)}
body{font:400 16px/1.5 var(--sans);-webkit-font-smoothing:antialiased;min-height:100svh;display:grid;grid-template-rows:64px 1fr 44px;overflow-x:hidden}
a{color:inherit;text-decoration:none}
.nav{display:flex;align-items:center;gap:40px;padding:0 32px}
.brand{display:flex;align-items:center;gap:10px;font:italic 600 17px/1 var(--sans);letter-spacing:.06em}
.links{display:flex;gap:28px;margin-left:auto;font-size:14px;color:var(--t2)}
.links a{transition:color .14s}.links a:hover{color:var(--t1)}
.pill{display:inline-flex;align-items:center;height:42px;padding:0 22px;border-radius:999px;font:500 14px/1 var(--sans);transition:background .14s,border-color .14s}
.pri{background:var(--v);color:#fff}.pri:hover{background:var(--v-hi)}
.sec{background:var(--raised);border:1px solid var(--hair)}.sec:hover{border-color:rgba(255,255,255,.26)}
.nav .pill{height:36px;padding:0 16px}
.hero{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;min-height:0}
#c{display:block;width:420px;height:430px;margin-top:4px}
h1{position:relative;margin-top:-58px;font:400 84px/.98 var(--serif);letter-spacing:-.012em}
h1 em{font-style:italic}
.sub{max-width:560px;margin-top:22px;font-size:17px;color:var(--t2)}
.cta{display:flex;gap:12px;margin-top:28px}
.fan{position:relative;width:100%;height:72px;margin:auto 0 14px}
.fan svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.fan path{fill:none;stroke:var(--v);stroke-width:3;vector-effect:non-scaling-stroke;stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1.6s cubic-bezier(.2,.8,.2,1) .3s forwards}
.fan path+path{animation-delay:.9s}
@keyframes draw{to{stroke-dashoffset:0}}
.tag{position:absolute;font:500 11px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--t3)}
.tag.l{left:32px;top:20px}.tag.r{right:32px;top:-12px}
.peek{margin:0 24px;background:var(--panel);border-radius:28px 28px 0 0;display:flex;justify-content:space-between;padding:12px 40px 0}
.peek b{font:400 26px/1 var(--serif)}
.peek span{font-size:13px;color:rgba(255,255,255,.8);padding-top:7px}
@media (prefers-reduced-motion:reduce){.fan path{animation:none;stroke-dashoffset:0}}
</style></head>
<body>
<header class="nav">
  <a class="brand" href="/"><svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true"><path d="M19.6 4.2A11 11 0 1 0 23.2 16.4" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><path d="M21.5 1l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" fill="#fff"/></svg>SEER</a>
  <nav class="links"><a href="#apps">Apps</a><a href="#protocol">Protocol</a><a href="https://seer-3.gitbook.io">Docs</a><a href="/blog">Blog</a></nav>
  <a class="pill pri" href="https://app.seer.pm">Launch App</a>
</header>
<main class="hero">
  <canvas id="c" aria-label="Seer raven drawn in white dots" role="img"></canvas>
  <h1>Ask the question.<br><em>Read the answer in prices.</em></h1>
  <p class="sub">Seer is Information Finance infrastructure for the agentic economy. Anyone, person or agent, can turn what they need to know into a market and read the crowd's estimate without placing a trade.</p>
  <div class="cta"><a class="pill pri" href="https://app.seer.pm/create-market">Ask a question</a><a class="pill sec" href="https://app.seer.pm/markets">Explore markets</a></div>
  <div class="fan" aria-hidden="true">
    <span class="tag l">One question</span><span class="tag r">Many priced outcomes</span>
    <svg viewBox="0 0 1440 72" preserveAspectRatio="none">
      <path pathLength="1" d="M0 36H1440"/>
      <path pathLength="1" d="M360 36C450 36 450 9 560 9H1440"/>
      <path pathLength="1" d="M360 36C450 36 450 18 560 18H1440"/>
      <path pathLength="1" d="M360 36C450 36 450 27 560 27H1440"/>
      <path pathLength="1" d="M360 36C450 36 450 45 560 45H1440"/>
      <path pathLength="1" d="M360 36C450 36 450 54 560 54H1440"/>
      <path pathLength="1" d="M360 36C450 36 450 63 560 63H1440"/>
    </svg>
  </div>
</main>
<section class="peek" id="protocol"><b>One protocol beneath five apps</b><span>Seer App, Deep, Futarchy, Opportunity Markets, Risk Pricing</span></section>
<script>
/*LOGO_DOTS*/
(function(){
var cv=document.getElementById('c'),g=cv.getContext('2d');
var D=(typeof LOGO!=='undefined')?LOGO:demo();
function demo(){var p=[],i,a;for(i=0;i<1400;i++){a=i/1400*6.2832;p.push([380+Math.cos(a)*340,420+Math.sin(a)*340]);}return{w:844,h:864,pts:p};}
function hs(n){n=Math.imul(n^61^(n>>>16),9);n^=n>>>4;n=Math.imul(n,0x27d4eb2d);return((n^(n>>>15))>>>0)/4294967296;}
var P=D.pts.map(function(p,i){var a=hs(i+1),b=hs(i*7+3);return{x:p[0],y:p[1],z:a<.5?0:a<.85?1:2,k:.7+b*.6,ph:b*6.2832,sp:.25+a*.5};});
var W,H,s,ox,oy,R,still=matchMedia('(prefers-reduced-motion: reduce)').matches,AL=[.4,.72,1],SZ=[.55,.85,1.25];
function fit(){var r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=Math.round(W*d);cv.height=Math.round(H*d);s=Math.min(W/D.w,H/D.h);ox=(W-D.w*s)/2;oy=(H-D.h*s)/2;R=Math.max(.7,W/320);g.setTransform(d,0,0,d,0,0);}
function draw(t){t/=1000;g.clearRect(0,0,W,H);g.fillStyle='#fff';
for(var z=0;z<3;z++){var amp=.6+z*.7;g.globalAlpha=AL[z];g.beginPath();
for(var i=0;i<P.length;i++){var p=P[i];if(p.z!==z)continue;
var x=ox+p.x*s+Math.sin(t*p.sp+p.ph+p.y*.01)*amp,y=oy+p.y*s+Math.cos(t*p.sp*.8+p.ph+p.x*.01)*amp,r=R*SZ[z]*p.k;
g.moveTo(x+r,y);g.arc(x,y,r,0,6.2832);}g.fill();}
g.globalAlpha=1;if(!still)requestAnimationFrame(draw);}
fit();addEventListener('resize',function(){fit();if(still)draw(0);});requestAnimationFrame(draw);
})();
</script>
</body></html>
```

```html B
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Seer, Information Finance</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&display=swap">
<style>
:root{--bg:#0a0a0a;--raised:#121218;--v:#7b3ff2;--v-hi:#8d58f5;--tint:#b69cff;--panel:#4b3bff;--t1:#fff;--t2:rgba(255,255,255,.66);--t3:rgba(255,255,255,.42);--hair:rgba(255,255,255,.1);--sans:"Inter Tight",system-ui,sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--bg);color:var(--t1)}
body{font:400 16px/1.5 var(--sans);-webkit-font-smoothing:antialiased;min-height:100svh;display:grid;grid-template-rows:64px 1fr 44px;overflow-x:hidden}
a{color:inherit;text-decoration:none}
.nav{display:flex;align-items:center;gap:40px;padding:0 80px}
.brand{display:flex;align-items:center;gap:10px;font:italic 600 17px/1 var(--sans);letter-spacing:.06em}
.links{display:flex;gap:28px;margin-left:auto;font-size:14px;color:var(--t2)}
.links a{transition:color .14s}.links a:hover{color:var(--t1)}
.pill{display:inline-flex;align-items:center;height:42px;padding:0 22px;border-radius:999px;font:500 14px/1 var(--sans);transition:background .14s,border-color .14s}
.pri{background:var(--v);color:#fff}.pri:hover{background:var(--v-hi)}
.sec{background:var(--raised);border:1px solid var(--hair)}.sec:hover{border-color:rgba(255,255,255,.26)}
.nav .pill{height:36px;padding:0 16px}
.hero{display:grid;grid-template-columns:minmax(0,1fr) 600px;gap:48px;padding:0 80px;min-height:0}
.left{display:flex;flex-direction:column;align-items:flex-start}
#c{display:block;width:460px;height:471px;margin-left:-12px}
h1{position:relative;margin-top:-100px;font:600 92px/.94 var(--sans);letter-spacing:-.05em}
h1 span{color:var(--tint)}
.sub{max-width:500px;margin-top:24px;font-size:17px;color:var(--t2)}
.cta{display:flex;gap:12px;margin-top:28px}
.right{padding-top:92px}
.who{display:flex;gap:10px;font:500 12px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--t3)}
.who b{font-weight:500;color:var(--tint)}
.q{margin-top:14px;max-width:560px;font:500 30px/1.15 var(--sans);letter-spacing:-.02em}
.fan{display:block;width:600px;height:260px;margin-top:28px;overflow:visible}
.fan path{fill:none;stroke:var(--v);stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1.4s cubic-bezier(.2,.8,.2,1) forwards}
.fan .br{animation-delay:.7s}
.fan text{font-family:var(--sans);fill:var(--t1);font-size:15px;opacity:0;animation:in .5s 1.6s forwards}
.fan text.p{font-weight:600;font-variant-numeric:tabular-nums;text-anchor:end}
.fan text.m{fill:var(--t3)}
@keyframes draw{to{stroke-dashoffset:0}}@keyframes in{to{opacity:1}}
.read{margin-top:22px;padding-top:18px;border-top:1px solid var(--hair);max-width:560px;font-size:15px;color:var(--t2)}
.read b{color:var(--t1);font-weight:500}
.meta{margin-top:10px;font-size:12px;color:var(--t3)}
.peek{margin:0 24px;background:var(--panel);border-radius:28px 28px 0 0;display:flex;align-items:baseline;gap:16px;padding:12px 56px 0}
.peek b{font:600 24px/1 var(--sans);letter-spacing:-.02em}
.peek span{font-size:15px;color:rgba(255,255,255,.82)}
.peek i{margin-left:auto;font:normal 12px/1 var(--sans);color:rgba(255,255,255,.6)}
@media (prefers-reduced-motion:reduce){.fan path{animation:none;stroke-dashoffset:0}.fan text{animation:none;opacity:1}}
</style></head>
<body>
<header class="nav">
  <a class="brand" href="/"><svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true"><path d="M19.6 4.2A11 11 0 1 0 23.2 16.4" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><path d="M21.5 1l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" fill="#fff"/></svg>SEER</a>
  <nav class="links"><a href="#apps">Apps</a><a href="#protocol">Protocol</a><a href="https://seer-3.gitbook.io">Docs</a><a href="/blog">Blog</a></nav>
  <a class="pill pri" href="https://app.seer.pm">Launch App</a>
</header>
<main class="hero">
  <div class="left">
    <canvas id="c" aria-label="Seer raven drawn in white dots" role="img"></canvas>
    <h1>Every question<br><span>has a price.</span></h1>
    <p class="sub">Seer turns what people and agents need to know into markets. One question fans out into priced outcomes you can read, cite and act on, without placing a trade.</p>
    <div class="cta"><a class="pill pri" href="https://app.seer.pm/markets">Read a market</a><a class="pill sec" href="https://app.seer.pm/create-market">Ask Seer</a></div>
  </div>
  <div class="right">
    <div class="who">Asked by <b>a DAO treasury team</b></div>
    <p class="q">Which network will hold the most stablecoins on 31 December?</p>
    <svg class="fan" viewBox="0 0 600 260" aria-label="Five outcomes with market prices">
      <path pathLength="1" d="M0 130H150" stroke-width="4"/>
      <path class="br" pathLength="1" d="M150 130C220 130 220 20 300 20H440" stroke-width="4"/>
      <path class="br" pathLength="1" d="M150 130C220 130 220 75 300 75H440" stroke-width="3" opacity=".85"/>
      <path class="br" pathLength="1" d="M150 130H440" stroke-width="2.2" opacity=".65"/>
      <path class="br" pathLength="1" d="M150 130C220 130 220 185 300 185H440" stroke-width="1.6" opacity=".5"/>
      <path class="br" pathLength="1" d="M150 130C220 130 220 240 300 240H440" stroke-width="1.6" opacity=".5"/>
      <text x="456" y="25">Base</text><text class="p" x="600" y="25">41%</text>
      <text x="456" y="80">Arbitrum</text><text class="p" x="600" y="80">27%</text>
      <text x="456" y="135">Optimism</text><text class="p" x="600" y="135">14%</text>
      <text x="456" y="190">Gnosis</text><text class="p" x="600" y="190">9%</text>
      <text x="456" y="245" class="m">Other</text><text class="p" x="600" y="245">9%</text>
    </svg>
    <p class="read"><b>How to read it.</b> 41% is the market's estimate that Base finishes first. Cite it in a proposal, watch it move, or let an agent alert you when it crosses a line you care about.</p>
    <p class="meta">Categorical market. Outcome tokens ERC1155, wrapped as ERC20. Answered on Reality.eth, disputes resolved by Kleros.</p>
  </div>
</main>
<section class="peek" id="protocol"><b>$331B traded Jan to Sep 2026.</b><span>Under 2% of it produced information.</span><i>Source: The Block</i></section>
<script>
/*LOGO_DOTS*/
(function(){
var cv=document.getElementById('c'),g=cv.getContext('2d');
var D=(typeof LOGO!=='undefined')?LOGO:demo();
function demo(){var p=[],i,a;for(i=0;i<1400;i++){a=i/1400*6.2832;p.push([380+Math.cos(a)*340,420+Math.sin(a)*340]);}return{w:844,h:864,pts:p};}
function hs(n){n=Math.imul(n^61^(n>>>16),9);n^=n>>>4;n=Math.imul(n,0x27d4eb2d);return((n^(n>>>15))>>>0)/4294967296;}
var P=D.pts.map(function(p,i){var a=hs(i+1),b=hs(i*7+3);return{x:p[0],y:p[1],z:a<.5?0:a<.85?1:2,k:.7+b*.6,ph:b*6.2832,sp:.25+a*.5};});
var W,H,s,ox,oy,R,still=matchMedia('(prefers-reduced-motion: reduce)').matches,AL=[.4,.72,1],SZ=[.55,.85,1.25];
function fit(){var r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=Math.round(W*d);cv.height=Math.round(H*d);s=Math.min(W/D.w,H/D.h);ox=(W-D.w*s)/2;oy=(H-D.h*s)/2;R=Math.max(.7,W/320);g.setTransform(d,0,0,d,0,0);}
function draw(t){t/=1000;g.clearRect(0,0,W,H);g.fillStyle='#fff';
for(var z=0;z<3;z++){var amp=.6+z*.7;g.globalAlpha=AL[z];g.beginPath();
for(var i=0;i<P.length;i++){var p=P[i];if(p.z!==z)continue;
var x=ox+p.x*s+Math.sin(t*p.sp+p.ph+p.y*.01)*amp,y=oy+p.y*s+Math.cos(t*p.sp*.8+p.ph+p.x*.01)*amp,r=R*SZ[z]*p.k;
g.moveTo(x+r,y);g.arc(x,y,r,0,6.2832);}g.fill();}
g.globalAlpha=1;if(!still)requestAnimationFrame(draw);}
fit();addEventListener('resize',function(){fit();if(still)draw(0);});requestAnimationFrame(draw);
})();
</script>
</body></html>
```

```html C
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Seer, Information Finance</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400&display=swap">
<style>
:root{--bg:#0a0a0a;--raised:#121218;--v:#7b3ff2;--v-hi:#8d58f5;--tint:#c9b5ff;--panel:#4b3bff;--t1:#fff;--t2:rgba(255,255,255,.66);--t3:rgba(255,255,255,.42);--hair:rgba(255,255,255,.1);--sans:"Inter Tight",system-ui,sans-serif;--serif:"Newsreader",Georgia,serif}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--bg);color:var(--t1)}
body{font:400 16px/1.5 var(--sans);-webkit-font-smoothing:antialiased;min-height:100svh;display:grid;grid-template-rows:64px 1fr 44px;overflow-x:hidden}
a{color:inherit;text-decoration:none}
.nav{display:flex;align-items:center;gap:40px;padding:0 32px}
.brand{display:flex;align-items:center;gap:10px;font:italic 600 17px/1 var(--sans);letter-spacing:.06em}
.links{display:flex;gap:28px;margin-left:auto;font-size:14px;color:var(--t2)}
.links a{transition:color .14s}.links a:hover{color:var(--t1)}
.pill{display:inline-flex;align-items:center;height:42px;padding:0 22px;border-radius:999px;font:500 14px/1 var(--sans);transition:background .14s,border-color .14s}
.pri{background:var(--v);color:#fff}.pri:hover{background:var(--v-hi)}
.sec{background:var(--raised);border:1px solid var(--hair)}.sec:hover{border-color:rgba(255,255,255,.26)}
.nav .pill{height:36px;padding:0 16px}
.hero{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;min-height:0;overflow:hidden}
.node{position:relative;width:400px;height:410px;margin-top:24px;flex:none}
#c{position:absolute;inset:0;width:100%;height:100%;z-index:1}
.in,.out{position:absolute;top:49%;transform:translateY(-50%);pointer-events:none}
.in{right:calc(100% + 12px);width:calc(50vw - 212px);height:4px}
.out{left:376px;width:calc(50vw - 176px);height:200px}
.in svg,.out svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
path{fill:none;vector-effect:non-scaling-stroke}
.ln path{stroke:var(--v);stroke-width:3}
.sig path{stroke:var(--tint);stroke-width:3;stroke-dasharray:.035 1;stroke-dashoffset:1.035;animation:run 3.2s linear infinite}
.out .sig path{animation-delay:1.1s}
@keyframes run{0%{stroke-dashoffset:1.035}55%,100%{stroke-dashoffset:0}}
.asker{position:absolute;left:40px;bottom:16px;text-align:left;white-space:nowrap;transition:opacity .4s}
.asker .k{display:block;font:500 11px/1 var(--sans);letter-spacing:.12em;text-transform:uppercase;color:var(--t3)}
.asker .who{display:block;margin-top:8px;font:500 17px/1.2 var(--sans)}
.asker .q{display:block;margin-top:4px;font-size:14px;color:var(--t2)}
.o{position:absolute;right:40px;font:500 12px/1 var(--sans);color:var(--t2);font-variant-numeric:tabular-nums;transition:opacity .4s}
.o1{top:4px}.o2{top:84px}.o3{top:164px}
.fade{opacity:0}
h1{position:relative;z-index:2;margin-top:-44px;font:400 80px/1 var(--serif);font-variation-settings:"opsz" 72;letter-spacing:-.02em}
.sub{max-width:580px;margin-top:22px;font-size:17px;color:var(--t2)}
.cta{display:flex;gap:12px;margin-top:28px}
.peek{margin:0 24px;background:var(--panel);border-radius:28px 28px 0 0;display:flex;justify-content:space-between;padding:12px 40px 0}
.peek b{font:400 26px/1 var(--serif)}
.peek span{font-size:13px;color:rgba(255,255,255,.82);padding-top:7px}
@media (prefers-reduced-motion:reduce){.sig{display:none}}
</style></head>
<body>
<header class="nav">
  <a class="brand" href="/"><svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true"><path d="M19.6 4.2A11 11 0 1 0 23.2 16.4" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><path d="M21.5 1l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" fill="#fff"/></svg>SEER</a>
  <nav class="links"><a href="#apps">Apps</a><a href="#protocol">Protocol</a><a href="https://seer-3.gitbook.io">Docs</a><a href="/blog">Blog</a></nav>
  <a class="pill pri" href="https://app.seer.pm">Launch App</a>
</header>
<main class="hero">
  <div class="node">
    <div class="in" aria-hidden="true">
      <svg viewBox="0 0 100 4" preserveAspectRatio="none"><g class="ln"><path d="M0 2H100"/></g><g class="sig"><path pathLength="1" d="M0 2H100"/></g></svg>
      <div class="asker" id="asker"><span class="k">Asked by</span><span class="who" id="who">A DAO</span><span class="q" id="q">Will GNO be worth more if GIP-31 passes?</span></div>
    </div>
    <div class="out" aria-hidden="true">
      <svg viewBox="0 0 544 200" preserveAspectRatio="none">
        <g class="ln">
          <path d="M0 100C80 100 80 20 180 20H544"/><path d="M0 100C80 100 80 40 180 40H544"/><path d="M0 100C80 100 80 60 180 60H544"/><path d="M0 100C80 100 80 80 180 80H544"/><path d="M0 100H544"/><path d="M0 100C80 100 80 120 180 120H544"/><path d="M0 100C80 100 80 140 180 140H544"/><path d="M0 100C80 100 80 160 180 160H544"/><path d="M0 100C80 100 80 180 180 180H544"/>
        </g>
        <g class="sig">
          <path pathLength="1" d="M0 100C80 100 80 20 180 20H544"/><path pathLength="1" d="M0 100C80 100 80 60 180 60H544"/><path pathLength="1" d="M0 100H544"/><path pathLength="1" d="M0 100C80 100 80 140 180 140H544"/><path pathLength="1" d="M0 100C80 100 80 180 180 180H544"/>
        </g>
      </svg>
      <span class="o o1" id="o1">Pass, GNO at $214</span><span class="o o2" id="o2">Fail, GNO at $198</span><span class="o o3" id="o3">The DAO still votes</span>
    </div>
    <canvas id="c" aria-label="Seer raven drawn in white dots" role="img"></canvas>
  </div>
  <h1>Where agents ask<br>and markets answer.</h1>
  <p class="sub">Information Finance infrastructure for the agentic economy. People and AI agents post what they need to know, traders price every outcome, and anyone can read the signal.</p>
  <div class="cta"><a class="pill pri" href="https://app.seer.pm/create-market">Ask Seer</a><a class="pill sec" href="https://seer-3.gitbook.io">Build with agents</a></div>
</main>
<section class="peek" id="apps"><b>Five apps. One protocol underneath.</b><span>Deep: an agent forecasts how reviewers will score 64 proposals</span></section>
<script>
/*LOGO_DOTS*/
(function(){
var cv=document.getElementById('c'),g=cv.getContext('2d');
var D=(typeof LOGO!=='undefined')?LOGO:demo();
function demo(){var p=[],i,a;for(i=0;i<1400;i++){a=i/1400*6.2832;p.push([380+Math.cos(a)*340,420+Math.sin(a)*340]);}return{w:844,h:864,pts:p};}
function hs(n){n=Math.imul(n^61^(n>>>16),9);n^=n>>>4;n=Math.imul(n,0x27d4eb2d);return((n^(n>>>15))>>>0)/4294967296;}
var P=D.pts.map(function(p,i){var a=hs(i+1),b=hs(i*7+3);return{x:p[0],y:p[1],z:a<.5?0:a<.85?1:2,k:.7+b*.6,ph:b*6.2832,sp:.25+a*.5};});
var W,H,s,ox,oy,R,still=matchMedia('(prefers-reduced-motion: reduce)').matches,AL=[.4,.72,1],SZ=[.55,.85,1.25];
function fit(){var r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=Math.round(W*d);cv.height=Math.round(H*d);s=Math.min(W/D.w,H/D.h);ox=(W-D.w*s)/2;oy=(H-D.h*s)/2;R=Math.max(.7,W/320);g.setTransform(d,0,0,d,0,0);}
function draw(t){t/=1000;g.clearRect(0,0,W,H);g.fillStyle='#fff';
for(var z=0;z<3;z++){var amp=.6+z*.7;g.globalAlpha=AL[z];g.beginPath();
for(var i=0;i<P.length;i++){var p=P[i];if(p.z!==z)continue;
var x=ox+p.x*s+Math.sin(t*p.sp+p.ph+p.y*.01)*amp,y=oy+p.y*s+Math.cos(t*p.sp*.8+p.ph+p.x*.01)*amp,r=R*SZ[z]*p.k;
g.moveTo(x+r,y);g.arc(x,y,r,0,6.2832);}g.fill();}
g.globalAlpha=1;if(!still)requestAnimationFrame(draw);}
fit();addEventListener('resize',function(){fit();if(still)draw(0);});requestAnimationFrame(draw);

var A=[
 {w:'A DAO',q:'Will GNO be worth more if GIP-31 passes?',o:['Pass, GNO at $214','Fail, GNO at $198','The DAO still votes']},
 {w:'A grant committee',q:'Which of 40 submissions will reviewers select?',o:['Submission 12, 38%','Submission 7, 22%','Reviewers keep the final say']},
 {w:'A lending protocol',q:'Will this vault avoid an exploit through 2027?',o:['Survives Q1, 98%','Survives 2027, 91%','Compared across protocols']},
 {w:'An AI agent',q:'How will humans score 64 grant proposals?',o:['64 outcomes priced','Top decile, 7 proposals','Read by agents and people']}
],n=0,ids=['asker','o1','o2','o3'].map(function(k){return document.getElementById(k);});
if(!still)setInterval(function(){
 ids.forEach(function(e){e.classList.add('fade');});
 setTimeout(function(){n=(n+1)%A.length;var a=A[n];
  document.getElementById('who').textContent=a.w;document.getElementById('q').textContent=a.q;
  ids[1].textContent=a.o[0];ids[2].textContent=a.o[1];ids[3].textContent=a.o[2];
  ids.forEach(function(e){e.classList.remove('fade');});},400);
},3200);
})();
</script>
</body></html>
```
