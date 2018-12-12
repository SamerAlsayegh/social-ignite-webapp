define(['./module'], services => {
    services.factory('SocialAccounts', ['Request',
        Request => ({
            updateSocialAccount(parameters, cbSuccess, cbFail) {
                if (!parameters || !parameters.hasOwnProperty('pages') || !parameters.hasOwnProperty("cache_id"))
                    return cbFail(400, "Invalid parameters.");

                return Request.post('portal/social_pages/' + parameters.cache_id + '/main_account',
                    parameters, (message, data) => cbSuccess(data.pages), (status, message) => cbFail(status, message));
            },

            refreshSocialAccount(page_id, type, cbSuccess, cbFail) {
                if (!page_id || !type)
                    return cbFail(400, "Invalid parameters.");
                return Request.post('portal/social_pages/' + page_id + '/' + type + '/refresh', {}, message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            removeSocialAccount(page_id, cbSuccess, cbFail) {
                if (!page_id)
                    return cbFail(400, "Invalid parameters.");
                return Request.post('portal/social_pages/' + page_id + '/delete', {}, message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            getPagesOnHold(parameters, cbSuccess, cbFail) {
                if (!parameters || !parameters.hasOwnProperty('cacheId'))
                    return cbFail(400, "Invalid parameters.");

                return Request.get('portal/social_pages/on_hold/' + parameters.cacheId,
                    message => cbSuccess(message), (status, message) => // $state.go('portal.accounts.home', {}, {reload: 'portal.accounts.home'})//If the session is invalid, take to login page.
                cbFail(status, message));
            },

            getSocialAccount(socialAccountId, cbSuccess, cbFail) {
                return Request.get('portal/social_pages/' + socialAccountId,
                    message => cbSuccess(message.data), (status, message) => cbFail(status, message));
            },

            getSocialAccounts(_cursor, filteredPlatforms, cbSuccess, cbFail) {
                return Request.get('portal/social_pages', {
                        platforms: filteredPlatforms,
                        cursor: _cursor,
                    },
                    message => cbSuccess(message.data), (status, message) => cbFail(status, message));
            },

            getSuggestedPostTime(socialPages, timezoneOffset, cbSuccess, cbFail) {
                return Request.get('portal/page_analysis/post_time', {
                        pages: socialPages,
                        timezone: timezoneOffset,
                    },
                    message => cbSuccess(message.data), (status, message) => cbFail(status, message));
            }
        })]);
});
