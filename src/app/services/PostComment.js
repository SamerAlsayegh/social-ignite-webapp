define(['./module'], function (services) {
    'use strict';
    services.factory('PostComment', ['Request', '$cookies', '$state', '$rootScope',
        function (Request, $cookies, $state, $rootScope) {
            var cacheTime = 1000 * 60 * 5;
            var dataCache = {};// Only fetch data if older than 5 minutes - prevents

            return {
                getReplies: function (parameters, cbSuccess, cbFail) {
                    if (!parameters.parent_post)
                        return cbFail(400, 'Missing parent reply or post information.');

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
