import type { DisplayProduct } from './products';
import { displayProductsList, deleteProduct } from './products';

export class ProductPageStore {
	sortBy = $state('random');
	filterCategory = $state('all');
	filterSize = $state('all');
	filterBrand = $state('all');
	searchQuery = $state('');
	debouncedSearchQuery = $state('');

	displayProducts = $state(displayProductsList);

	cleanCategories(categories: string[]): string[] {
		return Array.from(new Set(categories.map(category => {
			const pathParts = category.split('/').filter((part) => part !== '');
			const categoryName = pathParts.length > 0 ? pathParts[pathParts.length - 1] : category;
			return categoryName.toLowerCase();
		})));
	}

	get categories(): string[] {
		return ['all', ...this.cleanCategories(Array.from(new Set(this.displayProducts.flatMap(p => p.categories)))).sort()];
	}

	sortSizes(a: string, b: string): number {
		const aNum = Number(a.split(/\s+/)[0]);
		const bNum = Number(b.split(/\s+/)[0]);
		return aNum - bNum;
	}

	get sizes(): string[] {
		return ['all', ...Array.from(new Set(this.displayProducts.map(p => p.size))).sort(this.sortSizes)];
	}

	get brands(): string[] {
		return ['all', ...Array.from(new Set(this.displayProducts.map(p => p.brand))).sort()];
	}

	get filtered(): DisplayProduct[] {
		const category = this.filterCategory.toLowerCase();
		const brand = this.filterBrand.toLowerCase();
		const size = this.filterSize.toUpperCase();
		return this.displayProducts.filter((p) => {
			if (category !== 'all' && !p.categories.some(cat => cat.endsWith(`${category}/`))) {
				return false;
			}
			if (brand !== 'all' && !(p.brand === brand)) {
				return false;
			}
			if (size !== 'ALL' && !(p.size === size)) {
				return false;
			}
			if (this.debouncedSearchQuery.trim() !== '') {
				const words = this.debouncedSearchQuery.toLowerCase().split(/\s+/).filter(w => w.length > 0);
				return words.every(word => p.allText.includes(word));
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
