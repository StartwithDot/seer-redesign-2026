await run('00 guide opens only on click', async () => {
 await go();assert.equal(await page.locator('dialog[open]').count(),0);assert(await page.evaluate(()=>!['hidden','clip'].includes(getComputedStyle(document.body).overflow)));await id('btn-guide').click();await poll(()=>id('modal-guide').isVisible());assert.equal(await id('modal-guide').getByRole('button',{name:'Close',exact:true}).count(),1);await page.keyboard.press('Escape');await poll(async()=>!(await id('modal-guide').isVisible()));await page.reload();assert.equal(await page.locator('dialog[open]').count(),0);
});
await run('01 default headline shows 46.52 and 82.59', async () => {
  await go('/');
  await poll(async () => (await id('headline-ann').innerText()).includes('46.52'));
  await poll(async () => (await id('headline-quart').innerText()).includes('82.59'));
  assert.match((await id('headline-ann').innerText()).replace(/\s+/g, ' '), /46\.52/);
  assert.match((await id('headline-quart').innerText()).replace(/\s+/g, ' '), /82\.59/);
  await poll(async () => /30 September 2026/i.test(await id('trading-period').innerText()));
  await poll(async () => /Ended/i.test(await id('countdown').innerText()));
});

await run('02 group chips show counts 33/7/13/6/7', async () => {
  await go('/');
  const txt = async (t) => (await id(t).innerText()).replace(/\s+/g, ' ').trim();
  await poll(async () => /33/.test(await txt('chip-all')));
  assert.match(await txt('chip-all'), /33/);
  assert.match(await txt('chip-eth'), /7/);
  assert.match(await txt('chip-usd'), /13/);
  assert.match(await txt('chip-btc'), /6/);
  assert.match(await txt('chip-funds'), /7/);
});

await run('03 chip-eth selects exactly 7 pills', async () => {
  await go('/');
  const selected = page.locator('[data-testid^="matrix-dot-"]');
  await id('chip-eth').click();
  await poll(async () => (await selected.count()) === 7);
  assert.equal(await selected.count(), 7);
  await poll(async () => (await id('chip-eth').getAttribute('aria-pressed')) === 'true');
});

await run('04 chip-all selects all 33 pills', async () => {
  await go('/');
  const selected = page.locator('[data-testid^="matrix-dot-"]');
  await id('chip-eth').click();
  await poll(async () => (await selected.count()) === 7);
  await id('chip-all').click();
  await poll(async () => (await selected.count()) === 33);
  assert.equal(await selected.count(), 33);
  await poll(async () => (await id('chip-all').getAttribute('aria-pressed')) === 'true');
});

await run('05 clear all empties chart with empty-state text', async () => {
  await go('/');
  if (!(await id('btn-clear-all').isVisible())) await page.getByRole('button', {name: /^Assets \d/}).click();
  await id('btn-clear-all').click();
  const selected = page.locator('[data-testid^="matrix-dot-"]');
  await poll(async () => (await selected.count()) === 0);
  await poll(async () => await id('empty-state').isVisible());
  const t = (await id('empty-state').innerText()).replace(/[\u2013\u2014]/g, '-').replace(/\s+/g, ' ').trim();
  assert.ok(t.includes('No assets selected - pick a category or asset above to plot it.'), `empty state text was: ${t}`);
});

await run('06 select all restores 33 pills', async () => {
  await go('/');
  const selected = page.locator('[data-testid^="matrix-dot-"]');
  if (!(await id('btn-clear-all').isVisible())) await page.getByRole('button', {name: /^Assets \d/}).click();
  await id('btn-clear-all').click();
  await poll(async () => (await selected.count()) === 0);
  await poll(async () => /select all/i.test(await id('btn-clear-all').innerText()));
  if (!(await id('btn-clear-all').isVisible())) await page.getByRole('button', {name: /^Assets \d/}).click();
  await id('btn-clear-all').click();
  await poll(async () => (await selected.count()) === 33);
  assert.equal(await selected.count(), 33);
});

await run('07 pill toggling from empty state adds assets', async () => {
  await go('/');
  const selected = page.locator('[data-testid^="matrix-dot-"]');
  if (!(await id('btn-clear-all').isVisible())) await page.getByRole('button', {name: /^Assets \d/}).click();
  await id('btn-clear-all').click();
  await poll(async () => (await selected.count()) === 0);
  await id('pill-usdc').click();
  await poll(async () => (await selected.count()) === 1);
  await poll(async () => (await id('pill-usdc').getAttribute('aria-pressed')) === 'true');
  await id('pill-usdt').click();
  await poll(async () => (await selected.count()) === 2);
});

