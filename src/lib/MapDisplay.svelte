<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import ApiKeyMissing from './ApiKeyMissing.svelte';
	import { createMapService } from './mapFactory';
	import { type IMapService } from './mapService';

	const { address = '', city = '', zipCode = '', country = '' } = $props<{
		address?: string;
		city?: string;
		zipCode?: string;
		country?: string;
	}>();

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
		await mapService.updateLocation({ address, city, zipCode, country });
		locationNotFound = !mapService.wasLocationFound();
	}

	$effect(() => {
		if (address || city || zipCode || country) {
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
		<div
			bind:this={mapContainer}
			class="w-full h-96 border border-gray-300 rounded-lg shadow-md"
		></div>
	{/if}
</div>
