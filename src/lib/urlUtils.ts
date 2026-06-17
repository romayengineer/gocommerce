export function updatePageInUrl(url: string, page: number): string {
	let hashIndex = url.indexOf('#');
	if (hashIndex < 0) {
		url = `${url}#/`
	}
	hashIndex = url.indexOf('#');

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
	}

	return 1;
}
