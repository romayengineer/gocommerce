/**
 * Geography value objects (single owner).
 *
 * `LatLng`, `MapConfig`, `CenterZoom`, the default viewport constants and
 * `mapHasAddress` live here in `domain` so every layer shares one definition
 * by reference. `@gocommerce/ports/MapService` re-exports the types
 * (`import type` only, no runtime coupling); `@gocommerce/adapters-maps/*`
 * imports the values from `@gocommerce/domain/geo` — never from
 * `@gocommerce/foundation` (see `scripts/check-boundaries.ts`).
 */

export interface LatLng {
	lat: number;
	lng: number;
}

/*
┌────────────────┬────────────┬──────────────────────────────────┐
│     Level      │    Size    │             Example              │
├────────────────┼────────────┼──────────────────────────────────┤
│ Country        │ Largest    │ Argentina                        │
├────────────────┼────────────┼──────────────────────────────────┤
│ State/Province │ Very large │ Buenos Aires Province            │
├────────────────┼────────────┼──────────────────────────────────┤
│ County         │ Large      │ Partido (Avellaneda, La Matanza) │
├────────────────┼────────────┼──────────────────────────────────┤
│ City           │ Medium     │ Ciudad de Buenos Aires, La Plata │
├────────────────┼────────────┼──────────────────────────────────┤
│ Neighborhood   │ Small      │ Barrio (Caballito, San Telmo)    │
└────────────────┴────────────┴──────────────────────────────────┘
*/

export interface MapConfig {
	address?: string;
	amenity?: string;
	city?: string;
	county?: string;
	stateName?: string; // state is a reserved word use stateName instead
	zipCode?: string;
	country?: string;
}

export interface CenterZoom {
	center: LatLng;
	zoom: number;
	locationFound: boolean;
}

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
