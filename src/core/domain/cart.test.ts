import { describe, it, expect } from 'vitest';
import {
	addItem,
	removeItem,
	setQuantity,
	sameItem,
	resolveCartItems,
	cartCount,
	cartTotal
} from '$core/domain/cart';
import type { CartItem } from '$core/domain/cart';
import type { DisplayProduct } from '$core/domain/product';

const product: DisplayProduct = {
	productId: 'p1',
	productName: 'Perfume',
	description: 'desc',
	brand: 'brand',
	categories: ['Perfume'],
	properties: [],
	allText: 'Perfume desc brand',
	images: [],
	items: [
		{ itemId: 'p1S', size: 'S', price: 100 },
		{ itemId: 'p1M', size: 'M', price: 150 }
	]
};

describe('cart reducers', () => {
	it('adds a new item', () => {
		const next = addItem([], 'p1', 'p1S', 1);
		expect(next).toEqual([{ productId: 'p1', itemId: 'p1S', quantity: 1 }]);
	});

	it('increments quantity of an existing item', () => {
		const next = addItem([{ productId: 'p1', itemId: 'p1S', quantity: 1 }], 'p1', 'p1S', 2);
		expect(next).toEqual([{ productId: 'p1', itemId: 'p1S', quantity: 3 }]);
	});

	it('does not mutate the input array', () => {
		const input: CartItem[] = [{ productId: 'p1', itemId: 'p1S', quantity: 1 }];
		const next = addItem(input, 'p1', 'p1M', 1);
		expect(input).toEqual([{ productId: 'p1', itemId: 'p1S', quantity: 1 }]);
		expect(next).toHaveLength(2);
	});

	it('removes an item', () => {
		const items: CartItem[] = [
			{ productId: 'p1', itemId: 'p1S', quantity: 1 },
			{ productId: 'p1', itemId: 'p1M', quantity: 2 }
		];
		expect(removeItem(items, 'p1', 'p1S')).toEqual([{ productId: 'p1', itemId: 'p1M', quantity: 2 }]);
		expect(items).toHaveLength(2);
	});

	it('sets quantity and removes when <= 0', () => {
		expect(setQuantity([{ productId: 'p1', itemId: 'p1S', quantity: 1 }], 'p1', 'p1S', 0)).toEqual([]);
		expect(setQuantity([{ productId: 'p1', itemId: 'p1S', quantity: 1 }], 'p1', 'p1S', 5)[0].quantity).toBe(5);
	});

	it('sameItem matches productId and itemId', () => {
		expect(sameItem({ productId: 'a', itemId: 'b' }, 'a', 'b')).toBe(true);
		expect(sameItem({ productId: 'a', itemId: 'b' }, 'a', 'c')).toBe(false);
	});
});

describe('cart selectors', () => {
	it('counts total quantity', () => {
		expect(cartCount([{ productId: 'a', itemId: 'b', quantity: 2 }])).toBe(2);
	});

	it('resolves items against catalog and drops unavailable ones', () => {
		const items: CartItem[] = [
			{ productId: 'p1', itemId: 'p1S', quantity: 2 },
			{ productId: 'missing', itemId: 'x', quantity: 1 }
		];
		const resolved = resolveCartItems(items, [product]);
		expect(resolved).toHaveLength(1);
		expect(resolved[0].product.productId).toBe('p1');
		expect(resolved[0].quantity).toBe(2);
	});

	it('computes total price', () => {
		const items: CartItem[] = [{ productId: 'p1', itemId: 'p1S', quantity: 2 }];
		const resolved = resolveCartItems(items, [product]);
		expect(cartTotal(resolved)).toBe(200);
	});
});