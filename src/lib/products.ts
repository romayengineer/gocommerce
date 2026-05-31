import { z } from 'zod';

export const productSchema = z.object({
	itemId: z.string(),
	nameComplete: z.string(),
	ean: z.string(),
	variations: z.array(z.string()),
	images: z.array(z.string()),
	price: z.number()
});

export type Product = z.infer<typeof productSchema>;

export function createValidator<T extends z.ZodType>(schema: T) {
	return (value: unknown): value is z.infer<T> => {
		return schema.safeParse(value).success;
	};
}

export const isValidProduct = createValidator(productSchema);

import productsData from '../data/products.json';
export const products: Product[] = productsData;