import { displayProductsList, deleteProduct, type DisplayProduct } from './products';

export class ProductPageStore {
	sortBy = $state('random');
	filterCategory = $state('all');
	searchQuery = $state('');
	debouncedSearchQuery = $state('');

	displayProducts = $state(displayProductsList);

	get categories(): string[] {
		return ['all', ...new Set(this.displayProducts.flatMap(p => p.categories))];
	}

	get filtered(): DisplayProduct[] {
		return this.displayProducts.filter((p) => {
			if (this.filterCategory !== 'all' && !p.categories.some(cat => cat.endsWith(`${this.filterCategory}/`))) {
				return false;
			}
			if (this.debouncedSearchQuery.trim() !== '') {
				const query = this.debouncedSearchQuery.toLowerCase();
				return (
					p.nameComplete.toLowerCase().includes(query) ||
					p.brand.toLowerCase().includes(query) ||
					p.description.toLowerCase().includes(query)
				);
			}
			return true;
		});
	}

	get sorted(): DisplayProduct[] {
		if (this.sortBy === 'random') {
			return this.filtered;
		}

		const sorted = [...this.filtered].sort((a, b) => {
			if (this.sortBy === 'name-asc') return a.productName.localeCompare(b.productName);
			if (this.sortBy === 'name-desc') return b.productName.localeCompare(a.productName);
			if (this.sortBy === 'price-asc') return a.price - b.price;
			if (this.sortBy === 'price-desc') return b.price - a.price;
			return 0;
		});

		return sorted;
	}

	handleProductImageFailed(productId: string) {
		deleteProduct(displayProductsList, productId);
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
