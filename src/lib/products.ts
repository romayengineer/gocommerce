export interface Product {
	itemId: string;
	nameComplete: string;
	ean: string;
	variations: string[];
	images: string[];
	price: number;
}

export function isValidProduct(product: unknown): product is Product {
	if (!product || typeof product !== 'object') return false;
	const p = product as Record<string, unknown>;
	return (
		typeof p.itemId === 'string' &&
		typeof p.nameComplete === 'string' &&
		typeof p.ean === 'string' &&
		Array.isArray(p.variations) &&
		Array.isArray(p.images) &&
		typeof p.price === 'number'
	);
}

import productsData from '../data/products.json';
export const products: Product[] = productsData;