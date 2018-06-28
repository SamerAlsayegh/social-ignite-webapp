define(['./module'], function (services) {
    'use strict';
    services.factory('Profile', ['Request',
        function (Request) {
            return {
                getUser: function (cbSuccess, cbFail) {
                    return Request.get('user',
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                updateUser: function (parameters, cbSuccess, cbFail) {
                    if (!parameters)
                        return;

                    return Request.post('user', parameters,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message, messageCode) {
                            return cbFail(status, message, messageCode);
                        });
                },
                getPermissions: function (cbSuccess, cbFail) {
                    return Request.get('user/permissions',
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                deleteUser: function (cbSuccess, cbFail) {
                    return Request.post('user/delete', {},
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message, messageCode) {
                            return cbFail(status, message, messageCode);
                        });
                },
                deleteUserComplete: function (code, cbSuccess, cbFail) {
                    return Request.post('user/delete/complete', {code: code},
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message, messageCode) {
                            return cbFail(status, message, messageCode);
                        });
                },
            };
        }]);
});
