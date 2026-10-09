import { z } from 'zod';

/**
 * Validation schemas for the runtime configuration. `readEnvConfig` parses
 * raw env strings through `configSchema`, so unknown or empty values fall
 * back to safe defaults instead of propagating into services. Theme and
 * pageWidth stay open strings by design (any `[data-theme]` token / CSS
 * length), but must be non-empty; currency falls back to ARS.
 */
export const mapProviderSchema = z.enum(['google', 'leaflet']);
export type MapProvider = z.infer<typeof mapProviderSchema>;

export const bankDetailsSchema = z.object({
	alias: z.string(),
	number: z.string(),
	name: z.string(),
	bankName: z.string()
});
export type BankDetails = z.infer<typeof bankDetailsSchema>;

/**
 * Style tokens — single source of truth for every configurable CSS value.
 * Colors are RGB triplets (`"17 24 39"`) so Tailwind opacity modifiers
 * (`bg-header/90`) keep working via `rgb(var(--x) / <alpha-value>)`.
 * Every field has a `.catch()` fallback matching the pre-theming hardcoded
 * value, so a missing/empty token renders pixel-identical to the default.
 */
export const themeTokensSchema = z.object({
	fontSans: z
		.string()
		.min(1)
		.catch(
			`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
		),
	headerBg: z.string().min(1).catch('255 255 255'),
	footerBg: z.string().min(1).catch('17 24 39'),
	footerFg: z.string().min(1).catch('156 163 175'),
	footerBorder: z.string().min(1).catch('55 65 81'),
	cardBg: z.string().min(1).catch('255 255 255'),
	mutedBg: z.string().min(1).catch('243 244 246'),
	mutedHoverBg: z.string().min(1).catch('229 231 235'),
	borderColor: z.string().min(1).catch('209 213 219'),
	text: z.string().min(1).catch('17 24 39'),
	textSecondary: z.string().min(1).catch('55 65 81'),
	textMuted: z.string().min(1).catch('75 85 99'),
	textFaint: z.string().min(1).catch('107 114 128'),
	placeholder: z.string().min(1).catch('156 163 175'),
	chipText: z.string().min(1).catch('31 41 55'),
	dangerSoft: z.string().min(1).catch('254 242 242'),
	dangerBorder: z.string().min(1).catch('248 113 113'),
	danger500: z.string().min(1).catch('239 68 68'),
	danger600: z.string().min(1).catch('220 38 38'),
	danger700: z.string().min(1).catch('185 28 28'),
	success600: z.string().min(1).catch('22 163 74'),
	onColor: z.string().min(1).catch('255 255 255')
});
export type ThemeTokens = z.infer<typeof themeTokensSchema>;
export const defaultThemeTokens: ThemeTokens = {
	fontSans: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
	headerBg: '255 255 255',
	footerBg: '17 24 39',
	footerFg: '156 163 175',
	footerBorder: '55 65 81',
	cardBg: '255 255 255',
	mutedBg: '243 244 246',
	mutedHoverBg: '229 231 235',
	borderColor: '209 213 219',
	text: '17 24 39',
	textSecondary: '55 65 81',
	textMuted: '75 85 99',
	textFaint: '107 114 128',
	placeholder: '156 163 175',
	chipText: '31 41 55',
	dangerSoft: '254 242 242',
	dangerBorder: '248 113 113',
	danger500: '239 68 68',
	danger600: '220 38 38',
	danger700: '185 28 28',
	success600: '22 163 74',
	onColor: '255 255 255'
};

export const viewConfigSchema = z.object({
	pageWidth: z.string().min(1).catch('80rem'),
	theme: z.string().min(1).catch('default'),
	tokens: themeTokensSchema.catch(defaultThemeTokens)
});
export type ViewConfig = z.infer<typeof viewConfigSchema>;

export const shopConfigSchema = z.object({
	name: z.string().min(1).catch('GoCommerce'),
	logoUrl: z.string().catch(''),
	supportEmail: z.string().catch('')
});
export type ShopConfig = z.infer<typeof shopConfigSchema>;
const defaultShop = { name: 'GoCommerce', logoUrl: '', supportEmail: '' };

export const seoConfigSchema = z.object({
	title: z.string().min(1).catch('GoCommerce'),
	description: z.string().catch('An ecommerce store'),
	themeColor: z.string().min(1).catch('#2563eb')
});
export type SeoConfig = z.infer<typeof seoConfigSchema>;
const defaultSeo = { title: 'GoCommerce', description: 'An ecommerce store', themeColor: '#2563eb' };

export const heroConfigSchema = z.object({
	enabled: z.boolean().catch(true),
	ctaHref: z.string().min(1).catch('#/products'),
	gradientFrom: z.string().min(1).catch('primary-600'),
	gradientTo: z.string().min(1).catch('primary-800')
});
export type HeroConfig = z.infer<typeof heroConfigSchema>;
const defaultHero = {
	enabled: true,
	ctaHref: '#/products',
	gradientFrom: 'primary-600',
	gradientTo: 'primary-800'
};

export const homeConfigSchema = z.object({
	featuredCount: z.number().int().positive().catch(10)
});
export type HomeConfig = z.infer<typeof homeConfigSchema>;
const defaultHome = { featuredCount: 10 };

export const layoutConfigSchema = z.object({
	showHeader: z.boolean().catch(true),
	showFooter: z.boolean().catch(true),
	stickyNav: z.boolean().catch(true)
});
export type LayoutConfig = z.infer<typeof layoutConfigSchema>;
const defaultLayout = { showHeader: true, showFooter: true, stickyNav: true };

export const footerConfigSchema = z.object({
	showShop: z.boolean().catch(true),
	showCompany: z.boolean().catch(true),
	showLegal: z.boolean().catch(true),
	copyrightYear: z.string().min(1).catch('2024'),
	showBuiltBy: z.boolean().catch(true)
});
export type FooterConfig = z.infer<typeof footerConfigSchema>;
const defaultFooter = {
	showShop: true,
	showCompany: true,
	showLegal: true,
	copyrightYear: '2024',
	showBuiltBy: true
};

export const cartConfigSchema = z.object({
	taxRate: z.number().min(0).catch(10)
});
export type CartConfig = z.infer<typeof cartConfigSchema>;
const defaultCart = { taxRate: 10 };

export const pwaConfigSchema = z.object({
	name: z.string().min(1).catch('GoCommerce'),
	shortName: z.string().min(1).catch('GoCommerce')
});
export type PwaConfig = z.infer<typeof pwaConfigSchema>;
const defaultPwa = { name: 'GoCommerce', shortName: 'GoCommerce' };

export const configSchema = z.object({
	imagesBaseUrl: z.string(),
	mapProvider: mapProviderSchema.catch('leaflet'),
	googleMapsApiKey: z.string(),
	currency: z.string().min(1).catch('ARS'),
	bank: bankDetailsSchema,
	view: viewConfigSchema,
	shop: shopConfigSchema.catch(defaultShop),
	seo: seoConfigSchema.catch(defaultSeo),
	hero: heroConfigSchema.catch(defaultHero),
	home: homeConfigSchema.catch(defaultHome),
	layout: layoutConfigSchema.catch(defaultLayout),
	footer: footerConfigSchema.catch(defaultFooter),
	cart: cartConfigSchema.catch(defaultCart),
	pwa: pwaConfigSchema.catch(defaultPwa)
});
export type AppConfig = z.infer<typeof configSchema>;
