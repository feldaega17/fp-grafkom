import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures relative paths are used in build
  build: {
    assetsDir: 'assets', // Puts assets in dist/assets
  }
});