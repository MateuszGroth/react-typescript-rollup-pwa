if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register(`./js/sw.js`, { scope: '/' })
            .then(() => console.log('Service Worker: Registered'))
            .catch(err => `Service Worker Error: ${err}`);
    });
}
