import type { MapConfig } from '@gocommerce/domain/geo';
import type { ShippingCoordinates } from '@gocommerce/domain/shipping';

// Geography value objects are owned by `@gocommerce/domain/geo` (single
// owner); ports re-exports the types so consumers keep importing from the
// port. All imports stay `import type` — no runtime coupling.
export type { CenterZoom, LatLng, MapConfig } from '@gocommerce/domain/geo';

/**
 * Opaque mount target for map SDKs (an `HTMLDivElement` in practice).
 * Owned by the port so `application` never imports DOM types: adapters
 * narrow it internally, callers pass it through untouched.
 */
export type MapMountTarget = unknown;

export interface IMapService {
	initialize(target: MapMountTarget, config?: MapConfig): Promise<void>;
	updateLocation(config: MapConfig): Promise<ShippingCoordinates | undefined>;
	isInitialized(): boolean;
	hasApiKey(): boolean;
	wasLocationFound(): boolean;
}
