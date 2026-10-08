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
 * Read a parallel column (or `key=value` part) at an index. Columnar
 * payloads must be rectangular; ragged input fails fast instead of
 * producing corrupt display models (e.g. a missing price silently
 * coercing to 0).
 */
function columnAt<T>(column: T[], index: number, name: string): T {
	const value: T | undefined = column[index];
	if (value === undefined) throw new Error(`ragged columnar data: missing ${name} at index ${index}`);
	return value;
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
		const productId: string = columnAt(data.productId, index, 'productId');
		const productName: string = columnAt(data.productName, index, 'productName');
		const description: string = columnAt(data.description, index, 'description');
		const brand: string = columnAt(data.brand, index, 'brand');
		return {
			productId,
			productName,
			description,
			brand,
			categories: columnAt(data.categories, index, 'categories').split(';'),
			properties: columnAt(data.properties, index, 'properties')
				.split(';')
				.map((category) => {
					const parts: string[] = category.split('=');
					return {
						name: columnAt(parts, 0, 'property name'),
						values: [columnAt(parts, 1, 'property value')]
					};
				}),
			allText: `${productName} ${description} ${brand}`,
			images: range(columnAt(data.images_count, index, 'images_count')).map((imageIndex) => {
				return `${imagesBaseUrl}/${productId}/${imageIndex}.webp`;
			}),
			items: columnAt(data.items, index, 'items')
				.split(';')
				.map((item) => {
					const parts: string[] = item.split('=');
					const size: string = columnAt(parts, 0, 'item size');
					const price: string = columnAt(parts, 1, 'item price');
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
