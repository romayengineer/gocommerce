<script lang="ts">
	import { locale } from 'svelte-i18n';
	import { locales, localeNames, localeFlags, setLocale, defaultLocale } from './i18n';

	function handleLanguageChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const newLocale = target.value;
		locale.set(newLocale);
		setLocale(newLocale);
	}
</script>

<select
	value={$locale ?? defaultLocale}
	onchange={handleLanguageChange}
	class="px-2 py-2 border border-gray-300 rounded bg-white text-2xl cursor-pointer hover:border-blue-400 focus:outline-none focus:border-blue-600"
	title={localeNames[$locale ?? defaultLocale]}
>
	{#each locales as lang}
		<option value={lang}>
			{localeFlags[lang]}
		</option>
	{/each}
</select>
