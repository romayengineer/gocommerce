import { z } from 'zod';

/**
 * Shuffles an array using the Fisher-Yates algorithm.
 * Fastest approach because: (1) O(n) time vs O(n log n) for sort-based shuffling,
 * (2) only simple swap operations, no sorting overhead, (3) guarantees uniform
 * random distribution (each permutation has equal probability 1/n!).
 * Don't use array.sort(() => Math.random() - 0.5) — it's slower and statistically biased.
 * @param array - The array to shuffle
 * @returns A new shuffled copy of the array with uniform random distribution (O(n) time, O(n) space)
 */
export function shuffleFisherYates<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

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
	images: z.array(z.string()),
	items: z.array(z.string()),
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
	price: z.number(),
})

export type DisplayProductItems = z.infer<typeof displayProductItemsSchema>;

export const productItemSchema =  z.object({
	itemId: z.string(),
	size: z.string(),
	price: z.number(),
})

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
})

export type DisplayProduct = z.infer<typeof displayProductSchema>;

export const cartItemSchema = z.object({
	productId: z.string(),
	itemId: z.string(),
	quantity: z.number(),
})

export type CartItem = z.infer<typeof cartItemSchema>;

export function createValidator<T extends z.ZodType>(schema: T) {
	return (value: unknown): value is z.infer<T> => {
		return schema.safeParse(value).success;
	};
}

export const isValidCartItem = createValidator(cartItemSchema);

import productsData from '../data/products.json';

const productsColumnar: ProductsColumnar = productsData;

export const products: DisplayProduct[] = shuffleFisherYates(productsColumnar.productId.map((_, index) => {
	const productId = productsColumnar.productId[index]
	const productName = productsColumnar.productName[index];
	const description = productsColumnar.description[index];
	const brand = productsColumnar.brand[index];
	const product: DisplayProduct = {
		productId: productId,
		productName: productName,
		description: description,
		brand: brand,
		categories: productsColumnar.categories[index].split(";"),
		properties: productsColumnar.properties[index].split(";").map(category => {
			const parts = category.split("=");
			return {
				name: parts[0],
				values: [parts[1]],
			}
		}),
		allText: `${productName} ${description} ${brand}`,
		images: productsColumnar.images[index].split(";").map(url => `https://perfugroupar.vtexassets.com/arquivos/ids/${url}`),
		items: productsColumnar.items[index].split(";").map(item => {
			const parts = item.split("=");
			const size = parts[0];
			const price = parts[1];
			return {
				itemId: `${productId}${size}`,
				size: size,
				price: Number(price),
			}
		}),
	}
	return product;
}))

function cleanCategories(categories: string[]): string[] {
	return Array.from(new Set(categories.map(category => {
		const pathParts = category.split('/').filter((part) => part !== '');
		const categoryName = pathParts.length > 0 ? pathParts[pathParts.length - 1] : category;
		return categoryName.toLowerCase();
	})));
}

export const displayProductsBrands = Array.from(
	new Set(products.map(p => p.brand)),
).sort()

export const displayProductsSizes = Array.from(
	new Set(products.flatMap(p => p.items.map((i) => i.size))),
)

export const displayProductsCategories = cleanCategories(
	products.flatMap(p => p.categories)
).sort()


export function deleteProduct(productList: DisplayProduct[], productId: string) {
	const index = productList.findIndex(p => p.productId === productId);
	if (index !== -1) {
		productList.splice(index, 1);
	}
}

export function productFullUrl(product?: DisplayProduct): string {
	if (!product) return '';
	let productNameFull = (
		`${product.brand} ${product.productName}`
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/\//g, "-")
	);
	return `/#/products/${product.productId}/${productNameFull}`;
}