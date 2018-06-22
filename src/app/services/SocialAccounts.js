define(['./module'], function (services) {
    'use strict';
    services.factory('SocialAccounts', ['Request', '$cookies', '$state', '$rootScope',
        function (Request, $cookies, $state, $rootScope) {
            var cacheTime = 1000 * 60 * 5;
            var dataCache = {};// Only fetch data if older than 5 minutes - prevents


            return {
                addSpecialSocialAccount: function (parameters, cbSuccess, cbFail) {
                    if (!parameters)
                        return cbFail(400, "Invalid parameters.");
                    return Request.post('portal/social_pages/special',
                        parameters, function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                updateSocialAccount: function (parameters, cbSuccess, cbFail) {
                    if (!parameters || !parameters.hasOwnProperty('pages') || !parameters.hasOwnProperty("cache_id"))
                        return cbFail(400, "Invalid parameters.");

                    return Request.post('portal/social_pages/' + parameters.cache_id + '/main_account',
                        parameters, function (message, data) {
                            delete dataCache['getSocialAccounts'];
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
                            delete dataCache['getSocialAccounts'];
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
                getSocialAccounts: function (_cursor, _platform, cbSuccess, cbFail) {
                    var funcName = "getSocialAccounts" + _cursor + _platform;

                    if (dataCache.hasOwnProperty(funcName) && dataCache[funcName].time > (new Date().getTime() - (cacheTime)))
                        return cbSuccess(dataCache[funcName].data);

                    return Request.get('portal/social_pages', {
                        platform: _platform,
                        cursor: _cursor
                        },
                        function (message) {
                            dataCache[funcName] = {
                                data: message.data,
                                time: new Date().getTime()
                            };
                            return cbSuccess(message.data);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                }
            };
        }]);
});
