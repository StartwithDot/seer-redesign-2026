import assert from 'node:assert/strict';

export async function checkMobileNavigation(page, url) {
  for (const width of [320, 390, 768, 1000]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto(`${url}#/m/eip-8363`);
    await page.locator('.market-workspace').waitFor();
    const location = page.url();
    const toggle = page.locator('.futarchy-menu-button');
    const menu = page.getByRole('navigation', { name: 'Mobile Futarchy destinations', exact: true });
    await toggle.focus();
    await toggle.press('ArrowDown');
    const items = menu.getByRole('button');
    await items.first().waitFor();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    assert.ok(await items.first().evaluate(node => node === document.activeElement));
    await page.keyboard.press('ArrowUp');
    assert.ok(await items.last().evaluate(node => node === document.activeElement));
    await page.keyboard.press('Home');
    assert.ok(await items.first().evaluate(node => node === document.activeElement));
    await page.keyboard.press('End');
    assert.ok(await items.last().evaluate(node => node === document.activeElement));
    await page.keyboard.press('Escape');
    await menu.waitFor({ state: 'hidden' });
    assert.equal(page.url(), location, 'Menu Escape must not invoke market Back');
    assert.ok(await toggle.evaluate(node => node === document.activeElement));

    await toggle.press('ArrowUp');
    assert.ok(await items.last().evaluate(node => node === document.activeElement));
    await page.keyboard.press('Tab');
    await menu.waitFor({ state: 'hidden' });
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    assert.equal(page.url(), location, 'Leaving the disclosure must not navigate');

    await toggle.click();
    await items.first().waitFor();
    await page.getByRole('button', { name: 'Search Futarchy', exact: true }).focus();
    await menu.waitFor({ state: 'hidden' });
    await toggle.click();
    await items.first().click();
    await page.locator('.explorer-page').waitFor();
    await menu.waitFor({ state: 'hidden' });

    await page.setViewportSize({ width, height: 240 });
    await toggle.click();
    await items.first().waitFor();
    const geometry = await menu.evaluate(node => {
      const rect = node.getBoundingClientRect();
      return { bottom: rect.bottom, viewport: innerHeight, scrollHeight: node.scrollHeight, height: node.clientHeight };
    });
    assert.ok(geometry.bottom <= geometry.viewport, 'Landscape navigation must stay in the viewport');
    assert.ok(geometry.scrollHeight > geometry.height, 'Short navigation must scroll to every destination');
    await items.last().focus();
    await page.keyboard.press('Escape');
    await menu.waitFor({ state: 'hidden' });
  }
  await page.setViewportSize({ width: 390, height: 844 });
}
