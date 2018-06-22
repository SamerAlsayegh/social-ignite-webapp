define(['./module'], function (services) {
    'use strict';
    services.factory('Image', ['Request', '$cookies', '$state', '$rootScope',
        function (Request, $cookies, $state, $rootScope) {
            var cacheTime = 1000 * 60 * 5;
            var dataCache = {};// Only fetch data if older than 5 minutes - prevents

            return {
                getDetails: function (imageId, cbSuccess, cbFail) {
                    if (!imageId)
                        return cbFail(400, 'Missing image id');

                    return Request.get('portal/image/' + imageId,
                         function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getImages: function (cursor, cbSuccess, cbFail) {
                    var funcName = "getImages" + cursor;

                    if (dataCache.hasOwnProperty(funcName) && dataCache[funcName].time > (new Date().getTime() - (cacheTime)))
                        return cbSuccess(dataCache[funcName].data);


                    return Request.get('portal/image/' + (cursor ? Request.ArrayToURL({pagination: cursor}) : ''),
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                addImage: function (parameters, cbSuccess, cbFail, cbProgress) {
                    if (!parameters)
                        return;

                    return Request.formPost('portal/image/', parameters,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        }, function (loaded, total) {
                            return cbProgress(loaded, total);
                        });
                },
                modifyImage: function (imageId, parameters, cbSuccess, cbFail) {
                    if (!imageId)
                        return cbFail(400, 'Missing image id');
                    else if (!parameters)
                        return cbFail(400, 'Missing parameters');

                    return Request.post('portal/image/'  + imageId, parameters,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                deleteImage: function (imageId, cbSuccess, cbFail) {
                    if (!imageId)
                        return cbFail(400, 'Missing image id');

                    return Request.post('portal/image/'  + imageId + '/delete', {},
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
            };
        }]);
});
