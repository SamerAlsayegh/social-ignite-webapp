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
                            return Request.get('user',
                                function (message) {
                                    $rootScope.user = message.data;
                                    $rootScope.loggedIn = true;
                                    return cbSuccess(message);
                                }, function (status, message) {
                                    return cbFail(status, message);
                                });
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                logout: function (cbSuccess, cbFail) {
                    return Request.post('auth/logout', {},
                        function (message) {
                            $rootScope.user = null;
                            $rootScope.loggedIn = false;
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
                    if ($rootScope.loggedIn != null) return callback($rootScope.loggedIn);
                    else {
                        return Request.get('user',
                            function (message) {
                                // $rootScope.user = message.data;
                                $rootScope.user = message.data;
                                $rootScope.loggedIn = true;
                                return callback(true);
                            }, function (status, message) {
                                $rootScope.loggedIn = false;
                                return callback(false);
                            });
                    }
                },
            };
        }]);
});
