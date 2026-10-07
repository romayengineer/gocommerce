import type { AppConfig } from '@gocommerce/config';
import type { Clipboard } from '@gocommerce/ports/Clipboard';
import type { Logger } from '@gocommerce/ports/Logger';
import type { ProductsColumnar } from '@gocommerce/domain/product';
import { ProductCatalog } from '@gocommerce/application/ProductCatalog';
import { CartService } from '@gocommerce/application/CartService';
import { ProductPageService } from '@gocommerce/application/ProductPageService';
import { CheckoutService, type CheckoutGateway } from '@gocommerce/application/CheckoutService';
import { PaymentService } from '@gocommerce/application/PaymentService';
import { MapLocationService } from '@gocommerce/application/MapLocationService';
import { readEnvConfig } from '@gocommerce/adapters/config/env';
import { LocalStorageAdapter } from '@gocommerce/adapters/storage/localStorage';
import { logger } from '@gocommerce/adapters/browser/logger';
import { browserClock } from '@gocommerce/adapters/browser/clock';
import { NavigatorClipboard } from '@gocommerce/adapters/browser/clipboard';
import { SvelteKitRouter } from '@gocommerce/adapters/svelte/router.svelte';
import { ViewportWidthTracker } from '@gocommerce/adapters/svelte/platform';
import { createMapService } from '@gocommerce/adapters/maps/mapFactory';
import productsData from './data/products.json';

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