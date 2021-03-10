self.addEventListener('install', e => {
    console.log(`Service Worker: Installed`);
});

self.addEventListener('activate', () => {
    console.log('Service Worker: Activated');
});
