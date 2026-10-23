import assert from 'node:assert/strict';
import { join } from 'node:path';

export async function poll(check, message, timeout = 8000) {
  const deadline = Date.now() + timeout;
  do {
    if (await check()) return;
    await new Promise(resolve => setTimeout(resolve, 60));
  } while (Date.now() < deadline);
  throw new Error(message);
}

export async function focusTrap(page, dialog) {
  const candidates = dialog.locator('a[href]:not([tabindex="-1"]),button:not(:disabled):not([tabindex="-1"]),input:not(:disabled):not([tabindex="-1"]),select:not(:disabled):not([tabindex="-1"]),textarea:not(:disabled):not([tabindex="-1"]),[tabindex]:not([tabindex="-1"]):not(:disabled)');
  const visible = [];
  for (let index = 0; index < await candidates.count(); index += 1) if (await candidates.nth(index).isVisible()) visible.push(candidates.nth(index));
  assert.ok(visible.length);
  await visible.at(-1).focus(); await page.keyboard.press('Tab');
  assert.ok(await visible[0].evaluate(node => node === document.activeElement), 'Tab must wrap to first dialog control');
  await page.keyboard.press('Shift+Tab');
  assert.ok(await visible.at(-1).evaluate(node => node === document.activeElement), 'Shift+Tab must wrap to last dialog control');
  assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
  assert.ok(await page.locator('#futarchy-main').evaluate(node => Boolean(node.closest('[inert]'))), 'Background must be inert');
}

export async function qualityMetrics(page, width, name) {
  const failures = await page.evaluate(({ width }) => {
    const failed = [];
    const surface = document.querySelector('.futarchy-shell');
    if (!surface) return ['Missing Futarchy shell'];
    const color = text => {
      const values = text.match(/[\d.]+/g)?.map(Number);
      if (!values || values.length < 3) return null;
      return [...values.slice(0, 3), values[3] ?? 1];
    };
    const mix = (top, base) => top.slice(0, 3).map((value, index) => value * top[3] + base[index] * (1 - top[3])).concat(1);
    const luminance = rgb => rgb.slice(0, 3).map(value => { const v = value / 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
    const contrast = (a, b) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
    const visible = node => node.getClientRects().length && !node.closest('[inert],[hidden],.sr-only') && getComputedStyle(node).visibility !== 'hidden';
    const background = node => {
      const colors = [];
      for (let parent = node; parent; parent = parent.parentElement) { const rgb = color(getComputedStyle(parent).backgroundColor); if (rgb) colors.unshift(rgb); }
      return colors.reduce((result, next) => mix(next, result), [255, 255, 255, 1]);
    };
    if (!document.querySelector('[role="dialog"]') && document.documentElement.scrollHeight > innerHeight * 2 + 2) failed.push(`Primary page exceeds two viewports: ${document.documentElement.scrollHeight} / ${innerHeight}`);
    if (document.documentElement.scrollWidth > width + 1) failed.push(`Page overflow: ${document.documentElement.scrollWidth} > ${width}`);
    for (const node of surface.querySelectorAll('button,a,summary,input:not([type="hidden"]),select,textarea')) {
      if (!visible(node) || node.matches('.action-drawer-backdrop,.evidence-backdrop')) continue;
      const rect = node.getBoundingClientRect();
      if (width <= 700 && !node.matches('[type="checkbox"],[type="radio"]') && (rect.width < 39.5 || rect.height < 39.5)) failed.push(`Target below 40px: ${node.getAttribute('aria-label') || node.textContent.trim().slice(0, 65)} ${rect.width.toFixed(1)}×${rect.height.toFixed(1)}`);
      if (node.matches('button,a,summary') && !node.getAttribute('aria-label') && !node.textContent.trim() && !node.querySelector('img[alt]')) failed.push('Control without accessible name');
    }
    for (const node of surface.querySelectorAll('.eyebrow,.status-chip,.verdict,.signal-row-copy small,.signal-impact,.spot-metrics span,.list-notice strong,.list-notice p,.primary-button,.wallet-trigger,.data-chip')) {
      if (!visible(node)) continue;
      const style = getComputedStyle(node), rgb = color(style.color);
      if (rgb && contrast(rgb, background(node)) < 4.5) failed.push(`Low contrast: ${node.textContent.trim().slice(0, 50)}`);
      if (parseFloat(style.fontSize) < 12) failed.push(`Label below 12px: ${node.textContent.trim().slice(0, 50)}`);
    }
    const controls = [...surface.querySelectorAll('button,a,input,select')].filter(visible).filter(node => !node.closest('.futarchy-header,.futarchy-footer,.signal-tabs,.entity-tabs') && !node.matches('.action-drawer-backdrop,.evidence-backdrop'));
    const bounds = controls.map(node => [node, node.getBoundingClientRect()]).filter(([, rect]) => rect.top >= 100 && rect.bottom <= innerHeight && rect.left >= 0 && rect.right <= innerWidth);
    for (let left = 0; left < bounds.length; left += 1) for (let right = left + 1; right < bounds.length; right += 1) {
      const [a, x] = bounds[left], [b, y] = bounds[right];
      if (a.contains(b) || b.contains(a)) continue;
      if (Math.min(x.right, y.right) - Math.max(x.left, y.left) > 2 && Math.min(x.bottom, y.bottom) - Math.max(x.top, y.top) > 2) failed.push(`Overlapping controls: ${a.textContent.trim().slice(0, 30)} / ${b.textContent.trim().slice(0, 30)}`);
    }
    for (const table of surface.querySelectorAll('table')) for (const cell of table.querySelectorAll('tbody td')) if (!cell.hasAttribute('data-label')) failed.push('Mobile table cell missing label');
    return [...new Set(failed)];
  }, { width });
  assert.deepEqual(failures, [], `${name}: ${failures.join('; ')}`);
}

export async function captureScrollViews(page, directory, name) {
  const height = await page.evaluate(() => innerHeight);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let position = 0, index = 0; position < total; position += Math.max(1, height - 100), index += 1) {
    await page.evaluate(top => scrollTo({ top, behavior: 'instant' }), position);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.screenshot({ path: join(directory, `${name}-${index}.png`), fullPage: false });
  }
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
}
