define(['../../module', '../../../enums/platforms'], function (controllers, platforms) {
    'use strict';
    return controllers.controller('supportSubController', ['$scope', '$stateParams', 'Alert', 'SocialPosts', 'Statistics', '$state', 'Support',
        function ($scope, $stateParams, Alert, SocialPosts, Statistics, $state, Support) {
            var ticketId = $stateParams.ticketId;

            setTimeout(function () {
                $scope.scroller = document.getElementById("ticketResponses");
            }, 0);


            if ($state.current.name == "portal.support.ticket.new") {
                // New ticket
                $scope.newTicket = function (title, content) {
                    Support.postNewSupportTicket(title, content, function (data) {
                        Alert.success("Created new ticket")
                        $state.go('portal.support.ticket.view', {ticketId: data._id}, { reload: true });
                    }, function (status, message) {
                        Alert.error(message);
                    })
                };

            } else if (ticketId != null) {
                Support.getSupportTicket($stateParams.ticketId, function (data) {
                    $scope.ticket = data.data;
                    setTimeout(function () {
                        $scope.scroller.scrollTop = $scope.scroller.scrollHeight;
                    }, 0);
                }, function (status, message) {
                    Alert.error(message);
                });

                $scope.socket.on('ticket_reply', function (ticket_reply) {
                    if (ticket_reply.ticket == $stateParams.ticketId && $scope.ticket){
                        $scope.ticket.responses.responses.push(ticket_reply.response);
                        $scope.ticket.status = 'Replied';
                        setTimeout(function () {
                            $scope.scroller.scrollTop = $scope.scroller.scrollHeight;
                        }, 0);
                    }
                });



                $scope.sendReply = function (ticketReply) {
                    if (ticketReply.$valid) {
                        Support.postSupportTicketReply(ticketId, $scope.reply, function (data) {
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
            }






        }]);
});

