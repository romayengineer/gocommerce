import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, tick, unmount } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import { init } from 'svelte-i18n';
import CheckoutForm from './CheckoutForm.svelte';

init({ fallbackLocale: 'es', initialLocale: 'es' });

// Minimal fakes so this UI test does not depend on @gocommerce/application,
// @gocommerce/ports, or @gocommerce/adapters (see gocommerce-5rp).
interface KeyValueStorage {
	get(key: string): string | null;
	set(key: string, value: string): void;
	remove(key: string): void;
}

interface FakeFormData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	amenity?: string;
	city?: string;
	county?: string;
	stateName?: string;
	zipCode?: string;
	country?: string;
	coordinates?: { latitude?: number; longitude?: number };
}

const EMPTY_FORM: FakeFormData = {
	firstName: '',
	lastName: '',
	email: '',
	phone: '',
	address: '',
	amenity: '',
	city: '',
	county: '',
	stateName: '',
	zipCode: '',
	country: 'Argentina',
	coordinates: { latitude: undefined, longitude: undefined }
};

function restoreForm(value: unknown): FakeFormData {
	if (value === null || typeof value !== 'object' || Array.isArray(value)) return { ...EMPTY_FORM };
	const source = value as Record<string, unknown>;
	const restored: FakeFormData = { ...EMPTY_FORM };
	for (const key of Object.keys(EMPTY_FORM) as (keyof FakeFormData)[]) {
		if (key === 'coordinates') continue;
		if (typeof source[key] === 'string') (restored[key] as unknown) = source[key];
	}
	return restored;
}

class FakeCheckoutService {
	readonly formData: {
		get(): FakeFormData;
		set(value: FakeFormData): void;
		subscribe(listener: (value: FakeFormData) => void): () => void;
	};

	constructor(
		private storage: KeyValueStorage,
		private key: string
	) {
		let current: FakeFormData = restoreForm(
			(() => {
				try {
					const raw = storage.get(key);
					return raw ? (JSON.parse(raw) as unknown) : null;
				} catch {
					return null;
				}
			})()
		);
		const listeners = new Set<(value: FakeFormData) => void>();
		this.formData = {
			get: () => current,
			set: (next: FakeFormData) => {
				current = next;
				storage.set(key, JSON.stringify(next));
				for (const listener of [...listeners]) listener(next);
			},
			subscribe: (listener: (value: FakeFormData) => void) => {
				listeners.add(listener);
				listener(current);
				return () => {
					listeners.delete(listener);
				};
			}
		};
	}

	validate(): boolean {
		return true;
	}

	async submit(): Promise<void> {}
}

const CHECKOUT_TEST_KEY = 'checkout_test_form';

const h = vi.hoisted(() => {
	const map = new Map<string, string>();
	const storage: KeyValueStorage = {
		get: (k) => map.get(k) ?? null,
		set: (k, v) => map.set(k, v),
		remove: (k) => map.delete(k)
	};
	const deps: {
		checkout?: FakeCheckoutService;
		errors?: Writable<Record<string, unknown>>;
		submitting?: Writable<boolean>;
		maps?: { initialize: () => Promise<void>; updateLocation: () => Promise<unknown> };
		mapsState?: Writable<{ apiKeyMissing: boolean; locationNotFound: boolean }>;
	} = {};
	return { storage, deps };
});

vi.mock('@gocommerce/composition/view', () => {
	// Fully stubbed view: wired services from hoisted fakes + minimal pure
	// helpers inlined so this test has zero @gocommerce imports.
	// (Full importOriginal would pull container -> $app/state, unavailable in vitest.)
	const ARGENTINE_PROVINCES = [
		{ value: 'Buenos Aires', label: 'Buenos Aires' },
		{ value: 'CABA', label: 'Ciudad Autónoma de Buenos Aires' }
	];
	const AMENITIES: { value: string; label: string }[] = [];
	const filterOptions = <T extends { value: string; label: string }>(options: T[], query: string): T[] => {
		const q = query.trim().toLowerCase();
		if (!q) return options;
		return options.filter(
			(o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
		);
	};
	const matchesOption = (options: { value: string }[], value: string | undefined): boolean =>
		typeof value === 'string' && options.some((o) => o.value === value);
	return {
		filterOptions,
		matchesOption,
		ARGENTINE_PROVINCES,
		AMENITIES,
		get checkoutService() {
			return h.deps.checkout as FakeCheckoutService;
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
	};
});

function makeService(): FakeCheckoutService {
	return new FakeCheckoutService(h.storage, CHECKOUT_TEST_KEY);
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
		const reloaded = new FakeCheckoutService(h.storage, CHECKOUT_TEST_KEY);
		expect(reloaded.formData.get().firstName).toBe('Jane');

		unmount(component);
	});

	it('keeps partially filled fields after a page refresh', async () => {
		const target = document.createElement('div');
		document.body.appendChild(target);
		const component = mount(CheckoutForm, { target });
		await tick();

		// Only some fields are filled, so the form is not yet schema-valid.
		const firstName = target.querySelector<HTMLInputElement>('#firstName');
		expect(firstName).not.toBeNull();
		firstName!.value = 'Jane';
		firstName!.dispatchEvent(new Event('input', { bubbles: true }));
		await tick();

		// The partial value must survive in storage...
		const stored = JSON.parse(h.storage.get(CHECKOUT_TEST_KEY)!);
		expect(stored.firstName).toBe('Jane');

		// ...and be restored when the page is refreshed.
		const reloaded = new FakeCheckoutService(h.storage, CHECKOUT_TEST_KEY);
		expect(reloaded.formData.get().firstName).toBe('Jane');

		unmount(component);
	});
});