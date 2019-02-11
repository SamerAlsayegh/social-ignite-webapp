define(['../module'], function (controllers) {
    'use strict';
    return controllers.controller('publicHomeController', ['$rootScope', '$scope', '$cookies', '$location',
        '$state', '$stateParams', 'Auth', 'Alert', '$mdSidenav', '$window', '$timeout', 'Team',
        function ($rootScope, $scope, $cookies, $location,
                  $state, $stateParams, Auth, Alert, $mdSidenav, $window, $timeout, Team) {
            $scope.emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


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

            console.log($scope.email);
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
            // completeRegistration
            $scope.completeRegistration = invite => {
                if (invite.$valid) {
                    $scope.inviteLoading = true;
                    // Backup code that was previouslky coded but technically not needed.
                    if (!invite || invite.email.$modelValue.length === 0 || invite.password.$modelValue.length === 0) {
                        Alert.error("Your email or password field is missing.");
                        return;
                    } else if (!invite.toc.$modelValue) {
                        Alert.error("Please tick the Terms and Conditions box so you won't set our servers on fire");
                        return;
                    }
                    let email = invite.email.$modelValue;

                    Team.completeInvite({
                        code: $stateParams.i,
                        email: $stateParams.email,
                        password: invite.password.$modelValue,
                        mailing_list: invite.mailing_list.$modelValue,
                        toc: invite.toc.$modelValue
                    }, data => {
                        $state.go('portal.home', {email}, {reload: 'portal.home'});//If the session is invalid, take to login page.
                    }, (status, message) => {
                        $scope.inviteLoading = false;
                        Alert.error(message);
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
                if (!$scope.processingPasswordRequestDelay) {
                    if (!$scope.emailRegex.test(String(email).toLowerCase())){
                        Alert.error($rootScope.errorCodes.InvalidEmail.detail);
                        $scope.hideEmail = true;
                        return;
                    }

                    $scope.processingPasswordRequestDelay = true;
                    $timeout(function () {
                        $scope.processingPasswordRequest = false;
                    }, 1000 * 10);
                    console.log(email);

                    Auth.requestPasswordReset(email, data => {
                        Alert.success("An email has been sent to " + email + " if it exists.");
                        $scope.processingPasswordRequest = false;
                        delete $scope.hideEmail;
                    }, (status, message) => {
                        Alert.error(message);
                        delete $scope.hideEmail;
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
                if (!$scope.emailRegex.test(String(email).toLowerCase())) {
                    Alert.error("This email is invalid.");
                } else {
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
                }
            };

            $scope.requestResend = (email) => {
                if (!$scope.emailRegex.test(String(email).toLowerCase())) {
                    Alert.error("This email is invalid.");
                } else {
                    Auth.requestEmailResend(email, data => {
                        Alert.success("An email should be on the way.");
                    }, (status, message) => {
                        Alert.error(message);
                    });
                }
            };


            $scope.toggleMenu = () => {
                $mdSidenav('left').toggle()
            };

            $scope.switchTheme = () => {
                if ($scope.theme === "dark") $scope.theme = "default";
                else $scope.theme = "dark";
                $cookies.put("theme", $scope.theme, {expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30))});
            };


            if ($scope.email && $scope.email_code){
                if (!$scope.emailRegex.test(String($scope.email).toLowerCase())) {
                    $scope.attemptVerify($scope.email, $scope.email_code);
                }
            }

        }]);
});

