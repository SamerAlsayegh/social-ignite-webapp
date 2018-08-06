define(['./module'], function (services) {
    'use strict';
    services.factory('PostComment', ['Request',
        function (Request) {
            var cacheTime = 1000 * 60 * 5;
            var dataCache = {};// Only fetch data if older than 5 minutes - prevents

            return {
                getReplies: function (parameters, cbSuccess, cbFail) {
                    return Request.get('portal/replies' + Request.ArrayToURL(parameters),
                         function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
            };
        }]);
});
