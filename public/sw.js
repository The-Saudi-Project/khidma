// ─────────────────────────────────────────────────────────────────────────────
// FILE: sw.js
// PURPOSE: Service Worker for Khidma PWA
// STRATEGY: Cache-First with Network Fallback for static assets.
// EXPLANATION:
//   This service worker allows the web app to load instantly from cache,
//   providing a native app feel. If an asset isn't in the cache, it fetches
//   it from the network and caches it for future use.
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_NAME = 'khidma-app-shell-v2';

// The core assets needed to show the basic UI (App Shell)
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  // Note: Vite generates dynamic filenames for JS/CSS in production.
  // A complete offline experience would inject those hashed filenames here
  // during the build step (e.g., using workbox or a vite PWA plugin).
  // For this pure implementation, we cache the entry points.
];

// ─────────────────────────────────────────────────────────────────────────────
// EVENT: install
// PURPOSE: Pre-cache the App Shell when the Service Worker is first installed.
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install Event Triggered');
  // Extend the install event until the cache is fully populated
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page and app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// ─────────────────────────────────────────────────────────────────────────────
// EVENT: activate
// PURPOSE: Clean up old caches when a new Service Worker takes over.
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate Event Triggered');
  // Extend the activate event until old caches are deleted
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Ensure the Service Worker takes control of all clients immediately
  return self.clients.claim();
});

// ─────────────────────────────────────────────────────────────────────────────
// EVENT: fetch
// PURPOSE: Intercept network requests and apply the Cache-First strategy.
// ─────────────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests, like those to external APIs (e.g., backend)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip API requests (they should always hit the network)
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. Cache hit - return the cached response immediately
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. Cache miss - fetch from network
      return fetch(event.request).then((networkResponse) => {
        // Don't cache non-successful responses or non-basic responses
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Clone the response because it's a stream and can only be consumed once
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          // 3. Store the newly fetched response in the cache
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch((error) => {
        // Fallback for offline users if network request fails
        console.error('[ServiceWorker] Fetch failed; returning offline page instead.', error);
        // If we had a specific offline.html, we could return it here:
        // return caches.match('/offline.html');
      });
    })
  );
});
