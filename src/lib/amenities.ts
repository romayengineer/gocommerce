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

export const AMENITIES = AMENITY_NAMES.map(name => ({
	value: name.toLowerCase(),
	label: name
}));
