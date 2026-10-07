#!/usr/bin/env node
// Guards two architectural boundaries:
//
// 1. `src/core` must stay framework-agnostic. It must not import Svelte/SvelteKit,
//    read `import.meta.env`, or reach outside the core folder.
// 2. The view layer is layered: `src/lib/ui` primitives must not depend on feature
//    folders, and only the `view.ts` facade may reach the composition root.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const coreDir = join(root, 'src', 'core');
const libDir = join(root, 'src', 'lib');
const uiDir = join(libDir, 'ui');
const routesDir = join(root, 'src', 'routes');

function walk(dir) {
	return readdirSync(dir).flatMap((entry) => {
		const path = join(dir, entry);
		return statSync(path).isDirectory() ? walk(path) : [path];
	});
}

let errors = 0;

function fail(message) {
	errors++;
	console.error(`[boundaries] ${message}`);
}

function specifiers(file) {
	const source = readFileSync(file, 'utf8');
	return {
		source,
		list: [...source.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1])
	};
}

const coreForbidden = (specifier) =>
	specifier === 'svelte' ||
	specifier.startsWith('svelte/') ||
	specifier.startsWith('$app/') ||
	specifier.startsWith('$adapters/') ||
	specifier.startsWith('$composition/') ||
	specifier.startsWith('$lib/') ||
	/node_modules[\\/]svelte/.test(specifier);

for (const file of walk(coreDir).filter((f) => /\.ts$/.test(f) && !f.endsWith('.test.ts'))) {
	const dir = dirname(file);
	const { source, list } = specifiers(file);

	for (const specifier of list) {
		if (coreForbidden(specifier)) {
			fail(`${relative(root, file)} imports forbidden module: ${specifier}`);
			continue;
		}
		if (specifier.startsWith('.')) {
			const target = resolve(dir, specifier);
			if (target !== coreDir && !target.startsWith(coreDir + sep)) {
				fail(`${relative(root, file)} imports outside core: ${specifier}`);
			}
		}
	}

	if (source.includes('import.meta.env')) {
		fail(`${relative(root, file)} uses import.meta.env`);
	}
}

const featureDirs = ['catalog', 'cart', 'checkout', 'payment', 'layout'];
const featureImport = new RegExp(`(^|/)(${featureDirs.join('|')})/`);

for (const file of walk(uiDir).filter((f) => /\.svelte$/.test(f))) {
	for (const specifier of specifiers(file).list) {
		if (featureImport.test(specifier) || /^\$lib\/(catalog|cart|checkout|payment|layout)/.test(specifier)) {
			fail(`${relative(root, file)} (ui primitive) must not depend on a feature module: ${specifier}`);
		}
	}
}

for (const file of [...walk(libDir), ...walk(routesDir)].filter((f) => !f.endsWith('view.ts'))) {
	const { list } = specifiers(file);
	for (const specifier of list) {
		if (specifier.startsWith('$composition/')) {
			fail(`${relative(root, file)} imports the composition root directly; use $lib/view`);
		}
	}
}

if (errors > 0) {
	console.error(`\nBoundary check failed with ${errors} error(s).`);
	process.exit(1);
}
console.log('Boundary check passed: core is framework-agnostic and the view layer is layered.');
