import { formatPrice } from './format';

/**
 * Minimal structural shape of a resolved cart line. Kept local so ui-core
 * stays dependency-free (boundary rule 4c); `CartItemFull` satisfies it
 * structurally, so call sites pass the store value directly.
 */
export interface WhatsAppCartItem {
	product: {
		productName: string;
		brand: string;
		size: string;
		price: number;
	};
	quantity: number;
}

export interface WhatsAppCartOptions {
	/** Currency code forwarded to `formatPrice` (defaults to ARS). */
	currency?: string;
	/** Locale forwarded to `formatPrice` (drives separators + decimals). */
	locale?: string | null;
	/** Optional leading line, e.g. "New order — Acme". */
	header?: string;
}

/**
 * Build the plain-text order message sent to WhatsApp from the cart. One
 * line per item (brand, name, size, quantity, line cost) followed by the
 * cart total. Pure so it is trivially testable and locale-aware.
 */
export function buildWhatsAppCartMessage(
	items: WhatsAppCartItem[],
	total: number,
	options: WhatsAppCartOptions = {}
): string {
	const { currency, locale, header } = options;
	const lines: string[] = [];

	if (header) lines.push(header, '');

	for (const item of items) {
		const lineTotal = item.product.price * item.quantity;
		lines.push(
			`• ${item.product.brand} ${item.product.productName} (${item.product.size}) x${item.quantity} — ${formatPrice(lineTotal, locale, currency)}`
		);
	}

	lines.push('', `Total: ${formatPrice(total, locale, currency)}`);
	return lines.join('\n');
}

/**
 * Build a `wa.me` deep link. The number is stripped to digits (wa.me
 * requires the international form without punctuation) and the message is
 * URL-encoded so newlines and accents survive the round trip.
 */
export function buildWhatsAppUrl(number: string, message: string): string {
	const digits = number.replace(/\D/g, '');
	const base = `https://wa.me/${digits}`;
	return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
