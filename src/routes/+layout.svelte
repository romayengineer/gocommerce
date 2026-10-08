<script lang="ts">
	import { onMount } from 'svelte';
	import { locale } from 'svelte-i18n';
	import { logger, config } from '@gocommerce/composition/view/app';
	import { viewportTracker } from '@gocommerce/composition/view/viewport';
	import { ensureProductSeed } from '@gocommerce/composition/view/catalog';
	import { router } from '@gocommerce/composition/view/router';
	import Navigation from '@gocommerce/ui-shell/Navigation.svelte';
	import Footer from '@gocommerce/ui-shell/Footer.svelte';
	import '../app.css';

	$effect(() => {
		if (typeof document !== 'undefined') {
			if ($locale) document.documentElement.lang = $locale;
			if (config.view?.theme) document.documentElement.dataset.theme = config.view.theme;
		}
	});

	onMount(() => {
		// Default viewport mount (window tracking). Feature grids may override
		// with their container via `viewportTracker.setElement(...)`; the
		// container itself mounts nothing so it stays side-effect free.
		// The router sync is likewise shell-owned: start here, stop on destroy.
		router.start();
		viewportTracker.setElement(window);
		// Persist the startup product-order seed to `?seed=` (replaceState)
		// so reloads and shared links reproduce the same shuffle.
		ensureProductSeed();
		return () => {
			router.stop();
			viewportTracker.dispose();
		};
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
