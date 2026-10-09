<script lang="ts">
	import { onMount } from 'svelte';
	import { locale } from 'svelte-i18n';
	import { logger, config } from '@gocommerce/composition/view/app';
	import { viewportTracker } from '@gocommerce/composition/view/viewport';
	import { ensureProductSeed } from '@gocommerce/composition/view/catalog';
	import { router } from '@gocommerce/composition/view/router';
	import Navigation from '@gocommerce/ui-shell/Navigation.svelte';
	import Footer from '@gocommerce/ui-shell/Footer.svelte';
	import WhatsAppFloat from '@gocommerce/ui-shell/WhatsAppFloat.svelte';
	import '../app.css';

	$effect(() => {
		if (typeof document !== 'undefined') {
			if ($locale) document.documentElement.lang = $locale;
			if (config.view?.theme) document.documentElement.dataset.theme = config.view.theme;
			// Style tokens stay configurable: mirror container.config.view
			// into CSS vars so env-driven brands and runtime container
			// overrides apply without rebuilds. Page width is set globally
			// so Navigation/Footer (max-w-page) follow PageContainer.
			const style = document.documentElement.style;
			if (config.view?.pageWidth) style.setProperty('--width-page', config.view.pageWidth);
			const tokens = config.view?.tokens as Record<string, string> | undefined;
			if (tokens) {
				const tokenToVar: Record<string, string> = {
					fontSans: '--font-sans',
					headerBg: '--color-header',
					footerBg: '--color-footer',
					footerFg: '--color-footer-fg',
					footerBorder: '--color-footer-border',
					cardBg: '--color-card',
					mutedBg: '--color-muted',
					mutedHoverBg: '--color-muted-hover',
					borderColor: '--color-border',
					text: '--color-text',
					textSecondary: '--color-text-secondary',
					textMuted: '--color-text-muted',
					textFaint: '--color-text-faint',
					placeholder: '--color-placeholder',
					chipText: '--color-chip-text',
					dangerSoft: '--color-danger-soft',
					dangerBorder: '--color-danger-border',
					danger500: '--color-danger-500',
					danger600: '--color-danger-600',
					danger700: '--color-danger-700',
					success600: '--color-success-600',
					onColor: '--color-on'
				};
				for (const [key, cssVar] of Object.entries(tokenToVar)) {
					const value = tokens[key];
					if (typeof value === 'string' && value !== '') style.setProperty(cssVar, value);
				}
			}
			// Shop brand stays configurable: mirror seo config into the
			// document head so per-build brands get correct title/meta.
			if (config.seo?.title) document.title = config.seo.title;
			const description = document.querySelector('meta[name="description"]');
			if (description) description.setAttribute('content', config.seo.description);
			let themeColor = document.querySelector('meta[name="theme-color"]');
			if (!themeColor) {
				themeColor = document.createElement('meta');
				themeColor.setAttribute('name', 'theme-color');
				document.head.appendChild(themeColor);
			}
			themeColor.setAttribute('content', config.seo.themeColor);
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
	{#if config.layout.showHeader}
		<Navigation />
	{/if}
	<main class="flex-1">
		<!-- svelte-ignore slot_element_deprecated -->
		<slot />
	</main>
	{#if config.layout.showFooter}
		<Footer />
	{/if}
	<WhatsAppFloat />
</div>
