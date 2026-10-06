#!/usr/bin/env node
// Guard: `src/core` must stay framework-agnostic.
// It must not import Svelte/SvelteKit, read `import.meta.env`, or reach outside
// the core folder. This keeps the logic fully portable to other UI frameworks.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const coreDir = join(root, 'src', 'core');

const forbiddenSpecifiers = (specifier) =>
	specifier === 'svelte' ||
	specifier.startsWith('svelte/') ||
	specifier.startsWith('$app/') ||
	specifier.startsWith('$adapters/') ||
	specifier.startsWith('$composition/') ||
	/node_modules[\\/]svelte/.test(specifier);

function walk(dir) {
	return readdirSync(dir).flatMap((entry) => {
		const path = join(dir, entry);
		return statSync(path).isDirectory() ? walk(path) : [path];
	});
}

let errors = 0;

const coreFiles = walk(coreDir).filter(
	(f) => /\.ts$/.test(f) && !f.endsWith('.test.ts')
);

for (const file of coreFiles) {
	const source = readFileSync(file, 'utf8');
	const dir = dirname(file);

	for (const match of source.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
		const specifier = match[1];

		if (forbiddenSpecifiers(specifier)) {
			errors++;
			console.error(`[boundaries] ${relative(root, file)} imports forbidden module: ${specifier}`);
			continue;
		}

		if (specifier.startsWith('.')) {
			const target = resolve(dir, specifier);
			if (target !== coreDir && !target.startsWith(coreDir + sep)) {
				errors++;
				console.error(`[boundaries] ${relative(root, file)} imports outside core: ${specifier}`);
			}
		}
	}

	if (source.includes('import.meta.env')) {
		errors++;
		console.error(`[boundaries] ${relative(root, file)} uses import.meta.env`);
	}
}

if (errors > 0) {
	console.error(`\nBoundary check failed with ${errors} error(s). src/core must stay framework-agnostic.`);
	process.exit(1);
}
console.log('Boundary check passed: src/core is framework-agnostic.');