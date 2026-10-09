import { describe, it, expect, vi } from 'vitest';
import { readEnvConfig } from '@gocommerce/adapters/config/env';
import { defaultThemeTokens } from '@gocommerce/config/config';

describe('readEnvConfig', () => {
	it('defaults an empty env to leaflet + safe fallbacks', () => {
		const config = readEnvConfig({}, false);
		expect(config.mapProvider).toBe('leaflet');
		expect(config.googleMapsApiKey).toBe('');
		expect(config.currency).toBe('ARS');
		expect(config.view).toEqual({ pageWidth: '80rem', theme: 'default', tokens: defaultThemeTokens });
		expect(config.shop.name).toBe('GoCommerce');
		expect(config.seo.title).toBe('GoCommerce');
		expect(config.hero.enabled).toBe(true);
		expect(config.home.featuredCount).toBe(10);
		expect(config.layout).toEqual({ showHeader: true, showFooter: true, stickyNav: true });
		expect(config.cart.taxRate).toBe(10);
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

	it('reads shop-facing view config from env, defaulting seo/pwa titles to shop name', () => {
		const config = readEnvConfig(
			{
				VITE_SHOP_NAME: 'Acme',
				VITE_SHOP_LOGO_URL: 'https://cdn.test/logo.svg',
				VITE_HERO_ENABLED: 'false',
				VITE_HERO_CTA_HREF: '#/sale',
				VITE_FEATURED_COUNT: '6',
				VITE_TAX_RATE: '21',
				VITE_SHOW_FOOTER: 'false',
				VITE_FOOTER_SHOW_LEGAL: '0',
				VITE_COPYRIGHT_YEAR: '2026'
			},
			false
		);
		expect(config.shop).toEqual({ name: 'Acme', logoUrl: 'https://cdn.test/logo.svg', supportEmail: '' });
		expect(config.seo.title).toBe('Acme');
		expect(config.pwa).toEqual({ name: 'Acme', shortName: 'Acme' });
		expect(config.hero.enabled).toBe(false);
		expect(config.hero.ctaHref).toBe('#/sale');
		expect(config.home.featuredCount).toBe(6);
		expect(config.cart.taxRate).toBe(21);
		expect(config.layout.showFooter).toBe(false);
		expect(config.footer.showLegal).toBe(false);
		expect(config.footer.copyrightYear).toBe('2026');
	});

	it('falls back on invalid numbers/flags instead of throwing', () => {
		const config = readEnvConfig(
			{ VITE_FEATURED_COUNT: 'bogus', VITE_TAX_RATE: 'NaN', VITE_HERO_ENABLED: 'maybe' },
			false
		);
		expect(config.home.featuredCount).toBe(10);
		expect(config.cart.taxRate).toBe(10);
		expect(config.hero.enabled).toBe(true);
	});

	it('reads style tokens from env, falling back to defaults when empty', () => {
		const config = readEnvConfig(
			{
				VITE_HEADER_BG: '10 20 30',
				VITE_FOOTER_BG: '40 50 60',
				VITE_DANGER_600: '200 0 0',
				VITE_FONT_SANS: 'Inter, sans-serif'
			},
			false
		);
		expect(config.view.tokens.headerBg).toBe('10 20 30');
		expect(config.view.tokens.footerBg).toBe('40 50 60');
		expect(config.view.tokens.danger600).toBe('200 0 0');
		expect(config.view.tokens.fontSans).toBe('Inter, sans-serif');
		expect(config.view.tokens.cardBg).toBe(defaultThemeTokens.cardBg);
	});
});
