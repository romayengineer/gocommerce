<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		isExpanded?: boolean;
		onToggle?: () => void;
		children?: Snippet;
	}

	const { label, isExpanded, onToggle, children}: Props = $props();

	let isOpen = $derived(isExpanded);

	function toggleSection() {
		isOpen = !isOpen;
		onToggle?.();
	}
</script>

<div>
	<button
		onclick={toggleSection}
		class="w-full flex items-center justify-between p-3 text-sm font-semibold hover:bg-gray-50"
	>
		<span>{label}</span>
		<span class={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
	</button>
	{#if isOpen && children}
		{@render children()}
	{/if}
</div>
