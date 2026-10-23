import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.env.DEEP_QA_URL ?? 'http://127.0.0.1:5188';
const output = process.env.DEEP_QA_OUTPUT ?? '/tmp/deep-pass10-shots';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = [];
const account = `0x${'1'.repeat(40)}`;
try {
  for (const theme of ['light', 'dark']) for (const width of [1440, 1024, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(({ theme, account }) => {
      localStorage.setItem('seer-theme', theme);
      window.ethereum = { request: async ({ method, params }) => {
        if (method === 'eth_accounts' || method === 'eth_requestAccounts') return [account];
        if (method === 'eth_chainId') return '0xa';
        if (method === 'eth_blockNumber') return '0x100';
        if (method === 'eth_call') {
          const token = params[0].to.toLowerCase();
          const balance = token === '0x0b2c639c533813f4aa9d7837caf62653d097ff85' ? 123450000n
            : token === '0xb5b2dc7fd34c249f4be7fb1fcea07950784229e0' ? 1000000000000000000n : 0n;
          return `0x${balance.toString(16).padStart(64, '0')}`;
        }
        throw new Error(`Unexpected wallet request: ${method}`);
      } };
    }, { theme, account });
    const capture = async name => {
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, name);
      await page.screenshot({ path: path.join(output, `${width}-${theme}-${name}.png`), fullPage: true });
    };
    await page.goto(`${base}/deep`);
    await page.getByRole('heading', { name: 'How has the market moved?' }).waitFor();
    await page.getByRole('button', { name: /0x1111/ }).waitFor();
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
    await capture('field');
    if (width === 390) {
      await page.getByRole('navigation', { name: 'Mobile Deep sections' }).getByRole('button', { name: 'List', exact: true }).click();
      assert.ok(await page.getByRole('complementary', { name: 'Repository markets' }).isVisible());
      assert.ok(!(await page.locator('figure.deep-field').isVisible()));
      assert.match(page.url(), /workspace=list/);
      await capture('list');
      await page.getByRole('navigation', { name: 'Mobile Deep sections' }).getByRole('button', { name: 'Desk', exact: true }).click();
    }
    await page.getByRole('tab', { name: 'Funds', exact: true }).click();
    await page.getByText('123.45', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Read holdings', exact: true }).click();
    await page.getByText('No UP or DOWN tokens held across these 98 markets.', { exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Sell All to sUSDS', exact: true }).isDisabled(), true);
    await page.getByRole('button', { name: 'Expand funds', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Funds', exact: true });
    await dialog.waitFor();
    assert.equal(await page.locator('#root').evaluate(root => root.inert), true);
    assert.equal(await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]'))), true);
    await dialog.getByRole('button', { name: 'Deposit', exact: true }).click();
    await dialog.getByLabel('Deposit sUSDS', { exact: true }).fill('2');
    await dialog.getByLabel('Deposit sUSDS', { exact: true }).blur();
    await dialog.getByText('Amount exceeds the available 1.00 balance.', { exact: true }).waitFor();
    assert.equal(await dialog.getByRole('button', { name: 'Deposit sUSDS', exact: true }).isDisabled(), true);
    await capture('funds');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    assert.equal(await page.locator('#root').evaluate(root => root.inert), false);
    await page.getByRole('button', { name: `Use ${theme === 'light' ? 'dark' : 'light'} theme` }).click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme === 'light' ? 'dark' : 'light');
    await page.getByRole('button', { name: `Use ${theme} theme` }).click();
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
    for (const route of ['/deep/leaderboard', '/deep/contests', '/deep/contests/zcash-grants', '/deep/repo/ethereum/py_ecc']) {
      await page.goto(`${base}${route}`);
      await page.locator('#deep-main h1').waitFor();
      await capture(route.split('/').slice(2).join('-'));
    }
    assert.deepEqual(errors, []);
    report.push({ theme, width, errors });
    await page.close();
  }
  await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(`Browser verification passed. Captures: ${output}`);
} finally { await browser.close(); }
