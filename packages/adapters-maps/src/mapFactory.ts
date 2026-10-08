import type { AppConfig } from '@gocommerce/config/config';
import type { Logger } from '@gocommerce/ports/Logger';
import { noopLogger } from '@gocommerce/foundation/logger';
import type { IMapService } from '@gocommerce/ports/MapService';
import { GoogleMapsService } from './googleMapsService';
import { LeafletService } from './leafletService';

// Provider wrapper classes are tiny; the heavy SDK payloads (leaflet bundle,
// google maps script) already load lazily inside each service, so this
// factory stays synchronous — only the selected provider is instantiated.
export function createMapService(config: AppConfig, logger: Logger = noopLogger): IMapService {
	return config.mapProvider === 'google'
		? new GoogleMapsService(config.googleMapsApiKey, logger)
		: new LeafletService();
}