import { combine, createStore, derived, type ReadableStore, type WritableStore } from '$core/ports/Store';
import type { Clock, TimerHandle } from '$core/ports/Clock';
import type { DisplayProduct } from '$core/domain/product';
import type { ProductCatalog } from './ProductCatalog';

export const ALL = 'all';

export type SortOption = 'random' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

export interface ProductFilters {
	category: string;
	brand: string;
	size: string;
	query: string;
}

export function filterProducts(
	products: DisplayProduct[],
	filters: ProductFilters
): DisplayProduct[] {
	const category = filters.category.toLowerCase();
	const brand = filters.brand.toLowerCase();
	const size = filters.size.toUpperCase();

	let result = products.filter((p) => {
		if (category !== 'all' && !p.categories.some((cat) => cat.endsWith(`${category}/`))) {
			return false;
		}
		if (brand !== 'all' && p.brand !== brand) {
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

export function sortProducts(products: DisplayProduct[], sortBy: string): DisplayProduct[] {
	if (sortBy === 'random') return products;
	return [...products].sort((a, b) => {
		if (sortBy === 'name-asc') return a.productName.localeCompare(b.productName);
		if (sortBy === 'name-desc') return b.productName.localeCompare(a.productName);
		if (sortBy === 'price-asc') return a.items[0].price - b.items[0].price;
		if (sortBy === 'price-desc') return b.items[0].price - a.items[0].price;
		return 0;
	});
}

export class ProductPageService {
	readonly sortBy: WritableStore<string>;
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
		debounceMs = 1000
	) {
		this.sortBy = createStore('random');
		this.filterCategory = createStore(ALL);
		this.filterSize = createStore(ALL);
		this.filterBrand = createStore(ALL);
		this.searchQuery = createStore('');
		this.debouncedSearchQuery = createStore('');

		this.displayProducts = catalog.products;
		this.categories = derived(catalog.categories, (categories) => [ALL, ...categories]);
		this.sizes = derived(catalog.sizes, (sizes) => [ALL, ...sizes]);
		this.brands = derived(catalog.brands, (brands) => [ALL, ...brands]);

		this.filtered = combine(
			[this.displayProducts, this.filterCategory, this.filterSize, this.filterBrand, this.debouncedSearchQuery],
			() =>
				filterProducts(this.displayProducts.get(), {
					category: this.filterCategory.get(),
					brand: this.filterBrand.get(),
					size: this.filterSize.get(),
					query: this.debouncedSearchQuery.get()
				})
		);

		this.sorted = combine([this.filtered, this.sortBy], () =>
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
