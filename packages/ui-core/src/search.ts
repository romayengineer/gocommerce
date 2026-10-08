export interface SearchOption {
	value: string;
	label: string;
}

/**
 * Presentation search helpers owned by ui-core.
 * (Canonical copy moved from @gocommerce/domain/search; that export is
 * deprecated — prefer this module.)
 */
export function filterOptions<T extends SearchOption>(options: T[], query: string): T[] {
	const normalized = query.toLowerCase();
	return options.filter((option) => option.label.toLowerCase().includes(normalized));
}

export function matchesOption(options: SearchOption[], value: string | undefined): boolean {
	if (!value) return false;
	return options.some((option) => option.label.toLowerCase() === value.toLowerCase());
}
