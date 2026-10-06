import { z } from 'zod';
import { createValidator } from './validation';

export const coordinatesSchema = z.object({
	latitude: z.float64().optional(),
	longitude: z.float64().optional()
});

export type ShippingCoordinates = z.infer<typeof coordinatesSchema>;

export const shippingFormSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.string().email('Valid email is required'),
	phone: z.string().min(1, 'Phone is required'),
	address: z.string().min(1, 'Address is required'),
	amenity: z.string().optional(),
	city: z.string().optional(),
	county: z.string().optional(),
	stateName: z.string().min(1, 'State/Province is required'),
	zipCode: z.string().optional(),
	country: z.string().min(1, 'Country is required'),
	coordinates: coordinatesSchema
});

export type ShippingFormData = z.infer<typeof shippingFormSchema>;

export const isValidFormData = createValidator(shippingFormSchema);

export interface Errors {
	errors?: string[];
}

export type FieldErrors = Record<string, Errors>;

export function createEmptyShippingFormData(): ShippingFormData {
	return {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		address: '',
		amenity: '',
		city: '',
		county: '',
		stateName: '',
		zipCode: '',
		country: 'Argentina',
		coordinates: {
			latitude: undefined,
			longitude: undefined
		}
	};
}

const STRING_FIELDS = [
	'firstName',
	'lastName',
	'email',
	'phone',
	'address',
	'amenity',
	'city',
	'county',
	'stateName',
	'zipCode',
	'country'
] as const;

export function restoreShippingFormData(value: unknown): ShippingFormData {
	const base = createEmptyShippingFormData();
	if (value === null || typeof value !== 'object' || Array.isArray(value)) return base;

	const source = value as Record<string, unknown>;
	const restored = { ...base } as Record<string, unknown>;
	for (const key of STRING_FIELDS) {
		if (typeof source[key] === 'string') restored[key] = source[key];
	}
	const coordinates = source.coordinates;
	if (coordinates && typeof coordinates === 'object' && !Array.isArray(coordinates)) {
		const target = restored.coordinates as ShippingCoordinates;
		const coords = coordinates as ShippingCoordinates;
		if (typeof coords.latitude === 'number') target.latitude = coords.latitude;
		if (typeof coords.longitude === 'number') target.longitude = coords.longitude;
	}
	return restored as ShippingFormData;
}

/** Validate shipping form data and produce per-field error messages. */
export function validateShippingForm(formData: ShippingFormData): FieldErrors {
	const newErrors: FieldErrors = {};
	if (
		!formData.coordinates ||
		!formData.coordinates.latitude ||
		!formData.coordinates.longitude
	) {
		newErrors.coordinates = { errors: ['latitude and longitude are required'] };
	}
	const result = shippingFormSchema.safeParse(formData);
	if (!result.success) {
		const zodErrors = z.treeifyError(result.error).properties as FieldErrors;
		return { ...newErrors, ...zodErrors };
	}
	return newErrors;
}
