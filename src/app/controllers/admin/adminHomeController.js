require("expose-loader?io!socket.io-client");

define(['./../module'], function (controllers) {
    'use strict';
    return controllers.controller('adminHomeController', ['$rootScope', '$scope', '$http', '$cookies', '$location',
        '$state', '$stateParams', 'moment', '$timeout', 'Alert', '$mdSidenav', 'Auth', 'AdminGeneral',
        function ($rootScope, $scope, $http, $cookies, $location,
                  $state, $stateParams, moment, $timeout, Alert, $mdSidenav, Auth, AdminGeneral) {

            $scope.theme = $scope.user && $scope.user.options ? $scope.user.options.theme : "default";

            // $scope.theme = $scope.user && $scope.user.options ? $scope.user.options.theme : "default";


            $scope.socket = io(__SOCKETS__);

            $scope.socket.on('online', function (onlineCount) {
                $scope.onlineCount = onlineCount;
                $scope.$apply();
            });



            $scope.socket.on('changedScope', function () {
                Auth.logout(function () {
                    Alert.error("Your scope has been changed, please relogin...");
                }, function (status, message) {
                    Alert.error(message);
                })
            });



            AdminGeneral.getNotifications(function (message) {
                $scope.usersCount = message.data.users;
                $scope.usersOnline = message.data.online_users;
                $scope.support_tickets = message.data.support_tickets;
            }, function (status, message) {
                Alert.error(message);
            });

            $scope.platformLookup = function (platformId) {
                return platforms[platformId];
            };

            $scope.toggleMenu = function () {
                $mdSidenav('left').toggle()
            };


            $scope.logout = function () {
                Auth.logout(function (data) {
                    Alert.info('Logged out successfully!');
                    $state.go('public.login', {}, {reload: 'public.login'});
                }, function (err, data) {
                    Alert.error('Failed to log out.');
                });
            };

        }]);
});

