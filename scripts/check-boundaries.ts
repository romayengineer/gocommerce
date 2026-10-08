/**
 * Layer boundary guardrail (see epic gocommerce-pcp).
 *
 * Enforces the package dependency DAG of the layered architecture:
 *
 *   domain (innermost, zod only; owns geography values in domain/geo)
 *   <- ports (type-only; re-exports domain/geo types, owns ColumnsForWidthFn)
 *   <- application (domain+ports only; stores/codec injected via
 *   ports/StoreFactory and ports/StorageCodec, composition supplies
 *   foundation defaults)
 *   <- adapters + adapters-maps (siblings, never import each other; maps owns
 *   leaflet/google SDKs, SDK payloads load lazily inside each service;
 *   geo values come from domain/geo, never foundation)
 *   foundation (ports' dependency-free runtime kernel: stores, storage,
 *   logger, clock; ports types only)
 *   composition (root: wires everything incl. AppConfig -> options mapping;
 *   the barrel exposes createContainer only — the wired singleton + Svelte
 *   bridges live behind the @gocommerce/composition/view deep path)
 *   config (schemas + zod, no workspace imports) | ui (presentation)
 *
 * Documented exceptions:
 * - ports -> domain is TYPE-ONLY (e.g. MapService re-exports domain/geo;
 *   MapLocationService uses ShippingCoordinates). Value objects are shared
 *   by reference to avoid type drift; `import type` emits no runtime
 *   coupling. Declared as peer+dev, not runtime deps.
 * - ui-core implements ColumnsForWidthFn by structural match (no workspace
 *   import; rule 4c forbids it). The port owns the signature.
 * - ui -> @gocommerce/composition/view (services/stores) + @gocommerce/ui-core/*
 *   (presentation values) + @gocommerce/domain/* + @gocommerce/ports/*
 *   (types via `import type` only; value imports from domain fail); never
 *   /container, /domain via view proxy, /ports via view proxy, /application,
 *   /config, /adapters, or /foundation. Wiring lives in composition,
 *   presentation values in ui-core, pure logic in domain.
 * - src/routes (app shell) -> @gocommerce/composition/view + $lib +
 *   presentation libs only (rule 8).
 * - *.test.* files may cross layers to build fixtures/mocks, and may use
 *   devDependencies.
 * - Every non-relative import in non-test sources (static or dynamic
 *   import()) must resolve to a declared dependency or peerDependency of
 *   that package (rule 9, extraneous-dependency check).
 *
 * Usage: `npm run check:boundaries` (exit 0 = clean, 1 = violations).
 * Runs on Node >=22.18 native type-stripping; erasable syntax only.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

interface ImportRef {
	spec: string;
	typeOnly: boolean;
}

interface FileImports {
	content: string;
	found: ImportRef[];
}

interface PackageManifest {
	dependencies?: Record<string, string>;
	peerDependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
}

type CheckedPackage =
	| 'domain'
	| 'ports'
	| 'application'
	| 'adapters'
	| 'adapters-maps'
	| 'foundation'
	| 'ui-core'
	| 'composition'
	| 'ui'
	| 'config';

const CHECKED_PACKAGES: readonly CheckedPackage[] = [
	'domain',
	'ports',
	'application',
	'adapters',
	'adapters-maps',
	'foundation',
	'ui-core',
	'composition',
	'ui',
	'config'
];

const ROOT: string = new URL('..', import.meta.url).pathname;
const SRC = (pkg: CheckedPackage): string => join(ROOT, 'packages', pkg, 'src');

function collect(pkg: CheckedPackage): string[] {
	const out: string[] = [];
	const walk = (dir: string): void => {
		for (const e of readdirSync(dir, { withFileTypes: true })) {
			const p: string = join(dir, e.name);
			if (e.isDirectory()) walk(p);
			else if (/\.(ts|svelte)$/.test(e.name)) out.push(p);
		}
	};
	if (existsSync(SRC(pkg))) walk(SRC(pkg));
	return out;
}

const IMPORT_RE: RegExp = /import\s+(?:type\s+)?(?:[^'"]*?\sfrom\s+)?['"]([^'"]+)['"]/g;
const DYNAMIC_IMPORT_RE: RegExp = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

function importsOf(file: string): FileImports {
	const content: string = readFileSync(file, 'utf8');
	const found: ImportRef[] = [];
	let m: RegExpExecArray | null;
	// Group 1 is required by both patterns, so it always participates on match.
	while ((m = IMPORT_RE.exec(content))) found.push({ spec: m[1] ?? '', typeOnly: m[0].includes('import type') });
	while ((m = DYNAMIC_IMPORT_RE.exec(content))) found.push({ spec: m[1] ?? '', typeOnly: false });
	return { content, found };
}

const rel = (f: string): string => f.replace(ROOT, '');
const failures: string[] = [];
const warnings: string[] = [];
const allowTests = (file: string): boolean => /\.test\.(ts|svelte\.ts)$/.test(file);

function violation(file: string, detail: string): void {
	failures.push(`${rel(file)}: ${detail}`);
}

function bareImports(file: string, found: ImportRef[]): string[] {
	void file;
	return found
		.filter((i: ImportRef) => !i.spec.startsWith('.') && !i.spec.startsWith('$') && !i.spec.startsWith('@gocommerce/'))
		.map((i: ImportRef) => i.spec);
}

// 1. domain: only zod + relative; no outward @gocommerce imports (self in tests ok).
for (const f of collect('domain')) {
	const { found }: FileImports = importsOf(f);
	for (const i of found) {
		if (i.spec.startsWith('@gocommerce/') && !i.spec.startsWith('@gocommerce/domain/'))
			violation(f, `domain must not import ${i.spec}`);
	}
	if (!allowTests(f)) {
		for (const b of bareImports(f, found)) {
			const root: string = firstSegment(b) === '@types' ? b.split('/').slice(0, 2).join('/') : firstSegment(b);
			if (root !== 'zod') violation(f, `domain must only depend on zod (found ${b})`);
		}
	}
}

// 2. ports: type-only; no value imports, no runtime of its own (defaults
// live in foundation). Domain imports must be type-only.
for (const f of collect('ports')) {
	const { content, found }: FileImports = importsOf(f);
	for (const i of found) {
		if (/^@gocommerce\/(application|adapters|ui|composition|config)/.test(i.spec))
			violation(f, `ports must not import ${i.spec}`);
		if (i.spec.startsWith('@gocommerce/domain/') && !i.typeOnly)
			violation(f, `ports->domain must be import type (found value import of ${i.spec})`);
	}
	if (!allowTests(f)) {
		for (const b of bareImports(f, found)) violation(f, `ports must be dependency-free (found ${b})`);
		// No runtime exports: interfaces and `export type` only.
		const hasValueExport: boolean = content
			.split('\n')
			.some(
				(line: string) =>
					/^\s*export\s+(const|let|var|function|async\s+function|class|default|=\s*)/.test(line) ||
					(/^\s*export\s*\{/.test(line) && !/^\s*export\s+type\b/.test(line))
			);
		if (hasValueExport) violation(f, `ports must be type-only (found value export)`);
	}
}

// 3. application: no adapters (incl. foundation)/ui/composition/config.
// Stores and JSON codec arrive via ports/StoreFactory + ports/StorageCodec
// (type-only) and are injected by composition — never value-imported here.
// Tests may import foundation fakes via devDependencies (documented exception).
for (const f of collect('application')) {
	if (allowTests(f)) continue;
	const { found }: FileImports = importsOf(f);
	for (const i of found) {
		if (/^@gocommerce\/(adapters|foundation|ui\/|composition|config)/.test(i.spec))
			violation(f, `application must not import ${i.spec} (inject StoreFactory/StorageCodec via ports instead)`);
	}
	for (const b of bareImports(f, found)) violation(f, `application must have no third-party deps (found ${b})`);
}

// 4. adapters + adapters-maps: no application/ui/composition (siblings must
// not import each other); $app/* only in adapters svelte/router.
for (const f of collect('adapters')) {
	const { found }: FileImports = importsOf(f);
	for (const i of found) {
		// NOTE: `ui/` (with slash) so @gocommerce/ui-core stays allowed.
		if (/^@gocommerce\/(application|ui\/|composition|adapters-maps)/.test(i.spec))
			violation(f, `adapters must not import ${i.spec}`);
		if (i.spec.startsWith('$app/') && !f.endsWith('svelte/router.svelte.ts'))
			violation(f, `$app/* coupling must live in svelte/router.svelte.ts (found in ${rel(f)})`);
	}
}
for (const f of collect('adapters-maps')) {
	const { found }: FileImports = importsOf(f);
	for (const i of found) {
		if (/^@gocommerce\/(application|ui|composition)/.test(i.spec) || /^@gocommerce\/adapters\//.test(i.spec))
			violation(f, `adapters-maps must not import ${i.spec}`);
		if (i.spec.startsWith('$app/')) violation(f, `adapters-maps must not import ${i.spec}`);
	}
}

// 4b. foundation: ports types only; the dependency-free runtime kernel.
// Must not import anything else in the workspace.
for (const f of collect('foundation')) {
	const { found }: FileImports = importsOf(f);
	for (const i of found) {
		if (i.spec.startsWith('@gocommerce/ports/')) continue;
		if (i.spec.startsWith('@gocommerce/'))
			violation(f, `foundation must only import @gocommerce/ports/* (found ${i.spec})`);
	}
	if (!allowTests(f)) {
		for (const b of bareImports(f, found)) violation(f, `foundation must be dependency-free (found ${b})`);
	}
}

// 4c. ui-core: dependency-free presentation helpers (grid, viewport, url).
// No workspace imports, no third-party deps.
for (const f of collect('ui-core')) {
	const { found }: FileImports = importsOf(f);
	for (const i of found) {
		if (i.spec.startsWith('@gocommerce/'))
			violation(f, `ui-core must not import ${i.spec}`);
	}
	if (!allowTests(f)) {
		for (const b of bareImports(f, found)) violation(f, `ui-core must be dependency-free (found ${b})`);
	}
}

// 4d. Geography single owner: map values live in @gocommerce/domain/geo.
// The old @gocommerce/foundation/maps path is gone; flag any resurrection.
for (const pkg of CHECKED_PACKAGES) {
	for (const f of collect(pkg)) {
		const { found }: FileImports = importsOf(f);
		for (const i of found) {
			if (i.spec.startsWith('@gocommerce/foundation/maps'))
				violation(f, `geo values moved to @gocommerce/domain/geo (found ${i.spec})`);
		}
	}
}

// 5. ui (non-test): no application/config/adapters/foundation; composition
// only via /view; domain + ports types imported directly (import type only)
// — value helpers come via composition/view or @gocommerce/ui-core/*.
for (const f of collect('ui')) {
	if (allowTests(f)) continue;
	const { found }: FileImports = importsOf(f);
	for (const i of found) {
		if (/^@gocommerce\/(application|config|foundation|adapters)/.test(i.spec)) violation(f, `ui must not import ${i.spec}`);
		if (i.spec.startsWith('@gocommerce/composition/') && !i.spec.endsWith('/view'))
			violation(f, `ui must only consume @gocommerce/composition/view (found ${i.spec})`);
		if (i.spec.startsWith('@gocommerce/domain/') && !i.typeOnly)
			violation(f, `ui->domain must be import type (found value import of ${i.spec})`);
	}
}

// 6. composition: wires everything; no third-party runtime imports.
for (const f of collect('composition')) {
	const { found }: FileImports = importsOf(f);
	for (const b of bareImports(f, found)) {
		if (b.endsWith('.json')) continue;
		violation(f, `composition must not depend on third-party ${b}`);
	}
}

// 7. config: standalone except zod (schemas validated here, like domain).
for (const f of collect('config')) {
	const { found }: FileImports = importsOf(f);
	for (const i of found) {
		if (i.spec.startsWith('@gocommerce/config/')) continue; // self in tests ok
		if (i.spec.startsWith('@gocommerce/'))
			violation(f, `config must not import ${i.spec}`);
	}
	if (!allowTests(f)) {
		for (const b of bareImports(f, found)) {
			const root: string = firstSegment(b);
			if (root !== 'zod') violation(f, `config must only depend on zod (found ${b})`);
		}
	}
}

// 8. src/routes (app shell): consume composition/view + $lib + presentation
// libs only; never reach past the view into domain/ports/application/adapters.
const ROUTES_DIR: string = join(ROOT, 'src', 'routes');
function collectRoutes(): string[] {
	const out: string[] = [];
	const walk = (dir: string): void => {
		for (const e of readdirSync(dir, { withFileTypes: true })) {
			const p: string = join(dir, e.name);
			if (e.isDirectory()) walk(p);
			else if (/\.(ts|svelte)$/.test(e.name)) out.push(p);
		}
	};
	if (existsSync(ROUTES_DIR)) walk(ROUTES_DIR);
	return out;
}
for (const f of collectRoutes()) {
	const { found }: FileImports = importsOf(f);
	for (const i of found) {
		if (/^@gocommerce\/(domain|ports|application|adapters|foundation|config)/.test(i.spec))
			violation(f, `routes must only consume @gocommerce/composition/view (found ${i.spec})`);
		if (i.spec.startsWith('@gocommerce/composition/') && i.spec !== '@gocommerce/composition/view')
			violation(f, `routes must only consume @gocommerce/composition/view (found ${i.spec})`);
		if (i.spec.startsWith('@gocommerce/ui/'))
			violation(f, `routes must import UI via $lib, not ${i.spec}`);
		// $app/* outside adapters is Phase 2 work (route via RouterPort
		// instead): warn, don't fail.
		if (i.spec.startsWith('$app/'))
			warnings.push(`${rel(f)}: $app/* outside adapters (Phase 2: route via RouterPort instead)`);
	}
}

// 9. Extraneous-dependency check: every non-relative import in non-test
// sources must resolve to a declared dependency or peerDependency.
// (devDependencies are only visible to *.test.* files.)
function pkgManifest(pkg: CheckedPackage): PackageManifest {
	try {
		return JSON.parse(readFileSync(join(ROOT, 'packages', pkg, 'package.json'), 'utf8')) as PackageManifest;
	} catch {
		return {};
	}
}

/** First `/`-separated segment (`String.split` always yields ≥1 element). */
function firstSegment(spec: string): string {
	return spec.split('/')[0] ?? spec;
}

