import { describe, it, expect } from 'vitest';
import {
	filterProducts,
	sortProducts,
	matchesCategory,
	type SortOption
} from '@gocommerce/application/ProductPageService';
import type { DisplayProduct } from '@gocommerce/domain/product';

function product(overrides: Partial<DisplayProduct>): DisplayProduct {
	return {
		productId: 'p',
		productName: 'Perfume',
		description: 'desc',
		brand: 'brand a',
		categories: ['Perfume'],
		properties: [],
		allText: 'Perfume desc brand a',
		images: [],
		items: [{ itemId: 'pS', size: 'S', price: 100 }],
		...overrides
	};
}

const products: DisplayProduct[] = [
	product({ productId: '1', brand: 'alfa', productName: 'Zebra', categories: ['/perfume/mujer/'], allText: 'zebra desc brand alfa', items: [{ itemId: '1S', size: 'S', price: 300 }] }),
	product({ productId: '2', brand: 'beta', productName: 'Alpha', categories: ['/perfume/'], items: [{ itemId: '2M', size: 'M', price: 100 }] }),
	product({ productId: '3', brand: 'beta', productName: 'Charlie', categories: ['/hogar/'], items: [{ itemId: '3S', size: 'S', price: 200 }] })
];

describe('filterProducts', () => {
	it('returns all when no filters', () => {
		expect(filterProducts(products, { category: 'all', brand: 'all', size: 'all', query: '' })).toHaveLength(3);
	});

	it('filters by brand', () => {
		const result = filterProducts(products, { category: 'all', brand: 'beta', size: 'all', query: '' });
		expect(result.map((p) => p.productId)).toEqual(['2', '3']);
	});

	it('filters by category (last segment)', () => {
		const result = filterProducts(products, { category: 'mujer', brand: 'all', size: 'all', query: '' });
		expect(result.map((p) => p.productId)).toEqual(['1']);
	});

	it('filters by plain (slash-less) category', () => {
		const plain = [product({ productId: '9', categories: ['Perfume'] })];
		const result = filterProducts(plain, { category: 'perfume', brand: 'all', size: 'all', query: '' });
		expect(result.map((p) => p.productId)).toEqual(['9']);
	});

	it('matches brands case-insensitively', () => {
		const mixed = [product({ productId: '9', brand: 'Natura' })];
		const result = filterProducts(mixed, { category: 'all', brand: 'natura', size: 'all', query: '' });
		expect(result.map((p) => p.productId)).toEqual(['9']);
	});

	it('filters by size', () => {
		const result = filterProducts(products, { category: 'all', brand: 'all', size: 'S', query: '' });
		expect(result.map((p) => p.productId)).toEqual(['1', '3']);
	});

	it('searches over allText', () => {
		const result = filterProducts(products, { category: 'all', brand: 'all', size: 'all', query: 'zebra' });
		expect(result.map((p) => p.productId)).toEqual(['1']);
	});
});

describe('sortProducts', () => {
	it('sorts by name ascending', () => {
		const sorted = sortProducts(products, 'name-asc');
		expect(sorted.map((p) => p.productName)).toEqual(['Alpha', 'Charlie', 'Zebra']);
	});

	it('sorts by price descending', () => {
		const sorted = sortProducts(products, 'price-desc');
		expect(sorted.map((p) => p.productId)).toEqual(['1', '3', '2']);
	});

	it('returns the same list for random', () => {
		expect(sortProducts(products, 'random')).toEqual(products);
	});

	it('is exhaustive over SortOption (type-level)', () => {
		const options: SortOption[] = ['random', 'name-asc', 'name-desc', 'price-asc', 'price-desc'];
		for (const option of options) {
			expect(() => sortProducts(products, option)).not.toThrow();
		}
	});
});

describe('matchesCategory', () => {
	it('matches path-style, plain, and case variants', () => {
		expect(matchesCategory(['/perfume/mujer/'], 'mujer')).toBe(true);
		expect(matchesCategory(['/perfume/mujer'], 'mujer')).toBe(true);
		expect(matchesCategory(['Perfume'], 'perfume')).toBe(true);
		expect(matchesCategory(['/Perfume/MUJER/'], 'mujer')).toBe(true);
		expect(matchesCategory(['/hogar/'], 'mujer')).toBe(false);
	});
});