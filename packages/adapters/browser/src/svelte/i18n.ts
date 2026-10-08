import { addMessages, init, locale } from 'svelte-i18n';
import en from './i18n/en.json';
import es from './i18n/es.json';

export const defaultLocale = 'es';

// Register dictionaries synchronously. Using `register(...)` (lazy loaders)
// would make `locale.set()` async, leaving `$locale` null until the loader
// resolves and making any `$t` render throw before then.
addMessages('en', en);
addMessages('es', es);

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