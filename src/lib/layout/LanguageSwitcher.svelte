<script lang="ts">
	import { locale, t } from 'svelte-i18n';
	import ArkSelect from '$lib/ui/ark/ArkSelect.svelte';
	import { locales, localeNames, localeFlags, setLocale, defaultLocale } from '$adapters/svelte/i18n';

	const current = $derived($locale ?? defaultLocale);

	const languageOptions = $derived(
		locales.map((lang) => ({ value: lang, label: `${localeFlags[lang]} ${localeNames[lang]}` }))
	);

	function handleLanguageChange(value: string) {
		locale.set(value);
		setLocale(value);
	}
</script>

<label class="flex items-center">
	<span class="sr-only">{$t('header.language')}</span>
	<ArkSelect
		options={languageOptions}
		value={current}
		ariaLabel={localeNames[current]}
		onchange={handleLanguageChange}
		class="w-auto px-2 py-1.5 text-base"
	/>
</label>