/** Map an import specifier to the package name that must declare it. */
function specToPackage(spec: string): string {
	if (spec.startsWith('@gocommerce/')) return spec.split('/').slice(0, 2).join('/');
	if (spec.startsWith('$app/')) return '@sveltejs/kit';
	if (spec === 'svelte' || spec.startsWith('svelte/')) return 'svelte';
	if (spec.startsWith('@types/')) return spec.split('/').slice(0, 2).join('/');
	if (spec.startsWith('@')) return spec.split('/').slice(0, 2).join('/');
	return firstSegment(spec);
}

for (const pkg of CHECKED_PACKAGES) {
	const manifest: PackageManifest = pkgManifest(pkg);
	const allowed: Set<string> = new Set<string>([
		...Object.keys(manifest.dependencies ?? {}),
		...Object.keys(manifest.peerDependencies ?? {})
	]);
	const used: Set<string> = new Set<string>();
	const usedAsValue: Set<string> = new Set<string>();
	for (const f of collect(pkg)) {
		if (allowTests(f)) continue;
		const { found }: FileImports = importsOf(f);
		for (const i of found) {
			if (i.spec.startsWith('.') || i.spec.startsWith('$') || i.spec.endsWith('.json')) continue;
			const name: string = specToPackage(i.spec);
			if (name === `@gocommerce/${pkg}`) continue; // self-import within the package
			used.add(name);
			if (!i.typeOnly) usedAsValue.add(name);
			if (!allowed.has(name))
				violation(f, `${pkg} imports extraneous dependency ${i.spec} (declare ${name} or route via composition/view)`);
		}
	}
	for (const name of Object.keys(manifest.dependencies ?? {})) {
		if (!used.has(name))
			warnings.push(`${pkg}: declared dependency ${name} is never imported in non-test sources`);
		else if (name.startsWith('@gocommerce/') && !usedAsValue.has(name))
			violation(
				collect(pkg)[0] ?? `packages/${pkg}/package.json`,
				`${pkg} declares runtime dependency ${name} but only ever uses import type (move to peerDependencies)`
			);
	}
}

// 10. No bare barrel imports: non-test sources must use deep paths
// (@gocommerce/<pkg>/<module>), never the package root, so bundlers can
// tree-shake and dependencies stay explicit.
const BARREL_RE: RegExp = /^@gocommerce\/[a-z-]+$/;
for (const pkg of CHECKED_PACKAGES) {
	for (const f of collect(pkg)) {
		if (allowTests(f)) continue;
		const { found }: FileImports = importsOf(f);
		for (const i of found) {
			if (BARREL_RE.test(i.spec))
				violation(f, `${pkg} must use deep imports (found bare barrel ${i.spec})`);
		}
	}
}

if (failures.length > 0) {
	console.error(`Boundary violations (${failures.length}):\n- ${failures.join('\n- ')}`);
	process.exit(1);
}
for (const w of warnings) console.warn(`warning: ${w}`);
console.log('Boundaries OK: domain/ports/application/adapters/adapters-maps/foundation/ui-core/composition/config/ui/src-routes conform to the DAG.');
