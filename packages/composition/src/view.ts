import { toSvelte } from '@gocommerce/adapters/svelte/store';
import { createContainer } from '@gocommerce/composition/container';
import type { DisplayProduct } from '@gocommerce/domain/product';

// view.ts is the app's composition root: importing it wires the default
// container (browser adapters + bundled data). Tests and tools should use
// createContainer(init) from @gocommerce/composition/container with injected
// fakes instead of importing this module.
const container = createContainer();

// NOTE: the Svelte bridge (toSvelte) is intentionally NOT re-exported.
// view.ts is the sole place that bridges core stores to Svelte; consumers
// use the ready-made stores below (viewport, cartItems, ...) instead.

// Re-export i18n locale helpers (owned by adapters/svelte/i18n) via view.
export {
	locales,
	localeNames,
	localeFlags,
	setLocale,
	defaultLocale
} from '@gocommerce/adapters/svelte/i18n';

// Pure domain types are imported directly from @gocommerce/domain/*
// (and MapConfig from @gocommerce/ports/MapService) by presentation
// components — value helpers come via view.ts wired services or
// @gocommerce/ui-core/*, never directly from domain.

export const config = container.config;
export const logger = container.logger;
export const router = container.router;
export const clipboard = container.clipboard;
export const platform = container.platform;
export const viewportTracker = container.viewport;
export const catalog = container.catalog;
export const cartService = container.cart;
export const productPage = container.products;
export const checkoutService = container.checkout;
export const paymentService = container.payment;
export const mapService = container.maps;

// Reactive Svelte stores (bridged from the framework-agnostic core stores)

export const viewport = toSvelte(container.viewport.viewport);

export const cartItems = toSvelte(container.cart.items);
export const cartProducts = toSvelte(container.cart.products);
export const cartCount = toSvelte(container.cart.count);
export const cartTotal = toSvelte(container.cart.total);

export const catalogProducts = toSvelte(container.catalog.products);

export const sortedProducts = toSvelte(container.products.sorted);
export const filterCategories = toSvelte(container.products.categories);
export const filterSizes = toSvelte(container.products.sizes);
export const filterBrands = toSvelte(container.products.brands);

export const checkoutForm = container.checkout.formData;
export const checkoutErrors = toSvelte(container.checkout.errors);
export const checkoutSubmitting = toSvelte(container.checkout.submitting);
export const checkoutSubmitted = toSvelte(container.checkout.submitted);

export const mapState = toSvelte(container.maps.state);

export const route = toSvelte(container.router.route);

export const sortBy = toSvelte(container.products.sortBy);
export const filterCategory = toSvelte(container.products.filterCategory);
export const filterSize = toSvelte(container.products.filterSize);
export const filterBrand = toSvelte(container.products.filterBrand);
export const searchQuery = toSvelte(container.products.searchQuery);

export function findProduct(productId: string): DisplayProduct | undefined {
	return container.catalog.findByProductId(productId);
}

export function productFullUrl(product?: DisplayProduct): string {
	return container.catalog.productFullUrl(product);
}

export const addToCart = (productId: string, itemId: string, quantity: number): void =>
	container.cart.addToCart(productId, itemId, quantity);

export const removeFromCart = (productId: string, itemId: string): void =>
	container.cart.removeFromCart(productId, itemId);

export const updateQuantity = (productId: string, itemId: string, quantity: number): void =>
	container.cart.updateQuantity(productId, itemId, quantity);
