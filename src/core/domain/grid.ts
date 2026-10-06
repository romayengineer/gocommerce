export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

export interface GridConfig {
	minCardHeight: number;
	maxCardHeight: number;
	fixRatio: number;
	gap: number;
	rowsPerPage: number;
	pageBuffer: number;
}

export const DEFAULT_GRID_CONFIG: GridConfig = {
	minCardHeight: 600,
	maxCardHeight: 600 * 1.2,
	fixRatio: 2,
	gap: 8,
	rowsPerPage: 1,
	pageBuffer: 4
};

export interface GridLayout<T> {
	height: number;
	topPadding: number;
	cardHeight: number;
	columns: number;
	products: T[];
}

export function sliceProducts<T>(products: T[], currentPage: number, itemsPerPage: number, pageBuffer: number): T[] {
	const startIndex = Math.max(0, (currentPage - 1 - pageBuffer) * itemsPerPage);
	const endIndex = Math.min(products.length, (currentPage + 2 + pageBuffer) * itemsPerPage);
	return products.slice(startIndex, endIndex);
}

export function pageFromScrollHeight(scrollHeight: number, cardHeight: number, gap: number): number {
	return 1 + Math.max(0, Math.floor(scrollHeight / (cardHeight + gap)));
}

export function computeGridLayout<T>(
	products: T[],
	width: number,
	columns: number,
	currentPage: number,
	config: GridConfig
): GridLayout<T> {
	const { minCardHeight, maxCardHeight, fixRatio, gap, rowsPerPage, pageBuffer } = config;
	const itemsPerPage = columns * rowsPerPage;
	const maxPage = Math.ceil(products.length / itemsPerPage);
	// height of ProductCard in px units
	const productCardHeight = clamp(
		fixRatio * (width / columns),
		minCardHeight,
		maxCardHeight
	);
	const pageHeight = (productCardHeight + gap) * rowsPerPage;
	const maxHeight = maxPage * pageHeight;
	const topPadding = Math.min(maxHeight, Math.max(0, currentPage - 1 - pageBuffer) * pageHeight);

	return {
		height: Math.round(maxHeight),
		topPadding: Math.round(topPadding),
		cardHeight: Math.round(productCardHeight),
		columns,
		products: sliceProducts(products, currentPage, itemsPerPage, pageBuffer)
	};
}
