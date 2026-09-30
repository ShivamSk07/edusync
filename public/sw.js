// EdSync Advanced Offline-First Service Worker
const CACHE_VERSION = "edsync-v2.0";
const RUNTIME_CACHE = "edsync-runtime-v2.0";
const FONTS_CACHE = "edsync-fonts-v2.0";

const PRECACHE_URLS = [
  "/",
  "/auth",
  "/onboarding",
  "/dashboard",
  "/study",
  "/ai-study-buddy",
  "/resources",
  "/opportunities",
  "/career",
  "/mentorship",
  "/progress",
  "/profile",
  "/favicon.png",
];

// Install: Cache critical routes immediately
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn("[EdSync SW] Precache error:", err)),
  );
});

// Activate: Clean old caches and claim clients immediately
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_VERSION && key !== RUNTIME_CACHE && key !== FONTS_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Fetch: Strategy based on request type
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Google Fonts caching
  if (url.origin === "https://fonts.googleapis.com" || url.origin === "https://fonts.gstatic.com") {
    event.respondWith(
      caches.open(FONTS_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;

        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          return cached || new Response("", { status: 503 });
        }
      }),
    );
    return;
  }

  // Navigation (HTML Pages): Network first, falling back to cache
  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          const fallback = await caches.match("/dashboard");
          return fallback || (await caches.match("/"));
        }),
    );
    return;
  }

  // Static Assets (JS, CSS, Images, Icons): Stale while revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const copy = networkResponse.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    }),
  );
});