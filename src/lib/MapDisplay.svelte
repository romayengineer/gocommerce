<script lang="ts">
	import { onMount } from 'svelte';
	import ApiKeyMissing from './ApiKeyMissing.svelte';
	import { GoogleMapsService, type MapConfig } from './googleMapsService';

	const { address = '', city = '', zipCode = '', country = '' } = $props<{
		address?: string;
		city?: string;
		zipCode?: string;
		country?: string;
	}>();

	let mapContainer = $state<HTMLDivElement>();
	let apiKeyMissing = $state(false);
	let mapService: GoogleMapsService | null = null;

	const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

	onMount(async () => {
		if (!GOOGLE_MAPS_API_KEY) {
			apiKeyMissing = true;
			return;
		}

		try {
			mapService = new GoogleMapsService(GOOGLE_MAPS_API_KEY);
			await mapService.initialize(mapContainer!);
			await updateLocation();
		} catch (error) {
			console.error('Failed to initialize map:', error);
		}
	});

	async function updateLocation() {
		if (!mapService) return;
		await mapService.updateLocation({ address, city, zipCode, country });
	}

	$effect(() => {
		if (address || city || zipCode || country) {
			updateLocation();
		}
	});
</script>

<div class="mt-8">
	<h2 class="text-xl font-bold mb-4">Delivery Location</h2>
	{#if apiKeyMissing}
		<ApiKeyMissing />
	{:else}
		<div
			bind:this={mapContainer}
			class="w-full h-96 border border-gray-300 rounded-lg shadow-md"
		></div>
	{/if}
</div>
