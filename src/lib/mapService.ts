export interface MapConfig {
	address?: string;
	amenity?: string;
	city?: string;
	county?: string;
	state?: string;
	zipCode?: string;
	country?: string;
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
