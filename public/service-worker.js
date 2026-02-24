/* eslint-disable no-restricted-globals */

// Nazwa cache - warto ją zmieniać przy dużych aktualizacjach
const CACHE_NAME = "todo-list-v1";

// Pliki do natychmiastowego zapisania w cache (opcjonalnie)
const urlsToCache = ["/", "/index.html", "/manifest.json", "/favicon.ico"];

// Instalacja Service Workera
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
  self.skipWaiting();
});

// Aktywacja i czyszczenie starych cache
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return null;
        }),
      );
    }),
  );
  self.clients.claim();
});

// Strategia: Network First, falling back to cache
// Pozwala to na świeże dane gdy jest internet, i działanie aplikacji gdy go nie ma
self.addEventListener("fetch", (event) => {
  // Pomijamy requesty do API i Cloudinary, aby nie keszować dynamicznych danych/obrazów w ten sposób
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match("/index.html");
      }),
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
