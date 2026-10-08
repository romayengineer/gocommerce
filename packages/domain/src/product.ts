import { z } from 'zod';

export const productPropertySchema = z.object({
	name: z.string(),
	values: z.array(z.string())
});

export type ProductProperty = z.infer<typeof productPropertySchema>;

export const ProductsColumnarSchema = z.object({
	productId: z.array(z.string()),
	productName: z.array(z.string()),
	description: z.array(z.string()),
	brand: z.array(z.string()),
	categories: z.array(z.string()),
	properties: z.array(z.string()),
	images_count: z.array(z.number()),
	items: z.array(z.string())
});

export type ProductsColumnar = z.infer<typeof ProductsColumnarSchema>;

export const displayProductItemsSchema = z.object({
	productId: z.string(),
	itemId: z.string(),
	productName: z.string(),
	description: z.string(),
	brand: z.string(),
	categories: z.array(z.string()),
	properties: z.array(productPropertySchema),
	allText: z.string(),
	images: z.array(z.string()),
	size: z.string(),
	price: z.number()
});

export type DisplayProductItems = z.infer<typeof displayProductItemsSchema>;

export const productItemSchema = z.object({
	itemId: z.string(),
	size: z.string(),
	price: z.number()
});

export type ProductItem = z.infer<typeof productItemSchema>;

export const displayProductSchema = z.object({
	productId: z.string(),
	productName: z.string(),
	description: z.string(),
	brand: z.string(),
	categories: z.array(z.string()),
	properties: z.array(productPropertySchema),
	allText: z.string(),
	images: z.array(z.string()),
	items: z.array(productItemSchema)
});

export type DisplayProduct = z.infer<typeof displayProductSchema>;

function range(n: number): number[] {
	return Array.from({ length: n }, (_, i) => i + 1);
}

/**
 * Transform the columnar product representation loaded from JSON into the
 * display model. `imagesBaseUrl` is injected (the core never reads env vars).
 */
export function mapColumnarToDisplay(
	data: ProductsColumnar,
	imagesBaseUrl: string
): DisplayProduct[] {
	return data.productId.map((_, index) => {
		// Parallel columns share the row index; fallbacks only apply to
		// ragged input and keep the declared DisplayProduct contract.
		const productId: string = data.productId[index] ?? '';
		const productName: string = data.productName[index] ?? '';
		const description: string = data.description[index] ?? '';
		const brand: string = data.brand[index] ?? '';
		return {
			productId,
			productName,
			description,
			brand,
			categories: data.categories[index]?.split(';') ?? [],
			properties: (data.properties[index]?.split(';') ?? []).map((category) => {
				const parts: string[] = category.split('=');
				return {
					name: parts[0] ?? '',
					values: [parts[1] ?? '']
				};
			}),
			allText: `${productName} ${description} ${brand}`,
			images: range(data.images_count[index] ?? 0).map((imageIndex) => {
				return `${imagesBaseUrl}/${productId}/${imageIndex}.webp`;
			}),
			items: (data.items[index]?.split(';') ?? []).map((item) => {
				const parts: string[] = item.split('=');
				const size: string = parts[0] ?? '';
				const price: string = parts[1] ?? '';
				return {
					itemId: `${productId}${size}`,
					size,
					price: Number(price)
				};
			})
		};
	});
}

export function cleanCategories(categories: string[]): string[] {
	return Array.from(
		new Set(
			categories.map((category) => {
				const pathParts = category.split('/').filter((part) => part !== '');
				const last: string | undefined = pathParts[pathParts.length - 1];
				const categoryName: string = last ?? category;
				return categoryName.toLowerCase();
			})
		)
	);
}

export function deleteProduct(productList: DisplayProduct[], productId: string): void {
	const index = productList.findIndex((p) => p.productId === productId);
	if (index !== -1) {
		productList.splice(index, 1);
	}
}

export function productFullUrl(product?: DisplayProduct): string {
	if (!product) return '';
	const productNameFull = `${product.brand} ${product.productName}`
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/\//g, '-');
	return `/#/products/${product.productId}/${productNameFull}`;
}
