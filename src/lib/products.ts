export interface Product {
	itemId: string;
	nameComplete: string;
	ean: string;
	variations: string[];
	images: string[];
	price: number;
}

import productsData from '../data/products.json';
export const products: Product[] = productsData;