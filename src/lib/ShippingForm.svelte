<script lang="ts">
	import FormField from './FormField.svelte';

	export let formData = {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		zipCode: '',
		country: ''
	};
	export let submitted: boolean = false;
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
	<FormField
		id="firstName"
		label="First Name"
		placeholder="John"
		required
		bind:value={formData.firstName}
		error={submitted && !formData.firstName}
	/>

	<FormField
		id="lastName"
		label="Last Name"
		placeholder="Doe"
		required
		bind:value={formData.lastName}
		error={submitted && !formData.lastName}
	/>

	<FormField
		id="email"
		label="Email"
		type="email"
		placeholder="john@example.com"
		required
		bind:value={formData.email}
		error={submitted && !formData.email}
	/>

	<FormField
		id="phone"
		label="Phone"
		type="tel"
		placeholder="+1 (555) 000-0000"
		required
		bind:value={formData.phone}
		error={submitted && !formData.phone}
	/>

	<div class="md:col-span-2">
		<FormField
			id="address"
			label="Address"
			placeholder="123 Main Street"
			required
			bind:value={formData.address}
			error={submitted && !formData.address}
		/>
	</div>

	<FormField
		id="city"
		label="City"
		placeholder="New York"
		required
		bind:value={formData.city}
		error={submitted && !formData.city}
	/>

	<FormField
		id="zipCode"
		label="Zip Code"
		placeholder="10001"
		required
		bind:value={formData.zipCode}
		error={submitted && !formData.zipCode}
	/>

	<FormField
		id="country"
		label="Country"
		placeholder="United States"
		required
		bind:value={formData.country}
		error={submitted && !formData.country}
	/>
</div>
