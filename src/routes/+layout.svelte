<script lang="ts">
	import { onMount } from 'svelte';
	import Navigation from '$lib/Navigation.svelte';
	import Footer from '$lib/Footer.svelte';
	import '$lib/i18n';
	import '../app.css';

	onMount(() => {
		if ('serviceWorker' in navigator && isSecureContext()) {
			navigator.serviceWorker
				.register('/service-worker.js', { scope: '/' })
				.then((registration) => {
					console.log('Service Worker registered:', registration);
					// Check for updates periodically
					setInterval(() => {
						registration.update();
					}, 60000);
				})
				.catch((error) => {
					console.error('Service Worker registration failed:', error);
				});
		}
	});

	function isSecureContext(): boolean {
		return window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
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
