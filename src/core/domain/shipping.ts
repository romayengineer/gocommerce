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
