import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// A product-local document preserves seer-theme before paint and owns all risk routes.
export default defineConfig({
  root: fileURLToPath(new URL('./', import.meta.url)),
  base: '/risk/',
  publicDir: false,
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5189,
    fs: { allow: [fileURLToPath(new URL('../../../', import.meta.url))] },
  },
  build: { outDir: 'dist', emptyOutDir: true },
});
