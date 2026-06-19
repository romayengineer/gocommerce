import { GoogleMapsService } from './googleMapsService';
import { LeafletService } from './leafletService';
import type { IMapService } from './mapService';

type MapProvider = 'google' | 'leaflet';

function getMapProvider(): MapProvider {
	const provider = (import.meta.env.VITE_MAP_PROVIDER || 'leaflet') as MapProvider;
	return provider === 'google' ? 'google' : 'leaflet';
}

export function createMapService(): IMapService {
	const provider = getMapProvider();
	return provider === 'google' ? new GoogleMapsService() : new LeafletService();
}
