import { configSchema, type AppConfig } from '@gocommerce/config/config';

const KNOWN_MAP_PROVIDERS = ['google', 'leaflet'];

function parseFlag(raw: string | undefined, fallback: boolean): boolean {
	if (raw === undefined || raw === '') return fallback;
	const normalized = raw.trim().toLowerCase();
	if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true;
	if ((['0', 'false', 'no', 'n', 'off'] as string[]).includes(normalized)) return false;
	return fallback;
}

function parseCount(raw: string | undefined, fallback: number): number {
	if (raw === undefined || raw === '') return fallback;
	const parsed = Number(raw);
	return Number.isFinite(parsed) ? parsed : fallback;
}

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

	const shopName = env.VITE_SHOP_NAME ?? 'ShopHub';

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
		},
		shop: {
			name: shopName,
			logoUrl: env.VITE_SHOP_LOGO_URL ?? '',
			supportEmail: env.VITE_SHOP_SUPPORT_EMAIL ?? ''
		},
		seo: {
			title: env.VITE_SEO_TITLE ?? shopName,
			description: env.VITE_SEO_DESCRIPTION ?? 'An ecommerce store',
			themeColor: env.VITE_THEME_COLOR ?? '#2563eb'
		},
		hero: {
			enabled: parseFlag(env.VITE_HERO_ENABLED, true),
			ctaHref: env.VITE_HERO_CTA_HREF ?? '#/products',
			gradientFrom: env.VITE_HERO_GRADIENT_FROM ?? 'primary-600',
			gradientTo: env.VITE_HERO_GRADIENT_TO ?? 'primary-800'
		},
		home: {
			featuredCount: parseCount(env.VITE_FEATURED_COUNT, 10)
		},
		layout: {
			showHeader: parseFlag(env.VITE_SHOW_HEADER, true),
			showFooter: parseFlag(env.VITE_SHOW_FOOTER, true),
			stickyNav: parseFlag(env.VITE_STICKY_NAV, true)
		},
		footer: {
			showShop: parseFlag(env.VITE_FOOTER_SHOW_SHOP, true),
			showCompany: parseFlag(env.VITE_FOOTER_SHOW_COMPANY, true),
			showLegal: parseFlag(env.VITE_FOOTER_SHOW_LEGAL, true),
			copyrightYear: env.VITE_COPYRIGHT_YEAR ?? '2024',
			showBuiltBy: parseFlag(env.VITE_SHOW_BUILT_BY, true)
		},
		cart: {
			taxRate: parseCount(env.VITE_TAX_RATE, 10)
		},
		pwa: {
			name: env.VITE_PWA_NAME ?? shopName,
			shortName: env.VITE_PWA_SHORT_NAME ?? shopName
		}
	});

	if (dev) {
		if (!config.imagesBaseUrl) console.warn('VITE_S3_IMAGES_URL is empty; product images will not resolve.');
		if (env.VITE_SHOP_NAME === '') console.warn('VITE_SHOP_NAME is empty; falling back to "ShopHub".');
		for (const [key, value] of Object.entries(config.bank)) {
			if (!value) console.warn(`VITE_BANK_* is empty (${key}); the payment view will render blank details.`);
		}
	}

	return config;
}