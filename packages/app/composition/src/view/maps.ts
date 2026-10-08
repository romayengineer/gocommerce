import { toSvelte } from '@gocommerce/adapters/svelte/store';
import { getContainer } from '../singleton';

export const mapService = getContainer().maps;

export const mapState = toSvelte(getContainer().maps.state);
