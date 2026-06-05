<script lang="ts">
	import { goto } from '$app/navigation';
	import { logger } from './logger.svelte';
	import Button from './Button.svelte';
	import ShippingForm from './ShippingForm.svelte';
	import MapDisplay from './MapDisplay.svelte';
	import { shippingFormSchema, type ShippingFormData } from '$lib/schemas';

	let formData: ShippingFormData = $state({
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
		country: 'Argentina'
	});

	let errors: Record<string, string[] | undefined> = $state({});
	let submitted = $state(false);
	let submitting = $state(false);

	function validateForm() {
		const result = shippingFormSchema.safeParse(formData);
		if (!result.success) {
			errors = result.error.flatten().fieldErrors;
			return false;
		}
		errors = {};
		return true;
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

	function goBack() {
		goto('#/cart');
	}
</script>

<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="bg-white rounded-lg shadow p-8">
	<ShippingForm bind:formData bind:errors bind:submitted />

	<MapDisplay
		address={formData.address}
		amenity={formData.amenity}
		city={formData.city}
		county={formData.county}
		stateName={formData.stateName}
		zipCode={formData.zipCode}
		country={formData.country}
	/>

	<div class="flex gap-4 mt-8">
		<Button type="submit" class="flex-1 py-3" disabled={submitting}>
			{submitting ? 'Processing...' : 'Complete Order'}
		</Button>
		<Button variant="secondary" class="flex-1 py-3" onclick={goBack}>
			Back to Cart
		</Button>
	</div>
</form>

<style>
	form {
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
</style>
