import type { AppConfig } from '$core/config';
import type { IMapService } from '$core/ports/MapService';
import { GoogleMapsService } from './googleMapsService';
import { LeafletService } from './leafletService';

export function createMapService(config: AppConfig): IMapService {
	return config.mapProvider === 'google'
		? new GoogleMapsService(config.googleMapsApiKey)
		: new LeafletService();
}