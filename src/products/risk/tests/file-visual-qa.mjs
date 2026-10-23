import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { build } from 'esbuild';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright-core');
const root = path.resolve(import.meta.dirname, '../../../..');
const output = path.join(root, 'src/products/risk/tests/file-visual-output');

const bundle = await build({
  absWorkingDir: root,
  bundle: true,
  format: 'esm',
  loader: {
    '.gif': 'dataurl',
    '.jpeg': 'dataurl',
    '.jpg': 'dataurl',
    '.png': 'dataurl',
    '.svg': 'dataurl',
    '.webp': 'dataurl',
    '.woff': 'dataurl',
    '.woff2': 'dataurl',
  },
  minify: false,
  outdir: output,
  stdin: {
    contents: `
      import React from 'react';
      import { createRoot } from 'react-dom/client';
      import '@fontsource-variable/inter-tight';
      import './src/design-system/tokens.css';
      import './src/design-system/components.css';
      import { Page } from './src/products/risk/index.tsx';
      createRoot(document.getElementById('root')).render(React.createElement(Page));
    `,
    loader: 'tsx',
    resolveDir: root,
    sourcefile: 'risk-file-qa-entry.tsx',
  },
  write: false,
});

const script = bundle.outputFiles.find((file) => file.path.endsWith('.js'))?.text;
const styles = bundle.outputFiles.find((file) => file.path.endsWith('.css'))?.text;
if (!script || !styles) throw new Error('Risk file QA bundle did not emit JavaScript and CSS.');

await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.RISK_QA_CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
const results = [];

try {
  for (const theme of ['light', 'dark']) {
    for (const width of [390, 1024, 1440]) {
      const context = await browser.newContext({
        colorScheme: theme,
        reducedMotion: 'reduce',
        viewport: { width, height: 900 },
      });
      const page = await context.newPage();
      await page.setContent('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div></body></html>');
      await page.evaluate((nextTheme) => {
        document.documentElement.dataset.theme = nextTheme;
        try {
          localStorage.setItem('seer-theme', nextTheme);
          localStorage.setItem('risk-guide-complete', 'true');
        } catch {
          // about:blank may use an opaque origin; the document theme remains authoritative.
        }
      }, theme);
      await page.addStyleTag({ content: styles });
      await page.addScriptTag({ content: script, type: 'module' });
      await page.locator('.risk-shell').waitFor();
      await page.locator('.risk-data-skeleton').waitFor({ state: 'detached' }).catch(() => {});
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: path.join(output, `${theme}-${width}.png`), fullPage: true });
      results.push(await page.evaluate(({ width, theme }) => {
        const shell = document.querySelector('.risk-shell');
        const header = document.querySelector('.product-header');
        const visible = (element) => Boolean(element?.getClientRects().length) && getComputedStyle(element).visibility !== 'hidden';
        const controls = [...document.querySelectorAll('.risk-shell button, .risk-shell a, .risk-shell summary')].filter(visible);
        const undersized = controls.filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.height < 39 || (element.matches('button') && rect.width < 39);
        }).map((element) => element.getAttribute('aria-label') || element.textContent?.trim().slice(0, 50));
        return {
          width,
          theme,
          documentTheme: document.documentElement.dataset.theme,
          shellTheme: shell?.dataset.theme,
          background: shell ? getComputedStyle(shell).backgroundColor : null,
          height: document.documentElement.scrollHeight,
          overflow: document.documentElement.scrollWidth - innerWidth,
          header: header ? { left: header.getBoundingClientRect().left, right: header.getBoundingClientRect().right } : null,
          undersized,
        };
      }, { width, theme }));
      await context.close();
    }
  }
} finally {
  await browser.close();
}

await writeFile(path.join(output, 'results.json'), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
