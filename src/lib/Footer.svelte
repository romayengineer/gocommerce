<script lang="ts">
	import Link from './Link.svelte';
</script>

<footer class="bg-gray-900 text-white mt-16">
	<div class="max-w-7xl mx-auto px-4 py-12">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
			<div>
				<h3 class="text-xl font-bold mb-4">ShopHub</h3>
				<p class="text-gray-400">Your trusted online shopping destination for quality products.</p>
			</div>

			<div>
				<h4 class="font-semibold mb-4">Shop</h4>
				<ul class="space-y-2 text-gray-400">
					<li><Link href="#/products" variant="muted">All Products</Link></li>
					<li><Link href="#/products" variant="muted">Categories</Link></li>
					<li><Link href="#/products" variant="muted">Sale</Link></li>
				</ul>
			</div>

			<div>
				<h4 class="font-semibold mb-4">Company</h4>
				<ul class="space-y-2 text-gray-400">
					<li><Link href="#/" variant="muted">About Us</Link></li>
					<li><Link href="#/" variant="muted">Contact</Link></li>
					<li><Link href="#/" variant="muted">Blog</Link></li>
				</ul>
			</div>

			<div>
				<h4 class="font-semibold mb-4">Legal</h4>
				<ul class="space-y-2 text-gray-400">
					<li><Link href="#/" variant="muted">Privacy Policy</Link></li>
					<li><Link href="#/" variant="muted">Terms of Service</Link></li>
					<li><Link href="#/" variant="muted">Shipping Info</Link></li>
				</ul>
			</div>
		</div>

		<div class="border-t border-gray-700 pt-8 text-center text-gray-400">
			<p>&copy; 2024 ShopHub. All rights reserved. | Built with Svelte</p>
		</div>
	</div>
</footer>
