<script lang="ts">
	import { Collapsible } from '@ark-ui/svelte/collapsible';
	import { ChevronDown } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		isExpanded?: boolean;
		onToggle?: () => void;
		children?: Snippet;
	}

	let { label, isExpanded = false, onToggle, children }: Props = $props();

	// Mirrors the legacy CollapsibleSectionButton contract: parent-driven
	// `isExpanded` (e.g. desktop always-open) with local toggle state.
	// svelte-ignore state_referenced_locally
	let open = $state(isExpanded);

	$effect(() => {
		open = isExpanded;
	});

	function handleOpenChange(details: { open: boolean }) {
		open = details.open;
		onToggle?.();
	}
</script>

<Collapsible.Root {open} onOpenChange={handleOpenChange}>
	<Collapsible.Trigger
		class="flex w-full items-center justify-between p-3 text-sm font-semibold hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500/40 md:text-base"
	>
		<span>{label}</span>
		<ChevronDown size={18} class="ark-chevron text-gray-500" />
	</Collapsible.Trigger>
	<Collapsible.Content>
		{#if children}
			{@render children()}
		{/if}
	</Collapsible.Content>
</Collapsible.Root>
