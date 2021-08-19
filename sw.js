
const applicationServerPublicKey = 'BLno_uYF0FR_23f5vgU8mr2Q61E24p9Bu6rfF-hdScybXpRkPmnElO9-RbzxV-rLmdEbkSYqBIgo2wldN7pqLKE';

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}



self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Push Codelab';
  const options = {
    body: `${event.data.text()}`
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://Legenddrd.github.io')
  );
});

self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(newSubscription) {
      // TODO: Send to application server
      
      console.log('[Service Worker] New subscription: ', newSubscription);
    })
  );
});

self.addEventListener('install', e => {
  console.log('SW: Installed');
  e.waitUntil(
      caches.open(CacheName).then(cache => {
          console.log('SW: Cachiing Files on install');
          cache.addAll(cacheAssests);
      })
  );
//
  //self.registration.showNotification("Hello");
});
self.addEventListener('activate', e=>{
  console.log("sw activated");
  e.waitUntil(
      caches.keys().then(CacheNames => {
          return Promise.all(
              CacheNames.map(cache => {
                  if(cache!== CacheName){
                      console.log("deleting cache");
                      return caches.delete(cache);
                  }
              })
          )
      })
  )
})

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
      
      self.skipWaiting();
      event.waitUntil(
          caches.open(CacheName).then(cache => {
              console.log('SW: Cachiing Files after allowing update');
             // cache.addAll(['/js/main.js']);
               cache.addAll(cacheAssests);
          })
          
      );

  }
});
self.addEventListener('fetch', e =>{
  console.log("fecthing cache")
  e.respondWith(fetch(e.request).catch(()=> caches.match(e.request)))
})


