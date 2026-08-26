// IPOCraft Service Worker v1
const CACHE_NAME = "ipocraft-shell-v1";
const SHELL_URLS = ["/", "/gmp", "/ipo", "/chat", "/manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  // Cache-first for shell, network-first for API/data
  const { request } = e;
  if (request.url.includes("/api/") || request.url.includes("supabase")) {
    // Network-first for dynamic data
    e.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }
  if (request.method === "GET") {
    e.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(res => {
        if (res.ok && request.url.startsWith(self.location.origin)) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
        }
        return res;
      }))
    );
  }
});

// Push notification handler
self.addEventListener("push", (e) => {
  const data = e.data?.json() || { title: "IPOCraft", body: "New IPO update available." };
  e.waitUntil(
    self.registration.showNotification(data.title || "IPOCraft GMP Alert", {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: "ipocraft-gmp",
      data: { url: data.url || "/gmp" },
    })
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification.data?.url || "/gmp";
  e.waitUntil(clients.openWindow(url));
});
