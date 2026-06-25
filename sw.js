var CACHE = 'win-auto-v4';
var FILES = ['./index.html', './manifest.json'];
self.addEventListener('install', function(e){ self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(FILES); })); });
self.addEventListener('activate', function(e){ e.waitUntil(caches.keys().then(function(keys){ return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener('fetch', function(e){
  if(e.request.url.includes('script.google.com')){ e.respondWith(fetch(e.request).catch(function(){ return new Response(JSON.stringify({ok:false,error:'offline'}),{headers:{'Content-Type':'application/json'}}); })); return; }
  e.respondWith(caches.match(e.request).then(function(r){ return r || fetch(e.request).then(function(res){ return caches.open(CACHE).then(function(c){ c.put(e.request,res.clone()); return res; }); }); }));
});
