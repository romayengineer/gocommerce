import { defineConfig, searchForWorkspaceRoot } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    sveltekit(),
    process.env.ANALYZE === 'true' &&
      visualizer({
        filename: 'stats.html',
        template: 'treemap',
        gzipSize: true,
        brotliSize: true,
        open: false
      })
  ].filter(Boolean),
  optimizeDeps: {
    include: ['@splidejs/splide'],
  },
  build: {
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    fs: {
      // kit.alias points at packages/* outside SvelteKit's default
      // serving roots (src, $lib, .svelte-kit) — allow the workspace root.
      allow: [searchForWorkspaceRoot(process.cwd())]
    },
    watch: {
      usePolling: true,
      interval: 100
    }
  }
});
