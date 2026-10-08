import type { ReadableStore, WritableStore } from '@gocommerce/ports/Store';
import type { StoreFactory } from '@gocommerce/ports/StoreFactory';
import type { KeyValueStorage } from '@gocommerce/ports/Storage';
import type { StorageCodec } from '@gocommerce/ports/StorageCodec';
import type { Logger } from '@gocommerce/ports/Logger';
import {
	addItem,
	cartCount,
	cartTotal,
	removeItem,
	resolveCartItems,
	setQuantity,
	type CartItem,
	type CartItemFull
} from '@gocommerce/domain/cart';
import { cartItemSchema } from '@gocommerce/domain/cart';
import { createValidator } from '@gocommerce/domain/validation';
import type { ProductCatalog } from './ProductCatalog';

export const CART_STORAGE_KEY = 'ecommerce_cart';

const isValidCartItem = createValidator(cartItemSchema);

export class CartService {
	readonly items: WritableStore<CartItem[]>;
	readonly products: ReadableStore<CartItemFull[]>;
	readonly count: ReadableStore<number>;
	readonly total: ReadableStore<number>;

	constructor(
		private storage: KeyValueStorage,
		private catalog: ProductCatalog,
		private logger: Logger,
		stores: StoreFactory,
		codec: StorageCodec,
		private key: string = CART_STORAGE_KEY
	) {
		const stored = codec.readJSON<unknown>(storage, key);
		let initial: CartItem[] = [];
		if (Array.isArray(stored)) {
			if (stored.some((item) => !isValidCartItem(item))) {
				logger.log('Invalid cart item, clearing cart');
				storage.remove(key);
			} else {
				initial = stored as CartItem[];
			}
		}

		this.items = stores.create(initial);
		this.items.subscribe((items) => codec.writeJSON(storage, key, items));

		this.products = stores.combine([this.items, this.catalog.products], () =>
			resolveCartItems(this.items.get(), this.catalog.products.get())
		);
		this.count = stores.derived(this.items, cartCount);
		this.total = stores.derived(this.products, cartTotal);
	}

	addToCart(productId: string, itemId: string, quantity: number): void {
		this.items.update((items) => addItem(items, productId, itemId, quantity));
	}

	removeFromCart(productId: string, itemId: string): void {
		this.items.update((items) => removeItem(items, productId, itemId));
	}

	updateQuantity(productId: string, itemId: string, quantity: number): void {
		this.items.update((items) => setQuantity(items, productId, itemId, quantity));
	}

	clearCart(): void {
		this.items.set([]);
		this.storage.remove(this.key);
	}
}
