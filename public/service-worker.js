/* global importScripts */
/* eslint-disable no-restricted-globals */

/**
 * MEGA-STUB v0_DEV: Jawna rejestracja wszystkich zdarzeń na samym początku pliku.
 * Niektóre przeglądarki wymagają, aby te wywołania były statyczne i natychmiastowe.
 */
self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
  if (event.data && event.data.type === "GET_VERSION") {
    const payload = {
      type: "VERSION_INFO",
      version: "todo-list-v0_DEV",
    };
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage(payload);
    } else if (event.source) {
      event.source.postMessage(payload);
    }
  }
});
self.addEventListener("push", function () {});
self.addEventListener("notificationclick", function () {});
self.addEventListener("notificationclose", function () {});
self.addEventListener("fetch", function () {});

// Import SDK OneSignal po zarejestrowaniu stubów
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

const CACHE_NAME = "todo-list-v0_DEV";

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
  "/logo-256x256.png",
  "/notification-badge.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

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
      ).then(() => self.clients.claim());
    }),
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const apiRoutes = [
    "/data-lists",
    "/image-cloudinary",
    "/service-translate",
    "/system-status",
    "/system-diagnose",
    "/cleanup-orphan-images",
    "/cleanup-temp-images",
    "/cleanup-logs",
    "/cleanup-deleted-tasks",
    "/resetPassword",
  ];

  // Ignoruj API, Netlify i zewnętrzne domeny (np. OneSignal, Google Fonts)
  if (
    url.pathname.startsWith("/.netlify/") ||
    apiRoutes.includes(url.pathname) ||
    url.hostname !== self.location.hostname ||
    url.pathname.includes("service-worker.js") ||
    url.pathname.includes("OneSignalSDK")
  )
    return;

  // STRATEGIA: Network-First dla nawigacji (index.html)
  // Gwarantuje, że po odświeżeniu użytkownik dostanie najnowszy kod, jeśli jest online.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const cacheCopy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, cacheCopy);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline: zwróć z cache
          return caches.match("/index.html") || caches.match("/");
        }),
    );
    return;
  }

  // STRATEGIA: Stale-While-Revalidate dla pozostałych zasobów (JS, CSS, obrazy)
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (
              event.request.method === "GET" &&
              networkResponse.status === 200
            ) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse); // Jeśli błąd sieci, wróć do cache

        return cachedResponse || fetchPromise;
      });
    }),
  );
});
