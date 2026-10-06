import { describe, it, expect } from 'vitest';
import { CheckoutService } from '$core/application/CheckoutService';
import { createEmptyShippingFormData, type ShippingFormData } from '$core/domain/shipping';
import type { KeyValueStorage } from '$core/ports/Storage';
import type { RouterPort } from '$core/ports/Router';
import type { Logger } from '$core/ports/Logger';

function memoryStorage(): { storage: KeyValueStorage; getRaw: (k: string) => string | null } {
	const map = new Map<string, string>();
	return {
		storage: {
			get: (k) => map.get(k) ?? null,
			set: (k, v) => map.set(k, v),
			remove: (k) => map.delete(k)
		},
		getRaw: (k) => map.get(k) ?? null
	};
}

const noopLogger: Logger = { log: () => {}, warn: () => {}, error: () => {} };

const fakeRouter: RouterPort = {
	route: {
		get: () => ({ path: '/checkout', href: '', params: {}, query: new URLSearchParams() }),
		subscribe: () => () => {}
	},
	navigate: () => {}
};

const KEY = 'checkout_test_form';

const validForm: ShippingFormData = {
	firstName: 'Jane',
	lastName: 'Doe',
	email: 'jane@example.com',
	phone: '555-1234',
	address: '123 Main St',
	amenity: '',
	city: '',
	county: '',
	stateName: 'Buenos Aires',
	zipCode: '',
	country: 'Argentina',
	coordinates: {}
};

function makeService(storage: KeyValueStorage): CheckoutService {
	return new CheckoutService({ submit: async () => {} }, storage, fakeRouter, noopLogger, KEY);
}

describe('CheckoutService persistence', () => {
	it('persists updates to storage and restores them on a new service', () => {
		const { storage, getRaw } = memoryStorage();
		const checkout = makeService(storage);
		checkout.formData.set(validForm);

		const stored = JSON.parse(getRaw(KEY)!);
		expect(stored.firstName).toBe('Jane');

		const reloaded = makeService(storage);
		expect(reloaded.formData.get()).toEqual(validForm);
	});

	it('starts from a valid stored form instead of the empty one', () => {
		const { storage } = memoryStorage();
		storage.set(KEY, JSON.stringify(validForm));
		const checkout = makeService(storage);
		expect(checkout.formData.get()).toEqual(validForm);
	});

	it('falls back to an empty form when stored data is invalid', () => {
		const { storage } = memoryStorage();
		storage.set(KEY, JSON.stringify({ not: 'a shipping form' }));
		const checkout = makeService(storage);
		expect(checkout.formData.get().firstName).toBe('');
	});

	it('clears the form and its persisted value', () => {
		const { storage, getRaw } = memoryStorage();
		const checkout = makeService(storage);
		checkout.formData.set(validForm);
		checkout.clear();
		expect(getRaw(KEY)).toBeNull();
		expect(checkout.formData.get().firstName).toBe('');
	});
});