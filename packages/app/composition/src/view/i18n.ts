// Re-export i18n locale helpers (owned by adapters/svelte/i18n) via view.
// Kept behind the view boundary so ui/routes never import adapters directly.
export {
	locales,
	localeNames,
	localeFlags,
	setLocale,
	defaultLocale
} from '@gocommerce/adapters/svelte/i18n';
