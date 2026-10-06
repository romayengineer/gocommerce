import { createStore, type WritableStore } from '$core/ports/Store';
import { readJSON, writeJSON, type KeyValueStorage } from '$core/ports/Storage';
import type { Logger } from '$core/ports/Logger';
import type { RouterPort } from '$core/ports/Router';
import {
	createEmptyShippingFormData,
	restoreShippingFormData,
	validateShippingForm,
	type FieldErrors,
	type ShippingFormData
} from '$core/domain/shipping';

export const CHECKOUT_FORM_STORAGE_KEY = 'ecommerce_checkout_form';

export interface CheckoutGateway {
	submit(data: ShippingFormData): Promise<void>;
}

export class CheckoutService {
	readonly formData: WritableStore<ShippingFormData>;
	readonly errors: WritableStore<FieldErrors>;
	readonly submitted: WritableStore<boolean>;
	readonly submitting: WritableStore<boolean>;

	constructor(
		private gateway: CheckoutGateway,
		private storage: KeyValueStorage,
		private router: RouterPort,
		private logger: Logger,
		private key: string = CHECKOUT_FORM_STORAGE_KEY
	) {
		const stored = readJSON<unknown>(storage, key);
		const formData = restoreShippingFormData(stored);

		this.formData = createStore(formData);
		this.errors = createStore({});
		this.submitted = createStore(false);
		this.submitting = createStore(false);

		this.formData.subscribe((data) => writeJSON(storage, key, data));
	}

	validate(): boolean {
		const errors = validateShippingForm(this.formData.get());
		if (Object.keys(errors).length > 0) {
			this.errors.set(errors);
			return false;
		}
		this.errors.set({});
		return true;
	}

	async submit(): Promise<void> {
		this.submitted.set(true);
		if (!this.validate()) return;

		this.submitting.set(true);
		try {
			this.logger.log('Order submitted:', this.formData.get());
			await this.gateway.submit(this.formData.get());
			this.router.navigate('#/payment');
		} finally {
			this.submitting.set(false);
		}
	}

	clear(): void {
		this.formData.set(createEmptyShippingFormData());
		this.storage.remove(this.key);
	}
}