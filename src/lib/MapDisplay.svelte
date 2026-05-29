<script lang="ts">
	import { onMount } from 'svelte';
	import ApiKeyMissing from './ApiKeyMissing.svelte';

	const { address = '', city = '', zipCode = '', country = '' } = $props<{
		address?: string;
		city?: string;
		zipCode?: string;
		country?: string;
	}>();

	let mapContainer = $state<HTMLDivElement>();
	let map = $state<google.maps.Map>();
	let geocoder = $state<google.maps.Geocoder>();
	let marker = $state<google.maps.marker.AdvancedMarkerElement>();
	let apiKeyMissing = $state(false);

	const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

	onMount(async () => {
		if (!GOOGLE_MAPS_API_KEY) {
			apiKeyMissing = true;
			return;
		}

		if (!window.google) {
			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&loading=async&libraries=marker`;
			script.async = true;
			script.defer = true;
			document.head.appendChild(script);

			await new Promise((resolve) => {
				script.onload = resolve;
			});
		}

		try {
			map = new google.maps.Map(mapContainer!, {
				zoom: 12,
				center: { lat: 40.7128, lng: -74.006 }
			});

			geocoder = new google.maps.Geocoder();

			if (window.google?.maps?.marker?.AdvancedMarkerElement) {
				marker = new window.google.maps.marker.AdvancedMarkerElement({
					map,
					position: { lat: 40.7128, lng: -74.006 }
				});
			}

			updateMap();
		} catch (error) {
			console.error('Failed to initialize map:', error);
		}
	});

	async function updateMap() {
		if (!geocoder || !map) return;

		const fullAddress = [address, city, zipCode, country].filter(Boolean).join(', ');

		if (!fullAddress || fullAddress.trim() === ',') return;

		try {
			const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
				geocoder!.geocode({ address: fullAddress }, (results, status) => {
					if (status === 'OK' && results) {
						resolve(results);
					} else {
						reject(new Error(`Geocoding failed: ${status}`));
					}
				});
			});

			if (results[0]) {
				const location = results[0].geometry.location;
				map.setCenter(location);
				if (marker) {
					marker.position = location;
				}
			}
		} catch (error) {
			console.log('Address not found, showing default location');
		}
	}

	$effect(() => {
		if (address || city || zipCode || country) {
			updateMap();
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
