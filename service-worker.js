// Service Worker for Magnetar App
const CACHE_NAME = "magnetar-cache-v1"
const urlsToCache = [
  "/",
  "/index.html",
  "/social.html",
  "/academy.html",
  "/settings.html",
  "/wallet.html",
  "/shop.html",
  "/notifications.html",
  "/message.html",
  "/email-login.html",
  "/css/styles.css",
  "/js/app.js",
  "https://cdn.tailwindcss.com",
  "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Roboto:wght@400;500;700&display=swap",
  "https://fonts.googleapis.com/css2?family=Material+Icons",
]

// List of permissions the app might need
const PERMISSIONS = [
  "notifications",
  "geolocation",
  "camera",
  "microphone",
  "background-sync",
  "persistent-storage",
  "payment-handler",
  "clipboard-read",
  "clipboard-write",
]

// Function to request permissions
async function requestPermissions() {
  // Request notification permission
  if ("Notification" in self) {
    try {
      const status = await self.registration.pushManager.permissionState({ userVisibleOnly: true })
      if (status !== "granted") {
        console.log("Notification permission not granted")
      }
    } catch (error) {
      console.error("Error checking notification permission:", error)
    }
  }

  // Handle other permissions through client
  self.clients.matchAll().then((clients) => {
    if (clients.length > 0) {
      clients[0].postMessage({
        action: "requestPermissions",
        permissions: PERMISSIONS,
      })
    }
  })
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache opened")
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener("activate", (event) => {
  console.log("Service worker activated")
  event.waitUntil(requestPermissions())
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }
      return fetch(event.request)
    }),
  )
})

// Handle push notifications
self.addEventListener("push", (event) => {
  const data = event.data.json()
  console.log("Push received:", data)

  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-96x96.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/",
    },
    actions: [
      {
        action: "view",
        title: "View",
      },
      {
        action: "dismiss",
        title: "Dismiss",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "dismiss") {
    return
  }

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      if (windowClients.length > 0) {
        const client = windowClients[0]
        client.navigate(event.notification.data.url)
        return client.focus()
      } else {
        return clients.openWindow(event.notification.data.url)
      }
    }),
  )
})

// Handle background sync
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-data") {
    event.waitUntil(syncData())
  }
})

// Function to sync data in background
async function syncData() {
  try {
    const dataToSync = await getDataToSync()
    if (dataToSync.length > 0) {
      await sendDataToServer(dataToSync)
      await markDataSynced()
    }
  } catch (error) {
    console.error("Background sync failed:", error)
  }
}

// Placeholder functions for sync implementation
async function getDataToSync() {
  // This would be implemented to get data from IndexedDB
  return []
}

async function sendDataToServer(data) {
  // This would be implemented to send data to server
  console.log("Syncing data to server:", data)
}

async function markDataSynced() {
  // This would be implemented to mark data as synced in IndexedDB
  console.log("Data marked as synced")
}

// Handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.action === "skipWaiting") {
    self.skipWaiting()
  }
})
