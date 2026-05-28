import { init, register } from 'svelte-i18n';

const defaultLocale = 'en';

register('en', () => import('./translations/en.json'));
register('es', () => import('./translations/es.json'));

export function initializeI18n() {
	init({
		fallbackLocale: defaultLocale,
		initialLocale: typeof window !== 'undefined' ? getStoredLocale() || defaultLocale : defaultLocale
	});
}

export function getStoredLocale(): string | null {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('locale');
	}
	return null;
}

export function setLocale(locale: string): void {
	if (typeof window !== 'undefined') {
		localStorage.setItem('locale', locale);
	}
}

export const locales = ['en', 'es'];
export const localeNames: Record<string, string> = {
	en: 'English',
	es: 'Español'
};
