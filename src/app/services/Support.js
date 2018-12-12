define(['./module'], services => {
    services.factory('Support', ['Request',
        Request => ({
            getSupportTickets(_cursor, cbSuccess, cbFail) {
                return Request.get('support/tickets',
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            getSupportTicket(ticketId, cbSuccess, cbFail) {
                if (ticketId == null) {
                    return cbFail(400, "Missing ticketId");
                }

                return Request.get('support/tickets/' + ticketId,
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            postNewSupportTicket(title, content, cbSuccess, cbFail) {
                if (title == null || content == null) {
                    return cbFail(400, "Missing required parameters");
                }

                return Request.post('support/tickets', {title, content},
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            postSupportTicketReply(ticketId, content, cbSuccess, cbFail) {
                if (ticketId == null || content == null) {
                    return cbFail(400, "Missing required parameters");
                }

                return Request.post('support/tickets/' + ticketId, {content},
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            getSupportTicketReplies(ticketId, cursor, cbSuccess, cbFail) {
                if (ticketId == null) {
                    return cbFail(400, "Missing ticketId");
                }

                return Request.get('support/tickets/' + ticketId + '/responses?cursor=' + cursor,
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            closeSupportTicket(ticketId, cbSuccess, cbFail) {
                if (ticketId == null) {
                    return cbFail(400, "Missing required parameters");
                }

                return Request.post('support/tickets/' + ticketId + '/close', {},
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            }
        })]);
});
