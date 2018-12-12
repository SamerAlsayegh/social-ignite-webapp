define(['./module'], services => {
    services.factory('SocialPosts', ['Request',
        Request => ({
            getSocialPosts(mainSocialPost, pagination, cbSuccess, cbFail) {
                if (!mainSocialPost || parseInt(mainSocialPost) == null)
                    return cbFail(400, "Invalid parameters.");

                return Request.get('portal/social_posts/' + mainSocialPost, {pagination},
                    message => cbSuccess(message.data), (status, message) => cbFail(status, message));
            },

            getSocialPost(social_post_main, social_post, cbSuccess, cbFail) {
                if (social_post_main == null || social_post == null)
                    return cbFail(400, "Invalid parameters.");

                return Request.get('portal/social_posts/' + social_post_main + "/" + social_post,
                    message => cbSuccess(message.data), (status, message) => cbFail(status, message));
            },

            getDetails(postId, cbSuccess, cbFail) {
                if (!postId || parseInt(postId) == null)
                    return cbFail(400, message);

                return Request.get('portal/schedule/post/' + postId,
                    message => cbSuccess(message.data), (status, message) => cbFail(status, message));
            },

            getPostedPosts(cbSuccess, cbFail) {
                return Request.get('portal/schedule/posted',
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            getSchedulePosts(cbSuccess, cbFail) {
                return Request.get('portal/schedule/scheduled',
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            getAllPosts(parameters, cbSuccess, cbFail) {
                if (cbFail == null && cbSuccess != null) {
                    cbFail = cbSuccess;
                    cbSuccess = parameters;
                    parameters = null;
                }
                return Request.get('portal/schedule' + Request.ArrayToURL(parameters),
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            getSelectivePosts(type, parameters, cbSuccess, cbFail) {
                return Request.get('portal/schedule/' + type, parameters,
                    message => cbSuccess(message), (status, message) => cbFail(status, message));

            },

            ///api/v1/portal/actions/delete_post/
            deletePostedSocialPost(postId, cbSuccess, cbFail) {
                if (!postId)
                    return;

                return Request.post('portal/actions/delete_post/' + postId, {},
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            deletePostedSocialPostMain(postMainId, cbSuccess, cbFail) {
                if (!postMainId)
                    return;

                return Request.post('portal/actions/delete_main_post/' + postMainId, {},
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            deletePost(postId, cbSuccess, cbFail) {
                if (!postId)
                    return;

                return Request.post('portal/schedule/' + postId + '/delete', {},
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            submitScheduledPost(parameters, cbSuccess, cbFail) {
                if (!parameters)
                    return;

                return Request.formPost('portal/schedule/', parameters,
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            },

            draftScheduledPost(parameters, cbSuccess, cbFail) {
                if (!parameters)
                    return;

                return Request.formPost('portal/schedule/draft', parameters,
                    message => cbSuccess(message), (status, message) => cbFail(status, message));
            }
        })]);
});
