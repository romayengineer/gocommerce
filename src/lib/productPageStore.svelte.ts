import type { DisplayProduct } from './products';
import { products, deleteProduct } from './products';
import { displayProductsSizes, displayProductsBrands, displayProductsCategories } from './products';

export class ProductPageStore {
	sortBy = $state('random');
	filterCategory = $state('all');
	filterSize = $state('all');
	filterBrand = $state('all');
	searchQuery = $state('');
	debouncedSearchQuery = $state('');

	displayProducts = $state(products);

	get categories(): string[] {
		return ['all', ...displayProductsCategories];
	}

	get sizes(): string[] {
		return ['all', ...displayProductsSizes];
	}

	get brands(): string[] {
		return ['all', ...displayProductsBrands];
	}

	get filtered(): DisplayProduct[] {
		const category = this.filterCategory.toLowerCase();
		const brand = this.filterBrand.toLowerCase();
		const size = this.filterSize.toUpperCase();
		let products = this.displayProducts.filter((p) => {
			if (category !== 'all' && !p.categories.some(cat => cat.endsWith(`${category}/`))) {
				return false;
			}
			if (brand !== 'all' && !(p.brand === brand)) {
				return false;
			}
			if (this.debouncedSearchQuery.trim() !== '') {
				const words = this.debouncedSearchQuery.toLowerCase().split(/\s+/).filter(w => w.length > 0);
				return words.every(word => p.allText.includes(word));
			}
			return true;
		});
		if (size !== 'ALL') {
			return products.map((p) => {
				let items = p.items.filter((i) => i.size === size)
				if (items.length > 0) {
					return {
						...p,
						items: items,
					}
				} else {
					return null
				}
			}).filter((p) => p !== null)
		}
		return products;
	}

	get sorted(): DisplayProduct[] {
		if (this.sortBy === 'random') {
			return this.filtered;
		}

		const sorted = [...this.filtered].sort((a, b) => {
			if (this.sortBy === 'name-asc') return a.productName.localeCompare(b.productName);
			if (this.sortBy === 'name-desc') return b.productName.localeCompare(a.productName);
			if (this.sortBy === 'price-asc') return a.items[0].price - b.items[0].price;
			if (this.sortBy === 'price-desc') return b.items[0].price - a.items[0].price;
			return 0;
		});

		return sorted;
	}

	handleProductImageFailed(productId: string) {
		deleteProduct(products, productId);
		deleteProduct(this.displayProducts, productId);
	}
}

export const productPageStore = new ProductPageStore();

$effect.root(() => {
	$effect(() => {
		const _ = productPageStore.searchQuery;
		const timer = setTimeout(() => {
			productPageStore.debouncedSearchQuery = productPageStore.searchQuery;
		}, 1000);
		return () => clearTimeout(timer);
	});
});
