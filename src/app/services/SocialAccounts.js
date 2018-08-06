define(['./module'], function (services) {
    'use strict';
    services.factory('SocialAccounts', ['Request',
        function (Request) {
            return {
                updateSocialAccount: function (parameters, cbSuccess, cbFail) {
                    if (!parameters || !parameters.hasOwnProperty('pages') || !parameters.hasOwnProperty("cache_id"))
                        return cbFail(400, "Invalid parameters.");

                    return Request.post('portal/social_pages/' + parameters.cache_id + '/main_account',
                        parameters, function (message, data) {
                            return cbSuccess(data.pages);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                refreshSocialAccount: function (page_id, type, cbSuccess, cbFail) {
                    if (!page_id || !type)
                        return cbFail(400, "Invalid parameters.");
                    return Request.post('portal/social_pages/' + page_id + '/' + type + '/refresh', {}, function (message) {
                        return cbSuccess(message);
                    }, function (status, message) {
                        return cbFail(status, message);
                    });
                },
                removeSocialAccount: function (page_id, cbSuccess, cbFail) {
                    if (!page_id)
                        return cbFail(400, "Invalid parameters.");
                    return Request.post('portal/social_pages/' + page_id + '/delete', {}, function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getPagesOnHold: function (parameters, cbSuccess, cbFail) {
                    if (!parameters || !parameters.hasOwnProperty('cacheId'))
                        return cbFail(400, "Invalid parameters.");

                    return Request.get('portal/social_pages/on_hold/' + parameters.cacheId,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            // $state.go('portal.accounts.home', {}, {reload: 'portal.accounts.home'})//If the session is invalid, take to login page.
                            return cbFail(status, message);
                        });
                },
                getSocialAccount: function (socialAccountId, cbSuccess, cbFail) {
                    return Request.get('portal/social_pages/' + socialAccountId,
                        function (message) {
                            return cbSuccess(message.data);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getSocialAccounts: function (_cursor, filteredPlatforms, cbSuccess, cbFail) {
                    return Request.get('portal/social_pages', {
                        platforms: filteredPlatforms,
                        cursor: _cursor
                        },
                        function (message) {
                            return cbSuccess(message.data);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                }
            };
        }]);
});
