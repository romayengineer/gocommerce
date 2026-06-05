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
	brand: z.string(),
	brandId: z.number(),
	categories: z.array(z.string()),
	images: z.array(z.string()),
	properties: z.array(productPropertySchema),
	sellers: z.array(productSellerAndPriceSchema),
	price: z.number(),
})

export type DisplayProduct = z.infer<typeof displayProductSchema>;

export function createValidator<T extends z.ZodType>(schema: T) {
	return (value: unknown): value is z.infer<T> => {
		return schema.safeParse(value).success;
	};
}

export const isValidProduct = createValidator(displayProductSchema);

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
	// lower case
	newText = newText.toLowerCase();
	return newText;
}

export function getDisplayProducts(): DisplayProduct[] {
	return products.flatMap((product) => {
		const properties = filterPropertiesByNames(product.properties, ["VÍA", "Internal tax"])
		return product.items.map((item) => ({
			itemId: item.itemId,
			nameComplete: item.nameComplete,
			productId: product.productId,
			productName: product.productName,
			description: cleanHtmlTags(product.description),
			brand: product.brand,
			brandId: product.brandId,
			categories: product.categories,
			images: item.images,
			properties: properties,
			sellers: item.sellers,
			price: item.sellers[0]?.commertialOffer.Price ?? 0
		}))
	}
	);
}