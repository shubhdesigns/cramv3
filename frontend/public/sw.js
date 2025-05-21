/* global workbox */
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';

// Precache shell; will be replaced by your Astro's build manifest
precacheAndRoute(self.__WB_MANIFEST || []);

// Static site navigation/pages — cache first, fallback to network
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages-cache',
    plugins: [],
  })
);

// Assets (CSS, JS, Fonts, Images)
registerRoute(
  ({ request }) =>
    ['style', 'script', 'worker', 'image', 'font'].includes(request.destination),
  new StaleWhileRevalidate({
    cacheName: 'assets-cache',
  })
);

// Fallback to offline.html if all else fails (optional)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match('/offline.html'));
    })
  );
});

// Required for Astro PWA: register this in your entry/root (e.g. main.tsx)
// if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js')); }