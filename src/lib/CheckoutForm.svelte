<script lang="ts">
	import Button from './Button.svelte';
	import ShippingForm from './ShippingForm.svelte';
	import MapDisplay from './MapDisplay.svelte';
	import ErrorMessage from './ErrorMessage.svelte';
	import { checkoutService, checkoutErrors, checkoutSubmitting } from './view';

	let formData = $state(checkoutService.formData.get());

	$effect(() => {
		checkoutService.formData.set(formData);
	});

	async function handleSubmit() {
		await checkoutService.submit();
	}
</script>

<form class="bg-white rounded-lg shadow p-4 md:p-8" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
	<ShippingForm bind:formData errors={$checkoutErrors} submitted={false} />

	<MapDisplay
		address={formData.address}
		amenity={formData.amenity}
		city={formData.city}
		county={formData.county}
		stateName={formData.stateName}
		zipCode={formData.zipCode}
		country={formData.country}
		bind:coordinates={formData.coordinates}
		onUpdateLocation={() => checkoutService.validate()}
	/>
	<ErrorMessage messages={$checkoutErrors.coordinates?.errors}/>

	<div class="flex gap-4 mt-8">
		<Button type="submit" class="flex-1 py-3" disabled={$checkoutSubmitting}>
			{$checkoutSubmitting ? 'Processing...' : 'Continue to Payment'}
		</Button>
	</div>
</form>

<style>
	form {
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
</style>