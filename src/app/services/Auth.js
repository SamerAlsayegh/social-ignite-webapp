define(['./module'], function (services) {
    'use strict';
    services.factory('Auth', ['Request', '$cookies', '$state', '$rootScope',
        function (Request, $cookies, $state, $rootScope) {
            return {
                login: function (parameters, cbSuccess, cbFail) {
                    if (!parameters)
                        return cbFail(400, "Invalid parameters.");

                    return Request.post('auth/login', parameters,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                logout: function (cbSuccess, cbFail) {
                    return Request.post('auth/logout', {},
                        function (message) {
                            $rootScope.user = null;
                            $state.go('public.home', {}, {reload: 'public.home'});
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                register: function (parameters, cbSuccess, cbFail) {
                    if (!parameters)
                        return;

                    return Request.post('auth/register', parameters,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                verify: function (parameters, cbSuccess, cbFail) {
                    if (!parameters)
                        return;

                    return Request.post('auth/verify_email', parameters,
                        function (message) {
                            $state.go('public.home', {}, {reload: 'public.home'});//If the session is invalid, take to login page.
                            return cbSuccess(message);
                        }, function (status, message, messageCode) {
                            return cbFail(status, message, messageCode);
                        });
                },
                requestEmailResend: function(email, cbSuccess, cbFail) {
                    return Request.post('auth/request_email', {
                      email: email
                    }, function (message) {
                        return cbSuccess(message);
                    }, function (status, message) {
                        return cbFail(status, message);
                    });
                },
                sessionValidate: function (callback) {
                    return Request.get('auth/validate',
                        function (message) {
                            $rootScope.user = message.data;
                            return callback(true);
                        }, function (status, message) {
                            return callback(false);
                        });
                },
                getUser: function (cbSuccess, cbFail) {
                    return Request.get('user',
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
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
                updateUser: function (parameters, cbSuccess, cbFail) {
                    if (!parameters)
                        return;

                    return Request.put('user', parameters,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message, messageCode) {
                            return cbFail(status, message, messageCode);
                        });
                },
            };
        }]);
});
