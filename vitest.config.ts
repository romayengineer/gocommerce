import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const pkg = (name: string) => fileURLToPath(new URL(`./packages/${name}/src`, import.meta.url));

export default defineConfig({
	plugins: [svelte()],
	resolve: {
		conditions: ['browser'],
		alias: {
			$lib: fileURLToPath(new URL('./packages/ui/src', import.meta.url)),
			'@gocommerce/domain': pkg('domain'),
			'@gocommerce/ports': pkg('ports'),
			'@gocommerce/config': pkg('config'),
			'@gocommerce/application': pkg('application'),
			'@gocommerce/adapters': pkg('adapters'),
			'@gocommerce/composition': pkg('composition'),
			'@gocommerce/ui': pkg('ui')
		}
	},
	test: {
		include: ['src/**/*.test.ts', 'src/**/*.test.svelte.ts', 'packages/**/*.test.ts'],
		environment: 'jsdom'
	}
});
