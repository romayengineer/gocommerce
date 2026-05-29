<script lang="ts">
	import { onMount } from 'svelte';
	import ApiKeyMissing from './ApiKeyMissing.svelte';
	import { GoogleMapsService } from './googleMapsService';
	import { type IMapService } from './mapService';

	const { address = '', city = '', zipCode = '', country = '' } = $props<{
		address?: string;
		city?: string;
		zipCode?: string;
		country?: string;
	}>();

	let mapContainer = $state<HTMLDivElement>();
	let apiKeyMissing = $state(false);
	let mapService: IMapService | null = null;

	onMount(async () => {
		const googleMapsService = new GoogleMapsService();

		if (!googleMapsService.hasApiKey()) {
			apiKeyMissing = true;
			return;
		}

		try {
			mapService = googleMapsService;
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
