// usage: node scripts/qa-product.mjs <explorer|deep> [outDir=shots/qa]  -> prints JSON report, writes screenshots
import { chromium } from '/Users/leo/Documents/POIDH/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
const name = process.argv[2] || 'explorer'; const out = process.argv[3] || 'shots/qa'; fs.mkdirSync(out, { recursive: true });
const url = `http://127.0.0.1:5188/p/${name}-v2/index.html`;

const report = () => {
  const vis = (e) => { const r = e.getBoundingClientRect(), c = getComputedStyle(e); return r.width > 1 && r.height > 1 && c.visibility !== 'hidden' && c.display !== 'none' && +c.opacity > 0.05; };
  const d = (e) => (e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).slice(0, 2).join('.') : '') + (e.textContent ? ' "' + e.textContent.trim().replace(/\s+/g, ' ').slice(0, 24) + '"' : ''));
  const items = [];
  const all = [...document.querySelectorAll('body *')].filter((e) => !(e instanceof SVGElement && e.tagName !== 'svg') && vis(e));
  // 1 clipped by a hidden/clip ancestor
  for (const e of all.slice(0, 2500)) {
    const r = e.getBoundingClientRect(); let a = e.parentElement;
    while (a && a !== document.body) {
      const c = getComputedStyle(a);
      if (/auto|scroll/.test(c.overflowX + c.overflowY)) break;
      if (c.overflowX === 'hidden' || c.overflowX === 'clip' || c.overflowY === 'hidden' || c.overflowY === 'clip') {
        const ar = a.getBoundingClientRect();
        const inter = r.right > ar.left && r.left < ar.right && r.bottom > ar.top && r.top < ar.bottom;
        const ox = Math.max(r.right - ar.right, ar.left - r.left), oy = Math.max(r.bottom - ar.bottom, ar.top - r.top);
        const cutX = inter && (c.overflowX === 'hidden' || c.overflowX === 'clip') && ox > 3 && ox < r.width * 0.92;
        const cutY = inter && (c.overflowY === 'hidden' || c.overflowY === 'clip') && oy > 3 && oy < r.height * 0.92;
        if ((cutX || cutY) && (e.matches('button,a,input,select,svg,img,[role=button],b,strong,span,p,h1,h2,h3,td,th,li') && r.width < ar.width * 1.5)) { items.push({ kind: 'clipped', el: d(e), by: d(a), cutX: Math.round(ox), cutY: Math.round(oy) }); break; }
      }
      a = a.parentElement;
    }
  }
  // 2 icons escaping their button/chip
  for (const s of document.querySelectorAll('svg')) {
    if (!vis(s)) continue; const p = s.closest('button,a,[role=button],.chip,kbd,label'); if (!p || !vis(p)) continue;
    const r = s.getBoundingClientRect(), pr = p.getBoundingClientRect();
    if (r.left < pr.left - 1 || r.right > pr.right + 1 || r.top < pr.top - 1 || r.bottom > pr.bottom + 1) items.push({ kind: 'icon-outside', el: d(s), in: d(p) });
  }
  // 3 truncated controls
  for (const b of document.querySelectorAll('button,a,[role=button]')) if (vis(b) && b.scrollWidth > b.clientWidth + 3 && getComputedStyle(b).overflow !== 'visible' && getComputedStyle(b).textOverflow !== 'ellipsis') items.push({ kind: 'text-cut', el: d(b), over: b.scrollWidth - b.clientWidth });
  // 4 overlapping interactive elements
  const ui = [...document.querySelectorAll('button,a[href],input,select,textarea,[role=button],[role=tab]')].filter(vis).slice(0, 500);
  for (let i = 0; i < ui.length; i++) for (let j = i + 1; j < ui.length; j++) {
    const a = ui[i], b = ui[j]; if (a.contains(b) || b.contains(a)) continue;
    if ((a.tagName === 'path' && b.tagName === 'path') || (a.tagName === 'g' && b.tagName === 'path') || (a.tagName === 'path' && b.tagName === 'g')) { if (!(a.closest('.sb,.sg-header,header')||b.closest('.sb,.sg-header,header'))) continue; }
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left), h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
    if (w > 6 && h > 6 && w * h > 80) {
      const cx = Math.max(ra.left, rb.left) + w / 2, cy = Math.max(ra.top, rb.top) + h / 2; const top = document.elementFromPoint(cx, cy);
      if (top && (a.contains(top) || b.contains(top) || top === a || top === b)) items.push({ kind: 'overlap', a: d(a), b: d(b), px: Math.round(w) + 'x' + Math.round(h) });
    }
  }
  // 5 page-level horizontal overflow
  const de = document.documentElement; if (de.scrollWidth > de.clientWidth + 2) items.push({ kind: 'page-x-overflow', by: de.scrollWidth - de.clientWidth });
  const seen = new Set(); return items.filter((i) => { const k = JSON.stringify(i); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 18);
};

