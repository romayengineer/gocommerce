import { describe, it, expect } from 'vitest';
import { configSchema } from '@gocommerce/config/config';

const valid = {
	imagesBaseUrl: 'https://example.com/images',
	mapProvider: 'leaflet',
	googleMapsApiKey: '',
	currency: 'ARS',
	bank: { alias: '', number: '', name: '', bankName: '' },
	view: { pageWidth: '80rem', theme: 'default' }
};

describe('configSchema', () => {
	it('accepts a fully valid config', () => {
		expect(configSchema.parse(valid)).toEqual(valid);
	});

	it('coerces an unknown map provider to leaflet', () => {
		expect(configSchema.parse({ ...valid, mapProvider: 'bogus' }).mapProvider).toBe('leaflet');
	});

	it('falls back to ARS on empty currency', () => {
		expect(configSchema.parse({ ...valid, currency: '' }).currency).toBe('ARS');
	});

	it('falls back to default view tokens on empty strings', () => {
		const parsed = configSchema.parse({ ...valid, view: { pageWidth: '', theme: '' } });
		expect(parsed.view).toEqual({ pageWidth: '80rem', theme: 'default' });
	});
});
