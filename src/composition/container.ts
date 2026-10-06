import type { AppConfig } from '$core/config';
import type { Clipboard } from '$core/ports/Clipboard';
import type { Logger } from '$core/ports/Logger';
import type { ProductsColumnar } from '$core/domain/product';
import { ProductCatalog } from '$core/application/ProductCatalog';
import { CartService } from '$core/application/CartService';
import { ProductPageService } from '$core/application/ProductPageService';
import { CheckoutService, type CheckoutGateway } from '$core/application/CheckoutService';
import { PaymentService } from '$core/application/PaymentService';
import { MapLocationService } from '$core/application/MapLocationService';
import { readEnvConfig } from '$adapters/config/env';
import { LocalStorageAdapter } from '$adapters/storage/localStorage';
import { logger } from '$adapters/browser/logger';
import { browserClock } from '$adapters/browser/clock';
import { NavigatorClipboard } from '$adapters/browser/clipboard';
import { SvelteKitRouter } from '$adapters/svelte/router.svelte';
import { ViewportWidthTracker } from '$adapters/svelte/platform';
import { createMapService } from '$adapters/maps/mapFactory';
import productsData from '../data/products.json';

class SimulatedCheckoutGateway implements CheckoutGateway {
	async submit(): Promise<void> {
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
}

export interface AppContainer {
	config: AppConfig;
	logger: Logger;
	platform: { isBrowser: boolean };
	viewport: ViewportWidthTracker;
	router: SvelteKitRouter;
	clipboard: Clipboard;
	catalog: ProductCatalog;
	cart: CartService;
	products: ProductPageService;
	checkout: CheckoutService;
	payment: PaymentService;
	maps: MapLocationService;
}

export function createContainer(): AppContainer {
	const config = readEnvConfig();
	const storage = new LocalStorageAdapter();
	const clock = browserClock;
	const viewport = new ViewportWidthTracker();
	const router = new SvelteKitRouter();
	const clipboard = new NavigatorClipboard();

	const catalog = new ProductCatalog(productsData as ProductsColumnar, config);
	const cart = new CartService(storage, catalog, logger);
	const products = new ProductPageService(catalog, clock);
	const checkout = new CheckoutService(new SimulatedCheckoutGateway(), storage, router, logger);
	const payment = new PaymentService(config, cart);
	const maps = new MapLocationService(() => createMapService(config), logger);

	if (typeof window !== 'undefined') {
		viewport.setElement(window);
	}

	return {
		config,
		logger,
		platform: { isBrowser: typeof window !== 'undefined' },
		viewport,
		router,
		clipboard,
		catalog,
		cart,
		products,
		checkout,
		payment,
		maps
	};
}

export const container = createContainer();