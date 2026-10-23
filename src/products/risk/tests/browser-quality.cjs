// Run against the existing Vite server: node src/products/risk/tests/browser-quality.cjs
// This suite records real pages only. Missing browser/server access is a failed gate.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { createRequire } = require('node:module');
const req = createRequire(path.resolve('../package.json'));
const { chromium } = req('playwright-core');
const origin = process.env.RISK_QA_ORIGIN || 'http://127.0.0.1:5188';
const output = path.resolve('src/products/risk/tests/browser-output');
const routes = ['/risk', '/risk/assets', '/risk/history', '/risk/predict', '/risk/asset/weeth'];
const widths = [320, 390, 768, 1024, 1440, 1920, 2560];
const results = [];
let browser;

async function ready(page) {
  await page.locator('.risk-shell').waitFor();
  await page.locator('.risk-data-skeleton').waitFor({ state: 'detached' });
  await page.evaluate(() => document.fonts.ready);
}

async function inspect(page, label) {
  const findings = await page.evaluate(() => {
    const visible = element => Boolean(element.getClientRects().length) && getComputedStyle(element).visibility !== 'hidden';
    const shell = document.querySelector('.risk-shell');
    const controls = [...shell.querySelectorAll('button, a, input, select, summary, [tabindex="0"]')].filter(visible);
    const unnamed = controls.filter(element => {
      if (element.matches('input,select')) return !element.labels?.length && !element.getAttribute('aria-label');
      return !element.textContent.trim() && !element.getAttribute('aria-label');
    }).map(element => element.outerHTML.slice(0, 240));
    const undersized = controls.filter(element => {
      if (element.matches('input[type="file"]')) return false;
      const rect = element.getBoundingClientRect();
      return rect.height < 39 || element.matches('button,input,select') && rect.width < 39;
    }).map(element => element.outerHTML.slice(0, 240));
    const deadLinks = [...shell.querySelectorAll('a')].filter(element => !element.href || element.getAttribute('href') === '#').map(element => element.outerHTML);
    return { overflow: document.documentElement.scrollWidth - window.innerWidth, unnamed, undersized, deadLinks,
      pageHeight: document.documentElement.scrollHeight, viewportHeight: window.innerHeight,
      theme: document.documentElement.dataset.theme, shellTheme: shell.dataset.theme };
  });
  results.push({ label, findings });
  assert(findings.pageHeight <= findings.viewportHeight * 2, `${label}: exceeds two viewports (${findings.pageHeight}px)`);
  assert(findings.overflow <= 1, `${label}: horizontal overflow ${findings.overflow}px`);
  assert.equal(findings.unnamed.length, 0, `${label}: unnamed controls ${findings.unnamed.join('\n')}`);
  assert.equal(findings.undersized.length, 0, `${label}: touch targets ${findings.undersized.join('\n')}`);
  assert.equal(findings.deadLinks.length, 0, `${label}: empty links`);
  assert.equal(findings.theme, findings.shellTheme, `${label}: theme mismatch`);
}

async function openRoute(page, route) {
  await page.goto(origin + route);
  await ready(page);
}

async function dialog(page, trigger, name) {
  await trigger.click();
  const panel = page.getByRole('dialog', { name, exact: true });
  await panel.waitFor();
  await panel.getByRole('button', { name: `Close ${name}`, exact: true }).focus();
  await page.keyboard.press('Shift+Tab');
  assert(await panel.evaluate(element => element.contains(document.activeElement)), `${name}: focus escaped`);
  await page.keyboard.press('Escape');
  await panel.waitFor({ state: 'detached' });
}

async function dialogFromTools(page, action, name) {
  await page.getByRole('button', { name: 'Tools', exact: true }).click();
  const tools = page.getByRole('dialog', { name: 'Risk tools', exact: true });
  await tools.waitFor();
  await tools.getByRole('button', { name: action, exact: true }).click();
  await tools.waitFor({ state: 'detached' });
  const panel = page.getByRole('dialog', { name, exact: true });
  await panel.waitFor();
  await page.keyboard.press('Escape');
  await panel.waitFor({ state: 'detached' });
}

