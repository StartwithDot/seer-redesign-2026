import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react()],
  publicDir: false,
  server: { host: '127.0.0.1', port: 5195 },
  build: { outDir: '/private/tmp/opportunity-art-build', emptyOutDir: true },
});
