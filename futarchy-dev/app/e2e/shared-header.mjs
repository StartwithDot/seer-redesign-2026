import { chromium } from 'playwright-core';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
for (const [width, height] of [[1440, 900], [390, 844]]) {
  await page.setViewportSize({ width, height });
  for (const theme of ['dark', 'light']) {
    await page.addInitScript(theme => localStorage.setItem('seer.theme', theme), theme);
    await page.goto('http://localhost:8800/futarchy/');
    await page.waitForTimeout(1000);
    const layout = await page.evaluate(() => {
      const header = document.querySelector('#seer-global-header').getBoundingClientRect();
      const toolbar = document.querySelector('.site-header').getBoundingClientRect();
      return { theme: document.documentElement.dataset.theme, headerBottom: header.bottom, toolbarTop: toolbar.top, toolbarHeight: toolbar.height, overflow: document.documentElement.scrollWidth > innerWidth };
    });
    if (layout.theme !== theme || layout.headerBottom !== layout.toolbarTop || layout.toolbarHeight > 48 || layout.overflow) throw new Error(JSON.stringify(layout));
    await page.screenshot({ path: `apps/futarchy/e2e/out/shared-${width}-${theme}.png` });
    await page.locator('.sg-apps').click();
    await page.waitForTimeout(250);
    await page.screenshot({ path: `apps/futarchy/e2e/out/shared-${width}-${theme}-apps.png` });
    await page.locator('.sg-apps').click();
    await page.locator('.sg-theme').click();
    if (await page.evaluate(() => document.documentElement.dataset.theme) === theme) throw new Error('Theme did not change');
    await page.locator('.sg-connect').click();
    await page.getByRole('heading', { name: 'Connect a wallet' }).waitFor();
    await page.getByRole('button', { name: 'Use browser wallet' }).click();
    await page.getByRole('status').filter({ hasText: 'No browser wallet found' }).waitFor();
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await page.evaluate(() => window.scrollTo(0, 500));
    const top = await page.locator('.site-header').evaluate(el => el.getBoundingClientRect().top);
    if (top !== 56) throw new Error(`Sticky toolbar top: ${top}`);
    console.log(width, theme, layout);
  }
}
if (errors.length) throw new Error(errors.join('\n'));
await browser.close();
