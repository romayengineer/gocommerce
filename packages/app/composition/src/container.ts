import type { AppConfig } from '@gocommerce/config/config';
import type { Clipboard } from '@gocommerce/ports/Clipboard';
import type { Clock } from '@gocommerce/ports/Clock';
import type { Logger } from '@gocommerce/ports/Logger';
import type { IMapService } from '@gocommerce/ports/MapService';
import type { RouterPort } from '@gocommerce/ports/Router';
import type { ViewportTracker } from '@gocommerce/ports/Platform';
import type { KeyValueStorage } from '@gocommerce/ports/Storage';
import type { ProductsColumnar } from '@gocommerce/domain/product';
import { ProductCatalog } from '@gocommerce/application/ProductCatalog';
import { CartService } from '@gocommerce/application/CartService';
import { ProductPageService } from '@gocommerce/application/ProductPageService';
import { CheckoutService, type CheckoutGateway } from '@gocommerce/application/CheckoutService';
import { PaymentService } from '@gocommerce/application/PaymentService';
import { MapLocationService } from '@gocommerce/application/MapLocationService';
import { readEnvConfig } from '@gocommerce/adapters/config/env';
import { generateSeed } from '@gocommerce/adapters/browser/random';
import { LocalStorageAdapter } from '@gocommerce/adapters/storage/localStorage';
import { logger } from '@gocommerce/adapters/browser/logger';
import { browserClock } from '@gocommerce/adapters/browser/clock';
import { NavigatorClipboard } from '@gocommerce/adapters/browser/clipboard';
import { SvelteKitRouter } from '@gocommerce/adapters/svelte/router.svelte';
import { ViewportWidthTracker } from '@gocommerce/adapters/svelte/platform';
import { memoryStoreFactory } from '@gocommerce/foundation/store';
import { jsonStorageCodec } from '@gocommerce/foundation/storage';
import {
	columnsForWidth,
	DEFAULT_COLUMN_WIDTH,
	MAX_COLUMNS,
	MIN_COLUMNS
} from '@gocommerce/ui-core/viewport';
import { getSeedInUrl, setSeedInUrl, withSeedFromCurrent } from '@gocommerce/ui-core/url';
import { hashSeedString, mulberry32 } from '@gocommerce/domain/random';
import { createMapService } from '@gocommerce/adapters-maps/mapFactory';
import productsData from './data/products.json';

export interface ContainerInit {
	/** Catalog data. Defaults to the bundled ./data/products.json. */
	productsData?: ProductsColumnar;
	/** Runtime config. Defaults to readEnvConfig(). */
	config?: AppConfig;
	/** Persistence. Defaults to LocalStorageAdapter (no-op when unavailable). */
	storage?: KeyValueStorage;
	/** Navigation. Defaults to SvelteKitRouter. */
	router?: RouterPort;
	/** Time source. Defaults to browserClock. */
	clock?: Clock;
	/** Clipboard. Defaults to NavigatorClipboard. */
	clipboard?: Clipboard;
	/** Order seed. Defaults to `?seed=` from the startup URL, else a fresh generated seed. */
	seed?: string;
	/** Viewport tracker. Defaults to a new ViewportWidthTracker (adapters). */
	viewport?: ViewportTracker;
	/** Order submission. Defaults to SimulatedCheckoutGateway. */
	gateway?: CheckoutGateway;
	/** Map backend factory. Defaults to createMapService. */
	createMap?: (config: AppConfig, logger?: Logger) => IMapService;
}

class SimulatedCheckoutGateway implements CheckoutGateway {
	async submit(): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
}

/**
 * Seed precedence: explicit init override (tests/tools) wins, else `?seed=`
 * from the given href reproduces a shared order, else `generate()` picks a
 * fresh one. Empty URL values count as missing.
 */
export function resolveProductSeed(
	initSeed: string | undefined,
	href: string,
	generate: () => string
): string {
	return initSeed || getSeedInUrl(href) || generate();
}

/**
 * Ground-truth startup href. `window.location` (client only) always carries
 * the hash; the router store is the SSR/prerender/test fallback.
 */
function bootHref(router: RouterPort): string {
	if (typeof window !== 'undefined') return window.location.href;
	return router.route.get().href;
}

/**
 * Seed-preserving router decorator. Hash navigations replace the whole
 * `#/...?...` string, so a bare `navigate('#/products')` would drop
 * `?seed=` (and reshuffle the catalog on next boot). The decorator copies
 * the live seed into every hash target; non-hash targets pass through.
 * Central choke point for all programmatic navigations (cart/checkout/
 * payment buttons, 404 redirects, `CheckoutService`), with zero call-site
 * churn. The glue lives here in composition because adapters must not
 * import ui-core (boundary rule 4).
 */
