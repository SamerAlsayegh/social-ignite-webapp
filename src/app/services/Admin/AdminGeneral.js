define(['../module'], function (services) {
    'use strict';
    services.factory('AdminGeneral', ['Request', '$cookies', '$state', '$rootScope',
        function (Request, $cookies, $state, $rootScope) {

            return {
                getNotifications: function (cbSuccess, cbFail) {
                    return Request.get('admin/notifications',
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
            };
        }]);
});
