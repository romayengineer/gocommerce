import { z } from 'zod';

export const productPropertySchema = z.object({
	name: z.string(),
	values: z.array(z.string())
});

export type ProductProperty = z.infer<typeof productPropertySchema>;

export const productPriceSchema = z.object({
	Price: z.number(),
	ListPrice: z.number()
});

export type ProductPrice = z.infer<typeof productPriceSchema>;

export const productSellerAndPriceSchema = z.object({
	sellerId: z.string(),
	sellerName: z.string(),
	commertialOffer: productPriceSchema
});

export type ProductSellerAndPrice = z.infer<typeof productSellerAndPriceSchema>;

export const productItemVariantSchema = z.object({
	itemId: z.string(),
	name: z.string(),
	nameComplete: z.string(),
	ean: z.string(),
	images: z.array(z.string()),
	sellers: z.array(productSellerAndPriceSchema)
});

export type ProductItemVariant = z.infer<typeof productItemVariantSchema>;

export const productSchema = z.object({
	productId: z.string(),
	productName: z.string(),
	description: z.string(),
	brand: z.string(),
	brandId: z.number(),
	categories: z.array(z.string()),
	properties: z.array(productPropertySchema),
	items: z.array(productItemVariantSchema)
});

export type Product = z.infer<typeof productSchema>;

export const displayProductSchema = z.object({
	itemId: z.string(),
	nameComplete: z.string(),
	productId: z.string(),
	productName: z.string(),
	description: z.string(),
	size: z.string(),
	brand: z.string(),
	categories: z.array(z.string()),
	images: z.array(z.string()),
	properties: z.array(productPropertySchema),
	price: z.number(),
	allText: z.string(),
})

export type DisplayProduct = z.infer<typeof displayProductSchema>;

export const cartItemSchema = z.object({
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
export const products: Product[] = productsData;

export function filterPropertiesByNames(
	properties: ProductProperty[],
	excludePatterns: string[],
	caseSensitive = false
): ProductProperty[] {
	return properties.filter((prop) => {
		const name = caseSensitive ? prop.name : prop.name.toLowerCase();
		return !excludePatterns.some((pattern) => {
			const p = caseSensitive ? pattern : pattern.toLowerCase();
			return name.includes(p);
		});
	});
}

function cleanHtmlTags(text: string): string {
	let newText = text
	// replace </p> </br> for \n
	newText = text.replace(/<\/p>/g, '\n').replace(/<br\s*\/?>/gi, '\n');
	// remove all remaining html tags
	newText = newText.replace(/<[^>]*>/g, '');
	// collapse multiple consecutive spaces into one (preserve newlines)
	newText = newText.replace(/[ \t]+/g, ' ');
	// trim leading spaces from each line (preserve newlines)
	newText = newText.replace(/^[ \t]+/gm, '');
	// collapse multiple consecutive newlines to at most two
	newText = newText.replace(/\n{3,}/g, '\n\n');
	// lower case
	newText = newText.toLowerCase();
	return newText;
}

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

function removeSets(dp: DisplayProduct): Boolean {
	return !dp.nameComplete.includes("+")
}

function removeCategories(dp: DisplayProduct): Boolean {
	return !dp.categories.some((c) => c.includes("sets de fragancia"))
}

function removeUnwanted(dp: DisplayProduct): Boolean {
	if(!removeSets(dp)) return false
	if(!removeCategories(dp)) return false
	return true
}

export function getDisplayProducts(): DisplayProduct[] {
	let displayProductsList = products.flatMap((product) => {
		const properties = filterPropertiesByNames(product.properties, ["VÍA", "Internal tax"])
		const clearnDescription = cleanHtmlTags(product.description);
		const brand = product.brand.toLowerCase();
		const categories = product.categories.map((c) => c.toLowerCase());
		return product.items.map((item): DisplayProduct => {
			const nameComplete = item.nameComplete.toLowerCase();
			return {
				itemId: item.itemId,
				nameComplete: nameComplete,
				productId: product.productId,
				productName: product.productName,
				description: clearnDescription,
				size: item.name.toUpperCase(),
				brand: brand,
				categories: categories,
				images: item.images,
				properties: properties,
				price: item.sellers[0]?.commertialOffer.Price ?? 0,
				allText: `${nameComplete} ${brand} ${clearnDescription}`,
			}
		}).filter(removeUnwanted);
	});
	return shuffleFisherYates(displayProductsList);
}

export var displayProductsList = getDisplayProducts()


export function deleteProduct(productList: DisplayProduct[], productId: string) {
	const index = productList.findIndex(p => p.itemId === productId);
	if (index !== -1) {
		productList.splice(index, 1);
	}
}