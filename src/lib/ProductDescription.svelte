<script lang="ts">
	interface Props {
		text: string;
	}

	const { text } = $props<Props>();
</script>

<p class="text-gray-700 mb-8 leading-relaxed">{text}</p>
