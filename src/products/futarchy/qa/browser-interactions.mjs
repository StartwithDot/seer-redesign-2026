import assert from 'node:assert/strict';
import { focusTrap, poll } from './browser-quality.mjs';

export async function checkInteractions(page, url) {
  await page.goto(`${url}#/explorer`);
  await page.locator('.explorer-result').first().waitFor();
  await page.getByLabel('Search markets, questions, outcomes, collections, organizations, wallets, contracts and transactions', { exact: true }).fill('NoSuchQuestion');
  const results = page.getByRole('region', { name: 'Filtered Explorer results', exact: true });
  await results.getByText('No matching records.', { exact: true }).waitFor();
  await results.getByRole('button', { name: 'Clear search and filters' }).click();
  await page.locator('.explorer-result').first().waitFor();
  await page.getByRole('button', { name: 'Saved · 0', exact: true }).click();
  await page.getByText('Your research starts here.', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Browse markets', exact: true }).click();
  await page.locator('.explorer-result').first().waitFor();
  const bookmark = page.locator('.explorer-save').first();
  await bookmark.click(); assert.equal(await bookmark.getAttribute('aria-pressed'), 'true');
  await page.getByRole('button', { name: 'Saved · 1', exact: true }).click();
  assert.equal(await page.locator('.explorer-result').count(), 1);
  await page.locator('.explorer-save').first().click(); await page.getByText('Your research starts here.', { exact: true }).waitFor();
  await page.goto(`${url}#/`); await page.locator('.signal-switcher').waitFor();
  const sections = page.getByRole('navigation', { name: 'Discovery sections', exact: true });
  for (const [label, target] of [['Milestones', '#milestones'], ['Recently Closed', '#closed-title'], ['Organizations', '#organizations'], ['Signal Board', '#active-signals']]) {
    await sections.getByRole('button', { name: label, exact: true }).click();
    await page.locator(target).waitFor({ state: 'visible' });
    assert.ok(page.url().includes('section='));
  }
  await page.goBack(); await page.locator('#organizations').waitFor({ state: 'visible' });
  await page.goForward(); await page.locator('#active-signals').waitFor({ state: 'visible' });
  const searchTrigger = page.getByRole('button', { name: 'Search Futarchy', exact: true });
  await searchTrigger.click();
  const palette = page.getByRole('dialog', { name: 'Search Futarchy', exact: true });
  await palette.waitFor(); await focusTrap(page, palette);
  const query = palette.getByRole('combobox');
  await query.fill('NoSuchQuestion'); await palette.getByText('No results.', { exact: true }).waitFor();
  await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter'); assert.ok(await palette.isVisible());
  await palette.getByRole('button', { name: 'Clear search', exact: true }).click();
  await query.fill('GIP-152'); await query.press('ArrowDown'); await query.press('Enter');
  await page.locator('.market-workspace').waitFor(); assert.ok(page.url().includes('gip-152'));
  await searchTrigger.click(); await palette.waitFor(); await page.keyboard.press('Escape'); await palette.waitFor({ state: 'hidden' });
  assert.ok(await searchTrigger.evaluate(node => node === document.activeElement));

  await page.goto(`${url}#/m/eip-8363`); await page.locator('.market-workspace').waitFor();
  await page.getByRole('button', { name: 'Activity', exact: true }).click();
  assert.ok(page.url().includes('drawer=activity'));
  await page.keyboard.press('Escape');
  assert.ok(!page.url().includes('drawer='));
  await page.goBack(); await page.getByRole('dialog').waitFor();
  await page.goForward(); await page.getByRole('dialog').waitFor({ state: 'hidden' });
  await page.locator('.market-workspace').click({ position: { x: 1, y: 1 } });
  await page.keyboard.press('v');
  await page.getByRole('button', { name: 'Scenario: Neutral', exact: true }).waitFor();
  const walletTrigger = page.locator('.wallet-trigger');
  await walletTrigger.click();
  const walletDialog = page.getByRole('dialog', { name: 'Connect a wallet', exact: true });
  await walletDialog.waitFor(); await focusTrap(page, walletDialog); await page.keyboard.press('Escape');
  await walletDialog.waitFor({ state: 'hidden' }); assert.ok(await walletTrigger.evaluate(node => node === document.activeElement));
  assert.equal(await page.evaluate(() => document.body.style.overflow), '');

  await page.getByRole('button', { name: 'Activity', exact: true }).click();
  const action = page.getByRole('dialog').filter({ has: page.getByText('EIP-8363 activity', { exact: true }) });
  await action.waitFor(); await focusTrap(page, action);
  await action.getByRole('tab', { name: 'My Trades', exact: true }).click();
  await action.getByText('Connect to see wallet data.', { exact: true }).waitFor();
  await action.getByRole('tab', { name: 'My Trades', exact: true }).press('ArrowRight');
  assert.equal(await action.getByRole('tab', { name: 'Position', exact: true }).getAttribute('aria-selected'), 'true');
  await page.keyboard.press('Escape'); await action.waitFor({ state: 'hidden' });

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Field', exact: true }).click();
  await poll(() => page.locator('.field-particle').count().then(count => count === 0), 'Reduced motion should clear the particle stream');
  const tick = await page.locator('[data-tick]').getAttribute('data-tick');
  await new Promise(resolve => setTimeout(resolve, 1500));
  assert.equal(await page.locator('[data-tick]').getAttribute('data-tick'), tick);
  assert.ok(await page.getByRole('button', { name: 'Play replay', exact: true }).isDisabled());
  const timeline = page.getByLabel('Signal timeline', { exact: true }); const value = await timeline.inputValue();
  await timeline.focus(); await timeline.press('ArrowLeft'); assert.notEqual(await timeline.inputValue(), value);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await poll(() => page.locator('.field-particle').count().then(count => count > 0), 'Motion preference should update at runtime');
  await page.getByRole('button', { name: 'Chart', exact: true }).click();
}

export async function checkWalletRpc(page, url) {
  await page.addInitScript(() => {
    const handlers = new Map();
    const address = `0x${'1'.repeat(40)}`;
    window.__QA_WALLET__ = { fail: true, chain: 100, address, calls: [] };
    window.ethereum = {
      on: (event, listener) => { const list = handlers.get(event) || []; list.push(listener); handlers.set(event, list); },
      removeListener: (event, listener) => handlers.set(event, (handlers.get(event) || []).filter(value => value !== listener)),
      request: async ({ method, params }) => {
        const state = window.__QA_WALLET__; state.calls.push(method);
        if (method === 'eth_requestAccounts') return [state.address];
        if (method === 'wallet_switchEthereumChain') { state.chain = parseInt(params[0].chainId, 16); return null; }
        if (method === 'eth_chainId') return `0x${state.chain.toString(16)}`;
        if (method === 'eth_getBalance') { if (state.fail) throw new Error('Injected RPC failure'); return '0x0'; }
        throw new Error('Test provider rejects unsupported methods and signing');
      },
    };
  });
  await page.goto(`${url}#/m/eip-8363`); await page.locator('.market-workspace').waitFor();
  await page.locator('.wallet-trigger').click();
  await page.getByRole('dialog').getByRole('button', { name: 'Connect Wallet', exact: true }).click();
  const account = page.getByRole('dialog', { name: 'Your account', exact: true });
  await account.waitFor(); await account.getByText('Unavailable native tokens available for gas', { exact: true }).waitFor();
  await page.evaluate(() => { window.__QA_WALLET__.fail = false; });
  await account.getByRole('button', { name: 'Refresh RPC', exact: true }).click();
  await account.getByText('0.0000 xDAI available for gas', { exact: true }).waitFor();
  await account.getByRole('button', { name: 'Close wallet', exact: true }).click();
  await page.getByRole('button', { name: 'Position', exact: true }).click();
  await page.getByRole('table').first().waitFor();
  await page.getByRole('dialog').getByRole('button', { name: 'Close market actions', exact: true }).click();
  await page.evaluate(() => { window.__QA_WALLET__.fail = true; });
  await page.locator('.wallet-trigger').click(); await account.getByRole('button', { name: 'Refresh RPC', exact: true }).click();
  await account.getByText('The wallet RPC did not respond. Refresh RPC to retry.', { exact: true }).waitFor();
  await account.getByRole('button', { name: 'Close wallet', exact: true }).click();
  await page.getByRole('button', { name: 'Position', exact: true }).click();
  await page.getByRole('dialog').getByText('Wallet RPC unavailable.', { exact: true }).waitFor();
  assert.equal(await page.getByRole('dialog').getByRole('table').count(), 0);
  await page.evaluate(() => { window.__QA_WALLET__.fail = false; });
  await page.getByRole('dialog').getByRole('button', { name: 'Refresh RPC', exact: true }).click(); await page.getByRole('table').first().waitFor();
  await page.getByRole('dialog').getByRole('button', { name: 'Close market actions', exact: true }).click();

  await page.locator('.wallet-trigger').click(); await account.getByRole('radio', { name: 'Ethereum', exact: true }).click();
  await account.getByText('Wrong network', { exact: true }).waitFor(); await account.getByRole('button', { name: 'Close wallet', exact: true }).click();
  await page.getByRole('button', { name: 'Position', exact: true }).click(); await page.getByRole('dialog').getByRole('button', { name: 'Switch network', exact: true }).click();
  await page.getByRole('table').first().waitFor(); await page.getByRole('dialog').getByRole('button', { name: 'Close market actions', exact: true }).click();
  await page.context().setOffline(true); await page.getByText('You’re offline. Stored research remains readable; wallet requests need a connection.', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Position', exact: true }).click(); await page.getByRole('dialog').getByText('Wallet reads are offline.', { exact: true }).waitFor();
  assert.equal(await page.getByRole('dialog').getByRole('table').count(), 0);
  await page.getByRole('dialog').getByRole('button', { name: 'Close market actions', exact: true }).click();
  await page.context().setOffline(false); await page.locator('.wallet-trigger').click(); await account.getByRole('button', { name: 'Refresh RPC', exact: true }).click();
  await account.getByText('0.0000 xDAI available for gas', { exact: true }).waitFor();
  assert.ok(await page.evaluate(() => window.__QA_WALLET__.calls.every(method => !/send|sign/i.test(method))));
}
