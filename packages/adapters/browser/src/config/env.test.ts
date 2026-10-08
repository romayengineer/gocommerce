import { describe, it, expect, vi } from 'vitest';
import { readEnvConfig } from '@gocommerce/adapters/config/env';

describe('readEnvConfig', () => {
	it('defaults an empty env to leaflet + safe fallbacks', () => {
		const config = readEnvConfig({}, false);
		expect(config.mapProvider).toBe('leaflet');
		expect(config.googleMapsApiKey).toBe('');
		expect(config.currency).toBe('ARS');
		expect(config.view).toEqual({ pageWidth: '80rem', theme: 'default' });
	});

	it('warns and falls back on an unknown provider instead of throwing', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		try {
			const config = readEnvConfig({ VITE_MAP_PROVIDER: 'bogus' }, true);
			expect(config.mapProvider).toBe('leaflet');
			expect(warn).toHaveBeenCalledWith(
				expect.stringContaining('Unknown VITE_MAP_PROVIDER "bogus"')
			);
		} finally {
			warn.mockRestore();
		}
	});

	it('reads provider, currency and bank details from env', () => {
		const config = readEnvConfig(
			{
				VITE_MAP_PROVIDER: 'google',
				VITE_GOOGLE_MAPS_API_KEY: 'key-123',
				VITE_CURRENCY: 'USD',
				VITE_S3_IMAGES_URL: 'https://cdn.test/images',
				VITE_BANK_ACCOUNT_ALIAS: 'alias',
				VITE_BANK_ACCOUNT_NUMBER: '123',
				VITE_BANK_ACCOUNT_NAME: 'Name',
				VITE_BANK_NAME: 'Bank'
			},
			false
		);
		expect(config.mapProvider).toBe('google');
		expect(config.googleMapsApiKey).toBe('key-123');
		expect(config.currency).toBe('USD');
		expect(config.imagesBaseUrl).toBe('https://cdn.test/images');
		expect(config.bank).toEqual({ alias: 'alias', number: '123', name: 'Name', bankName: 'Bank' });
	});
});
