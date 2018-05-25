define(['../module'], function (services) {
    'use strict';
    services.factory('AdminSupport', ['Request', '$cookies', '$state', '$rootScope',
        function (Request, $cookies, $state, $rootScope) {

            return {
                getSupportTickets: function (_cursor, cbSuccess, cbFail) {
                    return Request.get('admin/support/tickets',
                         function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getSupportTicket: function (ticketId, cbSuccess, cbFail) {
                    if (ticketId == null) {
                        return cbFail(400, "Missing ticketId");
                    }

                    return Request.get('admin/support/tickets/' + ticketId,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                postSupportTicketReply: function (ticketId, content, cbSuccess, cbFail) {
                    if (ticketId == null || content == null) {
                        return cbFail(400, "Missing required parameters");
                    }

                    return Request.post('admin/support/tickets/' + ticketId, {content: content},
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                closeSupportTicket: function (ticketId, cbSuccess, cbFail) {
                    if (ticketId == null) {
                        return cbFail(400, "Missing required parameters");
                    }

                    return Request.post('admin/support/tickets/' + ticketId + '/close', {},
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getSupportTicketReplies: function (ticketId, cursor, cbSuccess, cbFail) {
                    if (ticketId == null) {
                        return cbFail(400, "Missing ticketId");
                    }

                    return Request.get('admin/support/tickets/' + ticketId + '/responses?cursor=' + cursor,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
            };
        }]);
});
