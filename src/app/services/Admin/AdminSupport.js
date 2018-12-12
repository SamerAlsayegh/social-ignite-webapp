define(['../module'], services => {
    services.factory('AdminSupport', ['Request',
        Request => ({
            getSupportTickets(last_response, cbSuccess, cbFail) {
                let params = "";
                if (last_response) params = Request.ArrayToURL({last_response});
                return Request.get('admin/support/tickets' + params,
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            getSupportTicket(ticketId, cbSuccess, cbFail) {
                if (ticketId == null) {
                    return cbFail(400, "Missing ticketId");
                }

                return Request.get('admin/support/tickets/' + ticketId,
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            postSupportTicketReply(ticketId, content, cbSuccess, cbFail) {
                if (ticketId == null || content == null) {
                    return cbFail(400, "Missing required parameters");
                }

                return Request.post('admin/support/tickets/' + ticketId, {content},
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            closeSupportTicket(ticketId, cbSuccess, cbFail) {
                if (ticketId == null) {
                    return cbFail(400, "Missing required parameters");
                }

                return Request.post('admin/support/tickets/' + ticketId + '/close', {},
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            getSupportTicketReplies(ticketId, cursor, cbSuccess, cbFail) {
                if (ticketId == null) {
                    return cbFail(400, "Missing ticketId");
                }

                return Request.get('admin/support/tickets/' + ticketId + '/responses?cursor=' + cursor,
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            }
        })]);
});
