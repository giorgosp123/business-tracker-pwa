const CACHE_NAME = "dashboard-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/service-worker.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"
];

// Εγκατάσταση: κάνε cache τα αρχεία
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      if (event.request.mode === "navigate") {
        return caches.match("/index.html");
      }
      return caches.match(event.request);
    })
  );
});

// Ενεργοποίηση: καθάρισε παλιά cache αν υπάρχουν
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});

// Fetch: αν είμαστε offline, φέρνει τα αρχεία από cache
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(response => response || caches.match("/index.html"))
    )
  );
});
