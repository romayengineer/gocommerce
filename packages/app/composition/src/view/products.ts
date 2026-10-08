import { toSvelte } from '@gocommerce/adapters/svelte/store';
import { getContainer } from '../singleton';

export type { SortOption } from '@gocommerce/application/ProductPageService';

export const productPage = getContainer().products;

export const sortedProducts = toSvelte(getContainer().products.sorted);
export const filterCategories = toSvelte(getContainer().products.categories);
export const filterSizes = toSvelte(getContainer().products.sizes);
export const filterBrands = toSvelte(getContainer().products.brands);

export const sortBy = toSvelte(getContainer().products.sortBy);
export const filterCategory = toSvelte(getContainer().products.filterCategory);
export const filterSize = toSvelte(getContainer().products.filterSize);
export const filterBrand = toSvelte(getContainer().products.filterBrand);
export const searchQuery = toSvelte(getContainer().products.searchQuery);
