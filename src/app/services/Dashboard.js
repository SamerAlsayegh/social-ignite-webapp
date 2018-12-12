define(['./module'], services => {
    services.factory('Dashboard', ['Request',
        Request => ({
            getDashboardPosts(paging, cbSuccess, cbFail) {
                if (paging && parseInt(paging) == null)
                    return cbFail(400, 'Failed to fetch dashboard information.');

                return Request.get('portal/dashboard',
                    message => cbSuccess(message.data), (status, message) => cbFail(status, message));
            },

            getPagesWithStandAlones(paging, cbSuccess, cbFail) {
                if ((paging && parseInt(paging) == null))
                    return cbFail(400, 'Failed to fetch standalone mentions.');
                return Request.get('portal/standalone/recent',
                    message => cbSuccess(message.data), (status, message) => cbFail(status, message));
            },

            getStandalones(social_page, paging, cbSuccess, cbFail) {
                if ((paging && parseInt(paging) == null) || social_page == null)
                    return cbFail(400, 'Failed to fetch standalone mentions.');

                return Request.get('portal/standalone', {social_page},
                    message => cbSuccess(message.data), (status, message) => cbFail(status, message));
            }
        })]);
});
