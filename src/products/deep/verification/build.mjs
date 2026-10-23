import { build } from 'vite';
import path from 'node:path';

const root = new URL('../', import.meta.url).pathname;
await build({
  configFile: false,
  root,
  build: {
    outDir: process.env.DEEP_BUILD_OUTPUT ?? '/private/tmp/deep-step3-scoped-build',
    lib: { entry: path.join(root, 'index.tsx'), formats: ['es'], fileName: 'deep' },
    rollupOptions: { external: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'] },
  },
});
