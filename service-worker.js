const CACHE_NAME = "memoria-cache-v1";
const urlsToCache = [
  "/jogo-da-memoria/",
  "/jogo-da-memoria/index.html",
  "/jogo-da-memoria/style.css",
  "/jogo-da-memoria/script.js",
  "/jogo-da-memoria/manifest.json",
  "https://i.imgur.com/xDZQ5dH.jpg",
  "https://i.imgur.com/9Pet8B3.jpg",
  "https://i.imgur.com/PDUWW9q.jpg",
  "https://i.imgur.com/pO3bFOn.jpg",
  "https://i.imgur.com/bwNt2Uv.jpg",
  "https://i.imgur.com/EYe3bmY.jpg",
  "https://i.imgur.com/OdzIlpf.jpg",
  "https://i.imgur.com/Qj50kbC.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
