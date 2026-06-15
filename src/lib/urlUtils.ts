export function updatePageInUrl(url: string, page: number): string {
	const hashIndex = url.indexOf('#');

	if (hashIndex > -1) {
		const beforeHash = url.substring(0, hashIndex);
		const hash = url.substring(hashIndex);
		const queryIndex = hash.indexOf('?');

		if (queryIndex > -1) {
			const hashPath = hash.substring(0, queryIndex);
			const queryString = hash.substring(queryIndex + 1);
			const params = new URLSearchParams(queryString);
			params.set('page', String(page));
			return beforeHash + hashPath + '?' + params.toString();
		} else {
			return beforeHash + hash + '?page=' + page;
		}
	} else {
		const urlObj = new URL(url);
		urlObj.searchParams.set('page', String(page));
		return urlObj.toString();
	}
}

export function getPageInUrl(url: string): number {
	const hashIndex = url.indexOf('#');

	if (hashIndex > -1) {
		const hash = url.substring(hashIndex);
		const queryIndex = hash.indexOf('?');
		if (queryIndex > -1) {
			const queryString = hash.substring(queryIndex + 1);
			const params = new URLSearchParams(queryString);
			const page = params.get('page');
			return page ? parseInt(page) : 1;
		}
		return 1;
	} else {
		const urlObj = new URL(url);
		const page = urlObj.searchParams.get('page');
		return page ? parseInt(page) : 1;
	}
}
