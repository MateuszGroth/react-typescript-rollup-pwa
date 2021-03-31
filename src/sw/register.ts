import swURL from 'service-worker:./index';

export const registerSw = async () => {
    if (!('serviceWorker' in navigator)) {
        return;
    }
    // register the service worker from the file specified
    const registration = await navigator.serviceWorker.register(swURL, { scope: '/' });

    // ensure the case when the updatefound event was missed is also handled
    // by re-invoking the prompt when there's a waiting Service Worker
    if (registration.waiting) {
        invokeServiceWorkerUpdateFlow(registration);
    }

    // ! if there was controller installed already and new sw would not be available, registration.waiting would be false
    // ! and updatefound would not fire
    // detect Service Worker update available and wait for it to become installed
    registration.addEventListener('updatefound', () => {
        // if there is no installing sw, it means that the new sw failed
        console.log('jest update?');
        if (!registration.installing) {
            return;
        }

        // wait until the new (currently installing) Service worker is actually installed (ready to take over)
        registration.installing.addEventListener('statechange', () => {
            console.log('jest state cange??');
            // if there is no registration.waiting (waiting sw), it means the installation failed
            if (!registration.waiting) {
                return;
            }
            // if there's an existing controller (previous Service Worker), show the prompt
            if (navigator.serviceWorker.controller) {
                invokeServiceWorkerUpdateFlow(registration);
            } else {
                // otherwise it's the first install, nothing to do
                // it will take control on its own
                console.log('Service Worker initialized for the first time');
            }
        });
    });

    let refreshing = false;

    // detect controller change and refresh the page
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) {
            return;
        }
        window.location.reload();
        refreshing = true;
    });
};

function invokeServiceWorkerUpdateFlow(registration) {
    // TODO implement your own UI notification element
    console.log('update is available - show notification');
    // notification.show('New version of the app is available. Refresh now?');
    // notification.addEventListener('click', () => {
    //   if (registration.waiting) {
    //     // let waiting Service Worker know it should became active
    //     registration.waiting.postMessage('SKIP_WAITING');
    //   }
    // });
}
