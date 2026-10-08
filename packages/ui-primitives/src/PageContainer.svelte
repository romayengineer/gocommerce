<script lang="ts">
	import { config } from '@gocommerce/composition/view/app';

	interface Props {
		class?: string;
		maxWidth?: string;
		children?: import('svelte').Snippet;
	}

	const { class: className, maxWidth = config.view.pageWidth, children }: Props = $props();
</script>

<div class="page-container {className || ''}" style="--width-page: {maxWidth}">
	{#if children}
		{@render children()}
	{/if}
</div>
