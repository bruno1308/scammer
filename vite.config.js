import { defineConfig } from 'vite';

export default defineConfig({
  base: '/scammer/',
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
