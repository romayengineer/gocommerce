import { configSchema, type AppConfig } from '@gocommerce/config/config';

const KNOWN_MAP_PROVIDERS = ['google', 'leaflet'];

/** Read the application configuration from the build-time environment. */
export function readEnvConfig(): AppConfig {
	const rawProvider = import.meta.env.VITE_MAP_PROVIDER;
	if (
		typeof rawProvider === 'string' &&
		rawProvider !== '' &&
		!KNOWN_MAP_PROVIDERS.includes(rawProvider)
	) {
		const message = `Unknown VITE_MAP_PROVIDER "${rawProvider}" (expected "google" or "leaflet")`;
		// Fail fast in dev so typos never ship silently; fall back in prod.
		if (import.meta.env.DEV) throw new Error(message);
		console.warn(`${message}; falling back to "leaflet"`);
	}

	const config = configSchema.parse({
		imagesBaseUrl: import.meta.env.VITE_S3_IMAGES_URL ?? '',
		mapProvider: import.meta.env.VITE_MAP_PROVIDER ?? 'leaflet',
		googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
		currency: import.meta.env.VITE_CURRENCY ?? 'ARS',
		bank: {
			alias: import.meta.env.VITE_BANK_ACCOUNT_ALIAS ?? '',
			number: import.meta.env.VITE_BANK_ACCOUNT_NUMBER ?? '',
			name: import.meta.env.VITE_BANK_ACCOUNT_NAME ?? '',
			bankName: import.meta.env.VITE_BANK_NAME ?? ''
		},
		view: {
			pageWidth: import.meta.env.VITE_PAGE_WIDTH ?? '80rem',
			theme: import.meta.env.VITE_THEME ?? 'default'
		}
	});

	if (import.meta.env.DEV) {
		if (!config.imagesBaseUrl) console.warn('VITE_S3_IMAGES_URL is empty; product images will not resolve.');
		for (const [key, value] of Object.entries(config.bank)) {
			if (!value) console.warn(`VITE_BANK_* is empty (${key}); the payment view will render blank details.`);
		}
	}

	return config;
}