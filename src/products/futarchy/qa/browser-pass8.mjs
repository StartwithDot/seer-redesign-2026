import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, extname } from 'node:path';
import { buildBrowserPage } from './browser-build.mjs';
import { captureScrollViews, focusTrap, poll, qualityMetrics } from './browser-quality.mjs';
import { checkInteractions, checkWalletRpc } from './browser-interactions.mjs';
import { checkTooltips } from './browser-tooltips.mjs';
import { checkMobileNavigation } from './browser-navigation.mjs';

const origin = 'http://futarchy.qa';
const url = `${origin}/futarchy/`;
const screenshots = await mkdtemp(join(tmpdir(), 'futarchy-pass8-shots-'));
let build, browser;
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const failures = [];
try {
  build = await buildBrowserPage();
  browser = await chromium.launch({ executablePath: process.env.FUTARCHY_QA_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--no-sandbox', '--disable-gpu'] });
  const context = await browser.newContext();
  await context.addInitScript(() => { if (!localStorage.getItem('seer-theme')) localStorage.setItem('seer-theme', 'light'); localStorage.setItem('futarchy-tour-complete', 'true'); });
  await context.route(`${origin}/**`, async route => {
    const path = new URL(route.request().url()).pathname;
    try { await route.fulfill({ status: 200, contentType: mime[extname(path)] || 'text/html', body: await build.read(path.startsWith('/futarchy') ? 'index.html' : path) }); }
    catch { await route.fulfill({ status: 404, body: 'Asset not found' }); }
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.setDefaultTimeout(8000);
  for (const width of [320, 360, 390, 768, 1024, 1440, 1920, 2560]) for (const theme of ['light', 'dark']) {
    await page.setViewportSize({ width, height: width < 700 ? 844 : 1000 });
    await page.goto(`${url}#/`); await page.locator('.signal-switcher').waitFor();
    await page.evaluate(theme => { localStorage.setItem('seer-theme', theme); document.documentElement.dataset.theme = theme; }, theme);
    await page.reload(); await page.locator('.signal-switcher').waitFor(); await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const [route, label] of [['#/', 'home'], ['#/m/eip-8363', 'market'], ['#/explorer', 'explorer'], ['#/organization/gnosis', 'organization'], ['#/create', 'create'], ['#/explorer/market/eip-8363', 'entity']]) {
      await page.goto(`${url}${route}`); await page.locator('.list-loading').first().waitFor({ state: 'hidden' });
      const name = `${width}-${theme}-${label}`;
      try { await qualityMetrics(page, width, name); } catch (error) { failures.push(error.message); }
      await captureScrollViews(page, screenshots, name);
      if (label === 'market') for (const drawer of ['Position', 'Activity', 'Collateral', 'Liquidity', 'Resolution', 'Lifecycle']) {
        await page.getByRole('button', { name: drawer, exact: true }).click(); const dialog = page.getByRole('dialog'); await dialog.waitFor();
        try { await focusTrap(page, dialog); await qualityMetrics(page, width, `${name}-${drawer}`); } catch (error) { failures.push(error.message); }
        await page.screenshot({ path: join(screenshots, `${name}-${drawer}.png`) }); await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'hidden' });
      }
    }
  }
  await page.setViewportSize({ width: 390, height: 844 }); await page.emulateMedia({ reducedMotion: 'no-preference' });
  await checkInteractions(page, url); await checkWalletRpc(page, url);
  await checkTooltips(page, url);
  await checkMobileNavigation(page, url);

  // Hold an actual production chunk request, then reject it and retry after restoring it.
  const loadingPage = await context.newPage(); let release; let blocked = true;
  const pending = new Promise(resolve => { release = resolve; });
  await loadingPage.route('**/chunks/marketSnapshot-*.js', async route => { await pending; if (blocked) await route.abort('failed'); else await route.fallback(); });
  await loadingPage.goto(`${url}#/`, { waitUntil: 'commit' });
  await loadingPage.getByRole('region', { name: 'Active signal board', exact: true }).getByRole('status', { name: 'Loading Active signal board' }).waitFor();
  release(); await loadingPage.getByText('The research snapshot could not load. Retry when your connection is available.', { exact: true }).first().waitFor();
  blocked = false;
  await loadingPage.getByRole('region', { name: 'Active signal board', exact: true }).getByRole('button', { name: 'Retry', exact: true }).click();
  await poll(() => loadingPage.locator('.signal-row-main').count().then(count => count > 0), 'Snapshot retry should restore the signal list');
  await loadingPage.close();
  assert.deepEqual(errors, [], 'Unexpected browser errors');
  assert.deepEqual(failures, [], failures.join('\n'));
  console.log(`Pass 8 browser checks passed. Inspect actual captures for two critique/fix passes: ${screenshots}`);
} catch (error) {
  console.error(`Pass 8 browser verification did not complete: ${error.message}`);
  console.error(`Screenshot directory: ${screenshots}`);
  process.exitCode = 1;
} finally { await browser?.close(); await build?.close(); }