function withSeedPreserved(inner: RouterPort): RouterPort {
	return {
		get route(): RouterPort['route'] {
			return inner.route;
		},
		start: (): void => inner.start(),
		stop: (): void => inner.stop(),
		navigate: (href: string, options?: Parameters<RouterPort['navigate']>[1]): void => {
			inner.navigate(withSeedFromCurrent(href, bootHref(inner)), options);
		}
	};
}

export interface AppContainer {
	config: AppConfig;
	logger: Logger;
	platform: { isBrowser: boolean };
	/** Resolved product-order seed (explicit init, `?seed=`, or freshly generated). */
	seed: string;
	/** Write the resolved seed back to `?seed=` when missing (replaceState, no history spam). Client shells call this onMount; construction stays side-effect free. */
	ensureProductSeed(): string;
	viewport: ViewportTracker;
	router: RouterPort;
	clipboard: Clipboard;
	catalog: ProductCatalog;
	cart: CartService;
	products: ProductPageService;
	checkout: CheckoutService;
	payment: PaymentService;
	maps: MapLocationService;
	/** Release container-owned listeners (viewport tracking, router sync, service subscriptions). UI shells own mounting via `viewport.setElement(...)` and `router.start()`. */
	dispose(): void;
}

export function createContainer(init: ContainerInit = {}): AppContainer {
	const config = init.config ?? readEnvConfig();
	const storage = init.storage ?? new LocalStorageAdapter();
	const clock = init.clock ?? browserClock;
	const viewport =
		init.viewport ??
		new ViewportWidthTracker(
			{
				columnWidth: DEFAULT_COLUMN_WIDTH,
				min: MIN_COLUMNS,
				max: MAX_COLUMNS,
				columnsForWidth
			},
			memoryStoreFactory
		);
	const router = withSeedPreserved(init.router ?? new SvelteKitRouter(memoryStoreFactory));
	const clipboard = init.clipboard ?? new NavigatorClipboard();
	const gateway = init.gateway ?? new SimulatedCheckoutGateway();
	const createMap = init.createMap ?? createMapService;

	// Product order is random by design: an explicit init seed wins (tests,
	// tools), else `?seed=` from the startup URL reproduces a shared order,
	// else a fresh seed is picked so the first paint already shuffles.
	// NOTE: the router store may not carry the hash yet at construction (the
	// page store boots from server data, and hashes never reach the server),
	// so `ensureProductSeed()` re-converges once the client shell mounts.
	let seed = resolveProductSeed(init.seed, bootHref(router), generateSeed);

	const catalog = new ProductCatalog(
		(init.productsData ?? productsData) as ProductsColumnar,
		{
			imagesBaseUrl: config.imagesBaseUrl
		},
		memoryStoreFactory,
		mulberry32(hashSeedString(seed))
	);
	const cart = new CartService(storage, catalog, logger, memoryStoreFactory, jsonStorageCodec);
	const products = new ProductPageService(catalog, clock, memoryStoreFactory);
	const checkout = new CheckoutService(
		gateway,
		storage,
		router,
		logger,
		memoryStoreFactory,
		jsonStorageCodec
	);
	const payment = new PaymentService({ bank: config.bank }, cart);
	const maps = new MapLocationService(() => createMap(config, logger), logger, memoryStoreFactory);

	return {
		config,
		logger,
		platform: { isBrowser: typeof window !== 'undefined' },
		get seed(): string {
			return seed;
		},
		ensureProductSeed: () => {
			// Ground truth is live here (client shell calls this onMount):
			// adopt a URL seed that arrived after construction and reshuffle
			// to it, else write the resolved seed back when missing. Either
			// way the displayed order and `?seed=` converge; repeat calls
			// are idempotent.
			const href = bootHref(router);
			const urlSeed = getSeedInUrl(href);
			if (urlSeed && urlSeed !== seed) {
				seed = urlSeed;
				catalog.reshuffle(mulberry32(hashSeedString(seed)));
				return seed;
			}
			if (!urlSeed) {
				router.navigate(setSeedInUrl(href, seed), { replaceState: true });
			}
			return seed;
		},
		viewport,
		router,
		clipboard,
		catalog,
		cart,
		products,
		checkout,
		payment,
		maps,
		dispose: () => {
			products.dispose();
			cart.dispose();
			checkout.dispose();
			router.stop();
			viewport.dispose();
		}
	};
}
