/**
 * Shared view variants — single source of truth for Button / Link-as-button,
 * inputs, icon buttons and selectable chips.
 *
 * Keeps Tailwind classes consistent (radius, padding, focus ring, disabled)
 * while staying configurable via CSS vars defined in `src/app.css` + `tailwind.config.js`.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'contrast';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type LinkVariant = 'primary' | 'secondary' | 'muted';
export type InputState = 'default' | 'disabled' | 'error';

const baseButton =
	'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:cursor-not-allowed disabled:opacity-50';

const buttonVariants: Record<ButtonVariant, string> = {
	primary: 'bg-primary-600 text-white hover:bg-primary-700',
	secondary: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
	danger: 'bg-red-600 text-white hover:bg-red-700',
	contrast: 'bg-white text-primary-600 hover:bg-gray-100'
};

const buttonSizes: Record<ButtonSize, string> = {
	sm: 'px-3 py-1.5 text-sm',
	md: 'px-4 py-2 text-sm',
	lg: 'px-6 py-3 text-base'
};

export function buttonClasses(
	variant: ButtonVariant = 'primary',
	size: ButtonSize = 'md',
	extra = ''
): string {
	return `${baseButton} ${buttonVariants[variant]} ${buttonSizes[size]}${extra ? ` ${extra}` : ''}`;
}

const linkVariants: Record<LinkVariant, string> = {
	primary: 'text-primary-600 hover:text-primary-700',
	secondary: 'text-gray-700 hover:text-primary-600',
	muted: 'text-gray-600 hover:text-gray-700'
};

export function linkClasses(variant: LinkVariant = 'primary', extra = ''): string {
	return `transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 rounded-sm ${linkVariants[variant]}${extra ? ` ${extra}` : ''}`;
}

export function inputClasses(state: InputState = 'default', extra = ''): string {
	const base =
		'w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600';
	const errorCls = state === 'error' ? 'border-red-400 focus:ring-red-400' : '';
	const disabledCls = state === 'disabled' ? 'cursor-not-allowed bg-gray-100 text-gray-600' : '';
	return `${base} ${errorCls} ${disabledCls}${extra ? ` ${extra}` : ''}`.trim().replace(/\s+/g, ' ');
}

export function iconButtonClasses(extra = ''): string {
	return `flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:cursor-not-allowed disabled:opacity-50${extra ? ` ${extra}` : ''}`;
}

export function chipClasses(selected: boolean, extra = ''): string {
	const base =
		'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40';
	const state = selected ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300';
	return `${base} ${state}${extra ? ` ${extra}` : ''}`;
}

export function quantityInputClasses(extra = ''): string {
	return `h-8 w-12 border-y border-gray-300 bg-white text-center text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none${extra ? ` ${extra}` : ''}`;
}
