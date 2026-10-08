import { configSchema, type AppConfig } from '@gocommerce/config/config';

const KNOWN_MAP_PROVIDERS = ['google', 'leaflet'];

/** Read the application configuration from the build-time environment. */
export function readEnvConfig(
	env: Record<string, string | undefined> = import.meta.env as Record<string, string | undefined>,
	dev: boolean = (import.meta.env as Record<string, unknown>).DEV === true
): AppConfig {
	const rawProvider = env.VITE_MAP_PROVIDER;
	if (
		typeof rawProvider === 'string' &&
		rawProvider !== '' &&
		!KNOWN_MAP_PROVIDERS.includes(rawProvider)
	) {
		// Warn and fall back (zod coerces below); never throw — a typo in
		// an env var must not crash the shop, in dev or prod.
		console.warn(
			`Unknown VITE_MAP_PROVIDER "${rawProvider}" (expected "google" or "leaflet"); falling back to "leaflet"`
		);
	}

	const config = configSchema.parse({
		imagesBaseUrl: env.VITE_S3_IMAGES_URL ?? '',
		mapProvider: env.VITE_MAP_PROVIDER ?? 'leaflet',
		googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY ?? '',
		currency: env.VITE_CURRENCY ?? 'ARS',
		bank: {
			alias: env.VITE_BANK_ACCOUNT_ALIAS ?? '',
			number: env.VITE_BANK_ACCOUNT_NUMBER ?? '',
			name: env.VITE_BANK_ACCOUNT_NAME ?? '',
			bankName: env.VITE_BANK_NAME ?? ''
		},
		view: {
			pageWidth: env.VITE_PAGE_WIDTH ?? '80rem',
			theme: env.VITE_THEME ?? 'default'
		}
	});

	if (dev) {
		if (!config.imagesBaseUrl) console.warn('VITE_S3_IMAGES_URL is empty; product images will not resolve.');
		for (const [key, value] of Object.entries(config.bank)) {
			if (!value) console.warn(`VITE_BANK_* is empty (${key}); the payment view will render blank details.`);
		}
	}

	return config;
}