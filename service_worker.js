const CacheName = 'v03';
const cacheAssests = [
    '/js/main.js',
    'index.html',
    'about.html',
    '/css/style.css'
];
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

self.addEventListener('push', function(event) {
    var options = {
      body: 'This notification was generated from a push!',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2'
      },
      actions: [
        {action: 'explore', title: 'Explore this new world'},
        {action: 'close', title: 'Close',
          icon: 'images/xmark.png'},
      ]
    };
    event.waitUntil(
      self.registration.showNotification('Hello world!')
    );
  });

  self.addEventListener('push', function(event) {
      if(event.data =='11'){
        var options = {
            body: 'WE SENDING MESSAGES BOIS',
            vibrate: [100, 50, 100],
            data: {
              dateOfArrival: Date.now(),
              primaryKey: '2'
            },
            actions: [
              {action: 'explore', title: 'Explore this new world'},
              {action: 'close', title: 'Close',
                icon: 'images/xmark.png'},
            ]
          };
          event.waitUntil(
            self.registration.showNotification('SENDING THEM MESS')
          );
      }
    
  });

