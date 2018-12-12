define(['./module'], services => {
    services.factory('PublicStatistics', ['Request',
        Request => ({
            getPageSearchQuery(pageId, filter, cbSuccess, cbFail) {
                if (pageId == null) {
                    return cbFail(400, "Missing pageId");
                }

                return Request.get('portal/statistic/page/' + pageId,
                    message => cbSuccess(message.data), (status, message) => cbFail(status, message));
            }
        })]);
});
