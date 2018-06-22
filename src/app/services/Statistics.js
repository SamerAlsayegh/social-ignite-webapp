define(['./module'], function (services) {
    'use strict';
    services.factory('Statistics', ['Request',
        function (Request) {

            return {
                getPostStatistics: function (postId, filter, cbSuccess, cbFail) {
                    if (postId == null) {
                        return cbFail(400, "Missing postId");
                    }
                    filter = filter || {};

                    return Request.get('portal/statistic/post/' + postId + '?type=graph&filter=' + JSON.stringify(filter),
                         function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getPageStatistics: function (pageId, filter, cbSuccess, cbFail) {
                    if (pageId == null) {
                        return cbFail(400, "Missing pageId");
                    }
                    filter = filter || {};

                    return Request.get('portal/statistic/page/' + pageId + '?filter=' + JSON.stringify(filter),
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
            };
        }]);
});
