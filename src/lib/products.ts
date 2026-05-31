export interface Product {
	itemId: string;
	nameComplete: string;
	ean: string;
	variations: string[];
	images: string[];
	price: number;
}

export const products: Product[] = []