const CACHE_NAME = 'ecommerce-app-v2'; // Versi cache baru
const urlsToCache = [
    '/',
    '/index.html',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap',
    // Tambahkan URL gambar placeholder default jika digunakan:
    'https://placehold.co/300x200/ADD8E6/000?text=Kemeja',
    'https://placehold.co/300x200/87CEEB/000?text=Jeans',
    'https://placehold.co/300x200/6A5ACD/FFF?text=Sneakers',
    'https://placehold.co/300x200/4682B4/FFF?text=Tas',
    'https://placehold.co/300x200/CCCCCC/000?text=No+Image',
    'https://placehold.co/300x200/CCCCCC/000?text=Image+Error',
    'https://placehold.co/100x70/CCCCCC/000?text=Preview',
    'https://placehold.co/300x200/CCCCCC/000?text=Error+Loading'
    // Jika Anda memiliki file CSS atau JS terpisah, tambahkan URL mereka di sini
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cache dibuka');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker: Gagal menyimpan cache saat instalasi:', error);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Jika ada di cache, kembalikan respons dari cache
                if (response) {
                    return response;
                }
                // Jika tidak ada di cache, ambil dari jaringan
                return fetch(event.request).catch(() => {
                    // Jika jaringan gagal, dan itu adalah permintaan navigasi, coba kembalikan halaman offline
                    if (event.request.mode === 'navigate') {
                        // Aplikasi ini adalah single-page, jadi '/' adalah fallback-nya
                        return caches.match('/');
                    }
                    // Untuk aset lain, kembalikan respons kesalahan generik
                    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
                });
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Service Worker: Menghapus cache lama:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
