<script lang="ts">
	import { locale } from 'svelte-i18n';
	import { locales, localeNames, localeFlags, setLocale } from './i18n';

	function handleLanguageChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const newLocale = target.value;
		locale.set(newLocale);
		setLocale(newLocale);
	}
</script>

<select
	value={$locale}
	onchange={handleLanguageChange}
	class="px-3 py-2 border border-gray-300 rounded bg-white text-gray-700 cursor-pointer hover:border-blue-400 focus:outline-none focus:border-blue-600"
>
	{#each locales as lang}
		<option value={lang}>
			{localeFlags[lang]} {localeNames[lang]}
		</option>
	{/each}
</select>
