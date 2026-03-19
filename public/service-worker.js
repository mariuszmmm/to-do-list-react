/* eslint-disable no-restricted-globals */

/**
 * MEGA-STUB v24: Jawna rejestracja wszystkich zdarzeń na samym początku pliku.
 * Niektóre przeglądarki wymagają, aby te wywołania były statyczne i natychmiastowe.
 */
self.addEventListener("message", function(event) {
    if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
    if (event.data && event.data.type === "GET_VERSION") {
        event.source.postMessage({ type: "VERSION_INFO", version: "todo-list-v24" });
    }
});
self.addEventListener("push", function(event) {});
self.addEventListener("notificationclick", function(event) {});
self.addEventListener("notificationclose", function(event) {});
self.addEventListener("fetch", function(event) {});

// Import SDK OneSignal po zarejestrowaniu stubów
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

const CACHE_NAME = "todo-list-v24";

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
      );
    }),
  );
  self.clients.claim();
});

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
  if (
    url.pathname.startsWith("/.netlify/") ||
    apiRoutes.includes(url.pathname) ||
    url.hostname !== self.location.hostname
  )
    return;

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
          .catch(() => {
            if (event.request.mode === "navigate")
              return cache.match("/index.html");
            return cachedResponse;
          });
        return cachedResponse || fetchPromise;
      });
    }),
  );
});
