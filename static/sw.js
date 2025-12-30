const CACHE_NAME = "learning-journal-v1";
const OFFLINE_URL = "/offline";

const ASSETS_TO_CACHE = [
  "/", // home
  "/journal",
  "/about",
  "/projects",
  "/static/manifest.json",
  "/static/css/style.css",
  "/static/js/script.js",
  "/static/js/journal_api.js",
  "/static/images/icon-192.png",
  "/static/images/icon-512.png",
  OFFLINE_URL,
];

// Install: cache app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null))
        )
      )
  );
  self.clients.claim();
});

// Fetch strategy:
// - HTML pages: network-first (fresh pages), fallback to cache, then offline page
// - Static assets: cache-first
// - API (/reflections): network-first, fallback to cached API response
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin
  if (url.origin !== location.origin) return;

  // API caching (dynamic data)
  if (url.pathname === "/reflections") {
    event.respondWith(networkFirst(req));
    return;
  }

  // HTML pages
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          return cached || caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // Static assets: cache-first
  event.respondWith(cacheFirst(req));
});

async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  const res = await fetch(req);
  const cache = await caches.open(CACHE_NAME);
  cache.put(req, res.clone());
  return res;
}

async function networkFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (e) {
    const cached = await cache.match(req);
    return (
      cached ||
      new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json" },
      })
    );
  }
}
