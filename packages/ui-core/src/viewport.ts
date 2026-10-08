export const DEFAULT_COLUMN_WIDTH = 300;
export const MIN_COLUMNS = 2;
export const MAX_COLUMNS = 5;

export function columnsForWidth(
	width: number,
	columnWidth: number = DEFAULT_COLUMN_WIDTH,
	min: number = MIN_COLUMNS,
	max: number = MAX_COLUMNS
): number {
	return Math.max(min, Math.min(max, Math.round(width / columnWidth)));
}
