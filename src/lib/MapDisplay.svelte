<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import ApiKeyMissing from './ApiKeyMissing.svelte';
	import { createMapService } from './mapFactory';
	import { type IMapService } from './mapService';
	import { type ShippingCoordinates } from './schemas'

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

	const { address, amenity, city, county, stateName, zipCode, country, coordinates = $bindable() , onUpdateLocation }: Props = $props();

	let mapContainer = $state<HTMLDivElement>();
	let apiKeyMissing = $state(false);
	let locationNotFound = $state(false);
	let mapService: IMapService | null = null;

	onMount(async () => {
		mapService = createMapService();

		if (!mapService.hasApiKey()) {
			apiKeyMissing = true;
			return;
		}

		try {
			await mapService.initialize(mapContainer!);
			await updateLocation();
		} catch (error) {
			console.error('Failed to initialize map:', error);
		}
	});

	async function updateLocation() {
		if (!mapService) return;
		let value = await mapService.updateLocation({ address, amenity, city, county, stateName, zipCode, country });
		console.log('value ', JSON.stringify(value));
		if (value) {
			coordinates.latitude = value.latitude;
			coordinates.longitude = value.longitude;
		} else {
			coordinates.latitude = undefined;
			coordinates.longitude = undefined;
		}
		locationNotFound = !mapService.wasLocationFound();
		onUpdateLocation?.(value);
	}

	$effect(() => {
		if (address || amenity || city || county || stateName || zipCode || country) {
			updateLocation();
		}
	});
</script>

<div class="mt-8">
	<h2 class="text-xl font-bold mb-4">{$t('shipping.deliveryLocation')}</h2>
	{#if apiKeyMissing}
		<ApiKeyMissing />
	{:else}
		{#if locationNotFound}
			<div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
				<p class="text-yellow-800">{$t('shipping.locationNotFound')}</p>
			</div>
		{/if}
		<div class="relative">
			<div
				bind:this={mapContainer}
				class="w-full h-96 border border-gray-300 rounded-lg shadow-md overflow-hidden"
			></div>
			<!-- Transparent overlay prevents all map interactions (clicks, drags, zoom) while allowing page scroll -->
			<div class="absolute inset-0 bg-transparent cursor-default"></div>
		</div>
	{/if}
</div>
