<script lang="ts">
	import FormField from './FormField.svelte';
	import SearchableSelect from './SearchableSelect.svelte';
	import { t } from 'svelte-i18n';
	import { ARGENTINE_PROVINCES } from './argentineProvinces';
	import { AMENITIES } from './amenities';
	import type { ShippingFormData, FieldErrors } from './schemas';

	interface Props {
		formData: ShippingFormData;
		errors: FieldErrors;
		submitted: boolean;
	}

	let { formData = $bindable(), errors = $bindable({}), submitted = $bindable(false) }: Props = $props();

	const amenitiesWithLabels = $derived(
		AMENITIES.map(amenity => ({
			...amenity,
			label: $t(`amenities.${amenity.value}`)
		}))
	);
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
	<FormField
		id="firstName"
		label={$t('shipping.firstName')}
		required
		bind:value={formData.firstName}
		error={!!errors.firstName}
		errorMessages={errors.firstName?.errors}
	/>

	<FormField
		id="lastName"
		label={$t('shipping.lastName')}
		required
		bind:value={formData.lastName}
		error={!!errors.lastName}
		errorMessages={errors.lastName?.errors}
	/>

	<FormField
		id="email"
		label={$t('shipping.email')}
		type="email"
		required
		bind:value={formData.email}
		error={!!errors.email}
		errorMessages={errors.email?.errors}
	/>

	<FormField
		id="phone"
		label={$t('shipping.phone')}
		type="tel"
		required
		bind:value={formData.phone}
		error={!!errors.phone}
		errorMessages={errors.phone?.errors}
	/>

	<div class="md:col-span-2">
		<FormField
			id="address"
			label={$t('shipping.address')}
			required
			bind:value={formData.address}
			error={!!errors.address}
			errorMessages={errors.address?.errors}
		/>
	</div>

	<div class="md:col-span-2">
		<SearchableSelect
			id="amenity"
			required={false}
			label={$t('shipping.amenity')}
			options={amenitiesWithLabels}
			bind:value={formData.amenity}
			error={!!errors.amenity}
		/>
	</div>

	<FormField
		id="city"
		label={$t('shipping.city')}
		required={false}
		bind:value={formData.city}
		error={!!errors.city}
		errorMessages={errors.city?.errors}
	/>

	<FormField
		id="county"
		label={$t('shipping.county')}
		bind:value={formData.county}
		error={!!errors.county}
		errorMessages={errors.county?.errors}
	/>

	<SearchableSelect
		id="state"
		label={$t('shipping.state')}
		options={ARGENTINE_PROVINCES}
		bind:value={formData.stateName}
		required
		error={!!errors.stateName}
	/>

	<FormField
		id="zipCode"
		label={$t('shipping.zipCode')}
		required={false}
		bind:value={formData.zipCode}
		error={!!errors.zipCode}
		errorMessages={errors.zipCode?.errors}
	/>

	<FormField
		id="country"
		label={$t('shipping.country')}
		required
		bind:value={formData.country}
		error={!!errors.country}
		errorMessages={errors.country?.errors}
		editable={false}
	/>
</div>
