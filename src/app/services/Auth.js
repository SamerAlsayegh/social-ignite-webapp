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
                        console.log(message);
                            $cookies.put('sid', message, new Date(new Date().getTime() + (1000*60*60*24*7)));
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
                checkEmail: function (email, cbSuccess, cbFail) {
                    if (!email)
                        return;

                    return Request.get('auth/valid', {email: email},
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
                requestPasswordReset: function(email, cbSuccess, cbFail) {
                    return Request.post('auth/forgotten_password', {
                      email: email
                    }, function (message) {
                        return cbSuccess(message);
                    }, function (status, message) {
                        return cbFail(status, message);
                    });
                },
                submitPasswordReset: function(code, password, cbSuccess, cbFail) {
                    return Request.post('auth/forgotten_password', {
                        code: code,
                        password: password
                    }, function (message) {
                        return cbSuccess(message);
                    }, function (status, message) {
                        return cbFail(status, message);
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
                                var sid = $cookies.get('sid');
                                if (sid != null){
                                    return Request.post('auth/request_cookie',{sid: sid},
                                        function (message) {
                                            // $rootScope.user = message.data;
                                            $rootScope.user = message.data;
                                            $rootScope.loggedIn = true;
                                            return callback(true);
                                        }, function (status, message) {
                                            $cookies.remove('sid');
                                        $rootScope.loggedIn = false;
                                        return callback(false);
                                        });
                                } else {
                                    $rootScope.loggedIn = false;
                                    return callback(false);
                                }
                            });
                    }
                },
            };
        }]);
});
