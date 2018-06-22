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
                        });
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
                cancelSubscription: function (cbSuccess, cbFail) {
                    return Request.post('payment/subscription/cancel', {},
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
            };
        }]);
});
