/**
 * Created by Samer on 2015-09-14.
 */
define(['./module', '../enums/errorCodes'], function (controllers, errorCodes) {
    'use strict';
    return controllers.controller('publicHomeController', ['$rootScope', '$scope', '$http', '$cookies', '$location',
        '$state', '$stateParams', 'Auth', '$mdToast', '$timeout', 'Alert', '$mdSidenav',
        function ($rootScope, $scope, $http, $cookies, $location,
                  $state, $stateParams, Auth, $mdToast, $timeout, Alert, $mdSidenav) {
            /**
             * Any module declarations here
             */
            $scope.location = $location;
            $scope.dynamicTheme = $cookies.get("theme");
            /**
             * Here is the codes for jQuery - Must be avoided at all costs, as it won't work well with Angular
             */

            /**
             * Variable delcarations for rootScope
             */
            $rootScope.user = null;


            /**
             * Variable declarations
             */
            $scope.login = {};
            $scope.register = {
                user: {
                    mailing_list: true
                }
            };
            $scope.verify = {
                user: {
                    email: $stateParams.email || '',
                    code: $stateParams.code || ''
                }
            };


            /**
             * Initialize code...
             */


            // $rootScope.hasSessionKey = !!$cookies.get('sessionKey');
            // // If the user does not have a cookie, we will just send them to login page.
            // if ($rootScope.hasSessionKey) {
            //     // We will verify the cookie they have against the RESTful API, if it fails, we will forward to login page.
            //     Auth.sessionValidate();
            // }

            $scope.goto = function (page) {
                $location.path(page);
            };


            /**
             * Login using the form on the login page.
             * @param user
             */
            $scope.loginViaForm = function (user) {
                if (!user) {
                    Alert.error("Your email or password field is missing.");
                    return;
                }

                Auth.login({
                    email: user.email,
                    password: user.password,
                    remember: user.remember
                }, function (data) {
                    // $rootScope.user = data;
                    Alert.info('Logged in successfully!');
                    $state.go('portal.home', {}, {reload: 'portal.home'});
                }, function (status, message) {
                    if (status == 404)
                        Alert.error("You entered an invalid email/password. Forgot password?");
                    else
                        Alert.error("Error: " + message);

                });
            };

            /**
             * Register using the form on the login page.
             * @param user
             */
            $scope.registerViaForm = function (user) {
                if (!user || user.email.length == 0 || user.password.length == 0) {
                    Alert.error("Your email or password field is missing.");
                    return;
                } else if (user.password != user.verify_password) {
                    Alert.error("Your passwords do not match. Make sure they do.");
                    return;
                } else if (!user.toc) {
                    Alert.error("To continue, we gotta make you won't set our servers on fire...");
                    return;
                }

                Auth.register({
                    email: user.email,
                    password: user.password,
                    mailing_list: user.mailing_list,
                    toc: user.toc
                }, function (data) {
                    $scope.verify.user.email = user.email;
                    $state.go('public.email_verify_fill_email', {email: user.email}, {reload: 'public.email_verify_fill_email'});//If the session is invalid, take to login page.
                }, function (status, message) {
                    Alert.error(message);
                });
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

            $scope.requestResend = function (email) {
                if (email.length == 0) {
                    Alert.error("Your email field is missing.");
                    return;
                }
                Auth.requestEmailResend(email, function (data) {
                    Alert.success("An email should be on the way.");
                }, function (status, message) {
                    Alert.error("Failed to request verification email.");
                    console.log(message);
                });

            };


            /**
             * Register using the form on the login page.
             * @param user
             */
            $scope.verifyViaForm = function (user) {
                if (user.code.length == 0) {
                    Alert.error("Your code field is missing.");
                    return;
                }

                $scope.attemptVerify(user);
            };

            if ($stateParams.email && $stateParams.code)
                $scope.attemptVerify($scope.verify.user);


            $scope.toggleMenu = function () {
                $mdSidenav('left').toggle()
            };

            $scope.switchTheme = function () {
                if ($scope.dynamicTheme == "dark") $scope.dynamicTheme = "default";
                else $scope.dynamicTheme = "dark";
                $cookies.put("theme", $scope.dynamicTheme, {expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30))});
            };


        }]);


});

