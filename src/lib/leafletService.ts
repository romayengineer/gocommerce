import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapHasAddress, type IMapService, type MapConfig, DEFAULT_CENTER, DEFAULT_ZOOM, FOUND_LOCATION_ZOOM } from './mapService';

// KEEP THIS DOCUMENTATION
/*
# [Structured query](https://nominatim.org/release-docs/develop/api/Search/#structured-query)

| Parameter  | Value                      | Parámetro     | Valor (Argentina)                   |
| ---------- | -------------------------- | ------------- | ----------------------------------- |
| amenity    | name and/or type of POI    | amenidad      | nombre y/o tipo de lugar de interés |
| street     | housenumber and streetname | calle         | número y nombre de calle            |
| city       | city                       | ciudad        | ciudad                              |
| county     | county                     | partido       | partido o departamento              |
| state      | state                      | provincia     | provincia                           |
| country    | country                    | país          | país                                |
| postalcode | postal code                | código_postal | código postal                       |
*/


// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
	iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
	shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href
});

export class LeafletService implements IMapService {
	private map: L.Map | null = null;
	private marker: L.Marker | null = null;
	private mapContainer: HTMLDivElement | null = null;
	private updateTimeout: NodeJS.Timeout | null = null;
	private readonly DEBOUNCE_DELAY = 2000;
	private lastLocationFound = true;

	async initialize(container: HTMLDivElement): Promise<void> {
		this.mapContainer = container;
		this.initializeMap();
	}

	private initializeMap(): void {
		if (!this.mapContainer) {
			throw new Error('Map container not set');
		}

		this.map = L.map(this.mapContainer).setView(DEFAULT_CENTER, DEFAULT_ZOOM);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '© OpenStreetMap contributors'
		}).addTo(this.map);

		this.marker = L.marker(DEFAULT_CENTER).addTo(this.map);
	}

	updateLocation(config: MapConfig): Promise<void> {
		return new Promise((resolve) => {
			if (this.updateTimeout) {
				clearTimeout(this.updateTimeout);
			}

			this.updateTimeout = setTimeout(async () => {
				await this.performLocationUpdate(config);
				resolve();
			}, this.DEBOUNCE_DELAY);
		});
	}

	private async performLocationUpdate(config: MapConfig): Promise<void> {
		if (!this.map || !this.marker) {
			return;
		}

		console.log(JSON.stringify(config))
		const hasAddress = mapHasAddress(config)
		if (!hasAddress) {
			return;
		}
		console.log("updateLocation")

		try {
			const params = new URLSearchParams({
				format: 'json',
				limit: '1',
				addressdetails: '1'
			});

			// do not use amenity
			// if (config.amenity) {
			// 	params.append('amenity', config.amenity);
			// }
			if (config.address) {
				params.append('street', config.address);
			}
			if (config.city) {
				params.append('city', config.city);
			}
			if (config.county) {
				params.append('county', config.county);
			}
			if (config.stateName) {
				params.append('state', config.stateName);
			}
			if (config.zipCode) {
				params.append('postalcode', config.zipCode);
			}
			if (config.country) {
				params.append('country', config.country);
				params.append('countrycodes', config.country.substring(0, 2).toLowerCase());
			}

			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?${params.toString()}`
			);
			const results = await response.json() as Array<{ lat: string; lon: string }>;

			if (results.length > 0) {
				const { lat, lon } = results[0];
				const coordinates: L.LatLngExpression = [parseFloat(lat), parseFloat(lon)];
				this.map.setView(coordinates, FOUND_LOCATION_ZOOM);
				this.marker.setLatLng(coordinates);
				this.lastLocationFound = true;
			} else {
				this.lastLocationFound = false;
				this.resetToDefault();
			}
		} catch (error) {
			this.lastLocationFound = false;
			this.resetToDefault();
		}
	}

	private resetToDefault(): void {
		if (!this.map || !this.marker) {
			return;
		}
		const defaultCoords: L.LatLngExpression = [DEFAULT_CENTER.lat, DEFAULT_CENTER.lng];
		this.map.setView(defaultCoords, DEFAULT_ZOOM);
		this.marker.setLatLng(defaultCoords);
	}

	wasLocationFound(): boolean {
		return this.lastLocationFound;
	}

	isInitialized(): boolean {
		return this.map !== null;
	}

	hasApiKey(): boolean {
		return true;
	}
}
