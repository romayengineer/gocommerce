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

export interface ContainerInit {
	/** Override the bundled catalog data (tests/fixtures). Defaults to ./data/products.json. */
	productsData?: ProductsColumnar;
	/** Override the runtime config. Defaults to readEnvConfig(). */
	config?: AppConfig;
}
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

export function createContainer(init: ContainerInit = {}): AppContainer {
	const config = init.config ?? readEnvConfig();
	const storage = new LocalStorageAdapter();
	const clock = browserClock;
	const viewport = new ViewportWidthTracker();
	const router = new SvelteKitRouter();
	const clipboard = new NavigatorClipboard();

	const catalog = new ProductCatalog((init.productsData ?? productsData) as ProductsColumnar, config);
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

// Default shared instance for the app shell (view.ts). Prefer
// createContainer(init) with injected productsData/config in tests.
// TODO(gocommerce-436): remove this module-load singleton once all
// consumers accept an injected container; importing this module currently
// still wires default dependencies on first use.
export const container = createContainer();