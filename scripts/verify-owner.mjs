// node scripts/verify-owner.mjs  -> PASS/FAIL per owner item, both products, plus light/dark screenshots in shots/vo
import { chromium } from '/Users/leo/Documents/POIDH/node_modules/playwright-core/index.mjs';
import fs from 'node:fs'; fs.mkdirSync('shots/vo', { recursive: true });
const b = await chromium.launch({ channel: 'chrome' });
const res = []; const ok = (n, v, d = '') => res.push(`${v ? 'PASS' : 'FAIL'}  ${n}${d ? '  [' + d + ']' : ''}`);
const mk = async (path, theme = 'dark', w = 1440, h = 900) => {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errs = []; p.errs = errs; p.on('pageerror', (e) => errs.push(String(e).slice(0, 100))); p.on('console', (m) => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text().slice(0, 100)); });
  await p.addInitScript((t) => { try { localStorage.setItem('seer.theme', t); } catch (e) { } }, theme);
  await p.goto('http://127.0.0.1:5188' + path); await p.waitForTimeout(4200); return p;
};
const fr = (p, k) => p.frames().find((f) => f.url().includes(k));

/* ---------- SEER APP ---------- */
for (const theme of ['dark', 'light']) {
  const p = await mk('/explorer?v=2', theme); const f = fr(p, 'explorer-v2');
  await p.screenshot({ path: `shots/vo/seer_home_${theme}.png` });
  if (theme === 'dark') {
    ok('Seer: no Agent switch', (await f.locator('[data-mode="agent"]').count()) === 0);
    ok('Seer: no Deep/Opportunity/Risk chips', (await f.locator('.scope-row button:has-text("Deep"), .scope-row button:has-text("Opportunity"), .scope-row button:has-text("Risk")').count()) === 0);
    const txt = await f.evaluate(() => document.body.innerText);
    ok('Seer: no snapshot/demo wording on page', !/snapshot|demo orders|Captured market/i.test(txt), (txt.match(/snapshot[^\n]{0,30}|demo orders|Captured market[^\n]{0,20}/i) || [''])[0]);
    ok('Seer: heading "Seer App"', /Seer App/.test(await f.evaluate(() => document.querySelector('h1')?.innerText || '')));
    // banner click -> market page
    await f.locator('.spot').first().click({ timeout: 4000 }).catch(() => { }); await p.waitForTimeout(1500);
    ok('Seer: banner click opens market page', /#\/market\//.test(await f.evaluate(() => location.hash)), await f.evaluate(() => location.hash));
    await f.evaluate(() => { location.hash = '#/'; }); await p.waitForTimeout(1200);
    // map view
    const t0 = Date.now(); await f.locator('[data-view="map"]').first().click({ timeout: 4000 }).catch(() => { });
    let alive = true; try { await Promise.race([f.evaluate(() => 1), new Promise((_, r) => setTimeout(() => r('hang'), 6000))]); } catch { alive = false; }
    ok('Seer: Map view does not freeze', alive, (Date.now() - t0) + 'ms');
    if (alive) { await p.waitForTimeout(800); await p.screenshot({ path: 'shots/vo/seer_map.png' }); await f.locator('[data-view="tiles"]').first().click().catch(() => { }); }
    // asker filter removal
    await f.evaluate(() => { location.hash = '#/?asker=0xaa36'; }); await p.waitForTimeout(1200);
    const tag = f.locator('.filter-tag').first(); const hadTag = await tag.count();
    if (hadTag) { await tag.click().catch(() => { }); await p.waitForTimeout(800); }
    ok('Seer: asker tag removable', hadTag === 0 ? true : (await f.locator('.filter-tag').count()) === 0 && !/asker=/.test(await f.evaluate(() => location.hash)), 'tag shown: ' + hadTag);
    // trade window
    await f.evaluate(() => { location.hash = '#/'; }); await p.waitForTimeout(1000);
    await f.locator('button:has-text("Buy Yes")').first().click({ timeout: 4000 }).catch(() => { }); await p.waitForTimeout(1200);
    const tw = await f.evaluate(() => { const t = document.querySelector('.unified-ticket') || document.querySelector('.ix-panel'); const s = t ? t.innerText : ''; return { cents: /¢/.test(s), fullPage: (s.match(/Full page/gi) || []).length, reports: /Reports? open|Reporting/i.test(s) }; });
    ok('Seer: trade window no ¢ symbol', !tw.cents); ok('Seer: trade window no bottom "Full page" buttons', tw.fullPage === 0, 'count ' + tw.fullPage); ok('Seer: trade window no Reports/Reporting labels', !tw.reports);
    await p.screenshot({ path: 'shots/vo/seer_trade_dark.png' });
  } else {
    await f.locator('button:has-text("Buy Yes")').first().click({ timeout: 4000 }).catch(() => { }); await p.waitForTimeout(1200); await p.screenshot({ path: 'shots/vo/seer_trade_light.png' });
    await f.locator('[data-view="table"]').first().click().catch(() => { }); await p.waitForTimeout(900); await p.screenshot({ path: 'shots/vo/seer_index_light.png' });
  }
  ok(`Seer(${theme}): no console errors`, p.errs.length === 0, p.errs[0] || ''); await p.close();
}

/* ---------- DEEP ---------- */
for (const theme of ['dark', 'light']) {
  const p = await mk('/deep?v=2', theme); const f = fr(p, 'deep-v2');
  await p.screenshot({ path: `shots/vo/deep_home_${theme}.png` });
  if (theme === 'dark') {
    // scroll down then up with the wheel over the left area
    await p.mouse.move(500, 500);
    for (let i = 0; i < 14; i++) { await p.mouse.wheel(0, 400); await p.waitForTimeout(60); }
    await p.waitForTimeout(500); const down = await f.evaluate(() => (document.scrollingElement.scrollTop || 0) + (document.querySelector('.workspace-scroll')?.scrollTop || 0) + (document.querySelector('main')?.scrollTop || 0));
    for (let i = 0; i < 30; i++) { await p.mouse.wheel(0, -400); await p.waitForTimeout(60); }
    await p.waitForTimeout(500); const up = await f.evaluate(() => (document.scrollingElement.scrollTop || 0) + (document.querySelector('.workspace-scroll')?.scrollTop || 0) + (document.querySelector('main')?.scrollTop || 0));
    ok('Deep: can scroll down', down > 300, 'down=' + down); ok('Deep: can scroll back to top', up < 40, 'up=' + up);
    // expand popup
    await f.locator('button:has-text("Expand")').first().click({ timeout: 4000 }).catch(() => { }); await p.waitForTimeout(1200);
    const modal = await f.evaluate(() => { const d = document.querySelector('dialog[open], [role=dialog]'); if (!d) return null; const r = d.getBoundingClientRect(); return { w: r.width | 0, h: r.height | 0, left: r.left | 0 }; });
    ok('Deep: Expand opens a centred popup', !!modal && modal.w > 700 && modal.left > 20, JSON.stringify(modal)); await p.screenshot({ path: 'shots/vo/deep_expand.png' });
    await p.keyboard.press('Escape'); await p.waitForTimeout(700);
    ok('Deep: Esc closes popup', !(await f.evaluate(() => !!document.querySelector('dialog[open]'))));
    // chart types / all repos
    ok('Deep: chart-type switch (Lines / Rank flow / Heatmap)', (await f.locator('button:has-text("Heatmap")').count()) > 0 && (await f.locator('button:has-text("Lines")').count()) > 0);
    await f.locator('button:has-text("Heatmap")').first().click().catch(() => { }); await p.waitForTimeout(1500); await p.screenshot({ path: 'shots/vo/deep_heatmap.png' });
    // left menu
    ok('Deep: left section menu present', (await f.locator('nav[aria-label*="ection"], .side-menu, .section-rail, aside nav').count()) > 0);
    // leaderboard exit
    await f.locator('.sb-tab:has-text("Leaderboard")').first().click().catch(() => { }); await p.waitForTimeout(1500);
    await f.locator('.podium-place, [class*=podium] a, [class*=podium] button').first().click({ timeout: 3000 }).catch(() => { }); await p.waitForTimeout(900);
    const back = await f.locator('button:has-text("All leaders"), button:has-text("Back"), button[aria-label*="lose"]').count();
    ok('Deep: leaderboard has exit/back after selecting a leader', back > 0, 'controls ' + back); await p.screenshot({ path: 'shots/vo/deep_leader_selected.png' });
  } else {
    await f.locator('.repository-row').nth(2).click().catch(() => { }); await p.waitForTimeout(800); await p.screenshot({ path: 'shots/vo/deep_light_selected.png' });
  }
  ok(`Deep(${theme}): no console errors`, p.errs.length === 0, p.errs[0] || ''); await p.close();
}
await b.close(); console.log(res.join('\n'));
