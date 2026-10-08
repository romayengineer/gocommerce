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
 * Format a price for display. Presentation helper owned by ui-core so
 * Svelte components never import value helpers from domain.
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
