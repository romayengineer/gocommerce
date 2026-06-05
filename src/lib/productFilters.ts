export interface ProductFiltersProps {
	sortBy: string;
	filterCategory: string;
	searchQuery: string;
	categories: string[];
	onSortChange: (value: string) => void;
	onCategoryChange: (value: string) => void;
	onSearchChange: (value: string) => void;
}

export interface CategorizedItems {
	sizes: string[];
	others: string[];
}

export function categorizeItems(items: string[]): CategorizedItems {
	const sizes: string[] = [];
	const others: string[] = [];

	for (const item of items) {
		const parts = item.trim().split(/\s+/);
		const isSize = parts.length === 2 && !isNaN(Number(parts[0])) && parts[1].toUpperCase() === 'ML';

		if (isSize) {
			sizes.push(item);
		} else {
			const pathParts = item.split('/').filter((part) => part !== '');
			const categoryName = pathParts.length > 0 ? pathParts[pathParts.length - 1] : item;
			others.push(categoryName);
		}
	}

	sizes.sort((a, b) => {
		const aNum = Number(a.split(/\s+/)[0]);
		const bNum = Number(b.split(/\s+/)[0]);
		return aNum - bNum;
	});

	return { sizes, others };
}
