define(['./module'], function (services) {
    'use strict';
    services.factory('Action', ['Request', '$cookies', '$state', '$rootScope',
        function (Request, $cookies, $state, $rootScope) {

            return {
                toggleLikeComment: function (parameters, cbSuccess, cbFail) {
                    console.log(parameters);
                    return Request.post('portal/actions/like',
                        parameters,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                postComment: function (parameters, cbSuccess, cbFail) {
                    return Request.post('portal/actions/reply',
                        parameters,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                deleteComment: function (parameters, cbSuccess, cbFail) {
                    return Request.post('portal/actions/delete_comment',
                        parameters,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
            };
        }]);
});
