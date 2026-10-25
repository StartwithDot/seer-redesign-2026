await run('33 text contrast >= 4.5:1 in dark and light', async () => {
  await go('/');
  const audit = () => page.evaluate(() => {
    const parse = (c) => { const m = c.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m[3] ?? 1 }; };
    const lin = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; };
    const lum = ({ r, g, b }) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
    const over = (f, b) => ({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a), a: 1 });
    const bgOf = (el) => { const layers = []; for (let n = el; n; n = n.parentElement) { const c = parse(getComputedStyle(n).backgroundColor); if (c.a > 0) layers.push(c); if (c.a === 1) break; } let base = { r: 255, g: 255, b: 255, a: 1 }; for (const l of layers.reverse()) base = over(l, base); return base; };
    const bad = [];
    for (const el of document.body.querySelectorAll('*')) {
      if (el.closest('dialog,svg,[disabled],.sr,.metric-tip,select')) continue;
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!own) continue;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      const bg = bgOf(el), fg = over(parse(cs.color), bg);
      const [hi, lo] = [lum(fg), lum(bg)].sort((a, b) => b - a);
      const ratio = (hi + .05) / (lo + .05);
      if (ratio < 4.5) bad.push(`${el.tagName.toLowerCase()}.${el.className && el.className.baseVal === undefined ? el.className : ''} "${el.textContent.trim().slice(0, 18)}" ${ratio.toFixed(2)}`);
    }
    return bad;
  });
  for (const theme of ['dark', 'light']) {
    await page.evaluate((t) => { localStorage.setItem('risk2-theme', t); }, theme);
    await page.reload(); await page.waitForSelector('[data-testid="page-title"]'); await page.waitForTimeout(700);
    const bad = await audit();
    assert.deepEqual(bad, [], `${theme}: ${bad.join(' | ')}`);
  }
  await page.evaluate(() => localStorage.setItem('risk2-theme', 'dark'));
});

await run('34 toolbar and table group filters sync in both directions', async () => {
 await go('/');
 await id('chip-eth').click();
 assert.equal(await id('assets-filter-eth').getAttribute('aria-pressed'),'true');
 assert.equal(await page.locator('.asset-table tbody tr').count(),7);
 await id('assets-filter-btc').click();
 assert.equal(await id('chip-btc').getAttribute('aria-pressed'),'true');
 assert.equal(await page.locator('[data-testid^="matrix-dot-"]').count(),6);
});
await run('35 matrix dot count equals selected count', async () => {
 await go('/');
 for (const [group,count] of [['all',33],['eth',7],['usd',13],['btc',6],['funds',7]]) {
  await id(`chip-${group}`).click();
  await poll(async()=>await page.locator('[data-testid^="matrix-dot-"]').count()===count);
  await page.getByRole('button',{name:/^Assets \d/}).click();
  assert.equal(await page.locator('[role="option"][aria-selected="true"]').count(),count);
  await page.keyboard.press('Escape');
 }
});
await run('36 edited asset draws market-to-estimate arrow', async () => {
 await go('/');
 assert.equal(await id('matrix-estimate-weeth').count(),0);
 await id('asset-slider-weeth').focus();
 await page.keyboard.press('PageUp');
 await poll(()=>id('matrix-estimate-weeth').isVisible());
 assert.equal(await id('matrix-estimate-weeth').locator('[marker-end="url(#estimate-arrow)"]').count(),1);
 assert.match(await id('asset-delta-weeth').innerText(),/pp/);
 await id('btn-reset').click();
 await poll(async()=>await id('matrix-estimate-weeth').count()===0);
});
await run('37 table sorts and searches real asset rows', async () => {
 await go('/');
 await id('assets-sort').click();
 await page.getByRole('option',{name:'Name',exact:true}).click();
 const tickers=()=>page.locator('.asset-table .table-ticker').allTextContents();
 const names=await tickers();
 assert.deepEqual(names,[...names].sort((a,b)=>a.localeCompare(b)));
 await page.getByRole('button',{name:'Asset',exact:true}).click();
 assert.deepEqual(await tickers(),[...names].reverse());
 await page.getByRole('textbox',{name:'Search assets table',exact:true}).fill('weETH');
 assert.deepEqual(await tickers(),['weETH']);
 await page.getByRole('textbox',{name:'Search assets table',exact:true}).fill('no-such-asset');
 assert.equal(await page.locator('.asset-table tbody tr').count(),0);
 assert.equal(await page.locator('.table-empty').innerText(),'No assets found');
});
await run('38 table row opens matching Credora drawer', async () => {
 await go('/');
 await id('asset-tile-weeth').click();
 await id('drawer-credora').waitFor({state:'visible'});
 assert.equal(await page.locator('#drawer-title').innerText(),'weETH');
 assert.equal((await id('credora-grade').innerText()).trim(),'A+');
 await page.keyboard.press('Escape');
 await poll(async()=>!(await id('drawer-credora').isVisible()));
});

await run('39 sort menu is a custom listbox with keyboard support', async () => {
 await go('/');
 assert.equal(await page.locator('select').count(),0);
 await id('assets-sort').focus();
 await page.keyboard.press('ArrowDown');
 await poll(()=>page.getByRole('listbox',{name:'Sort assets'}).isVisible());
 await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');
 await poll(async()=>(await id('assets-sort').innerText()).includes('Name'));
 await id('assets-sort').click();await page.keyboard.press('Escape');
 await poll(async()=>await page.getByRole('listbox',{name:'Sort assets'}).count()===0);
 await id('assets-sort').click();await page.keyboard.type('gr');
 await page.keyboard.press('Enter');
 await poll(async()=>(await id('assets-sort').innerText()).includes('Grade'));
});
