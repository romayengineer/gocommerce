import type { AppConfig } from '@gocommerce/config';

/** Read the application configuration from the build-time environment. */
export function readEnvConfig(): AppConfig {
	return {
		imagesBaseUrl: import.meta.env.VITE_S3_IMAGES_URL ?? '',
		mapProvider:
			(import.meta.env.VITE_MAP_PROVIDER ?? 'leaflet') === 'google' ? 'google' : 'leaflet',
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
	};
}