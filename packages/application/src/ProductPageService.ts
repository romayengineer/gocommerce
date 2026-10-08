import type { ReadableStore, WritableStore } from '@gocommerce/ports/Store';
import type { StoreFactory } from '@gocommerce/ports/StoreFactory';
import type { Clock, TimerHandle } from '@gocommerce/ports/Clock';
import type { DisplayProduct } from '@gocommerce/domain/product';
import type { ProductCatalog } from './ProductCatalog';

export const ALL = 'all';

export type SortOption = 'random' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export interface ProductFilters {
	category: string;
	brand: string;
	size: string;
	query: string;
}

/**
 * Match a cleaned category filter value against a product's raw categories.
 * Raw entries may be path-style (`/perfume/mujer/`) or plain (`Perfume`);
 * comparison is case-insensitive and tolerant of trailing slashes.
 */
export function matchesCategory(rawCategories: string[], category: string): boolean {
	return rawCategories.some((cat) => {
		const lower = cat.toLowerCase();
		return (
			lower === category ||
			lower === `${category}/` ||
			lower.endsWith(`/${category}`) ||
			lower.endsWith(`/${category}/`)
		);
	});
}

export function filterProducts(
	products: DisplayProduct[],
	filters: ProductFilters
): DisplayProduct[] {
	const category = filters.category.toLowerCase();
	const brand = filters.brand.toLowerCase();
	const size = filters.size.toUpperCase();

	let result = products.filter((p) => {
		if (category !== 'all' && !matchesCategory(p.categories, category)) {
			return false;
		}
		if (brand !== 'all' && p.brand.toLowerCase() !== brand) {
			return false;
		}
		if (filters.query.trim() !== '') {
			const words = filters.query
				.toLowerCase()
				.split(/\s+/)
				.filter((w) => w.length > 0);
			return words.every((word) => p.allText.includes(word));
		}
		return true;
	});

	if (size !== 'ALL') {
		result = result
			.map((p) => {
				const items = p.items.filter((i) => i.size === size);
				return items.length > 0 ? ({ ...p, items } as DisplayProduct) : null;
			})
			.filter((p): p is DisplayProduct => p !== null);
	}

	return result;
}

/** First-item price for price sorting; an itemless product is a data error. */
function firstPrice(p: DisplayProduct): number {
	const first = p.items[0];
	if (first === undefined)
		throw new Error(`cannot sort product '${p.productId}' by price: no items`);
	return first.price;
}

export function sortProducts(products: DisplayProduct[], sortBy: SortOption): DisplayProduct[] {
	if (sortBy === 'random') return products;
	return [...products].sort((a, b) => {
		switch (sortBy) {
			case 'name-asc':
				return a.productName.localeCompare(b.productName);
			case 'name-desc':
				return b.productName.localeCompare(a.productName);
			case 'price-asc':
				return firstPrice(a) - firstPrice(b);
			case 'price-desc':
				return firstPrice(b) - firstPrice(a);
		}
	});
}

export class ProductPageService {
	readonly sortBy: WritableStore<SortOption>;
	readonly filterCategory: WritableStore<string>;
	readonly filterSize: WritableStore<string>;
	readonly filterBrand: WritableStore<string>;
	readonly searchQuery: WritableStore<string>;
	readonly debouncedSearchQuery: WritableStore<string>;

	readonly categories: ReadableStore<string[]>;
	readonly sizes: ReadableStore<string[]>;
	readonly brands: ReadableStore<string[]>;
	readonly displayProducts: ReadableStore<DisplayProduct[]>;
	readonly filtered: ReadableStore<DisplayProduct[]>;
	readonly sorted: ReadableStore<DisplayProduct[]>;

	private debounceHandle: TimerHandle | null = null;

	constructor(
		private catalog: ProductCatalog,
		private clock: Clock,
		stores: StoreFactory,
		debounceMs = 1000
	) {
		this.sortBy = stores.create<SortOption>('random');
		this.filterCategory = stores.create(ALL);
		this.filterSize = stores.create(ALL);
		this.filterBrand = stores.create(ALL);
		this.searchQuery = stores.create('');
		this.debouncedSearchQuery = stores.create('');

		this.displayProducts = catalog.products;
		this.categories = stores.derived(catalog.categories, (categories) => [ALL, ...categories]);
		this.sizes = stores.derived(catalog.sizes, (sizes) => [ALL, ...sizes]);
		this.brands = stores.derived(catalog.brands, (brands) => [ALL, ...brands]);

		this.filtered = stores.combine(
			[this.displayProducts, this.filterCategory, this.filterSize, this.filterBrand, this.debouncedSearchQuery],
			() =>
				filterProducts(this.displayProducts.get(), {
					category: this.filterCategory.get(),
					brand: this.filterBrand.get(),
					size: this.filterSize.get(),
					query: this.debouncedSearchQuery.get()
				})
		);

		this.sorted = stores.combine([this.filtered, this.sortBy], () =>
			sortProducts(this.filtered.get(), this.sortBy.get())
		);

		this.searchQuery.subscribe((value) => {
			if (this.debounceHandle) this.clock.clearTimeout(this.debounceHandle);
			this.debounceHandle = this.clock.setTimeout(() => {
				this.debouncedSearchQuery.set(value);
			}, debounceMs);
		});
	}

	handleProductImageFailed(productId: string): void {
		this.catalog.deleteProduct(productId);
	}
}
