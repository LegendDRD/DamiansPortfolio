function invokeServiceWorkerUpdateFlow(registration) {
    // Need UI element
    if (confirm('New version for the website has been pushed. Refresh now?')) {
        //var notification = new Notification("Clicekd allert");
        if (registration.waiting) {
            registration.waiting.postMessage('SKIP_WAITING')
        }
    }
}
if (navigator.serviceWorker) {

    window.addEventListener('load', async () => {
        const registration = await navigator.serviceWorker.register('/service_worker.js')


        registration.addEventListener('updatefound', () => {
            
            if (registration.installing) {
                
                registration.installing.addEventListener('statechange', () => {
                    
                    if (registration.waiting) {

                        if (navigator.serviceWorker.controller) {
                            invokeServiceWorkerUpdateFlow(registration)
                        } else {

                            console.log('Service Worker initialized for the first time')
                        }
                    }
                })
            }
        })
    })
    
}
   
if (Notification.permission === "granted") {
subscribeUser();
    //var notification = new Notification("Welcomeback");//acccess already grannted
} else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
            subscribeUser();
            var notification = new Notification("Notification enabled");
        }
    });
}

function subscribeUser() {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.ready.then(function(reg) {
        console.log(reg.subscribe)
        reg.pushManager.subscribe({
          userVisibleOnly: true
        }).then(function(sub) {
          console.log('Endpoint URL: ', sub.endpoint);
        }).catch(function(e) {
          if (Notification.permission === 'denied') {
            console.warn('Permission for notifications was denied');
          } else {
            console.error('Unable to subscribe to push', e);
          }
        });
      })
    }
  }
