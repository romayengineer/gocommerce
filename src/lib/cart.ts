import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Product } from './products';

export interface CartItem {
	product: Product;
	quantity: number;
}

const CART_KEY = 'ecommerce_cart';

function createCartStore() {
	const stored = browser ? localStorage.getItem(CART_KEY) : null;
	const initial: CartItem[] = stored ? JSON.parse(stored) : [];

	const { subscribe, set, update } = writable<CartItem[]>(initial);

	return {
		subscribe,
		addToCart: (product: Product, quantity: number) => {
			update((items: CartItem[]) => {
				const existing = items.find((item) => item.product.itemId === product.itemId);
				if (existing) {
					existing.quantity += quantity;
				} else {
					items.push({ product, quantity });
				}
				if (browser) localStorage.setItem(CART_KEY, JSON.stringify(items));
				return items;
			});
		},
		removeFromCart: (productId: string) => {
			update((items: CartItem[]) => {
				const filtered = items.filter((item) => item.product.itemId !== productId);
				if (browser) localStorage.setItem(CART_KEY, JSON.stringify(filtered));
				return filtered;
			});
		},
		updateQuantity: (productId: string, quantity: number) => {
			update((items: CartItem[]) => {
				const item = items.find((i) => i.product.itemId === productId);
				if (item) {
					if (quantity <= 0) {
						items = items.filter((i) => i.product.itemId !== productId);
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
}

export const cart = createCartStore();

export async function addToCart(product: Product, quantity: number): Promise<void> {
	cart.addToCart(product, quantity);
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
