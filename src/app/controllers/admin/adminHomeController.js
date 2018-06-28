require("expose-loader?io!socket.io-client");

define(['./../module', '../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('adminHomeController', ['$rootScope', '$scope', '$http', '$cookies', '$location',
        '$state', '$stateParams', 'moment', '$timeout', 'Alert', '$mdSidenav', 'Auth', 'AdminGeneral',
        function ($rootScope, $scope, $http, $cookies, $location,
                  $state, $stateParams, moment, $timeout, Alert, $mdSidenav ,Auth, AdminGeneral) {


            // $scope.theme = $scope.user && $scope.user.options ? $scope.user.options.theme : "default";


            $scope.socket = io(__SOCKETS__);

            $scope.socket.on('online', function (onlineCount) {
                console.log(onlineCount);
                $scope.onlineCount = onlineCount;
                $scope.$apply();
            });



            $scope.socket.on('ticket_new', function (ticket_reply) {
                Alert.info("A new ticket was created.")
            });
            $scope.socket.on('ticket_reply', function (ticket_reply) {
                Alert.info("A ticket has been replied to")
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


        }]);
});

