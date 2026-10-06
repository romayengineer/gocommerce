<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import ApiKeyMissing from './ApiKeyMissing.svelte';
	import type { MapConfig } from '$core/ports/MapService';
	import type { ShippingCoordinates } from '$core/domain/shipping';
	import { mapService, mapState } from './view';

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
	<h2 class="text-xl font-bold mb-4">{$t('shipping.deliveryLocation')}</h2>
	{#if $mapState.apiKeyMissing}
		<ApiKeyMissing />
	{:else}
		{#if $mapState.locationNotFound}
			<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
				<p class="text-yellow-800">{$t('shipping.locationNotFound')}</p>
			</div>
		{/if}
		<div class="relative">
			<div
				bind:this={mapContainer}
				class="w-full h-96 border border-gray-300 rounded-lg shadow-md overflow-hidden relative z-0"
			></div>
			<!-- Transparent overlay prevents all map interactions (clicks, drags, zoom) while allowing page scroll -->
			<div class="absolute inset-0 bg-transparent cursor-default"></div>
		</div>
	{/if}
</div>