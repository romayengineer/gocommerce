import { toSvelte } from '@gocommerce/adapters/svelte/store';
import type { DisplayProduct } from '@gocommerce/domain/product';
import { getContainer } from '../singleton';

function container() {
	return getContainer();
}

export const catalog = getContainer().catalog;

export const catalogProducts = toSvelte(getContainer().catalog.products);

export function findProduct(productId: string): DisplayProduct | undefined {
	return container().catalog.findByProductId(productId);
}

export function productFullUrl(product?: DisplayProduct): string {
	return container().catalog.productFullUrl(product);
}

export const getProductSeed = (): string => container().seed;
export const ensureProductSeed = (): string => container().ensureProductSeed();
