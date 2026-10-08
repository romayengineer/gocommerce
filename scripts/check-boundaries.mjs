/**
 * Layer boundary guardrail (see epic gocommerce-dnb).
 *
 * Enforces the package dependency DAG of the layered architecture:
 *
 *   domain (innermost, zod only) <- ports <- application <- adapters
 *   composition (root: wires everything, no third-party runtime deps)
 *   config (standalone, no imports) | ui (presentation)
 *
 * Documented exceptions:
 * - ports -> domain is TYPE-ONLY (e.g. MapService uses ShippingCoordinates).
 *   Value objects are shared by reference to avoid type drift; `import type`
 *   emits no runtime coupling.
 * - ui -> @gocommerce/composition/view ONLY (never /container): components
 *   consume the already-wired view-model; the wiring itself lives in
 *   composition, which owns those dependencies.
 * - ui -> @gocommerce/adapters/svelte/* ONLY: framework bindings (store
 *   bridge, i18n setup). Kept narrow; no application/config imports.
 * - *.test.* files may cross layers to build fixtures/mocks.
 *
 * Usage: `npm run check:boundaries` (exit 0 = clean, 1 = violations).
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = (pkg) => join(ROOT, 'packages', pkg, 'src');

function collect(pkg) {
	const out = [];
	const walk = (dir) => {
		for (const e of readdirSync(dir, { withFileTypes: true })) {
			const p = join(dir, e.name);
			if (e.isDirectory()) walk(p);
			else if (/\.(ts|svelte)$/.test(e.name)) out.push(p);
		}
	};
	if (existsSync(SRC(pkg))) walk(SRC(pkg));
	return out;
}

const IMPORT_RE = /import\s+(?:type\s+)?(?:[^'"]*?\sfrom\s+)?['"]([^'"]+)['"]/g;

function importsOf(file) {
	const content = readFileSync(file, 'utf8');
	const found = [];
	let m;
	while ((m = IMPORT_RE.exec(content))) found.push({ spec: m[1], typeOnly: m[0].includes('import type') });
	return { content, found };
}

const rel = (f) => f.replace(ROOT, '');
const failures = [];
const allowTests = (file) => /\.test\.(ts|svelte\.ts)$/.test(file);

function violation(file, detail) {
	failures.push(`${rel(file)}: ${detail}`);
}

function bareImports(file, found) {
	return found
		.filter((i) => !i.spec.startsWith('.') && !i.spec.startsWith('$') && !i.spec.startsWith('@gocommerce/'))
		.map((i) => i.spec);
}

// 1. domain: only zod + relative; no outward @gocommerce imports (self in tests ok).
for (const f of collect('domain')) {
	const { found } = importsOf(f);
	for (const i of found) {
		if (i.spec.startsWith('@gocommerce/') && !i.spec.startsWith('@gocommerce/domain/'))
			violation(f, `domain must not import ${i.spec}`);
	}
	if (!allowTests(f)) {
		for (const b of bareImports(f, found)) {
			const root = b.split('/')[0] === '@types' ? b.split('/').slice(0, 2).join('/') : b.split('/')[0];
			if (root !== 'zod') violation(f, `domain must only depend on zod (found ${b})`);
		}
	}
}

// 2. ports: framework-free; domain imports must be type-only.
for (const f of collect('ports')) {
	const { found } = importsOf(f);
	for (const i of found) {
		if (/^@gocommerce\/(application|adapters|ui|composition|config)/.test(i.spec))
			violation(f, `ports must not import ${i.spec}`);
		if (i.spec.startsWith('@gocommerce/domain/') && !i.typeOnly)
			violation(f, `ports->domain must be import type (found value import of ${i.spec})`);
	}
	if (!allowTests(f)) {
		for (const b of bareImports(f, found)) violation(f, `ports must be dependency-free (found ${b})`);
	}
}

// 3. application: no adapters/ui/composition.
for (const f of collect('application')) {
	const { found } = importsOf(f);
	for (const i of found) {
		if (/^@gocommerce\/(adapters|ui|composition)/.test(i.spec)) violation(f, `application must not import ${i.spec}`);
	}
	if (!allowTests(f)) {
		for (const b of bareImports(f, found)) violation(f, `application must have no third-party deps (found ${b})`);
	}
}

// 4. adapters: no application/ui/composition; $app/* only in svelte/router.
for (const f of collect('adapters')) {
	const { found } = importsOf(f);
	for (const i of found) {
		if (/^@gocommerce\/(application|ui|composition)/.test(i.spec))
			violation(f, `adapters must not import ${i.spec}`);
		if (i.spec.startsWith('$app/') && !f.endsWith('svelte/router.svelte.ts'))
			violation(f, `$app/* coupling must live in svelte/router.svelte.ts (found in ${rel(f)})`);
	}
}

// 5. ui (non-test): no application/config; composition only via /view.
for (const f of collect('ui')) {
	if (allowTests(f)) continue;
	const { found } = importsOf(f);
	for (const i of found) {
		if (/^@gocommerce\/(application|config)/.test(i.spec)) violation(f, `ui must not import ${i.spec}`);
		if (i.spec.startsWith('@gocommerce/composition/') && !i.spec.endsWith('/view'))
			violation(f, `ui must only consume @gocommerce/composition/view (found ${i.spec})`);
	}
}

// 6. composition: wires everything; no third-party runtime imports.
for (const f of collect('composition')) {
	const { found } = importsOf(f);
	for (const b of bareImports(f, found)) {
		if (b.endsWith('.json')) continue;
		violation(f, `composition must not depend on third-party ${b}`);
	}
}

// 7. config: standalone.
for (const f of collect('config')) {
	const { found } = importsOf(f);
	if (found.length > 0) violation(f, `config must have no imports (found ${found.map((i) => i.spec).join(', ')})`);
}

if (failures.length > 0) {
	console.error(`Boundary violations (${failures.length}):\n- ${failures.join('\n- ')}`);
	process.exit(1);
}
console.log('Boundaries OK: domain/ports/application/adapters/composition/config/ui conform to the DAG.');
