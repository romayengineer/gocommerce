<script lang="ts">
	interface Props {
		label: string;
		isExpanded: boolean;
		onToggle: () => void;
	}

	const { label, isExpanded, onToggle }: Props = $props();
</script>

<button
	onclick={onToggle}
	class="w-full flex items-center justify-between p-3 text-sm font-semibold hover:bg-gray-50"
>
	<span>{label}</span>
	<span class={`text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
</button>
