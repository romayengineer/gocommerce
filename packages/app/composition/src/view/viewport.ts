import { toSvelte } from '@gocommerce/adapters/svelte/store';
import { getContainer } from '../singleton';

export const viewportTracker = getContainer().viewport;

export const viewport = toSvelte(getContainer().viewport.viewport);
