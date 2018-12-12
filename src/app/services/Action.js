define(['./module'], services => {
    services.factory('Action', ['Request',
        Request => ({
            toggleLikeComment(parameters, cbSuccess, cbFail) {
                console.log(parameters);
                return Request.post('portal/actions/like',
                    parameters,
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            postComment(parameters, cbSuccess, cbFail) {
                return Request.post('portal/actions/reply',
                    parameters,
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            deleteComment(parameters, cbSuccess, cbFail) {
                return Request.post('portal/actions/delete_comment',
                    parameters,
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            fetchHashtags(content, forceRefresh, scheduleId, cbSuccess, cbFail) {
                return Request.post('portal/actions/twitter_recommendation', {
                        content,
                        force_refresh: forceRefresh,
                        schedule_id: scheduleId
                    },
                    (message, raw) => cbSuccess(message, raw.used), (status, message) => cbFail(status, message));
            },

            getAllowedActions(cbSuccess, cbFail) {
                return Request.get('portal/actions/allowed', {},
                    message => cbSuccess(message.data), (status, message) => cbFail(status, message));
            }
        })]);
});
