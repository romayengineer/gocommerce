export function updatePageInUrl(url: string, page: number): string {
	let hashIndex = url.indexOf('#');
	if (hashIndex < 0) {
		url = `${url}#/`;
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
	}
	return beforeHash + hash + '?page=' + page;
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
	}
	return 1;
}

function hashQuery(url: string): { beforeHash: string; hashPath: string; params: URLSearchParams } {
	let hashIndex = url.indexOf('#');
	if (hashIndex < 0) {
		url = `${url}#/`;
	}
	hashIndex = url.indexOf('#');

	const beforeHash = url.substring(0, hashIndex);
	const hash = url.substring(hashIndex);
	const queryIndex = hash.indexOf('?');
	const hashPath = queryIndex > -1 ? hash.substring(0, queryIndex) : hash;
	const params = new URLSearchParams(queryIndex > -1 ? hash.substring(queryIndex + 1) : '');
	return { beforeHash, hashPath, params };
}

/**
 * Read the product-order seed from the hash query (`#/...?seed=...`).
 * Empty or missing values mean "no seed" (callers generate one instead).
 */
export function getSeedInUrl(url: string): string | null {
	const { params } = hashQuery(url);
	const seed = params.get('seed');
	return seed ? seed : null;
}

/** Set the product-order seed in the hash query, preserving other params. */
export function setSeedInUrl(url: string, seed: string): string {
	const { beforeHash, hashPath, params } = hashQuery(url);
	params.set('seed', seed);
	return `${beforeHash}${hashPath}?${params.toString()}`;
}
