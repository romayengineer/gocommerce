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

	it('removes a product in place', () => {
		const products = [
			{ productId: 'a' } as DisplayProduct,
			{ productId: 'b' } as DisplayProduct
		];
		deleteProduct(products, 'a');
		expect(products).toEqual([{ productId: 'b' } as DisplayProduct]);
	});
});