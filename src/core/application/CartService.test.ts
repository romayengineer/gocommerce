import { describe, it, expect } from 'vitest';
import type { ReadableStore } from '$core/ports/Store';
import type { KeyValueStorage } from '$core/ports/Storage';
import type { Logger } from '$core/ports/Logger';
import type { DisplayProduct } from '$core/domain/product';
import { CartService } from '$core/application/CartService';
import { ProductCatalog } from '$core/application/ProductCatalog';
import type { ProductsColumnar } from '$core/domain/product';

function memoryStorage(): KeyValueStorage {
	const map = new Map<string, string>();
	return {
		get: (k) => map.get(k) ?? null,
		set: (k, v) => map.set(k, v),
		remove: (k) => map.delete(k)
	};
}

const noopLogger: Logger = { log: () => {}, warn: () => {}, error: () => {} };

const columnar: ProductsColumnar = {
	productId: ['p1'],
	productName: ['Perfume'],
	description: ['desc'],
	brand: ['brand'],
	categories: ['Perfume'],
	properties: ['type=X'],
	images_count: [1],
	items: ['S=100']
};

function makeServices(storage: KeyValueStorage) {
	const catalog = new ProductCatalog(columnar, { imagesBaseUrl: 'https://cdn.test' }, () => 0.5);
	const cart = new CartService(storage, catalog, noopLogger, 'test_cart');
	return { catalog, cart };
}

describe('CartService', () => {
	it('adds and persists items', () => {
		const storage = memoryStorage();
		const { cart } = makeServices(storage);
		cart.addToCart('p1', 'p1S', 2);
		expect(cart.items.get()).toEqual([{ productId: 'p1', itemId: 'p1S', quantity: 2 }]);
		expect(JSON.parse(storage.get('test_cart')!)).toEqual([
			{ productId: 'p1', itemId: 'p1S', quantity: 2 }
		]);
	});

	it('exposes derived count and total', () => {
		const { cart } = makeServices(memoryStorage());
		cart.addToCart('p1', 'p1S', 3);
		expect(cart.count.get()).toBe(3);
		expect(cart.total.get()).toBe(300);
	});

	it('clears the cart and storage', () => {
		const storage = memoryStorage();
		const { cart } = makeServices(storage);
		cart.addToCart('p1', 'p1S', 1);
		cart.clearCart();
		expect(cart.items.get()).toEqual([]);
		expect(storage.get('test_cart')).toBeNull();
	});

	it('clears invalid persisted cart items on load', () => {
		const storage = memoryStorage();
		storage.set('test_cart', JSON.stringify([{ bad: 'shape' }]));
		const { cart } = makeServices(storage);
		expect(cart.items.get()).toEqual([]);
	});

	it('resolves catalog products reactively', () => {
		const storage = memoryStorage();
		const { catalog, cart } = makeServices(storage);
		cart.addToCart('p1', 'p1S', 1);
		const products = toArray(cart.products);
		expect(products).toHaveLength(1);
		expect(products[0].product.productId).toBe('p1');
		expect(products[0].product.price).toBe(100);

		// deleting from catalog removes it from resolved cart items
		catalog.deleteProduct('p1');
		expect(cart.products.get()).toHaveLength(0);
	});
});

function toArray<T>(store: ReadableStore<T>): T {
	return store.get();
}