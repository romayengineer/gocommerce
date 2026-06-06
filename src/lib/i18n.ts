import { init, register, locale } from 'svelte-i18n';

export const defaultLocale = 'es';

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

// Always set the locale immediately
const stored = getStoredLocale();
locale.set(stored || defaultLocale);

export const locales = ['en', 'es'];
export const localeNames: Record<string, string> = {
	en: 'English',
	es: 'Español'
};
export const localeFlags: Record<string, string> = {
	en: '🇬🇧',
	es: '🇦🇷'
};
