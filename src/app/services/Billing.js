define(['./module'], function (services) {
    'use strict';
    services.factory('Billing', ['Request',
        function (Request) {

            return {
                subscribePlan: function (plan, service, cbSuccess, cbFail) {
                    return Request.post('payment/subscription/' + plan + '/' + service, {},
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        }, 20000);
                },
                getSubscription: function (cbSuccess, cbFail) {
                    return Request.get('payment/subscription',
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getPlans: function (cbSuccess, cbFail) {
                    return Request.get('payment/plans',
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getPlan: function (plan, cbSuccess, cbFail) {
                    return Request.get('payment/plans/' + plan,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                cancelSubscription: function (cbSuccess, cbFail) {
                    return Request.post('payment/subscription/cancel', {},
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getTransactions: function (sortOrder, page, limit, cbSuccess, cbFail) {
                    return Request.get('payment/transactions', {sort: sortOrder, page: page, limit: limit},
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
            };
        }]);
});
