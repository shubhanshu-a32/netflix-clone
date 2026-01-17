const CACHE_NAME = 'netflix-clone-v1';
const API_CACHE_NAME = 'netflix-api-cache-v1';

const API_BASE = 'https://api.imdbapi.dev';

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Caching app shell');
            return cache.addAll([
                '/',
                '/index.html'
            ]);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (request.method !== 'GET') {
        return;
    }

    if (url.origin === API_BASE || url.href.includes('imdbapi.dev')) {
        event.respondWith(
            caches.open(API_CACHE_NAME).then((cache) => {
                return cache.match(request).then((cachedResponse) => {
                    if (cachedResponse) {
                        console.log('[Service Worker] Returning cached API response for:', url.pathname);

                        fetch(request)
                            .then((response) => {
                                if (response && response.status === 200) {
                                    cache.put(request, response.clone());
                                    console.log('[Service Worker] Updated cache for:', url.pathname);
                                }
                            })
                            .catch(() => { });

                        return cachedResponse;
                    }

                    return fetch(request)
                        .then((response) => {
                            if (response && response.status === 200) {
                                cache.put(request, response.clone());
                                console.log('[Service Worker] Cached new API response for:', url.pathname);
                            }
                            return response;
                        })
                        .catch((error) => {
                            console.error('[Service Worker] Fetch failed, no cache available:', error);
                            return new Response(
                                JSON.stringify({
                                    titles: [],
                                    offline: true,
                                    message: 'No cached data available'
                                }),
                                {
                                    headers: { 'Content-Type': 'application/json' }
                                }
                            );
                        });
                });
            })
        );
        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, response.clone());
                    return response;
                });
            })
            .catch(() => {
                return caches.match(request);
            })
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
