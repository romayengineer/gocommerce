<script lang="ts">
	import { browser } from '$app/environment';
	import Navigation from '$lib/Navigation.svelte';
	import Footer from '$lib/Footer.svelte';
	import { initializeI18n } from '$lib/i18n';
	import '../app.css';

	if (browser) {
		initializeI18n();
	}
</script>

<div class="min-h-screen flex flex-col bg-gray-50">
	<Navigation />
	<main class="flex-1">
		<slot />
	</main>
	<Footer />
</div>

<style global>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
