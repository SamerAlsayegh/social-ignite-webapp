define(['../module'], function (services) {
    'use strict';
    services.factory('AdminAccount', ['Request',
        function (Request) {

            return {
                getAccounts: function (query, page, cbSuccess, cbFail) {
                    let filter = {
                        page: page
                    };
                    if (query) filter.query = query;



                    return Request.get('admin/accounts' + Request.ArrayToURL(filter),
                         function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getAccount: function (accountId, cbSuccess, cbFail) {
                    if (accountId == null) {
                        return cbFail(400, "Missing accountId");
                    }

                    return Request.get('admin/accounts/' + accountId,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                updateAccount: function (accountId, details, cbSuccess, cbFail) {
                    if (accountId == null) {
                        return cbFail(400, "Missing accountId");
                    }

                    return Request.post('admin/accounts/' + accountId, details,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                updateRole: function (accountId, role, expiry, cbSuccess, cbFail) {
                    if (accountId == null) {
                        return cbFail(400, "Missing accountId");
                    }

                    return Request.post('admin/accounts/' + accountId + '/role', {
                      expiry: expiry,
                      role: role
                    }, function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                deleteAccount: function (accountId, cbSuccess, cbFail) {
                    if (accountId == null) {
                        return cbFail(400, "Missing accountId");
                    }

                    return Request.post('admin/accounts/' + accountId + '/delete', {}
                    , function (message) {
                        return cbSuccess(message);
                    }, function (status, message) {
                        return cbFail(status, message);
                    });
                },
                getTransactions: function (accountId, sortOrder, page, limit, cbSuccess, cbFail) {
                    if (accountId == null) {
                        return cbFail(400, "Missing accountId");
                    }

                    return Request.get('admin/accounts/' + accountId + '/transactions', {sort: sortOrder, page: page, limit: limit}
                        , function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
            };
        }]);
});
