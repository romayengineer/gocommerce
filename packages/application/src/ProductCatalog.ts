import { createStore, derived, type ReadableStore, type WritableStore } from '@gocommerce/ports/Store';
import {
	cleanCategories,
	deleteProduct as removeProduct,
	mapColumnarToDisplay,
	productFullUrl,
	type DisplayProduct,
	type ProductsColumnar
} from '@gocommerce/domain/product';
import { shuffleFisherYates, type RandomFn } from '@gocommerce/domain/random';

export interface CatalogConfig {
	imagesBaseUrl: string;
}

export class ProductCatalog {
	readonly products: WritableStore<DisplayProduct[]>;
	readonly brands: ReadableStore<string[]>;
	readonly sizes: ReadableStore<string[]>;
	readonly categories: ReadableStore<string[]>;

	constructor(data: ProductsColumnar, config: CatalogConfig, random: RandomFn = Math.random) {
		this.products = createStore(
			shuffleFisherYates(mapColumnarToDisplay(data, config.imagesBaseUrl), random)
		);
		this.brands = derived(this.products, (products) =>
			Array.from(new Set(products.map((p) => p.brand))).sort()
		);
		this.sizes = derived(this.products, (products) =>
			Array.from(new Set(products.flatMap((p) => p.items.map((i) => i.size))))
		);
		this.categories = derived(this.products, (products) =>
			cleanCategories(products.flatMap((p) => p.categories)).sort()
		);
	}

	findByProductId(productId: string): DisplayProduct | undefined {
		return this.products.get().find((p) => p.productId === productId);
	}

	deleteProduct(productId: string): void {
		const next = [...this.products.get()];
		removeProduct(next, productId);
		this.products.set(next);
	}

	productFullUrl(product?: DisplayProduct): string {
		return productFullUrl(product);
	}
}
