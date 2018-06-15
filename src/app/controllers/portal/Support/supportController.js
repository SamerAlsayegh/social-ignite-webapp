define(['../../module', '../../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('supportController', ['$rootScope', '$scope', '$http', '$cookies', '$location',
        '$state', '$stateParams', 'moment', '$timeout', 'Alert', 'Support',
        function ($rootScope, $scope, $http, $cookies, $location,
                  $state, $stateParams, moment, $timeout, Alert, Support) {

            $scope.tickets = [];
            $scope.loadTickets = function() {
                let last_response =  $scope.tickets.length > 0 ? $scope.tickets[$scope.tickets.length - 1].last_response : null;
                Support.getSupportTickets(last_response, function (tickets) {
                    $scope.tickets = tickets.data.tickets;
                    $scope.remaining = tickets.data.remaining;
                }, function (status, message) {
                    Alert.error(message);
                });
            };
            $scope.loadTickets();


            $scope.closeTicket = function (ticket) {
                Support.closeSupportTicket(ticket._id, function () {
                    ticket.status = "Closed";
                    for (var x in $scope.tickets){
                        if ($scope.tickets[x]._id == ticket._id){
                            $scope.tickets.splice(x, 1);
                            $scope.tickets.push(ticket);
                        }
                    }
                }, function (status, message) {
                    Alert.error(message);
                });
            }

        }]);
});

