import { describe, it, expect } from 'vitest';
import { configSchema, defaultThemeTokens } from '@gocommerce/config/config';

const valid = {
	imagesBaseUrl: 'https://example.com/images',
	mapProvider: 'leaflet',
	googleMapsApiKey: '',
	currency: 'ARS',
	bank: { alias: '', number: '', name: '', bankName: '' },
	view: { pageWidth: '80rem', theme: 'default', tokens: { ...defaultThemeTokens } },
	shop: { name: 'GoCommerce', logoUrl: '', supportEmail: '', whatsappNumber: '', whatsappMessage: '' },
	seo: { title: 'GoCommerce', description: 'An ecommerce store', themeColor: '#2563eb' },
	hero: { enabled: true, ctaHref: '#/products', gradientFrom: 'primary-600', gradientTo: 'primary-800' },
	home: { featuredCount: 10 },
	layout: { showHeader: true, showFooter: true, stickyNav: true },
	footer: { showShop: true, showCompany: true, showLegal: true, copyrightYear: '2024', showBuiltBy: true },
	cart: { taxRate: 10 },
	pwa: { name: 'GoCommerce', shortName: 'GoCommerce' }
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
		const parsed = configSchema.parse({ ...valid, view: { pageWidth: '', theme: '', tokens: { ...defaultThemeTokens, headerBg: '' } } });
		expect(parsed.view.pageWidth).toBe('80rem');
		expect(parsed.view.theme).toBe('default');
		expect(parsed.view.tokens).toEqual(defaultThemeTokens);
	});

	it('fills missing style tokens with defaults (backwards compat)', () => {
		const parsed = configSchema.parse({
			...valid,
			view: { pageWidth: '80rem', theme: 'default' }
		});
		expect(parsed.view.tokens).toEqual(defaultThemeTokens);
	});

	it('accepts style token overrides', () => {
		const parsed = configSchema.parse({
			...valid,
			view: {
				pageWidth: '80rem',
				theme: 'brand',
				tokens: { ...defaultThemeTokens, headerBg: '10 20 30', danger600: '200 0 0' }
			}
		});
		expect(parsed.view.tokens.headerBg).toBe('10 20 30');
		expect(parsed.view.tokens.danger600).toBe('200 0 0');
		expect(parsed.view.tokens.cardBg).toBe(defaultThemeTokens.cardBg);
	});

	it('fills new view sections with defaults when omitted (backwards compat)', () => {
		const minimal = {
			imagesBaseUrl: 'https://example.com/images',
			mapProvider: 'leaflet',
			googleMapsApiKey: '',
			currency: 'ARS',
			bank: { alias: '', number: '', name: '', bankName: '' },
			view: { pageWidth: '80rem', theme: 'default' }
		};
		const parsed = configSchema.parse(minimal);
		expect(parsed.shop).toEqual({ name: 'GoCommerce', logoUrl: '', supportEmail: '', whatsappNumber: '', whatsappMessage: '' });
		expect(parsed.seo).toEqual({
			title: 'GoCommerce',
			description: 'An ecommerce store',
			themeColor: '#2563eb'
		});
		expect(parsed.hero).toEqual({
			enabled: true,
			ctaHref: '#/products',
			gradientFrom: 'primary-600',
			gradientTo: 'primary-800'
		});
		expect(parsed.home).toEqual({ featuredCount: 10 });
		expect(parsed.layout).toEqual({ showHeader: true, showFooter: true, stickyNav: true });
		expect(parsed.footer).toEqual({
			showShop: true,
			showCompany: true,
			showLegal: true,
			copyrightYear: '2024',
			showBuiltBy: true
		});
		expect(parsed.cart).toEqual({ taxRate: 10 });
		expect(parsed.pwa).toEqual({ name: 'GoCommerce', shortName: 'GoCommerce' });
	});

	it('coerces empty/invalid shop-facing values to safe defaults', () => {
		const parsed = configSchema.parse({
			...valid,
			shop: { name: '', logoUrl: 'https://cdn.test/logo.svg', supportEmail: 'a@b.c' },
			seo: { title: '', description: 'Custom', themeColor: '' },
			home: { featuredCount: -3 },
			cart: { taxRate: -1 },
			footer: {
				showShop: true,
				showCompany: true,
				showLegal: true,
				copyrightYear: '',
				showBuiltBy: true
			}
		});
		expect(parsed.shop.name).toBe('GoCommerce');
		expect(parsed.shop.logoUrl).toBe('https://cdn.test/logo.svg');
		expect(parsed.seo.title).toBe('GoCommerce');
		expect(parsed.seo.themeColor).toBe('#2563eb');
		expect(parsed.home.featuredCount).toBe(10);
		expect(parsed.cart.taxRate).toBe(10);
		expect(parsed.footer.copyrightYear).toBe('2024');
	});
});
