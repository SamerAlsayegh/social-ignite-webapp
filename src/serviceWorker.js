var CACHE_VERSION = 0;


var CACHE_NAME = 'SocialIgnite-Web' + "-" + CACHE_VERSION;

var urlsToCache = [
    // '/app.js',
    // '/0.js',
    // '/1.js',
    '/css/main.css',
];

function send_message_to_sw(msg){
    return new Promise(function(resolve, reject){
    // Create a Message Channel
    var msg_chan = new MessageChannel();

    // Handler for recieving message reply from service worker
    msg_chan.port1.onmessage = function(event){
        if(event.data.error){
            reject(event.data.error);
        }else{
            resolve(event.data);
        }
    };

    // Send message to service worker along with port for reply
    navigator.serviceWorker.controller.postMessage("Client 1 says '"+msg+"'", [msg_chan.port2]);
});
}

function messageToClient(client, data) {
    return new Promise(function(resolve, reject) {
        const channel = new MessageChannel();

        channel.port1.onmessage = function(event){
            if (event.data.error) {
                reject(event.data.error);
            } else {
                resolve(event.data);
            }
        };

        client.postMessage(JSON.stringify(data), [channel.port2]);
    });
}

self.addEventListener('push', function (event) {
    if (event && event.data) {
        self.pushData = event.data.json();
        if (self.pushData) {
            event.waitUntil(self.registration.showNotification(self.pushData.title, {
                body: self.pushData.body,
                icon: self.pushData.data ? self.pushData.data.icon : null
            }).then(function() {
                clients.matchAll({type: 'window'}).then(function (clientList) {
                    if (clientList.length > 0) {
                        messageToClient(clientList[0], {
                            message: self.pushData.body // suppose it is: "Hello World !"
                        });
                    }
                });
            }));
        }
    }
});


self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', function(event) {

    // Active worker won't be treated as activated until promise
    // resolves successfully.
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName != CACHE_NAME || CACHE_VERSION == 0) {
                        console.log('Deleting out of date cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

    // console.log("Requesting notification access", Notification.permission)
    // if (Notification.permission != "denied") {
    //     Notification.requestPermission(function (test) {
    //         console.log(test)
    //     }).then(function(result) {
    //         if (result === 'denied') {
    //             console.log('Permission wasn\'t granted. Allow a retry.');
    //             return;
    //         }
    //         if (result === 'default') {
    //             console.log('The permission request was dismissed.');
    //             return;
    //         }
    //         // Do something with the granted permission.
    //     });
    // } else {
    //     var notification = new Notification("Welcome to notifications!");
    // }

});



self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // IMPORTANT: Clone the request. A request is a stream and
                // can only be consumed once. Since we are consuming this
                // once by cache and once by the browser for fetch, we need
                // to clone the response.
                var fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function(response) {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            }).catch(function (err) {
                            console.log("Failed to cache: ", err)
                        });

                        return response;
                    }
                );
            })
    );
});