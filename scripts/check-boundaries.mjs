/**
 * Layer boundary guardrail (see epic gocommerce-dnb).
 *
 * Enforces the package dependency DAG of the layered architecture:
 *
 *   domain (innermost, zod only) <- ports (type-only) <- application
 *   (domain+ports+adapters-memory defaults; owns narrow *Options, no config)
 *   <- adapters + adapters-maps (siblings, never import each other; maps owns
 *   leaflet/google SDKs, SDK payloads load lazily inside each service)
 *   adapters-memory (ports' in-memory defaults, ports types only)
 *   composition (root: wires everything incl. AppConfig -> options mapping)
 *   config (schemas + zod, no workspace imports) | ui (presentation)
 *
 * Documented exceptions:
 * - ports -> domain is TYPE-ONLY (e.g. MapService uses ShippingCoordinates).
 *   Value objects are shared by reference to avoid type drift; `import type`
 *   emits no runtime coupling. Declared as peer+dev, not runtime deps.
 * - ui -> @gocommerce/composition/view (services/stores) + @gocommerce/domain/*
 *   (pure helpers) + @gocommerce/ports/* (types) directly; never
 *   /container, /domain via view proxy, /ports via view proxy, /application,
 *   /config, or /adapters. Wiring lives in composition, pure logic in domain.
 * - src/routes (app shell) -> @gocommerce/composition/view + $lib +
 *   presentation libs only (rule 8).
 * - *.test.* files may cross layers to build fixtures/mocks, and may use
 *   devDependencies.
 * - Every non-relative import in non-test sources (static or dynamic
 *   import()) must resolve to a declared dependency or peerDependency of
 *   that package (rule 9, extraneous-dependency check).
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
const DYNAMIC_IMPORT_RE = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

function importsOf(file) {
	const content = readFileSync(file, 'utf8');
	const found = [];
	let m;
	while ((m = IMPORT_RE.exec(content))) found.push({ spec: m[1], typeOnly: m[0].includes('import type') });
	while ((m = DYNAMIC_IMPORT_RE.exec(content))) found.push({ spec: m[1], typeOnly: false });
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

// 2. ports: type-only; no value imports, no runtime of its own (defaults
// live in adapters-memory). Domain imports must be type-only.
for (const f of collect('ports')) {
	const { content, found } = importsOf(f);
	for (const i of found) {
		if (/^@gocommerce\/(application|adapters|ui|composition|config)/.test(i.spec))
			violation(f, `ports must not import ${i.spec}`);
		if (i.spec.startsWith('@gocommerce/domain/') && !i.typeOnly)
			violation(f, `ports->domain must be import type (found value import of ${i.spec})`);
	}
	if (!allowTests(f)) {
		for (const b of bareImports(f, found)) violation(f, `ports must be dependency-free (found ${b})`);
		// No runtime exports: interfaces and `export type` only.
		const hasValueExport = content
			.split('\n')
			.some(
				(line) =>
					/^\s*export\s+(const|let|var|function|async\s+function|class|default|=\s*)/.test(line) ||
					(/^\s*export\s*\{/.test(line) && !/^\s*export\s+type\b/.test(line))
			);
		if (hasValueExport) violation(f, `ports must be type-only (found value export)`);
	}
}

// 3. application: no adapters/ui/composition/config (narrow options owned here,
// composition maps AppConfig -> options). Documented exception: the in-memory
// store defaults in adapters-memory (ports' sibling impl, dependency-free).
for (const f of collect('application')) {
	const { found } = importsOf(f);
	for (const i of found) {
		if (i.spec.startsWith('@gocommerce/adapters-memory/')) continue;
		if (/^@gocommerce\/(adapters|ui|composition|config)/.test(i.spec)) violation(f, `application must not import ${i.spec}`);
	}
	if (!allowTests(f)) {
		for (const b of bareImports(f, found)) violation(f, `application must have no third-party deps (found ${b})`);
	}
}

// 4. adapters + adapters-maps: no application/ui/composition (siblings must
// not import each other); $app/* only in adapters svelte/router.
for (const f of collect('adapters')) {
	const { found } = importsOf(f);
	for (const i of found) {
		if (/^@gocommerce\/(application|ui|composition|adapters-maps)/.test(i.spec))
			violation(f, `adapters must not import ${i.spec}`);
		if (i.spec.startsWith('$app/') && !f.endsWith('svelte/router.svelte.ts'))
			violation(f, `$app/* coupling must live in svelte/router.svelte.ts (found in ${rel(f)})`);
	}
}
for (const f of collect('adapters-maps')) {
	const { found } = importsOf(f);
	for (const i of found) {
		if (/^@gocommerce\/(application|ui|composition)/.test(i.spec) || /^@gocommerce\/adapters\//.test(i.spec))
			violation(f, `adapters-maps must not import ${i.spec}`);
		if (i.spec.startsWith('$app/')) violation(f, `adapters-maps must not import ${i.spec}`);
	}
}

// 4b. adapters-memory: ports types only; the dependency-free in-memory
// defaults. Must not import anything else in the workspace.
for (const f of collect('adapters-memory')) {
	const { found } = importsOf(f);
	for (const i of found) {
		if (i.spec.startsWith('@gocommerce/ports/')) continue;
		if (i.spec.startsWith('@gocommerce/'))
			violation(f, `adapters-memory must only import @gocommerce/ports/* (found ${i.spec})`);
	}
	if (!allowTests(f)) {
		for (const b of bareImports(f, found)) violation(f, `adapters-memory must be dependency-free (found ${b})`);
	}
}

// 5. ui (non-test): no application/config/adapters; composition only via
// /view; pure domain helpers + ports types imported directly.
for (const f of collect('ui')) {
	if (allowTests(f)) continue;
	const { found } = importsOf(f);
	for (const i of found) {
		if (/^@gocommerce\/(application|config|adapters)/.test(i.spec)) violation(f, `ui must not import ${i.spec}`);
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

// 7. config: standalone except zod (schemas validated here, like domain).
for (const f of collect('config')) {
	const { found } = importsOf(f);
	for (const i of found) {
		if (i.spec.startsWith('@gocommerce/config/')) continue; // self in tests ok
		if (i.spec.startsWith('@gocommerce/'))
			violation(f, `config must not import ${i.spec}`);
	}
	if (!allowTests(f)) {
		for (const b of bareImports(f, found)) {
			const root = b.split('/')[0];
			if (root !== 'zod') violation(f, `config must only depend on zod (found ${b})`);
		}
	}
}

// 8. src/routes (app shell): consume composition/view + $lib + presentation
// libs only; never reach past the view into domain/ports/application/adapters.
const ROUTES_DIR = join(ROOT, 'src', 'routes');
function collectRoutes() {
	const out = [];
	const walk = (dir) => {
		for (const e of readdirSync(dir, { withFileTypes: true })) {
			const p = join(dir, e.name);
			if (e.isDirectory()) walk(p);
			else if (/\.(ts|svelte)$/.test(e.name)) out.push(p);
		}
	};
	if (existsSync(ROUTES_DIR)) walk(ROUTES_DIR);
	return out;
}
for (const f of collectRoutes()) {
	const { found } = importsOf(f);
	for (const i of found) {
		if (/^@gocommerce\/(domain|ports|application|adapters|config)/.test(i.spec))
			violation(f, `routes must only consume @gocommerce/composition/view (found ${i.spec})`);
		if (i.spec.startsWith('@gocommerce/composition/') && i.spec !== '@gocommerce/composition/view')
			violation(f, `routes must only consume @gocommerce/composition/view (found ${i.spec})`);
		if (i.spec.startsWith('@gocommerce/ui/'))
			violation(f, `routes must import UI via $lib, not ${i.spec}`);
	}
}

// 9. Extraneous-dependency check: every non-relative import in non-test
// sources must resolve to a declared dependency or peerDependency.
// (devDependencies are only visible to *.test.* files.)
function pkgManifest(pkg) {
	try {
		return JSON.parse(readFileSync(join(ROOT, 'packages', pkg, 'package.json'), 'utf8'));
	} catch {
		return {};
	}
}

/** Map an import specifier to the package name that must declare it. */
function specToPackage(spec) {
	if (spec.startsWith('@gocommerce/')) return spec.split('/').slice(0, 2).join('/');
	if (spec.startsWith('$app/')) return '@sveltejs/kit';
	if (spec === 'svelte' || spec.startsWith('svelte/')) return 'svelte';
	if (spec.startsWith('@types/')) return spec.split('/').slice(0, 2).join('/');
	if (spec.startsWith('@')) return spec.split('/').slice(0, 2).join('/');
	return spec.split('/')[0];
}

