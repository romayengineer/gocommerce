<script lang="ts">
	import { onMount } from 'svelte';

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
		<div class="w-full h-96 border border-orange-300 rounded-lg shadow-md bg-orange-50 flex items-center justify-center p-4">
			<div class="text-center">
				<p class="text-orange-800 font-semibold mb-2">Google Maps API Key Required</p>
				<p class="text-orange-700 text-sm">
					To display the map, add your Google Maps API key to your <code class="bg-white px-2 py-1 rounded">.env</code> file:
				</p>
				<code class="block bg-white p-3 mt-2 rounded text-left text-xs border border-orange-200">
					VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
				</code>
				<p class="text-orange-700 text-xs mt-2">
					<a href="https://console.cloud.google.com/maps" target="_blank" rel="noopener" class="underline">Get your API key</a>
				</p>
			</div>
		</div>
	{:else}
		<div
			bind:this={mapContainer}
			class="w-full h-96 border border-gray-300 rounded-lg shadow-md"
		></div>
	{/if}
</div>
