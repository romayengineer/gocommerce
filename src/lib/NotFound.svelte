<script>
	import { goto } from '$app/navigation';

	setTimeout(() => {
		goto('/#/products', {
			replaceState: true,
		});
	}, 3000)
</script>

<div class="min-h-screen flex flex-col items-center justify-center px-4">
	<div class="text-center">
		<h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
		<p class="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</p>
		<p class="text-gray-600 mb-8 max-w-md">
			Sorry, the page you're looking for doesn't exist or has been moved.
		</p>
		<button
			onclick={() => goto('/')}
			class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
		>
			Go Home
		</button>
	</div>
</div>
