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

export const displayProductItemsSchema = z.object({
	productId: z.string(),
	itemId: z.string(),
	nameComplete: z.string(),
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
	nameComplete: z.string(),
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

function removeSets(dp: any): Boolean {
	return !dp.nameComplete.includes("+")
}

function removeCategories(dp: any): Boolean {
	return !dp.categories.some((c: string) => c.includes("sets de fragancia"))
}

function removeUnwanted(dp: any): Boolean {
	if(!removeSets(dp)) return false
	if(!removeCategories(dp)) return false
	return true
}

export function getDisplayProductsItems(): DisplayProductItems[] {
	let displayProductsList = products.flatMap((product) => {
		const properties = filterPropertiesByNames(product.properties, ["VÍA", "Internal tax"])
		const clearnDescription = cleanHtmlTags(product.description);
		const brand = product.brand.toLowerCase();
		const categories = product.categories.map((c) => c.toLowerCase());
		return product.items.map((item): DisplayProductItems => {
			const nameComplete = item.nameComplete.toLowerCase();
			return {
				productId: product.productId,
				itemId: item.itemId,
				nameComplete: nameComplete,
				description: clearnDescription,
				brand: brand,
				categories: categories,
				properties: properties,
				allText: `${nameComplete} ${brand} ${clearnDescription}`,
				images: item.images,
				size: item.name.toUpperCase(),
				price: item.sellers[0]?.commertialOffer.Price ?? 0,
			}
		}).filter(removeUnwanted);
	});
	return shuffleFisherYates(displayProductsList);
}

export function sortSizes(a: ProductItem, b: ProductItem): number {
	const aNum = Number(a.size.split(/\s+/)[0]);
	const bNum = Number(b.size.split(/\s+/)[0]);
	return aNum - bNum;
}

export function sortSizesString(a: string, b: string): number {
	const aNum = Number(a.split(/\s+/)[0]);
	const bNum = Number(b.split(/\s+/)[0]);
	return aNum - bNum;
}

let displayProductsSizesSet: Set<string> = new Set()

export function getDisplayProducts(): DisplayProduct[] {
	let displayProductsList = products.map((product) => {
		const properties = filterPropertiesByNames(product.properties, ["VÍA", "Internal tax"])
		const clearnDescription = cleanHtmlTags(product.description);
		const brand = product.brand.toLowerCase();
		const categories = product.categories.map((c) => c.toLowerCase());
		const nameComplete = product.productName.toLowerCase();
		return {
			productId: product.productId,
			nameComplete: nameComplete,
			description: clearnDescription,
			brand: brand,
			categories: categories,
			properties: properties,
			allText: `${nameComplete} ${brand} ${clearnDescription}`,
			images: product.items[0]?.images,
			items: product.items.map(item => {
				const size = item.name.toUpperCase();
				displayProductsSizesSet.add(size);
				return {
					itemId: item.itemId,
					size: size,
					price: item.sellers[0]?.commertialOffer.Price ?? 0,
				}
			}).sort(sortSizes)
		}
	}).filter(removeUnwanted);
	return shuffleFisherYates(displayProductsList);
}



function cleanCategories(categories: string[]): string[] {
	return Array.from(new Set(categories.map(category => {
		const pathParts = category.split('/').filter((part) => part !== '');
		const categoryName = pathParts.length > 0 ? pathParts[pathParts.length - 1] : category;
		return categoryName.toLowerCase();
	})));
}

export var displayProductsList = getDisplayProducts()

export const displayProductsBrands = Array.from(
	new Set(displayProductsList.map(p => p.brand)),
).sort()

export const displayProductsSizes = Array.from(
	new Set(displayProductsList.flatMap(p => p.items.map((i) => i.size))),
).filter((s: string) => s.includes("ML")).sort(sortSizesString)

export const displayProductsCategories = cleanCategories(
	displayProductsList.flatMap(p => p.categories)
).sort()


export function deleteProduct(productList: DisplayProduct[], productId: string) {
	const index = productList.findIndex(p => p.productId === productId);
	if (index !== -1) {
		productList.splice(index, 1);
	}
}

export function productFullUrl(product?: DisplayProduct): string {
	if (!product) return '';
	let productNameFull = `${product.brand} ${product.nameComplete}`.toLowerCase().replace(/ /g, "-");
	return `/#/products/${product.productId}/${productNameFull}`;
}