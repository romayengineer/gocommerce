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

export const viewConfigSchema = z.object({
	pageWidth: z.string().min(1).catch('80rem'),
	theme: z.string().min(1).catch('default')
});
export type ViewConfig = z.infer<typeof viewConfigSchema>;

export const configSchema = z.object({
	imagesBaseUrl: z.string(),
	mapProvider: mapProviderSchema.catch('leaflet'),
	googleMapsApiKey: z.string(),
	currency: z.string().min(1).catch('ARS'),
	bank: bankDetailsSchema,
	view: viewConfigSchema
});
export type AppConfig = z.infer<typeof configSchema>;
