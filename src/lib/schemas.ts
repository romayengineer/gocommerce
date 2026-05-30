import { z } from 'zod';

export const shippingFormSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.string().email('Valid email is required'),
	phone: z.string().min(1, 'Phone is required'),
	address: z.string().min(1, 'Address is required'),
	amenity: z.string().optional(),
	city: z.string().min(1, 'City is required'),
	county: z.string().optional(),
	stateName: z.string().min(1, 'State/Province is required'),
	zipCode: z.string().min(1, 'Postal code is required'),
	country: z.string().min(1, 'Country is required')
});

export type ShippingFormData = z.infer<typeof shippingFormSchema>;
