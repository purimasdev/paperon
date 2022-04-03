const staticCacheName = 'site-static-v1';
const dynamicCacheName = 'site-dynamic-v1';

const assets = [
  '/',
  '/bulma/bulma.css',
  '/icons/material-icons-round.woff2',
  '/icons/round.css',
  '/js/install-sw.js',		
  '/kreator',
  '/logo/192.png',
  '/logo/96.png',	
  '/logo/kreator.png',	
 '/manifest.webmanifest',
]

// cache size limit fucntion
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size))
      }
    })
  })
}

// install event
self.addEventListener('install', evt => {
  console.log('Service Worker Installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('Caching Shell Assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  console.log('Service Worker Activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      // console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', evt => {
  // console.log('Fetch Event')
  evt.respondWith(
    caches.match(evt.request)
      .then(cacheRes => {
        return cacheRes || fetch(evt.request)
          .then(fetchRes => {
            return caches.open(dynamicCacheName).then(cache => {
              cache.put(evt.request.url, fetchRes.clone());
              limitCacheSize(dynamicCacheName, 30)
              return fetchRes;
            })
          });
      })
      .catch(() => {
        if (evt.request.url.search(/.css|.js|.png|.jpeg|.jpg|.svg/) == -1) {
          return caches.match('/offline')
        }
      })
  );
});