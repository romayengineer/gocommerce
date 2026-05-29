import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type IMapService, type MapConfig, DEFAULT_CENTER, DEFAULT_ZOOM } from './mapService';

// Fix for default marker icons in Leaflet with proper base path
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconUrl: '/node_modules/leaflet/dist/images/marker-icon.png',
	iconRetinaUrl: '/node_modules/leaflet/dist/images/marker-icon-2x.png',
	shadowUrl: '/node_modules/leaflet/dist/images/marker-shadow.png'
});

export class LeafletService implements IMapService {
	private map: L.Map | null = null;
	private marker: L.Marker | null = null;
	private mapContainer: HTMLDivElement | null = null;

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

	async updateLocation(config: MapConfig): Promise<void> {
		if (!this.map || !this.marker) {
			return;
		}

		const fullAddress = [config.address, config.city, config.zipCode, config.country]
			.filter(Boolean)
			.join(', ');

		if (!fullAddress || fullAddress.trim() === ',') {
			return;
		}

		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`
			);
			const results = await response.json() as Array<{ lat: string; lon: string }>;

			if (results.length > 0) {
				const { lat, lon } = results[0];
				const coordinates: L.LatLngExpression = [parseFloat(lat), parseFloat(lon)];
				this.map.setView(coordinates, DEFAULT_ZOOM);
				this.marker.setLatLng(coordinates);
			}
		} catch (error) {
			console.log('Address not found, showing default location');
		}
	}

	isInitialized(): boolean {
		return this.map !== null;
	}

	hasApiKey(): boolean {
		return true;
	}
}
