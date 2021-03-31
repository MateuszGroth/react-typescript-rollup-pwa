const ASSETS = ["../.","test.worker-4ef9645dd349e6c8.js","index.js","Test.js","../css/main.css"];
const VERSION = "e379b86068f753378ab9670fefa1ee3b8e1a01f3";

(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
// @ts-expect-error: VERSION provided by the SwPlugin
const staticCache = `static-${VERSION}`;
const expectedCaches = [staticCache];
self.addEventListener('install', event => {
    console.log(`Service Worker: Installed`);
    event.waitUntil((async () => {
        const cache = await caches.open(staticCache);
        // @ts-expect-error: ASSETS provided by the SwPlugin
        await cache.addAll(ASSETS);
    })());
});
self.addEventListener('activate', event => {
    console.log(`Service Worker: Activated`);
    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(cacheName => {
            if (!expectedCaches.includes(cacheName)) {
                return caches.delete(cacheName);
            }
        }));
    }));
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
    event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)) // if was cached, return, otherwise fetch it
    );
});
const handleAvatarRequest = event => {
    // here we cache avatars that came from the web
    // in order to do that, we have to clone the response of that avatar fetch and put it into cache
    // (so we dont fetch it twice - second for the cache)
    const networkFetch = fetch(event.request);
    // ? what happens when there are multiple calls for the same avatar, is it cached multiple times?
    event.waitUntil(networkFetch.then(response => {
        // have to clone response because it can be read only once
        const responseClone = response.clone();
        caches.open('avatars').then(cache => cache.put(event.request, responseClone));
    }));
    // return cached avatar or fetched from network if there is no cache
    return caches.match(event.request).then(response => response || networkFetch);
};
