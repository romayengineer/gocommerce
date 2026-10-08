import type { AppConfig } from '@gocommerce/config/config';
import type { Clipboard } from '@gocommerce/ports/Clipboard';
import type { Clock } from '@gocommerce/ports/Clock';
import type { Logger } from '@gocommerce/ports/Logger';
import type { IMapService } from '@gocommerce/ports/MapService';
import type { RouterPort } from '@gocommerce/ports/Router';
import type { KeyValueStorage } from '@gocommerce/ports/Storage';
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
import { memoryStoreFactory } from '@gocommerce/adapters-memory/store';
import { jsonStorageCodec } from '@gocommerce/adapters-memory/storage';
import {
	columnsForWidth,
	DEFAULT_COLUMN_WIDTH,
	MAX_COLUMNS,
	MIN_COLUMNS
} from '@gocommerce/ui-core/viewport';
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
	/** Viewport tracker. Defaults to a new ViewportWidthTracker. */
	viewport?: ViewportWidthTracker;
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

export interface AppContainer {
	config: AppConfig;
	logger: Logger;
	platform: { isBrowser: boolean };
	viewport: ViewportWidthTracker;
	router: RouterPort;
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
	const storage = init.storage ?? new LocalStorageAdapter();
	const clock = init.clock ?? browserClock;
	const viewport =
		init.viewport ??
		new ViewportWidthTracker({
			columnWidth: DEFAULT_COLUMN_WIDTH,
			min: MIN_COLUMNS,
			max: MAX_COLUMNS,
			columnsForWidth
		});
	const router = init.router ?? new SvelteKitRouter();
	const clipboard = init.clipboard ?? new NavigatorClipboard();
	const gateway = init.gateway ?? new SimulatedCheckoutGateway();
	const createMap = init.createMap ?? createMapService;

	const catalog = new ProductCatalog(
		(init.productsData ?? productsData) as ProductsColumnar,
		{
			imagesBaseUrl: config.imagesBaseUrl
		},
		memoryStoreFactory
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
