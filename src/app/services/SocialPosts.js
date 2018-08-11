define(['./module'], function (services) {
    'use strict';
    services.factory('SocialPosts', ['Request',
        function (Request) {
            var cacheTime = 1000 * 60 * 5;
            var dataCache = {};// Only fetch data if older than 5 minutes - prevents

            return {
                getSocialPosts: function (mainSocialPost, pagination, cbSuccess, cbFail) {
                    if (!mainSocialPost || parseInt(mainSocialPost) == null)
                        return cbFail(400, "Invalid parameters.");

                    return Request.get('portal/social_posts/' + mainSocialPost, {pagination: pagination},
                         function (message) {
                            return cbSuccess(message.data);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getSocialPost: function (social_post_main, social_post, cbSuccess, cbFail) {
                    if (social_post_main == null || social_post == null)
                        return cbFail(400, "Invalid parameters.");

                    return Request.get('portal/social_posts/' + social_post_main + "/" + social_post,
                        function (message) {
                            return cbSuccess(message.data);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getDetails: function (postId, cbSuccess, cbFail) {
                    if (!postId || parseInt(postId) == null)
                        return cbFail(400, message);

                    return Request.get('portal/schedule/post/' + postId,
                        function (message) {
                            return cbSuccess(message.data);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getPostedPosts: function (cbSuccess, cbFail) {
                    var funcName = "getPostedPosts";

                    if (dataCache.hasOwnProperty(funcName) && dataCache[funcName].time > (new Date().getTime() - (cacheTime)))
                        return cbSuccess(dataCache[funcName].data);


                    return Request.get('portal/schedule/posted',
                        function (message) {
                            dataCache[funcName] = {
                                data: message,
                                time: new Date().getTime()
                            };
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getSchedulePosts: function (cbSuccess, cbFail) {
                    var funcName = "getSchedulePosts";

                    if (dataCache.hasOwnProperty(funcName) && dataCache[funcName].time > (new Date().getTime() - (cacheTime)))
                        return cbSuccess(dataCache[funcName].data);

                    return Request.get('portal/schedule/scheduled',
                        function (message) {
                            dataCache[funcName] = {
                                data: message,
                                time: new Date().getTime()
                            };
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getAllPosts: function (parameters, cbSuccess, cbFail) {
                    var funcName = "getAllPosts"+(parameters != null && parameters.hasOwnProperty("start") ? parameters.start : null);
                    if (cbFail == null && cbSuccess != null) {
                        cbFail = cbSuccess;
                        cbSuccess = parameters;
                        parameters = null;
                    }
                    if (dataCache.hasOwnProperty(funcName) && dataCache[funcName].time > (new Date().getTime() - (cacheTime)))
                        return cbSuccess(dataCache[funcName].data);
                    return Request.get('portal/schedule' + Request.ArrayToURL(parameters),
                        function (message) {
                            dataCache[funcName] = {
                                data: message,
                                time: new Date().getTime()
                            };
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getSelectivePosts: function (type, parameters, cbSuccess, cbFail) {
                    var funcName = "get" + type + "Posts"+JSON.stringify(parameters);
                    console.log(funcName);

                    if (dataCache.hasOwnProperty(funcName) && dataCache[funcName].time > (new Date().getTime() - (cacheTime)))
                        return cbSuccess(dataCache[funcName].data);

                    return Request.get('portal/schedule/' + type, parameters,
                        function (message) {
                            dataCache[funcName] = {
                                data: message,
                                time: new Date().getTime()
                            };
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });

                },
                deletePost: function(postId, cbSuccess, cbFail) {
                    if (!postId)
                        return;

                    return Request.post('portal/schedule/' + postId + '/delete', {},
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                submitScheduledPost: function (parameters, cbSuccess, cbFail) {
                    if (!parameters)
                        return;

                    return Request.formPost('portal/schedule/', parameters,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                draftScheduledPost: function (parameters, cbSuccess, cbFail) {
                    if (!parameters)
                        return;

                    return Request.formPost('portal/schedule/draft', parameters,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
            };
        }]);
});
