define(['./module'], services => {
    services.factory('Billing', ['Request',
        Request => ({
            subscribePlan(plan, service, cbSuccess, cbFail) {
                return Request.post('payment/subscription/' + plan + '/' + service, {},
                    message => cbSuccess(message), (status, message) => cbFail(status, message), 20000);
            },

            redeemCode(code, cbSuccess, cbFail) {
                return Request.post('payment/redeem', {code: code},
                    message => cbSuccess(message), (status, message) => cbFail(status, message), 20000);
            },

            getSubscription(cbSuccess, cbFail) {
                return Request.get('payment/subscription',
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            getPlans(includeFree, cbSuccess, cbFail) {
                return Request.get('payment/plans', {free: includeFree},
                    message => cbSuccess(message.data), (status, message) => cbFail(status, message));
            },

            getPlan(plan, cbSuccess, cbFail) {
                return Request.get('payment/plans/' + plan,
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            cancelSubscription(cbSuccess, cbFail) {
                return Request.post('payment/subscription/cancel', {},
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            getTransactions(sortOrder, page, limit, cbSuccess, cbFail) {
                return Request.get('payment/transactions', {sort: sortOrder, page, limit},
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            }
        })]);
});
