define(['./module'], function (services) {
    'use strict';
    services.factory('PublicStatistics', ['Request',
        function (Request) {

            return {
                getPageSearchQuery: function (pageId, filter, cbSuccess, cbFail) {
                    if (pageId == null) {
                        return cbFail(400, "Missing pageId");
                    }

                    return Request.get('portal/statistic/page/' + pageId ,
                        function (message) {
                            return cbSuccess(message.data);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
            };
        }]);
});
