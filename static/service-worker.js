const CACHE_VERSION = 'v1';
const CACHES_TO_MANAGE = [`images-${CACHE_VERSION}`, `assets-${CACHE_VERSION}`];

// Install event
self.addEventListener('install', (event) => {
	console.log('[Service Worker] Installing...');
	self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
	console.log('[Service Worker] Activating...');
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (!CACHES_TO_MANAGE.includes(cacheName)) {
						console.log('[Service Worker] Deleting old cache:', cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
	self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Only cache GET requests
	if (request.method !== 'GET') {
		return;
	}

	// Cache images (including external CDN images)
	if (
		request.destination === 'image' ||
		url.hostname.includes('vtexassets.com') ||
		url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)
	) {
		event.respondWith(
			caches.open(`images-${CACHE_VERSION}`).then((cache) => {
				return cache.match(request).then((cachedResponse) => {
					// Return from cache if available
					if (cachedResponse) {
						console.log('[Service Worker] Serving from cache:', request.url);
						return cachedResponse;
					}

					// Otherwise, fetch from network
					return fetch(request)
						.then((response) => {
							// Only cache successful responses
							if (!response || response.status !== 200 || response.type === 'error') {
								return response;
							}

							// Clone and cache the response
							const responseToCache = response.clone();
							cache.put(request, responseToCache);
							console.log('[Service Worker] Cached:', request.url);
							return response;
						})
						.catch((error) => {
							console.log('[Service Worker] Fetch failed, returning cached:', request.url);
							// Try to return cached version even if stale
							return cache.match(request);
						});
				});
			})
		);
		return;
	}

	// For all other GET requests, use network-first strategy
	event.respondWith(
		fetch(request)
			.then((response) => {
				if (!response || response.status !== 200) {
					return response;
				}

				// Cache successful responses
				const responseClone = response.clone();
				caches.open(`assets-${CACHE_VERSION}`).then((cache) => {
					cache.put(request, responseClone);
				});

				return response;
			})
			.catch(() => {
				// Return cached version if offline
				return caches.match(request).then((cachedResponse) => {
					return cachedResponse || new Response('Offline - Resource not cached', { status: 503 });
				});
			})
	);
});
