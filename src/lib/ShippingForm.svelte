<script lang="ts">
	import FormField from './FormField.svelte';
	import SearchableSelect from './SearchableSelect.svelte';
	import { t } from 'svelte-i18n';
	import { ARGENTINE_PROVINCES } from './argentineProvinces';
	import { AMENITIES } from './amenities';
	import type { ShippingFormData } from './schemas';

	let { formData = $bindable(), errors = $bindable({}), submitted = $bindable({}) } = $props<{
		formData: ShippingFormData;
		errors: Record<string, string[] | undefined>;
		submitted: boolean;
	}>();

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
		placeholder={$t('shipping.firstNamePlaceholder')}
		required
		bind:value={formData.firstName}
		error={!!errors.firstName}
		errorMessage={errors.firstName?.[0]}
	/>

	<FormField
		id="lastName"
		label={$t('shipping.lastName')}
		placeholder={$t('shipping.lastNamePlaceholder')}
		required
		bind:value={formData.lastName}
		error={!!errors.lastName}
		errorMessage={errors.lastName?.[0]}
	/>

	<FormField
		id="email"
		label={$t('shipping.email')}
		type="email"
		placeholder={$t('shipping.emailPlaceholder')}
		required
		bind:value={formData.email}
		error={!!errors.email}
		errorMessage={errors.email?.[0]}
	/>

	<FormField
		id="phone"
		label={$t('shipping.phone')}
		type="tel"
		placeholder={$t('shipping.phonePlaceholder')}
		required
		bind:value={formData.phone}
		error={!!errors.phone}
		errorMessage={errors.phone?.[0]}
	/>

	<div class="md:col-span-2">
		<FormField
			id="address"
			label={$t('shipping.address')}
			placeholder={$t('shipping.addressPlaceholder')}
			required
			bind:value={formData.address}
			error={!!errors.address}
			errorMessage={errors.address?.[0]}
		/>
	</div>

	<div class="md:col-span-2">
		<SearchableSelect
			id="amenity"
			required={true}
			label={$t('shipping.amenity')}
			placeholder={$t('shipping.amenityPlaceholder')}
			options={amenitiesWithLabels}
			bind:value={formData.amenity}
			error={!!errors.amenity}
		/>
	</div>

	<FormField
		id="city"
		label={$t('shipping.city')}
		placeholder={$t('shipping.cityPlaceholder')}
		required
		bind:value={formData.city}
		error={!!errors.city}
		errorMessage={errors.city?.[0]}
	/>

	<FormField
		id="county"
		label={$t('shipping.county')}
		placeholder={$t('shipping.countyPlaceholder')}
		bind:value={formData.county}
		error={!!errors.county}
		errorMessage={errors.county?.[0]}
	/>

	<SearchableSelect
		id="state"
		label={$t('shipping.state')}
		placeholder={$t('shipping.statePlaceholder')}
		options={ARGENTINE_PROVINCES}
		bind:value={formData.stateName}
		required
		error={!!errors.stateName}
	/>

	<FormField
		id="zipCode"
		label={$t('shipping.zipCode')}
		placeholder={$t('shipping.zipCodePlaceholder')}
		required
		bind:value={formData.zipCode}
		error={!!errors.zipCode}
		errorMessage={errors.zipCode?.[0]}
	/>

	<FormField
		id="country"
		label={$t('shipping.country')}
		placeholder={$t('shipping.countryPlaceholder')}
		required
		bind:value={formData.country}
		error={!!errors.country}
		errorMessage={errors.country?.[0]}
		editable={false}
	/>
</div>
