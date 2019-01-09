define(['../module'], function (controllers) {
    'use strict';
    return controllers.controller('publicHomeController', ['$rootScope', '$scope', '$cookies', '$location',
        '$state', '$stateParams', 'Auth', 'Alert', '$mdSidenav', '$window', '$timeout',
        function ($rootScope, $scope, $cookies, $location,
                  $state, $stateParams, Auth, Alert, $mdSidenav, $window, $timeout) {


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


            $scope.cancelLogin = () =>{
                $scope.loginLoading = false;
            };

            /**
             *
             * @param login
             */
            $scope.loginForm = login => {
                if (login.$valid) {
                    $scope.loginLoading = true;
                    Auth.login({
                        email: login.email.$modelValue,
                        password: login.password.$modelValue,
                        remember: true
                    }, data => {
                        $rootScope.user = data;

                        let redirect = $cookies.get("redirect_on_login");
                        $scope.loginLoading = false;
                        if (redirect != null && redirect.length > 0) {
                            $cookies.remove("redirect_on_login");
                            $state.go(redirect, {}, {reload: redirect});
                        } else {
                            $state.go('portal.home', {}, {reload: 'portal.home'});
                        }
                    }, (status, message) => {
                        $scope.loginLoading = false;
                        if (status === 404) {
                            $scope.forgotPassword = true;
                            Alert.error("You entered an invalid email/password.");
                        }
                        else
                            Alert.error("Error: " + message);
                    });
                }
            };


            /**
             *
             * @param register
             */
            $scope.registerForm = register => {
                if (register.$valid) {
                    $scope.registerLoading = true;
                    // Backup code that was previouslky coded but technically not needed.
                    if (!register || register.email.$modelValue.length === 0 || register.password.$modelValue.length === 0) {
                        Alert.error("Your email or password field is missing.");
                        return;
                    } else if (!register.toc.$modelValue) {
                        Alert.error("Please tick the Terms and Conditions box so you won't set our servers on fire");
                        return;
                    }
                    let email = register.email.$modelValue;

                    Auth.register({
                        email,
                        password: register.password.$modelValue,
                        mailing_list: register.mailing_list.$modelValue,
                        toc: register.toc.$modelValue
                    }, data => {
                        $state.go('public.auth.email_verify', {email}, {reload: 'public.auth.email_verify'});//If the session is invalid, take to login page.
                    }, (status, message) => {
                        $scope.registerLoading = false;
                        Alert.error(message);
                    });
                }
            };

            $scope.loginWithFacebook = () => {
                $scope.loginLoading = true;
                $window.open(__API__ + '/api/v1/oauth/facebook/', '_self');
            };

            $scope.requestResetPassword = email => {
                $scope.processingPasswordRequest = true;
                if (!$scope.processingPasswordRequestDelay) {
                    $scope.processingPasswordRequestDelay = true;
                    $timeout(function () {
                        $scope.processingPasswordRequest = false;
                    }, 1000 * 10);

                    Auth.requestPasswordReset(email, data => {
                        Alert.success("An email has been sent to " + email + " if it exists.");
                        $scope.processingPasswordRequest = false;
                    }, (status, message) => {
                        Alert.error(message);
                        $scope.processingPasswordRequest = false;
                    });
                } else {
                    Alert.error("An email was recently sent, please wait before retrying.");

                }
            };

            $scope.resetPassword = forgot_password => {
                if (forgot_password.$valid && $stateParams.secure != null) {
                    // Backup code that was previouslky coded but technically not needed.
                    if (!forgot_password || forgot_password.password.$modelValue.length === 0) {
                        Alert.error("Your password field is missing.");
                        return;
                    }
                    Auth.submitPasswordReset($stateParams.secure, forgot_password.password.$modelValue, data => {
                        $state.go('public.auth.login', {}, {reload: 'public.auth.login'});//If the session is invalid, take to login page.
                    }, (status, message) => {
                        Alert.error(message);
                    });
                } else {
                    Alert.error("One or more parameters needed.");
                }
            };

            $scope.attemptVerify = (email, code) => {
                Auth.verify({
                    email,
                    code
                }, data => {
                    Alert.success("Verified email. You may now login.");
                    $state.go('public.auth.login', {}, {reload: 'public.auth.login'});
                }, (status, message, messageCode) => {
                    if (messageCode === errorCodes.InvalidParam.id)
                        Alert.error("This code is invalid.");
                    if (messageCode === errorCodes.EmailAlreadyVerified.id) {
                        Alert.error("Email already verified");
                        $state.go('public.auth.login', {}, {reload: 'public.auth.login'});
                    }
                    else
                        Alert.error("Error: " + message);
                });
            };

            $scope.requestResend = () => {
                if ($scope.email.length === 0) {
                    Alert.error("Your email field is missing.");
                    return;
                }
                Auth.requestEmailResend($scope.email, data => {
                    Alert.success("An email should be on the way.");
                }, (status, message) => {
                    Alert.error(message);
                });

            };


            $scope.toggleMenu = () => {
                $mdSidenav('left').toggle()
            };

            $scope.switchTheme = () => {
                if ($scope.theme === "dark") $scope.theme = "default";
                else $scope.theme = "dark";
                $cookies.put("theme", $scope.theme, {expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30))});
            };


            if ($scope.email && $scope.email_code)
                $scope.attemptVerify($scope.email, $scope.email_code);

        }]);
});

