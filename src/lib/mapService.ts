import type { ShippingCoordinates } from './schemas'
import type { LatLngLiteral } from 'leaflet';

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


export function mapHasAddress(config: MapConfig): boolean {
	// address and state are required
	if (config.address && config.stateName && (config.amenity || config.city || config.county || config.zipCode || config.country)) {
		return true
	}
	return false
}

export const DEFAULT_CENTER = { lat: -34.5918657, lng: -58.4402608 };
export const DEFAULT_ZOOM = 12;
export const FOUND_LOCATION_ZOOM = DEFAULT_ZOOM + 5;

export interface CenterZoom {
	center: LatLngLiteral,
	zoom: number,
	locationFound: boolean,
}

export interface IMapService {
	initialize(container: HTMLDivElement, config?: MapConfig): Promise<void>;
	updateLocation(config: MapConfig): Promise<ShippingCoordinates | undefined>;
	isInitialized(): boolean;
	hasApiKey(): boolean;
	wasLocationFound(): boolean;
}