await run('08 aggregate slider edit exposes delta, count and actions', async () => {
  await go('/');
  await id('agg-slider').focus();
  await page.keyboard.press('ArrowLeft');
  await poll(async () => await id('agg-delta').isVisible());
  await poll(async () => /33 of 33/.test(await id('edited-count').innerText()));
  await poll(async () => await id('btn-reset').isVisible());
  await poll(async () => await id('btn-reset-predictions').isVisible());
  await poll(async () => await id('btn-export').isVisible());
});

await run('09 reset returns aggregate to 46.52 and 0 of 33', async () => {
  await go('/');
  await id('agg-slider').focus();
  await page.keyboard.press('ArrowLeft');
  await poll(async () => await id('agg-delta').isVisible());
  await poll(async () => await id('btn-reset').isVisible());
  await id('btn-reset').click();
  await poll(async () => (await id('agg-ann').innerText()).includes('46.52'));
  await poll(async () => /0 of 33/.test(await id('edited-count').innerText()));
  await poll(async () => !(await id('btn-reset-predictions').isVisible()));
});

await run('10 single asset slider edit updates count, delta and aggregate', async () => {
  await go('/');
  const before = (await id('agg-ann').innerText()).replace(/\s+/g, ' ');
  if (/expand/i.test(await id('btn-expand-all').innerText())) await id('btn-expand-all').click();
  await poll(async () => await id('asset-row-weeth').isVisible());
  if (/expand/i.test(await id('btn-expand-all').innerText())) await id('btn-expand-all').click(); await id('asset-row-weeth').click();
  await poll(async () => await id('asset-slider-weeth').isVisible());
  await id('asset-slider-weeth').focus();
  await page.keyboard.press('ArrowRight');
  await poll(async () => /1 of 33/.test(await id('edited-count').innerText()));
  await poll(async () => await id('asset-delta-weeth').isVisible());
  await page.keyboard.press('PageUp');
  await poll(async () => (await id('agg-ann').innerText()).replace(/\s+/g, ' ') !== before);
});

await run('11 export downloads predictions csv', async () => {
  await go('/');
  await id('agg-slider').focus();
  await page.keyboard.press('ArrowLeft');
  await poll(async () => await id('btn-export').isVisible());
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    id('btn-export').click(),
  ]);
  const name = download.suggestedFilename();
  assert.ok(name.startsWith('risk-pricing-predictions'), `filename was ${name}`);
  const stream = await download.createReadStream();
  let body = '';
  for await (const chunk of stream) body += chunk.toString();
  assert.equal(body.split(/\r?\n/)[0].trim(), 'asset,probability');
});

await run('12 csv modal opens and template download works', async () => {
  await go('/');
  await id('btn-upload-csv').click();
  await poll(async () => await id('modal-csv').isVisible());
  await poll(async () => await id('btn-csv-template').isVisible());
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    id('btn-csv-template').click(),
  ]);
  assert.ok(download.suggestedFilename().startsWith('risk-pricing-predictions'), download.suggestedFilename());
  const stream = await download.createReadStream();
  let body = '';
  for await (const chunk of stream) body += chunk.toString();
  assert.equal(body.split(/\r?\n/)[0].trim(), 'asset,probability');
  await id('modal-csv').locator('[data-testid="btn-modal-close"]').click();
  await poll(async () => !(await id('modal-csv').isVisible()));
});

await run('13 loading a valid csv marks 2 of 33 edited', async () => {
  await go('/');
  await id('btn-upload-csv').click();
  await poll(async () => await id('modal-csv').isVisible());
  await id('csv-file-input').setInputFiles({
    name: 'predictions.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('asset,probability\nLBTC,55%\nUSDF,30%'),
  });
  await id('btn-load-predictions').click();
  await poll(async () => /2 of 33/.test(await id('edited-count').innerText()));
  await poll(async () => await id('btn-export').isVisible());
});

await run('14 loading an invalid csv shows csv-error', async () => {
  await go('/');
  await id('btn-upload-csv').click();
  await poll(async () => await id('modal-csv').isVisible());
  await id('csv-file-input').setInputFiles({
    name: 'bad.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('foo,bar\nbaz,qux'),
  });
  await id('btn-load-predictions').click();
  await poll(async () => await id('csv-error').isVisible());
});

await run('15 nav-assets scrolls to assets section', async () => {
  await go('/');
  await id('nav-assets').click();
  await poll(async () => id('section-assets').evaluate((el) => {
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }));
});

