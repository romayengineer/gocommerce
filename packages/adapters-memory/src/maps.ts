import type { LatLng, MapConfig } from '@gocommerce/ports/MapService';

export function mapHasAddress(config: MapConfig): boolean {
	// address and state are required
	if (
		config.address &&
		config.stateName &&
		(config.amenity || config.city || config.county || config.zipCode || config.country)
	) {
		return true;
	}
	return false;
}

export const DEFAULT_CENTER: LatLng = { lat: -34.5918657, lng: -58.4402608 };
export const DEFAULT_ZOOM = 12;
export const FOUND_LOCATION_ZOOM = DEFAULT_ZOOM + 5;
