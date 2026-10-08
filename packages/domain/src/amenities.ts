const AMENITY_NAMES = [
	'Office',
	'Store',
	'Restaurant',
	'Home',
	'Apartment',
	'Factory',
	'Warehouse',
	'School',
	'Hospital',
	'Hotel',
	'Bank',
	'Pharmacy',
	'Gym',
	'Library',
	'Museum',
	'Park',
	'Parking',
	'Other'
];

/**
 * @deprecated Prefer `AMENITIES` from `@gocommerce/ui-core/options-data`
 * (presentation owner). Kept here for backward compat only.
 */
export const AMENITIES = AMENITY_NAMES.map((name) => ({
	value: name.toLowerCase(),
	label: name
}));