async function exercise(page, mobile) {
  await openRoute(page, '/risk/assets');
  const search = page.getByRole('textbox', { name: 'Search assets' });
  await search.fill('USDC');
  await page.getByText('1 shown', { exact: false }).waitFor();
  assert(new URL(page.url()).searchParams.get('q') === 'USDC');
  const countBefore = await page.locator('.risk-explorer-actions > span').textContent();
  await page.getByRole('button', { name: 'Remove USDC focus', exact: true }).filter({ visible: true }).click();
  assert.notEqual(await page.locator('.risk-explorer-actions > span').textContent(), countBefore);
  await page.getByRole('button', { name: 'Add USDC focus', exact: true }).filter({ visible: true }).click();
  await page.getByRole('button', { name: 'USDC', exact: false }).filter({ visible: true }).first().click();
  const dossier = page.getByRole('dialog', { name: 'USDC asset dossier', exact: true });
  await dossier.waitFor();
  assert(new URL(page.url()).pathname === '/risk/asset/usdc');
  await dossier.getByRole('button', { name: 'Back to results', exact: false }).click();
  await dossier.waitFor({ state: 'detached' });
  assert(new URL(page.url()).searchParams.get('q') === 'USDC');
  await search.fill('NoSuchAsset');
  await page.getByRole('button', { name: 'Clear search and filters' }).click();
  await page.getByText('33 shown', { exact: false }).waitFor();
  for (const value of ['name', 'grade', 'mover', 'pd']) {
    await page.locator('.risk-sort-control select').selectOption(value);
    assert.equal(new URL(page.url()).searchParams.get('sort'), value);
  }
  await page.getByRole('button', { name: 'Gallery', exact: true }).click();
  assert.equal(new URL(page.url()).searchParams.get('assetView'), 'gallery');
  await page.getByRole('button', { name: 'Table', exact: true }).click();
  await page.locator('.risk-count-control input').fill('1');
  assert.equal(new URL(page.url()).searchParams.get('n'), '1');
  await page.locator('.risk-count-control input').fill('33');
  await page.getByRole('button', { name: 'Clear', exact: true }).click();
  assert.equal(new URL(page.url()).searchParams.get('selection'), 'empty');
  await page.getByRole('button', { name: 'Select all', exact: true }).click();

  await dialog(page, page.getByRole('button', { name: 'Reality.eth / Kleros', exact: true }), 'Market resolution provenance');
  await dialog(page, page.getByRole('button', { name: '33 assets selected', exact: true }), 'Choose assets to focus');
  if (mobile) await dialogFromTools(page, 'Search assets', 'Search risk assets');
  else await dialog(page, page.getByRole('button', { name: 'Search risk assets', exact: true }), 'Search risk assets');
  if (!mobile) {
    await dialogFromTools(page, 'Guide', 'Quick Guide');
    await dialogFromTools(page, 'Email notifications', 'Email notifications');
    await page.getByRole('button', { name: 'Tools', exact: true }).click();
    const tools = page.getByRole('dialog', { name: 'Risk tools', exact: true });
    const themeButton = tools.getByRole('button', { name: /^Use (dark|light) theme$/ });
    const current = await page.locator('html').getAttribute('data-theme');
    await themeButton.click();
    assert.notEqual(await page.locator('html').getAttribute('data-theme'), current);
    await tools.getByRole('button', { name: /^Use (dark|light) theme$/ }).click();
    await page.keyboard.press('Escape');
    await tools.waitFor({ state: 'detached' });
  } else {
    await dialog(page, page.getByRole('button', { name: 'Tools', exact: true }), 'Risk tools');
  }
  if (mobile) await dialogFromTools(page, 'Connect wallet', 'Connect wallet');
  else await dialog(page, page.getByRole('button', { name: 'Connect wallet', exact: true }), 'Connect wallet');

  await openRoute(page, '/risk/predict');
  await page.getByRole('button', { name: 'Expand all', exact: true }).click();
  const slider = page.getByRole('slider', { name: 'weETH annual probability of default', exact: true });
  await slider.focus(); await page.keyboard.press('PageUp');
  assert(await page.locator('.risk-prediction-row.is-edited').count() > 0);
  await page.getByText('CSV and draft tools', { exact: true }).click();
  await page.getByRole('button', { name: 'Upload CSV predictions', exact: true }).click();
  const csv = page.getByRole('dialog', { name: 'Upload CSV predictions', exact: true });
  await csv.getByLabel('Choose a CSV prediction file').setInputFiles({ name: 'draft.csv', mimeType: 'text/csv', buffer: Buffer.from('asset,probability\nweETH,4%\nUSDC,1%') });
  await csv.getByRole('button', { name: 'Load predictions', exact: true }).click();
  await csv.waitFor({ state: 'detached' });
  await page.getByText('CSV loaded', { exact: true }).first().waitFor();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export predictions', exact: true }).click();
  assert((await download).suggestedFilename().endsWith('.csv'));
  await page.getByRole('button', { name: 'Reset predictions', exact: true }).click();
  assert.equal(await page.locator('.risk-prediction-row.is-edited').count(), 0);
  await page.getByRole('button', { name: 'Collapse all', exact: true }).click();

  await openRoute(page, '/risk/history');
  await page.getByText('Inspect historical chart', { exact: true }).click();
  await page.getByRole('button', { name: '7d', exact: true }).filter({ visible: true }).last().click();
  await page.getByRole('button', { name: 'Log lines', exact: true }).click();
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await page.getByRole('button', { name: 'Pan right', exact: true }).click();
  const chart = page.locator('.risk-history-plot');
  await chart.focus(); await page.keyboard.press('End'); await page.keyboard.press('ArrowLeft');
  await page.locator('.risk-history-inspection > strong').filter({ hasText: /UTC/ }).waitFor();
  await page.getByRole('button', { name: 'Ridges', exact: true }).click();

  await openRoute(page, '/risk');
  const nav = page.getByRole('navigation', { name: mobile ? 'Risk sections' : 'Risk Pricing · Foresight destinations', exact: true });
  await nav.getByRole('button', { name: 'Assets', exact: true }).click();
  await ready(page);
  await nav.getByRole('button', { name: 'Over time', exact: true }).click();
  await ready(page); await page.goBack(); await ready(page);
  assert.equal(new URL(page.url()).pathname, '/risk/assets');
  await page.goForward(); await ready(page);
  assert.equal(new URL(page.url()).pathname, '/risk/history');
}

