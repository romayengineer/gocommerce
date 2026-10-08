import { toSvelte } from '@gocommerce/adapters/svelte/store';
import { getContainer } from '../singleton';

export const router = getContainer().router;

export const route = toSvelte(getContainer().router.route);
