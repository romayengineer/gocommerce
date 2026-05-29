export interface MapConfig {
	address?: string;
	city?: string;
	zipCode?: string;
	country?: string;
}

export const DEFAULT_CENTER = { lat: 40.7128, lng: -74.006 };
export const DEFAULT_ZOOM = 12;

export interface IMapService {
	initialize(container: HTMLDivElement): Promise<void>;
	updateLocation(config: MapConfig): Promise<void>;
	isInitialized(): boolean;
}
