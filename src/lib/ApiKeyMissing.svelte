<script lang="ts">
	interface Props {
		apiName?: string;
		envVarName?: string;
		docsLink?: string;
	}

	const { apiName = 'Google Maps API', envVarName = 'VITE_GOOGLE_MAPS_API_KEY', docsLink = 'https://console.cloud.google.com/maps' } = $props<Props>();
</script>

<div class="w-full h-96 border border-orange-300 rounded-lg shadow-md bg-orange-50 flex items-center justify-center p-4">
	<div class="text-center">
		<p class="text-orange-800 font-semibold mb-2">{apiName} Key Required</p>
		<p class="text-orange-700 text-sm">
			To display the map, add your {apiName} key to your <code class="bg-white px-2 py-1 rounded">.env</code> file:
		</p>
		<code class="block bg-white p-3 mt-2 rounded text-left text-xs border border-orange-200">
			{envVarName}=your_api_key_here
		</code>
		<p class="text-orange-700 text-xs mt-2">
			<a href={docsLink} target="_blank" rel="noopener" class="underline">Get your API key</a>
		</p>
	</div>
</div>
