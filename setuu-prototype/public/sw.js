self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for background sync events
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-updates') {
    event.waitUntil(syncOfflineUpdates());
  }
});

async function syncOfflineUpdates() {
  // In a real SW environment with localforage, we would import localforage via importScripts
  // but for simplicity in Next.js without a bundler for the SW, we communicate with the clients.
  
  const clients = await self.clients.matchAll({ type: 'window' });
  if (clients.length > 0) {
    // Tell the active window to process the queue
    clients[0].postMessage({ type: 'PROCESS_SYNC_QUEUE' });
  }
}
