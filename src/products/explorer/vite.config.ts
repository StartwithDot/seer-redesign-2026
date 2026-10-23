import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: new URL('.', import.meta.url).pathname,
  publicDir: '../../../public',
  base: './',
  plugins: [react()],
  build: {
    assetsInlineLimit: 0,
    outDir: './.preview-dist',
    emptyOutDir: true,
    rollupOptions: {
      input: new URL('./preview.html', import.meta.url).pathname,
    },
  },
});
