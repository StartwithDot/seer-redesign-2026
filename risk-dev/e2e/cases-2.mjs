await run('16 nav-participate scrolls to participate panel', async () => {
  await go('/');
  await id('nav-participate').click();
  await poll(async () => id('panel-participate').evaluate((el) => {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }));
});

await run('17 nav-overtime activates time view with chart', async () => {
  await go('/');
  await id('nav-overtime').click();
  await poll(async () => (await id('view-time').getAttribute('aria-pressed')) === 'true');
  await poll(async () => await id('hero-visual').isVisible());
});

await run('18 nav-overview returns to top of page', async () => {
  await go('/');
  await page.evaluate(() => window.scrollTo(0, 2500));
  await poll(async () => (await page.evaluate(() => window.scrollY)) > 100);
  await id('nav-overview').click();
  await poll(async () => (await page.evaluate(() => window.scrollY)) < 5);
});

await run('20 header Guide modal opens and closes via close button', async () => {
  await go('/');
  await id('btn-guide').click();
  await poll(async () => await id('modal-guide').isVisible());
  await id('modal-guide').locator('[data-testid="btn-modal-close"]').click();
  await poll(async () => !(await id('modal-guide').isVisible()));
});

await run('21 header Email modal opens and closes', async () => {
  await go('/');
  await id('btn-email').click();
  await poll(async () => await id('modal-email').isVisible());
  await id('modal-email').locator('[data-testid="btn-modal-close"]').click();
  await poll(async () => !(await id('modal-email').isVisible()));
});

await run('22 header Connect modal opens', async () => {
  await go('/');
  await page.locator('.sg-connect').click();
  await poll(async () => await id('modal-connect').isVisible());
  await page.keyboard.press('Escape');
  await poll(async () => !(await id('modal-connect').isVisible()));
});

await run('23 help menu exposes 6 external links', async () => {
  await go('/');
  await id('btn-help').click();
  for (let i = 1; i <= 6; i += 1) {
    const item = id(`help-item-${i}`);
    await poll(async () => await item.isVisible());
    const href = await item.getAttribute('href');
    assert.ok(href && href.trim().length > 4, `help item ${i} href was ${href}`);
    const target = await item.getAttribute('target');
    assert.equal(target, '_blank', `help item ${i} target was ${target}`);
  }
});

await run('24 theme toggle flips document theme', async () => {
  await go('/');
  const read = () => page.evaluate(() => {
    const el = document.documentElement;
    return (el.dataset && el.dataset.theme) || el.className || '';
  });
  const initial = await read();
  await page.locator('.sg-theme').click();
  await poll(async () => (await read()) !== initial);
  const after = await read();
  assert.notEqual(after, initial);
  await page.locator('.sg-theme').click();
  await poll(async () => (await read()) === initial);
});

await run('25 tab-q4 is disabled', async () => {
  await go('/');
  await poll(async () => {
    const el = id('tab-q4');
    if (await el.isDisabled()) return true;
    if ((await el.getAttribute('aria-disabled')) === 'true') return true;
    return (await el.getAttribute('disabled')) !== null;
  });
  await id('tab-q3').click();
  await poll(async () => (await id('tab-q4').getAttribute('aria-disabled')) !== 'false');
});

