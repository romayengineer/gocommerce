<script lang="ts">
	import { t } from 'svelte-i18n';
	import Button from '$lib/ui/Button.svelte';
	import ShippingForm from '$lib/checkout/ShippingForm.svelte';
	import MapDisplay from '$lib/checkout/MapDisplay.svelte';
	import ErrorMessage from '$lib/ui/ErrorMessage.svelte';
	import { checkoutService, checkoutErrors, checkoutSubmitting } from '$lib/view';

	let formData = $state(checkoutService.formData.get());

	$effect(() => {
		checkoutService.formData.set({
			...formData,
			coordinates: { ...formData.coordinates }
		});
	});

	async function handleSubmit() {
		await checkoutService.submit();
	}
</script>

<form class="card p-4 md:p-8" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
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

	<div class="mt-8 flex gap-4">
		<Button type="submit" class="flex-1 py-3" disabled={$checkoutSubmitting}>
			{$checkoutSubmitting ? $t('checkout.processing') : $t('checkout.continueToPayment')}
		</Button>
	</div>
</form>
