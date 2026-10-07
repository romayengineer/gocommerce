import type { AppConfig } from '@gocommerce/config';
import type { IMapService } from '@gocommerce/ports/MapService';
import { GoogleMapsService } from './googleMapsService';
import { LeafletService } from './leafletService';

export function createMapService(config: AppConfig): IMapService {
	return config.mapProvider === 'google'
		? new GoogleMapsService(config.googleMapsApiKey)
		: new LeafletService();
}