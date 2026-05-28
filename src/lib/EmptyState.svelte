<script lang="ts">

	const { message, actionHref, actionLabel } = $props<{
		message: string;
		actionHref?: string;
		actionLabel?: string;
	}>();
</script>

<div class="bg-white rounded-lg p-12 text-center">
	<p class="text-xl text-gray-600 mb-6">{message}</p>
	{#if actionHref && actionLabel}
		<a href={actionHref} class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block">
			{actionLabel}
		</a>
	{/if}
</div>
