<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		isExpanded?: boolean;
		onToggle?: () => void;
		children?: Snippet;
	}

	const { label, isExpanded = false, onToggle, children }: Props = $props();

	// svelte-ignore state_referenced_locally
	let isOpen = $state(isExpanded);

	$effect(() => {
		isOpen = isExpanded;
	});

	function toggleSection() {
		isOpen = !isOpen;
		onToggle?.();
	}
</script>

<div>
	<button
		type="button"
		onclick={toggleSection}
		aria-expanded={isOpen}
		class="flex w-full items-center justify-between p-3 text-sm font-semibold hover:bg-gray-50 md:text-base"
	>
		<span>{label}</span>
		<ChevronDown size={18} class={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
	</button>
	{#if isOpen && children}
		{@render children()}
	{/if}
</div>
