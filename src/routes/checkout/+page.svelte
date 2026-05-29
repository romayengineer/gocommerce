<script lang="ts">
	import { t } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import Button from '$lib/Button.svelte';

	let formData = {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		zipCode: '',
		country: ''
	};

	let submitted = false;

	function handleSubmit() {
		submitted = true;
		if (formData.firstName && formData.lastName && formData.email && formData.phone && formData.address && formData.city && formData.zipCode && formData.country) {
			console.log('Order submitted:', formData);
			goto('#/');
		}
	}

	function goBack() {
		goto('#/cart');
	}
</script>

<div class="max-w-2xl mx-auto px-4 py-12">
	<h1 class="text-4xl font-bold mb-8">{$t('cart.checkout')}</h1>

	<form on:submit|preventDefault={handleSubmit} class="bg-white rounded-lg shadow p-8">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
					First Name *
				</label>
				<input
					id="firstName"
					type="text"
					bind:value={formData.firstName}
					required
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					placeholder="John"
				/>
				{#if submitted && !formData.firstName}
					<span class="text-red-500 text-sm mt-1">This field is required</span>
				{/if}
			</div>

			<div>
				<label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
					Last Name *
				</label>
				<input
					id="lastName"
					type="text"
					bind:value={formData.lastName}
					required
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					placeholder="Doe"
				/>
				{#if submitted && !formData.lastName}
					<span class="text-red-500 text-sm mt-1">This field is required</span>
				{/if}
			</div>

			<div>
				<label for="email" class="block text-sm font-medium text-gray-700 mb-2">
					Email *
				</label>
				<input
					id="email"
					type="email"
					bind:value={formData.email}
					required
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					placeholder="john@example.com"
				/>
				{#if submitted && !formData.email}
					<span class="text-red-500 text-sm mt-1">This field is required</span>
				{/if}
			</div>

			<div>
				<label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
					Phone *
				</label>
				<input
					id="phone"
					type="tel"
					bind:value={formData.phone}
					required
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					placeholder="+1 (555) 000-0000"
				/>
				{#if submitted && !formData.phone}
					<span class="text-red-500 text-sm mt-1">This field is required</span>
				{/if}
			</div>

			<div class="md:col-span-2">
				<label for="address" class="block text-sm font-medium text-gray-700 mb-2">
					Address *
				</label>
				<input
					id="address"
					type="text"
					bind:value={formData.address}
					required
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					placeholder="123 Main Street"
				/>
				{#if submitted && !formData.address}
					<span class="text-red-500 text-sm mt-1">This field is required</span>
				{/if}
			</div>

			<div>
				<label for="city" class="block text-sm font-medium text-gray-700 mb-2">
					City *
				</label>
				<input
					id="city"
					type="text"
					bind:value={formData.city}
					required
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					placeholder="New York"
				/>
				{#if submitted && !formData.city}
					<span class="text-red-500 text-sm mt-1">This field is required</span>
				{/if}
			</div>

			<div>
				<label for="zipCode" class="block text-sm font-medium text-gray-700 mb-2">
					Zip Code *
				</label>
				<input
					id="zipCode"
					type="text"
					bind:value={formData.zipCode}
					required
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					placeholder="10001"
				/>
				{#if submitted && !formData.zipCode}
					<span class="text-red-500 text-sm mt-1">This field is required</span>
				{/if}
			</div>

			<div>
				<label for="country" class="block text-sm font-medium text-gray-700 mb-2">
					Country *
				</label>
				<input
					id="country"
					type="text"
					bind:value={formData.country}
					required
					class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					placeholder="United States"
				/>
				{#if submitted && !formData.country}
					<span class="text-red-500 text-sm mt-1">This field is required</span>
				{/if}
			</div>
		</div>

		<div class="flex gap-4 mt-8">
			<Button type="submit" class="flex-1 py-3">
				Complete Order
			</Button>
			<Button variant="secondary" class="flex-1 py-3" onclick={goBack}>
				Back to Cart
			</Button>
		</div>
	</form>
</div>

<style>
	form {
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
</style>
