import importPlugin from 'eslint-plugin-import';
import tsParser from '@typescript-eslint/parser';
import svelteParser from 'svelte-eslint-parser';

const extraneousRule = [
	'error',
	{
		devDependencies: [
			'**/*.test.{js,ts}',
			'**/*.spec.{js,ts}',
			'**/*.config.{js,ts,mjs}',
			'**/vitest.config.*',
			'vercel.ts',
			'scripts/**',
			'eslint.config.js'
		],
		optionalDependencies: false,
		peerDependencies: true,
		includeInternal: false,
		includeTypes: true
	}
];

export default [
	{
		ignores: ['node_modules/**', 'build/**', '.svelte-kit/**', 'static/**', '.beads/**', 'draft/**']
	},
	{
		files: ['**/*.ts', '**/*.js', '**/*.mjs'],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module'
		},
		plugins: { import: importPlugin },
		rules: {
			'import/no-extraneous-dependencies': extraneousRule
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser,
				ecmaVersion: 'latest',
				sourceType: 'module'
			}
		},
		plugins: { import: importPlugin },
		rules: {
			'import/no-extraneous-dependencies': extraneousRule
		}
	}
];
