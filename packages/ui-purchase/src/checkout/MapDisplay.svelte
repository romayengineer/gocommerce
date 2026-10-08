<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import ApiKeyMissing from './ApiKeyMissing.svelte';
	import type { MapConfig } from '@gocommerce/ports/MapService';
	import type { ShippingCoordinates } from '@gocommerce/domain/shipping';
	import { mapService, mapState } from '@gocommerce/composition/view/maps';

	interface Props {
		address?: string;
		amenity?: string;
		city?: string;
		county?: string;
		stateName?: string;
		zipCode?: string;
		country?: string;
		coordinates: ShippingCoordinates;
		onUpdateLocation?: (coordinates: ShippingCoordinates | undefined) => void;
	}

	const { address, amenity, city, county, stateName, zipCode, country, coordinates = $bindable(), onUpdateLocation }: Props = $props();

	let mapConfig: MapConfig = $derived({ address, amenity, city, county, stateName, zipCode, country });
	let mapContainer = $state<HTMLDivElement>();

	onMount(async () => {
		await mapService.initialize(mapContainer!, mapConfig);
	});

	async function updateLocation() {
		const value = await mapService.updateLocation(mapConfig);
		coordinates.latitude = value?.latitude;
		coordinates.longitude = value?.longitude;
		onUpdateLocation?.(value);
	}

	$effect(() => {
		if (mapConfig) {
			updateLocation();
		}
	});
</script>

<div class="mt-8">
	<h2 class="mb-4 text-xl font-bold">{$t('shipping.deliveryLocation')}</h2>
	{#if $mapState.apiKeyMissing}
		<ApiKeyMissing />
	{:else}
		{#if $mapState.locationNotFound}
			<div class="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
				<p class="text-red-800">{$t('shipping.locationNotFound')}</p>
			</div>
		{/if}
		<div class="relative">
			<div
				bind:this={mapContainer}
				class="relative z-0 h-96 w-full overflow-hidden rounded-lg border border-gray-300 shadow-md"
			></div>
			<!-- Transparent overlay prevents all map interactions (clicks, drags, zoom) while allowing page scroll -->
			<div class="absolute inset-0 cursor-default bg-transparent"></div>
		</div>
	{/if}
</div>
