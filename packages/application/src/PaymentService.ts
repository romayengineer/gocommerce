import type { AppConfig, BankDetails } from '@gocommerce/config';
import type { ReadableStore } from '@gocommerce/ports/Store';
import type { CartService } from './CartService';

export class PaymentService {
	readonly bank: BankDetails;
	readonly total: ReadableStore<number>;

	constructor(config: AppConfig, cart: CartService) {
		this.bank = config.bank;
		this.total = cart.total;
	}
}