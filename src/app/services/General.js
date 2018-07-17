define(['./module'], function (services) {
    'use strict';
    services.factory('General', ['Request',
        function (Request) {

            return {
                getNotifications: function (cbSuccess, cbFail) {
                    return Request.get('notifications',
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
            };
        }]);
});
