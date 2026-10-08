import type { ShippingCoordinates } from '@gocommerce/domain/shipping';

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

export interface IMapService {
	initialize(container: unknown, config?: MapConfig): Promise<void>;
	updateLocation(config: MapConfig): Promise<ShippingCoordinates | undefined>;
	isInitialized(): boolean;
	hasApiKey(): boolean;
	wasLocationFound(): boolean;
}
