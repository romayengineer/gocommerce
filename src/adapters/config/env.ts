import type { AppConfig } from '$core/config';

/** Read the application configuration from the build-time environment. */
export function readEnvConfig(): AppConfig {
	return {
		imagesBaseUrl: import.meta.env.VITE_S3_IMAGES_URL ?? '',
		mapProvider:
			(import.meta.env.VITE_MAP_PROVIDER ?? 'leaflet') === 'google' ? 'google' : 'leaflet',
		googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
		bank: {
			alias: import.meta.env.VITE_BANK_ACCOUNT_ALIAS ?? '',
			number: import.meta.env.VITE_BANK_ACCOUNT_NUMBER ?? '',
			name: import.meta.env.VITE_BANK_ACCOUNT_NAME ?? '',
			bankName: import.meta.env.VITE_BANK_NAME ?? ''
		}
	};
}