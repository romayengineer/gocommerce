<script lang="ts">
	import { cart, removeFromCart, updateQuantity, clearCart } from '../../lib/cart';

	let total = $derived($cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0));
	let itemCount = $derived($cart.reduce((sum, item) => sum + item.quantity, 0));
</script>

<div class="max-w-4xl mx-auto px-4 py-12">
	<h1 class="text-4xl font-bold mb-8">Shopping Cart</h1>

	{#if $cart.length === 0}
		<div class="bg-white rounded-lg p-12 text-center">
			<p class="text-xl text-gray-600 mb-6">Your cart is empty</p>
			<a href="#/products" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block">
				Continue Shopping
			</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<div class="lg:col-span-2">
				<div class="bg-white rounded-lg shadow">
					{#each $cart as item (item.product.id)}
						<div class="flex items-center gap-4 p-6 border-b">
							<div class="text-4xl">{item.product.emoji}</div>

							<div class="flex-1">
								<h3 class="font-semibold text-lg">{item.product.name}</h3>
								<p class="text-gray-600">${item.product.price.toFixed(2)} each</p>
							</div>

							<div class="flex items-center gap-3">
								<button
									onclick={() => updateQuantity(item.product.id, item.quantity - 1)}
									class="px-2 py-1 border rounded hover:bg-gray-100"
									disabled={item.quantity <= 1}
								>
									−
								</button>
								<input
									type="number"
									value={item.quantity}
									min="1"
									onchange={(e) => updateQuantity(item.product.id, parseInt(e.target?.value) || 1)}
									class="w-16 text-center border rounded p-1"
								/>
								<button
									onclick={() => updateQuantity(item.product.id, item.quantity + 1)}
									class="px-2 py-1 border rounded hover:bg-gray-100"
								>
									+
								</button>
							</div>

							<div class="w-24 text-right">
								<p class="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
							</div>

							<button
								onclick={() => removeFromCart(item.product.id)}
								class="text-red-600 hover:text-red-800 font-semibold"
							>
								Remove
							</button>
						</div>
					{/each}
				</div>
			</div>

			<div class="h-fit">
				<div class="bg-white rounded-lg shadow p-6 sticky top-4">
					<h2 class="text-2xl font-bold mb-4">Order Summary</h2>

					<div class="space-y-3 mb-6 pb-6 border-b">
						<div class="flex justify-between">
							<span>Subtotal:</span>
							<span>${total.toFixed(2)}</span>
						</div>
						<div class="flex justify-between">
							<span>Shipping:</span>
							<span>${(total > 100 ? 0 : 10).toFixed(2)}</span>
						</div>
						<div class="flex justify-between">
							<span>Tax:</span>
							<span>${(total * 0.1).toFixed(2)}</span>
						</div>
					</div>

					<div class="flex justify-between text-2xl font-bold mb-6">
						<span>Total:</span>
						<span>${(total + (total > 100 ? 0 : 10) + total * 0.1).toFixed(2)}</span>
					</div>

					<button class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mb-3">
						Proceed to Checkout
					</button>

					<button
						onclick={() => clearCart()}
						class="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
					>
						Clear Cart
					</button>

					{#if total > 100}
						<div class="mt-4 bg-green-50 border border-green-200 rounded p-3 text-sm text-green-700">
							🎉 Free shipping on orders over $100!
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
