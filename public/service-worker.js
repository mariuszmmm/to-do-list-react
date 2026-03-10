/* eslint-disable no-restricted-globals */

// Nazwa cache - warto ją zmieniać przy dużych aktualizacjach
const CACHE_NAME = "todo-list-v17";

// Pliki do natychmiastowego zapisania w cache przy instalacji SW
const urlsToCache = [
  "/",
  "/index.html",
  "/site.webmanifest",
  "/favicon.ico",
  "/favicon-96x96.png",
  "/favicon.svg",
  "/apple-touch-icon.png",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
  "/screenshots/desktop.png",
  "/screenshots/mobile.png",
];

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data && event.data.type === "GET_VERSION") {
    event.source.postMessage({
      type: "VERSION_INFO",
      version: CACHE_NAME,
    });
  }
});

// Instalacja Service Workera
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
  // UWAGA: Usunięto tu self.skipWaiting(), aby umożliwić pokazanie powiadomienia
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

// Strategia: Cache First + dynamiczne cachowanie wszystkich zasobów statycznych
// Pliki JS/CSS React są automatycznie cachowane przy pierwszej wizycie z internetem.
// Przy kolejnych wejściach (nawet offline) aplikacja ładuje się z cache.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  const apiRoutes = [
    "/data",
    "/image",
    "/translate",
    "/get-system-status",
    "/cleanup-orphan-images",
    "/diagnose-system",
    "/resetPassword",
  ];

  // Pomijamy requesty do API (Netlify functions), zewnętrznych serwisów oraz dynamicznych tras
  if (
    url.pathname.startsWith("/.netlify/") ||
    url.pathname.startsWith("/auth-") ||
    url.pathname.startsWith("/backup-") ||
    url.pathname.startsWith("/user-") ||
    url.pathname.startsWith("/test-") ||
    apiRoutes.includes(url.pathname) ||
    url.hostname !== self.location.hostname
  ) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Cachuj udane odpowiedzi GET (pliki JS, CSS, obrazki itp.)
            if (
              event.request.method === "GET" &&
              networkResponse.status === 200
            ) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            // Sieć niedostępna – dla nawigacji fallback do index.html
            if (event.request.mode === "navigate") {
              return cache.match("/index.html");
            }
            // Dla zasobów statycznych – zwróć to co jest w cache (lub nic)
            return cachedResponse;
          });

        // Zwróć cache od razu (nie czekamy na sieć) – szybszy start offline
        return cachedResponse || fetchPromise;
      });
    }),
  );
});
