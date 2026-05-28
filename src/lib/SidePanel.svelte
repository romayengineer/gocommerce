<script lang="ts">
	interface Props {
		title: string;
		sticky?: boolean;
	}

	const { title, sticky = false } = $props<Props>();
</script>

<div class={sticky ? 'h-fit' : ''}>
	<div class={`bg-white rounded-lg shadow p-6 ${sticky ? 'sticky top-4' : ''}`}>
		<h2 class="text-2xl font-bold mb-4">{title}</h2>
		<slot />
	</div>
</div>
