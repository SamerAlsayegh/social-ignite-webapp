define(['../../module', '../../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('adminSupportSubController', ['$scope', '$stateParams', 'Alert', 'SocialPosts', 'Statistics', '$state', 'AdminSupport',
        function ($scope, $stateParams, Alert, SocialPosts, Statistics, $state, AdminSupport) {
            $scope.ticketId = $stateParams.ticketId;
            $scope.scroller = document.getElementById("ticketResponses");

            if ($scope.ticketId != null) {
                $scope.reply = {};

                AdminSupport.getSupportTicket($stateParams.ticketId, function (data) {
                    $scope.ticket = data.data;
                    setTimeout(function () {
                        $scope.scroller.scrollTop = $scope.scroller.scrollHeight;
                    }, 0)
                }, function (status, message) {
                    Alert.error(message);
                });

                $scope.socket.on('ticket_reply', function (ticket_reply) {
                    console.log(ticket_reply, $stateParams.ticketId, $scope.ticket);
                    if (ticket_reply.ticket == $stateParams.ticketId && $scope.ticket){
                        $scope.ticket.responses.responses.push(ticket_reply.response);
                        $scope.ticket.status = 'Active';
                        setTimeout(function () {
                            $scope.scroller.scrollTop = $scope.scroller.scrollHeight;
                        }, 0)
                    }
                });

                $scope.sendReply = function (content) {
                    console.log($scope.ticket);
                    AdminSupport.postSupportTicketReply($scope.ticketId, content, function (data) {
                        console.log(data);
                        $scope.ticket.responses.responses.push(data);
                        $scope.ticket.status = 'Replied';
                        $scope.reply = {};

                        setTimeout(function () {
                            $scope.scroller.scrollTop = $scope.scroller.scrollHeight;
                        }, 0)
                    }, function (status, message) {
                        Alert.error(message);
                    })
                };

                $scope.closeTicket = function () {
                    AdminSupport.closeSupportTicket($scope.ticketId, function (data) {
                        $scope.ticket.status = "Closed";
                    }, function (status, message) {
                        Alert.error(message);
                    })
                };
            }




        }]);
});

