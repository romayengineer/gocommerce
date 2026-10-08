import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const pkg = (name: string) => fileURLToPath(new URL(`./packages/${name}/src`, import.meta.url));
const mock = (name: string) => fileURLToPath(new URL(`./test/mocks/${name}.ts`, import.meta.url));

export default defineConfig({
	plugins: [svelte()],
	resolve: {
		conditions: ['browser'],
		alias: {
			$lib: fileURLToPath(new URL('./packages/ui/src', import.meta.url)),
			// SvelteKit runtime modules have no server in unit tests; the
			// doubles under test/mocks stand in (page.url is mutable so tests
			// can simulate navigations).
			'$app/state': mock('app-state'),
			'$app/navigation': mock('app-navigation'),
			'@gocommerce/domain': pkg('domain'),
			'@gocommerce/ports': pkg('ports'),
			'@gocommerce/config': pkg('config'),
			'@gocommerce/application': pkg('application'),
			'@gocommerce/adapters': pkg('adapters'),
			'@gocommerce/adapters-maps': pkg('adapters-maps'),
			'@gocommerce/foundation': pkg('foundation'),
			'@gocommerce/ui-core': pkg('ui-core'),
			'@gocommerce/composition': pkg('composition'),
			'@gocommerce/ui': pkg('ui')
		}
	},
	test: {
		include: ['src/**/*.test.ts', 'src/**/*.test.svelte.ts', 'packages/**/*.test.ts'],
		environment: 'jsdom'
	}
});
