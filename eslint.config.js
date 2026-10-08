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

// Editor-time mirror of scripts/check-boundaries.ts (CI source of truth).
// Each entry denies the workspace imports that the boundary script forbids
// for that layer. `*.test.*` files are exempted (last block) so fixtures and
// mocks keep crossing layers.
const TS = '**/*.ts';
const SVELTE = '**/*.svelte';

/** Expand workspace segments to bare + deep minimatch groups. */
const ws = (...segs) => segs.flatMap((s) => [`@gocommerce/${s}`, `@gocommerce/${s}/**`]);
/** `@gocommerce/adapters` + `@gocommerce/adapters-maps` (never foundation/ui-core). */
const ADAPTERS_ANY = ['@gocommerce/adapters*', '@gocommerce/adapters*/**'];
/** Exact `@gocommerce/ui` (never `@gocommerce/ui-core`). */
const UI_EXACT = ['@gocommerce/ui', '@gocommerce/ui/**'];
/** Split feature packages (never `@gocommerce/ui-core`, which stays dependency-free). */
const UI_SPLIT = [...ws('ui-primitives', 'ui-catalog', 'ui-purchase', 'ui-shell')];
/** Any presentation package: old barrel + split features (never ui-core). */
const UI_ANY = [...UI_EXACT, ...UI_SPLIT];
/** Composition entries presentation layers must not reach past the view.
 * (No bare `@gocommerce/composition` here: gitignore semantics would also
 * ban `/view`. The bare barrel stays banned via check-boundaries.ts rule 10.) */
const COMPOSITION_INTERNALS = [
	'@gocommerce/composition/container',
	'@gocommerce/composition/index',
	'@gocommerce/composition/data/**'
];

const boundary = (files, patterns) => ({
	files,
	rules: { 'no-restricted-imports': ['error', { patterns }] }
});

