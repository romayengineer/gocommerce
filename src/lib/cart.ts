import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { logger } from './logger.svelte';
import type { DisplayProduct, CartItem  } from './products';
import { isValidCartItem, displayProductsList } from './products';

const CART_KEY = 'ecommerce_cart';

export interface CartItemFull {
	product: DisplayProduct;
	quantity: number;
}

function createCartStore() {
	const stored = browser ? localStorage.getItem(CART_KEY) : null;
	const initial: CartItem[] = stored ? JSON.parse(stored) : [];

	const { subscribe, set, update } = writable<CartItem[]>(initial);

	const ob = {
		subscribe,
		addToCart: (productId: string, quantity: number) => {
			update((items: CartItem[]) => {
				const existing = items.find((item) => item.itemId === productId);
				if (existing) {
					existing.quantity += quantity;
				} else {
					items.push({ itemId: productId, quantity });
				}
				if (browser) localStorage.setItem(CART_KEY, JSON.stringify(items));
				return items;
			});
		},
		removeFromCart: (productId: string) => {
			update((items: CartItem[]) => {
				const filtered = items.filter((item) => item.itemId !== productId);
				if (browser) localStorage.setItem(CART_KEY, JSON.stringify(filtered));
				return filtered;
			});
		},
		updateQuantity: (productId: string, quantity: number) => {
			update((items: CartItem[]) => {
				const item = items.find((item) => item.itemId === productId);
				if (item) {
					if (quantity <= 0) {
						items = items.filter((item) => item.itemId !== productId);
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

export async function addToCart(productId: string, quantity: number): Promise<void> {
	cart.addToCart(productId, quantity);
}

export async function removeFromCart(productId: string): Promise<void> {
	cart.removeFromCart(productId);
}

export async function updateQuantity(productId: string, quantity: number): Promise<void> {
	cart.updateQuantity(productId, quantity);
}

export async function clearCart(): Promise<void> {
	cart.clearCart();
}

export const cartProducts = derived(cart, (items) => {
	let products = items.map((item) => {
		const product = displayProductsList.find((product) => product.itemId === item.itemId);
		if (!product) {
			removeFromCart(item.itemId);
			return;
		}
		return {
			product: product,
			quantity: item.quantity,
		} as CartItemFull;
	});
	return products.filter(Boolean);
});
