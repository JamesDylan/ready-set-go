// Bump this string whenever you want to force-clear all cached assets.
// It's also updated automatically on each Vercel deploy via the build timestamp
// injected by next.config.ts (see swVersion comment there).
const CACHE_NAME = 'unicorn-sparkles-v3';

// Only pre-cache assets that are truly static and never change path.
// Do NOT pre-cache '/' — HTML must always be fetched fresh so new JS chunks load.
const PRECACHE_ASSETS = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/sounds/item-completed.mp3',
  '/sounds/checklist-completed.mp3',
  '/sounds/swap-effect.mp3',
];

// ── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  // Activate immediately — don't wait for existing tabs to close
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  // Take control of all open clients immediately
  self.clients.claim();
});

// ── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Navigation (HTML document) — network first, no cache fallback.
  //    This guarantees users always get fresh HTML with correct JS chunk references.
  //    If offline, Chrome shows its own offline page (better than a stale broken shell).
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request));
    return;
  }

  // 2. Next.js static chunks (/_next/static/…) — cache first, then network + store.
  //    Safe to cache aggressively: filenames include a content hash, so a cached
  //    file is always correct for that hash. New deploys generate new hashes,
  //    so stale entries are simply never requested again.
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // 3. Everything else (sounds, icons, manifest) — cache first, network fallback.
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
