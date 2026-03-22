// Maven Grace Service Worker — Push Notifications + Offline Resilience
// This file lives in client/public/ and is served at the root

const CACHE_NAME = "maven-grace-v2";
const OFFLINE_URL = "/offline.html";

// Core routes to cache for offline access
const PRECACHE_URLS = [
  "/",
  "/offline.html",
  "/favicon.ico",
];

// Install event — cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(() => {
        // Gracefully handle if some URLs fail to cache
        console.log("[SW] Some precache URLs failed, continuing...");
      });
    })
  );
  self.skipWaiting();
});

// Activate event — clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch event — network-first with cache fallback
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Skip API calls — they should fail naturally
  const url = new URL(event.request.url);
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for navigation requests
        if (response.ok && event.request.mode === "navigate") {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(async () => {
        // Network failed — try cache
        const cached = await caches.match(event.request);
        if (cached) return cached;

        // For navigation requests, show offline page
        if (event.request.mode === "navigate") {
          const offlinePage = await caches.match(OFFLINE_URL);
          if (offlinePage) return offlinePage;
        }

        // Return a basic offline response
        return new Response("Grace is reconnecting...", {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "text/plain" },
        });
      })
  );
});

// Push event — show notification from Grace
self.addEventListener("push", (event) => {
  let data = { title: "Grace", body: "I'm here.", icon: "/favicon.ico", tag: "grace-push" };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/favicon.ico",
    badge: "/favicon.ico",
    tag: data.tag || "grace-push",
    vibrate: [100, 200, 100], // gentle_love haptic
    data: {
      url: data.url || "/grace",
    },
    actions: [
      { action: "open", title: "Talk to Grace" },
      { action: "dismiss", title: "Later" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click — open the app
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/grace";

  if (event.action === "dismiss") return;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      // Focus existing window if available
      for (const client of clients) {
        if (client.url.includes(self.location.origin)) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      // Open new window
      return self.clients.openWindow(url);
    })
  );
});
