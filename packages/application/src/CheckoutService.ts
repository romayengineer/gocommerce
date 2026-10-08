import type { WritableStore } from '@gocommerce/ports/Store';
import type { StoreFactory } from '@gocommerce/ports/StoreFactory';
import type { KeyValueStorage } from '@gocommerce/ports/Storage';
import type { StorageCodec } from '@gocommerce/ports/StorageCodec';
import type { Logger } from '@gocommerce/ports/Logger';
import type { RouterPort } from '@gocommerce/ports/Router';
import {
	createEmptyShippingFormData,
	restoreShippingFormData,
	validateShippingForm,
	type FieldErrors,
	type ShippingFormData
} from '@gocommerce/domain/shipping';

export const CHECKOUT_FORM_STORAGE_KEY = 'ecommerce_checkout_form';
export const DEFAULT_CHECKOUT_SUCCESS_ROUTE = '#/payment';

export interface CheckoutGateway {
	submit(data: ShippingFormData): Promise<void>;
}

export class CheckoutService {
	readonly formData: WritableStore<ShippingFormData>;
	readonly errors: WritableStore<FieldErrors>;
	readonly submitted: WritableStore<boolean>;
	readonly submitting: WritableStore<boolean>;
	private readonly unsubscribePersist: () => void;

	constructor(
		private gateway: CheckoutGateway,
		private storage: KeyValueStorage,
		private router: RouterPort,
		private logger: Logger,
		stores: StoreFactory,
		codec: StorageCodec,
		private key: string = CHECKOUT_FORM_STORAGE_KEY,
		private successRoute: string = DEFAULT_CHECKOUT_SUCCESS_ROUTE
	) {
		const stored = codec.readJSON<unknown>(storage, key);
		const formData = restoreShippingFormData(stored);

		this.formData = stores.create(formData);
		this.errors = stores.create({});
		this.submitted = stores.create(false);
		this.submitting = stores.create(false);

		this.unsubscribePersist = this.formData.subscribe((data) => codec.writeJSON(storage, key, data));
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
			this.router.navigate(this.successRoute);
		} finally {
			this.submitting.set(false);
		}
	}

	clear(): void {
		this.formData.set(createEmptyShippingFormData());
		this.storage.remove(this.key);
	}

	/** Release the persistence subscription (HMR, tests, unmount). */
	dispose(): void {
		this.unsubscribePersist();
	}
}