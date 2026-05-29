<script lang="ts">
	import FormField from './FormField.svelte';
	import { t } from 'svelte-i18n';

	export let formData = {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		address: '',
		amenity: '',
		city: '',
		county: '',
		stateName: '',
		zipCode: '',
		country: ''
	};
	export let submitted: boolean = false;
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
	<FormField
		id="firstName"
		label={$t('shipping.firstName')}
		placeholder={$t('shipping.firstNamePlaceholder')}
		required
		bind:value={formData.firstName}
		error={submitted && !formData.firstName}
	/>

	<FormField
		id="lastName"
		label={$t('shipping.lastName')}
		placeholder={$t('shipping.lastNamePlaceholder')}
		required
		bind:value={formData.lastName}
		error={submitted && !formData.lastName}
	/>

	<FormField
		id="email"
		label={$t('shipping.email')}
		type="email"
		placeholder={$t('shipping.emailPlaceholder')}
		required
		bind:value={formData.email}
		error={submitted && !formData.email}
	/>

	<FormField
		id="phone"
		label={$t('shipping.phone')}
		type="tel"
		placeholder={$t('shipping.phonePlaceholder')}
		required
		bind:value={formData.phone}
		error={submitted && !formData.phone}
	/>

	<div class="md:col-span-2">
		<FormField
			id="address"
			label={$t('shipping.address')}
			placeholder={$t('shipping.addressPlaceholder')}
			required
			bind:value={formData.address}
			error={submitted && !formData.address}
		/>
	</div>

	<div class="md:col-span-2">
		<FormField
			id="amenity"
			label={$t('shipping.amenity')}
			placeholder={$t('shipping.amenityPlaceholder')}
			bind:value={formData.amenity}
			error={submitted && !formData.amenity}
		/>
	</div>

	<FormField
		id="city"
		label={$t('shipping.city')}
		placeholder={$t('shipping.cityPlaceholder')}
		required
		bind:value={formData.city}
		error={submitted && !formData.city}
	/>

	<FormField
		id="county"
		label={$t('shipping.county')}
		placeholder={$t('shipping.countyPlaceholder')}
		bind:value={formData.county}
		error={submitted && !formData.county}
	/>

	<FormField
		id="state"
		label={$t('shipping.state')}
		placeholder={$t('shipping.statePlaceholder')}
		bind:value={formData.stateName}
		error={submitted && !formData.stateName}
	/>

	<FormField
		id="zipCode"
		label={$t('shipping.zipCode')}
		placeholder={$t('shipping.zipCodePlaceholder')}
		required
		bind:value={formData.zipCode}
		error={submitted && !formData.zipCode}
	/>

	<FormField
		id="country"
		label={$t('shipping.country')}
		placeholder={$t('shipping.countryPlaceholder')}
		required
		bind:value={formData.country}
		error={submitted && !formData.country}
	/>
</div>
