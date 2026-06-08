import { browser } from '$app/environment';
import { isValidFormData } from './schemas';
import type { ShippingFormData } from './schemas';
import { logger } from './logger.svelte';

const CHECKOUT_FORM_KEY = 'ecommerce_checkout_form';

export function saveCheckoutForm(formData: ShippingFormData): void {
	if (browser) {
		localStorage.setItem(CHECKOUT_FORM_KEY, JSON.stringify(formData));
	}
}

export function loadCheckoutForm(): ShippingFormData | null {
	if (!browser) return null;

	const stored = localStorage.getItem(CHECKOUT_FORM_KEY);
	if (!stored) return null;

	try {
		let formData = JSON.parse(stored);
		// return clearInvalidForm(formData); // TODO
		return formData
	} catch {
		return null;
	}
}

export function clearCheckoutForm(): void {
	if (browser) {
		localStorage.removeItem(CHECKOUT_FORM_KEY);
	}
}

export function clearInvalidForm(stored: any): ShippingFormData | null {
	if(!isValidFormData(stored)) {
		logger.log("Invalid form data, clearing form");
		clearCheckoutForm();
		return null
	}
	return stored as ShippingFormData
}
