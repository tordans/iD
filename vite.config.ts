import path from 'node:path';
import { fileURLToPath } from 'node:url';
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import { defineConfig } from 'vitest/config';
import { visualizer } from 'rollup-plugin-visualizer';
import { idCssPlugin } from './scripts/build_css';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isBuildStats = process.env.BUILD_STATS === 'true';
const isMinBuild = process.env.BUILD_MIN === 'true';

export default defineConfig(() => ({
  base: './',
  envPrefix: 'ID_',
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      '/dist': path.resolve(__dirname, 'dist'),
    },
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist()),
    },
  },
  build: {
    emptyOutDir: false,
    outDir: 'dist',
    minify: isMinBuild,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      output: {
        entryFileNames: isMinBuild ? 'iD.min.js' : 'iD.js',
        format: 'es',
      },
    },
  },
  plugins: [
    idCssPlugin(),
    ...(isBuildStats
      ? [
          visualizer({
            filename: 'docs/statistics.html',
            gzipSize: true,
            template: 'treemap',
          }) as import('vite').PluginOption,
        ]
      : []),
  ],
  test: {
    css: true,
    environment: 'jsdom',
    globals: true,
    include: ['test/spec/**/*.{js,ts}'],
    setupFiles: ['./test/spec_helpers.ts'],
  },
}));
