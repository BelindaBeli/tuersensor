self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('app-v1')
            .then(cache => cache.addAll([
                './',
                './index.html',
                './app.js',
                './logo.png',
                './Türe.jpg',
                './styles.css',
                './manifest.json'
            ]))
    );
    console.log('Service Worker installed');
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.open('app-v1').then((cache) => {
            return fetch(event.request) // erzeug eine Anfrage an das Netzwerk
                .then((response) => { // then: falls die Anfrage erfolgreich ist (online)
                    cache.put(event.request, response.clone());
                    return response;
                })
                .catch(() => cache.match(event.request)); // catch: falls die Anfrage nicht an das Netzwerk gestellt werden konnte (offline)
        })        
    );
    console.log('Fetch event for ', event.request.url);
});

self.addEventListener('push', function(event) {
    console.log('Push event received');
    let data = {};
    if (event.data) {
        data = event.data.json();
    }
    const title = data.title || 'Default title';
    const options = {
        body: data.body || 'Default message body',
        icon: 'icon-192.png'
    };
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});