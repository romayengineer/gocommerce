import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import { readable, writable, type Writable } from 'svelte/store';
import CheckoutForm from './CheckoutForm.svelte';
import { CheckoutService } from '$core/application/CheckoutService';
import type { KeyValueStorage } from '$core/ports/Storage';
import type { RouterPort } from '$core/ports/Router';
import type { Logger } from '$core/ports/Logger';
import '$adapters/svelte/i18n';

const CHECKOUT_TEST_KEY = 'checkout_test_form';

const h = vi.hoisted(() => {
	const map = new Map<string, string>();
	const storage: KeyValueStorage = {
		get: (k) => map.get(k) ?? null,
		set: (k, v) => map.set(k, v),
		remove: (k) => map.delete(k)
	};
	const deps: {
		checkout?: CheckoutService;
		errors?: Writable<Record<string, unknown>>;
		submitting?: Writable<boolean>;
		maps?: { initialize: () => Promise<void>; updateLocation: () => Promise<unknown> };
		mapsState?: Writable<{ apiKeyMissing: boolean; locationNotFound: boolean }>;
	} = {};
	return { storage, deps };
});

vi.mock('./view', () => ({
	get checkoutService() {
		return h.deps.checkout as CheckoutService;
	},
	get checkoutErrors() {
		return h.deps.errors as Writable<Record<string, unknown>>;
	},
	get checkoutSubmitting() {
		return h.deps.submitting as Writable<boolean>;
	},
	get mapService() {
		return h.deps.maps as NonNullable<typeof h.deps.maps>;
	},
	get mapState() {
		return h.deps.mapsState as Writable<{ apiKeyMissing: boolean; locationNotFound: boolean }>;
	}
}));

const noopLogger: Logger = { log: () => {}, warn: () => {}, error: () => {} };

const fakeRouter: RouterPort = {
	route: {
		get: () => ({ path: '/checkout', href: '', params: {}, query: new URLSearchParams() }),
		subscribe: () => () => {}
	},
	navigate: vi.fn()
};

function makeService(): CheckoutService {
	return new CheckoutService(
		{ submit: async () => {} },
		h.storage,
		fakeRouter,
		noopLogger,
		CHECKOUT_TEST_KEY
	);
}

describe('CheckoutForm persistence', () => {
	beforeEach(() => {
		h.storage.remove(CHECKOUT_TEST_KEY);
		h.deps.checkout = makeService();
		h.deps.errors = writable({});
		h.deps.submitting = writable(false);
		h.deps.mapsState = writable({ apiKeyMissing: false, locationNotFound: false });
		h.deps.maps = {
			initialize: async () => {},
			updateLocation: async () => ({ latitude: -34.6, longitude: -58.4 })
		};
	});

	it('persists filled fields to storage and restores them after a refresh', async () => {
		const target = document.createElement('div');
		document.body.appendChild(target);
		const component = mount(CheckoutForm, { target });
		await tick();

		const firstName = target.querySelector<HTMLInputElement>('#firstName');
		expect(firstName).not.toBeNull();

		const fields: Record<string, string> = {
			firstName: 'Jane',
			lastName: 'Doe',
			email: 'jane@example.com',
			phone: '555-1234',
			address: '123 Main St',
			state: 'Buenos Aires'
		};
		for (const [id, value] of Object.entries(fields)) {
			const input = target.querySelector<HTMLInputElement>(`#${id}`);
			expect(input, `expected #${id} to exist`).not.toBeNull();
			input!.value = value;
			input!.dispatchEvent(new Event('input', { bubbles: true }));
		}
		await tick();

		// Field edits must be written to localStorage as the user types.
		const stored = JSON.parse(h.storage.get(CHECKOUT_TEST_KEY)!);
		expect(stored.firstName).toBe('Jane');

		// Simulate a page refresh: a brand new service reads storage back.
		const reloaded = new CheckoutService(
			{ submit: async () => {} },
			h.storage,
			fakeRouter,
			noopLogger,
			CHECKOUT_TEST_KEY
		);
		expect(reloaded.formData.get().firstName).toBe('Jane');

		unmount(component);
	});
});