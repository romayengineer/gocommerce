import { describe, it, expect } from 'vitest';
import {
	validateShippingForm,
	createEmptyShippingFormData,
	type ShippingFormData
} from '@gocommerce/domain/shipping';

function validForm(): ShippingFormData {
	return {
		...createEmptyShippingFormData(),
		firstName: 'Ana',
		lastName: 'Gomez',
		email: 'ana@example.com',
		phone: '123',
		address: 'Calle 1',
		stateName: 'Cordoba',
		country: 'Argentina',
		coordinates: { latitude: -31.4, longitude: -64.2 }
	};
}

describe('validateShippingForm', () => {
	it('returns no errors for a valid form', () => {
		expect(validateShippingForm(validForm())).toEqual({});
	});

	it('requires latitude and longitude (regression: zod value import must work)', () => {
		const errors = validateShippingForm({
			...validForm(),
			coordinates: { latitude: undefined, longitude: undefined }
		});
		expect(errors.coordinates?.errors).toEqual(['latitude and longitude are required']);
	});

	it('merges coordinate errors with zod field errors', () => {
		const errors = validateShippingForm({
			...validForm(),
			firstName: '',
			coordinates: { latitude: undefined, longitude: undefined }
		});
		expect(errors.coordinates?.errors).toBeDefined();
		expect(errors.firstName?.errors?.length).toBeGreaterThan(0);
	});

	it('accepts zero coordinates (equator/prime meridian are valid)', () => {
		const errors = validateShippingForm({
			...validForm(),
			coordinates: { latitude: 0, longitude: 0 }
		});
		expect(errors).toEqual({});
	});
});
