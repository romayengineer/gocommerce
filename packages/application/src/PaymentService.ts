import type { ReadableStore } from '@gocommerce/ports/Store';
import type { CartService } from './CartService';

/** Bank details required to render payment instructions. Owned by application;
 *  composition maps AppConfig.bank to this shape (structurally compatible). */
export interface PaymentBankDetails {
	alias: string;
	number: string;
	name: string;
	bankName: string;
}

/** Narrow options for PaymentService — replaces the former AppConfig dependency. */
export interface PaymentOptions {
	bank: PaymentBankDetails;
}

export class PaymentService {
	readonly bank: PaymentBankDetails;
	readonly total: ReadableStore<number>;

	constructor(options: PaymentOptions, cart: CartService) {
		this.bank = options.bank;
		this.total = cart.total;
	}
}