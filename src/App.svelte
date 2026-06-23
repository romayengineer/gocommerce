<script>
	import Navigation from './lib/Navigation.svelte';
	import Footer from './lib/Footer.svelte';
	import './app.css';
</script>

<div class="min-h-screen flex flex-col bg-gray-50">
	<Navigation />
	<main class="flex-1">
		<slot />
	</main>
	<Footer />
</div>
