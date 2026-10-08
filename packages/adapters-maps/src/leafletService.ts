import type L from 'leaflet';

import type { ShippingCoordinates } from '@gocommerce/domain/shipping';
import type { CenterZoom, IMapService, MapConfig } from '@gocommerce/ports/MapService';
import {
	mapHasAddress,
	DEFAULT_CENTER,
	DEFAULT_ZOOM,
	FOUND_LOCATION_ZOOM
} from '@gocommerce/adapters-memory/maps';

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

// Leaflet is lazy-loaded on first initialize() so the composition root and
// initial bundle never pull the heavy maps dependency (see gocommerce-s56).
// `import type` above keeps type-checking with zero runtime coupling.
type LeafletModule = typeof import('leaflet');

let leafletModule: LeafletModule | null = null;

async function loadLeaflet(): Promise<LeafletModule> {
	if (!leafletModule) {
		const [module] = await Promise.all([
			import('leaflet'),
			import('leaflet/dist/leaflet.css')
		]);
		// Fix for default marker icons in Leaflet
		delete (module.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
		module.Icon.Default.mergeOptions({
			iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
			iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
			shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href
		});
		leafletModule = module;
	}
	return leafletModule;
}

export class LeafletService implements IMapService {
	private map: L.Map | null = null;
	private marker: L.Marker | null = null;
	private mapContainer: HTMLDivElement | null = null;
	private updateTimeout: ReturnType<typeof setTimeout> | null = null;
	private readonly DEBOUNCE_DELAY = 2000;
	private lastLocationFound = true;

	async initialize(container: unknown, config?: MapConfig): Promise<void> {
		this.mapContainer = container as HTMLDivElement;
		await this.initializeMap(config);
	}

	private async initializeMap(config?: MapConfig): Promise<void> {
		if (!this.mapContainer) {
			throw new Error('Map container not set');
		}

		const Leaflet = await loadLeaflet();
		let centerZoom = await this.getCenter(config);

		this.map = Leaflet.map(this.mapContainer).setView(centerZoom.center, centerZoom.zoom);

		Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '© OpenStreetMap contributors'
		}).addTo(this.map);

		this.marker = Leaflet.marker(centerZoom.center).addTo(this.map);
	}

	private async getCenter(config?: MapConfig): Promise<CenterZoom> {
		if (config) {
			const coordinates = await this.getLocation(config);
			if (coordinates) {
				return {
					center: coordinates,
					zoom: FOUND_LOCATION_ZOOM,
					locationFound: true
				};
			}
		}
		return {
			center: DEFAULT_CENTER,
			zoom: DEFAULT_ZOOM,
			locationFound: false
		};
	}

	private async getLocation(config: MapConfig): Promise<{ lat: number; lng: number } | undefined> {
		const hasAddress = mapHasAddress(config);
		if (!hasAddress) {
			return;
		}

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
			const results = (await response.json()) as Array<{ lat: string; lon: string }>;

			const first = results[0];
			if (first === undefined) return;
			const { lat, lon } = first;
			return {
				lat: parseFloat(lat),
				lng: parseFloat(lon)
			};
		} catch (error) {
			return;
		}
	}

	updateLocation(config: MapConfig): Promise<ShippingCoordinates | undefined> {
		return new Promise((resolve) => {
			if (this.updateTimeout) {
				clearTimeout(this.updateTimeout);
			}

			this.updateTimeout = setTimeout(async () => {
				const coordinates = await this.performLocationUpdate(config);
				resolve(coordinates);
			}, this.DEBOUNCE_DELAY);
		});
	}

	private async performLocationUpdate(
		config: MapConfig
	): Promise<ShippingCoordinates | undefined> {
		if (!this.map || !this.marker) {
			return;
		}

		const centerZoom: CenterZoom = await this.getCenter(config);

		this.map.setView(centerZoom.center, centerZoom.zoom);
		this.marker.setLatLng(centerZoom.center);
		this.lastLocationFound = centerZoom.locationFound;

		if (centerZoom.locationFound) {
			return {
				latitude: centerZoom.center.lat,
				longitude: centerZoom.center.lng
			};
		}
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