import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
	resolve: {
		alias: {
			$core: fileURLToPath(new URL('./src/core', import.meta.url)),
			$adapters: fileURLToPath(new URL('./src/adapters', import.meta.url)),
			$composition: fileURLToPath(new URL('./src/composition', import.meta.url))
		}
	},
	test: {
		include: ['src/core/**/*.test.ts']
	}
});