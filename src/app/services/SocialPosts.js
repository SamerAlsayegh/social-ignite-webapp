define(['./module'], function (services) {
    'use strict';
    services.factory('SocialPosts', ['Request',
        function (Request) {

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
                    return Request.get('portal/schedule/posted',
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getSchedulePosts: function (cbSuccess, cbFail) {
                    return Request.get('portal/schedule/scheduled',
                        function (message) {
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
                    return Request.get('portal/schedule' + Request.ArrayToURL(parameters),
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                getSelectivePosts: function (type, parameters, cbSuccess, cbFail) {
                    return Request.get('portal/schedule/' + type, parameters,
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });

                },
                ///api/v1/portal/actions/delete_post/
                deletePostedSocialPost: function(postId, cbSuccess, cbFail) {
                    if (!postId)
                        return;

                    return Request.post('portal/actions/delete_post/' + postId, {},
                        function (message) {
                            return cbSuccess(message);
                        }, function (status, message) {
                            return cbFail(status, message);
                        });
                },
                deletePostedSocialPostMain: function(postMainId, cbSuccess, cbFail) {
                    if (!postMainId)
                        return;

                    return Request.post('portal/actions/delete_main_post/' + postMainId, {},
                        function (message) {
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
