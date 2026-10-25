import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('..', import.meta.url));
const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const results = []; const errors = []; let browser, preview;
const only = process.env.ONLY;
const run = async (name, fn) => { if (only && !name.includes(only)) return; try { await fn(); results.push({ Test: name, Result: 'PASS' }); } catch (e) { results.push({ Test: name, Result: 'FAIL', Detail: String(e.message).split('\n').slice(0,3).join(' | ').slice(0,300) }); } };
const command = (args) => new Promise((res, rej) => { const p = spawn('npm', args, { cwd: root, stdio: 'inherit' }); p.on('exit', c => c === 0 ? res() : rej(Error('npm ' + c))); });
try {
  await mkdir(new URL('./out/', import.meta.url), { recursive: true });
  await command(['run', 'build']);
  const s = createServer(); s.listen(0, '127.0.0.1'); await once(s, 'listening'); const port = s.address().port; await new Promise(r => s.close(r));
  preview = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { cwd: root, stdio: 'pipe' });
  const base = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 100; i++) { try { if ((await fetch(base)).ok) break; } catch {} await new Promise(r => setTimeout(r, 100)); }
  browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
  const go = async (path = '/') => { await page.setViewportSize({ width: 1440, height: 900 }); await page.goto('about:blank'); await page.goto(base + path); await page.waitForSelector('[data-testid="page-title"]', { timeout: 15000 }); await page.waitForTimeout(350); };
  const id = (t) => page.getByTestId(t);
  const poll = async (fn, ms = 5000) => { const end = Date.now() + ms; let last; while (Date.now() < end) { try { last = await fn(); if (last) return last; } catch (e) { last = e; } await new Promise(r => setTimeout(r, 80)); } throw new Error('poll timeout' + (last instanceof Error ? ': ' + last.message : '')); };
  const files = ['cases.mjs', 'cases-2.mjs', 'cases-3.mjs'];
  const text = (await Promise.all(files.map(file => readFile(new URL(file, import.meta.url), 'utf8')))).join('\n');
  await new AsyncFunction('run', 'go', 'id', 'assert', 'poll', 'page', 'base', text)(run, go, id, assert, poll, page, base);
  await run('Harness no console/network errors', async () => { assert.deepEqual(errors, []); });
} catch (e) { results.push({ Test: 'HARNESS', Result: 'FAIL', Detail: String(e.message).slice(0, 300) }); }
finally { await browser?.close(); preview?.kill(); }
console.table(results);
const failed = results.filter(r => r.Result === 'FAIL').length;
console.log(`E2E_SUMMARY pass=${results.length - failed} fail=${failed}`);
process.exit(failed ? 1 : 0);
