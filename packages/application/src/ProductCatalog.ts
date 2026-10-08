import type { ReadableStore, WritableStore } from '@gocommerce/ports/Store';
import type { StoreFactory } from '@gocommerce/ports/StoreFactory';
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
	private readonly initial: DisplayProduct[];
	private readonly deleted = new Set<string>();

	constructor(
		data: ProductsColumnar,
		config: CatalogConfig,
		stores: StoreFactory,
		/**
		 * Shuffle source. Omit for deterministic load order (bundled JSON
		 * order) — shuffling is an explicit UI concern, so callers pass a
		 * seeded `RandomFn` only when random order is actually wanted.
		 * The composition root passes `mulberry32(hashSeedString(seed))`
		 * so product display is random by design yet reproducible per `?seed=`.
		 */
		random?: RandomFn
	) {
		const parsed = ProductsColumnarSchema.parse(data);
		const display = mapColumnarToDisplay(parsed, config.imagesBaseUrl);
		this.initial = display;
		this.products = stores.create(
			random ? shuffleFisherYates(display, random) : [...display]
		);
		this.brands = stores.derived(this.products, (products) =>
			Array.from(new Set(products.map((p) => p.brand))).sort()
		);
		this.sizes = stores.derived(this.products, (products) =>
			Array.from(new Set(products.flatMap((p) => p.items.map((i) => i.size))))
		);
		this.categories = stores.derived(this.products, (products) =>
			cleanCategories(products.flatMap((p) => p.categories)).sort()
		);
	}

	findByProductId(productId: string): DisplayProduct | undefined {
		return this.products.get().find((p) => p.productId === productId);
	}

	/**
	 * Re-shuffle from the pristine bundled order (not from the current
	 * order — Fisher-Yates permutations don't compose, so reshuffling an
	 * already-shuffled list would stay dependent on the first shuffle).
	 * Used when the order seed arrives after construction (e.g. the URL
	 * hash is unavailable at boot and only readable once the client shell
	 * mounts). Deterministic per seed; products removed earlier stay
	 * removed.
	 */
	reshuffle(random: RandomFn): void {
		this.products.set(
			shuffleFisherYates(
				this.initial.filter((p) => !this.deleted.has(p.productId)),
				random
			)
		);
	}

	deleteProduct(productId: string): void {
		this.deleted.add(productId);
		this.products.set(removeProduct(this.products.get(), productId));
	}

	productFullUrl(product?: DisplayProduct): string {
		return productFullUrl(product);
	}
}
