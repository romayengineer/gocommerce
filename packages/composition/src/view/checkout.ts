import { toSvelte } from '@gocommerce/adapters/svelte/store';
import { getContainer } from '../singleton';

export const checkoutService = getContainer().checkout;

export const checkoutForm = getContainer().checkout.formData;
export const checkoutErrors = toSvelte(getContainer().checkout.errors);
export const checkoutSubmitting = toSvelte(getContainer().checkout.submitting);
export const checkoutSubmitted = toSvelte(getContainer().checkout.submitted);
