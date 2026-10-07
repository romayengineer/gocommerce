const CURRENCY_SYMBOLS: Record<string, string> = {
	ARS: '$',
	USD: '$',
	EUR: '€',
	BRL: 'R$',
	GBP: '£'
};

const LOCALES: Record<string, string> = {
	es: 'es-AR',
	en: 'en-US'
};

/**
 * Format a price for display. Uses `Intl.NumberFormat` for grouping so the
 * view layer never hand-rolls separators. `es` hides decimals (cents are not
 * commonly used for the default store currency); other locales show two.
 */
export function formatPrice(
	value: number,
	lang: string | null | undefined,
	currency: string = 'ARS'
): string {
	const locale = (lang && LOCALES[lang]) || 'en-US';
	const fractionDigits = lang === 'es' ? 0 : 2;
	const number = new Intl.NumberFormat(locale, {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits
	}).format(value);
	return `${CURRENCY_SYMBOLS[currency] ?? currency}${number}`;
}
