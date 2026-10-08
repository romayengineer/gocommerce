import type { WritableStore } from '@gocommerce/ports/Store';
import type { StoreFactory } from '@gocommerce/ports/StoreFactory';
import type { Logger } from '@gocommerce/ports/Logger';
import type { IMapService, MapConfig } from '@gocommerce/ports/MapService';
import type { ShippingCoordinates } from '@gocommerce/domain/shipping';

export interface MapLocationState {
	coordinates: ShippingCoordinates;
	locationNotFound: boolean;
	apiKeyMissing: boolean;
	initialized: boolean;
}

export class MapLocationService {
	readonly state: WritableStore<MapLocationState>;
	private service: IMapService | null = null;

	constructor(
		private factory: () => IMapService,
		private logger: Logger,
		stores: StoreFactory
	) {
		this.state = stores.create({
			coordinates: {},
			locationNotFound: false,
			apiKeyMissing: false,
			initialized: false
		});
	}

	async initialize(container: unknown, config?: MapConfig): Promise<void> {
		this.service = this.factory();

		if (!this.service.hasApiKey()) {
			this.state.update((s) => ({ ...s, apiKeyMissing: true }));
			return;
		}

		try {
			await this.service.initialize(container, config);
			this.state.update((s) => ({ ...s, initialized: true }));
		} catch (error) {
			this.logger.error('Failed to initialize map:', error);
		}
	}

	async updateLocation(config: MapConfig): Promise<ShippingCoordinates | undefined> {
		if (!this.service) return undefined;
		const value = await this.service.updateLocation(config);
		const coordinates = value ?? {};
		this.state.update((s) => ({
			...s,
			coordinates,
			locationNotFound: !this.service!.wasLocationFound()
		}));
		return value;
	}
}