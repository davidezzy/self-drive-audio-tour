var VERSION="tour-v1";
var CORE=["./","./index.html","./logic.js","./tours/index.json"];
self.addEventListener("install",function(event){
  event.waitUntil(fetch("./tours/index.json").then(function(r){return r.json()}).then(function(index){
    var files=CORE.concat((index.tours||[]).map(function(t){return "./"+t.file}));
    return caches.open(VERSION).then(function(cache){
      return Promise.all(files.map(function(file){return fetch(file).then(function(r){if(r.ok)return cache.put(file,r)}).catch(function(){})}));
    });
  }).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate",function(event){
  event.waitUntil(caches.keys().then(function(keys){return Promise.all(keys.filter(function(k){return k!==VERSION}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener("fetch",function(event){
  var url=new URL(event.request.url);
  if(url.origin!==location.origin)return;
  if(url.pathname.indexOf("/audio/")>=0){
    event.respondWith(caches.match(event.request).then(function(hit){return hit||fetch(event.request).then(function(r){if(r.ok){var copy=r.clone();caches.open(VERSION).then(function(c){c.put(event.request,copy)})}return r})}));
  }else if(url.pathname.indexOf("/tours/")>=0){
    event.respondWith(fetch(event.request).then(function(r){var copy=r.clone();caches.open(VERSION).then(function(c){c.put(event.request,copy)});return r}).catch(function(){return caches.match(event.request)}));
  }
});
