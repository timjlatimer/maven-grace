// Maven Grace Service Worker — Push Notifications
// This file lives in client/public/ and is served at the root

const CACHE_NAME = "maven-grace-v1";

// Install event — cache essential assets
self.addEventListener("install", (event) => {
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