const warnings = [];
for (const pkg of ['domain', 'ports', 'application', 'adapters', 'adapters-maps', 'adapters-memory', 'composition', 'ui', 'config']) {
	const manifest = pkgManifest(pkg);
	const allowed = new Set([
		...Object.keys(manifest.dependencies ?? {}),
		...Object.keys(manifest.peerDependencies ?? {})
	]);
	const used = new Set();
	for (const f of collect(pkg)) {
		if (allowTests(f)) continue;
		const { found } = importsOf(f);
		for (const i of found) {
			if (i.spec.startsWith('.') || i.spec.startsWith('$') || i.spec.endsWith('.json')) continue;
			const name = specToPackage(i.spec);
			if (name === `@gocommerce/${pkg}`) continue; // self-import within the package
			used.add(name);
			if (!allowed.has(name))
				violation(f, `${pkg} imports extraneous dependency ${i.spec} (declare ${name} or route via composition/view)`);
		}
	}
	for (const name of Object.keys(manifest.dependencies ?? {})) {
		if (!used.has(name) && !name.startsWith('@gocommerce/'))
			warnings.push(`${pkg}: declared dependency ${name} is never imported in non-test sources`);
	}
}

if (failures.length > 0) {
	console.error(`Boundary violations (${failures.length}):\n- ${failures.join('\n- ')}`);
	process.exit(1);
}
for (const w of warnings) console.warn(`warning: ${w}`);
console.log('Boundaries OK: domain/ports/application/adapters/adapters-maps/adapters-memory/composition/config/ui/src-routes conform to the DAG.');