const layerBoundaries = [
	// 1. domain: zod only (+ relative); no outward workspace imports.
	boundary(['packages/domain/src/**'], [
		{
			group: [...ws('ports', 'application', 'config', 'composition', 'foundation', 'ui-core'), ...ADAPTERS_ANY, ...UI_ANY],
			message: 'domain must not import workspace packages (zod + relative only). See check-boundaries.ts rule 1.'
		}
	]),
	// 2. ports: type-only; domain imports must be `import type`.
	boundary(['packages/ports/src/**'], [
		{
			group: [...ws('application', 'composition', 'config', 'foundation'), ...ADAPTERS_ANY, ...UI_ANY],
			message: 'ports must not import outer layers (type-only interfaces). See check-boundaries.ts rule 2.'
		},
		{
			group: ws('domain'),
			allowTypeImports: true,
			message: 'ports->domain must be `import type` (shared value objects, no runtime coupling). See check-boundaries.ts rule 2.'
		}
	]),
	// 3. application: domain + ports types only; never adapters/ui/composition/config.
	boundary([`packages/application/src/${TS}`, `packages/application/src/${SVELTE}`], [
		{
			group: [...ws('composition', 'config', 'foundation'), ...ADAPTERS_ANY, ...UI_ANY],
			message: 'application must not import adapters/ui/composition/config (inject via ports instead). See check-boundaries.ts rule 3.'
		}
	]),
	// 4. adapters: siblings must not import each other; $app/* only in the router.
	boundary([`packages/adapters/src/${TS}`, `packages/adapters/src/${SVELTE}`], [
		{
			group: [...ws('application', 'composition'), ...UI_ANY, '@gocommerce/adapters-maps', '@gocommerce/adapters-maps/**', '$app/**'],
			message: 'adapters must not import application/ui/composition/adapters-maps; $app/* lives only in svelte/router.svelte.ts. See check-boundaries.ts rule 4.'
		}
	]),
	{
		files: ['packages/adapters/src/svelte/router.svelte.ts'],
		rules: {
			'no-restricted-imports': [
				'error',
				{
					patterns: [
						{
							group: [...ws('application', 'composition'), ...UI_ANY, '@gocommerce/adapters-maps', '@gocommerce/adapters-maps/**'],
							message: 'adapters must not import application/ui/composition/adapters-maps. See check-boundaries.ts rule 4.'
						}
					]
				}
			]
		}
	},
	// 4. adapters-maps: never adapters/application/ui/composition or $app/*.
	boundary([`packages/adapters-maps/src/${TS}`], [
		{
			group: [...ws('application', 'composition'), ...UI_ANY, '@gocommerce/adapters', '@gocommerce/adapters/**', '$app/**'],
			message: 'adapters-maps must not import adapters/application/ui/composition/$app/*. See check-boundaries.ts rule 4.'
		}
	]),
	// 4b. foundation: ports types only.
	boundary([`packages/foundation/src/${TS}`], [
		{
			group: [...ws('application', 'composition', 'config', 'domain', 'foundation', 'ui-core'), ...ADAPTERS_ANY, ...UI_ANY],
			message: 'foundation must only import @gocommerce/ports/* (import type). See check-boundaries.ts rule 4b.'
		}
	]),
	// 4c. ui-core: dependency-free presentation helpers.
	boundary([`packages/ui-core/src/${TS}`], [
		{
			group: ['@gocommerce/**'],
			message: 'ui-core must not import workspace packages (dependency-free). See check-boundaries.ts rule 4c.'
		}
	]),
	// 5. ui-*: composition only via /view; domain + ports types only.
	// ui-primitives is the leaf (no sibling imports); feature packages may
	// value-import ui-primitives but never each other.
	boundary([`packages/ui-primitives/src/${TS}`, `packages/ui-primitives/src/${SVELTE}`], [
		{
			group: [...ws('application', 'config', 'foundation'), ...ADAPTERS_ANY, ...COMPOSITION_INTERNALS, ...ws('ui-catalog', 'ui-purchase', 'ui-shell')],
			message: 'ui-primitives must only consume @gocommerce/composition/view (+ ui-core values). See check-boundaries.ts rule 5.'
		},
		{
			group: ws('domain', 'ports'),
			allowTypeImports: true,
			message: 'ui-primitives->domain/ports must be `import type` (values via composition/view or ui-core). See check-boundaries.ts rule 5.'
		}
	]),
	boundary([`packages/ui-catalog/src/${TS}`, `packages/ui-catalog/src/${SVELTE}`], [
		{
			group: [...ws('application', 'config', 'foundation'), ...ADAPTERS_ANY, ...COMPOSITION_INTERNALS, ...ws('ui-purchase', 'ui-shell')],
			message: 'ui-catalog may only value-import @gocommerce/ui-primitives (never sibling ui-*). See check-boundaries.ts rule 5.'
		},
		{
			group: ws('domain', 'ports'),
			allowTypeImports: true,
			message: 'ui-catalog->domain/ports must be `import type` (values via composition/view or ui-core). See check-boundaries.ts rule 5.'
		}
	]),
	boundary([`packages/ui-purchase/src/${TS}`, `packages/ui-purchase/src/${SVELTE}`], [
		{
			group: [...ws('application', 'config', 'foundation'), ...ADAPTERS_ANY, ...COMPOSITION_INTERNALS, ...ws('ui-catalog', 'ui-shell')],
			message: 'ui-purchase may only value-import @gocommerce/ui-primitives (never sibling ui-*). See check-boundaries.ts rule 5.'
		},
		{
			group: ws('domain', 'ports'),
			allowTypeImports: true,
			message: 'ui-purchase->domain/ports must be `import type` (values via composition/view or ui-core). See check-boundaries.ts rule 5.'
		}
	]),
	boundary([`packages/ui-shell/src/${TS}`, `packages/ui-shell/src/${SVELTE}`], [
		{
			group: [...ws('application', 'config', 'foundation'), ...ADAPTERS_ANY, ...COMPOSITION_INTERNALS, ...ws('ui-catalog', 'ui-purchase')],
			message: 'ui-shell may only value-import @gocommerce/ui-primitives (never sibling ui-*). See check-boundaries.ts rule 5.'
		},
		{
			group: ws('domain', 'ports'),
			allowTypeImports: true,
			message: 'ui-shell->domain/ports must be `import type` (values via composition/view or ui-core). See check-boundaries.ts rule 5.'
		}
	]),
	// 7. config: standalone except zod.
	boundary([`packages/config/src/${TS}`], [
		{
			group: [...ws('application', 'composition', 'domain', 'foundation', 'ports', 'ui-core'), ...ADAPTERS_ANY, ...UI_ANY],
			message: 'config must not import workspace packages (zod schemas only). See check-boundaries.ts rule 7.'
		}
	]),
	// 8. routes (app shell): composition/view + @gocommerce/ui-* scoped paths only.
	boundary([`src/routes/${TS}`, `src/routes/${SVELTE}`], [
		{
			group: [...ws('application', 'config', 'domain', 'foundation', 'ports'), ...ADAPTERS_ANY, ...UI_EXACT, ...COMPOSITION_INTERNALS],
			message: 'routes must only consume @gocommerce/composition/view + @gocommerce/ui-* scoped paths. See check-boundaries.ts rule 8.'
		}
	])
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
	},
	...layerBoundaries,
	{
		// Tests may cross layers to build fixtures/mocks (mirrors the
		// documented test exception in scripts/check-boundaries.ts).
		files: ['**/*.test.ts', '**/*.test.svelte.ts'],
		rules: {
			'no-restricted-imports': 'off'
		}
	}
];
