define(['../module'], function (services) {
    'use strict';
    services.factory('AdminAccount', ['Request', '$cookies', '$state', '$rootScope',
        function (Request, $cookies, $state, $rootScope) {

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
            };
        }]);
});
