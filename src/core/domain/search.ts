export interface SearchOption {
	value: string;
	label: string;
}

export function filterOptions<T extends SearchOption>(options: T[], query: string): T[] {
	const normalized = query.toLowerCase();
	return options.filter((option) => option.label.toLowerCase().includes(normalized));
}
