define(['../../module', '../../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('adminSupportSubController', ['$scope', '$stateParams', 'Alert', 'SocialPosts', 'Statistics', '$state', 'AdminSupport',
        function ($scope, $stateParams, Alert, SocialPosts, Statistics, $state, AdminSupport) {
            $scope.ticketId = $stateParams.ticketId;
            setTimeout(function () {
                $scope.scroller = document.getElementById("ticketResponses");
                console.log($scope.scroller);
            }, 0);

            if ($scope.ticketId != null) {

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

                $scope.sendReply = function (ticketReply) {
                    if (ticketReply.$valid) {
                        AdminSupport.postSupportTicketReply($scope.ticketId, $scope.reply, function (data) {
                            $scope.ticket.responses.responses.push(data);
                            $scope.ticket.status = 'Active';
                            setTimeout(function () {
                                $scope.scroller.scrollTop = $scope.scroller.scrollHeight;
                            }, 0);

                            $scope.reply = "";
                        }, function (status, message) {
                            Alert.error(message);
                        })
                    }
                };

                $scope.closeTicket = function () {
                    AdminSupport.closeSupportTicket($scope.ticketId, function (data) {
                        $scope.ticket.status = "Closed";
                        Alert.success("Marked ticket as closed.");
                        $state.go('admin.support.home', {}, {reload: true})
                    }, function (status, message) {
                        Alert.error(message);
                    })
                };
            }




        }]);
});

