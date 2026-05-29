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
	if (config.address || config.amenity || config.city || config.county || config.stateName || config.zipCode || config.country) {
		return true
	}
	return false
}

export const DEFAULT_CENTER = { lat: -34.5918657, lng: -58.4402608 };
export const DEFAULT_ZOOM = 12;
export const FOUND_LOCATION_ZOOM = DEFAULT_ZOOM + 5;

export interface IMapService {
	initialize(container: HTMLDivElement): Promise<void>;
	updateLocation(config: MapConfig): Promise<void>;
	isInitialized(): boolean;
	hasApiKey(): boolean;
	wasLocationFound(): boolean;
}
