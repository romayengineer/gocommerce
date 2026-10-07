import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],
	resolve: {
		conditions: ['browser'],
		alias: {
			$lib: fileURLToPath(new URL('./src/lib', import.meta.url)),
			$core: fileURLToPath(new URL('./src/core', import.meta.url)),
			$adapters: fileURLToPath(new URL('./src/adapters', import.meta.url)),
			$composition: fileURLToPath(new URL('./src/composition', import.meta.url))
		}
	},
	test: {
		include: ['src/**/*.test.ts', 'src/**/*.test.svelte.ts'],
		environment: 'jsdom'
	}
});