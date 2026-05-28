<script lang="ts">
	import { locale } from 'svelte-i18n';
	import { locales, localeNames, setLocale } from './i18n';
	import Button from './Button.svelte';

	function handleLanguageChange(newLocale: string) {
		locale.set(newLocale);
		setLocale(newLocale);
	}
</script>

<div class="flex gap-2">
	{#each locales as lang}
		<Button
			variant={$locale === lang ? 'primary' : 'secondary'}
			class="px-3 py-1 text-sm"
			onclick={() => handleLanguageChange(lang)}
		>
			{localeNames[lang]}
		</Button>
	{/each}
</div>
