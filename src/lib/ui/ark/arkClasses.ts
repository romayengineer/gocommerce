/**
 * Shared Tailwind classes for Ark UI wrappers. State-driven styling
 * (highlighted / checked / open / disabled) lives in `src/app.css` via
 * Ark's `data-part` / `data-state` attributes.
 */

export const dropdownContentClasses =
	'max-h-64 overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg';

export const dropdownItemClasses =
	'ark-dropdown-item flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-gray-900 transition-colors hover:bg-primary-100 focus-visible:outline-none';

export function selectTriggerClasses(invalid = false, extra = ''): string {
	const base =
		'flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 transition-colors hover:border-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600';
	const errorCls = invalid ? 'border-red-400' : '';
	return `${base} ${errorCls}${extra ? ` ${extra}` : ''}`.trim().replace(/\s+/g, ' ');
}
