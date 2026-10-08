import { z } from 'zod';
import type { DisplayProduct, DisplayProductItems } from './product';

export const cartItemSchema = z.object({
	productId: z.string(),
	itemId: z.string(),
	quantity: z.number().int().positive()
});

export type CartItem = z.infer<typeof cartItemSchema>;

export interface CartItemFull {
	product: DisplayProductItems;
	quantity: number;
}

interface HasID {
	productId: string;
	itemId: string;
}

export function sameItem(item: HasID, productId: string, itemId: string): boolean {
	return item.productId === productId && item.itemId === itemId;
}

export function findItem(
	items: CartItem[],
	productId: string,
	itemId: string
): CartItem | undefined {
	return items.find((item) => sameItem(item, productId, itemId));
}

/** Returns a new array with the item added or its quantity increased. */
export function addItem(
	items: CartItem[],
	productId: string,
	itemId: string,
	quantity: number
): CartItem[] {
	const next = items.map((item) => ({ ...item }));
	const existing = findItem(next, productId, itemId);
	if (existing) {
		existing.quantity += quantity;
	} else {
		next.push({ productId, itemId, quantity });
	}
	return next;
}

export function removeItem(items: CartItem[], productId: string, itemId: string): CartItem[] {
	return items.filter((item) => !sameItem(item, productId, itemId));
}

/**
 * Sets the quantity for an item. Quantities <= 0 remove the item.
 * Always returns a new array.
 */
export function setQuantity(
	items: CartItem[],
	productId: string,
	itemId: string,
	quantity: number
): CartItem[] {
	if (quantity <= 0) return removeItem(items, productId, itemId);
	return items.map((item) =>
		sameItem(item, productId, itemId) ? { ...item, quantity } : { ...item }
	);
}

export function sortCartItems(items: CartItemFull[]): CartItemFull[] {
	return [...items].sort((a: CartItemFull, b: CartItemFull): number => {
		const brandCompare = a.product.brand.localeCompare(b.product.brand);
		if (brandCompare !== 0) return brandCompare;

		const nameCompare = a.product.productName.localeCompare(b.product.productName);
		if (nameCompare !== 0) return nameCompare;

		return parseInt(a.product.size) - parseInt(b.product.size);
	});
}

function toDisplayProductItems(product: DisplayProduct, itemId: string): DisplayProductItems | undefined {
	const productItem = product.items.find((candidate) => candidate.itemId === itemId);
	if (!productItem) return undefined;
	return {
		productId: product.productId,
		productName: product.productName,
		description: product.description,
		brand: product.brand,
		categories: product.categories,
		properties: product.properties,
		allText: product.allText,
		images: product.images,
		itemId: productItem.itemId,
		size: productItem.size,
		price: productItem.price
	};
}

/**
 * Resolve raw cart items against the catalog. Items whose product is no longer
 * available are silently dropped (pure: no side effects).
 */
export function resolveCartItems(
	items: CartItem[],
	products: DisplayProduct[]
): CartItemFull[] {
	const resolved: CartItemFull[] = [];
	for (const item of items) {
		const product = products.find((candidate) => candidate.productId === item.productId);
		if (!product) continue;
		const displayProduct = toDisplayProductItems(product, item.itemId);
		if (!displayProduct) continue;
		resolved.push({ product: displayProduct, quantity: item.quantity });
	}
	return sortCartItems(resolved);
}

export function cartCount(items: CartItem[]): number {
	return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartTotal(items: CartItemFull[]): number {
	return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}