await run('26 credora drawer for weeth shows ratings and closes', async () => {
  await go('/');
  if (/expand/i.test(await id('btn-expand-all').innerText())) await id('btn-expand-all').click(); await id('asset-row-weeth').click();
  await id('asset-details-weeth').click();
  await id('drawer-credora').waitFor({ state: 'visible' });
  assert.match((await id('credora-grade').textContent()).trim(), /^A\+$/);
  assert.match((await id('credora-category').textContent()).trim(), /Derivative - Liquid Restaking/);
  assert.match((await id('credora-avg').textContent()).trim(), /4\.57/);
  assert.match((await id('credora-consensus').textContent()).trim(), /0\.09/);
  assert.match((await id('credora-market').textContent()).trim(), /0\.091/);
  assert.match(await id('link-credora').getAttribute('href'), /app\.credora\.network\/assets\/eeth/);
  assert.match(await id('link-etherscan').getAttribute('href'), /etherscan\.io\/address\//);
  await id('btn-drawer-close').click();
  await poll(async () => !(await id('drawer-credora').isVisible().catch(() => false)), 3000);
  await id('asset-details-weeth').click();
  await id('drawer-credora').waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  await poll(async () => !(await id('drawer-credora').isVisible().catch(() => false)), 3000);
});

await run('27 nusd drawer shows special credora message', async () => {
  await go('/');
  if (/expand/i.test(await id('btn-expand-all').innerText())) await id('btn-expand-all').click(); await id('asset-row-nusd').click();
  await id('asset-details-nusd').click();
  await id('drawer-credora').waitFor({ state: 'visible' });
  assert.equal((await id('credora-special').textContent()).trim(), 'Metric breakdown not published by Credora yet.');
  await id('btn-drawer-close').click();
});

await run('28 lbtc drawer shows special credora message', async () => {
  await go('/');
  if (/expand/i.test(await id('btn-expand-all').innerText())) await id('btn-expand-all').click(); await id('asset-row-lbtc').click();
  await id('asset-details-lbtc').click();
  await id('drawer-credora').waitFor({ state: 'visible' });
  assert.equal((await id('credora-special').textContent()).trim(), "Credora hasn't published a risk rating for this asset yet.");
  await id('btn-drawer-close').click();
});

await run('29 panel group filters isolate eth funds and all', async () => {
  await go('/');
  if (/expand/i.test(await id('btn-expand-all').innerText())) await id('btn-expand-all').click();
  await id('panel-filter-eth').click();
  await poll(async () => (await id('asset-row-weeth').isVisible()) && !(await id('asset-row-usdc').isVisible()), 3000);
  await id('panel-filter-funds').click();
  await poll(async () => await id('asset-row-jaaa').isVisible(), 3000);
  await id('panel-filter-all').click();
  await poll(async () => (await id('asset-row-weeth').isVisible()) && (await id('asset-row-usdc').isVisible()), 3000);
});

await run('30 nav tabs live in header and active underline follows scroll', async () => {
  await go('/');
  for (const t of ['overview', 'assets', 'overtime', 'participate']) assert.equal(await page.locator(`header [data-testid="nav-${t}"]`).count(), 1);
  assert.equal(await page.locator('[data-testid="nav-guide"]').count(), 0);
  await poll(async () => (await id('nav-overview').getAttribute('aria-current')) === 'page');
  await id('nav-assets').click();
  await poll(async () => (await id('nav-assets').getAttribute('aria-current')) === 'page');
  await id('nav-overtime').click();
  await poll(async () => (await id('nav-overtime').getAttribute('aria-current')) === 'page');
});

await run('31 participate panel stays fixed while the page scrolls', async () => {
  await go('/');
  const top = () => id('panel-participate').evaluate((el) => Math.round(el.getBoundingClientRect().top));
  const before = await top();
  await page.evaluate(() => window.scrollTo(0, 1200));
  await poll(async () => (await page.evaluate(() => window.scrollY)) > 800);
  const after = await top();
  assert.ok(Math.abs(after - 120) <= 2 && before >= 60, `panel top ${before} -> ${after}`);
  assert.ok(await id('btn-connect-predict').isVisible());
  assert.ok(await id('btn-download-csv').isVisible());
});

await run('32 assets tiles are dense: >=5 per row at 1440', async () => {
  await go('/');
  await id('section-assets').getByRole('button', {name:'Tiles',exact:true}).click();
  const tops = await page.locator('[data-testid^="asset-tile-"]').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top + window.scrollY)));
  assert.equal(tops.length, 33);
  const firstRow = tops.filter((t) => t === tops[0]).length;
  assert.ok(firstRow >= 5, `tiles in first row ${firstRow}`);
  await id('asset-tile-weeth').getByRole('button', { name: /Credora details/ }).click();
  await id('drawer-credora').waitFor({ state: 'visible' });
  await id('btn-drawer-close').click();
});

