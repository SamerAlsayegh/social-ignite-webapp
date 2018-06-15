define(['../module', '../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('publicHomeController', ['$rootScope', '$scope', '$http', '$cookies', '$location',
        '$state', '$stateParams', 'Auth', '$mdToast', '$timeout', 'Alert', '$mdSidenav', '$window',
        function ($rootScope, $scope, $http, $cookies, $location,
                  $state, $stateParams, Auth, $mdToast, $timeout, Alert, $mdSidenav, $window) {
            /**
             * Any module declarations here
             */
            $scope.location = $location;
            $scope.theme = $cookies.get("theme");

            /**
             * Variable delcarations for rootScope
             */
            $rootScope.user = null;

            $scope.email_verify_email = $stateParams.email;
            $scope.email_verify_code = $stateParams.code;


            /**
             * Login using the form on the login page.
             * @param user
             */
            $scope.loginForm = function (login) {
                console.log(login.password);
                if (login.$valid) {
                    Auth.login({
                        email: login.email.$modelValue,
                        password: login.password.$modelValue,
                        remember: login.remember ? login.remember.$modelValue : false
                    }, function (data) {
                        // $rootScope.user = data;
                        $state.go('portal.home', {}, {reload: 'portal.home'});
                    }, function (status, message) {
                        if (status == 404)
                            Alert.error("You entered an invalid email/password. Forgot password?");
                        else
                            Alert.error("Error: " + message);
                    });
                }
            };

            /**
             * Register using the form on the login page.
             * @param user
             */
            $scope.registerForm = function (register) {
                if (register.$valid) {
                    // Backup code that was previouslky coded but technically not needed.
                    if (!register || register.email.$modelValue.length == 0 || register.password.$modelValue.length == 0) {
                        Alert.error("Your email or password field is missing.");
                        return;
                    } else if (register.password.$modelValue != register.verify_password.$modelValue) {
                        Alert.error("Your passwords do not match. Make sure they do.");
                        return;
                    } else if (!register.toc.$modelValue) {
                        Alert.error("To continue, we gotta make you won't set our servers on fire...");
                        return;
                    }

                    Auth.register({
                        email: register.email.$modelValue,
                        password: register.password.$modelValue,
                        mailing_list: register.mailing_list.$modelValue,
                        toc: register.toc.$modelValue
                    }, function (data) {
                        $state.go('public.email_verify_fill_email', {email: register.email.$modelValue}, {reload: 'public.email_verify_fill_email'});//If the session is invalid, take to login page.
                    }, function (status, message) {
                        Alert.error(message);
                    });
                }
            };


            $scope.attemptVerify = function (user) {
                Auth.verify({
                    email: user.email,
                    code: user.code
                }, function (data) {
                    Alert.success("Verified email. You may now login.");
                    $state.go('public.login', {}, {reload: 'public.login'});
                }, function (status, message, messageCode) {
                    if (messageCode == errorCodes.InvalidParam.id)
                        Alert.error("This code is invalid.");
                    else
                        Alert.error("Error: " + message);
                });
            };

            $scope.requestResend = function (email_verify) {
                if (email_verify.email.$modelValue.length == 0) {
                    Alert.error("Your email field is missing.");
                    return;
                }
                if (email_verify.$valid) {
                    Auth.requestEmailResend(email_verify.email.$modelValue, function (data) {
                        Alert.success("An email should be on the way.");
                    }, function (status, message) {
                        Alert.error("Failed to request verification email.");
                        console.log(message);
                    });
                }

            };


            /**
             * Register using the form on the login page.
             * @param user
             */
            $scope.emailVerifyForm = function (email_verify) {
                if (email_verify.code.$modelValue.length == 0) {
                    Alert.error("Your code field is missing.");
                    return;
                }

                $scope.attemptVerify({
                    email: email_verify.email.$modelValue,
                    code: email_verify.code.$modelValue
                });
            };

            if ($scope.email_verify_email && $scope.email_verify_code)
                $scope.attemptVerify({
                    code: $scope.email_verify_code,
                    email: $scope.email_verify_email
                });


            $scope.toggleMenu = function () {
                $mdSidenav('left').toggle()
            };

            $scope.switchTheme = function () {
                if ($scope.theme == "dark") $scope.theme = "default";
                else $scope.theme = "dark";
                $cookies.put("theme", $scope.theme, {expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30))});
            };

            $window.addEventListener('beforeinstallprompt', function(e) {
                e.prompt();
            })


        }]);


});

