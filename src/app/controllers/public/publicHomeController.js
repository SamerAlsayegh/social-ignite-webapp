define(['../module'], function (controllers) {
    'use strict';
    return controllers.controller('publicHomeController', ['$rootScope', '$scope', '$cookies', '$location',
        '$state', '$stateParams', 'Auth', 'Alert', '$mdSidenav', '$window',
        function ($rootScope, $scope, $cookies, $location,
                  $state, $stateParams, Auth, Alert, $mdSidenav, $window) {


            /**
             * Any module declarations here
             */
            $scope.location = $location;
            $scope.theme = $cookies.get("theme");

            /**
             * Variable delcarations for rootScope
             */
            $rootScope.user = null;

            $scope.email = $stateParams.email || '';
            $scope.email_code = $stateParams.code;

            /**
             * Login using the form on the login page.
             * @param user
             */
            $scope.loginForm = function (login) {
                if (login.$valid) {
                    $scope.loginLoading = true;
                    Auth.login({
                        email: login.email.$modelValue,
                        password: login.password.$modelValue,
                        remember: true
                    }, function (data) {
                        $rootScope.user = data;
                        var redirect = $cookies.get("redirect_on_login");
                        $scope.loginLoading = false;
                        console.log(redirect);
                        if (redirect != null && redirect.length > 0){
                            $cookies.remove("redirect_on_login");
                            $state.go(redirect, {}, {reload: redirect});
                        } else {
                            $state.go('portal.home', {}, {reload: 'portal.home'});
                        }
                    }, function (status, message) {
                        $scope.loginLoading = false;
                        if (status == 404) {
                            $scope.forgotPassword =  true;
                            Alert.error("You entered an invalid email/password.");
                        }
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
                    $scope.registerLoading = true;
                    // Backup code that was previouslky coded but technically not needed.
                    if (!register || register.email.$modelValue.length == 0 || register.password.$modelValue.length == 0) {
                        Alert.error("Your email or password field is missing.");
                        return;
                    } else if (!register.toc.$modelValue) {
                        Alert.error("Please tick the Terms and Conditions box so you won't set our servers on fire");
                        return;
                    }
                    var email = register.email.$modelValue;

                    Auth.register({
                        email: email,
                        password: register.password.$modelValue,
                        mailing_list: register.mailing_list.$modelValue,
                        toc: register.toc.$modelValue
                    }, function (data) {
                        $state.go('public.email_verify', {email: email}, {reload: 'public.email_verify'});//If the session is invalid, take to login page.
                    }, function (status, message) {
                        $scope.registerLoading = false;
                        Alert.error(message);
                    });
                }
            };

            $scope.loginWithFacebook = function() {
                $scope.loginLoading = true;
                $window.open(__API__ + '/api/v1/oauth/facebook/', '_self');
            };

            $scope.requestResetPassword = function (email){
                Auth.requestPasswordReset(email, function (data) {
                    Alert.success("An email has been sent to " + email + " if it exists.");
                }, function (status, message) {
                    Alert.error(message);
                });
            };

            $scope.resetPassword = function (forgot_password) {
                if (forgot_password.$valid && $stateParams.secure != null) {
                    // Backup code that was previouslky coded but technically not needed.
                    if (!forgot_password || forgot_password.password.$modelValue.length == 0) {
                        Alert.error("Your password field is missing.");
                        return;
                    }
                    Auth.submitPasswordReset($stateParams.secure, forgot_password.password.$modelValue, function (data) {
                        $state.go('public.login', {}, {reload: 'public.login'});//If the session is invalid, take to login page.
                    }, function (status, message) {
                        Alert.error(message);
                    });
                } else {
                    Alert.error("One or more parameters needed.");
                }
            }

            $scope.attemptVerify = function (email, code) {
                Auth.verify({
                    email: email,
                    code: code
                }, function (data) {
                    Alert.success("Verified email. You may now login.");
                    $state.go('public.login', {}, {reload: 'public.login'});
                }, function (status, message, messageCode) {
                    if (messageCode == errorCodes.InvalidParam.id)
                        Alert.error("This code is invalid.");
                    if (messageCode == errorCodes.EmailAlreadyVerified.id) {
                        Alert.error("Email already verified");
                        $state.go('public.login', {}, {reload: 'public.login'});
                    }
                    else
                        Alert.error("Error: " + message);
                });
            };

            $scope.requestResend = function () {
                if ($scope.email.length == 0) {
                    Alert.error("Your email field is missing.");
                    return;
                }
                Auth.requestEmailResend($scope.email, function (data) {
                    Alert.success("An email should be on the way.");
                }, function (status, message) {
                    Alert.error(message);
                });

            };




            $scope.toggleMenu = function () {
                $mdSidenav('left').toggle()
            };

            $scope.switchTheme = function () {
                if ($scope.theme == "dark") $scope.theme = "default";
                else $scope.theme = "dark";
                $cookies.put("theme", $scope.theme, {expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30))});
            };



            if ($scope.email && $scope.email_code)
                $scope.attemptVerify($scope.email, $scope.email_code);

        }]);


});

