import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { logger } from './logger.svelte';
import type { DisplayProductItems, CartItem  } from './products';
import { isValidCartItem, displayProductsList } from './products';

const CART_KEY = 'ecommerce_cart';

export interface CartItemFull {
	product: DisplayProductItems;
	quantity: number;
}

interface HasID {
	productId: string;
	itemId: string; 
}

const sameItem = (item: HasID, productId: string, itemId: string): boolean => {
	return item.productId === productId && item.itemId === itemId;
}

const findItem = (items: CartItem[], productId: string, itemId: string): CartItem | undefined => {
	return items.find((item) => sameItem(item, productId, itemId));
}

function createCartStore() {
	const stored = browser ? localStorage.getItem(CART_KEY) : null;
	const initial: CartItem[] = stored ? JSON.parse(stored) : [];

	const { subscribe, set, update } = writable<CartItem[]>(initial);

	const ob = {
		subscribe,
		addToCart: (productId: string, itemId: string, quantity: number) => {
			update((items: CartItem[]) => {
				const existing = findItem(items, productId, itemId);
				if (existing) {
					existing.quantity += quantity;
				} else {
					items.push({ productId, itemId, quantity });
				}
				if (browser) localStorage.setItem(CART_KEY, JSON.stringify(items));
				return items;
			});
		},
		removeFromCart: (productId: string, itemId: string) => {
			update((items: CartItem[]) => {
				const filtered = items.filter((item) => !sameItem(item, productId, itemId));
				if (browser) localStorage.setItem(CART_KEY, JSON.stringify(filtered));
				return filtered;
			});
		},
		updateQuantity: (productId: string, itemId: string, quantity: number) => {
			update((items: CartItem[]) => {
				const item = findItem(items, productId, itemId);
				if (item) {
					if (quantity <= 0) {
						items = items.filter((item) => !sameItem(item, productId, itemId));
					} else {
						item.quantity = quantity;
					}
				}
				if (browser) localStorage.setItem(CART_KEY, JSON.stringify(items));
				return items;
			});
		},
		clearCart: () => {
			set([]);
			if (browser) localStorage.removeItem(CART_KEY);
		}
	};

	// clear cart if any product is invalid so that the cart view can display the products
	initial.some((item) => {
		if (!isValidCartItem(item)) {
			logger.log("Invalid cart item, clearing cart");
			ob.clearCart();
			return true
		}
	})

	return ob
}

export const cart = createCartStore();

export async function addToCart(productId: string, itemId: string, quantity: number): Promise<void> {
	cart.addToCart(productId, itemId, quantity);
}

export async function removeFromCart(productId: string, itemId: string): Promise<void> {
	cart.removeFromCart(productId, itemId);
}

export async function updateQuantity(productId: string, itemId: string, quantity: number): Promise<void> {
	cart.updateQuantity(productId, itemId, quantity);
}

export async function clearCart(): Promise<void> {
	cart.clearCart();
}

// TODO fix cart
export const cartProducts = derived(cart, (items) => {
	let products: (CartItemFull | undefined)[] = items.map((item) => {
		const product = displayProductsList.find((product) => product.productId === item.productId);
		if (!product) {
			removeFromCart(item.productId, item.itemId);
			return;
		}
		const productItem = product.items.find((productItem) => productItem.itemId === item.itemId);
		if (!productItem) {
			removeFromCart(item.productId, item.itemId);
			return;
		}
		return {
			product: {
				productId: product.productId,
				nameComplete: product.nameComplete,
				description: product.description,
				brand: product.brand,
				categories: product.categories,
				properties: product.properties,
				allText: product.allText,
				images: product.images,
				itemId: productItem.itemId,
				size: productItem.size,
				price: productItem.price,
			},
			quantity: item.quantity,
		} as CartItemFull;
	});
	let productsFiltered = products.filter(Boolean) as CartItemFull[];
	return productsFiltered.sort((a: CartItemFull, b: CartItemFull): number => {
		const textA = `${a.product.brand} ${a.product.nameComplete} ${a.product.size}`;
		const textB = `${b.product.brand} ${b.product.nameComplete} ${b.product.size}`;
		return textA.localeCompare(textB)
	})
});
