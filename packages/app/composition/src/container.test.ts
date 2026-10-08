import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createContainer, resolveProductSeed } from '@gocommerce/composition/container';
import { ProductCatalog } from '@gocommerce/application/ProductCatalog';
import { hashSeedString, mulberry32 } from '@gocommerce/domain/random';
import { getSeedInUrl } from '@gocommerce/ui-core/url';
import { memoryStoreFactory } from '@gocommerce/foundation/store';
import type { AppConfig } from '@gocommerce/config/config';
import type { ProductsColumnar } from '@gocommerce/domain/product';
import type { Route, RouterPort } from '@gocommerce/ports/Router';

const columnar: ProductsColumnar = {
	productId: ['p1', 'p2', 'p3'],
	productName: ['Alpha', 'Beta', 'Gamma'],
	description: ['d1', 'd2', 'd3'],
	brand: ['b1', 'b2', 'b3'],
	categories: ['Perfume', 'Perfume', 'Perfume'],
	properties: ['type=X', 'type=Y', 'type=Z'],
	images_count: [1, 1, 1],
	items: ['S=100', 'S=200', 'S=300']
};

const testConfig: AppConfig = {
	imagesBaseUrl: 'https://cdn.test',
	mapProvider: 'leaflet',
	googleMapsApiKey: '',
	currency: 'ARS',
	bank: { alias: 'a', number: 'n', name: 'n', bankName: 'b' },
	view: { pageWidth: '80rem', theme: 'default' },
	shop: { name: 'ShopHub', logoUrl: '', supportEmail: '' },
	seo: { title: 'ShopHub', description: 'An ecommerce store', themeColor: '#2563eb' },
	hero: { enabled: true, ctaHref: '#/products', gradientFrom: 'primary-600', gradientTo: 'primary-800' },
	home: { featuredCount: 10 },
	layout: { showHeader: true, showFooter: true, stickyNav: true },
	footer: { showShop: true, showCompany: true, showLegal: true, copyrightYear: '2024', showBuiltBy: true },
	cart: { taxRate: 10 },
	pwa: { name: 'ShopHub', shortName: 'ShopHub' }
};

function directOrder(seed: string): string[] {
	return new ProductCatalog(
		columnar,
		{ imagesBaseUrl: 'https://cdn.test' },
		memoryStoreFactory,
		mulberry32(hashSeedString(seed))
	).products.get().map((p) => p.productId);
}

/** Fake router capturing navigations. The href is settable to simulate the hash arriving late (as at boot). */
function fakeRouter(href: string): RouterPort & { navigate: ReturnType<typeof vi.fn>; setHref(href: string): void } {
	const route = memoryStoreFactory.create<Route>({
		href,
		path: '/',
		params: {},
		query: new URLSearchParams()
	});
	return {
		route,
		navigate: vi.fn(),
		start: () => {},
		stop: () => {},
		setHref(next: string): void {
			route.set({ href: next, path: '/', params: {}, query: new URLSearchParams() });
		}
	};
}

/**
 * visible URL of the shell. Under jsdom the container reads
 * `window.location` (ground truth, hash included); in node it falls back to
 * the router store. Keep both in sync so the test is env-independent.
 */
function setShellUrl(href: string, router: { setHref(href: string): void }): void {
	router.setHref(href);
	if (typeof window !== 'undefined') {
		window.location.hash = href.includes('#') ? href.slice(href.indexOf('#') + 1) : '';
	}
}

const NO_SEED = 'https://shop.test/#/';
const SEEDED = 'https://shop.test/#/products?seed=482917';

beforeEach(() => {
	if (typeof window !== 'undefined') window.location.hash = '';
});

describe('resolveProductSeed', () => {
	it('prefers the explicit init seed over the URL', () => {
		const generate = vi.fn(() => 'generated');
		expect(resolveProductSeed('init-seed', SEEDED, generate)).toBe('init-seed');
		expect(generate).not.toHaveBeenCalled();
	});

	it('uses the URL seed when no init seed is given', () => {
		const generate = vi.fn(() => 'generated');
		expect(resolveProductSeed(undefined, SEEDED, generate)).toBe('482917');
		expect(generate).not.toHaveBeenCalled();
	});

	it('generates a fresh seed when init and URL are both missing', () => {
		const generate = vi.fn(() => 'generated');
		expect(resolveProductSeed(undefined, NO_SEED, generate)).toBe('generated');
		expect(generate).toHaveBeenCalledOnce();
	});

	it('treats an empty URL seed as missing', () => {
		const generate = vi.fn(() => 'generated');
		expect(resolveProductSeed('', 'https://shop.test/#/products?seed=', generate)).toBe('generated');
	});
});

describe('product seed convergence (refresh with ?seed= keeps the order)', () => {
	it('reproduces the same catalog order for the same URL seed across containers', () => {
		const routerA = fakeRouter(NO_SEED);
		setShellUrl(SEEDED, routerA);
		const first = createContainer({ router: routerA, config: testConfig, productsData: columnar });
		expect(first.ensureProductSeed()).toBe('482917');
		expect(routerA.navigate).not.toHaveBeenCalled();

		// Simulate a full refresh: brand-new container, same URL seed.
		const routerB = fakeRouter(NO_SEED);
		setShellUrl(SEEDED, routerB);
		const second = createContainer({ router: routerB, config: testConfig, productsData: columnar });
		second.ensureProductSeed();

		const expected = directOrder('482917');
		expect(first.catalog.products.get().map((p) => p.productId)).toEqual(expected);
		expect(second.catalog.products.get().map((p) => p.productId)).toEqual(expected);
	});

	it('adopts a URL seed that arrives after construction (hash missing at boot)', () => {
		// Boot: page store has no hash yet (hashes never reach the server),
		// so construction falls back to a fresh seed.
		const router = fakeRouter(NO_SEED);
		setShellUrl(NO_SEED, router);
		const container = createContainer({ router, config: testConfig, productsData: columnar });

		// Shell mounts: the hash is there now. The container must converge
		// to it instead of keeping the boot-time generated order.
		setShellUrl(SEEDED, router);
		expect(container.ensureProductSeed()).toBe('482917');
		expect(router.navigate).not.toHaveBeenCalled();
		expect(container.seed).toBe('482917');
		expect(container.catalog.products.get().map((p) => p.productId)).toEqual(
			directOrder('482917')
		);
	});

	it('writes a generated seed back once and is idempotent afterwards', () => {
		const router = fakeRouter(NO_SEED);
		setShellUrl(NO_SEED, router);
		const container = createContainer({ router, config: testConfig, productsData: columnar });

		const seed = container.ensureProductSeed();
		expect(router.navigate).toHaveBeenCalledOnce();
		const [[written, options]] = router.navigate.mock.calls as [[string, { replaceState?: boolean }]];
		expect(options).toEqual({ replaceState: true });
		expect(getSeedInUrl(written)).toBe(seed);
		expect(container.catalog.products.get().map((p) => p.productId)).toEqual(directOrder(seed));

		// Second call: the URL now carries the seed → no-op.
		setShellUrl(written, router);
		expect(container.ensureProductSeed()).toBe(seed);
		expect(router.navigate).toHaveBeenCalledOnce();
	});
});
