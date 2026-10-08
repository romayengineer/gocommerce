export const DEFAULT_COLUMN_WIDTH = 300;
export const MIN_COLUMNS = 2;
export const MAX_COLUMNS = 5;

// Implements ColumnsForWidthFn (owned by @gocommerce/ports/Platform) by
// structural match: ui-core stays dependency-free and imports no workspace
// types (see scripts/check-boundaries.ts rule 4c).
export function columnsForWidth(
	width: number,
	columnWidth: number = DEFAULT_COLUMN_WIDTH,
	min: number = MIN_COLUMNS,
	max: number = MAX_COLUMNS
): number {
	return Math.max(min, Math.min(max, Math.round(width / columnWidth)));
}
