import { describe, it, expect } from 'vitest';
import { columnsForWidth, DEFAULT_COLUMN_WIDTH, MIN_COLUMNS, MAX_COLUMNS } from './viewport';
import { computeGridLayout, pageFromScrollHeight, DEFAULT_GRID_CONFIG } from './grid';
import { updatePageInUrl, getPageInUrl, getSeedInUrl, setSeedInUrl } from './url';
import { formatPrice } from './format';
import { filterOptions, matchesOption } from './search';
import { AMENITIES, ARGENTINE_PROVINCES } from './options-data';

describe('columnsForWidth', () => {
	it('scales columns with width within bounds', () => {
		expect(columnsForWidth(DEFAULT_COLUMN_WIDTH * 2)).toBe(2);
		expect(columnsForWidth(DEFAULT_COLUMN_WIDTH * 10)).toBe(MAX_COLUMNS);
		expect(columnsForWidth(1)).toBe(MIN_COLUMNS);
	});
});

describe('pageFromScrollHeight', () => {
	it('derives the page from scroll height', () => {
		expect(pageFromScrollHeight(0, 600, 8)).toBe(1);
		expect(pageFromScrollHeight(608, 600, 8)).toBe(2);
	});
});

describe('computeGridLayout', () => {
	it('lays out products for the current page window', () => {
		const products = Array.from({ length: 10 }, (_, i) => i);
		const layout = computeGridLayout(products, 1200, 4, 1, DEFAULT_GRID_CONFIG);
		expect(layout.columns).toBe(4);
		expect(layout.products.length).toBeGreaterThan(0);
	});
});

describe('url page helpers', () => {
	it('round-trips the page query param', () => {
		const url = updatePageInUrl('https://shop.example/#/', 3);
		expect(getPageInUrl(url)).toBe(3);
		expect(getPageInUrl('https://shop.example/#/')).toBe(1);
	});
});

describe('url seed helpers', () => {
	it('returns null when the seed param is missing or empty', () => {
		expect(getSeedInUrl('https://shop.example/#/products')).toBeNull();
		expect(getSeedInUrl('https://shop.example/#/products?seed=')).toBeNull();
		expect(getSeedInUrl('https://shop.example/#/products?seed=482917')).toBe('482917');
	});

	it('round-trips the seed param while preserving other params', () => {
		const url = setSeedInUrl('https://shop.example/#/products?page=3', '482917');
		expect(getSeedInUrl(url)).toBe('482917');
		expect(getPageInUrl(url)).toBe(3);
	});

	it('overwrites an existing seed', () => {
		const url = setSeedInUrl('https://shop.example/#/products?seed=1', '482917');
		expect(getSeedInUrl(url)).toBe('482917');
	});
});

describe('formatPrice', () => {
	it('formats ARS without decimals for es', () => {
		expect(formatPrice(1234, 'es', 'ARS')).toBe('$1.234');
	});
	it('formats with decimals for en', () => {
		expect(formatPrice(1234, 'en', 'ARS')).toBe('$1,234.00');
	});
});

describe('search helpers', () => {
	const options = [
		{ value: 'a', label: 'Apple' },
		{ value: 'b', label: 'Banana' }
	];
	it('filters case-insensitively', () => {
		expect(filterOptions(options, 'app')).toHaveLength(1);
	});
	it('matches exact label case-insensitively', () => {
		expect(matchesOption(options, 'apple')).toBe(true);
		expect(matchesOption(options, 'cherry')).toBe(false);
	});
});

describe('options data', () => {
	it('exposes amenities and provinces', () => {
		expect(AMENITIES.length).toBeGreaterThan(0);
		expect(ARGENTINE_PROVINCES.length).toBeGreaterThan(0);
	});
});
