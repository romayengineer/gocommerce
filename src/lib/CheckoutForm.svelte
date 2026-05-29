<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from './Button.svelte';
	import ShippingForm from './ShippingForm.svelte';

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
		if (
			formData.firstName &&
			formData.lastName &&
			formData.email &&
			formData.phone &&
			formData.address &&
			formData.city &&
			formData.zipCode &&
			formData.country
		) {
			console.log('Order submitted:', formData);
			goto('#/');
		}
	}

	function goBack() {
		goto('#/cart');
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="bg-white rounded-lg shadow p-8">
	<ShippingForm bind:formData bind:submitted />

	<div class="flex gap-4 mt-8">
		<Button type="submit" class="flex-1 py-3">
			Complete Order
		</Button>
		<Button variant="secondary" class="flex-1 py-3" onclick={goBack}>
			Back to Cart
		</Button>
	</div>
</form>

<style>
	form {
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}
</style>
