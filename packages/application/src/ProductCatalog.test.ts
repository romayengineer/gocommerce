import { describe, it, expect } from 'vitest';
import { ProductCatalog } from '@gocommerce/application/ProductCatalog';
import type { ProductsColumnar } from '@gocommerce/domain/product';
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
});
