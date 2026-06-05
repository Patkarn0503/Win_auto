var CACHE = 'win-auto-v1';
var FILES = ['./index.html', './manifest.json'];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(FILES); })
  );
});

self.addEventListener('fetch', function(e){
  // GAS API ไม่ cache — ดึงสดเสมอ
  if(e.request.url.includes('script.google.com')){
    e.respondWith(fetch(e.request).catch(function(){
      return new Response(JSON.stringify({ok:false,error:'offline'}),
        {headers:{'Content-Type':'application/json'}});
    }));
    return;
  }
  // ไฟล์อื่น cache ก่อน ถ้าไม่มีค่อย fetch
  e.respondWith(
    caches.match(e.request).then(function(r){
      return r || fetch(e.request).then(function(res){
        return caches.open(CACHE).then(function(c){
          c.put(e.request, res.clone());
          return res;
        });
      });
    })
  );
});
