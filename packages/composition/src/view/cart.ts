import { toSvelte } from '@gocommerce/adapters/svelte/store';
import { getContainer } from '../singleton';

function container() {
	return getContainer();
}

export const cartService = getContainer().cart;

export const cartItems = toSvelte(getContainer().cart.items);
export const cartProducts = toSvelte(getContainer().cart.products);
export const cartCount = toSvelte(getContainer().cart.count);
export const cartTotal = toSvelte(getContainer().cart.total);

export const addToCart = (productId: string, itemId: string, quantity: number): void =>
	container().cart.addToCart(productId, itemId, quantity);

export const removeFromCart = (productId: string, itemId: string): void =>
	container().cart.removeFromCart(productId, itemId);

export const updateQuantity = (productId: string, itemId: string, quantity: number): void =>
	container().cart.updateQuantity(productId, itemId, quantity);
