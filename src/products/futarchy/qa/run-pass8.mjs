import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const directory = await mkdtemp(join(tmpdir(), 'futarchy-pass8-'));
try {
  const outfile = join(directory, 'check.cjs');
  await build({ entryPoints: [fileURLToPath(new URL('./pass8.tsx', import.meta.url))], outfile, bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', define: { 'import.meta.url': JSON.stringify(import.meta.url) }, logLevel: 'error' });
  execFileSync(process.execPath, [outfile], { stdio: 'inherit' });
} finally { await rm(directory, { recursive: true, force: true }); }
