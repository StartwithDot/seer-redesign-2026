import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('..', import.meta.url));
const results = [];
const errors = [];
let browser;
let preview;
let resetTest;

const run = async (name, fn) => {
  try {
    if (typeof resetTest === 'function') await resetTest(name);
    await fn();
    results.push({ Test: name, Result: 'PASS' });
  } catch (error) {
    results.push({ Test: name, Result: 'FAIL', Detail: error.message });
  }
};

const command = args => new Promise((resolve, reject) => {
  const process = spawn('npm', args, { cwd: root, stdio: 'inherit' });
  process.on('error', reject);
  process.on('exit', code => code === 0 ? resolve() : reject(Error(`npm exited ${code}`)));
});

try {
  await mkdir(new URL('./out/', import.meta.url), { recursive: true });
  await command(['run', 'build']);

  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));

  preview = spawn(
    'npm',
    ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
    { cwd: root, stdio: 'pipe' },
  );

  const base = `http://127.0.0.1:${port}`;

  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {
      // Preview can take a moment to start.
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();

  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('response', response => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });

  const go = async (path = '/') => {
    await page.goto(base + path);
    await page.waitForTimeout(650);
  };

  resetTest = async name => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    if (!name.startsWith('05')) {
      await page.evaluate(() => {
        sessionStorage.removeItem('futarchy.chart-view');
      });
    }
  };

  const waitVerdict = async label => {
    try {
      await page.waitForFunction(
        expected =>
          document.querySelector('.verdict-gauge [aria-current="true"]')?.textContent === expected,
        label,
        { timeout: 8000 },
      );
    } catch {
      const current = await page.evaluate(
        () => document.querySelector('.verdict-gauge [aria-current="true"]')?.textContent,
      );
      throw new Error(`waitVerdict(${label}) timed out; current=${current}`);
    }
  };

  const skip = async () => {
    if (await page.getByRole('button', { name: 'Close', exact: true }).isVisible()) {
      await page.getByRole('button', { name: 'Close', exact: true }).click();
    }
  };

  const shot = async name => {
    const original = await page.evaluate(() => scrollY);
    const height = page.viewportSize().height;
    const total = await page.evaluate(() => document.documentElement.scrollHeight);

    for (let y = 0, index = 0; y < total; y += Math.floor(height * 0.9), index += 1) {
      await page.evaluate(top => window.scrollTo(0, top), y);
      await page.waitForTimeout(1300);
      await page.screenshot({
        path: fileURLToPath(new URL(`./out/${name}-${index}.png`, import.meta.url)),
        fullPage: false,
      });
    }

    await page.evaluate(top => window.scrollTo(0, top), original);
  };

  const assertCanvases = async () => {
    for (const canvas of await page.locator('.fork-canvas canvas').all()) {
      await canvas.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);

      const info = await canvas.evaluate(element => {
        const context = element.getContext('2d');
        const pixels = context.getImageData(0, 0, element.width, element.height).data;
        let ink = 0;

        for (let index = 3; index < pixels.length; index += 4) {
          if (pixels[index]) ink += 1;
        }

        return {
          width: element.getBoundingClientRect().width,
          height: element.getBoundingClientRect().height,
          ink,
          topInk: Array.from(
            context.getImageData(
              0,
              0,
              element.width,
              Math.ceil(4 * element.height / element.getBoundingClientRect().height),
            ).data,
          ).filter((value, index) => index % 4 === 3 && value > 0).length,
        };
      });

      assert(info.width >= 300, `Canvas width ${info.width}`);
      assert(info.height >= 72);
      assert(info.ink > 100, 'Canvas has no rendered chart');
      assert.equal(info.topInk, 0, 'Stroke pixels in top 4 CSS px');
    }
  };

  await run('05 Tour lifecycle', async () => {
    await go();
    assert.equal(await page.locator('dialog[open]').count(), 0);
    assert(await page.evaluate(() => !['hidden', 'clip'].includes(getComputedStyle(document.body).overflow)));

    await page.getByRole('button', { name: 'Tour', exact: true }).click();
    await page.getByRole('button', { name: 'Next', exact: true }).waitFor();
    await shot('tour');

    for (let index = 0; index < 10; index += 1) {
      await page.waitForTimeout(500);
      const containment = await page.evaluate(() => {
        const keys = [
          'board',
          'switcher',
          'impact',
          'controls',
          'milestone',
          'chart',
          'chart',
          'gauge',
          'trade',
          'activity',
        ];
        const step = Number(document.querySelector('#tour-progress > span').textContent.split('/')[0]) - 1;
        const target = document.querySelector(`[data-tour="${keys[step]}"]`)
          ?? document.querySelector('[data-tour="board"]');
        const targetBox = target.getBoundingClientRect();
        const cutout = document.querySelector('[data-tour-cutout]');
        const x = Number(cutout.getAttribute('x'));
        const y = Number(cutout.getAttribute('y'));
        const width = Number(cutout.getAttribute('width'));
        const height = Number(cutout.getAttribute('height'));

        return {
          step,
          contains:
            x <= targetBox.left + 2
            && y <= targetBox.top + 2
            && x + width >= targetBox.right - 2
            && y + height >= targetBox.bottom - 2,
        };
      });

      assert(containment.contains, `Tour step ${containment.step + 1} misses target`);
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await page.waitForTimeout(180);
      if (index === 4) assert.match(page.url(), /m\/eth-8363/);
    }

    await page.reload();
    assert.equal(await page.locator('dialog[open]').count(), 0);
    await page.getByRole('button', { name: 'Tour', exact: true }).click();
    await skip();
    await page.reload();
    assert.equal(await page.locator('dialog[open]').count(), 0);
  });

  await skip();

  await run('02 Responsive overflow', async () => {
    for (const width of [360, 390, 768, 1024, 1440, 1920, 2560]) {
      await page.setViewportSize({ width, height: 1000 });

      for (const route of ['/#/', '/#/m/eth-8363']) {
        await go(route);
        assert(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          `${width} ${route}`,
        );
      }
    }
  });

  await run('02b Mobile landing density', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await go();

    const metrics = await page.evaluate(() => ({
      height: document.documentElement.scrollHeight,
      lanes: [...document.querySelectorAll('.signal-row')].map(
        element => element.getBoundingClientRect().height,
      ),
      closed: [...document.querySelectorAll('.closed-strip .closed-card')].map(
        element => element.getBoundingClientRect().height,
      ),
      organizations: [...document.querySelectorAll('.organization-row')].map(
        element => element.getBoundingClientRect().height,
      ),
      stripOverflow:
        document.querySelector('.closed-strip').scrollWidth
        - document.querySelector('.closed-strip').clientWidth,
      pageOverflow: document.documentElement.scrollWidth - innerWidth,
    }));

    console.log('Mobile landing height:', metrics.height);
    assert(metrics.height < 7200, `Mobile landing height: ${metrics.height}`);
    assert.equal(metrics.lanes.length, 5);
    assert(metrics.lanes.every(height => height <= 400), `Signal lane heights: ${metrics.lanes}`);
    assert(metrics.closed.length > 0);
    assert(metrics.closed.every(height => height <= 256), `Closed lane heights: ${metrics.closed}`);
    assert(metrics.organizations.length > 0);
    assert(
      metrics.organizations.every(height => height <= 320),
      `Organization lane heights: ${metrics.organizations}`,
    );
    assert(metrics.stripOverflow <= 1, `Closed strip overflow: ${metrics.stripOverflow}`);
    assert(metrics.pageOverflow <= 0, `Page overflow: ${metrics.pageOverflow}`);
    assert.equal(await page.getByRole('button', { name: 'Search', exact: true }).isVisible(), true);
  });

  await run('03 Container alignment', async () => {
    for (const width of [390, 768, 1440, 1920, 2560]) {
      await page.setViewportSize({ width, height: 1000 });

      for (const route of ['/#/', '/#/m/eth-8363']) {
        await go(route);

        const bad = await page.evaluate(() => {
          const pageElement = document.querySelector('main.page');
          const pageBox = pageElement.getBoundingClientRect();
          const pageStyle = getComputedStyle(pageElement);
          const left = pageBox.left + parseFloat(pageStyle.paddingLeft);
          const right = pageBox.right - parseFloat(pageStyle.paddingRight);

          return [...document.querySelectorAll('[data-align]')].flatMap(element => {
            const box = element.getBoundingClientRect();

            if (element.classList.contains('page')) {
              const style = getComputedStyle(element);
              return Math.abs(box.left + parseFloat(style.paddingLeft) - left) > 1
                || box.right - parseFloat(style.paddingRight) > right + 1
                ? [element.className]
                : [];
            }

            return Math.abs(box.left - left) > 1 || box.right > right + 1
              ? [element.className]
              : [];
          });
        });

        assert.deepEqual(bad, [], `${width} ${route}: ${bad}`);

        if (width >= 1440) {
          const size = await page.locator('main.page').evaluate(element => {
            const box = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return box.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
          });
          const expected = Math.min(width - 48, 1392);
          assert(Math.abs(size - expected) <= 2, `${width}: canvas ${size}, expected ${expected}`);
        }

        assert(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          `${width}: overflow`,
        );
      }
    }
  });

  await page.setViewportSize({ width: 1440, height: 1000 });

  await run('04 Routing and history', async () => {
    await go();
    await page.locator('.signal-row').first().getByRole('button', { name: 'Open', exact: true }).click();
    await page.locator('.detail-breadcrumb').waitFor();

    await page.getByRole('button', { name: 'Back', exact: true }).click();
    await page.locator('.live-board').waitFor();

    await page.goForward();
    await page.locator('.detail-breadcrumb').waitFor();

    await page.goBack();
    await page.locator('.live-board').waitFor();

    await go('/#/m/eth-8363');
    await page.locator('.detail-breadcrumb a').nth(1).click();
    await page.locator('.live-board').waitFor();
    assert.match(page.url(), /org\/ethereum/);

    await page.locator('#seer-global-header .sg-brand').click();
    await page.locator('.live-board').waitFor();

    await go('/#/m/eth-8363');
    await page.locator('.detail-breadcrumb a').first().click();
    await page.locator('.live-board').waitFor();
  });

  await run('06 Search and palette', async () => {
    await page.setViewportSize({ width: 390, height: 1000 });
    await go();

    await page.getByRole('textbox', { name: 'Search milestones' }).fill('KIP-91');
    assert.equal(await page.locator('.signal-row').count(), 1);

    await page.getByRole('textbox', { name: 'Search milestones' }).fill('');
    await page.locator('h1').click();
    await page.keyboard.press('/');
    await page.locator('dialog[open]').waitFor();
    await shot('palette');

    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog[open]').count(), 0);

    await page.keyboard.press('Meta+k');
    await page.getByRole('dialog').getByRole('textbox').fill('EIP-8363');
    await page.keyboard.press('Enter');
    await page.locator('.detail-breadcrumb').waitFor();
  });

  await run('07 Filters and URL', async () => {
    await go();
    await page.locator('.organization-row').filter({ hasText: 'Gnosis DAO' }).first().click();
    await page.waitForTimeout(500);
    assert.match(page.url(), /org\/gnosis/);

    await go();
    await page.getByRole('button', { name: 'Token', exact: true }).click();
    await page.getByRole('option').filter({ hasText: 'PNK' }).click();
    await page.keyboard.press('Escape');
    assert.match(page.url(), /token=PNK/);
    assert.equal(await page.locator('.signal-row').count(), 1);

    await page
      .getByRole('group', { name: 'Status', exact: true })
      .getByRole('button', { name: 'Resolved', exact: true })
      .click();
    assert.match(page.url(), /status=Resolved/);
    assert.equal(await page.locator('.signal-row').count(), 0);

    await page.getByRole('button', { name: 'Clear', exact: true }).click();
    assert.equal(await page.locator('.signal-row').count(), 5);
  });

  await run('08 Milestone adaptation', async () => {
    await go('/?n=1');
    assert.equal(await page.locator('.signal-row').count(), 1);
    assert.equal(await page.locator('.lane-preview-slot').count(), 1);
    assert.equal(await page.locator('.board-switcher').count(), 0);
    await assertCanvases();
    await shot('single');

    await go('/?n=12');
    assert.equal(await page.locator('.signal-row').count(), 12);
    assert(
      await page.locator('.signal-list').evaluate(
        element => element.scrollHeight > innerHeight
          && element.scrollHeight > element.clientHeight,
      ),
      'Twelve lanes must remain reachable in the scrollable board',
    );
    assert.equal(new Set(await page.locator('.signal-row-title').allTextContents()).size, 12);
    await page.locator('.signal-select').first().focus();
    await page.keyboard.press('End');
    assert.equal(await page.locator('.signal-select').last().getAttribute('aria-current'), 'true');
    assert(await page.locator('.signal-list').evaluate(element => element.scrollTop > 0));
    await page.keyboard.press('Home');
    assert.equal(await page.locator('.signal-select').first().getAttribute('aria-current'), 'true');
    await assertCanvases();
    await shot('twelve');

    await page.setViewportSize({ width: 390, height: 1000 });
    await page.getByRole('textbox', { name: 'Search milestones' }).fill('no-such-milestone');
    await page.getByRole('heading', { name: 'No milestones' }).waitFor();
  });

  await run('09 Bounded live activity', async () => {
    await go('/#/m/eth-8363');
    const card = page.locator('.activity-section');
    const list = page.locator('.activity-table');

    await card.scrollIntoViewIfNeeded();
    assert((await card.boundingBox()).height <= 480);

    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    const first = await list.locator('tbody tr').first().innerText();
    await list.evaluate(element => {
      element.scrollTop = 200;
    });
    const top = await list.evaluate(element => element.scrollTop);

    await page.waitForTimeout(12500);
    assert(Math.abs(await page.evaluate(() => document.documentElement.scrollHeight) - height) <= 2);
    assert.notEqual(await list.locator('tbody tr').first().innerText(), first);
    assert(Math.abs(await list.evaluate(element => element.scrollTop) - top) <= 2, 'scrollTop changed');

    await page.getByRole('button', { name: 'Last 30 trades', exact: true }).click();
    await page.getByRole('option', { name: 'Last 90 trades', exact: true }).click();
    assert.equal(await list.locator('tbody tr').count(), 90);
  });

  await run('10 Verdict replay and needle', async () => {
    await go('/#/m/eth-8363');
    const gauge = page.locator('.verdict-gauge');

    await gauge.scrollIntoViewIfNeeded();
    await waitVerdict('Neutral');

    const initial = await page.locator('.gauge-needle').getAttribute('style');
    await page.evaluate(() => document.activeElement && document.activeElement.blur());
    await page.keyboard.press('v');
    await waitVerdict('Include');

    await page.waitForFunction(
      value => document.querySelector('.gauge-needle')?.getAttribute('style') !== value,
      initial,
      { timeout: 6000 },
    ).catch(() => {
      throw new Error('needle position never changed after verdict flip');
    });

    await page.evaluate(() => document.activeElement && document.activeElement.blur());
    await page.keyboard.press('v');
    await waitVerdict('Exclude');

    await page.locator('.chart-card').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Play', exact: true }).click();
    await page.getByRole('button', { name: 'Play', exact: true }).waitFor({ timeout: 16000 });
    await waitVerdict('Exclude');

    await page.waitForFunction(
      () => Boolean(document.querySelector('.verdict-gauge .gauge-heading svg')),
      null,
      { timeout: 8000 },
    ).catch(() => {
      throw new Error('lock glyph never appeared after replay');
    });
  });

  await run('11 Themes and contrast', async () => {
    await go();

    for (const theme of ['light', 'dark']) {
      await page.locator('.sg-theme').click();
      await page.waitForTimeout(600);
      assert.equal(await page.locator('html').getAttribute('data-theme'), theme);

      const ratios = await page.evaluate(() => {
        const rgb = value =>
          value
            .match(/[\d.]+/g)
            .slice(0, 3)
            .map(Number)
            .map(channel => {
              const normalized = channel / 255;
              return normalized <= 0.04045
                ? normalized / 12.92
                : ((normalized + 0.055) / 1.055) ** 2.4;
            });
        const luminance = value =>
          rgb(value).reduce(
            (total, channel, index) => total + channel * [0.2126, 0.7152, 0.0722][index],
            0,
          );

        return ['h1', '.filter-trigger', '.signal-tiles span'].map(selector => {
          const element = document.querySelector(selector);
          if (!element) return 21;

          let background = element;
          while (
            background
            && getComputedStyle(background).backgroundColor === 'rgba(0, 0, 0, 0)'
          ) {
            background = background.parentElement;
          }

          const foregroundLuminance = luminance(getComputedStyle(element).color);
          const backgroundLuminance = luminance(
            getComputedStyle(background ?? document.documentElement).backgroundColor,
          );

          return (
            (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
            / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
          );
        });
      });

      assert(ratios.every(ratio => ratio >= 4.5), `${theme}: ${ratios}`);
    }
  });

  await run('12 Mobile touch targets', async () => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const route of ['/#/', '/#/m/eth-8363']) {
      await go(route);
      const bad = await page.locator('button,a').evaluateAll(elements =>
        elements
          .filter(element => {
            if (element.closest('#seer-global-header,.seer-footer')) return false;
            const box = element.getBoundingClientRect();
            return box.width && box.height && (box.width < 40 || box.height < 40);
          })
          .map(element => element.textContent.trim() || element.getAttribute('aria-label')),
      );
      assert.deepEqual(bad, []);
    }
  });

  await run('13 Accessibility and dialogs', async () => {
    for (const route of ['/#/', '/#/m/eth-8363']) {
      await go(route);
      const bad = await page
        .locator('button,a,input,select,[tabindex="0"]')
        .evaluateAll(elements =>
          elements
            .filter(element => {
              const box = element.getBoundingClientRect();
              return (
                box.width
                && box.height
                && !element.getAttribute('aria-label')
                && !element.getAttribute('aria-labelledby')
                && !element.textContent.trim()
                && !element.labels?.length
              );
            })
            .map(element => element.outerHTML),
        );
      assert.deepEqual(bad, []);
    }

    await page.getByRole('button', { name: 'Add Liquidity', exact: true }).click();
    await page.getByRole('dialog').waitFor();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog[open]').count(), 0);

    await go();
    await page.keyboard.press('Tab');
    assert(await page.evaluate(() => {
      const element = document.activeElement;
      const style = getComputedStyle(element);
      return (
        element !== document.body
        && style.outlineStyle !== 'none'
        && parseFloat(style.outlineWidth) >= 2
      );
    }));

    await page.locator('header').getByRole('button', { name: 'Search', exact: false }).click();

    for (let index = 0; index < 20; index += 1) {
      await page.keyboard.press('Tab');
      assert(await page.evaluate(() => Boolean(document.activeElement.closest('dialog'))));
    }

    await page.keyboard.press('Escape');
  });

  await run('14 Reduced motion stops tickers', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await go('/?n=12');

    const first = await page.locator('.live-board').innerText();
    const counts = await page.locator('.countdown-chip').allTextContents();
    await page.waitForTimeout(8500);

    assert.equal(await page.locator('.live-board').innerText(), first);
    assert.deepEqual(await page.locator('.countdown-chip').allTextContents(), counts);

    await go('/#/m/eth-8363');
    const rows = await page.locator('.activity-table tbody').innerText();
    await page.waitForTimeout(6500);

    assert.equal(await page.locator('.activity-table tbody').innerText(), rows);
    assert(await page.getByRole('button', { name: 'Play', exact: true }).isDisabled());

    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });

  await run('15 Digit reel windows', async () => {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      await page.emulateMedia({ reducedMotion });
      await go('/#/m/eth-8363');
      await page.getByRole('spinbutton').fill('129.6');
      await page.waitForTimeout(400);
      await page.evaluate(() => document.fonts.ready);

      const bad = await page.locator('.rolling-number').evaluateAll(elements =>
        elements.flatMap(element => {
          const issues = [];
          const style = getComputedStyle(element);
          const windowElement = element.querySelector('.rolling-digit');

          if (!windowElement) return issues;

          const height = windowElement.getBoundingClientRect().height;
          if (Math.abs(height - parseFloat(style.lineHeight)) > 1) issues.push('line height');

          const numeric = element.textContent.trim().replace(/ (USDS|WETH|d|h|m)$/, '');
          if (!/^[+\-]?[\d.,]+ ?%?$/.test(numeric)) issues.push(`text ${numeric}`);

          const context = document.createElement('canvas').getContext('2d');
          context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

          for (const digit of '0123456789') {
            const metrics = context.measureText(digit);
            if (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent > height) {
              issues.push(`glyph ${digit} clipped`);
            }
          }

          for (const column of element.querySelectorAll('.rolling-digit')) {
            const reel = column.firstElementChild;
            const index = Number(reel.style.transform.match(/-([0-9]+)/)[1]);
            const cell = reel.children[index].getBoundingClientRect();
            const box = column.getBoundingClientRect();

            if (Math.abs(cell.top - box.top) > 1 || Math.abs(cell.height - box.height) > 1) {
              issues.push('cell geometry');
            }
          }

          return issues;
        }),
      );

      assert.deepEqual(bad, [], `${reducedMotion}: digit window mismatch`);
    }

    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });

  await run('16 No DOM or canvas label overlaps', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    for (const width of [360, 390, 768, 1024, 1440, 1920, 2560]) {
      for (const route of ['/#/', '/#/m/eth-8363', '/?n=12#/']) {
        await page.setViewportSize({ width, height: 1000 });
        await go(route);
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(150);

        const issues = await page.evaluate(() => {
          const entries = [];
          const add = (element, rect, name) => {
            if (element.closest('[data-overlay],.sr-only,[aria-hidden="true"]')) return;

            const box = {
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom,
            };

            for (let parent = element; parent; parent = parent.parentElement) {
              const style = getComputedStyle(parent);

              if (
                style.display === 'none'
                || style.visibility === 'hidden'
                || Number(style.opacity) === 0
              ) {
                return;
              }

              const parentBox = parent.getBoundingClientRect();

              if (/hidden|clip|auto|scroll/.test(style.overflowX)) {
                box.left = Math.max(box.left, parentBox.left);
                box.right = Math.min(box.right, parentBox.right);
              }

              if (/hidden|clip|auto|scroll/.test(style.overflowY)) {
                box.top = Math.max(box.top, parentBox.top);
                box.bottom = Math.min(box.bottom, parentBox.bottom);
              }
            }

            if (box.right - box.left > 1 && box.bottom - box.top > 1) {
              entries.push({ element, box, name });
            }
          };

          document
            .querySelectorAll('a,button,input,select,textarea,.rolling-number')
            .forEach(element =>
              add(
                element,
                element.getBoundingClientRect(),
                element.getAttribute('aria-label') || element.textContent.trim().slice(0, 50),
              ),
            );

          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

          while (walker.nextNode()) {
            const node = walker.currentNode;
            const element = node.parentElement;

            if (
              !node.textContent.trim()
              || element.closest('script,style,a,button,input,select,textarea,.rolling-number')
            ) {
              continue;
            }

            const range = document.createRange();
            range.selectNodeContents(node);

            for (const rect of range.getClientRects()) {
              add(element, rect, node.textContent.trim().slice(0, 50));
            }
          }

          const overlaps = [];

          for (let first = 0; first < entries.length; first += 1) {
            for (let second = first + 1; second < entries.length; second += 1) {
              const a = entries[first];
              const b = entries[second];

              if (a.element.contains(b.element) || b.element.contains(a.element)) continue;
              if (Boolean(a.element.closest('header')) !== Boolean(b.element.closest('header'))) {
                continue;
              }

              if (
                Math.min(a.box.right, b.box.right) - Math.max(a.box.left, b.box.left) > 1
                && Math.min(a.box.bottom, b.box.bottom) - Math.max(a.box.top, b.box.top) > 1
              ) {
                overlaps.push(`${a.name} / ${b.name}`);
              }
            }
          }

          return overlaps;
        });

        assert.deepEqual(issues, [], `${width} ${route}: DOM overlaps`);

        for (const canvas of await page.locator('.fork-canvas canvas').all()) {
          await canvas.scrollIntoViewIfNeeded();
          await page.waitForTimeout(100);

          const canvasIssues = await canvas.evaluate(element => {
            const labels = element.__labels;

            if (!Array.isArray(labels)) return ['Missing label diagnostics'];
            if (
              !labels.length
              && !['mini', 'hero'].includes(element.dataset.labelMode)
              && element.dataset.chartView !== 'Field'
            ) {
              return ['Missing text label diagnostics'];
            }

            const { width, height } = element.getBoundingClientRect();
            const bad = [];
            const edgeInset = 6;
            const threadClearance = 6;

            for (const label of labels) {
              for (const range of label.threadYRanges ?? []) {
                if (label.y < range.max && label.y + label.h > range.min) {
                  bad.push(`Thread intersects label x-range: ${label.text}`);
                } else if (
                  label.y < range.max + threadClearance - 0.1
                  && label.y + label.h > range.min - threadClearance + 0.1
                ) {
                  bad.push(`Thread clearance below ${threadClearance}px: ${label.text}`);
                }
              }

              if (
                label.x < edgeInset - 0.1
                || label.y < edgeInset - 0.1
                || label.x + label.w > width - edgeInset + 0.1
                || label.y + label.h > height - edgeInset + 0.1
              ) {
                bad.push(`Outside: ${label.text}`);
              }
            }

            for (let first = 0; first < labels.length; first += 1) {
              for (let second = first + 1; second < labels.length; second += 1) {
                const a = labels[first];
                const b = labels[second];

                if (
                  a.x < b.x + b.w
                  && b.x < a.x + a.w
                  && a.y < b.y + b.h
                  && b.y < a.y + a.h
                ) {
                  bad.push(`${a.text} / ${b.text}`);
                }

                if (
                  a.x < b.x + b.w
                  && b.x < a.x + a.w
                  && Math.abs(a.y - b.y) < 18 - 0.1
                ) {
                  bad.push(`Separation: ${a.text} / ${b.text}`);
                }
              }
            }

            return bad;
          });

          assert.deepEqual(canvasIssues, [], `${width} ${route}: canvas labels`);
        }
      }
    }

    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });

  await run('20 Signal head momentum, ticks and reduced motion', async () => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });

    for (const preset of ['moving', 'waiting']) {
      await go(`/?pulse=${preset}#/m/eth-8363`);
      await page.getByRole('radio', { name: 'Chart', exact: true }).click();

      const canvas = page.locator('.chart-card canvas');
      await canvas.scrollIntoViewIfNeeded();
      await page.waitForFunction(
        expected => document.querySelector('.chart-card canvas')?.__pulse?.mode === expected,
        preset,
      );

      if (preset === 'moving') {
        await page.waitForFunction(
          () => document.querySelector('.chart-card canvas').__pulse.particles > 0,
        );
      }

      assert((await canvas.evaluate(element => element.__pulse.particles)) <= 80);
    }

    await go('/?pulse=waiting#/m/eth-8363');
    await page.getByRole('radio', { name: 'Chart', exact: true }).click();

    const canvas = page.locator('.chart-card canvas');
    await canvas.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.dispatchEvent(new Event('futarchy:activity')));
    await page.waitForFunction(
      () => document.querySelector('.chart-card canvas').__pulse.particles > 0,
    );

    await go('/?pulse=moving#/');
    const previewCanvas = page.locator('.lane-preview-slot .board-chart canvas').first();
    await previewCanvas.scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () =>
        document.querySelector('.lane-preview-slot .board-chart canvas')?.__pulse?.mode
        === 'moving',
    );
    assert((await previewCanvas.evaluate(element => element.__pulse.particles)) <= 80);

    await previewCanvas.hover();
    await page.waitForFunction(
      () =>
        document.querySelector('.lane-preview-slot .board-chart canvas').__pulse.particles > 0,
    );
    assert((await previewCanvas.evaluate(element => element.__pulse.particles)) <= 80);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForFunction(
      () => [...document.querySelectorAll('canvas')].every(
        element => !element.__pulse?.particles,
      ),
      null,
      { timeout: 4000 },
    );

    for (const route of ['/?pulse=moving#/', '/?pulse=moving#/m/eth-8363']) {
      await go(route);

      for (const item of await page.locator('.fork-canvas canvas').all()) {
        await item.scrollIntoViewIfNeeded();
        await page.waitForFunction(
          () => [...document.querySelectorAll('.fork-canvas canvas')].every(
            element => element.__pulse?.particles === 0,
          ),
          null,
          { timeout: 4000 },
        );
        assert.equal(await item.evaluate(element => element.__pulse.particles), 0);
      }
    }

    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });

  await run('21 Field toggle, model, replay and reduced motion', async () => {
    const sample = () => page.locator('.chart-card canvas').evaluate(canvas => {
      const context = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      const data = context.getImageData(0, 0, width, height).data;
      let sum = 0;
      let weight = 0;

      for (let x = Math.floor(width * 0.45); x < width * 0.65; x += 1) {
        for (let y = Math.floor(height * 0.2); y < height * 0.8; y += 1) {
          const index = (y * width + x) * 4;
          const signal = Math.max(0, data[index + 2] - data[index + 1] - 35);
          sum += y * signal;
          weight += signal;
        }
      }

      return {
        row: sum / Math.max(1, weight) / height,
        weight,
      };
    });

    try {
      await page.emulateMedia({ reducedMotion: 'reduce' });

      for (const width of [360, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await go('/#/m/eth-8363');
        await page.getByRole('radio', { name: 'Field', exact: true }).click();

        const canvas = page.locator('.chart-card canvas');
        await canvas.scrollIntoViewIfNeeded();
        await page.waitForTimeout(150);
        assert.equal(await canvas.getAttribute('data-chart-view'), 'Field');

        const before = await sample();
        assert(before.weight > 0, 'Field canvas is blank');

        const still = await canvas.evaluate(element => element.toDataURL());
        await page.waitForTimeout(300);
        assert.equal(
          await canvas.evaluate(element => element.toDataURL()),
          still,
          'Reduced motion animates',
        );

        await page.keyboard.press('v');
        await page.waitForTimeout(200);
        const after = await sample();
        assert(Math.abs(after.row - before.row) > 0.015, 'Preset did not separate streams');

        await page.reload();
        await page.waitForTimeout(650);
        assert.equal(await canvas.getAttribute('data-chart-view'), 'Field');

        await page.getByRole('radio', { name: 'Chart', exact: true }).click();
        assert.equal(await canvas.getAttribute('data-chart-view'), 'Chart');
      }

      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await go('/#/m/eth-8363');
      await page.getByRole('radio', { name: 'Field', exact: true }).click();

      const canvas = page.locator('.chart-card canvas');
      await canvas.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);

      const pixels = () => canvas.evaluate(element => {
        const context = element.getContext('2d');
        const rows = [];

        for (const fraction of [0.35, 0.45, 0.5, 0.55, 0.65]) {
          rows.push(
            ...context.getImageData(
              0,
              Math.floor(element.height * fraction),
              element.width,
              1,
            ).data,
          );
        }

        return rows;
      });

      const first = await pixels();
      await page.waitForTimeout(400);
      assert.notDeepEqual(await pixels(), first, 'Field particles did not move');

      const beforeScrub = await sample();
      await page.getByRole('slider', { name: 'Remaining Time' }).evaluate(element => {
        const setter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          'value',
        ).set;
        setter.call(element, '5');
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await page.waitForTimeout(650);
      assert.notDeepEqual(await sample(), beforeScrub, 'Field did not react to replay');

      await page.getByRole('button', { name: 'Play', exact: true }).click();
      await page.waitForTimeout(300);
      await page.getByRole('button', { name: 'Pause', exact: true }).click();

      const slider = page.getByRole('slider', { name: 'Remaining Time' });
      const now = await slider.inputValue();
      await page.getByRole('radio', { name: 'Chart', exact: true }).click();
      assert.equal(await slider.inputValue(), now, 'Toggle reset replay');
      assert.deepEqual(errors, []);
    } finally {
      await page.evaluate(() => sessionStorage.removeItem('futarchy.chart-view'));
      await page.emulateMedia({ reducedMotion: 'no-preference' });
    }
  });

  await run('22 Live signal board geometry', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    for (const width of [390, 768, 1024, 1440, 1920, 2560]) {
      let normalHeight;

      for (const count of [5, 12, 1]) {
        await page.setViewportSize({ width, height: 1000 });
        await go(`/?n=${count}#/`);
        await page.evaluate(() => document.fonts.ready);

        const geometry = await page.evaluate(() => {
          const box = selector => {
            const rect = document.querySelector(selector).getBoundingClientRect();
            return {
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom,
              width: rect.width,
              height: rect.height,
            };
          };

          const rows = [...document.querySelectorAll('.signal-row')].map(element => {
            const rect = element.getBoundingClientRect();
            return {
              left: rect.left,
              right: rect.right,
              top: rect.top,
              bottom: rect.bottom,
              width: rect.width,
              height: rect.height,
            };
          });

          const selected = document
            .querySelector('.signal-select[aria-current="true"]')
            .closest('.signal-row')
            .getBoundingClientRect();
          const listElement = document.querySelector('.signal-list');

          return {
            header: Boolean(document.querySelector('.hero-header h1')),
            font: parseFloat(getComputedStyle(document.querySelector('h1')).fontSize),
            hero: box('.live-board-hero'),
            list: box('.signal-list'),
            grid: box('.f6-board__grid'),
            scrollHeight: listElement.scrollHeight,
            clientHeight: listElement.clientHeight,
            preview: box('.lane-preview-slot'),
            chart: box('.live-board'),
            plot: box('.board-chart'),
            rows,
            selected: {
              left: selected.left,
              right: selected.right,
              top: selected.top,
              bottom: selected.bottom,
              width: selected.width,
              height: selected.height,
            },
            selectedCount: document.querySelectorAll(
              '.signal-select[aria-current="true"]',
            ).length,
            previewCount: document.querySelectorAll('.lane-preview-slot').length,
            strip: getComputedStyle(document.querySelector('.glyph-strip')).display !== 'none',
            removed: document.querySelectorAll('.board-live-stats,.board-intro').length,
            overflowY: getComputedStyle(listElement).overflowY,
            switcher: Boolean(document.querySelector('.board-switcher')),
          };
        });

        assert(geometry.header && geometry.font <= 40);
        assert.equal(geometry.removed, 0);
        assert.equal(geometry.rows.length, count);
        assert.equal(geometry.selectedCount, 1);
        assert.equal(geometry.previewCount, 1);
        assert.equal(geometry.strip, true);
        assert(geometry.rows.every(row => row.height >= 112));
        assert(
          Math.max(...geometry.rows.map(row => row.width))
          - Math.min(...geometry.rows.map(row => row.width))
          <= 2,
          `${width}: lane widths differ`,
        );
        assert(
          Math.max(...geometry.rows.map(row => row.left))
          - Math.min(...geometry.rows.map(row => row.left))
          <= 2,
          `${width}: lane left edges differ`,
        );
        assert(geometry.plot.height >= (width < 720 ? 232 : 280));

        if (width >= 1024) {
          assert(
            geometry.rows.every(row => row.right <= geometry.preview.left - 7),
            `${width}: lanes overlap preview`,
          );
          assert(
            Math.abs(geometry.preview.right - geometry.grid.right) <= 2,
            `${width}: preview right edge is not aligned`,
          );
        } else {
          assert(
            geometry.preview.top >= geometry.selected.bottom + 7,
            `${width}: stacked preview overlaps selected lane`,
          );
          assert(
            Math.abs(geometry.preview.left - geometry.rows[0].left) <= 2
            && Math.abs(geometry.preview.width - geometry.rows[0].width) <= 2,
            `${width}: stacked preview is not lane aligned`,
          );
        }

        if (count === 5) normalHeight = geometry.hero.height;

        if (count === 12) {
          if (width >= 1024) {
            // The redesigned board bounds its list beside a sticky preview.
            assert(Math.abs(geometry.hero.height - normalHeight) <= 2);
            assert(geometry.scrollHeight > geometry.clientHeight);
            assert.equal(geometry.overflowY, 'auto');
          } else {
            assert(
              geometry.hero.height >= normalHeight + 400,
              `${width}: additional lanes did not extend page flow`,
            );
            assert.equal(geometry.overflowY, 'visible');
          }
        }

        if (count === 1) {
          assert(
            geometry.hero.height <= normalHeight + 2,
            `${width}: single lane introduced excess vertical space`,
          );
          assert.equal(geometry.switcher, false);
        }

        assert(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        );
      }
    }
  });

  await run('23 Labels have solid halo strokes', async () => {
    for (const theme of ['light', 'dark']) {
      for (const route of ['/#/', '/#/m/eth-8363']) {
        await page.setViewportSize({ width: 1440, height: 1000 });
        await go(route);
        await page.evaluate(
          value => {
            document.documentElement.dataset.theme = value;
          },
          theme,
        );

        for (const canvas of await page.locator('.fork-canvas canvas').all()) {
          await canvas.scrollIntoViewIfNeeded();
          await page.waitForTimeout(250);

          const labels = await canvas.evaluate(element => element.__labels);
          assert(labels?.length, 'Missing label diagnostics');

          for (const label of labels) {
            assert.deepEqual(label.lineDash, [], `Dashed halo: ${label.text}`);
          }
        }
      }
    }
  });

  await run('24 Signal selection and rotation', async () => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await go();

    const selected = () =>
      page.locator('.signal-row:has(.signal-select[aria-current="true"])');
    const list = page.getByRole('list', { name: 'Active milestones', exact: true });

    assert.equal(await list.getByRole('listitem').count(), 5);
    assert.equal(await list.getByRole('button', { name: 'Open', exact: true }).count(), 5);

    const clicked = list.getByRole('listitem').nth(1);
    assert.equal(await clicked.getByRole('button').count(), 2);
    await clicked.locator('.signal-select').click();

    assert.equal(
      new URL(page.url()).pathname + (new URL(page.url()).hash || '#/'),
      '/#/',
      'Single click must stay on landing',
    );
    assert.equal(await clicked.locator('.signal-select').getAttribute('aria-current'), 'true');

    const clickedProposal = (await clicked.locator('.lane-eyebrow').innerText())
      .split(' · ')
      .pop();
    assert((await page.locator('.board-question').innerText()).includes(clickedProposal));

    await page.mouse.move(0, 0);
    await page.evaluate(() => document.activeElement?.blur());
    const held = await selected().getAttribute('data-id');
    await page.waitForTimeout(9000);
    assert.equal(
      await selected().getAttribute('data-id'),
      held,
      'Selection must hold for 12 seconds',
    );

    const first = await selected().getAttribute('data-id');
    await selected().locator('.signal-select').focus();
    await page.keyboard.press('ArrowDown');

    const next = await selected().getAttribute('data-id');
    assert.notEqual(next, first);
    assert(
      await selected()
        .locator('.signal-select')
        .evaluate(element => element === document.activeElement),
    );
    assert.equal(await list.locator('.signal-select[tabindex="0"]').count(), 1);

    const proposal = (await selected().locator('.lane-eyebrow').innerText())
      .split(' · ')
      .pop();
    assert((await page.locator('.board-question').innerText()).includes(proposal));

    const color = await selected().evaluate(element => ({
      bar: getComputedStyle(element.querySelector('.selected-signal-bar')).backgroundColor,
      impact: getComputedStyle(element.querySelector('.signal-impact')).color,
    }));
    assert.equal(color.bar, color.impact);

    await page.keyboard.press('Enter');
    await page.locator('.detail-breadcrumb').waitFor();
    assert(page.url().endsWith(`/m/${next}`));

    await go();
    await page.locator('.signal-select').nth(1).dblclick();
    await page.locator('.detail-breadcrumb').waitFor();

    await go();
    await page.locator('.board-question .btn-bubbles').click();
    await page.locator('.detail-breadcrumb').waitFor();

    await go();
    await page
      .locator('.signal-row')
      .first()
      .getByRole('button', { name: 'Open', exact: true })
      .click();
    await page.locator('.detail-breadcrumb').waitFor();

    await go();
    await page.mouse.move(0, 0);
    const initial = await selected().getAttribute('data-id');
    await page.waitForTimeout(8500);
    assert.notEqual(await selected().getAttribute('data-id'), initial);

    await selected().hover();
    const paused = await selected().getAttribute('data-id');
    await page.waitForTimeout(8500);
    assert.equal(await selected().getAttribute('data-id'), paused);

    await page.mouse.move(0, 0);
    await selected().locator('.signal-select').focus();
    const focused = await selected().getAttribute('data-id');
    await page.waitForTimeout(8500);
    assert.equal(
      await selected().getAttribute('data-id'),
      focused,
      'Focus must pause rotation',
    );

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await go();
    await page.mouse.move(0, 0);
    const still = await selected().getAttribute('data-id');
    await page.waitForTimeout(8500);
    assert.equal(await selected().getAttribute('data-id'), still);
    assert.equal(await page.locator('.signal-progress').count(), 0);

    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });

  await run('26 Fixed pills, organization columns, tooltips and bubbles', async () => {
    await page.setViewportSize({ width: 1440, height: 900 });

    for (const width of [360, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await go();

      const widths = await page
        .locator('.signal-row .lane-verdict')
        .evaluateAll(elements =>
          elements
            .filter(element => element.getBoundingClientRect().width)
            .map(element => element.getBoundingClientRect().width),
        );

      assert(widths.length > 1);
      assert(
        Math.max(...widths) - Math.min(...widths) <= 1,
        `Verdict lane widths differ at ${width}px`,
      );
      assert(
        widths.every(value => value >= 104 && value <= 120),
        `Unexpected verdict lane widths at ${width}px: ${widths}`,
      );

      const tags = await page
        .locator('.organization-market .active-market')
        .evaluateAll(elements => elements.map(element => element.getBoundingClientRect().left));

      assert(tags.length > 1);
      assert(tags.every(left => Math.abs(left - tags[0]) < 1), 'Market tag columns differ');
      assert.equal(
        await page.locator('.glyph-strip').isVisible(),
        true,
        'Glyph strip should remain visible in stacked or horizontal form',
      );

      for (const step of await page.locator('.glyph-strip > div').all()) {
        await step.hover();
        await page.getByRole('tooltip').waitFor();
        assert((await page.getByRole('tooltip').innerText()).length > 10);

        await page.mouse.move(0, 0);
        await step.focus();
        await page.getByRole('tooltip').waitFor();
        await step.evaluate(element => element.blur());
      }

      if (width === 360 || width === 1440) {
        for (const selector of ['.hero-actions a', '.board-question a']) {
          const button = page.locator(selector);
          assert((await button.getAttribute('class')).includes('btn-bubbles'));
          await button.hover();
          assert(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            'Bubble hover overflow',
          );
        }

        await go('/#/m/eth-8363');

        for (const button of await page.locator('.detail-actions .button,.trade-panel .button').all()) {
          assert((await button.getAttribute('class')).includes('btn-bubbles'));
          await button.hover();
          assert(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            'Detail bubble overflow',
          );
        }
      }
    }
  });

  await run('25 Impact uses one live source', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await go();

    const rows = page.locator('.signal-row');

    for (let index = 0; index < await rows.count(); index += 1) {
      const row = rows.nth(index);
      await row.locator('.signal-select').focus();

      const id = await row.getAttribute('data-id');
      const impact = await row.locator('.signal-impact strong').innerText();

      assert.equal(
        await page
          .locator('.live-board .signal-tiles > div')
          .last()
          .locator('.rolling-number')
          .getAttribute('data-value'),
        impact,
        `${id}: signal row and hero Impact differ`,
      );
      assert.equal(
        await row.locator('.lane-gap-delta').innerText(),
        impact,
        `${id}: lane gap and lane outcome Impact differ`,
      );
    }

    const impact = await rows.first().locator('.signal-impact strong').innerText();
    await rows.first().locator('.signal-select').focus();
    await page.keyboard.press('Enter');
    await page.locator('.detail-heading').waitFor();

    assert.equal(
      await page.locator('.detail-heading .rolling-number').first().getAttribute('data-value'),
      impact,
      'Detail Impact differs from signal row',
    );
    assert.equal(
      await page
        .locator('.metric-strip > div')
        .last()
        .locator('.rolling-number')
        .getAttribute('data-value'),
      impact,
      'Chart stat Impact differs from signal row',
    );

    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });

  await run('17 HoverMenu interactions', async () => {
    const assertMenuGap = async name => {
      const panel = page.getByRole('listbox', { name, exact: true });
      const trigger = page.getByRole('button', { name, exact: true });
      const box = await panel.boundingBox();
      const button = await trigger.boundingBox();
      const viewport = page.viewportSize();

      assert(box && button, `${name}: missing panel or trigger`);
      assert(
        box.x >= 0
        && box.x + box.width <= viewport.width
        && box.y >= 0
        && box.y + box.height <= viewport.height,
        `${name}: outside viewport`,
      );
      assert(
        box.y >= button.y + button.height + 7 || box.y + box.height <= button.y - 7,
        `${name} at ${viewport.width}px: panel ${JSON.stringify(box)}, trigger ${JSON.stringify(button)}`,
      );
    };

    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await go();

      if (width < 768) {
        await page.getByRole('button', { name: /^Filters/ }).click();
      }
      const trigger = page.getByRole('button', { name: 'Organizations', exact: true });
      await trigger.scrollIntoViewIfNeeded();
      await trigger.hover();

      const panel = page.getByRole('listbox', { name: 'Organizations', exact: true });
      await panel.waitFor({ timeout: 250 });

      const order = await panel.getByRole('option').allTextContents();
      await panel.getByRole('option', { name: /^Kleros DAO/ }).hover();
      assert.deepEqual(
        await panel.getByRole('option').allTextContents(),
        order,
        'Hover reordered organizations',
      );

      const tokenTrigger = page.getByRole('button', { name: 'Token', exact: true });
      await tokenTrigger.hover();
      await page.getByRole('listbox', { name: 'Token', exact: true }).waitFor();
      await assertMenuGap('Token');
      assert.equal(await panel.count(), 0, 'Other menu remained open');

      await trigger.hover();
      await panel.waitFor();
      assert.equal(
        await page.getByRole('listbox', { name: 'Token', exact: true }).count(),
        0,
        'Token menu remained open after Organizations opened',
      );

      const box = await panel.boundingBox();
      const button = await trigger.boundingBox();
      assert(box.x >= 0 && box.x + box.width <= width && box.y >= 0 && box.y + box.height <= 1000);
      assert(
        box.y >= button.y + button.height + 7 || box.y + box.height <= button.y - 7,
        `Organizations at ${width}px: panel ${JSON.stringify(box)}, trigger ${JSON.stringify(button)}`,
      );
      assert.equal(
        await panel.getByRole('option').count(),
        await panel.locator('[role="option"] .avatar').count(),
      );

      await page.mouse.move(width - 2, 2);
      await panel.waitFor({ state: 'hidden', timeout: 450 });

      await trigger.focus();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Home');
      await panel.getByRole('option', { name: /^Gnosis DAO/ }).click();
      assert.match(page.url(), /org=gnosis-dao/);
      await page.getByRole('button', { name: 'Remove Gnosis DAO', exact: true }).waitFor();

      await page.keyboard.press('Escape');
      assert.equal(await panel.count(), 0, 'Organizations menu remained open after Escape');

      await trigger.focus();
      await page.keyboard.press('Space');
      await panel.getByRole('option', { name: /^Kleros DAO/ }).click();
      assert.match(page.url(), /kleros-dao/);

      await page.keyboard.press('Escape');
      await page.getByRole('button', { name: 'Token', exact: true }).click();
      await page.getByRole('listbox', { name: 'Token', exact: true }).waitFor();
      if (width < 768) {
        // Outside the menu and the mobile sheet, equivalent to the desktop heading.
        await page.locator('.f6-filter__backdrop').click({ position: { x: width - 2, y: 200 } });
      } else {
        await page.locator('h1').click();
      }
      assert.equal(
        await page.locator('.hover-panel[role="listbox"]').count(),
        0,
        'Dismissed HoverMenu panel remained open',
      );
    }

    await go();
    await page.getByRole('button', { name: 'Closing soon', exact: true }).click();
    await page.getByRole('listbox', { name: 'Closing soon', exact: true }).waitFor();
    await assertMenuGap('Closing soon');
    await page.keyboard.press('Escape');

    await go('/#/m/eth-8363');
    await page.getByRole('button', { name: 'Last 30 trades', exact: true }).click();
    await page.getByRole('listbox', { name: 'Last 30 trades', exact: true }).waitFor();
    await assertMenuGap('Last 30 trades');
    await page.getByRole('option', { name: 'Last 60 trades', exact: true }).click();

    assert.equal(
      await page.locator('.hover-panel[role="listbox"]').count(),
      0,
      'Dismissed HoverMenu panel remained open',
    );
    assert.equal(await page.locator('.activity-table tbody tr').count(), 60);
  });

  await run('18 Tour CTA lifecycle', async () => {
    await page.evaluate(() => localStorage.removeItem('futarchy.tour.v1'));
    await go();

    assert.equal(
      await page
        .locator('.hero-actions')
        .getByRole('link', { name: 'Create market', exact: true })
        .count(),
      1,
    );

    await page.getByRole('button', { name: 'Tour', exact: true }).click();
    await skip();

    assert.equal(
      await page
        .locator('.hero-actions')
        .getByRole('link', { name: 'Create market', exact: true })
        .count(),
      1,
    );

    await page.reload();
    assert.equal(await page.locator('dialog[open]').count(), 0);

    await page.getByRole('button', { name: 'Tour', exact: true }).click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog[open]').count(), 0);

    await page.locator('h1').click();
    await page.keyboard.press('/');
    await page.getByRole('dialog').getByRole('textbox').fill('Take the tour');
    await page.keyboard.press('Enter');
    await page.locator('.guided-tour[open]').waitFor();
    await skip();
  });

  await run('19 Avatar consistency', async () => {
    await go();

    const identities = await page.locator('.organization-row').evaluateAll(rows =>
      Object.fromEntries(rows.map(row => [row.dataset.org, row.dataset.avatar])),
    );
    assert.equal(new Set(Object.values(identities)).size, 5);

    for (const card of await page.locator('.milestone-card,.closed-card').all()) {
      const org = await card.getAttribute('data-org');
      const avatar = await card.getAttribute('data-avatar');
      assert.equal(avatar, identities[org]);
      assert.equal(
        await card.locator('.market-identity .avatar').first().getAttribute('data-avatar'),
        avatar,
      );
    }

    await go('/#/m/eth-8363');
    assert.equal(
      await page.locator('.detail-heading').getAttribute('data-avatar'),
      identities.ethereum,
    );
    assert.equal(
      await page.locator('.detail-breadcrumb .avatar').first().getAttribute('data-avatar'),
      identities.ethereum,
    );
  });

  await run('27 Fixed filter geometry', async () => {
    let reference;

    for (const width of [1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await go();

      const geometry = await page.evaluate(() => {
        const rect = element => {
          const box = element.getBoundingClientRect();
          return { w: box.width, h: box.height };
        };

        return {
          controls: [
            ...document.querySelectorAll(
              '.filter-search,.controls-menus .filter-trigger,.landing-controls .segmented',
            ),
          ].map(rect),
          menus: [...document.querySelectorAll('.controls-menus .filter-trigger')].map(rect),
          segments: [...document.querySelectorAll('.landing-controls .segmented button')].map(rect),
        };
      });

      assert.equal(geometry.menus.length, 3);

      for (const control of geometry.controls) {
        assert(Math.abs(control.h - 40) <= 1, `${width}: control height ${control.h}`);
      }

      assert(
        Math.abs(geometry.menus[0].w - geometry.menus[2].w) <= 1,
        `${width}: organization and sort controls differ`,
      );
      assert(
        geometry.menus[1].w <= geometry.menus[0].w
        && geometry.menus.every(control => control.w >= 128 && control.w <= 176),
        `${width}: menu widths ${geometry.menus.map(control => control.w)}`,
      );
      assert(
        Math.max(...geometry.segments.map(control => control.w))
        - Math.min(...geometry.segments.map(control => control.w))
        <= 1,
      );
      assert(
        geometry.segments.every(control => control.w >= 72 && Math.abs(control.h - 40) <= 1),
      );

      const current = {
        menus: geometry.menus.map(control => control.w),
        segments: geometry.segments.map(control => control.w),
      };

      if (reference) {
        current.menus.forEach((value, index) => {
          assert(Math.abs(value - reference.menus[index]) <= 1);
        });
        current.segments.forEach((value, index) => {
          assert(Math.abs(value - reference.segments[index]) <= 1);
        });
      } else {
        reference = current;
      }
    }
  });

  await run('30 Rapid organization and route transitions', async () => {
    await go();

    for (const name of [/^Gnosis DAO/, /^Kleros DAO/]) {
      const trigger = page.getByRole('button', { name: 'Organizations', exact: true });
      await trigger.click({ timeout: 1000 });
      await page
        .getByRole('listbox', { name: 'Organizations', exact: true })
        .getByRole('option', { name })
        .click({ timeout: 1000 });
      await page.waitForFunction(
        () => !document.documentElement.dataset.transition,
        null,
        { timeout: 1000 },
      );
      await page.keyboard.press('Escape');
    }

    await page.evaluate(() => {
      location.hash = '/m/eth-8363';
    });
    await page.locator('.detail-breadcrumb a').first().waitFor({ timeout: 1000 });
    await page.waitForFunction(
      () => !document.documentElement.dataset.transition,
      null,
      { timeout: 1000 },
    );

    await page.locator('.detail-breadcrumb a').first().click({ timeout: 1000 });
    await page.locator('.live-board').waitFor({ timeout: 1000 });
    await page.waitForFunction(
      () => !document.documentElement.dataset.transition,
      null,
      { timeout: 1000 },
    );
  });

  await run('31 Tile values fit without collisions', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    for (const width of [1440, 1920, 2560]) {
      for (const route of ['/#/', '/?n=12#/', '/#/m/eth-8363']) {
        await page.setViewportSize({ width, height: 1000 });
        await go(route);
        await page.evaluate(() => document.fonts.ready);

        const issues = await page.evaluate(() => {
          const values = [
            ...document.querySelectorAll(
              '.signal-tiles .rolling-number,.metric-strip .rolling-number,.closed-impact-value',
            ),
          ];
          const bad = [];

          for (const value of values) {
            if (value.scrollWidth > value.clientWidth + 1) {
              bad.push(`Overflow: ${value.getAttribute('data-value') || value.textContent}`);
            }

            const content = value.querySelector('.rolling-characters') || value;
            const box = content.getBoundingClientRect();
            const tile = value
              .closest('.signal-tiles > div,.metric-strip > div,.closed-impact')
              .getBoundingClientRect();

            if (box.left < tile.left - 1 || box.right > tile.right + 1) {
              bad.push('Value outside tile');
            }
          }

          const boxes = values.map(value => value.getBoundingClientRect());

          for (let first = 0; first < boxes.length; first += 1) {
            for (let second = first + 1; second < boxes.length; second += 1) {
              const a = boxes[first];
              const b = boxes[second];

              if (
                Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1
                && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1
              ) {
                bad.push('Tile values intersect');
              }
            }
          }

          return bad;
        });

        assert.deepEqual(issues, [], `${width}px ${route}`);
      }
    }
  });

  await run('28 Organization column distribution', async () => {
    for (const width of [1440, 1920, 2560]) {
      await page.setViewportSize({ width, height: 1000 });
      await go();

      const rows = await page.locator('.organization-row').evaluateAll(elements =>
        elements.map(row => {
          const cells = [...row.children];
          const table = row.getBoundingClientRect();
          const boxes = cells.map(cell => cell.getBoundingClientRect());
          const contents = cells.map(cell => {
            const range = document.createRange();
            range.selectNodeContents(cell);
            const box = range.getBoundingClientRect();
            return box.width ? box : cell.getBoundingClientRect();
          });

          return {
            width: table.width,
            height: table.height,
            widths: boxes.map(box => box.width),
            cellGaps: boxes
              .slice(1)
              .map((box, index) => box.left - boxes[index].right),
            gaps: contents
              .slice(1)
              .map((box, index) => Math.max(0, box.left - contents[index].right)),
            market: boxes[1].left,
            header: [...document.querySelector('.organization-head').children].map(
              cell => cell.getBoundingClientRect().left,
            ),
            lefts: boxes.map(box => box.left),
          };
        }),
      );

      for (const row of rows) {
        assert(row.height >= 64 && row.height <= 80, `${width}px: row height ${row.height}`);
        assert(row.widths.every(cellWidth => cellWidth <= row.width * 0.45));
        assert(
          row.cellGaps.every(gap => Math.abs(gap) <= 1),
          `${width}px: cell gaps ${row.cellGaps}`,
        );
        assert(
          row.gaps.every(gap => gap >= 15 && gap <= 400),
          `${width}px: content gaps ${row.gaps}`,
        );

        row.lefts.forEach((left, index) => {
          assert(
            Math.abs(left - row.header[index]) <= 1,
            `${width}px ${['NAME', 'MARKET', 'ACTIVE', 'PROPOSALS', 'CHAIN', 'LIQUIDITY'][index]}: body ${left}, header ${row.header[index]}`,
          );
        });

        assert.equal(row.market, rows[0].market);
      }
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await go();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  });

  await run('29 Organization navigation and scroll', async () => {
    for (const reducedMotion of ['no-preference', 'reduce']) {
      await page.emulateMedia({ reducedMotion });
      await go();

      const row = page.locator('.organization-row[data-org="ethereum"]');
      await row.click();
      await page.waitForURL(/#\/org\/ethereum$/);
      await page.waitForFunction(() => {
        const box = document.querySelector('#milestones h2').getBoundingClientRect();
        return box.top >= 64 && box.top < 200;
      });

      assert.equal(
        await page.locator('.signal-row:not([data-org="ethereum"])').count(),
        0,
      );
      assert(await page.locator('.signal-row[data-org="ethereum"]').count() > 0);
      assert.equal(
        await page.locator('.closed-card:not([data-org="ethereum"])').count(),
        0,
      );
      assert.equal(await row.getAttribute('aria-current'), 'true');

      await page
        .locator('.landing-controls')
        .getByRole('button', { name: 'Clear', exact: true })
        .click();
      await page.waitForURL(/#\/$/);
      await page.waitForFunction(() => scrollY < 2);
    }
  });

  await run('01 Every route error free', async () => {
    await go();

    const links = await page
      .locator('a[href^="#/m/"],a[href^="#/org/"]')
      .evaluateAll(elements => [
        ...new Set(elements.map(element => element.getAttribute('href'))),
      ]);

    for (const hash of [...links, '#/unknown']) {
      await go(`/${hash}`);
    }

    assert.deepEqual(errors, []);
  });

  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await go();
    await assertCanvases();
    await shot(`landing-${width}`);

    await go('/#/m/eth-8363');
    await assertCanvases();
    await shot(`detail-${width}`);
  }
} catch (error) {
  results.push({ Test: 'Harness', Result: 'FAIL', Detail: error.stack });
} finally {
  await browser?.close();
  preview?.kill('SIGTERM');
  console.table(results);

  if (results.some(result => result.Result === 'FAIL')) {
    process.exitCode = 1;
  }
}
