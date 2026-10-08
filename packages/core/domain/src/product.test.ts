import { describe, it, expect } from 'vitest';
import { mapColumnarToDisplay, cleanCategories, productFullUrl, deleteProduct } from '@gocommerce/domain/product';
import type { ProductsColumnar, DisplayProduct } from '@gocommerce/domain/product';

const columnar: ProductsColumnar = {
	productId: ['p1'],
	productName: ['Perfume Gatsby'],
	description: ['A fine fragrance'],
	brand: ['brand'],
	categories: ['Perfume;Home'],
	properties: ['type=Eau de Parfum'],
	images_count: [2],
	items: ['S=100;M=200']
};

describe('product mapping', () => {
	it('maps columnar data to display products with injected base URL', () => {
		const [product] = mapColumnarToDisplay(columnar, 'https://cdn.example.com/images');
		if (!product) throw new Error('expected one mapped product');
		expect(product.productId).toBe('p1');
		expect(product.categories).toEqual(['Perfume', 'Home']);
		expect(product.properties).toEqual([{ name: 'type', values: ['Eau de Parfum'] }]);
		expect(product.images).toEqual([
			'https://cdn.example.com/images/p1/1.webp',
			'https://cdn.example.com/images/p1/2.webp'
		]);
		expect(product.items).toEqual([
			{ itemId: 'p1S', size: 'S', price: 100 },
			{ itemId: 'p1M', size: 'M', price: 200 }
		]);
		expect(product.allText).toBe('Perfume Gatsby A fine fragrance brand');
	});

	it('fails fast on ragged columnar input', () => {
		const ragged: ProductsColumnar = { ...columnar, productName: [] };
		expect(() => mapColumnarToDisplay(ragged, 'https://cdn.example.com/images')).toThrow(
			/ragged columnar data: missing productName at index 0/
		);
	});

	it('fails fast on malformed property and item entries', () => {
		const badProperty: ProductsColumnar = { ...columnar, properties: ['type'] };
		expect(() => mapColumnarToDisplay(badProperty, 'https://cdn.example.com/images')).toThrow(
			/ragged columnar data: missing property value at index 1/
		);
		const badItem: ProductsColumnar = { ...columnar, items: ['S'] };
		expect(() => mapColumnarToDisplay(badItem, 'https://cdn.example.com/images')).toThrow(
			/ragged columnar data: missing item price at index 1/
		);
	});

	it('maps empty properties string to no properties', () => {
		for (const properties of ['', '   ', ';', '  ; ']) {
			const [product] = mapColumnarToDisplay(
				{ ...columnar, properties: [properties] },
				'https://cdn.example.com/images'
			);
			if (!product) throw new Error('expected one mapped product');
			expect(product.properties).toEqual([]);
		}
	});

	it('maps per-row empty properties independently', () => {
		const twoRows: ProductsColumnar = {
			productId: ['p1', 'p2'],
			productName: ['Perfume Gatsby', 'Perfume Other'],
			description: ['A fine fragrance', 'Another fragrance'],
			brand: ['brand', 'brand'],
			categories: ['Perfume;Home', 'Perfume'],
			properties: ['', 'type=Eau de Parfum'],
			images_count: [2, 1],
			items: ['S=100;M=200', 'S=50']
		};
		const [first, second] = mapColumnarToDisplay(twoRows, 'https://cdn.example.com/images');
		if (!first || !second) throw new Error('expected two mapped products');
		expect(first.properties).toEqual([]);
		expect(second.properties).toEqual([{ name: 'type', values: ['Eau de Parfum'] }]);
	});

	it('cleans category paths to unique last segments', () => {
		const cleaned = cleanCategories(['/perfume/mujer/', '/perfume/hombre/', '/hogar/']);
		expect(cleaned.sort()).toEqual(['hogar', 'hombre', 'mujer']);
	});

	it('builds a full product url', () => {
		const product: DisplayProduct = {
			productId: 'p1',
			productName: 'Gatsby',
			description: '',
			brand: 'Brand',
			categories: [],
			properties: [],
			allText: '',
			images: [],
			items: []
		};
		expect(productFullUrl(product)).toBe('/#/products/p1/brand-gatsby');
	});

	it('removes a product without mutating the input', () => {
		const products = [
			{ productId: 'a' } as DisplayProduct,
			{ productId: 'b' } as DisplayProduct
		];
		const next = deleteProduct(products, 'a');
		expect(next).toEqual([{ productId: 'b' } as DisplayProduct]);
		expect(products).toHaveLength(2);
	});
});