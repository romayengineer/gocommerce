import { init, register, locale } from 'svelte-i18n';

const defaultLocale = 'es';

register('en', () => import('./translations/en.json'));
register('es', () => import('./translations/es.json'));

export function getStoredLocale(): string | null {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('locale');
	}
	return null;
}

export function setLocale(newLocale: string): void {
	locale.set(newLocale);
	if (typeof window !== 'undefined') {
		localStorage.setItem('locale', newLocale);
	}
}

// Initialize i18n immediately
init({
	fallbackLocale: defaultLocale,
	initialLocale: defaultLocale
});

// Set stored locale if available (client-side only)
if (typeof window !== 'undefined') {
	const stored = getStoredLocale();
	if (stored) {
		locale.set(stored);
	}
}

export const locales = ['en', 'es'];
export const localeNames: Record<string, string> = {
	en: 'English',
	es: 'Español'
};
export const localeFlags: Record<string, string> = {
	en: '🇬🇧',
	es: '🇦🇷'
};
