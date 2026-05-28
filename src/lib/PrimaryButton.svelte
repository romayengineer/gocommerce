<script lang="ts">
	interface Props {
		href?: string;
		onclick?: (e: MouseEvent) => void;
		class?: string;
	}

	const { href, onclick, class: className } = $props<Props>();
	const isLink = !!href;
</script>

{#if isLink}
	<a
		{href}
		class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block {className || ''}"
	>
		<slot />
	</a>
{:else}
	<button
		{onclick}
		class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors {className || ''}"
	>
		<slot />
	</button>
{/if}
