<script lang="ts">
	import { onMount } from 'svelte';
	import { locale } from 'svelte-i18n';
	import { logger } from '@gocommerce/adapters/browser/logger';
	import { config } from '$lib/view';
	import Navigation from '$lib/layout/Navigation.svelte';
	import Footer from '$lib/layout/Footer.svelte';
	import '@gocommerce/adapters/svelte/i18n';
	import '../app.css';

	$effect(() => {
		if (typeof document !== 'undefined') {
			if ($locale) document.documentElement.lang = $locale;
			if (config.view?.theme) document.documentElement.dataset.theme = config.view.theme;
		}
	});

	onMount(() => {
		if ('serviceWorker' in navigator && isSecureContext()) {
			navigator.serviceWorker
				.register('/service-worker.js', { scope: '/' })
				.then((registration) => {
					logger.log('Service Worker registered:', registration);
					// Check for updates periodically
					setInterval(() => {
						registration.update();
					}, 60000);
				})
				.catch((error) => {
					logger.error('Service Worker registration failed:', error);
				});
		}
	});

	function isSecureContext(): boolean {
		return window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
	}

	// log screen dimensions
	logger.log(`Width: ${window.innerWidth}px, Height: ${window.innerHeight}px`);
</script>

<div class="min-h-screen flex flex-col bg-surface">
	<Navigation />
	<main class="flex-1">
		<!-- svelte-ignore slot_element_deprecated -->
		<slot />
	</main>
	<Footer />
</div>
