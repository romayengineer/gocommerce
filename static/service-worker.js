const CACHE_VERSION = 'v1';
const CACHES_TO_MANAGE = [`images-${CACHE_VERSION}`, `assets-${CACHE_VERSION}`];

// Simple logger for service worker
function swLog(message, ...args) {
	// Service workers can't access localStorage directly, so we check if debug mode was passed via message
	// For now, we'll just log to console in a consistent format
	console.log(`[Service Worker] ${message}`, ...args);
}

// Install event
self.addEventListener('install', (event) => {
	swLog('Installing...');
	self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
	swLog('Activating...');
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (!CACHES_TO_MANAGE.includes(cacheName)) {
						swLog('Deleting old cache:', cacheName);
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
						swLog('Serving from cache:', request.url);
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
							swLog('Cached:', request.url);
							return response;
						})
						.catch((error) => {
							swLog('Fetch failed, returning cached:', request.url);
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
