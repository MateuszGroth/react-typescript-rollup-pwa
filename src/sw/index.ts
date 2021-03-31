// @ts-expect-error: VERSION provided by the SwPlugin
const staticCache = `static-${VERSION}`;
const expectedCaches = [staticCache];

self.addEventListener('install', event => {
    console.log(`Service Worker: Installed`);
    event.waitUntil(
        (async () => {
            const cache = await caches.open(staticCache);
            // @ts-expect-error: ASSETS provided by the SwPlugin
            await cache.addAll(ASSETS);
        })()
    );
});

self.addEventListener('activate', event => {
    console.log(`Service Worker: Activated`);
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!expectedCaches.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('message', event => {
    if (event.data === 'SKIP_WAITING') {
        // browser will reload now
        self.skipWaiting();
    }
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    if (url.origin == 'http://gravatar.com') {
        event.respondWith(handleAvatarRequest(event));
        return;
    }

    // ? not needed since we are caching '/'
    // if (url.origin == location.origin && url.pathname == '/') {
    // console.log(event.request);
    // event.respondWith(caches.match('/index.adsadasd.html')); // main index html with hash
    //     return ;
    // }

    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request)) // if was cached, return, otherwise fetch it
    );
});

const handleAvatarRequest = event => {
    // here we cache avatars that came from the web
    // in order to do that, we have to clone the response of that avatar fetch and put it into cache
    // (so we dont fetch it twice - second for the cache)
    const networkFetch = fetch(event.request);

    // ? what happens when there are multiple calls for the same avatar, is it cached multiple times?
    event.waitUntil(
        networkFetch.then(response => {
            // have to clone response because it can be read only once
            const responseClone = response.clone();
            caches.open('avatars').then(cache => cache.put(event.request, responseClone));
        })
    );

    // return cached avatar or fetched from network if there is no cache
    return caches.match(event.request).then(response => response || networkFetch);
};
