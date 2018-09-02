define(['./module'], function (services) {
    'use strict';
    services.factory('PostComment', ['Request',
        function (Request) {
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
