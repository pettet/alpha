




var CACHE_NAME = "kasper_v0_alpha";
var urlsToCache = [
  "/",
  "/services",
  "/contact",
  "/images/kasper_16.png",
  "/images/kasper_256.png",
  "/js/jquery-3.4.1.min.js",
  "/js/wrapper.js",
  "/js/cli.js",
];


self.addEventListener("install",function(event){
  console.log("cli.js install",event);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache){
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener("fetch",function(event){
  console.log("cli.js fetch",event);
  event.respondWith(
    // magic goes here
  );
});

self.addEventListener("activate",function(event){
  var cacheWhitelist = ["kasper_v0_alpha"];
  event.waitUntil(
    caches.keys().then(function(cacheNames){
      return Promise.all(
        cacheNames.map(function(cacheName){
          if(cacheWhitelist.indexOf(cacheName)===-1){
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});



console.log("i am in cli.js");

self.addEventListener("message",function(ev){
  console.log("cli.js message",ev);
});
