import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const CART_KEY = 'ecommerce_cart';

function createCartStore() {
	const stored = browser ? localStorage.getItem(CART_KEY) : null;
	const initial = stored ? JSON.parse(stored) : [];

	const { subscribe, set, update } = writable(initial);

	return {
		subscribe,
		addToCart: (product, quantity) => {
			update(items => {
				const existing = items.find(item => item.product.id === product.id);
				if (existing) {
					existing.quantity += quantity;
				} else {
					items.push({ product, quantity });
				}
				if (browser) localStorage.setItem(CART_KEY, JSON.stringify(items));
				return items;
			});
		},
		removeFromCart: (productId) => {
			update(items => {
				const filtered = items.filter(item => item.product.id !== productId);
				if (browser) localStorage.setItem(CART_KEY, JSON.stringify(filtered));
				return filtered;
			});
		},
		updateQuantity: (productId, quantity) => {
			update(items => {
				const item = items.find(i => i.product.id === productId);
				if (item) {
					if (quantity <= 0) {
						items = items.filter(i => i.product.id !== productId);
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

export async function addToCart(product, quantity) {
	cart.addToCart(product, quantity);
}

export async function removeFromCart(productId) {
	cart.removeFromCart(productId);
}

export async function updateQuantity(productId, quantity) {
	cart.updateQuantity(productId, quantity);
}

export async function clearCart() {
	cart.clearCart();
}
