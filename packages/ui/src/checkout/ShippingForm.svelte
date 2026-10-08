<script lang="ts">
	import FormField from '$lib/ui/FormField.svelte';
	import SearchableSelect from '$lib/ui/SearchableSelect.svelte';
	import { t } from 'svelte-i18n';
	import { ARGENTINE_PROVINCES, AMENITIES } from '@gocommerce/ui-core/options-data';
	import type { ShippingFormData, FieldErrors } from '@gocommerce/domain/shipping';

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

<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
	<FormField
		id="firstName"
		label={$t('shipping.firstName')}
		autocomplete="given-name"
		required
		bind:value={formData.firstName}
		error={!!errors.firstName}
		errorMessages={errors.firstName?.errors}
	/>

	<FormField
		id="lastName"
		label={$t('shipping.lastName')}
		autocomplete="family-name"
		required
		bind:value={formData.lastName}
		error={!!errors.lastName}
		errorMessages={errors.lastName?.errors}
	/>

	<FormField
		id="email"
		label={$t('shipping.email')}
		type="email"
		autocomplete="email"
		required
		bind:value={formData.email}
		error={!!errors.email}
		errorMessages={errors.email?.errors}
	/>

	<FormField
		id="phone"
		label={$t('shipping.phone')}
		type="tel"
		autocomplete="tel"
		required
		bind:value={formData.phone}
		error={!!errors.phone}
		errorMessages={errors.phone?.errors}
	/>

	<div class="md:col-span-2">
		<FormField
			id="address"
			label={$t('shipping.address')}
			autocomplete="street-address"
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
		autocomplete="address-level2"
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
		autocomplete="postal-code"
		required={false}
		bind:value={formData.zipCode}
		error={!!errors.zipCode}
		errorMessages={errors.zipCode?.errors}
	/>

	<FormField
		id="country"
		label={$t('shipping.country')}
		autocomplete="country-name"
		required
		bind:value={formData.country}
		error={!!errors.country}
		errorMessages={errors.country?.errors}
		editable={false}
	/>
</div>
