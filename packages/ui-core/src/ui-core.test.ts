import { describe, it, expect } from 'vitest';
import { columnsForWidth, DEFAULT_COLUMN_WIDTH, MIN_COLUMNS, MAX_COLUMNS } from './viewport';
import { computeGridLayout, pageFromScrollHeight, DEFAULT_GRID_CONFIG } from './grid';
import { updatePageInUrl, getPageInUrl } from './url';

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
