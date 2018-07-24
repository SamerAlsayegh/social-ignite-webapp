define(['./module'], function (services) {
    'use strict';
    services.factory('Dashboard', ['Request',
        function (Request) {
            return {
                getDashboardPosts: function (paging, cbSuccess, cbFail) {
                    if (paging && parseInt(paging) == null)
                        return cbFail(400, 'Failed to fetch dashboard information.');

                    return Request.get('portal/dashboard',
                         function (message) {
                            return cbSuccess(message.data);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getPagesWithStandAlones: function (paging, cbSuccess, cbFail) {
                    if ((paging && parseInt(paging) == null))
                        return cbFail(400, 'Failed to fetch standalone mentions.');
                    return Request.get('portal/standalone/recent',
                        function (message) {
                            return cbSuccess(message.data);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getStandalones: function (social_page, paging, cbSuccess, cbFail) {
                    if ((paging && parseInt(paging) == null) || social_page == null)
                        return cbFail(400, 'Failed to fetch standalone mentions.');

                    return Request.get('portal/standalone', {social_page: social_page},
                        function (message) {
                            return cbSuccess(message.data);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
            };
        }]);
});
