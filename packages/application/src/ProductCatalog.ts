import type { ReadableStore, WritableStore } from '@gocommerce/ports/Store';
import { createStore, derived } from '@gocommerce/adapters-memory/store';
import {
	cleanCategories,
	deleteProduct as removeProduct,
	mapColumnarToDisplay,
	productFullUrl,
	ProductsColumnarSchema,
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
		const parsed = ProductsColumnarSchema.parse(data);
		this.products = createStore(
			shuffleFisherYates(mapColumnarToDisplay(parsed, config.imagesBaseUrl), random)
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
		this.products.set(removeProduct(this.products.get(), productId));
	}

	productFullUrl(product?: DisplayProduct): string {
		return productFullUrl(product);
	}
}
