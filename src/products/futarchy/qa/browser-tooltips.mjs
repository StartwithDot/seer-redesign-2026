import assert from 'node:assert/strict';

async function assertContained(page, tooltip) {
  const bounds = await tooltip.boundingBox();
  const viewport = page.viewportSize();
  assert.ok(bounds && viewport);
  assert.ok(bounds.x >= 0 && bounds.y >= 0, 'Explanation must remain inside the viewport');
  assert.ok(bounds.x + bounds.width <= viewport.width && bounds.y + bounds.height <= viewport.height, 'Explanation must not clip at viewport edges');
}

export async function checkTooltips(page, url) {
  for (const width of [320, 390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${url}#/`);
    const trigger = page.getByRole('button', { name: 'Read the verdict', exact: true });
    await trigger.scrollIntoViewIfNeeded();
    await trigger.hover();
    const explanation = page.getByRole('tooltip', { name: 'The ±1% corridor turns the impact into Include, Neutral or Exclude.', exact: true });
    await explanation.waitFor();
    await assertContained(page, explanation);
    await explanation.hover();
    assert.ok(await explanation.isVisible(), 'Explanation must remain readable under the pointer');
    await page.keyboard.press('Escape');
    await explanation.waitFor({ state: 'hidden' });
    assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
    await trigger.click();
    await explanation.waitFor();
    await trigger.click();
    await explanation.waitFor({ state: 'hidden' });

    await page.goto(`${url}#/m/eip-8363`);
    const metric = page.getByRole('button', { name: 'About TVL', exact: true });
    await metric.focus();
    const metricTip = page.getByRole('tooltip', { name: "Collateral currently supplied across the market's outcome pools.", exact: true });
    await metricTip.waitFor();
    await assertContained(page, metricTip);
    await metric.press('Escape');
    await metricTip.waitFor({ state: 'hidden' });
    assert.ok(await metric.evaluate(node => node === document.activeElement), 'Escape must preserve trigger focus');
    assert.ok(page.url().includes('/m/eip-8363'), 'Tooltip Escape must not navigate back');
    await metric.press('Tab');
    await metricTip.waitFor({ state: 'hidden' });
  }
}
