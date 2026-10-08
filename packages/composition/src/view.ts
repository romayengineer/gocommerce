/**
 * Deprecated barrel: prefer per-domain deep paths
 * (`@gocommerce/composition/view/cart`, `/catalog`, `/products`,
 * `/checkout`, `/payment`, `/maps`, `/router`, `/viewport`, `/app`,
 * `/i18n`) so bundles only pull the Svelte bridges they use.
 *
 * This module is kept for backward compatibility and re-exports every slice.
 * New code should import the slice directly. Tests/tools that need isolation
 * should use `createContainer(init)` from
 * `@gocommerce/composition/container` instead of this singleton.
 */
export { getContainer, disposeSingleton as disposeView } from './singleton';
export type { SortOption } from './view/products';
export {
	locales,
	localeNames,
	localeFlags,
	setLocale,
	defaultLocale
} from './view/i18n';
export { config, logger, platform, clipboard } from './view/app';
export { getProductSeed, ensureProductSeed, findProduct, productFullUrl } from './view/catalog';
export { catalog, catalogProducts } from './view/catalog';
export {
	cartService,
	cartItems,
	cartProducts,
	cartCount,
	cartTotal,
	addToCart,
	removeFromCart,
	updateQuantity
} from './view/cart';
export {
	productPage,
	sortedProducts,
	filterCategories,
	filterSizes,
	filterBrands,
	sortBy,
	filterCategory,
	filterSize,
	filterBrand,
	searchQuery
} from './view/products';
export {
	checkoutService,
	checkoutForm,
	checkoutErrors,
	checkoutSubmitting,
	checkoutSubmitted
} from './view/checkout';
export { paymentService } from './view/payment';
export { mapService, mapState } from './view/maps';
export { router, route } from './view/router';
export { viewportTracker, viewport } from './view/viewport';
