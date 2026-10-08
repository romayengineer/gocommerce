import { describe, it, expect } from 'vitest';
import {
	mapHasAddress,
	DEFAULT_CENTER,
	DEFAULT_ZOOM,
	FOUND_LOCATION_ZOOM
} from './geo';

describe('mapHasAddress', () => {
	it('requires address and stateName plus one locality field', () => {
		expect(mapHasAddress({})).toBe(false);
		expect(mapHasAddress({ address: 'Calle 123' })).toBe(false);
		expect(mapHasAddress({ address: 'Calle 123', stateName: 'Buenos Aires' })).toBe(false);
		expect(
			mapHasAddress({ address: 'Calle 123', stateName: 'Buenos Aires', city: 'La Plata' })
		).toBe(true);
		expect(
			mapHasAddress({ address: 'Calle 123', stateName: 'Buenos Aires', zipCode: '1900' })
		).toBe(true);
	});
});

describe('default viewport constants', () => {
	it('centers on Buenos Aires with a closer found-zoom', () => {
		expect(DEFAULT_CENTER).toEqual({ lat: -34.5918657, lng: -58.4402608 });
		expect(FOUND_LOCATION_ZOOM).toBe(DEFAULT_ZOOM + 5);
	});
});
