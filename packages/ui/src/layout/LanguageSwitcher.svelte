<script lang="ts">
	import { locale, t } from 'svelte-i18n';
	import { locales, localeNames, localeFlags, setLocale, defaultLocale } from '@gocommerce/composition/view';

	function handleLanguageChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const newLocale = target.value;
		locale.set(newLocale);
		setLocale(newLocale);
	}

	const current = $derived($locale ?? defaultLocale);
</script>

<label class="flex items-center">
	<span class="sr-only">{$t('header.language')}</span>
	<select
		value={current}
		onchange={handleLanguageChange}
		class="cursor-pointer rounded border border-gray-300 bg-white px-2 py-1.5 text-base hover:border-primary-400 focus:border-primary-600 focus:outline-none"
		title={localeNames[current]}
	>
		{#each locales as lang}
			<option value={lang}>
				{localeFlags[lang]} {localeNames[lang]}
			</option>
		{/each}
	</select>
</label>