const states = {
  explorer: [
    ['home', async (f) => {}],
    ['quickbuy', async (f) => { await f.locator('button:has-text("Buy Yes")').first().click({ timeout: 4000 }).catch(() => {}); }],
    ['preview-buy', async (f) => { await f.locator('button:has-text("Preview buy")').first().click({ timeout: 4000 }).catch(() => {}); }],
    ['market-page', async (f) => { await f.evaluate(() => { const m = [...document.querySelectorAll('[data-id]')][0]; location.hash = '#/market/' + (m?.dataset.id || ''); }); }],
    ['agent-mode', async (f) => { await f.evaluate(() => { location.hash = '#/'; }); await f.locator('[data-mode="agent"]').first().click({ timeout: 4000 }).catch(() => {}); }],
    ['leaderboard', async (f) => { await f.evaluate(() => { location.hash = '#/leaderboard'; }); }],
  ],
  deep: [
    ['home', async (f) => {}],
    ['scrolled', async (f) => { await f.evaluate(() => document.querySelector('.workspace-scroll')?.scrollTo(0, 700)); }],
    ['desk-repository', async (f) => { await f.locator('.desk button:has-text("Repository")').first().click({ timeout: 4000 }).catch(() => {}); }],
    ['swarm', async (f) => { await f.locator('button:has-text("Swarm")').first().click({ timeout: 4000 }).catch(() => {}); }],
    ['leaderboard', async (f) => { await f.locator('button:has-text("Leaderboard"), a:has-text("Leaderboard")').first().click({ timeout: 4000 }).catch(() => {}); }],
    ['guide', async (f) => { await f.locator('button:has-text("Guide"), a:has-text("Guide")').first().click({ timeout: 4000 }).catch(() => {}); }],
  ],
};

const b = await chromium.launch({ channel: 'chrome' }); const result = {};
for (const [theme, w, h] of [['dark', 1440, 900], ['light', 1440, 900], ['dark', 1024, 800], ['dark', 390, 844]]) {
  for (const [sname, act] of states[name]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.addInitScript((t) => { try { localStorage.setItem('seer.theme', t); } catch (e) { } }, theme);
    const errs = []; p.on('pageerror', (e) => errs.push(String(e).slice(0, 110))); p.on('console', (m) => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text().slice(0, 110)); });
    try { await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(2600); await act(p); await p.waitForTimeout(1400); } catch (e) { errs.push('state-fail ' + String(e).slice(0, 80)); }
    const key = `${sname}@${w}${theme === 'light' ? 'L' : ''}`;
    result[key] = { findings: await p.evaluate(report).catch((e) => [{ kind: 'qa-error', msg: String(e).slice(0, 80) }]), errors: errs.slice(0, 3) };
    await p.screenshot({ path: `${out}/${name}_${key.replace('@', '_')}.png` });
    await p.close();
  }
}
await b.close();
let total = 0; for (const v of Object.values(result)) total += v.findings.length + v.errors.length;
console.log(JSON.stringify({ product: name, totalIssues: total, result }, null, 1));
