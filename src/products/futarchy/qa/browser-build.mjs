import { build } from 'vite';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const qa = dirname(fileURLToPath(import.meta.url));
const project = resolve(qa, '../../../..');

export async function buildBrowserPage() {
  const directory = await mkdtemp(join(tmpdir(), 'futarchy-pass8-browser-'));
  try {
    const result = await build({
      root: project, configFile: false, envFile: false, publicDir: false,
      build: {
        outDir: directory, emptyOutDir: false, assetsInlineLimit: 0,
        rollupOptions: { input: join(qa, 'browser-entry.tsx'), output: { entryFileNames: 'app.js', chunkFileNames: 'chunks/[name]-[hash].js', assetFileNames: 'assets/[name]-[hash][extname]' } },
      },
      logLevel: 'warn',
    });
    const bundles = Array.isArray(result) ? result : [result];
    const styles = bundles.flatMap(bundle => bundle.output).filter(item => item.type === 'asset' && item.fileName.endsWith('.css')).map(item => `<link rel="stylesheet" href="/${item.fileName}">`).join('');
    await writeFile(join(directory, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">${styles}<style>body{margin:0}html{scroll-padding-top:100px}</style></head><body><div id="root"></div><script type="module" src="/app.js"></script></body></html>`);
    return {
      directory,
      async read(path) {
        const relative = decodeURIComponent(path).replace(/^\/+/, '');
        const resolved = resolve(directory, relative);
        if (!resolved.startsWith(`${directory}/`)) throw new Error('QA path outside build');
        return readFile(resolved);
      },
      close: () => rm(directory, { recursive: true, force: true }),
    };
  } catch (error) { await rm(directory, { recursive: true, force: true }); throw error; }
}
