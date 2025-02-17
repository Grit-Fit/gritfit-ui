/* eslint-disable no-restricted-globals */
const CACHE_NAME = "gritfit-cache-v1";
const urlsToCache = ["/", "/index.html", "/icons/icon-192x192.png", "/icons/icon-512x512.png"];

// Install event: Cache important files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event: Serve cached content when offline
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // 🔥 Bypass cache for API requests
  if (url.origin === "https://api.gritfit.site") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});


// Activate event: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Clearing old cache:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});
