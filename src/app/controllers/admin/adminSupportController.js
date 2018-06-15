define(['./../module', '../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('adminSupportController', ['$rootScope', '$scope', '$http', '$cookies', '$location',
        '$state', '$stateParams', 'moment', '$timeout', 'Alert', 'AdminSupport',
        function ($rootScope, $scope, $http, $cookies, $location,
                  $state, $stateParams, moment, $timeout, Alert, AdminSupport) {
            $scope.tickets = [];

            $scope.loadTickets = function() {
                let last_response =  $scope.tickets.length > 0 ? $scope.tickets[$scope.tickets.length - 1].last_response : null;
                AdminSupport.getSupportTickets(last_response, function (tickets) {
                    $scope.tickets = $scope.tickets.concat(tickets.data.tickets);
                    $scope.remaining = tickets.data.remaining;
                }, function (status, message) {
                    Alert.error(message);
                });
            };
            $scope.loadTickets();


            $scope.closeTicket = function (ticket) {
                AdminSupport.closeSupportTicket(ticket._id, function () {
                    ticket.status = "Closed";
                    for (var x in $scope.tickets){
                        if ($scope.tickets[x]._id == ticket._id){
                            console.log(x, ticket._id, $scope.tickets[x]._id)
                            $scope.tickets.splice(x, 1);
                        }
                    }
                }, function (status, message) {
                    Alert.error(message);
                });
            }

        }]);
});