(async () => {
  const response = await fetch(origin + '/risk');
  assert(response.ok, 'Risk server does not respond successfully');
  browser = await chromium.launch({ executablePath: process.env.RISK_QA_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  await fs.mkdir(output, { recursive: true });
  for (const theme of ['light', 'dark']) {
    for (const width of widths) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', colorScheme: theme });
      await context.addInitScript(theme => {
        localStorage.setItem('seer-theme', theme); localStorage.setItem('seer-theme-preference', theme);
        localStorage.setItem('risk-guide-complete', 'true');
      }, theme);
      const page = await context.newPage();
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      for (const route of routes) {
        await openRoute(page, route);
        const label = `${theme}-${width}-${route.replaceAll('/', '_')}`;
        await inspect(page, label);
        if ([390, 1024, 1440].includes(width)) await page.screenshot({ path: path.join(output, label + '.png'), fullPage: true });
      }
      if ([390, 1440].includes(width)) await exercise(page, width === 390);
      assert.equal(errors.length, 0, errors.join('\n')); await context.close();
    }
  }
  await fs.writeFile(path.join(output, 'results.json'), JSON.stringify({ passed: true, results }, null, 2));
  console.log('PASS: real viewport, theme, focus, route, draft, CSV and overlay checks');
})().catch(async error => {
  console.error('Browser quality gate failed:', error.message);
  if (results.length) await fs.writeFile(path.join(output, 'results.json'), JSON.stringify({ passed: false, error: error.message, results }, null, 2));
  process.exitCode = 1;
}).finally(async () => { await browser?.close(); });
