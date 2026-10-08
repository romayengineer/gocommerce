import { describe, it, expect } from 'vitest';
import { ProductCatalog } from '@gocommerce/application/ProductCatalog';
import type { ProductsColumnar } from '@gocommerce/domain/product';
import { hashSeedString, mulberry32 } from '@gocommerce/domain/random';
import { memoryStoreFactory } from '@gocommerce/foundation/store';

const columnar: ProductsColumnar = {
	productId: ['p1', 'p2', 'p3'],
	productName: ['Alpha', 'Beta', 'Gamma'],
	description: ['d1', 'd2', 'd3'],
	brand: ['b1', 'b2', 'b3'],
	categories: ['Perfume', 'Perfume', 'Perfume'],
	properties: ['type=X', 'type=Y', 'type=Z'],
	images_count: [1, 1, 1],
	items: ['S=100', 'S=200', 'S=300']
};

describe('ProductCatalog ordering', () => {
	it('preserves bundled order when no RandomFn is provided', () => {
		const catalog = new ProductCatalog(
			columnar,
			{ imagesBaseUrl: 'https://cdn.test' },
			memoryStoreFactory
		);
		expect(catalog.products.get().map((p) => p.productId)).toEqual(['p1', 'p2', 'p3']);
	});

	it('shuffles only when a RandomFn is explicitly provided', () => {
		const catalog = new ProductCatalog(
			columnar,
			{ imagesBaseUrl: 'https://cdn.test' },
			memoryStoreFactory,
			() => 0.5
		);
		expect(catalog.products.get().map((p) => p.productId).sort()).toEqual(['p1', 'p2', 'p3']);
	});

	it('reproduces the same order for the same seed string', () => {
		const seeded = (seed: string) =>
			new ProductCatalog(
				columnar,
				{ imagesBaseUrl: 'https://cdn.test' },
				memoryStoreFactory,
				mulberry32(hashSeedString(seed))
			);
		const first = seeded('482917').products.get().map((p) => p.productId);
		expect(seeded('482917').products.get().map((p) => p.productId)).toEqual(first);
		expect(seeded('482918').products.get().map((p) => p.productId)).not.toEqual(first);
	});

	it('reshuffles from pristine order so the seed alone determines the result', () => {
		const catalog = new ProductCatalog(
			columnar,
			{ imagesBaseUrl: 'https://cdn.test' },
			memoryStoreFactory,
			mulberry32(hashSeedString('111111'))
		);
		catalog.reshuffle(mulberry32(hashSeedString('482917')));
		expect(catalog.products.get().map((p) => p.productId)).toEqual(
			new ProductCatalog(
				columnar,
				{ imagesBaseUrl: 'https://cdn.test' },
				memoryStoreFactory,
				mulberry32(hashSeedString('482917'))
			).products.get().map((p) => p.productId)
		);
	});

	it('keeps deleted products removed across reshuffles', () => {
		const catalog = new ProductCatalog(
			columnar,
			{ imagesBaseUrl: 'https://cdn.test' },
			memoryStoreFactory,
			mulberry32(hashSeedString('111111'))
		);
		catalog.deleteProduct('p2');
		catalog.reshuffle(mulberry32(hashSeedString('482917')));
		const ids = catalog.products.get().map((p) => p.productId);
		expect(ids).not.toContain('p2');
		expect([...ids].sort()).toEqual(['p1', 'p3']);
	});
});
