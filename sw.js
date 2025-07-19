// Service Worker για Mobile PWA Support
const CACHE_NAME = 'business-tracker-v1.0';
const urlsToCache = [
    '/',
    '/dashboard.html',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Service Worker: Caching files...');
                return cache.addAll(urlsToCache);
            })
            .catch((error) => {
                console.log('❌ Service Worker: Caching failed', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip Chrome extension requests
    if (event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    // Skip Firebase requests for real-time functionality
    if (event.request.url.includes('firebase') || event.request.url.includes('googleapis')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version if available
                if (response) {
                    console.log('📱 Service Worker: Serving from cache', event.request.url);
                    return response;
                }

                // Otherwise fetch from network
                console.log('🌐 Service Worker: Fetching from network', event.request.url);
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response for caching
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Return offline page for HTML requests
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/dashboard.html');
                        }
                    });
            })
    );
});

// Background Sync for offline data
self.addEventListener('sync', (event) => {
    console.log('🔄 Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    try {
        // Get pending data from IndexedDB or localStorage
        const pendingData = JSON.parse(localStorage.getItem('pendingData') || '[]');
        
        if (pendingData.length > 0) {
            console.log('📤 Service Worker: Syncing pending data...', pendingData.length, 'items');
            
            // Simulate data sync (replace with actual API calls)
            for (const data of pendingData) {
                console.log('📡 Service Worker: Syncing item', data);
                // await fetch('/api/sync', { method: 'POST', body: JSON.stringify(data) });
            }
            
            // Clear pending data after successful sync
            localStorage.removeItem('pendingData');
            console.log('✅ Service Worker: Data sync completed');
            
            // Send message to main thread
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'DATA_SYNCED',
                        message: 'Δεδομένα συγχρονίστηκαν!'
                    });
                });
            });
        }
    } catch (error) {
        console.error('❌ Service Worker: Sync failed', error);
    }
}

// Push notification handling
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Νέα ειδοποίηση από Business Tracker',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'business-tracker-notification',
        requireInteraction: false,
        actions: [
            {
                action: 'open',
                title: 'Άνοιγμα εφαρμογής',
                icon: '/icon-192.png'
            },
            {
                action: 'close',
                title: 'Κλείσιμο'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Business Tracker', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/dashboard.html')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
    console.log('💬 Service Worker: Received message', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_UPDATE') {
        // Force cache update
        caches.delete(CACHE_NAME).then(() => {
            console.log('🔄 Service Worker: Cache cleared, will refresh on next load');
        });
    }
});

console.log('🎯 Service Worker: Loaded and ready for Business Tracker PWA!');
