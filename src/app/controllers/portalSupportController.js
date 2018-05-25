define(['./module', '../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('portalSupportController', ['$rootScope', '$scope', '$http', '$cookies', '$location',
        '$state', '$stateParams', 'moment', '$timeout', 'Alert', 'Support',
        function ($rootScope, $scope, $http, $cookies, $location,
                  $state, $stateParams, moment, $timeout, Alert, Support) {


            Support.getSupportTickets(null, function (tickets) {
                $scope.tickets = tickets.data.tickets;
                $scope.remaining = tickets.data.remaining;
            }, function (status, message) {
                Alert.error(message);
            });
            $scope.closeTicket = function (ticket) {

            }

        }]);
});

