/**
 * Presentation option data owned by ui-core.
 * (Canonical copies moved from @gocommerce/domain/amenities and
 * @gocommerce/domain/locations; those exports are deprecated — prefer this
 * module. The domain copies are kept for backward compat only.)
 */

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

export const AMENITIES = AMENITY_NAMES.map((name) => ({
	value: name.toLowerCase(),
	label: name
}));

const ARGENTINE_PROVINCES_NAMES = [
	'Buenos Aires',
	'Capital Federal',
	'Catamarca',
	'Chaco',
	'Chubut',
	'Cordoba',
	'Corrientes',
	'Entre Rios',
	'Formosa',
	'Jujuy',
	'La Pampa',
	'La Rioja',
	'Mendoza',
	'Misiones',
	'Neuquen',
	'Rio Negro',
	'Salta',
	'San Juan',
	'San Luis',
	'Santa Cruz',
	'Santa Fe',
	'Santiago del Estero',
	'Tierra del Fuego',
	'Tucuman'
];

export const ARGENTINE_PROVINCES = ARGENTINE_PROVINCES_NAMES.map((name) => ({
	value: name,
	label: name
}));
