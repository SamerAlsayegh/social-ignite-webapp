define(['../module'], services => {
    services.factory('AdminAccount', ['Request',
        Request => ({
            getAccounts(query, page, cbSuccess, cbFail) {
                let filter = {
                    page
                };
                if (query) filter.query = query;


                return Request.get('admin/accounts' + Request.ArrayToURL(filter),
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            getAccount(accountId, cbSuccess, cbFail) {
                if (accountId == null) {
                    return cbFail(400, "Missing accountId");
                }

                return Request.get('admin/accounts/' + accountId,
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            updateAccount(accountId, details, cbSuccess, cbFail) {
                if (accountId == null) {
                    return cbFail(400, "Missing accountId");
                }

                return Request.post('admin/accounts/' + accountId, details,
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            updateRole(accountId, role, expiry, cbSuccess, cbFail) {
                if (accountId == null) {
                    return cbFail(400, "Missing accountId");
                }

                return Request.post('admin/accounts/' + accountId + '/role', {
                    expiry,
                    role
                }, message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            deleteAccount(accountId, cbSuccess, cbFail) {
                if (accountId == null) {
                    return cbFail(400, "Missing accountId");
                }

                return Request.post('admin/accounts/' + accountId + '/delete', {}
                    , message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            getTransactions(accountId, sortOrder, page, limit, cbSuccess, cbFail) {
                if (accountId == null) {
                    return cbFail(400, "Missing accountId");
                }

                return Request.get('admin/accounts/' + accountId + '/transactions', {
                        sort: sortOrder,
                        page,
                        limit
                    }
                    , message => cbSuccess(message), (status, message) => cbFail(status, message));
            }
        })]);
});
