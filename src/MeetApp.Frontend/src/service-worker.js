self.__WB_MANIFEST = [];

self.addEventListener('install', (event) => {
    // Skip waiting to take control immediately
  self.skipWaiting();
});
  
self.addEventListener('activate', (event) => {
  // Clients claim immediately to take control of the page
  event.waitUntil(self.clients.claim());
});
  
self.addEventListener('fetch', (event) => {
  // Don't intercept or cache any requests
  event.respondWith(fetch(event.request));
});