import { type IMapService, type MapConfig, DEFAULT_CENTER, DEFAULT_ZOOM, FOUND_LOCATION_ZOOM } from './mapService';

export class GoogleMapsService implements IMapService {
	private apiKey: string;
	private map: google.maps.Map | null = null;
	private geocoder: google.maps.Geocoder | null = null;
	private marker: google.maps.marker.AdvancedMarkerElement | null = null;
	private mapContainer: HTMLDivElement | null = null;
	private lastLocationFound = true;

	constructor(apiKey: string = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '') {
		this.apiKey = apiKey;
	}

	async initialize(container: HTMLDivElement): Promise<void> {
		this.mapContainer = container;
		await this.loadGoogleMapsScript();
		this.initializeMap();
		this.initializeGeocoder();
		this.initializeMarker();
	}

	private async loadGoogleMapsScript(): Promise<void> {
		if (window.google) {
			return;
		}

		const script = document.createElement('script');
		script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&loading=async&libraries=marker`;
		script.async = true;
		script.defer = true;
		document.head.appendChild(script);

		await new Promise<void>((resolve) => {
			script.onload = () => resolve();
		});
	}

	private initializeMap(): void {
		if (!this.mapContainer) {
			throw new Error('Map container not set');
		}

		this.map = new google.maps.Map(this.mapContainer, {
			zoom: DEFAULT_ZOOM,
			center: DEFAULT_CENTER
		});
	}

	private initializeGeocoder(): void {
		this.geocoder = new google.maps.Geocoder();
	}

	private initializeMarker(): void {
		if (!this.map) return;

		if (window.google?.maps?.marker?.AdvancedMarkerElement) {
			this.marker = new window.google.maps.marker.AdvancedMarkerElement({
				map: this.map,
				position: DEFAULT_CENTER
			});
		}
	}

	async updateLocation(config: MapConfig): Promise<void> {
		if (!this.geocoder || !this.map) {
			return;
		}

		const fullAddress = [config.amenity, config.address, config.county, config.city, config.state, config.zipCode, config.country]
			.filter(Boolean)
			.join(', ');

		if (!fullAddress || fullAddress.trim() === ',') {
			return;
		}

		try {
			const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
				this.geocoder!.geocode({ address: fullAddress }, (results, status) => {
					if (status === 'OK' && results) {
						resolve(results);
					} else {
						reject(new Error(`Geocoding failed: ${status}`));
					}
				});
			});

			if (results[0]) {
				const location = results[0].geometry.location;
				this.map.setCenter(location);
				this.map.setZoom(FOUND_LOCATION_ZOOM);
				if (this.marker) {
					this.marker.position = location;
				}
				this.lastLocationFound = true;
			} else {
				this.lastLocationFound = false;
				this.resetToDefault();
			}
		} catch (error) {
			this.lastLocationFound = false;
			this.resetToDefault();
			console.log('Address not found, showing default location');
		}
	}

	private resetToDefault(): void {
		if (!this.map) {
			return;
		}
		this.map.setCenter(DEFAULT_CENTER);
		this.map.setZoom(DEFAULT_ZOOM);
		if (this.marker) {
			this.marker.position = DEFAULT_CENTER;
		}
	}

	isInitialized(): boolean {
		return this.map !== null && this.geocoder !== null;
	}

	hasApiKey(): boolean {
		return this.apiKey.length > 0;
	}

	wasLocationFound(): boolean {
		return this.lastLocationFound;
	}
}
