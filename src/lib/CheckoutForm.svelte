<script lang="ts">
	import { z } from 'zod';
	import { goto } from '$app/navigation';
	import { logger } from './logger.svelte';
	import Button from './Button.svelte';
	import ShippingForm from './ShippingForm.svelte';
	import MapDisplay from './MapDisplay.svelte';
	import { shippingFormSchema, type ShippingFormData, type FieldErrors } from '$lib/schemas';
	import { saveCheckoutForm, loadCheckoutForm } from './checkoutFormStore';
	import ErrorMessage from './ErrorMessage.svelte';

	let formData: ShippingFormData = $state(loadCheckoutForm() ?? {
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
			longitude: undefined,
		}, // is required but set as undefined first time
	});

	let errors: FieldErrors = $state({});
	let submitted = $state(false);
	let submitting = $state(false);

	$effect(() => {
		saveCheckoutForm(formData);
	});

	function validateForm() {
		let newErrors: FieldErrors = {}
		if (!formData.coordinates || !formData.coordinates.latitude || !formData.coordinates.longitude) {
			newErrors.coordinates = {errors: ['latitude and longitude are required']}
		}
		const result = shippingFormSchema.safeParse(formData);
		if (!result.success) {
			let zodErrors = z.treeifyError(result.error).properties
			newErrors = {...newErrors, ...zodErrors}
		}
		if (Object.keys(newErrors).length > 0) {
			console.log("not valid", JSON.stringify(errors))
			errors = newErrors
			return false
		} else {
			errors = {}
			return true;
		}
	}

	async function handleSubmit() {
		submitted = true;
		if (!validateForm()) {
			return;
		}

		submitting = true;
		try {
			logger.log('Order submitted:', formData);
			// Simulate submission delay
			await new Promise(resolve => setTimeout(resolve, 1000));
			goto('#/');
		} finally {
			submitting = false;
		}
	}
</script>

<form class="bg-white rounded-lg shadow p-4 md:p-8" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
	<ShippingForm bind:formData bind:errors bind:submitted />

	<MapDisplay
		address={formData.address}
		amenity={formData.amenity}
		city={formData.city}
		county={formData.county}
		stateName={formData.stateName}
		zipCode={formData.zipCode}
		country={formData.country}
		bind:coordinates={formData.coordinates}
		onUpdateLocation={() => validateForm()}
	/>
	<ErrorMessage messages={errors.coordinates?.errors}/>

	<div class="flex gap-4 mt-8">
		<Button type="submit" class="flex-1 py-3" disabled={submitting}>
			{submitting ? 'Processing...' : 'Complete Order'}
		</Button>
	</div>
</form>

<style>
	form {
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
</style>
